import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle,
  FaRocket,
  FaFileInvoiceDollar,
  FaUserPlus,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || googleLoading) return;

    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(
        form.email.trim().toLowerCase(),
        form.password,
        {
          full_name: form.fullName.trim(),
        }
      );

      if (signUpError) {
        throw signUpError;
      }

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (loading || googleLoading) return;
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Google registration could not be completed.");
      setGoogleLoading(false);
    }
  };

  return (
    <main
      className="d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "calc(100vh - 72px)",
        background: "#f8fafc",
      }}
    >
      <div className="container" style={{ maxWidth: "1060px" }}>
        <div
          className="card border-0 shadow-lg overflow-hidden"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
          }}
        >
          <div className="row g-0">
            {/* Left Side: Brand Value Proposition Panel */}
            <div
              className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
              style={{
                background: "linear-gradient(145deg, #065f46 0%, #047857 50%, #059669 100%)",
              }}
            >
              <div>
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.16)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <FaShieldAlt size={13} />
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>
                    Official Business Gateway
                  </span>
                </div>

                <h2 className="fw-bolder mb-3" style={{ fontSize: "28px", lineHeight: "1.3" }}>
                  Join GoSubsidy Advisory Network
                </h2>

                <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "14px", lineHeight: "1.6" }}>
                  Create your unified enterprise account to unlock subsidy schemes, bank-compliant DPRs, and corporate loan syndication.
                </p>
              </div>

              <div className="my-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "38px", height: "38px", background: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <FaCheckCircle size={17} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "14px" }}>500+ Central &amp; State Schemes</h6>
                    <small style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "12px" }}>Direct ministry eligibility screening</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "38px", height: "38px", background: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <FaFileInvoiceDollar size={17} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "14px" }}>Complete Project Reports</h6>
                    <small style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "12px" }}>Bank CMA calculations &amp; 7-year projections</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "38px", height: "38px", background: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <FaRocket size={17} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "14px" }}>Fast-Track Sanctions</h6>
                    <small style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "12px" }}>Dedicated ex-banker advisory support</small>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                <small style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "11.5px" }}>
                  © {new Date().getFullYear()} GoSubsidy. Trusted by MSMEs and enterprises across India.
                </small>
              </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="col-12 col-lg-7 p-4 p-sm-5 d-flex flex-column justify-content-center">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-2 text-success"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "#ecfdf5",
                    fontSize: "20px",
                  }}
                >
                  <FaUserPlus />
                </div>
                <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                <p className="text-muted small mb-0">Sign up to access government grants and scheme advisories</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3 small border-0 d-flex align-items-center gap-2 mb-3" style={{ borderRadius: "10px", backgroundColor: "#fef2f2", color: "#b91c1c" }}>
                  <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success py-2 px-3 small border-0 d-flex align-items-center gap-2 mb-3" style={{ borderRadius: "10px", backgroundColor: "#f0fdf4", color: "#15803d" }}>
                  <i className="bi bi-check-circle-fill flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Google Registration Button */}
              <button
                type="button"
                className="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold mb-3 shadow-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "12px",
                  color: "#1e293b",
                  fontSize: "14px",
                }}
                onClick={handleGoogleRegister}
                disabled={googleLoading || loading}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                {googleLoading ? "Connecting to Google..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="position-relative my-3 text-center">
                <hr style={{ borderColor: "#e2e8f0" }} />
                <span
                  className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted"
                  style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}
                >
                  OR REGISTER WITH EMAIL
                </span>
              </div>

              {/* Manual Email Signup Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "12px 0 0 12px", border: "1.5px solid #cbd5e1" }}>
                      <FaUser size={13} />
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control border-start-0"
                      placeholder="e.g. Bhanu Prasad"
                      value={form.fullName}
                      onChange={handleChange}
                      disabled={loading || googleLoading}
                      required
                      style={{
                        borderRadius: "0 12px 12px 0",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        padding: "9px 12px",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "12px 0 0 12px", border: "1.5px solid #cbd5e1" }}>
                      <FaEnvelope size={13} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0"
                      placeholder="name@business.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading || googleLoading}
                      required
                      style={{
                        borderRadius: "0 12px 12px 0",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        padding: "9px 12px",
                      }}
                    />
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "12px 0 0 12px", border: "1.5px solid #cbd5e1" }}>
                        <FaLock size={12} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Min 6 chars"
                        value={form.password}
                        onChange={handleChange}
                        disabled={loading || googleLoading}
                        required
                        style={{
                          border: "1.5px solid #cbd5e1",
                          fontSize: "13.5px",
                          padding: "9px 10px",
                        }}
                      />
                      <button
                        type="button"
                        className="btn bg-white text-muted border-start-0"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={loading || googleLoading}
                        style={{
                          borderRadius: "0 12px 12px 0",
                          border: "1.5px solid #cbd5e1",
                        }}
                      >
                        {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "12px 0 0 12px", border: "1.5px solid #cbd5e1" }}>
                        <FaLock size={12} />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={loading || googleLoading}
                        required
                        style={{
                          border: "1.5px solid #cbd5e1",
                          fontSize: "13.5px",
                          padding: "9px 10px",
                        }}
                      />
                      <button
                        type="button"
                        className="btn bg-white text-muted border-start-0"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={loading || googleLoading}
                        style={{
                          borderRadius: "0 12px 12px 0",
                          border: "1.5px solid #cbd5e1",
                        }}
                      >
                        {showConfirmPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold mt-4"
                  disabled={loading || googleLoading || !form.fullName.trim() || !form.email.trim() || !form.password}
                  style={{
                    borderRadius: "12px",
                    padding: "11px",
                    backgroundColor: "#059669",
                    borderColor: "#059669",
                    color: "#ffffff",
                    fontSize: "14.5px",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <span className="text-muted small">Already have an account?</span>{" "}
                <Link to="/login" className="fw-bold text-decoration-none text-success small">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}