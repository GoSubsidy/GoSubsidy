import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/gosubsidy-logo.png";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const displayEmail = user?.email || "";

  const displayBusiness =
    user?.user_metadata?.business_name ||
    user?.user_metadata?.company_name ||
    "";

  const avatarLetter = displayName.charAt(0).toUpperCase() || "C";

  const closeProfileMenu = () => setProfileMenuOpen(false);

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("GoSubsidy logout failed:", error);
    }
  };

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: "bi-house-door",
    },
    {
      path: "/schemes",
      label: "Schemes",
      icon: "bi-bank",
    },
    {
      path: "/subsidy-loan-emi-calculator",
      label: "EMI Calculator",
      icon: "bi-calculator",
    },
    {
      path: "/cibil",
      label: "CIBIL",
      icon: "bi-graph-up-arrow",
    },
    {
      path: "/dpr",
      label: "DPR",
      icon: "bi-file-earmark-text",
    },
    {
      path: "/loans",
      label: "Loans",
      icon: "bi-cash-coin",
    },
    {
  path: "/insurance",
  label: "Insurance",
  icon: "bi-shield-check",
},
    {
      path: "/contact",
      label: "Contact",
      icon: "bi-envelope",
    },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-xl gs-navbar sticky-top">
        <div className="gs-navbar-container">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link to="/" className="gs-navbar-brand">

            <img
              src={logo}
              alt="GoSubsidy"
              className="gs-navbar-logo"
            />

            <div className="gs-navbar-brand-text">

              <div className="gs-navbar-brand-name">
                <span className="gs-nav-go">Go</span>
                <span className="gs-nav-subsidy">Subsidy</span>
              </div>

              <small>
              Business & Financial Services
              </small>

            </div>

          </Link>

          {/* =================================================
              MOBILE TOGGLE
          ================================================= */}

          <button
            className="navbar-toggler gs-navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#goSubsidyNavbar"
            aria-controls="goSubsidyNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div
            className="collapse navbar-collapse gs-navbar-collapse"
            id="goSubsidyNavbar"
          >

            <div className="gs-navbar-menu">

              {navItems.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `gs-navbar-link ${
                      isActive ? "active" : ""
                    }`
                  }
                >

                  <i className={`bi ${item.icon}`}></i>

                  <span>{item.label}</span>

                </NavLink>

              ))}

            </div>

            {/* =================================================
                USER / LOGIN
            ================================================= */}

            <div className="gs-navbar-actions">

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="gs-login-btn"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="gs-register-btn"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {/* Notification */}
                  <button
                    type="button"
                    className="gs-notification-btn"
                    aria-label="Notifications"
                    title="Notifications"
                    onClick={() => navigate("/customer/notifications")}
                  >
                    <i className="bi bi-bell"></i>
                    <span className="gs-notification-dot"></span>
                  </button>

                  {/* Account */}
                  <div className="gs-profile-wrapper" ref={profileMenuRef}>
                    <button
                      type="button"
                      className={`gs-user-card gs-user-card-button ${
                        profileMenuOpen ? "open" : ""
                      }`}
                      onClick={() =>
                        setProfileMenuOpen((current) => !current)
                      }
                      aria-haspopup="menu"
                      aria-expanded={profileMenuOpen}
                      title="Account menu"
                    >
                      <div className="gs-user-avatar">{avatarLetter}</div>

                      <div className="gs-user-details">
                        <strong>{displayName}</strong>
                        <small>{displayEmail}</small>
                      </div>

                      <i
                        className={`bi ${
                          profileMenuOpen
                            ? "bi-chevron-up"
                            : "bi-chevron-down"
                        } gs-profile-chevron`}
                      ></i>
                    </button>

                    {profileMenuOpen && (
                      <div className="gs-profile-dropdown" role="menu">
                        <div className="gs-dropdown-header">
                          <div className="gs-dropdown-avatar">
                            {avatarLetter}
                          </div>

                          <div className="gs-dropdown-user">
                            <strong>{displayName}</strong>
                            <span>{displayEmail}</span>
                            {displayBusiness && (
                              <small>
                                <i className="bi bi-building me-1"></i>
                                {displayBusiness}
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="gs-dropdown-divider"></div>

                        <Link
                          to="/customer/profile"
                          className="gs-dropdown-item"
                          role="menuitem"
                          onClick={closeProfileMenu}
                        >
                          <span className="gs-dropdown-icon blue">
                            <i className="bi bi-person"></i>
                          </span>
                          <span className="gs-dropdown-label">
                            <strong>My Profile</strong>
                            <small>Personal & business details</small>
                          </span>
                          <i className="bi bi-chevron-right gs-dropdown-arrow"></i>
                        </Link>

                        <Link
                          to="/customer/dashboard"
                          className="gs-dropdown-item"
                          role="menuitem"
                          onClick={closeProfileMenu}
                        >
                          <span className="gs-dropdown-icon purple">
                            <i className="bi bi-grid-1x2"></i>
                          </span>
                          <span className="gs-dropdown-label">
                            <strong>Dashboard</strong>
                            <small>Your GoSubsidy overview</small>
                          </span>
                          <i className="bi bi-chevron-right gs-dropdown-arrow"></i>
                        </Link>

                        <Link
                          to="/customer/applications"
                          className="gs-dropdown-item"
                          role="menuitem"
                          onClick={closeProfileMenu}
                        >
                          <span className="gs-dropdown-icon green">
                            <i className="bi bi-file-earmark-check"></i>
                          </span>
                          <span className="gs-dropdown-label">
                            <strong>My Applications</strong>
                            <small>Track your applications</small>
                          </span>
                          <i className="bi bi-chevron-right gs-dropdown-arrow"></i>
                        </Link>

                        <Link
                          to="/customer/payments"
                          className="gs-dropdown-item"
                          role="menuitem"
                          onClick={closeProfileMenu}
                        >
                          <span className="gs-dropdown-icon orange">
                            <i className="bi bi-credit-card"></i>
                          </span>
                          <span className="gs-dropdown-label">
                            <strong>My Payments</strong>
                            <small>Payments & transactions</small>
                          </span>
                          <i className="bi bi-chevron-right gs-dropdown-arrow"></i>
                        </Link>

                        <Link
                          to="/customer/notifications"
                          className="gs-dropdown-item"
                          role="menuitem"
                          onClick={closeProfileMenu}
                        >
                          <span className="gs-dropdown-icon teal">
                            <i className="bi bi-bell"></i>
                          </span>
                          <span className="gs-dropdown-label">
                            <strong>Notifications</strong>
                            <small>Updates & alerts</small>
                          </span>
                          <i className="bi bi-chevron-right gs-dropdown-arrow"></i>
                        </Link>

                        <div className="gs-dropdown-divider"></div>

                        <button
                          type="button"
                          className="gs-dropdown-logout"
                          role="menuitem"
                          onClick={handleSignOut}
                        >
                          <span className="gs-dropdown-icon red">
                            <i className="bi bi-box-arrow-right"></i>
                          </span>
                          <span className="gs-dropdown-label">
                            <strong>Sign Out</strong>
                            <small>Sign out of GoSubsidy</small>
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>

          </div>

        </div>
      </nav>

      {/* =====================================================
          NAVBAR CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           NAVBAR
        ===================================================== */

        .gs-navbar{
          width:100%;
          height:76px;

          display:flex;
          align-items:center;

          background:rgba(255,255,255,.97);

          border-bottom:1px solid #e7edf4;

          box-shadow:
            0 5px 25px rgba(15,23,42,.055);

          backdrop-filter:blur(18px);

          z-index:1050;
        }


        .gs-navbar-container{
          width:100%;

          display:flex;
          align-items:center;

          padding:0 28px;

          gap:25px;
        }


        /* =====================================================
           BRAND
        ===================================================== */

        .gs-navbar-brand{
          display:flex;
          align-items:center;

          flex-shrink:0;

          gap:10px;

          text-decoration:none;
        }


        .gs-navbar-logo{
          width:48px;
          height:48px;

          object-fit:contain;
        }


        .gs-navbar-brand-text{
          display:flex;
          flex-direction:column;

          line-height:1;
        }


        .gs-navbar-brand-name{
          display:flex;

          font-size:26px;
          font-weight:850;

          letter-spacing:-1px;
        }


        /*
         * GOSUBSIDY BRAND COLORS
         * Keep these unchanged.
         */

        .gs-nav-go{
          color:#009e60;
        }


        .gs-nav-subsidy{
          color:#ff9933;
        }


        .gs-navbar-brand-text small{
          margin-top:5px;

          color:#60758b;

          font-size:9px;
          font-weight:800;

          letter-spacing:1.15px;

          text-transform:uppercase;
        }


        /* =====================================================
           COLLAPSE
        ===================================================== */

        .gs-navbar-collapse{
          flex:1;

          align-items:center;

          min-width:0;
        }


        /* =====================================================
           NAVIGATION MENU
        ===================================================== */

        .gs-navbar-menu{
          flex:1;

          display:flex;
          align-items:center;
          justify-content:center;

          gap:5px;

          min-width:0;
        }


        .gs-navbar-link{
          position:relative;

          height:44px;

          display:flex;
          align-items:center;
          justify-content:center;

          gap:7px;

          padding:0 13px;

          border-radius:11px;

          color:#465b70;

          font-size:13px;
          font-weight:650;

          white-space:nowrap;

          text-decoration:none;

          transition:
            background .22s ease,
            color .22s ease,
            transform .22s ease,
            box-shadow .22s ease;
        }


        .gs-navbar-link i{
          font-size:15px;

          color:#60768a;

          transition:.22s ease;
        }


        .gs-navbar-link:hover{
          color:#0968e8;

          background:#f2f7ff;

          transform:translateY(-1px);
        }


        .gs-navbar-link:hover i{
          color:#0968e8;
        }


        /* =====================================================
           ACTIVE MENU
        ===================================================== */

        .gs-navbar-link.active{
          color:#ffffff;

          background:
            linear-gradient(
              135deg,
              #0878f9 0%,
              #4146ed 100%
            );

          box-shadow:
            0 8px 18px
            rgba(37,99,235,.20);
        }


        .gs-navbar-link.active i{
          color:#ffffff;
        }


        /* =====================================================
           RIGHT ACTIONS
        ===================================================== */

        .gs-navbar-actions{
          display:flex;
          align-items:center;

          flex-shrink:0;

          gap:8px;
        }


        /* =====================================================
           LOGIN
        ===================================================== */

        .gs-login-btn{
          height:40px;

          display:flex;
          align-items:center;
          justify-content:center;

          padding:0 19px;

          border-radius:20px;

          border:1.5px solid #0878f9;

          color:#0878f9;

          background:#ffffff;

          font-size:13px;
          font-weight:700;

          text-decoration:none;

          transition:.2s ease;
        }


        .gs-login-btn:hover{
          color:#ffffff;

          background:#0878f9;
        }


        /* =====================================================
           REGISTER
        ===================================================== */

        .gs-register-btn{
          height:40px;

          display:flex;
          align-items:center;
          justify-content:center;

          padding:0 20px;

          border-radius:20px;

          color:#ffffff;

          background:
            linear-gradient(
              135deg,
              #0878f9,
              #4146ed
            );

          font-size:13px;
          font-weight:700;

          text-decoration:none;

          box-shadow:
            0 6px 16px
            rgba(37,99,235,.16);

          transition:.2s ease;
        }


        .gs-register-btn:hover{
          color:#ffffff;

          transform:translateY(-1px);

          box-shadow:
            0 9px 22px
            rgba(37,99,235,.24);
        }


        /* =====================================================
           NOTIFICATION
        ===================================================== */

        .gs-notification-btn{
          position:relative;

          width:40px;
          height:40px;

          display:flex;
          align-items:center;
          justify-content:center;

          border:0;
          border-radius:50%;

          color:#475d72;

          background:#f4f7fa;

          font-size:16px;
        }


        .gs-notification-dot{
          position:absolute;

          top:8px;
          right:9px;

          width:6px;
          height:6px;

          border-radius:50%;

          background:#ef4444;

          border:1px solid white;
        }


        /* =====================================================
           USER CARD
        ===================================================== */

        .gs-user-card{
          max-width:175px;

          height:46px;

          display:flex;
          align-items:center;

          gap:8px;

          padding:4px 10px 4px 5px;

          border-radius:14px;

          background:#f4f7ff;

          border:1px solid #e1e9f5;
        }


        .gs-user-avatar{
          width:35px;
          height:35px;

          flex-shrink:0;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:50%;

          color:#ffffff;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );

          font-size:14px;
          font-weight:800;
        }


        .gs-user-details{
          min-width:0;

          display:flex;
          flex-direction:column;
        }


        .gs-user-details strong{
          max-width:110px;

          overflow:hidden;

          color:#182536;

          font-size:11px;

          white-space:nowrap;
          text-overflow:ellipsis;
        }


        .gs-user-details small{
          max-width:110px;

          overflow:hidden;

          color:#718196;

          font-size:8px;

          white-space:nowrap;
          text-overflow:ellipsis;
        }


        /* =====================================================
           LOGOUT
        ===================================================== */

        .gs-logout-btn{
          width:38px;
          height:38px;

          display:flex;
          align-items:center;
          justify-content:center;

          border:0;

          border-radius:10px;

          color:#64748b;

          background:#f5f7fa;

          transition:.2s ease;
        }


        .gs-logout-btn:hover{
          color:#dc2626;

          background:#fff1f2;
        }


        /* =====================================================
           ACCOUNT DROPDOWN
        ===================================================== */

        .gs-profile-wrapper{
          position:relative;
          flex-shrink:0;
        }

        .gs-user-card-button{
          position:relative;
          width:auto;
          max-width:230px;
          border:1px solid #e1e9f5;
          cursor:pointer;
          text-align:left;
          font-family:inherit;
          transition:.2s ease;
        }

        .gs-user-card-button:hover,
        .gs-user-card-button.open{
          background:#f7faff;
          border-color:#cbd8ff;
          box-shadow:0 8px 24px rgba(37,99,235,.10);
          transform:translateY(-1px);
        }

        .gs-profile-chevron{
          margin-left:auto;
          color:#64748b;
          font-size:10px;
          flex-shrink:0;
        }

        .gs-profile-dropdown{
          position:absolute;
          top:calc(100% + 11px);
          right:0;
          width:340px;
          padding:10px;
          z-index:2000;
          border:1px solid #e2e8f0;
          border-radius:20px;
          background:rgba(255,255,255,.98);
          box-shadow:0 24px 65px rgba(15,23,42,.18),0 6px 20px rgba(37,99,235,.08);
          backdrop-filter:blur(18px);
          animation:gsDropdownIn .18s ease-out;
        }

        @keyframes gsDropdownIn{
          from{opacity:0;transform:translateY(-7px) scale(.985);}
          to{opacity:1;transform:translateY(0) scale(1);}
        }

        .gs-dropdown-header{
          display:flex;
          align-items:center;
          gap:12px;
          padding:12px 9px 14px;
        }

        .gs-dropdown-avatar{
          width:48px;
          height:48px;
          flex:0 0 48px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:15px;
          color:#fff;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          font-size:17px;
          font-weight:800;
        }

        .gs-dropdown-user{
          min-width:0;
          display:flex;
          flex-direction:column;
        }

        .gs-dropdown-user strong{
          color:#102a43;
          font-size:14px;
          font-weight:800;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .gs-dropdown-user span{
          margin-top:3px;
          color:#64748b;
          font-size:10px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .gs-dropdown-user small{
          margin-top:5px;
          color:#2563eb;
          font-size:10px;
          font-weight:700;
        }

        .gs-dropdown-divider{
          height:1px;
          margin:4px 5px;
          background:#edf1f6;
        }

        .gs-dropdown-item,
        .gs-dropdown-logout{
          width:100%;
          display:flex;
          align-items:center;
          gap:11px;
          padding:10px;
          margin:2px 0;
          border:0;
          border-radius:13px;
          background:transparent;
          text-decoration:none;
          cursor:pointer;
          text-align:left;
          transition:.18s ease;
        }

        .gs-dropdown-item:hover,
        .gs-dropdown-logout:hover{
          background:#f5f8ff;
          text-decoration:none;
          transform:translateX(2px);
        }

        .gs-dropdown-icon{
          width:38px;
          height:38px;
          flex:0 0 38px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:11px;
          font-size:15px;
        }

        .gs-dropdown-icon.blue{color:#2563eb;background:#edf4ff;}
        .gs-dropdown-icon.purple{color:#7c3aed;background:#f2edff;}
        .gs-dropdown-icon.green{color:#059669;background:#eafaf4;}
        .gs-dropdown-icon.orange{color:#ea580c;background:#fff3e8;}
        .gs-dropdown-icon.teal{color:#0f766e;background:#e8f9f7;}
        .gs-dropdown-icon.red{color:#dc2626;background:#fff0f0;}

        .gs-dropdown-label{
          min-width:0;
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .gs-dropdown-label strong{
          color:#172033;
          font-size:12px;
          font-weight:800;
        }

        .gs-dropdown-label small{
          margin-top:3px;
          color:#8794a8;
          font-size:9px;
        }

        .gs-dropdown-arrow{
          color:#a1adbd;
          font-size:10px;
          transition:.18s ease;
        }

        .gs-dropdown-item:hover .gs-dropdown-arrow{
          color:#2563eb;
          transform:translateX(3px);
        }

        .gs-dropdown-logout:hover{
          background:#fff5f5;
        }

        .gs-dropdown-logout .gs-dropdown-label strong{
          color:#dc2626;
        }

        @media (max-width:991px){
          .gs-profile-wrapper{
            flex:1;
            min-width:0;
          }

          .gs-user-card-button{
            width:100%;
            max-width:none;
          }

          .gs-profile-dropdown{
            position:relative;
            top:auto;
            right:auto;
            width:100%;
            margin-top:8px;
          }
        }

        /* =====================================================
           MOBILE TOGGLE
        ===================================================== */

        .gs-navbar-toggler{
          display:none;

          margin-left:auto;

          width:42px;
          height:42px;

          border:0;

          border-radius:10px;

          color:#0f172a;

          background:#f1f5f9;

          font-size:23px;
        }


        /* =====================================================
           1366px LAPTOP OPTIMIZATION
        ===================================================== */

        @media (max-width:1400px){

          .gs-navbar-container{
            padding-left:20px;
            padding-right:20px;

            gap:18px;
          }


          .gs-navbar-logo{
            width:44px;
            height:44px;
          }


          .gs-navbar-brand-name{
            font-size:24px;
          }


          .gs-navbar-brand-text small{
            font-size:8px;
          }


          .gs-navbar-menu{
            gap:2px;
          }


          .gs-navbar-link{
            padding:0 10px;

            font-size:12px;
          }


          .gs-navbar-link i{
            font-size:14px;
          }


          .gs-user-card{
            max-width:150px;
          }

        }


        /* =====================================================
           SMALLER LAPTOP
        ===================================================== */

        @media (max-width:1180px){

          .gs-navbar-brand-text small{
            display:none;
          }


          .gs-navbar-link{
            padding:0 8px;

            font-size:11px;
          }


          .gs-navbar-link{
            gap:5px;
          }


          .gs-user-details{
            display:none;
          }


          .gs-user-card{
            width:43px;

            padding:4px;

            justify-content:center;
          }

          .gs-user-card-button{
            width:43px;
            max-width:43px;
          }

          .gs-user-card-button .gs-profile-chevron{
            display:none;
          }

        }


        /* =====================================================
           TABLET / MOBILE
        ===================================================== */

        @media (max-width:991px){

          .gs-navbar{
            height:auto;

            min-height:70px;
          }


          .gs-navbar-container{
            flex-wrap:wrap;

            padding:10px 18px;
          }


          .gs-navbar-toggler{
            display:flex;
            align-items:center;
            justify-content:center;
          }


          .gs-navbar-collapse{
            flex-basis:100%;

            width:100%;
          }


          .gs-navbar-menu{
            width:100%;

            display:flex;
            flex-direction:column;

            align-items:stretch;

            padding:15px 0 10px;
          }


          .gs-navbar-link{
            width:100%;
            height:45px;

            justify-content:flex-start;

            padding:0 15px;

            font-size:13px;
          }


          .gs-navbar-actions{
            width:100%;

            padding:5px 0 10px;
          }


          .gs-login-btn,
          .gs-register-btn{
            flex:1;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width:576px){

          .gs-navbar-logo{
            width:40px;
            height:40px;
          }


          .gs-navbar-brand-name{
            font-size:21px;
          }


          .gs-navbar-brand-text small{
            display:block;

            font-size:6.5px;
          }


          .gs-navbar-actions{
            flex-wrap:wrap;
          }


          .gs-user-card{
            flex:1;

            width:auto;
            max-width:none;

            justify-content:flex-start;
          }

          .gs-user-card-button{
            width:100%;
            max-width:none;
          }

          .gs-user-card-button .gs-profile-chevron{
            display:block;
          }


          .gs-user-details{
            display:flex;
          }

        }


/* ============================================================
   GOSUBSIDY NAVBAR V2 — PREMIUM REFINEMENT
   ============================================================ */

.gs-navbar{
  height:78px;
  background:rgba(255,255,255,.98);
  border-bottom:1px solid #e6edf4;
  box-shadow:0 5px 24px rgba(15,23,42,.065);
  backdrop-filter:blur(18px);
}

.gs-navbar-container{
  width:100%;
  max-width:1540px;
  margin:0 auto;
  padding:0 26px;
  gap:22px;
}

.gs-navbar-brand{gap:10px;flex-shrink:0;}
.gs-navbar-logo{width:50px;height:50px;}

.gs-navbar-brand-name{
  font-size:27px;
  font-weight:850;
  letter-spacing:-1.05px;
}

.gs-navbar-brand-text small{
  margin-top:5px;
  color:#60758b;
  font-size:8.5px;
  font-weight:800;
  letter-spacing:1.15px;
}

.gs-navbar-collapse{flex:1 1 auto;min-width:0;}

.gs-navbar-menu{
  flex:1 1 auto;
  justify-content:center;
  gap:4px;
}

.gs-navbar-link{
  height:44px;
  padding:0 12px;
  gap:7px;
  border-radius:11px;
  color:#40566d;
  font-size:12.5px;
  font-weight:700;
}

.gs-navbar-link i{font-size:14.5px;color:#60758a;}

.gs-navbar-link:hover{
  color:#086ff0;
  background:#f1f6ff;
  transform:translateY(-1px);
}

.gs-navbar-link.active{
  color:#fff;
  background:linear-gradient(135deg,#0878f9 0%,#4146ed 100%);
  box-shadow:0 8px 20px rgba(37,99,235,.20);
}

.gs-navbar-actions{gap:9px;flex-shrink:0;}

.gs-login-btn,
.gs-register-btn{
  height:42px;
  border-radius:12px;
  font-size:12.5px;
  font-weight:800;
}

.gs-login-btn{
  padding:0 18px;
  border:1.5px solid #0878f9;
  color:#0878f9;
  background:#fff;
}

.gs-register-btn{
  padding:0 19px;
  color:#fff;
  background:linear-gradient(135deg,#0878f9,#4146ed);
  box-shadow:0 7px 18px rgba(37,99,235,.18);
}

.gs-notification-btn{
  width:42px;
  height:42px;
  border:1px solid #e0e8f1;
  background:#f6f8fb;
  transition:all .2s ease;
}

.gs-notification-btn:hover{
  color:#086ff0;
  background:#eef5ff;
  border-color:#c8dbf7;
}

.gs-user-card{
  height:46px;
  max-width:220px;
  border-radius:13px;
  background:#f5f8ff;
  border:1px solid #dfe7f2;
}

.gs-user-card-button{max-width:220px;}
.gs-user-avatar{width:36px;height:36px;}
.gs-user-details strong{max-width:125px;font-size:11.5px;}
.gs-user-details small{max-width:125px;font-size:8.5px;}

.gs-profile-dropdown{
  width:350px;
  top:calc(100% + 12px);
  border-radius:20px;
  box-shadow:0 24px 65px rgba(15,23,42,.18),0 7px 22px rgba(37,99,235,.08);
}

.gs-navbar-toggler{display:none;}

@media (max-width:1400px){
  .gs-navbar-container{padding-left:20px;padding-right:20px;gap:16px;}
  .gs-navbar-logo{width:46px;height:46px;}
  .gs-navbar-brand-name{font-size:24px;}
  .gs-navbar-link{padding:0 9px;font-size:11.5px;}
  .gs-navbar-link i{font-size:13.5px;}
  .gs-login-btn,.gs-register-btn{padding-left:14px;padding-right:14px;}
}

@media (max-width:1199.98px){
  .gs-navbar{height:auto;min-height:70px;}

  .gs-navbar-container{
    flex-wrap:wrap;
    padding:10px 18px;
  }

  .gs-navbar-toggler{
    display:flex;
    align-items:center;
    justify-content:center;
    margin-left:auto;
    width:42px;
    height:42px;
    border:1px solid #dbe4ee !important;
    border-radius:11px;
    background:#f5f8fc;
    color:#173a5d;
    font-size:22px;
  }

  .gs-navbar-toggler:focus{
    box-shadow:0 0 0 3px rgba(37,99,235,.12) !important;
  }

  .gs-navbar-collapse{
    flex-basis:100%;
    width:100%;
    min-width:100%;
  }

  .gs-navbar-menu{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:stretch;
    justify-content:flex-start;
    gap:5px;
    padding:14px 0 8px;
  }

  .gs-navbar-link{
    width:100%;
    height:46px;
    justify-content:flex-start;
    padding:0 15px;
    font-size:13px;
  }

  .gs-navbar-actions{
    width:100%;
    padding:10px 0 4px;
    border-top:1px solid #edf1f5;
  }

  .gs-login-btn,.gs-register-btn{flex:1;}

  .gs-profile-wrapper{
    flex:1;
    min-width:0;
  }

  .gs-user-card-button{
    width:100%;
    max-width:none;
  }

  .gs-profile-dropdown{
    position:relative;
    top:auto;
    right:auto;
    width:100%;
    margin-top:8px;
  }
}

@media (max-width:576px){
  .gs-navbar-container{padding:9px 12px;}
  .gs-navbar-logo{width:41px;height:41px;}
  .gs-navbar-brand-name{font-size:21px;}
  .gs-navbar-brand-text small{display:none;}
  .gs-navbar-actions{flex-wrap:wrap;}
  .gs-user-card-button{width:100%;}
  .gs-user-details{display:flex;}
}

      `}</style>
    </>
  );
}