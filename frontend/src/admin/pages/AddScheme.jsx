import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import SchemeForm from "../components/SchemeForm";

import { createScheme } from "../../services/api";

export default function AddScheme() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ======================================================
  // CREATE SCHEME
  // ======================================================

  async function handleSubmit(formData) {
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // ==================================================
      // REMOVE FRONTEND-ONLY FILE OBJECTS
      // ==================================================

      const {
        image,
        logo,
        banner,
        guidelineFile,
        ...schemeData
      } = formData;

      // ==================================================
      // DATABASE PAYLOAD
      // Only send fields supported by current schema
      // ==================================================

      const payload = {
        scheme_name: schemeData.scheme_name || "",
        category: schemeData.category || "",
        ministry: schemeData.ministry || "",
        department: schemeData.department || "",
        beneficiary: schemeData.beneficiary || "",
        sector: schemeData.sector || "",
        description: schemeData.description || "",

        state_applicability:
          schemeData.state_applicability || "All India",

        official_website:
          schemeData.official_website || "",

        official_apply_link:
          schemeData.official_apply_link || "",

        guideline_pdf:
          schemeData.guideline_pdf || "",

        status:
          schemeData.status || "Draft",

        // JSONB
        benefits: Array.isArray(schemeData.benefits)
          ? schemeData.benefits
          : [],

        eligibility:
          schemeData.eligibility &&
          typeof schemeData.eligibility === "object"
            ? schemeData.eligibility
            : {},

        documents: Array.isArray(schemeData.documents)
          ? schemeData.documents
          : [],

        application:
          schemeData.application &&
          typeof schemeData.application === "object"
            ? schemeData.application
            : {},

        seo:
          schemeData.seo &&
          typeof schemeData.seo === "object"
            ? schemeData.seo
            : {},
      };

      console.log("Creating scheme payload:", payload);

      // ==================================================
      // SAVE
      // ==================================================

      const response = await createScheme(payload);

      console.log("Scheme created:", response);

      setSuccessMessage(
        payload.status?.toLowerCase() === "draft"
          ? "Scheme draft saved successfully."
          : "Scheme published successfully."
      );

      // ==================================================
      // REDIRECT
      // ==================================================

      setTimeout(() => {
        navigate("/admin/schemes");
      }, 1000);
    } catch (error) {
      console.error("Create Scheme Error:", error);

      setErrorMessage(
        error?.message ||
          "Unable to create the scheme. Please try again."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // CANCEL
  // ======================================================

  function handleCancel() {
    if (loading) return;

    navigate("/admin/schemes");
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <Layout>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <PageHeader
          title="Add Government Scheme"
          subtitle="Create and publish a new Government Scheme"
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          <FaArrowLeft className="me-2" />
          Back to Schemes
        </button>
      </div>

      {/* SUCCESS */}

      {successMessage && (
        <div
          className="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <FaCheckCircle className="me-2" />

          <div>{successMessage}</div>
        </div>
      )}

      {/* ERROR */}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-start"
          role="alert"
        >
          <FaExclamationTriangle className="me-2 mt-1" />

          <div>
            <strong>Unable to save scheme</strong>

            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* FORM */}

      <SchemeForm
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* LOADING OVERLAY */}

      {loading && (
        <div
          className="
            position-fixed
            top-0
            start-0
            w-100
            h-100
            d-flex
            align-items-center
            justify-content-center
          "
          style={{
            background: "rgba(255, 255, 255, 0.80)",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
          }}
        >
          <div
            className="card border-0 shadow-lg"
            style={{
              width: "360px",
              maxWidth: "90%",
            }}
          >
            <div className="card-body text-center p-5">
              <div
                className="spinner-border text-primary"
                role="status"
              />

              <h5 className="fw-bold mt-4 mb-2">
                Saving Scheme
              </h5>

              <p className="text-muted mb-0">
                Saving scheme information...
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}