import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";

/* =========================================================
   LOAN SCHEMAS & PRODUCT CONFIGURATIONS
========================================================= */

const loanSchemas = {
  business: {
    id: "business",
    title: "Business Loan",
    category: "MSME & Corporate",
    tagline: "Unsecured business growth capital up to ₹75 Lakhs*",
    steps: ["Required Capital", "Check Eligibility", "Instant Sanction"],
    primaryInput: {
      type: "number",
      label: "Required Loan Amount",
      placeholder: "e.g. 2500000",
      defaultValue: "2500000",
    },
    defaultProfile: {
      title: "MSME Enterprise Expansion",
      subtitle: "Unsecured Working Capital",
      logo: "BL",
      logoColor: "#0077e6",
      specs: [
        { label: "Interest Rate", value: "From 11.25% p.a." },
        { label: "Max Tenure", value: "Up to 5 Years" },
        { label: "Collateral", value: "Zero Collateral Required" },
        { label: "Processing Time", value: "24 - 48 Hours" },
      ],
      tag: "Pre-Approved Offers Available",
    },
    filterConfig: {
      primarySliderLabel: "Loan Amount (₹)",
      sliderUnit: "₹",
      sliderMin: 500000,
      sliderMax: 10000000,
      sliderDefault: 2500000,
      recommendBadge: "Recommended ₹25.00 Lakhs",
      filters: [
        { id: "tenure", label: "TENURE", options: ["1 Year", "2 Years", "3 Years", "5 Years"] },
        { id: "turnover", label: "ANNUAL TURNOVER", options: ["> ₹20 Lakhs", "> ₹50 Lakhs", "> ₹1 Crore", "> ₹5 Crores"] },
      ],
      toggleLabel: "Include CGTMSE Credit Guarantee",
    },
    offers: [
      {
        id: "hdfc-bl",
        lender: "HDFC Bank",
        logoText: "HDFC",
        logoColor: "#c0392b",
        loanType: "Business Growth Loan",
        stat1: { label: "Interest Rate", value: "11.50% p.a." },
        stat2: { label: "Max Amount", value: "₹50 Lakhs" },
        stat3: { label: "Tenure", value: "Up to 48 M" },
        stat4: { label: "Est. EMI", value: "₹65,240/m" },
        benefits: ["Minimal documentation", "Part-prepayment allowed", "Quick e-disbursal"],
        actionText: "Apply Now",
      },
      {
        id: "icici-bl",
        lender: "ICICI Bank",
        logoText: "ICICI",
        logoColor: "#b03a2e",
        loanType: "InstaBIZ Overdraft / TL",
        stat1: { label: "Interest Rate", value: "11.75% p.a." },
        stat2: { label: "Max Amount", value: "₹75 Lakhs" },
        stat3: { label: "Tenure", value: "Up to 60 M" },
        stat4: { label: "Est. EMI", value: "₹55,300/m" },
        benefits: ["Zero collateral under CGTMSE", "Pre-qualified sanctions", "Digital KYC"],
        actionText: "Apply Now",
      },
      {
        id: "sbi-bl",
        lender: "State Bank of India",
        logoText: "SBI",
        logoColor: "#1a5276",
        loanType: "SME Working Capital",
        stat1: { label: "Interest Rate", value: "10.40% p.a." },
        stat2: { label: "Max Amount", value: "₹1.00 Crore" },
        stat3: { label: "Tenure", value: "Up to 60 M" },
        stat4: { label: "Est. EMI", value: "₹53,600/m" },
        benefits: ["Lowest market interest", "Govt subsidy linked", "Flexible repayment"],
        actionText: "Apply Now",
      },
    ],
    features: [
      { title: "Collateral-Free", desc: "Access unsecured funding based on GST and banking track record." },
      { title: "Subsidy Linked Options", desc: "Easily integrate with PMEGP, PMFME, and state industrial subsidies." },
      { title: "End-to-End Processing", desc: "Assisted documentation and balance sheet assessment by ex-bankers." },
    ],
  },

  project: {
    id: "project",
    title: "Project / Machinery Loan",
    category: "Industrial Finance",
    tagline: "Term loans for Plant, Machinery, Sheds & Cold Storage*",
    steps: ["Project Cost", "DPR Analysis", "Bank Sanction"],
    primaryInput: {
      type: "number",
      label: "Total Project Cost",
      placeholder: "e.g. 15000000",
      defaultValue: "15000000",
    },
    defaultProfile: {
      title: "Manufacturing & Infrastructure Unit",
      subtitle: "Secured Term Loan with Subsidy Linkage",
      logo: "PR",
      logoColor: "#117a65",
      specs: [
        { label: "Max Funding", value: "Up to 75% - 85% of Project" },
        { label: "Interest Rate", value: "From 8.90% p.a." },
        { label: "Moratorium", value: "6 - 18 Months" },
        { label: "Subsidy Eligibility", value: "PMKSY / CEFPPC / Agri Infra" },
      ],
      tag: "DPR & Bank TEV Supported",
    },
    filterConfig: {
      primarySliderLabel: "Required Term Loan Amount",
      sliderUnit: "₹",
      sliderMin: 2500000,
      sliderMax: 100000000,
      sliderDefault: 12000000,
      recommendBadge: "Audit: ₹1.20 Crore",
      filters: [
        { id: "tenure", label: "REPAYMENT PERIOD", options: ["5 Years", "7 Years", "10 Years"] },
        { id: "sector", label: "SECTOR", options: ["Rice Mill / Agro", "Poultry / Hatchery", "Cold Chain", "General Mfg"] },
      ],
      toggleLabel: "Include MoFPI / State Govt Subsidy DPR",
    },
    offers: [
      {
        id: "sidbi-tl",
        lender: "SIDBI",
        logoText: "SIDBI",
        logoColor: "#1e8449",
        loanType: "SPEED Machinery Term Loan",
        stat1: { label: "Interest Rate", value: "8.65% p.a." },
        stat2: { label: "Max Amount", value: "₹5.00 Crores" },
        stat3: { label: "Moratorium", value: "Up to 12 M" },
        stat4: { label: "Funding", value: "100% of Invoice" },
        benefits: ["Fast-track equipment finance", "Green finance concessions", "Low margin money"],
        actionText: "Check Terms",
      },
      {
        id: "pnb-tl",
        lender: "PNB",
        logoText: "PNB",
        logoColor: "#922b21",
        loanType: "Food Processing Infrastructure",
        stat1: { label: "Interest Rate", value: "9.20% p.a." },
        stat2: { label: "Max Amount", value: "₹10.00 Crores" },
        stat3: { label: "Moratorium", value: "Up to 18 M" },
        stat4: { label: "Funding", value: "Up to 80%" },
        benefits: ["AIF 3% interest subvention eligible", "Long repayment tenures", "Custom moratorium"],
        actionText: "Check Terms",
      },
    ],
    features: [
      { title: "Bank-Grade DPR Support", desc: "Comprehensive TEV study, projected balance sheets, and DSCR modeling." },
      { title: "Interest Subvention", desc: "Avail 3% interest relief under Agriculture Infrastructure Fund (AIF)." },
      { title: "Structured Moratorium", desc: "Zero principal repayment during project erection and trial runs." },
    ],
  },

  poultry: {
    id: "poultry",
    title: "Poultry & Dairy Loan",
    category: "Agri & Allied",
    tagline: "Dedicated credit for EC sheds, Feed Mills & Broiler Farms*",
    steps: ["Farm Scale", "Evaluate Scheme", "Fast-track Loan"],
    primaryInput: {
      type: "number",
      label: "Required Finance Amount",
      placeholder: "e.g. 5000000",
      defaultValue: "5000000",
    },
    defaultProfile: {
      title: "Commercial Poultry Farm Setup",
      subtitle: "NABARD & AHIDF Subsidized Schemes",
      logo: "AG",
      logoColor: "#7d6608",
      specs: [
        { label: "Scheme Category", value: "AHIDF / NABARD Agri Term" },
        { label: "Interest Subvention", value: "3% p.a. from Central Govt" },
        { label: "Credit Guarantee", value: "Up to 25% by NABARD" },
        { label: "Tenure", value: "Up to 8 Years (incl. moratorium)" },
      ],
      tag: "3% Interest Rebate Active",
    },
    filterConfig: {
      primarySliderLabel: "Poultry Setup Outlay",
      sliderUnit: "₹",
      sliderMin: 1000000,
      sliderMax: 50000000,
      sliderDefault: 5000000,
      recommendBadge: "15,000 Birds: ₹50.00 Lakhs",
      filters: [
        { id: "farmType", label: "FARM CATEGORY", options: ["Broiler EC Shed", "Layer Farm", "Breeder / Hatchery", "Feed Plant"] },
        { id: "subsidy", label: "SUBSIDY LINKAGE", options: ["AHIDF (3% Subvention)", "NABARD Rural", "Self Funded Bank TL"] },
      ],
      toggleLabel: "Include Automated Climate Control Sheds",
    },
    offers: [
      {
        id: "sbi-poultry",
        lender: "State Bank of India",
        logoText: "SBI",
        logoColor: "#1a5276",
        loanType: "Poultry Venture Capital Scheme",
        stat1: { label: "Interest Rate", value: "8.50% (Net 5.50%)" },
        stat2: { label: "Max Amount", value: "₹2.00 Crores" },
        stat3: { label: "Moratorium", value: "6 - 12 Months" },
        stat4: { label: "Tenure", value: "7 - 8 Years" },
        benefits: ["AHIDF 3% subvention compliant", "Automated sheds eligible", "Low margin requirement"],
        actionText: "Apply Now",
      },
      {
        id: "canara-poultry",
        lender: "Canara Bank",
        logoText: "CAN",
        logoColor: "#0b5345",
        loanType: "Agri-Allied Enterprise Credit",
        stat1: { label: "Interest Rate", value: "8.75% (Net 5.75%)" },
        stat2: { label: "Max Amount", value: "₹1.50 Crores" },
        stat3: { label: "Moratorium", value: "6 Months" },
        stat4: { label: "Tenure", value: "6 - 7 Years" },
        benefits: ["Prompt seasonal disbursal", "Working capital CC limit", "Simplified processing"],
        actionText: "Apply Now",
      },
    ],
    features: [
      { title: "AHIDF 3% Interest Relief", desc: "Central government reduces effective interest rate down to 5.5% - 6%." },
      { title: "Equipment & Sheds Covered", desc: "Financing for nipple drinkers, auto-feeders, exhaust fans, and generators." },
      { title: "Flexible Seasonal Cashflow", desc: "Repayment synchronized with bird batch harvest and clearance cycles." },
    ],
  },

  personal: {
    id: "personal",
    title: "Personal Loan",
    category: "Retail",
    tagline: "Instant personal funds starting @ 10.49% p.a.*",
    steps: ["Income Details", "Instant Offers", "Disbursal in 2 Hrs"],
    primaryInput: {
      type: "number",
      label: "Desired Personal Loan",
      placeholder: "e.g. 500000",
      defaultValue: "500000",
    },
    defaultProfile: {
      title: "Instant Personal Credit",
      subtitle: "Zero End-Use Restrictions",
      logo: "PL",
      logoColor: "#2471a3",
      specs: [
        { label: "Interest Rate", value: "From 10.49% p.a." },
        { label: "Tenure", value: "12 to 72 Months" },
        { label: "Disbursal", value: "Same Day Bank Credit" },
        { label: "Paperwork", value: "100% Paperless Digital" },
      ],
      tag: "Pre-Approved in 2 Minutes",
    },
    filterConfig: {
      primarySliderLabel: "Personal Loan Amount",
      sliderUnit: "₹",
      sliderMin: 100000,
      sliderMax: 4000000,
      sliderDefault: 500000,
      recommendBadge: "Recommended: ₹5.00 Lakhs",
      filters: [
        { id: "tenure", label: "DURATION", options: ["1 Year", "2 Years", "3 Years", "4 Years", "5 Years"] },
        { id: "employment", label: "EMPLOYMENT", options: ["Salaried (Pvt/Govt)", "Self-Employed Professional", "Business Owner"] },
      ],
      toggleLabel: "Opt for Zero Foreclosure Fee Plan",
    },
    offers: [
      {
        id: "tata-pl",
        lender: "Tata Capital",
        logoText: "TATA",
        logoColor: "#1b4f72",
        loanType: "Instant Personal Loan",
        stat1: { label: "Interest Rate", value: "10.99% p.a." },
        stat2: { label: "Max Amount", value: "₹35 Lakhs" },
        stat3: { label: "Tenure", value: "Up to 6 Years" },
        stat4: { label: "Est. EMI", value: "₹10,870/m" },
        benefits: ["Disbursal in 30 mins", "No physical branch visit", "Flexible part-payment"],
        actionText: "Claim Offer",
      },
      {
        id: "hdfc-pl",
        lender: "HDFC Bank",
        logoText: "HDFC",
        logoColor: "#c0392b",
        loanType: "Express Personal Loan",
        stat1: { label: "Interest Rate", value: "10.50% p.a." },
        stat2: { label: "Max Amount", value: "₹40 Lakhs" },
        stat3: { label: "Tenure", value: "Up to 5 Years" },
        stat4: { label: "Est. EMI", value: "₹10,750/m" },
        benefits: ["Instant approval for salary accounts", "Zero documentation for select profiles"],
        actionText: "Claim Offer",
      },
    ],
    features: [
      { title: "No End-Use Restriction", desc: "Use funds freely for medical emergencies, home renovation, or travel." },
      { title: "100% Digital KYC", desc: "No physical signature or paper submission required." },
      { title: "Transparent Pricing", desc: "Zero hidden charges with fixed amortization schedule." },
    ],
  },

  home: {
    id: "home",
    title: "Home Loan / LAP",
    category: "Property Finance",
    tagline: "Affordable housing loans & Loan Against Property from 8.35% p.a.*",
    steps: ["Property Cost", "Check Eligibility", "Sanction Letter"],
    primaryInput: {
      type: "number",
      label: "Required Property Loan",
      placeholder: "e.g. 4500000",
      defaultValue: "4500000",
    },
    defaultProfile: {
      title: "Residential & Commercial Property Loan",
      subtitle: "New Purchase, Construction & Balance Transfer",
      logo: "HL",
      logoColor: "#d35400",
      specs: [
        { label: "Interest Rate", value: "Starting @ 8.35% p.a." },
        { label: "Max Tenure", value: "Up to 30 Years" },
        { label: "Tax Benefit", value: "Sec 24(b) & Sec 80C" },
        { label: "LTV Ratio", value: "Up to 80% - 90% of Value" },
      ],
      tag: "Lowest Home ROI Rates",
    },
    filterConfig: {
      primarySliderLabel: "Home / LAP Loan Amount",
      sliderUnit: "₹",
      sliderMin: 1000000,
      sliderMax: 50000000,
      sliderDefault: 4500000,
      recommendBadge: "Average: ₹45.00 Lakhs",
      filters: [
        { id: "tenure", label: "LOAN TENURE", options: ["10 Years", "15 Years", "20 Years", "25 Years", "30 Years"] },
        { id: "purpose", label: "PURPOSE", options: ["New Flat / Villa", "Plot + Construction", "Home Renovation", "LAP (Mortgage)"] },
      ],
      toggleLabel: "Include PMAY Subsidy Assessment",
    },
    offers: [
      {
        id: "sbi-hl",
        lender: "SBI Home Finance",
        logoText: "SBI",
        logoColor: "#1a5276",
        loanType: "Regular Home Loan",
        stat1: { label: "Interest Rate", value: "8.40% p.a." },
        stat2: { label: "Max Tenure", value: "30 Years" },
        stat3: { label: "Proc. Fee", value: "Zero (Offer)" },
        stat4: { label: "Est. EMI", value: "₹34,260/m" },
        benefits: ["Zero prepayment penalty", "Concession for women borrowers", "Overdraft facility (Maxgain)"],
        actionText: "Apply Now",
      },
      {
        id: "lic-hl",
        lender: "LIC Housing Finance",
        logoText: "LIC",
        logoColor: "#b9770e",
        loanType: "Griha Suvidha",
        stat1: { label: "Interest Rate", value: "8.50% p.a." },
        stat2: { label: "Max Tenure", value: "30 Years" },
        stat3: { label: "Proc. Fee", value: "0.25%" },
        stat4: { label: "Est. EMI", value: "₹34,600/m" },
        benefits: ["Fast legal title clearance", "Higher loan eligibility on joint incomes"],
        actionText: "Apply Now",
      },
    ],
    features: [
      { title: "Maximum Tax Savings", desc: "Save up to ₹3.5 Lakhs annually under Section 80C and Section 24(b)." },
      { title: "Balance Transfer Facility", desc: "Switch existing high-cost loans to reduce monthly EMI immediately." },
      { title: "Legal & Technical Support", desc: "Expert vetting of land titles, permissions, and municipal approvals." },
    ],
  },
};

