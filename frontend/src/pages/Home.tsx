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
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100">
      {/* Navbar */}
      <nav className="navbar bg-base-100/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex-1">
            <a className="flex items-center gap-3 text-xl font-bold cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">
                ProjectHub
              </span>
            </a>
          </div>
          <div className="flex-none gap-3">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 pt-24 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
              <span className="text-sm font-medium text-primary">Now Live</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1]">
              Project Management
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-base-content/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform the way you manage projects. Track tasks, visualize progress, 
              and achieve your goals with an intuitive platform designed for modern teams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate('/register')}
              >
                Start Free Today
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button 
                className="btn btn-outline btn-lg gap-2"
                onClick={() => navigate('/login')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Already have an account?
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="max-w-md mx-auto p-6 bg-base-200 rounded-2xl border border-base-300 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Try it out!</span>
              </div>
              <div className="text-sm text-base-content/70 space-y-1">
                <p><span className="font-medium">Email:</span> demo@projecthub.com</p>
                <p><span className="font-medium">Password:</span> demo123</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-base-content/70">Powerful features to supercharge your productivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2">Task Management</h3>
                <p className="text-base-content/70">
                  Create, organize, and track tasks with ease. Set deadlines and priorities to stay on top of your work.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2">Analytics Dashboard</h3>
                <p className="text-base-content/70">
                  Visualize your progress with detailed analytics. Track completion rates and identify bottlenecks.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2">Smart Search</h3>
                <p className="text-base-content/70">
                  Find anything instantly with powerful search and filtering. Never lose track of important tasks.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card bg-base-100 border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-info/20 to-info/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2">Lightning Fast</h3>
                <p className="text-base-content/70">
                  Built with modern technology for blazing fast performance. Work without interruption.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card bg-base-100 border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2">Secure & Private</h3>
                <p className="text-base-content/70">
                  Your data is encrypted and secure. We take privacy seriously with industry-standard protection.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card bg-base-100 border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-warning/20 to-warning/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2">Customizable</h3>
                <p className="text-base-content/70">
                  Personalize your workspace with themes, layouts, and settings that match your workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-gradient-to-br from-primary to-secondary text-white shadow-2xl">
            <div className="card-body p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold mb-2">99.9%</div>
                  <div className="text-white/80">Uptime</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">10k+</div>
                  <div className="text-white/80">Projects Created</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">50k+</div>
                  <div className="text-white/80">Tasks Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-base-content/70 mb-10">
            Join thousands of teams already managing their projects better with ProjectHub
          </p>
          <button 
            className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => navigate('/register')}
          >
            Create Free Account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 bg-base-100">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ProjectHub
                </span>
              </div>
              <p className="text-base-content/70 max-w-md">
                The modern project management platform built for teams who want to ship faster and better.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-base-content/70">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-base-content/70">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-base-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base-content/60 text-sm">
              © 2025 ProjectHub. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
