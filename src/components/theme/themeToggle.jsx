import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {

  
  return (
    <label className="flex items-center cursor-pointer select-none space-x-2">
      <span className="text-sm">{theme === 'light' ? 'Day' : 'Night'}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={theme === 'dark'}
          onChange={onToggle}
        />
        <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner"></div>
        <div
          className={`dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${
            theme === 'dark' ? 'translate-x-5' : ''
          }`}
        ></div>
      </div>
    </label>
  );
}
