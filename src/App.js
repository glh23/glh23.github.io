import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/themeContext";
import TopBar from "./components/bars/Topbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Projects from "./pages/projects/Projects";
import GuitarTuner from './pages/projects/Tuner';
import Metronome from './pages/projects/metronome';
import RiskWeightPage from "./pages/projects/RiskWeight";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300 bg-base-100 text-base-content">
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/guitar-tuner" element={<GuitarTuner />} />
            <Route path="/metronome" element={<Metronome />} />
            <Route path="/risk-weight" element={<RiskWeightPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
