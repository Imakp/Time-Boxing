import { useState } from "react";

export default function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  toggleDarkMode,
}) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="fixed w-full bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Time Boxing</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-slate-600 dark:text-gray-400 hidden sm:block">
          {currentDate}
        </span>
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
        >
          {isDarkMode ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
