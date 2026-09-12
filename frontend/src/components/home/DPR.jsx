import React, { useMemo, useState } from "react";
import "../../styles/DPR.css";


export default function DPR() {
  const [form, setForm] = useState({
    projectName: "",
    business: "",
    promoterName: "",
    state: "",
    district: "",
    projectCost: "",
    ownContributionPercent: 10,
    subsidyPercent: 25,
    interestRate: 10,
    tenure: 7,
    expectedSales: "",
    operatingExpenses: "",
    employees: "",
    description: "",
  });

  const [showReport, setShowReport] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CURRENCY FORMAT
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // =====================================================
  // FINANCIAL CALCULATIONS
  // =====================================================

  const financials = useMemo(() => {
    const projectCost = Number(form.projectCost) || 0;

    const ownContribution =
      (projectCost *
        (Number(form.ownContributionPercent) || 0)) /
      100;

    const subsidy =
      (projectCost * (Number(form.subsidyPercent) || 0)) /
      100;

    const bankLoan = Math.max(
      0,
      projectCost - ownContribution - subsidy
    );

    const annualInterest =
      Number(form.interestRate) || 0;

    const tenureYears =
      Number(form.tenure) || 0;

    const months = tenureYears * 12;

    const monthlyRate =
      annualInterest / 12 / 100;

    let emi = 0;

    if (bankLoan > 0 && months > 0) {
      if (monthlyRate === 0) {
        emi = bankLoan / months;
      } else {
        const factor = Math.pow(
          1 + monthlyRate,
          months
        );

        emi =
          (bankLoan * monthlyRate * factor) /
          (factor - 1);
      }
    }

    const annualDebtService = emi * 12;

    const annualSales =
      Number(form.expectedSales) || 0;

    const operatingExpenses =
      Number(form.operatingExpenses) || 0;

    const operatingSurplus = Math.max(
      0,
      annualSales - operatingExpenses
    );

    const estimatedProfit =
      annualSales - operatingExpenses;

    const profitMargin =
      annualSales > 0
        ? (estimatedProfit / annualSales) * 100
        : 0;

    const estimatedDSCR =
      annualDebtService > 0
        ? operatingSurplus / annualDebtService
        : 0;

    const totalRepayment = emi * months;

    const totalInterest = Math.max(
      0,
      totalRepayment - bankLoan
    );

    return {
      projectCost,
      ownContribution,
      subsidy,
      bankLoan,
      emi,
      months,
      annualDebtService,
      annualSales,
      operatingExpenses,
      estimatedProfit,
      profitMargin,
      estimatedDSCR,
      totalRepayment,
      totalInterest,
    };
  }, [form]);

  // =====================================================
  // GENERATE PREVIEW
  // =====================================================

  const generateDPR = (e) => {
    e.preventDefault();

    if (!form.projectName.trim()) {
      alert("Please enter Project Name.");
      return;
    }

    if (!form.business) {
      alert("Please select Business / Sector.");
      return;
    }

    if (!form.state) {
      alert("Please select State.");
      return;
    }

    if (
      !form.projectCost ||
      Number(form.projectCost) <= 0
    ) {
      alert("Please enter a valid Project Cost.");
      return;
    }

    setShowReport(true);

    setTimeout(() => {
      document
        .getElementById("dpr-preview")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  return (
    <div className="dpr-page">
      <div className="dpr-background-grid" aria-hidden="true" />
      <div className="dpr-orb dpr-orb-one" aria-hidden="true" />
      <div className="dpr-orb dpr-orb-two" aria-hidden="true" />
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="dpr-hero">
        <div className="container dpr-container py-4">

          <div className="row align-items-center g-4">

            <div className="col-lg-8">

              <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3">
                GOSUBSIDY DPR
              </span>

              <h1 className="display-5 fw-bold">
                Detailed Project Report
              </h1>

              <p className="dpr-hero-copy">
                Prepare project information, financing,
                subsidy estimates and financial projections
                for your business proposal.
              </p>

            </div>

            <div className="col-lg-4 d-flex justify-content-lg-end justify-content-center">

              <div
                className="dpr-hero-icon"
              >
                <i className="bi bi-file-earmark-text"></i>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          DPR FORM
      ================================================= */}

      <section className="dpr-workspace">

        <div className="container dpr-container">

          <div className="dpr-progress-strip">
            <div className="dpr-progress-step active">
              <span>01</span>
              <strong>Project Profile</strong>
            </div>
            <div className="dpr-progress-line" />
            <div className="dpr-progress-step">
              <span>02</span>
              <strong>Finance</strong>
            </div>
            <div className="dpr-progress-line" />
            <div className="dpr-progress-step">
              <span>03</span>
              <strong>Projections</strong>
            </div>
            <div className="dpr-progress-line" />
            <div className="dpr-progress-step">
              <span>04</span>
              <strong>Preview</strong>
            </div>
          </div>

          <form onSubmit={generateDPR}>

            <div className="row g-4">

              {/* =========================================
                  LEFT
              ========================================= */}

              <div className="col-lg-8">

                {/* PROJECT PROFILE */}

                <DPRCard
                  icon="bi-building"
                  title="1. Project Profile"
                >

                  <div className="row g-3">

                    <Input
                      label="Project Name"
                      name="projectName"
                      value={form.projectName}
                      onChange={handleChange}
                      placeholder="Example: Integrated Dairy Processing Unit"
                      required
                    />

                    <Select
                      label="Business / Sector"
                      name="business"
                      value={form.business}
                      onChange={handleChange}
                      options={[
                        "Agriculture",
                        "Poultry",
                        "Dairy",
                        "Food Processing",
                        "MSME",
                        "Manufacturing",
                        "Solar",
                        "Cold Chain",
                        "Warehouse",
                        "Other",
                      ]}
                    />

                    <Input
                      label="Promoter / Applicant Name"
                      name="promoterName"
                      value={form.promoterName}
                      onChange={handleChange}
                      placeholder="Applicant / Company Name"
                    />

                    <Select
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      options={[
                        "Andhra Pradesh",
                        "Telangana",
                        "Karnataka",
                        "Tamil Nadu",
                        "Kerala",
                        "Maharashtra",
                        "Gujarat",
                        "Rajasthan",
                        "Madhya Pradesh",
                        "Uttar Pradesh",
                      ]}
                    />

                    <Input
                      label="District"
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      placeholder="District"
                    />

                    <Input
                      label="Employment Generation"
                      name="employees"
                      value={form.employees}
                      onChange={handleChange}
                      type="number"
                      placeholder="Number of Employees"
                    />

                    <div className="col-12">

                      <label className="form-label fw-semibold">
                        Project Description
                      </label>

                      <textarea
                        name="description"
                        className="form-control"
                        rows="5"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the proposed project, products/services, capacity, market and project objective..."
                      />

                    </div>

                  </div>

                </DPRCard>

                {/* PROJECT COST */}

                <DPRCard
                  icon="bi-cash-stack"
                  title="2. Project Cost & Means of Finance"
                >

                  <div className="row g-3">

                    <Input
                      label="Total Project Cost"
                      name="projectCost"
                      value={form.projectCost}
                      onChange={handleChange}
                      type="number"
                      placeholder="₹ Total Project Cost"
                    />

                    <Input
                      label="Own Contribution (%)"
                      name="ownContributionPercent"
                      value={
                        form.ownContributionPercent
                      }
                      onChange={handleChange}
                      type="number"
                    />

                    <Input
                      label="Estimated Subsidy (%)"
                      name="subsidyPercent"
                      value={form.subsidyPercent}
                      onChange={handleChange}
                      type="number"
                    />

                    <Input
                      label="Bank Interest Rate (%)"
                      name="interestRate"
                      value={form.interestRate}
                      onChange={handleChange}
                      type="number"
                      step="0.1"
                    />

                    <Select
                      label="Loan Tenure"
                      name="tenure"
                      value={String(form.tenure)}
                      onChange={handleChange}
                      options={[
                        { value: "3", label: "3 Years" },
                        { value: "5", label: "5 Years" },
                        { value: "7", label: "7 Years" },
                        { value: "10", label: "10 Years" },
                        { value: "15", label: "15 Years" },
                      ]}
                    />

                  </div>

                  {/* FINANCE SUMMARY */}

                  <div className="row g-3 mt-3">

                    <FinanceBox
                      title="Own Contribution"
                      value={formatCurrency(
                        financials.ownContribution
                      )}
                    />

                    <FinanceBox
                      title="Estimated Subsidy"
                      value={formatCurrency(
                        financials.subsidy
                      )}
                    />

                    <FinanceBox
                      title="Estimated Bank Loan"
                      value={formatCurrency(
                        financials.bankLoan
                      )}
                    />

                  </div>

                  <div
                    className="dpr-disclaimer mt-4 mb-0"
                  >
                    <small>
                      Subsidy shown here is an estimate entered
                      by the user. Final subsidy eligibility and
                      amount must be verified under the
                      applicable Government scheme.
                    </small>
                  </div>

                </DPRCard>

                {/* OPERATIONS */}

                <DPRCard
                  icon="bi-graph-up-arrow"
                  title="3. Sales & Operating Projections"
                >

                  <div className="row g-3">

                    <Input
                      label="Expected Annual Sales"
                      name="expectedSales"
                      value={form.expectedSales}
                      onChange={handleChange}
                      type="number"
                      placeholder="₹ Expected Annual Turnover"
                    />

                    <Input
                      label="Annual Operating Expenses"
                      name="operatingExpenses"
                      value={
                        form.operatingExpenses
                      }
                      onChange={handleChange}
                      type="number"
                      placeholder="₹ Annual Expenses"
                    />

                  </div>

                  <div className="row g-3 mt-3">

                    <FinanceBox
                      title="Estimated Annual Profit"
                      value={formatCurrency(
                        financials.estimatedProfit
                      )}
                    />

                    <FinanceBox
                      title="Estimated Profit Margin"
                      value={`${financials.profitMargin.toFixed(
                        2
                      )}%`}
                    />

                    <FinanceBox
                      title="Indicative DSCR"
                      value={
                        financials.estimatedDSCR
                          ? financials.estimatedDSCR.toFixed(
                              2
                            )
                          : "0.00"
                      }
                    />

                  </div>

                </DPRCard>

              </div>

              {/* =========================================
                  RIGHT SUMMARY
              ========================================= */}

              <div className="col-lg-4">

                <div
                  className="dpr-summary-card"
                >

                  <div className="dpr-card-body">

                    <div className="dpr-summary-heading">
                      <div>
                        <span className="dpr-mini-label">LIVE CALCULATION</span>
                        <h4>DPR Summary</h4>
                      </div>
                      <span className="dpr-summary-icon">
                        <i className="bi bi-bar-chart-fill"></i>
                      </span>
                    </div>

                    <SummaryRow
                      label="Project Cost"
                      value={formatCurrency(
                        financials.projectCost
                      )}
                    />

                    <SummaryRow
                      label="Own Contribution"
                      value={formatCurrency(
                        financials.ownContribution
                      )}
                    />

                    <SummaryRow
                      label="Subsidy Estimate"
                      value={formatCurrency(
                        financials.subsidy
                      )}
                    />

                    <SummaryRow
                      label="Bank Loan"
                      value={formatCurrency(
                        financials.bankLoan
                      )}
                    />

                    <hr />

                    <div
                      className="dpr-emi-box mb-4"
                    >

                      <small>
                        ESTIMATED MONTHLY EMI
                      </small>

                      <h2 className="fw-bold mt-2 mb-0">
                        {formatCurrency(
                          financials.emi
                        )}
                      </h2>

                      <small
                        style={{
                          opacity: 0.8,
                        }}
                      >
                        {financials.months} instalments
                      </small>

                    </div>

                    <SummaryRow
                      label="Total Interest"
                      value={formatCurrency(
                        financials.totalInterest
                      )}
                    />

                    <SummaryRow
                      label="Total Repayment"
                      value={formatCurrency(
                        financials.totalRepayment
                      )}
                    />

                    <button
                      type="submit"
                      className="dpr-generate-btn w-100 mt-4"
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      Generate DPR Preview
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </form>

        </div>

      </section>

      {/* =================================================
          DPR PREVIEW
      ================================================= */}

      {showReport && (
        <section
          id="dpr-preview"
          className="pb-5"
        >

          <div className="container">

            <div className="dpr-report-card">

              <div className="dpr-report-body">

                <div className="text-center mb-5">

                  <span className="badge bg-success rounded-pill px-3 py-2 mb-3">
                    DPR PREVIEW
                  </span>

                  <h2 className="fw-bold">
                    {form.projectName}
                  </h2>

                  <p className="text-muted">
                    Detailed Project Report
                  </p>

                </div>

                {/* EXECUTIVE SUMMARY */}

                <ReportSection title="1. Executive Summary">

                  <p>
                    The proposed project{" "}
                    <strong>
                      {form.projectName}
                    </strong>{" "}
                    is planned under the{" "}
                    <strong>
                      {form.business}
                    </strong>{" "}
                    sector in{" "}
                    <strong>
                      {form.district
                        ? `${form.district}, `
                        : ""}
                      {form.state}
                    </strong>
                    .
                  </p>

                  {form.description && (
                    <p>{form.description}</p>
                  )}

                  <p>
                    The estimated total project cost is{" "}
                    <strong>
                      {formatCurrency(
                        financials.projectCost
                      )}
                    </strong>
                    .
                  </p>

                </ReportSection>

                {/* PROMOTER */}

                <ReportSection title="2. Promoter / Applicant">

                  <p>
                    <strong>Name:</strong>{" "}
                    {form.promoterName ||
                      "To be provided"}
                  </p>

                  <p>
                    <strong>
                      Proposed Employment:
                    </strong>{" "}
                    {form.employees ||
                      "To be provided"}
                  </p>

                </ReportSection>

                {/* COST */}

                <ReportSection title="3. Project Cost">

                  <DPRTable
                    rows={[
                      [
                        "Total Project Cost",
                        formatCurrency(
                          financials.projectCost
                        ),
                      ],
                      [
                        "Own Contribution",
                        formatCurrency(
                          financials.ownContribution
                        ),
                      ],
                      [
                        "Estimated Subsidy",
                        formatCurrency(
                          financials.subsidy
                        ),
                      ],
                      [
                        "Estimated Bank Loan",
                        formatCurrency(
                          financials.bankLoan
                        ),
                      ],
                    ]}
                  />

                </ReportSection>

                {/* FINANCIALS */}

                <ReportSection title="4. Financial Projections">

                  <DPRTable
                    rows={[
                      [
                        "Expected Annual Sales",
                        formatCurrency(
                          financials.annualSales
                        ),
                      ],
                      [
                        "Annual Operating Expenses",
                        formatCurrency(
                          financials.operatingExpenses
                        ),
                      ],
                      [
                        "Estimated Annual Profit",
                        formatCurrency(
                          financials.estimatedProfit
                        ),
                      ],
                      [
                        "Estimated Profit Margin",
                        `${financials.profitMargin.toFixed(
                          2
                        )}%`,
                      ],
                      [
                        "Monthly EMI",
                        formatCurrency(
                          financials.emi
                        ),
                      ],
                      [
                        "Indicative DSCR",
                        financials.estimatedDSCR.toFixed(
                          2
                        ),
                      ],
                    ]}
                  />

                </ReportSection>

                {/* DISCLAIMER */}

                <div className="dpr-report-disclaimer mt-4">

                  <strong>Important:</strong>{" "}

                  This preview is based on the information
                  entered by the user and simplified financial
                  estimates. A bank-ready DPR should include
                  detailed project cost quotations, market
                  assessment, capacity assumptions, projected
                  profit & loss, cash flow, balance sheet,
                  repayment schedule, DSCR analysis,
                  break-even analysis and verified subsidy
                  guidelines.

                </div>

              </div>

            </div>

          </div>

        </section>
      )}
    </div>
  );
}

// ======================================================
// DPR CARD
// ======================================================

function DPRCard({
  title,
  icon,
  children,
}) {
  return (
    <div className="dpr-card mb-4">

      <div className="dpr-card-body">

        <div className="d-flex align-items-center gap-3 mb-4">

          <div
            className="dpr-section-icon"
          >
            <i
              className={`bi ${icon}`}
            ></i>
          </div>

          <h4 className="fw-bold mb-0">
            {title}
          </h4>

        </div>

        {children}

      </div>

    </div>
  );
}

// ======================================================
// INPUT
// ======================================================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  step,
}) {
  return (
    <div className="col-md-6">

      <label className="form-label fw-semibold">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        className="form-control dpr-input form-control-lg"
      />

    </div>
  );
}

