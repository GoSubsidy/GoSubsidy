import React, { useMemo, useState } from "react";
import "./FixedDeposit.css";
import Footer from "../components/layout/Footer";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(value) || 0));

function calculateFD(principal, rate, years) {
  const p = Math.max(0, Number(principal) || 0);
  const r = Math.max(0, Number(rate) || 0) / 100;
  const t = Math.max(0, Number(years) || 0);

  // Quarterly compounding, matching the conventional cumulative-FD
  // presentation used by major Indian FD calculators.
  const n = 4;
  const maturity = p * Math.pow(1 + r / n, n * t);
  const interest = Math.max(0, maturity - p);

  return { maturity, interest, principal: p };
}

export default function FixedDeposit() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8);
  const [tenure, setTenure] = useState(3);
  const [unit, setUnit] = useState("Years");
  const [calculated, setCalculated] = useState(true);

  const years = unit === "Months" ? Number(tenure || 0) / 12 : Number(tenure || 0);

  const result = useMemo(
    () => calculateFD(amount, rate, years),
    [amount, rate, years]
  );

  const handleCalculate = (e) => {
    e.preventDefault();
    setCalculated(true);
  };

  return (
    <>
      <main className="gs-fd-page">
        <div className="gs-fd-container">
          <header className="gs-fd-hero">
            <div>
              <div className="gs-fd-eyebrow">
                <i className="bi bi-piggy-bank-fill" />
                GOSUBSIDY INVESTMENT TOOL
              </div>
              <h1>Fixed Deposit Calculator</h1>
              <p>
                Calculate your FD maturity amount and interest earnings instantly
                using your deposit amount, interest rate and tenure.
              </p>
            </div>
          </header>

          <section className="gs-fd-card">
            <div className="gs-fd-input-panel">
              <div className="gs-fd-section-title">
                <div>
                  <span>FD RETURN CALCULATOR</span>
                  <h2>Calculate your Fixed Deposit returns</h2>
                </div>
                <div className="gs-fd-icon">
                  <i className="bi bi-calculator-fill" />
                </div>
              </div>

              <form onSubmit={handleCalculate}>
                <div className="gs-fd-fields">
                  <label className="gs-fd-field">
                    <span>Fixed Deposit Amount</span>
                    <div className="gs-fd-input-wrap">
                      <b>₹</b>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setCalculated(false);
                        }}
                      />
                    </div>
                  </label>

                  <label className="gs-fd-field">
                    <span>Rate of Interest</span>
                    <div className="gs-fd-input-wrap">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.01"
                        value={rate}
                        onChange={(e) => {
                          setRate(e.target.value);
                          setCalculated(false);
                        }}
                      />
                      <b>%</b>
                    </div>
                  </label>

                  <label className="gs-fd-field">
                    <span>Fixed Deposit Tenure</span>
                    <div className="gs-fd-tenure-wrap">
                      <input
                        type="number"
                        min="1"
                        max={unit === "Months" ? 120 : 30}
                        step="1"
                        value={tenure}
                        onChange={(e) => {
                          setTenure(e.target.value);
                          setCalculated(false);
                        }}
                      />
                      <select
                        value={unit}
                        onChange={(e) => {
                          setUnit(e.target.value);
                          setCalculated(false);
                        }}
                      >
                        <option>Years</option>
                        <option>Months</option>
                      </select>
                    </div>
                  </label>
                </div>

                <button className="gs-fd-calculate" type="submit">
                  Calculate
                  <i className="bi bi-arrow-right" />
                </button>
              </form>

              <div className="gs-fd-note">
                <i className="bi bi-info-circle" />
                Results are estimates. Actual FD returns depend on the bank,
                product, tenure and applicable interest rate.
              </div>
            </div>

            <aside className="gs-fd-result-panel">
              <div className="gs-fd-result-heading">
                <span>MATURITY VALUE</span>
                <i className="bi bi-graph-up-arrow" />
              </div>

              <div className="gs-fd-maturity">
                {money(result.maturity)}
              </div>

              <div className="gs-fd-divider" />

              <div className="gs-fd-result-row">
                <span>Total Interest</span>
                <strong>{money(result.interest)}</strong>
              </div>

              <div className="gs-fd-result-row">
                <span>Principal Amount</span>
                <strong>{money(result.principal)}</strong>
              </div>

              <div className="gs-fd-result-row">
                <span>Interest Rate</span>
                <strong>{Number(rate || 0).toFixed(2)}% p.a.</strong>
              </div>

              <div className="gs-fd-result-row">
                <span>Tenure</span>
                <strong>
                  {tenure || 0} {unit.toLowerCase()}
                </strong>
              </div>

              {!calculated && (
                <div className="gs-fd-live-hint">
                  Values updated — press <b>Calculate</b> to confirm.
                </div>
              )}
            </aside>
          </section>

          <section className="gs-fd-info">
            <h2>How can a GoSubsidy Fixed Deposit Calculator help you?</h2>
            <p>
              Use the calculator before investing to understand the approximate
              maturity value and interest income for different deposit amounts,
              rates and tenures.
            </p>

            <div className="gs-fd-benefits">
              <article>
                <i className="bi bi-lightning-charge-fill" />
                <div>
                  <h3>Quick calculation</h3>
                  <p>Enter three values and see your estimated FD return.</p>
                </div>
              </article>
              <article>
                <i className="bi bi-bullseye" />
                <div>
                  <h3>Know your maturity value</h3>
                  <p>Estimate how much your deposit may grow by maturity.</p>
                </div>
              </article>
              <article>
                <i className="bi bi-bar-chart-fill" />
                <div>
                  <h3>Compare scenarios</h3>
                  <p>Try different rates and tenures before choosing an FD.</p>
                </div>
              </article>
            </div>
          </section>

          <section className="gs-fd-faq">
            <h2>Fixed Deposit Calculator FAQs</h2>
            <details open>
              <summary>What details are required?</summary>
              <p>Deposit amount, interest rate and FD tenure are sufficient for this estimate.</p>
            </details>
            <details>
              <summary>What does the maturity amount mean?</summary>
              <p>It is the estimated principal plus accumulated interest at the end of the selected tenure.</p>
            </details>
            <details>
              <summary>Are the displayed returns guaranteed?</summary>
              <p>No. The calculator is an estimate and actual returns depend on the FD product and lender.</p>
            </details>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}