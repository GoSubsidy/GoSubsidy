import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  const missionCards = [
    {
      number: "01",
      icon: "⌕",
      tone: "blue",
      title: "Discover",
      text: "Find relevant government schemes, subsidies, incentives and financial assistance based on your profile.",
    },
    {
      number: "02",
      icon: "◎",
      tone: "green",
      title: "Understand",
      text: "Get simple explanations of eligibility, benefits, documents and application requirements.",
    },
    {
      number: "03",
      icon: "↗",
      tone: "orange",
      title: "Apply",
      text: "Get guided assistance to understand the next steps and move forward with your application.",
    },
  ];

  const opportunities = [
    {
      icon: "▦",
      title: "MSME Support",
      subtitle: "Business & Manufacturing",
      match: "92%",
      tone: "blue",
    },
    {
      icon: "♧",
      title: "Agriculture Support",
      subtitle: "Farm & Rural Development",
      match: "86%",
      tone: "green",
    },
    {
      icon: "✦",
      title: "Education Support",
      subtitle: "Students & Education",
      match: "81%",
      tone: "purple",
    },
  ];

  const audiences = [
    {
      icon: "♙",
      title: "Entrepreneurs",
      text: "Start and grow businesses.",
      tone: "blue",
    },
    {
      icon: "▦",
      title: "MSMEs",
      text: "Find business support.",
      tone: "purple",
    },
    {
      icon: "♧",
      title: "Farmers",
      text: "Discover agriculture schemes.",
      tone: "green",
    },
    {
      icon: "✦",
      title: "Students",
      text: "Find education support.",
      tone: "orange",
    },
  ];

  return (
    <main className="about-page about-page-modern">
      {/* HERO */}
      <section className="about-hero about-hero-modern">
        <div className="about-shell about-hero-grid">
          <div className="about-hero-copy">
            <div className="about-eyebrow">
              <span className="about-eyebrow-dot">✦</span>
              <span>Empowering India's Growth</span>
            </div>

            <h1>
              Making Government
              <span>Benefits Simple.</span>
            </h1>

            <p className="about-hero-text">
              GoSubsidy is a digital platform designed to help individuals,
              entrepreneurs, farmers, students and businesses discover,
              understand and access government subsidies, schemes, incentives
              and financial support.
            </p>

            <div className="about-hero-actions">
              <Link to="/schemes" className="about-primary-btn">
                Explore Schemes <span>→</span>
              </Link>

              <Link to="/contact" className="about-secondary-btn">
                Contact Us
              </Link>
            </div>

            <div className="about-trust-row">
              <span>✓ Central & State Schemes</span>
              <span>✓ Business Support</span>
              <span>✓ Guided Discovery</span>
            </div>
          </div>

          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-orb orb-one" />
            <div className="about-orb orb-two" />
            <div className="about-grid-pattern" />

            <div className="about-intelligence-card">
              <div className="intelligence-top">
                <div>
                  <span>GoSubsidy Intelligence</span>
                  <strong>Opportunity Finder</strong>
                </div>
                <div className="live-pill">
                  <i /> LIVE
                </div>
              </div>

              <div className="intelligence-score">
                <div className="score-ring">
                  <span>92%</span>
                  <small>Match</small>
                </div>

                <div className="score-copy">
                  <span>Potential opportunity</span>
                  <strong>MSME Support</strong>
                  <small>Business & Manufacturing</small>
                </div>
              </div>

              <div className="mini-progress">
                <span />
              </div>

              <div className="intelligence-footer">
                <span>Personalized discovery</span>
                <span>→</span>
              </div>
            </div>

            <div className="about-floating-card floating-business">
              <div className="floating-icon blue">▦</div>
              <div>
                <strong>Business</strong>
                <small>Support</small>
              </div>
              <span className="floating-check">✓</span>
            </div>

            <div className="about-floating-card floating-farmer">
              <div className="floating-icon green">♧</div>
              <div>
                <strong>Farmers</strong>
                <small>Subsidies</small>
              </div>
              <span className="floating-check">✓</span>
            </div>

            <div className="about-floating-card floating-student">
              <div className="floating-icon purple">✦</div>
              <div>
                <strong>Students</strong>
                <small>Benefits</small>
              </div>
              <span className="floating-check">✓</span>
            </div>

            <div className="about-main-coin">
              <span>₹</span>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-section about-mission">
        <div className="about-shell">
          <div className="about-section-heading">
            <div className="about-label">OUR MISSION</div>
            <h2>
              Bridging the Gap Between
              <span>People & Government Benefits</span>
            </h2>
            <p>
              Thousands of government schemes and financial support programs
              exist across India. The challenge is knowing what is available,
              who is eligible and how to apply.
            </p>
          </div>

          <div className="mission-grid">
            {missionCards.map((card) => (
              <article
                className={`mission-card mission-card-${card.tone}`}
                key={card.number}
              >
                <div className="mission-card-top">
                  <div className="mission-icon">{card.icon}</div>
                  <span className="mission-number">{card.number}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="mission-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="about-section about-solutions">
        <div className="about-shell about-two-column">
          <div className="solutions-copy">
            <div className="about-label">WHAT WE DO</div>
            <h2>
              One Platform.
              <span>Multiple Opportunities.</span>
            </h2>
            <p className="solutions-lead">
              GoSubsidy brings important financial-support information together
              in one easy-to-use digital platform.
            </p>

            <div className="about-check-list">
              <div className="about-check-item">
                <span>✓</span>
                <div>
                  <strong>Government Subsidies</strong>
                  <p>Discover central and state government subsidy programs.</p>
                </div>
              </div>

              <div className="about-check-item">
                <span>✓</span>
                <div>
                  <strong>Business Schemes</strong>
                  <p>
                    Explore schemes supporting MSMEs, startups and
                    entrepreneurs.
                  </p>
                </div>
              </div>

              <div className="about-check-item">
                <span>✓</span>
                <div>
                  <strong>Loans & Financial Support</strong>
                  <p>
                    Understand available financing and interest-support
                    programs.
                  </p>
                </div>
              </div>

              <div className="about-check-item">
                <span>✓</span>
                <div>
                  <strong>AI-Powered Guidance</strong>
                  <p>
                    Get personalized guidance to identify potentially relevant
                    opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-shell">
            <div className="dashboard-card">
              <div className="dashboard-glow" />

              <div className="dashboard-header">
                <div>
                  <span>GoSubsidy Intelligence</span>
                  <h3>Your Opportunities</h3>
                </div>
                <div className="dashboard-active">
                  <i /> Active
                </div>
              </div>

              <div className="dashboard-summary">
                <div className="summary-value">3</div>
                <div>
                  <strong>Relevant opportunities</strong>
                  <span>Based on your profile</span>
                </div>
              </div>

              <div className="opportunity-list">
                {opportunities.map((item) => (
                  <div className="opportunity-item" key={item.title}>
                    <div className={`opportunity-icon ${item.tone}`}>
                      {item.icon}
                    </div>

                    <div className="opportunity-content">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>

                    <div className="match-score">
                      <strong>{item.match}</strong>
                      <span>match</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-footer">
                <span>Personalized discovery</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="about-section about-audience">
        <div className="about-shell">
          <div className="about-section-heading centered">
            <div className="about-label">WHO WE SERVE</div>
            <h2>
              Built for the People
              <span>Who Build India</span>
            </h2>
            <p>
              GoSubsidy is designed for different stages of personal,
              professional and business growth.
            </p>
          </div>

          <div className="audience-grid">
            {audiences.map((item) => (
              <article className="audience-card" key={item.title}>
                <div className={`audience-icon ${item.tone}`}>
                  {item.icon}
                </div>
                <div className="audience-arrow">↗</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="about-vision">
        <div className="about-shell">
          <div className="vision-card">
            <div className="vision-copy">
              <div className="about-label light">OUR VISION</div>
              <h2>
                A Future Where
                <span>Opportunity Finds You.</span>
              </h2>
              <p>
                Our vision is to build India's trusted digital gateway for
                government benefits and financial opportunities—making it
                easier for every eligible person and business to discover
                support and take the next step.
              </p>

              <div className="vision-stats">
                <div>
                  <strong>1</strong>
                  <span>Unified Platform</span>
                </div>
                <div>
                  <strong>AI</strong>
                  <span>Smart Guidance</span>
                </div>
                <div>
                  <strong>India</strong>
                  <span>Focused</span>
                </div>
              </div>
            </div>

            <div className="vision-art" aria-hidden="true">
              <div className="vision-ring ring-one" />
              <div className="vision-ring ring-two" />
              <div className="vision-center">
                <span>₹</span>
                <small>OPPORTUNITY</small>
              </div>
              <div className="vision-dot dot-one" />
              <div className="vision-dot dot-two" />
              <div className="vision-dot dot-three" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-shell">
          <div className="cta-card">
            <div>
              <div className="cta-label">START YOUR JOURNEY</div>
              <h2>
                Don't Miss the Opportunity
                <span>You May Be Eligible For.</span>
              </h2>
              <p>
                Explore government schemes and discover opportunities relevant
                to you.
              </p>
            </div>

            <Link to="/schemes" className="cta-button">
              Explore Schemes <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;