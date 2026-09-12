import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeTools() {
  const [projectCost, setProjectCost] = useState(5000000);
  const [subsidyPercent, setSubsidyPercent] = useState(25);
  const [ownContribution, setOwnContribution] = useState(10);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(7);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const calculation = useMemo(() => {
    const cost = Number(projectCost) || 0;
    const subsidyRate = Number(subsidyPercent) || 0;
    const contributionRate = Number(ownContribution) || 0;
    const annualRate = Number(interestRate) || 0;
    const years = Number(tenure) || 0;

    const subsidyAmount = cost * (subsidyRate / 100);
    const contributionAmount = cost * (contributionRate / 100);

    const loanAmount = Math.max(
      0,
      cost - subsidyAmount - contributionAmount
    );

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    let emi = 0;

    if (loanAmount > 0 && months > 0) {
      if (monthlyRate === 0) {
        emi = loanAmount / months;
      } else {
        const factor = Math.pow(1 + monthlyRate, months);

        emi =
          (loanAmount * monthlyRate * factor) /
          (factor - 1);
      }
    }

    const totalRepayment = emi * months;
    const totalInterest = Math.max(
      0,
      totalRepayment - loanAmount
    );

    return {
      subsidyAmount,
      contributionAmount,
      loanAmount,
      emi,
      totalInterest,
      totalRepayment,
    };
  }, [
    projectCost,
    subsidyPercent,
    ownContribution,
    interestRate,
    tenure,
  ]);

  return (
    <section
      className="py-5"
      style={{
        background: "#f8fafc",
      }}
    >
      <div className="container py-lg-4">

        {/* HEADER */}

        <div className="text-center mb-5">
          <span className="badge bg-primary rounded-pill px-3 py-2 mb-3">
            GOSUBSIDY BUSINESS TOOLS
          </span>

          <h2 className="fw-bold display-6">
            Plan Your Project with{" "}
            <span className="text-primary">
              Smart Financial Tools
            </span>
          </h2>

          <p className="text-muted mx-auto" style={{ maxWidth: 720 }}>
            Estimate your subsidy-linked loan and EMI, then
            prepare a professional Detailed Project Report
            for your business.
          </p>
        </div>

        <div className="row g-4">

          {/* ==================================================
              EMI CALCULATOR
          ================================================== */}

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4 p-lg-5">

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: 55,
                      height: 55,
                      background: "#e8f0ff",
                    }}
                  >
                    <i className="bi bi-calculator fs-3 text-primary"></i>
                  </div>

                  <div>
                    <h3 className="fw-bold mb-1">
                      Subsidy Loan EMI Calculator
                    </h3>

                    <div className="text-muted">
                      Estimate project financing and monthly EMI
                    </div>
                  </div>
                </div>

                <div className="row g-3">

                  {/* PROJECT COST */}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Project Cost
                    </label>

                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-lg"
                      value={projectCost}
                      onChange={(e) =>
                        setProjectCost(e.target.value)
                      }
                    />

                    <small className="text-muted">
                      {formatCurrency(projectCost)}
                    </small>
                  </div>

                  {/* SUBSIDY */}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Estimated Subsidy %
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={subsidyPercent}
                        onChange={(e) =>
                          setSubsidyPercent(e.target.value)
                        }
                      />

                      <span className="input-group-text">
                        %
                      </span>
                    </div>
                  </div>

                  {/* CONTRIBUTION */}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Own Contribution %
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={ownContribution}
                        onChange={(e) =>
                          setOwnContribution(e.target.value)
                        }
                      />

                      <span className="input-group-text">
                        %
                      </span>
                    </div>
                  </div>

                  {/* INTEREST */}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Interest Rate
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        value={interestRate}
                        onChange={(e) =>
                          setInterestRate(e.target.value)
                        }
                      />

                      <span className="input-group-text">
                        %
                      </span>
                    </div>
                  </div>

                  {/* TENURE */}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Loan Tenure
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={tenure}
                        onChange={(e) =>
                          setTenure(e.target.value)
                        }
                      />

                      <span className="input-group-text">
                        Years
                      </span>
                    </div>
                  </div>

                </div>

                <hr className="my-4" />

                {/* RESULTS */}

                <div className="row g-3">

                  <ResultCard
                    label="Estimated Subsidy"
                    value={formatCurrency(
                      calculation.subsidyAmount
                    )}
                  />

                  <ResultCard
                    label="Own Contribution"
                    value={formatCurrency(
                      calculation.contributionAmount
                    )}
                  />

                  <ResultCard
                    label="Estimated Bank Loan"
                    value={formatCurrency(
                      calculation.loanAmount
                    )}
                  />

                  <ResultCard
                    label="Monthly EMI"
                    value={formatCurrency(
                      calculation.emi
                    )}
                    highlight
                  />

                </div>

                <div className="row mt-4 g-3">
                  <div className="col-md-6">
                    <div className="text-muted">
                      Total Interest
                    </div>

                    <div className="fw-bold fs-5">
                      {formatCurrency(
                        calculation.totalInterest
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="text-muted">
                      Total Loan Repayment
                    </div>

                    <div className="fw-bold fs-5">
                      {formatCurrency(
                        calculation.totalRepayment
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="alert alert-light border mt-4 mb-0"
                  role="alert"
                >
                  <small className="text-muted">
                    This calculator provides an estimate only.
                    Actual subsidy eligibility, loan amount,
                    interest rate and repayment terms depend on
                    the applicable government scheme and lender.
                  </small>
                </div>

              </div>
            </div>
          </div>

          {/* ==================================================
              DPR
          ================================================== */}

          <div className="col-lg-5">
            <div
              className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
            >
              <div
                className="card-body p-4 p-lg-5 d-flex flex-column"
                style={{
                  background:
                    "linear-gradient(145deg,#0f172a,#1e3a8a)",
                }}
              >
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: 65,
                    height: 65,
                    background: "rgba(255,255,255,.12)",
                  }}
                >
                  <i className="bi bi-file-earmark-text fs-2 text-warning"></i>
                </div>

                <span
                  className="badge bg-warning text-dark align-self-start rounded-pill mb-3"
                >
                  AI POWERED
                </span>

                <h2 className="text-white fw-bold">
                  Detailed Project Report
                </h2>

                <p
                  className="mb-4"
                  style={{
                    color: "rgba(255,255,255,.75)",
                  }}
                >
                  Prepare a professional project report for
                  bank finance, subsidy applications and
                  government schemes.
                </p>

                <div className="d-flex flex-column gap-3 mb-4">

                  <Feature text="Project profile & business overview" />

                  <Feature text="Project cost & means of finance" />

                  <Feature text="Machinery & infrastructure" />

                  <Feature text="Sales and profitability projections" />

                  <Feature text="Loan repayment & financial analysis" />

                  <Feature text="Government subsidy integration" />

                </div>

                <div className="mt-auto">

                  <Link
                    to="/dpr"
                    className="btn btn-warning btn-lg w-100 fw-bold"
                  >
                    <i className="bi bi-stars me-2"></i>
                    Prepare DPR
                  </Link>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ======================================================
// RESULT CARD
// ======================================================

function ResultCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="col-6">
      <div
        className="rounded-4 p-3 h-100"
        style={{
          background: highlight
            ? "#eff6ff"
            : "#f8fafc",

          border: highlight
            ? "1px solid #bfdbfe"
            : "1px solid #e2e8f0",
        }}
      >
        <div
          className="text-muted mb-1"
          style={{
            fontSize: "0.85rem",
          }}
        >
          {label}
        </div>

        <div
          className={`fw-bold ${
            highlight ? "text-primary" : ""
          }`}
          style={{
            fontSize: "1.15rem",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FEATURE
// ======================================================

function Feature({ text }) {
  return (
    <div className="d-flex align-items-center gap-2 text-white">
      <i className="bi bi-check-circle-fill text-success"></i>
      <span>{text}</span>
    </div>
  );
}