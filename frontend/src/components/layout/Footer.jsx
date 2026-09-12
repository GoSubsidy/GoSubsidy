import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    alert("Thank you for subscribing to GoSubsidy.");
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <>
      <footer className="gs-footer">
        {/* Premium CTA */}
        <section className="gs-footer-cta-wrap">
          <div className="container">
            <div className="gs-footer-cta">
              <div className="gs-footer-cta-glow" />

              <div className="gs-footer-cta-content">
                <div className="gs-footer-ai-icon">
                  <i className="bi bi-stars" />
                </div>

                <div>
                  <div className="gs-footer-eyebrow">
                    GOSUBSIDY INTELLIGENCE
                  </div>
                  <h2>
                    Turn your business idea into a{" "}
                    <span>fundable project.</span>
                  </h2>
                  <p>
                    Discover schemes, check loan opportunities, build an
                    intelligent DPR and plan your finance journey from one
                    powerful platform.
                  </p>

                  <div className="gs-footer-cta-pills">
                    <span><i className="bi bi-check2-circle" /> 1,023+ project profiles</span>
                    <span><i className="bi bi-stars" /> Intelligent DPR templates</span>
                    <span><i className="bi bi-shield-check" /> Secure platform</span>
                  </div>
                </div>
              </div>

              <div className="gs-footer-cta-actions">
                <Link to="/dpr-catalog" className="gs-footer-primary-btn">
                  <i className="bi bi-grid-3x3-gap-fill" />
                  Browse DPR Catalog
                  <i className="bi bi-arrow-up-right" />
                </Link>
                <Link to="/dpr" className="gs-footer-secondary-btn">
                  <i className="bi bi-file-earmark-text" />
                  Create Premium DPR
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main footer */}
        <div className="container gs-footer-main">
          <div className="gs-footer-quickbar">
            <span><i className="bi bi-lightning-charge-fill" /> Quick access</span>
            <Link to="/schemes">Explore Schemes</Link>
            <Link to="/loans">Check Loans</Link>
            <Link to="/dpr-catalog">DPR Catalog</Link>
            <Link to="/dpr">Create Premium DPR</Link>
            <Link to="/contact">Talk to Support</Link>
          </div>
          <div className="row g-4 g-xl-5 gs-footer-grid">
            {/* Brand */}
            <div className="col-xl-3 col-lg-5">
              <Link to="/" className="gs-footer-brand text-decoration-none">
                <div className="gs-footer-brand-mark">
                  <span className="gs-footer-brand-orbit orbit-one" />
                  <span className="gs-footer-brand-orbit orbit-two" />
                  <i className="bi bi-graph-up-arrow" />
                </div>
                <div>
                  <div className="gs-footer-brand-name">
                    <span className="brand-go">Go</span>
                    <span className="brand-subsidy">Subsidy</span>
                  </div>
                  <div className="gs-footer-brand-tag">
                    BUSINESS &amp; FINANCIAL SERVICES
                  </div>
                </div>
              </Link>

              <p className="gs-footer-about">
                GoSubsidy is an intelligent business and financial services
                platform helping entrepreneurs, farmers, startups and MSMEs
                discover opportunities, understand finance and prepare for
                growth.
              </p>

              <div className="gs-footer-brand-stats">
                <div>
                  <strong>1,023+</strong>
                  <span>DPR Profiles</span>
                </div>
                <div>
                  <strong>AI</strong>
                  <span>Powered Guidance</span>
                </div>
                <div>
                  <strong>360°</strong>
                  <span>Finance Journey</span>
                </div>
              </div>

              <div className="gs-footer-ai-badge">
                <span className="gs-footer-live-dot" />
                <div>
                  <small>POWERED BY</small>
                  <strong>GoSubsidy Intelligence</strong>
                </div>
              </div>

              <div className="gs-footer-social">
                <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                <a href="#" aria-label="X"><i className="bi bi-twitter-x" /></a>
                <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
                <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
                <a href="#" aria-label="YouTube"><i className="bi bi-youtube" /></a>
              </div>
            </div>

            {/* Discover */}
            <div className="col-6 col-md-4 col-lg-3 col-xl-2">
              <div className="gs-footer-title">
                <span>Discover</span>
              </div>
              <ul className="gs-footer-links">
                <li><Link to="/"><i className="bi bi-house" /> Home</Link></li>
                <li><Link to="/schemes"><i className="bi bi-bank" /> Government Schemes</Link></li>
                <li><Link to="/loans"><i className="bi bi-cash-stack" /> Loan Eligibility</Link></li>
                <li><Link to="/dpr"><i className="bi bi-file-earmark-bar-graph" /> Detailed Project Report</Link></li>
                <li><Link to="/dpr-catalog"><i className="bi bi-grid-3x3-gap" /> DPR Project Catalog</Link></li>
                <li><Link to="/ai-advisor"><i className="bi bi-stars" /> AI Advisor</Link></li>
                <li><Link to="/cibil"><i className="bi bi-credit-card-2-front" /> CIBIL / Credit</Link></li>
              </ul>
            </div>

            {/* Business Services */}
            <div className="col-6 col-md-4 col-lg-2 col-xl-2">
              <div className="gs-footer-title">
                <span>Business Services</span>
              </div>
              <ul className="gs-footer-links">
                <li><Link to="/registration"><i className="bi bi-building-add" /> Registration</Link></li>
                <li><Link to="/trademark"><i className="bi bi-patch-check" /> Trademark</Link></li>
                <li><Link to="/gst"><i className="bi bi-receipt" /> GST Services</Link></li>
                <li><Link to="/income-tax"><i className="bi bi-file-earmark-ruled" /> Income Tax</Link></li>
                <li><Link to="/mca"><i className="bi bi-buildings" /> MCA Services</Link></li>
                <li><Link to="/compliance"><i className="bi bi-shield-check" /> Compliance</Link></li>
                <li><Link to="/consultation"><i className="bi bi-headset" /> Consultation</Link></li>
              </ul>
            </div>

            {/* Finance */}
            <div className="col-6 col-md-4 col-lg-2 col-xl-2">
              <div className="gs-footer-title">
                <span>Finance</span>
              </div>
              <ul className="gs-footer-links">
                <li><Link to="/schemes"><i className="bi bi-award" /> Subsidies</Link></li>
                <li><Link to="/loans"><i className="bi bi-bank2" /> Business Loans</Link></li>
                <li><Link to="/insurance"><i className="bi bi-shield-plus" /> Insurance</Link></li>
                <li><Link to="/emi-calculator"><i className="bi bi-calculator" /> EMI Calculator</Link></li>
                <li><Link to="/cibil"><i className="bi bi-speedometer2" /> Credit Health</Link></li>
                <li><Link to="/global"><i className="bi bi-globe2" /> Global Services</Link></li>
              </ul>
            </div>

            {/* Stay connected */}
            <div className="col-lg-5 col-xl-3">
              <div className="gs-footer-title">
                <span>Stay Connected</span>
              </div>

              <p className="gs-footer-newsletter-text">
                Get useful scheme alerts, business opportunities, finance
                insights and GoSubsidy updates.
              </p>

              <form className="gs-footer-newsletter" onSubmit={handleSubscribe}>
                <i className="bi bi-envelope" />
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" aria-label="Subscribe">
                  <i className="bi bi-arrow-right" />
                </button>
              </form>

              <div className="gs-footer-help-card">
                <div className="gs-footer-help-icon">
                  <i className="bi bi-headset" />
                </div>
                <div>
                  <strong>Need help choosing a service?</strong>
                  <span>Talk to GoSubsidy support</span>
                </div>
                <Link to="/contact" aria-label="Contact GoSubsidy support">
                  <i className="bi bi-arrow-up-right" />
                </Link>
              </div>

              <div className="gs-footer-contact">
                <a href="mailto:info@gosubsidy.com">
                  <span><i className="bi bi-envelope" /></span>
                  <div>
                    <small>EMAIL</small>
                    <strong>info@gosubsidy.com</strong>
                  </div>
                </a>

                <a href="tel:+919700273666">
                  <span><i className="bi bi-telephone" /></span>
                  <div>
                    <small>SUPPORT</small>
                    <strong>+91 9700273666</strong>
                  </div>
                </a>

                <div>
                  <span><i className="bi bi-geo-alt" /></span>
                  <div>
                    <small>LOCATION</small>
                    <strong>Hyderabad, Telangana</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="gs-footer-trust">
            <div>
              <span className="gs-trust-icon"><i className="bi bi-shield-lock" /></span>
              <div>
                <strong>Secure Platform</strong>
                <small>Privacy-first digital experience</small>
              </div>
            </div>
            <div>
              <span className="gs-trust-icon"><i className="bi bi-stars" /></span>
              <div>
                <strong>Intelligent Assistance</strong>
                <small>AI-assisted business guidance</small>
              </div>
            </div>
            <div>
              <span className="gs-trust-icon"><i className="bi bi-diagram-3" /></span>
              <div>
                <strong>Connected Services</strong>
                <small>Schemes, loans, DPR &amp; compliance</small>
              </div>
            </div>
            <div>
              <span className="gs-trust-icon"><i className="bi bi-headset" /></span>
              <div>
                <strong>Expert Support</strong>
                <small>Finance &amp; business assistance</small>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="gs-footer-bottom">
            <div className="gs-footer-copyright">
              © {year} <strong><span className="brand-go">Go</span><span className="brand-subsidy">Subsidy</span></strong>
              <span>All rights reserved.</span>
            </div>

            <div className="gs-footer-bottom-links">
              <Link to="/about">About</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/payment-terms">Payment Terms</Link>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/contact">Support</Link>
              <Link to="/admin" className="gs-admin-link">
                <i className="bi bi-shield-lock" /> Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="gs-footer-disclaimer">
          <div className="container">
            <i className="bi bi-info-circle" />
            <p>
              GoSubsidy is an independent technology and business services
              platform. Information, eligibility assessments, subsidy
              availability, loan decisions and approvals are subject to the
              applicable scheme guidelines, Government authorities and
              respective financial institutions.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .gs-footer{
          position:relative;
          margin-top:92px;
          color:#fff;
          overflow:hidden;
          background:
            radial-gradient(circle at 82% 8%,rgba(0,207,167,.14),transparent 25%),
            radial-gradient(circle at 8% 55%,rgba(23,108,255,.13),transparent 30%),
            linear-gradient(145deg,#04111f 0%,#061a2e 45%,#05253d 100%);
        }

        .gs-footer::before{
          content:"";
          position:absolute;
          inset:0;
          pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size:42px 42px;
          mask-image:linear-gradient(to bottom,black,transparent 78%);
        }

        .gs-footer-cta-wrap{
          position:relative;
          z-index:2;
          transform:translateY(-50%);
          margin-bottom:-72px;
        }

        .gs-footer-cta{
          position:relative;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:32px;
          padding:34px 38px;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.18);
          border-radius:26px;
          background:
            linear-gradient(120deg,#086ef0 0%,#075fd4 48%,#00a987 100%);
          box-shadow:0 24px 65px rgba(0,64,145,.34);
        }

        .gs-footer-cta-glow{
          position:absolute;
          width:300px;
          height:300px;
          right:-110px;
          top:-150px;
          border-radius:50%;
          background:rgba(255,255,255,.13);
          filter:blur(3px);
        }

        .gs-footer-cta-content{
          position:relative;
          z-index:1;
          display:flex;
          align-items:flex-start;
          gap:18px;
        }

        .gs-footer-ai-icon{
          width:58px;
          height:58px;
          min-width:58px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(255,255,255,.25);
          border-radius:17px;
          background:rgba(255,255,255,.14);
          box-shadow:inset 0 1px rgba(255,255,255,.2);
          font-size:25px;
        }

        .gs-footer-eyebrow{
          margin-bottom:5px;
          color:#c7fff4;
          font-size:10px;
          font-weight:900;
          letter-spacing:1.7px;
        }

        .gs-footer-cta h2{
          margin:0 0 7px;
          font-size:29px;
          line-height:1.2;
          font-weight:850;
          letter-spacing:-.5px;
        }

        .gs-footer-cta h2 span{color:#ffe05b;}

        .gs-footer-cta p{
          max-width:720px;
          margin:0;
          color:rgba(255,255,255,.84);
          font-size:13px;
          line-height:1.65;
        }

        .gs-footer-cta-pills{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-top:14px;
        }

        .gs-footer-cta-pills span{
          display:inline-flex;
          align-items:center;
          gap:5px;
          padding:5px 9px;
          border:1px solid rgba(255,255,255,.18);
          border-radius:999px;
          background:rgba(255,255,255,.08);
          color:rgba(255,255,255,.9);
          font-size:9px;
          font-weight:700;
        }

        .gs-footer-cta-pills i{color:#c5fff2;}

        .gs-footer-cta-actions{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          gap:10px;
          flex-shrink:0;
        }

        .gs-footer-primary-btn,
        .gs-footer-secondary-btn{
          min-height:46px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:0 17px;
          border-radius:12px;
          font-size:12px;
          font-weight:800;
          text-decoration:none;
          transition:all .25s ease;
          white-space:nowrap;
        }

        .gs-footer-primary-btn{
          color:#075fd4;
          background:#fff;
          box-shadow:0 8px 22px rgba(0,0,0,.12);
        }

        .gs-footer-primary-btn:hover{
          color:#075fd4;
          transform:translateY(-2px);
          box-shadow:0 13px 28px rgba(0,0,0,.18);
        }

        .gs-footer-secondary-btn{
          color:#fff;
          border:1px solid rgba(255,255,255,.4);
          background:rgba(255,255,255,.08);
        }

        .gs-footer-secondary-btn:hover{
          color:#fff;
          border-color:rgba(255,255,255,.65);
          background:rgba(255,255,255,.16);
          transform:translateY(-2px);
        }

        .gs-footer-main{
          position:relative;
          z-index:1;
          padding-top:105px;
          padding-bottom:25px;
        }

        .gs-footer-brand{
          display:inline-flex;
          align-items:center;
          gap:13px;
        }

        .gs-footer-brand-mark{
          position:relative;
          width:50px;
          height:50px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.18);
          border-radius:16px;
          background:linear-gradient(135deg,#0783ff,#08b995);
          box-shadow:0 12px 30px rgba(0,122,255,.2);
          font-size:21px;
        }

        .gs-footer-brand-orbit{
          position:absolute;
          width:31px;
          height:13px;
          border:1px solid rgba(255,255,255,.3);
          border-radius:50%;
          transform:rotate(-30deg);
        }

        .orbit-two{transform:rotate(30deg);}

        .gs-footer-brand-name{
          font-size:29px;
          font-weight:900;
          line-height:1;
          letter-spacing:-1.2px;
        }

        .brand-go{color:#16a35c;}
        .brand-subsidy{color:#ff9a32;}

        .gs-footer-brand-tag{
          margin-top:6px;
          color:#8198af;
          font-size:8px;
          font-weight:800;
          letter-spacing:1.45px;
        }

        .gs-footer-about{
          max-width:430px;
          margin:23px 0 18px;
          color:#9badc0;
          font-size:13px;
          line-height:1.8;
        }

        .gs-footer-brand-stats{
          display:flex;
          gap:0;
          max-width:430px;
          margin-bottom:18px;
          border:1px solid rgba(255,255,255,.07);
          border-radius:13px;
          overflow:hidden;
          background:rgba(255,255,255,.025);
        }

        .gs-footer-brand-stats div{
          flex:1;
          padding:10px 11px;
          border-right:1px solid rgba(255,255,255,.07);
        }

        .gs-footer-brand-stats div:last-child{border-right:0;}

        .gs-footer-brand-stats strong{
          display:block;
          color:#fff;
          font-size:13px;
          font-weight:850;
        }

        .gs-footer-brand-stats span{
          display:block;
          margin-top:2px;
          color:#71879d;
          font-size:8px;
          line-height:1.35;
        }

        .gs-footer-ai-badge{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:9px 13px;
          border:1px solid rgba(9,207,167,.17);
          border-radius:12px;
          background:rgba(9,207,167,.06);
        }

        .gs-footer-live-dot{
          width:9px;
          height:9px;
          border-radius:50%;
          background:#0bd4a5;
          box-shadow:0 0 0 5px rgba(11,212,165,.09);
        }

        .gs-footer-ai-badge small{
          display:block;
          color:#617b94;
          font-size:7px;
          font-weight:800;
          letter-spacing:1px;
        }

        .gs-footer-ai-badge strong{
          display:block;
          margin-top:1px;
          color:#dce8f3;
          font-size:11px;
        }

        .gs-footer-social{
          display:flex;
          gap:8px;
          margin-top:19px;
        }

        .gs-footer-social a{
          width:36px;
          height:36px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(255,255,255,.08);
          border-radius:10px;
          color:#91a6bb;
          background:rgba(255,255,255,.035);
          text-decoration:none;
          transition:all .2s ease;
        }

        .gs-footer-social a:hover{
          color:#fff;
          border-color:#0874ee;
          background:#0874ee;
          transform:translateY(-3px);
          box-shadow:0 8px 20px rgba(0,116,238,.22);
        }

        .gs-footer-title{
          position:relative;
          margin-bottom:21px;
          padding-bottom:11px;
          color:#fff;
          font-size:13px;
          font-weight:850;
        }

        .gs-footer-title::after{
          content:"";
          position:absolute;
          left:0;
          bottom:0;
          width:30px;
          height:2px;
          border-radius:99px;
          background:linear-gradient(90deg,#0bd3a7,#ffad2e);
        }

        .gs-footer-links{
          margin:0;
          padding:0;
          list-style:none;
        }

        .gs-footer-links li{margin-bottom:11px;}

        .gs-footer-links a{
          display:inline-flex;
          align-items:center;
          gap:8px;
          color:#8fa3b8;
          text-decoration:none;
          font-size:11.5px;
          line-height:1.45;
          transition:all .2s ease;
        }

        .gs-footer-links a i{
          width:14px;
          color:#557089;
          font-size:11px;
          transition:.2s ease;
        }

        .gs-footer-links a:hover{
          color:#fff;
          transform:translateX(4px);
        }

        .gs-footer-links a:hover i{color:#10cfa6;}

        .gs-footer-newsletter-text{
          margin:0 0 14px;
          color:#8fa3b8;
          font-size:11.5px;
          line-height:1.7;
        }

        .gs-footer-newsletter{
          height:50px;
          display:flex;
          align-items:center;
          padding:5px 6px 5px 14px;
          border:1px solid rgba(255,255,255,.1);
          border-radius:13px;
          background:rgba(255,255,255,.045);
          transition:.25s ease;
        }

        .gs-footer-newsletter:focus-within{
          border-color:#0bbf9b;
          box-shadow:0 0 0 4px rgba(11,191,155,.07);
          background:rgba(255,255,255,.065);
        }

        .gs-footer-newsletter > i{
          color:#688199;
          font-size:14px;
        }

        .gs-footer-newsletter input{
          flex:1;
          min-width:0;
          padding:0 10px;
          border:0;
          outline:0;
          background:transparent;
          color:#fff;
          font-size:11.5px;
        }

        .gs-footer-newsletter input::placeholder{color:#657d94;}

        .gs-footer-newsletter button{
          width:39px;
          height:39px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:0;
          border-radius:10px;
          color:#fff;
          background:linear-gradient(135deg,#0876f8,#08b99b);
          transition:.2s ease;
        }

        .gs-footer-newsletter button:hover{transform:translateX(2px);}

        .gs-footer-contact{
          display:grid;
          gap:9px;
          margin-top:17px;
        }

        .gs-footer-contact > div,
        .gs-footer-contact > a{
          display:flex;
          align-items:center;
          gap:9px;
          color:inherit;
          text-decoration:none;
        }

        .gs-footer-contact > a:hover strong{color:#fff;}

        .gs-footer-contact > div > span,
        .gs-footer-contact > a > span{
          width:32px;
          height:32px;
          min-width:32px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(255,255,255,.06);
          border-radius:9px;
          color:#0bcda5;
          background:rgba(255,255,255,.035);
        }

        .gs-footer-contact small{
          display:block;
          color:#5f7992;
          font-size:7px;
          font-weight:850;
          letter-spacing:.8px;
        }

        .gs-footer-contact strong{
          display:block;
          margin-top:1px;
          color:#bdccda;
          font-size:10.5px;
          font-weight:650;
        }

        .gs-footer-trust{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          margin-top:48px;
          border-top:1px solid rgba(255,255,255,.07);
          border-bottom:1px solid rgba(255,255,255,.07);
        }

        .gs-footer-trust > div{
          display:flex;
          align-items:center;
          gap:11px;
          padding:19px 16px;
          border-right:1px solid rgba(255,255,255,.07);
        }

        .gs-footer-trust > div:last-child{border-right:0;}

        .gs-trust-icon{
          width:37px;
          height:37px;
          min-width:37px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(10,207,166,.1);
          border-radius:10px;
          color:#0bd0a6;
          background:rgba(10,207,166,.07);
        }

        .gs-footer-trust strong{
          display:block;
          color:#dce7f2;
          font-size:10.5px;
          font-weight:800;
        }

        .gs-footer-trust small{
          display:block;
          margin-top:3px;
          color:#71869e;
          font-size:8.5px;
          line-height:1.35;
        }

        .gs-footer-bottom{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
          padding:22px 0;
        }

        .gs-footer-copyright{
          display:flex;
          align-items:center;
          gap:6px;
          color:#71869d;
          font-size:10px;
        }

        .gs-footer-copyright strong{font-size:11px;}

        .gs-footer-bottom-links{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          flex-wrap:wrap;
          gap:17px;
        }

        .gs-footer-bottom-links a{
          color:#7f94aa;
          text-decoration:none;
          font-size:9.5px;
          transition:.2s ease;
        }

        .gs-footer-bottom-links a:hover{color:#fff;}

        .gs-admin-link{
          display:inline-flex !important;
          align-items:center;
          gap:5px;
          padding:6px 9px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:8px;
          background:rgba(255,255,255,.035);
        }

        .gs-footer-disclaimer{
          position:relative;
          z-index:1;
          border-top:1px solid rgba(255,255,255,.05);
          background:rgba(0,0,0,.13);
        }

        .gs-footer-disclaimer .container{
          display:flex;
          align-items:flex-start;
          justify-content:center;
          gap:8px;
          padding-top:13px;
          padding-bottom:13px;
        }

        .gs-footer-disclaimer i{
          margin-top:2px;
          color:#637d96;
          font-size:11px;
        }

        .gs-footer-disclaimer p{
          max-width:1050px;
          margin:0;
          color:#60768e;
          text-align:center;
          font-size:8.5px;
          line-height:1.6;
        }


        /* =========================================================
           WORLD-CLASS POLISH
           ========================================================= */

        .gs-footer-main{
          width:100%;
          max-width:1280px;
          padding-left:28px;
          padding-right:28px;
        }

        .gs-footer-cta-wrap .container{
          max-width:1280px;
        }

        .gs-footer-grid{
          align-items:flex-start;
        }

        .gs-footer-quickbar{
          display:flex;
          align-items:center;
          flex-wrap:wrap;
          gap:9px;
          margin:0 0 30px;
          padding:9px 10px;
          border:1px solid rgba(255,255,255,.07);
          border-radius:14px;
          background:rgba(255,255,255,.025);
        }

        .gs-footer-quickbar span{
          display:inline-flex;
          align-items:center;
          gap:6px;
          margin-right:auto;
          padding:7px 9px;
          border-radius:9px;
          color:#dce8f3;
          font-size:10px;
          font-weight:800;
          letter-spacing:.15px;
        }

        .gs-footer-quickbar span i{
          color:#10d1a8;
        }

        .gs-footer-quickbar a{
          display:inline-flex;
          align-items:center;
          min-height:31px;
          padding:0 10px;
          border-radius:8px;
          color:#8fa7bc;
          text-decoration:none;
          font-size:9.5px;
          font-weight:650;
          transition:all .2s ease;
        }

        .gs-footer-quickbar a:hover{
          color:#fff;
          background:rgba(255,255,255,.06);
          transform:translateY(-1px);
        }

        .gs-footer-title{
          font-size:14px;
          letter-spacing:.05px;
        }

        .gs-footer-links li{
          margin-bottom:12px;
        }

        .gs-footer-links a{
          font-size:12px;
        }

        .gs-footer-about{
          font-size:13px;
          max-width:390px;
        }

        .gs-footer-newsletter-text{
          font-size:12px;
        }

        .gs-footer-newsletter input{
          font-size:12px;
        }

        .gs-footer-contact strong{
          font-size:11px;
        }

        .gs-footer-help-card{
          display:flex;
          align-items:center;
          gap:10px;
          margin-top:14px;
          padding:10px 11px;
          border:1px solid rgba(255,255,255,.075);
          border-radius:13px;
          background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(10,207,167,.035));
        }

        .gs-footer-help-icon{
          width:32px;
          height:32px;
          min-width:32px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(11,208,168,.14);
          border-radius:9px;
          color:#10d0a8;
          background:rgba(11,208,168,.07);
        }

        .gs-footer-help-card > div:nth-child(2){
          min-width:0;
          flex:1;
        }

        .gs-footer-help-card strong{
          display:block;
          color:#dce8f3;
          font-size:9.5px;
          font-weight:750;
        }

        .gs-footer-help-card span{
          display:block;
          margin-top:2px;
          color:#71879d;
          font-size:8.5px;
        }

        .gs-footer-help-card > a{
          width:28px;
          height:28px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(255,255,255,.08);
          border-radius:8px;
          color:#a9bacb;
          text-decoration:none;
          transition:.2s ease;
        }

        .gs-footer-help-card > a:hover{
          color:#fff;
          border-color:#0acba4;
          background:rgba(10,203,164,.09);
          transform:translateY(-1px);
        }

        .gs-footer-brand-stats{
          max-width:390px;
        }

        .gs-footer-brand-stats strong{
          font-size:14px;
        }

        .gs-footer-trust{
          margin-top:52px;
          border-radius:14px;
          overflow:hidden;
          background:rgba(255,255,255,.012);
        }

        .gs-footer-trust > div{
          min-height:78px;
          padding:18px 20px;
          transition:background .2s ease;
        }

        .gs-footer-trust > div:hover{
          background:rgba(255,255,255,.025);
        }

        .gs-footer-trust strong{
          font-size:11.5px;
        }

        .gs-footer-trust small{
          font-size:9px;
        }

        .gs-footer-bottom{
          padding:25px 2px;
        }

        .gs-footer-bottom-links{
          gap:19px;
        }

        .gs-footer-bottom-links a{
          font-size:10px;
        }

        .gs-footer-disclaimer p{
          font-size:9px;
        }

        @media(max-width:1199px){
          .gs-footer-cta{padding:30px;}
          .gs-footer-cta-actions{flex-direction:column;align-items:stretch;}
          .gs-footer-primary-btn,.gs-footer-secondary-btn{width:210px;}
        }


        @media(max-width:991px){
          .gs-footer-main{
            max-width:100%;
            padding-left:20px;
            padding-right:20px;
          }

          .gs-footer-quickbar{
            align-items:flex-start;
          }

          .gs-footer-quickbar span{
            width:100%;
            margin-right:0;
          }

          .gs-footer{margin-top:65px;}
          .gs-footer-cta-wrap{transform:translateY(-28%);margin-bottom:-30px;}
          .gs-footer-cta{flex-direction:column;align-items:flex-start;}
          .gs-footer-cta-actions{width:100%;flex-direction:row;flex-wrap:wrap;}
          .gs-footer-primary-btn,.gs-footer-secondary-btn{width:auto;}
          .gs-footer-main{padding-top:65px;}
          .gs-footer-trust{grid-template-columns:1fr 1fr;}
          .gs-footer-trust > div:nth-child(2){border-right:0;}
          .gs-footer-bottom{align-items:flex-start;flex-direction:column;}
          .gs-footer-bottom-links{justify-content:flex-start;}
        }

        @media(max-width:576px){
          .gs-footer{margin-top:55px;}
          .gs-footer-cta{padding:24px 20px;border-radius:20px;}
          .gs-footer-cta-content{flex-direction:column;}
          .gs-footer-cta h2{font-size:21px;}
          .gs-footer-cta p{font-size:11.5px;}
          .gs-footer-cta-pills{flex-direction:column;align-items:flex-start;}
          .gs-footer-cta-actions{flex-direction:column;align-items:stretch;}
          .gs-footer-primary-btn,.gs-footer-secondary-btn{width:100%;}
          .gs-footer-brand-stats{max-width:100%;}
          .gs-footer-trust{grid-template-columns:1fr;}
          .gs-footer-trust > div{border-right:0;border-bottom:1px solid rgba(255,255,255,.07);}
          .gs-footer-trust > div:last-child{border-bottom:0;}
          .gs-footer-bottom-links{gap:12px;}
          .gs-footer-disclaimer .container{padding-left:18px;padding-right:18px;}
          .gs-footer-disclaimer p{text-align:left;font-size:8px;}
        }
      `}</style>
    </>
  );
}
