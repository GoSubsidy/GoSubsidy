import React, { useMemo, useState, useEffect } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserSlash,
  FaTimes,
  FaSave,
  FaEnvelope,
  FaIdBadge,
  FaCopy,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

// ======================================================
// DEFAULT ADMIN USER DATA WITH USER IDs
// ======================================================

const initialUsers = [
  {
    id: 1,
    user_id: "GS-ADM-1001",
    name: "Super Administrator",
    email: "admin@gosubsidy.in",
    role: "Super Admin",
    status: "Active",
    last_login: "2026-08-01T09:30:00",
  },
  {
    id: 2,
    user_id: "GS-ADM-1002",
    name: "Scheme Manager",
    email: "manager@gosubsidy.in",
    role: "Content Manager",
    status: "Active",
    last_login: "2026-07-31T16:20:00",
  },
  {
    id: 3,
    user_id: "GS-ADM-1003",
    name: "Scheme Reviewer",
    email: "reviewer@gosubsidy.in",
    role: "Reviewer",
    status: "Active",
    last_login: "2026-07-30T11:10:00",
  },
  {
    id: 4,
    user_id: "GS-ADM-1004",
    name: "Portal Viewer",
    email: "viewer@gosubsidy.in",
    role: "Viewer",
    status: "Inactive",
    last_login: null,
  },
];

// Helper to generate a unique GoSubsidy Admin User ID
const generateUniqueUserId = (existingUsers = []) => {
  const existingIds = new Set(existingUsers.map((u) => u.user_id));
  let candidate = "";
  let counter = 1005;
  do {
    candidate = `GS-ADM-${counter}`;
    counter++;
  } while (existingIds.has(candidate));
  return candidate;
};

// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {
  user_id: "",
  name: "",
  email: "",
  role: "Content Manager",
  status: "Active",
};

