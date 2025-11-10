import React from 'react';
import { Github, Sun, Moon } from 'lucide-react';

export default function Cookies({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      {/* Navigation Bar with Dark Mode Toggle */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <img
                src="/Minimalist Typography Simple Modern Brand Logo.png"
                alt="Brat Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Brat
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors transform transition-transform duration-300 active:scale-90"
                aria-label="Toggle dark mode"
              >
                <span
                  className="inline-block transition-transform duration-500 will-change-transform"
                  style={{
                    transform: darkMode
                      ? 'rotate(180deg) scale(1.2)'
                      : 'rotate(0deg) scale(1)',
                  }}
                >
                  {darkMode ? (
                    <Sun size={18} className="text-yellow-400" />
                  ) : (
                    <Moon
                      size={18}
                      className="text-gray-700 dark:text-gray-200"
                    />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 max-w-2xl mx-auto pt-32 pb-16 px-4 w-full">
        <h1 className="text-3xl font-bold mb-4">Cookies Policy</h1>
        <div className="text-gray-700 dark:text-gray-200 space-y-4">
          <p>
            <strong>Last updated: June 2025</strong>
          </p>
          <p>
            BratUI uses cookies to enhance your experience, analyze site usage,
            and improve our services. Cookies are small text files stored on
            your device by your browser. They help us remember your preferences,
            keep you logged in, and understand how you interact with our
            platform.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            What are cookies used for?
          </h2>
          <ul className="list-disc pl-6">
            <li>Authentication and session management</li>
            <li>Remembering user preferences</li>
            <li>Analytics and performance tracking</li>
            <li>Improving security</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">Managing cookies</h2>
          <p>
            You can control or delete cookies through your browser settings.
            Please note that disabling cookies may affect the functionality of
            BratUI.
          </p>
          <p>
            For more information about cookies, visit{' '}
            <a
              href="https://www.allaboutcookies.org/"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              allaboutcookies.org
            </a>
            .
          </p>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 text-center md:text-left">
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <img
              src="/Minimalist Typography Simple Modern Brand Logo.png"
              alt="Brat Logo"
              className="h-6 w-auto"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/bniladridas/togethercli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://github.com/iambrat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                Organization
              </a>
              <a
                href="/cookies"
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                Cookies
              </a>
              <a
                href="/terms"
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                Terms
              </a>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300 tracking-wide w-full md:w-auto">
              © {new Date().getFullYear()} Brat — Together CLI. Provided as-is,
              without warranty.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
