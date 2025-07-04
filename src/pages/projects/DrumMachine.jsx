import React, { useState, useEffect, useRef } from "react";
import { Drum, Play, StopCircle } from "lucide-react";

// Load audio samples
const kick = new Audio("/drums/kick.mp3");
const snare = new Audio("/drums/snare.mp3");
const hihat = new Audio("/drums/hi-hat.mp3");

const DrumMachine = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const intervalRef = useRef(null);

  // 3x16 grid: Kick, Snare, HiHat
  const [sequence, setSequence] = useState({
    kick: new Array(16).fill(false),
    snare: new Array(16).fill(false),
    hihat: new Array(16).fill(false),
  });

  const togglePad = (track, index) => {
    setSequence((prev) => ({
      ...prev,
      [track]: prev[track].map((val, i) => (i === index ? !val : val)),
    }));
  };

  const playStep = () => {
    const currentStep = step % 16;

    if (sequence.kick[currentStep]) {
      kick.currentTime = 0;
      kick.play();
    }
    if (sequence.snare[currentStep]) {
      snare.currentTime = 0;
      snare.play();
    }
    if (sequence.hihat[currentStep]) {
      hihat.currentTime = 0;
      hihat.play();
    }

    setStep((s) => (s + 1) % 16);
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalTime = (60 / bpm) / 4 * 1000;
      intervalRef.current = setInterval(playStep, intervalTime);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm, step]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <div className="max-w-4xl mx-auto card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl text-primary font-bold mb-4 flex items-center gap-2">
            <Drum className="w-7 h-7" />
            Drum Machine
          </h1>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center">
              <input
                type="range"
                min="30"
                max="250"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="range range-primary"
              />
              <div className="text-center font-semibold text-accent">{bpm} BPM</div>
            </div>

            <button
              className={`btn ${isPlaying ? "btn-accent" : "btn-primary"} transition-all flex items-center gap-2`}
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying ? <StopCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? "Stop" : "Play"}
            </button>
          </div>

          {/* Drum Grid */}
          <div className="flex justify-center">
            <div className="space-y-4">
              {["kick", "snare", "hihat"].map((track) => (
                <div key={track} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="w-full sm:w-16 text-sm font-semibold capitalize text-secondary sm:mr-2 text-center sm:text-left">
                    {track}
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    {sequence[track].map((active, i) => (
                      <button
                        key={i}
                        onClick={() => togglePad(track, i)}
                        className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded ${
                          active ? "bg-accent" : "bg-base-300"
                        } ${i === step % 16 ? "ring-2 ring-success" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-base-content mt-4 opacity-60">
            Tap steps to activate. Click Play to start.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrumMachine;

