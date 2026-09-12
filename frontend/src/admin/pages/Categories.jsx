import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTags,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

// ======================================================
// TEMPORARY CATEGORY DATA
// Replace with backend data after categories API is built.
// ======================================================

const initialCategories = [
  {
    id: 1,
    name: "Agriculture",
    slug: "agriculture",
    description: "Schemes for farmers and agriculture sector",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 2,
    name: "Education",
    slug: "education",
    description: "Education, scholarship and student schemes",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 3,
    name: "Business & MSME",
    slug: "business-msme",
    description: "Business, startup and MSME support schemes",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 4,
    name: "Housing",
    slug: "housing",
    description: "Government housing and home assistance schemes",
    status: "Active",
    scheme_count: 0,
  },
  {
    id: 5,
    name: "Women & Child",
    slug: "women-child",
    description: "Schemes supporting women and children",
    status: "Active",
    scheme_count: 0,
  },
];

// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  status: "Active",
};

export default function Categories() {
  // ====================================================
  // STATE
  // ====================================================

  const [categories, setCategories] =
    useState(initialCategories);

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

  const filteredCategories = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return [
        category.name,
        category.slug,
        category.description,
        category.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [categories, search]);

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setError("");

    if (name === "name") {
      setFormData((previous) => ({
        ...previous,
        name: value,

        // Automatically create slug only while
        // adding a new category.
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
  // OPEN ADD FORM
  // ====================================================

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  // ====================================================
  // OPEN EDIT FORM
  // ====================================================

  const handleEdit = (category) => {
    setEditingId(category.id);

    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description:
        category.description || "",
      status:
        category.status || "Active",
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
  // SAVE CATEGORY
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
        "Category name is required."
      );

      return;
    }

    if (!slug) {
      setError(
        "Category slug is required."
      );

      return;
    }

    // Check duplicate slug
    const duplicate =
      categories.some(
        (category) =>
          category.slug.toLowerCase() ===
            slug.toLowerCase() &&
          category.id !== editingId
      );

    if (duplicate) {
      setError(
        "A category with this slug already exists."
      );

      return;
    }

    // ================================================
    // UPDATE
    // ================================================

    if (editingId !== null) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingId
            ? {
                ...category,
                name,
                slug,
                description:
                  formData.description.trim(),
                status:
                  formData.status,
              }
            : category
        )
      );

      closeForm();

      return;
    }

    // ================================================
    // CREATE
    // ================================================

    const newCategory = {
      id: Date.now(),
      name,
      slug,
      description:
        formData.description.trim(),
      status:
        formData.status,
      scheme_count: 0,
    };

    setCategories((previous) => [
      newCategory,
      ...previous,
    ]);

    closeForm();
  };

  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDelete = (category) => {
    if (
      Number(category.scheme_count) > 0
    ) {
      alert(
        `You cannot delete "${category.name}" because schemes are currently assigned to this category.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setCategories((previous) =>
      previous.filter(
        (item) =>
          item.id !== category.id
      )
    );
  };

  // ====================================================
  // STATS
  // ====================================================

  const activeCount =
    categories.filter(
      (category) =>
        category.status === "Active"
    ).length;

  const inactiveCount =
    categories.filter(
      (category) =>
        category.status === "Inactive"
    ).length;

  // ====================================================
  // UI
  // ====================================================

  return (
    <Layout>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">

        <PageHeader
          title="Categories"
          subtitle="Manage Government Scheme categories"
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
        >
          <FaPlus className="me-2" />

          Add Category
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Total Categories
                  </small>

                  <h3 className="fw-bold mb-0 mt-1">
                    {categories.length}
                  </h3>

                </div>

                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                  }}
                >
                  <FaTags size={21} />
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Active Categories
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
                Inactive Categories
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
                    ? "Edit Category"
                    : "Add Category"}

                </h5>

                <p className="text-muted small mb-0">
                  Create categories used to organize Government Schemes.
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

                {/* CATEGORY NAME */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Category Name
                    <span className="text-danger">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Example: Agriculture"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                {/* SLUG */}

                <div className="col-md-6">

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
                    placeholder="agriculture"
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
                    Used internally and for future SEO URLs.
                  </small>

                </div>

                {/* DESCRIPTION */}

                <div className="col-12">

                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Brief description of this category..."
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* STATUS */}

                <div className="col-md-4">

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
                    ? "Update Category"
                    : "Save Category"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          CATEGORY LIST
      ================================================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

            <div>

              <h5 className="fw-bold mb-1">
                Scheme Categories
              </h5>

              <p className="text-muted small mb-0">
                Categories available in the Scheme Management system.
              </p>

            </div>

            {/* SEARCH */}

            <div
              className="input-group"
              style={{
                maxWidth: "320px",
              }}
            >

              <span className="input-group-text bg-white">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search categories..."
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
                    Category
                  </th>

                  <th>
                    Slug
                  </th>

                  <th>
                    Description
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

                {filteredCategories.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >

                      <FaTags
                        size={35}
                        className="text-muted mb-3"
                      />

                      <h6>
                        No categories found
                      </h6>

                      <p className="text-muted small mb-3">
                        Try another search or create a new category.
                      </p>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAdd}
                      >
                        <FaPlus className="me-2" />
                        Add Category
                      </button>

                    </td>

                  </tr>

                ) : (

                  filteredCategories.map(
                    (category) => (

                      <tr key={category.id}>

                        {/* NAME */}

                        <td className="ps-4">

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: "38px",
                                height: "38px",
                              }}
                            >
                              <FaTags />
                            </div>

                            <strong>
                              {category.name}
                            </strong>

                          </div>

                        </td>

                        {/* SLUG */}

                        <td>

                          <code>
                            {category.slug}
                          </code>

                        </td>

                        {/* DESCRIPTION */}

                        <td
                          style={{
                            maxWidth: "300px",
                          }}
                        >

                          <span className="text-muted small">
                            {category.description ||
                              "—"}
                          </span>

                        </td>

                        {/* SCHEME COUNT */}

                        <td className="text-center">

                          <span className="badge bg-primary bg-opacity-10 text-primary">

                            {category.scheme_count ||
                              0}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          {category.status ===
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
                            title="Edit Category"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Category"
                            onClick={() =>
                              handleDelete(
                                category
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