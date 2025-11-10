/// <reference types="vitest/globals" />
import { describe, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
