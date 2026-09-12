import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSubsidies } from "../../api";

/* ============================================================
   GO SUBSIDY — MODERN FEATURED SCHEMES
   Lightweight Home-page component.
   Uses the same intelligent image/data approach as the
   full Schemes page while keeping the Home page fast.
============================================================ */

function getSchemeImage(scheme) {
  return (
    scheme?.banner_url ||
    scheme?.image_url ||
    scheme?.image ||
    scheme?.banner ||
    scheme?.logo_url ||
    scheme?.logo ||
    ""
  );
}

function valueToText(value) {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "string") return value.trim();

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => valueToText(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    const preferredKeys = [
      "title",
      "name",
      "label",
      "amount",
      "value",
      "description",
      "text",
      "support",
      "benefit",
    ];

    for (const key of preferredKeys) {
      if (value[key] !== undefined && value[key] !== null && value[key] !== "") {
        const result = valueToText(value[key]);
        if (result) return result;
      }
    }

    return Object.entries(value)
      .map(([key, item]) => {
        const result = valueToText(item);
        return result ? `${key}: ${result}` : "";
      })
      .filter(Boolean)
      .join(", ");
  }

  return String(value);
}

function getCategory(scheme) {
  const raw =
    scheme?.category ??
    scheme?.sector ??
    scheme?.scheme_category ??
    scheme?.department_category;

  return valueToText(raw) || "Government Support";
}

function getLevel(scheme) {
  const value = String(
    scheme?.level ||
      scheme?.scheme_level ||
      scheme?.government_level ||
      scheme?.type ||
      ""
  ).toLowerCase();

  if (
    value.includes("state") ||
    value.includes("telangana") ||
    value.includes("andhra")
  ) {
    return "State Government";
  }

  return "Central Government";
}

function getBenefit(scheme) {
  const candidates = [
    scheme?.benefit_amount,
    scheme?.benefit,
    scheme?.benefits,
    scheme?.financial_assistance,
    scheme?.support,
    scheme?.support_amount,
    scheme?.incentive,
    scheme?.incentives,
    scheme?.assistance,
    scheme?.subsidy,
  ];

  for (const value of candidates) {
    const text = valueToText(value);
    if (text) return text;
  }

  return "As per scheme guidelines";
}

function getDescription(scheme) {
  return valueToText(scheme?.description);
}

function getFallbackImage(scheme) {
  const category = getCategory(scheme).toLowerCase();

  if (
    category.includes("agri") ||
    category.includes("farm") ||
    category.includes("farmer") ||
    category.includes("horticulture")
  ) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=82";
  }

  if (
    category.includes("msme") ||
    category.includes("manufact") ||
    category.includes("enterprise")
  ) {
    return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=82";
  }

  if (
    category.includes("solar") ||
    category.includes("renewable") ||
    category.includes("energy") ||
    category.includes("electric")
  ) {
    return "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=82";
  }

  if (
    category.includes("education") ||
    category.includes("student") ||
    category.includes("skill")
  ) {
    return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=82";
  }

  if (
    category.includes("startup") ||
    category.includes("business") ||
    category.includes("entrepreneur")
  ) {
    return "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=82";
  }

  return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=82";
}

