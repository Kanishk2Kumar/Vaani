import React from 'react'

function doc-grid() {
  return (
    <div>
      
    </div>
  )
}

export default doc-grid
import React from "react";

function DocGrid() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* 🔹 Background Animated Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridmove_10s_linear_infinite]" />
      </div>

      {/* 🔹 Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 bg-transparent">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <span className="text-lg font-bold tracking-wide">Vaani</span>
        </div>
        <div className="flex items-center space-x-8 text-gray-300">
          <a href="#about" className="hover:text-white transition">
            ABOUT
          </a>
          <a href="#docs" className="hover:text-white transition">
            DOCS
          </a>
          <button className="px-5 py-2 bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition">
            Open Dashboard
          </button>
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <main className="relative z-10 flex flex-col flex-1 items-center justify-center text-center px-6 md:px-12">
        <p className="text-sm md:text-base mb-3 text-blue-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Support Us by starring the repository ↗
          </a>
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent drop-shadow-lg leading-tight">
          Voice AI agents for developers
        </h1>

        <p className="text-gray-400 max-w-2xl text-sm md:text-lg mb-8">
          A Voice-First Conversational AI Assistant that feels natural,
          informative and customizable. It is designed to facilitate natural,
          informative, and customizable interactions that empower developers to
          build amazing applications.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-blue-600 rounded-lg font-semibold text-white shadow-md hover:bg-blue-700 transition">
            Sign Up →
          </button>
          <button className="px-8 py-3 border border-gray-600 rounded-lg font-semibold text-gray-200 hover:bg-gray-900 transition">
            Documentation
          </button>
        </div>
      </main>

      {/* 🔹 Footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row justify-between items-center px-8 py-5 text-sm text-gray-500 border-t border-gray-800">
        <p className="mb-3 sm:mb-0">
          Built by{" "}
          <a
            href="https://github.com"
            className="hover:underline text-gray-300"
          >
            Team Optimus
          </a>{" "}
          <span className="text-red-500 text-lg">🤖</span>
        </p>

        <div className="flex items-center gap-6">
          <a
            href="#sponsor"
            className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
          >
            ❤️ Sponsor Us
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.302 3.438 
                   9.8 8.205 11.387.6.113.82-.26.82-.577 
                   0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.73.082-.73 
                   1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 
                   3.492.998.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.932 
                   0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 
                   0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 
                   2.045.138 3.003.404 2.292-1.552 3.3-1.23 
                   3.3-1.23.653 1.652.241 2.873.118 3.176.77.84 
                   1.236 1.912 1.236 3.222 0 4.61-2.803 
                   5.624-5.475 5.922.43.372.823 1.102.823 
                   2.222 0 1.606-.015 2.898-.015 3.293 
                   0 .32.218.694.825.576C20.565 22.092 
                   24 17.593 24 12.297 24 5.67 18.627.297 12 
                   .297z"
              />
            </svg>
          </a>
        </div>
      </footer>

      {/* 🔹 Extra CSS Animation */}
      <style>{`
        @keyframes gridmove {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 40px 40px;
          }
        }
      `}</style>
    </div>
  );
}

export default DocGrid;
