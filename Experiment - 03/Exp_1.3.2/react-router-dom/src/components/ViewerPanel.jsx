export default function ViewerPanel() {
  return (
    <div className="page">
      <h2>👁️ Viewer Zone</h2>
      <div className="card">
        <p>This page is accessible to all authenticated users (viewers, editors, admins).</p>
        <p>Viewers can only read content.</p>
      </div>
    </div>
  );
}