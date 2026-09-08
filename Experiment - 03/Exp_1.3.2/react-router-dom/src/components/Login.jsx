import { useState } from 'react';

export default function Login({ onLogin, loading, error }) {
  const [email, setEmail] = useState('admin.24bai71013@cuchd.in');
  const [password, setPassword] = useState('a24bai71013');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onLogin(email, password);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="badge">🔐 Experiment 1.3.2</span>
        <h1>RBAC with JWT</h1>
        <p>Sign in with different roles</p>
      </div>

      {error && (
        <div className="error-msg">
          <span>✕</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div className="hint">
        <strong>Demo credentials:</strong><br />
        admin.24bai71013@cuchd.in / a24bai71013 &nbsp;|&nbsp; editor.24bai71013@cuchd.in / e24bai71013 &nbsp;|&nbsp; viewer.24bai71013@cuchd.in / v24bai71013
      </div>
    </div>
  );
}