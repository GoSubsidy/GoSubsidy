import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import SchemeForm from "../components/SchemeForm";

import {
  fetchScheme,
  updateScheme,
} from "../../services/api";

export default function EditScheme() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [scheme, setScheme] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // LOAD SCHEME
  // ==========================================

  useEffect(() => {
    if (!id) return;

    loadScheme();
  }, [id]);

  async function loadScheme() {
    try {
      setPageLoading(true);
      setErrorMessage("");

      const response = await fetchScheme(id);

      console.log("Loaded scheme:", response);

      // Supports:
      // { success: true, data: {...} }
      // OR
      // {...}

      const schemeData =
        response?.data || response;

      if (!schemeData) {
        throw new Error("Scheme not found.");
      }

      setScheme(schemeData);
    } catch (error) {
      console.error("Load scheme error:", error);

      setScheme(null);

      setErrorMessage(
        error?.message ||
          "Unable to load the scheme."
      );
    } finally {
      setPageLoading(false);
    }
  }

  // ==========================================
  // UPDATE SCHEME
  // ==========================================

  async function handleSubmit(formData) {
    try {
      setSaving(true);

      setErrorMessage("");
      setSuccessMessage("");

      // ======================================
      // REMOVE FRONTEND-ONLY FIELDS
      // ======================================
      //
      // These fields are used by the UI/file
      // upload components but should NOT be
      // sent directly to the schemes table.
      //
      // This prevents errors such as:
      //
      // Could not find the 'image' column
      // Could not find the 'banner_url' column
      // etc.
      // ======================================

      const {
        logo,
        banner,
        image,
        guidelineFile,
        banner_url,
        banner_path,
        ...schemeData
      } = formData;

      // ======================================
      // DATABASE PAYLOAD
      // ======================================

      const payload = {
        ...schemeData,

        status:
          schemeData.status || "Draft",
      };

      console.log(
        "Updating Scheme ID:",
        id
      );

      console.log(
        "Clean update payload:",
        payload
      );

      // ======================================
      // UPDATE DATABASE
      // ======================================

      const response = await updateScheme(
        id,
        payload
      );

      console.log(
        "Update response:",
        response
      );

      // ======================================
      // SUCCESS MESSAGE
      // ======================================

      const isDraft =
        payload.status
          ?.toLowerCase() === "draft";

      setSuccessMessage(
        isDraft
          ? "Scheme draft updated successfully."
          : "Scheme updated successfully."
      );

      // Redirect after short success message

      setTimeout(() => {
        navigate("/admin/schemes");
      }, 800);
    } catch (error) {
      console.error(
        "Update scheme error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to update the scheme. Please try again."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // CANCEL
  // ==========================================

  function handleCancel() {
    navigate("/admin/schemes");
  }

  // ==========================================
  // PAGE LOADING
  // ==========================================

  if (pageLoading) {
    return (
      <Layout>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            minHeight: "60vh",
          }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary"
              role="status"
            />

            <h6 className="fw-bold mt-3 mb-1">
              Loading Scheme
            </h6>

            <p className="text-muted small mb-0">
              Fetching scheme information...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ==========================================
  // SCHEME NOT FOUND / LOAD ERROR
  // ==========================================

  if (!scheme) {
    return (
      <Layout>
        <PageHeader
          title="Edit Government Scheme"
          subtitle="Update scheme information"
        />

        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaExclamationTriangle
              size={40}
              className="text-danger mb-3"
            />

            <h5>
              Unable to Load Scheme
            </h5>

            <p className="text-muted">
              {errorMessage ||
                "The requested scheme could not be found."}
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={loadScheme}
              >
                <FaSyncAlt className="me-2" />
                Retry
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCancel}
              >
                <FaArrowLeft className="me-2" />
                Back to Schemes
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ==========================================
  // EDIT PAGE
  // ==========================================

  return (
    <Layout>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <PageHeader
          title="Edit Government Scheme"
          subtitle={
            scheme.scheme_name
              ? `Editing: ${scheme.scheme_name}`
              : "Update Government Scheme information"
          }
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleCancel}
          disabled={saving}
        >
          <FaArrowLeft className="me-2" />
          Back to Schemes
        </button>
      </div>

      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {successMessage && (
        <div
          className="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <FaCheckCircle className="me-2" />

          <div>
            {successMessage}
          </div>
        </div>
      )}

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-start"
          role="alert"
        >
          <FaExclamationTriangle
            className="me-2 mt-1"
          />

          <div>
            <strong>
              Unable to update scheme
            </strong>

            <div>
              {errorMessage}
            </div>
          </div>
        </div>
      )}

      {/* ======================================
          SCHEME INFORMATION
      ====================================== */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">

            {/* Scheme ID */}

            <div className="col-md-4">
              <small className="text-muted d-block">
                Scheme ID
              </small>

              <strong>
                {scheme.id}
              </strong>
            </div>

            {/* Current Status */}

            <div className="col-md-4">
              <small className="text-muted d-block">
                Current Status
              </small>

              <strong>
                {scheme.status || "Draft"}
              </strong>
            </div>

            {/* Last Updated */}

            <div className="col-md-4">
              <small className="text-muted d-block">
                Last Updated
              </small>

              <strong>
                {scheme.updated_at
                  ? new Date(
                      scheme.updated_at
                    ).toLocaleDateString()
                  : "—"}
              </strong>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================
          SCHEME FORM
      ====================================== */}

      <SchemeForm
        key={scheme.id}
        initialData={scheme}
        loading={saving}
        onSubmit={handleSubmit}
      />

      {/* ======================================
          SAVING OVERLAY
      ====================================== */}

      {saving && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background:
              "rgba(255,255,255,0.75)",
            backdropFilter:
              "blur(2px)",
            zIndex: 9999,
          }}
        >
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center px-5 py-4">
              <div
                className="spinner-border text-primary"
                role="status"
              />

              <h6 className="fw-bold mt-3 mb-1">
                Updating Scheme
              </h6>

              <p className="text-muted small mb-0">
                Please wait while your changes are saved...
              </p>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}