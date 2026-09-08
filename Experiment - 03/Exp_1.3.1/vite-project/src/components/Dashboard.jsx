import { useState, useMemo } from 'react';
import { getTokenParts } from '../utils/jwtHelper';

export default function Dashboard({ user, token, onLogout }) {
  const [showToken, setShowToken] = useState(false);
  const tokenParts = useMemo(() => getTokenParts(token), [token]);
  const initials = useMemo(() => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }, [user]);

  return (
    <div className="card">
      <div className="dashboard-header">
        <div className="user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <div className="name">{user?.name || 'User'}</div>
            <div className="email">{user?.email || '—'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Sign out →</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Role</div>
          <div className="value" style={{ textTransform: 'capitalize' }}>{user?.role || '—'}</div>
        </div>
        <div className="stat-card">
          <div className="label">User ID</div>
          <div className="value small">#{user?.sub || '—'}</div>
        </div>
      </div>

      <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>✅</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Authenticated via JWT</div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              Stateless authentication active — token stored in localStorage
            </div>
          </div>
        </div>
      </div>

      <details className="token-section" open={showToken}>
        <summary onClick={() => setShowToken(!showToken)}>
          {showToken ? '▼' : '▶'} View JWT Token Details
        </summary>
        <div className="token-display">{token}</div>
        {tokenParts && (
          <div className="token-parts">
            <div className="token-part">
              <div className="part-label">Header</div>
              <div className="part-value" style={{ fontSize: '0.55rem' }}>
                {tokenParts.header.slice(0, 20)}…
              </div>
            </div>
            <div className="token-part">
              <div className="part-label">Payload</div>
              <div className="part-value" style={{ fontSize: '0.55rem' }}>
                {tokenParts.payload.slice(0, 20)}…
              </div>
            </div>
            <div className="token-part">
              <div className="part-label">Signature</div>
              <div className="part-value" style={{ fontSize: '0.55rem' }}>
                {tokenParts.signature}
              </div>
            </div>
          </div>
        )}
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
          <strong>Payload claims:</strong>{' '}
          {user && Object.entries(user).map(([k, v]) =>
            `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`
          ).join(' · ')}
        </div>
      </details>
    </div>
  );
}