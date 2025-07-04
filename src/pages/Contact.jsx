import React from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content px-4 py-12 space-y-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Contact Me</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        {/* GitHub */}
        <a
          href="https://github.com/glh23"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-6 bg-purple-800 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform"
        >
          <SiGithub className="w-10 h-10 mb-2" />
          <span className="font-medium">GitHub</span>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/george-hawtin-568272296"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-6 bg-[#0A66C2] text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform"
        >
          <SiLinkedin className="w-10 h-10 mb-2" />
          <span className="font-medium">LinkedIn</span>
        </a>
      </div>

      <p className="text-sm text-base-content opacity-60 mt-8">
        Feel free to reach out for any questions, or just to say hi!
      </p>
    </div>
  );
}
