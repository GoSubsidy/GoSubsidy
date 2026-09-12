import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import "../styles/StartupSchemes.css";

/* =========================================================
   STARTUP-ONLY SCHEMES
   ========================================================= */

const schemes = [
  {
    id: "sisfs",
    name: "Startup India Seed Fund Scheme",
    code: "SISFS",
    type: "Startup Funding",
    stage: "Idea / Early Stage",
    ministry: "DPIIT",
    icon: "bi-rocket-takeoff",
    text:
      "Support for eligible startups at the early stages of validating an idea, developing a prototype and building a business opportunity.",
    tags: ["Seed Funding", "Innovation", "Early Stage"],
  },

  {
    id: "fofs",
    name: "Fund of Funds for Startups",
    code: "FFS",
    type: "Startup Investment",
    stage: "Growth",
    ministry: "DPIIT",
    icon: "bi-graph-up-arrow",
    text:
      "A startup ecosystem financing initiative that supports startups through participating investment funds.",
    tags: ["Investment", "Growth", "Venture Capital"],
  },

  {
    id: "cgss",
    name: "Credit Guarantee Scheme for Startups",
    code: "CGSS",
    type: "Startup Credit",
    stage: "Early / Growth",
    ministry: "DPIIT",
    icon: "bi-shield-check",
    text:
      "A credit-support mechanism intended to improve access to institutional debt for eligible startups.",
    tags: ["Credit Guarantee", "Debt", "Startup"],
  },

  {
    id: "dpiit",
    name: "Startup India Recognition",
    code: "DPIIT",
    type: "Startup Recognition",
    stage: "Startup",
    ministry: "DPIIT",
    icon: "bi-patch-check",
    text:
      "A recognition pathway for eligible entities within the Startup India ecosystem and its support framework.",
    tags: ["DPIIT", "Recognition", "Startup India"],
  },
];

/* =========================================================
   FILTER OPTIONS
   ========================================================= */

const categories = [
  "All",
  "Startup Funding",
  "Startup Investment",
  "Startup Credit",
  "Startup Recognition",
];

const stages = [
  "All",
  "Idea / Early Stage",
  "Early / Growth",
  "Growth",
  "Startup",
];

/* =========================================================
   PAGE
   ========================================================= */

