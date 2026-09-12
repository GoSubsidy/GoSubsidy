import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaLandmark,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

// ======================================================
// TEMPORARY DATA
// Later we will replace this with backend API data.
// ======================================================

const initialMinistries = [
  {
    id: 1,
    name: "Ministry of Agriculture & Farmers Welfare",
    short_name: "MoA&FW",
    slug: "ministry-agriculture-farmers-welfare",
    department: "Department of Agriculture & Farmers Welfare",
    website: "https://agriwelfare.gov.in",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 2,
    name: "Ministry of Micro, Small & Medium Enterprises",
    short_name: "MSME",
    slug: "ministry-msme",
    department: "",
    website: "https://msme.gov.in",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 3,
    name: "Ministry of Education",
    short_name: "MoE",
    slug: "ministry-education",
    department: "",
    website: "https://www.education.gov.in",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 4,
    name: "Ministry of Rural Development",
    short_name: "MoRD",
    slug: "ministry-rural-development",
    department: "",
    website: "https://rural.gov.in",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 5,
    name: "Ministry of Women and Child Development",
    short_name: "MWCD",
    slug: "ministry-women-child-development",
    department: "",
    website: "https://wcd.gov.in",
    status: "Active",
    scheme_count: 0,
  },
];

// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {
  name: "",
  short_name: "",
  slug: "",
  department: "",
  website: "",
  status: "Active",
};

