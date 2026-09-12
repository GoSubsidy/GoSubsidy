import React from "react";

export default function FinancialProfile({
  loanType,
  data,
  onChange,
}) {
  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const number = (value) =>
    Number(String(value || "").replace(/,/g, "")) || 0;

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(number(value));

  // ======================================================
  // LOAN GROUPS
  // ======================================================

  const businessLoans = [
    "Business Loan",
    "Working Capital",
    "Subsidy Linked Loan",
    "Project Finance",
    "Machinery Loan",
    "Solar / Green Finance",
  ];

  const salariedLoans = [
    "Personal Loan",
    "Home Loan",
    "Vehicle Loan",
  ];

  const isBusiness = businessLoans.includes(loanType);
  const isSalaried = salariedLoans.includes(loanType);
  const isEducation = loanType === "Education Loan";
  const isMortgage = loanType === "Mortgage / LAP";
  const isSubsidy = loanType === "Subsidy Linked Loan";
  const isWorkingCapital = loanType === "Working Capital";

  // ======================================================
  // LIVE CALCULATIONS
  // ======================================================

  const monthlyIncome = number(data.monthlyIncome);
  const otherIncome = number(data.otherMonthlyIncome);
  const monthlyObligations = number(data.monthlyObligations);

  const totalMonthlyIncome =
    monthlyIncome + otherIncome;

  const availableIncome =
    Math.max(
      totalMonthlyIncome - monthlyObligations,
      0
    );

  const currentFOIR =
    totalMonthlyIncome > 0
      ? (monthlyObligations / totalMonthlyIncome) * 100
      : 0;

  const annualTurnover = number(data.annualTurnover);
  const annualNetProfit = number(data.annualNetProfit);
  const depreciation = number(data.depreciation);
  const interestExpense = number(data.interestExpense);

  const businessCashAccrual =
    annualNetProfit + depreciation;

  const estimatedEBITDA =
    annualNetProfit +
    depreciation +
    interestExpense;

  return (
    <div className="application-form-card">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="application-section-title">

        <div className="section-number">
          04
        </div>

        <div>
          <span>
            FINANCIAL ASSESSMENT
          </span>

          <h2>
            Financial Profile
          </h2>

          <p>
            Provide income, turnover and financial
            information. GoSubsidy will use these figures
            for preliminary loan eligibility assessment.
          </p>
        </div>

      </div>

      {/* ==================================================
          SALARIED / INDIVIDUAL
      ================================================== */}

      {(isSalaried || isMortgage) && (

        <div className="dynamic-loan-section">

          <div className="dynamic-header">

            <i className="bi bi-wallet2"></i>

            <div>
              <small>
                INCOME PROFILE
              </small>

              <h5>
                Monthly Income & Expenses
              </h5>
            </div>

          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <label>
                Monthly Net Income *
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Monthly income"
                  value={data.monthlyIncome || ""}
                  onChange={(e) =>
                    update(
                      "monthlyIncome",
                      e.target.value
                    )
                  }
                />

              </div>

              {data.monthlyIncome && (
                <small className="form-hint">
                  ₹{formatMoney(data.monthlyIncome)}
                </small>
              )}

            </div>

            <div className="col-md-4">

              <label>
                Other Monthly Income
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Rental / other income"
                  value={
                    data.otherMonthlyIncome || ""
                  }
                  onChange={(e) =>
                    update(
                      "otherMonthlyIncome",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

              <label>
                Existing Monthly Obligations
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Existing EMIs"
                  value={
                    data.monthlyObligations || ""
                  }
                  onChange={(e) =>
                    update(
                      "monthlyObligations",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

              <label>
                Salary Credited Through
              </label>

              <select
                className="form-select"
                value={
                  data.salaryCreditMode || ""
                }
                onChange={(e) =>
                  update(
                    "salaryCreditMode",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Bank Account</option>
                <option>Cheque</option>
                <option>Cash</option>
                <option>Not Applicable</option>
              </select>

            </div>

            <div className="col-md-4">

              <label>
                Current Bank
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Primary bank"
                value={data.currentBank || ""}
                onChange={(e) =>
                  update(
                    "currentBank",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label>
                Banking Relationship
              </label>

              <div className="input-group">

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={
                    data.bankingVintage || ""
                  }
                  onChange={(e) =>
                    update(
                      "bankingVintage",
                      e.target.value
                    )
                  }
                />

                <span className="input-group-text">
                  Years
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          LIVE INDIVIDUAL ANALYSIS
      ================================================== */}

      {(isSalaried || isMortgage) && (

        <div className="financial-analysis-grid">

          <div className="financial-analysis-card">

            <small>
              TOTAL MONTHLY INCOME
            </small>

            <strong>
              ₹{formatMoney(totalMonthlyIncome)}
            </strong>

          </div>

          <div className="financial-analysis-card">

            <small>
              EXISTING OBLIGATIONS
            </small>

            <strong>
              ₹{formatMoney(monthlyObligations)}
            </strong>

          </div>

          <div className="financial-analysis-card">

            <small>
              AVAILABLE INCOME
            </small>

            <strong>
              ₹{formatMoney(availableIncome)}
            </strong>

          </div>

          <div className="financial-analysis-card">

            <small>
              CURRENT FOIR
            </small>

            <strong>
              {currentFOIR.toFixed(1)}%
            </strong>

          </div>

        </div>

      )}

      {/* ==================================================
          BUSINESS FINANCIALS
      ================================================== */}

      {isBusiness && (

        <div className="dynamic-loan-section">

          <div className="dynamic-header">

            <i className="bi bi-graph-up-arrow"></i>

            <div>
              <small>
                BUSINESS FINANCIALS
              </small>

              <h5>
                Turnover & Profitability
              </h5>
            </div>

          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <label>
                Annual Turnover *
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={
                    data.annualTurnover || ""
                  }
                  onChange={(e) =>
                    update(
                      "annualTurnover",
                      e.target.value
                    )
                  }
                />

              </div>

              {data.annualTurnover && (
                <small className="form-hint">
                  ₹{formatMoney(data.annualTurnover)}
                </small>
              )}

            </div>

            <div className="col-md-4">

              <label>
                Annual Net Profit *
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={
                    data.annualNetProfit || ""
                  }
                  onChange={(e) =>
                    update(
                      "annualNetProfit",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

              <label>
                Depreciation
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={
                    data.depreciation || ""
                  }
                  onChange={(e) =>
                    update(
                      "depreciation",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

              <label>
                Annual Interest Expense
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={
                    data.interestExpense || ""
                  }
                  onChange={(e) =>
                    update(
                      "interestExpense",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

              <label>
                ITR Filed For
              </label>

              <select
                className="form-select"
                value={
                  data.itrYears || ""
                }
                onChange={(e) =>
                  update(
                    "itrYears",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option value="0">
                  Not Filed
                </option>

                <option value="1">
                  1 Year
                </option>

                <option value="2">
                  2 Years
                </option>

                <option value="3">
                  3+ Years
                </option>
              </select>

            </div>

            <div className="col-md-4">

              <label>
                GST Return Status
              </label>

              <select
                className="form-select"
                value={
                  data.gstReturnStatus || ""
                }
                onChange={(e) =>
                  update(
                    "gstReturnStatus",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Regular</option>
                <option>Irregular</option>
                <option>Not Applicable</option>
              </select>

            </div>

          </div>

        </div>

      )}

      {/* BUSINESS LIVE ANALYSIS */}

      {isBusiness && (

        <div className="financial-analysis-grid">

          <div className="financial-analysis-card">

            <small>
              ANNUAL TURNOVER
            </small>

            <strong>
              ₹{formatMoney(annualTurnover)}
            </strong>

          </div>

          <div className="financial-analysis-card">

            <small>
              NET PROFIT
            </small>

            <strong>
              ₹{formatMoney(annualNetProfit)}
            </strong>

          </div>

          <div className="financial-analysis-card">

            <small>
              CASH ACCRUAL
            </small>

            <strong>
              ₹{formatMoney(businessCashAccrual)}
            </strong>

          </div>

          <div className="financial-analysis-card">

            <small>
              EST. EBITDA
            </small>

            <strong>
              ₹{formatMoney(estimatedEBITDA)}
            </strong>

          </div>

        </div>

      )}

      {/* ==================================================
          WORKING CAPITAL
      ================================================== */}

      {isWorkingCapital && (

        <div className="special-loan-box">

          <div className="special-title">

            <i className="bi bi-arrow-repeat"></i>

            Working Capital Assessment

          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <label>
                Inventory
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={data.inventory || ""}
                onChange={(e) =>
                  update(
                    "inventory",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label>
                Receivables
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={data.receivables || ""}
                onChange={(e) =>
                  update(
                    "receivables",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label>
                Creditors
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={data.creditors || ""}
                onChange={(e) =>
                  update(
                    "creditors",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-6">

              <label>
                Existing CC / OD Limit
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={
                  data.existingWorkingCapital || ""
                }
                onChange={(e) =>
                  update(
                    "existingWorkingCapital",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-6">

              <label>
                Requested Working Capital
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={
                  data.requestedWorkingCapital || ""
                }
                onChange={(e) =>
                  update(
                    "requestedWorkingCapital",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          SUBSIDY PROJECT FINANCE
      ================================================== */}

      {isSubsidy && (

        <div className="special-loan-box">

          <div className="special-title">

            <i className="bi bi-stars"></i>

            Project Finance Structure

          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <label>
                Total Project Cost
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={data.projectCost || ""}
                onChange={(e) =>
                  update(
                    "projectCost",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label>
                Own Contribution
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={
                  data.ownContribution || ""
                }
                onChange={(e) =>
                  update(
                    "ownContribution",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label>
                Expected Subsidy
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={
                  data.expectedSubsidy || ""
                }
                onChange={(e) =>
                  update(
                    "expectedSubsidy",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          EDUCATION
      ================================================== */}

      {isEducation && (

        <div className="dynamic-loan-section">

          <div className="dynamic-header">

            <i className="bi bi-mortarboard"></i>

            <div>
              <small>
                CO-APPLICANT FINANCIALS
              </small>

              <h5>
                Repayment Support
              </h5>
            </div>

          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <label>
                Co-Applicant Relationship
              </label>

              <select
                className="form-select"
                value={
                  data.coApplicantRelation || ""
                }
                onChange={(e) =>
                  update(
                    "coApplicantRelation",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Father</option>
                <option>Mother</option>
                <option>Spouse</option>
                <option>Guardian</option>
                <option>Other</option>
              </select>

            </div>

            <div className="col-md-4">

              <label>
                Co-Applicant Monthly Income
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={
                  data.coApplicantIncome || ""
                }
                onChange={(e) =>
                  update(
                    "coApplicantIncome",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label>
                Existing Monthly EMI
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={
                  data.coApplicantEMI || ""
                }
                onChange={(e) =>
                  update(
                    "coApplicantEMI",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          INFORMATION
      ================================================== */}

      <div className="kyc-security-notice mt-4">

        <i className="bi bi-cpu-fill"></i>

        <div>

          <strong>
            GoSubsidy Financial Intelligence
          </strong>

          <p>
            These figures are used for preliminary
            assessment only. Final eligibility, eligible
            loan amount, interest rate and sanction are
            determined by the respective lender after
            verification and underwriting.
          </p>

        </div>

      </div>

    </div>
  );
}