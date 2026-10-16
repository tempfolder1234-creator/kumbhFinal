import React, { useState, useRef, useEffect } from "react";
import { 
  Compass, 
  Search, 
  Menu, 
  User, 
  PlusCircle, 
  LogOut, 
  UserCheck, 
  X,
  Home
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onNavigate, currentView, searchQuery, setSearchQuery, onSearchSubmit }) {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchQuery);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sh-navbar-wrap">
      <div className="sh-container sh-navbar">
        {/* Brand Logo */}
        <div 
          className="sh-logo" 
          onClick={() => onNavigate("home")} 
          role="button" 
          tabIndex={0}
        >
          <div className="sh-logo-icon">
            <Home size={22} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span className="sh-logo-text">StayHub</span>
        </div>

        {/* Center Search Pill */}
        <form className="sh-search-pill" onSubmit={handleSearch}>
          <div className="sh-search-field">
            <span className="sh-search-label">Anywhere</span>
            <input
              type="text"
              placeholder="Search destination, property, Nashik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sh-search-input"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              className="sh-search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <button type="submit" className="sh-search-btn" aria-label="Search">
            <Search size={16} strokeWidth={2.5} />
          </button>
        </form>

        {/* Right Navigation & User Menu */}
        <div className="sh-nav-right">
          <button 
            className="sh-btn-host"
            onClick={() => onNavigate("create")}
          >
            <PlusCircle size={17} />
            <span>Add listing</span>
          </button>

          {/* User Profile / Menu Pill */}
          <div className="sh-user-menu-container" ref={menuRef}>
            <button 
              className="sh-user-pill"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Main menu"
            >
              <Menu size={18} />
              <div className="sh-avatar-placeholder">
                <User size={16} />
              </div>
            </button>

            {menuOpen && (
              <div className="sh-menu-dropdown">
                {currentUser ? (
                  <>
                    <div className="sh-dropdown-user-info">
                      <strong>{currentUser.username}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <div className="sh-dropdown-divider" />
                    <button 
                      className="sh-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("profile");
                      }}
                    >
                      <UserCheck size={16} />
                      <span>My Profile &amp; Bookings</span>
                    </button>
                    <button 
                      className="sh-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("create");
                      }}
                    >
                      <PlusCircle size={16} />
                      <span>Create New Listing</span>
                    </button>
                    <div className="sh-dropdown-divider" />
                    <button 
                      className="sh-dropdown-item sh-dropdown-item-danger"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="sh-dropdown-item sh-font-bold"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("signup");
                      }}
                    >
                      Sign Up
                    </button>
                    <button 
                      className="sh-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("login");
                      }}
                    >
                      Log In
                    </button>
                    <div className="sh-dropdown-divider" />
                    <button 
                      className="sh-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("create");
                      }}
                    >
                      Host your property
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .sh-navbar-wrap {
          position: sticky;
          top: 0;
          background: #FFFFFF;
          border-bottom: 1px solid var(--sh-border-light);
          z-index: 100;
          height: var(--sh-header-height);
          display: flex;
          align-items: center;
        }

        .sh-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .sh-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .sh-logo-icon {
          width: 38px;
          height: 38px;
          background: var(--sh-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 56, 92, 0.3);
          transition: transform var(--sh-transition);
        }

        .sh-logo:hover .sh-logo-icon {
          transform: scale(1.05);
        }

        .sh-logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--sh-primary);
        }

        /* Search Pill */
        .sh-search-pill {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--sh-border);
          border-radius: var(--sh-radius-full);
          padding: 6px 8px 6px 20px;
          box-shadow: var(--sh-shadow-sm);
          transition: all var(--sh-transition);
          max-width: 440px;
          width: 100%;
        }

        .sh-search-pill:hover, .sh-search-pill:focus-within {
          box-shadow: var(--sh-shadow-md);
          border-color: #B0B0B0;
        }

        .sh-search-field {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sh-search-label {
          display: none;
        }

        .sh-search-input {
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--sh-text-primary);
          background: transparent;
          width: 100%;
        }

        .sh-search-input::placeholder {
          color: var(--sh-text-secondary);
        }

        .sh-search-clear-btn {
          width: 22px;
          height: 22px;
          border-radius: var(--sh-radius-full);
          background: #EAEAEA;
          color: #717171;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 6px;
          cursor: pointer;
          transition: all var(--sh-transition-fast);
          flex-shrink: 0;
        }

        .sh-search-clear-btn:hover {
          background: #DDDDDD;
          color: #222222;
        }

        .sh-search-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--sh-radius-full);
          background: var(--sh-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--sh-transition-fast), transform var(--sh-transition-fast);
          flex-shrink: 0;
        }

        .sh-search-btn:hover {
          background: var(--sh-primary-hover);
          transform: scale(1.05);
        }

        /* Right nav */
        .sh-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sh-btn-host {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: var(--sh-radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--sh-text-primary);
          transition: background var(--sh-transition-fast);
        }

        .sh-btn-host:hover {
          background: var(--sh-bg-hover);
        }

        /* User Menu */
        .sh-user-menu-container {
          position: relative;
        }

        .sh-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px 6px 14px;
          border: 1px solid var(--sh-border);
          border-radius: var(--sh-radius-full);
          background: #FFFFFF;
          transition: box-shadow var(--sh-transition-fast);
        }

        .sh-user-pill:hover {
          box-shadow: var(--sh-shadow-md);
        }

        .sh-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: var(--sh-radius-full);
          background: #717171;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Dropdown */
        .sh-menu-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 240px;
          background: #FFFFFF;
          border-radius: var(--sh-radius-lg);
          box-shadow: var(--sh-shadow-lg);
          border: 1px solid var(--sh-border-light);
          padding: 8px 0;
          animation: shFadeIn 0.15s ease-out;
          z-index: 200;
        }

        .sh-dropdown-user-info {
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }

        .sh-dropdown-user-info strong {
          color: var(--sh-text-primary);
          font-size: 0.95rem;
        }

        .sh-dropdown-user-info span {
          color: var(--sh-text-secondary);
        }

        .sh-dropdown-divider {
          height: 1px;
          background: var(--sh-border-light);
          margin: 6px 0;
        }

        .sh-dropdown-item {
          width: 100%;
          text-align: left;
          padding: 10px 18px;
          font-size: 0.9rem;
          color: var(--sh-text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background var(--sh-transition-fast);
        }

        .sh-dropdown-item:hover {
          background: var(--sh-bg-hover);
        }

        .sh-dropdown-item-danger {
          color: var(--sh-error);
        }

        .sh-font-bold {
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .sh-search-pill {
            display: none;
          }
          .sh-btn-host span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
