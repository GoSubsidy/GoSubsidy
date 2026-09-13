import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaChartLine,
  FaTimes,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaLock,
  FaBell,
  FaHeadset,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PaymentModal from "../premium/PaymentModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function SchemeRegistrationModal({ isOpen, onClose, onSuccess }) {
  const { user, session } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    businessName: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payloadForSuccess, setPayloadForSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSubmitting(false);
      setShowPayment(false);
      setPayloadForSuccess(null);

      const rawPhone = String(
        user?.phone ||
        user?.user_metadata?.phone ||
        user?.user_metadata?.mobile ||
        ""
      ).replace(/[^0-9]/g, "").slice(-10);

      // Only prefill a complete, valid Indian mobile number.
      // Invalid/old profile values must not appear as a partial phone number.
      const validPhone = /^[6-9]\d{9}$/.test(rawPhone) ? rawPhone : "";

      setFormData({
        fullName:
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          "",
        email: user?.email || "",
        mobile: validPhone,
        businessName:
          user?.user_metadata?.business_name ||
          user?.user_metadata?.company_name ||
          "",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const advisoryProduct = {
    code: "SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL",
    name: "GoSubsidy 1-Year Advisory & Scheme Alerts",
    price: 999,
    validityDays: 365,
    description:
      "1-year access to GoSubsidy expert advisory, government scheme alerts and policy updates.",
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.mobile.replace(/[^0-9]/g, "");
    const cleanEmail = formData.email.trim().toLowerCase();

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return null;
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError("A valid Email address is required.");
      return null;
    }

    if (phoneDigits.length !== 10 || !["6", "7", "8", "9"].includes(phoneDigits[0])) {
      setError("Please enter a valid 10-digit mobile number.");
      return null;
    }

    return {
      fullName: formData.fullName.trim(),
      email: cleanEmail,
      mobile: phoneDigits,
      businessName: formData.businessName.trim() || "Enterprise",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validData = validateInputs();
    if (!validData) return;

    setSubmitting(true);

    try {
      const formattedPhone = `+91 ${validData.mobile}`;
      const payload = {
        application_id: `ENQ_${Date.now()}`,
        name: validData.fullName,
        email: validData.email,
        phone: formattedPhone,
        businessName: validData.businessName,
        service: "Subsidy Expert Advisory & 1-Year Scheme Alerts",
        category: "Government Subsidies",
        amount: 999,
        status: "In Progress",
        submittedOn: new Date().toLocaleDateString("en-IN"),
      };

      try {
        const headers = { "Content-Type": "application/json" };
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        await fetch(`${API_BASE_URL}/api/payment/customer/enquiry`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      } catch (networkErr) {
        console.warn("[SchemeRegistrationModal] Network notice:", networkErr);
      }

      const existingLeads = JSON.parse(
        localStorage.getItem("gosubsidy_loan_enquiries") || "[]"
      );
      existingLeads.unshift(payload);
      localStorage.setItem("gosubsidy_loan_enquiries", JSON.stringify(existingLeads));

      // Registration is saved first. Advisory access is marked paid only
      // after the Razorpay transaction is verified by the backend.
      setPayloadForSuccess(payload);
      setShowPayment(true);
    } catch (err) {
      setError(err.message || "Unable to proceed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMinimalAccess = () => {
    setShowPayment(false);
    onClose?.();
  };

  // IMPORTANT:
  // Do not render the registration overlay underneath PaymentModal.
  // The registration overlay uses z-index 999999, while PaymentModal has its
  // own checkout overlay. Keeping both mounted can hide the Razorpay/payment
  // modal behind this registration layer.
  if (showPayment) {
    return (
      <PaymentModal
        product={advisoryProduct}
        onClose={() => {
          setShowPayment(false);
          setError("");
        }}
        onSuccess={(paymentResult) => {
          try {
            localStorage.setItem(
              "gosubsidy_schemes_advisory_registered",
              "true"
            );
            localStorage.setItem(
              "gosubsidy_schemes_advisory_payment",
              JSON.stringify({
                product: "SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL",
                paymentStatus: "paid",
                paymentReference:
                  paymentResult?.paymentId ||
                  paymentResult?.transactionId ||
                  paymentResult?.orderId ||
                  null,
                grantedAt: new Date().toISOString(),
                registration: payloadForSuccess,
              })
            );
          } catch (storageError) {
            console.warn(
              "[SchemeRegistrationModal] Unable to persist advisory payment:",
              storageError
            );
          }

          setShowPayment(false);

          if (typeof onSuccess === "function") {
            onSuccess({
              ...(payloadForSuccess || {}),
              payment: paymentResult,
            });
          }
        }}
      />
    );
  }

  return (
    <div
        className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="card border-0 shadow-lg overflow-hidden position-relative"
        style={{
          width: "min(780px, 98vw)",
          borderRadius: "20px",
          background: "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="btn position-absolute top-0 end-0 m-3 p-1 rounded-circle text-secondary border-0"
          style={{ zIndex: 10, background: "rgba(241, 245, 249, 0.8)", width: "30px", height: "30px" }}
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={12} />
        </button>

        <div className="row g-0">
          {/* Left Side: Services & Branding */}
          <div
            className="col-md-5 d-flex flex-column justify-content-between p-4 text-white"
            style={{
              background: "linear-gradient(145deg, #065f46 0%, #047857 50%, #059669 100%)",
            }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center bg-white text-success fw-bold"
                  style={{ width: "32px", height: "32px", fontSize: "16px" }}
                >
                  G
                </div>
                <span className="fw-bolder fs-5 text-white" style={{ letterSpacing: "-0.5px" }}>
                  Go<span style={{ color: "#86efac" }}>Subsidy</span>
                </span>
              </div>

              <div
                className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill mb-3"
                style={{ background: "rgba(255, 255, 255, 0.16)", fontSize: "10px", fontWeight: 700 }}
              >
                <FaShieldAlt size={10} />
                <span>ALL SERVICES INCLUDED</span>
              </div>

              <p className="small mb-3 text-white-50" style={{ fontSize: "11.5px", lineHeight: "1.4" }}>
                1-Year Full Platform Pass for Government Subsidies &amp; Banking Assistance.
              </p>

              <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-warning flex-shrink-0" size={12} />
                  <span style={{ fontSize: "11.5px", fontWeight: 600 }}>500+ Central &amp; State Schemes</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaFileInvoiceDollar className="text-warning flex-shrink-0" size={12} />
                  <span style={{ fontSize: "11.5px", fontWeight: 600 }}>Detailed Project Reports (DPR)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaChartLine className="text-warning flex-shrink-0" size={12} />
                  <span style={{ fontSize: "11.5px", fontWeight: 600 }}>MSME Loans &amp; Bank CMA Data</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-warning flex-shrink-0" size={12} />
                  <span style={{ fontSize: "11.5px", fontWeight: 600 }}>Direct Ex-Banker Consultation</span>
                </div>
              </div>
            </div>

            <div
              className="p-2 rounded-3 d-flex justify-content-between align-items-center"
              style={{ background: "rgba(0, 0, 0, 0.18)" }}
            >
              <div>
                <small className="d-block text-white-50" style={{ fontSize: "9.5px", textTransform: "uppercase" }}>
                  Advisory Fee
                </small>
                <span className="fw-bold" style={{ fontSize: "11.5px" }}>Annual Pass</span>
              </div>
              <span className="fw-bolder fs-5 text-warning">₹999</span>
            </div>
          </div>

          {/* Right Side: Registration Form & Access Options */}
          <div className="col-md-7 p-4 bg-white d-flex flex-column justify-content-between">
            <div>
              <div className="mb-2">
                <span className="badge bg-success-subtle text-success fw-bold text-uppercase" style={{ fontSize: "9.5px" }}>
                  QUICK REGISTRATION
                </span>
                <h5 className="fw-bold text-dark mb-0 mt-1" style={{ fontSize: "16px" }}>
                  Enroll for Advisory &amp; Alerts
                </h5>
              </div>

              {/* Annual Subscription Benefits Notice */}
              <div
                className="p-2 mb-2 rounded-3"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: "11px", color: "#166534" }}
              >
                <div className="d-flex align-items-start gap-2">
                  <FaHeadset className="mt-1 flex-shrink-0 text-success" size={12} />
                  <div>
                    <strong>Annual Subscription Benefits:</strong> Once registered, you can directly consult with a <strong>GoSubsidy expert</strong> and receive instant notifications for <strong>new subsidy schemes</strong> and <strong>policy modifications</strong>.
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-1 px-2 small mb-2" style={{ fontSize: "11px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-2">
                  <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "11px" }}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaUser size={11} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="e.g. Bhanu Prasad"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "11px" }}>
                    Email ID <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaEnvelope size={11} />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="name@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "11px" }}>
                    Mobile Number (10 Digits) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted fw-bold border-end-0">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="form-control border-start-0"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobile: e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "11px" }}>
                    Business / Farm Name
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaBuilding size={11} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="e.g. Poultry Farm"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                  style={{
                    backgroundColor: "#059669",
                    borderColor: "#059669",
                    fontSize: "13px",
                    borderRadius: "8px",
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      Register &amp; Continue <FaArrowRight size={12} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Minimal Access Option at Bottom */}
            <div className="pt-2 mt-2 border-top text-center">
              <button
                type="button"
                className="btn btn-link p-0 text-muted text-decoration-none fw-semibold"
                style={{ fontSize: "11px" }}
                onClick={handleMinimalAccess}
              >
                Skip &amp; Continue with Free Minimal Access (Preview Only) &rarr;
              </button>
              <div className="text-muted mt-1" style={{ fontSize: "10px" }}>
                <FaLock className="text-success me-1" size={8} />
                SSL Encrypted &bull; Direct PFMS &amp; RBI compliance grade
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}