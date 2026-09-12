import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   GOSUBSIDY INTELLIGENCE
   Business & Financial Intelligence Centre
========================================================= */

const services = [
  {
    key: "schemes",
    icon: "bi-bank",
    title: "Schemes ",
    label: "Government benefits",
    text: "Discover Central and State Government schemes matched to your profile.",
    button: "Find My Schemes",
    route: "/schemes",
    cls: "blue",
  },
  {
    key: "loans",
    icon: "bi-cash-stack",
    title: "Loan ",
    label: "Finance & lender matching",
    text: "Explore Personal, Business, Working Capital, Home, Education, Mortgage and Project Finance.",
    button: "Check Loan Eligibility",
    route: "/loans",
    cls: "green",
  },
  {
    key: "insurance",
    icon: "bi-shield-check",
    title: "Insurance ",
    label: "Protection planning",
    text: "Understand relevant personal, health, business, property, vehicle and asset protection categories.",
    button: "Explore Insurance",
    route: "/insurance",
    cls: "orange",
  },
  {
    key: "cibil",
    icon: "bi-graph-up-arrow",
    title: "Credit ",
    label: "CIBIL & loan readiness",
    text: "Understand your credit profile and practical steps that may improve loan readiness.",
    button: "Check CIBIL",
    route: "/cibil",
    cls: "purple",
  },
  {
    key: "subsidy",
    icon: "bi-percent",
    title: "Subsidy ",
    label: "Benefit estimation",
    text: "Explore potential subsidy opportunities and the information required for verification.",
    button: "Calculate Subsidy",
    route: "/subsidy-calculator",
    cls: "teal",
  },
  {
    key: "dpr",
    icon: "bi-file-earmark-bar-graph",
    title: "DPR Intelligence",
    label: "Project report preparation",
    text: "Organise project information for DPR preparation, finance planning and lender discussions.",
    button: "Prepare My DPR",
    route: "/dpr",
    cls: "red",
  },
];

const examples = [
  "I want to start poultry business",
  "Find subsidies for my business",
  "Check my loan eligibility",
  "Which insurance do I need?",
  "How can I improve my CIBIL?",
  "Prepare my DPR",
];

const businessOptions = [
  "MSME",
  "Agriculture",
  "Poultry",
  "Dairy",
  "Food Processing",
  "Manufacturing",
  "Solar",
  "Cold Chain",
  "Warehouse",
  "Other",
];

const stateOptions = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Other",
];

/* =========================================================
   INTENT DETECTION
========================================================= */

