import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import * as insuranceApi from "../services/insuranceApi";

/* =========================================================
   SAFE API CLIENT HELPER WITH BUILT-IN FALLBACK
========================================================= */

async function safeFetchVehicleDetails(vehicleNumber) {
  if (typeof insuranceApi?.fetchVehicleDetails === "function") {
    return insuranceApi.fetchVehicleDetails(vehicleNumber);
  }
  return { success: false, fallback: true };
}

async function safeGenerateQuotes(payload) {
  if (typeof insuranceApi?.generateInsuranceQuotes === "function") {
    return insuranceApi.generateInsuranceQuotes(payload);
  }
  if (typeof insuranceApi?.requestInsuranceQuotes === "function") {
    return insuranceApi.requestInsuranceQuotes(payload);
  }
  return { success: true, quotes: [] };
}

/* =========================================================
   DYNAMIC PRODUCT CONFIGURATIONS & SPECIALIZED SCHEMAS
========================================================= */

const productSchemas = {
  car: {
    id: "car",
    title: "Car Insurance",
    category: "Motor",
    tagline: "Car insurance starting from ₹ 6/day*",
    steps: ["Car No.", "Select Plan", "Policy Issued"],
    primaryInput: {
      type: "text",
      label: "Vehicle Registration",
      placeholder: "Your car number ex DL-12-AB-2345",
      defaultValue: "TS04FD2229",
    },
    defaultVehicle: {
      title: "Maruti Vitara Brezza",
      subtitle: "TS04FD2229",
      logo: "S",
      logoColor: "#c0392b",
      specs: [
        { label: "Fuel Type", value: "Diesel" },
        { label: "Variant", value: "ZDi Plus Smart Hybrid" },
        { label: "Registration Year", value: "2021" },
        { label: "RTO City", value: "Khammam, Telangana" },
      ],
      expiryDate: "25 Apr 2025",
    },
    filterConfig: {
      primarySliderLabel: "IDV - Car Value",
      sliderUnit: "₹",
      sliderMin: 373770,
      sliderMax: 670950,
      sliderDefault: 493866,
      recommendBadge: "Recommend ₹4,93,866",
      filters: [
        { id: "ncb", label: "NCB BONUS", options: ["0%", "20%", "25%", "35%", "50%"] },
        { id: "planType", label: "PLAN TYPE", options: ["Comprehensive", "Third Party", "Own Damage"] },
      ],
      toggleLabel: "Zero Depreciation",
    },
    plans: [
      {
        id: "ui-car",
        insurer: "United India",
        logoText: "UI",
        logoColor: "#f39c12",
        planType: "Comprehensive",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "95%" },
        stat3: { label: "Cashless Garages", value: "634" },
        stat4: { label: "IDV - Cover Value", value: "₹3,80,210" },
        benefits: ["Towing assistance (accidents)", "Roadside Battery Jumpstart"],
        price: "₹7,238",
      },
      {
        id: "nia-car",
        insurer: "New India",
        logoText: "NIA",
        logoColor: "#2980b9",
        planType: "Comprehensive",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "92.23%" },
        stat3: { label: "Cashless Garages", value: "839" },
        stat4: { label: "IDV - Cover Value", value: "₹4,22,264" },
        benefits: ["Free Vehicle Pick & Drop", "Towing till ₹1500"],
        price: "₹7,379",
      },
      {
        id: "hdfc-car",
        insurer: "HDFC ERGO",
        logoText: "HDFC",
        logoColor: "#c0392b",
        planType: "Comprehensive",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "98.40%" },
        stat3: { label: "Cashless Garages", value: "6398" },
        stat4: { label: "IDV - Cover Value", value: "₹4,24,935" },
        benefits: ["Reimbursement in 1 Day", "Zero Dep Included", "Engine Shield"],
        price: "₹17,513",
      },
    ],
    addons: [
      { title: "Zero Depreciation", desc: "100% payout without asset aging deductions." },
      { title: "Consumable Cover", desc: "Covers oils, coolant, lubricants, nuts & bolts." },
      { title: "24x7 Roadside Assistance", desc: "On-spot towing, puncture repair, and fuel delivery." },
    ],
  },

  bike: {
    id: "bike",
    title: "Two Wheeler Insurance",
    category: "Motor",
    tagline: "Bike insurance starting from ₹ 1.5/day*",
    steps: ["Bike No.", "Select Plan", "Policy Issued"],
    primaryInput: {
      type: "text",
      label: "Two Wheeler Registration",
      placeholder: "Your bike number ex TS-04-EA-1234",
      defaultValue: "TS04EA5566",
    },
    defaultVehicle: {
      title: "Royal Enfield Classic 350",
      subtitle: "TS04EA5566",
      logo: "RE",
      logoColor: "#2c3e50",
      specs: [
        { label: "Fuel Type", value: "Petrol" },
        { label: "Variant", value: "Dual Channel ABS" },
        { label: "Registration Year", value: "2022" },
        { label: "RTO City", value: "Khammam, Telangana" },
      ],
      expiryDate: "14 Oct 2025",
    },
    filterConfig: {
      primarySliderLabel: "IDV - Bike Valuation",
      sliderUnit: "₹",
      sliderMin: 120000,
      sliderMax: 210000,
      sliderDefault: 165000,
      recommendBadge: "Recommend ₹1,65,000",
      filters: [
        { id: "ncb", label: "NCB BONUS", options: ["0%", "20%", "35%", "50%"] },
        { id: "planType", label: "COVER TYPE", options: ["Comprehensive (1+1)", "1 Yr OD + 5 Yr TP", "TP Only"] },
      ],
      toggleLabel: "Zero Depreciation",
    },
    plans: [
      {
        id: "icici-bike",
        insurer: "ICICI Lombard",
        logoText: "ICICI",
        logoColor: "#b03a2e",
        planType: "Comprehensive",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "96.5%" },
        stat3: { label: "Cashless Network", value: "3,200+" },
        stat4: { label: "IDV Cover", value: "₹1,65,000" },
        benefits: ["Instant Digital Inspection", "₹15 Lakh PA Owner-Driver"],
        price: "₹1,480",
      },
      {
        id: "tata-bike",
        insurer: "Tata AIG",
        logoText: "TATA",
        logoColor: "#1b4f72",
        planType: "Comprehensive",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "97.8%" },
        stat3: { label: "Cashless Network", value: "4,500+" },
        stat4: { label: "IDV Cover", value: "₹1,72,000" },
        benefits: ["Zero Dep Rider", "Emergency Fuel Support", "Key Replacement"],
        price: "₹1,890",
      },
    ],
    addons: [
      { title: "Zero Depreciation", desc: "No deduction on plastic, fiber, and rubber parts." },
      { title: "Personal Accident Cover", desc: "₹15 Lakh mandated sum insured for owner-driver." },
      { title: "Helmet Protection", desc: "Reimbursement for damaged certified helmet." },
    ],
  },

  health: {
    id: "health",
    title: "Health Insurance",
    category: "Personal",
    tagline: "₹10 Lakh Medical Shield starting @ ₹ 390/month*",
    steps: ["Family Details", "Compare Covers", "Instant E-Card"],
    primaryInput: {
      type: "pincode",
      label: "City / Pincode",
      placeholder: "Enter Pincode (e.g. 507001)",
      defaultValue: "507001",
    },
    defaultVehicle: {
      title: "Family Floater Plan",
      subtitle: "2 Adults + 2 Children",
      logo: "H+",
      logoColor: "#e74c3c",
      specs: [
        { label: "Eldest Member Age", value: "38 Years" },
        { label: "Members Insured", value: "Self + Spouse + 2 Kids" },
        { label: "Pre-existing Disease", value: "None Declared" },
        { label: "Zone / City", value: "Khammam (Zone 2)" },
      ],
      expiryDate: "New Policy",
    },
    filterConfig: {
      primarySliderLabel: "Sum Insured (Medical Cover)",
      sliderUnit: "₹",
      sliderMin: 500000,
      sliderMax: 10000000,
      sliderDefault: 1000000,
      recommendBadge: "Recommend ₹10 Lakhs",
      filters: [
        { id: "roomRent", label: "ROOM RENT", options: ["No Room Rent Cap", "Single Private Room", "Shared"] },
        { id: "waiting", label: "PRE-EXISTING WAITING", options: ["1 Year", "2 Years", "3 Years"] },
      ],
      toggleLabel: "Unlimited Automatic Restoration",
    },
    plans: [
      {
        id: "star-health",
        insurer: "Star Health",
        logoText: "STAR",
        logoColor: "#1e8449",
        planType: "Family Optima",
        stat1: { label: "Policy Starts", value: "Instant" },
        stat2: { label: "Claim Settled", value: "99.1%" },
        stat3: { label: "Cashless Hospitals", value: "14,000+" },
        stat4: { label: "Sum Insured", value: "₹10,00,000" },
        benefits: ["Zero Room Rent Cap", "100% Reload Benefit", "Ayush Treatment"],
        price: "₹8,450/yr",
      },
      {
        id: "care-health",
        insurer: "Care Health",
        logoText: "CARE",
        logoColor: "#0e6251",
        planType: "Care Supreme",
        stat1: { label: "Policy Starts", value: "Instant" },
        stat2: { label: "Claim Settled", value: "95.2%" },
        stat3: { label: "Cashless Hospitals", value: "19,000+" },
        stat4: { label: "Sum Insured", value: "₹10,00,000" },
        benefits: ["Unlimited Restore", "Free Annual Health Checkup", "OPD Cover"],
        price: "₹9,120/yr",
      },
    ],
    addons: [
      { title: "Maternity & Newborn", desc: "Covers normal & C-section deliveries with infant vaccine cover." },
      { title: "OPD & Diagnostics", desc: "Day-to-day doctor consults, pharmacy, and diagnostic blood tests." },
      { title: "Critical Illness Rider", desc: "Lump-sum payout for 32 specified major critical illnesses." },
    ],
  },

  term: {
    id: "term",
    title: "Term Life Insurance",
    category: "Personal",
    tagline: "₹1 Crore Term Cover starting @ ₹ 490/month*",
    steps: ["Income & Age", "Select Sum Assured", "Policy Issue"],
    primaryInput: {
      type: "income",
      label: "Annual Income",
      placeholder: "Annual Income (e.g. ₹ 8,00,000)",
      defaultValue: "₹ 10,00,000",
    },
    defaultVehicle: {
      title: "Pure Life Protection",
      subtitle: "₹1.00 Crore Life Sum Assured",
      logo: "₹",
      logoColor: "#2471a3",
      specs: [
        { label: "Age / DOB", value: "35 Yrs (Non-Smoker)" },
        { label: "Occupation", value: "Salaried / Professional" },
        { label: "Annual Income", value: "₹ 10,00,000" },
        { label: "Cover Duration", value: "Up to Age 70 (35 Yrs)" },
      ],
      expiryDate: "Life Long",
    },
    filterConfig: {
      primarySliderLabel: "Life Sum Assured",
      sliderUnit: "₹",
      sliderMin: 5000000,
      sliderMax: 50000000,
      sliderDefault: 10000000,
      recommendBadge: "Recommend ₹1.00 Crore",
      filters: [
        { id: "coverTill", label: "COVERAGE TILL AGE", options: ["60 Years", "70 Years", "85 Years", "Whole Life (99)"] },
        { id: "payout", label: "PAYOUT OPTION", options: ["Lump sum", "Monthly Income", "Lump sum + Income"] },
      ],
      toggleLabel: "Return of Premium (TROP)",
    },
    plans: [
      {
        id: "max-life",
        insurer: "Max Life",
        logoText: "MAX",
        logoColor: "#117a65",
        planType: "Smart Secure Plus",
        stat1: { label: "Policy Starts", value: "Immediate" },
        stat2: { label: "Claim Settled", value: "99.51%" },
        stat3: { label: "Tax Benefit", value: "Sec 80C & 10(10D)" },
        stat4: { label: "Sum Assured", value: "₹1.00 Crore" },
        benefits: ["Terminal Illness Inbuilt", "Accidental Death Rider", "Waiver of Premium"],
        price: "₹7,650/yr",
      },
      {
        id: "hdfc-life",
        insurer: "HDFC Life",
        logoText: "HDFC",
        logoColor: "#922b21",
        planType: "Click 2 Protect Super",
        stat1: { label: "Policy Starts", value: "Immediate" },
        stat2: { label: "Claim Settled", value: "99.30%" },
        stat3: { label: "Tax Benefit", value: "Sec 80C Exempt" },
        stat4: { label: "Sum Assured", value: "₹1.00 Crore" },
        benefits: ["Critical Illness Cover", "Early Exit Benefit @ 60", "Zero Paperwork"],
        price: "₹8,120/yr",
      },
    ],
    addons: [
      { title: "Critical Illness Benefit", desc: "Advance payout upon diagnosis of cancer, heart stroke, etc." },
      { title: "Accidental Total Disability", desc: "All future premiums waived if disabled in an accident." },
      { title: "Income Benefit on Accidental Death", desc: "Regular monthly income for family for 10 consecutive years." },
    ],
  },

  corporate: {
    id: "corporate",
    title: "Corporate & MSME Insurance",
    category: "Business",
    tagline: "Comprehensive Business, Fire & Asset Shield*",
    steps: ["Asset Valuation", "Compare Package", "Policy Issued"],
    primaryInput: {
      type: "business",
      label: "Business Name & Location",
      placeholder: "e.g. Rice Mill / Warehouse, Nelakondapalli",
      defaultValue: "Agro Process Unit, Nelakondapalli",
    },
    defaultVehicle: {
      title: "Commercial Asset Package",
      subtitle: "Manufacturing & Plant Unit",
      logo: "MSME",
      logoColor: "#d35400",
      specs: [
        { label: "Building & Civil Work", value: "₹ 1.20 Crore" },
        { label: "Plant & Machinery", value: "₹ 2.50 Crore" },
        { label: "Stock & Raw Materials", value: "₹ 80 Lakhs" },
        { label: "Location", value: "Khammam Industrial Zone" },
      ],
      expiryDate: "Annual Policy",
    },
    filterConfig: {
      primarySliderLabel: "Total Insured Asset Value",
      sliderUnit: "₹",
      sliderMin: 1000000,
      sliderMax: 100000000,
      sliderDefault: 45000000,
      recommendBadge: "Audit: ₹4.50 Crore",
      filters: [
        { id: "riskType", label: "BUSINESS CATEGORY", options: ["Agro/Mill", "Warehouse", "Manufacturing", "Retail Trade"] },
        { id: "liability", label: "PUBLIC LIABILITY", options: ["₹ 50 Lakhs", "₹ 1 Crore", "₹ 5 Crore"] },
      ],
      toggleLabel: "Include Business Interruption Loss",
    },
    plans: [
      {
        id: "sbi-general",
        insurer: "SBI General",
        logoText: "SBI",
        logoColor: "#1a5276",
        planType: "Bharat Sookshma Udyam",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "96.4%" },
        stat3: { label: "Survey TAT", value: "Within 24 Hrs" },
        stat4: { label: "Asset Cover", value: "₹4.50 Crore" },
        benefits: ["Fire, STFI & Earthquake", "Machinery Breakdown", "Burglary & Theft"],
        price: "₹18,400/yr",
      },
      {
        id: "bajaj-msme",
        insurer: "Bajaj Allianz",
        logoText: "BAJAJ",
        logoColor: "#0b5345",
        planType: "SME Total Shield",
        stat1: { label: "Policy Starts", value: "01 Sep 2026" },
        stat2: { label: "Claim Settled", value: "98.2%" },
        stat3: { label: "Survey TAT", value: "Dedicated Manager" },
        stat4: { label: "Asset Cover", value: "₹4.50 Crore" },
        benefits: ["Electronic Equipment Cover", "Money in Transit", "Third Party Liability"],
        price: "₹22,900/yr",
      },
    ],
    addons: [
      { title: "Machinery Breakdown (MBD)", desc: "Covers sudden electrical/mechanical failure & repair costs." },
      { title: "Business Interruption (FLOP)", desc: "Compensates lost gross profits during operational shutdown." },
      { title: "Employee Compensation", desc: "Fulfills statutory liability towards workers for workplace injuries." },
    ],
  },

  poultry: {
    id: "poultry",
    title: "Poultry Farm Insurance",
    category: "Rural",
    tagline: "Protection for Broiler, Layer, Breeder & Parent Birds*",
    steps: ["Farm Capacity", "Select Scheme", "Direct Cover"],
    primaryInput: {
      type: "farm",
      label: "Farm Location & Bird Capacity",
      placeholder: "e.g. 15,000 Birds, Nelakondapalli",
      defaultValue: "Nelakondapalli, 15,000 Birds",
    },
    defaultVehicle: {
      title: "Commercial Poultry Setup",
      subtitle: "15,000 Broiler Capacity",
      logo: "P",
      logoColor: "#7d6608",
      specs: [
        { label: "Bird Category", value: "Broiler (Day 1 to Day 42)" },
        { label: "Batch Capacity", value: "15,000 Birds / Batch" },
        { label: "Shed Type", value: "Automated Environment (EC)" },
        { label: "Location", value: "Nelakondapalli, Khammam" },
      ],
      expiryDate: "Batch-wise Cover",
    },
    filterConfig: {
      primarySliderLabel: "Bird Scale & Valuation",
      sliderUnit: "₹",
      sliderMin: 100000,
      sliderMax: 5000000,
      sliderDefault: 1200000,
      recommendBadge: "Batch: ₹12.00 Lakhs",
      filters: [
        { id: "birdType", label: "BIRD TYPE", options: ["Broiler", "Layer (Egg)", "Breeder / Parent"] },
        { id: "epidemic", label: "DISEASE COVERAGE", options: ["Standard (Ranikhet/Gumboro)", "All Epidemics (+Avian)"] },
      ],
      toggleLabel: "Transit & Mortality Extended Cover",
    },
    plans: [
      {
        id: "nia-poultry",
        insurer: "New India Assurance",
        logoText: "NIA",
        logoColor: "#1f618d",
        planType: "Poultry Master Scheme",
        stat1: { label: "Policy Starts", value: "Per Batch" },
        stat2: { label: "Settlement Desk", value: "Veterinary Survey" },
        stat3: { label: "Bird Count", value: "15,000 Birds" },
        stat4: { label: "Sum Insured", value: "₹12,00,000" },
        benefits: ["Accidental Mortality", "Natural Calamities & Storm", "Epidemic Outbreak Support"],
        price: "₹1.40/bird",
      },
      {
        id: "united-poultry",
        insurer: "United India",
        logoText: "UI",
        logoColor: "#b9770e",
        planType: "Integrated Farm Shield",
        stat1: { label: "Policy Starts", value: "Per Batch" },
        stat2: { label: "Settlement Desk", value: "Rapid 48h Claim" },
        stat3: { label: "Bird Count", value: "15,000 Birds" },
        stat4: { label: "Sum Insured", value: "₹12,00,000" },
        benefits: ["Fire & Lightning in Sheds", "Feed Toxicity Cover", "Vaccine-failure Indemnity"],
        price: "₹1.65/bird",
      },
    ],
    addons: [
      { title: "Extreme Heat Wave / Gout", desc: "Special indemnity against mass summer heatstroke mortality." },
      { title: "Feed Contamination Cover", desc: "Protects against sudden aflatoxin poisoning in feed batches." },
      { title: "Transit Death Cover", desc: "Covers day-old chick delivery transit and harvest-to-market loss." },
    ],
  },
};

