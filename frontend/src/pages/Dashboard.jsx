import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const serviceCategories = [
  {
    title: "Schemes",
    slug: "schemes",
    icon: "bi-bank",
    count: "1000+",
    description: "Explore 1000+ Government Schemes & Subsidies",
    accent: "green",
  },
  {
    title: "Startups",
    slug: "startup",
    icon: "bi-rocket-takeoff",
    count: "10",
    description: "Company registration & legal structure services",
    accent: "blue",
  },
  {
    title: "Registration",
    slug: "registrations",
    icon: "bi-clipboard2-check",
    count: "28",
    description: "Business registrations & statutory licenses",
    accent: "cyan",
  },
  {
    title: "Trademark",
    slug: "trademark",
    icon: "bi-shield-check",
    count: "17",
    description: "Trademark, Copyright & IP protection services",
    accent: "purple",
  },
  {
    title: "GST",
    slug: "gst",
    icon: "bi-receipt",
    count: "10",
    description: "Goods & Services Tax related services",
    accent: "orange",
  },
  {
    title: "Income Tax",
    slug: "income-tax",
    icon: "bi-calculator",
    count: "10",
    description: "Income Tax filing & compliance services",
    accent: "green",
  },
  {
    title: "MCA",
    slug: "mca",
    icon: "bi-buildings",
    count: "22",
    description: "MCA compliance & corporate services",
    accent: "blue",
  },
  {
    title: "Compliance",
    slug: "compliance",
    icon: "bi-clipboard2-pulse",
    count: "13",
    description: "Business compliance & return filing services",
    accent: "pink",
  },
  {
    title: "Consultation",
    slug: "consultation",
    icon: "bi-person-circle",
    count: "2",
    description: "Expert business & legal consultation",
    accent: "yellow",
  },
  {
    title: "Global",
    slug: "global",
    icon: "bi-globe2",
    count: "5",
    description: "Global business setup & international services",
    accent: "blue",
  },
  {
    title: "Loans",
    slug: "loans",
    icon: "bi-cash-coin",
    count: "12",
    description: "Business & Personal Loan Assistance",
    accent: "green",
  },
  {
    title: "Insurance",
    slug: "insurance",
    icon: "bi-shield-check",
    count: "10",
    description: "Business & Personal Insurance Solutions",
    accent: "blue",
  },
  {
    title: "EMI Calculator",
    slug: "emi-calculator",
    icon: "bi-calculator",
    count: "1",
    description: "Calculate loan EMI & plan your finances",
    accent: "orange",
  },
  {
    title: "Detailed Project Report",
    slug: "detailed-project-report",
    icon: "bi-file-earmark-bar-graph",
    count: "5",
    description: "Professional DPR for your business projects",
    accent: "purple",
  },
  {
    title: "CIBIL",
    slug: "cibil",
    icon: "bi-speedometer2",
    count: "5",
    description: "Check CIBIL Score & Credit Report",
    accent: "blue",
  },
];

const popularServices = [
  ["GST Registration", "gst", "bi-receipt", "green"],
  ["Private Limited Company", "startup", "bi-buildings", "blue"],
  ["Trademark Registration", "trademark", "bi-hand-thumbs-up", "cyan"],
  ["FSSAI License", "registrations", "bi-shop", "orange"],
  ["Income Tax E-Filing", "income-tax", "bi-file-earmark-text", "pink"],
  ["Udyam Registration", "registrations", "bi-award", "purple"],
  ["Digital Signature Certificate", "registrations", "bi-file-earmark-lock2", "purple"],
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [popularStart, setPopularStart] = useState(0);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return serviceCategories;
    return serviceCategories.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [search]);

  const visiblePopular = popularServices.slice(popularStart, popularStart + 7);

  const openCategory = (slug) => {
    navigate(`/services/${slug}`);
  };

  const movePopular = (direction) => {
    setPopularStart((current) => {
      if (direction === "next") {
        return current >= popularServices.length - 1 ? 0 : current + 1;
      }
      return current <= 0 ? popularServices.length - 1 : current - 1;
    });
  };

  return (
    <main className="gs-dashboard">
      <section className="gs-dashboard-inner">
        <div className="gs-dashboard-heading">
          <div>
            <h1>Welcome back, Bhanu Prasad! <span aria-hidden="true">👋</span></h1>
            <p>Manage your business services and explore government schemes</p>
          </div>

          <div className="gs-dashboard-search">
            <i className="bi bi-search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
            />
            <kbd>Ctrl + K</kbd>
          </div>
        </div>

        <div className="gs-category-grid">
          {filteredCategories.map((category) => (
            <button
              type="button"
              key={category.slug}
              className={`gs-category-card accent-${category.accent}`}
              onClick={() => openCategory(category.slug)}
            >
              <div className="gs-category-top">
                <span className="gs-category-icon">
                  <i className={`bi ${category.icon}`} />
                </span>

                <div className="gs-category-copy">
                  <h2>{category.title}</h2>
                  <p>{category.description}</p>
                  <span className="gs-service-count">
                    {category.count}{category.count === "1" ? " Service" : " Services"}
                  </span>
                </div>
              </div>

              <span className="gs-explore">
                Explore Services
                <i className="bi bi-arrow-right" />
              </span>
            </button>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="gs-empty">
            <i className="bi bi-search" />
            <h3>No service category found</h3>
            <p>Try searching for GST, MCA, Loans, Insurance, or another service.</p>
          </div>
        )}

        <section className="gs-popular-section">
          <div className="gs-section-title-row">
            <h2><i className="bi bi-star-fill" /> Popular Services</h2>
            <button type="button" onClick={() => navigate("/services")}>
              View All Services <i className="bi bi-arrow-right" />
            </button>
          </div>

          <div className="gs-popular-slider">
            <button
              type="button"
              className="gs-slider-arrow left"
              onClick={() => movePopular("prev")}
              aria-label="Previous popular services"
            >
              <i className="bi bi-chevron-left" />
            </button>

            <div className="gs-popular-track">
              {visiblePopular.map(([name, slug, icon, accent]) => (
                <button
                  type="button"
                  className="gs-popular-card"
                  key={`${name}-${slug}`}
                  onClick={() => openCategory(slug)}
                >
                  <span className={`gs-popular-icon accent-${accent}`}>
                    <i className={`bi ${icon}`} />
                  </span>
                  <span className="gs-popular-name">{name}</span>
                  <span className="gs-popular-link">
                    Explore <i className="bi bi-arrow-right" />
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="gs-slider-arrow right"
              onClick={() => movePopular("next")}
              aria-label="Next popular services"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </section>

        <section className="gs-trust-bar">
          <div>
            <span className="gs-trust-icon green"><i className="bi bi-shield-check" /></span>
            <span><strong>100% Secure</strong><small>Your data is protected</small></span>
          </div>
          <span className="gs-trust-divider" />
          <div>
            <span className="gs-trust-icon blue"><i className="bi bi-people" /></span>
            <span><strong>50K+ Customers</strong><small>Trusted by businesses</small></span>
          </div>
          <span className="gs-trust-divider" />
          <div>
            <span className="gs-trust-icon purple"><i className="bi bi-headset" /></span>
            <span><strong>24/7 Support</strong><small>We're here to help</small></span>
          </div>
          <span className="gs-trust-divider" />
          <div>
            <span className="gs-trust-icon yellow"><i className="bi bi-patch-check" /></span>
            <span><strong>99% Success Rate</strong><small>Service completion rate</small></span>
          </div>
        </section>
      </section>
    </main>
  );
}