function truncate(text, max = 128) {
  const clean = String(text || "").replace(/<[^>]*>/g, "").trim();
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function isActive(scheme) {
  const status = String(
    scheme?.status || scheme?.scheme_status || scheme?.state || ""
  ).toLowerCase();

  return !status || !["inactive", "closed", "expired", "draft"].includes(status);
}

export default function FeaturedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError("");

    fetchSubsidies()
      .then((data) => {
        if (!mounted) return;

        const list = Array.isArray(data) ? data : [];
        setSchemes(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Featured schemes:", err);

        if (!mounted) return;

        setError("Unable to load featured schemes.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredSchemes = useMemo(() => {
    return schemes
      .filter(Boolean)
      .filter((scheme) => isActive(scheme))
      .slice(0, 6);
  }, [schemes]);

  return (
    <section className="featured-schemes-modern">
      <style>{`
        .featured-schemes-modern {
          position: relative;
          overflow: hidden;
          padding: 88px 0 104px;
          background:
            radial-gradient(circle at 4% 10%, rgba(16,185,129,.11), transparent 25%),
            radial-gradient(circle at 96% 12%, rgba(37,99,235,.10), transparent 26%),
            linear-gradient(180deg, #ffffff 0%, #f5f9fc 100%);
        }

        .featured-schemes-modern::before,
        .featured-schemes-modern::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(55px);
        }

        .featured-schemes-modern::before {
          width: 360px;
          height: 360px;
          left: -220px;
          bottom: -190px;
          background: rgba(16,185,129,.10);
        }

        .featured-schemes-modern::after {
          width: 300px;
          height: 300px;
          right: -180px;
          top: 35%;
          background: rgba(59,130,246,.08);
        }

        .fsm-container {
          position: relative;
          z-index: 2;
        }

        .fsm-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          border: 1px solid rgba(16,185,129,.22);
          border-radius: 999px;
          background: rgba(236,253,245,.92);
          color: #087f5b;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .8px;
          text-transform: uppercase;
          box-shadow: 0 8px 24px rgba(16,185,129,.08);
        }

        .fsm-kicker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 5px rgba(16,185,129,.12);
        }

        .fsm-title {
          margin: 18px auto 12px;
          max-width: 820px;
          color: #061a31;
          font-size: clamp(2.15rem, 4vw, 3.55rem);
          font-weight: 900;
          letter-spacing: -2.2px;
          line-height: 1.03;
        }

        .fsm-gradient {
          background: linear-gradient(90deg, #079455 0%, #10a85d 42%, #315bea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fsm-subtitle {
          max-width: 740px;
          margin: 0 auto;
          color: #60748a;
          font-size: 16px;
          line-height: 1.8;
        }

        .fsm-grid {
          margin-top: 46px;
        }

        .fsm-card {
          position: relative;
          height: 100%;
          overflow: hidden;
          border: 1px solid rgba(15,23,42,.075);
          border-radius: 26px;
          background: rgba(255,255,255,.96);
          box-shadow:
            0 12px 34px rgba(15,23,42,.065),
            0 2px 8px rgba(15,23,42,.025);
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }

        .fsm-card:hover,
        .fsm-card.fsm-active {
          transform: translateY(-8px);
          border-color: rgba(37,99,235,.18);
          box-shadow:
            0 28px 65px rgba(15,23,42,.13),
            0 5px 16px rgba(37,99,235,.06);
        }

        .fsm-image-wrap {
          position: relative;
          height: 224px;
          overflow: hidden;
          background: #eaf1f5;
        }

        .fsm-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .6s cubic-bezier(.2,.8,.2,1);
        }

        .fsm-card:hover .fsm-image,
        .fsm-card.fsm-active .fsm-image {
          transform: scale(1.06);
        }

        .fsm-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(4,12,28,.04) 12%, rgba(4,12,28,.72) 100%);
          pointer-events: none;
        }

        .fsm-level,
        .fsm-status {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(12px);
        }

        .fsm-level {
          left: 16px;
          bottom: 16px;
          padding: 8px 12px;
          color: #fff;
          background: rgba(7,17,31,.76);
          border: 1px solid rgba(255,255,255,.22);
        }

        .fsm-status {
          right: 16px;
          top: 16px;
          padding: 8px 12px;
          color: #047857;
          background: rgba(236,253,245,.96);
          border: 1px solid rgba(16,185,129,.22);
          box-shadow: 0 7px 18px rgba(15,23,42,.12);
        }

        .fsm-body {
          display: flex;
          flex-direction: column;
          padding: 23px;
          min-height: 314px;
        }

        .fsm-category {
          display: inline-flex;
          align-items: center;
          color: #4656d8;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .45px;
          text-transform: none;
        }

        .fsm-name {
          margin: 9px 0 10px;
          color: #071d35;
          font-size: 20px;
          font-weight: 850;
          line-height: 1.25;
          letter-spacing: -.45px;
        }

        .fsm-description {
          color: #647b92;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .fsm-benefit {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 76px;
          padding: 14px 15px;
          margin-top: auto;
          margin-bottom: 16px;
          border: 1px solid #d7eee3;
          border-radius: 17px;
          background: linear-gradient(135deg, #effcf6, #f8fffc);
        }

        .fsm-benefit-label {
          color: #718096;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        .fsm-benefit-value {
          margin-top: 4px;
          color: #067a57;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.4;
          max-width: 275px;
          overflow-wrap: anywhere;
        }

        .fsm-arrow {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border-radius: 50%;
          color: #0f9f52;
          background: #d9fbe9;
          transition: .2s ease;
        }

        .fsm-card:hover .fsm-arrow {
          transform: translate(3px,-2px);
          background: #c9f8df;
        }

        .fsm-actions {
          display: grid;
          grid-template-columns: 1fr 50px;
          gap: 9px;
        }

        .fsm-view {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 13px;
          padding: 12px 15px;
          background: linear-gradient(135deg, #0869ef, #4b46e8);
          color: #fff;
          font-size: 13px;
          font-weight: 850;
          text-align: center;
          text-decoration: none;
          box-shadow: 0 9px 20px rgba(37,99,235,.20);
          transition: .22s ease;
        }

        .fsm-view:hover {
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 13px 27px rgba(37,99,235,.28);
        }

        .fsm-check {
          width: 50px;
          min-height: 46px;
          border: 1px solid #d8e2ec;
          border-radius: 13px;
          background: #fff;
          color: #0f9f52;
          transition: .2s ease;
        }

        .fsm-check:hover {
          border-color: #86efac;
          background: #f0fdf4;
          transform: translateY(-2px);
        }

        .fsm-empty {
          border: 1px dashed #cbd5e1;
          border-radius: 22px;
          background: rgba(255,255,255,.72);
        }

        .fsm-footer {
          margin-top: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .fsm-all {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 23px;
          border-radius: 14px;
          color: #fff;
          background: linear-gradient(135deg, #071d35, #0c314d);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          box-shadow: 0 12px 28px rgba(15,23,42,.14);
          transition: .22s ease;
        }

        .fsm-all:hover {
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 18px 35px rgba(15,23,42,.20);
        }

        .fsm-note {
          color: #8a98a8;
          font-size: 12px;
        }

        @media (max-width: 991px) {
          .fsm-grid {
            margin-top: 38px;
          }

          .fsm-body {
            min-height: 300px;
          }
        }

        @media (max-width: 767px) {
          .featured-schemes-modern {
            padding: 64px 0 76px;
          }

          .fsm-title {
            letter-spacing: -1.25px;
          }

          .fsm-subtitle {
            font-size: 14px;
          }

          .fsm-image-wrap {
            height: 205px;
          }

          .fsm-body {
            min-height: auto;
            padding: 20px;
          }

          .fsm-benefit-value {
            max-width: 230px;
          }
        }
      `}</style>

      <div className="container fsm-container">
        <div className="text-center">
          <span className="fsm-kicker">
            <span className="fsm-kicker-dot" />
            Featured Opportunities
          </span>

          <h2 className="fsm-title">
            Government Benefits.
            <br />
            <span className="fsm-gradient">Real Opportunities.</span>
          </h2>

          <p className="fsm-subtitle">
            Explore selected Central and State Government schemes for
            entrepreneurs, farmers, startups, students and MSMEs —
            all in one place.
          </p>
        </div>

        {loading ? (
          <div className="row g-4 fsm-grid">
            {[1, 2, 3].map((item) => (
              <div className="col-md-6 col-lg-4" key={item}>
                <div className="fsm-card">
                  <div
                    style={{
                      height: "220px",
                      background:
                        "linear-gradient(90deg,#eef2f7,#f8fafc,#eef2f7)",
                    }}
                  />
                  <div className="fsm-body">
                    <div
                      className="placeholder-glow"
                      style={{ minHeight: "170px" }}
                    >
                      <span className="placeholder col-5 mb-3" />
                      <span className="placeholder col-10 mb-2" />
                      <span className="placeholder col-8 mb-2" />
                      <span className="placeholder col-12 mb-4" />
                      <span className="placeholder col-12" style={{ height: "48px" }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="fsm-empty text-center p-5 mt-5">
            <div className="fs-2 mb-2">⚠️</div>
            <h5 className="fw-bold">Featured schemes unavailable</h5>
            <p className="text-muted mb-0">{error}</p>
          </div>
        ) : featuredSchemes.length === 0 ? (
          <div className="fsm-empty text-center p-5 mt-5">
            <div className="fs-2 mb-2">🔎</div>
            <h5 className="fw-bold">No featured schemes available</h5>
            <p className="text-muted mb-0">
              Please check the full schemes directory.
            </p>
          </div>
        ) : (
          <div className="row g-4 fsm-grid">
            {featuredSchemes.map((scheme) => {
              const image = getSchemeImage(scheme) || getFallbackImage(scheme);
              const benefit = getBenefit(scheme);
              const description = truncate(getDescription(scheme));
              const category = getCategory(scheme);
              const level = getLevel(scheme);

              return (
                <div className="col-md-6 col-lg-4" key={scheme.id}>
                  <article
                    className={`fsm-card ${
                      activeCard === scheme.id ? "fsm-active" : ""
                    }`}
                    onMouseEnter={() => setActiveCard(scheme.id)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    <div className="fsm-image-wrap">
                      <img
                        src={image}
                        className="fsm-image"
                        alt={scheme.scheme_name || "Government Scheme"}
                        loading="lazy"
                        onError={(event) => {
                          const fallback = getFallbackImage(scheme);

                          if (event.currentTarget.src !== fallback) {
                            event.currentTarget.src = fallback;
                          }
                        }}
                      />

                      <div className="fsm-image-overlay" />

                      <span className="fsm-level">
                        {level}
                      </span>

                      <span className="fsm-status">
                        <i className="bi bi-check-circle-fill me-1" />
                        Active
                      </span>
                    </div>

                    <div className="fsm-body">
                      <div className="fsm-category">
                        <i className="bi bi-grid-3x3-gap-fill me-1" />
                        {category}
                      </div>

                      <h3 className="fsm-name">
                        {scheme.scheme_name || "Government Scheme"}
                      </h3>

                      <p className="fsm-description">
                        {description || "Explore eligibility, benefits and application details for this government support programme."}
                      </p>

                      <div className="fsm-benefit">
                        <div>
                          <div className="fsm-benefit-label">
                            Benefit / Support
                          </div>
                          <div className="fsm-benefit-value">
                            {benefit}
                          </div>
                        </div>

                        <span className="fsm-arrow">
                          <i className="bi bi-arrow-up-right" />
                        </span>
                      </div>

                      <div className="fsm-actions">
                        <Link
                          to={`/schemes/${scheme.id}`}
                          className="fsm-view"
                        >
                          View Scheme Details
                          <i className="bi bi-arrow-right ms-2" />
                        </Link>

                        <button
                          type="button"
                          className="fsm-check"
                          title="Check eligibility"
                          aria-label={`Check eligibility for ${scheme.scheme_name || "this scheme"}`}
                        >
                          <i className="bi bi-check2-circle" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}

        <div className="fsm-footer">
          <Link to="/schemes" className="fsm-all">
            Explore All Government Schemes
            <i className="bi bi-arrow-right" />
          </Link>

          <span className="fsm-note">
            Updated opportunities • Central + State support
          </span>
        </div>
      </div>
    </section>
  );
}