export default function StartupSchemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [selected, setSelected] = useState(null);

  /* ---------------------------------------------------------
     Always open page from top
     --------------------------------------------------------- */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  /* ---------------------------------------------------------
     FILTER
     --------------------------------------------------------- */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return schemes.filter((scheme) => {
      const searchableText = [
        scheme.name,
        scheme.code,
        scheme.type,
        scheme.stage,
        scheme.ministry,
        scheme.text,
        ...scheme.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !q || searchableText.includes(q);

      const matchesCategory =
        category === "All" ||
        scheme.type === category;

      const matchesStage =
        stage === "All" ||
        scheme.stage === stage;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStage
      );
    });
  }, [search, category, stage]);

  /* ---------------------------------------------------------
     RESET
     --------------------------------------------------------- */

  const reset = () => {
    setSearch("");
    setCategory("All");
    setStage("All");
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="startup-schemes-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="startup-hero">

        <div className="startup-glow startup-glow-a" />
        <div className="startup-glow startup-glow-b" />

        <div className="container startup-container">

          {/* Breadcrumb */}

          <div className="startup-breadcrumb">
            <Link to="/">Home</Link>

            <span>/</span>

            <Link to="/schemes">
              Schemes
            </Link>

            <span>/</span>

            <b>
              Startup Schemes
            </b>
          </div>

          <div className="startup-hero-grid">

            {/* LEFT */}

            <div>

              <span className="startup-eyebrow">
                <i className="bi bi-rocket-takeoff-fill" />

                STARTUP SCHEME INTELLIGENCE
              </span>

              <h1>
                Government Support for{" "}
                <span>Indian Startups.</span>
              </h1>

              <p>
                Discover startup funding, investment,
                credit support and DPIIT recognition
                opportunities through one professional
                startup scheme directory.
              </p>

              <div className="startup-actions">

                <a
                  href="#startup-directory"
                  className="startup-btn startup-btn-primary"
                >
                  Explore Startup Schemes

                  <i className="bi bi-arrow-down" />
                </a>

                <Link
                  to="/ai-advisor"
                  className="startup-btn startup-btn-secondary"
                >
                  Find My Opportunities

                  <i className="bi bi-stars" />
                </Link>

              </div>

              <div className="startup-trust">

                <span>
                  <i className="bi bi-shield-check" />
                  Startup-focused
                </span>

                <span>
                  <i className="bi bi-search" />
                  Search & filter
                </span>

                <span>
                  <i className="bi bi-person-check" />
                  Eligibility guidance
                </span>

              </div>

            </div>

            {/* RIGHT VISUAL */}

            <div className="startup-visual">

              <div className="startup-orbit orbit-one" />

              <div className="startup-orbit orbit-two" />

              <div className="startup-core">

                <div>
                  <i className="bi bi-rocket-takeoff-fill" />
                </div>

                <strong>
                  Startup India
                </strong>

                <small>
                  Scheme Discovery
                </small>

              </div>

              <div className="startup-float float-one">

                <i className="bi bi-cash-stack" />

                <b>
                  Funding

                  <small>
                    Seed & growth
                  </small>
                </b>

              </div>

              <div className="startup-float float-two">

                <i className="bi bi-bank" />

                <b>
                  Credit

                  <small>
                    Finance support
                  </small>
                </b>

              </div>

              <div className="startup-float float-three">

                <i className="bi bi-lightbulb" />

                <b>
                  Innovation

                  <small>
                    Startup ecosystem
                  </small>
                </b>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORY STRIP
          ===================================================== */}

      <section className="startup-category-strip">

        <div className="container startup-container">

          <div className="startup-category-grid">

            {[
              [
                "bi-cash-coin",
                "Startup Funding",
                "Seed support",
              ],

              [
                "bi-graph-up-arrow",
                "Startup Investment",
                "Growth capital",
              ],

              [
                "bi-shield-check",
                "Startup Credit",
                "Credit support",
              ],

              [
                "bi-patch-check",
                "Startup Recognition",
                "DPIIT ecosystem",
              ],
            ].map(([icon, title, sub]) => (

              <button
                key={title}
                type="button"
                className={
                  category === title
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(title)
                }
              >

                <i
                  className={`bi ${icon}`}
                />

                <span>
                  {title}
                </span>

                <small>
                  {sub}
                </small>

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          DIRECTORY
          ===================================================== */}

      <section
        className="startup-directory"
        id="startup-directory"
      >

        <div className="container startup-container">

          <div className="startup-heading-row">

            <div>

              <span className="startup-label">
                STARTUP SCHEME DIRECTORY
              </span>

              <h2>
                Find Startup Government Support
              </h2>

              <p>
                Explore startup funding, investment,
                credit support and DPIIT recognition
                opportunities.
              </p>

            </div>

            <div className="startup-count">

              <strong>
                {filtered.length}
              </strong>

              <span>
                startup schemes
              </span>

            </div>

          </div>


          {/* FILTERS */}

          <div className="startup-filters">

            <div className="startup-search">

              <i className="bi bi-search" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search startup schemes..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}

            </div>


            <label>

              Support Type

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </label>


            <label>

              Startup Stage

              <select
                value={stage}
                onChange={(e) =>
                  setStage(e.target.value)
                }
              >

                {stages.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </label>


            {(search ||
              category !== "All" ||
              stage !== "All") && (

              <button
                className="startup-reset"
                type="button"
                onClick={reset}
              >
                Reset
              </button>

            )}

          </div>


          {/* =================================================
              CARDS
              ================================================= */}

          {filtered.length > 0 ? (

            <div className="startup-grid">

              {filtered.map((scheme, index) => (

                <article
                  className="startup-card"
                  key={scheme.id}
                  style={{
                    "--card-index": index,
                  }}
                >

                  <div className="startup-card-top">

                    <div className="startup-card-icon">

                      <i
                        className={`bi ${scheme.icon}`}
                      />

                    </div>

                    <span>
                      {scheme.stage}
                    </span>

                  </div>


                  <div className="startup-card-body">

                    <small>
                      {scheme.type}
                    </small>

                    <h3>
                      {scheme.name}
                    </h3>

                    <p>
                      {scheme.text}
                    </p>


                    <div className="startup-meta">

                      <span>
                        <i className="bi bi-building" />

                        {scheme.ministry}
                      </span>

                      <span>
                        <i className="bi bi-bookmark" />

                        {scheme.code}
                      </span>

                    </div>


                    <div className="startup-tags">

                      {scheme.tags.map((tag) => (

                        <em key={tag}>
                          {tag}
                        </em>

                      ))}

                    </div>

                  </div>


                  <div className="startup-card-footer">

                    <button
                      type="button"
                      onClick={() =>
                        setSelected(scheme)
                      }
                    >
                      View Overview

                      <i className="bi bi-arrow-right" />
                    </button>

                    <Link
                      to={`/schemes/${scheme.id}`}
                    >
                      Details

                      <i className="bi bi-box-arrow-up-right" />
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="startup-empty">

              <i className="bi bi-search" />

              <h3>
                No startup schemes found
              </h3>

              <p>
                Try another keyword or clear
                the filters.
              </p>

              <button
                type="button"
                onClick={reset}
              >
                Show All Startup Schemes
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
          ===================================================== */}

      <section className="startup-how">

        <div className="container startup-container">

          <div className="startup-heading-center">

            <span className="startup-label">
              HOW GOSUBSIDY HELPS
            </span>

            <h2>
              From Startup Idea to Scheme Discovery
            </h2>

            <p>
              Understand your startup profile,
              discover relevant support and prepare
              for the next step.
            </p>

          </div>


          <div className="startup-steps">

            <div>

              <b>01</b>

              <i className="bi bi-person-vcard" />

              <h3>
                Understand Your Startup
              </h3>

              <p>
                Identify your startup stage,
                sector and funding requirement.
              </p>

            </div>


            <span />


            <div>

              <b>02</b>

              <i className="bi bi-funnel" />

              <h3>
                Discover Relevant Schemes
              </h3>

              <p>
                Search and filter startup-focused
                government support options.
              </p>

            </div>


            <span />


            <div>

              <b>03</b>

              <i className="bi bi-file-earmark-check" />

              <h3>
                Prepare for the Next Step
              </h3>

              <p>
                Review eligibility, documents and
                official application requirements.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="startup-cta">

        <div className="container startup-container">

          <div>

            <small>
              GOSUBSIDY INTELLIGENCE
            </small>

            <h2>
              Not sure which scheme fits
              your startup?
            </h2>

            <p>
              Start with your business profile
              and explore relevant startup
              government support opportunities.
            </p>

          </div>


          <div className="startup-cta-actions">

            <Link to="/ai-advisor">
              Check My Opportunities

              <i className="bi bi-arrow-right" />
            </Link>

            <Link to="/contact">
              Get Assistance
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          MODAL
          ===================================================== */}

      {selected && (

        <div
          className="startup-modal-bg"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setSelected(null);
            }

          }}
        >

          <div className="startup-modal">

            <button
              className="startup-close"
              type="button"
              onClick={() =>
                setSelected(null)
              }
            >
              <i className="bi bi-x-lg" />
            </button>


            <div className="startup-modal-icon">

              <i
                className={`bi ${selected.icon}`}
              />

            </div>


            <small>
              {selected.type}
            </small>

            <h2>
              {selected.name}
            </h2>

            <p>
              {selected.text}
            </p>


            <div className="startup-modal-info">

              <div>

                <span>
                  Startup Stage
                </span>

                <b>
                  {selected.stage}
                </b>

              </div>


              <div>

                <span>
                  Ministry / Authority
                </span>

                <b>
                  {selected.ministry}
                </b>

              </div>

            </div>


            <div className="startup-note">

              <i className="bi bi-info-circle" />

              Eligibility, benefits,
              documentation and final approval
              are subject to applicable scheme
              guidelines and competent authority.

            </div>


            <div className="startup-modal-actions">

              <Link
                to={`/schemes/${selected.id}`}
                onClick={() =>
                  setSelected(null)
                }
              >
                Open Scheme Details

                <i className="bi bi-arrow-right" />
              </Link>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer />

    </div>
  );
}