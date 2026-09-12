import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Eligible Schemes",
      value: "24",
      icon: "bi-bank",
      color: "primary",
    },
    {
      title: "Saved Schemes",
      value: "8",
      icon: "bi-bookmark-heart",
      color: "success",
    },
    {
      title: "Loan Applications",
      value: "3",
      icon: "bi-cash-stack",
      color: "warning",
    },
    {
      title: "AI Consultations",
      value: "16",
      icon: "bi-robot",
      color: "info",
    },
  ];

  const recentSchemes = [
    "PMEGP",
    "CGTMSE",
    "PMFME",
    "MSME Technology Upgradation",
  ];

  return (
    <>
      {/* Hero */}
      <section className="dashboard-header py-5">
        <div className="container">

          <div className="row align-items-center">

            <div className="col-lg-8">

              <h1 className="fw-bold text-white">
                Welcome Back
              </h1>

              <p className="text-white-50 mb-0">
                {user?.email}
              </p>

            </div>

            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">

              <Link
                to="/ai-advisor"
                className="btn btn-warning btn-lg"
              >
                🤖 AI Advisor
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Statistics */}

      <section className="section">

        <div className="container">

          <div className="row g-4">

            {stats.map((item, index) => (

              <div className="col-md-6 col-xl-3" key={index}>

                <div className="dashboard-card">

                  <div className="d-flex justify-content-between">

                    <div>

                      <small className="text-muted">
                        {item.title}
                      </small>

                      <h2 className="fw-bold mt-2">
                        {item.value}
                      </h2>

                    </div>

                    <div className={`dashboard-icon bg-${item.color}`}>

                      <i className={`bi ${item.icon}`}></i>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Main Content */}

      <section className="pb-5">

        <div className="container">

          <div className="row g-4">

            {/* Left */}

            <div className="col-lg-8">

              <div className="card border-0 shadow rounded-4">

                <div className="card-body">

                  <h4 className="fw-bold mb-4">
                    Recommended Schemes
                  </h4>

                  {recentSchemes.map((scheme, index) => (

                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >

                      <div>

                        <h6 className="fw-bold mb-1">
                          {scheme}
                        </h6>

                        <small className="text-muted">
                          Eligible for your profile
                        </small>

                      </div>

                      <Link
                        to="/schemes"
                        className="btn btn-outline-primary"
                      >
                        View
                      </Link>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="col-lg-4">

              <div className="card border-0 shadow rounded-4 mb-4">

                <div className="card-body">

                  <h5 className="fw-bold mb-4">
                    Profile Completion
                  </h5>

                  <div className="progress mb-3" style={{ height: 12 }}>

                    <div
                      className="progress-bar bg-success"
                      style={{ width: "75%" }}
                    >
                      75%
                    </div>

                  </div>

                  <p className="text-muted">
                    Complete your profile to receive more accurate subsidy recommendations.
                  </p>

                  <Link
                    to="/profile"
                    className="btn btn-success w-100"
                  >
                    Complete Profile
                  </Link>

                </div>

              </div>

              <div className="card border-0 shadow rounded-4">

                <div className="card-body">

                  <h5 className="fw-bold mb-4">
                    Quick Actions
                  </h5>

                  <div className="d-grid gap-3">

                    <Link
                      to="/schemes"
                      className="btn btn-outline-primary"
                    >
                      Browse Schemes
                    </Link>

                    <Link
                      to="/loans"
                      className="btn btn-outline-success"
                    >
                      Loan Assistance
                    </Link>

                    <Link
                      to="/ai-advisor"
                      className="btn btn-primary"
                    >
                      AI Subsidy Advisor
                    </Link>

                    <Link
                      to="/contact"
                      className="btn btn-outline-dark"
                    >
                      Contact Expert
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}