import React from "react";

const stats = [
  {
    icon: "bi-bank2",
    value: "5,000+",
    title: "Government Schemes",
    subtitle: "Central & State Subsidies",
    color: "linear-gradient(135deg,#2563eb,#3b82f6)",
  },
  {
    icon: "bi-cpu",
    value: "AI",
    title: "Smart Eligibility",
    subtitle: "AI Powered Recommendations",
    color: "linear-gradient(135deg,#10b981,#059669)",
  },
  {
    icon: "bi-people-fill",
    value: "10K+",
    title: "Entrepreneurs",
    subtitle: "Successfully Assisted",
    color: "linear-gradient(135deg,#f59e0b,#f97316)",
  },
  {
    icon: "bi-cash-stack",
    value: "₹500Cr+",
    title: "Funding Opportunities",
    subtitle: "Loans & Subsidies",
    color: "linear-gradient(135deg,#8b5cf6,#6366f1)",
  },
];

export default function Stats() {
  return (
    <section className="py-5 bg-light position-relative">

      <div className="container">

        <div className="text-center mb-5">

          <span className="badge bg-primary px-3 py-2 mb-3">
            GO SUBSIDY DASHBOARD
          </span>

          <h2 className="fw-bold display-5">
            Empowering Entrepreneurs with
            <span className="text-primary"> Smart Finance</span>
          </h2>

          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Discover thousands of Government Subsidies, AI-powered eligibility,
            business loans, DPR preparation and expert consultancy — all from
            one premium platform.
          </p>

        </div>

        <div className="row g-4">

          {stats.map((item, index) => (

            <div className="col-lg-3 col-md-6" key={index}>

              <div className="kpi-card h-100">

                <div
                  className="kpi-icon mb-4"
                  style={{
                    background: item.color,
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                </div>

                <small>{item.title}</small>

                <h2 className="fw-bold">
                  {item.value}
                </h2>

                <span className="text-success">
                  <i className="bi bi-arrow-up-right-circle me-1"></i>

                  {item.subtitle}
                </span>

              </div>

            </div>

          ))}

        </div>

        {/* Bottom Feature Row */}

        <div className="row mt-5">

          <div className="col-lg-12">

            <div
              className="rounded-4 p-4 text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg,#2563eb,#0f766e)",
              }}
            >

              <div className="row align-items-center">

                <div className="col-lg-8">

                  <h3 className="fw-bold">
                    Why Choose GoSubsidy?
                  </h3>

                  <p className="mb-0 opacity-75">
                    AI powered scheme discovery • Bank loan guidance • DPR
                    preparation • Subsidy consultancy • CIBIL improvement •
                    Expert financial assistance
                  </p>

                </div>

                <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">

                  <button className="btn btn-warning btn-lg px-4">
                    Explore Schemes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}