import React, { useMemo, useState } from "react";
import "./GSTCalculator.css";
import Footer from "../components/layout/Footer";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

export default function GSTCalculator() {
  const [amount, setAmount] = useState(100000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState("exclusive");

  const result = useMemo(() => {
    const a = Math.max(0, Number(amount) || 0);
    const rate = Math.max(0, Number(gstRate) || 0);

    if (mode === "inclusive") {
      const taxable = a / (1 + rate / 100);
      const gst = a - taxable;
      return {
        taxable,
        gst,
        total: a,
        cgst: gst / 2,
        sgst: gst / 2,
      };
    }

    const gst = a * rate / 100;
    return {
      taxable: a,
      gst,
      total: a + gst,
      cgst: gst / 2,
      sgst: gst / 2,
    };
  }, [amount, gstRate, mode]);

  return (
    <>
      <div className="investment-calculator-page">
        <div className="calculator-shell">
          <div className="calculator-heading">
            <span className="calculator-kicker">Investment Calculator</span>
            <h1>GST Calculator</h1>
            <p>Calculate GST, CGST, SGST and the final invoice amount quickly.</p>
          </div>

          <div className="calculator-card">
            <div className="calculator-input-panel">
              <h2>GST Calculation</h2>

              <label>Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
              />

              <label>GST Rate</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
              >
                {[5, 12, 18, 28].map((rate) => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>

              <label>Calculation Type</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={mode === "exclusive" ? "active" : ""}
                  onClick={() => setMode("exclusive")}
                >
                  Add GST
                </button>
                <button
                  type="button"
                  className={mode === "inclusive" ? "active" : ""}
                  onClick={() => setMode("inclusive")}
                >
                  GST Included
                </button>
              </div>

              <button
                type="button"
                className="calculate-btn"
                onClick={() => setAmount(Number(amount) || 0)}
              >
                Calculate GST
              </button>
            </div>

            <div className="calculator-result-panel">
              <div className="result-label">Total Amount</div>
              <div className="result-primary">₹{money(result.total)}</div>

              <div className="result-grid">
                <div><span>Taxable Amount</span><strong>₹{money(result.taxable)}</strong></div>
                <div><span>Total GST</span><strong>₹{money(result.gst)}</strong></div>
                <div><span>CGST</span><strong>₹{money(result.cgst)}</strong></div>
                <div><span>SGST</span><strong>₹{money(result.sgst)}</strong></div>
              </div>

              <div className="result-note">
                For an intra-state transaction, GST is shown as equal CGST and SGST.
                For an inter-state transaction, the same GST amount would generally be IGST.
              </div>
            </div>
          </div>

          <div className="calculator-info">
            <h2>How to use the GST Calculator</h2>
            <p>
              Enter the amount, choose the applicable GST rate and select whether
              GST should be added to the amount or extracted from a GST-inclusive amount.
            </p>
          </div>

          <div className="calculator-info">
            <h2>GST Calculator FAQ</h2>
            <p><strong>What is GST?</strong> GST is a tax applied to the supply of goods and services in India.</p>
            <p><strong>What does GST inclusive mean?</strong> It means the amount entered already contains GST.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}