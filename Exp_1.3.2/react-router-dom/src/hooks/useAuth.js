import { useState, useEffect, useCallback } from 'react';
import { getStoredToken, setStoredToken, getUserFromToken, login as apiLogin, logout as apiLogout } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(() => {
    const stored = getStoredToken();
    if (stored) {
      const payload = getUserFromToken(stored);
      if (payload) {
        setUser(payload);
        setToken(stored);
        setLoading(false);
        return;
      } else {
        setStoredToken(null);
      }
    }
    setUser(null);
    setToken(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      setStoredToken(result.token);
      const payload = getUserFromToken(result.token);
      setUser(payload);
      setToken(result.token);
      setLoading(false);
      return { success: true, user: payload };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };
}