/* =========================================================
   PRIMARY PRODUCTS FOR 9-GRID CARD
========================================================= */

const primaryLoanProducts = [
  { id: "business", title: "Business", subtitle: "Loan", icon: "business", badge: { text: "UNSECURED", type: "green" } },
  { id: "project", title: "Project / DPR", subtitle: "Finance", icon: "project", badge: { text: "SUBSIDY", type: "green" } },
  { id: "poultry", title: "Poultry / Dairy", subtitle: "Loan", icon: "poultry", badge: { text: "3% REBATE", type: "red" } },
  { id: "personal", title: "Personal", subtitle: "Loan", icon: "personal", badge: { text: "INSTANT", type: "green" } },
  { id: "home", title: "Home Loan / LAP", subtitle: "Mortgage", icon: "home", badge: { text: "8.35%*", type: "green" } },
  { id: "machinery", title: "Machinery", subtitle: "Finance", icon: "machinery", badge: null, targetSchema: "project" },
  { id: "cgtmse", title: "CGTMSE Scheme", subtitle: "Loan", icon: "cgtmse", badge: { text: "NO COLLATERAL", type: "red" }, targetSchema: "business" },
  { id: "working-capital", title: "Overdraft / CC", subtitle: "Limit", icon: "capital", badge: null, targetSchema: "business" },
];

