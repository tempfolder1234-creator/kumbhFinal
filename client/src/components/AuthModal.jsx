import React, { useState } from "react";
import { X, LogIn, UserPlus, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{}|;:,.<>]{8,}$/;

export default function AuthModal({ initialMode = "login", onClose, onSuccess }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Live Password Criteria Calculations
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{}|;:,.<>]/.test(password);

  const criteriaMetCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isStrongPassword = STRONG_PASSWORD_REGEX.test(password);
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const getStrengthLabel = () => {
    if (!password) return { text: "", color: "" };
    if (criteriaMetCount <= 2) return { text: "Weak", color: "#E53E3E" };
    if (criteriaMetCount <= 4) return { text: "Medium", color: "#DD6B20" };
    return { text: "Strong", color: "#38A169" };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!isEmailValid) {
        setError("Please enter a valid email address (e.g. name@example.com)");
        return;
      }
      if (!isStrongPassword) {
        setError("Password does not meet strong security requirements. See checklist below.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await login({ username, password });
      } else {
        await signup({ username: username.trim(), email: email.trim(), password });
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

        {error && (
          <div className="sh-alert-error" style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="sh-auth-form" noValidate>
          <div className="sh-form-group">
            <label className="sh-label" htmlFor="auth-username">
              {mode === "login" ? "Username or Email" : "Username"}
            </label>
            <input
              id="auth-username"
              type="text"
              required
              placeholder={mode === "login" ? "Enter username or email" : "Choose a unique username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="sh-input"
            />
          </div>

          {mode === "signup" && (
            <div className="sh-form-group">
              <label className="sh-label" htmlFor="auth-email">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!emailTouched) setEmailTouched(true);
                }}
                onBlur={() => setEmailTouched(true)}
                className={`sh-input ${emailTouched && email && !isEmailValid ? "sh-input-invalid" : ""}`}
              />
              {emailTouched && email && !isEmailValid && (
                <span className="sh-field-hint sh-hint-error">
                  Please enter a valid email address (e.g. name@domain.com)
                </span>
              )}
            </div>
          )}

          <div className="sh-form-group">
            <label className="sh-label" htmlFor="auth-password">Password</label>
            <div className="sh-password-input-wrap">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!passwordTouched) setPasswordTouched(true);
                }}
                onBlur={() => setPasswordTouched(true)}
                className={`sh-input ${mode === "signup" && passwordTouched && password && !isStrongPassword ? "sh-input-invalid" : ""}`}
              />
              <button
                type="button"
                className="sh-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* In Signup mode, show Live Password Strength Indicator & Checklist */}
            {mode === "signup" && password && (
              <div className="sh-password-feedback">
                <div className="sh-strength-bar-wrap">
                  <div className="sh-strength-bar">
                    <div 
                      className="sh-strength-fill" 
                      style={{ 
                        width: `${(criteriaMetCount / 5) * 100}%`,
                        backgroundColor: strength.color 
                      }} 
                    />
                  </div>
                  <span className="sh-strength-label" style={{ color: strength.color }}>
                    {strength.text}
                  </span>
                </div>

                <div className="sh-criteria-list">
                  <div className={`sh-criteria-item ${hasMinLength ? "met" : ""}`}>
                    <Check size={13} strokeWidth={3} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`sh-criteria-item ${hasUpper && hasLower ? "met" : ""}`}>
                    <Check size={13} strokeWidth={3} />
                    <span>Upper &amp; lowercase letters</span>
                  </div>
                  <div className={`sh-criteria-item ${hasNumber ? "met" : ""}`}>
                    <Check size={13} strokeWidth={3} />
                    <span>At least 1 number (0-9)</span>
                  </div>
                  <div className={`sh-criteria-item ${hasSpecial ? "met" : ""}`}>
                    <Check size={13} strokeWidth={3} />
                    <span>1 special symbol (@$!%*?&#)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sh-btn sh-btn-primary sh-btn-lg"
            style={{ width: "100%", marginTop: "12px" }}
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

        .sh-password-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sh-password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--sh-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: var(--sh-radius-sm);
          transition: color var(--sh-transition-fast);
        }

        .sh-password-toggle-btn:hover {
          color: var(--sh-text-primary);
        }

        .sh-input-invalid {
          border-color: #E53E3E !important;
          background-color: #FFF5F5 !important;
        }

        .sh-field-hint {
          display: block;
          font-size: 0.775rem;
          margin-top: 5px;
        }

        .sh-hint-error {
          color: #E53E3E;
          font-weight: 500;
        }

        /* Password Strength Indicator */
        .sh-password-feedback {
          margin-top: 10px;
          padding: 10px 12px;
          background: #F7FAFC;
          border-radius: var(--sh-radius-md);
          border: 1px solid var(--sh-border-light);
        }

        .sh-strength-bar-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .sh-strength-bar {
          flex: 1;
          height: 6px;
          background: #E2E8F0;
          border-radius: 999px;
          overflow: hidden;
        }

        .sh-strength-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .sh-strength-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sh-criteria-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .sh-criteria-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: #A0AEC0;
          transition: color var(--sh-transition-fast);
        }

        .sh-criteria-item svg {
          stroke: #CBD5E0;
          transition: stroke var(--sh-transition-fast);
        }

        .sh-criteria-item.met {
          color: #2F855A;
          font-weight: 600;
        }

        .sh-criteria-item.met svg {
          stroke: #38A169;
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
