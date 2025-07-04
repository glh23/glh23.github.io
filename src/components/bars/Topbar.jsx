import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

export default function Topbar() {
  // Safely get initial theme from localStorage
  const getInitialTheme = () => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  };

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const goHome = () => {
    navigate("/");
    setOpen(false);
  };
  const goContact = () => {
    navigate("/Contact");
    setOpen(false);
  };
  const goProjects = () => {
    navigate("/Projects");
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
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Fail silently if localStorage is blocked
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-base-100 text-neutral-900 dark:text-base-content dark:bg-base-300 shadow-md border-b border-base-200">
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
            <ul className="absolute right-0 mt-2 w-40 bg-base-100 text-neutral-900 dark:text-base-content dark:bg-base-200 shadow-lg rounded-md py-1 z-50 border border-base-300">
              <li>
                <button
                  onClick={goHome}
                  className="block w-full text-left px-4 py-2 hover:bg-pink-500 hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={goContact}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={goProjects}
                  className="block w-full text-left px-4 py-2 hover:bg-yellow-400 hover:text-black transition"
                >
                  Projects
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost p-2 text-primary hover:text-accent transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
}
