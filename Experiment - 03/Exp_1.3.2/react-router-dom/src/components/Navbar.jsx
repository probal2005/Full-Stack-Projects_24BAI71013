import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-brand">RBAC App</Link>
      </div>
      <div className="nav-center">
        <Link to="/dashboard">Dashboard</Link>
        {/* Conditionally show links based on role */}
        {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
        {(user?.role === 'admin' || user?.role === 'editor') && (
          <Link to="/editor">Editor Panel</Link>
        )}
        {/* Viewer can see a restricted page */}
        <Link to="/viewer">Viewer Zone</Link>
      </div>
      <div className="nav-right">
        <span className="user-role">Role: <strong>{user?.role || 'Guest'}</strong></span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}