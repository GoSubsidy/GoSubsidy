import React, { useState } from "react";

export default function LoanEligibilityCalculator() {

  const [form, setForm] = useState({
    projectCost: "",
    turnover: "",
    existingLoan: "",
    cibil: "",
    businessAge: "",
    collateral: "No",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculateEligibility = () => {

    const project = Number(form.projectCost);
    const existing = Number(form.existingLoan);
    const cibil = Number(form.cibil);

    let eligible = 0;
    let interest = 10.5;
    let recommendation = "Moderate";

    if (cibil >= 750) {
      eligible = project * 0.80;
      interest = 8.5;
      recommendation = "Excellent";
    } else if (cibil >= 700) {
      eligible = project * 0.70;
      interest = 9.5;
      recommendation = "Good";
    } else if (cibil >= 650) {
      eligible = project * 0.60;
      interest = 11;
      recommendation = "Average";
    } else {
      eligible = project * 0.40;
      interest = 13;
      recommendation = "Needs Improvement";
    }

    eligible -= existing;

    if (eligible < 0) eligible = 0;

    const emi =
      (eligible * (interest / 100 / 12)) /
      (1 - Math.pow(1 + interest / 100 / 12, -84));

    setResult({
      eligible,
      interest,
      emi,
      recommendation,
    });
  };

  return (
    <div className="card shadow-lg border-0 rounded-4">

      <div className="card-body p-5">

        <h3 className="fw-bold mb-4">

          Loan Eligibility Calculator

        </h3>

        <div className="row g-3">

          <div className="col-md-6">

            <label>Project Cost</label>

            <input
              type="number"
              name="projectCost"
              className="form-control"
              onChange={handleChange}
            />

          </div>

          <div className="col-md-6">

            <label>Annual Turnover</label>

            <input
              type="number"
              name="turnover"
              className="form-control"
              onChange={handleChange}
            />

          </div>

          <div className="col-md-6">

            <label>Existing Loan</label>

            <input
              type="number"
              name="existingLoan"
              className="form-control"
              onChange={handleChange}
            />

          </div>

          <div className="col-md-6">

            <label>CIBIL Score</label>

            <input
              type="number"
              name="cibil"
              className="form-control"
              onChange={handleChange}
            />

          </div>

          <div className="col-md-6">

            <label>Business Age (Years)</label>

            <input
              type="number"
              name="businessAge"
              className="form-control"
              onChange={handleChange}
            />

          </div>

          <div className="col-md-6">

            <label>Collateral Available</label>

            <select
              name="collateral"
              className="form-select"
              onChange={handleChange}
            >
              <option>No</option>
              <option>Yes</option>
            </select>

          </div>

        </div>

        <button
          className="btn btn-primary btn-lg mt-4"
          onClick={calculateEligibility}
        >
          Check Eligibility
        </button>

        {result && (

          <div className="alert alert-success mt-5">

            <h4 className="fw-bold">

              Eligibility Result

            </h4>

            <hr />

            <p>

              <strong>Eligible Loan Amount:</strong>{" "}
              ₹{result.eligible.toLocaleString()}

            </p>

            <p>

              <strong>Estimated Interest:</strong>{" "}
              {result.interest}%

            </p>

            <p>

              <strong>Estimated EMI:</strong>{" "}
              ₹{result.emi.toFixed(0).toLocaleString()}

            </p>

            <p>

              <strong>Recommendation:</strong>{" "}
              {result.recommendation}

            </p>

          </div>

        )}

      </div>

    </div>
  );
}