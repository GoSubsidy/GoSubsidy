import React, { useMemo } from "react";

export default function LoanEligibilityEngine({
  loanType,
  applicantData = {},
  financialData = {},
  existingLoansData = {},
  creditData = {},
  collateralData = {},
  onResult,
}) {
  const result = useMemo(() => {
    let score = 50;
    const positives = [];
    const concerns = [];

    const creditScore = Number(creditData.creditScore || 0);

    const income =
      Number(financialData.monthlyIncome || 0) +
      Number(financialData.otherMonthlyIncome || 0);

    const declaredEMI = (existingLoansData.loans || []).reduce(
      (sum, loan) => sum + Number(loan.emi || 0),
      0
    );

    const foir =
      income > 0
        ? (declaredEMI / income) * 100
        : 0;

    if (creditScore >= 750) {
      score += 20;
      positives.push("Strong declared credit score");
    } else if (creditScore >= 700) {
      score += 12;
      positives.push("Good declared credit score");
    } else if (creditScore > 0 && creditScore < 650) {
      score -= 20;
      concerns.push("Lower declared credit score");
    }

    if (income > 0 && foir <= 40) {
      score += 15;
      positives.push("Comfortable existing EMI burden");
    } else if (foir > 55) {
      score -= 15;
      concerns.push("High existing EMI burden");
    }

    if (creditData.recentDelay === "Yes") {
      score -= 12;
      concerns.push("Recent repayment delay declared");
    }

    if (creditData.loanSettlement === "Yes") {
      score -= 15;
      concerns.push("Past loan settlement declared");
    }

    if (creditData.writeOff === "Yes") {
      score -= 20;
      concerns.push("Written-off account declared");
    }

    if (collateralData.collateralAvailable === "Yes") {
      score += 5;
      positives.push("Collateral/security available");
    }

    if (
      applicantData.employmentType ||
      financialData.annualTurnover
    ) {
      score += 5;
    }

    score = Math.max(0, Math.min(100, score));

    let status = "Needs Detailed Review";

    if (score >= 80) status = "Strong Preliminary Profile";
    else if (score >= 65) status = "Potentially Eligible";
    else if (score >= 50) status = "Conditional Review";

    return {
      score,
      status,
      foir,
      positives,
      concerns,
    };
  }, [
    applicantData,
    financialData,
    existingLoansData,
    creditData,
    collateralData,
  ]);

  React.useEffect(() => {
    if (onResult) onResult(result);
  }, [result, onResult]);

  return (
    <div className="application-form-card">

      <div className="application-section-title">
        <div className="section-number">08</div>

        <div>
          <span>PRELIMINARY UNDERWRITING</span>
          <h2>Loan Eligibility Analysis</h2>
          <p>
            Automated preliminary assessment based on information
            entered by the applicant.
          </p>
        </div>
      </div>

      <div className="text-center py-4">
        <div
          style={{
            fontSize: "3rem",
            fontWeight: 800,
          }}
        >
          {result.score}/100
        </div>

        <h4>{result.status}</h4>

        <p className="text-muted">
          Selected Product: {loanType || "Not Selected"}
        </p>
      </div>

      <div className="financial-analysis-grid">

        <div className="financial-analysis-card">
          <small>PROFILE SCORE</small>
          <strong>{result.score}</strong>
        </div>

        <div className="financial-analysis-card">
          <small>DECLARED FOIR</small>
          <strong>{result.foir.toFixed(1)}%</strong>
        </div>

        <div className="financial-analysis-card">
          <small>POSITIVE FACTORS</small>
          <strong>{result.positives.length}</strong>
        </div>

        <div className="financial-analysis-card">
          <small>REVIEW FACTORS</small>
          <strong>{result.concerns.length}</strong>
        </div>

      </div>

      <div className="row g-3 mt-3">

        <div className="col-md-6">
          <div className="special-loan-box h-100">
            <h5>
              <i className="bi bi-check-circle-fill me-2"></i>
              Positive Factors
            </h5>

            {result.positives.length ? (
              result.positives.map((item, index) => (
                <p key={index}>✓ {item}</p>
              ))
            ) : (
              <p>More financial information is required.</p>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="special-loan-box h-100">
            <h5>
              <i className="bi bi-exclamation-circle me-2"></i>
              Review Factors
            </h5>

            {result.concerns.length ? (
              result.concerns.map((item, index) => (
                <p key={index}>• {item}</p>
              ))
            ) : (
              <p>No major declared concerns identified.</p>
            )}
          </div>
        </div>

      </div>

      <div className="kyc-security-notice mt-4">
        <i className="bi bi-info-circle"></i>
        <div>
          <strong>Preliminary Assessment Only</strong>
          <p>
            This score is not a sanction, approval or guarantee.
            Actual eligibility depends on lender underwriting,
            bureau verification, documentation and applicable
            lending policies.
          </p>
        </div>
      </div>

    </div>
  );
}