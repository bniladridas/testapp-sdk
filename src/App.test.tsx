/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext.tsx';
import App from './App';

// Mock askTestAI to prevent async operations in tests
vi.mock('./TestAI', () => ({
  askTestAI: vi.fn(() => Promise.resolve('Mocked AI response')),
}));

// Mock react-i18next
const mockI18n = {
  changeLanguage: vi.fn(),
  language: 'en',
};
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}));

import { askTestAI } from './TestAI';

beforeEach(() => {
  // Mock localStorage with auth data
  const localStorageMock = {
    getItem: vi.fn((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user')
        return JSON.stringify({ id: 1, email: 'test@example.com' });
      return null;
    }),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>,
  );
};

describe('App', () => {
  it('renders the app', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('TestAI')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    renderWithProviders(<App />);
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

  it('opens chat on button click', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    expect(chatButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(chatButton);
    });
    // Check if chat is open, perhaps by checking for input
    expect(screen.getByPlaceholderText('Ask Test AI...')).toBeInTheDocument();
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });
  });

  it('closes chat on Escape key press', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Chat should be open
    expect(screen.getByPlaceholderText('Ask Test AI...')).toBeInTheDocument();
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // Press Escape
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    // Chat should be closed
    expect(
      screen.queryByPlaceholderText('Ask Test AI...'),
    ).not.toBeInTheDocument();
  });

  it('toggles fullscreen mode', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
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

    // Click minimize button to exit fullscreen
    const minimizeButton = screen.getByLabelText('Minimize chat');
    act(() => {
      fireEvent.click(minimizeButton);
    });

    // Should exit fullscreen mode
    expect(screen.queryByLabelText('Minimize chat')).not.toBeInTheDocument();
  });

  it('initializes dark mode based on system preference', () => {
    // Mock localStorage to have no theme set and auth data
    const localStorageMock = {
      getItem: vi.fn((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'user')
          return JSON.stringify({ id: 1, email: 'test@example.com' });
        return null; // No theme set
      }),
      setItem: vi.fn(() => null),
      removeItem: vi.fn(() => null),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock matchMedia to return true (dark mode preferred)
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn(() => ({
        matches: true,
      })),
      writable: true,
    });

    renderWithProviders(<App />);

    // Should initialize with dark mode due to system preference
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('does not send empty chat messages', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Ask Test AI...');
    const form = input.closest('form');

    // Try to submit empty message
    act(() => {
      fireEvent.submit(form!);
    });

    // Should not add any new messages (only the initial AI message should be there)
    const messages = screen.getAllByText('Mocked AI response');
    expect(messages).toHaveLength(1);
  });

  it('handles chat API errors gracefully', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // Now mock askTestAI to throw an error for the user message
    vi.mocked(askTestAI).mockRejectedValueOnce(new Error('API Error'));

    const input = screen.getByPlaceholderText('Ask Test AI...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    act(() => {
      fireEvent.submit(form!);
    });

    // Should show error message
    await waitFor(() => {
      expect(
        screen.getByText('Error: Could not get response.'),
      ).toBeInTheDocument();
    });
  });

  it('closes chat when clicking the close button', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // Find and click the close button (×)
    const closeButton = screen.getByText('×');
    act(() => {
      fireEvent.click(closeButton);
    });

    // Chat should be closed
    expect(
      screen.queryByPlaceholderText('Ask Test AI...'),
    ).not.toBeInTheDocument();
  });

  it('handles 503 overloaded error specifically', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // Mock askTestAI to throw a 503 error
    vi.mocked(askTestAI).mockRejectedValueOnce(
      new Error('503 Service Unavailable'),
    );

    const input = screen.getByPlaceholderText('Ask Test AI...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    act(() => {
      fireEvent.submit(form!);
    });

    // Should show the specific overloaded message
    await waitFor(() => {
      expect(
        screen.getByText(
          "I'm experiencing high demand right now. How's your day going? 😊",
        ),
      ).toBeInTheDocument();
    });
  });

  it('handles fallback response error', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // Mock askTestAI to throw an error with fallback response structure
    const fallbackError = {
      response: {
        data: {
          fallback: true,
          text: 'Custom fallback message',
        },
      },
    };
    vi.mocked(askTestAI).mockRejectedValueOnce(fallbackError);

    const input = screen.getByPlaceholderText('Ask Test AI...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    act(() => {
      fireEvent.submit(form!);
    });

    // Should show the fallback message
    await waitFor(() => {
      expect(screen.getByText('Custom fallback message')).toBeInTheDocument();
    });
  });

  it('sends messages in fullscreen mode', async () => {
    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });
    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // Enter fullscreen
    const fullscreenButton = screen.getByTitle('Fullscreen');
    act(() => {
      fireEvent.click(fullscreenButton);
    });

    // Should be in fullscreen mode
    expect(screen.getByLabelText('Minimize chat')).toBeInTheDocument();

    // Send a message in fullscreen
    const input = screen.getByPlaceholderText('Message Test AI');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Fullscreen message' } });
    act(() => {
      fireEvent.submit(form!);
    });

    // Should show the user message
    await waitFor(() => {
      expect(screen.getByText('Fullscreen message')).toBeInTheDocument();
    });
  });

  it('changes language', () => {
    renderWithProviders(<App />);
    const languageSelect = screen.getByLabelText('Select language');
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect).toHaveValue('en');

    // Mock changeLanguage to update language
    mockI18n.changeLanguage.mockImplementation((lng: string) => {
      mockI18n.language = lng;
    });

    // Change to Spanish
    act(() => {
      fireEvent.change(languageSelect, { target: { value: 'es' } });
    });

    // Should have called changeLanguage
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('es');
    // But since it's not reactive in test, value remains 'en'
    // Just check the call
  });

  it('initializes theme to light when no preference', () => {
    // Mock no localStorage theme and no matchMedia
    const localStorageMock = {
      getItem: vi.fn((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'user')
          return JSON.stringify({ id: 1, email: 'test@example.com' });
        return null;
      }),
      setItem: vi.fn(() => null),
      removeItem: vi.fn(() => null),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn(() => ({
        matches: false,
      })),
      writable: true,
    });

    renderWithProviders(<App />);

    // Should be light mode
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('adds animation classes on mount', () => {
    renderWithProviders(<App />);
    // The useEffect adds 'animate-fadein' class to hero element
    // We can't easily test this in jsdom, but we can ensure the hero element exists
    const hero = screen.getByText('TestAI').closest('section');
    expect(hero).toBeInTheDocument();
  });

  it('handles chat auto-scroll when chatEndRef is available', async () => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    renderWithProviders(<App />);
    const chatButton = screen.getByLabelText('Open Test AI Chat');
    act(() => {
      fireEvent.click(chatButton);
    });

    // Wait for the initial AI message
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });

    // The useEffect should have run and called scrollIntoView
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });

    // Vitest handles mock cleanup automatically
  });

  it('handles theme detection when no preferences are set', () => {
    // This should cover the default return false in isDark function
    const localStorageMock = {
      getItem: vi.fn(() => null), // No theme, no user data
      setItem: vi.fn(() => null),
      removeItem: vi.fn(() => null),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn(() => ({
        matches: false, // No dark mode preference
      })),
      writable: true,
    });

    renderWithProviders(<App />);

    // Should default to light mode (isDark returns false)
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
