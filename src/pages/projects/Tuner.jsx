import React, { useState, useEffect, useRef } from "react";

// Generate chromatic notes and their frequencies
const generateNoteFrequencies = () => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const frequencies = {};
  for (let octave = 1; octave <= 6; octave++) {
    for (let i = 0; i < notes.length; i++) {
      const noteName = notes[i] + octave;
      const midi = 12 * (octave + 1) + i;
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      frequencies[noteName] = freq;
    }
  }
  return frequencies;
};

const noteFrequencies = generateNoteFrequencies();

const getClosestNote = (freq) => {
  let closest = null;
  let minDiff = Infinity;
  for (let note in noteFrequencies) {
    const diff = Math.abs(noteFrequencies[note] - freq);
    if (diff < minDiff) {
      minDiff = diff;
      closest = note;
    }
  }
  return closest;
};

const getTargetFrequency = (note) => noteFrequencies[note] ?? 0;

const autoCorrelate = (buf, sampleRate) => {
  // Check if the buffer is empty or too small
  const SIZE = buf.length;
  let rms = 0;

  // Calculate the root mean square (RMS) of the buffer
  for (let i = 0; i < SIZE; i++) {
    rms += buf[i] * buf[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null;

  // Normalize the buffer
  let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
  // Find the start and end of the signal
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  // Find the end of the signal
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  // If the signal is too short, return null
  buf = buf.slice(r1, r2);
  const newSize = buf.length;

  // If the buffer is too small, return null
  let c = new Array(newSize).fill(0);
  for (let i = 0; i < newSize; i++) {
    for (let j = 0; j < newSize - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }


  // Find the first peak in the autocorrelation
  let d = 0;
  while (c[d] > c[d + 1]) d++;

  // If no peak found, return null
  let maxval = -1, maxpos = -1;
  for (let i = d; i < newSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  return maxpos > 0 ? sampleRate / maxpos : null;
};

const NoteTuner = () => {
  // Use state
  const [note, setNote] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [isTuning, setIsTuning] = useState(false);
  const [tuningStatus, setTuningStatus] = useState(null);
  const canvasRef = useRef(null);
  const animationId = useRef(null);
  const lastDrawTime = useRef(0);

  useEffect(() => {
    let audioContext, analyser, source, dataArray, stream;

    const startTuning = async () => {
      try {
        // Request microphone access
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Create audio context and analyser
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        // Configure the analyser
        analyser.fftSize = 1024;
        dataArray = new Float32Array(analyser.fftSize);

        // Create a media stream source from the microphone input
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        // Set up the canvas for drawing
        const draw = (timestamp) => {
          if (!canvasRef.current) {
            animationId.current = requestAnimationFrame(draw);
            return;
          }

          // Clear the canvas
          analyser.getFloatTimeDomainData(dataArray);
          const freq = autoCorrelate(dataArray, audioContext.sampleRate);

          // If a frequency is detected, update the state
          if (freq) {
            const detectedNote = getClosestNote(freq);
            const roundedFreq = freq.toFixed(2);

            // Update the note and frequency state
            setNote(detectedNote);
            setFrequency(roundedFreq);

            // Update the tuning status based on the detected note
            const target = getTargetFrequency(detectedNote);
            const diff = freq - target;

            // Set tuning status based on the difference
            if (Math.abs(diff) < 1) {
              setTuningStatus("In Tune");
            } else if (diff > 0) {
              setTuningStatus("Too High");
            } else {
              setTuningStatus("Too Low");
            }

            // Draw the waveform and tuning pin
            if (timestamp - lastDrawTime.current > 1000 / 30) {
              drawWaveform(dataArray);
              drawTuningPin(freq, detectedNote);
              lastDrawTime.current = timestamp;
            }
          }

          animationId.current = requestAnimationFrame(draw);
        };

        draw();
      } catch (err) {
        console.error("Microphone access error:", err);
        setIsTuning(false);
      }
    };

    // Function to stop tuning and clean up resources
    const stopTuning = () => {
      setIsTuning(false);
      if (animationId.current) cancelAnimationFrame(animationId.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) audioContext.close();
    };

    // Start or stop tuning based on isTuning
    if (isTuning) {
      startTuning();
    } else {
      stopTuning();
    }

    return () => stopTuning();
  }, [isTuning]);

  const drawWaveform = (data) => {
    // Ensure the canvas is available
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Get the 2D context for drawing
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas properties
    ctx.imageSmoothingEnabled = false;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw the waveform
    const barWidth = width / data.length;
    ctx.fillStyle = "#06d6a0";

    // Loop through the data array and draw each bar
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] + 1) * height / 2;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
  };

 
  const drawTuningPin = (freq, note) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx || !note) return;

  // Set canvas properties
  const width = canvas.width;
  const height = canvas.height;
  const y = height - 30;
  const pinWidth = 10;

  // Clear the canvas
  const target = getTargetFrequency(note);
  const diff = freq - target;

  // Calculate the offset for the tuning pin based on the frequency difference
  const offset = Math.min(Math.max(diff * 2, -100), 100); 
  const center = width / 2;

  // Clear bottom area
  ctx.clearRect(0, y, width, 30);

  // Draw center line
  ctx.strokeStyle = "#06d6a0";
  ctx.beginPath();
  ctx.moveTo(center, y);
  ctx.lineTo(center, y + 30);
  ctx.stroke();

  // Draw background zones so that the colour is more visible
  ctx.fillStyle = "#264653"; 
  ctx.fillRect(0, y, center, 30);
  ctx.fillStyle = "#f94144"; 
  ctx.fillRect(center, y, center, 30);

  // Draw tuning pin
  ctx.fillStyle = Math.abs(diff) < 1 ? "#06d6a0" : diff < 0 ? "#00b4d8" : "#ef476f";
  ctx.fillRect(center + offset - pinWidth / 2, y, pinWidth, 30);

  // Draw text
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("Too Low", center - 50, y - 2);
  ctx.fillText("In Tune", center, y - 2);
  ctx.fillText("Too High", center + 50, y - 2);
};


  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <div className="max-w-xl mx-auto card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl text-primary font-bold">
            Note Tuner
          </h1>
          <p className="text-base-content opacity-70 mb-4">
            Tune any musical note using your microphone. Make sure you are in a quiet place.
          </p>

          <div className="mb-4 flex items-center gap-4 flex-wrap">
            <button
              className={`btn ${isTuning ? "btn-accent" : "btn-primary"} transition-all`}
              onClick={() => setIsTuning((prev) => !prev)}
            >
              {isTuning ? "Stop Tuning" : "Start Tuning"}
            </button>
            {note && (
              <div className="text-lg font-semibold text-secondary">
                Note: <span className="text-accent">{note}</span> ({frequency} Hz)
              </div>
            )}
            {tuningStatus && (
              <div className={`text-sm font-medium ${tuningStatus === "In Tune" ? "text-success" : "text-error"}`}>
                {tuningStatus}
              </div>
            )}
          </div>

          <div className="bg-base-300 p-4 rounded-xl shadow-inner">
            <canvas
              ref={canvasRef}
              width={300}
              height={100}
              className="w-full h-48 bg-neutral rounded-lg"
            />
            <p className="text-center text-xs text-base-content mt-2">
              Real-time waveform and tuning pin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteTuner;