function detectIntent(text) {
  const value = text.toLowerCase();

  if (
    /insurance|policy|cover|health insurance|life insurance|motor insurance|crop insurance|poultry insurance/.test(
      value
    )
  ) {
    return "insurance";
  }

  if (
    /cibil|credit score|credit profile|credit history/.test(value)
  ) {
    return "cibil";
  }

  if (/dpr|project report|bank ready/.test(value)) {
    return "dpr";
  }

  if (
    /subsidy|grant|incentive|government benefit/.test(value)
  ) {
    return "subsidy";
  }

  if (
    /loan|finance|funding|working capital|emi|lender|nbfc/.test(
      value
    )
  ) {
    return "loans";
  }

  if (/scheme|government scheme/.test(value)) {
    return "schemes";
  }

  return "general";
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GoSubsidyIntelligence({
  project = {},
  user = {},
  onAsk,
}) {
  const navigate = useNavigate();

  /* =======================================================
     AI COMMAND
  ======================================================= */

  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  /* =======================================================
     FINANCIAL PROFILE
  ======================================================= */

  const [profile, setProfile] = useState({
    business: "",
    state: "",
    projectCost: "",
  });

  const [profileSaved, setProfileSaved] = useState(false);

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "gosubsidy_financial_profile"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        setProfile({
          business: parsed.business || "",
          state: parsed.state || "",
          projectCost: parsed.projectCost || "",
        });
      } else {
        setProfile({
          business:
            project.business ||
            project.sector ||
            project.category ||
            "",
          state:
            project.state ||
            project.location ||
            "",
          projectCost:
            project.projectCost ||
            project.cost ||
            "",
        });
      }
    } catch (error) {
      console.error(
        "GoSubsidy profile load error:",
        error
      );
    }
  }, [
    project.business,
    project.sector,
    project.category,
    project.state,
    project.location,
    project.projectCost,
    project.cost,
  ]);

  /* =======================================================
     PROFILE CHANGE
  ======================================================= */

  const updateProfile = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setProfileSaved(false);
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const saveProfile = () => {
    try {
      localStorage.setItem(
        "gosubsidy_financial_profile",
        JSON.stringify(profile)
      );

      setProfileSaved(true);

      setTimeout(() => {
        setProfileSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "GoSubsidy profile save error:",
        error
      );
    }
  };

  /* =======================================================
     FORMAT CURRENCY
  ======================================================= */

  const formatCurrency = (value) => {
    if (!value) return "Not provided";

    const number = Number(
      String(value).replace(/,/g, "")
    );

    if (!Number.isFinite(number) || number <= 0) {
      return "Not provided";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  /* =======================================================
     PROFILE READINESS
  ======================================================= */

  const profileReadiness = useMemo(() => {
    let score = 0;

    if (profile.business) score += 35;
    if (profile.state) score += 30;

    const cost = Number(
      String(profile.projectCost || "").replace(/,/g, "")
    );

    if (cost > 0) score += 35;

    return score;
  }, [profile]);

  /* =======================================================
     NEXT BEST ACTION
  ======================================================= */

  const nextAction = useMemo(() => {
    if (!profile.business) {
      return {
        kicker: "START HERE",
        title: "Choose Your Business",
        text:
          "Tell GoSubsidy what type of business or project you are planning.",
        button: "Complete Business Profile",
        route: "#profile",
        icon: "bi-building",
      };
    }

    if (!profile.state) {
      return {
        kicker: "NEXT STEP",
        title: "Select Your State",
        text:
          "State selection helps GoSubsidy identify applicable Central and State Government opportunities.",
        button: "Select State",
        route: "#profile",
        icon: "bi-geo-alt",
      };
    }

    if (!profile.projectCost) {
      return {
        kicker: "NEXT STEP",
        title: "Add Your Project Cost",
        text:
          "Project cost helps estimate funding requirements, subsidy opportunities and loan eligibility.",
        button: "Add Project Cost",
        route: "#profile",
        icon: "bi-currency-rupee",
      };
    }

    if (profileReadiness < 100) {
      return {
        kicker: "PROFILE READY",
        title: "Find Your Opportunities",
        text:
          "Your core project information is available. Let's identify relevant schemes, subsidies and finance options.",
        button: "Find My Schemes",
        route: "/schemes",
        icon: "bi-stars",
      };
    }

    return {
      kicker: "NEXT BEST ACTION",
      title: "Check Your Funding Journey",
      text:
        "Your financial profile is ready. Continue with subsidy discovery, loan eligibility and project finance planning.",
      button: "Check Loan Eligibility",
      route: "/loans",
      icon: "bi-arrow-up-right-circle",
    };
  }, [
    profile,
    profileReadiness,
  ]);

  /* =======================================================
     PROJECT DISPLAY
  ======================================================= */

  const projectName =
    profile.business ||
    project.name ||
    project.business ||
    project.sector ||
    project.category ||
    "Your project";

  const location =
    profile.state ||
    project.state ||
    project.location ||
    "India";

  const cost = formatCurrency(
    profile.projectCost ||
      project.projectCost ||
      project.cost
  );

  /* =======================================================
     AI ANALYSIS
  ======================================================= */

  const analyse = (text) => {
    const clean = text.trim();

    if (!clean) {
      setResult({
        title: "Let's understand your requirement",
        text:
          "Tell me what you want to achieve — subsidy, loan, insurance, CIBIL improvement or DPR preparation.",
        intent: "general",
      });

      return;
    }

    const intent = detectIntent(clean);

    const messages = {
      schemes: [
        "Scheme Discovery",
        "I can analyse relevant Central and State Government scheme categories and guide you through eligibility and documents.",
      ],

      loans: [
        "Financing Analysis",
        "I can assess your funding requirement, loan category, repayment profile and lender journey.",
      ],

      insurance: [
        "Protection Analysis",
        "I can help identify insurance categories relevant to your personal or business requirement.",
      ],

      cibil: [
        "Credit Readiness Analysis",
        "I can explain the credit factors that may affect your financing readiness and guide your next steps.",
      ],

      subsidy: [
        "Subsidy Analysis",
        "I can analyse potential Government benefit categories and the information needed to verify them.",
      ],

      dpr: [
        "DPR Analysis",
        "I can organise your project information into a structured DPR preparation journey.",
      ],

      general: [
        "GoSubsidy Intelligence",
        "I can analyse schemes, subsidies, loans, insurance, CIBIL and DPR requirements together.",
      ],
    };

    const item = messages[intent];

    setResult({
      title: item[0],
      text: item[1],
      intent,
    });

    if (typeof onAsk === "function") {
      onAsk({
        query: clean,
        intent,
        project,
        user,
        profile,
      });
    }
  };

  /* =======================================================
     OPEN SERVICE
  ======================================================= */

  const openService = (service) => {
    navigate(service.route);
  };

  /* =======================================================
     NEXT ACTION CLICK
  ======================================================= */

  const handleNextAction = () => {
    if (nextAction.route === "#profile") {
      document
        .getElementById("gosubsidy-profile")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      return;
    }

    navigate(nextAction.route);
  };

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <section className="gosubsidy-intelligence">

      <style>{`

        /* =====================================================
           MAIN SECTION
        ===================================================== */

        .gosubsidy-intelligence {
          position: relative;
          overflow: hidden;
          padding: 58px 0 78px;
          background:
            radial-gradient(
              circle at 8% 8%,
              rgba(0, 114, 255, .07),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 18%,
              rgba(0, 166, 128, .08),
              transparent 30%
            ),
            #f6f9fc;
        }

        .gsi-wrap {
          max-width: 1180px;
          margin: auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .gsi-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #e8f8f5;
          color: #008f72;
          border: 1px solid rgba(0,166,128,.2);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .gsi-title {
          margin: 17px 0 10px;
          color: #062b52;
          font-size: clamp(32px, 4vw, 50px);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -.035em;
        }

        .gsi-title span {
          color: #087cf0;
        }

        .gsi-subtitle {
          max-width: 780px;
          margin: 0 auto 28px;
          color: #60748b;
          font-size: 16px;
          line-height: 1.65;
        }

        /* =====================================================
           AI COMMAND
        ===================================================== */

        .gsi-command {
          max-width: 900px;
          margin: auto;
          padding: 8px;
          background: #fff;
          border: 1px solid #dce6f0;
          border-radius: 22px;
          box-shadow: 0 18px 55px rgba(6,43,82,.1);
        }

        .gsi-command-inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gsi-command-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(
            135deg,
            #0072ff,
            #00a680
          );
          color: #fff;
          font-size: 21px;
        }

        .gsi-input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          padding: 12px 5px;
          color: #092c50;
          background: transparent;
          font-size: 16px;
        }

        .gsi-input::placeholder {
          color: #91a0b0;
        }

        .gsi-analyse {
          border: 0;
          border-radius: 14px;
          padding: 13px 22px;
          background: linear-gradient(
            135deg,
            #006eff,
            #2949df
          );
          color: #fff;
          font-weight: 900;
          white-space: nowrap;
          cursor: pointer;
        }

        .gsi-analyse:hover {
          transform: translateY(-1px);
        }

        .gsi-suggestions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin: 14px auto 0;
        }

        .gsi-suggestion {
          border: 1px solid #d9e4ee;
          background: #fff;
          color: #49627c;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .gsi-suggestion:hover {
          border-color: #0072ff;
          color: #0072ff;
        }

        /* =====================================================
           AI RESULT
        ===================================================== */

        .gsi-result {
          max-width: 900px;
          margin: 18px auto 0;
          padding: 18px;
          border-radius: 17px;
          border: 1px solid #ccefe4;
          background:
            linear-gradient(
              135deg,
              #f0fcf8,
              #f8fcff
            );
        }

        .gsi-result-label,
        .gsi-kicker {
          color: #008f72;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .gsi-result h4 {
          margin: 6px 0;
          color: #123657;
          font-size: 17px;
          font-weight: 900;
        }

        .gsi-result p {
          margin: 0;
          color: #60748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .gsi-result button {
          margin-top: 10px;
          border: 0;
          background: transparent;
          color: #006eff;
          font-weight: 900;
          cursor: pointer;
        }

        /* =====================================================
           TWO MAIN FUNCTIONAL CARDS
        ===================================================== */

        .gsi-main-grid {
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 18px;
          margin-top: 30px;
        }

        .gsi-profile-card,
        .gsi-next-card {
          background: #fff;
          border: 1px solid #dfe8f0;
          border-radius: 24px;
          box-shadow: 0 12px 35px rgba(6,43,82,.07);
        }

        /* =====================================================
           PROFILE CARD
        ===================================================== */

        .gsi-profile-card {
          padding: 24px;
        }

        .gsi-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .gsi-card-title {
          margin: 4px 0 4px;
          color: #092c50;
          font-size: 22px;
          font-weight: 900;
        }

        .gsi-card-description {
          margin: 0;
          color: #718399;
          font-size: 13px;
        }

        .gsi-readiness {
          min-width: 85px;
          padding: 8px 11px;
          border-radius: 999px;
          background: #ecfbf5;
          color: #008c70;
          font-size: 12px;
          font-weight: 900;
          text-align: center;
        }

        .gsi-profile-progress {
          height: 8px;
          margin: 20px 0;
          overflow: hidden;
          background: #e9eff4;
          border-radius: 999px;
        }

        .gsi-profile-progress span {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #006eff,
            #00a680
          );
          transition: width .35s ease;
        }

        .gsi-profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .gsi-field label {
          display: block;
          margin-bottom: 7px;
          color: #536b83;
          font-size: 11px;
          font-weight: 900;
        }

        .gsi-field select,
        .gsi-field input {
          width: 100%;
          height: 46px;
          padding: 0 13px;
          border: 1px solid #dbe5ee;
          border-radius: 12px;
          background: #f9fbfd;
          color: #123657;
          font-size: 13px;
          outline: none;
          transition: .2s;
        }

        .gsi-field select:focus,
        .gsi-field input:focus {
          border-color: #087cf0;
          background: #fff;
          box-shadow:
            0 0 0 3px rgba(8,124,240,.08);
        }

        .gsi-profile-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
        }

        .gsi-profile-note {
          color: #7b8b9d;
          font-size: 11px;
        }

        .gsi-save-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          border-radius: 12px;
          padding: 11px 17px;
          background: #087cf0;
          color: #fff;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .gsi-save-button:hover {
          background: #0067d9;
        }

        .gsi-saved {
          color: #008f72;
          font-weight: 800;
        }

        /* =====================================================
           NEXT BEST ACTION
        ===================================================== */

        .gsi-next-card {
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .gsi-next-card::after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          right: -65px;
          bottom: -70px;
          border-radius: 50%;
          background: rgba(0,166,128,.08);
        }

        .gsi-next-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          border-radius: 15px;
          background: #eaf9f4;
          color: #00a680;
          font-size: 21px;
        }

        .gsi-next-title {
          margin: 7px 0 8px;
          color: #092c50;
          font-size: 23px;
          line-height: 1.15;
          font-weight: 900;
        }

        .gsi-next-text {
          margin: 0;
          color: #718399;
          font-size: 13px;
          line-height: 1.6;
        }

        .gsi-next-button {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          border: 0;
          border-radius: 12px;
          padding: 12px 16px;
          background: #092c50;
          color: #fff;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .gsi-next-button:hover {
          background: #006eff;
        }

        .gsi-mini-status {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 19px;
          color: #7b8b9d;
          font-size: 11px;
        }

        .gsi-mini-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00b686;
          box-shadow:
            0 0 0 4px rgba(0,182,134,.12);
        }

        /* =====================================================
           OPPORTUNITY MAP
        ===================================================== */

        .gsi-panel {
          margin-top: 20px;
          padding: 24px;
          background: #fff;
          border: 1px solid #dfe8f0;
          border-radius: 24px;
          box-shadow: 0 12px 35px rgba(6,43,82,.06);
        }

        .gsi-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .gsi-panel-title {
          margin: 5px 0;
          color: #092c50;
          font-size: 23px;
          font-weight: 900;
        }

        .gsi-panel-desc {
          margin: 0;
          color: #718399;
          font-size: 13px;
        }

        .gsi-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #ecfbf5;
          color: #008c70;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .gsi-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00b686;
          box-shadow:
            0 0 0 4px rgba(0,182,134,.12);
        }

        .gsi-project {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 12px;
          margin: 20px 0;
        }

        .gsi-project-item {
          padding: 15px 17px;
          border-radius: 16px;
          background: #f7fafc;
          border: 1px solid #e8eef4;
        }

        .gsi-project-label {
          color: #8291a2;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .gsi-project-value {
          margin-top: 5px;
          color: #123657;
          font-size: 16px;
          font-weight: 900;
        }

        .gsi-insights {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 12px;
        }

        .gsi-insight {
          padding: 18px;
          border-radius: 17px;
          background: #f9fbfd;
          border: 1px solid #e5edf4;
        }

        .gsi-insight i {
          font-size: 20px;
          color: #00a680;
        }

        .gsi-insight h4 {
          margin: 9px 0 5px;
          color: #123657;
          font-size: 15px;
          font-weight: 900;
        }

        .gsi-insight p {
          margin: 0;
          color: #718399;
          font-size: 13px;
          line-height: 1.55;
        }

        /* =====================================================
           SERVICES
        ===================================================== */

        .gsi-heading {
          margin: 42px 0 18px;
        }

        .gsi-heading h3 {
          margin: 0 0 5px;
          color: #092c50;
          font-size: 27px;
          font-weight: 900;
        }

        .gsi-heading p {
          margin: 0;
          color: #718399;
          font-size: 14px;
        }

        .gsi-services {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 16px;
        }

        .gsi-card {
          display: flex;
          flex-direction: column;
          min-height: 230px;
          padding: 21px;
          background: #fff;
          border: 1px solid #e0e9f1;
          border-radius: 20px;
          box-shadow: 0 8px 28px rgba(6,43,82,.045);
          transition: .25s;
        }

        .gsi-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(6,43,82,.1);
        }

        .gsi-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #edf5ff;
          color: #006eff;
          font-size: 21px;
          margin-bottom: 14px;
        }

        .gsi-card.green .gsi-icon {
          background: #eaf9f4;
          color: #009675;
        }

        .gsi-card.orange .gsi-icon {
          background: #fff5df;
          color: #e69500;
        }

        .gsi-card.purple .gsi-icon {
          background: #f1edff;
          color: #6950d8;
        }

        .gsi-card.teal .gsi-icon {
          background: #e8faf9;
          color: #008f88;
        }

        .gsi-card.red .gsi-icon {
          background: #fff0ef;
          color: #dc4a43;
        }

        .gsi-label {
          margin-bottom: 5px;
          color: #8392a2;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .gsi-card h4 {
          margin: 0 0 8px;
          color: #102f4e;
          font-size: 17px;
          font-weight: 900;
        }

        .gsi-card p {
          margin: 0;
          color: #718399;
          font-size: 13px;
          line-height: 1.55;
        }

        .gsi-link {
          margin-top: auto;
          padding-top: 16px;
          border: 0;
          background: transparent;
          color: #006eff;
          text-align: left;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .gsi-link:hover {
          color: #004db2;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 991px) {

          .gsi-main-grid {
            grid-template-columns: 1fr;
          }

          .gsi-profile-grid {
            grid-template-columns: 1fr 1fr;
          }

          .gsi-services {
            grid-template-columns: repeat(2,1fr);
          }

          .gsi-insights {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 767px) {

          .gosubsidy-intelligence {
            padding: 45px 0 55px;
          }

          .gsi-wrap {
            padding: 0 14px;
          }

          .gsi-command-inner {
            flex-wrap: wrap;
          }

          .gsi-command-icon {
            display: none;
          }

          .gsi-input {
            flex-basis: 100%;
          }

          .gsi-analyse {
            width: 100%;
          }

          .gsi-profile-grid {
            grid-template-columns: 1fr;
          }

          .gsi-profile-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .gsi-save-button {
            justify-content: center;
          }

          .gsi-project {
            grid-template-columns: 1fr;
          }

          .gsi-services {
            grid-template-columns: 1fr;
          }

          .gsi-panel-head,
          .gsi-card-header {
            flex-direction: column;
          }

          .gsi-status,
          .gsi-readiness {
            align-self: flex-start;
          }

        }

      `}</style>

      <div className="gsi-wrap">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="text-center">

          <div className="gsi-eyebrow">
            <i className="bi bi-stars"></i>
            GoSubsidy Intelligence
          </div>

          <h2 className="gsi-title">
            Your Business & Financial
            <br />
            <span>Intelligence Centre.</span>
          </h2>

          <p className="gsi-subtitle">
            {user.name
              ? `Hello ${user.name}. `
              : ""}
            Tell GoSubsidy what you want to achieve.
            We can guide you across Government schemes,
            subsidies, loans, insurance, CIBIL and DPR
            preparation.
          </p>

          {/* AI COMMAND */}

          <div className="gsi-command">

            <div className="gsi-command-inner">

              <div className="gsi-command-icon">
                <i className="bi bi-stars"></i>
              </div>

              <input
                className="gsi-input"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    analyse(query);
                  }
                }}
                placeholder='Try: "I want to start poultry business"'
              />

              <button
                className="gsi-analyse"
                type="button"
                onClick={() => analyse(query)}
              >
                Analyse
                <i className="bi bi-arrow-right ms-2"></i>
              </button>

            </div>

          </div>

          {/* SUGGESTIONS */}

          <div className="gsi-suggestions">

            {examples.slice(1).map((item) => (

              <button
                key={item}
                type="button"
                className="gsi-suggestion"
                onClick={() => {
                  setQuery(item);
                  analyse(item);
                }}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* ===================================================
            AI RESULT
        =================================================== */}

        {result && (

          <div className="gsi-result">

            <div className="gsi-result-label">
              <i className="bi bi-stars me-1"></i>
              Intelligence response
            </div>

            <h4>{result.title}</h4>

            <p>{result.text}</p>

            {result.intent !== "general" && (

              <button
                type="button"
                onClick={() => {

                  const service =
                    services.find(
                      (item) =>
                        item.key === result.intent
                    );

                  if (service) {
                    navigate(service.route);
                  }

                }}
              >
                Continue with GoSubsidy{" "}
                {result.intent}
                <i className="bi bi-arrow-right ms-2"></i>
              </button>

            )}

          </div>

        )}

        {/* ===================================================
            TWO FUNCTIONAL CARDS
        =================================================== */}

        <div className="gsi-main-grid">

          {/* =================================================
              FINANCIAL PROFILE
          ================================================= */}

          <div
            className="gsi-profile-card"
            id="gosubsidy-profile"
          >

            <div className="gsi-card-header">

              <div>

                <div className="gsi-kicker">
                  <i className="bi bi-person-vcard me-1"></i>
                  Your Financial Profile
                </div>

                <h3 className="gsi-card-title">
                  Build Your Opportunity Profile
                </h3>

                <p className="gsi-card-description">
                  Add your basic project details so
                  GoSubsidy can personalise your journey.
                </p>

              </div>

              <div className="gsi-readiness">
                {profileReadiness}% Ready
              </div>

            </div>

            {/* PROGRESS */}

            <div className="gsi-profile-progress">
              <span
                style={{
                  width: `${profileReadiness}%`,
                }}
              ></span>
            </div>

            {/* FORM */}

            <div className="gsi-profile-grid">

              {/* BUSINESS */}

              <div className="gsi-field">

                <label>
                  Business / Sector
                </label>

                <select
                  value={profile.business}
                  onChange={(e) =>
                    updateProfile(
                      "business",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Business
                  </option>

                  {businessOptions.map(
                    (business) => (
                      <option
                        key={business}
                        value={business}
                      >
                        {business}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* STATE */}

              <div className="gsi-field">

                <label>
                  Location / State
                </label>

                <select
                  value={profile.state}
                  onChange={(e) =>
                    updateProfile(
                      "state",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select State
                  </option>

                  {stateOptions.map(
                    (state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* PROJECT COST */}

              <div className="gsi-field">

                <label>
                  Approx. Project Cost
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="₹ 50,00,000"
                  value={profile.projectCost}
                  onChange={(e) =>
                    updateProfile(
                      "projectCost",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="gsi-profile-footer">

              <div className="gsi-profile-note">

                <i className="bi bi-shield-check me-1"></i>

                Your profile is stored locally for
                this journey.

                {profileSaved && (
                  <span className="gsi-saved ms-2">
                    <i className="bi bi-check-circle me-1"></i>
                    Saved
                  </span>
                )}

              </div>

              <button
                type="button"
                className="gsi-save-button"
                onClick={saveProfile}
              >
                <i className="bi bi-check2-circle"></i>
                Save My Profile
              </button>

            </div>

          </div>

          {/* =================================================
              NEXT BEST ACTION
          ================================================= */}

          <div className="gsi-next-card">

            <div className="gsi-next-icon">
              <i
                className={`bi ${nextAction.icon}`}
              ></i>
            </div>

            <div className="gsi-kicker">
              {nextAction.kicker}
            </div>

            <h3 className="gsi-next-title">
              {nextAction.title}
            </h3>

            <p className="gsi-next-text">
              {nextAction.text}
            </p>

            <button
              type="button"
              className="gsi-next-button"
              onClick={handleNextAction}
            >
              {nextAction.button}
              <i className="bi bi-arrow-right"></i>
            </button>

            <div className="gsi-mini-status">

              <span className="gsi-mini-dot"></span>

              GoSubsidy Intelligence is ready

            </div>

          </div>

        </div>

        {/* ===================================================
            OPPORTUNITY MAP
        =================================================== */}

        <div className="gsi-panel">

          <div className="gsi-panel-head">

            <div>

              <div className="gsi-kicker">
                Personalised intelligence
              </div>

              <h3 className="gsi-panel-title">
                Your Financial Opportunity Map
              </h3>

              <p className="gsi-panel-desc">
                One intelligence layer for your
                Government benefits, finance, protection,
                credit and project-readiness journey.
              </p>

            </div>

            <div className="gsi-status">

              <span className="gsi-dot"></span>

              Intelligence Ready

            </div>

          </div>

          {/* PROJECT SUMMARY */}

          <div className="gsi-project">

            <div className="gsi-project-item">

              <div className="gsi-project-label">
                Project / Business
              </div>

              <div className="gsi-project-value">
                {projectName}
              </div>

            </div>

            <div className="gsi-project-item">

              <div className="gsi-project-label">
                Location
              </div>

              <div className="gsi-project-value">
                {location}
              </div>

            </div>

            <div className="gsi-project-item">

              <div className="gsi-project-label">
                Project Cost
              </div>

              <div className="gsi-project-value">
                {cost}
              </div>

            </div>

          </div>

          {/* INTELLIGENCE LAYERS */}

          <div className="gsi-insights">

            <div className="gsi-insight">

              <i className="bi bi-search"></i>

              <h4>
                Discover
              </h4>

              <p>
                Identify potentially relevant schemes,
                subsidies, financing and protection
                categories.
              </p>

            </div>

            <div className="gsi-insight">

              <i className="bi bi-diagram-3"></i>

              <h4>
                Connect
              </h4>

              <p>
                Bring subsidy, funding, insurance,
                credit and project information into
                one journey.
              </p>

            </div>

            <div className="gsi-insight">

              <i className="bi bi-arrow-right-circle"></i>

              <h4>
                Guide
              </h4>

              <p>
                Move from discovery to eligibility,
                documents, DPR and lender or
                service-partner journeys.
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            SERVICES
        =================================================== */}

        <div className="gsi-heading">

          <div className="gsi-kicker">
            Six intelligence layers
          </div>

          <h3>
            Everything you need, in one place.
          </h3>

          <p>
            Choose a service or start with the AI
            command box above.
          </p>

        </div>

        <div className="gsi-services">

          {services.map((service) => (

            <article
              className={`gsi-card ${service.cls}`}
              key={service.key}
            >

              <div className="gsi-icon">

                <i
                  className={`bi ${service.icon}`}
                ></i>

              </div>

              <div className="gsi-label">
                {service.label}
              </div>

              <h4>
                {service.title}
              </h4>

              <p>
                {service.text}
              </p>

              <button
                type="button"
                className="gsi-link"
                onClick={() =>
                  openService(service)
                }
              >
                {service.button}

                <i className="bi bi-arrow-right ms-1"></i>

              </button>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}