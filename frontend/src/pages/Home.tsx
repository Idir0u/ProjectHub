import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8">
        <div className="flex-1">
          <a className="flex items-center gap-2 text-xl font-bold">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ProjectHub</span>
          </a>
        </div>
        <div className="flex-none gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="badge badge-primary badge-lg">Task Management Reimagined</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Manage Projects,<br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Deliver Results
              </span>
            </h1>
            <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
              Streamline your workflow with powerful project management tools. 
              Track tasks, monitor progress, and collaborate seamlessly.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                Start Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="card bg-base-200 border border-base-300 hover:shadow-xl transition-all duration-300 group">
              <div className="card-body">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl">Smart Organization</h3>
                <p className="text-base-content/70">
                  Organize projects with intuitive folder structures and custom labels
                </p>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300 hover:shadow-xl transition-all duration-300 group">
              <div className="card-body">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="card-title text-xl">Task Tracking</h3>
                <p className="text-base-content/70">
                  Create, assign, and track tasks with due dates and priorities
                </p>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300 hover:shadow-xl transition-all duration-300 group">
              <div className="card-body">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl">Progress Insights</h3>
                <p className="text-base-content/70">
                  Real-time analytics and progress tracking for all your projects
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl mt-16 w-full bg-base-200 border border-base-300">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-title">Active Users</div>
              <div className="stat-value text-primary">1K+</div>
              <div className="stat-desc">Growing every day</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-title">Projects Completed</div>
              <div className="stat-value text-secondary">5K+</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="stat-title">Tasks Managed</div>
              <div className="stat-value text-accent">50K+</div>
              <div className="stat-desc">Across all projects</div>
            </div>
          </div>

          {/* Demo Section */}
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 mt-16">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold mb-2">Try it now with demo credentials</h3>
              <p className="text-base-content/70 mb-6">Experience the full functionality instantly</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-base-100 rounded-lg p-4 border border-base-300">
                  <div className="badge badge-primary mb-2">Admin</div>
                  <p className="font-mono text-sm">admin@projecthub.com</p>
                  <p className="font-mono text-sm">admin123</p>
                </div>
                <div className="bg-base-100 rounded-lg p-4 border border-base-300">
                  <div className="badge badge-secondary mb-2">User</div>
                  <p className="font-mono text-sm">user@projecthub.com</p>
                  <p className="font-mono text-sm">user123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 border-t border-base-300 mt-20">
        <aside>
          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="font-bold text-lg">ProjectHub</p>
          <p className="text-base-content/70">Professional Task Management Solution</p>
          <p className="text-sm text-base-content/50">© 2025 ProjectHub. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
};

export default Home;
