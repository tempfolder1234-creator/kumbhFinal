import React, { useState } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ initialMode = "login", onClose, onSuccess }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ username, password });
      } else {
        await signup({ username, email, password });
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal-card sh-auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sh-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="sh-auth-tabs">
          <button
            className={`sh-auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            <LogIn size={16} />
            <span>Log In</span>
          </button>
          <button
            className={`sh-auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}
          >
            <UserPlus size={16} />
            <span>Sign Up</span>
          </button>
        </div>

        <div className="sh-auth-header">
          <h3>{mode === "login" ? "Welcome back to StayHub" : "Join StayHub"}</h3>
          <p>
            {mode === "login" 
              ? "Access your reservations, saved stays, and host tools"
              : "Explore exceptional villas, cottages, and retreats"}
          </p>
        </div>

        {error && <div className="sh-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="sh-auth-form">
          <div className="sh-form-group">
            <label className="sh-label" htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="sh-input"
            />
          </div>

          {mode === "signup" && (
            <div className="sh-form-group">
              <label className="sh-label" htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sh-input"
              />
            </div>
          )}

          <div className="sh-form-group">
            <label className="sh-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sh-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sh-btn sh-btn-primary sh-btn-lg"
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Processing..." : (mode === "login" ? "Log In" : "Create Account")}
          </button>
        </form>

        <div className="sh-auth-divider">
          <span>or continue with</span>
        </div>

        {/* Existing Google OAuth endpoint */}
        <a 
          href="/auth/google" 
          className="sh-btn sh-btn-secondary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.32 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </a>
      </div>

      <style>{`
        .sh-auth-modal {
          max-width: 440px;
        }

        .sh-auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--sh-border-light);
          margin-bottom: 24px;
        }

        .sh-auth-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--sh-text-secondary);
          border-bottom: 2px solid transparent;
          transition: all var(--sh-transition-fast);
        }

        .sh-auth-tab:hover {
          color: var(--sh-text-primary);
        }

        .sh-auth-tab.active {
          color: var(--sh-primary);
          border-bottom-color: var(--sh-primary);
        }

        .sh-auth-header {
          margin-bottom: 20px;
        }

        .sh-auth-header h3 {
          font-size: 1.25rem;
          margin-bottom: 6px;
        }

        .sh-auth-header p {
          font-size: 0.875rem;
          color: var(--sh-text-secondary);
        }

        .sh-auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: var(--sh-text-muted);
          font-size: 0.8125rem;
        }

        .sh-auth-divider::before, .sh-auth-divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid var(--sh-border-light);
        }

        .sh-auth-divider span {
          padding: 0 12px;
        }
      `}</style>
    </div>
  );
}
