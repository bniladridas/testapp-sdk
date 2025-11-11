/// <reference types="vitest/globals" />
import { describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn(() => ({
      matches: false,
    })),
    writable: true,
  });
});

describe('App', () => {
  it('renders the app', () => {
    render(<App />);
    expect(screen.getByText('TestAI')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    render(<App />);
    const toggleButton = screen.getByLabelText('Toggle dark mode');
    expect(toggleButton).toBeInTheDocument();
    // Initial state
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    // Click to toggle
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('opens chat on button click', () => {
    render(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    expect(chatButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(chatButton);
    });
    // Check if chat is open, perhaps by checking for input
    expect(screen.getByPlaceholderText('Ask Test AI...')).toBeInTheDocument();
  });

  it('closes chat on Escape key press', () => {
    render(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Chat should be open
    expect(screen.getByPlaceholderText('Ask Test AI...')).toBeInTheDocument();

    // Press Escape
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    // Chat should be closed
    expect(
      screen.queryByPlaceholderText('Ask Test AI...'),
    ).not.toBeInTheDocument();
  });

  it('toggles fullscreen mode', () => {
    render(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });

    // Find fullscreen button
    const fullscreenButton = screen.getByTitle('Fullscreen');
    expect(fullscreenButton).toBeInTheDocument();

    // Click fullscreen button
    act(() => {
      fireEvent.click(fullscreenButton);
    });

    // Should be in fullscreen mode - check for minimize button
    expect(screen.getByLabelText('Minimize chat')).toBeInTheDocument();
  });
});
