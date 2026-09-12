import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "AI Subsidy Advisor",
    icon: "bi-robot",
    color: "primary",
    description:
      "Get personalized government subsidy recommendations using AI based on your business profile.",
    link: "/ai-advisor",
  },
  {
    title: "Government Schemes",
    icon: "bi-bank",
    color: "success",
    description:
      "Explore Central and State Government subsidy schemes for MSMEs, agriculture, startups and more.",
    link: "/schemes",
  },
  {
    title: "Loan Assistance",
    icon: "bi-cash-stack",
    color: "warning",
    description:
      "Check loan eligibility, compare financing options and receive guidance for business loans.",
    link: "/loans",
  },
  {
    title: "Project Reports",
    icon: "bi-file-earmark-text",
    color: "info",
    description:
      "Generate professional DPRs and project reports for bank loan and subsidy applications.",
    link: "/dpr",
  },
  {
    title: "Eligibility Checker",
    icon: "bi-patch-check",
    color: "danger",
    description:
      "Instantly verify your eligibility for subsidy schemes using our smart assessment engine.",
    link: "/eligibility",
  },
  {
    title: "Expert Consultation",
    icon: "bi-headset",
    color: "secondary",
    description:
      "Connect with subsidy and finance experts for personalized assistance and documentation support.",
    link: "/contact",
  },
];

export default function Services() {
  return (
    <section className="services-section py-5">

      <div className="container">

        <div className="text-center mb-5">

          <span className="section-badge">
            Our Services
          </span>

          <h2 className="section-title mt-3">
            Everything You Need To Secure
            <span className="text-primary"> Government Benefits</span>
          </h2>

          <p className="section-subtitle">
            GoSubsidy combines AI, expert guidance and comprehensive
            government scheme information in one platform.
          </p>

        </div>

        <div className="row g-4">

          {services.map((service, index) => (

            <div
              className="col-lg-4 col-md-6"
              key={index}
            >

              <div className="service-card h-100">

                <div className={`service-icon bg-${service.color}`}>

                  <i className={`bi ${service.icon}`}></i>

                </div>

                <h4 className="mt-4 fw-bold">

                  {service.title}

                </h4>

                <p className="text-muted my-3">

                  {service.description}

                </p>

                <Link
                  to={service.link}
                  className="btn btn-outline-primary mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}