/* =========================================================
   LOAN-SPECIFIC CRISP SVG ICONS
========================================================= */

function LoanIcon({ type }) {
  switch (type) {
    case "business":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <rect x="10" y="20" width="44" height="34" rx="6" fill="#0077E6" />
          <path d="M22 20V14C22 11.8 23.8 10 26 10H38C40.2 10 42 11.8 42 14V20" stroke="#005bb5" strokeWidth="4" />
          <path d="M10 32H54" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="32" cy="40" r="4" fill="#FFE600" />
        </svg>
      );
    case "project":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <rect x="12" y="14" width="40" height="40" rx="6" fill="#0077E6" />
          <path d="M22 24H42M22 32H36M22 40H30" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="44" cy="42" r="8" fill="#FF9900" />
          <path d="M44 38V46M40 42H48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "poultry":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path d="M32 18C38 18 44 23 46 32C48 42 46 50 32 50C18 50 16 42 18 32C20 23 26 18 32 18Z" fill="#0077E6" />
          <path d="M24 18C24 14 28 10 32 10C36 10 40 14 40 18" stroke="#0077E6" strokeWidth="4" />
          <circle cx="32" cy="22" r="4" fill="#FFA500" />
          <text x="32" y="39" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹</text>
        </svg>
      );
    case "personal":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="22" r="10" fill="#0077E6" />
          <path d="M14 50C14 40 22 36 32 36C42 36 50 40 50 50" fill="#0077E6" />
          <circle cx="44" cy="38" r="8" fill="#FFE600" />
          <text x="44" y="43" fill="#1e293b" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">⚡</text>
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path d="M12 28L32 12L52 28V52H12V28Z" fill="#0077E6" />
          <rect x="26" y="34" width="12" height="18" fill="#FFFFFF" rx="2" />
          <path d="M8 26L32 8L56 26" stroke="#005bb5" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "machinery":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="16" stroke="#0077E6" strokeWidth="5" />
          <circle cx="32" cy="32" r="6" fill="#0077E6" />
          <path d="M32 10V16M32 48V54M10 32H16M48 32H54" stroke="#0077E6" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "cgtmse":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path d="M32 10L14 18V32C14 44 22 52 32 56C42 52 50 44 50 32V18L32 10Z" fill="#0077E6" />
          <path d="M26 32L30 36L38 26" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "capital":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="22" fill="#0084FF" />
          <circle cx="32" cy="32" r="17" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="32" y="39" fill="#FFFFFF" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹</text>
        </svg>
      );
    case "more":
      return (
        <svg viewBox="0 0 64 64" width="44" height="44" fill="none">
          <rect x="14" y="14" width="14" height="14" rx="4" fill="#0077E6" />
          <rect x="36" y="14" width="14" height="14" rx="4" fill="#0077E6" />
          <rect x="14" y="36" width="14" height="14" rx="4" fill="#0077E6" />
          <rect x="36" y="36" width="14" height="14" rx="4" fill="#0077E6" />
        </svg>
      );
    default:
      return <i className="bi bi-bank fs-1 text-primary"></i>;
  }
}

