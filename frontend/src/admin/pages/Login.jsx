import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // STATE
  // =========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================================
  // CHECK EXISTING SUPABASE SESSION
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          /*
           * Check whether this user is an Analytics/Admin user.
           */

          const { data: adminRecord, error: adminError } =
            await supabase
              .from("portal_analytics_admins")
              .select("user_id")
              .eq("user_id", session.user.id)
              .maybeSingle();

          if (
            !adminError &&
            adminRecord
          ) {
            navigate(
              location.state?.from?.pathname ||
                "/admin/dashboard",
              {
                replace: true,
              }
            );

            return;
          }

          /*
           * If the user has a Supabase session but
           * isn't registered as an Analytics Admin,
           * don't automatically enter Admin Portal.
           */
        }
      } catch (err) {
        console.error(
          "[Admin Login] Session check error:",
          err
        );
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [navigate, location.state]);

  // =========================================================
  // LOAD REMEMBERED EMAIL
  // =========================================================

  useEffect(() => {
    const rememberedEmail =
      localStorage.getItem(
        "adminRememberedEmail"
      );

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const cleanEmail =
      email.trim().toLowerCase();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // 1. SUPABASE AUTHENTICATION
      // =====================================================

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      const authenticatedUser =
        data?.user;

      if (!authenticatedUser) {
        throw new Error(
          "Login succeeded, but no user session was returned."
        );
      }

      // =====================================================
      // 2. VERIFY ADMIN / ANALYTICS ACCESS
      // =====================================================

      const {
        data: adminRecord,
        error: adminError,
      } = await supabase
        .from("portal_analytics_admins")
        .select("user_id")
        .eq(
          "user_id",
          authenticatedUser.id
        )
        .maybeSingle();

      if (adminError) {
        console.error(
          "[Admin Login] Analytics admin check:",
          adminError
        );

        /*
         * Sign out because the user authenticated
         * but we could not verify admin access.
         */

        await supabase.auth.signOut();

        throw new Error(
          "Unable to verify Admin Portal access. Please check the portal_analytics_admins table."
        );
      }

      if (!adminRecord) {
        /*
         * User is a valid Supabase user,
         * but isn't authorized for the Admin Portal.
         */

        await supabase.auth.signOut();

        throw new Error(
          "Your account is not authorized for the GoSubsidy Admin Portal. Add this user to portal_analytics_admins in Supabase."
        );
      }

      // =====================================================
      // 3. STORE ADMIN SESSION COMPATIBILITY FLAGS
      // =====================================================

      /*
       * Your existing ProtectedRoute / Admin UI may still
       * check these localStorage values.
       *
       * We keep them for compatibility while Supabase
       * remains the real authentication source.
       */

      localStorage.setItem(
        "adminAuthenticated",
        "true"
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: authenticatedUser.id,
          name:
            authenticatedUser.user_metadata
              ?.full_name ||
            authenticatedUser.email ||
            "Administrator",
          email:
            authenticatedUser.email ||
            cleanEmail,
          role: "Admin",
        })
      );

      // =====================================================
      // 4. REMEMBER EMAIL
      // =====================================================

      if (rememberMe) {
        localStorage.setItem(
          "adminRememberedEmail",
          cleanEmail
        );
      } else {
        localStorage.removeItem(
          "adminRememberedEmail"
        );
      }

      // =====================================================
      // 5. SUCCESS
      // =====================================================

      setSuccess(
        "Login successful. Opening Admin Portal..."
      );

      // =====================================================
      // 6. REDIRECT
      // =====================================================

      const redirectPath =
        location.state?.from?.pathname ||
        "/admin/dashboard";

      setTimeout(() => {
        navigate(
          redirectPath,
          {
            replace: true,
          }
        );
      }, 500);

    } catch (err) {
      console.error(
        "[Admin Login] Login error:",
        err
      );

      let message =
        "Unable to sign in. Please try again.";

      const errorText =
        err?.message?.toLowerCase() || "";

      if (
        errorText.includes(
          "invalid login credentials"
        )
      ) {
        message =
          "Invalid email address or password.";
      } else if (
        errorText.includes(
          "email not confirmed"
        )
      ) {
        message =
          "Please confirm your email address before signing in.";
      } else if (
        errorText.includes(
          "not authorized"
        )
      ) {
        message = err.message;
      } else if (
        errorText.includes(
          "portal_analytics_admins"
        )
      ) {
        message = err.message;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SIGN OUT HELPER
  // =========================================================

  const clearAdminLocalSession = () => {
    localStorage.removeItem(
      "adminAuthenticated"
    );

    localStorage.removeItem(
      "adminUser"
    );
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (checkingSession) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #07182f 0%, #0b2a4a 50%, #075985 100%)",
        }}
      >
        <div className="text-center text-white">

          <div
            className="spinner-border mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <div>
            Checking Admin Portal session...
          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #07182f 0%, #0b2a4a 50%, #075985 100%)",
        padding: "24px",
      }}
    >

      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "22px",
          overflow: "hidden",
        }}
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="text-center text-white p-4"
          style={{
            background:
              "linear-gradient(135deg, #0d6efd, #0891b2)",
          }}
        >

          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background:
                "rgba(255,255,255,0.16)",
            }}
          >
            <FaShieldAlt size={30} />
          </div>

          <h2 className="fw-bold mb-1">
            GoSubsidy
          </h2>

          <div
            style={{
              opacity: 0.9,
            }}
          >
            Admin Portal
          </div>

        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <div className="card-body p-4 p-md-5">

          <div className="mb-4">

            <h4 className="fw-bold mb-1">
              Welcome Back
            </h4>

            <p className="text-muted mb-0">
              Sign in to manage GoSubsidy.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              <strong>
                Login failed
              </strong>

              <div className="small mt-1">
                {error}
              </div>
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div
              className="alert alert-success"
              role="alert"
            >
              {success}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            noValidate
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="mb-3">

              <label
                htmlFor="adminEmail"
                className="form-label fw-semibold"
              >
                Email Address
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaEnvelope />
                </span>

                <input
                  id="adminEmail"
                  type="email"
                  className="form-control"
                  placeholder="admin@gosubsidy.in"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );
                    setError("");
                  }}
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="mb-3">

              <label
                htmlFor="adminPassword"
                className="form-label fw-semibold"
              >
                Password
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaLock />
                </span>

                <input
                  id="adminPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );
                    setError("");
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* =================================================
                REMEMBER ME
            ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div className="form-check">

                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  disabled={loading}
                />

                <label
                  className="form-check-label"
                  htmlFor="rememberMe"
                >
                  Remember me
                </label>

              </div>

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={
                loading ||
                !email.trim() ||
                !password
              }
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />

                  Verifying Admin Access...
                </>
              ) : (
                <>
                  <FaShieldAlt className="me-2" />

                  Sign In to Admin Portal
                </>
              )}

            </button>

          </form>

          {/* =================================================
              ANALYTICS SECURITY INFO
          ================================================= */}

          <div
            className="mt-4 p-3 rounded-3"
            style={{
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0",
            }}
          >

            <div className="d-flex align-items-center mb-2">

              <FaChartLine
                className="text-primary me-2"
              />

              <strong>
                Analytics Admin Access
              </strong>

            </div>

            <small className="text-muted">
              Analytics access is verified
              through your Supabase account
              and the GoSubsidy Admin Access
              table.
            </small>

          </div>

          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div className="text-center mt-4">

            <small className="text-muted">
              <FaShieldAlt className="me-1" />
              Secure Supabase authentication
            </small>

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="card-footer bg-white text-center border-0 pb-4"
        >
          <small className="text-muted">
            GoSubsidy Administration Portal
          </small>
        </div>

      </div>

    </div>
  );
}