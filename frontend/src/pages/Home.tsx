import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
        <div className="flex-none">
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
