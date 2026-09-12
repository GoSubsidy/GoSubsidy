import React, { useState } from "react";
import {
  FaBell,
  FaSearch,
  FaBars,
  FaChevronDown,
  FaUserShield,
} from "react-icons/fa";

export default function Topbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open admin menu"
        >
          <FaBars />
        </button>

        <div className="topbar-search">
          <FaSearch />
          <input
            aria-label="Search schemes"
            placeholder="Search schemes, categories..."
          />
          <span className="search-shortcut">⌘ K</span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="topbar-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <FaBell />
          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <div className="admin-profile-wrap">
          <button
            type="button"
            className="admin-profile"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
          >
            <span className="admin-avatar">A</span>

            <span className="admin-profile-copy">
              <strong>Administrator</strong>
              <small>GoSubsidy Admin</small>
            </span>

            <FaChevronDown
              className={`profile-chevron ${
                profileOpen ? "open" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-head">
                <span className="admin-avatar large">A</span>
                <div>
                  <strong>Administrator</strong>
                  <small>Portal management</small>
                </div>
              </div>

              <div className="profile-dropdown-item">
                <FaUserShield />
                <span>Administrator access</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
