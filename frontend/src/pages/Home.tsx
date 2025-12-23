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
      <nav className="navbar bg-base-100/90 backdrop-blur-xl border-b border-base-300 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex-1">
            <a className="flex items-center gap-3 text-xl font-bold cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold text-2xl">
                ProjectHub
              </span>
            </a>
          </div>
          <div className="flex-none gap-3">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm hover:scale-105 transition-transform"
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
            <button className="btn btn-ghost btn-sm hover:bg-base-200" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all" onClick={() => navigate('/register')}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 pt-20 pb-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-8 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Now Available • Free Forever</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              Manage Projects
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-base-content/70 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The all-in-one platform that helps teams organize work, track progress, 
              and ship faster. Simple, powerful, and built for collaboration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <button 
                className="btn btn-primary btn-lg gap-2 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 group px-8"
                onClick={() => navigate('/register')}
              >
                Start Building Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button 
                className="btn btn-outline btn-lg gap-2 hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/login')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
            </div>

            {/* Demo Credentials with enhanced design */}
            <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-info/10 to-info/5 rounded-2xl border border-info/30 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="p-2 bg-info/20 rounded-lg">
                  <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">Try Demo Accounts</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Admin Account */}
                <div className="bg-base-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="badge badge-primary badge-sm">Admin</div>
                    <span className="text-xs text-base-content/60">Full Access</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-base-content/70">Email:</span>
                      <code className="block text-sm bg-base-200 px-2 py-1 rounded mt-1">admin@projecthub.com</code>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-base-content/70">Password:</span>
                      <code className="block text-sm bg-base-200 px-2 py-1 rounded mt-1">admin123</code>
                    </div>
                  </div>
                </div>
                
                {/* User Account */}
                <div className="bg-base-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="badge badge-secondary badge-sm">User</div>
                    <span className="text-xs text-base-content/60">Standard Access</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-base-content/70">Email:</span>
                      <code className="block text-sm bg-base-200 px-2 py-1 rounded mt-1">user@projecthub.com</code>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-base-content/70">Password:</span>
                      <code className="block text-sm bg-base-200 px-2 py-1 rounded mt-1">user123</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 lg:px-8 py-12 border-y border-base-300 bg-base-100/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-base-content/60 mb-8 font-medium">Trusted by teams worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-base-content/30">LOGO</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-semibold text-primary">FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Powerful features designed to help you manage projects effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="card-body">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2 font-bold">Intuitive Task Management</h3>
                <p className="text-base-content/70">
                  Create, assign, and track tasks with drag-and-drop simplicity. Set priorities, deadlines, and dependencies.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="card-body">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2 font-bold">Real-time Analytics</h3>
                <p className="text-base-content/70">
                  Visualize progress with beautiful charts and metrics. Make data-driven decisions with instant insights.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="card-body">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2 font-bold">Team Collaboration</h3>
                <p className="text-base-content/70">
                  Work together seamlessly. Share projects, assign tasks, and collaborate in real-time with your team.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="card-body">
                <div className="w-14 h-14 bg-gradient-to-br from-info to-info/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2 font-bold">Lightning Performance</h3>
                <p className="text-base-content/70">
                  Built with cutting-edge technology for instant loading and smooth interactions. No lag, ever.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="card-body">
                <div className="w-14 h-14 bg-gradient-to-br from-success to-success/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2 font-bold">Enterprise Security</h3>
                <p className="text-base-content/70">
                  Bank-level encryption and security. Your data is protected with industry-leading standards.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="card-body">
                <div className="w-14 h-14 bg-gradient-to-br from-warning to-warning/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="card-title text-xl mb-2 font-bold">Fully Customizable</h3>
                <p className="text-base-content/70">
                  Tailor every aspect to your workflow. Custom fields, themes, and integrations that fit your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="card-body p-12 md:p-16 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Teams Worldwide</h2>
                <p className="text-white/80 text-lg">Join thousands of successful projects</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-2">
                  <div className="text-6xl font-black mb-2 drop-shadow-lg">99.9%</div>
                  <div className="text-white/90 font-medium text-lg">Uptime Guarantee</div>
                  <div className="text-white/70 text-sm">Always available when you need it</div>
                </div>
                <div className="space-y-2">
                  <div className="text-6xl font-black mb-2 drop-shadow-lg">10k+</div>
                  <div className="text-white/90 font-medium text-lg">Active Projects</div>
                  <div className="text-white/70 text-sm">Being managed right now</div>
                </div>
                <div className="space-y-2">
                  <div className="text-6xl font-black mb-2 drop-shadow-lg">50k+</div>
                  <div className="text-white/90 font-medium text-lg">Tasks Completed</div>
                  <div className="text-white/70 text-sm">Goals achieved daily</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-semibold text-primary">GET STARTED TODAY</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Ready to Transform
            <br />
            Your Workflow?
          </h2>
          <p className="text-xl text-base-content/70 mb-12 max-w-2xl mx-auto">
            Join thousands of teams already managing their projects smarter with ProjectHub. 
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn btn-primary btn-lg gap-2 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 group px-8"
              onClick={() => navigate('/register')}
            >
              Create Free Account
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button 
              className="btn btn-outline btn-lg gap-2 hover:scale-105 transition-all"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
          <p className="text-sm text-base-content/60 mt-6">
            ✨ Free forever • No credit card • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 bg-base-100/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  ProjectHub
                </span>
              </div>
              <p className="text-base-content/70 max-w-md mb-6 leading-relaxed">
                The modern project management platform built for teams who want to ship faster, 
                collaborate better, and achieve more together.
              </p>
              <div className="flex gap-3">
                <a href="#" className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Product</h3>
              <ul className="space-y-3 text-base-content/70">
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-base-content/70">
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-base-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base-content/60 text-sm">
              © 2025 ProjectHub. All rights reserved. Made with ❤️ for amazing teams.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
