import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSignInAlt, FaEnvelope, FaLock, FaShieldAlt, FaChartLine, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    session,
    loading: authLoading,
    signIn,
    signInWithGoogle,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);

  // Preserve a requested internal destination after login.
  // Never allow an external/open redirect.
  const requestedRedirect = searchParams.get("redirect") || "/customer/dashboard";
  const redirectPath =
    requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/customer/dashboard";

  const resumePayment = searchParams.get("resumePayment") === "1";
  const paymentProduct = searchParams.get("paymentProduct") || "DPR_PRO";

  const getPostLoginPath = () => {
    if (!resumePayment) return redirectPath;

    try {
      const target = new URL(redirectPath, window.location.origin);
      target.searchParams.set("resumePayment", "1");
      target.searchParams.set("paymentProduct", paymentProduct);
      return `${target.pathname}${target.search}${target.hash}`;
    } catch {
      return `${redirectPath}${redirectPath.includes("?") ? "&" : "?"}resumePayment=1&paymentProduct=${encodeURIComponent(paymentProduct)}`;
    }
  };

  const postLoginPath = getPostLoginPath();

  useEffect(() => {
    if (authLoading) return;
    if (user && session) {
      navigate(postLoginPath, { replace: true });
    }
  }, [authLoading, user, session, postLoginPath, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || googleLoading) return;

    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(cleanEmail, password);

      if (result?.error) {
        throw result.error;
      }

      setSuccessMessage("Login successful. Redirecting...");

      setTimeout(() => {
        navigate(postLoginPath, { replace: true });
      }, 500);
    } catch (error) {
      let message = "Unable to sign in. Please check your credentials.";
      const errStr = error?.message?.toLowerCase() || "";

      if (errStr.includes("invalid login credentials")) {
        message = "Invalid email address or password.";
      } else if (errStr.includes("email not confirmed")) {
        message = "Please verify your email address before signing in.";
      } else if (errStr.includes("too many requests")) {
        message = "Too many login attempts. Please wait a moment and try again.";
      } else if (error?.message) {
        message = error.message;
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    setErrorMessage("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error?.message || "Google authentication could not be completed.");
      setGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main
      className="d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "calc(100vh - 72px)",
        background: "#f8fafc",
      }}
    >
      <div className="container" style={{ maxWidth: "1020px" }}>
        <div
          className="card border-0 shadow-lg overflow-hidden"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
          }}
        >
          <div className="row g-0">
            {/* Left Side: Brand Feature Panel */}
            <div
              className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative"
              style={{
                background: "linear-gradient(145deg, #065f46 0%, #047857 50%, #059669 100%)",
              }}
            >
              <div>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)" }}>
                  <FaShieldAlt size={13} />
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>Official Advisory Portal</span>
                </div>

                <h2 className="fw-bolder mb-3" style={{ fontSize: "28px", lineHeight: "1.3" }}>
                  Empower Your Business With Government Schemes
                </h2>

                <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "14px", lineHeight: "1.6" }}>
                  Access seamless loan syndication, central and state subsidies, and automated DPR documentation in one unified dashboard.
                </p>
              </div>

              <div className="my-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "36px", height: "36px", background: "rgba(255, 255, 255, 0.2)" }}>
                    <FaCheckCircle size={16} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "14px" }}>Verified Scheme Updates</h6>
                    <small style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "12px" }}>Real-time central and state policy tracking</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "36px", height: "36px", background: "rgba(255, 255, 255, 0.2)" }}>
                    <FaChartLine size={16} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "14px" }}>Fast-Track DPR Generation</h6>
                    <small style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "12px" }}>Bank-compliant detailed financial models</small>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                <small style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "11.5px" }}>
                  © {new Date().getFullYear()} GoSubsidy. Trusted by MSMEs and enterprises across India.
                </small>
              </div>
            </div>

            {/* Right Side: Login Form */}
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
                  <FaSignInAlt />
                </div>
                <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                <p className="text-muted small mb-0">Sign in to track your loans, grants, and enterprise services</p>
              </div>

              {errorMessage && (
                <div className="alert alert-danger py-2 px-3 small border-0 d-flex align-items-center gap-2 mb-3" style={{ borderRadius: "10px", backgroundColor: "#fef2f2", color: "#b91c1c" }}>
                  <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success py-2 px-3 small border-0 d-flex align-items-center gap-2 mb-3" style={{ borderRadius: "10px", backgroundColor: "#f0fdf4", color: "#15803d" }}>
                  <i className="bi bi-check-circle-fill flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Google Sign-in */}
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
                onClick={handleGoogleSignIn}
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
                  OR CONTINUE WITH EMAIL
                </span>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1" htmlFor="loginEmail">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "12px 0 0 12px", border: "1.5px solid #cbd5e1" }}>
                      <FaEnvelope size={13} />
                    </span>
                    <input
                      id="loginEmail"
                      type="email"
                      className="form-control border-start-0"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage("");
                      }}
                      autoComplete="email"
                      disabled={loading || googleLoading}
                      required
                      style={{
                        borderRadius: "0 12px 12px 0",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        padding: "10px 12px",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-dark mb-0" htmlFor="loginPassword">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none fw-semibold text-success"
                      style={{ fontSize: "12px" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "12px 0 0 12px", border: "1.5px solid #cbd5e1" }}>
                      <FaLock size={13} />
                    </span>
                    <input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-control border-start-0 border-end-0"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage("");
                      }}
                      autoComplete="current-password"
                      disabled={loading || googleLoading}
                      required
                      style={{
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        padding: "10px 12px",
                      }}
                    />
                    <button
                      type="button"
                      className="btn bg-white text-muted border-start-0"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading || googleLoading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        borderRadius: "0 12px 12px 0",
                        border: "1.5px solid #cbd5e1",
                      }}
                    >
                      {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold mt-4"
                  disabled={loading || googleLoading || !email.trim() || !password}
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <span className="text-muted small">Don't have an account?</span>{" "}
                <Link to="/register" className="fw-bold text-decoration-none text-success small">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}