import React from 'react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: "Guitar Tuner",
    description: "A live guitar tuner made with JavaScript and Web Audio API.",
    link: "/guitar-tuner",
    isInternal: true,
  },
  {
    id: 2,
    title: "Metronome",
    description: "A metronome ",
    link: "/metronome",
    isInternal: false,
  },
  {
    id: 3,
    title: "Risk Weight Calculator",
    description: "A simple calculator to determine your financial risk weight based on income, expenses, and savings.",
    link: "/risk-weight",
    isInternal: true,
  },
];

export default function Projects() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <div className="space-y-6">
        {projects.map(({ id, title, description, link, isInternal }) => (
          <div
            key={id}
            className="p-4 border border-base-300 rounded-lg shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-2 mb-4">{description}</p>
            {link && (
              isInternal ? (
                <Link
                  to={link}
                  className="inline-block text-primary font-semibold hover:underline"
                >
                  View Project
                </Link>
              ) : (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-primary font-semibold hover:underline"
                >
                  View Project
                </a>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
