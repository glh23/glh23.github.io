import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Safely get the initial theme from localStorage or default to "light"
  const getInitialTheme = () => {
    try {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme ? storedTheme : "light";
    } catch (e) {
      // localStorage access denied or not available
      return "light";
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      // Ignore localStorage errors (e.g., in edge or other browsers with strict privacy settings)
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
