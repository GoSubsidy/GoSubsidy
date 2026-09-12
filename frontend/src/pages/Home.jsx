import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trackVisit } from "../services/analytics";
import Footer from "../components/layout/Footer";
import PromoModal from "../components/common/PromoModal";
import PaisabazaarHeroSlider from "../components/home/PaisabazaarHeroSlider";
import SchemeRegistrationModal from "../components/schemes/SchemeRegistrationModal";
import "../styles/Home.css";

// Row 1: Business & Professional
const BUSINESS_SERVICES = [
  { 
    title: "Schemes", 
    subtitle: "Government Subsidies", 
    customImg: "/icons/Schemes.png", 
    fallbackIcon: "bi-bank2",
    link: "/schemes", 
    badge: "Popular", 
    tone: "custom-img-tile",
    isSchemeTrigger: true
  },
  { 
    title: "Startups", 
    subtitle: "Company Setup", 
    icon: "bi-rocket-takeoff-fill", 
    link: "/services/proprietorship", 
    badge: "New", 
    tone: "startup-orange" 
  },
  { 
    title: "Registration", 
    subtitle: "Statutory Licenses",
    customImg: "/icons/Registration.png",
    fallbackIcon: "bi-clipboard2-check-fill", 
    link: "/services/startup-india", 
    tone: "custom-img-tile" 
  },
  { 
    title: "Trademark", 
    subtitle: "IP & Copyright",
    customImg: "/icons/Trademark.png", 
    fallbackIcon: "bi-shield-shaded", 
    link: "/services/trademark-registration", 
    tone: "custom-img-tile" 
  },
  { 
    title: "GST", 
    subtitle: "Filing & Registration", 
    customImg: "/icons/GST.png", 
    fallbackIcon: "bi-receipt-cutoff",
    link: "/services/gst-registration", 
    badge: "Save Tax*", 
    tone: "custom-img-tile" 
  },
  { 
    title: "Income Tax", 
    subtitle: "ITR e-Filing", 
    customImg: "/icons/ITR.png", 
    fallbackIcon: "bi-calculator-fill",
    link: "/services/income-tax-e-filing", 
    tone: "custom-img-tile" 
  },
  { 
    title: "MCA", 
    subtitle: "Corporate Services", 
    customImg: "/icons/MCA.png", 
    fallbackIcon: "bi-building",
    link: "/services/company-compliance", 
    tone: "custom-img-tile" 
  },
  { 
    title: "Compliance", 
    subtitle: "Annual Returns", 
    icon: "bi-clipboard-check-fill", 
    link: "/services/fdi-filing", 
    tone: "comp-rose" 
  },
  { 
    title: "Consultation", 
    subtitle: "CA / Legal Advice", 
    icon: "bi-person-vcard-fill", 
    link: "/services/ca-consultation", 
    tone: "consult-amber" 
  },
  { 
    title: "Global", 
    subtitle: "Overseas Setup", 
    icon: "bi-globe2", 
    link: "/services/uae-company-registration", 
    tone: "global-cyan" 
  },
];

// Row 2: Finance & Protection
const FINANCE_SERVICES = [
  { 
    title: "Loans", 
    subtitle: "Business & MSME", 
    customImg: "/icons/Loans.png",
    fallbackIcon: "bi-cash-coin", 
    link: "/loans", 
    badge: "Low ROI*", 
    tone: "custom-img-tile" 
  },
  { 
    title: "Insurance", 
    subtitle: "Asset & Business Cover", 
    customImg: "/icons/Insurance.png",
    fallbackIcon: "bi-shield-check", 
    link: "/insurance", 
    tone: "custom-img-tile" 
  },
  { 
    title: "EMI Calculator", 
    subtitle: "Plan Finances", 
    customImg: "/icons/EMI Calculator.png",
    fallbackIcon: "bi-calculator-fill", 
    link: "/subsidy-loan-emi-calculator", 
    tone: "custom-img-tile" 
  },
  { 
    title: "DPR Project", 
    subtitle: "Detailed Reports",
    customImg: "/icons/DPR.png", 
    fallbackIcon: "bi-file-earmark-richtext-fill", 
    link: "/dpr", 
    tone: "custom-img-tile" 
  },
  { 
    title: "CIBIL", 
    subtitle: "Credit Score & Report", 
    isCibilGauge: true, 
    link: "/cibil", 
    badge: "Free Check", 
    tone: "cibil-gauge" 
  },
];