const primaryProducts = [
  { id: "car", title: "Car", subtitle: "Insurance", icon: "car", badge: null },
  { id: "bike", title: "Bike", subtitle: "Insurance", icon: "bike", badge: null },
  { id: "health", title: "Health", subtitle: "Insurance", icon: "health", badge: { text: "Upto 25% Off*", type: "green" } },
  { id: "term", title: "Term", subtitle: "Insurance", icon: "term", badge: { text: "Save On Tax*", type: "green" } },
  { id: "corporate", title: "Corporate", subtitle: "Insurance", icon: "corporate", badge: { text: "NEW", type: "red" } },
  { id: "poultry", title: "Poultry Farm", subtitle: "Insurance", icon: "guaranteed", badge: { text: "AGRI", type: "green" } },
  { id: "family-health", title: "Family Health", subtitle: "Insurance", icon: "family", badge: null, targetSchema: "health" },
  { id: "investment", title: "Investment", subtitle: "Plans", icon: "investment", badge: null, targetSchema: "term" },
];

/* =========================================================
   CUSTOM CRISP SVG ICONS
========================================================= */

function ProductIcon({ type }) {
  switch (type) {
    case "car":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <rect x="8" y="24" width="48" height="24" rx="8" fill="#0084FF" />
          <path d="M14 24L20 12H44L50 24H14Z" fill="#0066CC" />
          <path d="M17 22L21 14H43L47 22H17Z" fill="#E1F0FF" />
          <circle cx="18" cy="46" r="6" fill="#1A2D42" />
          <circle cx="18" cy="46" r="3" fill="#FFFFFF" />
          <circle cx="46" cy="46" r="6" fill="#1A2D42" />
          <circle cx="46" cy="46" r="3" fill="#FFFFFF" />
          <circle cx="14" cy="30" r="3" fill="#FFE600" />
          <circle cx="50" cy="30" r="3" fill="#FFE600" />
        </svg>
      );
    case "bike":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="40" r="10" stroke="#0077E6" strokeWidth="4" />
          <circle cx="32" cy="40" r="4" fill="#0077E6" />
          <path d="M22 14H42" stroke="#0077E6" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 14V30" stroke="#0077E6" strokeWidth="4" />
          <rect x="25" y="20" width="14" height="12" rx="3" fill="#0099FF" />
          <circle cx="32" cy="23" r="3" fill="#FFF" />
          <path d="M20 18L18 24M44 18L46 24" stroke="#0077E6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "health":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path
            d="M32 54C32 54 10 40 10 24C10 16 16 10 24 10C28.5 10 32 13 32 13C32 13 35.5 10 40 10C48 10 54 16 54 24C54 40 32 54 32 54Z"
            fill="#0077E6"
          />
          <path d="M32 20V34M25 27H39" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "term":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path
            d="M10 30C10 17.85 19.85 8 32 8C44.15 8 54 17.85 54 30C54 32 52.5 33 50 33C47 33 46 31 43 31C40 31 39 33 36 33C33 33 32 31 29 31C26 31 25 33 22 33C19 33 18 31 15 31C12 31 10 32 10 30Z"
            fill="#0077E6"
          />
          <path d="M32 32V46C32 49 29 52 26 52C23 52 21 50 21 47" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 6V8" stroke="#0077E6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "investment":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="22" fill="#0084FF" />
          <circle cx="32" cy="32" r="17" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="32" y="39" fill="#FFFFFF" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            ₹
          </text>
        </svg>
      );
    case "corporate":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path d="M14 26L32 12L50 26V50H14V26Z" fill="#0077E6" />
          <rect x="22" y="32" width="20" height="18" fill="#FFF" rx="2" />
          <path d="M22 32H42V38C42 40 39 42 37 42C35 42 34 40 32 40C30 40 29 42 27 42C25 42 22 40 22 38V32Z" fill="#FF9900" />
          <rect x="28" y="40" width="8" height="10" fill="#0077E6" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="24" cy="22" r="8" fill="#0077E6" />
          <path d="M10 44C10 36 16 32 24 32C32 32 38 36 38 44" fill="#0077E6" />
          <circle cx="42" cy="25" r="6.5" fill="#FFA500" />
          <path d="M32 44C32 38 36 35 42 35C48 35 54 38 54 44" fill="#FFA500" />
        </svg>
      );
    case "guaranteed":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <path
            d="M32 18C38 18 44 23 46 32C48 42 46 50 32 50C18 50 16 42 18 32C20 23 26 18 32 18Z"
            fill="#0077E6"
          />
          <path d="M24 18C24 14 28 10 32 10C36 10 40 14 40 18" stroke="#0077E6" strokeWidth="4" />
          <circle cx="32" cy="22" r="4" fill="#FFA500" />
          <circle cx="32" cy="35" r="6" fill="#FFF" opacity="0.3" />
          <text x="32" y="39" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            ₹
          </text>
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
      return <i className="bi bi-shield-check fs-1 text-primary"></i>;
  }
}

