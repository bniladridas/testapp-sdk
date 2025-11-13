import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sun, Moon, ArrowUp, LogOut } from 'lucide-react';

import { askTestAI } from './TestAI';
import { useAuth } from './hooks/useAuth';
import Login from './Login';
import Signup from './Signup';

function DarkModeToggle({
  darkMode,
  setDarkMode,
  showText = false,
}: {
  darkMode: boolean;
  setDarkMode: (fn: (prev: boolean) => boolean) => void;
  showText?: boolean;
}) {
  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className={`p-2 rounded transition-transform duration-300 ${
        showText ? 'flex items-center' : ''
      }`}
      aria-label="Toggle dark mode"
    >
      <span
        className="inline-block transition-transform duration-500 will-change-transform"
        style={{
          transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {darkMode ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-gray-700 dark:text-gray-200" />
        )}
      </span>
      {showText && <span className="ml-2 text-sm">Toggle Dark Mode</span>}
    </button>
  );
}

function ChatApp() {
  const { user, logout } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.localStorage.getItem('theme') === 'dark' ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches &&
          !window.localStorage.getItem('theme'))
      );
    }
    return false;
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  // Test AI chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false); // Fullscreen state
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatOpen && chatEndRef.current && chatEndRef.current.scrollIntoView) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  // Focus input on open, close on Escape
  const chatInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (chatOpen && chatInputRef.current) {
      chatInputRef.current.focus();
    }
    // Auto-generate first AI response when chat is opened and no messages exist
    if (chatOpen && chatMessages.length === 0 && !chatLoading) {
      (async () => {
        setChatLoading(true);
        const aiText = await askTestAI('Introduce yourself as TestAI briefly.');
        setChatMessages([{ role: 'ai', text: aiText }]);
        setChatLoading(false);
      })();
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [chatOpen, chatMessages.length, chatLoading]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add('animate-fadein');
    }
    if (featuresRef.current) {
      featuresRef.current.classList.add('animate-fadein');
    }
  }, []);

  async function handleSendChat() {
    if (!chatInput.trim()) return;
    const userMsg: { role: 'user' | 'ai'; text: string } = {
      role: 'user',
      text: chatInput,
    };
    setChatMessages((msgs) => [...msgs, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const aiText = await askTestAI(userMsg.text);
      setChatMessages((msgs) => [
        ...msgs,
        { role: 'ai' as const, text: aiText },
      ]);
    } catch (error: unknown) {
      let errorMessage = 'Error: Could not get response.';

      // Check if it's a fallback response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { fallback?: boolean; text?: string } };
        };
        if (
          axiosError.response?.data?.fallback &&
          axiosError.response.data.text
        ) {
          errorMessage = axiosError.response.data.text;
        }
      } else if (
        error instanceof Error &&
        (error.message?.includes('503') ||
          error.message?.includes('overloaded'))
      ) {
        errorMessage =
          "I'm experiencing high demand right now. How's your day going? 😊";
      }

      setChatMessages((msgs) => [
        ...msgs,
        { role: 'ai' as const, text: errorMessage },
      ]);
    }
    setChatLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
      {/* Only show chat in fullscreen mode for noise-free experience */}
      {chatFullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-white dark:bg-black">
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto px-0 pb-8 pt-8">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-fadein mb-2 px-4`}
              >
                <span
                  className={
                    msg.role === 'user'
                      ? 'inline-block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl px-4 py-2 max-w-[70%] text-right shadow'
                      : 'inline-block bg-[#ffe6e6] text-gray-900 rounded-2xl px-4 py-2 max-w-[70%] text-left shadow'
                  }
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start w-full animate-fadein mb-2 px-4">
                <span className="inline-block rounded-2xl px-4 py-2 max-w-[70%] text-left bg-[#ffe6e6] text-gray-900">
                  <span
                    className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1"
                    style={{ animationDelay: '0ms' }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1"
                    style={{ animationDelay: '100ms' }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: '200ms' }}
                  ></span>
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input area: only input and send button */}
          <form
            className="w-full flex justify-center items-end pb-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
          >
            <div className="w-full max-w-2xl flex items-center bg-white dark:bg-black rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 px-4 py-3 gap-2">
              <input
                ref={chatInputRef}
                className="flex-1 px-4 py-2 bg-transparent text-gray-900 dark:text-white outline-none border-none focus:outline-none text-lg"
                type="text"
                placeholder="Message Test AI"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                autoFocus
                aria-label="Type your message"
              />
              <button
                type="submit"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 transition disabled:opacity-50 ml-2"
                disabled={chatLoading || !chatInput.trim()}
                aria-label="Send"
              >
                <ArrowUp size={22} />
              </button>
            </div>
          </form>
          {/* Fullscreen minimize button in top right */}
          <button
            onClick={() => setChatFullscreen(false)}
            className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-label="Minimize chat"
            title="Minimize"
          >
            {/* Minimize icon: chevron down */}
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
              scrollY > 50
                ? 'bg-white/95 dark:bg-black/95 backdrop-blur-sm shadow-sm'
                : 'bg-transparent'
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    TestApp
                  </span>
                  {user && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Welcome, {user.email}
                    </span>
                  )}
                </div>
                {/* Dark Mode Toggle and Logout */}
                <div className="flex items-center space-x-4">
                  <DarkModeToggle
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                  <button
                    onClick={logout}
                    className="p-2 rounded transition-transform duration-300 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-12"></div>
              </div>
            </div>
          </nav>

          <div>
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-8" ref={heroRef}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none mb-8 text-gray-900 dark:text-white">
                    TestAI
                    <br />
                    <span className="font-normal text-gray-900 dark:text-white">
                      Test CLI
                    </span>
                  </h1>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
      {/* Test AI Chat Floating Button & Window (only in non-fullscreen mode) */}
      {!chatFullscreen && (
        <div className="fixed bottom-6 right-6 z-50">
          {!chatOpen && (
            <button
              className="rounded-full p-3 transition-all flex items-center justify-center w-12 h-12 text-xl focus:outline-none"
              style={{ backgroundColor: '#ffe6e6', color: '#1e293b' }}
              onClick={() => setChatOpen(true)}
              aria-label="Open Test AI Chat"
            >
              <ArrowUp size={22} />
            </button>
          )}
          {chatOpen && (
            <div className="w-80 max-w-[95vw] bg-white dark:bg-black rounded-2xl flex flex-col overflow-hidden animate-fadein shadow-xl border border-gray-200 dark:border-gray-800">
              {/* Chat header with Test AI label */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100/80 dark:bg-black/80">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Test AI
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChatFullscreen(true)}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl focus:outline-none"
                    aria-label="Fullscreen"
                    title="Fullscreen"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V6a2 2 0 012-2h2M20 16v2a2 2 0 01-2 2h-2M16 4h2a2 2 0 012 2v2M8 20H6a2 2 0 01-2-2v-2"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl focus:outline-none ml-1"
                  >
                    ×
                  </button>
                </div>
              </div>
              {/* Chat messages */}
              <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-transparent">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-fadein mb-1`}
                  >
                    <span
                      className={
                        msg.role === 'user'
                          ? 'inline-block bg-white text-gray-900 rounded-xl px-3 py-1 max-w-[80%] text-right'
                          : 'inline-block text-gray-900 rounded-xl px-3 py-1 max-w-[80%] text-left'
                      }
                      style={
                        msg.role === 'ai' ? { backgroundColor: '#ffe6e6' } : {}
                      }
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start w-full animate-fadein mb-1">
                    <span
                      className="inline-block rounded-xl px-3 py-1 max-w-[80%] text-left"
                      style={{ backgroundColor: '#ffe6e6', color: '#1e293b' }}
                    >
                      <span
                        className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1"
                        style={{ animationDelay: '0ms' }}
                      ></span>
                      <span
                        className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1"
                        style={{ animationDelay: '100ms' }}
                      ></span>
                      <span
                        className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"
                        style={{ animationDelay: '200ms' }}
                      ></span>
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Input area */}
              <form
                className="flex bg-transparent"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
              >
                <input
                  ref={chatInputRef}
                  className="flex-1 px-3 py-2 bg-transparent text-gray-900 dark:text-white outline-none border-none focus:outline-none"
                  type="text"
                  placeholder="Ask Test AI..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                  autoFocus
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  className="px-2 py-2 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center focus:outline-none border-none"
                  style={{ backgroundColor: '#e8eeff', color: '#1e293b' }}
                  disabled={chatLoading || !chatInput.trim()}
                  aria-label="Send"
                >
                  <ArrowUp size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <ChatApp /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
