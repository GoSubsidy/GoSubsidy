import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function CibilHero() {
  return (
    <section className="cibil-hero">

      <div className="container">

        <div className="row align-items-center">

          {/* Left */}

          <div className="col-lg-7">

            <span className="hero-badge">

              <i className="bi bi-stars me-2"></i>

              AI Powered Credit Intelligence

            </span>

            <h1 className="hero-title mt-4">

              Improve Your
              <span className="text-warning"> CIBIL Score</span>

              <br />

              Unlock Better Loan Opportunities

            </h1>

            <p className="hero-subtitle mt-4">

              Analyze your credit profile, improve your credit score,
              estimate loan eligibility, receive AI recommendations,
              and discover government subsidy opportunities.

            </p>

            <div className="d-flex flex-wrap gap-3 mt-5">

              <Link
                to="/loan"
                className="btn btn-warning btn-lg px-4"
              >
                <i className="bi bi-speedometer2 me-2"></i>

                Check Score

              </Link>

              <Link
                to="/ai-advisor"
                className="btn btn-outline-light btn-lg px-4"
              >
                <i className="bi bi-robot me-2"></i>

                AI Credit Advisor

              </Link>

            </div>

            {/* Statistics */}

            <div className="row mt-5">

              <div className="col-4">

                <div className="hero-stat">

                  <h2>10K+</h2>

                  <small>Profiles Analyzed</small>

                </div>

              </div>

              <div className="col-4">

                <div className="hero-stat">

                  <h2>98%</h2>

                  <small>Success Rate</small>

                </div>

              </div>

              <div className="col-4">

                <div className="hero-stat">

                  <h2>750+</h2>

                  <small>Target Score</small>

                </div>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="col-lg-5 mt-5 mt-lg-0">

            <div className="credit-score-card">

              <div className="text-center">

                <div className="score-ring">

                  <div>

                    <small>Your Score</small>

                    <h1>742</h1>

                    <span className="badge bg-success">

                      Excellent

                    </span>

                  </div>

                </div>

              </div>

              <hr />

              <div className="score-item">

                <span>

                  Credit Health

                </span>

                <strong className="text-success">

                  Excellent

                </strong>

              </div>

              <div className="score-item">

                <span>

                  Loan Approval

                </span>

                <strong>

                  92%

                </strong>

              </div>

              <div className="score-item">

                <span>

                  Improvement Potential

                </span>

                <strong>

                  +58 Points

                </strong>

              </div>

              <div className="score-item">

                <span>

                  Estimated Loan

                </span>

                <strong>

                  ₹45 Lakhs

                </strong>

              </div>

              <button className="btn btn-primary w-100 mt-4">

                <i className="bi bi-graph-up-arrow me-2"></i>

                Improve My Score

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}