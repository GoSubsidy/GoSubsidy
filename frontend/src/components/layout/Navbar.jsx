import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import SchemeRegistrationModal from "../schemes/SchemeRegistrationModal";
import "./Navbar.css";

/* =========================================================
   GoSubsidy Navbar - 15 EXACT ORIGINAL CATEGORIES + HOME
   ========================================================= */

const MAJOR_CATEGORIES = [
  {
    key: "schemes",
    labelKey: "nav.schemes",
    path: "/schemes",
    icon: "bi-bank",
    descKey: "categories.schemesDesc",
    items: [
      ["All Government Schemes", "/schemes", "bi-grid-3x3-gap"],
      ["Explore Subsidies", "/schemes", "bi-percent"],
      ["Startup Schemes", "/schemes", "bi-rocket-takeoff"],
      ["Business Schemes", "/schemes", "bi-building"],
      ["Agriculture Schemes", "/schemes", "bi-flower1"],
    ],
  },
  {
    key: "startups",
    labelKey: "nav.startups",
    path: "/services/startup-india",
    icon: "bi-rocket-takeoff",
    descKey: "categories.startupsDesc",
    items: [
      ["Proprietorship", "/services/proprietorship", "bi-person-badge"],
      ["Partnership", "/services/partnership", "bi-people"],
      ["One Person Company", "/services/one-person-company", "bi-person-workspace"],
      ["Limited Liability Partnership", "/services/limited-liability-partnership", "bi-diagram-3"],
      ["Private Limited Company", "/services/private-limited-company", "bi-buildings"],
      ["Section 8 Company", "/services/section-8-company", "bi-heart"],
      ["Trust Registration", "/services/trust-registration", "bi-shield-check"],
      ["Public Limited Company", "/services/public-limited-company", "bi-building"],
      ["Producer Company", "/services/producer-company", "bi-box-seam"],
      ["Indian Subsidiary", "/services/indian-subsidiary", "bi-globe-asia-australia"],
    ],
  },
  {
    key: "registration",
    labelKey: "nav.registration",
    path: "/services/startup-india",
    icon: "bi-clipboard2-check",
    descKey: "categories.registrationDesc",
    items: [
      ["Startup India", "/services/startup-india", "bi-rocket"],
      ["Trade License", "/services/trade-license", "bi-shop"],
      ["FSSAI Registration", "/services/fssai-registration", "bi-patch-check"],
      ["FSSAI License", "/services/fssai-license", "bi-award"],
      ["Halal License & Certification", "/services/halal-license-certification", "bi-patch-check"],
      ["ICEGATE Registration", "/services/icegate-registration", "bi-globe2"],
      ["Import Export Code", "/services/import-export-code", "bi-box-arrow-up-right"],
      ["Legal Entity Identifier Code", "/services/legal-entity-identifier-code", "bi-upc-scan"],
      ["ISO Registration", "/services/iso-registration", "bi-patch-check"],
      ["PF Registration", "/services/pf-registration", "bi-person-check"],
      ["ESI Registration", "/services/esi-registration", "bi-heart-pulse"],
      ["Professional Tax Registration", "/services/professional-tax-registration", "bi-receipt"],
      ["RCMC Registration", "/services/rcmc-registration", "bi-card-checklist"],
      ["TN RERA Registration for Agents", "/services/tn-rera-registration-for-agents", "bi-houses"],
      ["12A and 80G Registration", "/services/12a-80g-registration", "bi-file-earmark-check"],
      ["12A Registration", "/services/12a-registration", "bi-file-earmark-text"],
      ["80G Registration", "/services/80g-registration", "bi-hand-thumbs-up"],
      ["Barcode Registration", "/services/barcode-registration", "bi-upc-scan"],
      ["BIS Registration", "/services/bis-registration", "bi-patch-check"],
      ["Certificate of Incumbency", "/services/certificate-of-incumbency", "bi-file-earmark-person"],
      ["Darpan Registration", "/services/darpan-registration", "bi-person-vcard"],
      ["Digital Signature", "/services/digital-signature", "bi-pen"],
      ["Shop Act Registration", "/services/shop-act-registration", "bi-shop-window"],
      ["Udyam Registration", "/services/udyam-registration", "bi-building-check"],
      ["Fire License", "/services/fire-license", "bi-fire"],
      ["Legal Name Change", "/services/legal-name-change", "bi-pencil-square"],
      ["Water Testing", "/services/water-testing", "bi-droplet"],
      ["Food Testing", "/services/food-testing", "bi-cup-hot"],
    ],
  },
  {
    key: "trademark",
    labelKey: "nav.trademark",
    path: "/services/trademark-registration",
    icon: "bi-shield-shaded",
    descKey: "categories.trademarkDesc",
    items: [
      ["Trademark Registration", "/services/trademark-registration", "bi-shield-check"],
      ["Trademark Objection", "/services/trademark-objection", "bi-exclamation-triangle"],
      ["Trademark Certificate", "/services/trademark-certificate", "bi-patch-check"],
      ["Trademark Opposition", "/services/trademark-opposition", "bi-shield-exclamation"],
      ["Trademark Hearing", "/services/trademark-hearing", "bi-mic"],
      ["Trademark Rectification", "/services/trademark-rectification", "bi-pencil-square"],
      ["TM Infringement Notice", "/services/tm-infringement-notice", "bi-file-earmark-break"],
      ["Trademark Renewal", "/services/trademark-renewal", "bi-arrow-repeat"],
      ["Trademark Transfer", "/services/trademark-transfer", "bi-arrow-left-right"],
      ["Expedited TM Registration", "/services/expedited-tm-registration", "bi-lightning-charge"],
      ["Logo Designing", "/services/logo-designing", "bi-palette"],
      ["Design Registration", "/services/design-registration", "bi-vector-pen"],
      ["Design Objection", "/services/design-objection", "bi-exclamation-circle"],
      ["Copyright Registration", "/services/copyright-registration", "bi-c-circle"],
      ["Copyright Objection", "/services/copyright-objection", "bi-exclamation-circle"],
      ["Patent Registration", "/services/patent-registration", "bi-lightbulb"],
      ["Trademark Protection", "/services/trademark-protection", "bi-shield-lock"],
    ],
  },
  {
    key: "gst",
    labelKey: "nav.gst",
    path: "/services/gst-registration",
    icon: "bi-receipt-cutoff",
    descKey: "categories.gstDesc",
    items: [
      ["GST Registration", "/services/gst-registration", "bi-receipt"],
      ["GST Return Filing by Accountant", "/services/gst-return-filing-by-accountant", "bi-file-earmark-spreadsheet"],
      ["GST LUT Form", "/services/gst-lut-form", "bi-file-earmark-text"],
      ["GST Notice", "/services/gst-notice", "bi-exclamation-triangle"],
      ["GST Annual Return Filing", "/services/gst-annual-return-filing-gstr-9", "bi-calendar-check"],
      ["GST Registration for Foreigners", "/services/gst-registration-for-foreigners", "bi-globe2"],
      ["GST Amendment", "/services/gst-amendment", "bi-pencil-square"],
      ["GST Revocation", "/services/gst-revocation", "bi-arrow-counterclockwise"],
      ["GSTR-10", "/services/gstr-10", "bi-file-earmark-check"],
      ["Virtual Office + GSTIN", "/services/virtual-office-gstin", "bi-building"],
    ],
  },
  {
    key: "income-tax",
    labelKey: "nav.incomeTax",
    path: "/services/income-tax-e-filing",
    icon: "bi-calculator",
    descKey: "categories.gstDesc",
    items: [
      ["Income Tax E-Filing", "/services/income-tax-e-filing", "bi-file-earmark-text"],
      ["Business ITR Filing", "/services/business-itr-filing", "bi-briefcase"],
      ["Partnership Firm / LLP ITR", "/services/partnership-firm-llp-itr", "bi-diagram-3"],
      ["Company ITR Filing", "/services/company-itr-filing", "bi-building"],
      ["Trust / NGO Tax Filing", "/services/trust-ngo-tax-filing", "bi-heart"],
      ["15CA - 15CB Filing", "/services/15ca-15cb-filing", "bi-file-earmark-check"],
      ["TAN Registration", "/services/tan-registration", "bi-person-vcard"],
      ["TDS Return Filing", "/services/tds-return-filing", "bi-receipt"],
      ["Income Tax Notice", "/services/income-tax-notice", "bi-exclamation-triangle"],
      ["Revised ITR Return", "/services/revised-itr-return-itr-u", "bi-arrow-repeat"],
    ],
  },
  {
    key: "mca",
    labelKey: "nav.mca",
    path: "/services/company-compliance",
    icon: "bi-building",
    descKey: "categories.startupsDesc",
    items: [
      ["Company Compliance", "/services/company-compliance", "bi-building-check"],
      ["LLP Compliance", "/services/llp-compliance", "bi-diagram-3"],
      ["OPC Compliance", "/services/opc-compliance", "bi-person-workspace"],
      ["Name Change - Company", "/services/name-change-company", "bi-pencil-square"],
      ["Registered Office Change", "/services/registered-office-change", "bi-geo-alt"],
      ["DIN eKYC Filing", "/services/din-ekyc-filing", "bi-person-check"],
      ["DIN Reactivation", "/services/din-reactivation", "bi-arrow-clockwise"],
      ["Director Change", "/services/director-change", "bi-person-gear"],
      ["Remove Director", "/services/remove-director", "bi-person-dash"],
      ["ADT-1 Filing", "/services/adt-1-filing", "bi-file-earmark-check"],
      ["DPT-3 Filing", "/services/dpt-3-filing", "bi-file-earmark-text"],
      ["LLP Form 11 Filing", "/services/llp-form-11-filing", "bi-file-earmark-spreadsheet"],
      ["Dormant Status Filing", "/services/dormant-status-filing", "bi-pause-circle"],
      ["MOA Amendment", "/services/moa-amendment", "bi-file-earmark-medical"],
      ["AOA Amendment", "/services/aoa-amendment", "bi-file-earmark-medical"],
      ["Authorized Capital Increase", "/services/authorized-capital-increase", "bi-graph-up-arrow"],
      ["Share Transfer", "/services/share-transfer", "bi-arrow-left-right"],
      ["Demat of Shares", "/services/demat-of-shares", "bi-pie-chart"],
      ["Winding Up - LLP", "/services/winding-up-llp", "bi-x-circle"],
      ["Winding Up - Company", "/services/winding-up-company", "bi-x-circle"],
      ["Commencement (INC-20A)", "/services/commencement-inc-20a", "bi-play-circle"],
      ["CCFS Scheme", "/services/ccfs-scheme", "bi-file-earmark-check"],
    ],
  },
  {
    key: "compliance",
    labelKey: "nav.compliance",
    path: "/services/fdi-filing",
    icon: "bi-clipboard-check",
    descKey: "categories.registrationDesc",
    items: [
      ["FDI Filing", "/services/fdi-filing", "bi-globe2"],
      ["ODI Filing", "/services/odi-filing", "bi-airplane"],
      ["FLA Return Filing", "/services/fla-return-filing", "bi-file-earmark-spreadsheet"],
      ["FSSAI Renewal", "/services/fssai-renewal", "bi-arrow-repeat"],
      ["FSSAI Return Filing", "/services/fssai-return-filing", "bi-file-earmark-check"],
      ["Business Plan", "/services/business-plan", "bi-file-earmark-bar-graph"],
      ["HR & Payroll", "/services/hr-payroll", "bi-people"],
      ["PF Return Filing", "/services/pf-return-filing", "bi-person-check"],
      ["ESI Return Filing", "/services/esi-return-filing", "bi-heart-pulse"],
      ["Professional Tax Return Filing", "/services/professional-tax-return-filing", "bi-receipt"],
      ["Partnership Compliance", "/services/partnership-compliance", "bi-people"],
      ["Proprietorship Compliance", "/services/proprietorship-compliance", "bi-person-badge"],
      ["Bookkeeping", "/services/bookkeeping", "bi-journal-text"],
    ],
  },
  {
    key: "consultation",
    labelKey: "nav.consultation",
    path: "/services/ca-consultation",
    icon: "bi-person-vcard",
    descKey: "categories.schemesDesc",
    items: [
      ["CA Consultation", "/services/ca-consultation", "bi-person-vcard"],
      ["Legal Consultation", "/services/legal-consultation", "bi-briefcase"],
    ],
  },
  {
    key: "global",
    labelKey: "nav.global",
    path: "/services/uae-company-registration",
    icon: "bi-globe2",
    descKey: "categories.startupsDesc",
    items: [
      ["UAE Company Registration", "/services/uae-company-registration", "bi-globe2"],
      ["USA Company Registration", "/services/usa-company-registration", "bi-flag"],
      ["Singapore Business Setup", "/services/singapore-business-setup", "bi-buildings"],
      ["UK Company Registration", "/services/uk-company-registration", "bi-building"],
      ["USA Trademark Registration", "/services/usa-trademark-registration", "bi-shield-check"],
    ],
  },
  {
    key: "loans",
    labelKey: "nav.loans",
    path: "/loans",
    icon: "bi-cash-coin",
    descKey: "categories.loansDesc",
    items: [
      ["Explore Loans", "/loans", "bi-cash-stack"],
      ["Business Loans", "/loans", "bi-briefcase"],
      ["Loan Eligibility", "/loans", "bi-check2-circle"],
      ["Loan Assistance", "/loans", "bi-person-check"],
    ],
  },
  {
    key: "insurance",
    labelKey: "nav.insurance",
    path: "/insurance",
    icon: "bi-shield-check",
    descKey: "categories.insuranceDesc",
    items: [
      ["Explore Insurance", "/insurance", "bi-shield-check"],
      ["Business Insurance", "/insurance", "bi-building-shield"],
      ["Insurance Assistance", "/insurance", "bi-person-check"],
      ["Compare Insurance Options", "/insurance", "bi-bar-chart"],
    ],
  },
  {
    key: "emi",
    labelKey: "nav.emiCalculator",
    path: "/subsidy-loan-emi-calculator",
    icon: "bi-calculator",
    descKey: "categories.loansDesc",
    items: [
      ["Fixed Deposit Calculator", "/calculators/fixed-deposit", "bi-piggy-bank"],
      ["GST Calculator", "/calculators/gst", "bi-receipt"],
      ["SIP Calculator", "/calculators/sip", "bi-graph-up-arrow"],
      ["Daily SIP Calculator", "/calculators/daily-sip", "bi-calendar-date"],
      ["Subsidy Loan EMI Calculator", "/calculators/subsidy-loan", "bi-cash-coin"],
      ["Personal Loan EMI Calculator", "/calculators/personal-loan", "bi-person"],
      ["Home Loan EMI Calculator", "/calculators/home-loan", "bi-house"],
      ["Business Loan EMI Calculator", "/calculators/business-loan", "bi-briefcase"],
      ["Gold Loan EMI Calculator", "/calculators/gold-loan", "bi-award"],
      ["Two Wheeler Loan EMI Calculator", "/calculators/two-wheeler-loan", "bi-bicycle"],
      ["Loan Against Property EMI Calculator", "/calculators/loan-against-property", "bi-building"],
      ["Term Loan EMI Calculator", "/calculators/term-loan", "bi-clock-history"],
      ["Tractor Loan EMI Calculator", "/calculators/tractor-loan", "bi-truck"],
      ["Mudra Loan EMI Calculator", "/calculators/mudra-loan", "bi-patch-check"],
      ["Personal Loan Eligibility Calculator", "/calculators/personal-eligibility", "bi-check2-circle"],
      ["Home Loan Eligibility Calculator", "/calculators/home-eligibility", "bi-check-square"],
      ["Home Loan Prepayment Calculator", "/calculators/home-prepayment", "bi-arrow-counterclockwise"],
      ["Personal Loan Prepayment Calculator", "/calculators/personal-prepayment", "bi-arrow-repeat"],
    ],
  },
  {
    key: "dpr",
    labelKey: "nav.dpr",
    path: "/dpr",
    icon: "bi-file-earmark-text",
    descKey: "categories.dprDesc",
    items: [
      ["Detailed Project Report", "/dpr", "bi-file-earmark-text"],
      ["Create Project Report", "/dpr", "bi-file-earmark-plus"],
      ["Project Cost & Funding", "/dpr", "bi-graph-up-arrow"],
      ["Project Report Assistance", "/dpr", "bi-person-check"],
    ],
  },
  {
    key: "cibil",
    labelKey: "nav.cibil",
    path: "/cibil",
    icon: "bi-graph-up-arrow",
    descKey: "categories.loansDesc",
    items: [
      ["CIBIL Services", "/cibil", "bi-graph-up-arrow"],
      ["Check CIBIL", "/cibil", "bi-search"],
      ["Credit Profile Assistance", "/cibil", "bi-person-check"],
      ["Credit Readiness", "/cibil", "bi-shield-check"],
    ],
  },
];

