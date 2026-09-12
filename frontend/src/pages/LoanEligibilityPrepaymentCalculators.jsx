import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import "../styles/LoanEligibilityPrepaymentCalculators.css";

/*
 * GoSubsidy Eligibility & Prepayment Calculators
 * Inspired by the visual information architecture in the supplied
 * reference screenshots, while using original GoSubsidy content/branding.
 */

const CONFIG = {
  "personal-eligibility": {
    title: "Personal Loan Eligibility Calculator",
    subtitle:
      "Check your maximum borrowing power based on monthly income, existing EMIs, interest rate and tenure.",
    type: "eligibility",
    loanDefault: 200000,
    incomeDefault: 40000,
    existingEmiDefault: 10000,
    rateDefault: 10,
    tenureDefault: 3,
  },
  "home-eligibility": {
    title: "Home Loan Eligibility Calculator",
    subtitle:
      "Estimate your home loan eligibility using income, existing obligations, interest rate and repayment tenure.",
    type: "eligibility",
    loanDefault: 2000000,
    incomeDefault: 75000,
    existingEmiDefault: 15000,
    rateDefault: 8.5,
    tenureDefault: 20,
  },
  "home-prepayment": {
    title: "Home Loan Prepayment Calculator",
    subtitle:
      "Estimate interest savings and the impact of making a lump-sum prepayment on your home loan.",
    type: "prepayment",
    loanDefault: 3000000,
    rateDefault: 8.5,
    tenureDefault: 15,
    prepaymentDefault: 500000,
  },
  "personal-prepayment": {
    title: "Personal Loan Prepayment Calculator",
    subtitle:
      "Estimate interest savings when you repay part of your outstanding personal loan early.",
    type: "prepayment",
    loanDefault: 500000,
    rateDefault: 11.5,
    tenureDefault: 4,
    prepaymentDefault: 100000,
  },
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function emiFor(principal, annualRate, months) {
  const p = Math.max(0, Number(principal) || 0);
  const n = Math.max(1, Number(months) || 1);
  const r = Math.max(0, Number(annualRate) || 0) / 12 / 100;
  if (!p) return 0;
  if (!r) return p / n;
  const factor = Math.pow(1 + r, n);
  return (p * r * factor) / (factor - 1);
}

function loanFromEmi(emi, annualRate, months) {
  const e = Math.max(0, Number(emi) || 0);
  const n = Math.max(1, Number(months) || 1);
  const r = Math.max(0, Number(annualRate) || 0) / 12 / 100;
  if (!e) return 0;
  if (!r) return e * n;
  const factor = Math.pow(1 + r, n);
  return e * (factor - 1) / (r * factor);
}

function formatShort(value) {
  const v = Math.max(0, Number(value) || 0);
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${Math.round(v)}`;
}

export default function LoanEligibilityPrepaymentCalculators() {
  const location = useLocation();
  const key = location.pathname.split("/").filter(Boolean).pop() || "personal-eligibility";
  const config = CONFIG[key] || CONFIG["personal-eligibility"];

  const [age, setAge] = useState(29);
  const [loanAmount, setLoanAmount] = useState(config.loanDefault);
  const [interestRate, setInterestRate] = useState(config.rateDefault);
  const [tenure, setTenure] = useState(config.tenureDefault);
  const [income, setIncome] = useState(config.incomeDefault);
  const [existingEmi, setExistingEmi] = useState(config.existingEmiDefault);
  const [prepayment, setPrepayment] = useState(config.prepaymentDefault);
  const [prepaymentMonth, setPrepaymentMonth] = useState(12);
  const [prepaymentMode, setPrepaymentMode] = useState("tenure");

  const eligibility = useMemo(() => {
    const monthlyIncome = Math.max(0, Number(income) || 0);
    const currentEmi = Math.max(0, Number(existingEmi) || 0);
    const rate = Math.max(0, Number(interestRate) || 0);
    const years = Math.max(1, Number(tenure) || 1);
    const months = years * 12;

    // Illustrative affordability rule: 50% of monthly income less existing EMIs.
    const maxAffordableEmi = Math.max(0, monthlyIncome * 0.5 - currentEmi);
    const eligibleLoan = loanFromEmi(maxAffordableEmi, rate, months);
    const requested = Math.max(0, Number(loanAmount) || 0);
    const approved = Math.min(requested, eligibleLoan);
    const estimatedEmi = emiFor(approved, rate, months);

    return {
      maxAffordableEmi,
      eligibleLoan,
      approved,
      estimatedEmi,
      months,
    };
  }, [income, existingEmi, interestRate, tenure, loanAmount]);

  const prepay = useMemo(() => {
    const outstanding = Math.max(0, Number(loanAmount) || 0);
    const rate = Math.max(0, Number(interestRate) || 0);
    const years = Math.max(1, Number(tenure) || 1);
    const totalMonths = years * 12;
    const month = Math.min(
      Math.max(1, Number(prepaymentMonth) || 1),
      Math.max(1, totalMonths - 1)
    );
    const lump = Math.min(
      Math.max(0, Number(prepayment) || 0),
      outstanding
    );

    const originalEmi = emiFor(outstanding, rate, totalMonths);
    const remainingMonths = Math.max(1, totalMonths - month);

    let balanceAtPrepayment = outstanding;
    const r = rate / 12 / 100;

    for (let m = 1; m <= month; m += 1) {
      const interest = balanceAtPrepayment * r;
      const principalPaid = Math.min(
        balanceAtPrepayment,
        Math.max(0, originalEmi - interest)
      );
      balanceAtPrepayment = Math.max(0, balanceAtPrepayment - principalPaid);
    }

    const actualPrepayment = Math.min(lump, balanceAtPrepayment);
    const revisedBalance = Math.max(0, balanceAtPrepayment - actualPrepayment);
    const revisedEmi = emiFor(revisedBalance, rate, remainingMonths);

    const originalRemainingInterest =
      Math.max(0, originalEmi * remainingMonths - balanceAtPrepayment);

    let revisedTenure = remainingMonths;
    if (revisedBalance > 0 && originalEmi > 0) {
      if (r === 0) {
        revisedTenure = Math.ceil(revisedBalance / originalEmi);
      } else {
        const n = -Math.log(1 - (r * revisedBalance) / originalEmi) / Math.log(1 + r);
        revisedTenure = Math.max(1, Math.ceil(n));
      }
    }

    const tenureSaved =
      prepaymentMode === "tenure"
        ? Math.max(0, remainingMonths - revisedTenure)
        : 0;

    const newInterestForTenureReduction =
      prepaymentMode === "tenure"
        ? Math.max(0, originalEmi * revisedTenure - revisedBalance)
        : Math.max(0, revisedEmi * remainingMonths - revisedBalance);

    const interestSaved = Math.max(
      0,
      originalRemainingInterest - newInterestForTenureReduction
    );

    return {
      originalEmi,
      balanceAtPrepayment,
      actualPrepayment,
      revisedBalance,
      revisedEmi,
      remainingMonths,
      revisedTenure,
      tenureSaved,
      interestSaved,
      originalRemainingInterest,
    };
  }, [loanAmount, interestRate, tenure, prepayment, prepaymentMonth, prepaymentMode]);

  const isEligibility = config.type === "eligibility";

  return (
    <>
      <main className="gs-refcalc-page">
        <div className="gs-refcalc-shell">
          <section className="gs-refcalc-intro">
            <div className="gs-refcalc-breadcrumb">
              Home <span>/</span> Loans <span>/</span> {config.title}
            </div>
            <h1>{config.title}</h1>
            <p>{config.subtitle} <button type="button">...Read more</button></p>
          </section>

          {isEligibility ? (
            <EligibilityCalculator
              config={config}
              age={age}
              setAge={setAge}
              loanAmount={loanAmount}
              setLoanAmount={setLoanAmount}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              tenure={tenure}
              setTenure={setTenure}
              income={income}
              setIncome={setIncome}
              existingEmi={existingEmi}
              setExistingEmi={setExistingEmi}
              result={eligibility}
              money={money}
              formatShort={formatShort}
            />
          ) : (
            <PrepaymentCalculator
              config={config}
              loanAmount={loanAmount}
              setLoanAmount={setLoanAmount}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              tenure={tenure}
              setTenure={setTenure}
              prepayment={prepayment}
              setPrepayment={setPrepayment}
              prepaymentMonth={prepaymentMonth}
              setPrepaymentMonth={setPrepaymentMonth}
              prepaymentMode={prepaymentMode}
              setPrepaymentMode={setPrepaymentMode}
              result={prepay}
              money={money}
              formatShort={formatShort}
            />
          )}

          <section className="gs-refcalc-below">
            <div className="gs-refcalc-below-main">
              <div className="gs-refcalc-eyebrow">GOSUBSIDY CALCULATOR GUIDE</div>
              <h2>
                {isEligibility
                  ? `What is ${config.title}?`
                  : `How ${config.title} works`}
              </h2>
              <p>
                {isEligibility
                  ? "Use this calculator to understand an indicative borrowing range before approaching a lender. Your final eligibility depends on lender policies, income verification, credit profile and other applicable criteria."
                  : "Use this calculator to understand how an early lump-sum payment can affect interest cost and repayment duration. Actual savings depend on lender terms, charges and the timing of the payment."}
              </p>
              <div className="gs-refcalc-guide-grid">
                <GuideCard icon="bi-calculator" title="Instant calculation" text="Change any input and see the result update immediately." />
                <GuideCard icon="bi-bank" title="Loan planning" text="Compare affordability and repayment outcomes before applying." />
                <GuideCard icon="bi-graph-up" title="Clear breakdown" text="See principal, interest, EMI and savings in one place." />
              </div>
            </div>

            <aside className="gs-refcalc-trust">
              <div className="gs-refcalc-trust-icon"><i className="bi bi-shield-check" /></div>
              <h3>GoSubsidy Financial Intelligence</h3>
              <p>Simple tools for smarter loan planning and government-support decisions.</p>
              <div className="gs-refcalc-trust-row"><i className="bi bi-check-circle-fill" /> Transparent calculations</div>
              <div className="gs-refcalc-trust-row"><i className="bi bi-check-circle-fill" /> Mobile-friendly design</div>
              <div className="gs-refcalc-trust-row"><i className="bi bi-check-circle-fill" /> Indicative results</div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function EligibilityCalculator({
  config, age, setAge, loanAmount, setLoanAmount, interestRate, setInterestRate,
  tenure, setTenure, income, setIncome, existingEmi, setExistingEmi,
  result, money, formatShort
}) {
  const eligibleRatio = Math.min(
    100,
    Math.max(0, (result.approved / Math.max(1, loanAmount)) * 100)
  );

  return (
    <section className="gs-refcalc-card">
      <div className="gs-refcalc-input-side">
        <div className="gs-refcalc-card-title">
          <h2>Check {config.title.replace(" Calculator", "")} Online</h2>
          <span className="gs-refcalc-live"><i className="bi bi-lightning-charge-fill" /> Live</span>
        </div>

        <div className="gs-refcalc-fields-grid">
          <RangeField label="Age" value={age} min={18} max={70} suffix="Yrs" onChange={setAge} />
          <RangeField label="Desired Loan Amount" value={loanAmount} min={50000} max={config.title.startsWith("Home") ? 10000000 : 5000000} suffix="₹" onChange={setLoanAmount} />
          <RangeField label="Rate of Interest (Yearly)" value={interestRate} min={6} max={30} suffix="%" step="0.1" onChange={setInterestRate} />
          <RangeField label="Loan Tenure" value={tenure} min={1} max={30} suffix="Yrs" onChange={setTenure} />
          <RangeField label="Monthly Income" value={income} min={20000} max={500000} suffix="₹" onChange={setIncome} />
          <RangeField label="Existing Monthly EMI" value={existingEmi} min={0} max={100000} suffix="₹" onChange={setExistingEmi} />
        </div>

        <div className="gs-refcalc-disclaimer">
          <i className="bi bi-info-circle" />
          Results are indicative and based on the inputs and assumptions shown. Final eligibility is determined by the lender.
        </div>
      </div>

      <div className="gs-refcalc-result-side">
        <div className="gs-result-title">Results</div>
        <div
          className="gs-result-donut"
          style={{ "--eligible": `${eligibleRatio}%` }}
        >
          <div className="gs-result-donut-inner">
            <span>Eligible for</span>
            <strong>{money(result.approved)}</strong>
          </div>
        </div>

        <div className="gs-result-lines">
          <ResultLine label="Estimated EMI" value={money(result.estimatedEmi)} />
          <ResultLine label="Maximum affordable EMI" value={money(result.maxAffordableEmi)} />
          <ResultLine label="Eligible Tenure" value={`${tenure} Years`} />
        </div>

        <button type="button" className="gs-refcalc-apply">
          Apply Now <i className="bi bi-arrow-right" />
        </button>
      </div>
    </section>
  );
}

function PrepaymentCalculator({
  config, loanAmount, setLoanAmount, interestRate, setInterestRate, tenure, setTenure,
  prepayment, setPrepayment, prepaymentMonth, setPrepaymentMonth,
  prepaymentMode, setPrepaymentMode, result, money, formatShort
}) {
  const savingPercent = Math.min(
    100,
    Math.max(
      0,
      (result.interestSaved /
        Math.max(1, result.originalRemainingInterest)) *
        100
    )
  );

  return (
    <section className="gs-refcalc-card">
      <div className="gs-refcalc-input-side">
        <div className="gs-refcalc-card-title">
          <h2>Calculate your {config.title.replace(" Calculator", "")} Online</h2>
          <span className="gs-refcalc-live"><i className="bi bi-lightning-charge-fill" /> Live</span>
        </div>

        <div className="gs-refcalc-fields-grid">
          <RangeField label="Outstanding Loan Amount" value={loanAmount} min={100000} max={config.title.startsWith("Home") ? 100000000 : 5000000} suffix="₹" onChange={setLoanAmount} />
          <RangeField label="Rate of Interest (Yearly)" value={interestRate} min={6} max={30} suffix="%" step="0.1" onChange={setInterestRate} />
          <RangeField label="Remaining Loan Tenure" value={tenure} min={1} max={30} suffix="Yrs" onChange={setTenure} />
          <RangeField label="Prepayment Amount" value={prepayment} min={0} max={loanAmount} suffix="₹" onChange={setPrepayment} />
          <RangeField label="Prepayment After" value={prepaymentMonth} min={1} max={Math.max(1, tenure * 12 - 1)} suffix="Months" onChange={setPrepaymentMonth} />
        </div>

        <div className="gs-prepay-mode">
          <span>After prepayment, I want to</span>
          <button type="button" className={prepaymentMode === "tenure" ? "active" : ""} onClick={() => setPrepaymentMode("tenure")}>Reduce Tenure</button>
          <button type="button" className={prepaymentMode === "emi" ? "active" : ""} onClick={() => setPrepaymentMode("emi")}>Reduce EMI</button>
        </div>

        <div className="gs-refcalc-disclaimer">
          <i className="bi bi-info-circle" />
          Prepayment savings are indicative. Lender charges, minimum prepayment amounts and product-specific rules may apply.
        </div>
      </div>

      <div className="gs-refcalc-result-side">
        <div className="gs-result-title">Results</div>
        <div
          className="gs-result-donut gs-result-donut-savings"
          style={{ "--eligible": `${savingPercent}%` }}
        >
          <div className="gs-result-donut-inner">
            <span>Interest saved</span>
            <strong>{money(result.interestSaved)}</strong>
          </div>
        </div>

        <div className="gs-result-lines">
          <ResultLine label="Current EMI" value={money(result.originalEmi)} />
          <ResultLine label="Revised EMI" value={money(result.revisedEmi)} />
          <ResultLine label="Revised Tenure" value={`${result.revisedTenure} Months`} />
          <ResultLine label="Tenure Saved" value={`${result.tenureSaved} Months`} />
        </div>

        <button type="button" className="gs-refcalc-apply">
          View Loan Options <i className="bi bi-arrow-right" />
        </button>
      </div>
    </section>
  );
}

function RangeField({ label, value, min, max, suffix, step = 1, onChange }) {
  const safeValue = Number(value) || 0;
  const percent = ((safeValue - min) / Math.max(1, max - min)) * 100;

  return (
    <div className="gs-range-field">
      <div className="gs-range-top">
        <label>{label}</label>
        <div className="gs-range-value">
          <span>{suffix === "₹" ? "₹" : ""}</span>
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          {suffix !== "₹" && <small>{suffix}</small>}
        </div>
      </div>
      <input
        className="gs-range-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, safeValue))}
        style={{ "--range-progress": `${Math.min(100, Math.max(0, percent))}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="gs-range-limits">
        <span>{suffix === "₹" ? formatShort(min) : `${min}${suffix}`}</span>
        <span>{suffix === "₹" ? formatShort(max) : `${max}${suffix}`}</span>
      </div>
    </div>
  );
}

function ResultLine({ label, value }) {
  return (
    <div className="gs-result-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function GuideCard({ icon, title, text }) {
  return (
    <div className="gs-guide-card">
      <div className="gs-guide-icon"><i className={`bi ${icon}`} /></div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
