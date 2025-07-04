import React from "react";

export default function BottomBar() {
  return (
    <footer className="bg-base-200 border-t border-base-300 text-sm text-center py-4 px-6">
      <p>
        © {new Date().getFullYear()} George Hawtin &nbsp;|&nbsp;{" "}
        <a
          href="https://github.com/glh23"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          GitHub
        </a>{" "}
        &nbsp;|&nbsp;{" "}
        <a
          href="https://www.linkedin.com/in/george-hawtin-568272296"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
