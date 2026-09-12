import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSubsidies } from "../api";
import { trackSearch } from "../services/analytics";
import Footer from "../components/layout/Footer";
import SchemeRegistrationModal from "../components/schemes/SchemeRegistrationModal";
import "./Schemes.css";

/* =========================================================
   1. ONE-BY-ONE CAROUSEL SLIDER (EMBEDDED)
   ========================================================= */

const DEFAULT_FALLBACK_IMAGE = "/images/go-subsidy.png";

const LOCAL_SCHEME_IMAGES = {
  telangana: "/images/tg-msme.png",
  "t-idea": "/images/tg-msme.png",
  "t-pride": "/images/tg-msme.png",
  "tg-ipass": "/images/tg-msme.png",
  "ts-ipass": "/images/tg-msme.png",
  "agriculture infrastructure fund": "/images/Agriculture Infrastructure.png",
  agriculture: "/images/pm-krishi-sinchai.png",
  aif: "/images/go-subsidy.png",
  kisan: "/images/go-subsidy.png",
  "pm-kisan": "/images/pm-krishi-sinchai.png",
  "pm kisan": "/images/pm-krishi-sinchai.png",
  krishi: "/images/pm-krishi-sinchai.png",
  sinchai: "/images/pm-krishi-sinchai.png",
  farmer: "/images/pm-krishi-sinchai.png",
  irrigation: "/images/pm-krishi-sinchai.png",
  surya: "/images/pm-surya-ghar.png",
  solar: "/images/pm-surya-ghar.png",
  renewable: "/images/pm-surya-ghar.png",
  "muft bijli": "/images/pm-surya-ghar.png",
  electricity: "/images/pm-surya-ghar.png",
  vishwakarma: "/images/pm-vishwakarma.png",
  msme: "/images/pm-vishwakarma.png",
  artisan: "/images/pm-vishwakarma.png",
  mudra: "/images/mudra.png",
  business: "/images/pm-vishwakarma.png",
  manufacturing: "/images/pm-vishwakarma.png",
  beti: "/images/beti-bachao.png",
  women: "/images/beti-bachao.png",
  education: "/images/beti-bachao.png",
};

function valueToText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(valueToText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    for (const key of ["title", "name", "label", "amount", "value", "description", "benefit", "support", "text"]) {
      if (value[key]) return valueToText(value[key]);
    }
  }
  return String(value || "");
}

function stripHtml(value) {
  return valueToText(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160) + (valueToText(value).length > 160 ? "..." : "");
}

const firstValue = (scheme, keys, fallback = "") => {
  if (!scheme) return fallback;
  for (const key of keys) {
    if (scheme[key] !== undefined && scheme[key] !== null && scheme[key] !== "") {
      const result = valueToText(scheme[key]);
      if (result) return result;
    }
  }
  return fallback;
};

const getSchemeId = (scheme) =>
  scheme?.id ?? scheme?._id ?? scheme?.scheme_id ?? scheme?.schemeId ?? null;

const getSchemeName = (scheme) =>
  firstValue(scheme, ["name", "title", "scheme_name", "schemeName"], "Government Scheme");

const getSchemeCategory = (scheme) =>
  firstValue(scheme, ["category", "category_name", "categoryName", "sector"], "Government Support");

const getSchemeDescription = (scheme) =>
  firstValue(scheme, ["short_description", "shortDescription", "description", "summary"], "Explore government financial assistance and incentives.");

const getSchemeBenefit = (scheme) =>
  firstValue(scheme, ["benefit", "benefits", "subsidy", "support", "financial_assistance", "benefit_amount"], "Government Subsidy / Grant");

const getSchemeMinistry = (scheme) =>
  firstValue(scheme, ["ministry", "ministry_name", "department", "department_name"], "Government of India");

const resolveLocalImage = (scheme) => {
  const combined = `${getSchemeName(scheme)} ${getSchemeCategory(scheme)} ${getSchemeMinistry(scheme)} ${getSchemeDescription(scheme)}`.toLowerCase();

  for (const [keyword, imgPath] of Object.entries(LOCAL_SCHEME_IMAGES)) {
    if (combined.includes(keyword)) {
      return imgPath;
    }
  }
  return DEFAULT_FALLBACK_IMAGE;
};

