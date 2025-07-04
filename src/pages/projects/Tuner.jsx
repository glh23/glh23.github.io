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
  const SIZE = buf.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    rms += buf[i] * buf[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null;

  let r1 = 0, r2 = SIZE - 1, threshold = 0.2;

  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  buf = buf.slice(r1, r2);
  const newSize = buf.length;

  if (newSize === 0) return null;

  let c = new Array(newSize).fill(0);
  for (let i = 0; i < newSize; i++) {
    for (let j = 0; j < newSize - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

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
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        dataArray = new Float32Array(analyser.fftSize);
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const draw = (timestamp) => {
          if (!canvasRef.current) {
            animationId.current = requestAnimationFrame(draw);
            return;
          }

          analyser.getFloatTimeDomainData(dataArray);
          const freq = autoCorrelate(dataArray, audioContext.sampleRate);

          if (freq) {
            const detectedNote = getClosestNote(freq);
            const roundedFreq = freq.toFixed(2);

            setNote(detectedNote);
            setFrequency(roundedFreq);

            const target = getTargetFrequency(detectedNote);
            const diff = freq - target;

            if (Math.abs(diff) < 1) {
              setTuningStatus("In Tune");
            } else if (diff > 0) {
              setTuningStatus("Too High");
            } else {
              setTuningStatus("Too Low");
            }

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

    const stopTuning = () => {
      setIsTuning(false);
      if (animationId.current) cancelAnimationFrame(animationId.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) audioContext.close();
    };

    if (isTuning) {
      startTuning();
    } else {
      stopTuning();
    }

    return () => stopTuning();
  }, [isTuning]);

  const drawWaveform = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / data.length;
    ctx.fillStyle = "#06d6a0";

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] + 1) * height / 2;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
  };

  const drawTuningPin = (freq, note) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !note) return;

    const width = canvas.width;
    const height = canvas.height;
    const y = height - 30;
    const pinWidth = 10;

    const target = getTargetFrequency(note);
    const diff = freq - target;

    const offset = Math.min(Math.max(diff * 2, -100), 100);
    const center = width / 2;

    ctx.clearRect(0, y, width, 30);

    ctx.strokeStyle = "#06d6a0";
    ctx.beginPath();
    ctx.moveTo(center, y);
    ctx.lineTo(center, y + 30);
    ctx.stroke();

    ctx.fillStyle = "#264653";
    ctx.fillRect(0, y, center, 30);
    ctx.fillStyle = "#f94144";
    ctx.fillRect(center, y, center, 30);

    ctx.fillStyle = Math.abs(diff) < 1 ? "#06d6a0" : diff < 0 ? "#00b4d8" : "#ef476f";
    ctx.fillRect(center + offset - pinWidth / 2, y, pinWidth, 30);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
  };

return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <div className="max-w-xl mx-auto card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl text-primary font-bold mb-4">
            Note Tuner
          </h1>
          {/* Note on top, frequency and tuning status below side by side */}
          <div className="flex flex-col items-center mb-6 gap-4">
            {/* Big note */}
            <div className="text-6xl font-extrabold text-secondary text-center">
              {note || "-"}
            </div>

            {/* Frequency and tuning status side-by-side */}
            <div className="flex gap-6 text-sm text-primary">
              {frequency && (
                <div>
                  Frequency: <span className="font-semibold">{frequency} Hz</span>
                </div>
              )}
              {tuningStatus && (
                <div
                  className={`font-medium ${
                    tuningStatus === "In Tune" ? "text-success" : "text-error"
                  }`}
                >
                  {tuningStatus}
                </div>
              )}
            </div>
          </div>

          {/* Canvas area */}
          <div className="bg-base-300 p-4 rounded-xl shadow-inner mb-6">
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

          {/* Start/Stop button */}
          <button
            className={`btn ${isTuning ? "btn-accent" : "btn-primary"} transition-all w-full`}
            onClick={() => setIsTuning((prev) => !prev)}
          >
            {isTuning ? "Stop Tuning" : "Start Tuning"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteTuner;