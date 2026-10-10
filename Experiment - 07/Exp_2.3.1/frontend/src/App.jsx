import { useEffect, useState } from "react";

import {
  ShieldCheck,
  LockKeyhole,
  UserRound,
  Users,
  LogOut,
  KeyRound,
  Server,
  CheckCircle2,
  XCircle,
  Activity,
  Database,
  Terminal,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw
} from "lucide-react";

const API = "http://localhost:8080/api";

function App() {

  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("security_user");

    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("security_token") || ""
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {

    if (user) {
      localStorage.setItem(
        "security_user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("security_user");
    }

  }, [user]);

  async function authenticate() {

    setLoading(true);
    setMessage(null);

    try {

      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/register";

      const response = await fetch(
        API + endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Authentication failed"
        );
      }

      localStorage.setItem(
        "security_token",
        data.token
      );

      setToken(data.token);

      setUser({
        username: data.username,
        role: data.role
      });

      setMessage({
        type: "success",
        text: data.message
      });

    } catch (error) {

      setMessage({
        type: "error",
        text: error.message
      });

    } finally {
      setLoading(false);
    }
  }

  function logout() {

    localStorage.removeItem("security_token");
    localStorage.removeItem("security_user");

    setToken("");
    setUser(null);
    setApiResult(null);
    setMessage(null);
  }

  async function callApi(path, method = "GET") {

    setApiResult(null);

    try {

      const response = await fetch(
        API + path,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setApiResult({
        status: response.status,
        success: response.ok,
        data
      });

    } catch (error) {

      setApiResult({
        status: 0,
        success: false,
        data: {
          error: error.message
        }
      });
    }
  }

  if (!user) {

    return (
      <div className="app">

        <div className="background-grid" />

        <header className="topbar">

          <div className="brand">

            <div className="brand-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <strong>SecureAPI</strong>
              <span>Experiment 2.3.1</span>
            </div>

          </div>

          <div className="security-pill">
            <span className="pulse" />
            Spring Security
          </div>

        </header>

        <main className="auth-layout">

          <section className="hero">

            <div className="eyebrow">
              <Sparkles size={15} />
              BACKEND SECURITY LAB
            </div>

            <h1>
              Secure your APIs
              <span> with JWT.</span>
            </h1>

            <p>
              A modern demonstration of JWT authentication,
              Spring Security and role-based access control.
            </p>

            <div className="security-list">

              <SecurityItem
                icon={<KeyRound size={18} />}
                title="JWT Authentication"
                text="Stateless token-based security"
              />

              <SecurityItem
                icon={<Users size={18} />}
                title="RBAC"
                text="USER and ADMIN role protection"
              />

              <SecurityItem
                icon={<LockKeyhole size={18} />}
                title="Method Security"
                text="@PreAuthorize endpoint protection"
              />

            </div>

          </section>

          <section className="auth-card">

            <div className="card-heading">

              <div className="card-icon">
                <LockKeyhole size={22} />
              </div>

              <div>
                <h2>
                  {mode === "login"
                    ? "Welcome back"
                    : "Create account"}
                </h2>

                <p>
                  {mode === "login"
                    ? "Sign in to access protected APIs."
                    : "Register a USER account."}
                </p>
              </div>

            </div>

            {message && (
              <div
                className={
                  message.type === "success"
                    ? "alert success"
                    : "alert error"
                }
              >
                {message.type === "success"
                  ? <CheckCircle2 size={17} />
                  : <XCircle size={17} />}

                {message.text}
              </div>
            )}

            <label>Username</label>

            <div className="input-wrap">

              <UserRound size={18} />

              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
              />

            </div>

            <label>Password</label>

            <div className="input-wrap">

              <LockKeyhole size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    authenticate();
                  }
                }}
              />

              <button
                className="icon-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? <EyeOff size={17} />
                  : <Eye size={17} />}
              </button>

            </div>

            <button
              className="primary-button"
              onClick={authenticate}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : mode === "login"
                  ? "Sign in securely"
                  : "Create account"}

              {!loading && <KeyRound size={18} />}
            </button>

            <div className="switch-auth">

              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() => {
                  setMode(
                    mode === "login"
                      ? "register"
                      : "login"
                  );

                  setMessage(null);
                }}
              >
                {mode === "login"
                  ? "Create one"
                  : "Sign in"}
              </button>

            </div>

            <div className="demo-box">

              <div className="demo-title">
                <Activity size={15} />
                Demo credentials
              </div>

              <div className="demo-row">
                <span>ADMIN</span>
                <code>admin / admin123</code>
              </div>

              <div className="demo-row">
                <span>USER</span>
                <code>student / student123</code>
              </div>

            </div>

          </section>

        </main>

        <footer>
          Experiment 2.3.1 · JWT Authentication · RBAC · Spring Security
        </footer>

      </div>
    );
  }

  return (
    <Dashboard
      user={user}
      token={token}
      logout={logout}
      callApi={callApi}
      apiResult={apiResult}
    />
  );
}

function SecurityItem({ icon, title, text }) {

  return (
    <div className="security-item">

      <div className="security-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <CheckCircle2
        className="check"
        size={17}
      />

    </div>
  );
}

