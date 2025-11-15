/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthContext.tsx';
import { AuthContext } from './AuthContext';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  it('should load user from localStorage on mount', async () => {
    const user = { id: 1, email: 'test@example.com' };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'token';
      if (key === 'user') return JSON.stringify(user);
      return null;
    });

    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(contextValue.user).toEqual(user);
      expect(contextValue.isLoading).toBe(false);
    });
  });

  it('should handle invalid user JSON in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'token';
      if (key === 'user') return 'invalid json';
      return null;
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>{() => null}</AuthContext.Consumer>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error parsing stored user:',
        expect.any(SyntaxError),
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  it('should handle missing user data in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'token';
      // No user data
      return null;
    });

    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(contextValue.user).toBe(null);
      expect(contextValue.isLoading).toBe(false);
    });
  });

  it('should login user', async () => {
    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    const user = { id: 1, email: 'test@example.com' };
    contextValue.login('token123', user);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(user),
    );
    await waitFor(() => {
      expect(contextValue.user).toEqual(user);
    });
  });

  it('should logout user', () => {
    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    contextValue.logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(contextValue.user).toBe(null);
  });
});
