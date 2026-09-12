import React from "react";

export default function DocumentUpload({
  loanType,
  data = {},
  onChange,
}) {
  const documents = data.documents || {};

  const updateDocument = (key, file) => {
    onChange({
      ...data,
      documents: {
        ...documents,
        [key]: file || null,
      },
    });
  };

  const commonDocs = [
    ["pan", "PAN Card"],
    ["aadhaar", "Aadhaar / Identity Proof"],
    ["address", "Address Proof"],
    ["bankStatement", "Bank Statement"],
  ];

  const businessDocs = [
    ["businessProof", "Business Registration Proof"],
    ["itr", "Income Tax Returns"],
    ["gst", "GST Returns / GST Registration"],
    ["financials", "Financial Statements"],
  ];

  const projectDocs = [
    ["projectReport", "Project Report / DPR"],
    ["quotations", "Machinery / Project Quotations"],
  ];

  const businessTypes = [
    "Business Loan",
    "Working Capital",
    "Subsidy Linked Loan",
    "Project Finance",
    "Machinery Loan",
    "Solar / Green Finance",
  ];

  let requiredDocs = [...commonDocs];

  if (businessTypes.includes(loanType)) {
    requiredDocs = [...requiredDocs, ...businessDocs];
  }

  if (
    ["Subsidy Linked Loan", "Project Finance", "Machinery Loan"]
      .includes(loanType)
  ) {
    requiredDocs = [...requiredDocs, ...projectDocs];
  }

  return (
    <div className="application-form-card">

      <div className="application-section-title">
        <div className="section-number">10</div>

        <div>
          <span>DOCUMENTATION</span>
          <h2>Upload Documents</h2>
          <p>
            Upload supporting documents required for preliminary
            application processing.
          </p>
        </div>
      </div>

      <div className="row g-3">

        {requiredDocs.map(([key, label]) => (
          <div className="col-md-6" key={key}>

            <div className="dynamic-loan-section h-100">

              <label className="fw-semibold">
                {label}
              </label>

              <input
                type="file"
                className="form-control mt-2"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  updateDocument(
                    key,
                    e.target.files?.[0] || null
                  )
                }
              />

              {documents[key] && (
                <div className="mt-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <small>{documents[key].name}</small>
                </div>
              )}

            </div>

          </div>
        ))}

      </div>

      <div className="kyc-security-notice mt-4">
        <i className="bi bi-lock-fill"></i>

        <div>
          <strong>Document Security</strong>
          <p>
            Do not expose identity documents through public URLs.
            Production uploads should use authenticated storage,
            access controls and appropriate retention policies.
          </p>
        </div>
      </div>

    </div>
  );
}