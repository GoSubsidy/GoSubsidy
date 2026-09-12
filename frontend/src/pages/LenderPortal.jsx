import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LenderPortal() {
  const location = useLocation();
  const navigate = useNavigate();

  const application = location.state?.application || {};

  // Support the application structure sent by Loans.jsx.
  const applicant = application.applicant || {};
  const kyc = application.kyc || {};
  const financial = application.financial || {};

  const loanType =
    application.loanType ||
    application.loan_type ||
    application.selectedLoan ||
    "Selected Loan";

  const applicantName =
    applicant.fullName ||
    applicant.name ||
    kyc.fullName ||
    kyc.name ||
    application.name ||
    "Applicant";

  const loanAmount =
    financial.loanAmount ||
    financial.requiredAmount ||
    financial.amount ||
    application.amount ||
    application.loanAmount ||
    "Based on eligibility";

  const locationText =
    applicant.district ||
    kyc.district ||
    application.district ||
    applicant.state ||
    kyc.state ||
    application.state ||
    "Profile based";

  const lenders = [
    {
      id: 1,
      name: "State Bank of India",
      type: "Bank",
      category: "Business & MSME Lending",
      amount: "Up to ₹5 Crore",
      rate: "Competitive rates",
      processing: "Online Application",
      icon: "bi-bank",
      badge: "Government Bank",
    },
    {
      id: 2,
      name: "HDFC Bank",
      type: "Bank",
      category: "Business & Personal Loans",
      amount: "Up to ₹2 Crore",
      rate: "Competitive rates",
      processing: "Digital Application",
      icon: "bi-bank2",
      badge: "Popular",
    },
    {
      id: 3,
      name: "ICICI Bank",
      type: "Bank",
      category: "Business & Personal Finance",
      amount: "Up to ₹2 Crore",
      rate: "Competitive rates",
      processing: "Digital Application",
      icon: "bi-building",
      badge: "Recommended",
    },
    {
      id: 4,
      name: "Axis Bank",
      type: "Bank",
      category: "MSME & Business Loans",
      amount: "Up to ₹5 Crore",
      rate: "Competitive rates",
      processing: "Online Application",
      icon: "bi-bank",
      badge: "Matched",
    },
    {
      id: 5,
      name: "Bajaj Finance",
      type: "NBFC",
      category: "Personal & Business Finance",
      amount: "Subject to eligibility",
      rate: "Based on profile",
      processing: "Digital Application",
      icon: "bi-credit-card",
      badge: "NBFC",
    },
    {
      id: 6,
      name: "Other Lending Partners",
      type: "NBFC / Lender",
      category: "Multiple Loan Products",
      amount: "Based on eligibility",
      rate: "Profile dependent",
      processing: "Partner Application",
      icon: "bi-buildings",
      badge: "More Options",
    },
  ];

  const handleContinue = (lender) => {
    /*
      IMPORTANT:
      For now this keeps the applicant inside GoSubsidy.

      Later this function can be connected to:
      - Bank API
      - NBFC API
      - Lead-generation API
      - Partner lender portal
      - Redirect URL
    */

    navigate("/loan-application", {
      state: {
        lender,
        application,
        source: "GoSubsidy LenderHub",
      },
    });
  };

  return (
    <div className="lender-portal-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="lender-hero">

        <div className="container">

          <div className="row align-items-center g-4">

            <div className="col-lg-8">

              <span className="lender-eyebrow">
                <i className="bi bi-stars"></i>
                GOSUBSIDY LENDERHUB
              </span>

              <h1>
                Find Your Financing Partner.
                <span> Choose with Confidence.</span>
              </h1>

              <p>
                Based on the information provided during your application,
                GoSubsidy has identified lending options that may be suitable
                for your financial requirement.
              </p>

              <div className="lender-trust-row">

                <span>
                  <i className="bi bi-shield-check"></i>
                  Secure
                </span>

                <span>
                  <i className="bi bi-cpu"></i>
                  AI Assisted
                </span>

                <span>
                  <i className="bi bi-bank"></i>
                  Bank & NBFC Options
                </span>

                <span>
                  <i className="bi bi-arrow-right-circle"></i>
                  Continue Online
                </span>

              </div>

            </div>

            <div className="col-lg-4">

              <div className="application-summary">

                <div className="summary-icon">
                  <i className="bi bi-check2-circle"></i>
                </div>

                <div>

                  <small>
                    APPLICATION STATUS
                  </small>

                  <h4>
                    Ready for Lender Matching
                  </h4>

                  <p>
                    Your application information is ready to continue.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          APPLICATION SUMMARY
      ===================================================== */}

      <section className="container">

        <div className="application-strip">

          <div>
            <small>Loan Requirement</small>
            <strong>
              {application.loanType || "Selected Loan"}
            </strong>
          </div>

          <div>
            <small>Applicant</small>
            <strong>
              {application.name || "Applicant"}
            </strong>
          </div>

          <div>
            <small>Project / Loan Amount</small>
            <strong>
              {application.amount || "Based on eligibility"}
            </strong>
          </div>

          <div>
            <small>Status</small>
            <strong className="status-ready">
              <i className="bi bi-circle-fill"></i>
              Ready
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          LENDER MATCHING
      ===================================================== */}

      <section className="container lender-section">

        <div className="section-heading">

          <div>

            <span>
              GOSUBSIDY LENDER MATCHING
            </span>

            <h2>
              Recommended Lending Partners
            </h2>

            <p>
              Compare available lending options and continue with the
              lender that best suits your requirement.
            </p>

          </div>

          <div className="match-score">

            <i className="bi bi-stars"></i>

            <div>
              <small>AI MATCHING</small>
              <strong>Profile Based</strong>
            </div>

          </div>

        </div>


        {/* =====================================================
            LENDER CARDS
        ===================================================== */}

        <div className="row g-4">

          {lenders.map((lender) => (

            <div
              className="col-xl-4 col-lg-6"
              key={lender.id}
            >

              <div className="lender-card">

                <div className="lender-card-top">

                  <div className="lender-logo">
                    <i className={`bi ${lender.icon}`}></i>
                  </div>

                  <span className="lender-badge">
                    {lender.badge}
                  </span>

                </div>


                <h3>
                  {lender.name}
                </h3>

                <p className="lender-type">
                  {lender.type}
                </p>

                <div className="lender-category">
                  {lender.category}
                </div>


                <div className="lender-details">

                  <div>
                    <i className="bi bi-cash-stack"></i>
                    <span>
                      <small>Loan Amount</small>
                      <strong>{lender.amount}</strong>
                    </span>
                  </div>

                  <div>
                    <i className="bi bi-percent"></i>
                    <span>
                      <small>Interest</small>
                      <strong>{lender.rate}</strong>
                    </span>
                  </div>

                  <div>
                    <i className="bi bi-lightning-charge"></i>
                    <span>
                      <small>Process</small>
                      <strong>{lender.processing}</strong>
                    </span>
                  </div>

                </div>


                <button
                  className="btn lender-continue-btn"
                  onClick={() => handleContinue(lender)}
                >

                  Continue with {lender.name}

                  <i className="bi bi-arrow-right"></i>

                </button>


                <div className="lender-secure">

                  <i className="bi bi-shield-lock"></i>

                  You will continue through the applicable
                  lender or authorized partner process.

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          BOTTOM INFORMATION
      ===================================================== */}

      <section className="container">

        <div className="lender-info-box">

          <div className="info-icon">
            <i className="bi bi-robot"></i>
          </div>

          <div>

            <h4>
              Need help choosing a lender?
            </h4>

            <p>
              GoSubsidy can help you understand the differences between
              banks, NBFCs and other lending partners based on your
              declared requirement.
            </p>

          </div>

          <Link
            to="/ai-advisor"
            className="btn btn-outline-primary"
          >
            Ask GoSubsidy AI
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>

        </div>

      </section>


      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <section className="container lender-disclaimer">

        <i className="bi bi-info-circle"></i>

        <p>
          GoSubsidy provides technology-enabled guidance and lender
          discovery. Loan approval, interest rate, amount, documentation,
          processing and sanction are determined by the respective
          bank, NBFC or lending partner according to its policies.

        </p>

      </section>

    </div>
  );
}