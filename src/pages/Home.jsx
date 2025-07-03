import React from "react";
import { Sparkles, BookOpen, Code, Users, Briefcase, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="mt-6 p-6 max-w-4xl mx-auto space-y-10 bg-gradient-to-b from-base-100 to-base-200 text-base-content rounded-xl shadow-lg">
      {/* Summary */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Summary</h1>
        </div>
        <p className="leading-relaxed text-base">
          I am a final year Computer Science student looking for graduate data and developer roles that will allow me to expand my knowledge in both software and business. Outside of computing, I'm a passionate rock guitarist and enjoy indoor climbing.
        </p>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-secondary">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Education</h2>
        </div>
        <div className="space-y-2">
          <p><strong>2021 – 2025:</strong> University</p>
          <p><strong>2022 – 2025:</strong> BSc (Hons) Computer Science — 2:1</p>
          <p><strong>Relevant Modules:</strong> Machine Learning, Big Data, Full Stack, Web Development, App Development, Information Management</p>
        </div>
        <ul className="list-disc list-inside pl-4 text-base space-y-1">
          <li><strong>VoxTea:</strong> Full-stack MERN social app with audio messaging, clout system, filters, Spotify API, and guitar tuner.</li>
          <li><strong>Nurse Scheduling App:</strong> Agile team lead for real-world React + Firebase scheduling tool.</li>
          <li><strong>Rainfall Prediction:</strong> GMM, K-means, and neural nets in MATLAB and Python (no libraries).</li>
        </ul>
        <div className="pt-4">
          <p><strong>2021 – 2022:</strong> CertHE in Electrical & Electronic Engineering</p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Motorised Window Project:</strong> Used C++ (MBed) to control motors with environmental sensors.</li>
          </ul>
        </div>
      </section>

      {/* Leadership */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-accent">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Leadership</h2>
        </div>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li><strong>Rock & Live Music Society:</strong> Treasurer and secretary — ran events and supported grassroots artists.</li>
          <li><strong>Rock Band:</strong> Lead vocals, guitarist, and songwriter. Built public speaking and stage presence.</li>
        </ul>
      </section>

      {/* Work Experience */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-warning">
          <Briefcase className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Work Experience & Volunteering</h2>
        </div>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li><strong>2024, Crookwood:</strong> Data entry and QA for utility analysis software.</li>
          <li><strong>2023, Tesco:</strong> Night shift team — resilience and coordination under pressure.</li>
          <li><strong>2016–2020, Canal Trust:</strong> Volunteered on narrowboat maintenance for disabled guests.</li>
        </ul>
      </section>

      {/* Technologies */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-info">
          <Code className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Technologies</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm sm:text-base">
          <p><strong>Languages:</strong> Python, JavaScript, Java, C++, C#, MATLAB, SQL</p>
          <p><strong>Databases:</strong> MongoDB, Neo4j, Firebase, MSSQL</p>
          <p><strong>Frameworks:</strong> Express.js, React, Node.js</p>
          <p><strong>Cloud/Tools:</strong> Azure, Docker, Git, Firebase</p>
          <p><strong>ML/DS:</strong> Pandas, NumPy, Custom Neural Nets, GMM, K-Means, scikit-learn</p>
          <p><strong>Design/UI:</strong> Figma, Axure</p>
        </div>
      </section>

      {/* Qualifications */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-success">
          <Star className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Qualifications</h2>
        </div>
        <p><strong>2025 Bachelors:</strong> Computer Science with a 2:1</p>
        <p><strong>2021 A Levels:</strong> Maths, Physics, Computer Science</p>
        <p><strong>2019 GCSEs:</strong> Ten GCSEs</p>
      </section>
    </main>
  );
}
