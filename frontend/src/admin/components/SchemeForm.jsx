import React, { useEffect, useState } from "react";

import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import FileUploader from "./FileUploader";
import BenefitSection from "./BenefitSection";
import EligibilitySection from "./EligibilitySection";
import DocumentChecklist from "./DocumentChecklist";
import ApplicationSection from "./ApplicationSection";
import SeoSection from "./SeoSection";

// ======================================================
// EMPTY / DEFAULT FORM
// ======================================================

const EMPTY_FORM = {
  // Basic information
  scheme_name: "",
  category: "",
  ministry: "",
  department: "",
  beneficiary: "",
  sector: "",
  description: "",

  // Scheme applicability
  state_applicability: "All India",

  // Official references
  official_website: "",
  official_apply_link: "",
  guideline_pdf: "",

  // Status
  status: "Draft",

  // ----------------------------------------------------
  // Benefits must be an ARRAY because BenefitSection
  // uses benefits.map(...)
  // ----------------------------------------------------
  benefits: [],

  // ----------------------------------------------------
  // Eligibility
  // ----------------------------------------------------
  eligibility: {
    minAge: "",
    maxAge: "",
    gender: "",
    minIncome: "",
    maxIncome: "",
    occupation: "",
    category: "",
    residence: "",
    otherCriteria: "",
  },

  // ----------------------------------------------------
  // Required documents
  // ----------------------------------------------------
  documents: [],

  // ----------------------------------------------------
  // Application information
  // ----------------------------------------------------
  application: {
    website: "",
    applyLink: "",
    guidelinePdf: "",
    applicationForm: "",
    process: "",
    mode: "",
    fee: "",
    startDate: "",
    endDate: "",
    contactEmail: "",
    contactPhone: "",
    helpline: "",
    officeAddress: "",
    notes: "",
  },

  // ----------------------------------------------------
  // SEO
  // ----------------------------------------------------
  seo: {
    title: "",
    description: "",
    keywords: "",
    slug: "",
  },

  // ----------------------------------------------------
  // Media
  // ----------------------------------------------------
  image: null,
  guidelineFile: null,
};

// ======================================================
// NORMALIZE FORM DATA
// ======================================================

function createFormData(initialData) {
  const safeData =
    initialData &&
    typeof initialData === "object"
      ? initialData
      : {};

  return {
    ...EMPTY_FORM,
    ...safeData,

    // Benefits must always be array
    benefits: Array.isArray(safeData.benefits)
      ? safeData.benefits
      : [],

    // Eligibility must always be object
    eligibility: {
      ...EMPTY_FORM.eligibility,
      ...(safeData.eligibility || {}),
    },

    // Documents must always be array
    documents: Array.isArray(safeData.documents)
      ? safeData.documents
      : [],

    // Application must always be object
    application: {
      ...EMPTY_FORM.application,
      ...(safeData.application || {}),
    },

    // SEO must always be object
    seo: {
      ...EMPTY_FORM.seo,
      ...(safeData.seo || {}),
    },
  };
}

// ======================================================
// SCHEME FORM
// ======================================================

