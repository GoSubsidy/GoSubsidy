import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/layout/Footer";
import "../styles/SubsidyLoanEMICalculator.css";
import "../styles/SubsidyLoanEMICalculatorAmortization.css";
import "../styles/SubsidyLoanEMICalculatorAmortizationDropdown.css";
import "../styles/SubsidyLoanEMICalculatorAmortizationCollapsible.css";

/* =========================================================
   GoSubsidy - Premium Calculator Dashboard with Moratorium & Subsidy
   ========================================================= */

const CALCULATOR_PROFILES = {
  "subsidy-loan": { 
    title: "Subsidy Loan EMI Calculator", 
    label: "Total Project Cost", 
    defaultRate: 10.5, 
    maxAmt: 100000000, 
    subtitle: "Calculate financing, capital subsidies, moratorium interest capitalization, and repayment schedules for government schemes." 
  },
  "fixed-deposit": { title: "Fixed Deposit Calculator", label: "Total Deposit Amount", defaultRate: 6.5, maxAmt: 50000000, subtitle: "Calculate maturity returns and cumulative interest earned on your Fixed Deposits." },
  "gst": { title: "GST Calculator", label: "Net Amount / Product Price", defaultRate: 18, maxAmt: 10000000, subtitle: "Compute Goods & Services Tax additions or deductions seamlessly." },
  "sip": { title: "SIP Calculator", label: "Monthly Investment Amount", defaultRate: 12, maxAmt: 500000, subtitle: "Estimate compounding wealth accumulation through Mutual Fund SIPs." },
  "daily-sip": { title: "Daily SIP Calculator", label: "Daily Investment Amount", defaultRate: 12, maxAmt: 50000, subtitle: "Calculate returns on daily recurring micro-investments." },
  "personal-loan": { title: "Personal Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 11.5, maxAmt: 5000000, subtitle: "Evaluate personal financing monthly outflows and affordability." },
  "home-loan": { title: "Home Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 8.5, maxAmt: 100000000, subtitle: "Check home loan affordability and plan loan EMIs as per your monthly budget." },
  "business-loan": { title: "Business Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 10.5, maxAmt: 100000000, subtitle: "Plan commercial capital requirements and interest schedules." },
  "gold-loan": { title: "Gold Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 9.0, maxAmt: 5000000, subtitle: "Compute quick financing repayments against gold asset evaluations." },
  "two-wheeler-loan": { title: "Two Wheeler Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 12.0, maxAmt: 500000, subtitle: "Estimate two-wheeler financing terms with ease." },
  "loan-against-property": { title: "Loan Against Property EMI Calculator", label: "Enter Loan Amount", defaultRate: 9.8, maxAmt: 100000000, subtitle: "Calculate high-value asset-backed loan amortizations." },
  "term-loan": { title: "Term Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 11.0, maxAmt: 50000000, subtitle: "Determine scheduled corporate loan repayment obligations." },
  "tractor-loan": { title: "Tractor Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 12.5, maxAmt: 2000000, subtitle: "Agricultural machinery financing and tractor EMI breakdowns." },
  "mudra-loan": { title: "Mudra Loan EMI Calculator", label: "Enter Loan Amount", defaultRate: 8.2, maxAmt: 1000000, subtitle: "Micro-enterprise financing calculations under government frameworks." },
  "personal-eligibility": { title: "Personal Loan Eligibility Calculator", label: "Monthly Net Income", defaultRate: 11.5, maxAmt: 500000, subtitle: "Check maximum borrowing power based on net monthly earnings." },
  "home-eligibility": { title: "Home Loan Eligibility Calculator", label: "Monthly Net Income", defaultRate: 8.5, maxAmt: 1000000, subtitle: "Assess housing loan qualification criteria and credit limits." },
  "home-prepayment": { title: "Home Loan Prepayment Calculator", label: "Outstanding Loan Amount", defaultRate: 8.5, maxAmt: 100000000, subtitle: "Calculate interest savings through early housing loan prepayments." },
  "personal-prepayment": { title: "Personal Loan Prepayment Calculator", label: "Outstanding Loan Amount", defaultRate: 11.5, maxAmt: 5000000, subtitle: "Compute financial benefits of clearing personal debt ahead of time." },
};

const TOP_BANKS = [
  { id: "hdfc", name: "HDFC Bank", rate: 10.5 },
  { id: "icici", name: "ICICI Bank", rate: 11.0 },
  { id: "axis", name: "Axis Bank", rate: 10.8 },
  { id: "sbi", name: "SBI Bank", rate: 9.5 },
];

const MORE_BANKS = [
  { id: "kotak", name: "Kotak Mahindra", rate: 11.2 },
  { id: "bajaj", name: "Bajaj Finserv", rate: 13.0 },
  { id: "tata", name: "Tata Capital", rate: 11.5 },
  { id: "aditya", name: "Aditya Birla Capital", rate: 12.0 },
  { id: "muthoot", name: "Muthoot Finance", rate: 14.0 },
  { id: "pnb", name: "Punjab National Bank", rate: 9.8 },
  { id: "bob", name: "Bank of Baroda", rate: 9.7 },
  { id: "idfc", name: "IDFC First Bank", rate: 11.0 },
];

const AMOUNT_PRESETS = [
  { label: "₹50L", value: 5000000 },
  { label: "₹80L", value: 8000000 },
  { label: "₹1Cr", value: 10000000 },
  { label: "₹5Cr", value: 50000000 },
  { label: "₹10Cr", value: 100000000 },
];

export default function SubsidyLoanEMICalculator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { calcId: routeCalcId } = useParams();

  // Explicit calculator routes such as /calculators/home-loan do not provide
  // a :calcId URL param. Resolve the calculator from the actual pathname too.
  const pathCalcId =
    location.pathname.startsWith("/calculators/")
      ? location.pathname.split("/").filter(Boolean).pop()
      : location.pathname === "/subsidy-loan-emi-calculator"
        ? "subsidy-loan"
        : null;

  const calcId =
    routeCalcId ||
    pathCalcId ||
    "subsidy-loan";

  const profile =
    CALCULATOR_PROFILES[calcId] ||
    CALCULATOR_PROFILES["subsidy-loan"];

  const isSubsidyMode = calcId === "subsidy-loan";

  const [selectedBank, setSelectedBank] = useState("hdfc");
  const [amount, setAmount] = useState(10000000);
  const [interestRate, setInterestRate] = useState(profile.defaultRate);
  const [subsidyPercent, setSubsidyPercent] = useState(25);
  const [ownContributionPercent, setOwnContributionPercent] = useState(10);
  const [moratoriumMonths, setMoratoriumMonths] = useState(6);
  const [tenureType, setTenureType] = useState("Yr");
  const [tenure, setTenure] = useState(10);
  const [showMorePartners, setShowMorePartners] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scheduleView, setScheduleView] = useState("monthly");
  const [isAmortizationOpen, setIsAmortizationOpen] = useState(false);

  // Keep the selected rate/profile synchronized when the user moves between
  // calculator links without a full page reload.
  useEffect(() => {
    setInterestRate(profile.defaultRate);
    setShowMorePartners(false);
    setIsExpanded(false);

    // Keep the amount valid for the selected calculator.
    setAmount((current) => Math.min(Math.max(100000, current), profile.maxAmt));
  }, [calcId, profile.defaultRate, profile.maxAmt]);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const handleBankSelect = (bankId, rate) => {
    setSelectedBank(bankId);
    setInterestRate(rate);
  };

  const calculations = useMemo(() => {
    const cost = Math.max(0, Number(amount) || 0);
    const annualRate = Math.max(0, Number(interestRate) || 0);
    const months = tenureType === "Yr" ? Math.max(1, Number(tenure) * 12) : Math.max(1, Number(tenure));
    const monthlyRate = annualRate / 12 / 100;
    const moratorium = isSubsidyMode ? Math.max(0, Number(moratoriumMonths) || 0) : 0;

    let initialLoan = cost;
    let subsidyAmt = 0;
    let ownContributionAmt = 0;

    if (isSubsidyMode) {
      subsidyAmt = cost * (Math.min(100, Math.max(0, subsidyPercent)) / 100);
      ownContributionAmt = cost * (Math.min(100, Math.max(0, ownContributionPercent)) / 100);
      initialLoan = Math.max(0, cost - subsidyAmt - ownContributionAmt);
    }

    if (calcId === "gst") {
      const gstAmt = cost * (annualRate / 100);
      return {
        principal: cost,
        emi: gstAmt,
        totalInterest: gstAmt,
        totalAmount: cost + gstAmt,
        subsidyAmt,
        ownContributionAmt,
        moratoriumInterest: 0,
        months: 0,
      };
    }

    // Moratorium Interest Calculation (Capitalized into principal)
    let balanceAfterMoratorium = initialLoan;
    let moratoriumInterest = 0;

    for (let m = 1; m <= moratorium; m++) {
      const interest = balanceAfterMoratorium * monthlyRate;
      moratoriumInterest += interest;
      balanceAfterMoratorium += interest;
    }

    let computedEMI = 0;
    let totalInterest = moratoriumInterest;
    let totalAmount = initialLoan + moratoriumInterest;

    if (balanceAfterMoratorium > 0 && months > 0) {
      if (monthlyRate === 0) {
        computedEMI = balanceAfterMoratorium / months;
      } else {
        const factor = Math.pow(1 + monthlyRate, months);
        computedEMI = (balanceAfterMoratorium * monthlyRate * factor) / (factor - 1);
      }
      const repaymentTotal = computedEMI * months;
      totalInterest += Math.max(0, repaymentTotal - balanceAfterMoratorium);
      totalAmount = initialLoan + totalInterest;
    }

    return { 
      principal: initialLoan, 
      subsidyAmt, 
      ownContributionAmt, 
      moratoriumInterest,
      balanceAfterMoratorium,
      months, 
      emi: computedEMI, 
      totalInterest, 
      totalAmount 
    };
  }, [amount, interestRate, subsidyPercent, ownContributionPercent, moratoriumMonths, tenure, tenureType, calcId, isSubsidyMode]);

  /* =========================================================
     AMORTIZATION SCHEDULE
     Monthly / Quarterly / Yearly views for every calculator.
     Existing EMI calculations above are preserved.
  ========================================================= */
  const amortization = useMemo(() => {
    const principal = Math.max(0, Number(calculations.principal) || 0);
    const annualRate = Math.max(0, Number(interestRate) || 0);
    const monthlyRate = annualRate / 12 / 100;
    const months = Math.max(1, Number(calculations.months) || 1);
    const moratorium = isSubsidyMode
      ? Math.max(0, Number(moratoriumMonths) || 0)
      : 0;

    const rows = [];
    let balance = principal;

    // Moratorium rows: interest accrues and is capitalized.
    for (let month = 1; month <= moratorium; month += 1) {
      const opening = balance;
      const interest = opening * monthlyRate;
      const closing = opening + interest;

      rows.push({
        period: month,
        month,
        phase: "Moratorium",
        opening,
        payment: 0,
        principal: 0,
        interest,
        closing,
      });

      balance = closing;
    }

    // Recalculate repayment EMI from the post-moratorium balance so
    // the schedule always reconciles with the displayed loan structure.
    const repaymentMonths = months;
    let emi = 0;

    if (balance > 0) {
      if (monthlyRate === 0) {
        emi = balance / repaymentMonths;
      } else {
        const factor = Math.pow(1 + monthlyRate, repaymentMonths);
        emi = (balance * monthlyRate * factor) / (factor - 1);
      }
    }

    for (let repaymentMonth = 1; repaymentMonth <= repaymentMonths; repaymentMonth += 1) {
      const month = moratorium + repaymentMonth;
      const opening = balance;
      const interest = opening * monthlyRate;
      let principalPaid = emi - interest;

      if (principalPaid < 0) principalPaid = 0;
      if (principalPaid > opening) principalPaid = opening;

      const payment = principalPaid + interest;
      let closing = opening - principalPaid;
      if (closing < 0.01) closing = 0;

      rows.push({
        period: month,
        month,
        phase: "Repayment",
        opening,
        payment,
        principal: principalPaid,
        interest,
        closing,
      });

      balance = closing;
    }

    const monthlyRows = rows.map((row) => ({ ...row }));

    // Aggregate monthly rows into quarters.
    const quarterlyRows = [];
    for (let i = 0; i < monthlyRows.length; i += 3) {
      const group = monthlyRows.slice(i, i + 3);
      if (!group.length) continue;
      quarterlyRows.push({
        period: Math.floor((group[0].month - 1) / 3) + 1,
        label: `Q${Math.floor((group[0].month - 1) / 3) + 1}`,
        phase: group.every((r) => r.phase === "Moratorium")
          ? "Moratorium"
          : group.some((r) => r.phase === "Moratorium")
            ? "Moratorium + Repayment"
            : "Repayment",
        opening: group[0].opening,
        payment: group.reduce((s, r) => s + r.payment, 0),
        principal: group.reduce((s, r) => s + r.principal, 0),
        interest: group.reduce((s, r) => s + r.interest, 0),
        closing: group[group.length - 1].closing,
        months: group.length,
      });
    }

    // Aggregate monthly rows into calendar years.
    const yearlyRows = [];
    const yearMap = new Map();

    monthlyRows.forEach((row) => {
      const year = Math.ceil(row.month / 12);
      if (!yearMap.has(year)) yearMap.set(year, []);
      yearMap.get(year).push(row);
    });

    yearMap.forEach((group, year) => {
      yearlyRows.push({
        period: year,
        label: `Year ${year}`,
        phase: group.every((r) => r.phase === "Moratorium")
          ? "Moratorium"
          : group.some((r) => r.phase === "Moratorium")
            ? "Moratorium + Repayment"
            : "Repayment",
        opening: group[0].opening,
        payment: group.reduce((s, r) => s + r.payment, 0),
        principal: group.reduce((s, r) => s + r.principal, 0),
        interest: group.reduce((s, r) => s + r.interest, 0),
        closing: group[group.length - 1].closing,
        months: group.length,
      });
    });

    return { monthlyRows, quarterlyRows, yearlyRows };
  }, [calculations, interestRate, moratoriumMonths, isSubsidyMode]);

  const activeScheduleRows =
    scheduleView === "quarterly"
      ? amortization.quarterlyRows
      : scheduleView === "yearly"
        ? amortization.yearlyRows
        : amortization.monthlyRows;

  return (
    <div className="premium-calc-root">
      <main className="premium-calc-main">
        <div className="premium-calc-container">
          
          {/* Header Section */}
          <div className="premium-header">
            <h1 className="premium-title">{profile.title}</h1>
            <p className="premium-subtitle">
              {profile.subtitle} {profile.title} is an online financial tool that helps entrepreneurs and applicants check project finance structuring, capital subsidies, moratorium capitalization, and loan eligibility before formal application. <span className="premium-readmore" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? " Read less" : " ...Read more"}</span>
              
              {isExpanded && (
                <span className="d-block mt-2">
                  Government schemes often offer capital investment subsidies and moratorium periods where EMI payments are deferred while interest accrues and capitalizes. This tool computes both seamlessly.
                </span>
              )}
            </p>
          </div>

          {/* Main Dashboard Box */}
          <div className="premium-card-grid">
            
            {/* Left Control Panel */}
            <div className="premium-inputs-panel">
              <h3 className="premium-panel-heading">Calculate your {profile.title} Online</h3>

              {/* Bank Selector Chips */}
              <div className="premium-group">
                <label className="premium-label">Select Financing Bank / Institution</label>
                <div className="premium-chips-row">
                  {TOP_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      className={`premium-bank-btn ${selectedBank === bank.id ? "active" : ""}`}
                      onClick={() => handleBankSelect(bank.id, bank.rate)}
                    >
                      <span className="bank-dot" />
                      {bank.name}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    className={`premium-bank-btn more-btn ${showMorePartners ? "active" : ""}`}
                    onClick={() => setShowMorePartners(!showMorePartners)}
                  >
                    + More
                  </button>
                </div>

                {showMorePartners && (
                  <div className="premium-more-dropdown">
                    {MORE_BANKS.map((partner) => (
                      <button
                        key={partner.id}
                        type="button"
                        className={`more-chip ${selectedBank === partner.id ? "active" : ""}`}
                        onClick={() => handleBankSelect(partner.id, partner.rate)}
                      >
                        <strong>{partner.name}</strong>
                        <span>{partner.rate}% p.a.</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount Input & Presets */}
              <div className="premium-group">
                <div className="premium-label-row">
                  <label className="premium-label">{profile.label}</label>
                  <div className="premium-num-box">
                    <span>₹</span>
                    <input
                      type="text"
                      value={amount.toLocaleString("en-IN")}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (!isNaN(raw)) setAmount(Number(raw));
                      }}
                    />
                  </div>
                </div>

                <input
                  type="range"
                  className="premium-range"
                  min="100000"
                  max={profile.maxAmt}
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />

                <div className="premium-presets">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      className={`preset-pill ${amount === preset.value ? "active" : ""}`}
                      onClick={() => setAmount(preset.value)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="premium-limits">
                  <span>1L</span>
                  <span>10Cr</span>
                </div>
              </div>

              {/* Subsidy, Contribution & Moratorium Inputs (Subsidy Loan Mode) */}
              {isSubsidyMode && (
                <>
                  <div className="premium-split-row mb-3">
                    <div className="premium-subbox">
                      <div className="subbox-header">
                        <span className="subbox-title">Subsidy (%)</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="subbox-numinput"
                          value={subsidyPercent}
                          onChange={(e) => setSubsidyPercent(Number(e.target.value))}
                        />
                      </div>
                      <small className="text-muted d-block mt-1">Amount: {money(calculations.subsidyAmt)}</small>
                    </div>

                    <div className="premium-subbox">
                      <div className="subbox-header">
                        <span className="subbox-title">Promoter Contrib. (%)</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="subbox-numinput"
                          value={ownContributionPercent}
                          onChange={(e) => setOwnContributionPercent(Number(e.target.value))}
                        />
                      </div>
                      <small className="text-muted d-block mt-1">Amount: {money(calculations.ownContributionAmt)}</small>
                    </div>
                  </div>

                  <div className="premium-group mb-3">
                    <div className="subbox-header mb-1">
                      <label className="premium-label mb-0">Moratorium Period (Months)</label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        className="subbox-numinput"
                        value={moratoriumMonths}
                        onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                      />
                    </div>
                    <small className="text-muted">Interest during moratorium is capitalized into loan principal.</small>
                  </div>
                </>
              )}

              {/* Bottom Split Row: Interest Rate & Tenure */}
              <div className="premium-split-row">
                <div className="premium-subbox">
                  <div className="subbox-header">
                    <span className="subbox-title">Rate of Interest <i>(Yearly %)</i></span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="30"
                      className="subbox-numinput"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>
                  <input
                    type="range"
                    className="premium-range sub-range"
                    min="5"
                    max="30"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                  <div className="premium-limits">
                    <span>6%</span>
                    <span>30%</span>
                  </div>
                </div>

                <div className="premium-subbox">
                  <div className="subbox-header">
                    <span className="subbox-title">Loan Tenure</span>
                    <div className="tenure-controls">
                      <input
                        type="number"
                        min="1"
                        max={tenureType === "Yr" ? 30 : 360}
                        className="subbox-numinput tenure-input"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                      />
                      <div className="tenure-toggle">
                        <button
                          type="button"
                          className={tenureType === "Mo" ? "active" : ""}
                          onClick={() => { setTenureType("Mo"); if (tenure > 30) setTenure(120); }}
                        >
                          Mo
                        </button>
                        <button
                          type="button"
                          className={tenureType === "Yr" ? "active" : ""}
                          onClick={() => { setTenureType("Yr"); if (tenure > 30) setTenure(10); }}
                        >
                          Yr
                        </button>
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="premium-range sub-range"
                    min="1"
                    max={tenureType === "Yr" ? 30 : 360}
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                  />
                  <div className="premium-limits">
                    <span>{tenureType === "Yr" ? "1Y" : "1M"}</span>
                    <span>{tenureType === "Yr" ? "30Y" : "360M"}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Summary Panel */}
            <div className="premium-summary-panel">
              <div className="summary-card-inner">
                
                <div className="summary-top-box">
                  <span className="summary-title">Your Monthly EMI Payment</span>
                  <h2 className="summary-amount">{money(calculations.emi)}</h2>
                  {isSubsidyMode && moratoriumMonths > 0 && (
                    <small className="text-info d-block mt-1" style={{ fontSize: "11px" }}>
                      *Starts after {moratoriumMonths} mos moratorium
                    </small>
                  )}
                </div>

                <div className="summary-breakdown">
                  {isSubsidyMode && (
                    <>
                      <div className="breakdown-row">
                        <span>Total Project Cost</span>
                        <strong>{money(amount)}</strong>
                      </div>
                      <div className="breakdown-row text-success">
                        <span>Estimated Subsidy</span>
                        <strong>- {money(calculations.subsidyAmt)}</strong>
                      </div>
                      <div className="breakdown-row">
                        <span>Own Contribution</span>
                        <strong>- {money(calculations.ownContributionAmt)}</strong>
                      </div>
                    </>
                  )}
                  <div className="breakdown-row">
                    <span>Net Bank Loan</span>
                    <strong>{money(calculations.principal)}</strong>
                  </div>
                  {isSubsidyMode && moratoriumMonths > 0 && (
                    <div className="breakdown-row text-warning">
                      <span>Moratorium Interest</span>
                      <strong>+ {money(calculations.moratoriumInterest)}</strong>
                    </div>
                  )}
                  <div className="breakdown-row dashed">
                    <span>Total Interest</span>
                    <strong>{money(calculations.totalInterest)}</strong>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total Payable</span>
                    <strong>{money(calculations.totalAmount)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="premium-apply-btn"
                  onClick={() => navigate("/loans")}
                >
                  Apply For Subsidy Loan <i className="bi bi-arrow-right ms-2" />
                </button>

              </div>
            </div>

          </div>


        </div>

        {/* ==================================================
            AMORTIZATION SCHEDULE
            Available for every calculator: Monthly / Quarterly / Yearly
        ================================================== */}
        <section className={`premium-amortization-card ${isAmortizationOpen ? "is-open" : "is-closed"}`}>
          <button
            type="button"
            className="premium-amortization-toggle"
            onClick={() => setIsAmortizationOpen((open) => !open)}
            aria-expanded={isAmortizationOpen}
            aria-controls="loan-amortization-content"
          >
            <span className="premium-amortization-toggle-left">
              <span className="premium-amortization-toggle-icon">
                <i className="bi bi-calendar2-range" />
              </span>
              <span>
                <strong>Loan Amortization Schedule</strong>
                <small>Monthly, quarterly and yearly repayment schedule</small>
              </span>
            </span>
            <span className="premium-amortization-toggle-right">
              <span>{isAmortizationOpen ? "Close" : "Open"}</span>
              <i className={`bi ${isAmortizationOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
            </span>
          </button>

          {isAmortizationOpen && (
            <div id="loan-amortization-content" className="premium-amortization-content">
              <div className="premium-amortization-header">
                <div>
                  <span className="premium-amortization-eyebrow">
                    <i className="bi bi-bar-chart-fill" /> REPAYMENT SCHEDULE
                  </span>
                  <p>
                    Track opening balance, payment, principal, interest and closing
                    balance in monthly, quarterly or yearly view.
                  </p>
                </div>

                <div className="premium-amortization-select-wrap">
                  <label htmlFor="amortization-view">Schedule View</label>
                  <select
                    id="amortization-view"
                    className="premium-amortization-select"
                    value={scheduleView}
                    onChange={(e) => setScheduleView(e.target.value)}
                  >
                    <option value="monthly">Monthly Amortization</option>
                    <option value="quarterly">Quarterly Amortization</option>
                    <option value="yearly">Yearly Amortization</option>
                  </select>
                </div>
              </div>

              <div className="premium-amortization-summary">
            <div>
              <span>Loan Principal</span>
              <strong>{money(calculations.principal)}</strong>
            </div>
            <div>
              <span>Monthly EMI</span>
              <strong>{money(calculations.emi)}</strong>
            </div>
            <div>
              <span>Total Interest</span>
              <strong>{money(calculations.totalInterest)}</strong>
            </div>
            <div>
              <span>Total Payable</span>
              <strong>{money(calculations.totalAmount)}</strong>
            </div>
          </div>

          <div className="premium-amortization-table-wrap">
            <table className="premium-amortization-table">
              <thead>
                <tr>
                  <th>{scheduleView === "monthly" ? "Month" : scheduleView === "quarterly" ? "Quarter" : "Year"}</th>
                  <th>Phase</th>
                  <th>Opening Balance</th>
                  <th>{scheduleView === "monthly" ? "EMI" : "Payment"}</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {activeScheduleRows.map((row) => (
                  <tr key={`${scheduleView}-${row.period}`}>
                    <th>
                      {scheduleView === "monthly"
                        ? `Month ${row.period}`
                        : scheduleView === "quarterly"
                          ? row.label
                          : row.label}
                    </th>
                    <td>
                      <span
                        className={`premium-phase-badge ${
                          row.phase === "Repayment" ? "repayment" : "moratorium"
                        }`}
                      >
                        {row.phase}
                      </span>
                    </td>
                    <td>{money(row.opening)}</td>
                    <td className="premium-table-strong">{money(row.payment)}</td>
                    <td className="premium-table-positive">{money(row.principal)}</td>
                    <td>{money(row.interest)}</td>
                    <td className="premium-table-strong">{money(row.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="premium-amortization-note">
            <i className="bi bi-info-circle" />
            <span>
              {scheduleView === "monthly"
                ? `Showing ${activeScheduleRows.length} monthly periods.`
                : scheduleView === "quarterly"
                  ? `Showing ${activeScheduleRows.length} quarterly periods.`
                  : `Showing ${activeScheduleRows.length} yearly periods.`}
              {isSubsidyMode && moratoriumMonths > 0
                ? " Moratorium interest is capitalized into the outstanding balance before repayment."
                : " No moratorium capitalization is applied for this calculator."}
            </span>
          </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}