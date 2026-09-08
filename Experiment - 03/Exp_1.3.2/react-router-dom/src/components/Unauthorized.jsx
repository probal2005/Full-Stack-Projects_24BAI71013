import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <h1 style={{ fontSize: '4rem', color: '#dc2626' }}>403</h1>
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/dashboard" className="btn" style={{ display: 'inline-block', width: 'auto', padding: '0.6rem 1.5rem' }}>
        Go to Dashboard
      </Link>
    </div>
  );
}