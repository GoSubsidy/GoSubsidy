import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="customer-loading">
        <div className="customer-loader-ring" />
        <strong>Preparing your GoSubsidy dashboard</strong>
        <span>Please wait a moment...</span>
      </div>
    );
  }

  if (!user) return null;

  const email = user.email || "Customer";
  const metadata = user.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    email.split("@")[0] ||
    "Customer";

  const initials =
    name.split(" ").filter(Boolean).slice(0, 2)
      .map((word) => word[0]).join("").toUpperCase() || "GS";

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const services = [
    { icon:"bi-bank", eyebrow:"GOVERNMENT SUPPORT", title:"Government Schemes",
      text:"Discover subsidies, incentives and government benefit programmes.",
      action:"Explore Schemes", route:"/schemes", tone:"green", stat:"12+", statText:"opportunities" },
    { icon:"bi-speedometer2", eyebrow:"CREDIT INTELLIGENCE", title:"CIBIL & Credit",
      text:"Understand your credit readiness before approaching lenders.",
      action:"Check Credit", route:"/cibil", tone:"blue", stat:"01", statText:"credit check" },
    { icon:"bi-file-earmark-bar-graph", eyebrow:"PROJECT INTELLIGENCE", title:"DPR Intelligence",
      text:"Prepare a professional project report for funding discussions.",
      action:"Create DPR", route:"/dpr", tone:"purple", stat:"PRO", statText:"DPR tools" },
    { icon:"bi-cash-stack", eyebrow:"FINANCIAL SUPPORT", title:"Loan Assistance",
      text:"Explore financing options and improve your loan readiness.",
      action:"Explore Loans", route:"/loans", tone:"orange", stat:"READY", statText:"to explore" },
    { icon:"bi-calculator", eyebrow:"FINANCE TOOL", title:"EMI Calculator",
      text:"Estimate EMI, interest, repayment and financing requirements.",
      action:"Calculate EMI", route:"/subsidy-loan-emi-calculator", tone:"cyan", stat:"FREE", statText:"calculator" },
    { icon:"bi-shield-check", eyebrow:"PROTECTION", title:"Insurance",
      text:"Explore insurance services relevant to your personal or business needs.",
      action:"Explore Insurance", route:"/insurance", tone:"red", stat:"SAFE", statText:"coverage" },
  ];

  const journey = [
    { number:"01", icon:"bi-person-check", title:"Complete Profile",
      text:"Keep your customer details ready.", route:"/customer/profile", done:true },
    { number:"02", icon:"bi-search", title:"Discover",
      text:"Find schemes and financial support.", route:"/schemes" },
    { number:"03", icon:"bi-file-earmark-check", title:"Prepare",
      text:"Build your DPR and credit readiness.", route:"/dpr" },
    { number:"04", icon:"bi-send-check", title:"Move Forward",
      text:"Take the next financing step.", route:"/loans" },
  ];

  return (
    <div className="customer-dashboard">
      <div className="customer-mini-bar">
        <div className="customer-container mini-bar-inner">
          <span><i className="bi bi-shield-check" /> Your GoSubsidy customer portal</span>
          <span className="mini-bar-status"><i className="bi bi-circle-fill" /> Account active</span>
        </div>
      </div>

      <section className="customer-topbar">
        <div className="customer-container topbar-inner">
          <div className="customer-user">
            <div className="customer-avatar">{initials}</div>
            <div>
              <span>Welcome back</span>
              <strong>{name}</strong>
              <small>{email}</small>
            </div>
          </div>
          <div className="customer-top-actions">
            <button type="button" className="customer-icon-btn" title="Notifications"
              onClick={() => window.alert("No new notifications.")}>
              <i className="bi bi-bell" /><b />
            </button>
            <button type="button" className="customer-profile-btn"
              onClick={() => navigate("/customer/profile")}>
              <i className="bi bi-person-circle" /><span>My Profile</span>
            </button>
            <button type="button" className="customer-logout-btn"
              onClick={handleLogout} title="Logout">
              <i className="bi bi-box-arrow-right" />
            </button>
          </div>
        </div>
      </section>

      <section className="customer-hero">
        <div className="customer-container hero-grid">
          <div className="hero-copy">
            <div className="hero-badge">
              <i className="bi bi-stars" /> GOSUBSIDY CUSTOMER INTELLIGENCE <span>●</span>
            </div>
            <h1>Your financial<br />journey,<span> simplified.</span></h1>
            <p>
              Discover government support, understand your credit, prepare your
              project and move towards the right financial opportunities — all from one place.
            </p>
            <div className="hero-actions">
              <Link to="/schemes" className="hero-primary">
                <i className="bi bi-search" /> Find My Opportunities <i className="bi bi-arrow-up-right" />
              </Link>
              <Link to="/cibil" className="hero-secondary">
                <i className="bi bi-speedometer2" /> Check Credit
              </Link>
            </div>
            <div className="hero-trust-row">
              <span><i className="bi bi-check-circle-fill" /> One account</span>
              <span><i className="bi bi-check-circle-fill" /> Multiple services</span>
              <span><i className="bi bi-check-circle-fill" /> Guided journey</span>
            </div>
          </div>

          <div className="hero-dashboard-card">
            <div className="hero-card-top">
              <div><span>Your GoSubsidy snapshot</span><strong>Financial Readiness</strong></div>
              <div className="hero-score"><strong>01</strong><span>Profile</span></div>
            </div>
            <div className="readiness-ring-wrap">
              <div className="readiness-ring">
                <div><strong>25%</strong><span>Journey started</span></div>
              </div>
              <div className="readiness-copy">
                <span>Next best action</span>
                <strong>Discover your opportunities</strong>
                <p>Start with schemes that may match your needs.</p>
                <Link to="/schemes">Explore now <i className="bi bi-arrow-right" /></Link>
              </div>
            </div>
            <div className="hero-metrics">
              <div><i className="bi bi-bank" /><span><strong>12+</strong>Scheme opportunities</span></div>
              <div><i className="bi bi-graph-up-arrow" /><span><strong>Credit</strong>Readiness support</span></div>
              <div><i className="bi bi-file-earmark-text" /><span><strong>DPR</strong>Project intelligence</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="customer-quick-section">
        <div className="customer-container">
          <div className="section-kicker">QUICK ACCESS</div>
          <div className="quick-grid">
            <Link to="/schemes" className="quick-card quick-green"><div className="quick-icon"><i className="bi bi-bank" /></div><div><span>Government</span><strong>Find Schemes</strong></div><i className="bi bi-arrow-up-right quick-arrow" /></Link>
            <Link to="/cibil" className="quick-card quick-blue"><div className="quick-icon"><i className="bi bi-credit-card-2-front" /></div><div><span>Credit</span><strong>Check Readiness</strong></div><i className="bi bi-arrow-up-right quick-arrow" /></Link>
            <Link to="/dpr" className="quick-card quick-purple"><div className="quick-icon"><i className="bi bi-file-earmark-bar-graph" /></div><div><span>Project</span><strong>Create DPR</strong></div><i className="bi bi-arrow-up-right quick-arrow" /></Link>
            <Link to="/subsidy-loan-emi-calculator" className="quick-card quick-orange"><div className="quick-icon"><i className="bi bi-calculator" /></div><div><span>Finance</span><strong>Calculate EMI</strong></div><i className="bi bi-arrow-up-right quick-arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="customer-services">
        <div className="customer-container">
          <div className="section-heading-row">
            <div>
              <div className="section-kicker">YOUR GO SUBSIDY SERVICES</div>
              <h2>Everything you need to <span>move forward.</span></h2>
              <p>Choose a service and continue your financial journey.</p>
            </div>
            <Link to="/schemes" className="section-link">View opportunities <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <Link to={service.route} className={`modern-service-card ${service.tone}`} key={service.title}>
                <div className="service-card-top">
                  <div className="service-icon"><i className={`bi ${service.icon}`} /></div>
                  <span className="service-stat"><strong>{service.stat}</strong>{service.statText}</span>
                </div>
                <span className="service-eyebrow">{service.eyebrow}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="service-action">{service.action} <i className="bi bi-arrow-up-right" /></div>
                <div className="card-shine" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="customer-journey">
        <div className="customer-container">
          <div className="journey-panel">
            <div className="journey-copy">
              <div className="section-kicker light">YOUR FINANCIAL JOURNEY</div>
              <h2>Build your<span> readiness.</span></h2>
              <p>
                Follow a simple path from discovery to financial preparation.
                You can return to any step whenever you need.
              </p>
              <div className="journey-progress">
                <div><span>Journey progress</span><strong>25%</strong></div>
                <div className="progress-track"><span /></div>
              </div>
            </div>
            <div className="journey-steps-modern">
              {journey.map((step, index) => (
                <React.Fragment key={step.number}>
                  <Link to={step.route} className={`journey-step-modern ${step.done ? "done" : ""}`}>
                    <div className="journey-number">{step.done ? <i className="bi bi-check-lg" /> : step.number}</div>
                    <div className="journey-step-icon"><i className={`bi ${step.icon}`} /></div>
                    <div className="journey-step-text"><strong>{step.title}</strong><span>{step.text}</span></div>
                    <i className="bi bi-arrow-up-right journey-arrow" />
                  </Link>
                  {index < journey.length - 1 && <div className="journey-connector" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="customer-recommendations">
        <div className="customer-container">
          <div className="section-heading-row">
            <div>
              <div className="section-kicker">RECOMMENDED NEXT STEPS</div>
              <h2>Start with these <span>opportunities.</span></h2>
              <p>Three practical places to begin from your dashboard.</p>
            </div>
          </div>
          <div className="recommendation-grid">
            <Link to="/schemes" className="recommendation-card">
              <div className="recommendation-number">01</div><div className="recommendation-icon green"><i className="bi bi-bank" /></div>
              <div className="recommendation-content"><span>GOVERNMENT SUPPORT</span><h3>Find Eligible Schemes</h3><p>Explore subsidies, incentives and government support.</p></div>
              <i className="bi bi-arrow-up-right" />
            </Link>
            <Link to="/cibil" className="recommendation-card">
              <div className="recommendation-number">02</div><div className="recommendation-icon blue"><i className="bi bi-speedometer2" /></div>
              <div className="recommendation-content"><span>CREDIT INTELLIGENCE</span><h3>Improve Loan Readiness</h3><p>Understand your credit profile before approaching lenders.</p></div>
              <i className="bi bi-arrow-up-right" />
            </Link>
            <Link to="/dpr" className="recommendation-card">
              <div className="recommendation-number">03</div><div className="recommendation-icon purple"><i className="bi bi-file-earmark-bar-graph" /></div>
              <div className="recommendation-content"><span>PROJECT INTELLIGENCE</span><h3>Prepare Your DPR</h3><p>Organise your business information into a project report.</p></div>
              <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="customer-bottom-cta">
        <div className="customer-container">
          <div className="bottom-cta-card">
            <div className="cta-icon"><i className="bi bi-stars" /></div>
            <div className="cta-copy">
              <span>GOSUBSIDY CUSTOMER PORTAL</span>
              <h2>Your opportunities.<strong> Your journey.</strong></h2>
              <p>Discover, prepare and move towards the financial support that fits your goals.</p>
            </div>
            <Link to="/schemes" className="cta-button">Explore Opportunities <i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}