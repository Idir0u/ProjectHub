import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => navigate('/dashboard')}>
          📋 ProjectHub
        </a>
      </div>
      <div className="flex-none gap-2">
        <span className="text-sm mr-2 hidden md:block">Welcome, {user?.email}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-xl">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span>{user?.email}</span>
            </li>
            <li><a onClick={() => navigate('/dashboard')}>Dashboard</a></li>
            <li><a onClick={handleLogout} className="text-error">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
