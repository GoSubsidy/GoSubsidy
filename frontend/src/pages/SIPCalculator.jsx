import React, { useMemo, useState } from "react";
import "./SIPCalculator.css";
import Footer from "../components/layout/Footer";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const p = Math.max(0, Number(monthlyInvestment) || 0);
    const annual = Math.max(0, Number(returnRate) || 0);
    const y = Math.max(0, Number(years) || 0);
    const months = Math.round(y * 12);
    const monthlyRate = annual / 12 / 100;

    let maturity = 0;
    if (months > 0) {
      maturity =
        monthlyRate === 0
          ? p * months
          : p * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
              (1 + monthlyRate));
    }

    const invested = p * months;
    return {
      invested,
      returns: Math.max(0, maturity - invested),
      maturity,
      months,
    };
  }, [monthlyInvestment, returnRate, years]);

  return (
    <>
      <div className="sip-page">
        <div className="sip-shell">
          <div className="sip-heading">
            <span className="sip-kicker">Investment Calculator</span>
            <h1>SIP Calculator</h1>
            <p>Estimate your SIP investment, wealth gained and maturity value.</p>
          </div>

          <div className="sip-card">
            <div className="sip-input-panel">
              <h2>SIP Investment Details</h2>

              <label>Monthly Investment (₹)</label>
              <input
                type="number"
                min="0"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(e.target.value)}
                inputMode="numeric"
              />

              <label>Expected Annual Return (%)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                inputMode="decimal"
              />

              <label>Investment Period (Years)</label>
              <input
                type="number"
                min="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                inputMode="numeric"
              />

              <button type="button" className="sip-calculate-btn">
                Calculate SIP
              </button>
            </div>

            <div className="sip-result-panel">
              <div className="sip-result-label">Estimated Maturity Value</div>
              <div className="sip-result-primary">₹{money(result.maturity)}</div>

              <div className="sip-result-grid">
                <div><span>Invested Amount</span><strong>₹{money(result.invested)}</strong></div>
                <div><span>Estimated Returns</span><strong>₹{money(result.returns)}</strong></div>
                <div><span>Investment Period</span><strong>{years} Years</strong></div>
                <div><span>Monthly SIP</span><strong>₹{money(Number(monthlyInvestment) || 0)}</strong></div>
              </div>

              <div className="sip-note">
                This is an illustrative estimate. Actual mutual fund returns are market-linked
                and may be higher or lower than the assumed rate.
              </div>
            </div>
          </div>

          <div className="sip-info">
            <h2>How SIP works</h2>
            <p>
              A Systematic Investment Plan allows you to invest a fixed amount at regular
              intervals. The calculator estimates the future value using the assumed annual return.
            </p>
          </div>

          <div className="sip-info">
            <h2>SIP Calculator FAQ</h2>
            <p><strong>Can I change the SIP amount?</strong> Yes. Enter your planned monthly investment.</p>
            <p><strong>Are SIP returns guaranteed?</strong> No. Mutual fund returns are market-linked.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}