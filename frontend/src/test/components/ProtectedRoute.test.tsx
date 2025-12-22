import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import * as AuthContext from '../../context/AuthContext';

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestComponent = () => <div>Protected Content</div>;

  const renderWithAuthState = (isAuthenticated: boolean) => {
    // Mock the useAuth hook
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: isAuthenticated ? { id: 1, email: 'test@example.com' } : null,
      token: isAuthenticated ? 'fake-token' : null,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated,
    });

    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children when authenticated', () => {
    renderWithAuthState(true);
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderWithAuthState(false);
    
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('allows access with valid token', () => {
    renderWithAuthState(true);
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('prevents access without token', () => {
    renderWithAuthState(false);
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
