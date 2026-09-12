import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Terms.css";

const TERMS_SECTIONS = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "acceptance", number: "02", title: "Acceptance of Terms" },
  { id: "platform", number: "03", title: "About GoSubsidy" },
  { id: "eligibility", number: "04", title: "User Eligibility" },
  { id: "accounts", number: "05", title: "Accounts & Registration" },
  { id: "services", number: "06", title: "Our Services" },
  { id: "government", number: "07", title: "Government Schemes & Benefits" },
  { id: "financial", number: "08", title: "Financial Services Disclaimer" },
  { id: "content", number: "09", title: "Content & Accuracy" },
  { id: "user", number: "10", title: "User Responsibilities" },
  { id: "thirdparty", number: "11", title: "Third-Party Services" },
  { id: "intellectual", number: "12", title: "Intellectual Property" },
  { id: "changes", number: "13", title: "Changes to These Terms" },
  { id: "contact", number: "14", title: "Contact Us" },
];

function Terms() {
  const documentRef = useRef(null);

  // ---------------------------------------------------------
  // IMPORTANT:
  // Always open the Terms page at the TOP.
  // Do not let an old #contact / #changes / #intellectual hash
  // send the user directly to the bottom of the document.
  // ---------------------------------------------------------
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if (documentRef.current) {
      documentRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    // Remove any stale section hash when entering the page.
    // Sidebar navigation below will add a hash only after the
    // user intentionally selects a section.
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );
    }
  }, []);

  const scrollToSection = (id) => {
    const documentPanel = documentRef.current;
    const target = document.getElementById(id);

    if (!documentPanel || !target) return;

    const panelRect = documentPanel.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const scrollTop =
      documentPanel.scrollTop +
      targetRect.top -
      panelRect.top -
      25;

    documentPanel.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: "smooth",
    });

    // Keep the URL useful without causing the browser's native
    // hash scrolling to take control of the document.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}#${id}`
    );
  };

  return (
    <div className="terms-page">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="terms-hero">
        <div className="container">
          <div className="terms-hero-inner">

            <div className="terms-badge">
              <i className="bi bi-file-earmark-text"></i>
              GoSubsidy Terms & Conditions
            </div>

            <h1>
              Terms
              <span>& Conditions.</span>
            </h1>

            <p>
              These Terms & Conditions explain the rules that apply when you
              access or use the GoSubsidy website, platform, tools and
              related services.
            </p>

            <div className="terms-updated">
              <i className="bi bi-calendar3"></i>
              Last updated: August 2026
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          MAIN TWO-PANEL AREA
      ====================================================== */}
      <section className="terms-content-section">
        <div className="container">

          <div className="row g-4">

            {/* =================================================
                LEFT SIDE
            ================================================== */}
            <div className="col-lg-4">

              <div className="terms-sidebar-column">

                {/* Policy / Terms navigation */}
                <aside className="terms-sidebar">

                  <div className="terms-sidebar-title">
                    <span>
                      <i className="bi bi-list-ul"></i>
                    </span>

                    <strong>Terms Contents</strong>
                  </div>

                  <div className="terms-sidebar-links">
                    {TERMS_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                      >
                        <span>{section.number}.</span>
                        {section.title}
                      </button>
                    ))}
                  </div>

                </aside>


                {/* Fixed/sticky information card */}
                <div className="terms-read-card">

                  <div className="terms-read-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>

                  <h4>Please Read Carefully</h4>

                  <p>
                    By accessing or using GoSubsidy, you acknowledge that
                    you have read, understood and agreed to these Terms
                    & Conditions.
                  </p>

                  <div className="terms-read-line"></div>

                  <small>
                    If you do not agree with these Terms, please do not
                    use the platform.
                  </small>

                </div>

              </div>
            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================== */}
            <div className="col-lg-8">

              <main className="terms-document" ref={documentRef}>

                {/* =================================================
                    01
                ================================================== */}
                <section id="introduction">

                  <span className="terms-section-number">01</span>

                  <h2>Introduction</h2>

                  <p>
                    Welcome to GoSubsidy. GoSubsidy is a digital technology
                    platform designed to help individuals, entrepreneurs,
                    farmers, students, startups and businesses discover
                    government schemes, subsidies, incentives and financial
                    opportunities.
                  </p>

                  <p>
                    These Terms & Conditions govern your access to and use
                    of the GoSubsidy website, applications, tools,
                    information and related services.
                  </p>

                  <div className="terms-highlight">
                    <i className="bi bi-info-circle-fill"></i>

                    <span>
                      GoSubsidy is an independent technology platform and
                      is not a Government of India website unless
                      specifically stated otherwise.
                    </span>
                  </div>

                </section>


                {/* =================================================
                    02
                ================================================== */}
                <section id="acceptance">

                  <span className="terms-section-number">02</span>

                  <h2>Acceptance of Terms</h2>

                  <p>
                    By accessing, browsing or using GoSubsidy, you agree
                    to be bound by these Terms & Conditions and any
                    additional terms applicable to specific services.
                  </p>

                  <p>
                    If you do not agree with any part of these Terms,
                    you should discontinue use of the platform.
                  </p>

                  <h3>Your agreement</h3>

                  <ul>
                    <li>You will use the platform lawfully.</li>
                    <li>You will provide accurate information.</li>
                    <li>You will not misuse the platform.</li>
                    <li>You will respect applicable third-party terms.</li>
                  </ul>

                </section>


                {/* =================================================
                    03
                ================================================== */}
                <section id="platform">

                  <span className="terms-section-number">03</span>

                  <h2>About GoSubsidy</h2>

                  <p>
                    GoSubsidy provides technology-enabled discovery and
                    information services relating to government schemes,
                    subsidies, incentives, business support and selected
                    financial opportunities.
                  </p>

                  <p>
                    The platform may organize publicly available
                    information and user-provided information to help
                    users understand potentially relevant opportunities.
                  </p>

                  <div className="terms-highlight">
                    <i className="bi bi-lightbulb-fill"></i>

                    <span>
                      Information presented through GoSubsidy should be
                      treated as informational guidance and not as a
                      guarantee of eligibility, approval or financial
                      benefit.
                    </span>
                  </div>

                </section>


                {/* =================================================
                    04
                ================================================== */}
                <section id="eligibility">

                  <span className="terms-section-number">04</span>

                  <h2>User Eligibility</h2>

                  <p>
                    You must provide information that is reasonably
                    accurate and complete when using services that
                    require registration or submission of information.
                  </p>

                  <p>
                    You are responsible for ensuring that your use of
                    GoSubsidy complies with applicable laws and
                    regulations.
                  </p>

                  <h3>Users must not</h3>

                  <ul>
                    <li>Use another person's account without permission.</li>
                    <li>Submit fraudulent or misleading information.</li>
                    <li>Attempt to bypass security controls.</li>
                    <li>Use the platform for unlawful activities.</li>
                    <li>Interfere with the operation of the website.</li>
                  </ul>

                </section>


                {/* =================================================
                    05
                ================================================== */}
                <section id="accounts">

                  <span className="terms-section-number">05</span>

                  <h2>Accounts & Registration</h2>

                  <p>
                    Certain GoSubsidy features may require you to create
                    an account or submit registration information.
                  </p>

                  <p>
                    You are responsible for maintaining the
                    confidentiality of your login credentials and for
                    activities carried out through your account.
                  </p>

                  <h3>Account security</h3>

                  <ul>
                    <li>Keep your login credentials confidential.</li>
                    <li>Use accurate registration information.</li>
                    <li>Notify us if you believe your account is compromised.</li>
                    <li>Do not share access in a way that violates these Terms.</li>
                  </ul>

                </section>


                {/* =================================================
                    06
                ================================================== */}
                <section id="services">

                  <span className="terms-section-number">06</span>

                  <h2>Our Services</h2>

                  <p>
                    GoSubsidy may provide or make available tools and
                    services including:
                  </p>

                  <div className="terms-feature-grid">

                    <div>
                      <i className="bi bi-bank"></i>
                      <strong>Scheme Discovery</strong>
                      <span>
                        Search and discover potentially relevant
                        government schemes.
                      </span>
                    </div>

                    <div>
                      <i className="bi bi-calculator"></i>
                      <strong>Financial Tools</strong>
                      <span>
                        Calculators and informational financial tools.
                      </span>
                    </div>

                    <div>
                      <i className="bi bi-file-earmark-text"></i>
                      <strong>DPR Support</strong>
                      <span>
                        Technology-assisted project and DPR
                        preparation services.
                      </span>
                    </div>

                    <div>
                      <i className="bi bi-robot"></i>
                      <strong>AI Assistance</strong>
                      <span>
                        Technology-assisted information and guidance.
                      </span>
                    </div>

                  </div>

                </section>


                {/* =================================================
                    07
                ================================================== */}
                <section id="government">

                  <span className="terms-section-number">07</span>

                  <h2>Government Schemes & Benefits</h2>

                  <p>
                    GoSubsidy may provide information about government
                    schemes, subsidies, incentives and support programs.
                  </p>

                  <p>
                    Eligibility criteria, benefit amounts, application
                    processes, documentation requirements and scheme
                    availability may change from time to time.
                  </p>

                  <div className="terms-warning">
                    <i className="bi bi-exclamation-triangle-fill"></i>

                    <span>
                      Listing a scheme on GoSubsidy does not mean that
                      you are eligible for that scheme or that your
                      application will be approved.
                    </span>
                  </div>

                  <h3>Final decision</h3>

                  <p>
                    The relevant government department, authority,
                    implementing agency or institution remains
                    responsible for determining eligibility and
                    approving or rejecting applications.
                  </p>

                </section>


                {/* =================================================
                    08
                ================================================== */}
                <section id="financial">

                  <span className="terms-section-number">08</span>

                  <h2>Financial Services Disclaimer</h2>

                  <p>
                    GoSubsidy may provide information, tools or
                    connections relating to loans, insurance, credit,
                    financial products or other financial services.
                  </p>

                  <p>
                    Unless expressly stated otherwise, GoSubsidy does
                    not itself guarantee loan approval, insurance
                    coverage, subsidy approval, credit approval or any
                    other financial outcome.
                  </p>

                  <div className="terms-feature-grid">

                    <div>
                      <i className="bi bi-credit-card"></i>
                      <strong>Loans</strong>
                      <span>
                        Approval is subject to the lender's policies
                        and assessment.
                      </span>
                    </div>

                    <div>
                      <i className="bi bi-shield-check"></i>
                      <strong>Insurance</strong>
                      <span>
                        Coverage is governed by the applicable insurer
                        and policy terms.
                      </span>
                    </div>

                    <div>
                      <i className="bi bi-bar-chart"></i>
                      <strong>Credit</strong>
                      <span>
                        Credit decisions remain subject to the relevant
                        institution.
                      </span>
                    </div>

                  </div>

                </section>


                {/* =================================================
                    09
                ================================================== */}
                <section id="content">

                  <span className="terms-section-number">09</span>

                  <h2>Content & Accuracy</h2>

                  <p>
                    We aim to provide useful and current information.
                    However, information may occasionally contain
                    errors, omissions or outdated details.
                  </p>

                  <p>
                    Government schemes, financial products, eligibility
                    requirements, interest rates, documentation,
                    deadlines and other information may change without
                    notice.
                  </p>

                  <h3>User verification</h3>

                  <p>
                    Users should independently verify important
                    information with the relevant government authority,
                    lender, insurer, institution or other service
                    provider before making decisions.
                  </p>

                </section>


                {/* =================================================
                    10
                ================================================== */}
                <section id="user">

                  <span className="terms-section-number">10</span>

                  <h2>User Responsibilities</h2>

                  <p>
                    You agree to use GoSubsidy responsibly and only for
                    lawful purposes.
                  </p>

                  <h3>You agree not to:</h3>

                  <ul>
                    <li>Submit false or fraudulent information.</li>
                    <li>Attempt unauthorized access.</li>
                    <li>Upload malicious software or harmful content.</li>
                    <li>Scrape or systematically copy platform content without permission.</li>
                    <li>Impersonate another person or organization.</li>
                    <li>Use GoSubsidy to violate applicable laws.</li>
                  </ul>

                </section>


                {/* =================================================
                    11
                ================================================== */}
                <section id="thirdparty">

                  <span className="terms-section-number">11</span>

                  <h2>Third-Party Services</h2>

                  <p>
                    GoSubsidy may contain links, integrations,
                    advertisements, referral arrangements or connections
                    to third-party websites and service providers.
                  </p>

                  <p>
                    Third-party services operate independently and may
                    have their own terms, privacy policies and eligibility
                    requirements.
                  </p>

                  <div className="terms-highlight">
                    <i className="bi bi-box-arrow-up-right"></i>

                    <span>
                      GoSubsidy is not responsible for the policies,
                      availability, content, decisions or services of
                      independent third parties.
                    </span>
                  </div>

                </section>


                {/* =================================================
                    12
                ================================================== */}
                <section id="intellectual">

                  <span className="terms-section-number">12</span>

                  <h2>Intellectual Property</h2>

                  <p>
                    Unless otherwise stated, the GoSubsidy name,
                    branding, logos, website design, original content,
                    software, interfaces and other platform materials
                    are owned by or licensed to GoSubsidy.
                  </p>

                  <p>
                    You may not reproduce, modify, distribute, sell,
                    publish or commercially exploit protected GoSubsidy
                    materials without appropriate authorization.
                  </p>

                  <h3>Third-party materials</h3>

                  <p>
                    Government logos, trademarks, scheme names and
                    third-party trademarks remain the property of their
                    respective owners.
                  </p>

                </section>


                {/* =================================================
                    13
                ================================================== */}
                <section id="changes">

                  <span className="terms-section-number">13</span>

                  <h2>Changes to These Terms</h2>

                  <p>
                    We may update these Terms & Conditions from time to
                    time to reflect changes to our services, technology,
                    business practices or applicable requirements.
                  </p>

                  <p>
                    Updated versions will be published on this page.
                    The revised version will become effective from the
                    date stated in the updated Terms.
                  </p>

                  <div className="terms-highlight">
                    <i className="bi bi-arrow-clockwise"></i>

                    <span>
                      We encourage users to periodically review this
                      page for the latest version of the Terms.
                    </span>
                  </div>

                </section>


                {/* =================================================
                    14
                ================================================== */}
                <section id="contact">

                  <span className="terms-section-number">14</span>

                  <h2>Contact Us</h2>

                  <p>
                    If you have questions, concerns or requests
                    regarding these Terms & Conditions, you can contact
                    GoSubsidy through the contact information provided
                    on our website.
                  </p>

                  <div className="terms-contact-card">

                    <div className="terms-contact-icon">
                      <i className="bi bi-envelope"></i>
                    </div>

                    <div>
                      <span>Email</span>

                      <a href="mailto:info@gosubsidy.com">
                        info@gosubsidy.com
                      </a>

                      <small>
                        For general questions regarding GoSubsidy and
                        these Terms & Conditions.
                      </small>
                    </div>

                  </div>

                  <div className="terms-final-note">

                    <i className="bi bi-check-circle-fill"></i>

                    <div>
                      <strong>
                        Thank you for using GoSubsidy.
                      </strong>

                      <p>
                        We are committed to building a useful,
                        transparent and responsible platform for
                        discovering government benefits and financial
                        opportunities.
                      </p>
                    </div>

                  </div>

                </section>

              </main>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}
      <section className="terms-bottom">
        <div className="container">

          <div className="terms-bottom-card">

            <div>
              <h2>
                Need <strong>help?</strong>
              </h2>

              <p>
                Have a question about these Terms or GoSubsidy services?
              </p>
            </div>

            <Link
              to="/contact"
              className="terms-contact-button"
            >
              <i className="bi bi-envelope"></i>
              Contact Us
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Terms;