export default function Dashboard({ user }) {
  return (
    <div className="page">
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}! You are logged in as <strong>{user?.role}</strong>.</p>
      <div className="card" style={{ marginTop: '1rem' }}>
        <p>This is a public (but protected) page for all authenticated users.</p>
      </div>
    </div>
  );
}