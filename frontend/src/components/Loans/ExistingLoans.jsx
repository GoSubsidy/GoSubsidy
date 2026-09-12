import React from "react";

export default function ExistingLoans({
  data,
  onChange,
}) {
  const loans = data.loans || [];

  const number = (value) =>
    Number(String(value || "").replace(/,/g, "")) || 0;

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(number(value));

  // ======================================================
  // YES / NO
  // ======================================================

  const setHasExistingLoans = (value) => {
    onChange({
      ...data,
      hasExistingLoans: value,
      loans:
        value === "Yes"
          ? loans.length
            ? loans
            : [createBlankLoan()]
          : [],
    });
  };

  // ======================================================
  // BLANK LOAN
  // ======================================================

  function createBlankLoan() {
    return {
      id:
        Date.now() +
        Math.random(),

      loanType: "",
      lenderName: "",
      sanctionedAmount: "",
      outstandingAmount: "",
      emi: "",
      interestRate: "",
      remainingTenure: "",
      repaymentStatus: "Regular",
    };
  }

  // ======================================================
  // ADD LOAN
  // ======================================================

  const addLoan = () => {
    onChange({
      ...data,
      hasExistingLoans: "Yes",
      loans: [
        ...loans,
        createBlankLoan(),
      ],
    });
  };

  // ======================================================
  // UPDATE LOAN
  // ======================================================

  const updateLoan = (
    index,
    field,
    value
  ) => {
    const updatedLoans = [...loans];

    updatedLoans[index] = {
      ...updatedLoans[index],
      [field]: value,
    };

    onChange({
      ...data,
      loans: updatedLoans,
    });
  };

  // ======================================================
  // REMOVE
  // ======================================================

  const removeLoan = (index) => {
    const updatedLoans =
      loans.filter(
        (_, loanIndex) =>
          loanIndex !== index
      );

    onChange({
      ...data,
      loans: updatedLoans,
      hasExistingLoans:
        updatedLoans.length
          ? "Yes"
          : "No",
    });
  };

  // ======================================================
  // TOTALS
  // ======================================================

  const totalSanctioned =
    loans.reduce(
      (total, loan) =>
        total +
        number(loan.sanctionedAmount),
      0
    );

  const totalOutstanding =
    loans.reduce(
      (total, loan) =>
        total +
        number(loan.outstandingAmount),
      0
    );

  const totalEMI =
    loans.reduce(
      (total, loan) =>
        total +
        number(loan.emi),
      0
    );

  return (
    <div className="application-form-card">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="application-section-title">

        <div className="section-number">
          05
        </div>

        <div>

          <span>
            CREDIT OBLIGATIONS
          </span>

          <h2>
            Existing Loans & Liabilities
          </h2>

          <p>
            Tell us about your current loans and monthly
            repayment commitments. These obligations are
            important for repayment-capacity assessment.
          </p>

        </div>

      </div>

      {/* ==================================================
          EXISTING LOAN QUESTION
      ================================================== */}

      <div className="form-section">

        <h5>
          <i className="bi bi-bank me-2"></i>
          Current Borrowings
        </h5>

        <label className="mb-2">
          Do you currently have any loans,
          credit facilities or EMIs?
        </label>

        <div className="d-flex gap-3 flex-wrap">

          <button
            type="button"
            className={
              data.hasExistingLoans === "No"
                ? "btn btn-primary px-4"
                : "btn btn-outline-secondary px-4"
            }
            onClick={() =>
              setHasExistingLoans("No")
            }
          >
            <i className="bi bi-check-circle me-2"></i>
            No Existing Loans
          </button>

          <button
            type="button"
            className={
              data.hasExistingLoans === "Yes"
                ? "btn btn-primary px-4"
                : "btn btn-outline-secondary px-4"
            }
            onClick={() =>
              setHasExistingLoans("Yes")
            }
          >
            <i className="bi bi-credit-card me-2"></i>
            Yes, I Have Loans
          </button>

        </div>

      </div>

      {/* ==================================================
          NO LOANS
      ================================================== */}

      {data.hasExistingLoans === "No" && (

        <div className="loan-selected-message">

          <div className="loan-selected-check">
            <i className="bi bi-check-lg"></i>
          </div>

          <div>

            <small>
              NO CURRENT OBLIGATIONS
            </small>

            <strong>
              No existing loan declared
            </strong>

            <p>
              The application will proceed with zero
              declared existing monthly loan EMI.
            </p>

          </div>

        </div>

      )}

      {/* ==================================================
          LOANS
      ================================================== */}

      {data.hasExistingLoans === "Yes" && (

        <>

          {loans.map((loan, index) => (

            <div
              className="dynamic-loan-section mb-4"
              key={loan.id || index}
            >

              {/* HEADER */}

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div className="dynamic-header mb-0">

                  <i className="bi bi-credit-card-2-front"></i>

                  <div>

                    <small>
                      EXISTING FACILITY
                    </small>

                    <h5 className="mb-0">
                      Loan {index + 1}
                    </h5>

                  </div>

                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() =>
                    removeLoan(index)
                  }
                >
                  <i className="bi bi-trash3 me-1"></i>
                  Remove
                </button>

              </div>

              {/* FIELDS */}

              <div className="row g-3">

                <div className="col-md-4">

                  <label>
                    Loan / Facility Type *
                  </label>

                  <select
                    className="form-select"
                    value={loan.loanType}
                    onChange={(e) =>
                      updateLoan(
                        index,
                        "loanType",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    <option>
                      Personal Loan
                    </option>

                    <option>
                      Home Loan
                    </option>

                    <option>
                      Business Loan
                    </option>

                    <option>
                      Vehicle Loan
                    </option>

                    <option>
                      Education Loan
                    </option>

                    <option>
                      Mortgage / LAP
                    </option>

                    <option>
                      Machinery Loan
                    </option>

                    <option>
                      Term Loan
                    </option>

                    <option>
                      Cash Credit
                    </option>

                    <option>
                      Overdraft
                    </option>

                    <option>
                      Credit Card
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

                <div className="col-md-4">

                  <label>
                    Bank / Lender *
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Bank / NBFC"
                    value={loan.lenderName}
                    onChange={(e) =>
                      updateLoan(
                        index,
                        "lenderName",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-md-4">

                  <label>
                    Sanctioned Amount
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
                        loan.sanctionedAmount
                      }
                      onChange={(e) =>
                        updateLoan(
                          index,
                          "sanctionedAmount",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="col-md-4">

                  <label>
                    Current Outstanding *
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
                        loan.outstandingAmount
                      }
                      onChange={(e) =>
                        updateLoan(
                          index,
                          "outstandingAmount",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="col-md-4">

                  <label>
                    Monthly EMI *
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={loan.emi}
                      onChange={(e) =>
                        updateLoan(
                          index,
                          "emi",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="col-md-4">

                  <label>
                    Interest Rate
                  </label>

                  <div className="input-group">

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      value={
                        loan.interestRate
                      }
                      onChange={(e) =>
                        updateLoan(
                          index,
                          "interestRate",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-group-text">
                      %
                    </span>

                  </div>

                </div>

                <div className="col-md-6">

                  <label>
                    Remaining Tenure
                  </label>

                  <div className="input-group">

                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={
                        loan.remainingTenure
                      }
                      onChange={(e) =>
                        updateLoan(
                          index,
                          "remainingTenure",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-group-text">
                      Months
                    </span>

                  </div>

                </div>

                <div className="col-md-6">

                  <label>
                    Repayment Status
                  </label>

                  <select
                    className="form-select"
                    value={
                      loan.repaymentStatus
                    }
                    onChange={(e) =>
                      updateLoan(
                        index,
                        "repaymentStatus",
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Regular
                    </option>

                    <option>
                      Occasional Delay
                    </option>

                    <option>
                      Overdue
                    </option>

                    <option>
                      Restructured
                    </option>

                    <option>
                      Settled
                    </option>

                    <option>
                      Closed
                    </option>

                  </select>

                </div>

              </div>

            </div>

          ))}

          {/* ADD ANOTHER */}

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addLoan}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Another Loan
          </button>

          {/* ==================================================
              TOTALS
          ================================================== */}

          <div className="financial-analysis-grid mt-4">

            <div className="financial-analysis-card">

              <small>
                TOTAL SANCTIONED
              </small>

              <strong>
                ₹{money(totalSanctioned)}
              </strong>

            </div>

            <div className="financial-analysis-card">

              <small>
                TOTAL OUTSTANDING
              </small>

              <strong>
                ₹{money(totalOutstanding)}
              </strong>

            </div>

            <div className="financial-analysis-card">

              <small>
                TOTAL MONTHLY EMI
              </small>

              <strong>
                ₹{money(totalEMI)}
              </strong>

            </div>

            <div className="financial-analysis-card">

              <small>
                ACTIVE FACILITIES
              </small>

              <strong>
                {loans.length}
              </strong>

            </div>

          </div>

        </>

      )}

      {/* ==================================================
          CREDIT HISTORY
      ================================================== */}

      <div className="form-section mt-4">

        <h5>
          <i className="bi bi-speedometer2 me-2"></i>
          Credit Profile
        </h5>

        <div className="row g-3">

          <div className="col-md-4">

            <label>
              Do You Know Your Credit Score?
            </label>

            <select
              className="form-select"
              value={
                data.knowsCreditScore || ""
              }
              onChange={(e) =>
                onChange({
                  ...data,
                  knowsCreditScore:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select
              </option>

              <option>Yes</option>
              <option>No</option>

            </select>

          </div>

          {data.knowsCreditScore === "Yes" && (

            <div className="col-md-4">

              <label>
                Credit Score
              </label>

              <input
                type="number"
                min="300"
                max="900"
                className="form-control"
                placeholder="300 - 900"
                value={
                  data.creditScore || ""
                }
                onChange={(e) =>
                  onChange({
                    ...data,
                    creditScore:
                      e.target.value,
                  })
                }
              />

            </div>

          )}

          <div className="col-md-4">

            <label>
              Any Past Loan Default?
            </label>

            <select
              className="form-select"
              value={
                data.pastDefault || ""
              }
              onChange={(e) =>
                onChange({
                  ...data,
                  pastDefault:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select
              </option>

              <option>No</option>
              <option>Yes</option>

            </select>

          </div>

        </div>

      </div>

      {/* NOTICE */}

      <div className="kyc-security-notice mt-4">

        <i className="bi bi-info-circle-fill"></i>

        <div>

          <strong>
            Credit Assessment
          </strong>

          <p>
            Declared liabilities are used only for
            preliminary assessment. Actual credit
            obligations and repayment history should be
            verified through lender-approved documentation
            and authorised credit bureau processes.
          </p>

        </div>

      </div>

    </div>
  );
}