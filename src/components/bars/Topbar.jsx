import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const goHome = () => {
    navigate('/');
    setOpen(false);
  };
  const goContact = () => {
    navigate('/Contact');
    setOpen(false);
  };
  const goProjects = () => {
    navigate('/Projects');
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-base-300 text-base-content shadow-md border-b border-base-200">
      <div className="text-xl font-bold tracking-tight">George Hawtin</div>

      <div className="flex items-center space-x-4" ref={dropdownRef}>
        {/* Dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-ghost p-2"
            aria-expanded={open}
            aria-haspopup="true"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {open && (
            <ul className="absolute right-0 mt-2 w-40 bg-base-100 text-base-content shadow-lg rounded-md py-1 z-50 border border-base-300">
              <li>
                <button onClick={goHome} className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-primary-content transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={goContact} className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-primary-content transition">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={goProjects} className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-primary-content transition">
                  Projects
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Theme toggle with icons */}
        <label className="cursor-pointer flex items-center">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            className="sr-only"
          />
          <div className="w-10 h-5 bg-white rounded-full flex items-center px-1 transition-colors duration-300">
            <div
              className={`w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-5" : "translate-x-0"
              }`}
              style={{
                backgroundImage: `url(${theme === "dark" ? "/icons/moon.svg" : "/icons/sun.svg"})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </label>
      </div>
    </nav>
  );
}
