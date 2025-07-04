// import React from 'react';
// import { Link } from 'react-router-dom';

// const projects = [
//   {
//     id: 1,
//     title: "Guitar Tuner",
//     description: "A live guitar tuner made with JavaScript and Web Audio API.",
//     link: "/guitar-tuner",
//     isInternal: true,
//   },
//   {
//     id: 2,
//     title: "Metronome",
//     description: "A metronome this isn't complete yet...",
//     link: "/metronome",
//     isInternal: true,
//   },
//   {
//     id: 3,
//     title: "Risk Weight Calculator",
//     description: "A simple calculator to determine your financial risk weight based on income, expenses, and savings.",
//     link: "/risk-weight",
//     isInternal: true,
//   },
// ];

// export default function Projects() {
//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-4xl font-bold mb-8">My Projects</h1>
//       <div className="space-y-6">
//         {projects.map(({ id, title, description, link, isInternal }) => (
//           <div
//             key={id}
//             className="p-4 border border-base-300 rounded-lg shadow-sm hover:shadow-lg transition"
//           >
//             <h2 className="text-2xl font-semibold">{title}</h2>
//             <p className="mt-2 mb-4">{description}</p>
//             {link && (
//               isInternal ? (
//                 <Link
//                   to={link}
//                   className="inline-block text-primary font-semibold hover:underline"
//                 >
//                   View Project
//                 </Link>
//               ) : (
//                 <a
//                   href={link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block text-primary font-semibold hover:underline"
//                 >
//                   View Project
//                 </a>
//               )
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
    title: "Drum Machine",
    description: "Create beats with a simple drum machine interface.",
    link: "/drum-machine",
    isInternal: true,
  },
  {
    id: 3,
    title: "Risk Weight Calculator",
    description:
      "A calculator to determine your financial risk weight based on income, expenses, and savings.",
    link: "/risk-weight",
    isInternal: true,
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-10">My Projects</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map(({ id, title, description, link, isInternal }) => (
            <div
              key={id}
              className="card border border-base-300 bg-base-200 shadow-md hover:shadow-xl transition duration-200"
            >
              <div className="card-body">
                <h2 className="card-title text-secondary">{title}</h2>
                <p className="text-sm opacity-80">{description}</p>
                <div className="card-actions mt-4">
                  {isInternal ? (
                    <Link
                      to={link}
                      className="btn btn-sm btn-primary"
                    >
                      View Project <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      View Project <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