// ======================================================
// SELECT
// ======================================================

function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div className="col-md-6">

      <label className="form-label fw-semibold">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select dpr-input form-select-lg"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => {
          const value =
            typeof option === "object"
              ? option.value
              : option;

          const text =
            typeof option === "object"
              ? option.label
              : option;

          return (
            <option
              key={value}
              value={value}
            >
              {text}
            </option>
          );
        })}

      </select>

    </div>
  );
}

// ======================================================
// FINANCE BOX
// ======================================================

function FinanceBox({
  title,
  value,
}) {
  return (
    <div className="col-md-4">

      <div
        className="dpr-finance-box h-100"
      >

        <small className="text-muted">
          {title}
        </small>

        <h5 className="fw-bold mt-2 mb-0">
          {value}
        </h5>

      </div>

    </div>
  );
}

// ======================================================
// SUMMARY ROW
// ======================================================

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2">

      <span className="text-muted">
        {label}
      </span>

      <strong className="text-end">
        {value}
      </strong>

    </div>
  );
}

// ======================================================
// REPORT SECTION
// ======================================================

function ReportSection({
  title,
  children,
}) {
  return (
    <div className="mb-5">

      <h4 className="dpr-report-section-title">
        {title}
      </h4>

      {children}

    </div>
  );
}

// ======================================================
// DPR TABLE
// ======================================================

function DPRTable({ rows }) {
  return (
    <div className="table-responsive">

      <table className="table dpr-table align-middle">

        <thead >

          <tr>
            <th>Particulars</th>
            <th className="text-end">
              Amount / Value
            </th>
          </tr>

        </thead>

        <tbody>

          {rows.map(
            ([label, value], index) => (
              <tr key={index}>

                <td>{label}</td>

                <td className="text-end fw-semibold">
                  {value}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}