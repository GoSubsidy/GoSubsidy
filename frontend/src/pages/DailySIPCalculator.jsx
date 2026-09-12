import React, { useMemo, useState } from "react";
import "./DailySIPCalculator.css";
import Footer from "../components/layout/Footer";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export default function DailySIPCalculator() {
  const [dailyInvestment, setDailyInvestment] = useState(200);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const p = Math.max(0, Number(dailyInvestment) || 0);
    const annual = Math.max(0, Number(returnRate) || 0);
    const y = Math.max(0, Number(years) || 0);
    const days = Math.round(y * 365);
    const dailyRate = annual / 365 / 100;

    let maturity = 0;
    if (days > 0) {
      maturity =
        dailyRate === 0
          ? p * days
          : p * (((Math.pow(1 + dailyRate, days) - 1) / dailyRate) *
              (1 + dailyRate));
    }

    const invested = p * days;
    return {
      invested,
      returns: Math.max(0, maturity - invested),
      maturity,
      days,
    };
  }, [dailyInvestment, returnRate, years]);

  return (
    <>
      <div className="daily-sip-page">
        <div className="daily-sip-shell">
          <div className="daily-sip-heading">
            <span className="daily-sip-kicker">Investment Calculator</span>
            <h1>Daily SIP Calculator</h1>
            <p>Estimate how a small daily investment can grow over time.</p>
          </div>

          <div className="daily-sip-card">
            <div className="daily-sip-input-panel">
              <h2>Daily Investment Details</h2>

              <label>Daily Investment (₹)</label>
              <input
                type="number"
                min="0"
                value={dailyInvestment}
                onChange={(e) => setDailyInvestment(e.target.value)}
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

              <button type="button" className="daily-sip-calculate-btn">
                Calculate Daily SIP
              </button>
            </div>

            <div className="daily-sip-result-panel">
              <div className="daily-sip-result-label">Estimated Maturity Value</div>
              <div className="daily-sip-result-primary">₹{money(result.maturity)}</div>

              <div className="daily-sip-result-grid">
                <div><span>Invested Amount</span><strong>₹{money(result.invested)}</strong></div>
                <div><span>Estimated Returns</span><strong>₹{money(result.returns)}</strong></div>
                <div><span>Investment Period</span><strong>{years} Years</strong></div>
                <div><span>Daily SIP</span><strong>₹{money(Number(dailyInvestment) || 0)}</strong></div>
              </div>

              <div className="daily-sip-note">
                This is an illustrative estimate using daily compounding. Actual investment
                outcomes depend on the product and market performance.
              </div>
            </div>
          </div>

          <div className="daily-sip-info">
            <h2>Why use a Daily SIP?</h2>
            <p>
              A daily investment approach can help investors build a regular savings habit.
              Enter a daily amount, assumed return and period to see an illustrative future value.
            </p>
          </div>

          <div className="daily-sip-info">
            <h2>Daily SIP Calculator FAQ</h2>
            <p><strong>Is the calculation guaranteed?</strong> No. The result is an estimate based on the assumed return.</p>
            <p><strong>Can I increase my daily investment?</strong> Yes. Enter a different daily amount to compare scenarios.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}