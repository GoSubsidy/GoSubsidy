import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Privacy.css";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    document.title = "Privacy Policy | GoSubsidy";
  }, []);

  return (
    <main className="privacy-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="privacy-hero">
        <div className="container">

          <div className="privacy-hero-inner">

            <div className="privacy-badge">
              <i className="bi bi-shield-lock-fill"></i>
              GoSubsidy Privacy & Data Protection
            </div>

            <h1>
              Privacy
              <span>Policy.</span>
            </h1>

            <p>
              Your privacy matters to us. This Privacy Policy explains how
              GoSubsidy collects, uses, protects and manages information when
              you use our website, services and digital platforms.
            </p>

            <div className="privacy-updated">
              <i className="bi bi-calendar3"></i>
              Last Updated: 15 August 2026
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="privacy-content-section">
        <div className="container">

          <div className="row g-4">

            {/* =============================================
                SIDEBAR
            ============================================== */}

            <div className="col-lg-4 privacy-left-column">

              <div className="privacy-sidebar">

                <div className="privacy-sidebar-title">
                  <i className="bi bi-list-ul"></i>
                  Policy Contents
                </div>

                <a href="#introduction">1. Introduction</a>
                <a href="#information">2. Information We Collect</a>
                <a href="#usage">3. How We Use Information</a>
                <a href="#schemes">4. Government Schemes & Eligibility</a>
                <a href="#financial">5. Financial & Credit Information</a>
                <a href="#cookies">6. Cookies & Technologies</a>
                <a href="#sharing">7. Information Sharing</a>
                <a href="#security">8. Data Security</a>
                <a href="#retention">9. Data Retention</a>
                <a href="#rights">10. Your Privacy Rights</a>
                <a href="#children">11. Children's Privacy</a>
                <a href="#thirdparty">12. Third-Party Services</a>
                <a href="#changes">13. Policy Changes</a>
                <a href="#contact">14. Contact Us</a>

              </div>

              <div className="privacy-security-card">

                <div className="privacy-security-icon">
                  <i className="bi bi-shield-check"></i>
                </div>

                <h4>Your Privacy Matters</h4>

                <p>
                  We aim to process personal information responsibly and only
                  for legitimate purposes connected with our services.
                </p>

              </div>

            </div>


            {/* =============================================
                POLICY BODY
            ============================================== */}

            <div className="col-lg-8 privacy-right-column">

              <article className="privacy-document" tabIndex="0">

                {/* 1 */}

                <section id="introduction">
                  <span className="privacy-section-number">01</span>

                  <h2>Introduction</h2>

                  <p>
                    GoSubsidy is a digital technology platform designed to
                    help individuals, entrepreneurs, farmers, students,
                    startups and businesses discover government schemes,
                    subsidies, incentives and financial opportunities.
                  </p>

                  <p>
                    This Privacy Policy describes how information may be
                    collected, used, stored and protected when you access or
                    use the GoSubsidy website and related services.
                  </p>

                  <div className="privacy-highlight">
                    <i className="bi bi-info-circle-fill"></i>
                    <div>
                      GoSubsidy is an independent technology platform and is
                      not a Government of India website unless specifically
                      stated otherwise.
                    </div>
                  </div>
                </section>


                {/* 2 */}

                <section id="information">
                  <span className="privacy-section-number">02</span>

                  <h2>Information We Collect</h2>

                  <p>
                    Depending on the services you use, we may collect
                    information that you voluntarily provide to us.
                  </p>

                  <h3>Information you provide</h3>

                  <ul>
                    <li>Name and contact details</li>
                    <li>Email address</li>
                    <li>Mobile number</li>
                    <li>Business or organisation information</li>
                    <li>Location or state information</li>
                    <li>Project and business information</li>
                    <li>Information submitted for scheme discovery</li>
                    <li>Information submitted for DPR preparation</li>
                    <li>Information submitted through contact forms</li>
                    <li>Information submitted through account registration</li>
                  </ul>

                  <h3>Automatically collected information</h3>

                  <p>
                    We may also collect limited technical information such as
                    browser type, device information, IP address, pages visited,
                    referring pages and general usage information for security,
                    analytics and service improvement.
                  </p>
                </section>


                {/* 3 */}

                <section id="usage">
                  <span className="privacy-section-number">03</span>

                  <h2>How We Use Information</h2>

                  <p>
                    Information may be used for purposes including:
                  </p>

                  <ul>
                    <li>Providing and improving GoSubsidy services</li>
                    <li>Creating and managing user accounts</li>
                    <li>Helping users discover relevant schemes</li>
                    <li>Understanding eligibility information supplied by users</li>
                    <li>Preparing DPR and project-related information</li>
                    <li>Providing credit-readiness guidance</li>
                    <li>Responding to enquiries and support requests</li>
                    <li>Improving website performance and user experience</li>
                    <li>Detecting fraud, abuse or security incidents</li>
                    <li>Maintaining technical and operational records</li>
                    <li>Complying with applicable legal requirements</li>
                  </ul>
                </section>


                {/* 4 */}

                <section id="schemes">
                  <span className="privacy-section-number">04</span>

                  <h2>Government Schemes & Eligibility</h2>

                  <p>
                    GoSubsidy may use information provided by users to help
                    identify government schemes, subsidies, incentives or
                    financial-support programmes that may appear relevant.
                  </p>

                  <p>
                    Eligibility information displayed by GoSubsidy is intended
                    for informational and guidance purposes. Final eligibility,
                    approval, subsidy release and sanction decisions are made
                    by the respective government authority, department,
                    financial institution or other competent organisation.
                  </p>

                  <div className="privacy-warning">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>
                      A scheme match or eligibility indication on GoSubsidy
                      does not guarantee approval, subsidy sanction, loan
                      sanction or financial benefit.
                    </div>
                  </div>
                </section>


                {/* 5 */}

                <section id="financial">
                  <span className="privacy-section-number">05</span>

                  <h2>Financial & Credit Information</h2>

                  <p>
                    Certain GoSubsidy services may involve information related
                    to loans, credit readiness, project finance, EMI
                    calculations or other financial requirements.
                  </p>

                  <p>
                    Users should provide only information that is necessary
                    for the particular service they are using.
                  </p>

                  <p>
                    GoSubsidy does not guarantee loan approval, credit-score
                    improvement, interest-rate approval or any financial
                    outcome. Decisions relating to lending, insurance or other
                    regulated financial products remain with the relevant
                    licensed institution or service provider.
                  </p>
                </section>


                {/* 6 */}

                <section id="cookies">
                  <span className="privacy-section-number">06</span>

                  <h2>Cookies & Technologies</h2>

                  <p>
                    GoSubsidy may use cookies, local storage, session storage,
                    analytics technologies and similar tools to operate the
                    website, maintain sessions, improve security and understand
                    website usage.
                  </p>

                  <p>
                    You may be able to control cookies through your browser
                    settings. Disabling certain technologies may affect some
                    website functionality.
                  </p>
                </section>


                {/* 7 */}

                <section id="sharing">
                  <span className="privacy-section-number">07</span>

                  <h2>Information Sharing</h2>

                  <p>
                    We do not intend to sell personal information as a product.
                    Information may be shared where reasonably necessary to
                    provide requested services, operate our platform, comply
                    with law or protect our users and systems.
                  </p>

                  <p>Depending on the service, this may include:</p>

                  <ul>
                    <li>Technology and hosting providers</li>
                    <li>Analytics and security service providers</li>
                    <li>Communication and support providers</li>
                    <li>Professional service providers</li>
                    <li>Financial institutions or service providers where the
                        user expressly requests or authorises a service</li>
                    <li>Government authorities or regulators where legally required</li>
                  </ul>

                  <p>
                    Third-party service providers may process information on
                    behalf of GoSubsidy subject to applicable contractual,
                    technical or legal safeguards.
                  </p>
                </section>


                {/* 8 */}

                <section id="security">
                  <span className="privacy-section-number">08</span>

                  <h2>Data Security</h2>

                  <p>
                    We take reasonable technical and organisational measures
                    designed to protect information against unauthorised
                    access, misuse, alteration, disclosure or destruction.
                  </p>

                  <div className="privacy-feature-grid">

                    <div>
                      <i className="bi bi-lock-fill"></i>
                      <strong>Secure Processing</strong>
                      <span>Reasonable safeguards for information handling.</span>
                    </div>

                    <div>
                      <i className="bi bi-shield-fill-check"></i>
                      <strong>Access Controls</strong>
                      <span>Access is limited according to operational needs.</span>
                    </div>

                    <div>
                      <i className="bi bi-eye-slash-fill"></i>
                      <strong>Privacy Focus</strong>
                      <span>We seek to minimise unnecessary data collection.</span>
                    </div>

                  </div>

                  <p>
                    No internet transmission or storage system can be
                    guaranteed to be completely secure.
                  </p>
                </section>


                {/* 9 */}

                <section id="retention">
                  <span className="privacy-section-number">09</span>

                  <h2>Data Retention</h2>

                  <p>
                    We retain personal information only for as long as
                    reasonably necessary for the purposes for which it was
                    collected, to provide requested services, maintain records,
                    resolve disputes, enforce agreements or comply with
                    applicable legal obligations.
                  </p>

                  <p>
                    Retention periods may vary depending on the type of
                    information and the service involved.
                  </p>
                </section>


                {/* 10 */}

                <section id="rights">
                  <span className="privacy-section-number">10</span>

                  <h2>Your Privacy Rights</h2>

                  <p>
                    Subject to applicable law and the stage of implementation
                    of relevant data-protection requirements, users may have
                    rights concerning their personal information, including
                    rights relating to access, correction, updating,
                    withdrawal of consent and grievance redressal.
                  </p>

                  <p>
                    Where processing is based on consent, you may request
                    withdrawal of consent. Withdrawal does not affect the
                    lawfulness of processing carried out before withdrawal.
                  </p>

                  <div className="privacy-rights">

                    <div>
                      <i className="bi bi-person-check-fill"></i>
                      <span>Access information</span>
                    </div>

                    <div>
                      <i className="bi bi-pencil-square"></i>
                      <span>Correct information</span>
                    </div>

                    <div>
                      <i className="bi bi-x-circle-fill"></i>
                      <span>Withdraw consent where applicable</span>
                    </div>

                    <div>
                      <i className="bi bi-chat-left-text-fill"></i>
                      <span>Raise privacy concerns</span>
                    </div>

                  </div>
                </section>


                {/* 11 */}

                <section id="children">
                  <span className="privacy-section-number">11</span>

                  <h2>Children's Privacy</h2>

                  <p>
                    GoSubsidy is not intended to encourage children to provide
                    personal information independently where such collection
                    requires parental or lawful consent under applicable law.
                  </p>

                  <p>
                    Where services involve children or persons requiring
                    verifiable consent, additional safeguards may apply.
                  </p>
                </section>


                {/* 12 */}

                <section id="thirdparty">
                  <span className="privacy-section-number">12</span>

                  <h2>Third-Party Services</h2>

                  <p>
                    The GoSubsidy platform may contain links to or integrations
                    with third-party websites, financial institutions,
                    government resources, technology providers or other
                    services.
                  </p>

                  <p>
                    Third-party websites and services operate under their own
                    privacy policies and terms. GoSubsidy is not responsible for
                    the privacy practices of independent third parties.
                  </p>
                </section>


                {/* 13 */}

                <section id="changes">
                  <span className="privacy-section-number">13</span>

                  <h2>Changes to This Privacy Policy</h2>

                  <p>
                    We may update this Privacy Policy from time to time to
                    reflect changes to our services, technology, legal
                    requirements or privacy practices.
                  </p>

                  <p>
                    Updated versions will be published on this page with the
                    revised effective or updated date.
                  </p>
                </section>


                {/* 14 */}

                <section id="contact">
                  <span className="privacy-section-number">14</span>

                  <h2>Contact Us</h2>

                  <p>
                    If you have questions, requests or concerns regarding this
                    Privacy Policy or the handling of your personal information,
                    please contact GoSubsidy.
                  </p>

                  <div className="privacy-contact-card">

                    <div className="privacy-contact-icon">
                      <i className="bi bi-envelope-fill"></i>
                    </div>

                    <div>
                      <span>Privacy & Support</span>

                      <a href="mailto:info@gosubsidy.com">
                        info@gosubsidy.com
                      </a>

                      <small>
                        We aim to respond to privacy-related enquiries within
                        a reasonable period.
                      </small>
                    </div>

                  </div>

                </section>


                {/* FINAL */}

                <div className="privacy-final-note">

                  <i className="bi bi-shield-check"></i>

                  <div>
                    <strong>GoSubsidy</strong>

                    <p>
                      Building a trusted digital platform for discovering
                      government schemes, subsidies and financial opportunities.
                    </p>
                  </div>

                </div>

              </article>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="privacy-bottom">

        <div className="container">

          <div className="privacy-bottom-card">

            <div>
              <span>GOSUBSIDY</span>

              <h2>
                Have a privacy
                <strong> question?</strong>
              </h2>

              <p>
                Our team is here to help with privacy and data-related
                enquiries.
              </p>
            </div>

            <Link
              to="/contact"
              className="privacy-contact-button"
            >
              Contact Us
              <i className="bi bi-arrow-right"></i>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}