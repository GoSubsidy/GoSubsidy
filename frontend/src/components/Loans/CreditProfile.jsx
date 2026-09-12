import React from "react";

export default function CreditProfile({ data = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const score = Number(data.creditScore || 0);

  const scoreStatus = () => {
    if (!score) return "Not Assessed";
    if (score >= 750) return "Strong";
    if (score >= 700) return "Good";
    if (score >= 650) return "Moderate";
    return "Needs Review";
  };

  return (
    <div className="application-form-card">

      <div className="application-section-title">
        <div className="section-number">06</div>

        <div>
          <span>CREDIT ASSESSMENT</span>
          <h2>Credit Profile</h2>
          <p>
            Provide available credit-history information for
            preliminary loan assessment.
          </p>
        </div>
      </div>

      <div className="form-section">
        <div className="row g-3">

          <div className="col-md-4">
            <label>Credit Score Available?</label>

            <select
              className="form-select"
              value={data.scoreAvailable || ""}
              onChange={(e) =>
                update("scoreAvailable", e.target.value)
              }
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not Sure</option>
            </select>
          </div>

          {data.scoreAvailable === "Yes" && (
            <div className="col-md-4">
              <label>Credit Score</label>

              <input
                type="number"
                min="300"
                max="900"
                className="form-control"
                placeholder="300 - 900"
                value={data.creditScore || ""}
                onChange={(e) =>
                  update("creditScore", e.target.value)
                }
              />

              {score > 0 && (
                <small className="form-hint">
                  Assessment: {scoreStatus()}
                </small>
              )}
            </div>
          )}

          <div className="col-md-4">
            <label>Credit History</label>

            <select
              className="form-select"
              value={data.creditHistory || ""}
              onChange={(e) =>
                update("creditHistory", e.target.value)
              }
            >
              <option value="">Select</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
              <option>New to Credit</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Any EMI Delay in Last 12 Months?</label>

            <select
              className="form-select"
              value={data.recentDelay || ""}
              onChange={(e) =>
                update("recentDelay", e.target.value)
              }
            >
              <option value="">Select</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Any Loan Settlement?</label>

            <select
              className="form-select"
              value={data.loanSettlement || ""}
              onChange={(e) =>
                update("loanSettlement", e.target.value)
              }
            >
              <option value="">Select</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Any Written-Off Account?</label>

            <select
              className="form-select"
              value={data.writeOff || ""}
              onChange={(e) =>
                update("writeOff", e.target.value)
              }
            >
              <option value="">Select</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Credit Cards</label>

            <input
              type="number"
              min="0"
              className="form-control"
              value={data.creditCards || ""}
              onChange={(e) =>
                update("creditCards", e.target.value)
              }
            />
          </div>

          <div className="col-md-4">
            <label>Total Credit Card Limit</label>

            <div className="input-group">
              <span className="input-group-text">₹</span>

              <input
                type="number"
                min="0"
                className="form-control"
                value={data.totalCardLimit || ""}
                onChange={(e) =>
                  update("totalCardLimit", e.target.value)
                }
              />
            </div>
          </div>

          <div className="col-md-4">
            <label>Current Card Outstanding</label>

            <div className="input-group">
              <span className="input-group-text">₹</span>

              <input
                type="number"
                min="0"
                className="form-control"
                value={data.cardOutstanding || ""}
                onChange={(e) =>
                  update("cardOutstanding", e.target.value)
                }
              />
            </div>
          </div>

        </div>
      </div>

      <div className="kyc-security-notice mt-4">
        <i className="bi bi-shield-check"></i>

        <div>
          <strong>Credit Bureau Verification</strong>
          <p>
            Applicant-entered credit information is indicative.
            Final underwriting should use authorised credit-bureau
            data and lender verification.
          </p>
        </div>
      </div>

    </div>
  );
}