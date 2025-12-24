import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import * as api from '../../services/api';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API call for InvitationsDropdown
vi.mock('../../services/api');

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock getProjectInvitations to return empty array
    vi.mocked(api.getProjectInvitations).mockResolvedValue({ data: [] } as any);
  });

  const renderNavbar = (isAuthenticated = false) => {
    if (isAuthenticated) {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com', username: 'test' }));
    }

    return render(
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Navbar />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('renders the brand name', () => {
    renderNavbar(true);
    
    expect(screen.getByText('ProjectHub')).toBeInTheDocument();
  });

  it('shows user email when authenticated', async () => {
    renderNavbar(true);
    
    // Wait for user to load from localStorage
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  }); 

  it('shows Dashboard button when authenticated', async () => {
    renderNavbar(true);
    
    // Wait for authentication to complete
    await waitFor(() => {
      const dashboardButtons = screen.getAllByText('Dashboard');
      expect(dashboardButtons.length).toBeGreaterThan(0);
    });
  });

  it('shows logout button when authenticated', async () => {
    renderNavbar(true);
    
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('logs out user when logout is clicked', async () => {
    renderNavbar(true);
    
    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(localStorage.getItem('token')).toBeFalsy();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('has theme toggle button', () => {
    renderNavbar(true);
    
    // Theme toggle should be present
    const themeButton = screen.getByTitle(/Switch to/);
    expect(themeButton).toBeInTheDocument();
  });
});
