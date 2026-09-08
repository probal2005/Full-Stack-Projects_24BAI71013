import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css'; // we'll add styles

function App() {
  const { user, token, loading, login, logout, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (email, password) => {
  setLoginError(null);
  setLoginLoading(true);
  const result = await login(email, password);
  setLoginLoading(false);
  if (!result.success) {
    setLoginError(result.error);
  } else {
    // You could add a toast here, but we'll rely on the dashboard appearing
    // Optional: show a success message before redirect
  }
};

  if (isAuthenticated && user) {
    return <Dashboard user={user} token={token} onLogout={logout} />;
  }

  return (
    <Login
      onLogin={handleLogin}
      loading={loginLoading || loading}
      error={loginError}
    />
  );
}

export default App;