const MORE_SERVICES = [
  { title: "FSSAI License", subtitle: "Food Business Permit", icon: "bi-patch-check-fill", link: "/services/fssai-license", tone: "startup-orange" },
  { title: "Udyam MSME", subtitle: "Govt MSME Certificate", icon: "bi-award-fill", link: "/services/udyam-registration", tone: "scheme-emerald" },
  { title: "Digital Signature", subtitle: "Class 3 DSC Token", icon: "bi-pen-fill", link: "/services/digital-signature", tone: "mca-indigo" },
  { title: "Legal Drafting", subtitle: "Agreements & Contracts", icon: "bi-file-earmark-ruled-fill", link: "/services/legal-drafting", tone: "tm-purple" },
  { title: "Import Export Code", subtitle: "IEC Registration", icon: "bi-ship", link: "/services/iec-registration", tone: "global-cyan" },
  { title: "ISO Certification", subtitle: "Standard Quality Check", icon: "bi-patch-plus-fill", link: "/services/iso-certification", tone: "reg-blue" },
];

const POPULAR_SERVICES = [
  { title: "GST Registration", icon: "bi-receipt", tone: "green", link: "/services/gst-registration" },
  { title: "Private Limited Company", icon: "bi-building", tone: "blue", link: "/services/private-limited-company" },
  { title: "Trademark Registration", icon: "bi-shield-check", tone: "cyan", link: "/services/trademark-registration" },
  { title: "FSSAI License", icon: "bi-patch-check", tone: "orange", link: "/services/fssai-license" },
  { title: "Income Tax E-Filing", icon: "bi-file-earmark-text", tone: "pink", link: "/services/income-tax-e-filing" },
  { title: "Udyam Registration", icon: "bi-award", tone: "purple", link: "/services/udyam-registration" },
  { title: "Digital Signature Certificate", icon: "bi-pen", tone: "indigo", link: "/services/digital-signature" },
];

const STATS = [
  { icon: "bi-shield-check", value: "100% Secure", text: "Your data is protected", tone: "green" },
  { icon: "bi-people", value: "50K+ Customers", text: "Trusted by businesses", tone: "blue" },
  { icon: "bi-headset", value: "24/7 Support", text: "We're here to help", tone: "purple" },
  { icon: "bi-patch-check", value: "99% Success Rate", text: "Service completion rate", tone: "gold" },
];