/* =========================================================
   MAIN COMPONENT: LOAN DASHBOARD
========================================================= */

export default function Loan() {
  const location = useLocation();

  // Screen Stage: 'dashboard' | 'input-entry' | 'quotes'
  const [currentFlow, setCurrentFlow] = useState("dashboard");
  const [selectedProductId, setSelectedProductId] = useState("business");

  // Route Synchronization
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam && loanSchemas[typeParam]) {
      launchProductFlow(typeParam);
    } else {
      setCurrentFlow("dashboard");
    }
  }, [location.pathname, location.search, location.key]);

  const activeSchema = loanSchemas[selectedProductId] || loanSchemas.business;

  const [inputValue, setInputValue] = useState(activeSchema.primaryInput.defaultValue);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sliderValue, setSliderValue] = useState(activeSchema.filterConfig.sliderDefault);
  const [toggleChecked, setToggleChecked] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [leadForm, setLeadForm] = useState({
    name: "",
    mobile: "",
    panNumber: "",
    annualTurnover: "",
    fastTrack: true,
    whatsappUpdates: true,
  });

  const launchProductFlow = (prodId) => {
    const targetId = loanSchemas[prodId] ? prodId : "business";
    setSelectedProductId(targetId);
    const schema = loanSchemas[targetId];
    setInputValue(schema.primaryInput.defaultValue);
    setSliderValue(schema.filterConfig.sliderDefault);
    setSelectedFilters({});
    setToggleChecked(false);
    setCurrentFlow("input-entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckOffers = (e) => {
    e.preventDefault();
    if (!inputValue) {
      alert("Please specify the required loan amount.");
      return;
    }
    setShowDetailsModal(true);
  };

  const handleProceedToOffers = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.mobile) {
      alert("Please provide your Name and Mobile Number to check tailored lending rates.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDetailsModal(false);
      setCurrentFlow("quotes");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  const currentProfile = activeSchema.defaultProfile;

  return (
    <>
      <main className="id-page">
        {/* =========================================================
            SCREEN 1: ALL-LOAN-PRODUCTS DASHBOARD (EXACT 9-BOX CARD)
        ========================================================= */}
        {currentFlow === "dashboard" && (
          <section className="id-hero">
            <div className="container">
              <div className="text-center mb-4">
                <div className="id-top-indicator"></div>
              </div>

              <div className="id-main-card">
                <div className="id-grid">
                  {primaryLoanProducts.map((item) => (
                    <div
                      key={item.id}
                      className="id-item"
                      onClick={() => launchProductFlow(item.targetSchema || item.id)}
                    >
                      {item.badge && (
                        <div className={`id-badge ${item.badge.type}`}>
                          {item.badge.text}
                        </div>
                      )}
                      <div className="id-icon-box">
                        <LoanIcon type={item.icon} />
                      </div>
                      <h3 className="id-title">{item.title}</h3>
                      <span className="id-subtitle">{item.subtitle}</span>
                    </div>
                  ))}

                  <div className="id-item id-view-more" onClick={() => launchProductFlow("project")}>
                    <div className="id-icon-box">
                      <LoanIcon type="more" />
                    </div>
                    <h3 className="id-title">View More</h3>
                  </div>
                </div>
              </div>

              {/* 3 Soft Bottom Statistics Pills */}
              <div className="id-stats-row">
                <div className="id-stat-pill mint">
                  <span className="id-stat-emoji">🏦</span>
                  <div className="id-stat-info">
                    <strong>₹850 Cr+</strong>
                    <small>Disbursals Assisted</small>
                  </div>
                </div>

                <div className="id-stat-pill blue">
                  <div className="id-google-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div className="id-stat-info">
                    <strong>4.8</strong>
                    <small>Ex-Banker Advisory</small>
                  </div>
                </div>

                <div className="id-stat-pill red">
                  <span className="id-stat-emoji">📑</span>
                  <div className="id-stat-info">
                    <strong>45+ Banks</strong>
                    <small>Direct Lending Partners</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            SCREEN 2: LOAN INPUT ENTRY BANNER
        ========================================================= */}
        {currentFlow === "input-entry" && (
          <section className="id-car-hero-section">
            <div className="container">
              <div className="id-flow-breadcrumb">
                <span onClick={() => setCurrentFlow("dashboard")}>Home</span>
                <i className="bi bi-chevron-right"></i>
                <span onClick={() => setCurrentFlow("dashboard")}>Loans</span>
                <i className="bi bi-chevron-right"></i>
                <span className="active">{activeSchema.title}</span>
              </div>

              <h1 className="id-flow-page-title">{activeSchema.title}</h1>

              <div className="id-car-banner-card">
                <div className="row align-items-center">
                  <div className="col-lg-7">
                    <h2 className="id-banner-heading">
                      {activeSchema.tagline}
                    </h2>
                    <div className="id-banner-steps">
                      {activeSchema.steps.map((st, i) => (
                        <React.Fragment key={i}>
                          <span>{st}</span>
                          {i < activeSchema.steps.length - 1 && (
                            <i className="bi bi-chevron-double-right"></i>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <form onSubmit={handleCheckOffers} className="id-car-input-form">
                      <div className="id-car-input-wrap">
                        <input
                          type="text"
                          placeholder={activeSchema.primaryInput.placeholder}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="id-red-primary-btn" disabled={isLoading}>
                        {isLoading ? (
                          <span>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Evaluating Rates...
                          </span>
                        ) : (
                          "Check Eligible Offers"
                        )}
                      </button>
                    </form>

                    <p className="id-terms-note">
                      By clicking, I agree to <a href="#terms">*terms & conditions</a> and{" "}
                      <a href="#privacy">privacy policy</a>.
                    </p>

                    <div className="id-brand-new-link" onClick={() => setShowDetailsModal(true)}>
                      Need detailed Project Report (DPR) consultation? <i className="bi bi-chevron-right"></i>
                    </div>
                  </div>

                  <div className="col-lg-5 text-center position-relative">
                    <div className="id-ambassador-wrap">
                      <div className="id-red-splash-bg"></div>
                      <div className="id-ambassador-figure">
                        <div className="id-avatar-circle">
                          <i className="bi bi-bank"></i>
                        </div>
                        <div className="id-ambassador-tag">
                          <strong>{activeSchema.category}</strong>
                          <small>Ex-Banker Pre-Screening</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advisory Card */}
              <div className="id-agent-promo-card">
                <div className="id-agent-left">
                  <span className="id-agent-logo-badge">GOSUBSIDY</span>
                  <h3>Complete Banking Liaison. Zero Hassle.</h3>
                </div>
                <div className="id-agent-center">
                  <h4>
                    Comprehensive CMA Preparation & <strong>Subsidy Integration</strong>
                  </h4>
                  <p>Get bank proposals vetted by experienced ex-banking credit officers.</p>
                </div>
                <button
                  type="button"
                  className="id-agent-btn"
                  onClick={() => alert("Connecting you with our Banking Credit Desk...")}
                >
                  Talk to Credit Specialist <i className="bi bi-headset"></i>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            SCREEN 3: COMPARISON SCREEN (OFFERS & BANK RATES)
        ========================================================= */}
        {currentFlow === "quotes" && (
          <section className="id-quotes-page">
            <div className="id-quotes-topbar">
              <div className="container">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="id-back-btn"
                      onClick={() => setCurrentFlow("input-entry")}
                      title="Back"
                    >
                      <i className="bi bi-arrow-left"></i>
                    </div>
                    <div>
                      <h2 className="id-quotes-car-name">
                        {currentProfile.title} <span>|</span> ₹{Number(inputValue || 0).toLocaleString("en-IN")}
                      </h2>
                      <p className="id-quotes-expiry">
                        Sanction Track: <strong>{currentProfile.tag}</strong>{" "}
                        <span onClick={() => setShowDetailsModal(true)} className="id-edit-link">
                          Edit Profile
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="id-reset-flow-btn"
                    onClick={() => setCurrentFlow("dashboard")}
                  >
                    Change Category <i className="bi bi-arrow-repeat"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="id-filter-toolbar">
              <div className="container">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {activeSchema.filterConfig.filters.map((fil) => (
                    <div className="id-filter-item" key={fil.id}>
                      <label>{fil.label}</label>
                      <div className="id-select-pill">
                        <select
                          value={selectedFilters[fil.id] || fil.options[0]}
                          onChange={(e) =>
                            setSelectedFilters({ ...selectedFilters, [fil.id]: e.target.value })
                          }
                        >
                          {fil.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="id-filter-item">
                    <label>GOVERNMENT SCHEME</label>
                    <label className="id-checkbox-pill">
                      <input
                        type="checkbox"
                        checked={toggleChecked}
                        onChange={(e) => setToggleChecked(e.target.checked)}
                      />
                      <span>{activeSchema.filterConfig.toggleLabel}</span>
                    </label>
                  </div>

                  <div className="id-filter-item">
                    <label>PROJECT REPORTS</label>
                    <button
                      type="button"
                      className="id-addons-btn"
                      onClick={() => alert("Connecting to DPR Preparation & CMA Data Tool...")}
                    >
                      <i className="bi bi-file-earmark-spreadsheet"></i> + Generate CMA / DPR
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container py-4">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="id-idv-box">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-sliders id-idv-icon"></i>
                      <div>
                        <span className="id-idv-label">
                          {activeSchema.filterConfig.primarySliderLabel}
                        </span>
                        <div className="id-idv-input-wrap">
                          <span>{activeSchema.filterConfig.sliderUnit}</span>
                          <input
                            type="number"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="id-slider-wrap flex-grow-1 mx-4">
                      <div className="id-slider-header">
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          {activeSchema.filterConfig.recommendBadge}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={activeSchema.filterConfig.sliderMin}
                        max={activeSchema.filterConfig.sliderMax}
                        step={50000}
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="form-range"
                      />
                      <div className="d-flex justify-content-between text-muted small">
                        <span>
                          Min - {activeSchema.filterConfig.sliderUnit}
                          {activeSchema.filterConfig.sliderMin.toLocaleString("en-IN")}
                        </span>
                        <span>
                          {activeSchema.filterConfig.sliderUnit}
                          {activeSchema.filterConfig.sliderMax.toLocaleString("en-IN")} - Max
                        </span>
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end gap-1">
                      <button
                        type="button"
                        className="id-update-btn"
                        onClick={() =>
                          alert(
                            `Recalculated EMI and options for ₹${sliderValue.toLocaleString("en-IN")}`
                          )
                        }
                      >
                        Update
                      </button>
                      <a href="#emi-help" className="id-idv-help-link">
                        How is EMI estimated?
                      </a>
                    </div>
                  </div>

                  <div className="id-notice-banner">
                    <i className="bi bi-shield-check"></i>
                    <span>
                      Direct bank submission with high sanction probability & subsidy eligibility.
                    </span>
                  </div>

                  <div className="id-quotes-count">
                    <strong>{activeSchema.offers.length} Partner Banking Offers Available</strong>
                  </div>

                  <div className="id-plans-stack">
                    {activeSchema.offers.map((offer) => (
                      <div className="id-plan-card" key={offer.id}>
                        <div className="id-plan-grid">
                          <div className="id-plan-brand">
                            <div
                              className="id-brand-badge"
                              style={{ backgroundColor: offer.logoColor }}
                            >
                              {offer.logoText}
                            </div>
                            <div>
                              <h4>{offer.lender}</h4>
                              <small>{offer.loanType}</small>
                            </div>
                          </div>

                          <div className="id-plan-stat">
                            <label>{offer.stat1.label}</label>
                            <strong className="text-success">{offer.stat1.value}</strong>
                          </div>

                          <div className="id-plan-stat">
                            <label>{offer.stat2.label}</label>
                            <strong>{offer.stat2.value}</strong>
                          </div>

                          <div className="id-plan-stat">
                            <label>{offer.stat3.label}</label>
                            <strong>{offer.stat3.value}</strong>
                          </div>

                          <div className="id-plan-stat">
                            <label>{offer.stat4.label}</label>
                            <strong>{offer.stat4.value}</strong>
                          </div>

                          <div className="id-plan-action">
                            <button
                              type="button"
                              className="id-price-btn"
                              onClick={() =>
                                alert(`Submitting loan application to ${offer.lender}...`)
                              }
                            >
                              {offer.actionText} <i className="bi bi-chevron-right"></i>
                            </button>
                            <span className="id-breakup-link">View Eligibility Criteria</span>
                          </div>
                        </div>

                        <div className="id-plan-card-footer">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="id-benefits-label">HIGHLIGHTS:</span>
                            {offer.benefits.map((b, bIdx) => (
                              <span className="id-benefit-chip" key={bIdx}>
                                <i className="bi bi-check2"></i> {b}
                              </span>
                            ))}
                          </div>

                          <label className="id-compare-checkbox">
                            <input type="checkbox" />
                            <span>Add to Comparison</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="id-sidebar-widget">
                    <h3>Specialized Loan Solutions</h3>

                    {activeSchema.features.map((feat, fIdx) => (
                      <div className="id-addon-item" key={fIdx}>
                        <div className="id-addon-icon">
                          <i className="bi bi-check-circle-fill text-success"></i>
                        </div>
                        <div>
                          <h4>{feat.title}</h4>
                          <p>{feat.desc}</p>
                        </div>
                        <i className="bi bi-chevron-right ms-auto text-primary"></i>
                      </div>
                    ))}

                    <div className="text-center pt-2">
                      <a href="#dpr" className="id-link-blue">
                        Need Custom Detailed Project Report (DPR)?
                      </a>
                    </div>
                  </div>

                  <div className="id-sidebar-widget mt-4">
                    <h3>Disbursal Process</h3>
                    <div className="id-how-step">
                      <div className="id-how-badge step1">Step 1</div>
                      <p>Select required loan product and check eligibility</p>
                    </div>
                    <div className="id-how-step">
                      <div className="id-how-badge step2">Step 2</div>
                      <p>Upload basic financials / GST / KYC for credit appraisal</p>
                    </div>
                    <div className="id-how-step">
                      <div className="id-how-badge step3">Step 3</div>
                      <p>Bank sanction letter issued with subsidy alignment</p>
                    </div>
                    <div className="id-how-step">
                      <div className="id-how-badge step4">Step 4</div>
                      <p>Direct loan disbursal into your business bank account</p>
                    </div>
                  </div>

                  <div className="id-sidebar-widget mt-4">
                    <h3>Why GoSubsidy Advisory?</h3>
                    <ul className="id-usp-list">
                      <li><i className="bi bi-person-check-fill text-primary"></i> 20+ Yrs Banking Experience</li>
                      <li><i className="bi bi-award-fill text-warning"></i> 100% Subsidy-Compliant Filings</li>
                      <li><i className="bi bi-diagram-3-fill text-success"></i> Direct Multi-Bank Routing</li>
                      <li><i className="bi bi-speedometer2 text-danger"></i> Rapid CMA & Sanction TAT</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            POPUP MODAL: LEAD CAPTURE & PROPOSAL SETUP
        ========================================================= */}
        {showDetailsModal && (
          <div className="id-modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="id-vehicle-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="id-modal-close-icon"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>

              <div className="row g-0">
                <div className="col-lg-6 id-modal-left-pane">
                  <h3 className="id-modal-pane-title">Loan Parameters</h3>

                  <div className="id-vehicle-box">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="id-maruti-logo"
                        style={{ color: currentProfile.logoColor }}
                      >
                        <span>{currentProfile.logo}</span>
                      </div>
                      <div>
                        <h4>{currentProfile.title}</h4>
                        <strong>₹{Number(inputValue || 0).toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    <div className="row g-2 id-vehicle-specs-grid">
                      {currentProfile.specs.map((sp, sIdx) => (
                        <div className="col-6" key={sIdx}>
                          <small>{sp.label}</small>
                          <span>{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="id-not-your-car"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setCurrentFlow("input-entry");
                    }}
                  >
                    Adjust Loan Scheme? <i className="bi bi-chevron-right"></i>
                  </div>
                </div>

                <div className="col-lg-6 id-modal-right-pane">
                  <h3 className="id-modal-pane-title">Check Instant Bank Eligibility</h3>

                  <form onSubmit={handleProceedToOffers} className="id-modal-lead-form">
                    <div className="mb-3">
                      <label>
                        Applicant Full Name <sup>*</sup> <small>(As per PAN)</small>
                      </label>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label>
                        Mobile Number <sup>*</sup> <small>(For OTP & Credit Score lookup)</small>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        value={leadForm.mobile}
                        onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label>
                        PAN / Business GSTIN <small>(Optional for pre-qualification)</small>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ABCDE1234F"
                        value={leadForm.panNumber}
                        onChange={(e) => setLeadForm({ ...leadForm, panNumber: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <p className="id-spam-free-note">
                      We ensure 100% bank-grade privacy with zero spam calls.
                    </p>

                    <label className="id-fast-track-check">
                      <input
                        type="checkbox"
                        checked={leadForm.fastTrack}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, fastTrack: e.target.checked })
                        }
                      />
                      <span>
                        Fast-track sanction in ⚡ <strong>24 Hours</strong> <a href="#terms">*T&C Apply</a>
                      </span>
                    </label>

                    <button type="submit" className="id-modal-view-prices-btn" disabled={isLoading}>
                      {isLoading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Checking Bank Rates...
                        </span>
                      ) : (
                        <span>
                          View Lending Rates <i className="bi bi-chevron-right"></i>
                        </span>
                      )}
                    </button>

                    <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">Receive updates on WhatsApp</small>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={leadForm.whatsappUpdates}
                          onChange={(e) =>
                            setLeadForm({
                              ...leadForm,
                              whatsappUpdates: e.target.checked,
                            })
                          }
                        />
                      </div>
                      <a href="#policy" className="small text-muted text-decoration-none">
                        Privacy & Banking Norms<sup>*</sup>
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* =========================================================
          REUSABLE IDENTICAL CSS STYLES
      ========================================================= */}
      <style>{`
        .id-page {
          background-color: #f7f9fc;
          min-height: 85vh;
          color: #1e2d42;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .id-top-indicator {
          width: 24px;
          height: 4px;
          background: #0077e6;
          border-radius: 4px;
          margin: 0 auto;
        }

        .id-hero {
          padding: 30px 0 60px;
        }

        .id-main-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 45px 35px 35px;
          border: 1px solid #eef2f7;
          box-shadow: 0 4px 20px rgba(0, 32, 70, 0.04);
          max-width: 1040px;
          margin: 0 auto;
        }

        .id-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 28px 16px;
        }

        .id-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          color: #1a2c42;
          padding: 12px 6px;
          border-radius: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .id-item:hover {
          transform: translateY(-4px);
        }

        .id-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 9.5px;
          font-weight: 800;
          padding: 2.5px 8px;
          border-radius: 6px;
          white-space: nowrap;
          z-index: 2;
        }

        .id-badge.green {
          background-color: #008744;
          color: #ffffff;
        }

        .id-badge.red {
          background-color: #eb3b4d;
          color: #ffffff;
        }

        .id-icon-box {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 8px;
        }

        .id-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a2c42;
          margin: 0 0 2px;
          line-height: 1.2;
        }

        .id-subtitle {
          font-size: 12px;
          font-weight: 500;
          color: #6a7b92;
        }

        .id-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .id-stat-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 22px;
          border-radius: 18px;
          min-width: 170px;
        }

        .id-stat-pill.mint { background-color: #eafaf1; }
        .id-stat-pill.blue { background-color: #f0f4f9; }
        .id-stat-pill.red { background-color: #fef0ef; }

        .id-stat-emoji { font-size: 24px; }
        .id-stat-info strong {
          display: block;
          font-size: 16px;
          font-weight: 850;
          color: #1a2c42;
        }
        .id-stat-info small {
          font-size: 11px;
          color: #6a7b92;
        }

        .id-car-hero-section {
          padding: 24px 0 60px;
        }

        .id-flow-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #8c9ba5;
          margin-bottom: 12px;
        }

        .id-flow-breadcrumb span {
          cursor: pointer;
        }

        .id-flow-breadcrumb span.active {
          color: #1e2d42;
          font-weight: 600;
        }

        .id-flow-page-title {
          font-size: 28px;
          font-weight: 850;
          color: #1e2d42;
          margin-bottom: 24px;
        }

        .id-car-banner-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 45px 40px;
          border: 1px solid #eef2f7;
          box-shadow: 0 6px 25px rgba(0, 32, 70, 0.05);
          position: relative;
          overflow: hidden;
        }

        .id-banner-heading {
          font-size: 28px;
          color: #4a5568;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .id-banner-steps {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #718096;
          margin-bottom: 28px;
        }

        .id-banner-steps i {
          font-size: 10px;
          color: #a0aec0;
        }

        .id-car-input-form {
          max-width: 440px;
        }

        .id-car-input-wrap input {
          width: 100%;
          border: 1.5px solid #cbd5e0;
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 15px;
          font-weight: 600;
          color: #1a202c;
          outline: none;
        }

        .id-car-input-wrap input:focus {
          border-color: #eb3b4d;
        }

        .id-red-primary-btn {
          width: 100%;
          background: #eb3b4d;
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          padding: 14px;
          border: none;
          border-radius: 10px;
          margin-top: 14px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(235, 59, 77, 0.25);
        }

        .id-red-primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .id-terms-note {
          font-size: 11px;
          color: #718096;
          margin-top: 14px;
        }

        .id-terms-note a {
          color: #0077e6;
          text-decoration: none;
        }

        .id-brand-new-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #0077e6;
          margin-top: 14px;
          cursor: pointer;
        }

        .id-ambassador-wrap {
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .id-red-splash-bg {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(235, 59, 77, 0.85) 0%, rgba(235, 59, 77, 0) 70%);
          border-radius: 50%;
          right: -40px;
          top: -20px;
          filter: blur(20px);
          opacity: 0.6;
        }

        .id-ambassador-figure {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .id-avatar-circle {
          width: 120px;
          height: 120px;
          background: #ffffff;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 60px;
          color: #0077e6;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        .id-ambassador-tag {
          margin-top: 14px;
          background: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .id-ambassador-tag strong {
          display: block;
          font-size: 13px;
          color: #1a202c;
        }

        .id-ambassador-tag small {
          font-size: 11px;
          color: #718096;
        }

        .id-agent-promo-card {
          margin-top: 24px;
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          color: #ffffff;
          border-radius: 20px;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .id-agent-logo-badge {
          background: #e53e3e;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .id-agent-left h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 8px 0 0;
          color: #ffffff;
        }

        .id-agent-center h4 {
          font-size: 16px;
          margin: 0;
          color: #edf2f7;
        }

        .id-agent-center p {
          font-size: 12px;
          margin: 4px 0 0;
          color: #a0aec0;
        }

        .id-agent-btn {
          background: #0077e6;
          color: #ffffff;
          border: none;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: 750;
          font-size: 13px;
          cursor: pointer;
        }

        .id-quotes-topbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 0;
        }

        .id-back-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #334155;
        }

        .id-quotes-car-name {
          font-size: 17px;
          font-weight: 850;
          color: #0f172a;
          margin: 0;
        }

        .id-quotes-car-name span {
          color: #cbd5e1;
          margin: 0 4px;
        }

        .id-quotes-expiry {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .id-edit-link {
          color: #0077e6;
          font-weight: 700;
          margin-left: 8px;
          cursor: pointer;
        }

        .id-reset-flow-btn {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 750;
          color: #475569;
          cursor: pointer;
        }

        .id-filter-toolbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 0;
        }

        .id-filter-item label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .id-select-pill {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 4px 10px;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .id-select-pill select {
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          outline: none;
          color: #1e293b;
        }

        .id-checkbox-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .id-addons-btn {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 750;
          color: #0f172a;
          cursor: pointer;
        }

        .id-idv-box {
          background: #ffffff;
          border-radius: 16px;
          padding: 18px 24px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .id-idv-icon {
          font-size: 24px;
          color: #64748b;
        }

        .id-idv-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          display: block;
        }

        .id-idv-input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 13px;
          font-weight: 750;
        }

        .id-idv-input-wrap input {
          width: 115px;
          border: none;
          outline: none;
          font-weight: 750;
        }

        .id-update-btn {
          background: #eb3b4d;
          color: #ffffff;
          border: none;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .id-idv-help-link {
          font-size: 11px;
          color: #0077e6;
          text-decoration: none;
        }

        .id-notice-banner {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #065f46;
          margin-bottom: 16px;
        }

        .id-quotes-count {
          font-size: 14px;
          color: #334155;
          margin-bottom: 12px;
        }

        .id-plans-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .id-plan-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          transition: box-shadow 0.2s;
        }

        .id-plan-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .id-plan-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr 1.2fr;
          align-items: center;
          gap: 12px;
        }

        .id-plan-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .id-brand-badge {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          color: #ffffff;
          font-weight: 900;
          font-size: 13px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .id-plan-brand h4 {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .id-plan-brand small {
          font-size: 11px;
          color: #64748b;
        }

        .id-plan-stat label {
          display: block;
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
        }

        .id-plan-stat strong {
          font-size: 13px;
          color: #1e293b;
        }

        .id-plan-action {
          text-align: right;
        }

        .id-price-btn {
          background: #eb3b4d;
          color: #ffffff;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .id-breakup-link {
          display: block;
          font-size: 10px;
          color: #0077e6;
          margin-top: 4px;
          cursor: pointer;
        }

        .id-plan-card-footer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
        }

        .id-benefits-label {
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
        }

        .id-benefit-chip {
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
          color: #475569;
          font-size: 10.5px;
        }

        .id-compare-checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          cursor: pointer;
        }

        .id-sidebar-widget {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 22px;
        }

        .id-sidebar-widget h3 {
          font-size: 15px;
          font-weight: 850;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .id-addon-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .id-addon-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #f1f5f9;
          display: grid;
          place-items: center;
          color: #0f172a;
          flex-shrink: 0;
        }

        .id-addon-item h4 {
          font-size: 13px;
          font-weight: 750;
          margin: 0;
          color: #0f172a;
        }

        .id-addon-item p {
          font-size: 11px;
          color: #64748b;
          margin: 2px 0 0;
          line-height: 1.4;
        }

        .id-link-blue {
          font-size: 12px;
          color: #0077e6;
          font-weight: 750;
          text-decoration: none;
        }

        .id-how-step {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .id-how-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .id-how-badge.step1 { background: #e0f2fe; color: #0284c7; }
        .id-how-badge.step2 { background: #fef3c7; color: #d97706; }
        .id-how-badge.step3 { background: #dcfce7; color: #15803d; }
        .id-how-badge.step4 { background: #f3e8ff; color: #7e22ce; }

        .id-how-step p {
          font-size: 12px;
          color: #475569;
          margin: 0;
        }

        .id-usp-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 12px;
          color: #334155;
          font-weight: 600;
        }

        .id-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: grid;
          place-items: center;
          z-index: 1050;
          padding: 20px;
        }

        .id-vehicle-modal-card {
          background: #ffffff;
          border-radius: 24px;
          max-width: 820px;
          width: 100%;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          position: relative;
          overflow: hidden;
          animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        .id-modal-close-icon {
          position: absolute;
          top: 18px;
          right: 20px;
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #475569;
          cursor: pointer;
          z-index: 10;
        }

        .id-modal-left-pane {
          background: #f0f7ff;
          padding: 38px 32px;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .id-modal-right-pane {
          padding: 38px 32px;
        }

        .id-modal-pane-title {
          font-size: 18px;
          font-weight: 850;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .id-vehicle-box {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
        }

        .id-maruti-logo {
          width: 42px;
          height: 42px;
          background: #e2e8f0;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 16px;
        }

        .id-vehicle-box h4 {
          font-size: 15px;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .id-vehicle-box strong {
          font-size: 13px;
          color: #64748b;
        }

        .id-vehicle-specs-grid small {
          display: block;
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
        }

        .id-vehicle-specs-grid span {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .id-not-your-car {
          margin-top: auto;
          padding-top: 20px;
          color: #0077e6;
          font-weight: 750;
          font-size: 13px;
          cursor: pointer;
        }

        .id-modal-lead-form label {
          display: block;
          font-size: 12px;
          font-weight: 750;
          color: #334155;
          margin-bottom: 6px;
        }

        .id-modal-lead-form label sup {
          color: #e53e3e;
        }

        .id-modal-lead-form label small {
          font-size: 10px;
          color: #94a3b8;
          font-weight: normal;
        }

        .id-modal-lead-form input[type="text"],
        .id-modal-lead-form input[type="tel"] {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }

        .id-spam-free-note {
          font-size: 11px;
          color: #64748b;
          margin: 8px 0 16px;
        }

        .id-fast-track-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #0f172a;
          margin-bottom: 18px;
          cursor: pointer;
        }

        .id-fast-track-check a {
          color: #0077e6;
          text-decoration: none;
        }

        .id-modal-view-prices-btn {
          width: 100%;
          background: #eb3b4d;
          color: #ffffff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .id-modal-view-prices-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 991px) {
          .id-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .id-plan-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .id-idv-box {
            flex-direction: column;
            gap: 14px;
          }
          .id-slider-wrap {
            width: 100%;
            margin: 0 !important;
          }
        }

        @media (max-width: 767px) {
          .id-main-card {
            padding: 30px 18px 25px;
          }
          .id-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .id-stats-row {
            flex-direction: column;
            width: 100%;
          }
          .id-stat-pill {
            width: 100%;
            justify-content: center;
          }
          .id-modal-left-pane {
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }
        }

        @media (max-width: 575px) {
          .id-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .id-car-banner-card {
            padding: 26px 20px;
          }
        }
      `}</style>
    </>
  );
}