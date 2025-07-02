import React from 'react';

export default function Home() {
  return (
    <main className="mt-6 p-6 max-w-4xl mx-auto bg-base-100 text-base-content space-y-8 rounded-lg shadow-md">
      <section>
        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p className="leading-relaxed">
          I am a final year Computer Science student looking for graduate data and developer roles which will allow me to expand my pool of knowledge both in software and business. Outside of computing I am a very keen rock guitarist and enjoy indoor rock climbing.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Education</h2>
        <p><strong>2021 – 2025:</strong> University</p>
        <p><strong>2022 – 2025:</strong> BSc (Hons) Computer Science 2:1</p>
        <p>
          <strong>Relevant Modules:</strong> Machine learning, Big Data, Full Stack, Web Development, App Development, Information Management
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>VoxTea:</strong> A full-stack MERN (Mongo, Express, React, Node) social media web app allowing audio communication. Features: messaging, clout system, filters, Spotify API, guitar tuner.
          </li>
          <li>
            <strong>Nurse Scheduling App:</strong> Team lead in Agile project for a real-world client using React + Node.js and Firebase.
          </li>
          <li>
            <strong>Rainfall Prediction:</strong> Built using custom GMM, K-means, and neural nets in MATLAB and Python. No ML libraries.
          </li>
        </ul>
        <p className="mt-4"><strong>2021 - 2022:</strong> Certificate of Higher Education in Electrical and Electronic Engineering</p>
        <ul className="list-disc list-inside">
          <li>
            <strong>Motorised Window Project:</strong> Programmed using C++ in MBed to control motors based on temperature, light, and humidity sensors.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Leadership</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Rock and Live Music Society:</strong> Treasurer and secretary, organizing events and supporting grassroots bands.
          </li>
          <li>
            <strong>Rock Band:</strong> Lead vocals, guitarist, and songwriter. Developed public speaking and leadership skills.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Work Experience & Volunteering</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>2024, Crookwood (Data Entry):</strong> Tested in-house software for analysing water bills and improving data accuracy.
          </li>
          <li>
            <strong>2023, Tesco (Night Shift):</strong> Small team experience requiring resilience and teamwork.
          </li>
          <li>
            <strong>2016–2020, Bruce Branch Canal Trust:</strong> Volunteered on narrowboat maintenance for disabled visitors.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Technologies</h2>
        <p><strong>Languages:</strong> Python, JavaScript, Java, C++, C#, MATLAB, SQL</p>
        <p><strong>Databases:</strong> MongoDB, Neo4j, Firebase, MSSQL</p>
        <p><strong>Frameworks:</strong> Express.js, React, Node.js</p>
        <p><strong>Cloud & Tools:</strong> Azure, Docker, Git, Firebase</p>
        <p><strong>ML/DS:</strong> Pandas, NumPy, Custom Neural Nets, GMM, K-Means, scikit-learn</p>
        <p><strong>Design/UI:</strong> Figma, Axure</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Qualifications</h2>
        <p><strong>2021 A Levels:</strong> Maths, Physics, Computer Science</p>
        <p><strong>2019 GCSEs:</strong> Ten GCSEs</p>
      </section>
    </main>
  );
}
