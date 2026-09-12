import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSchemes } from "../../services/api";

const DEFAULT_FALLBACK_IMAGE = "/images/pm-vishwakarma.png";

const LOCAL_SCHEME_IMAGES = {
  telangana: "/images/pm-vishwakarma.png",
  "t-idea": "/images/pm-vishwakarma.png",
  "t-pride": "/images/pm-vishwakarma.png",
  "tg-ipass": "/images/pm-vishwakarma.png",
  "ts-ipass": "/images/pm-vishwakarma.png",
  "agriculture infrastructure fund": "/images/pm-krishi-sinchai.png",
  agriculture: "/images/pm-krishi-sinchai.png",
  aif: "/images/pm-krishi-sinchai.png",
  kisan: "/images/pm-krishi-sinchai.png",
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

const cleanText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => cleanText(v, "")).filter(Boolean).join(", ") || fallback;
  if (typeof value === "object") {
    for (const key of ["name", "title", "label", "value", "text", "description"]) {
      if (value[key]) return cleanText(value[key], "");
    }
  }
  return fallback;
};

const firstValue = (scheme, keys, fallback = "") => {
  if (!scheme) return fallback;
  for (const key of keys) {
    if (scheme[key] !== undefined && scheme[key] !== null && scheme[key] !== "") {
      const result = cleanText(scheme[key], "");
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
  firstValue(scheme, ["benefit", "benefits", "subsidy", "support", "financial_assistance"], "Government Subsidy / Grant");

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

export default function NewlyLaunchedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadSchemes = async () => {
      try {
        setLoading(true);
        const response = await fetchSchemes();
        const records = normalizeResponse(response);
        if (mounted) {
          setSchemes(records.slice(0, 6));
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Failed to load newly launched schemes:", error);
        if (mounted) setSchemes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadSchemes();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (schemes.length <= 1 || paused) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % schemes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [schemes.length, paused]);

  const handlePrevious = () => {
    if (schemes.length <= 1) return;
    setActiveIndex((current) => (current === 0 ? schemes.length - 1 : current - 1));
  };

  const handleNext = () => {
    if (schemes.length <= 1) return;
    setActiveIndex((current) => (current + 1) % schemes.length);
  };

  if (loading) {
    return (
      <section className="gs-carousel-root">
        <div className="gs-carousel-wrapper">
          <div className="gs-carousel-header">
            <span className="gs-carousel-kicker"><i className="bi bi-stars" /> NEWLY LAUNCHED</span>
            <h2>Latest Government Schemes</h2>
            <p>Discover newly added government schemes, subsidies, and financial support opportunities.</p>
          </div>
          <div className="gs-carousel-spinner-box">
            <span className="gs-carousel-spinner" /> Loading latest schemes...
          </div>
        </div>
      </section>
    );
  }

  if (!schemes.length) return null;

  const loopItems = schemes.length > 3 ? [...schemes, ...schemes.slice(0, 3)] : schemes;

  return (
    <section className="gs-carousel-root">
      <style>{`
        .gs-carousel-root {
          width: 100% !important;
          padding: 34px 0 40px !important;
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
          font-size: 14.5px !important;
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
          transition: transform 0.5s cubic-bezier(0.2, 1, 0.3, 1) !important;
          transform: translateX(calc(-1 * ${activeIndex} * (100% / 3 + 20px / 3))) !important;
          box-sizing: border-box !important;
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

        .gs-carousel-spinner-box {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
          min-height: 200px !important;
          color: #64748b !important;
          font-size: 14px !important;
          font-weight: 600 !important;
        }

        .gs-carousel-spinner {
          width: 26px !important;
          height: 26px !important;
          border: 3px solid #dce8f6 !important;
          border-top-color: #0668e8 !important;
          border-radius: 50% !important;
          animation: gsSpin 0.8s linear infinite !important;
        }

        @media (max-width: 1100px) {
          .gs-carousel-track {
            transform: translateX(calc(-1 * ${activeIndex} * (100% / 2 + 20px / 2))) !important;
          }
          .gs-carousel-card {
            flex: 0 0 calc((100% - 20px) / 2) !important;
            min-width: calc((100% - 20px) / 2) !important;
            max-width: calc((100% - 20px) / 2) !important;
          }
        }

        @media (max-width: 680px) {
          .gs-carousel-track {
            transform: translateX(calc(-1 * ${activeIndex} * 100%)) !important;
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

        {schemes.length > 1 && (
          <div className="gs-carousel-dots" aria-label="Scheme carousel controls">
            {schemes.map((_, index) => (
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