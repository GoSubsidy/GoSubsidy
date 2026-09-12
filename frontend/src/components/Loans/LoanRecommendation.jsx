import React, { useMemo } from "react";

export default function LoanRecommendation({
  selectedLoan,
  financialData = {},
  eligibilityResult = {},
}) {
  const recommendations = useMemo(() => {
    const items = [];

    if (selectedLoan) {
      items.push({
        title: selectedLoan,
        reason: "Matches your selected financing requirement.",
        priority: "Primary Recommendation",
      });
    }

    const turnover = Number(financialData.annualTurnover || 0);

    if (turnover > 0 && selectedLoan !== "Business Loan") {
      items.push({
        title: "Business Loan",
        reason:
          "Business turnover has been declared and may support business financing assessment.",
        priority: "Alternative",
      });
    }

    if (turnover > 0) {
      items.push({
        title: "Working Capital",
        reason:
          "May be suitable for operating-cycle and short-term business requirements.",
        priority: "Alternative",
      });
    }

    if (
      financialData.projectCost ||
      selectedLoan === "Subsidy Linked Loan"
    ) {
      items.push({
        title: "Subsidy Linked Loan",
        reason:
          "Project-based financing may be assessed alongside applicable government schemes.",
        priority: "Scheme Opportunity",
      });
    }

    return items.filter(
      (item, index, array) =>
        array.findIndex((x) => x.title === item.title) === index
    );
  }, [selectedLoan, financialData]);

  return (
    <div className="application-form-card">
      <div className="application-section-title">
        <div className="section-number">08</div>

        <div>
          <span>SMART MATCHING</span>
          <h2>Loan Recommendation</h2>
          <p>
            GoSubsidy identifies suitable financing options from the
            information provided.
          </p>
        </div>
      </div>

      {recommendations.map((item) => (
        <div
          className="dynamic-loan-section mb-3"
          key={item.title}
        >
          <div>
            <small>{item.priority}</small>
            <h4>{item.title}</h4>
            <p>{item.reason}</p>
          </div>
        </div>
      ))}

      {eligibilityResult.status && (
        <div className="loan-selected-message mt-4">
          <div className="loan-selected-check">
            <i className="bi bi-stars"></i>
          </div>

          <div>
            <small>PROFILE ASSESSMENT</small>
            <strong>{eligibilityResult.status}</strong>
            <p>
              Profile Score: {eligibilityResult.score || 0}/100
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-4 border bg-light">
        <div className="d-flex align-items-start gap-3">
          <div className="loan-selected-check">
            <i className="bi bi-building"></i>
          </div>

          <div>
            <small className="text-primary fw-bold">
              LENDER JOURNEY
            </small>
            <h5 className="mb-1 mt-1">
              Your next step is LenderHub
            </h5>
            <p className="mb-0 text-muted">
              You do not need to select a recommendation here.
              GoSubsidy will take you to the lender portal after the
              required KYC process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}