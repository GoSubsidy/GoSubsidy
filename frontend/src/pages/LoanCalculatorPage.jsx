import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoanEligibilityPrepayment.css";
import Footer from "../components/layout/Footer";

const CONFIG = {
  personalEligibility: {
    title: "Personal Loan Eligibility Calculator",
    breadcrumb: "Personal Loan / Eligibility",
    subtitle: "Check maximum borrowing power based on age, income, existing EMI, interest rate and loan tenure.",
    type: "eligibility",
    defaults: { age: 29, loan: 200000, rate: 10, tenure: 3, income: 40000, existingEmi: 10000 },
    loanMax: 5000000,
  },
  homeEligibility: {
    title: "Home Loan Eligibility Calculator",
    breadcrumb: "Home Loan / Eligibility",
    subtitle: "Estimate your home loan eligibility using monthly income, existing obligations, interest rate and repayment tenure.",
    type: "eligibility",
    defaults: { age: 32, loan: 2000000, rate: 8.5, tenure: 20, income: 75000, existingEmi: 15000 },
    loanMax: 10000000,
  },
  homePrepayment: {
    title: "Home Loan Prepayment Calculator",
    breadcrumb: "Home Loan / Prepayment",
    subtitle: "Calculate the impact of a lump-sum prepayment on your home loan interest and repayment tenure.",
    type: "prepayment",
    defaults: { loan: 3000000, rate: 8.5, tenure: 15, prepayment: 500000, afterMonths: 12 },
    loanMax: 100000000,
  },
  personalPrepayment: {
    title: "Personal Loan Prepayment Calculator",
    breadcrumb: "Personal Loan / Prepayment",
    subtitle: "Estimate interest savings and repayment changes when you prepay part of your outstanding personal loan.",
    type: "prepayment",
    defaults: { loan: 500000, rate: 11.5, tenure: 4, prepayment: 100000, afterMonths: 12 },
    loanMax: 5000000,
  },
};

const money = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(v) || 0));

function emi(principal, annualRate, months) {
  const p = Math.max(0, Number(principal) || 0);
  const n = Math.max(1, Math.round(Number(months) || 1));
  const r = Math.max(0, Number(annualRate) || 0) / 1200;
  if (!p) return 0;
  if (!r) return p / n;
  const x = Math.pow(1 + r, n);
  return (p * r * x) / (x - 1);
}

function principalForEmi(payment, annualRate, months) {
  const e = Math.max(0, Number(payment) || 0);
  const n = Math.max(1, Math.round(Number(months) || 1));
  const r = Math.max(0, Number(annualRate) || 0) / 1200;
  if (!e) return 0;
  if (!r) return e * n;
  const x = Math.pow(1 + r, n);
  return (e * (x - 1)) / (r * x);
}

function balanceAfterPayments(principal, annualRate, monthsPaid, totalMonths) {
  const p = Math.max(0, Number(principal) || 0);
  const paid = Math.max(0, Math.min(Math.round(monthsPaid || 0), Math.round(totalMonths || 0)));
  const n = Math.max(1, Math.round(totalMonths || 1));
  const r = Math.max(0, Number(annualRate) || 0) / 1200;
  if (!p) return 0;
  if (!r) return Math.max(0, p - (p / n) * paid);
  const payment = emi(p, annualRate, n);
  const x = Math.pow(1 + r, paid);
  return Math.max(0, p * x - payment * ((x - 1) / r));
}

