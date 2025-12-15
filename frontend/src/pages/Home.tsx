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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="navbar bg-base-100/10 backdrop-blur-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-white">📋 ProjectHub</a>
        </div>
        <div className="flex-none gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-white"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
          <button className="btn btn-outline btn-sm text-white mr-2" onClick={() => navigate('/register')}>
            Sign Up
          </button>
          <button className="btn btn-ghost text-white" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>

      <div className="hero min-h-[calc(100vh-64px)]">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold text-white mb-6">
              Welcome to ProjectHub
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Your all-in-one task management solution
            </p>
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              Organize your projects, manage tasks efficiently, and track progress in real-time. 
              Built with modern technologies for a seamless experience.
            </p>

            <div className="flex gap-4 justify-center">
              <button className="btn btn-lg btn-primary" onClick={() => navigate('/login')}>
                Get Started
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="card-title">Project Management</h3>
                  <p>Create and organize multiple projects with ease</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="card-title">Task Tracking</h3>
                  <p>Add, complete, and manage tasks within your projects</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="card-title">Progress Monitoring</h3>
                  <p>Track completion rates with visual progress indicators</p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-6 bg-base-100/20 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Demo Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                <div>
                  <p className="font-semibold">Admin Account</p>
                  <p className="text-sm">admin@projecthub.com / admin123</p>
                </div>
                <div>
                  <p className="font-semibold">User Account</p>
                  <p className="text-sm">user@projecthub.com / user123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
