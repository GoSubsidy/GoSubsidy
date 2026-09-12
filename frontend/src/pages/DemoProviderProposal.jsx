import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
===========================================================
 GoSubsidy Demo Provider Proposal
 Demo-only insurance proposal journey

 Flow:
 Compare Page
      ↓
 Buy Online
      ↓
 DemoProviderProposal
      ↓
 Customer Details
      ↓
 Nominee Details
      ↓
 Health Declaration
      ↓
 Premium Summary
      ↓
 Demo Payment
===========================================================
*/

const INITIAL_FORM = {
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",

  nomineeName: "",
  nomineeRelation: "",
  nomineeDob: "",

  smoker: "",
  alcohol: "",
  existingDisease: "",
  medicalHistory: "",

  declaration: false,
};

const STEPS = [
  {
    id: 1,
    title: "Customer",
    icon: "bi-person",
  },
  {
    id: 2,
    title: "Nominee",
    icon: "bi-people",
  },
  {
    id: 3,
    title: "Health",
    icon: "bi-heart-pulse",
  },
  {
    id: 4,
    title: "Review",
    icon: "bi-check2-circle",
  },
];

function getInitialQuote(locationState) {
  return (
    locationState?.quote || {
      provider: "GoSubsidy Demo Provider",
      productName: "Health Insurance Demo Plan",
      premium: 12850,
      sumInsured: 1000000,
      tenure: 1,
      rating: 4.8,
    }
  );
}

/*
===========================================================
  LEAD DATA HELPERS
-----------------------------------------------------------
  InsuranceQuote stores the lead using the original field
  names (name, mobile, dob, pincode, etc.).

  DemoProviderProposal uses its own proposal field names
  (fullName, mobile, dob, pincode, etc.).

  These helpers keep the data flowing correctly between the
  Quote -> Compare -> Buy Online -> Demo Proposal journey.
===========================================================
*/

function readStoredLead() {
  try {
    return JSON.parse(
      sessionStorage.getItem("gosubsidyInsuranceLead") || "{}"
    );
  } catch {
    return {};
  }
}

function normalizeDateForInput(value) {
  if (!value) return "";

  const text = String(value).trim();

  // Already in the format required by <input type="date">.
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(text)) {
    return text;
  }

  // Convert common DD/MM/YYYY or DD-MM-YYYY values.
  const match = text.match(/^(\\d{1,2})[\\/\\-](\\d{1,2})[\\/\\-](\\d{4})$/);

  if (match) {
    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3];

    return `${year}-${month}-${day}`;
  }

  return "";
}

function getInitialForm(locationState) {
  const lead =
    locationState?.lead && Object.keys(locationState.lead).length
      ? locationState.lead
      : readStoredLead();

  return {
    ...INITIAL_FORM,

    fullName:
      lead.fullName ||
      lead.name ||
      "",

    mobile:
      lead.mobile ||
      lead.mobileNumber ||
      "",

    email:
      lead.email ||
      "",

    dob:
      normalizeDateForInput(
        lead.dob ||
        lead.dateOfBirth ||
        ""
      ),

    gender:
      lead.gender ||
      "",

    address:
      lead.address ||
      "",

    city:
      lead.city ||
      lead.location ||
      "",

    state:
      lead.state ||
      "",

    pincode:
      lead.pincode ||
      lead.pinCode ||
      lead.pin ||
      "",

    // Proposal-only fields start empty.
    nomineeName:
      lead.nomineeName ||
      "",

    nomineeRelation:
      lead.nomineeRelation ||
      "",

    nomineeDob:
      normalizeDateForInput(
        lead.nomineeDob ||
        ""
      ),

    smoker:
      lead.smoker ||
      "",

    alcohol:
      lead.alcohol ||
      "",

    existingDisease:
      lead.existingDisease ||
      lead.preExisting ||
      "",

    medicalHistory:
      lead.medicalHistory ||
      "",

    declaration: false,
  };
}