function shortMoney(v) {
  const n = Math.max(0, Number(v) || 0);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${Math.round(n)}`;
}

export default function LoanCalculatorPage({ mode }) {
  const navigate = useNavigate();
  const c = CONFIG[mode] || CONFIG.personalEligibility;

  const [age, setAge] = useState(c.defaults.age || 30);
  const [loan, setLoan] = useState(c.defaults.loan);
  const [rate, setRate] = useState(c.defaults.rate);
  const [tenure, setTenure] = useState(c.defaults.tenure);
  const [income, setIncome] = useState(c.defaults.income || 50000);
  const [existingEmi, setExistingEmi] = useState(c.defaults.existingEmi || 0);
  const [prepayment, setPrepayment] = useState(c.defaults.prepayment || 100000);
  const [afterMonths, setAfterMonths] = useState(c.defaults.afterMonths || 12);
  const [goal, setGoal] = useState("tenure");
  const [showMore, setShowMore] = useState(false);

  const eligibility = useMemo(() => {
    const affordableEmi = Math.max(0, (Number(income) || 0) * 0.50 - (Number(existingEmi) || 0));
    const maxEligible = principalForEmi(affordableEmi, rate, tenure * 12);
    const requested = Math.max(0, Number(loan) || 0);
    const approved = Math.min(requested, maxEligible);
    return {
      affordableEmi,
      maxEligible,
      approved,
      estimatedEmi: emi(approved, rate, tenure * 12),
    };
  }, [income, existingEmi, loan, rate, tenure]);

  const prepay = useMemo(() => {
    const p = Math.max(0, Number(loan) || 0);
    const annual = Math.max(0, Number(rate) || 0);
    const totalMonths = Math.max(1, Math.round((Number(tenure) || 1) * 12));
    const paidMonths = Math.min(
      Math.max(1, Math.round(Number(afterMonths) || 1)),
      Math.max(1, totalMonths - 1)
    );
    const originalEmi = emi(p, annual, totalMonths);
    const balance = balanceAfterPayments(p, annual, paidMonths, totalMonths);
    const actualPrepayment = Math.min(Math.max(0, Number(prepayment) || 0), balance);
    const newBalance = Math.max(0, balance - actualPrepayment);
    const remaining = Math.max(1, totalMonths - paidMonths);
    const revisedEmi = emi(newBalance, annual, remaining);

    let revisedMonths = remaining;
    if (newBalance > 0 && originalEmi > 0) {
      const r = annual / 1200;
      if (!r) revisedMonths = Math.max(1, Math.ceil(newBalance / originalEmi));
      else {
        const raw = -Math.log(1 - (r * newBalance) / originalEmi) / Math.log(1 + r);
        revisedMonths = Number.isFinite(raw) ? Math.max(1, Math.ceil(raw)) : remaining;
      }
    }

    const originalRemainingInterest = Math.max(0, originalEmi * remaining - balance);
    const newInterest =
      goal === "tenure"
        ? Math.max(0, originalEmi * revisedMonths - newBalance)
        : Math.max(0, revisedEmi * remaining - newBalance);

    return {
      originalEmi,
      balance,
      actualPrepayment,
      newBalance,
      revisedEmi,
      remaining,
      revisedMonths,
      tenureSaved: Math.max(0, remaining - revisedMonths),
      interestSaved: Math.max(0, originalRemainingInterest - newInterest),
    };
  }, [loan, rate, tenure, prepayment, afterMonths, goal]);

  const isEligibility = c.type === "eligibility";

  return (
    <>
      <main className="gs-loan-page">
        <div className="gs-loan-shell">
          <div className="gs-loan-breadcrumb">
            Home <span>/</span> {c.breadcrumb}
          </div>

          <header className="gs-loan-header">
            <h1>{c.title}</h1>
            <div className="gs-header-description">
              <p>{c.subtitle}</p>
              <button
                type="button"
                className="gs-read-more"
                aria-expanded={showMore}
                onClick={() => setShowMore((value) => !value)}
              >
                {showMore ? "Read less" : "...Read more"}
              </button>
            </div>

            {showMore && (
              <div className="gs-read-more-panel">
                <p>
                  {isEligibility
                    ? `The ${c.title.replace(" Calculator", "")} estimates the amount you may be able to borrow using your income, existing monthly EMI obligations, age, interest rate and selected tenure. Change the values above to see the indicative eligible amount and EMI instantly.`
                    : `The ${c.title.replace(" Calculator", "")} shows how an additional lump-sum payment may affect your outstanding balance, interest cost, EMI and repayment tenure. You can compare reducing the tenure with reducing the EMI before making a repayment decision.`}
                </p>
                <p>
                  <strong>Important:</strong> This is an indicative planning tool. Actual eligibility,
                  interest savings, charges, foreclosure/prepayment rules and final repayment
                  schedules are determined by the lender and the applicant's agreement.
                </p>
              </div>
            )}
          </header>

          <section className="gs-loan-card">
            <div className="gs-loan-input-panel">
              <div className="gs-loan-panel-heading">
                <h2>{isEligibility ? `Check ${c.title.replace(" Calculator", "")} Online` : `Calculate your ${c.title.replace(" Calculator", "")} Online`}</h2>
                <span><i className="bi bi-lightning-charge-fill" /> Live</span>
              </div>

              {isEligibility ? (
                <div className="gs-fields">
                  <Field label="Age" value={age} min={18} max={70} step={1} suffix="Yrs" onChange={setAge} />
                  <Field label="Desired Loan Amount" value={loan} min={50000} max={c.loanMax} step={5000} currency onChange={setLoan} />
                  <Field label="Rate of Interest (Yearly)" value={rate} min={6} max={30} step={0.1} suffix="%" onChange={setRate} />
                  <Field label="Loan Tenure" value={tenure} min={1} max={30} step={1} suffix="Yrs" onChange={setTenure} />
                  <Field label="Monthly Income" value={income} min={20000} max={500000} step={1000} currency onChange={setIncome} />
                  <Field label="Existing Monthly EMI" value={existingEmi} min={0} max={200000} step={1000} currency onChange={setExistingEmi} />
                </div>
              ) : (
                <>
                  <div className="gs-fields">
                    <Field label="Outstanding Loan Amount" value={loan} min={100000} max={c.loanMax} step={5000} currency onChange={setLoan} />
                    <Field label="Rate of Interest (Yearly)" value={rate} min={6} max={30} step={0.1} suffix="%" onChange={setRate} />
                    <Field label="Remaining Loan Tenure" value={tenure} min={1} max={30} step={1} suffix="Yrs" onChange={setTenure} />
                    <Field label="Prepayment Amount" value={prepayment} min={0} max={Math.max(1, loan)} step={5000} currency onChange={setPrepayment} />
                    <Field label="Prepayment After" value={afterMonths} min={1} max={Math.max(1, tenure * 12 - 1)} step={1} suffix="Months" onChange={setAfterMonths} />
                  </div>

                  <div className="gs-goal">
                    <strong>After prepayment, I want to</strong>
                    <button type="button" className={goal === "tenure" ? "active" : ""} onClick={() => setGoal("tenure")}>Reduce Tenure</button>
                    <button type="button" className={goal === "emi" ? "active" : ""} onClick={() => setGoal("emi")}>Reduce EMI</button>
                  </div>
                </>
              )}

              <div className="gs-loan-note">
                <i className="bi bi-info-circle" />
                Results are indicative. Final loan eligibility, rates, charges and prepayment conditions depend on the lender and applicant profile.
              </div>
            </div>

            {isEligibility ? (
              <EligibilityResult result={eligibility} requested={loan} tenure={tenure} money={money} navigate={navigate} />
            ) : (
              <PrepaymentResult result={prepay} money={money} navigate={navigate} />
            )}
          </section>

          <section className="gs-loan-content">
            <div className="gs-loan-article">
              <span className="gs-eyebrow">GOSUBSIDY FINANCIAL TOOL</span>
              <h2>{isEligibility ? `What is ${c.title}?` : `How ${c.title} works`}</h2>
              <p>
                {isEligibility
                  ? "This calculator provides an indicative borrowing estimate using income, existing EMI obligations, interest rate and tenure. Use the result for planning before approaching a lender."
                  : "This calculator estimates how an early lump-sum payment can change your interest cost, EMI or remaining tenure. Actual lender calculations may differ because of product-specific terms."}
              </p>

              <div className="gs-info-grid">
                <Info icon="bi-calculator" title="Instant calculation" text="Change any input and the result updates immediately." />
                <Info icon="bi-graph-up-arrow" title="Clear breakdown" text="See the important repayment numbers in one place." />
                <Info icon="bi-shield-check" title="GoSubsidy guidance" text="Use the estimate as a planning aid before applying." />
              </div>
            </div>

            <aside className="gs-trust">
              <div className="gs-trust-icon"><i className="bi bi-shield-check" /></div>
              <h3>GoSubsidy Financial Intelligence</h3>
              <p>Simple financial tools for entrepreneurs, businesses and applicants.</p>
              <div><i className="bi bi-check-circle-fill" /> Transparent inputs</div>
              <div><i className="bi bi-check-circle-fill" /> Live result updates</div>
              <div><i className="bi bi-check-circle-fill" /> Mobile responsive</div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value, min, max, step, suffix, currency, onChange }) {
  const n = Number(value) || 0;
  const progress = Math.max(0, Math.min(100, ((n - min) / Math.max(1, max - min)) * 100));

  return (
    <div className="gs-field">
      <div className="gs-field-top">
        <label>{label}</label>
        <div className="gs-number">
          {currency && <span>₹</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
          {suffix && <small>{suffix}</small>}
        </div>
      </div>

      <input
        className="gs-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, Number(value) || min))}
        style={{ "--progress": `${progress}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="gs-limits">
        <span>{currency ? shortMoney(min) : `${min}${suffix || ""}`}</span>
        <span>{currency ? shortMoney(max) : `${max}${suffix || ""}`}</span>
      </div>
    </div>
  );
}

