import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import EditorPanel from './components/EditorPanel';
import ViewerPanel from './components/ViewerPanel';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { useState } from 'react';
import './index.css';

function App() {
  const { user, loading, login, logout, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoginError(null);
    setLoginLoading(true);
    const result = await login(email, password);
    setLoginLoading(false);
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // If not authenticated, show login only on /login route, but we can keep it simple: always show login if not auth
  // We'll render the router and let ProtectedRoute handle redirection.

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : 
            <Login onLogin={handleLogin} loading={loginLoading || loading} error={loginError} />
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/editor" element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'editor']}>
              <EditorPanel />
            </ProtectedRoute>
          } />
          <Route path="/viewer" element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'editor', 'viewer']}>
              <ViewerPanel />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;