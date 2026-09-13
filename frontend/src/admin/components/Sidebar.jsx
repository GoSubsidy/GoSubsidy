import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaPlusCircle,
  FaUpload,
  FaFolder,
  FaUniversity,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
  FaHeadset,
  FaAddressBook,
} from "react-icons/fa";
import { logout } from "../../services/authService";
const logo = "/images/gosubsidy-logo.png";
export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  onToggle,
}) {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/admin";
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { title: "Registered Customers", icon: <FaAddressBook />, path: "/admin/customers" },
    { title: "Customer Enquiries", icon: <FaHeadset />, path: "/admin/enquiries" },
    { title: "Schemes", icon: <FaFileAlt />, path: "/admin/schemes" },
    { title: "Add Scheme", icon: <FaPlusCircle />, path: "/admin/add-scheme" },
    { title: "Upload CSV", icon: <FaUpload />, path: "/admin/upload" },
    { title: "Categories", icon: <FaFolder />, path: "/admin/categories" },
    { title: "Ministries", icon: <FaUniversity />, path: "/admin/ministries" },
    { title: "User Documents", icon: <FaFolderOpen />, path: "/admin/documents" },
    { title: "Admin Users", icon: <FaUsers />, path: "/admin/users" },
    { title: "Analytics", icon: <FaChartLine />, path: "/admin/analytics" },
    { title: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          className="admin-sidebar-backdrop"
          onClick={onToggle}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`admin-sidebar gosubsidy-admin-sidebar ${
          collapsed ? "is-collapsed" : ""
        } ${mobileOpen ? "is-mobile-open" : ""}`}
      >
        <div className="sidebar-top">
          <div className="admin-brand gosubsidy-admin-brand">
            <img
              src={logo}
              alt="GoSubsidy"
              className="admin-brand-logo"
            />

            {!collapsed && (
              <div className="admin-brand-copy">
                <strong>
                  <span>Go</span><span>Subsidy</span>
                </strong>
                <small>BUSINESS &amp; FINANCIAL SERVICES</small>
                <em>ADMIN PORTAL</em>
              </div>
            )}
          </div>

          <nav className="sidebar-navigation" aria-label="Admin navigation">
            {!collapsed && (
              <div className="sidebar-section-label">
                ADMINISTRATION
              </div>
            )}

            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    title={collapsed ? item.title : undefined}
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? "active-menu" : ""}`
                    }
                    onClick={() => {
                      if (window.innerWidth < 992) onToggle?.();
                    }}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {!collapsed && (
                      <span className="sidebar-label">{item.title}</span>
                    )}

                    {item.title === "Analytics" && !collapsed && (
                      <span className="nav-live-dot" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="sidebar-status">
              <span className="status-pulse" />
              <div className="sidebar-status-copy">
                <strong>System Online</strong>
                <small>Supabase connected</small>
              </div>
            </div>
          )}

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title="Sign out"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Sign out</span>}
          </button>

          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
      </aside>
    </>
  );
}
