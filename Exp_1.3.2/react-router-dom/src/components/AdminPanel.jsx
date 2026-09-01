export default function AdminPanel() {
  return (
    <div className="page">
      <h2>🔒 Admin Panel</h2>
      <div className="card">
        <p>This page is <strong>only</strong> accessible to users with the <code>admin</code> role.</p>
        <p>Admin‑only actions: manage users, view logs, etc.</p>
      </div>
    </div>
  );
}