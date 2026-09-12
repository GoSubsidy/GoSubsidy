import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CustomerNotifications() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <PageLoading text="Loading your notifications..." />;
  }

  if (!user) return null;

  return (
    <main className="customer-account-page">
      <div className="customer-account-shell">
        <button className="account-back" onClick={() => navigate("/customer/dashboard")}>
          <i className="bi bi-arrow-left" /> Back to Dashboard
        </button>

        <section className="account-hero-card notification-hero">
          <div>
            <span className="account-eyebrow">GOSUBSIDY CUSTOMER ALERTS</span>
            <h1>Notifications</h1>
            <p>Important updates about your profile, services, applications and payments.</p>
          </div>
          <div className="account-hero-icon"><i className="bi bi-bell" /></div>
        </section>

        <section className="notification-list">
          <NotificationItem
            icon="bi-person-check"
            title="Customer account active"
            text="Your GoSubsidy customer portal account is active."
            tag="Account"
          />
          <NotificationItem
            icon="bi-shield-check"
            title="Secure customer portal"
            text="Your customer pages are protected by your authenticated session."
            tag="Security"
          />
          <NotificationItem
            icon="bi-stars"
            title="Complete your profile"
            text="Keep your personal and business details updated for more relevant opportunities."
            tag="Profile"
            action={<Link to="/customer/profile">Open Profile</Link>}
          />
        </section>

        <section className="account-notice">
          <i className="bi bi-database" />
          <div>
            <strong>Live notification history</strong>
            <p>
              This page is now connected to the customer navigation. A Supabase
              notification table can be connected next so admin-created alerts
              and service updates appear here automatically.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function NotificationItem({ icon, title, text, tag, action }) {
  return (
    <article className="notification-item">
      <div className="notification-icon"><i className={`bi ${icon}`} /></div>
      <div className="notification-body">
        <div className="notification-title-row">
          <h3>{title}</h3>
          <span>{tag}</span>
        </div>
        <p>{text}</p>
        {action && <div className="notification-action">{action}</div>}
      </div>
    </article>
  );
}

function PageLoading({ text }) {
  return (
    <div className="customer-account-loading">
      <div className="customer-account-spinner" />
      <p>{text}</p>
    </div>
  );
}