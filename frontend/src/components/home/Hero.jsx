import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Hero.css";


// ============================================================
// GOSUBSIDY HERO
// ============================================================

export default function Hero() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [projectCost, setProjectCost] = useState("");


  // ==========================================================
  // SEARCH SCHEMES
  // ==========================================================

  const handleSearch = () => {
    const query = searchTerm.trim();

    if (!query) {
      navigate("/schemes");
      return;
    }

    navigate(
      `/schemes?search=${encodeURIComponent(query)}`
    );
  };


  // ==========================================================
  // ELIGIBILITY CHECK
  // ==========================================================

  const handleEligibility = () => {
    if (!category) {
      alert("Please select your business category.");
      return;
    }

    if (!state) {
      alert("Please select your state.");
      return;
    }

    if (!projectCost || Number(projectCost) <= 0) {
      alert("Please enter your estimated project cost.");
      return;
    }


    const projectDetails = {
      business: category,
      category: category,
      sector: category,
      state: state,
      projectCost: Number(projectCost),
      investment: Number(projectCost),

      question:
        `Check my eligibility for government schemes ` +
        `for a ${category} project in ${state} ` +
        `with a project cost of ₹${Number(
          projectCost
        ).toLocaleString("en-IN")}.`,
    };


    sessionStorage.setItem(
      "gosubsidyProjectDetails",
      JSON.stringify(projectDetails)
    );


    navigate("/ai-advisor", {
      state: {
        projectDetails,
        autoCheck: true,
      },
    });
  };


  // ==========================================================
  // QUICK SEARCH
  // ==========================================================

  const quickSearch = (value) => {
    setSearchTerm(value);
  };


  // ==========================================================
  // HERO
  // ==========================================================

  return (
    <section className="gs-hero">

      {/* Background effects */}

      <div className="gs-hero-grid"></div>

      <div className="gs-hero-glow gs-glow-1"></div>

      <div className="gs-hero-glow gs-glow-2"></div>


      <div className="container position-relative">

        <div className="row align-items-center g-5">


          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div className="col-lg-7">

            {/* Eyebrow */}

            <div className="gs-hero-eyebrow">

              <span className="gs-live-dot"></span>

              India's Government Benefits Platform

              <span className="gs-india-badge">
                🇮🇳
              </span>

            </div>


            {/* Main heading */}

            <h1 className="gs-hero-title">

              Turn Your Business Idea

              <br />

              Into a{" "}

              <span>
                Fundable Opportunity.
              </span>

            </h1>


            {/* Description */}

            <p className="gs-hero-description">

              Discover Government subsidies, incentives,
              business loans, project finance and financial
              support — all from one powerful platform.

            </p>


            {/* Search */}

            <div className="gs-search-wrapper">

              <div className="gs-search-icon">

                <i className="bi bi-search"></i>

              </div>


              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search MSME, poultry, solar, agriculture..."
              />


              <button
                type="button"
                onClick={handleSearch}
              >

                Search

                <i className="bi bi-arrow-right"></i>

              </button>

            </div>


            {/* Popular searches */}

            <div className="gs-search-hints">

              <span>
                Popular:
              </span>


              <button
                type="button"
                onClick={() =>
                  quickSearch("MSME subsidy")
                }
              >
                MSME
              </button>


              <button
                type="button"
                onClick={() =>
                  quickSearch("solar subsidy")
                }
              >
                Solar
              </button>


              <button
                type="button"
                onClick={() =>
                  quickSearch("poultry subsidy")
                }
              >
                Poultry
              </button>


              <button
                type="button"
                onClick={() =>
                  quickSearch("agriculture subsidy")
                }
              >
                Agriculture
              </button>

            </div>


            {/* Main buttons */}

            <div className="gs-hero-actions">

              <Link
                to="/schemes"
                className="gs-primary-btn"
              >

                <i className="bi bi-bank2"></i>

                Find Government Schemes

                <i className="bi bi-arrow-up-right"></i>

              </Link>


              <Link
                to="/dpr"
                className="gs-secondary-btn"
              >

                <i className="bi bi-file-earmark-text"></i>

                Prepare DPR

              </Link>

            </div>


            {/* Trust points */}

            <div className="gs-hero-trust">

              <span>
                <i className="bi bi-check-circle-fill"></i>
                Central & State Schemes
              </span>


              <span>
                <i className="bi bi-check-circle-fill"></i>
                Business Finance
              </span>


              <span>
                <i className="bi bi-check-circle-fill"></i>
                DPR Preparation
              </span>

            </div>

          </div>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <div className="col-lg-5">

            <div className="gs-eligibility-card">


              {/* Card header */}

              <div className="gs-card-header">

                <div className="gs-card-icon">

                  <i className="bi bi-stars"></i>

                </div>


                <div>

                  <span>
                    GOSUBSIDY INTELLIGENCE
                  </span>

                  <h3>
                    Find Your Opportunities
                  </h3>

                </div>

              </div>


              <p className="gs-card-description">

                Tell us about your project and discover
                relevant Government support.

              </p>


              {/* Business category */}

              <div className="gs-form-group">

                <label>
                  Business Category
                </label>


                <div className="gs-input-wrapper">

                  <i className="bi bi-grid"></i>


                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                  >

                    <option value="">
                      Select business category
                    </option>

                    <option value="MSME">
                      MSME
                    </option>

                    <option value="Agriculture">
                      Agriculture
                    </option>

                    <option value="Poultry">
                      Poultry
                    </option>

                    <option value="Dairy">
                      Dairy
                    </option>

                    <option value="Food Processing">
                      Food Processing
                    </option>

                    <option value="Solar & Renewable Energy">
                      Solar & Renewable Energy
                    </option>

                    <option value="Manufacturing">
                      Manufacturing
                    </option>

                    <option value="Startup">
                      Startup
                    </option>

                  </select>

                </div>

              </div>


              {/* State */}

              <div className="gs-form-group">

                <label>
                  Project State
                </label>


                <div className="gs-input-wrapper">

                  <i className="bi bi-geo-alt"></i>


                  <select
                    value={state}
                    onChange={(e) =>
                      setState(e.target.value)
                    }
                  >

                    <option value="">
                      Select your state
                    </option>

                    <option value="Andhra Pradesh">
                      Andhra Pradesh
                    </option>

                    <option value="Telangana">
                      Telangana
                    </option>

                    <option value="Karnataka">
                      Karnataka
                    </option>

                    <option value="Tamil Nadu">
                      Tamil Nadu
                    </option>

                    <option value="Kerala">
                      Kerala
                    </option>

                    <option value="Maharashtra">
                      Maharashtra
                    </option>

                    <option value="Gujarat">
                      Gujarat
                    </option>

                    <option value="Rajasthan">
                      Rajasthan
                    </option>

                    <option value="Uttar Pradesh">
                      Uttar Pradesh
                    </option>

                    <option value="Odisha">
                      Odisha
                    </option>

                    <option value="West Bengal">
                      West Bengal
                    </option>

                    <option value="Bihar">
                      Bihar
                    </option>

                    <option value="Punjab">
                      Punjab
                    </option>

                    <option value="Haryana">
                      Haryana
                    </option>

                    <option value="Other">
                      Other State / UT
                    </option>

                  </select>

                </div>

              </div>


              {/* Project cost */}

              <div className="gs-form-group">

                <label>
                  Estimated Project Cost
                </label>


                <div className="gs-input-wrapper">

                  <span className="gs-rupee">
                    ₹
                  </span>


                  <input
                    type="number"
                    min="0"
                    value={projectCost}
                    onChange={(e) =>
                      setProjectCost(e.target.value)
                    }
                    placeholder="Example: 5000000"
                  />

                </div>

              </div>


              {/* Button */}

              <button
                type="button"
                className="gs-eligibility-button"
                onClick={handleEligibility}
              >

                <span>
                  Check My Opportunities
                </span>

                <i className="bi bi-arrow-right"></i>

              </button>


              {/* Small note */}

              <div className="gs-card-note">

                <i className="bi bi-shield-check"></i>

                Your project details are used only
                to personalise your journey.

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            HERO BOTTOM STATS
        ================================================== */}

        <div className="gs-hero-stats">

          <div className="gs-stat">

            <strong>
              Central + State
            </strong>

            <span>
              Government Schemes
            </span>

          </div>


          <div className="gs-stat-divider"></div>


          <div className="gs-stat">

            <strong>
              Subsidies
            </strong>

            <span>
              Incentives & Benefits
            </span>

          </div>


          <div className="gs-stat-divider"></div>


          <div className="gs-stat">

            <strong>
              Loans
            </strong>

            <span>
              Business Finance
            </span>

          </div>


          <div className="gs-stat-divider"></div>


          <div className="gs-stat">

            <strong>
              DPR
            </strong>

            <span>
              Project Preparation
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}