export default function Users() {
  // ====================================================
  // STATE WITH LOCALSTORAGE PERSISTENCE
  // ====================================================

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("gosubsidy_admin_portal_users");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback below
    }
    return initialUsers;
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        "gosubsidy_admin_portal_users",
        JSON.stringify(users)
      );
    } catch (e) {
      console.error("Failed to save users to localStorage:", e);
    }
  }, [users]);

  // ====================================================
  // FILTER USERS
  // ====================================================

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [
        user.user_id,
        user.name,
        user.email,
        user.role,
        user.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !keyword || searchableText.includes(keyword);

      const matchesRole =
        !roleFilter || user.role === roleFilter;

      const matchesStatus =
        !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ====================================================
  // ADD USER (AUTOGENERATE USER ID)
  // ====================================================

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      user_id: generateUniqueUserId(users),
    });
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // EDIT USER
  // ====================================================

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      user_id: user.user_id || `GS-ADM-${user.id}`,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Content Manager",
      status: user.status || "Active",
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // CLOSE FORM
  // ====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  // ====================================================
  // SAVE USER
  // ====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const user_id = formData.user_id.trim() || generateUniqueUserId(users);

    // Validation
    if (!name) {
      setError("User name is required.");
      return;
    }

    if (!email) {
      setError("Email address is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Duplicate email check
    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === email &&
        user.id !== editingId
    );

    if (duplicateEmail) {
      setError("A user with this email address already exists.");
      return;
    }

    // Duplicate User ID check
    const duplicateUserId = users.some(
      (user) =>
        user.user_id?.toUpperCase() === user_id.toUpperCase() &&
        user.id !== editingId
    );

    if (duplicateUserId) {
      setError("This User ID is already assigned to another account.");
      return;
    }

    // UPDATE USER
    if (editingId !== null) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingId
            ? {
                ...user,
                user_id,
                name,
                email,
                role: formData.role,
                status: formData.status,
              }
            : user
        )
      );
      closeForm();
      return;
    }

    // CREATE USER
    const newUser = {
      id: Date.now(),
      user_id,
      name,
      email,
      role: formData.role,
      status: formData.status,
      last_login: null,
    };

    setUsers((previous) => [newUser, ...previous]);
    closeForm();
  };

  // ====================================================
  // TOGGLE USER STATUS
  // ====================================================

  const toggleStatus = (user) => {
    const newStatus =
      user.status === "Active" ? "Inactive" : "Active";

    const action =
      newStatus === "Active" ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${user.name}" (${user.user_id})?`
    );

    if (!confirmed) return;

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...item, status: newStatus } : item
      )
    );
  };

  // ====================================================
  // COPY USER ID TO CLIPBOARD
  // ====================================================

  const handleCopyUserId = (idCode) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(idCode);
      setCopiedId(idCode);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  // ====================================================
  // RESET FILTERS
  // ====================================================

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
  };

  // ====================================================
  // STATISTICS
  // ====================================================

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
  const administrators = users.filter((u) => u.role === "Super Admin").length;

  // ====================================================
  // ROLE BADGE
  // ====================================================

  const renderRoleBadge = (role) => {
    switch (role) {
      case "Super Admin":
        return (
          <span className="badge bg-danger bg-opacity-10 text-danger fw-bold">
            Super Admin
          </span>
        );
      case "Content Manager":
        return (
          <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">
            Content Manager
          </span>
        );
      case "Reviewer":
        return (
          <span className="badge bg-warning bg-opacity-10 text-warning fw-bold">
            Reviewer
          </span>
        );
      case "Viewer":
        return (
          <span className="badge bg-secondary bg-opacity-10 text-secondary fw-bold">
            Viewer
          </span>
        );
      default:
        return <span className="badge bg-light text-dark">{role}</span>;
    }
  };

  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (value) => {
    if (!value) return "Never";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <PageHeader
          title="Admin Users"
          subtitle="Manage administrator accounts, unique User IDs, roles, and portal access"
        />

        <button
          type="button"
          className="btn btn-primary fw-bold shadow-sm"
          onClick={handleAdd}
        >
          <FaUserPlus className="me-2" />
          Add User
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Total Users</small>
                  <h3 className="fw-bold mb-0 mt-1">{users.length}</h3>
                </div>
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center"
                  style={{ width: "52px", height: "52px" }}
                >
                  <FaUsers size={21} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Active Users</small>
                  <h3 className="fw-bold text-success mb-0 mt-1">{activeUsers}</h3>
                </div>
                <FaUserCheck size={24} className="text-success" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Inactive Users</small>
                  <h3 className="fw-bold text-secondary mb-0 mt-1">{inactiveUsers}</h3>
                </div>
                <FaUserSlash size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Super Admins</small>
                  <h3 className="fw-bold text-danger mb-0 mt-1">{administrators}</h3>
                </div>
                <FaUserShield size={24} className="text-danger" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 pt-4 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">
                  {editingId !== null ? "Edit Admin User" : "Add Exclusive Admin User"}
                </h5>
                <p className="text-muted small mb-0">
                  Configure account information, User ID, and portal permissions.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={closeForm}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* USER ID (READ-ONLY AUTOGENERATED) */}
                <div className="col-lg-4">
                  <label className="form-label fw-semibold">
                    Assigned User ID
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-primary fw-bold">
                      <FaIdBadge />
                    </span>
                    <input
                      type="text"
                      name="user_id"
                      className="form-control font-monospace bg-light fw-bold text-primary"
                      value={formData.user_id}
                      readOnly
                      title="System generated unique User ID"
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: "11px" }}>
                    Unique identifier for GoSubsidy audit logs.
                  </small>
                </div>

                {/* NAME */}
                <div className="col-lg-4">
                  <label className="form-label fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL */}
                <div className="col-lg-4">
                  <label className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="admin@gosubsidy.in"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ROLE */}
                <div className="col-lg-6">
                  <label className="form-label fw-semibold">Assigned Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                {/* STATUS */}
                <div className="col-lg-6">
                  <label className="form-label fw-semibold">Account Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary fw-semibold"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary fw-bold">
                  <FaSave className="me-2" />
                  {editingId !== null ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER / SEARCH */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-5">
              <label className="form-label small text-muted">
                Search User ID, Name, or Email
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. GS-ADM-1001 or admin@gosubsidy..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3">
              <label className="form-label small text-muted">Role</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Content Manager">Content Manager</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div className="col-lg-2">
              <label className="form-label small text-muted">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-lg-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 fw-semibold"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="fw-bold mb-1">Portal Users</h5>
          <p className="text-muted small mb-0">
            {filteredUsers.length} user{filteredUsers.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">USER ID</th>
                  <th>USER DETAILS</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>LAST LOGIN</th>
                  <th className="text-end pe-4" style={{ width: "160px" }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <FaUsers size={38} className="text-muted mb-3" />
                      <h6>No users found</h6>
                      <p className="text-muted small">
                        Change your search filters or add a new admin user.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      {/* USER ID */}
                      <td className="ps-4">
                        <div className="d-inline-flex align-items-center gap-2">
                          <span className="badge bg-light text-primary border font-monospace px-2 py-1 fs-6">
                            {user.user_id || `GS-ADM-${user.id}`}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0 text-muted"
                            title="Copy User ID"
                            onClick={() =>
                              handleCopyUserId(user.user_id || `GS-ADM-${user.id}`)
                            }
                          >
                            <FaCopy size={12} />
                          </button>
                          {copiedId === (user.user_id || `GS-ADM-${user.id}`) && (
                            <small className="text-success fw-bold" style={{ fontSize: "10px" }}>
                              Copied!
                            </small>
                          )}
                        </div>
                      </td>

                      {/* USER DETAILS */}
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{user.name}</div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td>{renderRoleBadge(user.role)}</td>

                      {/* STATUS */}
                      <td>
                        {user.status === "Active" ? (
                          <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                            ● Active
                          </span>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary fw-bold">
                            ● Inactive
                          </span>
                        )}
                      </td>

                      {/* LAST LOGIN */}
                      <td>
                        <span className="text-muted small">
                          {formatDate(user.last_login)}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="text-end pe-4">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning me-2"
                          title="Edit User"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className={
                            user.status === "Active"
                              ? "btn btn-sm btn-outline-danger"
                              : "btn btn-sm btn-outline-success"
                          }
                          title={
                            user.status === "Active"
                              ? "Deactivate User"
                              : "Activate User"
                          }
                          onClick={() => toggleStatus(user)}
                        >
                          {user.status === "Active" ? (
                            <FaUserSlash />
                          ) : (
                            <FaUserCheck />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}