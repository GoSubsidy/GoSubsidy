import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trackVisit } from "../services/analytics";
import Footer from "../components/layout/Footer";
import "../styles/Home.css";

/* =========================================================
   GOSUBSIDY HOME DASHBOARD — 15 MAIN CATEGORIES
   Popular Services slider + stats bar + existing Footer.
   ========================================================= */

const CATEGORY_CARDS = [
  { title: "Schemes", description: "Explore 1000+ Government Schemes & Subsidies", count: "1000+ Schemes", icon: "bi-bank2", tone: "green", link: "/schemes" },
  { title: "Startups", description: "Company registration & legal structure services", count: "10 Services", icon: "bi-rocket-takeoff", tone: "blue", link: "/services/proprietorship" },
  { title: "Registration", description: "Business registrations & statutory licenses", count: "28 Services", icon: "bi-clipboard2-check", tone: "cyan", link: "/services/startup-india" },
  { title: "Trademark", description: "Trademark, Copyright & IP protection services", count: "17 Services", icon: "bi-shield-shaded", tone: "purple", link: "/services/trademark-registration" },
  { title: "GST", description: "Goods & Services Tax related services", count: "10 Services", icon: "bi-receipt-cutoff", tone: "orange", link: "/services/gst-registration" },
  { title: "Income Tax", description: "Income Tax filing & compliance services", count: "10 Services", icon: "bi-calculator", tone: "green", link: "/services/income-tax-e-filing" },
  { title: "MCA", description: "MCA compliance & corporate services", count: "22 Services", icon: "bi-building", tone: "blue", link: "/services/company-compliance" },
  { title: "Compliance", description: "Business compliance & return filing services", count: "13 Services", icon: "bi-clipboard-check", tone: "pink", link: "/services/fdi-filing" },
  { title: "Consultation", description: "Expert business & legal consultation", count: "2 Services", icon: "bi-person-vcard", tone: "gold", link: "/services/ca-consultation" },
  { title: "Global", description: "Global business setup & international services", count: "5 Services", icon: "bi-globe2", tone: "indigo", link: "/services/uae-company-registration" },
  { title: "Loans", description: "Business & Personal Loan Assistance", count: "12 Services", icon: "bi-cash-coin", tone: "green", link: "/loans" },
  { title: "Insurance", description: "Business & Personal Insurance Solutions", count: "10 Services", icon: "bi-shield-check", tone: "blue", link: "/insurance" },
  { title: "EMI Calculator", description: "Calculate loan EMI & plan your finances", count: "1 Tool", icon: "bi-calculator-fill", tone: "orange", link: "/subsidy-loan-emi-calculator" },
  { title: "Detailed Project Report", description: "Professional DPR for your business projects", count: "5 Services", icon: "bi-file-earmark-richtext", tone: "purple", link: "/dpr" },
  { title: "CIBIL", description: "Check CIBIL Score & Credit Report", count: "3 Services", icon: "bi-speedometer2", tone: "blue", link: "/cibil" },
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
  const [popularIndex, setPopularIndex] = useState(0);
  const popularRef = useRef(null);

  useEffect(() => {
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
  }, []);

  const movePopular = (direction) => {
    setPopularIndex((current) => {
      const next = current + direction;
      return Math.max(0, Math.min(POPULAR_SERVICES.length - 1, next));
    });
  };

  useEffect(() => {
    const el = popularRef.current;
    if (!el) return;
    const first = el.querySelector(".gs-popular-card");
    if (!first) return;
    const gap = 14;
    const amount = first.getBoundingClientRect().width + gap;
    el.scrollTo({ left: popularIndex * amount, behavior: "smooth" });
  }, [popularIndex]);

  return (
    <main className="gs-dashboard">
      <section className="gs-dashboard-hero">
        <div className="gs-dashboard-hero-row">
          <div>
            <h1>Welcome back, Bhanu Prasad! <span>👋</span></h1>
            <p>Manage your business services and explore government schemes</p>
          </div>

          <div className="gs-dashboard-search" role="search">
            <i className="bi bi-search" />
            <input aria-label="Search services" placeholder="Search services..." />
            <span>Ctrl K</span>
          </div>
        </div>
      </section>

      <section className="gs-category-grid" aria-label="GoSubsidy services">
        {CATEGORY_CARDS.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`gs-category-card gs-tone-${card.tone}`}
          >
            <div className="gs-category-top">
              <div className="gs-category-icon"><i className={`bi ${card.icon}`} /></div>
              <div className="gs-category-copy">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </div>
            <span className="gs-category-count">{card.count}</span>
            <span className="gs-category-action">Explore Services <i className="bi bi-arrow-right" /></span>
          </Link>
        ))}
      </section>

      <section className="gs-popular-section" aria-label="Popular Services">
        <div className="gs-section-heading-row">
          <div className="gs-popular-title"><i className="bi bi-star-fill" /> Popular Services</div>
          <Link to="/services" className="gs-view-all">View All Services <i className="bi bi-arrow-right" /></Link>
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
              <Link key={service.title} to={service.link} className={`gs-popular-card gs-tone-${service.tone}`}>
                <div className="gs-popular-icon"><i className={`bi ${service.icon}`} /></div>
                <div className="gs-popular-body">
                  <strong>{service.title}</strong>
                  <span>Explore <i className="bi bi-arrow-right" /></span>
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

      <section className="gs-stats-bar" aria-label="GoSubsidy benefits">
        {STATS.map((stat, index) => (
          <React.Fragment key={stat.value}>
            <div className={`gs-stat gs-tone-${stat.tone}`}>
              <div className="gs-stat-icon"><i className={`bi ${stat.icon}`} /></div>
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