function Dashboard({
  user,
  token,
  logout,
  callApi,
  apiResult
}) {

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="brand sidebar-brand">

          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <strong>SecureAPI</strong>
            <span>Security Lab</span>
          </div>

        </div>

        <div className="nav-section">

          <span>SECURITY</span>

          <button className="nav-item active">
            <Activity size={18} />
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              callApi("/user/profile")
            }
          >
            <UserRound size={18} />
            My Profile
          </button>

          {isAdmin && (
            <>
              <span className="admin-label">
                ADMIN
              </span>

              <button
                className="nav-item"
                onClick={() =>
                  callApi("/admin/users")
                }
              >
                <Users size={18} />
                User Management
              </button>

              <button
                className="nav-item"
                onClick={() =>
                  callApi("/admin/system", "DELETE")
                }
              >
                <Server size={18} />
                System Action
              </button>
            </>
          )}

        </div>

        <div className="sidebar-bottom">

          <div className="user-mini">

            <div className="avatar">
              {user.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{user.username}</strong>
              <span>{user.role}</span>
            </div>

          </div>

          <button
            className="logout"
            onClick={logout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      <main className="main-content">

        <header className="dashboard-header">

          <div>
            <div className="eyebrow">
              SECURITY CONSOLE
            </div>

            <h1>
              Good to see you, {user.username}.
            </h1>

            <p>
              Monitor authentication and test
              protected endpoints.
            </p>
          </div>

          <div className="role-badge">

            <ShieldCheck size={17} />

            {user.role}

          </div>

        </header>

        <section className="stats-grid">

          <Stat
            icon={<KeyRound />}
            title="Authentication"
            value="JWT"
            description="Stateless"
          />

          <Stat
            icon={<Users />}
            title="Access Control"
            value="RBAC"
            description="Role-based"
          />

          <Stat
            icon={<LockKeyhole />}
            title="Session"
            value="STATELESS"
            description="No server session"
          />

          <Stat
            icon={<Database />}
            title="Database"
            value="H2"
            description="Persistent local DB"
          />

        </section>

        <section className="content-grid">

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Protected endpoints</h2>
                <p>
                  Test the Spring Security filter chain.
                </p>
              </div>

              <Terminal size={19} />

            </div>

            <div className="endpoint-list">

              <Endpoint
                method="GET"
                path="/api/user/profile"
                access="USER + ADMIN"
                onClick={() =>
                  callApi("/user/profile")
                }
              />

              <Endpoint
                method="GET"
                path="/api/user/dashboard"
                access="USER + ADMIN"
                onClick={() =>
                  callApi("/user/dashboard")
                }
              />

              <Endpoint
                method="GET"
                path="/api/admin/dashboard"
                access="ADMIN ONLY"
                disabled={!isAdmin}
                onClick={() =>
                  callApi("/admin/dashboard")
                }
              />

              <Endpoint
                method="GET"
                path="/api/admin/users"
                access="ADMIN ONLY"
                disabled={!isAdmin}
                onClick={() =>
                  callApi("/admin/users")
                }
              />

              <Endpoint
                method="DELETE"
                path="/api/admin/system"
                access="ADMIN ONLY"
                disabled={!isAdmin}
                onClick={() =>
                  callApi("/admin/system", "DELETE")
                }
              />

            </div>

          </div>

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Security status</h2>
                <p>
                  Current authentication state.
                </p>
              </div>

              <CheckCircle2 size={19} />

            </div>

            <div className="status-list">

              <Status
                title="JWT token"
                value="Valid"
              />

              <Status
                title="Authentication"
                value="Authenticated"
              />

              <Status
                title="Role"
                value={user.role}
              />

              <Status
                title="Method security"
                value="@PreAuthorize"
              />

            </div>

            <div className="token-preview">

              <div className="token-title">
                <KeyRound size={15} />
                JWT Token
              </div>

              <code>
                {token.substring(0, 42)}...
              </code>

            </div>

          </div>

        </section>

        {apiResult && (

          <section className="result-panel">

            <div className="result-header">

              <div>
                <h2>API Response</h2>

                <span
                  className={
                    apiResult.success
                      ? "status-ok"
                      : "status-bad"
                  }
                >
                  {apiResult.success
                    ? "SUCCESS"
                    : "ERROR"}{" "}
                  · HTTP {apiResult.status}
                </span>
              </div>

              <button
                className="refresh-button"
                onClick={() =>
                  setTimeout(() => {}, 0)
                }
              >
                <RefreshCw size={16} />
              </button>

            </div>

            <pre>
              {JSON.stringify(
                apiResult.data,
                null,
                2
              )}
            </pre>

          </section>

        )}

      </main>

    </div>
  );
}

function Stat({
  icon,
  title,
  value,
  description
}) {

  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>

    </div>
  );
}

function Endpoint({
  method,
  path,
  access,
  onClick,
  disabled
}) {

  return (
    <button
      className={
        disabled
          ? "endpoint disabled"
          : "endpoint"
      }
      disabled={disabled}
      onClick={onClick}
    >

      <span
        className={`method ${method.toLowerCase()}`}
      >
        {method}
      </span>

      <code>{path}</code>

      <span className="access">
        {access}
      </span>

      <span className="arrow">
        →
      </span>

    </button>
  );
}

function Status({ title, value }) {

  return (
    <div className="status-row">

      <div className="status-dot">
        <CheckCircle2 size={15} />
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

    </div>
  );
}

export default App;
