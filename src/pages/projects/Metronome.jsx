import React, { useState, useRef, useEffect } from 'react';

export default function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const playClick = () => {
    const context = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = context;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = 3000; // 1kHz beep
    gainNode.gain.value = 1;

    oscillator.start();
    oscillator.stop(context.currentTime + 0.05); // 50ms beep
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      intervalRef.current = setInterval(playClick, interval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm]);

  const handleToggle = () => {
    if (!isPlaying) {
      playClick(); // Play immediately on start
    }
    setIsPlaying(!isPlaying);
  };
    return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content p-6">
        <div className="bg-neutral p-8 rounded-lg shadow-lg text-center space-y-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary">Metronome</h1>

        <div className="space-y-2">
            <label htmlFor="bpm" className="block font-medium text-secondary">
            Tempo: {bpm} BPM
            </label>
            <input
            type="range"
            id="bpm"
            min="40"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(e.target.valueAsNumber)}
            className="range range-primary w-full"
            />
        </div>

        <button
            onClick={handleToggle}
            className="btn btn-primary"
        >
            {isPlaying ? 'Stop' : 'Start'}
        </button>
        </div>
    </div>
    );

}
