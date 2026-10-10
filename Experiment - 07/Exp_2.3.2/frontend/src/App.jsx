import React, { useEffect, useState } from 'react'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserRound,
  Vault,
  Zap
} from 'lucide-react'

const API = 'http://localhost:8081/api'

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('exp232_access') || ''
  )

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('exp232_refresh') || ''
  )

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('exp232_user') || 'null')
  )

  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [credentials, setCredentials] = useState({
    provider: 'Google OAuth',
    clientId: 'client-demo-123456',
    clientSecret: 'super-secret-client-value',
    accessToken: 'oauth-access-demo-value',
    refreshToken: 'oauth-refresh-demo-value'
  })

  const [vaultItems, setVaultItems] = useState([])
  const [showSecrets, setShowSecrets] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)

  const authenticated = Boolean(accessToken && user)

  useEffect(() => {
    if (authenticated) {
      loadVault()
    }
  }, [authenticated])

  function persistSession(data) {
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)

    const sessionUser = {
      username: data.username,
      role: data.role
    }

    setUser(sessionUser)

    localStorage.setItem('exp232_access', data.accessToken)
    localStorage.setItem('exp232_refresh', data.refreshToken)
    localStorage.setItem(
      'exp232_user',
      JSON.stringify(sessionUser)
    )
  }

  function clearSession() {
    setAccessToken('')
    setRefreshToken('')
    setUser(null)
    setVaultItems([])

    localStorage.removeItem('exp232_access')
    localStorage.removeItem('exp232_refresh')
    localStorage.removeItem('exp232_user')
  }

  async function authenticate() {
    setLoading(true)
    setMessage('')
    setError('')

    const username =
      document.getElementById('username')?.value || ''

    const password =
      document.getElementById('password')?.value || ''

    const endpoint =
      mode === 'login'
        ? '/auth/login'
        : '/auth/register'

    try {
      const response = await fetch(API + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Request failed'
        )
      }

      if (mode === 'register') {
        setMessage('Account created. You can now sign in.')
        setMode('login')
      } else {
        persistSession(data)
        setMessage('Secure session established.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        API + '/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        clearSession()
        throw new Error(
          data.message || 'Refresh failed'
        )
      }

      persistSession(data)

      setMessage(
        'Access token refreshed and refresh token rotated.'
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      if (refreshToken) {
        await fetch(API + '/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken
          })
        })
      }
    } finally {
      clearSession()
      setMessage('Session revoked.')
    }
  }

  async function loadVault() {
    if (!accessToken) return

    try {
      const response = await fetch(
        API + '/credentials',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (response.status === 401) {
        return
      }

      const data = await response.json()

      if (response.ok) {
        setVaultItems(data)
      }
    } catch {
      // UI remains usable if vault loading fails.
    }
  }

  async function saveCredential(event) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        API + '/credentials',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(credentials)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to store credential'
        )
      }

      setMessage(
        'Credential encrypted with AES-256-GCM and stored.'
      )

      await loadVault()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function callProtectedApi() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        API + '/security/dashboard',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      const data = await response.json()

      setApiResponse({
        status: response.status,
        data
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <AuthScreen
        mode={mode}
        setMode={setMode}
        authenticate={authenticate}
        loading={loading}
        message={message}
        error={error}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <strong>SecureVault</strong>
            <span>Experiment 2.3.2</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="section-label">SECURITY MODULES</span>

          <div className="nav-item active">
            <Activity size={18} />
            Security Overview
          </div>

          <div className="nav-item">
            <LockKeyhole size={18} />
            AES Encryption
          </div>

          <div className="nav-item">
            <RefreshCw size={18} />
            Token Lifecycle
          </div>

          <div className="nav-item">
            <Vault size={18} />
            Credential Vault
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">
              <UserRound size={18} />
            </div>

            <div>
              <strong>{user.username}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              FULL-STACK SECURITY LAB
            </span>

            <h1>
              Encryption & Token Lifecycle
            </h1>

            <p>
              Protect sensitive data and manage secure sessions.
            </p>
          </div>

          <div className="secure-status">
            <span className="status-dot" />
            SECURE SESSION
          </div>
        </header>

        {(message || error) && (
          <div className={error ? 'alert error' : 'alert success'}>
            {error
              ? <>{error}</>
              : <><CheckCircle2 size={17} /> {message}</>}
          </div>
        )}

        <section className="hero-card">
          <div>
            <div className="hero-icon">
              <Sparkles size={25} />
            </div>

            <h2>
              Your sensitive data stays protected.
            </h2>

            <p>
              OAuth credentials are encrypted using
              AES-256-GCM before they reach the database,
              while authentication uses short-lived access
              tokens and rotating refresh tokens.
            </p>
          </div>

          <div className="hero-metrics">
            <Metric
              label="Encryption"
              value="AES-256-GCM"
            />

            <Metric
              label="Access Token"
              value="15 min"
            />

            <Metric
              label="Refresh Token"
              value="7 days"
            />
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            icon={<LockKeyhole />}
            title="AES Encryption"
            value="ACTIVE"
            text="Authenticated encryption"
          />

          <StatCard
            icon={<KeyRound />}
            title="Access Token"
            value="JWT"
            text="Short-lived bearer token"
          />

          <StatCard
            icon={<RefreshCw />}
            title="Refresh Rotation"
            value="ON"
            text="Old token revoked"
          />

          <StatCard
            icon={<Database />}
            title="Credential Vault"
            value={vaultItems.length}
            text="Encrypted records"
          />
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  AES-256-GCM
                </span>
                <h3>Secure Credential Vault</h3>
              </div>

              <LockKeyhole size={20} />
            </div>

            <p className="panel-description">
              Enter demo OAuth credentials. The backend
              encrypts every sensitive value before storing it.
            </p>

            <form onSubmit={saveCredential}>
              <div className="form-grid">
                <Field
                  label="Provider"
                  value={credentials.provider}
                  onChange={value =>
                    setCredentials({
                      ...credentials,
                      provider: value
                    })
                  }
                />

                <Field
                  label="Client ID"
                  value={credentials.clientId}
                  onChange={value =>
                    setCredentials({
                      ...credentials,
                      clientId: value
                    })
                  }
                />

                <Field
                  label="Client Secret"
                  value={credentials.clientSecret}
                  secret={!showSecrets}
                  onChange={value =>
                    setCredentials({
                      ...credentials,
                      clientSecret: value
                    })
                  }
                />

                <Field
                  label="OAuth Access Token"
                  value={credentials.accessToken}
                  secret={!showSecrets}
                  onChange={value =>
                    setCredentials({
                      ...credentials,
                      accessToken: value
                    })
                  }
                />

                <Field
                  label="OAuth Refresh Token"
                  value={credentials.refreshToken}
                  secret={!showSecrets}
                  onChange={value =>
                    setCredentials({
                      ...credentials,
                      refreshToken: value
                    })
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowSecrets(!showSecrets)
                  }
                >
                  {showSecrets
                    ? <EyeOff size={17} />
                    : <Eye size={17} />}
                  {showSecrets
                    ? 'Hide secrets'
                    : 'Show secrets'}
                </button>

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={loading}
                >
                  <Save size={17} />
                  Encrypt & Store
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  TOKEN LIFECYCLE
                </span>
                <h3>Session Controls</h3>
              </div>

              <RefreshCw size={20} />
            </div>

            <div className="token-flow">
              <TokenStep
                number="01"
                title="Access Token"
                text="JWT bearer credential"
                badge="15 MIN"
              />

              <div className="flow-line" />

              <TokenStep
                number="02"
                title="Refresh Token"
                text="Secure session continuation"
                badge="7 DAYS"
              />

              <div className="flow-line" />

              <TokenStep
                number="03"
                title="Rotation"
                text="Previous token revoked"
                badge="ACTIVE"
              />
            </div>

            <button
              className="refresh-btn"
              onClick={refreshAccessToken}
              disabled={loading}
            >
              <RefreshCw size={17} />
              Refresh & Rotate Tokens
            </button>

            <button
              className="api-btn"
              onClick={callProtectedApi}
              disabled={loading}
            >
              <Terminal size={17} />
              Call Protected API
            </button>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  ENCRYPTED DATABASE
                </span>
                <h3>Stored Credentials</h3>
              </div>

              <button
                className="icon-btn"
                onClick={loadVault}
              >
                <RefreshCw size={17} />
              </button>
            </div>

            {vaultItems.length === 0 ? (
              <div className="empty-state">
                <Vault size={30} />
                <strong>No credentials stored</strong>
                <span>
                  Store your first encrypted OAuth credential above.
                </span>
              </div>
            ) : (
              <div className="vault-list">
                {vaultItems.map(item => (
                  <div
                    className="vault-item"
                    key={item.id}
                  >
                    <div className="provider-icon">
                      <KeyRound size={18} />
                    </div>

                    <div className="vault-main">
                      <strong>{item.provider}</strong>
                      <span>
                        Client ID: {item.clientId}
                      </span>
                    </div>

                    <div className="encrypted-badge">
                      <LockKeyhole size={14} />
                      AES-GCM
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel response-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  API INSPECTOR
                </span>
                <h3>Protected Response</h3>
              </div>

              <Zap size={20} />
            </div>

            {apiResponse ? (
              <pre>
                {JSON.stringify(
                  apiResponse,
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="response-empty">
                <Terminal size={28} />
                <span>
                  Call the protected API to inspect
                  the authenticated response.
                </span>
              </div>
            )}
          </div>
        </section>

        <footer>
          <span>
            Experiment 2.3.2
          </span>

          <span>
            AES Encryption • Secure Credential Storage •
            Access & Refresh Tokens
          </span>
        </footer>
      </main>
    </div>
  )
}

function AuthScreen({
  mode,
  setMode,
  authenticate,
  loading,
  message,
  error
}) {
  return (
    <div className="auth-page">
      <div className="auth-glow glow-one" />
      <div className="auth-glow glow-two" />

      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon large">
            <ShieldCheck size={28} />
          </div>

          <div>
            <strong>SecureVault</strong>
            <span>Experiment 2.3.2</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-lock">
              <LockKeyhole size={25} />
            </div>

            <span className="security-pill">
              <span className="status-dot" />
              ENCRYPTED
            </span>
          </div>

          <h1>
            {mode === 'login'
              ? 'Welcome back'
              : 'Create secure account'}
          </h1>

          <p>
            {mode === 'login'
              ? 'Sign in to access your encrypted security workspace.'
              : 'Create an account for the security experiment.'}
          </p>

          {message && (
            <div className="alert success">
              <CheckCircle2 size={17} />
              {message}
            </div>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <div className="auth-fields">
            <label>
              Username
              <input
                id="username"
                defaultValue={
                  mode === 'login'
                    ? 'student'
                    : ''
                }
                placeholder="Enter username"
              />
            </label>

            <label>
              Password
              <input
                id="password"
                type="password"
                defaultValue={
                  mode === 'login'
                    ? 'student123'
                    : ''
                }
                placeholder="Enter password"
              />
            </label>
          </div>

          <button
            className="primary-btn auth-submit"
            onClick={authenticate}
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
                ? 'Sign in securely'
                : 'Create account'}
            <ArrowRight size={17} />
          </button>

          <div className="demo-box">
            <div>
              <UserRound size={16} />
              <span>Demo account</span>
            </div>

            <strong>
              student / student123
            </strong>
          </div>

          <button
            className="switch-auth"
            onClick={() =>
              setMode(
                mode === 'login'
                  ? 'register'
                  : 'login'
              )
            }
          >
            {mode === 'login'
              ? 'Need an account? Register'
              : 'Already registered? Sign in'}
          </button>
        </div>

        <div className="security-features">
          <Feature
            icon={<LockKeyhole />}
            text="AES-256-GCM"
          />

          <Feature
            icon={<Clock3 />}
            text="15m Access Token"
          />

          <Feature
            icon={<RefreshCw />}
            text="Rotating Refresh"
          />
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, text }) {
  return (
    <div className="security-feature">
      {icon}
      <span>{text}</span>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  text
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </div>
  )
}

function TokenStep({
  number,
  title,
  text,
  badge
}) {
  return (
    <div className="token-step">
      <div className="token-number">
        {number}
      </div>

      <div className="token-copy">
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <small>{badge}</small>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  secret
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        value={value}
        type={secret ? 'password' : 'text'}
        onChange={event =>
          onChange(event.target.value)
        }
      />
    </label>
  )
}

export default App
