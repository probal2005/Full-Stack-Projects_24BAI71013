import { useState } from 'react';

export default function Login({ onLogin, loading, error }) {
  const [email, setEmail] = useState('24bai71013@cuchd.in');
  const [password, setPassword] = useState('24BAI71013');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onLogin(email, password);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="badge">🔐 Experiment 1.3.1</span>
        <h1>JWT Authentication</h1>
        <p>Sign in to access your dashboard</p>
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
            placeholder="24bai71013@cuchd.in"
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
            placeholder="24bai71013"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div className="hint">
        <strong>Demo credentials:</strong> 24bai71013@cuchd.in / 24BAI71013
        <br />
        User- 24bai71013@cuchd.in / 24bai71013
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
        </span>
      </div>
    </div>
  );
}