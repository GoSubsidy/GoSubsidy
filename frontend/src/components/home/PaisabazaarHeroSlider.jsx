import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSchemes } from "../../services/api";

/*
  GoSubsidy Home Hero — reference matched

  Required files in:
  frontend/public/images/home/

  - gosubsidy-hero-person-clean.png
  - business-proposal-fried-chicken.png
  - business-proposal-cold-storage.png
  - business-proposal-chicken-processing.png
  - business-proposal-rice-milling.png
  - business-proposal-dairy-processing.png

  NOTE:
  This component intentionally keeps the existing:
  - fetchSchemes() integration
  - onSchemeClick callback
  - /schemes navigation behavior
  - 5 second slider
  - proposal click -> /dpr
*/

const HERO_SLIDES = [
  {
    id: "fried-chicken",
    image: "/images/home/business-proposal-fried-chicken.png",
    alt: "GoSubsidy Fried Chicken Business Proposal",
    link: "/dpr",
  },
  {
    id: "cold-storage",
    image: "/images/home/business-proposal-cold-storage.png",
    alt: "GoSubsidy Cold Storage Business Proposal",
    link: "/dpr",
  },
  {
    id: "chicken-processing",
    image: "/images/home/business-proposal-chicken-processing.png",
    alt: "GoSubsidy Chicken Processing Business Proposal",
    link: "/dpr",
  },
  {
    id: "rice-milling",
    image: "/images/home/business-proposal-rice-milling.png",
    alt: "GoSubsidy Rice Milling Business Proposal",
    link: "/dpr",
  },
  {
    id: "dairy-processing",
    image: "/images/home/business-proposal-dairy-processing.png",
    alt: "GoSubsidy Dairy Processing Business Proposal",
    link: "/dpr",
  },
];

const HERO_SERVICES = [
  {
    title: "Government",
    title2: "Schemes",
    sub: "Find & Apply",
    icon: "bi-bank2",
    tone: "green",
    link: "/schemes",
  },
  {
    title: "Business",
    title2: "Loans",
    sub: "Compare Options",
    icon: "bi-currency-rupee",
    tone: "blue",
    link: "/loans",
  },
  {
    title: "Registrations",
    title2: "& Licenses",
    sub: "Start with Ease",
    icon: "bi-file-earmark-text",
    tone: "orange",
    link: "/services",
  },
  {
    title: "Detailed",
    title2: "Project Report",
    sub: "Investor & Bank Ready",
    icon: "bi-graph-up-arrow",
    tone: "purple",
    link: "/dpr",
  },
  {
    title: "Compliance",
    title2: "Support",
    sub: "Stay Compliant",
    icon: "bi-shield-check",
    tone: "teal",
    link: "/services",
  },
];

const STATS = [
  {
    icon: "bi-people-fill",
    value: "10,000+",
    label: "Entrepreneurs Supported",
    tone: "blue",
  },
  {
    icon: "bi-file-earmark-text-fill",
    value: "500+",
    label: "Government Schemes",
    tone: "blue",
  },
  {
    icon: "bi-currency-rupee",
    value: "₹ 2,000+ Cr",
    label: "Potential Funding Opportunities",
    tone: "green",
  },
  {
    icon: "bi-graph-up-arrow",
    value: "95%",
    label: "Customer Satisfaction",
    tone: "green",
  },
];

const INDUSTRIES = [
  { icon: "bi-buildings-fill", label: "Manufacturing" },
  { icon: "bi-leaf-fill", label: "Agriculture" },
  { icon: "bi-shop", label: "Services" },
  { icon: "bi-rocket-takeoff-fill", label: "Startups" },
];