export default function Home() {
  const navigate = useNavigate();
  const [popularIndex, setPopularIndex] = useState(0);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [pendingSchemeRoute, setPendingSchemeRoute] = useState("/schemes");
  const popularRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const recordVisit = async () => {
      try {
        if (typeof trackVisit === "function") {
          await trackVisit("GoSubsidy Home", "/");
        }
      } catch (error) {
        console.warn("GoSubsidy Home visit tracking failed:", error);
      }
    };
    recordVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  const movePopular = (direction) => {
    setPopularIndex((current) =>
      Math.max(0, Math.min(POPULAR_SERVICES.length - 1, current + direction))
    );
  };

  useEffect(() => {
    const el = popularRef.current;
    if (!el) return;
    const first = el.querySelector(".gs-popular-card");
    if (!first) return;
    const amount = first.getBoundingClientRect().width + 14;
    el.scrollTo({ left: popularIndex * amount, behavior: "smooth" });
  }, [popularIndex]);

  // Handles scheme links from grid or hero slider
  const triggerSchemeNavigation = (targetPath = "/schemes") => {
    const isRegistered = localStorage.getItem("gosubsidy_schemes_advisory_registered") === "true";
    if (isRegistered) {
      navigate(targetPath);
    } else {
      setPendingSchemeRoute(targetPath);
      setShowSchemeModal(true);
    }
  };

  const handleServiceTileClick = (e, item) => {
    if (item.isSchemeTrigger) {
      e.preventDefault();
      triggerSchemeNavigation("/schemes");
    }
  };

  return (
    <main className="gs-dashboard">
      <PromoModal />
      
      {/* Paisabazaar Hero Slider with mapped category routing */}
      <PaisabazaarHeroSlider onSchemeClick={(path) => triggerSchemeNavigation(path)} />

      {/* =====================================================
          INSURANCEDEKHO-STYLE SHOWCASE SECTIONS
      ====================================================== */}
      <section className="idk-showcase-container" aria-label="Services Marketplace">
        
        {/* GROUP 1: BUSINESS & STARTUPS */}
        <div className="idk-group-card">
          <div className="idk-card-header">
            <div className="idk-header-text">
              <span className="idk-kicker">BUSINESS &amp; PROFESSIONAL</span>
              <h2 className="idk-title">Startups, Registrations &amp; Compliance</h2>
              <p className="idk-subtitle">Start, register, protect and manage your business from one place.</p>
            </div>
            <Link to="/services" className="idk-view-all-link">
              View All <i className="bi bi-arrow-right" />
            </Link>
          </div>

          <div className="idk-grid">
            {BUSINESS_SERVICES.map((item) => (
              <Link 
                key={item.title} 
                to={item.link} 
                className={`idk-tile-link idk-tone-${item.tone}`}
                onClick={(e) => handleServiceTileClick(e, item)}
              >
                <div className="idk-tile">
                  {item.badge && <span className="idk-badge">{item.badge}</span>}
                  
                  <div className="idk-icon-wrapper">
                    {item.customImg ? (
                      <img 
                        src={item.customImg} 
                        alt={item.title} 
                        className="idk-custom-icon-img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.parentElement.querySelector(".idk-fallback-icon");
                          if (fallback) fallback.style.display = "inline-block";
                        }}
                      />
                    ) : null}
                    
                    {item.customImg ? (
                      <i className={`bi ${item.fallbackIcon} idk-fallback-icon`} style={{ display: "none" }} />
                    ) : (
                      <i className={`bi ${item.icon}`} />
                    )}
                  </div>
                  
                  <strong className="idk-tile-title">{item.title}</strong>
                  <span className="idk-tile-sub">{item.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* GROUP 2: FINANCE & PROTECTION */}
        <div className="idk-group-card idk-group-finance">
          <div className="idk-card-header">
            <div className="idk-header-text">
              <span className="idk-kicker">FINANCE &amp; PROTECTION</span>
              <h2 className="idk-title">Finance, Loans &amp; Business Tools</h2>
              <p className="idk-subtitle">Plan funding, protect your business and prepare for the next step.</p>
            </div>
            <Link to="/services" className="idk-view-all-link">
              View All <i className="bi bi-arrow-right" />
            </Link>
          </div>

          <div className="idk-grid">
            {FINANCE_SERVICES.map((item) => (
              <Link key={item.title} to={item.link} className={`idk-tile-link idk-tone-${item.tone}`}>
                <div className="idk-tile">
                  {item.badge && <span className="idk-badge">{item.badge}</span>}
                  
                  <div className="idk-icon-wrapper">
                    {item.customImg ? (
                      <img 
                        src={item.customImg} 
                        alt={item.title} 
                        className="idk-custom-icon-img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.parentElement.querySelector(".idk-fallback-icon");
                          if (fallback) fallback.style.display = "inline-block";
                        }}
                      />
                    ) : null}

                    {item.customImg ? (
                      <i className={`bi ${item.fallbackIcon} idk-fallback-icon`} style={{ display: "none" }} />
                    ) : item.isCibilGauge ? (
                      <svg className="cibil-meter-svg" viewBox="0 0 100 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 12 55 A 40 40 0 0 1 23 23" stroke="#e04e28" strokeWidth="9" strokeLinecap="round" />
                        <path d="M 28 18 A 40 40 0 0 1 47 10" stroke="#f2891d" strokeWidth="9" />
                        <path d="M 53 10 A 40 40 0 0 1 72 18" stroke="#f7c81d" strokeWidth="9" />
                        <path d="M 77 23 A 40 40 0 0 1 85 36" stroke="#9bc55b" strokeWidth="9" />
                        <path d="M 87 43 A 40 40 0 0 1 88 55" stroke="#0e8b39" strokeWidth="9" strokeLinecap="round" />
                        <path d="M 37 55 A 13 13 0 0 1 63 55 Z" fill="#e2e8f0" />
                        <g className="cibil-needle-group">
                          <line x1="50" y1="53" x2="61" y2="20" stroke="#2c3e50" strokeWidth="3.5" strokeLinecap="round" />
                          <circle cx="50" cy="53" r="4.5" fill="#2c3e50" />
                        </g>
                      </svg>
                    ) : (
                      <i className={`bi ${item.icon}`} />
                    )}
                  </div>

                  <strong className="idk-tile-title">{item.title}</strong>
                  <span className="idk-tile-sub">{item.subtitle}</span>
                </div>
              </Link>
            ))}

            {/* View More Trigger Button */}
            <button
              type="button"
              className="idk-tile-btn idk-tone-more-slate"
              onClick={() => setShowMoreModal(true)}
            >
              <div className="idk-tile">
                <div className="idk-icon-wrapper">
                  <i className="bi bi-grid-fill" />
                </div>
                <strong className="idk-tile-title">View More</strong>
                <span className="idk-tile-sub">All Services</span>
              </div>
            </button>
          </div>
        </div>

      </section>

      {/* SCHEME REGISTRATION & EXPERT CONSULTATION POPUP */}
      <SchemeRegistrationModal
        isOpen={showSchemeModal}
        onClose={() => {
          setShowSchemeModal(false);
          navigate(pendingSchemeRoute);
        }}
        onSuccess={() => {
          setShowSchemeModal(false);
          navigate(pendingSchemeRoute);
        }}
      />

      {/* VIEW MORE MODAL */}
      {showMoreModal && (
        <div className="idk-modal-backdrop" onClick={() => setShowMoreModal(false)}>
          <div className="idk-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="idk-modal-header">
              <div>
                <h3>All Business &amp; Financial Solutions</h3>
                <p>Explore specialized services and tools tailored for your business</p>
              </div>
              <button
                type="button"
                className="idk-modal-close"
                onClick={() => setShowMoreModal(false)}
                aria-label="Close modal"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="idk-modal-grid">
              {MORE_SERVICES.map((item) => (
                <Link
                  key={item.title}
                  to={item.link}
                  className={`idk-tile-link idk-tone-${item.tone}`}
                  onClick={() => setShowMoreModal(false)}
                >
                  <div className="idk-tile">
                    <div className="idk-icon-wrapper">
                      <i className={`bi ${item.icon}`} />
                    </div>
                    <strong className="idk-tile-title">{item.title}</strong>
                    <span className="idk-tile-sub">{item.subtitle}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="idk-modal-footer">
              <Link
                to="/services"
                className="idk-modal-full-btn"
                onClick={() => setShowMoreModal(false)}
              >
                Go to Complete Directory <i className="bi bi-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* POPULAR SERVICES SCROLLER */}
      <section className="gs-popular-section" aria-label="Popular Services">
        <div className="gs-section-heading-row">
          <div className="gs-popular-title">
            <i className="bi bi-star-fill" /> Popular Services
          </div>
          <Link to="/services" className="gs-view-all">
            View All Services <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="gs-popular-slider-wrap">
          <button
            type="button"
            className="gs-popular-arrow gs-popular-prev"
            onClick={() => movePopular(-1)}
            disabled={popularIndex === 0}
            aria-label="Previous popular services"
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div className="gs-popular-track" ref={popularRef}>
            {POPULAR_SERVICES.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className={`gs-popular-card gs-tone-${service.tone}`}
              >
                <div className="gs-popular-icon">
                  <i className={`bi ${service.icon}`} />
                </div>
                <div className="gs-popular-body">
                  <strong>{service.title}</strong>
                  <span>
                    Explore <i className="bi bi-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="gs-popular-arrow gs-popular-next"
            onClick={() => movePopular(1)}
            disabled={popularIndex >= POPULAR_SERVICES.length - 1}
            aria-label="Next popular services"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </section>

      {/* TRUST STATS BAR */}
      <section className="gs-stats-bar" aria-label="GoSubsidy benefits">
        {STATS.map((stat, index) => (
          <React.Fragment key={stat.value}>
            <div className={`gs-stat gs-tone-${stat.tone}`}>
              <div className="gs-stat-icon">
                <i className={`bi ${stat.icon}`} />
              </div>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.text}</span>
              </div>
            </div>
            {index < STATS.length - 1 && <div className="gs-stat-divider" />}
          </React.Fragment>
        ))}
      </section>

      <Footer />
    </main>
  );
}