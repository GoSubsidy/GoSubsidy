import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    user,
    loading,
    signOut,
  } = auth;

  // ---------------------------------------------------------
  // PROFILE UPDATE API
  // AuthContext now exposes updateProfile(profileData).
  // ---------------------------------------------------------
  const { updateProfile, refreshUser } = auth;

  // ---------------------------------------------------------
  // LOCAL STATE
  // ---------------------------------------------------------
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    businessName: "",
    city: "",
    state: "",
  });

  // ---------------------------------------------------------
  // AUTH PROTECTION
  // ---------------------------------------------------------
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  // ---------------------------------------------------------
  // USER DATA
  // ---------------------------------------------------------
  const email = user?.email || "";

  const metadata = user?.user_metadata || {};

  const displayName =
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    email.split("@")[0] ||
    "Customer";

  // ---------------------------------------------------------
  // INITIALS
  // ---------------------------------------------------------
  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "C";
  }, [displayName]);

  // ---------------------------------------------------------
  // LOAD PROFILE DATA
  // ---------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    setForm({
      fullName:
        metadata.full_name ||
        metadata.name ||
        metadata.display_name ||
        "",

      phone:
        metadata.phone ||
        metadata.mobile ||
        metadata.phone_number ||
        "",

      businessName:
        metadata.business_name ||
        metadata.businessName ||
        "",

      city:
        metadata.city ||
        "",

      state:
        metadata.state ||
        "",
    });
  }, [user]);

  // ---------------------------------------------------------
  // HANDLE INPUT
  // ---------------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // SAVE PROFILE
  // ---------------------------------------------------------
  const handleSave = async () => {
    setMessage("");

    if (!form.fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (form.phone.trim() && !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim())) {
      setMessage("Please enter a valid mobile number.");
      return;
    }

    if (typeof updateProfile !== "function") {
      setMessage(
        "Profile saving is not available. Please update AuthContext.jsx with updateProfile()."
      );
      return;
    }

    try {
      setSaving(true);

      const result = await updateProfile({
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        business_name: form.businessName.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
      });

      if (!result?.success) {
        throw result?.error || new Error("Unable to update your profile.");
      }

      // Refresh the authenticated user so the header, avatar and
      // profile fields immediately use the saved Supabase metadata.
      if (typeof refreshUser === "function") {
        await refreshUser();
      }

      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch (error) {
      console.error("[CustomerProfile] Profile update error:", error);

      setMessage(
        error?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <h4>Loading your profile...</h4>
        <p>Please wait.</p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // NO USER
  // ---------------------------------------------------------
  if (!user) {
    return null;
  }

  // ---------------------------------------------------------
  // ACCOUNT CREATED DATE
  // ---------------------------------------------------------
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  // ---------------------------------------------------------
  // PROFILE COMPLETION
  // ---------------------------------------------------------
  const profileFields = [
    form.fullName,
    email,
    form.phone,
    form.businessName,
    form.city,
    form.state,
  ];

  const completedFields = profileFields.filter(
    (value) => String(value || "").trim()
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <main className="customer-profile-page" style={styles.page}>

      {/* =====================================================
          TOP ACCOUNT BAR
      ===================================================== */}
      <section style={styles.topBar}>
        <div style={styles.topBarInner}>
          <div style={styles.topLeft}>
            <i className="bi bi-shield-check"></i>
            <span>GoSubsidy Customer Portal</span>
          </div>

          <div style={styles.activeStatus}>
            <span style={styles.activeDot}></span>
            Account Active
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}
      <section style={styles.profileHero}>
        <div style={styles.container}>

          <button
            type="button"
            onClick={() => navigate("/customer/dashboard")}
            style={styles.backButton}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Dashboard
          </button>

          <div className="customer-profile-header" style={styles.profileHeaderCard}>

            <div style={styles.profileIdentity}>

              <div style={styles.avatar}>
                {initials}
              </div>

              <div>
                <span style={styles.eyebrow}>
                  CUSTOMER PROFILE
                </span>

                <h1 style={styles.profileName}>
                  {displayName}
                </h1>

                <p style={styles.profileEmail}>
                  <i className="bi bi-envelope"></i>
                  {email}
                </p>
              </div>

            </div>

            <div style={styles.headerActions}>

              {!editMode ? (
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setEditMode(true);
                  }}
                  style={styles.editButton}
                >
                  <i className="bi bi-pencil-square"></i>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setMessage("");
                    }}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      ...styles.saveButton,
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    <i
                      className={
                        saving
                          ? "bi bi-arrow-repeat"
                          : "bi bi-check-lg"
                      }
                    ></i>

                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <section style={styles.contentSection}>
        <div style={styles.container}>

          {/* SUCCESS / INFO MESSAGE */}
          {message && (
            <div
              style={{
                ...styles.message,
                background:
                  message.includes("successfully")
                    ? "#ecfdf5"
                    : "#fff7ed",
                color:
                  message.includes("successfully")
                    ? "#047857"
                    : "#9a3412",
                borderColor:
                  message.includes("successfully")
                    ? "#a7f3d0"
                    : "#fed7aa",
              }}
            >
              <i
                className={
                  message.includes("successfully")
                    ? "bi bi-check-circle-fill"
                    : "bi bi-info-circle-fill"
                }
              ></i>

              <span>{message}</span>
            </div>
          )}

          <div className="customer-profile-grid" style={styles.grid}>

            {/* =================================================
                LEFT COLUMN
            ================================================= */}
            <div>

              {/* PERSONAL INFORMATION */}
              <div style={styles.card}>

                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.cardEyebrow}>
                      PERSONAL INFORMATION
                    </span>

                    <h2 style={styles.cardTitle}>
                      Your Profile
                    </h2>

                    <p style={styles.cardDescription}>
                      Keep your GoSubsidy customer information
                      up to date.
                    </p>
                  </div>

                  <div style={styles.cardIcon}>
                    <i className="bi bi-person"></i>
                  </div>
                </div>

                <div className="customer-profile-form-grid" style={styles.formGrid}>

                  {/* FULL NAME */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Full Name
                    </label>

                    {editMode ? (
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.readOnlyValue}>
                        <i className="bi bi-person"></i>
                        {form.fullName || displayName}
                      </div>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Email Address
                    </label>

                    <div
                      style={{
                        ...styles.readOnlyValue,
                        background: "#f8fafc",
                      }}
                    >
                      <i className="bi bi-envelope"></i>
                      {email}
                      <span style={styles.verifiedBadge}>
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* MOBILE */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Mobile Number
                    </label>

                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.readOnlyValue}>
                        <i className="bi bi-phone"></i>
                        {form.phone || "Not added"}
                      </div>
                    )}
                  </div>

                  {/* BUSINESS */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Business / Company
                    </label>

                    {editMode ? (
                      <input
                        type="text"
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        placeholder="Business or company name"
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.readOnlyValue}>
                        <i className="bi bi-building"></i>
                        {form.businessName || "Not added"}
                      </div>
                    )}
                  </div>

                  {/* CITY */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      City
                    </label>

                    {editMode ? (
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.readOnlyValue}>
                        <i className="bi bi-geo-alt"></i>
                        {form.city || "Not added"}
                      </div>
                    )}
                  </div>

                  {/* STATE */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      State
                    </label>

                    {editMode ? (
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        style={styles.input}
                      />
                    ) : (
                      <div style={styles.readOnlyValue}>
                        <i className="bi bi-map"></i>
                        {form.state || "Not added"}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* ACCOUNT SECURITY */}
              <div style={styles.card}>

                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.cardEyebrow}>
                      ACCOUNT SECURITY
                    </span>

                    <h2 style={styles.cardTitle}>
                      Security & Access
                    </h2>

                    <p style={styles.cardDescription}>
                      Your GoSubsidy account access information.
                    </p>
                  </div>

                  <div
                    style={{
                      ...styles.cardIcon,
                      background: "#ecfdf5",
                      color: "#059669",
                    }}
                  >
                    <i className="bi bi-shield-lock"></i>
                  </div>
                </div>

                <div style={styles.securityList}>

                  <div style={styles.securityItem}>
                    <div style={styles.securityIcon}>
                      <i className="bi bi-envelope-check"></i>
                    </div>

                    <div style={styles.securityText}>
                      <strong>Email verification</strong>
                      <span>
                        Your registered email is active.
                      </span>
                    </div>

                    <span style={styles.secureBadge}>
                      <i className="bi bi-check-circle"></i>
                      Active
                    </span>
                  </div>

                  <div style={styles.securityItem}>
                    <div style={styles.securityIcon}>
                      <i className="bi bi-person-check"></i>
                    </div>

                    <div style={styles.securityText}>
                      <strong>Customer account</strong>
                      <span>
                        GoSubsidy customer portal access.
                      </span>
                    </div>

                    <span style={styles.secureBadge}>
                      <i className="bi bi-check-circle"></i>
                      Active
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}
            <div>

              {/* PROFILE COMPLETION */}
              <div style={styles.completionCard}>

                <div style={styles.completionTop}>

                  <div>
                    <span style={styles.completionLabel}>
                      PROFILE COMPLETION
                    </span>

                    <strong style={styles.completionNumber}>
                      {profileCompletion}%
                    </strong>
                  </div>

                  <div style={styles.completionCircle}>
                    {profileCompletion}%
                  </div>

                </div>

                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${profileCompletion}%`,
                    }}
                  ></div>
                </div>

                <p style={styles.completionText}>
                  Complete your profile to help GoSubsidy
                  provide more relevant financial and scheme
                  opportunities.
                </p>

                {profileCompletion < 100 && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(true);
                      window.scrollTo({
                        top: 300,
                        behavior: "smooth",
                      });
                    }}
                    style={styles.completeButton}
                  >
                    Complete Profile
                    <i className="bi bi-arrow-right"></i>
                  </button>
                )}

              </div>

              {/* ACCOUNT SUMMARY */}
              <div style={styles.card}>

                <div style={styles.cardHeaderSmall}>
                  <div style={styles.smallCardIcon}>
                    <i className="bi bi-person-badge"></i>
                  </div>

                  <div>
                    <h3 style={styles.smallCardTitle}>
                      Account Summary
                    </h3>

                    <p style={styles.smallCardText}>
                      Your GoSubsidy account
                    </p>
                  </div>
                </div>

                <div style={styles.summaryList}>

                  <div style={styles.summaryRow}>
                    <span>Account Status</span>

                    <strong style={styles.greenText}>
                      <span style={styles.statusDot}></span>
                      Active
                    </strong>
                  </div>

                  <div style={styles.summaryRow}>
                    <span>Account Type</span>
                    <strong>Customer</strong>
                  </div>

                  <div style={styles.summaryRow}>
                    <span>Registered Email</span>
                    <strong style={{ wordBreak: "break-word" }}>
                      {email}
                    </strong>
                  </div>

                  <div style={styles.summaryRow}>
                    <span>Joined</span>
                    <strong>{createdAt}</strong>
                  </div>

                </div>

              </div>

              {/* QUICK ACTIONS */}
              <div style={styles.card}>

                <span style={styles.cardEyebrow}>
                  QUICK ACTIONS
                </span>

                <h3 style={styles.quickTitle}>
                  Continue Your Journey
                </h3>

                <div style={styles.quickActions}>

                  <button
                    type="button"
                    onClick={() => navigate("/customer/dashboard")}
                    style={styles.quickButton}
                  >
                    <i className="bi bi-grid"></i>
                    Dashboard
                    <i className="bi bi-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/schemes")}
                    style={styles.quickButton}
                  >
                    <i className="bi bi-bank"></i>
                    Government Schemes
                    <i className="bi bi-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/cibil")}
                    style={styles.quickButton}
                  >
                    <i className="bi bi-graph-up"></i>
                    Credit & CIBIL
                    <i className="bi bi-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/dpr")}
                    style={styles.quickButton}
                  >
                    <i className="bi bi-file-earmark-text"></i>
                    DPR Intelligence
                    <i className="bi bi-arrow-right"></i>
                  </button>

                </div>

              </div>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                <i className="bi bi-box-arrow-right"></i>
                Sign Out
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerInner}>
            <div>
              <strong>GoSubsidy</strong>
              <span>
                Business & Financial Services
              </span>
            </div>

            <span>
              Your opportunities. Your journey.
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#10233f",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  container: {
    width: "min(1180px, calc(100% - 40px))",
    margin: "0 auto",
  },

  topBar: {
    background: "#061a35",
    color: "#dbeafe",
  },

  topBarInner: {
    width: "min(1180px, calc(100% - 40px))",
    margin: "0 auto",
    minHeight: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    fontSize: "13px",
  },

  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  activeStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#d1fae5",
  },

  activeDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },

  profileHero: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f7fbff 55%, #eef6ff 100%)",
    borderBottom: "1px solid #e5edf7",
    padding: "28px 0",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#31577f",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    padding: "0",
    marginBottom: "22px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  profileHeaderCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    background: "#ffffff",
    border: "1px solid #e0eaf5",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 15px 45px rgba(15, 52, 92, 0.08)",
  },

  profileIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  avatar: {
    width: "78px",
    height: "78px",
    minWidth: "78px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #155eef, #4f46e5)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    fontWeight: "900",
    boxShadow: "0 12px 25px rgba(37, 99, 235, 0.25)",
  },

  eyebrow: {
    display: "block",
    color: "#1476ed",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    marginBottom: "7px",
  },

  profileName: {
    margin: "0 0 7px",
    color: "#082c55",
    fontSize: "30px",
    lineHeight: "1.1",
    fontWeight: "900",
  },

  profileEmail: {
    margin: "0",
    color: "#70849d",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  editButton: {
    border: "1px solid #cfe0f3",
    background: "#ffffff",
    color: "#0d5fd5",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "800",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  cancelButton: {
    border: "1px solid #d8e2ec",
    background: "#ffffff",
    color: "#52667c",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "800",
    cursor: "pointer",
  },

  saveButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #1268ee, #3549e8)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "800",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  contentSection: {
    padding: "34px 0 70px",
  },

  message: {
    border: "1px solid",
    borderRadius: "14px",
    padding: "14px 18px",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.55fr) minmax(320px, 0.85fr)",
    gap: "24px",
    alignItems: "start",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e1eaf3",
    borderRadius: "22px",
    padding: "25px",
    marginBottom: "24px",
    boxShadow: "0 12px 35px rgba(20, 52, 84, 0.055)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "25px",
  },

  cardHeaderSmall: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "20px",
  },

  cardEyebrow: {
    display: "block",
    color: "#1673e9",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    marginBottom: "7px",
  },

  cardTitle: {
    margin: "0 0 6px",
    color: "#092d55",
    fontSize: "22px",
    fontWeight: "900",
  },

  cardDescription: {
    margin: "0",
    color: "#72859d",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  cardIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "#eaf3ff",
    color: "#1673e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  formGroup: {
    minWidth: "0",
  },

  label: {
    display: "block",
    color: "#334e6f",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d7e3ef",
    background: "#ffffff",
    color: "#102f50",
    borderRadius: "12px",
    padding: "13px 14px",
    outline: "none",
    fontSize: "14px",
    fontWeight: "600",
  },

  readOnlyValue: {
    minHeight: "46px",
    boxSizing: "border-box",
    border: "1px solid #e4ebf3",
    background: "#fbfdff",
    color: "#213e5e",
    borderRadius: "12px",
    padding: "12px 13px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "14px",
    fontWeight: "700",
    flexWrap: "wrap",
  },

  verifiedBadge: {
    marginLeft: "auto",
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "900",
  },

  securityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  securityItem: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "14px",
    background: "#f8fbff",
    border: "1px solid #e5edf6",
    borderRadius: "14px",
  },

  securityIcon: {
    width: "40px",
    height: "40px",
    minWidth: "40px",
    borderRadius: "11px",
    background: "#eaf3ff",
    color: "#1769df",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  securityText: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  secureBadge: {
    color: "#047857",
    fontSize: "11px",
    fontWeight: "900",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  completionCard: {
    background:
      "linear-gradient(145deg, #072c58 0%, #0b477b 55%, #075b70 100%)",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "25px",
    marginBottom: "24px",
    boxShadow: "0 18px 45px rgba(7, 55, 96, 0.2)",
  },

  completionTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
  },

  completionLabel: {
    display: "block",
    color: "#8fe8ed",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.2px",
    marginBottom: "5px",
  },

  completionNumber: {
    display: "block",
    fontSize: "35px",
    lineHeight: "1",
    fontWeight: "900",
  },

  completionCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "4px solid rgba(71, 225, 218, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#72f1e6",
    fontSize: "14px",
    fontWeight: "900",
  },

  progressTrack: {
    height: "8px",
    background: "rgba(255,255,255,0.14)",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #35e5d2, #63f5c0)",
    borderRadius: "20px",
    transition: "width 0.4s ease",
  },

  completionText: {
    margin: "16px 0 18px",
    color: "#c8d9ea",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  completeButton: {
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.1)",
    color: "#ffffff",
    borderRadius: "11px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "800",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  smallCardIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#eef5ff",
    color: "#1769df",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  smallCardTitle: {
    margin: "0 0 3px",
    fontSize: "17px",
    color: "#092f58",
    fontWeight: "900",
  },

  smallCardText: {
    margin: "0",
    color: "#8091a5",
    fontSize: "12px",
  },

  summaryList: {
    display: "flex",
    flexDirection: "column",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "13px 0",
    borderBottom: "1px solid #edf2f7",
    fontSize: "12px",
  },

  greenText: {
    color: "#059669",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    background: "#22c55e",
    borderRadius: "50%",
  },

  quickTitle: {
    margin: "5px 0 17px",
    color: "#0a3058",
    fontSize: "20px",
    fontWeight: "900",
  },

  quickActions: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  quickButton: {
    width: "100%",
    border: "1px solid #e1eaf3",
    background: "#fbfdff",
    color: "#234362",
    borderRadius: "12px",
    padding: "12px 13px",
    cursor: "pointer",
    display: "grid",
    gridTemplateColumns: "24px 1fr 20px",
    alignItems: "center",
    textAlign: "left",
    gap: "7px",
    fontSize: "12px",
    fontWeight: "800",
  },

  logoutButton: {
    width: "100%",
    border: "1px solid #fecaca",
    background: "#fff7f7",
    color: "#dc2626",
    borderRadius: "14px",
    padding: "13px",
    cursor: "pointer",
    fontWeight: "900",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  footer: {
    background: "#061a35",
    color: "#d8e6f5",
    padding: "22px 0",
  },

  footerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    fontSize: "12px",
  },

  loadingPage: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#12395e",
    background: "#f4f7fb",
  },

  spinner: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "4px solid #dce8f5",
    borderTopColor: "#1769df",
    animation: "gosubsidy-spin 0.8s linear infinite",
    marginBottom: "15px",
  },
};

// ============================================================
// RESPONSIVE CSS
// ============================================================

if (
  typeof document !== "undefined" &&
  !document.getElementById("gosubsidy-profile-responsive")
) {
  const style = document.createElement("style");

  style.id = "gosubsidy-profile-responsive";

  style.innerHTML = `
    @keyframes gosubsidy-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .customer-profile-page {
      width: 100%;
      overflow-x: hidden;
    }

    @media (max-width: 980px) {
      .customer-profile-grid {
        grid-template-columns: 1fr !important;
      }

      .customer-profile-header {
        align-items: flex-start !important;
        flex-direction: column !important;
      }

      .customer-profile-header > div:last-child {
        width: 100%;
      }
    }

    @media (max-width: 700px) {
      body {
        overflow-x: hidden;
      }

      .customer-profile-page .topBarInner,
      .customer-profile-page .container {
        width: min(100% - 24px, 1180px) !important;
      }

      .customer-profile-page .profileHeaderCard {
        padding: 20px !important;
        border-radius: 18px !important;
      }

      .customer-profile-header {
        gap: 20px !important;
      }

      .customer-profile-form-grid {
        grid-template-columns: 1fr !important;
      }

      .customer-profile-page .profileIdentity {
        align-items: flex-start !important;
      }

      .customer-profile-page .avatar {
        width: 62px !important;
        height: 62px !important;
        min-width: 62px !important;
        border-radius: 18px !important;
        font-size: 22px !important;
      }

      .customer-profile-page .profileName {
        font-size: 24px !important;
      }

      .customer-profile-page .headerActions {
        width: 100%;
      }

      .customer-profile-page .headerActions > button {
        flex: 1;
        justify-content: center;
      }

      .customer-profile-page .card,
      .customer-profile-page .completionCard {
        padding: 19px !important;
        border-radius: 18px !important;
      }

      .customer-profile-page .summaryRow {
        align-items: flex-start;
        flex-direction: column;
        gap: 5px !important;
      }

      .customer-profile-page .footerInner {
        align-items: flex-start !important;
        flex-direction: column !important;
      }
    }
  `;

  document.head.appendChild(style);
}