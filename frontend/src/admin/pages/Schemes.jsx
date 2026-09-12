import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaUpload,
  FaTrash,
  FaSyncAlt,
  FaLayerGroup,
  FaRobot,
  FaCalendarAlt,
  FaSortAmountDown,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";

import {
  fetchSchemes,
  deleteScheme,
} from "../../services/api";

import { API_BASE_URL } from "../../api";

export default function Schemes() {
  const navigate = useNavigate();

  // ==========================================
  // DATA
  // ==========================================

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // SEARCH & FILTERS
  // ==========================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ministry, setMinistry] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ==========================================
  // ROW SELECTION
  // ==========================================

  const [selectedRows, setSelectedRows] = useState([]);

  // ==========================================
  // DELETE MODAL
  // ==========================================

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [schemeToDelete, setSchemeToDelete] =
    useState(null);

  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // HUMAN APPROVAL / PUBLISHING
  // ==========================================
  const [publishingId, setPublishingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  // ==========================================
  // AUTOMATIC SCHEME DISCOVERY + IMPORT
  // ==========================================
  const [autoImporting, setAutoImporting] = useState(false);
  const [autoResult, setAutoResult] = useState(null);
  const [autoError, setAutoError] = useState("");

  // ==========================================
  // LOAD SCHEMES
  // ==========================================

  const loadSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/schemes/admin/all`,
        { headers: { Accept: "application/json" } }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Unable to load admin schemes.");
      }

      const data = await response.json();

      setSchemes(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error("Failed to load schemes:", err);

      setError(
        err.message ||
          "Unable to load schemes from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  // ==========================================
  // AUTOMATIC SCHEME DISCOVERY + GUARDED IMPORT
  // ==========================================
  async function handleAutomaticImport() {
    if (autoImporting) return;

    const confirmed = window.confirm(
      "Start automatic Government Scheme discovery now?\n\nGoSubsidy will scan configured official sources, verify candidates, apply Block 7 safety checks, and import only confirmed NEW schemes."
    );

    if (!confirmed) return;

    try {
      setAutoImporting(true);
      setAutoError("");
      setAutoResult(null);

      const response = await fetch(
        `${API_BASE_URL}/schemes/discover/import`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok || body?.success === false) {
        throw new Error(
          body?.message ||
            "Automatic scheme discovery and import failed."
        );
      }

      setAutoResult(body);

      // Refresh the catalogue after successful guarded storage.
      await loadSchemes();
    } catch (err) {
      console.error(
        "Automatic scheme discovery/import error:",
        err
      );

      setAutoError(
        err?.message ||
          "Unable to run automatic scheme discovery."
      );
    } finally {
      setAutoImporting(false);
    }
  }

  // ==========================================
  // APPROVE & PUBLISH — EXPLICIT HUMAN ACTION
  // ==========================================
  async function handleApproveAndPublish(scheme) {
    if (!scheme?.id || publishingId) return;
    const confirmed = window.confirm(
      `Approve and publish "${scheme.scheme_name}"?\n\nOnly approve after verifying the scheme details and official source.`
    );
    if (!confirmed) return;

    try {
      setPublishingId(scheme.id);
      const response = await fetch(
        `${API_BASE_URL}/schemes/admin/${encodeURIComponent(scheme.id)}/approve`,
        { method: "POST", headers: { Accept: "application/json" } }
      );
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body?.success === false) {
        throw new Error(body?.message || "Unable to publish scheme.");
      }
      await loadSchemes();
    } catch (error) {
      alert(error?.message || "Unable to publish scheme.");
    } finally {
      setPublishingId(null);
    }
  }

  // ==========================================
  // REJECT — KEEP OFF PUBLIC WEBSITE
  // ==========================================
  async function handleRejectScheme(scheme) {
    if (!scheme?.id || rejectingId) return;
    const confirmed = window.confirm(
      `Reject "${scheme.scheme_name}"?\n\nIt will remain in Admin but will NOT appear on the public website.`
    );
    if (!confirmed) return;

    try {
      setRejectingId(scheme.id);
      const response = await fetch(
        `${API_BASE_URL}/schemes/admin/${encodeURIComponent(scheme.id)}/reject`,
        { method: "POST", headers: { Accept: "application/json" } }
      );
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body?.success === false) {
        throw new Error(body?.message || "Unable to reject scheme.");
      }
      await loadSchemes();
    } catch (error) {
      alert(error?.message || "Unable to reject scheme.");
    } finally {
      setRejectingId(null);
    }
  }

  // ==========================================
  // DYNAMIC CATEGORY LIST
  // ==========================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map((scheme) => scheme.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [schemes]);

  // ==========================================
  // DYNAMIC MINISTRY LIST
  // ==========================================

  const ministries = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map((scheme) => scheme.ministry)
          .filter(Boolean)
      ),
    ].sort();
  }, [schemes]);

  // ==========================================
  // UPDATED DATE + SORT HELPERS
  // ==========================================

  const getSchemeUpdatedDate = (scheme) => {
    const value =
      scheme?.updated_at ??
      scheme?.updatedAt ??
      scheme?.modified_at ??
      scheme?.modifiedAt ??
      scheme?.created_at ??
      scheme?.createdAt;

    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const isWithinDateRange = (scheme, range) => {
    if (!range) return true;

    const updatedDate = getSchemeUpdatedDate(scheme);
    if (!updatedDate) return false;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    if (range === "today") {
      return updatedDate >= start;
    }

    const days = Number(range);
    if (!Number.isFinite(days)) return true;

    start.setDate(start.getDate() - days + 1);
    return updatedDate >= start;
  };

  const getSortTime = (scheme) => {
    const date = getSchemeUpdatedDate(scheme);
    return date ? date.getTime() : 0;
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  const filteredSchemes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const filtered = schemes.filter((scheme) => {
      const searchableText = [
        scheme.scheme_name,
        scheme.short_name,
        scheme.category,
        scheme.ministry,
        scheme.department,
        scheme.sector,
        scheme.beneficiary,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesCategory =
        !category || scheme.category === category;

      const matchesMinistry =
        !ministry || scheme.ministry === ministry;

      const matchesStatus =
        !status ||
        (scheme.status || "").toLowerCase() === status.toLowerCase();

      const matchesDate =
        isWithinDateRange(scheme, dateRange);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinistry &&
        matchesStatus &&
        matchesDate
      );
    });

    return [...filtered].sort((a, b) => {
      const difference = getSortTime(b) - getSortTime(a);
      return sortOrder === "oldest" ? -difference : difference;
    });
  }, [
    schemes,
    search,
    category,
    ministry,
    status,
    dateRange,
    sortOrder,
  ]);

  // ==========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [search, category, ministry, status, dateRange]);

  // ==========================================
  // PAGINATION CALCULATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSchemes.length / itemsPerPage
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedSchemes = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return filteredSchemes.slice(
      start,
      start + itemsPerPage
    );
  }, [
    filteredSchemes,
    currentPage,
    itemsPerPage,
  ]);

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns = [
    {
      key: "scheme_name",
      label: "Scheme Name",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "ministry",
      label: "Ministry",
    },
    {
      key: "beneficiary",
      label: "Beneficiary",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  // ==========================================
  // SELECT ONE ROW
  // ==========================================

  const handleSelectRow = (id) => {
    setSelectedRows((previous) => {
      if (previous.includes(id)) {
        return previous.filter(
          (rowId) => rowId !== id
        );
      }

      return [...previous, id];
    });
  };

  // ==========================================
  // SELECT ALL CURRENT PAGE
  // ==========================================

  const handleSelectAll = () => {
    const currentPageIds =
      paginatedSchemes.map(
        (scheme) => scheme.id
      );

    const allCurrentSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) =>
        selectedRows.includes(id)
      );

    if (allCurrentSelected) {
      setSelectedRows((previous) =>
        previous.filter(
          (id) =>
            !currentPageIds.includes(id)
        )
      );

      return;
    }

    setSelectedRows((previous) => [
      ...new Set([
        ...previous,
        ...currentPageIds,
      ]),
    ]);
  };

  // ==========================================
  // VIEW
  // ==========================================

  const handleView = (scheme) => {
    navigate(`/schemes/${scheme.id}`);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (scheme) => {
    navigate(
      `/admin/edit-scheme/${scheme.id}`
    );
  };

  // ==========================================
  // OPEN DELETE MODAL
  // ==========================================

  const handleDelete = (scheme) => {
    setSchemeToDelete(scheme);
    setShowDeleteModal(true);
  };

  // ==========================================
  // CONFIRM DELETE
  // ==========================================

  const confirmDelete = async () => {
    if (!schemeToDelete?.id) return;

    try {
      setDeleting(true);

      await deleteScheme(
        schemeToDelete.id
      );

      setSchemes((previous) =>
        previous.filter(
          (scheme) =>
            scheme.id !==
            schemeToDelete.id
        )
      );

      setSelectedRows((previous) =>
        previous.filter(
          (id) =>
            id !== schemeToDelete.id
        )
      );

      setShowDeleteModal(false);
      setSchemeToDelete(null);
    } catch (err) {
      console.error(
        "Delete scheme error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete scheme."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinistry("");
    setStatus("");
    setDateRange("");
    setSortOrder("recent");
    setCurrentPage(1);
  };

  // ==========================================
  // STATS
  // ==========================================

  const activeCount = useMemo(() => {
    return schemes.filter((scheme) => {
      const value = (
        scheme.status || ""
      ).toLowerCase();

      return (
        value === "active" ||
        value === "published"
      );
    }).length;
  }, [schemes]);

  const newCount = useMemo(() => {
    return schemes.filter(
      (scheme) =>
        (
          scheme.status || ""
        ).toLowerCase() === "new"
    ).length;
  }, [schemes]);

  const pendingReviewSchemes = useMemo(() => {
    return schemes.filter(
      (scheme) =>
        String(scheme.status || "").toLowerCase() === "pending_review"
    );
  }, [schemes]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <Layout>

      {/* ======================================
          HEADER
      ====================================== */}

      <PageHeader
        title="Government Schemes"
        subtitle="Manage Central and State Government Schemes"
      />

      {/* ======================================
          MINI STATS
      ====================================== */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Total Schemes
              </small>

              <h3 className="fw-bold mb-0 mt-1">
                {schemes.length}
              </h3>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Active / Published
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
                New / Imported
              </small>

              <h3 className="fw-bold text-warning mb-0 mt-1">
                {newCount}
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >

          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={loadSchemes}
          >
            <FaSyncAlt className="me-2" />
            Retry
          </button>

        </div>
      )}

      {/* ======================================
          AUTOMATIC DISCOVERY RESULT / ERROR
      ====================================== */}
      {autoError && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{autoError}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => setAutoError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {autoResult && (
        <div className="alert alert-success" role="status">
          <div className="fw-bold mb-1">
            Automatic scheme discovery completed.
          </div>
          <div className="small">
            New candidates:{" "}
            <strong>
              {autoResult?.summary?.discoveredNewCandidates ?? 0}
            </strong>
            {" • "}
            Imported:{" "}
            <strong className="text-success">
              {autoResult?.summary?.imported ?? 0}
            </strong>
            {" • "}
            Approved:{" "}
            <strong>
              {autoResult?.summary?.approved ?? 0}
            </strong>
            {" • "}
            Rejected:{" "}
            <strong>
              {autoResult?.summary?.rejected ?? 0}
            </strong>
          </div>
          <div className="small text-muted mt-1">
            Newly discovered schemes are stored as PENDING REVIEW. Nothing is
            published until you explicitly approve it.
          </div>
        </div>
      )}

      {/* ======================================
          SEARCH + ACTIONS
      ====================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search schemes..."
            />

            <div className="d-flex flex-wrap gap-2">

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={loadSchemes}
                disabled={loading}
              >
                <FaSyncAlt className="me-2" />
                Refresh
              </button>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAutomaticImport}
                disabled={loading || autoImporting}
                title="Discover verified Government schemes and queue them for your review"
              >
                {autoImporting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Discovering...
                  </>
                ) : (
                  <>
                    <FaRobot className="me-2" />
                    Add Schemes Automatically
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() =>
                  navigate("/admin/upload")
                }
              >
                <FaUpload className="me-2" />
                Upload CSV / Excel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  navigate(
                    "/admin/add-scheme"
                  )
                }
              >
                <FaPlus className="me-2" />
                Add Scheme
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <FilterBar
        category={category}
        ministry={ministry}
        status={status}
        categories={categories}
        ministries={ministries}
        onCategoryChange={
          setCategory
        }
        onMinistryChange={
          setMinistry
        }
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {/* ======================================
          UPDATED DATE + SORT
      ====================================== */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-semibold mb-2">
                <FaCalendarAlt className="me-2 text-primary" />
                Updated Date
              </label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="">All dates</option>
                <option value="today">Updated today</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold mb-2">
                <FaSortAmountDown className="me-2 text-primary" />
                Sort by
              </label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="recent">Recently Updated First</option>
                <option value="oldest">Oldest Updated First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          RESULTS INFORMATION
      ====================================== */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">

        <div className="text-muted">

          <FaLayerGroup className="me-2" />

          Showing{" "}

          <strong>
            {paginatedSchemes.length}
          </strong>

          {" "}of{" "}

          <strong>
            {filteredSchemes.length}
          </strong>

          {" "}matching schemes

        </div>

        {selectedRows.length > 0 && (

          <div>

            <span className="badge bg-primary me-2">

              {selectedRows.length} selected

            </span>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              disabled
              title="Bulk delete will be added next"
            >
              <FaTrash className="me-2" />
              Bulk Delete
            </button>

          </div>

        )}

      </div>

      {/* ======================================
          PENDING REVIEW — HUMAN PUBLISHING GATE
      ====================================== */}
      {pendingReviewSchemes.length > 0 && (
        <div className="card border-warning shadow-sm mb-4">
          <div className="card-header bg-warning-subtle d-flex justify-content-between align-items-center">
            <div>
              <strong>Pending Review</strong>
              <span className="badge bg-warning text-dark ms-2">
                {pendingReviewSchemes.length}
              </span>
            </div>
            <small className="text-muted">Only your approval can publish these schemes</small>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {pendingReviewSchemes.slice(0, 20).map((scheme) => (
                <div className="col-12" key={scheme.id}>
                  <div className="border rounded-3 p-3 bg-light">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <div>
                        <div className="fw-bold">{scheme.scheme_name}</div>
                        <div className="small text-muted">
                          {scheme.ministry || "Ministry not specified"}
                          {scheme.official_website ? ` • ${scheme.official_website}` : ""}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(scheme)}>
                          Review Details
                        </button>
                        <button type="button" className="btn btn-sm btn-success" disabled={publishingId === scheme.id || rejectingId === scheme.id} onClick={() => handleApproveAndPublish(scheme)}>
                          {publishingId === scheme.id ? "Publishing..." : "Approve & Publish"}
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" disabled={publishingId === scheme.id || rejectingId === scheme.id} onClick={() => handleRejectScheme(scheme)}>
                          {rejectingId === scheme.id ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pendingReviewSchemes.length > 20 && (
              <div className="small text-muted mt-3">Showing first 20 pending schemes. Use the status filter to review the rest.</div>
            )}
          </div>
        </div>
      )}

      {/* ======================================
          DATA TABLE
      ====================================== */}

      <DataTable
        columns={columns}
        data={paginatedSchemes}
        loading={loading}
        selectedRows={selectedRows}
        onSelectRow={
          handleSelectRow
        }
        onSelectAll={
          handleSelectAll
        }
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ======================================
          PAGINATION
      ====================================== */}

      {!loading &&
        filteredSchemes.length > 0 && (

          <div className="mt-4">

            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                setCurrentPage
              }
            />

          </div>

        )}

      {/* ======================================
          DELETE CONFIRMATION
      ====================================== */}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Scheme"
        message={
          schemeToDelete
            ? `Are you sure you want to delete "${schemeToDelete.scheme_name}"? This action cannot be undone.`
            : "Are you sure you want to delete this scheme?"
        }
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete"
        }
        onCancel={() => {
          if (deleting) return;

          setShowDeleteModal(false);
          setSchemeToDelete(null);
        }}
        onConfirm={
          confirmDelete
        }
      />

    </Layout>
  );
}