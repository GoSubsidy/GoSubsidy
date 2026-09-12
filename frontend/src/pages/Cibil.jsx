import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PaymentModal from "../components/premium/PaymentModal";
import Footer from "../components/layout/Footer";

export default function Cibil() {
  const [creditData, setCreditData] = useState({
    score: "",
    income: "",
    emi: "",
    utilisation: "",
    delayedPayments: "",
    enquiries: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [showProConsultation, setShowProConsultation] = useState(false);
  const [activeService, setActiveService] = useState(null);

  /* =========================================================
     DATA
  ========================================================= */

  const scoreFactors = [
    {
      icon: "bi-clock-history",
      value: "35%",
      title: "Payment History",
      text: "Your repayment discipline across loans and credit cards.",
    },
    {
      icon: "bi-credit-card-2-front",
      value: "30%",
      title: "Credit Utilisation",
      text: "How much of your available revolving credit you currently use.",
    },
    {
      icon: "bi-calendar2-check",
      value: "15%",
      title: "Credit Age",
      text: "The age and continuity of your active credit relationships.",
    },
    {
      icon: "bi-diagram-3",
      value: "10%",
      title: "Credit Mix",
      text: "The balance between secured and unsecured credit facilities.",
    },
    {
      icon: "bi-search",
      value: "10%",
      title: "Credit Enquiries",
      text: "Recent applications and lender enquiries on your credit profile.",
    },
  ];

  const services = [
    {
      icon: "bi-file-earmark-bar-graph",
      title: "Credit Report Analysis",
      shortText: "Understand your report, accounts, payment history, enquiries and the factors that may influence your score.",
      eyebrow: "UNDERSTAND YOUR REPORT",
      action: "View Credit Report Guide",
      details: [
        "Review active and closed credit accounts.",
        "Check repayment history, outstanding balances and account status.",
        "Review recent credit enquiries and identify unusual activity.",
        "Use the findings to prepare before approaching a lender.",
      ],
      cta: "Start Credit Assessment",
      target: "#credit-check",
    },
    {
      icon: "bi-graph-up-arrow",
      title: "Score Improvement",
      shortText: "Get practical guidance around timely repayments, credit utilisation, enquiries and healthy credit behaviour.",
      eyebrow: "BUILD CREDIT HEALTH",
      action: "See Improvement Steps",
      details: [
        "Prioritise timely EMI and credit-card payments.",
        "Keep revolving credit utilisation under control.",
        "Avoid unnecessary credit applications and repeated hard enquiries.",
        "Review your report regularly and act on genuine errors.",
      ],
      cta: "Analyse My Credit",
      target: "#credit-check",
    },
    {
      icon: "bi-exclamation-diamond",
      title: "Dispute Assistance",
      shortText: "Identify possible inaccuracies such as incorrect account status, duplicate entries or mismatched payment information.",
      eyebrow: "FIND REPORT ERRORS",
      action: "Understand Disputes",
      details: [
        "Check whether every account actually belongs to you.",
        "Look for incorrect overdue, balance or closure information.",
        "Collect supporting documents before raising a dispute.",
        "Follow up with the relevant lender or credit bureau until the correction is reflected.",
      ],
      cta: "Review My Profile",
      target: "#credit-check",
    },
    {
      icon: "bi-bank2",
      title: "Loan Readiness",
      shortText: "See how credit score, EMI burden, utilisation and income can affect your preliminary readiness for new borrowing.",
      eyebrow: "PREPARE FOR FINANCE",
      action: "Check Loan Readiness",
      details: [
        "Review your credit score and repayment profile.",
        "Compare existing EMI obligations with monthly income.",
        "Assess credit-card utilisation and recent enquiries.",
        "Use the assessment as a preparation tool before applying to a lender.",
      ],
      cta: "Run Readiness Check",
      target: "#credit-check",
    },
    {
      icon: "bi-wallet2",
      title: "Debt Management",
      shortText: "Understand your existing EMI burden and identify areas where your monthly debt load may be affecting borrowing capacity.",
      eyebrow: "MANAGE EXISTING DEBT",
      action: "View Debt Guidance",
      details: [
        "Calculate your EMI-to-income position.",
        "Identify high monthly debt commitments.",
        "Avoid taking new credit before understanding repayment capacity.",
        "Use a structured repayment approach to improve financial stability.",
      ],
      cta: "Analyse Debt Burden",
      target: "#credit-check",
    },
    {
      icon: "bi-robot",
      title: "AI Credit Advisor",
      shortText: "Turn your assessment inputs into a structured action plan for credit health and financing preparation.",
      eyebrow: "GOSUBSIDY INTELLIGENCE",
      action: "Open AI Guidance",
      details: [
        "Summarise your current credit-readiness indicators.",
        "Highlight areas that deserve attention first.",
        "Explain utilisation, EMI burden and enquiry behaviour in simple language.",
        "Guide you towards the next GoSubsidy finance step.",
      ],
      cta: "Run AI Assessment",
      target: "#credit-check",
    },
  ];

  /* =========================================================
     INPUT
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCreditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     CREDIT ANALYSIS
  ========================================================= */

  const analyseCredit = () => {
    const score = Number(creditData.score || 0);
    const income = Number(creditData.income || 0);
    const emi = Number(creditData.emi || 0);
    const utilisation = Number(creditData.utilisation || 0);

    if (!score || score < 300 || score > 900) {
      alert("Please enter a valid credit score between 300 and 900.");
      return;
    }

    if (!income || income <= 0) {
      alert("Please enter your monthly income.");
      return;
    }

    let readiness = 40;

    // Credit score
    if (score >= 750) readiness += 30;
    else if (score >= 700) readiness += 24;
    else if (score >= 650) readiness += 17;
    else if (score >= 550) readiness += 8;
    else readiness -= 10;

    // Credit utilisation
    if (utilisation <= 30) readiness += 10;
    else if (utilisation <= 50) readiness += 5;
    else if (utilisation > 75) readiness -= 10;

    // EMI burden
    const emiRatio = income > 0 ? (emi / income) * 100 : 0;

    if (emiRatio <= 30) readiness += 10;
    else if (emiRatio <= 40) readiness += 5;
    else if (emiRatio > 50) readiness -= 15;

    // Delayed payments
    if (creditData.delayedPayments === "None") readiness += 5;
    else if (creditData.delayedPayments === "1 - 2") readiness -= 3;
    else if (creditData.delayedPayments === "3 - 5") readiness -= 8;
    else if (creditData.delayedPayments === "More than 5") readiness -= 15;

    // Recent enquiries
    if (creditData.enquiries === "None") readiness += 5;
    else if (creditData.enquiries === "3 - 5") readiness -= 5;
    else if (creditData.enquiries === "More than 5") readiness -= 10;

    readiness = Math.max(0, Math.min(100, readiness));

    let status = "Needs Improvement";

    if (readiness >= 80) status = "Strong Profile";
    else if (readiness >= 65) status = "Good Profile";
    else if (readiness >= 50) status = "Moderate Profile";

    let scoreStatus = "Needs Attention";

    if (score >= 750) scoreStatus = "Excellent";
    else if (score >= 650) scoreStatus = "Good";
    else if (score >= 550) scoreStatus = "Fair";

    setAnalysis({
      readiness,
      status,
      scoreStatus,
      emiRatio: emiRatio.toFixed(1),
    });

    setTimeout(() => {
      document.getElementById("credit-result")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  /* =========================================================
     LIVE HERO SCORE
  ========================================================= */

  const liveScore = useMemo(() => {
    const score = Number(creditData.score);
    return score >= 300 && score <= 900 ? score : 736;
  }, [creditData.score]);

  const liveScoreStatus = useMemo(() => {
    if (liveScore >= 750) return "Excellent";
    if (liveScore >= 650) return "Good";
    if (liveScore >= 550) return "Fair";
    return "Needs Attention";
  }, [liveScore]);

  const gaugePercent = Math.max(
    0,
    Math.min(100, ((liveScore - 300) / 600) * 100)
  );

  return (
    <main className="gc-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="gc-hero">
        <div className="gc-orb gc-orb-one"></div>
        <div className="gc-orb gc-orb-two"></div>

        <div className="container position-relative">
          <div className="row align-items-center g-5">
            {/* LEFT */}

            <div className="col-lg-6">
              <div className="gc-badge">
                <span className="gc-badge-icon">
                  <i className="bi bi-shield-check"></i>
                </span>
                GOSUBSIDY CREDIT INTELLIGENCE
              </div>

              <h1 className="gc-title">
                Know Your Credit.
                <br />
                <span>Unlock Better</span>
                <br />
                Financing.
              </h1>

              <p className="gc-description">
                Understand your credit health, measure loan readiness and
                receive intelligent guidance before applying for finance.
              </p>

              <div className="gc-actions">
                <a href="#credit-check" className="gc-btn-primary">
                  <i className="bi bi-speedometer2"></i>
                  Analyse Credit
                  <i className="bi bi-arrow-right"></i>
                </a>

                <a href="#score-factors" className="gc-btn-secondary">
                  <i className="bi bi-lightbulb"></i>
                  How Credit Works
                </a>
              </div>

              <div className="gc-trust">
                <div className="gc-trust-item">
                  <span>
                    <i className="bi bi-shield-lock"></i>
                  </span>

                  <div>
                    <strong>Secure</strong>
                    <small>Privacy-first</small>
                  </div>
                </div>

                <div className="gc-trust-item">
                  <span>
                    <i className="bi bi-stars"></i>
                  </span>

                  <div>
                    <strong>AI Powered</strong>
                    <small>Smart guidance</small>
                  </div>
                </div>

                <div className="gc-trust-item">
                  <span>
                    <i className="bi bi-bank2"></i>
                  </span>

                  <div>
                    <strong>Loan Ready</strong>
                    <small>Financial insights</small>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CREDIT DASHBOARD */}

            <div className="col-lg-6">
              <div className="gc-credit-panel">
                <div className="gc-panel-header">
                  <div>
                    <span className="gc-mini-label">CREDIT HEALTH</span>
                    <h3>Your Credit Profile</h3>
                  </div>

                  <div className="gc-online">
                    <i></i>
                    Analysis Ready
                  </div>
                </div>

                {/* CSS GAUGE */}

                <div className="gc-gauge-area">
                  <div className="gc-gauge">
                    <div className="gc-gauge-inner"></div>

                    <div
                      className="gc-needle"
                      style={{
                        transform: `translateX(-50%) rotate(${
                          -90 + gaugePercent * 1.8
                        }deg)`,
                      }}
                    >
                      <span></span>
                    </div>

                    <div className="gc-needle-center"></div>
                  </div>

                  <div className="gc-gauge-labels">
                    <span>300</span>
                    <span>900</span>
                  </div>

                  <div className="gc-score-value">{liveScore}</div>

                  <div className="gc-score-status">
                    <span></span>
                    {liveScoreStatus}
                  </div>
                </div>

                <div className="gc-panel-stats">
                  <div>
                    <span>Loan Readiness</span>
                    <strong>
                      {analysis ? `${analysis.readiness}%` : "Check Now"}
                    </strong>
                  </div>

                  <div>
                    <span>Credit Utilisation</span>
                    <strong>
                      {creditData.utilisation
                        ? `${creditData.utilisation}%`
                        : "--"}
                    </strong>
                  </div>

                  <div>
                    <span>EMI Burden</span>
                    <strong>
                      {analysis ? `${analysis.emiRatio}%` : "--"}
                    </strong>
                  </div>
                </div>

                <a href="#credit-check" className="gc-panel-button">
                  Run Full Credit Assessment
                  <i className="bi bi-arrow-right"></i>
                </a>

                <p className="gc-disclaimer">
                  <i className="bi bi-info-circle"></i>
                  Preliminary assessment for financial guidance. Final lending
                  decisions depend on the lender's policies and verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK STRIP
      ===================================================== */}

      <section className="gc-quick-strip">
        <div className="container">
          <div className="gc-quick-grid">
            <div>
              <span className="gc-quick-icon blue">
                <i className="bi bi-speedometer"></i>
              </span>

              <div>
                <strong>300 – 900</strong>
                <small>Credit Score Range</small>
              </div>
            </div>

            <div>
              <span className="gc-quick-icon green">
                <i className="bi bi-graph-up-arrow"></i>
              </span>

              <div>
                <strong>750+</strong>
                <small>Strong Credit Profile</small>
              </div>
            </div>

            <div>
              <span className="gc-quick-icon orange">
                <i className="bi bi-credit-card"></i>
              </span>

              <div>
                <strong>≤ 30%</strong>
                <small>Healthy Utilisation Goal</small>
              </div>
            </div>

            <div>
              <span className="gc-quick-icon purple">
                <i className="bi bi-bank"></i>
              </span>

              <div>
                <strong>AI Assisted</strong>
                <small>Loan Readiness Analysis</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ASSESSMENT
      ===================================================== */}

      <section className="gc-section" id="credit-check">
        <div className="container">
          <div className="gc-section-heading">
            <div className="gc-section-badge">
              <i className="bi bi-stars"></i>
              SMART CREDIT ASSESSMENT
            </div>

            <h2>Check Your Credit Readiness</h2>

            <p>
              Enter a few basic financial details to generate an instant
              preliminary assessment of your credit and loan readiness.
            </p>
          </div>

          <div className="gc-assessment-layout">
            {/* FORM */}

            <div className="gc-form-card">
              <div className="gc-card-heading">
                <div className="gc-card-heading-icon">
                  <i className="bi bi-person-vcard"></i>
                </div>

                <div>
                  <span>FINANCIAL PROFILE</span>
                  <h3>Tell us about your credit</h3>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="gc-label">Current Credit Score</label>

                  <div className="gc-input">
                    <i className="bi bi-speedometer2"></i>

                    <input
                      type="number"
                      name="score"
                      value={creditData.score}
                      onChange={handleChange}
                      placeholder="Example: 736"
                      min="300"
                      max="900"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="gc-label">Monthly Income</label>

                  <div className="gc-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="income"
                      value={creditData.income}
                      onChange={handleChange}
                      placeholder="Example: 75,000"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="gc-label">Existing Monthly EMI</label>

                  <div className="gc-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="emi"
                      value={creditData.emi}
                      onChange={handleChange}
                      placeholder="Example: 18,000"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="gc-label">
                    Credit Card Utilisation
                  </label>

                  <div className="gc-input">
                    <i className="bi bi-credit-card"></i>

                    <input
                      type="number"
                      name="utilisation"
                      value={creditData.utilisation}
                      onChange={handleChange}
                      placeholder="Example: 25"
                      min="0"
                      max="100"
                    />

                    <span>%</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="gc-label">Delayed Payments</label>

                  <div className="gc-input">
                    <i className="bi bi-calendar-x"></i>

                    <select
                      name="delayedPayments"
                      value={creditData.delayedPayments}
                      onChange={handleChange}
                    >
                      <option value="">Select payment history</option>
                      <option value="None">None</option>
                      <option value="1 - 2">1 - 2</option>
                      <option value="3 - 5">3 - 5</option>
                      <option value="More than 5">More than 5</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="gc-label">Recent Loan Enquiries</label>

                  <div className="gc-input">
                    <i className="bi bi-search"></i>

                    <select
                      name="enquiries"
                      value={creditData.enquiries}
                      onChange={handleChange}
                    >
                      <option value="">Select enquiries</option>
                      <option value="None">None</option>
                      <option value="1 - 2">1 - 2</option>
                      <option value="3 - 5">3 - 5</option>
                      <option value="More than 5">More than 5</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="gc-analyse-btn"
                onClick={analyseCredit}
              >
                <i className="bi bi-stars"></i>
                Analyse My Credit Profile
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            {/* SIDE INFO */}

            <div className="gc-assessment-side">
              <div className="gc-side-top">
                <span className="gc-ai-icon">
                  <i className="bi bi-robot"></i>
                </span>

                <span>GOSUBSIDY AI</span>
              </div>

              <h3>Credit Intelligence Engine</h3>

              <p>
                We evaluate important indicators that may influence your loan
                readiness.
              </p>

              <div className="gc-check-list">
                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Credit score strength
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  EMI-to-income burden
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Credit card utilisation
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Payment behaviour
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Recent credit enquiries
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Overall loan readiness
                </div>
              </div>

              <div className="gc-ai-security">
                <i className="bi bi-shield-lock-fill"></i>

                <div>
                  <strong>Privacy First</strong>
                  <span>
                    Your financial assessment is designed for guidance.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RESULT */}

          {analysis && (
            <div className="gc-result" id="credit-result">
              <div className="gc-result-head">
                <div>
                  <span>GOSUBSIDY CREDIT INTELLIGENCE</span>
                  <h3>Your Credit Readiness Report</h3>
                </div>

                <div className="gc-readiness-number">
                  {analysis.readiness}
                  <small>%</small>
                </div>
              </div>

              <div className="gc-progress">
                <div
                  style={{
                    width: `${analysis.readiness}%`,
                  }}
                ></div>
              </div>

              <div className="gc-result-grid">
                <div>
                  <span>Credit Score</span>
                  <strong>{creditData.score}</strong>
                  <small>{analysis.scoreStatus}</small>
                </div>

                <div>
                  <span>EMI / Income</span>
                  <strong>{analysis.emiRatio}%</strong>
                  <small>Monthly debt burden</small>
                </div>

                <div>
                  <span>Utilisation</span>
                  <strong>{creditData.utilisation || 0}%</strong>
                  <small>Credit card usage</small>
                </div>

                <div>
                  <span>Overall Status</span>
                  <strong>{analysis.status}</strong>
                  <small>Preliminary assessment</small>
                </div>
              </div>

              <div className="gc-result-bottom">
                <div>
                  <i className="bi bi-stars"></i>

                  <span>
                    <strong>Next Step</strong>
                    Continue to loan eligibility for financing options.
                  </span>
                </div>

                <div className="gc-result-actions">
                  <Link to="/loans" className="gc-yellow-btn">
                    Check Loan Eligibility
                    <i className="bi bi-arrow-right"></i>
                  </Link>

                  <button
                    type="button"
                    className="gc-pro-consult-btn"
                    onClick={() => setShowProConsultation(true)}
                  >
                    <i className="bi bi-stars"></i>
                    Pro Consultation ₹2,999
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          SCORE RANGE
      ===================================================== */}

      <section className="gc-range-section">
        <div className="container">
          <div className="gc-section-heading">
            <div className="gc-section-badge">CREDIT SCORE RANGE</div>

            <h2>Where Does Your Score Stand?</h2>

            <p>
              Understand the broad credit-score bands and how your current
              profile may be viewed from a lending-readiness perspective.
            </p>
          </div>

          <div className="gc-spectrum-card">
            <div className="gc-spectrum">
              <div className="gc-spectrum-segment poor"></div>
              <div className="gc-spectrum-segment fair"></div>
              <div className="gc-spectrum-segment good"></div>
              <div className="gc-spectrum-segment excellent"></div>
            </div>

            <div className="gc-spectrum-labels">
              <div>
                <strong>300 – 549</strong>
                <span>Needs Attention</span>
              </div>

              <div>
                <strong>550 – 649</strong>
                <span>Fair</span>
              </div>

              <div>
                <strong>650 – 749</strong>
                <span>Good</span>
              </div>

              <div>
                <strong>750 – 900</strong>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FACTORS
      ===================================================== */}

      <section className="gc-section gc-factor-section" id="score-factors">
        <div className="container">
          <div className="gc-section-heading">
            <div className="gc-section-badge">
              <i className="bi bi-bar-chart-line"></i>
              CREDIT INTELLIGENCE
            </div>

            <h2>What Can Affect Your Credit Profile?</h2>

            <p>
              These are some of the important components commonly considered
              when evaluating overall credit behaviour.
            </p>
          </div>

          <div className="gc-factor-grid">
            {scoreFactors.map((factor, index) => (
              <article className="gc-factor-card" key={index}>
                <div className="gc-factor-top">
                  <span>
                    <i className={`bi ${factor.icon}`}></i>
                  </span>

                  <strong>{factor.value}</strong>
                </div>

                <h4>{factor.title}</h4>
                <p>{factor.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          AI ADVISOR
      ===================================================== */}

      <section className="gc-ai-section">
        <div className="container">
          <div className="gc-ai-card">
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <div className="gc-ai-badge">
                  <i className="bi bi-stars"></i>
                  GOSUBSIDY AI CREDIT ADVISOR
                </div>

                <h2>
                  Turn Credit Data Into
                  <span> Better Financial Decisions.</span>
                </h2>

                <p>
                  GoSubsidy AI helps you understand credit health, existing EMI
                  obligations and potential areas for improving loan readiness.
                </p>

                <div className="gc-ai-features">
                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    Credit health assessment
                  </div>

                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    EMI burden analysis
                  </div>

                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    Utilisation guidance
                  </div>

                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    Loan readiness
                  </div>
                </div>

              </div>

              <div className="col-lg-5">
                <div className="gc-ai-dashboard">
                  <div className="gc-ai-dashboard-head">
                    <span>
                      <i className="bi bi-stars"></i>
                      AI ANALYSIS
                    </span>

                    <small>
                      <i></i>
                      READY
                    </small>
                  </div>

                  <div className="gc-ai-main-score">
                    <span>CREDIT READINESS</span>

                    <strong>
                      {analysis ? `${analysis.readiness}%` : "--"}
                    </strong>

                    <small>
                      {analysis ? analysis.status : "Run Assessment"}
                    </small>
                  </div>

                  <div className="gc-ai-row">
                    <span>Credit Score</span>
                    <strong>{creditData.score || "--"}</strong>
                  </div>

                  <div className="gc-ai-row">
                    <span>Credit Utilisation</span>
                    <strong>
                      {creditData.utilisation
                        ? `${creditData.utilisation}%`
                        : "--"}
                    </strong>
                  </div>

                  <div className="gc-ai-row">
                    <span>EMI Burden</span>
                    <strong>
                      {analysis ? `${analysis.emiRatio}%` : "--"}
                    </strong>
                  </div>

                  <div className="gc-ai-row">
                    <span>Profile Status</span>
                    <strong>{analysis ? analysis.status : "Pending"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="gc-section">
        <div className="container">
          <div className="gc-section-heading">
            <div className="gc-section-badge">
              GOSUBSIDY CREDIT SERVICES
            </div>

            <h2>Build a Stronger Credit Profile</h2>

            <p>
              Access structured financial guidance designed to help you prepare
              before approaching lenders.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <article
                  className="gc-service-card gc-service-card-actionable"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveService(service)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveService(service);
                    }
                  }}
                >
                  <div className="gc-service-topline">
                    <span className="gc-service-eyebrow">{service.eyebrow}</span>
                    <span className="gc-service-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </div>

                  <div className="gc-service-icon">
                    <i className={`bi ${service.icon}`}></i>
                  </div>

                  <h4>{service.title}</h4>

                  <p>{service.shortText}</p>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveService(service);
                    }}
                  >
                    {service.action}
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CREDIT SERVICE INFORMATION MODAL
          ===================================================== */}
      {activeService && (
        <div
          className="gc-service-modal-backdrop"
          role="presentation"
          onClick={() => setActiveService(null)}
        >
          <div
            className="gc-service-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gc-service-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gc-service-modal-close"
              aria-label="Close"
              onClick={() => setActiveService(null)}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="gc-service-modal-icon">
              <i className={`bi ${activeService.icon}`}></i>
            </div>

            <span className="gc-service-modal-eyebrow">
              {activeService.eyebrow}
            </span>

            <h3 id="gc-service-modal-title">{activeService.title}</h3>

            <p className="gc-service-modal-intro">
              {activeService.shortText}
            </p>

            <div className="gc-service-modal-list">
              {activeService.details.map((detail, index) => (
                <div key={index}>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <div className="gc-service-modal-note">
              <i className="bi bi-info-circle"></i>
              <span>
                This is educational and preliminary guidance. Credit bureau
                data and final lending decisions depend on authorised bureau
                records and the respective lender.
              </span>
            </div>

            <div className="gc-service-modal-actions">
              <button
                type="button"
                className="gc-service-modal-secondary"
                onClick={() => setActiveService(null)}
              >
                Close
              </button>

              <a
                href={activeService.target}
                className="gc-service-modal-primary"
                onClick={() => setActiveService(null)}
              >
                {activeService.cta}
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="gc-final-section">
        <div className="container">
          <div className="gc-final-card">
            <div className="gc-final-icon">
              <i className="bi bi-bank2"></i>
            </div>

            <div className="gc-final-copy">
              <span>READY FOR THE NEXT STEP?</span>

              <h2>Turn Your Credit Readiness Into Financing Opportunities.</h2>

              <p>
                Continue to GoSubsidy's loan eligibility and recommendation
                platform.
              </p>
            </div>

            <Link to="/loans" className="gc-final-button">
              Explore Loan Eligibility
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          SHARED GOSUBSIDY FOOTER
          ===================================================== */}
      <Footer />

      {/* =====================================================
          GO-SUBSIDY PAGE BUILD NOTE
          ===================================================== */}
      {/* This page is intentionally branded and structured as a GoSubsidy
          credit-intelligence experience. Any live bureau score must come
          from the authorized production integration; the current analysis
          uses the customer-entered inputs. */}

      {/* =====================================================
          CSS
      ===================================================== */}

      {showProConsultation && (
        <PaymentModal
          product={{
            code: "CIBIL_PRO_CONSULTATION",
            name: "GoSubsidy Pro Credit Analysis & Consultation",
            shortName: "Pro Credit Consultation",
            price: 2999,
            validityDays: 1,
          }}
          onClose={() => setShowProConsultation(false)}
          onSuccess={(payment) => {
            setShowProConsultation(false);
            console.log("GoSubsidy Pro Credit Consultation payment verified:", payment);
            alert(
              "Payment successful. Your Pro Credit Consultation booking request has been received."
            );
          }}
        />
      )}

      <style>{`
        .gc-page{
          --navy:#042f5c;
          --navy2:#064f78;
          --blue:#087cf0;
          --cyan:#00b8c9;
          --teal:#00b894;
          --green:#00b783;
          --yellow:#ffbd00;
          --orange:#f58b00;
          --text:#10233f;
          --muted:#6f8094;
          --line:#e2eaf2;
          --surface:#f5f8fc;

          background:var(--surface);
          color:var(--text);
          overflow:hidden;
        }

        .gc-page *{
          box-sizing:border-box;
        }

        /* ================= HERO ================= */

        .gc-hero{
          position:relative;
          padding:46px 0 50px;
          background:
            radial-gradient(circle at 90% 15%,rgba(0,229,190,.19),transparent 27%),
            radial-gradient(circle at 60% 110%,rgba(25,117,255,.16),transparent 34%),
            linear-gradient(125deg,#032a54 0%,#064e76 55%,#078d83 100%);
          color:#fff;
        }

        .gc-orb{
          position:absolute;
          border-radius:50%;
          filter:blur(2px);
          pointer-events:none;
        }

        .gc-orb-one{
          width:340px;
          height:340px;
          right:-170px;
          bottom:-170px;
          background:rgba(0,239,184,.08);
        }

        .gc-orb-two{
          width:220px;
          height:220px;
          left:-110px;
          top:40px;
          background:rgba(0,126,255,.09);
        }

        .gc-badge{
          display:inline-flex;
          align-items:center;
          gap:9px;
          padding:8px 14px 8px 8px;
          border:1px solid rgba(57,240,207,.28);
          background:rgba(0,218,183,.11);
          border-radius:100px;
          color:#4ff1d2;
          font-size:12px;
          font-weight:800;
          letter-spacing:.25px;
          margin-bottom:16px;
        }

        .gc-badge-icon{
          width:28px;
          height:28px;
          display:grid;
          place-items:center;
          border-radius:50%;
          background:rgba(55,237,207,.14);
        }

        .gc-title{
          margin:0;
          max-width:680px;
          font-size:48px;
          line-height:1.03;
          font-weight:850;
          letter-spacing:-2.2px;
        }

        .gc-title span{
          color:var(--yellow);
        }

        .gc-description{
          max-width:650px;
          margin:18px 0 22px;
          color:#d9e9f4;
          font-size:15px;
          line-height:1.7;
        }

        .gc-actions{
          display:flex;
          flex-wrap:wrap;
          gap:12px;
        }

        .gc-btn-primary,
        .gc-btn-secondary{
          min-height:48px;
          padding:0 18px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          border-radius:12px;
          text-decoration:none;
          font-size:14px;
          font-weight:800;
          transition:.25s ease;
        }

        .gc-btn-primary{
          background:var(--yellow);
          color:#0b2139;
          box-shadow:0 10px 30px rgba(255,189,0,.15);
        }

        .gc-btn-primary:hover{
          color:#0b2139;
          transform:translateY(-2px);
          box-shadow:0 14px 35px rgba(255,189,0,.23);
        }

        .gc-btn-secondary{
          color:#fff;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.28);
        }

        .gc-btn-secondary:hover{
          color:#fff;
          background:rgba(255,255,255,.14);
          transform:translateY(-2px);
        }

        .gc-trust{
          display:flex;
          flex-wrap:wrap;
          gap:28px;
          margin-top:24px;
        }

        .gc-trust-item{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .gc-trust-item > span{
          width:36px;
          height:36px;
          display:grid;
          place-items:center;
          border-radius:10px;
          color:#42efd0;
          background:rgba(255,255,255,.08);
        }

        .gc-trust-item div{
          display:flex;
          flex-direction:column;
        }

        .gc-trust-item strong{
          color:#fff;
          font-size:13px;
        }

        .gc-trust-item small{
          margin-top:2px;
          color:#b8d0e0;
          font-size:11px;
        }

        /* ================= CREDIT PANEL ================= */

        .gc-credit-panel{
          max-width:480px;
          margin-left:auto;
          padding:20px;
          border-radius:22px;
          color:var(--text);
          background:rgba(255,255,255,.98);
          border:1px solid rgba(255,255,255,.65);
          box-shadow:0 32px 80px rgba(0,25,55,.32);
        }

        .gc-panel-header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:20px;
          padding-bottom:18px;
          border-bottom:1px solid #edf1f6;
        }

        .gc-mini-label{
          display:block;
          color:#718398;
          font-size:10px;
          font-weight:800;
          letter-spacing:1px;
          margin-bottom:4px;
        }

        .gc-panel-header h3{
          margin:0;
          font-size:20px;
          font-weight:850;
        }

        .gc-online{
          display:flex;
          align-items:center;
          gap:7px;
          padding:7px 10px;
          border-radius:100px;
          background:#eafbf6;
          color:#009c72;
          font-size:10px;
          font-weight:800;
          white-space:nowrap;
        }

        .gc-online i{
          width:7px;
          height:7px;
          border-radius:50%;
          background:#00c68e;
          box-shadow:0 0 0 4px rgba(0,198,142,.1);
        }

        /* ================= CSS GAUGE ================= */

        .gc-gauge-area{
          position:relative;
          padding:22px 22px 12px;
          text-align:center;
        }

        .gc-gauge{
          width:270px;
          max-width:100%;
          aspect-ratio:2 / 1;
          position:relative;
          margin:0 auto;
          overflow:hidden;
        }

        .gc-gauge::before{
          content:"";
          position:absolute;
          inset:0;
          border-radius:270px 270px 0 0;
          background:conic-gradient(
            from 270deg at 50% 100%,
            #e85b24 0deg 72deg,
            #f68b00 72deg 100deg,
            #ffd000 100deg 126deg,
            #9dcb52 126deg 151deg,
            #08a82d 151deg 180deg,
            transparent 180deg
          );
        }

        .gc-gauge-inner{
          position:absolute;
          left:23px;
          right:23px;
          top:27px;
          bottom:-2px;
          border-radius:224px 224px 0 0;
          background:#fff;
          z-index:2;
        }

        .gc-needle{
          position:absolute;
          left:50%;
          bottom:0;
          width:6px;
          height:100px;
          z-index:4;
          transform-origin:50% 100%;
          transition:transform .6s cubic-bezier(.2,.8,.2,1);
        }

        .gc-needle span{
          position:absolute;
          inset:0;
          border-radius:8px 8px 3px 3px;
          background:#26323c;
        }

        .gc-needle-center{
          position:absolute;
          width:22px;
          height:22px;
          left:50%;
          bottom:-10px;
          transform:translateX(-50%);
          border-radius:50%;
          background:#26323c;
          border:5px solid #e9edf1;
          z-index:5;
        }

        .gc-gauge-labels{
          max-width:285px;
          margin:4px auto 0;
          display:flex;
          justify-content:space-between;
          color:#a2adb9;
          font-size:13px;
          font-weight:700;
        }

        .gc-score-value{
          margin-top:-8px;
          font-size:44px;
          line-height:1;
          font-weight:900;
          letter-spacing:-2px;
          color:#101827;
        }

        .gc-score-status{
          display:inline-flex;
          align-items:center;
          gap:7px;
          margin-top:7px;
          padding:6px 11px;
          border-radius:100px;
          background:#ebfaf4;
          color:#008c68;
          font-size:11px;
          font-weight:850;
          text-transform:uppercase;
          letter-spacing:.5px;
        }

        .gc-score-status span{
          width:7px;
          height:7px;
          border-radius:50%;
          background:#00b982;
        }

        .gc-panel-stats{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:10px;
          margin:7px 0 12px;
        }

        .gc-panel-stats > div{
          min-height:62px;
          padding:10px;
          border-radius:13px;
          background:#f6f9fc;
          border:1px solid #e9eef4;
        }

        .gc-panel-stats span{
          display:block;
          color:#7b8b9d;
          font-size:10px;
          margin-bottom:5px;
        }

        .gc-panel-stats strong{
          display:block;
          color:#132944;
          font-size:14px;
          font-weight:850;
        }

        .gc-panel-button{
          width:100%;
          min-height:46px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          border-radius:12px;
          background:linear-gradient(135deg,#087cf0,#185fd7);
          color:#fff;
          text-decoration:none;
          font-size:13px;
          font-weight:850;
          box-shadow:0 10px 25px rgba(8,124,240,.16);
        }

        .gc-panel-button:hover{
          color:#fff;
        }

        .gc-disclaimer{
          margin:13px 4px 0;
          display:flex;
          align-items:flex-start;
          gap:8px;
          color:#8492a3;
          font-size:9.5px;
          line-height:1.5;
        }

        .gc-disclaimer i{
          color:#087cf0;
        }

        /* ================= QUICK STRIP ================= */

        .gc-quick-strip{
          position:relative;
          z-index:4;
          margin-top:-1px;
          background:#fff;
          border-bottom:1px solid var(--line);
          box-shadow:0 8px 30px rgba(23,55,87,.04);
        }

        .gc-quick-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
        }

        .gc-quick-grid > div{
          display:flex;
          align-items:center;
          gap:13px;
          min-height:78px;
          padding:14px 20px;
          border-right:1px solid #edf1f5;
        }

        .gc-quick-grid > div:last-child{
          border-right:0;
        }

        .gc-quick-icon{
          flex:0 0 38px;
          width:38px;
          height:38px;
          display:grid;
          place-items:center;
          border-radius:12px;
          font-size:18px;
        }

        .gc-quick-icon.blue{
          color:#087cf0;
          background:#eaf4ff;
        }

        .gc-quick-icon.green{
          color:#00a97d;
          background:#e9faf5;
        }

        .gc-quick-icon.orange{
          color:#e89400;
          background:#fff7df;
        }

        .gc-quick-icon.purple{
          color:#6556e8;
          background:#f0efff;
        }

        .gc-quick-grid strong{
          display:block;
          font-size:15px;
          font-weight:850;
        }

        .gc-quick-grid small{
          display:block;
          margin-top:3px;
          color:#7d8b9c;
          font-size:11px;
        }

        /* ================= SECTIONS ================= */

        .gc-section{
          padding:82px 0;
        }

        .gc-section-heading{
          max-width:760px;
          margin:0 auto 44px;
          text-align:center;
        }

        .gc-section-badge{
          display:inline-flex;
          align-items:center;
          gap:7px;
          color:#087cf0;
          font-size:11px;
          font-weight:850;
          letter-spacing:1px;
        }

        .gc-section-heading h2{
          margin:10px 0 12px;
          color:#10233f;
          font-size:38px;
          line-height:1.18;
          font-weight:850;
          letter-spacing:-.8px;
        }

        .gc-section-heading p{
          margin:0 auto;
          max-width:690px;
          color:#718196;
          font-size:15px;
          line-height:1.7;
        }

        /* ================= ASSESSMENT ================= */

        .gc-assessment-layout{
          max-width:1120px;
          margin:auto;
          display:grid;
          grid-template-columns:minmax(0,1.7fr) minmax(300px,.8fr);
          border-radius:24px;
          overflow:hidden;
          background:#fff;
          border:1px solid var(--line);
          box-shadow:0 22px 55px rgba(22,55,90,.08);
        }

        .gc-form-card{
          padding:36px;
        }

        .gc-card-heading{
          display:flex;
          align-items:center;
          gap:14px;
          margin-bottom:29px;
        }

        .gc-card-heading-icon{
          width:49px;
          height:49px;
          display:grid;
          place-items:center;
          flex:0 0 49px;
          border-radius:14px;
          color:#087cf0;
          background:#edf6ff;
          font-size:20px;
        }

        .gc-card-heading span{
          display:block;
          color:#087cf0;
          font-size:9px;
          font-weight:850;
          letter-spacing:1px;
        }

        .gc-card-heading h3{
          margin:4px 0 0;
          font-size:20px;
          font-weight:850;
        }

        .gc-label{
          display:block;
          margin-bottom:8px;
          color:#344a63;
          font-size:12px;
          font-weight:800;
        }

        .gc-input{
          height:54px;
          display:flex;
          align-items:center;
          overflow:hidden;
          border:1px solid #d8e1eb;
          border-radius:11px;
          background:#fff;
          transition:.2s;
        }

        .gc-input:focus-within{
          border-color:#087cf0;
          box-shadow:0 0 0 4px rgba(8,124,240,.07);
        }

        .gc-input i,
        .gc-input > span{
          flex-shrink:0;
          padding:0 14px;
          color:#77889b;
        }

        .gc-input input,
        .gc-input select{
          width:100%;
          height:100%;
          border:0;
          outline:0;
          padding:0 12px;
          background:transparent;
          color:#172b45;
          font-size:13px;
        }

        .gc-input input::placeholder{
          color:#a1adba;
        }

        .gc-analyse-btn{
          width:100%;
          min-height:57px;
          margin-top:29px;
          border:0;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          background:linear-gradient(135deg,#087cf0,#2855e7);
          color:#fff;
          font-size:13px;
          font-weight:850;
          box-shadow:0 12px 28px rgba(8,124,240,.17);
          transition:.2s;
        }

        .gc-analyse-btn:hover{
          transform:translateY(-1px);
        }

        .gc-assessment-side{
          position:relative;
          padding:36px 30px;
          color:#fff;
          background:
            radial-gradient(circle at 90% 5%,rgba(0,224,187,.18),transparent 27%),
            linear-gradient(150deg,#032f5b,#075b78);
        }

        .gc-side-top{
          display:flex;
          align-items:center;
          gap:10px;
          color:#43e7c8;
          font-size:10px;
          font-weight:850;
          letter-spacing:.7px;
        }

        .gc-ai-icon{
          width:38px;
          height:38px;
          display:grid;
          place-items:center;
          border-radius:11px;
          background:#04a8cb;
          color:#fff;
          font-size:15px;
        }

        .gc-assessment-side h3{
          margin:20px 0 10px;
          font-size:25px;
          font-weight:850;
        }

        .gc-assessment-side > p{
          color:#c4d8e6;
          font-size:12px;
          line-height:1.7;
        }

        .gc-check-list{
          display:flex;
          flex-direction:column;
          gap:13px;
          margin-top:25px;
        }

        .gc-check-list div{
          display:flex;
          align-items:center;
          gap:9px;
          color:#e2edf4;
          font-size:12px;
        }

        .gc-check-list i{
          color:#34dfb8;
        }

        .gc-ai-security{
          display:flex;
          gap:12px;
          margin-top:30px;
          padding:16px;
          border:1px solid rgba(255,255,255,.12);
          border-radius:13px;
          background:rgba(255,255,255,.07);
        }

        .gc-ai-security > i{
          color:#37e2bd;
          font-size:19px;
        }

        .gc-ai-security div{
          display:flex;
          flex-direction:column;
        }

        .gc-ai-security strong{
          font-size:12px;
        }

        .gc-ai-security span{
          margin-top:3px;
          color:#aac5d7;
          font-size:10px;
          line-height:1.5;
        }

        /* ================= RESULT ================= */

        .gc-result{
          max-width:1120px;
          margin:28px auto 0;
          padding:31px;
          border-radius:23px;
          color:#fff;
          background:
            radial-gradient(circle at 90% 5%,rgba(0,224,187,.18),transparent 28%),
            linear-gradient(135deg,#032c57,#075e79);
          box-shadow:0 20px 50px rgba(7,48,85,.13);
        }

        .gc-result-head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        }

        .gc-result-head span{
          color:#44e4c4;
          font-size:9px;
          font-weight:850;
          letter-spacing:1px;
        }

        .gc-result-head h3{
          margin:6px 0 0;
          font-size:25px;
          font-weight:850;
        }

        .gc-readiness-number{
          color:var(--yellow);
          font-size:48px;
          font-weight:900;
          line-height:1;
        }

        .gc-readiness-number small{
          font-size:20px;
        }

        .gc-progress{
          height:10px;
          margin:23px 0;
          overflow:hidden;
          border-radius:100px;
          background:rgba(255,255,255,.13);
        }

        .gc-progress div{
          height:100%;
          border-radius:100px;
          background:linear-gradient(90deg,#00d4aa,#ffbd00);
          transition:width .6s ease;
        }

        .gc-result-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }

        .gc-result-grid > div{
          padding:17px;
          border-radius:13px;
          border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.07);
        }

        .gc-result-grid span{
          display:block;
          color:#a9c4d6;
          font-size:10px;
        }

        .gc-result-grid strong{
          display:block;
          margin:5px 0 3px;
          color:#fff;
          font-size:18px;
          font-weight:850;
        }

        .gc-result-grid small{
          color:#87a9be;
          font-size:9px;
        }

        .gc-result-bottom{
          margin-top:18px;
          padding-top:19px;
          border-top:1px solid rgba(255,255,255,.1);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        }

        .gc-result-bottom > div:first-child{
          display:flex;
          align-items:center;
          gap:11px;
          color:#bfd3df;
          font-size:11px;
        }

        .gc-result-bottom > div:first-child > i{
          color:#ffbd00;
          font-size:18px;
        }

        .gc-result-bottom span{
          display:flex;
          flex-direction:column;
        }

        .gc-result-bottom strong{
          color:#fff;
          margin-bottom:2px;
        }

        .gc-result-actions{
          display:flex;
          gap:10px;
        }

        .gc-yellow-btn,
        .gc-outline-btn{
          min-height:38px;
          padding:0 16px;
          border-radius:10px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          text-decoration:none;
          font-size:11px;
          font-weight:850;
        }

        .gc-pro-consult-btn{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          border:1px solid rgba(255,189,0,.35);
          border-radius:14px;
          padding:13px 18px;
          background:linear-gradient(135deg,#0f172a,#123b61);
          color:#fff;
          font-size:13px;
          font-weight:800;
          text-decoration:none;
          cursor:pointer;
          box-shadow:0 10px 24px rgba(15,23,42,.16);
          transition:all .25s ease;
        }

        .gc-pro-consult-btn i:first-child{
          color:#fbbf24;
        }

        .gc-pro-consult-btn:hover{
          transform:translateY(-2px);
          color:#fff;
          box-shadow:0 15px 30px rgba(15,23,42,.22);
          background:linear-gradient(135deg,#111827,#075985);
        }

        .gc-yellow-btn{
          color:#13283f;
          background:#ffbd00;
        }

        .gc-yellow-btn:hover{
          color:#13283f;
        }

        .gc-outline-btn{
          color:#fff;
          border:1px solid rgba(255,255,255,.25);
          background:rgba(255,255,255,.07);
        }

        .gc-outline-btn:hover{
          color:#fff;
        }

        /* ================= SCORE RANGE ================= */

        .gc-range-section{
          padding:82px 0;
          background:#fff;
        }

        .gc-spectrum-card{
          max-width:1080px;
          margin:auto;
          padding:30px 32px;
          border:1px solid #e1e9f1;
          border-radius:20px;
          box-shadow:0 12px 35px rgba(28,57,88,.05);
        }

        .gc-spectrum{
          display:grid;
          grid-template-columns:1.4fr 1fr 1fr 1.2fr;
          height:15px;
          overflow:hidden;
          border-radius:100px;
          gap:3px;
        }

        .gc-spectrum-segment.poor{
          background:#e95a29;
        }

        .gc-spectrum-segment.fair{
          background:#f5a000;
        }

        .gc-spectrum-segment.good{
          background:#a5cd52;
        }

        .gc-spectrum-segment.excellent{
          background:#0aa438;
        }

        .gc-spectrum-labels{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          margin-top:21px;
          gap:15px;
        }

        .gc-spectrum-labels > div{
          display:flex;
          flex-direction:column;
        }

        .gc-spectrum-labels strong{
          font-size:16px;
          font-weight:850;
        }

        .gc-spectrum-labels span{
          margin-top:4px;
          color:#7a899a;
          font-size:11px;
        }

        /* ================= FACTORS ================= */

        .gc-factor-section{
          background:#f5f8fc;
        }

        .gc-factor-grid{
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:16px;
        }

        .gc-factor-card{
          height:100%;
          padding:24px;
          border-radius:18px;
          background:#fff;
          border:1px solid #e1e9f1;
          transition:.25s ease;
        }

        .gc-factor-card:hover{
          transform:translateY(-5px);
          box-shadow:0 18px 40px rgba(28,61,95,.08);
        }

        .gc-factor-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .gc-factor-top span{
          width:46px;
          height:46px;
          display:grid;
          place-items:center;
          border-radius:13px;
          color:#087cf0;
          background:#edf6ff;
          font-size:19px;
        }

        .gc-factor-top strong{
          color:#087cf0;
          font-size:21px;
          font-weight:900;
        }

        .gc-factor-card h4{
          margin:20px 0 8px;
          font-size:16px;
          font-weight:850;
        }

        .gc-factor-card p{
          margin:0;
          color:#718196;
          font-size:11.5px;
          line-height:1.65;
        }

        /* ================= AI ================= */

        .gc-ai-section{
          padding:82px 0;
          background:#fff;
        }

        .gc-ai-card{
          position:relative;
          overflow:hidden;
          padding:52px;
          border-radius:27px;
          color:#fff;
          background:
            radial-gradient(circle at 92% 10%,rgba(0,225,185,.17),transparent 27%),
            linear-gradient(135deg,#032d59,#075e79);
          box-shadow:0 25px 60px rgba(10,49,84,.13);
        }

        .gc-ai-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          color:#43e7c8;
          font-size:11px;
          font-weight:850;
          letter-spacing:.7px;
        }

        .gc-ai-card h2{
          max-width:670px;
          margin:14px 0 15px;
          font-size:39px;
          line-height:1.15;
          font-weight:850;
          letter-spacing:-1px;
        }

        .gc-ai-card h2 span{
          color:#ffbd00;
        }

        .gc-ai-card p{
          max-width:670px;
          color:#c6d9e6;
          font-size:14px;
          line-height:1.7;
        }

        .gc-ai-features{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
          margin:25px 0;
        }

        .gc-ai-features div{
          color:#e0edf4;
          font-size:12px;
        }

        .gc-ai-features i{
          margin-right:8px;
          color:#34dfb8;
        }

        .gc-ai-button{
          min-height:49px;
          padding:0 19px;
          display:inline-flex;
          align-items:center;
          gap:9px;
          border-radius:11px;
          color:#10233f;
          background:#ffbd00;
          text-decoration:none;
          font-size:12px;
          font-weight:850;
        }

        .gc-ai-button:hover{
          color:#10233f;
        }

        .gc-ai-dashboard{
          padding:23px;
          border-radius:19px;
          border:1px solid rgba(255,255,255,.15);
          background:rgba(255,255,255,.08);
          backdrop-filter:blur(10px);
        }

        .gc-ai-dashboard-head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding-bottom:15px;
          color:#bcd1df;
          font-size:10px;
          font-weight:850;
        }

        .gc-ai-dashboard-head small{
          display:flex;
          align-items:center;
          gap:6px;
          color:#3de0bb;
          font-size:9px;
        }

        .gc-ai-dashboard-head small i{
          width:6px;
          height:6px;
          border-radius:50%;
          background:#3de0bb;
        }

        .gc-ai-main-score{
          padding:24px 0;
          text-align:center;
          border-top:1px solid rgba(255,255,255,.08);
          border-bottom:1px solid rgba(255,255,255,.1);
        }

        .gc-ai-main-score span{
          display:block;
          color:#91aec1;
          font-size:9px;
          letter-spacing:1px;
        }

        .gc-ai-main-score strong{
          display:block;
          margin:5px 0;
          font-size:44px;
          line-height:1;
          font-weight:900;
        }

        .gc-ai-main-score small{
          color:#43e7c8;
          font-size:11px;
        }

        .gc-ai-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:12px 2px;
          border-bottom:1px solid rgba(255,255,255,.08);
          font-size:11px;
        }

        .gc-ai-row span{
          color:#abc3d3;
        }

        /* ================= SERVICES ================= */

        .gc-service-card{
          height:100%;
          padding:28px;
          border-radius:19px;
          border:1px solid #e1e9f1;
          background:#fff;
          transition:.25s ease;
        }

        .gc-service-card:hover{
          transform:translateY(-5px);
          box-shadow:0 18px 45px rgba(28,61,95,.08);
        }

        .gc-service-icon{
          width:50px;
          height:50px;
          display:grid;
          place-items:center;
          border-radius:14px;
          background:#edf6ff;
          color:#087cf0;
          font-size:21px;
        }

        .gc-service-card h4{
          margin:19px 0 9px;
          font-size:15px;
          font-weight:850;
        }

        .gc-service-card p{
          min-height:62px;
          margin:0 0 17px;
          color:#718196;
          font-size:12px;
          line-height:1.7;
        }

        .gc-service-card button{
          padding:0;
          border:0;
          background:none;
          color:#087cf0;
          font-size:11px;
          font-weight:850;
        }

        .gc-service-card button i{
          margin-left:7px;
        }

        /* ================= ACTIONABLE SERVICES ================= */

        .gc-service-card-actionable{
          position:relative;
          cursor:pointer;
          overflow:hidden;
        }

        .gc-service-card-actionable::after{
          content:"";
          position:absolute;
          left:0;
          right:0;
          bottom:0;
          height:3px;
          background:linear-gradient(90deg,#087cf0,#00b894);
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .25s ease;
        }

        .gc-service-card-actionable:hover::after,
        .gc-service-card-actionable:focus-visible::after{
          transform:scaleX(1);
        }

        .gc-service-card-actionable:focus-visible{
          outline:3px solid rgba(8,124,240,.18);
          outline-offset:3px;
        }

        .gc-service-topline{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:14px;
        }

        .gc-service-eyebrow{
          color:#087cf0;
          font-size:9px;
          font-weight:900;
          letter-spacing:.9px;
        }

        .gc-service-arrow{
          width:30px;
          height:30px;
          display:grid;
          place-items:center;
          border-radius:50%;
          color:#087cf0;
          background:#edf6ff;
          transition:.2s ease;
        }

        .gc-service-card-actionable:hover .gc-service-arrow{
          color:#fff;
          background:#087cf0;
          transform:translate(2px,-2px);
        }

        .gc-service-card-actionable p{
          min-height:78px;
        }

        .gc-service-card-actionable button{
          display:inline-flex;
          align-items:center;
          gap:5px;
          cursor:pointer;
        }

        /* ================= SERVICE MODAL ================= */

        .gc-service-modal-backdrop{
          position:fixed;
          inset:0;
          z-index:9999;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          background:rgba(3,25,48,.68);
          backdrop-filter:blur(7px);
        }

        .gc-service-modal{
          position:relative;
          width:min(620px,100%);
          max-height:min(720px,calc(100vh - 40px));
          overflow:auto;
          padding:32px;
          border-radius:24px;
          background:#fff;
          color:#10233f;
          border:1px solid #e3ebf3;
          box-shadow:0 30px 90px rgba(0,0,0,.28);
          animation:gcServiceModalIn .22s ease-out;
        }

        @keyframes gcServiceModalIn{
          from{
            opacity:0;
            transform:translateY(14px) scale(.98);
          }
          to{
            opacity:1;
            transform:translateY(0) scale(1);
          }
        }

        .gc-service-modal-close{
          position:absolute;
          top:16px;
          right:16px;
          width:36px;
          height:36px;
          border:1px solid #e2eaf2;
          border-radius:50%;
          background:#f7f9fc;
          color:#53657a;
          cursor:pointer;
        }

        .gc-service-modal-close:hover{
          background:#edf4fb;
          color:#10233f;
        }

        .gc-service-modal-icon{
          width:58px;
          height:58px;
          display:grid;
          place-items:center;
          margin-bottom:18px;
          border-radius:16px;
          background:#edf6ff;
          color:#087cf0;
          font-size:24px;
        }

        .gc-service-modal-eyebrow{
          color:#087cf0;
          font-size:10px;
          font-weight:900;
          letter-spacing:1px;
        }

        .gc-service-modal h3{
          margin:7px 45px 9px 0;
          font-size:27px;
          line-height:1.2;
          font-weight:900;
        }

        .gc-service-modal-intro{
          margin:0;
          color:#66788c;
          font-size:13px;
          line-height:1.7;
        }

        .gc-service-modal-list{
          display:flex;
          flex-direction:column;
          gap:12px;
          margin:24px 0;
        }

        .gc-service-modal-list > div{
          display:flex;
          align-items:flex-start;
          gap:10px;
          padding:12px 14px;
          border:1px solid #e7edf3;
          border-radius:12px;
          background:#f9fbfd;
          color:#334b64;
          font-size:12px;
          line-height:1.55;
        }

        .gc-service-modal-list i{
          flex:0 0 auto;
          margin-top:2px;
          color:#00a77d;
        }

        .gc-service-modal-note{
          display:flex;
          align-items:flex-start;
          gap:10px;
          padding:13px 14px;
          border-radius:12px;
          background:#f1f7ff;
          color:#58708a;
          font-size:10.5px;
          line-height:1.55;
        }

        .gc-service-modal-note i{
          color:#087cf0;
          margin-top:2px;
        }

        .gc-service-modal-actions{
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:22px;
        }

        .gc-service-modal-secondary,
        .gc-service-modal-primary{
          min-height:44px;
          padding:0 17px;
          border-radius:10px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          font-size:12px;
          font-weight:850;
          text-decoration:none;
          cursor:pointer;
        }

        .gc-service-modal-secondary{
          border:1px solid #dce5ee;
          background:#fff;
          color:#53677d;
        }

        .gc-service-modal-primary{
          border:0;
          background:linear-gradient(135deg,#087cf0,#2855e7);
          color:#fff;
        }

        .gc-service-modal-primary:hover{
          color:#fff;
        }

        /* ================= FINAL CTA ================= */

        .gc-final-section{
          padding:0 0 80px;
        }

        .gc-final-card{
          padding:32px 36px;
          display:flex;
          align-items:center;
          gap:22px;
          border-radius:22px;
          color:#fff;
          background:linear-gradient(135deg,#087cf0,#3150e6);
          box-shadow:0 20px 45px rgba(34,86,203,.18);
        }

        .gc-final-icon{
          flex:0 0 62px;
          width:62px;
          height:62px;
          display:grid;
          place-items:center;
          border-radius:17px;
          background:rgba(255,255,255,.14);
          font-size:26px;
        }

        .gc-final-copy{
          flex:1;
        }

        .gc-final-copy > span{
          color:#c6e6ff;
          font-size:9px;
          font-weight:850;
          letter-spacing:1px;
        }

        .gc-final-copy h2{
          margin:6px 0;
          font-size:25px;
          font-weight:850;
        }

        .gc-final-copy p{
          margin:0;
          color:#dceaff;
          font-size:12px;
        }

        .gc-final-button{
          flex-shrink:0;
          min-height:50px;
          padding:0 20px;
          display:inline-flex;
          align-items:center;
          gap:9px;
          border-radius:11px;
          background:#fff;
          color:#087cf0;
          text-decoration:none;
          font-size:12px;
          font-weight:850;
        }

        /* ================= RESPONSIVE ================= */

        @media(max-width:1199px){
          .gc-title{
            font-size:43px;
          }

          .gc-factor-grid{
            grid-template-columns:repeat(3,1fr);
          }
        }

        @media(max-width:991px){
          .gc-hero{
            padding:42px 0;
          }

          .gc-title{
            font-size:40px;
          }

          .gc-credit-panel{
            margin:0 auto;
          }

          .gc-quick-grid{
            grid-template-columns:1fr 1fr;
          }

          .gc-quick-grid > div:nth-child(2){
            border-right:0;
          }

          .gc-assessment-layout{
            grid-template-columns:1fr;
          }

          .gc-result-grid{
            grid-template-columns:1fr 1fr;
          }

          .gc-result-bottom{
            align-items:flex-start;
            flex-direction:column;
          }

          .gc-ai-card{
            padding:38px;
          }

          .gc-final-card{
            align-items:flex-start;
            flex-wrap:wrap;
          }
        }

        @media(max-width:767px){
          .gc-title{
            font-size:36px;
            letter-spacing:-1px;
          }

          .gc-description{
            font-size:15px;
          }

          .gc-section,
          .gc-range-section,
          .gc-ai-section{
            padding:65px 0;
          }

          .gc-section-heading h2{
            font-size:31px;
          }

          .gc-factor-grid{
            grid-template-columns:1fr 1fr;
          }

          .gc-spectrum-labels{
            grid-template-columns:1fr 1fr;
          }

          .gc-ai-features{
            grid-template-columns:1fr;
          }

          .gc-ai-card h2{
            font-size:32px;
          }
        }

        @media(max-width:575px){
          .gc-service-modal-backdrop{
            align-items:flex-end;
            padding:10px;
          }

          .gc-service-modal{
            max-height:calc(100vh - 20px);
            padding:25px 20px 20px;
            border-radius:22px 22px 16px 16px;
          }

          .gc-service-modal h3{
            font-size:23px;
          }

          .gc-service-modal-actions{
            flex-direction:column-reverse;
          }

          .gc-service-modal-secondary,
          .gc-service-modal-primary{
            width:100%;
          }

          .gc-hero{
            padding:34px 0;
          }

          .gc-title{
            font-size:34px;
          }

          .gc-actions{
            flex-direction:column;
          }

          .gc-btn-primary,
          .gc-btn-secondary{
            width:100%;
          }

          .gc-trust{
            gap:15px;
          }

          .gc-credit-panel{
            padding:18px;
          }

          .gc-panel-header{
            flex-direction:column;
          }

          .gc-gauge{
            width:250px;
          }

          .gc-needle{
            height:93px;
          }

          .gc-panel-stats{
            grid-template-columns:1fr;
          }

          .gc-quick-grid{
            grid-template-columns:1fr;
          }

          .gc-quick-grid > div{
            border-right:0;
            border-bottom:1px solid #edf1f5;
          }

          .gc-form-card,
          .gc-assessment-side{
            padding:24px;
          }

          .gc-result{
            padding:23px;
          }

          .gc-result-head{
            align-items:flex-start;
          }

          .gc-result-grid,
          .gc-factor-grid,
          .gc-spectrum-labels{
            grid-template-columns:1fr;
          }

          .gc-result-actions{
            width:100%;
            flex-direction:column;
          }

          .gc-yellow-btn,
          .gc-outline-btn,
          .gc-pro-consult-btn{
            width:100%;
          }

          .gc-spectrum-card{
            padding:23px;
          }

          .gc-ai-card{
            padding:27px;
          }

          .gc-final-card{
            padding:27px;
          }

          .gc-final-button{
            width:100%;
            justify-content:center;
          }
        }
      `}</style>
    </main>
  );
}