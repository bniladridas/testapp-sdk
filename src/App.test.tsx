import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn((key: string) => {
      if (key === 'bratui_survey_done') return '1';
      return null;
    }),
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
    expect(screen.getByText('Project')).toBeInTheDocument();
  });
});