function ProfileItem({ to, icon, tone, title, text, onClick }) {
  return (
    <Link to={to} className="gs-profile-dropdown-item" role="menuitem" onClick={onClick}>
      <span className={`gs-profile-item-icon ${tone}`}>
        <i className={`bi ${icon}`} />
      </span>
      <span className="gs-profile-item-content">
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <i className="bi bi-chevron-right" />
    </Link>
  );
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { currentLang, changeLanguage, languages } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [openCategory, setOpenCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, align: "left" });
  const [expertOpen, setExpertOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

  const [showSchemePopup, setShowSchemePopup] = useState(false);
  const [pendingRoute, setPendingRoute] = useState("/schemes");

  const navbarRef = useRef(null);
  const expertRef = useRef(null);
  const profileRef = useRef(null);

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
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "C";

  const isHome = location.pathname === "/";

  useEffect(() => {
    setOpenCategory(null);
    setExpertOpen(false);
    setProfileOpen(false);
    setDrawerOpen(false);
    setMobileExpandedCat(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenCategory(null);
        setExpertOpen(false);
        setProfileOpen(false);
      }
      if (expertRef.current && !expertRef.current.contains(event.target)) {
        setExpertOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenCategory(null);
        setExpertOpen(false);
        setProfileOpen(false);
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenus = () => {
    setOpenCategory(null);
    setExpertOpen(false);
    setProfileOpen(false);
    setDrawerOpen(false);
  };

  const calculatePosition = (element) => {
    if (!element || !navbarRef.current) return;
    const navRect = navbarRef.current.getBoundingClientRect();
    const btnRect = element.getBoundingClientRect();
    const offsetLeft = btnRect.left - navRect.left;

    if (offsetLeft > navRect.width / 2) {
      const offsetRight = navRect.right - btnRect.right;
      setDropdownPosition({ right: Math.max(12, offsetRight - 30), align: "right" });
    } else {
      setDropdownPosition({ left: Math.max(12, offsetLeft - 20), align: "left" });
    }
  };

  const toggleCategory = (e, key) => {
    e.stopPropagation();
    setExpertOpen(false);
    setProfileOpen(false);
    if (openCategory === key) {
      setOpenCategory(null);
    } else {
      calculatePosition(e.currentTarget);
      setOpenCategory(key);
    }
  };

  const handleMouseEnter = (e, key) => {
    if (window.innerWidth > 992) {
      calculatePosition(e.currentTarget);
      setOpenCategory(key);
    }
  };

  const isCategoryActive = (category) => {
    if (category.key === "schemes") {
      return (
        location.pathname === "/schemes" ||
        location.pathname.startsWith("/schemes/")
      );
    }
    if (category.key === "emi") {
      return (
        location.pathname === "/subsidy-loan-emi-calculator" ||
        location.pathname.startsWith("/calculators/")
      );
    }
    return (
      location.pathname === category.path ||
      location.pathname.startsWith(category.path + "/")
    );
  };

  const handleSchemeNavigation = (e, targetPath) => {
    if (targetPath.startsWith("/schemes")) {
      e.preventDefault();
      closeMenus();

      const isRegistered = localStorage.getItem("gosubsidy_schemes_advisory_registered") === "true";
      if (isRegistered) {
        navigate(targetPath);
      } else {
        setPendingRoute(targetPath);
        setShowSchemePopup(true);
      }
    } else {
      closeMenus();
    }
  };

  const handleSignOut = async () => {
    closeMenus();
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("GoSubsidy logout failed:", error);
    }
  };

  const currentCategoryData = MAJOR_CATEGORIES.find((c) => c.key === openCategory);

  return (
    <header className="gs-navbar-root" ref={navbarRef} aria-label="GoSubsidy Navigation">
      <style>{`
        /* Perfectly matched typography and sizing exactly like the official logo asset */
        .gs-navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .gs-navbar-logo {
          height: 42px;
          width: auto;
          object-fit: contain;
        }
        .gs-navbar-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }
        .gs-navbar-brand-name {
          font-size: 27px;
          font-weight: 900;
          letter-spacing: -0.9px;
          display: flex;
          align-items: center;
        }
        .gs-nav-go {
          color: #00a66a;
        }
        .gs-nav-subsidy {
          color: #ff6800;
        }
        .gs-navbar-tagline {
          font-size: 8.5px;
          font-weight: 800;
          color: #1a2b4c;
          letter-spacing: 1.25px;
          margin-top: 3.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
      `}</style>

      {/* 1. TOP HEADER */}
      <div className="gs-navbar-top">
        <div className="gs-navbar-top-inner">
          <div className="gs-brand-group">
            <button
              type="button"
              className="gs-mobile-menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <i className="bi bi-list" />
            </button>

            <Link to="/" className="gs-navbar-brand" onClick={closeMenus}>
              <img src="/images/gosubsidy-logo.png" alt="GoSubsidy" className="gs-navbar-logo" />
              <div className="gs-navbar-brand-text">
                <span className="gs-navbar-brand-name">
                  <span className="gs-nav-go">Go</span>
                  <span className="gs-nav-subsidy">Subsidy</span>
                </span>
                <small className="gs-navbar-tagline">BUSINESS &amp; FINANCIAL SERVICES</small>
              </div>
            </Link>
          </div>

          <div className="gs-navbar-top-actions">
            {/* Global Language Selector Dropdown */}
            <div className="gs-lang-wrapper d-flex align-items-center me-2">
              <span className="text-muted small me-1 d-none d-md-inline">
                <i className="bi bi-translate" />
              </span>
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="form-select form-select-sm border-0 bg-light fw-bold text-dark shadow-sm"
                style={{ width: "135px", cursor: "pointer", fontSize: "12.5px" }}
                aria-label="Platform Language Selection"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Talk to Expert */}
            <div className="gs-expert-wrapper" ref={expertRef}>
              <button
                type="button"
                className={`gs-expert-trigger ${expertOpen ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpertOpen((cur) => !cur);
                  setOpenCategory(null);
                  setProfileOpen(false);
                }}
                aria-expanded={expertOpen}
              >
                <i className="bi bi-headset gs-movable-headphone" />
                <span className="gs-expert-text">{t('nav.talkToExpert')}</span>
                <i className={`bi bi-chevron-${expertOpen ? "up" : "down"} gs-expert-arrow`} />
              </button>

              {expertOpen && (
                <div className="gs-expert-popup">
                  <div className="gs-expert-popup-header">
                    <div className="gs-expert-popup-icon">
                      <i className="bi bi-headset" />
                    </div>
                    <div>
                      <strong>{t('nav.talkToExpert')}</strong>
                      <small>We're here to help</small>
                    </div>
                  </div>

                  <div className="gs-expert-popup-section">
                    <span>Sales Enquiry</span>
                    <Link to="/contact" onClick={closeMenus}>
                      Talk to a GoSubsidy expert
                      <i className="bi bi-arrow-right" />
                    </Link>
                  </div>

                  <div className="gs-expert-popup-section">
                    <span>Service Support</span>
                    <Link to="/contact" onClick={closeMenus}>
                      Get service assistance
                      <i className="bi bi-arrow-right" />
                    </Link>
                  </div>

                  <p className="gs-expert-popup-note">
                    Connect with our experts for schemes, loans, registrations, compliance and other GoSubsidy services.
                  </p>

                  <Link to="/contact" className="gs-expert-contact-link" onClick={closeMenus}>
                    Contact GoSubsidy Expert
                    <i className="bi bi-arrow-right" />
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            {user && (
              <button
                type="button"
                className="gs-notification-btn"
                title="Notifications"
                onClick={() => {
                  closeMenus();
                  navigate("/customer/notifications");
                }}
              >
                <i className="bi bi-bell" />
                <span className="gs-notification-dot" />
              </button>
            )}

            {/* Auth / Profile */}
            {!user ? (
              <div className="gs-auth-buttons">
                <Link to="/login" className="gs-login-btn" onClick={closeMenus}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="gs-register-btn" onClick={closeMenus}>
                  {t('nav.register')}
                </Link>
              </div>
            ) : (
              <div className="gs-profile-wrapper" ref={profileRef}>
                <button
                  type="button"
                  className={`gs-user-card ${profileOpen ? "open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen((cur) => !cur);
                    setOpenCategory(null);
                    setExpertOpen(false);
                  }}
                  aria-expanded={profileOpen}
                >
                  <span className="gs-user-avatar">{avatarLetter}</span>
                  <span className="gs-user-details">
                    <strong>{displayName}</strong>
                    <small>{displayEmail}</small>
                  </span>
                  <i className={`bi bi-chevron-${profileOpen ? "up" : "down"} gs-user-arrow`} />
                </button>

                {profileOpen && (
                  <div className="gs-profile-dropdown" role="menu">
                    <div className="gs-profile-header">
                      <span className="gs-profile-avatar">{avatarLetter}</span>
                      <span className="gs-profile-user">
                        <strong>{displayName}</strong>
                        <small>{displayEmail}</small>
                        {displayBusiness && (
                          <em>
                            <i className="bi bi-building" />
                            {displayBusiness}
                          </em>
                        )}
                      </span>
                    </div>

                    <div className="gs-profile-divider" />

                    <ProfileItem
                      to="/customer/profile"
                      icon="bi-person"
                      tone="blue"
                      title="My Profile"
                      text="Personal & business details"
                      onClick={closeMenus}
                    />
                    <ProfileItem
                      to="/customer/dashboard"
                      icon="bi-grid-1x2"
                      tone="purple"
                      title="Dashboard"
                      text="Your GoSubsidy overview"
                      onClick={closeMenus}
                    />
                    <ProfileItem
                      to="/customer/applications"
                      icon="bi-file-earmark-check"
                      tone="green"
                      title="My Applications"
                      text="Track your applications"
                      onClick={closeMenus}
                    />
                    <ProfileItem
                      to="/customer/payments"
                      icon="bi-credit-card"
                      tone="orange"
                      title="My Payments"
                      text="Payments & transactions"
                      onClick={closeMenus}
                    />
                    <ProfileItem
                      to="/customer/notifications"
                      icon="bi-bell"
                      tone="teal"
                      title="Notifications"
                      text="Updates & alerts"
                      onClick={closeMenus}
                    />

                    <div className="gs-profile-divider" />

                    {/* Sign Out Action */}
                    <button type="button" className="gs-profile-logout" onClick={handleSignOut}>
                      <span className="gs-profile-item-icon red">
                        <i className="bi bi-box-arrow-right" />
                      </span>
                      <span className="gs-profile-item-content">
                        <strong>Sign Out</strong>
                        <small>Sign out of GoSubsidy</small>
                      </span>
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. CATEGORY BAR */}
      <div className="gs-navbar-strip-wrapper">
        <div className="gs-navbar-strip">
          <div className="gs-navbar-strip-inner">
            {/* Home */}
            <div className="gs-category-item">
              <Link
                to="/"
                className={`gs-category-button gs-home-btn ${isHome ? "active" : ""}`}
                onClick={closeMenus}
                title="Homepage"
              >
                <i className="bi bi-house-door-fill gs-cat-icon gs-home-icon" />
                <span>{t('nav.home')}</span>
              </Link>
            </div>

            {/* Major Categories */}
            {MAJOR_CATEGORIES.map((category) => {
              const active = isCategoryActive(category);
              const opened = openCategory === category.key;

              return (
                <div
                  key={category.key}
                  className={`gs-category-item ${opened ? "opened" : ""}`}
                  onMouseEnter={(e) => handleMouseEnter(e, category.key)}
                >
                  <button
                    type="button"
                    className={`gs-category-button ${active ? "active" : ""}`}
                    onClick={(e) => toggleCategory(e, category.key)}
                  >
                    <i className={`bi ${category.icon} gs-cat-icon`} />
                    <span>{t(category.labelKey)}</span>
                    <i className={`bi bi-chevron-${opened ? "up" : "down"} gs-cat-chevron`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. ROOT-MOUNTED MEGA DROPDOWN */}
      {openCategory && currentCategoryData && (
        <div
          className={`gs-smart-dropdown ${
            currentCategoryData.items.length > 12
              ? "mega-cols-3"
              : currentCategoryData.items.length > 6
              ? "mega-cols-2"
              : "mega-cols-1"
          }`}
          style={
            dropdownPosition.align === "right"
              ? { right: `${dropdownPosition.right}px`, left: "auto" }
              : { left: `${dropdownPosition.left}px`, right: "auto" }
          }
          onMouseEnter={() => {
            if (window.innerWidth > 992) {
              setOpenCategory(openCategory);
            }
          }}
          onMouseLeave={() => {
            if (window.innerWidth > 992) {
              setOpenCategory(null);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gs-smart-dropdown-header">
            <div className="gs-smart-header-title">
              <span className="gs-smart-header-icon">
                <i className={`bi ${currentCategoryData.icon}`} />
              </span>
              <div>
                <small>GOSUBSIDY SERVICES</small>
                <strong>{t(currentCategoryData.labelKey)}</strong>
                <p>{t(currentCategoryData.descKey)}</p>
              </div>
            </div>
            <Link 
              to={currentCategoryData.path} 
              className="gs-smart-open-link" 
              onClick={(e) => handleSchemeNavigation(e, currentCategoryData.path)}
            >
              Open <i className="bi bi-arrow-right" />
            </Link>
          </div>

          {currentCategoryData.key === "emi" ? (
            <div className="gs-calculator-groups">
              {[
                {
                  title: "Investment Calculators",
                  items: currentCategoryData.items.slice(0, 4),
                },
                {
                  title: "Loan EMI Calculators",
                  items: currentCategoryData.items.slice(4, 14),
                },
                {
                  title: "Loan Eligibility Calculators",
                  items: currentCategoryData.items.slice(14),
                },
              ].map((group) => (
                <div className="gs-calculator-group" key={group.title}>
                  <div className="gs-calculator-group-title">
                    {group.title}
                  </div>
                  <div className="gs-calculator-group-items">
                    {group.items.map(([label, path, icon], index) => (
                      <Link
                        key={`${currentCategoryData.key}-${group.title}-${index}`}
                        to={path}
                        className="gs-smart-item"
                        onClick={(e) => handleSchemeNavigation(e, path)}
                      >
                        <span className="gs-smart-item-icon">
                          <i className={`bi ${icon}`} />
                        </span>
                        <span className="gs-smart-item-name">{label}</span>
                        <i className="bi bi-arrow-up-right gs-smart-item-arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gs-smart-service-grid">
              {currentCategoryData.items.map(([label, path, icon], index) => (
                <Link
                  key={`${currentCategoryData.key}-${index}`}
                  to={path}
                  className="gs-smart-item"
                  onClick={(e) => handleSchemeNavigation(e, path)}
                >
                  <span className="gs-smart-item-icon">
                    <i className={`bi ${icon}`} />
                  </span>
                  <span className="gs-smart-item-name">{label}</span>
                  <i className="bi bi-arrow-up-right gs-smart-item-arrow" />
                </Link>
              ))}
            </div>
          )}

          {/* Fully Clickable GoSubsidy Verified Services Footer */}
          <div className="gs-smart-dropdown-footer">
            <Link
              to={currentCategoryData.path}
              className="gs-smart-verified-link text-decoration-none text-dark"
              onClick={(e) => handleSchemeNavigation(e, currentCategoryData.path)}
            >
              <i className="bi bi-stars me-1 text-warning" />
              <span>GoSubsidy Verified Services</span>
            </Link>
            <Link 
              to={currentCategoryData.path} 
              onClick={(e) => handleSchemeNavigation(e, currentCategoryData.path)} 
              className="gs-smart-view-all"
            >
              View All <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. MOBILE DRAWER */}
      {drawerOpen && (
        <div className="gs-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="gs-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="gs-drawer-header">
              <div className="gs-drawer-brand">
                <img src="/images/gosubsidy-logo.png" alt="GoSubsidy" className="gs-drawer-logo" />
                <span className="gs-drawer-title">
                  <span className="gs-nav-go">Go</span>
                  <span className="gs-nav-subsidy">Subsidy</span>
                </span>
              </div>
              <button
                type="button"
                className="gs-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="gs-drawer-body">
              {/* Mobile Language Selector */}
              <div className="p-3 bg-light border-bottom mb-2">
                <label className="form-label small fw-bold text-muted mb-1">Select Language</label>
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="form-select form-select-sm fw-bold"
                  aria-label="Mobile Language Selection"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                to="/"
                className={`gs-drawer-home-link ${isHome ? "active" : ""}`}
                onClick={() => {
                  setDrawerOpen(false);
                  closeMenus();
                }}
              >
                <i className="bi bi-house-door-fill gs-drawer-icon" />
                <span>{t('nav.home')}</span>
              </Link>

              {MAJOR_CATEGORIES.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.key;
                return (
                  <div key={cat.key} className="gs-drawer-accordion-item">
                    <button
                      type="button"
                      className={`gs-drawer-cat-btn ${isExpanded ? "active" : ""}`}
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat.key)}
                    >
                      <span className="gs-drawer-cat-left">
                        <i className={`bi ${cat.icon} gs-drawer-icon`} />
                        <span>{t(cat.labelKey)}</span>
                      </span>
                      <i className={`bi bi-chevron-${isExpanded ? "up" : "down"} gs-drawer-chevron`} />
                    </button>

                    {isExpanded && (
                      <div className="gs-drawer-submenu">
                        {cat.items.map(([name, link, icon], subIdx) => (
                          <Link
                            key={subIdx}
                            to={link}
                            className="gs-drawer-sub-link"
                            onClick={(e) => {
                              setDrawerOpen(false);
                              handleSchemeNavigation(e, link);
                            }}
                          >
                            <i className={`bi ${icon} gs-drawer-sub-icon`} />
                            <span>{name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="gs-drawer-footer">
              <Link to="/contact" className="gs-drawer-expert-btn" onClick={() => setDrawerOpen(false)}>
                <i className="bi bi-headset me-2" /> {t('nav.talkToExpert')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. SCHEMES 1-YEAR ADVISORY & ALERTS POPUP */}
      <SchemeRegistrationModal
        isOpen={showSchemePopup}
        onClose={() => {
          setShowSchemePopup(false);
          navigate(pendingRoute);
        }}
        onSuccess={() => {
          setShowSchemePopup(false);
          navigate(pendingRoute);
        }}
      />
    </header>
  );
}