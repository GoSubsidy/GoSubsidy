import React, { useEffect, useState } from "react";
import {
  FaSave,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSearch,
  FaRobot,
  FaShieldAlt,
  FaBell,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUndo,
  FaCog,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

// ======================================================
// DEFAULT SETTINGS
// ======================================================

const defaultSettings = {
  // General
  site_name: "GoSubsidy",
  site_tagline: "Find Government Schemes & Subsidies",
  site_description:
    "Discover Government schemes, subsidies, loans and benefits available for citizens, farmers, students, businesses and entrepreneurs.",
  support_email: "",
  support_phone: "",
  address: "",

  // SEO
  meta_title:
    "GoSubsidy - Government Schemes & Subsidies",
  meta_description:
    "Find Government schemes, subsidies, loans and benefits in India.",
  meta_keywords:
    "government schemes, subsidy, loans, MSME, agriculture, education",

  // Portal
  schemes_per_page: 20,
  default_scheme_status: "Draft",
  enable_public_schemes: true,
  enable_scheme_search: true,
  enable_ai_advisor: true,
  enable_cibil: true,
  enable_loans: true,

  // Notifications
  email_notifications: true,
  scheme_publish_notification: true,
  import_notification: true,

  // Maintenance
  maintenance_mode: false,
};

// ======================================================
// STORAGE KEY
// ======================================================

const STORAGE_KEY = "gosubsidy_admin_settings";

export default function Settings() {
  // ====================================================
  // STATE
  // ====================================================

  const [settings, setSettings] =
    useState(defaultSettings);

  const [activeTab, setActiveTab] =
    useState("general");

  const [saving, setSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ====================================================
  // LOAD SETTINGS
  // ====================================================

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (!stored) return;

      const parsed =
        JSON.parse(stored);

      setSettings({
        ...defaultSettings,
        ...parsed,
      });
    } catch (error) {
      console.error(
        "Unable to load settings:",
        error
      );
    }
  }, []);

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSuccessMessage("");
    setErrorMessage("");

    setSettings((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // ====================================================
  // SAVE SETTINGS
  // ====================================================

  const handleSave = async (event) => {
    event?.preventDefault();

    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      // Basic validation
      if (!settings.site_name.trim()) {
        throw new Error(
          "Website name is required."
        );
      }

      if (
        settings.schemes_per_page < 5 ||
        settings.schemes_per_page > 100
      ) {
        throw new Error(
          "Schemes per page must be between 5 and 100."
        );
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSuccessMessage(
        "Settings saved successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Settings save error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // RESET SETTINGS
  // ====================================================

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Reset all portal settings to their default values?"
      );

    if (!confirmed) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );

    setSuccessMessage(
      "Settings restored to default values."
    );

    setErrorMessage("");
  };

  // ====================================================
  // TOGGLE COMPONENT
  // ====================================================

  const ToggleSetting = ({
    name,
    title,
    description,
  }) => {
    return (
      <div className="d-flex justify-content-between align-items-start gap-4 py-3 border-bottom">

        <div>
          <div className="fw-semibold">
            {title}
          </div>

          <small className="text-muted">
            {description}
          </small>
        </div>

        <div className="form-check form-switch">

          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            name={name}
            checked={Boolean(settings[name])}
            onChange={handleChange}
            style={{
              width: "44px",
              height: "22px",
              cursor: "pointer",
            }}
          />

        </div>

      </div>
    );
  };

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
          title="Settings"
          subtitle="Configure the GoSubsidy portal and admin preferences"
        />

        <div className="d-flex gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo className="me-2" />
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save Settings
              </>
            )}
          </button>

        </div>

      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (

        <div className="alert alert-success d-flex align-items-center">

          <FaCheckCircle className="me-2" />

          {successMessage}

        </div>

      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {errorMessage && (

        <div className="alert alert-danger d-flex align-items-center">

          <FaExclamationTriangle className="me-2" />

          {errorMessage}

        </div>

      )}

      <div className="row g-4">

        {/* =================================================
            SETTINGS NAVIGATION
        ================================================= */}

        <div className="col-xl-3 col-lg-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body p-2">

              {/* GENERAL */}

              <button
                type="button"
                className={`btn w-100 text-start p-3 ${
                  activeTab === "general"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveTab("general")
                }
              >
                <FaGlobe className="me-2" />
                General
              </button>

              {/* SEO */}

              <button
                type="button"
                className={`btn w-100 text-start p-3 mt-1 ${
                  activeTab === "seo"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveTab("seo")
                }
              >
                <FaSearch className="me-2" />
                SEO Settings
              </button>

              {/* FEATURES */}

              <button
                type="button"
                className={`btn w-100 text-start p-3 mt-1 ${
                  activeTab === "features"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveTab("features")
                }
              >
                <FaCog className="me-2" />
                Portal Features
              </button>

              {/* AI */}

              <button
                type="button"
                className={`btn w-100 text-start p-3 mt-1 ${
                  activeTab === "ai"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveTab("ai")
                }
              >
                <FaRobot className="me-2" />
                AI Advisor
              </button>

              {/* NOTIFICATIONS */}

              <button
                type="button"
                className={`btn w-100 text-start p-3 mt-1 ${
                  activeTab === "notifications"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveTab(
                    "notifications"
                  )
                }
              >
                <FaBell className="me-2" />
                Notifications
              </button>

              {/* SYSTEM */}

              <button
                type="button"
                className={`btn w-100 text-start p-3 mt-1 ${
                  activeTab === "system"
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveTab("system")
                }
              >
                <FaShieldAlt className="me-2" />
                System
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            SETTINGS CONTENT
        ================================================= */}

        <div className="col-xl-9 col-lg-8">

          <form onSubmit={handleSave}>

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4 p-lg-5">

                {/* =========================================
                    GENERAL
                ========================================= */}

                {activeTab === "general" && (
                  <>

                    <div className="mb-4">

                      <h4 className="fw-bold mb-1">
                        General Settings
                      </h4>

                      <p className="text-muted mb-0">
                        Configure your portal identity and contact information.
                      </p>

                    </div>

                    <div className="row g-4">

                      {/* SITE NAME */}

                      <div className="col-md-6">

                        <label className="form-label fw-semibold">
                          Website Name
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          name="site_name"
                          value={settings.site_name}
                          onChange={handleChange}
                          placeholder="GoSubsidy"
                        />

                      </div>

                      {/* TAGLINE */}

                      <div className="col-md-6">

                        <label className="form-label fw-semibold">
                          Website Tagline
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          name="site_tagline"
                          value={
                            settings.site_tagline
                          }
                          onChange={handleChange}
                          placeholder="Find Government Schemes & Subsidies"
                        />

                      </div>

                      {/* DESCRIPTION */}

                      <div className="col-12">

                        <label className="form-label fw-semibold">
                          Website Description
                        </label>

                        <textarea
                          className="form-control"
                          rows="4"
                          name="site_description"
                          value={
                            settings.site_description
                          }
                          onChange={handleChange}
                        />

                      </div>

                      {/* EMAIL */}

                      <div className="col-md-6">

                        <label className="form-label fw-semibold">
                          Support Email
                        </label>

                        <div className="input-group">

                          <span className="input-group-text bg-white">
                            <FaEnvelope />
                          </span>

                          <input
                            type="email"
                            className="form-control"
                            name="support_email"
                            value={
                              settings.support_email
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="support@gosubsidy.in"
                          />

                        </div>

                      </div>

                      {/* PHONE */}

                      <div className="col-md-6">

                        <label className="form-label fw-semibold">
                          Support Phone
                        </label>

                        <div className="input-group">

                          <span className="input-group-text bg-white">
                            <FaPhone />
                          </span>

                          <input
                            type="text"
                            className="form-control"
                            name="support_phone"
                            value={
                              settings.support_phone
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="+91..."
                          />

                        </div>

                      </div>

                      {/* ADDRESS */}

                      <div className="col-12">

                        <label className="form-label fw-semibold">
                          Contact Address
                        </label>

                        <div className="input-group">

                          <span className="input-group-text bg-white align-items-start pt-3">
                            <FaMapMarkerAlt />
                          </span>

                          <textarea
                            className="form-control"
                            rows="3"
                            name="address"
                            value={
                              settings.address
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="Office address"
                          />

                        </div>

                      </div>

                    </div>

                  </>
                )}

                {/* =========================================
                    SEO SETTINGS
                ========================================= */}

                {activeTab === "seo" && (
                  <>

                    <div className="mb-4">

                      <h4 className="fw-bold mb-1">
                        SEO Settings
                      </h4>

                      <p className="text-muted mb-0">
                        Configure default search engine metadata for GoSubsidy.
                      </p>

                    </div>

                    <div className="row g-4">

                      <div className="col-12">

                        <label className="form-label fw-semibold">
                          Default Meta Title
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          name="meta_title"
                          value={
                            settings.meta_title
                          }
                          onChange={handleChange}
                        />

                        <div className="d-flex justify-content-between mt-1">

                          <small className="text-muted">
                            Recommended around 50–60 characters.
                          </small>

                          <small className="text-muted">
                            {
                              settings.meta_title
                                .length
                            }
                          </small>

                        </div>

                      </div>

                      <div className="col-12">

                        <label className="form-label fw-semibold">
                          Default Meta Description
                        </label>

                        <textarea
                          className="form-control"
                          rows="4"
                          name="meta_description"
                          value={
                            settings.meta_description
                          }
                          onChange={handleChange}
                        />

                        <div className="text-end">

                          <small className="text-muted">
                            {
                              settings
                                .meta_description
                                .length
                            }{" "}
                            characters
                          </small>

                        </div>

                      </div>

                      <div className="col-12">

                        <label className="form-label fw-semibold">
                          Default Keywords
                        </label>

                        <textarea
                          className="form-control"
                          rows="3"
                          name="meta_keywords"
                          value={
                            settings.meta_keywords
                          }
                          onChange={handleChange}
                          placeholder="government schemes, subsidy, loans"
                        />

                      </div>

                    </div>

                  </>
                )}

                {/* =========================================
                    PORTAL FEATURES
                ========================================= */}

                {activeTab === "features" && (
                  <>

                    <div className="mb-3">

                      <h4 className="fw-bold mb-1">
                        Portal Features
                      </h4>

                      <p className="text-muted mb-0">
                        Control the major features available on the GoSubsidy portal.
                      </p>

                    </div>

                    <ToggleSetting
                      name="enable_public_schemes"
                      title="Public Scheme Directory"
                      description="Allow visitors to browse published Government Schemes."
                    />

                    <ToggleSetting
                      name="enable_scheme_search"
                      title="Scheme Search"
                      description="Enable public scheme search and filtering."
                    />

                    <ToggleSetting
                      name="enable_cibil"
                      title="CIBIL Module"
                      description="Show the CIBIL assistance module on the public portal."
                    />

                    <ToggleSetting
                      name="enable_loans"
                      title="Loan Module"
                      description="Enable loan-related features and pages."
                    />

                    <div className="row g-4 mt-2">

                      <div className="col-md-6">

                        <label className="form-label fw-semibold">
                          Schemes Per Page
                        </label>

                        <input
                          type="number"
                          min="5"
                          max="100"
                          className="form-control"
                          name="schemes_per_page"
                          value={
                            settings.schemes_per_page
                          }
                          onChange={handleChange}
                        />

                      </div>

                      <div className="col-md-6">

                        <label className="form-label fw-semibold">
                          Default New Scheme Status
                        </label>

                        <select
                          className="form-select"
                          name="default_scheme_status"
                          value={
                            settings.default_scheme_status
                          }
                          onChange={handleChange}
                        >

                          <option value="Draft">
                            Draft
                          </option>

                          <option value="Published">
                            Published
                          </option>

                        </select>

                      </div>

                    </div>

                  </>
                )}

                {/* =========================================
                    AI ADVISOR
                ========================================= */}

                {activeTab === "ai" && (
                  <>

                    <div className="mb-3">

                      <h4 className="fw-bold mb-1">
                        AI Advisor
                      </h4>

                      <p className="text-muted mb-0">
                        Control AI-powered scheme assistance features.
                      </p>

                    </div>

                    <ToggleSetting
                      name="enable_ai_advisor"
                      title="Enable AI Advisor"
                      description="Allow users to access AI-powered scheme guidance."
                    />

                    <div className="alert alert-info mt-4 mb-0">

                      <FaRobot className="me-2" />

                      AI provider configuration and secret API keys should be managed securely on the backend, not stored in this browser settings page.

                    </div>

                  </>
                )}

                {/* =========================================
                    NOTIFICATIONS
                ========================================= */}

                {activeTab ===
                  "notifications" && (
                  <>

                    <div className="mb-3">

                      <h4 className="fw-bold mb-1">
                        Notifications
                      </h4>

                      <p className="text-muted mb-0">
                        Configure administrative notifications.
                      </p>

                    </div>

                    <ToggleSetting
                      name="email_notifications"
                      title="Email Notifications"
                      description="Enable administrative email notifications."
                    />

                    <ToggleSetting
                      name="scheme_publish_notification"
                      title="Scheme Publishing Alerts"
                      description="Send notifications when schemes are published."
                    />

                    <ToggleSetting
                      name="import_notification"
                      title="Import Completion Alerts"
                      description="Notify administrators when bulk scheme imports finish."
                    />

                  </>
                )}

                {/* =========================================
                    SYSTEM
                ========================================= */}

                {activeTab === "system" && (
                  <>

                    <div className="mb-4">

                      <h4 className="fw-bold mb-1">
                        System Settings
                      </h4>

                      <p className="text-muted mb-0">
                        Portal-level system configuration.
                      </p>

                    </div>

                    <div className="card bg-light border-0 mb-4">

                      <div className="card-body">

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                            }}
                          >
                            <FaDatabase />
                          </div>

                          <div>

                            <div className="fw-semibold">
                              Database
                            </div>

                            <small className="text-muted">
                              Supabase database integration
                            </small>

                          </div>

                        </div>

                      </div>

                    </div>

                    <ToggleSetting
                      name="maintenance_mode"
                      title="Maintenance Mode"
                      description="Temporarily mark the public portal as unavailable while maintenance is performed."
                    />

                    {settings.maintenance_mode && (

                      <div className="alert alert-warning mt-3">

                        <FaExclamationTriangle className="me-2" />

                        Maintenance mode is enabled in settings. Backend/public-route enforcement must also be implemented before this actually blocks the public website.

                      </div>

                    )}

                    <div className="alert alert-secondary mt-4 mb-0">

                      <FaShieldAlt className="me-2" />

                      Database credentials, Supabase service-role keys, AI API keys and other secrets must never be stored here or exposed in frontend code.

                    </div>

                  </>
                )}

                {/* =========================================
                    BOTTOM SAVE BUTTON
                ========================================= */}

                <hr className="my-4" />

                <div className="d-flex justify-content-end">

                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={saving}
                  >

                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" />
                        Save Settings
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>

      </div>

    </Layout>
  );
}