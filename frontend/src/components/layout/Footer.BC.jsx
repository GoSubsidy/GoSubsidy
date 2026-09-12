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

  return (
    <>
      <footer className="gs-footer">

        {/* =====================================================
            TOP CTA
        ===================================================== */}

        <div className="gs-footer-cta-wrap">
          <div className="container">

            <div className="gs-footer-cta">

              <div className="gs-footer-cta-content">

                <div className="gs-footer-ai-icon">
                  <i className="bi bi-stars"></i>
                </div>

                <div>
                  <span className="gs-footer-eyebrow">
                    GOSUBSIDY INTELLIGENCE
                  </span>

                  <h3>
                    Find the right Government Scheme
                    <span> & Finance Opportunity.</span>
                  </h3>

                  <p>
                    Discover subsidies, assess loan eligibility and
                    prepare your project finance journey from one
                    intelligent platform.
                  </p>
                </div>

              </div>

              <div className="gs-footer-cta-actions">

                <Link
                  to="/schemes"
                  className="gs-footer-primary-btn"
                >
                  Explore Schemes
                  <i className="bi bi-arrow-up-right"></i>
                </Link>

                <Link
                  to="/loans"
                  className="gs-footer-secondary-btn"
                >
                  Check Loan Eligibility
                </Link>

              </div>

            </div>

          </div>
        </div>


        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="container gs-footer-main">

          <div className="row g-5">

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="col-lg-4">

              <Link
                to="/"
                className="gs-footer-brand text-decoration-none"
              >

                <div className="gs-footer-brand-icon">
                  <i className="bi bi-bank2"></i>
                </div>

                <div>

                  <div className="gs-footer-brand-name">
                    <span className="brand-go">Go</span>
                    <span className="brand-subsidy">Subsidy</span>
                  </div>

                  <small>
                    Business & Financial Services
                  </small>

                </div>

              </Link>


              <p className="gs-footer-about">
                India's intelligent platform for Government subsidies,
                business loans, project finance and financial guidance
                for entrepreneurs, farmers, startups and MSMEs.
              </p>


              {/* AI BADGE */}

              <div className="gs-footer-ai-badge">

                <div className="gs-footer-ai-dot"></div>

                <div>
                  <small>POWERED BY</small>
                  <strong>GoSubsidy Intelligence</strong>
                </div>

              </div>


              {/* SOCIAL */}

              <div className="gs-footer-social">

                <a
                  href="#"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>

                <a
                  href="#"
                  aria-label="X"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>

                <a
                  href="#"
                  aria-label="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                >
                  <i className="bi bi-youtube"></i>
                </a>

              </div>

            </div>


            {/* =================================================
                PLATFORM
            ================================================= */}

            <div className="col-6 col-md-3 col-lg-2">

              <div className="gs-footer-title">
                Platform
              </div>

              <ul className="gs-footer-links">

                <li>
                  <Link to="/">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/schemes">
                    Government Schemes
                  </Link>
                </li>

                <li>
                  <Link to="/loans">
                    Loan Eligibility
                  </Link>
                </li>

                <li>
                  <Link to="/dpr">
                    DPR Preparation
                  </Link>
                </li>

                <li>
                  <Link to="/ai-advisor">
                    AI Advisor
                  </Link>
                </li>

                <li>
                  <Link to="/cibil">
                    Credit / CIBIL
                  </Link>
                </li>

              </ul>

            </div>


            {/* =================================================
                POPULAR SCHEMES
            ================================================= */}

            <div className="col-6 col-md-3 col-lg-2">

              <div className="gs-footer-title">
                Popular Schemes
              </div>

              <ul className="gs-footer-links">

                <li>
                  <Link to="/schemes">
                    PMEGP
                  </Link>
                </li>

                <li>
                  <Link to="/schemes">
                    PMFME
                  </Link>
                </li>

                <li>
                  <Link to="/schemes">
                    CGTMSE
                  </Link>
                </li>

                <li>
                  <Link to="/schemes">
                    MUDRA
                  </Link>
                </li>

                <li>
                  <Link to="/schemes">
                    Stand-Up India
                  </Link>
                </li>

                <li>
                  <Link to="/schemes">
                    Explore All
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                </li>

              </ul>

            </div>


            {/* =================================================
                CONTACT + NEWSLETTER
            ================================================= */}

            <div className="col-md-6 col-lg-4">

              <div className="gs-footer-title">
                Stay Connected
              </div>

              <p className="gs-footer-newsletter-text">
                Get important scheme updates, subsidy opportunities
                and financial insights directly in your inbox.
              </p>


              <form
                className="gs-footer-newsletter"
                onSubmit={handleSubscribe}
              >

                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <button
                  type="submit"
                  aria-label="Subscribe"
                >
                  <i className="bi bi-arrow-right"></i>
                </button>

              </form>


              <div className="gs-footer-contact">

                <div>
                  <span>
                    <i className="bi bi-geo-alt"></i>
                  </span>

                  <div>
                    <small>LOCATION</small>
                    <strong>
                      Hyderabad, Telangana
                    </strong>
                  </div>
                </div>


                <div>
                  <span>
                    <i className="bi bi-envelope"></i>
                  </span>

                  <div>
                    <small>EMAIL</small>
                    <strong>
                      info@gosubsidy.com
                    </strong>
                  </div>
                </div>


                <div>
                  <span>
                    <i className="bi bi-telephone"></i>
                  </span>

                  <div>
                    <small>SUPPORT</small>
                    <strong>
                      +91 9700273666
                    </strong>
                  </div>
                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              TRUST STRIP
          ===================================================== */}

          <div className="gs-footer-trust">

            <div>

              <span className="gs-trust-icon">
                <i className="bi bi-shield-check"></i>
              </span>

              <div>
                <strong>Secure Platform</strong>
                <small>
                  Privacy-first application processing
                </small>
              </div>

            </div>


            <div>

              <span className="gs-trust-icon">
                <i className="bi bi-stars"></i>
              </span>

              <div>
                <strong>AI Powered</strong>
                <small>
                  Intelligent eligibility assistance
                </small>
              </div>

            </div>


            <div>

              <span className="gs-trust-icon">
                <i className="bi bi-bank"></i>
              </span>

              <div>
                <strong>Scheme Intelligence</strong>
                <small>
                  Central & State scheme discovery
                </small>
              </div>

            </div>


            <div>

              <span className="gs-trust-icon">
                <i className="bi bi-headset"></i>
              </span>

              <div>
                <strong>Expert Guidance</strong>
                <small>
                  Finance & subsidy assistance
                </small>
              </div>

            </div>

          </div>


          {/* =====================================================
              BOTTOM
          ===================================================== */}

          <div className="gs-footer-bottom">

            <div className="gs-footer-copyright">

              <span>
                © {new Date().getFullYear()}
              </span>

              <strong>
                <span className="brand-go">
                  Go
                </span>

                <span className="brand-subsidy">
                  Subsidy
                </span>
              </strong>

              <span>
                All Rights Reserved.
              </span>

            </div>


            <div className="gs-footer-bottom-links">

              <Link to="/about">
                About
              </Link>

              <Link to="/privacy">
                Privacy Policy
              </Link>

              <Link to="/terms">
                Terms & Conditions
              </Link>

              <Link to="/payment-terms">
                Payment Terms
              </Link>

              <Link to="/disclaimer">
                Disclaimer
              </Link>

              <Link to="/contact">
                Support
              </Link>


              {/* ADMIN */}

              <Link
                to="/admin"
                className="gs-admin-link"
                title="GoSubsidy Admin Portal"
              >
                <i className="bi bi-shield-lock"></i>
                Admin
              </Link>

            </div>

          </div>

        </div>


        {/* =====================================================
            DISCLAIMER
        ===================================================== */}

        <div className="gs-footer-disclaimer">

          <div className="container">

            <i className="bi bi-info-circle"></i>

            <p>
              GoSubsidy is an independent technology platform providing
              scheme discovery and financial guidance. Eligibility,
              subsidy approval and loan sanction are subject to the
              respective Government authority, scheme guidelines and
              lending institution.
            </p>

          </div>

        </div>

      </footer>


      {/* =========================================================
          FOOTER CSS
      ========================================================= */}

      <style>{`

        .gs-footer{
          position:relative;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(0,200,170,.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 10% 85%,
              rgba(37,99,235,.14),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #061426 0%,
              #071d35 48%,
              #06233d 100%
            );

          color:#fff;
          margin-top:80px;
          overflow:hidden;
        }


        /* ============================================
           CTA
        ============================================ */

        .gs-footer-cta-wrap{
          transform:translateY(-50%);
          margin-bottom:-55px;
        }

        .gs-footer-cta{
          background:
            linear-gradient(
              120deg,
              #0868e8,
              #0959d5 48%,
              #04a88a
            );

          border-radius:24px;
          padding:32px 36px;

          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:30px;

          box-shadow:
            0 22px 55px rgba(0,67,170,.25);

          border:1px solid rgba(255,255,255,.18);
        }


        .gs-footer-cta-content{
          display:flex;
          align-items:flex-start;
          gap:18px;
        }


        .gs-footer-ai-icon{
          width:56px;
          height:56px;
          min-width:56px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:16px;

          background:rgba(255,255,255,.15);
          border:1px solid rgba(255,255,255,.22);

          font-size:24px;
        }


        .gs-footer-eyebrow{
          font-size:10px;
          font-weight:800;
          letter-spacing:1.3px;
          color:#bffcf0;
        }


        .gs-footer-cta h3{
          font-size:24px;
          font-weight:800;
          margin:5px 0 6px;
          line-height:1.25;
        }


        .gs-footer-cta h3 span{
          color:#ffd143;
        }


        .gs-footer-cta p{
          margin:0;
          max-width:640px;
          color:rgba(255,255,255,.80);
          font-size:13px;
          line-height:1.7;
        }


        .gs-footer-cta-actions{
          display:flex;
          align-items:center;
          gap:10px;
          flex-shrink:0;
        }


        .gs-footer-primary-btn,
        .gs-footer-secondary-btn{
          min-height:46px;
          padding:0 18px;

          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:9px;

          border-radius:12px;

          font-size:12px;
          font-weight:750;

          text-decoration:none;
          transition:.25s ease;
        }


        .gs-footer-primary-btn{
          background:#fff;
          color:#075fd6;
        }


        .gs-footer-primary-btn:hover{
          color:#075fd6;
          transform:translateY(-2px);
          box-shadow:0 10px 25px rgba(0,0,0,.15);
        }


        .gs-footer-secondary-btn{
          color:#fff;
          border:1px solid rgba(255,255,255,.4);
          background:rgba(255,255,255,.08);
        }


        .gs-footer-secondary-btn:hover{
          background:rgba(255,255,255,.15);
          color:#fff;
        }


        /* ============================================
           MAIN
        ============================================ */

        .gs-footer-main{
          padding-top:90px;
          padding-bottom:25px;
        }


        /* BRAND */

        .gs-footer-brand{
          display:inline-flex;
          align-items:center;
          gap:13px;
        }


        .gs-footer-brand-icon{
          width:48px;
          height:48px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:15px;

          color:#fff;
          font-size:21px;

          background:
            linear-gradient(
              135deg,
              #0878ff,
              #05b99a
            );

          box-shadow:
            0 10px 30px rgba(0,115,255,.20);
        }


        .gs-footer-brand-name{
          font-size:27px;
          font-weight:850;
          line-height:1;
          letter-spacing:-1px;
        }


        .brand-go{
          color:#13a05b;
        }


        .brand-subsidy{
          color:#ff9933;
        }


        .gs-footer-brand small{
          display:block;
          margin-top:6px;

          font-size:9px;
          text-transform:uppercase;
          letter-spacing:1.4px;

          color:#8da2bb;
          font-weight:700;
        }


        .gs-footer-about{
          margin:25px 0 20px;

          max-width:390px;

          color:#9eafc4;
          font-size:13px;
          line-height:1.8;
        }


        /* AI BADGE */

        .gs-footer-ai-badge{
          display:inline-flex;
          align-items:center;
          gap:10px;

          padding:10px 14px;

          border-radius:12px;

          background:rgba(10,200,166,.08);
          border:1px solid rgba(10,200,166,.18);
        }


        .gs-footer-ai-dot{
          width:9px;
          height:9px;
          border-radius:50%;

          background:#0bd4a5;

          box-shadow:
            0 0 0 5px rgba(11,212,165,.1);
        }


        .gs-footer-ai-badge small{
          display:block;
          color:#6f899f;
          font-size:7px;
          letter-spacing:1px;
          font-weight:800;
        }


        .gs-footer-ai-badge strong{
          display:block;
          color:#dce8f3;
          font-size:11px;
        }


        /* SOCIAL */

        .gs-footer-social{
          display:flex;
          gap:9px;
          margin-top:22px;
        }


        .gs-footer-social a{
          width:38px;
          height:38px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:11px;

          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.08);

          color:#aabbd0;
          font-size:14px;

          transition:.25s ease;
        }


        .gs-footer-social a:hover{
          color:#fff;
          background:#086cf0;
          border-color:#086cf0;

          transform:translateY(-3px);
        }


        /* ============================================
           TITLES + LINKS
        ============================================ */

        .gs-footer-title{
          position:relative;

          color:#fff;

          font-size:13px;
          font-weight:800;

          margin-bottom:24px;
          padding-bottom:12px;
        }


        .gs-footer-title::after{
          content:"";

          position:absolute;
          bottom:0;
          left:0;

          width:28px;
          height:2px;

          border-radius:10px;

          background:
            linear-gradient(
              90deg,
              #0ad4a5,
              #ffad24
            );
        }


        .gs-footer-links{
          list-style:none;
          margin:0;
          padding:0;
        }


        .gs-footer-links li{
          margin-bottom:13px;
        }


        .gs-footer-links a{
          color:#91a5bc;
          text-decoration:none;

          font-size:12px;

          transition:.2s ease;
        }


        .gs-footer-links a:hover{
          color:#fff;
          padding-left:5px;
        }


        /* ============================================
           NEWSLETTER
        ============================================ */

        .gs-footer-newsletter-text{
          color:#91a5bc;
          font-size:12px;
          line-height:1.7;
          margin-bottom:16px;
        }


        .gs-footer-newsletter{
          height:52px;

          display:flex;
          align-items:center;

          padding:5px 6px 5px 16px;

          border-radius:14px;

          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.10);

          transition:.25s ease;
        }


        .gs-footer-newsletter:focus-within{
          border-color:#0bbf9b;
          background:rgba(255,255,255,.08);

          box-shadow:
            0 0 0 4px rgba(11,191,155,.08);
        }


        .gs-footer-newsletter > i{
          color:#7188a2;
          font-size:15px;
        }


        .gs-footer-newsletter input{
          flex:1;
          min-width:0;

          border:0;
          outline:0;

          padding:0 12px;

          background:transparent;
          color:#fff;

          font-size:12px;
        }


        .gs-footer-newsletter input::placeholder{
          color:#71859c;
        }


        .gs-footer-newsletter button{
          width:40px;
          height:40px;

          border:0;
          border-radius:10px;

          display:flex;
          align-items:center;
          justify-content:center;

          color:#fff;

          background:
            linear-gradient(
              135deg,
              #0876f8,
              #08b99b
            );

          transition:.2s ease;
        }


        .gs-footer-newsletter button:hover{
          transform:translateX(2px);
        }


        /* CONTACT */

        .gs-footer-contact{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:11px;
          margin-top:22px;
        }


        .gs-footer-contact > div{
          display:flex;
          align-items:center;
          gap:10px;
        }


        .gs-footer-contact > div > span{
          width:34px;
          height:34px;
          min-width:34px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:10px;

          background:rgba(255,255,255,.05);

          color:#0dd0aa;
        }


        .gs-footer-contact small{
          display:block;

          font-size:7px;
          font-weight:800;
          letter-spacing:.7px;

          color:#627d98;
        }


        .gs-footer-contact strong{
          display:block;
          margin-top:2px;

          color:#c9d6e3;
          font-size:10px;
          font-weight:600;
        }


        /* ============================================
           TRUST STRIP
        ============================================ */

        .gs-footer-trust{
          margin-top:55px;

          display:grid;
          grid-template-columns:repeat(4,1fr);

          border-top:1px solid rgba(255,255,255,.07);
          border-bottom:1px solid rgba(255,255,255,.07);
        }


        .gs-footer-trust > div{
          display:flex;
          align-items:center;
          gap:12px;

          padding:22px 18px;

          border-right:1px solid rgba(255,255,255,.07);
        }


        .gs-footer-trust > div:last-child{
          border-right:0;
        }


        .gs-trust-icon{
          width:38px;
          height:38px;
          min-width:38px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:11px;

          color:#09cfa7;

          background:rgba(9,207,167,.08);
        }


        .gs-footer-trust strong{
          display:block;
          font-size:11px;
          color:#dce7f2;
        }


        .gs-footer-trust small{
          display:block;
          margin-top:3px;

          font-size:9px;
          color:#71869e;
        }


        /* ============================================
           BOTTOM
        ============================================ */

        .gs-footer-bottom{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;

          padding:24px 0;
        }


        .gs-footer-copyright{
          display:flex;
          align-items:center;
          gap:5px;

          font-size:10px;
          color:#70869e;
        }


        .gs-footer-copyright strong{
          font-size:11px;
        }


        .gs-footer-bottom-links{
          display:flex;
          align-items:center;
          gap:22px;
        }


        .gs-footer-bottom-links a{
          color:#7f94aa;
          text-decoration:none;
          font-size:10px;

          transition:.2s ease;
        }


        .gs-footer-bottom-links a:hover{
          color:#fff;
        }


        .gs-admin-link{
          display:inline-flex !important;
          align-items:center;
          gap:6px;

          padding:7px 11px;

          border-radius:8px;

          border:1px solid rgba(255,255,255,.09);

          background:rgba(255,255,255,.04);
        }


        .gs-admin-link:hover{
          background:rgba(255,255,255,.08);
        }


        /* ============================================
           DISCLAIMER
        ============================================ */

        .gs-footer-disclaimer{
          border-top:1px solid rgba(255,255,255,.05);
          background:rgba(0,0,0,.12);
        }


        .gs-footer-disclaimer .container{
          display:flex;
          align-items:flex-start;
          justify-content:center;
          gap:9px;

          padding-top:14px;
          padding-bottom:14px;
        }


        .gs-footer-disclaimer i{
          color:#667f98;
          margin-top:2px;
        }


        .gs-footer-disclaimer p{
          margin:0;

          max-width:950px;

          text-align:center;

          font-size:9px;
          line-height:1.6;

          color:#60768e;
        }


        /* ============================================
           RESPONSIVE
        ============================================ */

        @media(max-width:991px){

          .gs-footer-cta-wrap{
            transform:translateY(-25%);
            margin-bottom:-20px;
          }

          .gs-footer-cta{
            flex-direction:column;
            align-items:flex-start;
          }

          .gs-footer-main{
            padding-top:55px;
          }

          .gs-footer-trust{
            grid-template-columns:1fr 1fr;
          }

          .gs-footer-trust > div:nth-child(2){
            border-right:0;
          }

          .gs-footer-bottom{
            flex-direction:column;
            align-items:flex-start;
          }

        }


        @media(max-width:576px){

          .gs-footer{
            margin-top:55px;
          }

          .gs-footer-cta{
            padding:25px 20px;
          }

          .gs-footer-cta-content{
            flex-direction:column;
          }

          .gs-footer-cta h3{
            font-size:20px;
          }

          .gs-footer-cta-actions{
            width:100%;
            flex-direction:column;
          }

          .gs-footer-primary-btn,
          .gs-footer-secondary-btn{
            width:100%;
          }

          .gs-footer-contact{
            grid-template-columns:1fr;
          }

          .gs-footer-trust{
            grid-template-columns:1fr;
          }

          .gs-footer-trust > div{
            border-right:0;
          }

          .gs-footer-bottom-links{
            flex-wrap:wrap;
            gap:14px;
          }

          .gs-footer-copyright{
            flex-wrap:wrap;
          }

        }
          /* =========================================================
   FOOTER TEXT SIZE ENHANCEMENT
   Better readability for desktop / laptop screens
========================================================= */

/* Brand */
.gs-footer-brand-name{
  font-size:30px;
  font-weight:850;
}

.gs-footer-brand small{
  font-size:10px;
  letter-spacing:1.3px;
}

/* Brand description */
.gs-footer-about{
  font-size:14px;
  line-height:1.75;
}

/* AI badge */
.gs-footer-ai-badge small{
  font-size:8px;
}

.gs-footer-ai-badge strong{
  font-size:12px;
}

/* Column headings */
.gs-footer-title{
  font-size:15px;
  font-weight:800;
}

/* Main footer links */
.gs-footer-links a{
  font-size:13.5px;
  line-height:1.5;
}

/* Give links slightly more breathing space */
.gs-footer-links li{
  margin-bottom:14px;
}

/* Newsletter description */
.gs-footer-newsletter-text{
  font-size:13.5px;
  line-height:1.7;
}

/* Newsletter input */
.gs-footer-newsletter input{
  font-size:13px;
}

/* Contact labels */
.gs-footer-contact small{
  font-size:8px;
  letter-spacing:.8px;
}

/* Contact information */
.gs-footer-contact strong{
  font-size:11.5px;
  font-weight:650;
}

/* Trust strip heading */
.gs-footer-trust strong{
  font-size:12.5px;
}

/* Trust strip description */
.gs-footer-trust small{
  font-size:10px;
  line-height:1.4;
}

/* Copyright */
.gs-footer-copyright{
  font-size:11.5px;
}

.gs-footer-copyright strong{
  font-size:12.5px;
}

/* Bottom links */
.gs-footer-bottom-links a{
  font-size:11.5px;
}

/* Disclaimer */
.gs-footer-disclaimer p{
  font-size:10.5px;
  line-height:1.55;
}

/* Footer CTA */
.gs-footer-eyebrow{
  font-size:11px;
}

.gs-footer-cta h3{
  font-size:26px;
}

.gs-footer-cta p{
  font-size:14px;
}

.gs-footer-primary-btn,
.gs-footer-secondary-btn{
  font-size:13px;
}

      `}</style>
    </>
  );
}