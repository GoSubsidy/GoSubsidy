import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLayerGroup,
  FaCheckCircle,
  FaFileAlt,
  FaPlus,
  FaUpload,
  FaEye,
  FaEdit,
  FaSyncAlt,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

import { fetchSchemes } from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchSchemes();

      setSchemes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const stats = useMemo(() => {
    const total = schemes.length;

    const active = schemes.filter((scheme) => {
      const status = (scheme.status || "").toLowerCase();

      return (
        status === "active" ||
        status === "published"
      );
    }).length;

    const draft = schemes.filter(
      (scheme) =>
        (scheme.status || "").toLowerCase() === "draft"
    ).length;

    const inactive = schemes.filter(
      (scheme) =>
        (scheme.status || "").toLowerCase() === "inactive"
    ).length;

    return {
      total,
      active,
      draft,
      inactive,
    };
  }, [schemes]);

  // ==========================================
  // RECENT SCHEMES
  // ==========================================

  const recentSchemes = useMemo(() => {
    return [...schemes]
      .sort((a, b) => {
        const dateA = new Date(
          a.updated_at || a.created_at || 0
        );

        const dateB = new Date(
          b.updated_at || b.created_at || 0
        );

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [schemes]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="text-center">

            <div
              className="spinner-border text-primary"
              role="status"
            />

            <p className="text-muted mt-3 mb-0">
              Loading dashboard...
            </p>

          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <PageHeader
        title="Dashboard"
        subtitle="Overview of your GoSubsidy Admin Portal"
      />

      {/* ======================================
          ERROR MESSAGE
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
            onClick={loadDashboard}
          >
            <FaSyncAlt className="me-2" />
            Retry
          </button>
        </div>
      )}

      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="row g-4 mb-4">

        {/* TOTAL SCHEMES */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-muted mb-1">
                    Total Schemes
                  </p>

                  <h2 className="fw-bold mb-0">
                    {stats.total}
                  </h2>
                </div>

                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                  }}
                >
                  <FaLayerGroup size={23} />
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
                  <p className="text-muted mb-1">
                    Active Schemes
                  </p>

                  <h2 className="fw-bold mb-0">
                    {stats.active}
                  </h2>
                </div>

                <div
                  className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                  }}
                >
                  <FaCheckCircle size={23} />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* DRAFT */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-muted mb-1">
                    Draft Schemes
                  </p>

                  <h2 className="fw-bold mb-0">
                    {stats.draft}
                  </h2>
                </div>

                <div
                  className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                  }}
                >
                  <FaFileAlt size={23} />
                </div>

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
                  <p className="text-muted mb-1">
                    Inactive Schemes
                  </p>

                  <h2 className="fw-bold mb-0">
                    {stats.inactive}
                  </h2>
                </div>

                <div
                  className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                  }}
                >
                  <FaFileAlt size={23} />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          QUICK ACTIONS
      ====================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <h5 className="fw-bold mb-1">
            Quick Actions
          </h5>

          <p className="text-muted small mb-0">
            Common scheme management actions
          </p>

        </div>

        <div className="card-body p-4">

          <div className="d-flex flex-wrap gap-3">

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/admin/add-scheme")
              }
            >
              <FaPlus className="me-2" />
              Add Scheme
            </button>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                navigate("/admin/schemes")
              }
            >
              <FaLayerGroup className="me-2" />
              Manage Schemes
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
              className="btn btn-outline-secondary"
              onClick={loadDashboard}
            >
              <FaSyncAlt className="me-2" />
              Refresh
            </button>

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => navigate("/admin/analytics")}
            >
              <FaEye className="me-2" />
              View Analytics
            </button>

          </div>

        </div>

      </div>

      {/* ======================================
          RECENT SCHEMES
      ====================================== */}

      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="fw-bold mb-1">
                Recent Schemes
              </h5>

              <p className="text-muted small mb-0">
                Recently added or updated schemes
              </p>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                navigate("/admin/schemes")
              }
            >
              View All
            </button>

          </div>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>
                  <th className="ps-4">
                    Scheme Name
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Ministry
                  </th>

                  <th>
                    Status
                  </th>

                  <th className="text-end pe-4">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {recentSchemes.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-5"
                    >

                      <FaLayerGroup
                        size={35}
                        className="text-muted mb-3"
                      />

                      <h6>
                        No schemes available
                      </h6>

                      <p className="text-muted small">
                        Add your first Government Scheme.
                      </p>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          navigate("/admin/add-scheme")
                        }
                      >
                        <FaPlus className="me-2" />
                        Add Scheme
                      </button>

                    </td>

                  </tr>

                ) : (

                  recentSchemes.map((scheme) => (

                    <tr key={scheme.id}>

                      <td className="ps-4">

                        <div className="fw-semibold">
                          {scheme.scheme_name || "Untitled Scheme"}
                        </div>

                        {scheme.short_name && (
                          <small className="text-muted">
                            {scheme.short_name}
                          </small>
                        )}

                      </td>

                      <td>
                        {scheme.category || "—"}
                      </td>

                      <td>
                        {scheme.ministry || "—"}
                      </td>

                      <td>
                        <StatusBadge
                          status={scheme.status}
                        />
                      </td>

                      <td className="text-end pe-4">

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          title="View"
                          onClick={() =>
                            navigate(
                              `/schemes/${scheme.id}`
                            )
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/admin/edit-scheme/${scheme.id}`
                            )
                          }
                        >
                          <FaEdit />
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