/* =========================================================
   MAIN COMPONENT: DYNAMIC WORKFLOW & ROUTE-AWARE RESETS
========================================================= */

export default function Insurance() {
  const location = useLocation();

  // Screen Stage: 'dashboard' | 'input-entry' | 'quotes'
  const [currentFlow, setCurrentFlow] = useState("dashboard");
  const [selectedProductId, setSelectedProductId] = useState("car");

  // Reset to Dashboard whenever the user navigates back to /insurance without search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam && productSchemas[typeParam]) {
      launchProductFlow(typeParam);
    } else {
      setCurrentFlow("dashboard");
    }
  }, [location.pathname, location.search, location.key]);

  const activeSchema = productSchemas[selectedProductId] || productSchemas.car;

  const [inputValue, setInputValue] = useState(activeSchema.primaryInput.defaultValue);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [liveVehicle, setLiveVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sliderValue, setSliderValue] = useState(activeSchema.filterConfig.sliderDefault);
  const [toggleChecked, setToggleChecked] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [leadForm, setLeadForm] = useState({
    name: "",
    mobile: "",
    fastTrack: true,
    whatsappUpdates: true,
  });

  const launchProductFlow = (prodId) => {
    const targetId = productSchemas[prodId] ? prodId : "car";
    setSelectedProductId(targetId);
    const schema = productSchemas[targetId];
    setInputValue(schema.primaryInput.defaultValue);
    setSliderValue(schema.filterConfig.sliderDefault);
    setSelectedFilters({});
    setToggleChecked(false);
    setLiveVehicle(null);
    setCurrentFlow("input-entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckPrices = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      alert("Please provide the required details to proceed.");
      return;
    }

    if (selectedProductId === "car" || selectedProductId === "bike") {
      setIsLoading(true);
      try {
        const res = await safeFetchVehicleDetails(inputValue);
        if (res?.success && res?.data) {
          setLiveVehicle(res.data);
        } else {
          setLiveVehicle(null);
        }
      } catch (err) {
        console.warn("[Insurance RC] Fallback triggered:", err.message);
        setLiveVehicle(null);
      } finally {
        setIsLoading(false);
        setShowDetailsModal(true);
      }
    } else {
      setShowDetailsModal(true);
    }
  };

  const handleProceedToQuotes = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.mobile) {
      alert("Please provide Full Name and Mobile Number to view tailored plans.");
      return;
    }

    setIsLoading(true);
    try {
      await safeGenerateQuotes({
        insuranceType: selectedProductId,
        lead: {
          name: leadForm.name,
          mobile: leadForm.mobile,
          registrationNumber: inputValue,
          vehicleDetails: liveVehicle || activeSchema.defaultVehicle,
        },
      });
    } catch (err) {
      console.warn("[Insurance Quotes] Proceeding with schema plans:", err.message);
    } finally {
      setIsLoading(false);
      setShowDetailsModal(false);
      setCurrentFlow("quotes");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentVehicleData = liveVehicle || activeSchema.defaultVehicle;

  return (
    <>
      <main className="id-page">
        {/* =========================================================
            SCREEN 1: ALL-PRODUCTS DASHBOARD
        ========================================================= */}
        {currentFlow === "dashboard" && (
          <section className="id-hero">
            <div className="container">
              <div className="text-center mb-4">
                <div className="id-top-indicator"></div>
              </div>

              <div className="id-main-card">
                <div className="id-grid">
                  {primaryProducts.map((item) => (
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
                        <ProductIcon type={item.icon} />
                      </div>
                      <h3 className="id-title">{item.title}</h3>
                      <span className="id-subtitle">{item.subtitle}</span>
                    </div>
                  ))}

                  <div className="id-item id-view-more" onClick={() => launchProductFlow("corporate")}>
                    <div className="id-icon-box">
                      <ProductIcon type="more" />
                    </div>
                    <h3 className="id-title">View More</h3>
                  </div>
                </div>
              </div>

              <div className="id-stats-row">
                <div className="id-stat-pill mint">
                  <span className="id-stat-emoji">😍</span>
                  <div className="id-stat-info">
                    <strong>17 Mn+</strong>
                    <small>Happy Smiles</small>
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
                    <strong>4.7</strong>
                    <small>Rated on Google</small>
                  </div>
                </div>

                <div className="id-stat-pill red">
                  <span className="id-stat-emoji">📄</span>
                  <div className="id-stat-info">
                    <strong>145k+</strong>
                    <small>Claims Served</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            SCREEN 2: DYNAMIC PRODUCT ENTRY SCREEN
        ========================================================= */}
        {currentFlow === "input-entry" && (
          <section className="id-car-hero-section">
            <div className="container">
              <div className="id-flow-breadcrumb">
                <span onClick={() => setCurrentFlow("dashboard")}>Home</span>
                <i className="bi bi-chevron-right"></i>
                <span onClick={() => setCurrentFlow("dashboard")}>Insurance</span>
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

                    <form onSubmit={handleCheckPrices} className="id-car-input-form">
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
                            Fetching Details...
                          </span>
                        ) : (
                          "Check Prices"
                        )}
                      </button>
                    </form>

                    <p className="id-terms-note">
                      By clicking, I agree to <a href="#terms">*terms & conditions</a> and{" "}
                      <a href="#privacy">privacy policy</a>.
                    </p>

                    <div className="id-brand-new-link" onClick={() => setShowDetailsModal(true)}>
                      Need custom corporate quotation? <i className="bi bi-chevron-right"></i>
                    </div>
                  </div>

                  <div className="col-lg-5 text-center position-relative">
                    <div className="id-ambassador-wrap">
                      <div className="id-red-splash-bg"></div>
                      <div className="id-ambassador-figure">
                        <div className="id-avatar-circle">
                          <i className="bi bi-shield-check"></i>
                        </div>
                        <div className="id-ambassador-tag">
                          <strong>{activeSchema.category} Shield</strong>
                          <small>100% Claim Assistance</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="id-agent-promo-card">
                <div className="id-agent-left">
                  <span className="id-agent-logo-badge">GOSUBSIDY</span>
                  <h3>Complete Guidance. Zero Commission.</h3>
                </div>
                <div className="id-agent-center">
                  <h4>
                    Expert claim filing & <strong>Government Subsidy Alignment</strong>
                  </h4>
                  <p>Get dedicated support for documentation, renewals & claims.</p>
                </div>
                <button
                  type="button"
                  className="id-agent-btn"
                  onClick={() => alert("Connecting to advisory team...")}
                >
                  Talk to Expert <i className="bi bi-headset"></i>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            SCREEN 3: DYNAMIC COMPARISON SCREEN
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
                        {currentVehicleData.title} <span>|</span> {inputValue.toUpperCase()}
                      </h2>
                      <p className="id-quotes-expiry">
                        Policy Status: <strong>{currentVehicleData.expiryDate}</strong>{" "}
                        <span onClick={() => setShowDetailsModal(true)} className="id-edit-link">
                          Edit Details
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
                    <label>SPECIAL EXTENSION</label>
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
                    <label>ADDITIONAL RIDERS</label>
                    <button
                      type="button"
                      className="id-addons-btn"
                      onClick={() => alert("Displaying all available endorsements & riders...")}
                    >
                      <i className="bi bi-sliders"></i> + Add-ons
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
                            `Recalculated premiums for ${activeSchema.filterConfig.sliderUnit}${sliderValue.toLocaleString("en-IN")}`
                          )
                        }
                      >
                        Update
                      </button>
                      <a href="#idv-help" className="id-idv-help-link">
                        How is this calculated?
                      </a>
                    </div>
                  </div>

                  <div className="id-notice-banner">
                    <i className="bi bi-info-circle-fill"></i>
                    <span>
                      Zero paperwork instant issuance with guaranteed TPA claim settlement.
                    </span>
                  </div>

                  <div className="id-quotes-count">
                    <strong>{activeSchema.plans.length} Verified Plans Found</strong>
                  </div>

                  <div className="id-plans-stack">
                    {activeSchema.plans.map((plan) => (
                      <div className="id-plan-card" key={plan.id}>
                        <div className="id-plan-grid">
                          <div className="id-plan-brand">
                            <div
                              className="id-brand-badge"
                              style={{ backgroundColor: plan.logoColor }}
                            >
                              {plan.logoText}
                            </div>
                            <div>
                              <h4>{plan.insurer}</h4>
                              <small>{plan.planType}</small>
                            </div>
                          </div>

                          <div className="id-plan-stat">
                            <label>{plan.stat1.label}</label>
                            <strong>{plan.stat1.value}</strong>
                          </div>

                          <div className="id-plan-stat">
                            <label>{plan.stat2.label}</label>
                            <strong className="text-success">{plan.stat2.value}</strong>
                          </div>

                          <div className="id-plan-stat">
                            <label>{plan.stat3.label}</label>
                            <strong>
                              {plan.stat3.value} <i className="bi bi-chevron-right small"></i>
                            </strong>
                          </div>

                          <div className="id-plan-stat">
                            <label>{plan.stat4.label}</label>
                            <strong>{plan.stat4.value}</strong>
                          </div>

                          <div className="id-plan-action">
                            <button
                              type="button"
                              className="id-price-btn"
                              onClick={() =>
                                alert(`Proceeding with ${plan.insurer} (${plan.price})...`)
                              }
                            >
                              {plan.price} <i className="bi bi-chevron-right"></i>
                            </button>
                            <span className="id-breakup-link">View Benefits & Breakup</span>
                          </div>
                        </div>

                        <div className="id-plan-card-footer">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="id-benefits-label">SPECIAL BENEFITS:</span>
                            {plan.benefits.map((b, bIdx) => (
                              <span className="id-benefit-chip" key={bIdx}>
                                <i className="bi bi-check2"></i> {b}
                              </span>
                            ))}
                          </div>

                          <label className="id-compare-checkbox">
                            <input type="checkbox" />
                            <span>Add to Compare</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="id-sidebar-widget">
                    <h3>Recommended Add-ons</h3>

                    {activeSchema.addons.map((add, aIdx) => (
                      <div className="id-addon-item" key={aIdx}>
                        <div className="id-addon-icon">
                          <i className="bi bi-shield-plus"></i>
                        </div>
                        <div>
                          <h4>{add.title}</h4>
                          <p>{add.desc}</p>
                        </div>
                        <i className="bi bi-chevron-right ms-auto text-primary"></i>
                      </div>
                    ))}

                    <div className="text-center pt-2">
                      <a href="#all-addons" className="id-link-blue">
                        View All Endorsements
                      </a>
                    </div>
                  </div>

                  <div className="id-sidebar-widget mt-4">
                    <h3>How to Buy Online?</h3>
                    <div className="id-how-step">
                      <div className="id-how-badge step1">Step 1</div>
                      <p>Select a suitable plan by clicking on <strong>'Price'</strong></p>
                    </div>
                    <div className="id-how-step">
                      <div className="id-how-badge step2">Step 2</div>
                      <p>Verify owner and requirement details</p>
                    </div>
                    <div className="id-how-step">
                      <div className="id-how-badge step3">Step 3</div>
                      <p>Make encrypted payment directly to insurer</p>
                    </div>
                    <div className="id-how-step">
                      <div className="id-how-badge step4">Step 4</div>
                      <p>Policy delivered instantly to WhatsApp & Email</p>
                    </div>
                  </div>

                  <div className="id-sidebar-widget mt-4">
                    <h3>Why GoSubsidy Assistance?</h3>
                    <ul className="id-usp-list">
                      <li><i className="bi bi-star-fill text-warning"></i> 145k+ Claims Assisted</li>
                      <li><i className="bi bi-headset text-primary"></i> Dedicated Claim Desk</li>
                      <li><i className="bi bi-file-earmark-check text-success"></i> 100% Digital KYC</li>
                      <li><i className="bi bi-lightning-charge text-danger"></i> Instant E-Policy Delivery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            POPUP MODAL: FETCHED DETAILS
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
                  <h3 className="id-modal-pane-title">Verified Specification</h3>

                  <div className="id-vehicle-box">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="id-maruti-logo"
                        style={{ color: currentVehicleData.logoColor }}
                      >
                        <span>{currentVehicleData.logo}</span>
                      </div>
                      <div>
                        <h4>{currentVehicleData.title}</h4>
                        <strong>{inputValue.toUpperCase()}</strong>
                      </div>
                    </div>

                    <div className="row g-2 id-vehicle-specs-grid">
                      {currentVehicleData.specs.map((sp, sIdx) => (
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
                    Change Info? <i className="bi bi-chevron-right"></i>
                  </div>
                </div>

                <div className="col-lg-6 id-modal-right-pane">
                  <h3 className="id-modal-pane-title">Just one more step to view plans</h3>

                  <form onSubmit={handleProceedToQuotes} className="id-modal-lead-form">
                    <div className="mb-3">
                      <label>
                        Your Full Name <sup>*</sup> <small>(As written in PAN card)</small>
                      </label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label>
                        Mobile <sup>*</sup> <small>(For quotes and policy issuance)</small>
                      </label>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        maxLength="10"
                        value={leadForm.mobile}
                        onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                        required
                      />
                    </div>

                    <p className="id-spam-free-note">
                      Don't worry! We won't spam you with unwanted calls
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
                        Buy policy in ⚡ <strong>30 sec</strong> <a href="#terms">*Terms & Conditions</a>
                      </span>
                    </label>

                    <button type="submit" className="id-modal-view-prices-btn" disabled={isLoading}>
                      {isLoading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Generating Quotes...
                        </span>
                      ) : (
                        <span>
                          View Prices <i className="bi bi-chevron-right"></i>
                        </span>
                      )}
                    </button>

                    <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">Get details on whatsapp</small>
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
                        Policy & Terms<sup>*</sup>
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
          COMPONENT STYLES
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
          color: #e53e3e;
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
          background: #e53e3e;
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
          width: 105px;
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
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 10px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #92400e;
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