function EligibilityResult({ result, requested, tenure, money, navigate }) {
  const ratio = Math.max(0, Math.min(100, (result.approved / Math.max(1, requested)) * 100));

  return (
    <div className="gs-result">
      <h3>Results</h3>
      <div className="gs-donut" style={{ "--result": `${ratio}%` }}>
        <div>
          <span>You are eligible for</span>
          <strong>{money(result.approved)}</strong>
        </div>
      </div>
      <ResultLine label="Estimated EMI" value={money(result.estimatedEmi)} />
      <ResultLine label="Maximum affordable EMI" value={money(result.affordableEmi)} />
      <ResultLine label="Eligible Tenure" value={`${tenure} Years`} />
      <button type="button" className="gs-apply" onClick={() => navigate("/loans")}>Apply Now <i className="bi bi-arrow-right" /></button>
    </div>
  );
}

function PrepaymentResult({ result, money, navigate }) {
  const saving = Math.max(0, Math.min(100, (result.interestSaved / Math.max(1, result.originalEmi * result.remaining)) * 100));

  return (
    <div className="gs-result">
      <h3>Results</h3>
      <div className="gs-donut green" style={{ "--result": `${saving}%` }}>
        <div>
          <span>Interest saved</span>
          <strong>{money(result.interestSaved)}</strong>
        </div>
      </div>
      <ResultLine label="Current EMI" value={money(result.originalEmi)} />
      <ResultLine label="Revised EMI" value={money(result.revisedEmi)} />
      <ResultLine label="Revised Tenure" value={`${result.revisedMonths} Months`} />
      <ResultLine label="Tenure Saved" value={`${result.tenureSaved} Months`} />
      <button type="button" className="gs-apply" onClick={() => navigate("/loans")}>View Loan Options <i className="bi bi-arrow-right" /></button>
    </div>
  );
}

function ResultLine({ label, value }) {
  return (
    <div className="gs-result-line"><span>{label}</span><strong>{value}</strong></div>
  );
}

function Info({ icon, title, text }) {
  return (
    <div className="gs-info">
      <div><i className={`bi ${icon}`} /></div>
      <section><strong>{title}</strong><p>{text}</p></section>
    </div>
  );
}