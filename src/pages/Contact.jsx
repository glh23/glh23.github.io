import React from "react";

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content mx-6 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

      {/* GitHub Section */}
      <div className="rounded-xl p-6 flex items-center justify-center w-64 shadow-lg
                      bg-purple-900 dark:bg-purple-600">
        <a
          href="https://github.com/glh23"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <img
            src="/icons/github.svg"
            alt="GitHub"
            className="w-10 h-10"
          />
        </a>
      </div>

      {/* LinkedIn Section */}
      <div className="rounded-xl p-6 flex items-center justify-center w-64 shadow-lg
                      bg-blue-900 dark:bg-blue-600">
        <a
          href="www.linkedin.com/in/george-hawtin-568272296"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <img
            src="/icons/linkedin.svg"
            alt="LinkedIn"
            className="w-10 h-10"
          />
        </a>
      </div>
    </div>
  );
}
