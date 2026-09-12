import React, { useMemo, useState } from "react";

export default function SubsidyLoanCalculator() {
  const [projectCost, setProjectCost] = useState(5000000);
  const [subsidyPercent, setSubsidyPercent] = useState(25);
  const [ownContribution, setOwnContribution] = useState(10);
  const [interestRate, setInterestRate] = useState(9);
  const [tenure, setTenure] = useState(7);

  // ======================================================
  // INDIAN CURRENCY FORMAT
  // ======================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // ======================================================
  // CALCULATIONS
  // ======================================================

  const calculations = useMemo(() => {
    const cost = Number(projectCost) || 0;
    const subsidyRate = Number(subsidyPercent) || 0;
    const contributionRate = Number(ownContribution) || 0;
    const annualInterest = Number(interestRate) || 0;
    const years = Number(tenure) || 0;

    // Subsidy
    const subsidyAmount = (cost * subsidyRate) / 100;

    // Promoter / Own Contribution
    const ownContributionAmount =
      (cost * contributionRate) / 100;

    // Estimated bank loan after subsidy and contribution
    const loanAmount = Math.max(
      0,
      cost - subsidyAmount - ownContributionAmount
    );

    // EMI calculation
    const months = years * 12;
    const monthlyRate = annualInterest / 12 / 100;

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

    const totalPayment = emi * months;

    const totalInterest = Math.max(
      0,
      totalPayment - loanAmount
    );

    return {
      subsidyAmount,
      ownContributionAmount,
      loanAmount,
      emi,
      totalPayment,
      totalInterest,
      months,
    };
  }, [
    projectCost,
    subsidyPercent,
    ownContribution,
    interestRate,
    tenure,
  ]);

  // ======================================================
  // UI
  // ======================================================

  return (
    <section
      className="py-5"
      style={{
        background:
          "linear-gradient(180deg,#f8fbff 0%,#eef7ff 100%)",
      }}
    >
      <div className="container">

        {/* HEADER */}

        <div className="text-center mb-5">

          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              background: "#e8f0ff",
              color: "#0d6efd",
            }}
          >
            GOSUBSIDY FINANCIAL TOOL
          </span>

          <h2 className="fw-bold">
            Subsidy Loan{" "}
            <span className="text-primary">
              EMI Calculator
            </span>
          </h2>

          <p className="text-muted mx-auto" style={{ maxWidth: 700 }}>
            Estimate your government subsidy, promoter
            contribution, bank loan requirement and monthly EMI.
          </p>

        </div>

        <div className="row g-4">

          {/* =================================================
              LEFT SIDE - INPUTS
          ================================================= */}

          <div className="col-lg-5">

            <div
              className="bg-white rounded-4 shadow-sm p-4 h-100"
              style={{
                border: "1px solid #e9eef5",
              }}
            >

              <h4 className="fw-bold mb-4">
                Project Details
              </h4>

              {/* PROJECT COST */}

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Total Project Cost
                </label>

                <div className="input-group input-group-lg">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={projectCost}
                    onChange={(e) =>
                      setProjectCost(e.target.value)
                    }
                  />

                </div>

                <small className="text-muted">
                  {formatCurrency(projectCost)}
                </small>

              </div>

              {/* SUBSIDY */}

              <div className="mb-4">

                <div className="d-flex justify-content-between">

                  <label className="form-label fw-semibold">
                    Expected Subsidy
                  </label>

                  <strong className="text-success">
                    {subsidyPercent}%
                  </strong>

                </div>

                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="75"
                  step="1"
                  value={subsidyPercent}
                  onChange={(e) =>
                    setSubsidyPercent(e.target.value)
                  }
                />

                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={subsidyPercent}
                  onChange={(e) =>
                    setSubsidyPercent(e.target.value)
                  }
                />

              </div>

              {/* OWN CONTRIBUTION */}

              <div className="mb-4">

                <div className="d-flex justify-content-between">

                  <label className="form-label fw-semibold">
                    Own Contribution
                  </label>

                  <strong className="text-primary">
                    {ownContribution}%
                  </strong>

                </div>

                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  step="1"
                  value={ownContribution}
                  onChange={(e) =>
                    setOwnContribution(e.target.value)
                  }
                />

              </div>

              {/* INTEREST */}

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Bank Interest Rate (% per annum)
                </label>

                <input
                  type="number"
                  className="form-control form-control-lg"
                  min="0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(e.target.value)
                  }
                />

              </div>

              {/* TENURE */}

              <div>

                <label className="form-label fw-semibold">
                  Loan Tenure
                </label>

                <select
                  className="form-select form-select-lg"
                  value={tenure}
                  onChange={(e) =>
                    setTenure(e.target.value)
                  }
                >
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                  <option value="7">7 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                </select>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE - RESULTS
          ================================================= */}

          <div className="col-lg-7">

            <div
              className="rounded-4 shadow p-4 p-lg-5 h-100 text-white"
              style={{
                background:
                  "linear-gradient(135deg,#0d6efd,#0f766e)",
              }}
            >

              <div className="mb-4">

                <small
                  style={{
                    opacity: 0.8,
                  }}
                >
                  ESTIMATED MONTHLY EMI
                </small>

                <h1
                  className="fw-bold mt-2"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  {formatCurrency(calculations.emi)}
                </h1>

                <span
                  className="badge rounded-pill"
                  style={{
                    background: "rgba(255,255,255,.15)",
                  }}
                >
                  {calculations.months} Monthly Instalments
                </span>

              </div>

              <hr
                style={{
                  borderColor: "rgba(255,255,255,.25)",
                }}
              />

              <div className="row g-3 mt-2">

                {/* SUBSIDY */}

                <div className="col-md-6">

                  <div
                    className="rounded-4 p-3"
                    style={{
                      background: "rgba(255,255,255,.12)",
                    }}
                  >

                    <small>Estimated Subsidy</small>

                    <h4 className="fw-bold mt-2 text-warning">
                      {formatCurrency(
                        calculations.subsidyAmount
                      )}
                    </h4>

                  </div>

                </div>

                {/* CONTRIBUTION */}

                <div className="col-md-6">

                  <div
                    className="rounded-4 p-3"
                    style={{
                      background: "rgba(255,255,255,.12)",
                    }}
                  >

                    <small>Own Contribution</small>

                    <h4 className="fw-bold mt-2">
                      {formatCurrency(
                        calculations.ownContributionAmount
                      )}
                    </h4>

                  </div>

                </div>

                {/* LOAN */}

                <div className="col-md-6">

                  <div
                    className="rounded-4 p-3"
                    style={{
                      background: "rgba(255,255,255,.12)",
                    }}
                  >

                    <small>Estimated Bank Loan</small>

                    <h4 className="fw-bold mt-2">
                      {formatCurrency(
                        calculations.loanAmount
                      )}
                    </h4>

                  </div>

                </div>

                {/* INTEREST */}

                <div className="col-md-6">

                  <div
                    className="rounded-4 p-3"
                    style={{
                      background: "rgba(255,255,255,.12)",
                    }}
                  >

                    <small>Total Interest</small>

                    <h4 className="fw-bold mt-2">
                      {formatCurrency(
                        calculations.totalInterest
                      )}
                    </h4>

                  </div>

                </div>

              </div>

              {/* SUMMARY */}

              <div
                className="rounded-4 p-4 mt-4"
                style={{
                  background: "rgba(0,0,0,.12)",
                }}
              >

                <div className="d-flex justify-content-between mb-3">

                  <span>Project Cost</span>

                  <strong>
                    {formatCurrency(projectCost)}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-3">

                  <span>Subsidy</span>

                  <strong>
                    {formatCurrency(
                      calculations.subsidyAmount
                    )}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-3">

                  <span>Bank Loan</span>

                  <strong>
                    {formatCurrency(
                      calculations.loanAmount
                    )}
                  </strong>

                </div>

                <div className="d-flex justify-content-between">

                  <span>Total Loan Repayment</span>

                  <strong>
                    {formatCurrency(
                      calculations.totalPayment
                    )}
                  </strong>

                </div>

              </div>

              {/* DISCLAIMER */}

              <p
                className="mt-4 mb-0"
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                }}
              >
                * This calculator provides estimates only.
                Actual subsidy eligibility, loan amount,
                interest rate and repayment terms depend on
                the applicable government scheme and lending
                institution.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}