const normalizeResponse = (response) => {
  if (Array.isArray(response)) return response;
  const candidates = [
    response?.schemes,
    response?.data,
    response?.results,
    response?.data?.schemes,
    response?.data?.results,
  ];
  return candidates.find(Array.isArray) || [];
};

function NewlyLaunchedCarousel({ schemesList }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const topItems = useMemo(() => {
    return (schemesList || []).slice(0, 6);
  }, [schemesList]);

  useEffect(() => {
    if (topItems.length <= 1 || paused) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % topItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [topItems.length, paused]);

  const handlePrevious = () => {
    if (topItems.length <= 1) return;
    setActiveIndex((current) => (current === 0 ? topItems.length - 1 : current - 1));
  };

  const handleNext = () => {
    if (topItems.length <= 1) return;
    setActiveIndex((current) => (current + 1) % topItems.length);
  };

  if (!topItems.length) return null;

  const loopItems = topItems.length > 3 ? [...topItems, ...topItems.slice(0, 3)] : topItems;

  return (
    <section className="gs-carousel-root">
      <style>{`
        .gs-carousel-root {
          width: 100% !important;
          padding: 34px 0 38px !important;
          background: #f8fbfe !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-wrapper {
          width: min(1340px, calc(100% - 40px)) !important;
          margin: 0 auto !important;
          position: relative !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-header {
          text-align: center !important;
          margin-bottom: 22px !important;
        }

        .gs-carousel-kicker {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 5px 14px !important;
          border-radius: 999px !important;
          background: #edf5ff !important;
          color: #0668e8 !important;
          font-size: 11px !important;
          font-weight: 850 !important;
          letter-spacing: 0.8px !important;
          text-transform: uppercase !important;
        }

        .gs-carousel-header h2 {
          margin: 8px 0 4px !important;
          font-size: clamp(24px, 2.6vw, 34px) !important;
          font-weight: 850 !important;
          color: #14233b !important;
          letter-spacing: -0.5px !important;
        }

        .gs-carousel-header p {
          margin: 0 auto !important;
          max-width: 680px !important;
          color: #61748c !important;
          font-size: 14px !important;
        }

        .gs-carousel-stage {
          position: relative !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-viewport {
          width: 100% !important;
          overflow: hidden !important;
          padding: 10px 4px 18px !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-track {
          display: flex !important;
          gap: 20px !important;
          transition: transform 0.55s cubic-bezier(0.2, 1, 0.3, 1) !important;
          transform: translateX(calc(-1 * ${activeIndex} * ( (100% - 40px) / 3 + 20px ))) !important;
          box-sizing: border-box !important;
          will-change: transform;
        }

        .gs-carousel-card {
          flex: 0 0 calc((100% - 40px) / 3) !important;
          min-width: calc((100% - 40px) / 3) !important;
          max-width: calc((100% - 40px) / 3) !important;
          background: #ffffff !important;
          border: 1px solid #e2ecf8 !important;
          border-radius: 18px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 6px 18px rgba(20, 35, 59, 0.05) !important;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-card:hover {
          transform: translateY(-5px) !important;
          border-color: #cbdff7 !important;
          box-shadow: 0 14px 32px rgba(20, 35, 59, 0.1) !important;
        }

        .gs-carousel-img-wrap {
          position: relative !important;
          width: 100% !important;
          height: 180px !important;
          min-height: 180px !important;
          max-height: 180px !important;
          overflow: hidden !important;
          background: #f1f5f9 !important;
          border-bottom: 1px solid #edf2f7 !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-img {
          width: 100% !important;
          height: 100% !important;
          max-height: 180px !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
          transition: transform 0.35s ease !important;
        }

        .gs-carousel-card:hover .gs-carousel-img {
          transform: scale(1.05) !important;
        }

        .gs-carousel-badge {
          position: absolute !important;
          top: 12px !important;
          left: 12px !important;
          z-index: 2 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 4px 9px !important;
          border-radius: 999px !important;
          background: #e11d48 !important;
          color: #ffffff !important;
          font-size: 9.5px !important;
          font-weight: 850 !important;
          letter-spacing: 0.5px !important;
          box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3) !important;
        }

        .gs-carousel-body {
          padding: 18px 16px !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          box-sizing: border-box !important;
        }

        .gs-carousel-category {
          display: inline-block !important;
          align-self: flex-start !important;
          padding: 3px 8px !important;
          border-radius: 6px !important;
          background: #edf5ff !important;
          color: #0668e8 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          margin-bottom: 8px !important;
        }

        .gs-carousel-body h3 {
          margin: 0 0 6px !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          color: #14233b !important;
          line-height: 1.3 !important;
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: 2 !important;
          overflow: hidden !important;
          min-height: 42px !important;
        }

        .gs-carousel-description {
          margin: 0 0 14px !important;
          color: #61748c !important;
          font-size: 12.5px !important;
          line-height: 1.55 !important;
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: 3 !important;
          overflow: hidden !important;
          min-height: 58px !important;
        }

        .gs-carousel-meta {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          padding: 8px 10px !important;
          background: #f8fbfe !important;
          border: 1px solid #e6edf5 !important;
          border-radius: 10px !important;
          margin-bottom: 14px !important;
        }

        .gs-carousel-meta span {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          font-size: 11.5px !important;
          color: #1e293b !important;
          font-weight: 650 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .gs-carousel-meta i {
          color: #0668e8 !important;
          font-size: 13px !important;
          flex-shrink: 0 !important;
        }

        .gs-carousel-cta {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          margin-top: auto !important;
          color: #0668e8 !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          text-decoration: none !important;
        }

        .gs-carousel-cta:hover {
          color: #0058c9 !important;
        }

        .gs-carousel-arrow {
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          z-index: 10 !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          border: 1px solid #dce6f2 !important;
          background: #ffffff !important;
          color: #1e293b !important;
          font-size: 16px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08) !important;
          transition: all 0.2s ease !important;
        }

        .gs-carousel-arrow:hover {
          background: #0668e8 !important;
          color: #ffffff !important;
          border-color: #0668e8 !important;
        }

        .gs-arrow-left { left: -20px !important; }
        .gs-arrow-right { right: -20px !important; }

        .gs-carousel-dots {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          margin-top: 16px !important;
        }

        .gs-carousel-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          border: none !important;
          background: #cbd6e3 !important;
          cursor: pointer !important;
          padding: 0 !important;
          transition: all 0.25s ease !important;
        }

        .gs-carousel-dot.is-active {
          width: 24px !important;
          border-radius: 999px !important;
          background: #0668e8 !important;
        }

        @media (max-width: 1100px) {
          .gs-carousel-track {
            transform: translateX(calc(-1 * ${activeIndex} * ( (100% - 20px) / 2 + 20px ))) !important;
          }
          .gs-carousel-card {
            flex: 0 0 calc((100% - 20px) / 2) !important;
            min-width: calc((100% - 20px) / 2) !important;
            max-width: calc((100% - 20px) / 2) !important;
          }
        }

        @media (max-width: 680px) {
          .gs-carousel-track {
            transform: translateX(calc(-1 * ${activeIndex} * ( 100% + 14px ))) !important;
            gap: 14px !important;
          }
          .gs-carousel-card {
            flex: 0 0 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
          }
          .gs-arrow-left { left: 4px !important; }
          .gs-arrow-right { right: 4px !important; }
        }
      `}</style>

      <div className="gs-carousel-wrapper">
        <div className="gs-carousel-header">
          <span className="gs-carousel-kicker">
            <i className="bi bi-stars" /> NEWLY LAUNCHED
          </span>
          <h2>Latest Government Schemes</h2>
          <p>Discover newly added government schemes, subsidies, and financial support opportunities.</p>
        </div>

        <div
          className="gs-carousel-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            className="gs-carousel-arrow gs-arrow-left"
            onClick={handlePrevious}
            aria-label="Previous scheme"
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div className="gs-carousel-viewport">
            <div className="gs-carousel-track">
              {loopItems.map((item, index) => {
                const id = getSchemeId(item);
                const name = getSchemeName(item);
                const category = getSchemeCategory(item);
                const benefit = getSchemeBenefit(item);
                const ministry = getSchemeMinistry(item);
                const description = getSchemeDescription(item);
                const image = resolveLocalImage(item);
                const detailPath = id ? `/schemes/${encodeURIComponent(String(id))}` : "/schemes";

                return (
                  <article className="gs-carousel-card" key={`${id ?? name}-${index}`}>
                    <div className="gs-carousel-img-wrap">
                      <img
                        src={image}
                        alt={name}
                        className="gs-carousel-img"
                        loading={index < 4 ? "eager" : "lazy"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                        }}
                      />
                      <span className="gs-carousel-badge">
                        <i className="bi bi-stars" /> NEW
                      </span>
                    </div>

                    <div className="gs-carousel-body">
                      <span className="gs-carousel-category">{category}</span>
                      <h3 title={name}>{name}</h3>
                      <p className="gs-carousel-description">{description}</p>

                      <div className="gs-carousel-meta">
                        <span title={benefit}>
                          <i className="bi bi-cash-coin" />
                          {benefit}
                        </span>
                        <span title={ministry}>
                          <i className="bi bi-building" />
                          {ministry}
                        </span>
                      </div>

                      <Link to={detailPath} className="gs-carousel-cta">
                        Explore Scheme <i className="bi bi-arrow-right" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="gs-carousel-arrow gs-arrow-right"
            onClick={handleNext}
            aria-label="Next scheme"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>

        {topItems.length > 1 && (
          <div className="gs-carousel-dots" aria-label="Scheme carousel controls">
            {topItems.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`gs-carousel-dot ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show scheme ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   2. MAIN SCHEMES DIRECTORY
   ========================================================= */

const STATES = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const SECTOR_TILES = [
  { 
    id: "msme", 
    title: "MSME & Business", 
    tag: "Priority", 
    icon: "bi-building-fill", 
    tone: "blue", 
    keywords: ["msme", "business", "enterprise", "industry", "manufacturing", "trade", "mudra"] 
  },
  { 
    id: "agri", 
    title: "Agriculture & Farming", 
    tag: "Direct Subsidy", 
    icon: "bi-flower1", 
    tone: "green", 
    keywords: ["agri", "farm", "kisan", "irrigation", "sinchai", "horticulture"] 
  },
  { 
    id: "solar", 
    title: "Solar & Renewable", 
    tag: "Up to ₹78,000", 
    icon: "bi-sun-fill", 
    tone: "gold", 
    keywords: ["solar", "renewable", "energy", "surya", "electricity", "power"] 
  },
  { 
    id: "startups", 
    title: "Startups & Innovation", 
    tag: "DPIIT Seed", 
    icon: "bi-rocket-takeoff-fill", 
    tone: "purple", 
    keywords: ["startup", "innovation", "seed", "dpiit", "incubator", "venture"] 
  },
  { 
    id: "food", 
    title: "Food Processing", 
    tag: "PMFME 35%", 
    icon: "bi-egg-fried", 
    tone: "orange", 
    keywords: ["food", "pmfme", "processing", "dairy", "meat", "cold chain", "agro"] 
  },
  { 
    id: "women", 
    title: "Women Entrepreneurs", 
    tag: "Special Grant", 
    icon: "bi-gender-female", 
    tone: "pink", 
    keywords: ["women", "mahila", "female", "beti", "stree", "self help group", "shg"] 
  },
  { 
    id: "credit", 
    title: "Credit Guarantee", 
    tag: "CGTMSE", 
    icon: "bi-shield-check", 
    tone: "cyan", 
    keywords: ["credit", "cgtmse", "guarantee", "loan", "collateral"] 
  },
  { 
    id: "export", 
    title: "Export Promotion", 
    tag: "Duty Credit", 
    icon: "bi-globe2", 
    tone: "indigo", 
    keywords: ["export", "import", "trade", "foreign", "duty", "dgft"] 
  }
];

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [schemeLevel, setSchemeLevel] = useState("all");
  const [selectedState, setSelectedState] = useState("All States");
  const [category, setCategory] = useState("All Categories");
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [showRegModal, setShowRegModal] = useState(false);

  useEffect(() => {
    loadSchemes();

    // Check if the user is registered for the annual consultation & alerts
    const isRegistered = localStorage.getItem("gosubsidy_schemes_advisory_registered") === "true";
    if (!isRegistered) {
      setShowRegModal(true);
    }
  }, []);

  async function loadSchemes() {
    try {
      setLoading(true);
      setError("");
      const result = await fetchSubsidies();
      const data = normalizeResponse(result);
      setSchemes(data);
    } catch (err) {
      console.error("Failed to load schemes:", err);
      setError("Unable to load government schemes. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  }

  function getSchemeState(scheme) {
    const value =
      scheme?.state ??
      scheme?.state_name ??
      scheme?.applicable_state ??
      scheme?.applicable_states ??
      scheme?.state_applicability ??
      "";

    if (Array.isArray(value)) return value.map(valueToText).filter(Boolean).join(", ");
    if (value && typeof value === "object") {
      return valueToText(value.name ?? value.state ?? value.description ?? "");
    }
    return String(value || "");
  }

  function getSchemeLevel(scheme) {
    const raw = [
      scheme?.scheme_level,
      scheme?.government_level,
      scheme?.level,
      scheme?.scheme_type,
      scheme?.government,
      scheme?.type
    ].filter(Boolean).join(" ").toLowerCase();

    if (
      raw.includes("central") ||
      raw.includes("union government") ||
      raw.includes("government of india")
    ) return "central";

    if (raw.includes("state") || raw.includes("state government")) return "state";

    const state = getSchemeState(scheme).toLowerCase();
    if (state && state !== "all india" && !state.includes("india")) return "state";

    return "central";
  }

  const categories = useMemo(() => {
    const values = schemes
      .map((s) => valueToText(s?.category || s?.sector))
      .filter(Boolean);

    return [
      "All Categories",
      ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
    ];
  }, [schemes]);

  const filteredSchemes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return schemes.filter((scheme) => {
      const searchable = [
        scheme?.scheme_name,
        scheme?.short_name,
        scheme?.description,
        scheme?.category,
        scheme?.ministry,
        scheme?.department,
        scheme?.beneficiary,
        scheme?.sector,
        scheme?.state,
        scheme?.state_name,
        scheme?.state_applicability
      ].map(valueToText).join(" ").toLowerCase();

      const matchesSearch = !q || searchable.includes(q);
      const matchesLevel =
        schemeLevel === "all" || getSchemeLevel(scheme) === schemeLevel;

      const stateText = getSchemeState(scheme).toLowerCase();
      const matchesState =
        selectedState === "All States" ||
        stateText.includes(selectedState.toLowerCase()) ||
        stateText.includes("all india");

      const schemeCategoryStr = valueToText(scheme?.category || scheme?.sector).toLowerCase();
      const matchesCategory =
        category === "All Categories" ||
        schemeCategoryStr.includes(category.toLowerCase());

      // Broad match for Focus Sector Card
      let matchesSector = true;
      if (selectedSectorId) {
        const sectorDef = SECTOR_TILES.find((t) => t.id === selectedSectorId);
        if (sectorDef) {
          matchesSector = sectorDef.keywords.some((kw) => searchable.includes(kw));
        }
      }

      return matchesSearch && matchesLevel && matchesState && matchesCategory && matchesSector;
    });
  }, [schemes, search, schemeLevel, selectedState, category, selectedSectorId]);

  const handleSectorTileClick = (tile) => {
    if (selectedSectorId === tile.id) {
      setSelectedSectorId(null);
    } else {
      setSelectedSectorId(tile.id);
      setCategory("All Categories"); // Clear specific text dropdown so sector keywords take priority

      // Smooth scroll to scheme directory view
      const target = document.getElementById("scheme-directory");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  async function handleSearchSubmit(event) {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    void trackSearch(query, filteredSchemes.length, "/schemes");
  }

  function resetFilters() {
    setSearch("");
    setSchemeLevel("all");
    setSelectedState("All States");
    setCategory("All Categories");
    setSelectedSectorId(null);
  }

  return (
    <main className="gs-schemes-page">
      {/* 1-Year Advisory & Scheme Alerts Registration Popup */}
      <SchemeRegistrationModal
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        onSuccess={() => setShowRegModal(false)}
      />

      {/* 1. EMBEDDED TOP ONE-BY-ONE CAROUSEL */}
      <NewlyLaunchedCarousel schemesList={schemes} />

      {/* 2. SECTOR TILES MATRIX */}
      <section className="gs-schemes-sectors-section">
        <div className="gs-schemes-container">
          <div className="gs-sectors-heading-row">
            <div>
              <span className="gs-sectors-kicker">SCHEME CATEGORIES</span>
              <h2>Government Support by Focus Sector</h2>
            </div>
            {(selectedSectorId !== null || category !== "All Categories") && (
              <button
                type="button"
                className="gs-filter-reset-link"
                onClick={() => {
                  setSelectedSectorId(null);
                  setCategory("All Categories");
                }}
              >
                View All Categories <i className="bi bi-x-circle-fill" />
              </button>
            )}
          </div>

          <div className="gs-sectors-grid">
            {SECTOR_TILES.map((tile) => {
              const isSelected = selectedSectorId === tile.id;

              return (
                <button
                  type="button"
                  key={tile.id}
                  className={`gs-sector-tile gs-tone-${tile.tone} ${isSelected ? "active" : ""}`}
                  onClick={() => handleSectorTileClick(tile)}
                >
                  {tile.tag && <span className="gs-sector-tag">{tile.tag}</span>}
                  <div className="gs-sector-icon">
                    <i className={`bi ${tile.icon}`} />
                  </div>
                  <strong className="gs-sector-title">{tile.title}</strong>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTER ENGINE */}
      <section className="gs-schemes-filter-section" id="scheme-directory">
        <div className="gs-schemes-container">
          <div className="gs-filter-box">
            <div className="gs-level-toggles">
              <button
                type="button"
                className={`gs-level-btn ${schemeLevel === "all" ? "active" : ""}`}
                onClick={() => {
                  setSchemeLevel("all");
                  setSelectedState("All States");
                }}
              >
                <i className="bi bi-grid-fill" /> All Schemes ({schemes.length})
              </button>
              <button
                type="button"
                className={`gs-level-btn ${schemeLevel === "central" ? "active" : ""}`}
                onClick={() => {
                  setSchemeLevel("central");
                  setSelectedState("All States");
                }}
              >
                <i className="bi bi-building-fill" /> Central Government
              </button>
              <button
                type="button"
                className={`gs-level-btn ${schemeLevel === "state" ? "active" : ""}`}
                onClick={() => setSchemeLevel("state")}
              >
                <i className="bi bi-geo-alt-fill" /> State Subsidies
              </button>
            </div>

            <form className="gs-filter-controls-row" onSubmit={handleSearchSubmit}>
              <div className="gs-search-input-group">
                <i className="bi bi-search" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search scheme name, ministry, grant, keyword..."
                />
                {search && (
                  <button type="button" className="gs-clear-btn" onClick={() => setSearch("")}>
                    <i className="bi bi-x" />
                  </button>
                )}
              </div>

              <div className="gs-select-group">
                <i className="bi bi-geo-alt" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    if (e.target.value !== "All States") setSchemeLevel("state");
                  }}
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="gs-select-group">
                <i className="bi bi-tag" />
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSelectedSectorId(null);
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button type="button" className="gs-reset-btn" onClick={resetFilters} title="Reset All Filters">
                <i className="bi bi-arrow-counterclockwise" /> Reset
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. SCHEME RESULTS DIRECTORY */}
      <section className="gs-schemes-results-section">
        <div className="gs-schemes-container">
          <div className="gs-results-header">
            <div>
              <span className="gs-results-count-pill">{filteredSchemes.length} Active Schemes</span>
              <h2>
                {selectedSectorId 
                  ? `${SECTOR_TILES.find(t => t.id === selectedSectorId)?.title} Schemes`
                  : schemeLevel === "central" 
                    ? "Central Government Subsidies & Grants" 
                    : schemeLevel === "state" 
                      ? (selectedState !== "All States" ? `${selectedState} State Schemes` : "State Government Schemes") 
                      : "All Verified Government Schemes"}
              </h2>
            </div>
            <div className="gs-results-trust">
              <i className="bi bi-shield-check" /> Verified Ministry Guidelines
            </div>
          </div>

          {error && (
            <div className="gs-error-card">
              <i className="bi bi-exclamation-triangle-fill" />
              <span>{error}</span>
              <button type="button" onClick={loadSchemes}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="gs-loading-state">
              <div className="gs-fintech-spinner" />
              <p>Fetching latest verified subsidy &amp; grant records...</p>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="gs-empty-state">
              <div className="gs-empty-icon">
                <i className="bi bi-search" />
              </div>
              <h3>No matching government schemes found</h3>
              <p>Try modifying your keyword, selecting a different state, or clearing the category filter.</p>
              <button type="button" className="gs-empty-reset-btn" onClick={resetFilters}>
                View All Schemes
              </button>
            </div>
          ) : (
            <div className="gs-schemes-card-grid">
              {filteredSchemes.map((scheme, index) => {
                const level = getSchemeLevel(scheme);
                const stateName = getSchemeState(scheme);
                const schemeId = getSchemeId(scheme);
                const name = valueToText(scheme.scheme_name) || "Government Scheme";
                const ministry = valueToText(scheme.ministry) || valueToText(scheme.department) || "Government of India";
                const benefit = getBenefitText(scheme);
                const desc = stripHtml(scheme.description);
                const detailLink = schemeId ? `/schemes/${encodeURIComponent(schemeId)}` : "/schemes";

                return (
                  <article className="gs-fintech-scheme-card" key={schemeId || `scheme-${index}`}>
                    <div className="gs-card-top-row">
                      <span className={`gs-level-chip ${level}`}>
                        <i className={`bi ${level === "central" ? "bi-building" : "bi-geo-alt-fill"}`} />
                        {level === "central" ? "Central Government" : stateName || "State Government"}
                      </span>
                      <span className="gs-verified-chip">
                        <i className="bi bi-patch-check-fill" /> Active
                      </span>
                    </div>

                    <div className="gs-card-main-content">
                      <div className="gs-card-icon-title-wrap">
                        <div className="gs-scheme-avatar">
                          <i className={`bi ${getSchemeIcon(scheme)}`} />
                        </div>
                        <div>
                          <span className="gs-scheme-ministry">{ministry}</span>
                          <h3 title={name}>{name}</h3>
                        </div>
                      </div>

                      <p className="gs-scheme-desc-text">{desc}</p>

                      <div className="gs-scheme-benefit-box">
                        <small>GRANT / BENEFIT SUPPORT</small>
                        <strong>{benefit}</strong>
                      </div>
                    </div>

                    <div className="gs-card-bottom-actions">
                      <Link to={detailLink} className="gs-details-link-btn">
                        View Eligibility &amp; Apply <i className="bi bi-arrow-up-right" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />
    </main>
  );
}

function getSchemeIcon(scheme) {
  const text = [scheme?.category, scheme?.sector, scheme?.scheme_name, scheme?.short_name].map(valueToText).join(" ").toLowerCase();
  if (text.includes("agri") || text.includes("farm") || text.includes("kisan")) return "bi-flower1";
  if (text.includes("education") || text.includes("student") || text.includes("vidya")) return "bi-mortarboard-fill";
  if (text.includes("startup")) return "bi-rocket-takeoff-fill";
  if (text.includes("solar") || text.includes("energy") || text.includes("renewable")) return "bi-sun-fill";
  if (text.includes("food") || text.includes("fssai") || text.includes("pmfme")) return "bi-egg-fried";
  if (text.includes("women") || text.includes("mahila") || text.includes("beti")) return "bi-gender-female";
  return "bi-bank2";
}

function getBenefitText(scheme) {
  if (scheme?.benefit_amount) return valueToText(scheme.benefit_amount);
  if (scheme?.benefit) return valueToText(scheme.benefit);
  if (Array.isArray(scheme?.benefits) && scheme.benefits.length) {
    return scheme.benefits.map(valueToText).filter(Boolean).join(", ");
  }
  for (const field of ["support", "support_amount", "financial_support", "incentive", "assistance", "subsidy"]) {
    if (scheme?.[field]) return valueToText(scheme[field]);
  }
  return "Direct Financial Support as per Guidelines";
}