export default function PaisabazaarHeroSlider({ onSchemeClick }) {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(HERO_SLIDES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchSchemes()
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : res?.schemes || res?.data || [];

        if (!mounted || !list.length) return;

        const live = list[0];

        setSlides((current) =>
          current.map((slide, index) =>
            index === 0
              ? {
                  ...slide,
                  liveScheme:
                    live?.name || live?.title
                      ? live.name || live.title
                      : undefined,
                }
              : slide
          )
        );
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const goTo = (path) => {
    if (path === "/schemes" && typeof onSchemeClick === "function") {
      onSchemeClick(path);
      return;
    }
    navigate(path);
  };

  const previous = () => {
    setActiveIndex(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="gs-reference-hero">
      <style>{`
        .gs-reference-hero {
          --gs-navy: #071a39;
          --gs-blue: #087bea;
          --gs-cyan: #00a3bf;
          --gs-green: #00a86d;
          width: 100%;
          overflow: hidden;
          position: relative;
          color: var(--gs-navy);
          background:
            radial-gradient(520px 360px at 68% 56%, rgba(69,218,204,.18), transparent 70%),
            radial-gradient(620px 420px at 13% 38%, rgba(54,171,255,.13), transparent 72%),
            linear-gradient(110deg,#f4fbff 0%,#ffffff 46%,#effcff 100%);
          font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
        }

        .gs-reference-hero *,
        .gs-reference-hero *::before,
        .gs-reference-hero *::after {
          box-sizing: border-box;
        }

        /* ---------------------------------------------------------
           MAIN HERO
           The target screenshot has a compact hero immediately
           below the existing navbar.
        --------------------------------------------------------- */

        .gs-hero-main {
          width: min(1600px, calc(100% - 84px));
          height: 650px;
          margin: 0 auto;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 500px;
          gap: 10px;
        }

        .gs-hero-copy {
          min-width: 0;
          position: relative;
          z-index: 5;
          padding: 40px 0 0 4px;
        }

        .gs-hero-badge {
          height: 42px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #c7e5ff;
          border-radius: 23px;
          background: rgba(220,239,255,.82);
          color: #0870df;
          box-shadow: 0 7px 18px rgba(20,105,175,.07);
          font-size: 13px;
          font-weight: 850;
          letter-spacing: .25px;
          text-transform: uppercase;
        }

        .gs-hero-badge i {
          font-size: 16px;
        }

        .gs-hero-title {
          margin: 24px 0 0;
          max-width: 900px;
          color: #071a39;
          font-size: clamp(40px, 3.35vw, 54px);
          line-height: 1.055;
          letter-spacing: -2.5px;
          font-weight: 900;
        }

        .gs-hero-title .gs-gradient {
          display: block;
          margin-top: 2px;
          background: linear-gradient(100deg,#087bea 0%,#079bd1 47%,#00a48c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gs-hero-description {
          max-width: 690px;
          margin: 21px 0 26px;
          color: #355a7b;
          font-size: 16px;
          line-height: 1.45;
          font-weight: 500;
        }

        /* Service cards are intentionally narrower than the copy area.
           This leaves the person visible like the reference. */
        .gs-service-grid {
          width: min(680px, 100%);
          display: grid;
          grid-template-columns: repeat(5, minmax(0,1fr));
          gap: 12px;
          position: relative;
          z-index: 8;
        }

        .gs-service-card {
          height: 132px;
          min-width: 0;
          padding: 12px 7px 10px;
          border: 1px solid #d6e8f4;
          border-radius: 16px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 8px 22px rgba(27,82,115,.075);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          color: var(--gs-navy);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .gs-service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(25,87,122,.14);
        }

        .gs-service-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          margin-bottom: 7px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          box-shadow: 0 7px 16px rgba(30,75,105,.13);
        }

        .gs-service-icon.green { background: linear-gradient(135deg,#0aae65,#008c51); }
        .gs-service-icon.blue { background: linear-gradient(135deg,#087df1,#1559ca); }
        .gs-service-icon.orange { background: linear-gradient(135deg,#ff9c0a,#ff6900); }
        .gs-service-icon.purple { background: linear-gradient(135deg,#7657f5,#5135ca); }
        .gs-service-icon.teal { background: linear-gradient(135deg,#07b2a1,#008f7e); }

        .gs-service-card strong {
          color: #071a39;
          font-size: 11.5px;
          line-height: 1.12;
          font-weight: 850;
        }

        .gs-service-card small {
          margin-top: 7px;
          color: #5b7894;
          font-size: 9.5px;
          line-height: 1.15;
          font-weight: 600;
        }

        .gs-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 25px;
          position: relative;
          z-index: 9;
        }

        .gs-btn {
          height: 54px;
          padding: 0 28px;
          border-radius: 29px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 850;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .gs-btn:hover {
          transform: translateY(-3px);
        }

        .gs-btn-primary {
          min-width: 235px;
          border: 0;
          color: #fff;
          background: linear-gradient(90deg,#00a96d,#00a486);
          box-shadow: 0 11px 24px rgba(0,166,106,.22);
        }

        .gs-btn-secondary {
          min-width: 238px;
          border: 2px solid #00af9d;
          color: #008f7c;
          background: rgba(255,255,255,.92);
        }

        .gs-trust {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 27px;
          margin-top: 23px;
          position: relative;
          z-index: 9;
        }

        .gs-trust span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #466984;
          font-size: 12.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .gs-trust i {
          color: #06a96d;
          font-size: 18px;
        }

        /* ---------------------------------------------------------
           PERSON
           The reference has the person in the centre gap, not on
           top of the service cards and not behind the proposal.
        --------------------------------------------------------- */

        .gs-person {
          position: absolute;
          z-index: 4;
          left: 52%;
          bottom: 0;
          width: 350px;
          height: 490px;
          pointer-events: none;
        }

        .gs-person::before {
          content: "";
          position: absolute;
          width: 330px;
          height: 330px;
          left: -8px;
          top: 65px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(77,220,205,.21) 0%,
            rgba(77,220,205,.10) 48%,
            transparent 72%
          );
        }

        .gs-person img {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 350px;
          height: 490px;
          display: block;
          object-fit: contain;
          object-position: center bottom;
          filter: saturate(1.02);
        }

        .gs-person-quote {
          position: absolute;
          z-index: 8;
          top: 29px;
          left: 216px;
          width: 139px;
          padding: 14px 15px 15px;
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 18px;
          background: rgba(255,255,255,.70);
          box-shadow: 0 13px 28px rgba(36,87,115,.09);
          backdrop-filter: blur(12px);
          color: #214968;
          font-size: 14px;
          line-height: 1.42;
          font-style: italic;
          font-weight: 600;
        }

        .gs-person-quote::after {
          content: "";
          display: block;
          width: 39px;
          height: 3px;
          margin-top: 10px;
          border-radius: 5px;
          background: #00a56d;
        }

        /* ---------------------------------------------------------
           PROPOSAL SLIDER
        --------------------------------------------------------- */

        .gs-slider-column {
          position: relative;
          z-index: 12;
          min-width: 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 40px;
        }

        .gs-slider {
          width: 100%;
          height: 560px;
          position: relative;
          overflow: visible;
        }

        .gs-slide {
          position: absolute;
          inset: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          opacity: 0;
          transform: translateX(15px) scale(.987);
          pointer-events: none;
          transition: opacity .35s ease, transform .35s ease;
        }

        .gs-slide.active {
          opacity: 1;
          transform: translateX(0) scale(1);
          pointer-events: auto;
        }

        .gs-slide-image {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 22px;
          object-fit: contain;
          object-position: center;
          background: transparent;
        }

        .gs-arrow {
          position: absolute;
          z-index: 20;
          top: 50%;
          width: 49px;
          height: 49px;
          padding: 0;
          border: 1px solid #dce8ef;
          border-radius: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #173d5b;
          background: rgba(255,255,255,.98);
          box-shadow: 0 9px 22px rgba(24,67,92,.14);
          font-size: 20px;
          cursor: pointer;
        }

        .gs-arrow-left { left: -24px; }
        .gs-arrow-right { right: -24px; }

        .gs-arrow:hover {
          box-shadow: 0 13px 27px rgba(24,67,92,.20);
        }

        .gs-dots {
          position: absolute;
          z-index: 21;
          left: 0;
          right: 0;
          bottom: -29px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .gs-dot {
          width: 12px;
          height: 12px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: #bdc8d2;
          cursor: pointer;
          transition: width .2s ease, background .2s ease;
        }

        .gs-dot.active {
          width: 29px;
          border-radius: 8px;
          background: #00a76d;
        }

        /* ---------------------------------------------------------
           BOTTOM TRUST/STATS STRIP
        --------------------------------------------------------- */

        .gs-stats {
          width: min(1600px, calc(100% - 36px));
          min-height: 106px;
          margin: 0 auto;
          position: relative;
          z-index: 30;
          display: grid;
          grid-template-columns: repeat(4, 1fr) 1.7fr;
          align-items: center;
          border-top: 1px solid #d9e6ee;
          border-radius: 17px 17px 0 0;
          background: rgba(255,255,255,.96);
          box-shadow: 0 -5px 25px rgba(26,80,110,.055);
        }

        .gs-stat {
          min-height: 66px;
          padding: 0 25px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-right: 1px solid #d9e5ed;
        }

        .gs-stat-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0873d2;
          background: #eaf4ff;
          font-size: 21px;
        }

        .gs-stat-icon.green {
          color: #079967;
          background: #e7f8ef;
        }

        .gs-stat strong {
          display: block;
          color: #075fc5;
          font-size: 18px;
          line-height: 1.1;
          font-weight: 900;
        }

        .gs-stat span {
          display: block;
          margin-top: 5px;
          color: #55738e;
          font-size: 10.5px;
          line-height: 1.18;
          font-weight: 600;
        }

        .gs-industries {
          min-width: 0;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1.85fr;
          align-items: center;
          gap: 13px;
        }

        .gs-industries-title {
          color: #315372;
          text-align: right;
          font-size: 11.5px;
          font-weight: 850;
        }

        .gs-industry-list {
          display: grid;
          grid-template-columns: repeat(4,1fr);
        }

        .gs-industry {
          min-height: 53px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border-left: 1px solid #d9e5ed;
          color: #315372;
          font-size: 9.5px;
          font-weight: 700;
        }

        .gs-industry i {
          color: #0872c9;
          font-size: 20px;
        }

        /* ---------------------------------------------------------
           1366-ish desktop — this is the important match for the
           screenshot you supplied.
        --------------------------------------------------------- */

        @media (max-width: 1450px) {
          .gs-hero-main {
            width: min(1320px, calc(100% - 56px));
            height: 575px;
            grid-template-columns: minmax(0,1fr) 430px;
          }

          .gs-hero-copy {
            padding-top: 32px;
          }

          .gs-hero-title {
            font-size: clamp(38px,3.55vw,48px);
            max-width: 830px;
            letter-spacing: -2.25px;
          }

          .gs-hero-description {
            max-width: 650px;
            font-size: 15px;
            margin-top: 18px;
            margin-bottom: 23px;
          }

          .gs-service-grid {
            width: 640px;
            gap: 10px;
          }

          .gs-service-card {
            height: 100px;
            padding: 9px 6px 8px;
            border-radius: 14px;
          }

          .gs-service-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
            margin-bottom: 6px;
            border-radius: 12px;
            font-size: 16px;
          }

          .gs-service-card strong {
            font-size: 10.5px;
          }

          .gs-service-card small {
            margin-top: 5px;
            font-size: 9px;
          }

          .gs-actions {
            margin-top: 22px;
          }

          .gs-trust {
            margin-top: 19px;
          }

          .gs-person {
            left: 64%;
            bottom: 28px;
            width: 330px;
            height: 455px;
          }

          .gs-person img {
            width: 330px;
            height: 455px;
          }

          .gs-person-quote {
            left: 211px;
            top: 25px;
            width: 128px;
            font-size: 13px;
          }

          .gs-slider-column {
            padding-top: 32px;
          }

          .gs-slider {
            height: 495px;
          }
        }

        /* ---------------------------------------------------------
           Tablet
        --------------------------------------------------------- */

        @media (max-width: 1100px) {
          .gs-hero-main {
            width: calc(100% - 32px);
            height: auto;
            min-height: 980px;
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .gs-hero-copy {
            padding-top: 26px;
          }

          .gs-hero-title {
            max-width: 760px;
          }

          .gs-service-grid {
            width: 100%;
            max-width: 720px;
          }

          .gs-person {
            display: none;
          }

          .gs-slider-column {
            padding: 0 32px 45px;
          }

          .gs-slider {
            width: min(560px,100%);
            height: 560px;
          }

          .gs-stats {
            grid-template-columns: repeat(2,1fr);
          }

          .gs-industries {
            grid-column: 1/-1;
            padding: 13px 20px;
            border-top: 1px solid #d9e5ed;
          }
        }

        /* =========================================
     MOBILE HERO — GoSubsidy
     ========================================= */

  .premium-service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    gap: 8px;
  }

  .premium-service-card {
    min-width: 0;
    padding: 10px 6px;
  }

  .premium-service-card strong {
    font-size: 11px;
    line-height: 1.2;
  }

  .premium-service-card small {
    font-size: 8px;
    line-height: 1.2;
  }

  /* CTA buttons */
  .premium-hero-actions {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .premium-primary-btn,
  .premium-secondary-btn {
    width: 100%;
    min-height: 44px;
  }

  /* Trust row */
  .premium-trust-row {
    gap: 7px;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    font-size: 11px;
  }

  /* =========================================
     PROMOTIONAL BANNER
     ========================================= */

  .fintech-props-row {
    grid-template-columns: 1fr;
  }

  .fintech-card-viewport {
    width: calc(100vw - 28px);
    max-width: calc(100vw - 28px);

    /* IMPORTANT:
       Do not make this a 400px square */
    height: auto;
    aspect-ratio: 1.48 / 1;

    margin: 12px auto 0;
  }

  .fintech-glass-card,
  .fintech-sidebox-image-wrap {
    width: 100%;
    max-width: 100%;

    height: 100%;
    min-height: 0;

    border-radius: 16px;
  }

  /* Keep the COMPLETE proposal poster visible */
  .fintech-sidebox-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  /* Remove unnecessary desktop effects on phone */
  .fintech-glass-card {
    border-width: 4px;
    border-radius: 16px;
    box-shadow: 0 12px 30px rgba(16, 60, 90, 0.14);
  }

  /* Hide decorative overlays that can clutter the small screen */
  .fintech-banner-orbit,
  .fintech-banner-grid,
  .fintech-banner-icon-tile,
  .fintech-image-overlay-badge,
  .fintech-banner-typography {
    display: none !important;
  }
}
      `}</style>

      <div className="gs-hero-main">
        <div className="gs-hero-copy">
          <div className="gs-hero-badge">
            <i className="bi bi-bar-chart-fill" />
            One Platform for Business Growth
          </div>

          <h1 className="gs-hero-title">
            Empowering Enterprises with
            <span className="gs-gradient">
              Subsidies, Loans &amp; Growth Capital
            </span>
          </h1>

          <p className="gs-hero-description">
            Discover government schemes, access finance, simplify compliance
            and build your business — all in one place.
          </p>

          <div className="gs-service-grid">
            {HERO_SERVICES.map((service) => (
              <button
                key={`${service.title}-${service.title2}`}
                type="button"
                className="gs-service-card"
                onClick={() => goTo(service.link)}
              >
                <span className={`gs-service-icon ${service.tone}`}>
                  <i className={`bi ${service.icon}`} />
                </span>

                <strong>
                  {service.title}
                  <br />
                  {service.title2}
                </strong>

                <small>{service.sub}</small>
              </button>
            ))}
          </div>

          <div className="gs-actions">
            <button
              type="button"
              className="gs-btn gs-btn-primary"
              onClick={() => goTo("/schemes")}
            >
              Explore Schemes
              <i className="bi bi-arrow-right" />
            </button>

            <button
              type="button"
              className="gs-btn gs-btn-secondary"
              onClick={() => navigate("/services/ca-consultation")}
            >
              <i className="bi bi-headset" />
              Talk to Our Expert
            </button>
          </div>

          <div className="gs-trust">
            <span>
              <i className="bi bi-check-circle-fill" />
              Trusted Information
            </span>
            <span>
              <i className="bi bi-check-circle-fill" />
              Expert Guidance
            </span>
            <span>
              <i className="bi bi-check-circle-fill" />
              End-to-End Support
            </span>
          </div>

          <div className="gs-person" aria-hidden="true">
            <img
              src="/images/home/gosubsidy-hero-person-clean.png"
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <div className="gs-person-quote">
              Your Business
              <br />
              Our Support
              <br />
              A Brighter Tomorrow
            </div>
          </div>
        </div>

        <div
          className="gs-slider-column"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="gs-slider">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`gs-slide ${index === activeIndex ? "active" : ""}`}
                onClick={() => goTo(slide.link)}
                aria-label={`Open ${slide.alt}`}
              >
                <img
                  className="gs-slide-image"
                  src={slide.image}
                  alt={slide.alt}
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
              </button>
            ))}

            <button
              type="button"
              className="gs-arrow gs-arrow-left"
              onClick={(event) => {
                event.stopPropagation();
                previous();
              }}
              aria-label="Previous business proposal"
            >
              <i className="bi bi-chevron-left" />
            </button>

            <button
              type="button"
              className="gs-arrow gs-arrow-right"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              aria-label="Next business proposal"
            >
              <i className="bi bi-chevron-right" />
            </button>

            <div className="gs-dots">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.id}-dot`}
                  type="button"
                  className={`gs-dot ${index === activeIndex ? "active" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveIndex(index);
                  }}
                  aria-label={`Show proposal ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="gs-stats">
        {STATS.map((stat) => (
          <div className="gs-stat" key={stat.label}>
            <div
              className={`gs-stat-icon ${
                stat.tone === "green" ? "green" : ""
              }`}
            >
              <i className={`bi ${stat.icon}`} />
            </div>

            <div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}

        <div className="gs-industries">
          <div className="gs-industries-title">
            Trusted by Businesses Across India
          </div>

          <div className="gs-industry-list">
            {INDUSTRIES.map((industry) => (
              <div className="gs-industry" key={industry.label}>
                <i className={`bi ${industry.icon}`} />
                <span>{industry.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