export default function Ministries() {
  // ====================================================
  // STATE
  // ====================================================

  const [ministries, setMinistries] =
    useState(initialMinistries);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [error, setError] =
    useState("");

  // ====================================================
  // GENERATE SLUG
  // ====================================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredMinistries = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return ministries;
    }

    return ministries.filter((ministry) =>
      [
        ministry.name,
        ministry.short_name,
        ministry.slug,
        ministry.department,
        ministry.website,
        ministry.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [ministries, search]);

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setError("");

    if (name === "name") {
      setFormData((previous) => ({
        ...previous,
        name: value,

        // Auto-generate slug only when adding.
        slug:
          editingId === null
            ? generateSlug(value)
            : previous.slug,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ====================================================
  // ADD
  // ====================================================

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = (ministry) => {
    setEditingId(ministry.id);

    setFormData({
      name: ministry.name || "",
      short_name:
        ministry.short_name || "",
      slug: ministry.slug || "",
      department:
        ministry.department || "",
      website:
        ministry.website || "",
      status:
        ministry.status || "Active",
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
  // SAVE / UPDATE
  // ====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const name =
      formData.name.trim();

    const slug =
      formData.slug.trim() ||
      generateSlug(name);

    if (!name) {
      setError(
        "Ministry name is required."
      );

      return;
    }

    if (!slug) {
      setError(
        "Ministry slug is required."
      );

      return;
    }

    // Duplicate slug check
    const duplicate =
      ministries.some(
        (ministry) =>
          ministry.slug.toLowerCase() ===
            slug.toLowerCase() &&
          ministry.id !== editingId
      );

    if (duplicate) {
      setError(
        "A ministry with this slug already exists."
      );

      return;
    }

    // ================================================
    // UPDATE
    // ================================================

    if (editingId !== null) {
      setMinistries((previous) =>
        previous.map((ministry) =>
          ministry.id === editingId
            ? {
                ...ministry,
                name,
                short_name:
                  formData.short_name.trim(),
                slug,
                department:
                  formData.department.trim(),
                website:
                  formData.website.trim(),
                status:
                  formData.status,
              }
            : ministry
        )
      );

      closeForm();

      return;
    }

    // ================================================
    // CREATE
    // ================================================

    const newMinistry = {
      id: Date.now(),

      name,

      short_name:
        formData.short_name.trim(),

      slug,

      department:
        formData.department.trim(),

      website:
        formData.website.trim(),

      status:
        formData.status,

      scheme_count: 0,
    };

    setMinistries((previous) => [
      newMinistry,
      ...previous,
    ]);

    closeForm();
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = (ministry) => {
    if (
      Number(ministry.scheme_count) > 0
    ) {
      alert(
        `You cannot delete "${ministry.name}" because schemes are assigned to this ministry.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${ministry.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setMinistries((previous) =>
      previous.filter(
        (item) =>
          item.id !== ministry.id
      )
    );
  };

  // ====================================================
  // STATS
  // ====================================================

  const activeCount =
    ministries.filter(
      (ministry) =>
        ministry.status === "Active"
    ).length;

  const inactiveCount =
    ministries.filter(
      (ministry) =>
        ministry.status === "Inactive"
    ).length;

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
          title="Ministries"
          subtitle="Manage ministries and departments for Government Schemes"
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
        >
          <FaPlus className="me-2" />
          Add Ministry
        </button>

      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Total Ministries
                  </small>

                  <h3 className="fw-bold mb-0 mt-1">
                    {ministries.length}
                  </h3>

                </div>

                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                  }}
                >
                  <FaLandmark size={21} />
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Active Ministries
              </small>

              <h3 className="fw-bold text-success mb-0 mt-1">
                {activeCount}
              </h3>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Inactive Ministries
              </small>

              <h3 className="fw-bold text-secondary mb-0 mt-1">
                {inactiveCount}
              </h3>

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
                    ? "Edit Ministry"
                    : "Add Ministry"}

                </h5>

                <p className="text-muted small mb-0">
                  Add and manage ministries used in Government Scheme records.
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

                {/* MINISTRY NAME */}

                <div className="col-lg-8">

                  <label className="form-label fw-semibold">
                    Ministry Name
                    <span className="text-danger">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Example: Ministry of Agriculture & Farmers Welfare"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                {/* SHORT NAME */}

                <div className="col-lg-4">

                  <label className="form-label fw-semibold">
                    Short Name
                  </label>

                  <input
                    type="text"
                    name="short_name"
                    className="form-control"
                    placeholder="Example: MoA&FW"
                    value={
                      formData.short_name
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* SLUG */}

                <div className="col-lg-6">

                  <label className="form-label fw-semibold">
                    Slug
                    <span className="text-danger">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    placeholder="ministry-agriculture-farmers-welfare"
                    value={formData.slug}
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,
                          slug: generateSlug(
                            event.target.value
                          ),
                        })
                      )
                    }
                  />

                  <small className="text-muted">
                    Unique internal identifier.
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

                {/* DEPARTMENT */}

                <div className="col-12">

                  <label className="form-label fw-semibold">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="Example: Department of Agriculture & Farmers Welfare"
                    value={
                      formData.department
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* WEBSITE */}

                <div className="col-12">

                  <label className="form-label fw-semibold">
                    Official Website
                  </label>

                  <input
                    type="url"
                    name="website"
                    className="form-control"
                    placeholder="https://www.example.gov.in"
                    value={formData.website}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* FORM ACTIONS */}

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
                    ? "Update Ministry"
                    : "Save Ministry"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          MINISTRY LIST
      ================================================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

            <div>

              <h5 className="fw-bold mb-1">
                Government Ministries
              </h5>

              <p className="text-muted small mb-0">
                Ministries available in Scheme Management.
              </p>

            </div>

            {/* SEARCH */}

            <div
              className="input-group"
              style={{
                maxWidth: "340px",
              }}
            >

              <span className="input-group-text bg-white">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search ministries..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th className="ps-4">
                    Ministry
                  </th>

                  <th>
                    Short Name
                  </th>

                  <th>
                    Department
                  </th>

                  <th className="text-center">
                    Schemes
                  </th>

                  <th>
                    Status
                  </th>

                  <th
                    className="text-end pe-4"
                    style={{
                      width: "150px",
                    }}
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredMinistries.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >

                      <FaLandmark
                        size={38}
                        className="text-muted mb-3"
                      />

                      <h6>
                        No ministries found
                      </h6>

                      <p className="text-muted small mb-3">
                        Try another search or add a new ministry.
                      </p>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAdd}
                      >
                        <FaPlus className="me-2" />
                        Add Ministry
                      </button>

                    </td>

                  </tr>

                ) : (

                  filteredMinistries.map(
                    (ministry) => (

                      <tr key={ministry.id}>

                        {/* MINISTRY */}

                        <td className="ps-4">

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                            >
                              <FaLandmark />
                            </div>

                            <div>

                              <div className="fw-semibold">
                                {ministry.name}
                              </div>

                              {ministry.website && (

                                <a
                                  href={ministry.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="small text-decoration-none"
                                >
                                  Official Website
                                </a>

                              )}

                            </div>

                          </div>

                        </td>

                        {/* SHORT NAME */}

                        <td>
                          {ministry.short_name ||
                            "—"}
                        </td>

                        {/* DEPARTMENT */}

                        <td
                          style={{
                            maxWidth: "300px",
                          }}
                        >

                          <span className="text-muted small">
                            {ministry.department ||
                              "—"}
                          </span>

                        </td>

                        {/* SCHEMES */}

                        <td className="text-center">

                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {ministry.scheme_count ||
                              0}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          {ministry.status ===
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

                        {/* ACTIONS */}

                        <td className="text-end pe-4">

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning me-2"
                            title="Edit Ministry"
                            onClick={() =>
                              handleEdit(
                                ministry
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Ministry"
                            onClick={() =>
                              handleDelete(
                                ministry
                              )
                            }
                          >
                            <FaTrash />
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