export default function SchemeForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Save Scheme",
}) {
  // ====================================================
  // FORM STATE
  // ====================================================

  const [formData, setFormData] = useState(() =>
    createFormData(initialData)
  );

  const [errors, setErrors] = useState({});

  // ====================================================
  // EDIT MODE DATA LOADING
  //
  // IMPORTANT:
  // Do NOT depend on the entire initialData object.
  //
  // initialData = {} could become a new object every
  // render and cause:
  //
  // Maximum update depth exceeded
  //
  // We only reload when the scheme ID changes.
  // ====================================================

  const initialDataId =
    initialData?.id ?? initialData?._id ?? null;

  useEffect(() => {
    if (!initialDataId) {
      return;
    }

    setFormData(
      createFormData(initialData)
    );
  }, [initialDataId]);

  // ====================================================
  // BASIC FIELD CHANGE
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    // Clear field error after user changes it
    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      return {
        ...previous,
        [name]: "",
      };
    });
  };

  // ====================================================
  // DESCRIPTION
  // ====================================================

  const handleDescriptionChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      description: value || "",
    }));

    setErrors((previous) => {
      if (!previous.description) {
        return previous;
      }

      return {
        ...previous,
        description: "",
      };
    });
  };

  // ====================================================
  // BENEFITS
  // ====================================================

  const handleBenefitsChange = (value) => {
    setFormData((previous) => ({
      ...previous,

      benefits: Array.isArray(value)
        ? value
        : [],
    }));
  };

  // ====================================================
  // ELIGIBILITY
  // ====================================================

  const handleEligibilityChange = (value) => {
    setFormData((previous) => ({
      ...previous,

      eligibility: {
        ...EMPTY_FORM.eligibility,
        ...(value || {}),
      },
    }));
  };

  // ====================================================
  // DOCUMENTS
  // ====================================================

  const handleDocumentsChange = (value) => {
    setFormData((previous) => ({
      ...previous,

      documents: Array.isArray(value)
        ? value
        : [],
    }));
  };

  // ====================================================
  // APPLICATION
  // ====================================================

  const handleApplicationChange = (value) => {
    setFormData((previous) => ({
      ...previous,

      application: {
        ...EMPTY_FORM.application,
        ...(value || {}),
      },
    }));
  };

  // ====================================================
  // SEO
  // ====================================================

  const handleSeoChange = (value) => {
    setFormData((previous) => ({
      ...previous,

      seo: {
        ...EMPTY_FORM.seo,
        ...(value || {}),
      },
    }));
  };

  // ====================================================
  // TELANGANA MSME QUICK TEMPLATES
  // These templates use only fields already supported by the
  // existing form/database payload. They do not add new
  // database columns.
  // ====================================================

  const TELANGANA_TEMPLATES = {
    tidea: {
      scheme_name: "Telangana MSME Policy 2024 – T-IDEA / General MSME",
      category: "MSME & Business",
      ministry: "Industries & Commerce Department, Government of Telangana",
      department: "Industries Department",
      beneficiary: "Eligible Micro and Small Industrial Enterprises – General Category Entrepreneurs",
      sector: "Manufacturing & Eligible Service Activities",
      description:
        "<p>Telangana MSME Policy 2024 provides incentives and support to eligible Micro and Small Enterprises established or expanded in Telangana, subject to the applicable operational guidelines and conditions.</p><p><strong>Key incentive:</strong> Eligible Micro and Small Industrial Enterprises promoted by men entrepreneurs may receive Investment Subsidy at 25% of eligible Fixed Capital Investment, subject to a maximum of ₹30 lakh, as specified in the operational guidelines.</p><p>Other eligible incentives may include power cost reimbursement, SGST reimbursement, stamp duty and land-conversion related incentives, subject to the applicable conditions.</p>",
      state_applicability: "Telangana",
      status: "Published",
      benefits: [
        {
          title: "Investment Subsidy",
          description:
            "25% of eligible Fixed Capital Investment, subject to a maximum of ₹30 lakh for eligible Micro and Small Industrial Enterprises promoted by men entrepreneurs."
        },
        {
          title: "Power Cost Reimbursement",
          description:
            "Power-cost reimbursement may be available under the applicable Telangana MSME Policy 2024 operational guidelines and claim conditions."
        },
        {
          title: "SGST Reimbursement",
          description:
            "Eligible SGST reimbursement may be available subject to the applicable policy, tax and claim conditions."
        },
        {
          title: "Other Industrial Incentives",
          description:
            "Eligible enterprises may also receive applicable stamp-duty, land-conversion and other incentives prescribed under the operational guidelines."
        }
      ],
      eligibility: {
        minAge: "",
        maxAge: "",
        gender: "Male entrepreneur for the 25% general-category investment subsidy provision",
        minIncome: "",
        maxIncome: "",
        occupation: "Entrepreneur / Industrial Enterprise",
        category: "General Category",
        residence: "Enterprise established in Telangana",
        otherCriteria:
          "Eligibility depends on enterprise size, activity, new/expansion status, Fixed Capital Investment and all conditions prescribed in the Telangana MSME Policy 2024 operational guidelines."
      },
      documents: [
        "Udyam Registration Certificate",
        "PAN / promoter KYC",
        "GST Registration Certificate, where applicable",
        "Detailed Project Report",
        "Project cost / Fixed Capital Investment statement",
        "Plant & Machinery / Equipment invoices",
        "Bank sanction / loan documents, where applicable",
        "Electricity bills for applicable power-cost claims",
        "GST returns / tax records for applicable SGST claims",
        "Land / lease documents, where applicable",
        "Applicable statutory approvals and licences"
      ],
      application: {
        website: "https://ipass.telangana.gov.in/",
        applyLink: "https://ipass.telangana.gov.in/IncentiveRegistrationViewDocsNew.aspx",
        process:
          "Complete the required enterprise registrations and approvals, then submit the applicable incentive claim through TG-iPASS with the prescribed documents and certificates.",
        mode: "Online",
        startDate: "",
        endDate: "",
        contactEmail: "",
        contactPhone: "",
        helpline: ""
      },
      seo: {
        title: "Telangana MSME Policy 2024 – T-IDEA | GoSubsidy",
        description:
          "Explore Telangana MSME Policy 2024 incentives for eligible general-category MSMEs, including investment subsidy and other industrial incentives.",
        keywords:
          "Telangana MSME Policy 2024, T-IDEA, MSME subsidy Telangana, investment subsidy Telangana, TG-iPASS",
        slug: "telangana-msme-policy-2024-t-idea"
      }
    },

    tpride: {
      scheme_name: "Telangana MSME Policy 2024 – T-PRIDE / SC-ST-PwD Incentives",
      category: "MSME & Business",
      ministry: "Industries & Commerce Department, Government of Telangana",
      department: "Industries Department",
      beneficiary: "SC, ST and PwD Entrepreneurs – Eligible Micro and Small Enterprises",
      sector: "Manufacturing & Eligible Service Activities",
      description:
        "<p>Telangana MSME Policy 2024 provides enhanced investment incentives for eligible Micro and Small Enterprises established by SC, ST and PwD entrepreneurs, subject to the applicable operational guidelines.</p><p><strong>Manufacturing:</strong> 50% Investment Subsidy on eligible Fixed Capital Investment for eligible Micro and Small Enterprises, subject to a maximum of ₹100 lakh per unit.</p><p><strong>Service Enterprises:</strong> 35% Investment Subsidy on eligible Fixed Capital Investment, subject to a maximum of ₹75 lakh per unit.</p><p>Additional benefits may apply to eligible women entrepreneurs and other incentives may be available subject to the policy conditions.</p>",
      state_applicability: "Telangana",
      status: "Published",
      benefits: [
        {
          title: "Manufacturing Investment Subsidy",
          description:
            "50% of eligible Fixed Capital Investment for eligible Micro and Small Enterprises set up by SC, ST and PwD entrepreneurs, subject to a maximum of ₹100 lakh per unit."
        },
        {
          title: "Service Investment Subsidy",
          description:
            "35% of eligible Fixed Capital Investment for eligible Micro and Small Enterprises set up by SC, ST and PwD entrepreneurs, subject to a maximum of ₹75 lakh per unit."
        },
        {
          title: "Women Entrepreneur Additional Benefit",
          description:
            "Additional investment subsidy may apply to eligible women entrepreneurs subject to the specific conditions and limits in the operational guidelines."
        },
        {
          title: "Other Industrial Incentives",
          description:
            "Other eligible incentives may include power-cost reimbursement, SGST reimbursement, land and stamp-duty related incentives, subject to the applicable policy conditions."
        }
      ],
      eligibility: {
        minAge: "",
        maxAge: "",
        gender: "",
        minIncome: "",
        maxIncome: "",
        occupation: "Entrepreneur / Industrial Enterprise",
        category: "SC / ST / PwD",
        residence: "Enterprise established in Telangana",
        otherCriteria:
          "Enterprise must satisfy the applicable Micro/Small enterprise, activity, investment, new/expansion and other conditions prescribed in the Telangana MSME Policy 2024 operational guidelines."
      },
      documents: [
        "Udyam Registration Certificate",
        "SC / ST / PwD certificate issued by the competent authority, as applicable",
        "PAN / promoter KYC",
        "GST Registration Certificate, where applicable",
        "Detailed Project Report",
        "Project cost / Fixed Capital Investment statement",
        "Plant & Machinery / Equipment invoices",
        "Bank sanction / loan documents, where applicable",
        "Electricity bills for applicable power-cost claims",
        "GST returns / tax records for applicable SGST claims",
        "Land / lease documents, where applicable",
        "Applicable statutory approvals and licences"
      ],
      application: {
        website: "https://ipass.telangana.gov.in/",
        applyLink: "https://ipass.telangana.gov.in/IncentiveRegistrationViewDocsNew.aspx",
        process:
          "Complete the required enterprise registrations and approvals, then use TG-iPASS to check eligible incentives and submit the applicable incentive claim with prescribed documents and certificates.",
        mode: "Online",
        startDate: "",
        endDate: "",
        contactEmail: "",
        contactPhone: "",
        helpline: ""
      },
      seo: {
        title: "Telangana MSME Policy 2024 – T-PRIDE | GoSubsidy",
        description:
          "Explore Telangana's enhanced MSME incentives for eligible SC, ST and PwD entrepreneurs under the current MSME Policy 2024 operational guidelines.",
        keywords:
          "Telangana T-PRIDE, SC ST MSME subsidy Telangana, PwD MSME subsidy Telangana, MSME Policy 2024, TG-iPASS",
        slug: "telangana-msme-policy-2024-t-pride-sc-st-pwd"
      }
    }
  };

  const applyTelanganaTemplate = (templateKey) => {
    const template = TELANGANA_TEMPLATES[templateKey];

    if (!template) return;

    setFormData((previous) => ({
      ...previous,
      ...template,
      eligibility: {
        ...EMPTY_FORM.eligibility,
        ...(template.eligibility || {})
      },
      application: {
        ...EMPTY_FORM.application,
        ...(template.application || {})
      },
      seo: {
        ...EMPTY_FORM.seo,
        ...(template.seo || {})
      },
      benefits: Array.isArray(template.benefits) ? template.benefits : [],
      documents: Array.isArray(template.documents) ? template.documents : []
    }));

    setErrors({});
  };

  // ====================================================
  // IMAGE
  // ====================================================

  const handleImageChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      image: value || null,
    }));
  };

  // ====================================================
  // GUIDELINE FILE
  // ====================================================

  const handleFileChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      guidelineFile: value || null,
    }));
  };

  // ====================================================
  // VALIDATION
  // ====================================================

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.scheme_name?.trim()) {
      validationErrors.scheme_name =
        "Scheme name is required.";
    }

    if (!formData.category?.trim()) {
      validationErrors.category =
        "Category is required.";
    }

    if (!formData.ministry?.trim()) {
      validationErrors.ministry =
        "Ministry is required.";
    }

    // RichTextEditor can return HTML such as <p><br></p>
    const cleanDescription = String(
      formData.description || ""
    )
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!cleanDescription) {
      validationErrors.description =
        "Scheme description is required.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length ===
      0
    );
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // --------------------------------------------------
    // CLEAN PRODUCTION PAYLOAD
    // --------------------------------------------------

    const payload = {
      ...formData,

      scheme_name:
        formData.scheme_name?.trim() || "",

      category:
        formData.category?.trim() || "",

      ministry:
        formData.ministry?.trim() || "",

      department:
        formData.department?.trim() || "",

      beneficiary:
        formData.beneficiary?.trim() || "",

      sector:
        formData.sector?.trim() || "",

      state_applicability:
        formData.state_applicability?.trim() ||
        "All India",

      official_website:
        formData.official_website?.trim() || "",

      official_apply_link:
        formData.official_apply_link?.trim() ||
        "",

      guideline_pdf:
        formData.guideline_pdf?.trim() || "",

      status:
        formData.status || "Draft",

      benefits: Array.isArray(
        formData.benefits
      )
        ? formData.benefits
        : [],

      eligibility: {
        ...EMPTY_FORM.eligibility,
        ...(formData.eligibility || {}),
      },

      documents: Array.isArray(
        formData.documents
      )
        ? formData.documents
        : [],

      application: {
        ...EMPTY_FORM.application,
        ...(formData.application || {}),
      },

      seo: {
        ...EMPTY_FORM.seo,
        ...(formData.seo || {}),
      },
    };

    try {
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      }
    } catch (error) {
      console.error(
        "Scheme form submission error:",
        error
      );
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <form onSubmit={handleSubmit}>

      {/* =================================================
          VALIDATION ALERT
      ================================================= */}

      {Object.keys(errors).length > 0 && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>
            Please check the form.
          </strong>

          <div className="small mt-1">
            Complete all required fields before
            saving the scheme.
          </div>
        </div>
      )}

      {/* =================================================
          SCHEME INFORMATION
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <h5 className="fw-bold mb-1">
            Scheme Information
          </h5>

          <p className="text-muted small mb-0">
            Enter the main Government scheme
            information.
          </p>

        </div>

        <div className="card-body p-4">

          <div className="row g-3">

            {/* ===========================================
                SCHEME NAME
            ============================================ */}

            <div className="col-12">

              <label className="form-label fw-semibold">
                Scheme Name
                <span className="text-danger ms-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="scheme_name"
                className={`form-control ${
                  errors.scheme_name
                    ? "is-invalid"
                    : ""
                }`}
                value={
                  formData.scheme_name || ""
                }
                onChange={handleChange}
                placeholder="Example: Pradhan Mantri Kisan Samman Nidhi"
              />

              {errors.scheme_name && (
                <div className="invalid-feedback">
                  {errors.scheme_name}
                </div>
              )}

            </div>

            {/* ===========================================
                CATEGORY
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Category
                <span className="text-danger ms-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="category"
                className={`form-control ${
                  errors.category
                    ? "is-invalid"
                    : ""
                }`}
                value={
                  formData.category || ""
                }
                onChange={handleChange}
                placeholder="Agriculture"
              />

              {errors.category && (
                <div className="invalid-feedback">
                  {errors.category}
                </div>
              )}

            </div>

            {/* ===========================================
                SECTOR
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Sector
              </label>

              <input
                type="text"
                name="sector"
                className="form-control"
                value={
                  formData.sector || ""
                }
                onChange={handleChange}
                placeholder="Agriculture / MSME / Education"
              />

            </div>

            {/* ===========================================
                MINISTRY
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Ministry
                <span className="text-danger ms-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="ministry"
                className={`form-control ${
                  errors.ministry
                    ? "is-invalid"
                    : ""
                }`}
                value={
                  formData.ministry || ""
                }
                onChange={handleChange}
                placeholder="Ministry of Agriculture & Farmers Welfare"
              />

              {errors.ministry && (
                <div className="invalid-feedback">
                  {errors.ministry}
                </div>
              )}

            </div>

            {/* ===========================================
                DEPARTMENT
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Department
              </label>

              <input
                type="text"
                name="department"
                className="form-control"
                value={
                  formData.department || ""
                }
                onChange={handleChange}
                placeholder="Department name"
              />

            </div>

            {/* ===========================================
                BENEFICIARY
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Beneficiary
              </label>

              <input
                type="text"
                name="beneficiary"
                className="form-control"
                value={
                  formData.beneficiary || ""
                }
                onChange={handleChange}
                placeholder="Farmers / Students / MSMEs"
              />

            </div>

            {/* ===========================================
                STATE APPLICABILITY
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                State Applicability
              </label>

              <input
                type="text"
                name="state_applicability"
                className="form-control"
                value={
                  formData.state_applicability ||
                  ""
                }
                onChange={handleChange}
                placeholder="All India"
              />

            </div>

            {/* ===========================================
                STATUS
            ============================================ */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Status
              </label>

              <select
                name="status"
                className="form-select"
                value={
                  formData.status || "Draft"
                }
                onChange={handleChange}
              >

                <option value="Draft">
                  Draft
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Archived">
                  Archived
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          TELANGANA MSME QUICK TEMPLATES
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="fw-bold mb-1">
            Telangana MSME Quick Templates
          </h5>
          <p className="text-muted small mb-0">
            Select a verified template to pre-fill the scheme form.
            Review every field before publishing.
          </p>
        </div>

        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-9">
              <label className="form-label fw-semibold">
                Scheme Template
              </label>

              <select
                className="form-select"
                defaultValue=""
                onChange={(event) => {
                  applyTelanganaTemplate(event.target.value);
                  event.target.value = "";
                }}
              >
                <option value="">
                  Select a Telangana MSME template
                </option>
                <option value="tidea">
                  T-IDEA / General MSME – Telangana MSME Policy 2024
                </option>
                <option value="tpride">
                  T-PRIDE / SC-ST-PwD – Telangana MSME Policy 2024
                </option>
              </select>
            </div>

            <div className="col-md-3">
              <div className="alert alert-info mb-0 small">
                <strong>Tip:</strong> Template data is editable.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <h5 className="fw-bold mb-1">
            Scheme Description
          </h5>

          <p className="text-muted small mb-0">
            Provide complete information about the
            scheme.
          </p>

        </div>

        <div className="card-body p-4">

          <RichTextEditor
            value={
              formData.description || ""
            }
            onChange={
              handleDescriptionChange
            }
          />

          {errors.description && (
            <div className="text-danger small mt-2">
              {errors.description}
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          BENEFITS
      ================================================= */}

      <BenefitSection
        benefits={
          Array.isArray(formData.benefits)
            ? formData.benefits
            : []
        }
        onChange={handleBenefitsChange}
      />

      {/* =================================================
          ELIGIBILITY
      ================================================= */}

      <EligibilitySection
        eligibility={{
          ...EMPTY_FORM.eligibility,
          ...(formData.eligibility || {}),
        }}
        onChange={
          handleEligibilityChange
        }
      />

      {/* =================================================
          DOCUMENTS
      ================================================= */}

      <DocumentChecklist
        documents={
          Array.isArray(formData.documents)
            ? formData.documents
            : []
        }
        onChange={
          handleDocumentsChange
        }
      />

      {/* =================================================
          APPLICATION
      ================================================= */}

      <ApplicationSection
        application={{
          ...EMPTY_FORM.application,
          ...(formData.application || {}),
        }}
        onChange={
          handleApplicationChange
        }
      />

      {/* =================================================
          OFFICIAL REFERENCES
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white border-0 pt-4 px-4">

          <h5 className="fw-bold mb-1">
            Official References
          </h5>

          <p className="text-muted small mb-0">
            Add verified Government website and
            application links.
          </p>

        </div>

        <div className="card-body p-4">

          <div className="row g-3">

            {/* OFFICIAL WEBSITE */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Official Website
              </label>

              <input
                type="url"
                name="official_website"
                className="form-control"
                value={
                  formData.official_website ||
                  ""
                }
                onChange={handleChange}
                placeholder="https://www.example.gov.in"
              />

            </div>

            {/* APPLY LINK */}

            <div className="col-md-6">

              <label className="form-label fw-semibold">
                Official Apply Link
              </label>

              <input
                type="url"
                name="official_apply_link"
                className="form-control"
                value={
                  formData.official_apply_link ||
                  ""
                }
                onChange={handleChange}
                placeholder="https://..."
              />

            </div>

            {/* GUIDELINE PDF */}

            <div className="col-12">

              <label className="form-label fw-semibold">
                Official Guideline PDF URL
              </label>

              <input
                type="url"
                name="guideline_pdf"
                className="form-control"
                value={
                  formData.guideline_pdf || ""
                }
                onChange={handleChange}
                placeholder="https://example.gov.in/guidelines.pdf"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          IMAGE UPLOADER
      ================================================= */}

      <ImageUploader
        value={formData.image}
        onChange={handleImageChange}
      />

      {/* =================================================
          FILE UPLOADER
      ================================================= */}

      <FileUploader
        value={formData.guidelineFile}
        onChange={handleFileChange}
      />

      {/* =================================================
          SEO
      ================================================= */}

      <SeoSection
        seo={{
          ...EMPTY_FORM.seo,
          ...(formData.seo || {}),
        }}
        onChange={handleSeoChange}
      />

      {/* =================================================
          SAVE AREA
      ================================================= */}

      <div
        className="card border-0 shadow-sm mb-5"
        style={{
          position: "sticky",
          bottom: "15px",
          zIndex: 20,
        }}
      >

        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

            <div>

              <div className="fw-semibold">
                Ready to save?
              </div>

              <small className="text-muted">
                Review the scheme information before
                saving.
              </small>

            </div>

            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />

                  Saving...
                </>
              ) : (
                submitLabel
              )}

            </button>

          </div>

        </div>

      </div>

    </form>
  );
}