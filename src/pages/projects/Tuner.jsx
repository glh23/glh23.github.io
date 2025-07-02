import React, { useState, useEffect, useRef } from "react";

const GuitarTuner = () => {
  const [note, setNote] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [isTuning, setIsTuning] = useState(false);
  const canvasRef = useRef(null);
  // Stores requestAnimationFrame ID
  const animationId = useRef(null); 

  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  useEffect(() => {
    let audioContext,
      dataArray,
      analyser,
      source,
      bufferLength,
      stream;

    const startTuning = async () => {
      setIsTuning(true);
      // Chuck out the audio context and stream
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Float32Array(bufferLength);

      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      processAudio();
    };

    // Function to stop tuning and clean up resources
    const stopTuning = () => {
      setIsTuning(false);
      if (audioContext) audioContext.close();
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
      }
    };

    let lastDrawTime = 0;

    const processAudio = () => {
      if (!isTuning) return;

      const now = performance.now();
      // Throttle the drawing to around 30 FPS
      if (now - lastDrawTime < 33) {
        animationId.current = requestAnimationFrame(processAudio);
        return;
      }
      lastDrawTime = now;

      analyser.getFloatTimeDomainData(dataArray);
      const freq = autoCorrelate(dataArray, audioContext.sampleRate);

      // If a frequency is detected, update the note and frequency state
      if (freq) {
        const detectedNote = getClosestNote(freq);
        setFrequency(freq.toFixed(2));
        setNote(detectedNote);
        frequencyGraph(dataArray);
        tuningPin(freq);
      }

      animationId.current = requestAnimationFrame(processAudio);
    };

    const frequencyGraph = (dataArray) => {
      const canvas = canvasRef.current;
      // Prevent error if canvas is null
      if (!canvas) return; 
      const ctx = canvas.getContext("2d");
      // extra safety
      if (!ctx) return; 

      // Draws to the dimensions of the device
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const barWidth = width / bufferLength;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#50c681";
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] + 1) * (height / 2);
        ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
      }
    };

    const tuningPin = (freq) => {
      const canvas = canvasRef.current;
      //Prevent error if canvas is null
      if (!canvas) return; 
      const ctx = canvas.getContext("2d");
      if (!ctx) return; 

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const rectHeight = 30;
      const y = height - rectHeight;

      ctx.clearRect(0, y, width, rectHeight);

      if (!freq || !note) return;

      const targetFreq = getTargetFrequency(note);
      const diff = freq - targetFreq;

      let leftColor = "transparent";
      let middleColor = "transparent";
      let rightColor = "transparent";

      // Set colors based on the difference between detected frequency and target frequency
      if (Math.abs(diff) < 3) {
        middleColor = "#50c681";
      } else if (diff < -10) {
        leftColor = Math.abs(diff) < 15 ? "#c6bc50" : "#c65095";
      } else if (diff > 10) {
        rightColor = Math.abs(diff) < 15 ? "#c6bc50" : "#c65095";
      }

      ctx.fillStyle = leftColor;
      ctx.fillRect(0, y, width / 3, rectHeight);

      ctx.fillStyle = middleColor;
      ctx.fillRect(width / 3, y, width / 3, rectHeight);

      ctx.fillStyle = rightColor;
      ctx.fillRect((width / 3) * 2, y, width / 3, rectHeight);
    };

    // Function to calculate the target frequency for a given note
    const getTargetFrequency = (note) => {
      const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const baseFreq = 16.35;
      const noteIndex = notes.indexOf(note.slice(0, -1));
      const octave = parseInt(note.slice(-1));
      return baseFreq * Math.pow(2, (noteIndex + octave * 12) / 12);
    };

    if (isTuning) startTuning();
    else stopTuning();

    return () => {
      stopTuning();
    };
  }, [isTuning, note]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize the canvas to match the device pixel ratio
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Function to auto-correlate the audio buffer and find the frequency
  const autoCorrelate = (buffer, sampleRate) => {
    let size = buffer.length;
    let bestOffset = -1;
    let bestCorr = 0;
    let rootMeanSquare = 0;
    let foundCorr = false;
    let lastCorr = 1;

    // Calculate the root mean square of the buffer
    for (let i = 0; i < size; i++) {
      let x = buffer[i];
      rootMeanSquare += x * x;
    }
    rootMeanSquare = Math.sqrt(rootMeanSquare / size);
    if (rootMeanSquare < 0.01) return null;

    // Loop through possible offsets to find the best correlation
    for (let offset = 0; offset < size / 2; offset++) {
      let correlation = 0;
      for (let i = 0; i < size / 2; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - correlation / (size / 2);

      // If the correlation is high enough, update the best offset and correlation
      if (correlation > 0.97 && correlation > lastCorr) {
        foundCorr = true;
        if (correlation > bestCorr) {
          bestCorr = correlation;
          bestOffset = offset;
        }
      } else if (foundCorr) {
        let frequency = sampleRate / bestOffset;
        return frequency;
      }
      lastCorr = correlation;
    }
    return null;
  };

  // Function to get the closest musical note for a given frequency
  const getClosestNote = (freq) => {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const baseFreq = 16.35;
    const noteFreq = Array.from({ length: 96 }, (_, i) =>
      baseFreq * Math.pow(2, i / 12)
    );

    // Find the closest note frequency
    const closestNote = noteFreq.reduce(
      (prev, curr, index) =>
        Math.abs(curr - freq) < Math.abs(noteFreq[prev] - freq) ? index : prev,
      0
    );

    // Get the note name and octave from the closest note index
    const noteName = notes[closestNote % 12];
    const octave = Math.floor(closestNote / 12);
    return `${noteName}${octave}`;
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1>Guitar Tuner</h1>
      <button
        onClick={() => setIsTuning(!isTuning)}
        style={{
          backgroundColor: isTuning ? "#50c681" : "#304463",
          padding: "10px 20px",
          fontSize: "18px",
          margin: "10px",
          border: "none",
          cursor: "pointer",
          color: "white",
          borderRadius: "4px",
        }}
      >
        {isTuning ? "Stop Tuning" : "Start Tuning"}
      </button>
      <h2>Detected Note: {note || "Waiting..."}</h2>
      <p>Frequency: {frequency ? `${frequency} Hz` : "Waiting..."}</p>
      <canvas
        ref={canvasRef}
        style={{
          width: "90%",
          maxWidth: "600px",
          height: "200px",
          border: "1px solid #DB2F62",
          backgroundColor: "black",
          borderRadius: "6px",
          marginTop: "20px",
        }}
      />
    </div>
  );
};

export default GuitarTuner;
