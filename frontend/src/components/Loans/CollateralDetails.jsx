import React from "react";

export default function CollateralDetails({
  loanType,
  data = {},
  onChange,
}) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const securedLoans = [
    "Home Loan",
    "Mortgage / LAP",
    "Project Finance",
    "Machinery Loan",
    "Business Loan",
    "Solar / Green Finance",
  ];

  const mayRequireSecurity = securedLoans.includes(loanType);

  return (
    <div className="application-form-card">

      <div className="application-section-title">
        <div className="section-number">07</div>

        <div>
          <span>SECURITY</span>
          <h2>Collateral & Security</h2>
          <p>
            Provide details of security available for the proposed
            loan, where applicable.
          </p>
        </div>
      </div>

      {!mayRequireSecurity && (
        <div className="kyc-security-notice">
          <i className="bi bi-info-circle"></i>

          <div>
            <strong>Collateral may not be mandatory</strong>
            <p>
              The selected facility may be considered on an
              unsecured basis depending on lender policy,
              applicant profile and applicable scheme.
            </p>
          </div>
        </div>
      )}

      <div className="row g-3 mt-1">

        <div className="col-md-4">
          <label>Collateral Available?</label>

          <select
            className="form-select"
            value={data.collateralAvailable || ""}
            onChange={(e) =>
              update("collateralAvailable", e.target.value)
            }
          >
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {data.collateralAvailable === "Yes" && (
          <>
            <div className="col-md-4">
              <label>Security Type</label>

              <select
                className="form-select"
                value={data.securityType || ""}
                onChange={(e) =>
                  update("securityType", e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Residential Property</option>
                <option>Commercial Property</option>
                <option>Industrial Property</option>
                <option>Agricultural Land</option>
                <option>Plant & Machinery</option>
                <option>Fixed Deposit</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Estimated Market Value</label>

              <div className="input-group">
                <span className="input-group-text">₹</span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={data.marketValue || ""}
                  onChange={(e) =>
                    update("marketValue", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <label>Property / Asset Owner</label>

              <input
                className="form-control"
                placeholder="Name of owner"
                value={data.assetOwner || ""}
                onChange={(e) =>
                  update("assetOwner", e.target.value)
                }
              />
            </div>

            <div className="col-md-6">
              <label>Relationship with Applicant</label>

              <select
                className="form-select"
                value={data.ownerRelationship || ""}
                onChange={(e) =>
                  update("ownerRelationship", e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Self</option>
                <option>Spouse</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Partner</option>
                <option>Director</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Property Location</label>

              <input
                className="form-control"
                value={data.propertyLocation || ""}
                onChange={(e) =>
                  update("propertyLocation", e.target.value)
                }
              />
            </div>

            <div className="col-md-3">
              <label>Already Mortgaged?</label>

              <select
                className="form-select"
                value={data.alreadyMortgaged || ""}
                onChange={(e) =>
                  update("alreadyMortgaged", e.target.value)
                }
              >
                <option value="">Select</option>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Clear Title?</label>

              <select
                className="form-select"
                value={data.clearTitle || ""}
                onChange={(e) =>
                  update("clearTitle", e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
                <option>To Be Verified</option>
              </select>
            </div>
          </>
        )}

      </div>
    </div>
  );
}