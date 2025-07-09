import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/themeContext";
import TopBar from "./components/bars/Topbar";
import BottomBar from "./components/bars/Bottombar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Projects from "./pages/projects/Projects";
import GuitarTuner from './pages/projects/Tuner';
import DrumMachine from './pages/projects/DrumMachine';
import RiskWeightPage from "./pages/projects/RiskWeight";
import NoughtsCrosses from "./pages/projects/Qlearning";

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
            <Route path="/drum-machine" element={<DrumMachine />} />
            <Route path="/risk-weight" element={<RiskWeightPage />} />
            <Route path="/noughts-and-crosses" element={<NoughtsCrosses />} />
          </Routes>
          <BottomBar/>
        </div>
      </Router>
    </ThemeProvider>
  );
}
