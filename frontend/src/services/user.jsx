import React, { useMemo, useState } from "react";
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
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

// ======================================================
// TEMPORARY USER DATA
//
// IMPORTANT:
// This is only frontend demo data.
//
// Later we will connect this page to:
// Supabase Auth + profiles/admin_users table.
// ======================================================

const initialUsers = [
  {
    id: 1,
    name: "Super Administrator",
    email: "admin@gosubsidy.in",
    role: "Super Admin",
    status: "Active",
    last_login: "2026-08-01T09:30:00",
  },
  {
    id: 2,
    name: "Scheme Manager",
    email: "manager@gosubsidy.in",
    role: "Content Manager",
    status: "Active",
    last_login: "2026-07-31T16:20:00",
  },
  {
    id: 3,
    name: "Scheme Reviewer",
    email: "reviewer@gosubsidy.in",
    role: "Reviewer",
    status: "Active",
    last_login: "2026-07-30T11:10:00",
  },
  {
    id: 4,
    name: "Portal Viewer",
    email: "viewer@gosubsidy.in",
    role: "Viewer",
    status: "Inactive",
    last_login: null,
  },
];

// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {
  name: "",
  email: "",
  role: "Content Manager",
  status: "Active",
};

export default function Users() {
  // ====================================================
  // STATE
  // ====================================================

  const [users, setUsers] =
    useState(initialUsers);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [error, setError] =
    useState("");

  // ====================================================
  // FILTER USERS
  // ====================================================

  const filteredUsers = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [
        user.name,
        user.email,
        user.role,
        user.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !keyword ||
        searchableText.includes(keyword);

      const matchesRole =
        !roleFilter ||
        user.role === roleFilter;

      const matchesStatus =
        !statusFilter ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setError("");

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ====================================================
  // ADD USER
  // ====================================================

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
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
      name: user.name || "",
      email: user.email || "",
      role:
        user.role || "Content Manager",
      status:
        user.status || "Active",
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

    const name =
      formData.name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    // --------------------------------------------------
    // Validation
    // --------------------------------------------------

    if (!name) {
      setError(
        "User name is required."
      );

      return;
    }

    if (!email) {
      setError(
        "Email address is required."
      );

      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    // --------------------------------------------------
    // Duplicate email check
    // --------------------------------------------------

    const duplicate =
      users.some(
        (user) =>
          user.email.toLowerCase() ===
            email &&
          user.id !== editingId
      );

    if (duplicate) {
      setError(
        "A user with this email address already exists."
      );

      return;
    }

    // ==================================================
    // UPDATE USER
    // ==================================================

    if (editingId !== null) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingId
            ? {
                ...user,
                name,
                email,
                role:
                  formData.role,
                status:
                  formData.status,
              }
            : user
        )
      );

      closeForm();

      return;
    }

    // ==================================================
    // CREATE USER
    // ==================================================

    const newUser = {
      id: Date.now(),
      name,
      email,
      role: formData.role,
      status: formData.status,
      last_login: null,
    };

    setUsers((previous) => [
      newUser,
      ...previous,
    ]);

    closeForm();
  };

  // ====================================================
  // TOGGLE USER STATUS
  // ====================================================

  const toggleStatus = (user) => {
    const newStatus =
      user.status === "Active"
        ? "Inactive"
        : "Active";

    const action =
      newStatus === "Active"
        ? "activate"
        : "deactivate";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} "${user.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );
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

  const activeUsers =
    users.filter(
      (user) =>
        user.status === "Active"
    ).length;

  const inactiveUsers =
    users.filter(
      (user) =>
        user.status === "Inactive"
    ).length;

  const administrators =
    users.filter(
      (user) =>
        user.role === "Super Admin"
    ).length;

  // ====================================================
  // ROLE BADGE
  // ====================================================

  const renderRoleBadge = (role) => {
    switch (role) {
      case "Super Admin":
        return (
          <span className="badge bg-danger bg-opacity-10 text-danger">
            Super Admin
          </span>
        );

      case "Content Manager":
        return (
          <span className="badge bg-primary bg-opacity-10 text-primary">
            Content Manager
          </span>
        );

      case "Reviewer":
        return (
          <span className="badge bg-warning bg-opacity-10 text-warning">
            Reviewer
          </span>
        );

      case "Viewer":
        return (
          <span className="badge bg-secondary bg-opacity-10 text-secondary">
            Viewer
          </span>
        );

      default:
        return (
          <span className="badge bg-light text-dark">
            {role}
          </span>
        );
    }
  };

  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (value) => {
    if (!value) {
      return "Never";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleString();
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <Layout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">

        <PageHeader
          title="Admin Users"
          subtitle="Manage administrator accounts, roles and access"
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
        >
          <FaUserPlus className="me-2" />

          Add User
        </button>

      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="row g-3 mb-4">

        {/* TOTAL */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Total Users
                  </small>

                  <h3 className="fw-bold mb-0 mt-1">
                    {users.length}
                  </h3>

                </div>

                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "52px",
                    height: "52px",
                  }}
                >
                  <FaUsers size={21} />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ACTIVE */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Active Users
                  </small>

                  <h3 className="fw-bold text-success mb-0 mt-1">
                    {activeUsers}
                  </h3>

                </div>

                <FaUserCheck
                  size={24}
                  className="text-success"
                />

              </div>

            </div>

          </div>

        </div>

        {/* INACTIVE */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Inactive Users
                  </small>

                  <h3 className="fw-bold text-secondary mb-0 mt-1">
                    {inactiveUsers}
                  </h3>

                </div>

                <FaUserSlash
                  size={24}
                  className="text-secondary"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ADMINS */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Super Admins
                  </small>

                  <h3 className="fw-bold text-danger mb-0 mt-1">
                    {administrators}
                  </h3>

                </div>

                <FaUserShield
                  size={24}
                  className="text-danger"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-header bg-white border-0 pt-4 px-4">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h5 className="fw-bold mb-1">
                  {editingId !== null
                    ? "Edit Admin User"
                    : "Add Admin User"}
                </h5>

                <p className="text-muted small mb-0">
                  Configure account information and portal permissions.
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

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                {/* NAME */}

                <div className="col-lg-6">

                  <label className="form-label fw-semibold">
                    Full Name
                    <span className="text-danger">
                      {" "}*
                    </span>
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

                <div className="col-lg-6">

                  <label className="form-label fw-semibold">
                    Email Address
                    <span className="text-danger">
                      {" "}*
                    </span>
                  </label>

                  <div className="input-group">

                    <span className="input-group-text bg-white">
                      <FaEnvelope />
                    </span>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* ROLE */}

                <div className="col-lg-6">

                  <label className="form-label fw-semibold">
                    Role
                  </label>

                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >

                    <option value="Super Admin">
                      Super Admin
                    </option>

                    <option value="Content Manager">
                      Content Manager
                    </option>

                    <option value="Reviewer">
                      Reviewer
                    </option>

                    <option value="Viewer">
                      Viewer
                    </option>

                  </select>

                  <small className="text-muted">
                    Permissions will be enforced by RBAC later.
                  </small>

                </div>

                {/* STATUS */}

                <div className="col-lg-6">

                  <label className="form-label fw-semibold">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <FaSave className="me-2" />

                  {editingId !== null
                    ? "Update User"
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          FILTER / SEARCH
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3 align-items-end">

            {/* SEARCH */}

            <div className="col-lg-5">

              <label className="form-label small text-muted">
                Search
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* ROLE FILTER */}

            <div className="col-lg-3">

              <label className="form-label small text-muted">
                Role
              </label>

              <select
                className="form-select"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
              >

                <option value="">
                  All Roles
                </option>

                <option value="Super Admin">
                  Super Admin
                </option>

                <option value="Content Manager">
                  Content Manager
                </option>

                <option value="Reviewer">
                  Reviewer
                </option>

                <option value="Viewer">
                  Viewer
                </option>

              </select>

            </div>

            {/* STATUS FILTER */}

            <div className="col-lg-2">

              <label className="form-label small text-muted">
                Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="">
                  All
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {/* RESET */}

            <div className="col-lg-2">

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                Reset
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <h5 className="fw-bold mb-1">
            Portal Users
          </h5>

          <p className="text-muted small mb-0">
            {filteredUsers.length} user
            {filteredUsers.length === 1
              ? ""
              : "s"}{" "}
            found
          </p>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th className="ps-4">
                    User
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Last Login
                  </th>

                  <th
                    className="text-end pe-4"
                    style={{
                      width: "180px",
                    }}
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-5"
                    >

                      <FaUsers
                        size={38}
                        className="text-muted mb-3"
                      />

                      <h6>
                        No users found
                      </h6>

                      <p className="text-muted small">
                        Change your filters or add a new admin user.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(
                    (user) => (

                      <tr key={user.id}>

                        {/* USER */}

                        <td className="ps-4">

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                              style={{
                                width: "42px",
                                height: "42px",
                              }}
                            >
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>

                              <div className="fw-semibold">
                                {user.name}
                              </div>

                              <small className="text-muted">
                                {user.email}
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td>
                          {renderRoleBadge(
                            user.role
                          )}
                        </td>

                        {/* STATUS */}

                        <td>

                          {user.status ===
                          "Active" ? (

                            <span className="badge bg-success bg-opacity-10 text-success">
                              Active
                            </span>

                          ) : (

                            <span className="badge bg-secondary bg-opacity-10 text-secondary">
                              Inactive
                            </span>

                          )}

                        </td>

                        {/* LAST LOGIN */}

                        <td>

                          <span className="text-muted small">
                            {formatDate(
                              user.last_login
                            )}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="text-end pe-4">

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning me-2"
                            title="Edit User"
                            onClick={() =>
                              handleEdit(user)
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className={
                              user.status ===
                              "Active"
                                ? "btn btn-sm btn-outline-danger"
                                : "btn btn-sm btn-outline-success"
                            }
                            title={
                              user.status ===
                              "Active"
                                ? "Deactivate User"
                                : "Activate User"
                            }
                            onClick={() =>
                              toggleStatus(
                                user
                              )
                            }
                          >

                            {user.status ===
                            "Active" ? (
                              <FaUserSlash />
                            ) : (
                              <FaUserCheck />
                            )}

                          </button>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </Layout>
  );
}