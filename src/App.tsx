import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, Download, Github, ExternalLink, Terminal, Code, Zap, Sun, Moon, ArrowUp, Search, ArrowDown } from 'lucide-react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { askBratAI } from './BratAI';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from './Cookies';
import Terms from './Terms';

const SURVEY_TOPICS = [
  'AI',
  'LLMs (Large Language Models)',
  'VR / MR',
  'AR',
  '2D / Web / Mobile Development',
  'Business Messaging',
  'APIs (eg. Graph API, Marketing API)'
];

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') === 'dark' ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches && !window.localStorage.getItem('theme'));
    }
    return false;
  });
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  // Brat AI chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false); // Fullscreen state
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showSurvey, setShowSurvey] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.localStorage.getItem('bratui_survey_done');
    }
    return true;
  });
  const [surveyStep, setSurveyStep] = useState(0); // 0: intro, 1: form
  const [surveyTopics, setSurveyTopics] = useState<string[]>([]);
  const [surveyFirstName, setSurveyFirstName] = useState('');
  const [surveyLastName, setSurveyLastName] = useState('');
  const [surveyEmail, setSurveyEmail] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  // Add highlight state
  const [highlightedText, setHighlightedText] = useState('');

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
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
        const aiText = await askBratAI('Say hello and introduce yourself as Brat in a few words.');
        setChatMessages([{ role: 'ai', text: aiText }]);
        setChatLoading(false);
      })();
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [chatOpen]);

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

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const languages = [
    { name: 'Rust', description: 'Fast, reliable prompt-to-response interaction', command: 'cargo run -- "Your prompt here"' },
    { name: 'R', description: 'Seamless API integration for data-driven workflows', command: 'Rscript r-cli/cli.R "Your prompt here"' },
    { name: 'Scala', description: 'Elegant, scalable command-line prompting', command: 'sbt run "Your prompt here"' },
    { name: 'Fortran', description: 'Robust API calls via curl system integration', command: './fortran-cli/together_cli "Your prompt here"' },
    { name: 'TypeScript', description: 'Modern JavaScript with type safety', command: 'npm run start "Your prompt here"' },
    { name: 'Go', description: 'Concurrent, efficient CLI processing', command: 'go run main.go "Your prompt here"' },
    { name: 'Java', description: 'Enterprise-grade API interaction', command: 'java -jar together-cli.jar "Your prompt here"' },
    { name: 'Ruby', description: 'Expressive, developer-friendly scripting', command: 'ruby cli.rb "Your prompt here"' }
  ];

  // Add features and static sections for search
  const features = [
    {
      title: t('features.terminal'),
      desc: t('features.terminalDesc'),
    },
    {
      title: t('features.multi'),
      desc: t('features.multiDesc'),
    },
    {
      title: t('features.ai'),
      desc: t('features.aiDesc'),
    },
  ];
  const staticSections = [
    t('hero.title'),
    t('hero.subtitle'),
    t('hero.description'),
    t('download.title'),
    t('download.desc'),
    t('about.title'),
    t('about.desc1'),
    t('about.desc2'),
    t('languages.title'),
    t('features.title'),
    t('setup.title'),
    t('setup.env'),
    t('setup.envDesc'),
    t('setup.api'),
    t('setup.apiDesc'),
    t('setup.run'),
    t('setup.runDesc'),
  ];

  async function handleSendChat() {
    if (!chatInput.trim()) return;
    const userMsg: { role: 'user' | 'ai'; text: string } = { role: 'user', text: chatInput };
    setChatMessages((msgs) => [...msgs, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const aiText = await askBratAI(userMsg.text);
      setChatMessages((msgs) => [...msgs, { role: 'ai' as const, text: aiText }]);
    } catch (e) {
      setChatMessages((msgs) => [...msgs, { role: 'ai' as const, text: 'Error: Could not get response.' }]);
    }
    setChatLoading(false);
  }

  function handleSurveyTopicToggle(topic: string) {
    setSurveyTopics(topics =>
      topics.includes(topic)
        ? topics.filter(t => t !== topic)
        : [...topics, topic]
    );
  }

  function handleSurveySubmit(e: React.FormEvent) {
    e.preventDefault();
    setSurveySubmitted(true);
    window.localStorage.setItem('bratui_survey_done', '1');
    setTimeout(() => setShowSurvey(false), 1200);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }
    // Search languages
    const langMatches = languages
      .map(lang => [lang.name, lang.description, lang.command])
      .flat()
      .filter(Boolean)
      .filter(text => text.toLowerCase().includes(query));
    // Search features
    const featureMatches = features
      .map(f => [f.title, f.desc])
      .flat()
      .filter(Boolean)
      .filter(text => text.toLowerCase().includes(query));
    // Search static sections
    const staticMatches = staticSections
      .filter(Boolean)
      .filter(text => text.toLowerCase().includes(query));
    // Combine and dedupe
    const allMatches = Array.from(new Set([...langMatches, ...featureMatches, ...staticMatches])).slice(0, 10);
    setSearchResults(allMatches);
  }

  function handleResultClick(result: string) {
    if (!mainContentRef.current) return;
    // Find the first element containing the result text
    const walker = document.createTreeWalker(
      mainContentRef.current,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (
            node.textContent &&
            node.textContent.toLowerCase().includes(result.toLowerCase())
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        },
      }
    );
    const el = walker.nextNode();
    if (el && el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedText(result);
      setTimeout(() => setHighlightedText(''), 1500);
    }
    setSearchOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      {/* Survey Modal */}
      {showSurvey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm px-2 sm:px-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative animate-fadein">
            {surveyStep === 0 && (
              <>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white text-center">Help us improve BratUI</h2>
                <p className="mb-6 sm:mb-8 text-gray-700 dark:text-gray-200 text-center text-sm sm:text-base">Take a quick, anonymous survey to help us build a better experience for developers.</p>
                <button className="w-full py-2 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium hover:opacity-90 transition text-base" onClick={() => setSurveyStep(1)}>Take the survey</button>
                <div className="flex justify-center mt-4">
                  <ArrowDown size={24} className="text-gray-300 dark:text-gray-600" />
                </div>
              </>
            )}
            {surveyStep === 1 && !surveySubmitted && (
              <form onSubmit={handleSurveySubmit} className="space-y-3 sm:space-y-4">
                <div className="mb-2 font-medium text-center text-sm sm:text-base">Select topics that matter to you:</div>
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 justify-center">
                  {SURVEY_TOPICS.map(topic => (
                    <button
                      type="button"
                      key={topic}
                      className={`px-3 py-1 rounded-full border text-xs sm:text-sm font-medium transition ${surveyTopics.includes(topic) ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-gray-900 dark:border-gray-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700'}`}
                      onClick={() => handleSurveyTopicToggle(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-sm" placeholder="First Name" value={surveyFirstName} onChange={e => setSurveyFirstName(e.target.value)} required />
                  <input type="text" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-sm" placeholder="Last Name" value={surveyLastName} onChange={e => setSurveyLastName(e.target.value)} required />
                </div>
                <input type="email" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-sm" placeholder="Email Address" value={surveyEmail} onChange={e => setSurveyEmail(e.target.value)} required />
                <button type="submit" className="w-full py-2 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium hover:opacity-90 transition text-base">Submit</button>
              </form>
            )}
            {surveySubmitted && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Thank you!</div>
                <div className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">Your feedback helps us improve BratUI.</div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Only show chat in fullscreen mode for noise-free experience */}
      {chatFullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-white dark:bg-gray-900">
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto px-0 pb-8 pt-8">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-fadein mb-2 px-4`}>
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
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1" style={{ animationDelay: '100ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input area: only input and send button */}
          <form className="w-full flex justify-center items-end pb-8" onSubmit={e => { e.preventDefault(); handleSendChat(); }}>
            <div className="w-full max-w-2xl flex items-center bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 px-4 py-3 gap-2">
              <input
                ref={chatInputRef}
                className="flex-1 px-4 py-2 bg-transparent text-gray-900 dark:text-white outline-none border-none focus:outline-none text-lg"
                type="text"
                placeholder="Message Brat AI"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
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
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrollY > 50 ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
          }`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/Minimalist Typography Simple Modern Brand Logo.png" 
                    alt="Brat Logo" 
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Brat</span>
                </div>
                {/* Language Selector & Dark Mode Toggle */}
                <div className="flex items-center space-x-4">
                  <button onClick={() => i18n.changeLanguage('en')} className={`text-xs px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-gray-900 text-white dark:bg-gray-700 dark:text-white' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'}`}>EN</button>
                  <button onClick={() => i18n.changeLanguage('es')} className={`text-xs px-2 py-1 rounded ${i18n.language === 'es' ? 'bg-gray-900 text-white dark:bg-gray-700 dark:text-white' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'}`}>ES</button>
                  <button
                    onClick={() => setDarkMode((prev) => !prev)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors transform transition-transform duration-300 active:scale-90"
                    aria-label="Toggle dark mode"
                  >
                    <span className="inline-block transition-transform duration-500 will-change-transform" style={{ transform: darkMode ? 'rotate(180deg) scale(1.2)' : 'rotate(0deg) scale(1)' }}>
                      {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-700 dark:text-gray-200" />}
                    </span>
                  </button>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-12">
                  <a href="#project" className="text-sm font-medium tracking-wide hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t('nav.project')}</a>
                  <a href="#languages" className="text-sm font-medium tracking-wide hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t('nav.languages')}</a>
                  <a href="#download" className="text-sm font-medium tracking-wide hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t('nav.download')}</a>
                  <a href="#about" className="text-sm font-medium tracking-wide hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t('nav.about')}</a>
                  <button
                    className="ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Search"
                    onClick={() => setSearchOpen((v) => !v)}
                  >
                    <Search size={20} />
                  </button>
                  {searchOpen && (
                    <div ref={searchDropdownRef} className="absolute right-8 top-16 z-50 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-sm w-72 animate-fadein" style={{border: 'none', padding: 0, boxShadow: 'none'}}>
                      <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 pt-3 pb-1 relative">
                        <input
                          ref={searchInputRef}
                          className="flex-1 px-3 py-2 rounded bg-transparent text-gray-900 dark:text-white outline-none border-none text-base"
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          autoFocus
                          style={{boxShadow: 'none'}}
                        />
                        {searchQuery && (
                          <>
                            <span className="ml-2 text-xs text-gray-300 select-none md:hidden">Tap</span>
                            <span className="ml-2 text-xs text-gray-300 select-none hidden md:inline">Enter</span>
                          </>
                        )}
                      </form>
                      <div className="max-h-48 overflow-y-auto px-3 pb-3">
                        {searchResults.length === 0 && searchQuery && <div className="text-gray-400 text-sm py-2">No results found.</div>}
                        {searchResults.map((line, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="w-full text-left text-gray-700 dark:text-gray-200 text-sm py-1 truncate hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            style={{ background: highlightedText === line ? '#ffe066' : 'none', transition: 'background 0.3s' }}
                            onClick={() => handleResultClick(line)}
                          >
                            {line}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 relative">
                <div className="px-6 py-4 space-y-4">
                  <a href="#project" className="block text-sm font-medium tracking-wide text-gray-900 dark:text-gray-100">{t('nav.project')}</a>
                  <a href="#languages" className="block text-sm font-medium tracking-wide text-gray-900 dark:text-gray-100">{t('nav.languages')}</a>
                  <a href="#download" className="block text-sm font-medium tracking-wide text-gray-900 dark:text-gray-100">{t('nav.download')}</a>
                  <a href="#about" className="block text-sm font-medium tracking-wide text-gray-900 dark:text-gray-100">{t('nav.about')}</a>
                  <button
                    className="mt-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center"
                    aria-label="Search"
                    onClick={() => setSearchOpen((v) => !v)}
                  >
                    <Search size={20} />
                    <span className="ml-2 text-sm">Search</span>
                  </button>
                </div>
                {searchOpen && (
                  <div ref={searchDropdownRef} className="absolute left-0 right-0 top-full z-50 bg-white/90 dark:bg-gray-900/90 rounded-b-xl shadow-sm w-full animate-fadein" style={{border: 'none', padding: 0, boxShadow: 'none'}}>
                    <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 pt-3 pb-1 relative">
                      <input
                        ref={searchInputRef}
                        className="flex-1 px-3 py-2 rounded bg-transparent text-gray-900 dark:text-white outline-none border-none text-base"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        autoFocus
                        style={{boxShadow: 'none'}}
                      />
                      {searchQuery && (
                        <>
                          <span className="ml-2 text-xs text-gray-300 select-none md:hidden">Tap</span>
                          <span className="ml-2 text-xs text-gray-300 select-none hidden md:inline">Enter</span>
                        </>
                      )}
                    </form>
                    <div className="max-h-48 overflow-y-auto px-3 pb-3">
                      {searchResults.length === 0 && searchQuery && <div className="text-gray-400 text-sm py-2">No results found.</div>}
                      {searchResults.map((line, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full text-left text-gray-700 dark:text-gray-200 text-sm py-1 truncate hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          style={{ background: highlightedText === line ? '#ffe066' : 'none', transition: 'background 0.3s' }}
                          onClick={() => handleResultClick(line)}
                        >
                          {line}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Main Content Wrapper for Search */}
          <div ref={mainContentRef}>
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-8" ref={heroRef}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none mb-8 text-gray-900 dark:text-white">
                    {t('hero.title')}
                    <br />
                    <span className="font-normal text-gray-900 dark:text-white">{t('hero.subtitle')}</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
                    {t('hero.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="https://github.com/bniladridas/togethercli" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group inline-flex items-center text-sm font-medium tracking-wide bg-gray-900 text-white px-8 py-4 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                    >
                      <Github size={16} className="mr-2" />
                      {t('hero.github')}
                      <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a 
                      href="#download"
                      className="group inline-flex items-center text-sm font-medium tracking-wide border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-8 py-4 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <Download size={16} className="mr-2" />
                      {t('hero.download')}
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Video Demo */}
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                    <video 
                      className="w-full rounded-md"
                      controls
                      poster="/api/placeholder/800/450"
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src="https://github.com/user-attachments/assets/4e449302-279d-452c-b616-3abfe09896a9" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="project" className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-900" ref={featuresRef}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16 text-gray-900 dark:text-white">
                  {t('features.title')}
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Terminal size={24} className="text-gray-600 dark:text-gray-200" />
                    </div>
                    <h3 className="text-xl font-medium mb-4 tracking-wide text-gray-900 dark:text-white">{t('features.terminal')}</h3>
                    <p className="text-gray-600 dark:text-gray-200 leading-relaxed">
                      {t('features.terminalDesc')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Code size={24} className="text-gray-600 dark:text-gray-200" />
                    </div>
                    <h3 className="text-xl font-medium mb-4 tracking-wide text-gray-900 dark:text-white">{t('features.multi')}</h3>
                    <p className="text-gray-600 dark:text-gray-200 leading-relaxed">
                      {t('features.multiDesc')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap size={24} className="text-gray-600 dark:text-gray-200" />
                    </div>
                    <h3 className="text-xl font-medium mb-4 tracking-wide text-gray-900 dark:text-white">{t('features.ai')}</h3>
                    <p className="text-gray-600 dark:text-gray-200 leading-relaxed">
                      {t('features.aiDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Languages Grid */}
            <section id="languages" className="py-20 px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16 text-gray-900 dark:text-white">
                  {t('languages.title')}
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {languages.map((lang, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-500 transition-colors">
                      <h3 className="text-lg font-medium mb-3 tracking-wide text-gray-900 dark:text-white">{lang.name}</h3>
                      <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed mb-4">{lang.description}</p>
                      <code className="text-xs text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded block overflow-x-auto">
                        {lang.command}
                      </code>
                    </div>
                  ))}
                  <div className="bg-white dark:bg-gray-800 p-6 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-medium mb-3 tracking-wide text-gray-900 dark:text-white">{t('languages.more')}</h3>
                    <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed mb-4">{t('languages.moreDesc')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Setup Instructions */}
            <section className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16 text-gray-900 dark:text-white">
                  {t('setup.title')}
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 tracking-wide text-gray-900 dark:text-white">{t('setup.env')}</h3>
                    <p className="text-gray-600 dark:text-gray-200 mb-4">{t('setup.envDesc')} <code className="bg-gray-900 dark:bg-gray-900 text-gray-100 dark:text-gray-100">.env</code></p>
                    <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-100 p-4 rounded text-sm overflow-x-auto">
                      <code className="bg-gray-900 dark:bg-gray-900 text-gray-100 dark:text-gray-100">TOGETHER_API_KEY=your_api_key_here</code>
                    </pre>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 tracking-wide text-gray-900 dark:text-white">{t('setup.api')}</h3>
                    <p className="text-gray-600 dark:text-gray-200">
                      {t('setup.apiDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 tracking-wide text-gray-900 dark:text-white">{t('setup.run')}</h3>
                    <p className="text-gray-600 dark:text-gray-200">
                      {t('setup.runDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-8 text-gray-900 dark:text-white">
                  {t('download.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-200 leading-relaxed mb-12">
                  {t('download.desc')}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <a 
                    href="https://github.com/bniladridas/togethercli/archive/refs/tags/v1.0.0.zip"
                    className="group flex items-center justify-center text-sm font-medium tracking-wide bg-gray-900 text-white px-8 py-4 hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <Download size={16} className="mr-2" />
                    {t('download.zip')}
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a 
                    href="https://github.com/bniladridas/togethercli/archive/refs/tags/v1.0.0.tar.gz"
                    className="group flex items-center justify-center text-sm font-medium tracking-wide border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-8 py-4 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                  >
                    <Download size={16} className="mr-2" />
                    {t('download.tar')}
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                {/* Gemini TTS CLI Download */}
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
                  <a
                    href="https://github.com/bniladridas/gemini-tts-cli/archive/refs/tags/v1.0.zip"
                    className="group flex items-center justify-center text-sm font-medium tracking-wide bg-gray-900 text-white px-8 py-4 hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Terminal size={16} className="mr-2" />
                    Download Gemini TTS CLI
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <div className="flex flex-col justify-center text-left text-gray-700 dark:text-gray-200 text-sm pl-2">
                    <span>Terminal TTS tool for Together CLI users.</span>
                  </div>
                </div>
                <div className="mt-8 flex flex-col items-center space-y-2">
                  <a 
                    href="https://github.com/bniladridas/togethercli/commits/v1.0.0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-flex items-center"
                  >
                    {t('download.changelog')}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                  {/* Gemini TTS CLI Changelog */}
                  <a
                    href="https://github.com/bniladridas/gemini-tts-cli/commits/main/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-flex items-center"
                  >
                    Gemini TTS CLI Changelog
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-8 text-gray-900 dark:text-white">
                  {t('about.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-200 leading-relaxed mb-8">
                  {t('about.desc1')}
                </p>
                <p className="text-gray-600 dark:text-gray-200 leading-relaxed mb-8">
                  {t('about.desc2')}
                </p>
                
                {/* Social Proof */}
                <div className="space-y-8 mt-12">
                  <h3 className="text-lg font-medium tracking-wide text-gray-900 dark:text-white">{t('about.featured')}</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">{t('about.chatgpt')}</p>
                      <iframe 
                        src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7336158045023944704?compact=1" 
                        height="300" 
                        width="100%" 
                        frameBorder="0" 
                        allowFullScreen 
                        title="ChatGPT LinkedIn Post"
                        className="rounded"
                      ></iframe>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">{t('about.grok')}</p>
                      <iframe 
                        src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7335965922517499905?compact=1" 
                        height="300" 
                        width="100%" 
                        frameBorder="0" 
                        allowFullScreen 
                        title="Grok LinkedIn Post"
                        className="rounded"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
                  {t('footer.copyright', { year: new Date().getFullYear() })}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
      {/* Brat AI Chat Floating Button & Window (only in non-fullscreen mode) */}
      {!chatFullscreen && (
        <div className="fixed bottom-6 right-6 z-50">
          {!chatOpen && (
            <button
              className="rounded-full p-3 transition-all flex items-center justify-center w-12 h-12 text-xl focus:outline-none"
              style={{ backgroundColor: '#ffe6e6', color: '#1e293b' }}
              onClick={() => setChatOpen(true)}
              aria-label="Open Brat AI Chat"
            >
              <ArrowUp size={22} />
            </button>
          )}
          {chatOpen && (
            <div className="w-80 max-w-[95vw] bg-white dark:bg-gray-900 rounded-2xl flex flex-col overflow-hidden animate-fadein shadow-xl border border-gray-200 dark:border-gray-800">
              {/* Chat header with Brat AI label */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100/80 dark:bg-gray-800/80">
                <span className="font-semibold text-gray-900 dark:text-white">Brat AI</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChatFullscreen(true)}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl focus:outline-none"
                    aria-label="Fullscreen"
                    title="Fullscreen"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M20 16v2a2 2 0 01-2 2h-2M16 4h2a2 2 0 012 2v2M8 20H6a2 2 0 01-2-2v-2" /></svg>
                  </button>
                  <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl focus:outline-none ml-1">×</button>
                </div>
              </div>
              {/* Chat messages */}
              <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-transparent">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-fadein mb-1`}>
                    <span
                      className={
                        msg.role === 'user'
                          ? 'inline-block bg-white text-gray-900 rounded-xl px-3 py-1 max-w-[80%] text-right'
                          : 'inline-block text-gray-900 rounded-xl px-3 py-1 max-w-[80%] text-left'
                      }
                      style={msg.role === 'ai' ? { backgroundColor: '#ffe6e6' } : {}}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start w-full animate-fadein mb-1">
                    <span className="inline-block rounded-xl px-3 py-1 max-w-[80%] text-left" style={{ backgroundColor: '#ffe6e6', color: '#1e293b' }}>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1" style={{ animationDelay: '0ms' }}></span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1" style={{ animationDelay: '100ms' }}></span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Input area */}
              <form className="flex bg-transparent" onSubmit={e => { e.preventDefault(); handleSendChat(); }}>
                <input
                  ref={chatInputRef}
                  className="flex-1 px-3 py-2 bg-transparent text-gray-900 dark:text-white outline-none border-none focus:outline-none"
                  type="text"
                  placeholder="Ask Brat AI..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
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

export default function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') === 'dark' ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches && !window.localStorage.getItem('theme'));
    }
    return false;
  });
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/cookies" element={<Cookies darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/terms" element={<Terms darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </Router>
  );
}