export default function DemoProviderProposal() {
  const navigate = useNavigate();
  const location = useLocation();

  const quote = useMemo(
    () => getInitialQuote(location.state),
    [location.state]
  );

  /*
   * IMPORTANT:
   * Do not reset customer information when Buy Online opens
   * the demo provider journey.
   *
   * The lead already exists in InsuranceQuote/sessionStorage
   * and is also passed through InsuranceCompare location.state.
   */
  const [form, setForm] = useState(() =>
    getInitialForm(location.state)
  );

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [proposalNumber, setProposalNumber] = useState("");

  /* =========================================================
     FORM HANDLER
  ========================================================= */

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  function validateStep(currentStep = step) {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!form.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
        newErrors.mobile = "Enter a valid 10-digit mobile number";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email address is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ) {
        newErrors.email = "Enter a valid email address";
      }

      if (!form.dob) {
        newErrors.dob = "Date of birth is required";
      }

      if (!form.gender) {
        newErrors.gender = "Please select gender";
      }

      if (!form.address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!form.city.trim()) {
        newErrors.city = "City is required";
      }

      if (!form.state.trim()) {
        newErrors.state = "State is required";
      }

      if (!form.pincode.trim()) {
        newErrors.pincode = "PIN code is required";
      } else if (!/^\d{6}$/.test(form.pincode)) {
        newErrors.pincode = "Enter a valid 6-digit PIN code";
      }
    }

    if (currentStep === 2) {
      if (!form.nomineeName.trim()) {
        newErrors.nomineeName = "Nominee name is required";
      }

      if (!form.nomineeRelation) {
        newErrors.nomineeRelation =
          "Please select nominee relationship";
      }

      if (!form.nomineeDob) {
        newErrors.nomineeDob =
          "Nominee date of birth is required";
      }
    }

    if (currentStep === 3) {
      if (!form.smoker) {
        newErrors.smoker = "Please select an option";
      }

      if (!form.alcohol) {
        newErrors.alcohol = "Please select an option";
      }

      if (!form.existingDisease) {
        newErrors.existingDisease =
          "Please select an option";
      }

      if (
        form.existingDisease === "yes" &&
        !form.medicalHistory.trim()
      ) {
        newErrors.medicalHistory =
          "Please provide your medical history";
      }
    }

    if (currentStep === 4) {
      if (!form.declaration) {
        newErrors.declaration =
          "Please accept the declaration";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function nextStep() {
    if (!validateStep(step)) {
      return;
    }

    if (step < STEPS.length) {
      setStep((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function previousStep() {
    if (step > 1) {
      setStep((previous) => previous - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate(-1);
    }
  }

  /* =========================================================
     SUBMIT DEMO PROPOSAL
  ========================================================= */

  async function handleSubmit() {
    if (!validateStep(4)) {
      return;
    }

    try {
      setSubmitting(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      const reference =
        "GSI-" +
        new Date().getFullYear() +
        "-" +
        Math.floor(100000 + Math.random() * 900000);

      /*
       * Keep the completed demo proposal available for the
       * next screen/test step.
       */
      sessionStorage.setItem(
        "gosubsidyDemoProposal",
        JSON.stringify({
          reference,
          quote,
          customer: form,
          insuranceType:
            location.state?.insuranceType ||
            "health",
          provider:
            quote.provider ||
            quote.insurerName ||
            "GoSubsidy Demo Provider",
          mode: "DEMO",
          createdAt:
            new Date().toISOString(),
        })
      );

      setProposalNumber(reference);
      setShowSuccess(true);
    } catch (error) {
      console.error(
        "Demo proposal submission error:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================================
     PREMIUM FORMATTER
  ========================================================= */

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  /* =========================================================
     INPUT COMPONENT
  ========================================================= */

  function InputField({
    label,
    name,
    type = "text",
    placeholder,
    required = true,
  }) {
    return (
      <div className="col-md-6 mb-3">
        <label className="form-label fw-semibold">
          {label}{" "}
          {required && (
            <span className="text-danger">*</span>
          )}
        </label>

        <input
          type={type}
          className={`form-control form-control-lg ${
            errors[name] ? "is-invalid" : ""
          }`}
          value={form[name]}
          placeholder={placeholder}
          onChange={(e) =>
            updateField(name, e.target.value)
          }
        />

        {errors[name] && (
          <div className="invalid-feedback">
            {errors[name]}
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     SELECT COMPONENT
  ========================================================= */

  function SelectField({
    label,
    name,
    options,
  }) {
    return (
      <div className="col-md-6 mb-3">
        <label className="form-label fw-semibold">
          {label}{" "}
          <span className="text-danger">*</span>
        </label>

        <select
          className={`form-select form-select-lg ${
            errors[name] ? "is-invalid" : ""
          }`}
          value={form[name]}
          onChange={(e) =>
            updateField(name, e.target.value)
          }
        >
          <option value="">
            Select {label}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {errors[name] && (
          <div className="invalid-feedback">
            {errors[name]}
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     STEP 1
  ========================================================= */

  function renderCustomerStep() {
    return (
      <div>
        <div className="mb-4">
          <h4 className="fw-bold">
            Customer Information
          </h4>

          <p className="text-muted">
            Tell us about the person who will be
            insured.
          </p>
        </div>

        <div className="row">
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="Enter full name"
          />

          <InputField
            label="Mobile Number"
            name="mobile"
            type="tel"
            placeholder="10-digit mobile number"
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
          />

          <InputField
            label="Date of Birth"
            name="dob"
            type="date"
          />

          <SelectField
            label="Gender"
            name="gender"
            options={[
              {
                value: "male",
                label: "Male",
              },
              {
                value: "female",
                label: "Female",
              },
              {
                value: "other",
                label: "Other",
              },
            ]}
          />

          <InputField
            label="PIN Code"
            name="pincode"
            placeholder="6-digit PIN"
          />

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">
              Address{" "}
              <span className="text-danger">*</span>
            </label>

            <textarea
              className={`form-control ${
                errors.address ? "is-invalid" : ""
              }`}
              rows="3"
              placeholder="Enter complete address"
              value={form.address}
              onChange={(e) =>
                updateField(
                  "address",
                  e.target.value
                )
              }
            />

            {errors.address && (
              <div className="invalid-feedback">
                {errors.address}
              </div>
            )}
          </div>

          <InputField
            label="City"
            name="city"
            placeholder="City"
          />

          <InputField
            label="State"
            name="state"
            placeholder="State"
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     STEP 2
  ========================================================= */

  function renderNomineeStep() {
    return (
      <div>
        <div className="mb-4">
          <h4 className="fw-bold">
            Nominee Details
          </h4>

          <p className="text-muted">
            Provide the person who will receive the
            policy benefit if required.
          </p>
        </div>

        <div className="row">
          <InputField
            label="Nominee Full Name"
            name="nomineeName"
            placeholder="Enter nominee name"
          />

          <SelectField
            label="Relationship"
            name="nomineeRelation"
            options={[
              {
                value: "spouse",
                label: "Spouse",
              },
              {
                value: "father",
                label: "Father",
              },
              {
                value: "mother",
                label: "Mother",
              },
              {
                value: "son",
                label: "Son",
              },
              {
                value: "daughter",
                label: "Daughter",
              },
              {
                value: "brother",
                label: "Brother",
              },
              {
                value: "sister",
                label: "Sister",
              },
              {
                value: "other",
                label: "Other",
              },
            ]}
          />

          <InputField
            label="Nominee Date of Birth"
            name="nomineeDob"
            type="date"
          />
        </div>

        <div className="alert alert-info mt-3">
          <i className="bi bi-info-circle me-2"></i>

          Nominee details are collected for this
          demonstration proposal only.
        </div>
      </div>
    );
  }

  /* =========================================================
     STEP 3
  ========================================================= */

  function renderHealthStep() {
    return (
      <div>
        <div className="mb-4">
          <h4 className="fw-bold">
            Health Declaration
          </h4>

          <p className="text-muted">
            Answer the following questions honestly.
          </p>
        </div>

        <div className="row">
          <SelectField
            label="Do you smoke or use tobacco?"
            name="smoker"
            options={[
              {
                value: "no",
                label: "No",
              },
              {
                value: "yes",
                label: "Yes",
              },
            ]}
          />

          <SelectField
            label="Do you consume alcohol?"
            name="alcohol"
            options={[
              {
                value: "no",
                label: "No",
              },
              {
                value: "yes",
                label: "Yes",
              },
            ]}
          />

          <SelectField
            label="Any existing disease?"
            name="existingDisease"
            options={[
              {
                value: "no",
                label: "No",
              },
              {
                value: "yes",
                label: "Yes",
              },
            ]}
          />

          {form.existingDisease === "yes" && (
            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">
                Medical History{" "}
                <span className="text-danger">
                  *
                </span>
              </label>

              <textarea
                className={`form-control ${
                  errors.medicalHistory
                    ? "is-invalid"
                    : ""
                }`}
                rows="4"
                placeholder="Please describe your medical history"
                value={form.medicalHistory}
                onChange={(e) =>
                  updateField(
                    "medicalHistory",
                    e.target.value
                  )
                }
              />

              {errors.medicalHistory && (
                <div className="invalid-feedback">
                  {errors.medicalHistory}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="alert alert-warning mt-3">
          <i className="bi bi-shield-check me-2"></i>

          This is a demonstration proposal. No
          medical underwriting or policy issuance
          occurs in this demo.
        </div>
      </div>
    );
  }

  /* =========================================================
     STEP 4
  ========================================================= */

  function renderReviewStep() {
    return (
      <div>
        <div className="mb-4">
          <h4 className="fw-bold">
            Review Proposal
          </h4>

          <p className="text-muted">
            Verify your information before submitting
            the demo proposal.
          </p>
        </div>

        {/* Customer */}

        <div className="proposal-summary-card mb-4">
          <div className="summary-header">
            <h5>
              <i className="bi bi-person-circle me-2"></i>
              Customer
            </h5>
          </div>

          <div className="row">
            <div className="col-md-6">
              <strong>Name</strong>
              <p>{form.fullName || "-"}</p>
            </div>

            <div className="col-md-6">
              <strong>Mobile</strong>
              <p>{form.mobile || "-"}</p>
            </div>

            <div className="col-md-6">
              <strong>Email</strong>
              <p>{form.email || "-"}</p>
            </div>

            <div className="col-md-6">
              <strong>Date of Birth</strong>
              <p>{form.dob || "-"}</p>
            </div>

            <div className="col-12">
              <strong>Address</strong>
              <p>
                {form.address},{" "}
                {form.city},{" "}
                {form.state} -{" "}
                {form.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Nominee */}

        <div className="proposal-summary-card mb-4">
          <div className="summary-header">
            <h5>
              <i className="bi bi-people me-2"></i>
              Nominee
            </h5>
          </div>

          <div className="row">
            <div className="col-md-4">
              <strong>Name</strong>
              <p>{form.nomineeName}</p>
            </div>

            <div className="col-md-4">
              <strong>Relationship</strong>
              <p>{form.nomineeRelation}</p>
            </div>

            <div className="col-md-4">
              <strong>Date of Birth</strong>
              <p>{form.nomineeDob}</p>
            </div>
          </div>
        </div>

        {/* Health */}

        <div className="proposal-summary-card mb-4">
          <div className="summary-header">
            <h5>
              <i className="bi bi-heart-pulse me-2"></i>
              Health Declaration
            </h5>
          </div>

          <div className="row">
            <div className="col-md-4">
              <strong>Tobacco</strong>
              <p>{form.smoker}</p>
            </div>

            <div className="col-md-4">
              <strong>Alcohol</strong>
              <p>{form.alcohol}</p>
            </div>

            <div className="col-md-4">
              <strong>Existing Disease</strong>
              <p>{form.existingDisease}</p>
            </div>
          </div>
        </div>

        {/* Declaration */}

        <div className="form-check declaration-box">
          <input
            className={`form-check-input ${
              errors.declaration
                ? "is-invalid"
                : ""
            }`}
            type="checkbox"
            checked={form.declaration}
            onChange={(e) =>
              updateField(
                "declaration",
                e.target.checked
              )
            }
            id="proposalDeclaration"
          />

          <label
            className="form-check-label"
            htmlFor="proposalDeclaration"
          >
            I confirm that the information provided
            above is true and correct. I understand
            that this is a GoSubsidy demonstration
            insurance proposal and does not create
            an insurance contract.
          </label>

          {errors.declaration && (
            <div className="text-danger small mt-2">
              {errors.declaration}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     CURRENT STEP
  ========================================================= */

  function renderCurrentStep() {
    switch (step) {
      case 1:
        return renderCustomerStep();

      case 2:
        return renderNomineeStep();

      case 3:
        return renderHealthStep();

      case 4:
        return renderReviewStep();

      default:
        return null;
    }
  }

  /* =========================================================
     SUCCESS
  ========================================================= */

  if (showSuccess) {
    return (
      <div className="container py-5">

        <div
          className="card border-0 shadow-lg mx-auto"
          style={{
            maxWidth: "760px",
            borderRadius: "28px",
          }}
        >
          <div className="card-body text-center p-5">

            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#087fdb,#00bfa6)",
                color: "#fff",
                fontSize: "42px",
              }}
            >
              <i className="bi bi-check-lg"></i>
            </div>

            <h2 className="fw-bold mb-2">
              Demo Proposal Submitted
            </h2>

            <p className="text-muted mb-4">
              Your GoSubsidy demonstration proposal
              has been successfully created.
            </p>

            <div
              className="p-4 mb-4"
              style={{
                background: "#f5f9ff",
                borderRadius: "18px",
              }}
            >
              <small className="text-muted">
                DEMO REFERENCE NUMBER
              </small>

              <h3 className="fw-bold text-primary mt-2 mb-0">
                {proposalNumber}
              </h3>
            </div>

            <div className="row g-3 mb-4 text-start">

              <div className="col-md-6">
                <div className="p-3 bg-light rounded-4">
                  <small className="text-muted">
                    Provider
                  </small>

                  <div className="fw-bold">
                    {quote.provider}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 bg-light rounded-4">
                  <small className="text-muted">
                    Annual Premium
                  </small>

                  <div className="fw-bold">
                    {formatCurrency(
                      quote.premium
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="alert alert-info text-start">
              <i className="bi bi-info-circle me-2"></i>

              This is a demo environment. No payment
              has been collected and no real insurance
              policy has been issued.
            </div>

            <div className="d-flex gap-3 justify-content-center flex-wrap">

              <button
                className="btn btn-primary btn-lg px-4"
                onClick={() =>
                  navigate("/insurance/quote")
                }
              >
                <i className="bi bi-shield-check me-2"></i>
                Start New Quote
              </button>

              <button
                className="btn btn-outline-primary btn-lg px-4"
                onClick={() =>
                  navigate("/")
                }
              >
                Go Home
              </button>

            </div>

          </div>
        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div
      className="demo-proposal-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f5f9ff 0%,#eef7f8 100%)",
      }}
    >

      {/* Hero */}

      <div
        className="py-4 py-md-5"
        style={{
          background:
            "linear-gradient(135deg,#031f3d,#073b66)",
          color: "#fff",
        }}
      >
        <div className="container">

          <div className="d-flex align-items-center gap-3">

            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg,#087fdb,#00bfa6)",
                fontSize: "25px",
              }}
            >
              <i className="bi bi-shield-check"></i>
            </div>

            <div>
              <div className="small opacity-75">
                GOSUBSIDY INSURANCE
              </div>

              <h2 className="fw-bold mb-0">
                Demo Proposal
              </h2>
            </div>

          </div>

        </div>
      </div>

      <div className="container py-4 py-md-5">

        <div className="row g-4">

          {/* Main */}

          <div className="col-lg-8">

            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "26px",
                overflow: "hidden",
              }}
            >

              {/* Progress */}

              <div className="p-4 border-bottom">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <div>
                    <small className="text-muted">
                      STEP {step} OF {STEPS.length}
                    </small>

                    <h5 className="fw-bold mb-0">
                      {STEPS[step - 1].title}
                    </h5>
                  </div>

                  <span className="badge bg-primary-subtle text-primary px-3 py-2">
                    {Math.round(
                      (step / STEPS.length) * 100
                    )}
                    % Complete
                  </span>

                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#e9eef5",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${
                        (step / STEPS.length) *
                        100
                      }%`,
                      background:
                        "linear-gradient(90deg,#087fdb,#00bfa6)",
                      transition:
                        "width .35s ease",
                    }}
                  />
                </div>

                <div className="d-flex justify-content-between mt-4">

                  {STEPS.map((item) => (
                    <div
                      key={item.id}
                      className="text-center"
                      style={{
                        flex: 1,
                      }}
                    >

                      <div
                        className="mx-auto d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background:
                            item.id <= step
                              ? "linear-gradient(135deg,#087fdb,#00bfa6)"
                              : "#eef1f5",
                          color:
                            item.id <= step
                              ? "#fff"
                              : "#8b96a3",
                        }}
                      >
                        <i
                          className={`bi ${item.icon}`}
                        ></i>
                      </div>

                      <small
                        className={`d-none d-md-block mt-2 ${
                          item.id === step
                            ? "fw-bold text-primary"
                            : "text-muted"
                        }`}
                      >
                        {item.title}
                      </small>

                    </div>
                  ))}

                </div>

              </div>

              {/* Content */}

              <div className="p-4 p-md-5">

                {renderCurrentStep()}

              </div>

              {/* Footer */}

              <div className="p-4 border-top bg-light">

                <div className="d-flex justify-content-between gap-3">

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg px-4"
                    onClick={previousStep}
                    disabled={submitting}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Previous
                  </button>

                  {step < STEPS.length ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-lg px-4"
                      onClick={nextStep}
                    >
                      Continue
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-lg px-4 text-white"
                      style={{
                        background:
                          "linear-gradient(135deg,#087fdb,#00bfa6)",
                      }}
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                          ></span>

                          Creating Proposal...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Submit Demo Proposal
                        </>
                      )}
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* Sidebar */}

          <div className="col-lg-4">

            {/* Selected Plan */}

            <div
              className="card border-0 shadow-sm mb-4"
              style={{
                borderRadius: "24px",
              }}
            >

              <div className="card-body p-4">

                <div className="d-flex align-items-center gap-3 mb-4">

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "15px",
                      background:
                        "linear-gradient(135deg,#087fdb,#00bfa6)",
                      color: "#fff",
                      fontSize: "22px",
                    }}
                  >
                    <i className="bi bi-shield-fill-check"></i>
                  </div>

                  <div>
                    <small className="text-muted">
                      SELECTED PLAN
                    </small>

                    <h5 className="fw-bold mb-0">
                      {quote.provider}
                    </h5>
                  </div>

                </div>

                <div className="mb-3">

                  <small className="text-muted">
                    Product
                  </small>

                  <div className="fw-semibold">
                    {quote.productName}
                  </div>

                </div>

                <div className="row g-3">

                  <div className="col-6">

                    <div className="p-3 bg-light rounded-4">

                      <small className="text-muted">
                        Cover
                      </small>

                      <div className="fw-bold">
                        {formatCurrency(
                          quote.sumInsured
                        )}
                      </div>

                    </div>

                  </div>

                  <div className="col-6">

                    <div className="p-3 bg-light rounded-4">

                      <small className="text-muted">
                        Tenure
                      </small>

                      <div className="fw-bold">
                        {quote.tenure || 1} Year
                      </div>

                    </div>

                  </div>

                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">

                  <span className="text-muted">
                    Demo Premium
                  </span>

                  <strong
                    className="fs-4 text-primary"
                  >
                    {formatCurrency(
                      quote.premium
                    )}
                  </strong>

                </div>

                <small className="text-muted">
                  Indicative annual premium
                </small>

              </div>

            </div>

            {/* Trust */}

            <div
              className="card border-0 shadow-sm mb-4"
              style={{
                borderRadius: "24px",
              }}
            >

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  Why GoSubsidy?
                </h5>

                {[
                  [
                    "bi-shield-check",
                    "Secure Application",
                    "Your information stays within the demo flow.",
                  ],
                  [
                    "bi-lightning-charge",
                    "Fast Proposal",
                    "Complete the proposal in a few simple steps.",
                  ],
                  [
                    "bi-headset",
                    "Expert Assistance",
                    "Insurance support whenever you need it.",
                  ],
                ].map(([icon, title, text]) => (
                  <div
                    className="d-flex gap-3 mb-4"
                    key={title}
                  >

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: "#eaf7f7",
                        color: "#00a99d",
                      }}
                    >
                      <i
                        className={`bi ${icon}`}
                      ></i>
                    </div>

                    <div>
                      <div className="fw-bold">
                        {title}
                      </div>

                      <small className="text-muted">
                        {text}
                      </small>
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* Demo notice */}

            <div
              className="alert alert-warning border-0 shadow-sm"
              style={{
                borderRadius: "20px",
              }}
            >

              <div className="fw-bold mb-1">
                <i className="bi bi-info-circle me-2"></i>
                Demo Environment
              </div>

              <small>
                This provider is for testing only.
                No real insurance policy or payment
                will be generated.
              </small>

            </div>

          </div>

        </div>

      </div>

      <style>{`
        .proposal-summary-card {
          background: #f8fafc;
          border: 1px solid #e8edf3;
          border-radius: 18px;
          padding: 20px;
        }

        .summary-header {
          border-bottom: 1px solid #e5eaf0;
          margin-bottom: 20px;
          padding-bottom: 12px;
        }

        .summary-header h5 {
          margin: 0;
          font-weight: 700;
        }

        .proposal-summary-card p {
          margin-top: 5px;
          margin-bottom: 0;
          color: #596574;
        }

        .declaration-box {
          padding: 18px;
          background: #eef9f6;
          border: 1px solid #b9e5d9;
          border-radius: 16px;
        }

        .form-control,
        .form-select {
          border-radius: 12px;
          border-color: #dce3eb;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #087fdb;
          box-shadow: 0 0 0 .2rem rgba(8,127,219,.12);
        }

        @media (max-width: 576px) {
          .demo-proposal-page .btn-lg {
            font-size: 14px;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          .demo-proposal-page h2 {
            font-size: 24px;
          }
        }
      `}</style>

    </div>
  );
}