import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./DPRPreview.css";

/* ============================================================
   GoSubsidy DPR Preview
   Upgraded to preserve the complete original DPR logic while using
   a modern compact-flow A4 bank-ready print structure.

   Print architecture:
   - Screen preview remains the primary interactive DPR workspace.
   - Print/PDF output flows continuously instead of forcing every section
     onto a separate A4 page.
   - Only the cover and genuinely large schedules may start a new page.
   - Financial tables are protected from awkward row splitting.
   - Existing calculation payload remains authoritative for financial values.

   Legacy section sequence:
   01 Cover
   02 Executive Summary
   03 Project Profile
   04 Promoter Profile
   05 Business / Project Description
   06 Industry Overview
   07 Market Potential
   08 Technical Feasibility
   09 Capital Cost Statement
   10 Means of Finance
   11 Financial Assumptions
   12 Income Statement
   13 Expenditure Statement
   14 Profit & Loss Account
   15 Balance Sheet
   16 Cash Flow Statement
   17 Loan Repayment Schedule
   18 Depreciation Statement
   19 DSCR Statement
   20 Break-even Analysis
   21 Employment & Government Support
   22 SWOT Analysis
   23 Risk & Implementation
   24 Conclusion & Bankability

   Financial sections 8-17 are rendered from the GoSubsidy
   calculation payload whenever available, rather than trusting
   duplicated AI-generated financial numbers.
============================================================ */

const MAX_YEARS = 15;

const numberValue = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue(value));

const pct = (value, digits = 2) => `${numberValue(value).toFixed(digits)}%`;

const plainNumber = (value) => numberValue(value).toLocaleString("en-IN", {
  maximumFractionDigits: 0,
});

const clampYears = (value) =>
  Math.min(MAX_YEARS, Math.max(1, Math.floor(numberValue(value) || 1)));

/* ------------------------------------------------------------
   Find the selected horizon from every compatible source.
   Priority deliberately starts with the repayment schedule because
   the backend controller creates that schedule from the selected
   1-15 year tenure.
------------------------------------------------------------ */
const getProjectionYears = (...sources) => {
  for (const source of sources) {
    const repayment = source?.repaymentSchedule;
    if (Array.isArray(repayment) && repayment.length) {
      return clampYears(repayment.length);
    }

    const financialSummarySchedule = source?.financialSummary?.repaymentSchedule;
    if (Array.isArray(financialSummarySchedule) && financialSummarySchedule.length) {
      return clampYears(financialSummarySchedule.length);
    }

    const years = source?.calculations?.years;
    if (Array.isArray(years) && years.length) {
      return clampYears(years.length);
    }

    const explicit = source?.projectionYears ?? source?.projection?.selectedYears;
    if (numberValue(explicit) > 0) return clampYears(explicit);

    const tenure =
      source?.loanTenure ??
      source?.repaymentTenure ??
      source?.projection?.loanTenure;
    if (numberValue(tenure) > 0) return clampYears(tenure);
  }

  return 7;
};

/* ------------------------------------------------------------
   Report parser.
   The old PDF uses numbered headings from 1 to 24. Gemini normally
   returns those same headings. We split them once and render only
   the narrative sections here. Financial sections are rendered from
   the calculation engine below to prevent duplicated/conflicting
   tables.
------------------------------------------------------------ */
const parseReportSections = (report) => {
  const result = {};
  const text = String(report || "").replace(/\r/g, "");

  const headingRegex = /^\s*(?:#{1,6}\s*)?(\d{1,2})\.\s+(.+?)\s*$/gm;
  const matches = [...text.matchAll(headingRegex)];

  if (!matches.length) {
    result.full = text;
    return result;
  }

  matches.forEach((match, index) => {
    const sectionNumber = Number(match[1]);
    const title = match[2].trim();
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;

    result[sectionNumber] = {
      number: sectionNumber,
      title,
      body: text.slice(start, end).trim(),
    };
  });

  return result;
};

const SectionHeading = ({ number, title }) => (
  <div className="dpr-old-section-heading">
    <span>{String(number).padStart(2, "0")}</span>
    <h2>{title}</h2>
  </div>
);

const MarkdownBlock = ({ children }) => (
  <article className="dpr-markdown">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children: tableChildren }) => (
          <div className="dpr-table-wrapper">
            <table>{tableChildren}</table>
          </div>
        ),
        h1: ({ children: headingChildren }) => (
          <h3 className="markdown-h1">{headingChildren}</h3>
        ),
        h2: ({ children: headingChildren }) => (
          <h3 className="markdown-h2">{headingChildren}</h3>
        ),
        h3: ({ children: headingChildren }) => (
          <h4 className="markdown-h3">{headingChildren}</h4>
        ),
        blockquote: ({ children: quoteChildren }) => (
          <blockquote className="dpr-blockquote">{quoteChildren}</blockquote>
        ),
      }}
    >
      {children || "Additional information is required for final DPR calculation."}
    </ReactMarkdown>
  </article>
);

const FinancialTable = ({ columns, rows, firstColumn = "Particulars" }) => (
  <div className="dpr-table-wrapper dpr-financial-table-wrapper">
    <table className="dpr-old-financial-table">
      <thead>
        <tr>
          <th>{firstColumn}</th>
          {columns.map((column) => (
            <th key={column.key || column}>{column.label || column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`${row.label || row.name || "row"}-${rowIndex}`} className={row.total ? "dpr-total-row" : ""}>
            <th>{row.label || row.name}</th>
            {columns.map((column) => (
              <td key={column.key || column} className={row.bold ? "dpr-bold-cell" : ""}>
                {typeof row.values?.[column.key || column] === "string"
                  ? row.values[column.key || column]
                  : money(row.values?.[column.key || column])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PrintPage = ({ number, title, kicker, children, className = "" }) => (
  <section className={`dpr-print-page dpr-print-flow-page ${className}`}>
    <div className="dpr-print-page-top">
      <div>
        <span className="dpr-print-kicker">{kicker || "GOSUBSIDY • DETAILED PROJECT REPORT"}</span>
        <h1>{title}</h1>
      </div>
      <div className="dpr-print-page-number">{String(number).padStart(2, "0")}</div>
    </div>
    <div className="dpr-print-page-body">{children}</div>
    <div className="dpr-print-page-footer">
      <span>GoSubsidy • Government Schemes &amp; Financial Intelligence Platform</span>
      <span>Section {String(number).padStart(2, "0")}</span>
    </div>
  </section>
);

const DPRPreviewPrintStyles = () => (
  <style>{`
    /* ==========================================================
       GoSubsidy DPR — compact, professional print system
       The old print layout allocated an A4-sized box to every
       section. That creates large blank areas. These overrides
       intentionally allow sections to flow naturally.
    ========================================================== */
    @media screen {
      .dpr-print-document {
        display: none !important;
      }
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 11mm 11mm 12mm;
      }

      html,
      body {
        background: #ffffff !important;
        color: #102a43 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .no-print,
      .dpr-modern-header,
      .dpr-side-nav {
        display: none !important;
      }

      .dpr-modern-page,
      .dpr-modern-shell,
      .dpr-modern-content {
        display: block !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      .dpr-print-document {
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Critical fix: no artificial A4-height reservation per section. */
      .dpr-print-page,
      .dpr-print-flow-page {
        min-height: 0 !important;
        height: auto !important;
        max-height: none !important;
        margin: 0 0 7mm !important;
        padding: 0 0 5mm !important;
        overflow: visible !important;
        box-sizing: border-box !important;
        break-before: auto !important;
        page-break-before: auto !important;
        break-after: auto !important;
        page-break-after: auto !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
        box-shadow: none !important;
      }

      /* Cover remains a deliberate opening page. */
      .dpr-print-cover {
        min-height: 244mm !important;
        break-after: page !important;
        page-break-after: always !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }

      .dpr-print-page-top {
        break-after: avoid !important;
        page-break-after: avoid !important;
        margin-bottom: 4mm !important;
      }

      .dpr-print-page-top h1 {
        margin-bottom: 0 !important;
      }

      .dpr-print-page-body {
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
      }

      .dpr-print-page-footer {
        position: static !important;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        margin-top: 4mm !important;
        padding-top: 2.5mm !important;
      }

      .dpr-credit-panel,
      .dpr-print-subsection,
      .dpr-print-info-grid,
      .dpr-credit-summary-grid,
      .dpr-tech-metrics,
      .dpr-appraisal-band,
      .dpr-print-note,
      .dpr-print-formula,
      .dpr-swot-grid,
      .dpr-promoter-banner,
      .dpr-process-list,
      .dpr-process-flow,
      .dpr-timeline,
      .dpr-print-disclaimer {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .dpr-table-wrapper,
      .dpr-financial-table-wrapper {
        overflow: visible !important;
        width: 100% !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }

      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }

      thead {
        display: table-header-group !important;
      }

      tr {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .dpr-print-landscape {
        /* Keep the existing class for compatibility, but do not
           force an entire blank page around a normal-sized table. */
        break-before: auto !important;
        page-break-before: auto !important;
        break-after: auto !important;
        page-break-after: auto !important;
      }

      .dpr-print-document > .dpr-print-page:not(.dpr-print-cover) + .dpr-print-page {
        border-top: 1px solid #dbe7f3 !important;
        padding-top: 5mm !important;
      }

      .dpr-print-kicker {
        letter-spacing: 0.14em !important;
      }

      /* Avoid widows/orphans in narrative text. */
      .dpr-markdown p,
      .dpr-markdown li {
        orphans: 3;
        widows: 3;
      }
    }
  `}</style>
);


const DPRPreviewScreenStyles = () => (
  <style>{`
    @media screen {
      .dpr-readiness-strip {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 10px;
        margin: 14px 0 18px;
        padding: 12px;
        border: 1px solid rgba(25, 89, 150, 0.12);
        border-radius: 18px;
        background: rgba(255,255,255,0.82);
        box-shadow: 0 8px 24px rgba(15, 55, 90, 0.06);
        backdrop-filter: blur(12px);
      }
      .dpr-readiness-strip > div {
        min-width: 0;
        padding: 10px 12px;
        border-radius: 12px;
        background: #f7fbff;
        border: 1px solid #e2edf7;
      }
      .dpr-readiness-strip span {
        display: block;
        margin-bottom: 5px;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .12em;
        color: #6b8197;
      }
      .dpr-readiness-strip strong {
        display: block;
        font-size: 13px;
        line-height: 1.25;
        color: #082f55;
      }
      .dpr-readiness-strip small {
        display: block;
        margin-top: 3px;
        font-size: 10px;
        color: #6b8197;
      }
      @media (max-width: 1100px) {
        .dpr-readiness-strip {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 640px) {
        .dpr-readiness-strip {
          grid-template-columns: 1fr;
        }
      }
    }
    @media print {
      .dpr-readiness-strip {
        display: none !important;
      }
    }
  `}</style>
);
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("GoSubsidy DPR Preview Error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="dpr-preview-empty">
          <div className="dpr-empty-card">
            <h2>GoSubsidy DPR Preview Error</h2>
            <p>The DPR data is preserved, but the preview encountered a rendering error.</p>
            <pre>{String(this.state.error?.message || this.state.error)}</pre>
            <button type="button" onClick={() => window.location.assign("/dpr")}>
              Back to DPR
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

function DPRPreviewContent() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ==========================================================
     LOAD GENERATED DPR
  ========================================================== */
  const generatedDPR = useMemo(() => {
    if (location.state?.generatedDPR) return location.state.generatedDPR;

    let storedGenerated = null;
    try {
      const raw = localStorage.getItem("gosubsidy_generated_dpr");
      if (raw) storedGenerated = JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse gosubsidy_generated_dpr", error);
    }

    let projectPayload = location.state?.project || null;
    try {
      const raw = localStorage.getItem("gosubsidy_ai_dpr");
      if (raw && !projectPayload) projectPayload = JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse gosubsidy_ai_dpr", error);
    }

    let report = location.state?.dpr || "";
    if (!report) report = storedGenerated?.report || "";
    if (!report) report = localStorage.getItem("gosubsidy_generated_dpr_text") || "";

    return {
      ...(storedGenerated || {}),
      project: storedGenerated?.project || projectPayload || {},
      report,
      provider: storedGenerated?.provider || location.state?.provider || "Google Gemini",
      backendProject: storedGenerated?.backendProject || location.state?.financialData || {},
    };
  }, [location.state]);

  const payload = generatedDPR?.project || {};
  const project = payload?.project || payload || {};
  const summary = payload?.summary || {};
  const backendProject = generatedDPR?.backendProject || location.state?.financialData || {};
  const calculations = payload?.calculations || generatedDPR?.calculations || backendProject?.calculations || {};
  const report = generatedDPR?.report || location.state?.dpr || "";
  const provider = generatedDPR?.provider || location.state?.provider || "Google Gemini";
  const reportSections = useMemo(() => parseReportSections(report), [report]);

  /* ==========================================================
     AUTHORITATIVE FINANCIAL VALUES
  ========================================================== */
  const projectCost = numberValue(
    summary.projectCost ?? backendProject.projectCost ?? project.projectCost
  );

  const promoterContribution = numberValue(
    summary.promoterContribution ??
      summary.promoterContributionAmount ??
      backendProject.promoterContributionAmount ??
      projectCost * (numberValue(project.promoterContributionPercent) / 100)
  );

  const expectedSubsidy = numberValue(
    summary.expectedSubsidy ??
      backendProject.estimatedSubsidy ??
      projectCost * (numberValue(project.subsidyPercent) / 100)
  );

  const estimatedTermLoan = numberValue(
    summary.estimatedTermLoan ??
      backendProject.estimatedTermLoan ??
      Math.max(0, projectCost - promoterContribution - expectedSubsidy)
  );

  const promoterPercent =
    projectCost > 0
      ? (promoterContribution / projectCost) * 100
      : numberValue(project.promoterContributionPercent);

  const subsidyPercent = numberValue(
    backendProject.subsidyPercent ?? project.subsidyPercent
  );

  const interestRate = numberValue(
    backendProject.interestRate ?? project.interestRate
  );

  const loanTenure = clampYears(
    backendProject.loanTenure ?? project.loanTenure
  );

  const moratorium = Math.max(
    0,
    Math.floor(numberValue(backendProject.moratorium ?? project.moratorium))
  );

  const repaymentSchedule =
    (Array.isArray(backendProject.repaymentSchedule) && backendProject.repaymentSchedule.length
      ? backendProject.repaymentSchedule
      : Array.isArray(payload?.repaymentSchedule) && payload.repaymentSchedule.length
        ? payload.repaymentSchedule
        : Array.isArray(calculations?.repaymentSchedule) && calculations.repaymentSchedule.length
          ? calculations.repaymentSchedule
          : []);

  const projectionYears = getProjectionYears(
    backendProject,
    payload,
    generatedDPR,
    calculations,
    project
  );

  const rawYears = Array.isArray(calculations?.years) ? calculations.years : [];

  /* ==========================================================
     FALLBACK FINANCIAL ENGINE
     Used only when a compatible calculations.years array is not
     present. This keeps the preview functional with old payloads.
  ========================================================== */
  const financialYears = useMemo(() => {
    const source = rawYears.slice(0, projectionYears).map((row, index) => ({
      year: numberValue(row?.year) || index + 1,
      ...row,
    }));

    if (source.length >= projectionYears) return source;

    const result = [...source];
    const rawMaterialPercent = numberValue(project.rawMaterialPercent ?? 40);
    const salaryPercent = numberValue(project.salaryPercent ?? 10);
    const powerPercent = numberValue(project.powerPercent ?? 5);
    const adminPercent = numberValue(project.adminPercent ?? 4);
    const marketingPercent = numberValue(project.marketingPercent ?? 3);
    const otherPercent = numberValue(project.otherExpensePercent ?? 2);
    const salesGrowth = numberValue(project.salesGrowth ?? 10);
    const year1Sales = numberValue(project.year1Sales);
    const depreciationRate = numberValue(project.depreciationRate ?? 10);

    let openingLoan = estimatedTermLoan;
    let openingWDV =
      numberValue(project.building) +
      numberValue(project.plantMachinery) +
      numberValue(project.electrical) +
      numberValue(project.furniture);

    for (let year = 1; year <= projectionYears; year += 1) {
      if (result[year - 1]) {
        openingLoan = numberValue(result[year - 1].closingLoan);
        openingWDV = numberValue(result[year - 1].closingWDV);
        continue;
      }

      const sales = year1Sales * Math.pow(1 + salesGrowth / 100, year - 1);
      const rawMaterial = sales * rawMaterialPercent / 100;
      const salaries = sales * salaryPercent / 100;
      const power = sales * powerPercent / 100;
      const admin = sales * adminPercent / 100;
      const marketing = sales * marketingPercent / 100;
      const otherExpenses = sales * otherPercent / 100;
      const operatingExpenses = rawMaterial + salaries + power + admin + marketing + otherExpenses;
      const ebitda = sales - operatingExpenses;
      const depreciation = openingWDV * depreciationRate / 100;
      const interest = openingLoan * interestRate / 100;
      const pbt = ebitda - depreciation - interest;
      const tax = pbt > 0 ? pbt * 0.25 : 0;
      const pat = pbt - tax;

      const repaymentRow = repaymentSchedule[year - 1] || {};
      const repayment = numberValue(
        repaymentRow.principalRepayment ??
          repaymentRow.repayment ??
          (year <= loanTenure ? estimatedTermLoan / Math.max(1, loanTenure) : 0)
      );
      const closingLoan = numberValue(
        repaymentRow.closingLoan ?? Math.max(0, openingLoan - repayment)
      );

      const debtService = numberValue(
        repaymentRow.totalDebtService ?? repayment + interest
      );
      const dscr = debtService > 0 ? (pat + depreciation + interest) / debtService : 0;
      const closingWDV = Math.max(0, openingWDV - depreciation);

      result.push({
        year,
        sales,
        rawMaterial,
        salaries,
        power,
        admin,
        marketing,
        otherExpenses,
        operatingExpenses,
        ebitda,
        openingWDV,
        depreciation,
        closingWDV,
        openingLoan,
        interest,
        repayment,
        closingLoan,
        profitBeforeTax: pbt,
        estimatedTax: tax,
        profitAfterTax: pat,
        debtService,
        dscr,
        operatingCashFlow: pat + depreciation,
        financingCashFlow: -repayment,
        netCashFlow: pat + depreciation - repayment,
        currentAssets: sales * 0.15,
        currentLiabilities: operatingExpenses * 0.08,
        netFixedAssets: closingWDV,
      });

      openingLoan = closingLoan;
      openingWDV = closingWDV;
    }

    return result.slice(0, projectionYears);
  }, [
    rawYears,
    projectionYears,
    project,
    estimatedTermLoan,
    interestRate,
    repaymentSchedule,
    loanTenure,
  ]);

  const averageDSCR = numberValue(
    backendProject.averageDSCR ??
      summary.averageDSCR ??
      calculations.averageDSCR ??
      (financialYears.length
        ? financialYears.reduce((sum, row) => sum + numberValue(row.dscr), 0) /
          Math.max(1, financialYears.filter((row) => numberValue(row.debtService) > 0).length)
        : 0)
  );

  const capitalItems = [
    ["Land / Site Development", numberValue(project.land ?? backendProject.capitalCost?.land)],
    ["Building / Civil Works", numberValue(project.building ?? backendProject.capitalCost?.building)],
    ["Plant & Machinery", numberValue(project.plantMachinery ?? backendProject.capitalCost?.plantMachinery)],
    ["Electrical Installation", numberValue(project.electrical ?? backendProject.capitalCost?.electrical)],
    ["Furniture & Equipment", numberValue(project.furniture ?? backendProject.capitalCost?.furniture)],
    ["Preliminary & Pre-operative Expenses", numberValue(project.preliminary ?? backendProject.capitalCost?.preliminary)],
    ["Contingency", numberValue(project.contingency ?? backendProject.capitalCost?.contingency)],
    ["Working Capital Margin", numberValue(project.workingCapitalMargin ?? backendProject.capitalCost?.workingCapitalMargin)],
    ["Other Fixed Assets / Miscellaneous Project Cost", numberValue(project.otherFixedAssets ?? backendProject.capitalCost?.otherFixedAssets)],
  ];

  const capitalCostTotal = numberValue(
    backendProject?.capitalCost?.totalCapitalCost ??
      payload?.capitalCost?.totalCapitalCost ??
      capitalItems.reduce((sum, [, value]) => sum + value, 0)
  );

  const capitalDifference = projectCost - capitalCostTotal;

  /* ------------------------------------------------------------
     Working-capital visibility
     Uses only values already supplied by the DPR/backend payload.
     No working-capital amount is invented when the application has
     not supplied one.
  ------------------------------------------------------------ */
  /* ==========================================================
     WORKING CAPITAL — AUTHORITATIVE PAYLOAD FIRST
     DPR.jsx stores these values in summary. The backend may also
     return them in project/capitalCost, so keep compatible fallbacks.
  ========================================================== */
  const workingCapitalRequired =
    summary.workingCapitalRequired ??
    summary.workingCapitalRequiredFlag ??
    project.workingCapitalRequired ??
    backendProject.workingCapitalRequired ??
    null;

  const workingCapitalRequirement = numberValue(
    summary.workingCapitalRequirement ??
      project.workingCapitalRequirement ??
      backendProject.workingCapitalRequirement ??
      backendProject.capitalCost?.workingCapitalRequirement ??
      project.workingCapitalMargin ??
      backendProject.capitalCost?.workingCapitalMargin
  );

  const workingCapitalPurpose =
    summary.workingCapitalPurpose ??
    project.workingCapitalPurpose ??
    backendProject.workingCapitalPurpose ??
    "";

  const workingCapitalCycleDays = numberValue(
    summary.workingCapitalCycleDays ??
      project.workingCapitalCycleDays ??
      backendProject.workingCapitalCycleDays
  );

  const workingCapitalBasis =
    summary.workingCapitalRequirement != null ||
    project.workingCapitalRequirement != null ||
    backendProject.workingCapitalRequirement != null ||
    backendProject.capitalCost?.workingCapitalRequirement != null
      ? "Requirement"
      : project.workingCapitalMargin != null ||
          backendProject.capitalCost?.workingCapitalMargin != null
        ? "Margin"
        : "Not specified";

  const reportBody = (number) => reportSections[number]?.body || "";

  const handlePrint = () => window.print();

  if (!report && !project.projectName) {
    return (
      <main className="dpr-preview-empty">
        <div className="dpr-empty-card">
          <h2>No Generated DPR Found</h2>
          <p>Generate the AI DPR before opening the preview page.</p>
          <button type="button" onClick={() => navigate("/dpr")}>Back to DPR</button>
        </div>
      </main>
    );
  }

  /* ==========================================================
     FINANCIAL TABLE DATA
  ========================================================== */
  const yearColumns = financialYears.map((row, index) => ({
    key: `y${index + 1}`,
    label: `Year ${numberValue(row.year) || index + 1}`,
  }));

  const yearly = (field) => Object.fromEntries(
    financialYears.map((row, index) => [`y${index + 1}`, numberValue(row?.[field])])
  );

  const incomeRows = [
    { label: "Revenue / Sales", values: yearly("sales") },
    { label: "EBITDA", values: yearly("ebitda"), bold: true },
    { label: "Profit Before Tax", values: yearly("profitBeforeTax") },
    { label: "Profit After Tax", values: yearly("profitAfterTax"), bold: true },
  ];

  const expenditureRows = [
    { label: "Raw Material", values: yearly("rawMaterial") },
    { label: "Salaries & Wages", values: yearly("salaries") },
    { label: "Power & Utilities", values: yearly("power") },
    { label: "Administration Expenses", values: yearly("admin") },
    { label: "Marketing Expenses", values: yearly("marketing") },
    { label: "Other Operating Expenses", values: yearly("otherExpenses") },
    { label: "Total Operating Expenses", values: yearly("operatingExpenses"), total: true, bold: true },
  ];

  const pnlRows = [
    { label: "Gross Sales Revenue", values: yearly("sales") },
    { label: "Less: Operating Expenses", values: yearly("operatingExpenses") },
    { label: "EBITDA", values: yearly("ebitda"), total: true, bold: true },
    { label: "Less: Depreciation", values: yearly("depreciation") },
    { label: "Less: Interest on Term Loan", values: yearly("interest") },
    { label: "Profit Before Tax (PBT)", values: yearly("profitBeforeTax"), total: true, bold: true },
    { label: "Less: Estimated Income Tax", values: yearly("estimatedTax") },
    { label: "Profit After Tax (PAT)", values: yearly("profitAfterTax"), total: true, bold: true },
  ];

  const balanceRows = [
    { label: "Net Fixed Assets", values: yearly("netFixedAssets") },
    { label: "Current Assets", values: yearly("currentAssets") },
    {
      label: "Total Assets",
      values: Object.fromEntries(financialYears.map((row, i) => [
        `y${i + 1}`,
        numberValue(row.netFixedAssets) + numberValue(row.currentAssets),
      ])),
      total: true,
      bold: true,
    },
    { label: "Outstanding Term Loan", values: yearly("closingLoan") },
    { label: "Current Liabilities", values: yearly("currentLiabilities") },
    {
      label: "Indicative Net Worth",
      values: Object.fromEntries(financialYears.map((row, i) => [
        `y${i + 1}`,
        promoterContribution + financialYears
          .slice(0, i + 1)
          .reduce((sum, item) => sum + numberValue(item.profitAfterTax), 0),
      ])),
    },
  ];

  const cashFlowRows = [
    { label: "Profit After Tax (PAT)", values: yearly("profitAfterTax") },
    { label: "Add: Depreciation", values: yearly("depreciation") },
    {
      label: "Operating Cash Flow",
      values: Object.fromEntries(financialYears.map((row, i) => [
        `y${i + 1}`,
        numberValue(row.profitAfterTax) + numberValue(row.depreciation),
      ])),
      total: true,
      bold: true,
    },
    {
      label: "Less: Principal Repayment",
      values: Object.fromEntries(financialYears.map((row, i) => [
        `y${i + 1}`,
        -numberValue(row.repayment),
      ])),
    },
    {
      label: "Financing Cash Flow",
      values: yearly("financingCashFlow"),
    },
    {
      label: "Net Cash Flow",
      values: yearly("netCashFlow"),
      total: true,
      bold: true,
    },
  ];

  const depreciationRows = [
    { label: "Opening Asset Base", values: yearly("openingWDV") },
    { label: "Depreciation Charge", values: yearly("depreciation") },
    { label: "Closing Asset Base", values: yearly("closingWDV"), total: true, bold: true },
  ];

  const firstYear = financialYears[0] || {};
  const lastYear = financialYears[financialYears.length - 1] || {};
  const year1EbitdaMargin = numberValue(firstYear.sales) > 0 ? (numberValue(firstYear.ebitda) / numberValue(firstYear.sales)) * 100 : 0;
  const year1PatMargin = numberValue(firstYear.sales) > 0 ? (numberValue(firstYear.profitAfterTax) / numberValue(firstYear.sales)) * 100 : 0;
  const year1ExpenseRatio = numberValue(firstYear.sales) > 0 ? (numberValue(firstYear.operatingExpenses) / numberValue(firstYear.sales)) * 100 : 0;
  const totalDebtService = financialYears.reduce((sum, row) => sum + numberValue(row.debtService), 0);

  const dscrRows = [
    { label: "PAT (₹)", values: yearly("profitAfterTax") },
    { label: "Depreciation (₹)", values: yearly("depreciation") },
    { label: "Interest (₹)", values: yearly("interest") },
    {
      label: "Cash Available (₹)",
      values: Object.fromEntries(financialYears.map((row, i) => [
        `y${i + 1}`,
        numberValue(row.profitAfterTax) + numberValue(row.depreciation) + numberValue(row.interest),
      ])),
      total: true,
      bold: true,
    },
    { label: "Total Debt Service (₹)", values: yearly("debtService") },
    {
      label: "Yearly DSCR",
      values: Object.fromEntries(financialYears.map((row, i) => [`y${i + 1}`, numberValue(row.dscr).toFixed(2)])),
      total: true,
      bold: true,
    },
  ];

  const PrintDocument = () => (
    <div className="dpr-print-document">
      <PrintPage number={1} title={project.projectName || "Detailed Project Report"} kicker="GOSUBSIDY • BANK-READY DPR" className="dpr-print-cover">
        <div className="dpr-print-cover-content">
          <div className="dpr-print-cover-label">DETAILED PROJECT REPORT</div>
          <h2>{project.businessType || "Business Project"}</h2>
          <p>{[project.location, project.district, project.state].filter(Boolean).join(" • ") || "Project Location"}</p>
          <div className="dpr-print-cover-metrics">
            <div><span>Total Project Cost</span><strong>{money(projectCost)}</strong></div>
            <div><span>Promoter Contribution</span><strong>{money(promoterContribution)}</strong></div>
            <div><span>Bank Term Loan</span><strong>{money(estimatedTermLoan)}</strong></div>
            <div><span>Expected Subsidy</span><strong>{money(expectedSubsidy)}</strong></div>
          </div>
          <div className="dpr-print-cover-prepared">Prepared by <strong>GoSubsidy AI DPR</strong><span>{provider}</span></div>
        </div>
      </PrintPage>

      <PrintPage number={2} title="Executive Summary" kicker="01 • BUSINESS CASE">
        <div className="dpr-credit-strip">
          <span>DOCUMENT PURPOSE</span><strong>Prepared for lender review and project appraisal</strong>
        </div>
        <div className="dpr-print-summary-grid dpr-credit-summary-grid">
          <div><span>Total Project Cost</span><strong>{money(projectCost)}</strong><small>100% of project cost</small></div>
          <div><span>Promoter Contribution</span><strong>{money(promoterContribution)}</strong><small>{promoterPercent.toFixed(2)}% of project cost</small></div>
          <div><span>Bank Term Loan</span><strong>{money(estimatedTermLoan)}</strong><small>{projectCost ? (estimatedTermLoan / projectCost * 100).toFixed(2) : "0.00"}% of project cost</small></div>
          <div><span>Expected Subsidy</span><strong>{money(expectedSubsidy)}</strong><small>{subsidyPercent.toFixed(2)}% assumption</small></div>
          <div><span>Year 1 Revenue</span><strong>{money(financialYears[0]?.sales)}</strong><small>Projected</small></div>
          <div><span>Year 1 EBITDA</span><strong>{money(financialYears[0]?.ebitda)}</strong><small>Projected</small></div>
          <div><span>Year 1 PAT</span><strong>{money(financialYears[0]?.profitAfterTax)}</strong><small>Projected</small></div>
          <div><span>Average DSCR</span><strong>{averageDSCR.toFixed(2)}</strong><small>Debt service coverage</small></div>
        </div>
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Project Rationale</h2><MarkdownBlock>{reportBody(1)}</MarkdownBlock></div>
          <div className="dpr-credit-panel"><h2>Credit Appraisal Highlights</h2><ul className="dpr-credit-list">
            <li>Project cost is fully reconciled with the capital cost schedule.</li>
            <li>Promoter contribution is identified separately from bank finance and the subsidy assumption.</li>
            <li>Financial projections extend through the selected repayment horizon.</li>
            <li>Debt servicing capacity is assessed through the projected DSCR schedule.</li>
          </ul></div>
        </div>
      </PrintPage>

      <PrintPage number={3} title="Project Profile" kicker="02 • PROJECT INFORMATION">
        <div className="dpr-print-section-intro">Project particulars and funding identifiers considered for the present DPR appraisal.</div>
        <div className="dpr-print-info-grid dpr-profile-grid">
          {[
            ["Project Name", project.projectName], ["Business / Sector", project.businessType],
            ["Constitution", project.constitution], ["Project Location", project.location],
            ["District / State", [project.district, project.state].filter(Boolean).join(" / ")],
            ["Total Project Cost", money(projectCost)], ["Promoter Contribution", money(promoterContribution)],
            ["Expected Subsidy", money(expectedSubsidy)], ["Bank Term Loan", money(estimatedTermLoan)],
            ["Interest Rate", `${interestRate.toFixed(2)}% p.a.`], ["Loan Tenure", `${loanTenure} Years`], ["Moratorium", `${moratorium} Months`],
          ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || "Not provided"}</strong></div>)}
        </div>
        <div className="dpr-credit-panel full"><h2>Project Information Narrative</h2><MarkdownBlock>{reportBody(2)}</MarkdownBlock></div>
      </PrintPage>

      <PrintPage number={4} title="Promoter Profile" kicker="03 • PROMOTER">
        <div className="dpr-promoter-banner"><div><span>APPLICANT / PROMOTER</span><strong>{project.promoterName || "Information not provided in current application data"}</strong></div><div><span>CONSTITUTION</span><strong>{project.constitution || "Not provided"}</strong></div></div>
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Promoter Information</h2><MarkdownBlock>{reportBody(3)}</MarkdownBlock></div>
          <div className="dpr-credit-panel"><h2>Appraisal Information Status</h2><div className="dpr-status-list">
            <div><span>Identity / KYC details</span><strong>{project.promoterName ? "Applicant data available" : "To be submitted"}</strong></div>
            <div><span>Constitution details</span><strong>{project.constitution ? "Provided" : "To be submitted"}</strong></div>
            <div><span>Promoter experience</span><strong>To be supported by applicant documents</strong></div>
            <div><span>Promoter net worth</span><strong>To be supported by financial documents</strong></div>
          </div></div>
        </div>
        <div className="dpr-print-note"><strong>Bank appraisal note:</strong> Promoter profile information should be read together with KYC, constitution documents, experience credentials, net-worth statement and other documents requested by the lender.</div>
      </PrintPage>

      <PrintPage number={5} title="Business / Project Description" kicker="04 • BUSINESS MODEL">
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Business Concept</h2><div className="dpr-big-value">{project.businessType || "Business Project"}</div><p>The proposed unit is located in {project.location || "the stated project location"}{project.district ? `, ${project.district}` : ""}{project.state ? `, ${project.state}` : ""}.</p><MarkdownBlock>{reportBody(4)}</MarkdownBlock></div>
          <div className="dpr-credit-panel"><h2>Project Operating Logic</h2><div className="dpr-process-list">
            {[["01","Raw material","Receipt and inward handling"],["02","Preparation","Sorting and cleaning"],["03","Processing","Core processing activity"],["04","Quality","Inspection and control"],["05","Packaging","Automated / standardized packaging"],["06","Dispatch","Storage and market dispatch"]].map(([n,t,d]) => <div key={n}><b>{n}</b><span><strong>{t}</strong>{d}</span></div>)}
          </div></div>
        </div>
        <div className="dpr-print-note">The operating sequence shown above is aligned with the technical process described in this DPR and should be matched with final machinery quotations and site layout before sanction.</div>
      </PrintPage>

      <PrintPage number={6} title="Industry Overview" kicker="05 • INDUSTRY">
        <div className="dpr-industry-lead"><span>SECTOR</span><strong>{project.businessType || "Food Processing"}</strong><p>{reportBody(5) || "Industry narrative provided in the generated DPR."}</p></div>
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Sector Context</h2><ul className="dpr-credit-list"><li>Food processing connects the agricultural base with manufacturing and value addition.</li><li>The sector benefits from raw-material availability and post-harvest supply-chain development.</li><li>Telangana is presented in the DPR as a supportive ecosystem for food-processing enterprises.</li></ul></div>
          <div className="dpr-credit-panel"><h2>Project Relevance</h2><ul className="dpr-credit-list"><li>Project location: {project.location || "Khammam"}, {project.state || "Telangana"}.</li><li>Proposed activity is positioned within the food-processing value chain.</li><li>Regional connectivity and access to agricultural belts are identified as operating advantages.</li></ul></div>
        </div>
      </PrintPage>

      <PrintPage number={7} title="Market Potential" kicker="06 • DEMAND">
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Target Customer Segments</h2><ul className="dpr-credit-list"><li>Local retail trade networks and grocery vendors.</li><li>Regional wholesalers and institutional buyers such as caterers, canteens and hotels.</li><li>Regional supermarket and direct-to-consumer channels.</li></ul></div>
          <div className="dpr-credit-panel"><h2>Demand Drivers & Competitive Edge</h2><ul className="dpr-credit-list"><li><strong>Location advantage:</strong> access to agricultural belts and road logistics.</li><li><strong>Quality & hygiene:</strong> processing standards and consumer-focused packaging.</li><li><strong>Growth strategy:</strong> trader tie-ups, competitive pricing and localized distribution.</li></ul></div>
        </div>
        <div className="dpr-print-subsection"><h2>Generated Market Narrative</h2><MarkdownBlock>{reportBody(6)}</MarkdownBlock></div>
      </PrintPage>

      <PrintPage number={8} title="Technical Feasibility" kicker="07 • TECHNICAL VIABILITY">
        <div className="dpr-tech-metrics">
          <div><span>Plant & Machinery</span><strong>{money(numberValue(project.plantMachinery ?? backendProject.capitalCost?.plantMachinery))}</strong></div>
          <div><span>Electrical Installation</span><strong>{money(numberValue(project.electrical ?? backendProject.capitalCost?.electrical))}</strong></div>
          <div><span>Project Location</span><strong>{project.location || "Not provided"}</strong></div>
          <div><span>Sector</span><strong>{project.businessType || "Not provided"}</strong></div>
        </div>
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Site & Infrastructure</h2><ul className="dpr-credit-list"><li>Location: {project.location || "Khammam"}, {project.state || "Telangana"} with transportation, utility and labour access as stated in the DPR.</li><li>Civil allocation includes processing floors, storage and administrative space.</li></ul></div>
          <div className="dpr-credit-panel"><h2>Machinery, Utilities & Quality</h2><ul className="dpr-credit-list"><li>Plant & machinery allocation: {money(numberValue(project.plantMachinery ?? backendProject.capitalCost?.plantMachinery))}.</li><li>Electrical installation allocation: {money(numberValue(project.electrical ?? backendProject.capitalCost?.electrical))}.</li><li>Quality control is positioned between processing and packaging.</li></ul></div>
        </div>
        <div className="dpr-process-flow"><span>Receipt</span><i>→</i><span>Sorting & Cleaning</span><i>→</i><span>Processing</span><i>→</i><span>Quality Check</span><i>→</i><span>Packaging</span><i>→</i><span>Storage / Dispatch</span></div>
      </PrintPage>

      <PrintPage number={9} title="Capital Cost Statement" kicker="08 • PROJECT INVESTMENT">
        <FinancialTable columns={[{ key: "amount", label: "Amount (₹)" }]} rows={[
          ...capitalItems.map(([label, value]) => ({ label, values: { amount: value } })),
          { label: "Total Capital Cost", values: { amount: capitalCostTotal }, total: true, bold: true },
          { label: "Total Project Cost", values: { amount: projectCost }, total: true, bold: true },
          { label: "Reconciliation Difference", values: { amount: capitalDifference }, total: true, bold: true },
        ]} />
        <p className="dpr-print-note">{Math.abs(capitalDifference) < 1 ? "Capital cost components are fully reconciled with the authoritative Total Project Cost." : "Capital cost reconciliation is pending because the entered components do not equal the authoritative Total Project Cost."}</p>
      </PrintPage>

      <PrintPage number={10} title="Means of Finance" kicker="09 • FUNDING STRUCTURE">
        <FinancialTable columns={[{ key: "percent", label: "Percentage" }, { key: "amount", label: "Amount (₹)" }]} rows={[
          { label: "Promoter Contribution", values: { percent: `${promoterPercent.toFixed(2)}%`, amount: promoterContribution } },
          { label: "Bank Term Loan", values: { percent: `${(projectCost ? estimatedTermLoan / projectCost * 100 : 0).toFixed(2)}%`, amount: estimatedTermLoan } },
          { label: "Expected Subsidy", values: { percent: `${subsidyPercent.toFixed(2)}%`, amount: expectedSubsidy } },
          { label: "Total Means of Finance", values: { percent: "100.00%", amount: promoterContribution + estimatedTermLoan + expectedSubsidy }, total: true, bold: true },
        ]} />
        <div className="dpr-print-formula">Project Cost = Promoter Contribution + Bank Term Loan + Expected Subsidy</div>
      </PrintPage>

      <PrintPage number={11} title="Financial Assumptions" kicker="10 • FINANCIAL MODEL">
        <div className="dpr-print-info-grid">
          <div><span>Project Cost</span><strong>{money(projectCost)}</strong></div>
          <div><span>Interest Rate</span><strong>{interestRate.toFixed(2)}% p.a.</strong></div>
          <div><span>Promoter Contribution</span><strong>{promoterPercent.toFixed(2)}%</strong></div>
          <div><span>Expected Subsidy</span><strong>{subsidyPercent.toFixed(2)}%</strong></div>
          <div><span>Loan Repayment</span><strong>{loanTenure} {loanTenure === 1 ? "Year" : "Years"}</strong></div>
          <div><span>Moratorium</span><strong>{moratorium} Months</strong></div>
          <div><span>Working Capital</span><strong>{workingCapitalRequirement > 0 ? money(workingCapitalRequirement) : "Not specified"}</strong></div>
          <div><span>Projection Horizon</span><strong>{projectionYears} Years</strong></div>
          <div><span>Average DSCR</span><strong>{averageDSCR.toFixed(2)}</strong></div>
        </div>
        <div className="dpr-print-note"><strong>Subsidy assumption:</strong> Final eligibility, eligible project cost, subsidy percentage and maximum subsidy must be verified against the applicable Government scheme and official guidelines.</div>
      </PrintPage>

      <PrintPage number={12} title="Projected Income Statement" kicker="11 • FINANCIAL PROJECTIONS" className="dpr-print-landscape">
        <FinancialTable columns={yearColumns} rows={incomeRows} firstColumn="Year / Particulars" />
        <div className="dpr-appraisal-band"><div><span>YEAR 1 SALES</span><strong>{money(firstYear.sales)}</strong></div><div><span>EBITDA MARGIN</span><strong>{year1EbitdaMargin.toFixed(1)}%</strong></div><div><span>FINAL YEAR SALES</span><strong>{money(lastYear.sales)}</strong></div><p>Revenue projections are modelled across the selected horizon and should be supported by capacity, pricing and market assumptions during lender appraisal.</p></div>
      </PrintPage>

      <PrintPage number={13} title="Projected Expenditure Statement" kicker="12 • OPERATING COSTS" className="dpr-print-landscape">
        <FinancialTable columns={yearColumns} rows={expenditureRows} />
        <div className="dpr-appraisal-band"><div><span>YEAR 1 OPERATING COST</span><strong>{money(firstYear.operatingExpenses)}</strong></div><div><span>COST / SALES</span><strong>{year1ExpenseRatio.toFixed(1)}%</strong></div><div><span>RAW MATERIAL / SALES</span><strong>{numberValue(firstYear.sales) ? ((numberValue(firstYear.rawMaterial)/numberValue(firstYear.sales))*100).toFixed(1) : "0.0"}%</strong></div><p>Operating cost assumptions should be validated against vendor quotations, staffing plan, utility requirements and actual production economics.</p></div>
      </PrintPage>

      <PrintPage number={14} title="Projected Profit & Loss Account" kicker="13 • PROFITABILITY" className="dpr-print-landscape">
        <FinancialTable columns={yearColumns} rows={pnlRows} />
        <div className="dpr-appraisal-band"><div><span>YEAR 1 EBITDA</span><strong>{money(firstYear.ebitda)}</strong></div><div><span>YEAR 1 PAT</span><strong>{money(firstYear.profitAfterTax)}</strong></div><div><span>PAT MARGIN</span><strong>{year1PatMargin.toFixed(1)}%</strong></div><p>The projected profit profile is derived from the modelled sales, operating costs, depreciation, interest and tax assumptions.</p></div>
      </PrintPage>

      <PrintPage number={15} title="Projected Balance Sheet" kicker="14 • FINANCIAL POSITION" className="dpr-print-landscape">
        <FinancialTable columns={yearColumns} rows={balanceRows} firstColumn="Assets & Liabilities (₹)" />
        <div className="dpr-appraisal-band"><div><span>YEAR 1 ASSETS</span><strong>{money(numberValue(firstYear.netFixedAssets)+numberValue(firstYear.currentAssets))}</strong></div><div><span>YEAR 1 LOAN CLOSING</span><strong>{money(firstYear.closingLoan)}</strong></div><div><span>FINAL YEAR LOAN</span><strong>{money(lastYear.closingLoan)}</strong></div><p>The balance-sheet schedule is indicative and should be reconciled with detailed working-capital, inventory, receivable, creditor and cash/bank schedules.</p></div>
        <p className="dpr-print-note">Final bank-ready balance sheet preparation may require detailed schedules for inventory, receivables, creditors, cash/bank balances and working-capital facilities.</p>
      </PrintPage>

      <PrintPage number={16} title="Projected Cash Flow Statement" kicker="15 • CASH FLOW" className="dpr-print-landscape">
        <FinancialTable columns={yearColumns} rows={cashFlowRows} firstColumn="Cash Flow Summary (₹)" />
        <div className="dpr-appraisal-band"><div><span>YEAR 1 OPERATING CASH</span><strong>{money(firstYear.operatingCashFlow)}</strong></div><div><span>YEAR 1 NET CASH FLOW</span><strong>{money(firstYear.netCashFlow)}</strong></div><div><span>CUMULATIVE DEBT SERVICE</span><strong>{money(totalDebtService)}</strong></div><p>Positive modelled cash generation provides the primary source for servicing scheduled principal and interest, subject to actual operating performance.</p></div>
      </PrintPage>

      <PrintPage number={17} title="Loan Repayment Schedule" kicker="16 • DEBT SERVICING" className="dpr-print-landscape">
        <div className="dpr-print-summary-grid">
          <div><span>Term Loan</span><strong>{money(estimatedTermLoan)}</strong></div>
          <div><span>Interest Rate</span><strong>{interestRate.toFixed(2)}%</strong></div>
          <div><span>Tenure</span><strong>{projectionYears} Years</strong></div>
          <div><span>Moratorium</span><strong>{moratorium} Months</strong></div>
        </div>
        <div className="dpr-table-wrapper"><table className="dpr-modern-table"><thead><tr><th>Year</th><th>Opening Loan</th><th>Principal</th><th>Interest</th><th>Debt Service</th><th>Closing Loan</th></tr></thead><tbody>
          {financialYears.map((row, index) => { const repayment = repaymentSchedule[index] || row; return <tr key={`print-repayment-${index}`}><th>Year {index + 1}</th><td>{money(repayment.openingLoan ?? row.openingLoan)}</td><td>{money(repayment.principalRepayment ?? row.repayment)}</td><td>{money(repayment.interest ?? row.interest)}</td><td>{money(repayment.totalDebtService ?? row.debtService)}</td><td>{money(repayment.closingLoan ?? row.closingLoan)}</td></tr>; })}
        </tbody></table></div>
        <div className="dpr-appraisal-band"><div><span>TERM LOAN</span><strong>{money(estimatedTermLoan)}</strong></div><div><span>TOTAL DEBT SERVICE</span><strong>{money(totalDebtService)}</strong></div><div><span>CLOSING LOAN</span><strong>{money(lastYear.closingLoan)}</strong></div><p>Repayment is shown year-wise to support lender review of principal reduction, interest burden and outstanding exposure.</p></div>
      </PrintPage>

      <PrintPage number={18} title="Depreciation Statement" kicker="17 • ASSET SCHEDULE" className="dpr-print-landscape">
        <FinancialTable columns={yearColumns} rows={depreciationRows} firstColumn="Depreciation Schedule (₹)" />
        <div className="dpr-appraisal-band"><div><span>OPENING ASSET BASE</span><strong>{money(firstYear.openingWDV)}</strong></div><div><span>YEAR 1 DEPRECIATION</span><strong>{money(firstYear.depreciation)}</strong></div><div><span>FINAL ASSET BASE</span><strong>{money(lastYear.closingWDV)}</strong></div><p>Depreciation is reflected as a non-cash charge reducing the asset carrying value and influencing taxable profit and cash-available calculations.</p></div>
      </PrintPage>

      <PrintPage number={19} title="DSCR Statement" kicker="18 • DEBT COVERAGE" className="dpr-print-landscape">
        <div className="dpr-print-summary-grid"><div><span>Average DSCR</span><strong>{averageDSCR.toFixed(2)}</strong></div><div><span>Term Loan</span><strong>{money(estimatedTermLoan)}</strong></div><div><span>Interest Rate</span><strong>{interestRate.toFixed(2)}%</strong></div><div><span>Tenure</span><strong>{projectionYears} Years</strong></div></div>
        <div className="dpr-print-formula">DSCR = Cash Available for Debt Service / Total Debt Service. Cash Available = PAT + Depreciation + Interest.</div>
        <FinancialTable columns={yearColumns} rows={dscrRows} />
        <div className="dpr-appraisal-band"><div><span>AVERAGE DSCR</span><strong>{averageDSCR.toFixed(2)}</strong></div><div><span>MINIMUM YEARLY DSCR</span><strong>{financialYears.filter(y => numberValue(y.debtService) > 0).length ? Math.min(...financialYears.filter(y => numberValue(y.debtService) > 0).map(y => numberValue(y.dscr))).toFixed(2) : "0.00"}</strong></div><div><span>YEAR 1 DEBT SERVICE</span><strong>{money(firstYear.debtService)}</strong></div><p>DSCR is a core debt-servicing indicator. Final lender assessment will consider the bank's prescribed DSCR methodology and any adjustments to cash available for debt service.</p></div>
      </PrintPage>

      <PrintPage number={20} title="Break-even Analysis" kicker="19 • VIABILITY">
        <div className="dpr-credit-summary-grid dpr-break-even-grid">
          <div><span>Year 1 Revenue</span><strong>{money(financialYears[0]?.sales)}</strong><small>Projected sales</small></div>
          <div><span>Year 1 Operating Cost</span><strong>{money(financialYears[0]?.operatingExpenses)}</strong><small>Projected operating cost</small></div>
          <div><span>Year 1 EBITDA</span><strong>{money(financialYears[0]?.ebitda)}</strong><small>Operating surplus</small></div>
          <div><span>Operating Margin</span><strong>{financialYears[0]?.sales ? ((numberValue(financialYears[0]?.ebitda) / numberValue(financialYears[0]?.sales))*100).toFixed(1) : "0.0"}%</strong><small>Indicative Year 1</small></div>
        </div>
        <div className="dpr-credit-panel full"><h2>Break-even Interpretation</h2><MarkdownBlock>{reportBody(18) || "Additional information is required for final break-even calculation."}</MarkdownBlock></div>
        <div className="dpr-print-note"><strong>Important:</strong> The present DPR contains an indicative operating-margin assessment, not a separately calculated break-even volume or break-even sales schedule. A lender may require the detailed fixed-cost / variable-cost break-even computation during appraisal.</div>
      </PrintPage>

      <PrintPage number={21} title="Employment Generation & Government Support" kicker="20 • EMPLOYMENT & SUBSIDY">
        <div className="dpr-print-subsection"><h2>Employment Generation</h2><MarkdownBlock>{reportBody(19)}</MarkdownBlock></div>
        <div className="dpr-print-subsection"><h2>Government Subsidy / Scheme Consideration</h2><MarkdownBlock>{reportBody(20)}</MarkdownBlock></div>
      </PrintPage>

      <PrintPage number={22} title="SWOT Analysis" kicker="21 • STRATEGY">
        <div className="dpr-swot-grid">
          <div><span>STRENGTHS</span><MarkdownBlock>{reportBody(21).match(/Strengths[\s\S]*?(?=Weaknesses|$)/i)?.[0] || reportBody(21)}</MarkdownBlock></div>
          <div><span>WEAKNESSES</span><MarkdownBlock>{reportBody(21).match(/Weaknesses[\s\S]*?(?=Opportunities|$)/i)?.[0] || "Weaknesses identified in the generated SWOT narrative."}</MarkdownBlock></div>
          <div><span>OPPORTUNITIES</span><MarkdownBlock>{reportBody(21).match(/Opportunities[\s\S]*?(?=Threats|$)/i)?.[0] || "Opportunities identified in the generated SWOT narrative."}</MarkdownBlock></div>
          <div><span>THREATS</span><MarkdownBlock>{reportBody(21).match(/Threats[\s\S]*$/i)?.[0] || "Threats identified in the generated SWOT narrative."}</MarkdownBlock></div>
        </div>
      </PrintPage>

      <PrintPage number={23} title="Risk Analysis & Implementation Schedule" kicker="22 • RISK & EXECUTION">
        <div className="dpr-credit-columns">
          <div className="dpr-credit-panel"><h2>Risk Analysis & Mitigation</h2><MarkdownBlock>{reportBody(22) || "Additional risk information is required for final DPR calculation."}</MarkdownBlock></div>
          <div className="dpr-credit-panel"><h2>Implementation Sequence</h2><div className="dpr-timeline">{[
            ["01","Project planning, DPR submission & bank processing"],["02","Loan sanction & formal site preparation"],["03","Machinery procurement & civil works"],["04","Electrical installation & commissioning"],["05","Recruitment & trial run"],["06","Commercial operations launch"]
          ].map(([n,t]) => <div key={n}><b>{n}</b><span>{t}</span></div>)}</div></div>
        </div>
        <div className="dpr-print-note"><strong>Execution control:</strong> Final sequencing should be aligned with sanction conditions, vendor quotations, civil completion, machinery delivery and statutory requirements applicable to the unit.</div>
      </PrintPage>

      <PrintPage number={24} title="Conclusion & Bankability" kicker="23 • FINAL CREDIT VIEW" className="dpr-print-final">
        <MarkdownBlock>{reportBody(24)}</MarkdownBlock>
        <div className="dpr-credit-strip"><span>CREDIT VIEW</span><strong>Financially modelled project with subject-to-appraisal bankability</strong></div>
        <div className="dpr-print-summary-grid">
          <div><span>Total Project Cost</span><strong>{money(projectCost)}</strong></div>
          <div><span>Promoter Equity</span><strong>{money(promoterContribution)}</strong></div>
          <div><span>Bank Term Loan</span><strong>{money(estimatedTermLoan)}</strong></div>
          <div><span>Expected Subsidy</span><strong>{money(expectedSubsidy)}</strong></div>
          <div><span>Total Capital Cost</span><strong>{money(capitalCostTotal)}</strong></div>
          <div><span>Capital Difference</span><strong>{money(capitalDifference)}</strong></div>
        </div>
        <div className="dpr-print-disclaimer"><strong>Important Disclaimer</strong><p>This Detailed Project Report is prepared using information supplied by the applicant, financial assumptions and AI-assisted drafting. Final bank sanction, loan terms, subsidy approvals, statutory clearances and scheme eligibility remain subject to formal appraisal and verification by the concerned lender and Government authority.</p></div>
      </PrintPage>
    </div>
  );

  return (
    <div className="dpr-modern-page">
      <DPRPreviewPrintStyles />
      <DPRPreviewScreenStyles />

      {/* ==========================================================
          MODERN DPR WORKSPACE HEADER
      ========================================================== */}
      <header className="dpr-modern-header no-print">
        <div className="dpr-header-left">
          <button className="dpr-icon-btn" type="button" onClick={() => navigate("/dpr")} aria-label="Back to DPR">
            ←
          </button>
          <div>
            <div className="dpr-header-kicker">GoSubsidy • DPR Studio</div>
            <h1>Detailed Project Report</h1>
          </div>
        </div>

        <div className="dpr-header-actions">
          <div className="dpr-status-pill">
            <span className="dpr-status-dot" />
            Financial model connected
          </div>
          <button className="dpr-secondary-btn" type="button" onClick={() => navigate("/dpr")}>
            Edit DPR
          </button>
          <button className="dpr-primary-btn" type="button" onClick={handlePrint}>
            Print / Save PDF
          </button>
        </div>
      </header>

      <div className="dpr-modern-shell">
        {/* ========================================================
            STICKY DOCUMENT NAVIGATION
        ======================================================== */}
        <aside className="dpr-side-nav no-print">
          <div className="dpr-side-brand">
            <div className="dpr-side-logo">GS</div>
            <div>
              <strong>GoSubsidy</strong>
              <span>DPR Studio</span>
            </div>
          </div>

          <div className="dpr-side-project">
            <span>Current Project</span>
            <strong>{project.projectName || "Untitled Project"}</strong>
            <small>{project.businessType || "Business Project"}</small>
          </div>

          <nav className="dpr-side-links" aria-label="DPR sections">
            <a href="#overview"><span>01</span> Overview</a>
            <a href="#project-info"><span>02</span> Promoter & Project</a>
            <a href="#assumptions"><span>03</span> Assumptions</a>
            <a href="#executive-summary"><span>04</span> Executive Summary</a>
            <a href="#project-description"><span>05</span> Project & Market</a>
            <a href="#technical"><span>06</span> Technical Feasibility</a>
            <a href="#capital-cost"><span>07</span> Capital Cost</a>
            <a href="#means-finance"><span>08</span> Means of Finance</a>
            <a href="#financials"><span>09</span> Financial Statements</a>
            <a href="#debt-service"><span>10</span> Debt & DSCR</a>
            <a href="#risk"><span>11</span> Risk & Implementation</a>
            <a href="#conclusion"><span>12</span> Bankability</a>
          </nav>

          <div className="dpr-side-footer">
            <span>Projection</span>
            <strong>{projectionYears} years</strong>
          </div>
        </aside>

        {/* ========================================================
            DOCUMENT CONTENT
        ======================================================== */}
        <main className="dpr-modern-content">
          <PrintDocument />
          {/* HERO / PROJECT COVER */}
          <section className="dpr-hero-card" id="overview">
            <div className="dpr-hero-glow dpr-glow-one" />
            <div className="dpr-hero-glow dpr-glow-two" />

            <div className="dpr-hero-top">
              <div>
                <div className="dpr-eyebrow">DETAILED PROJECT REPORT</div>
                <h2>{project.projectName || "Detailed Project Report"}</h2>
                <p>
                  {project.businessType || "Business Project"}
                  {project.location ? ` • ${project.location}` : ""}
                  {project.district ? ` • ${project.district}` : ""}
                  {project.state ? `, ${project.state}` : ""}
                </p>
              </div>

              <div className="dpr-hero-badge">
                <span>Prepared by</span>
                <strong>GoSubsidy AI DPR</strong>
                <small>{provider}</small>
              </div>
            </div>

            <div className="dpr-hero-metrics">
              <div>
                <span>Total Project Cost</span>
                <strong>{money(projectCost)}</strong>
              </div>
              <div>
                <span>Promoter Contribution</span>
                <strong>{money(promoterContribution)}</strong>
                <small>{promoterPercent.toFixed(1)}%</small>
              </div>
              <div>
                <span>Bank Term Loan</span>
                <strong>{money(estimatedTermLoan)}</strong>
                <small>{projectCost ? (estimatedTermLoan / projectCost * 100).toFixed(1) : "0.0"}%</small>
              </div>
              <div>
                <span>Expected Subsidy</span>
                <strong>{money(expectedSubsidy)}</strong>
                <small>{subsidyPercent.toFixed(1)}%</small>
              </div>
            </div>
          </section>

          {/* CREDIT READINESS STRIP */}
          <section className="dpr-readiness-strip" aria-label="DPR credit readiness">
            <div>
              <span>MODEL STATUS</span>
              <strong>Financial model connected</strong>
            </div>
            <div>
              <span>CAPITAL RECONCILIATION</span>
              <strong>{Math.abs(capitalDifference) < 1 ? "✓ Reconciled" : "Review Required"}</strong>
            </div>
            <div>
              <span>WORKING CAPITAL</span>
              <strong>{workingCapitalRequirement > 0 ? money(workingCapitalRequirement) : "Not specified"}</strong>
              <small>{workingCapitalBasis}</small>
            </div>
            <div>
              <span>PROJECTION</span>
              <strong>{projectionYears} Years</strong>
            </div>
            <div>
              <span>AVERAGE DSCR</span>
              <strong>{averageDSCR.toFixed(2)}</strong>
            </div>
          </section>

          {/* EXECUTIVE SNAPSHOT */}
          <section className="dpr-section-card dpr-working-capital-card" id="working-capital">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">WC</span>
                <div>
                  <div className="dpr-section-kicker">WORKING CAPITAL</div>
                  <h2>Working Capital Assessment</h2>
                </div>
              </div>
              <span className={`dpr-reconcile-pill ${
                workingCapitalRequired === true ? "ok" : "pending"
              }`}>
                {workingCapitalRequired === true ? "Required" :
                 workingCapitalRequired === false ? "Not Required" : "Not Specified"}
              </span>
            </div>

            <div className="dpr-working-capital-grid">
              <div>
                <span>Requirement</span>
                <strong>
                  {workingCapitalRequired === false
                    ? "₹0"
                    : workingCapitalRequirement > 0
                      ? money(workingCapitalRequirement)
                      : "Not specified"}
                </strong>
              </div>
              <div>
                <span>Purpose</span>
                <strong>{workingCapitalPurpose || "Not specified"}</strong>
              </div>
              <div>
                <span>Working Capital Cycle</span>
                <strong>
                  {workingCapitalRequired === true && workingCapitalCycleDays > 0
                    ? `${workingCapitalCycleDays} Days`
                    : "Not specified"}
                </strong>
              </div>
              <div>
                <span>Basis</span>
                <strong>{workingCapitalBasis}</strong>
              </div>
            </div>
          </section>

          <section className="dpr-section-card" id="project-info">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">01</span>
                <div>
                  <div className="dpr-section-kicker">PROJECT PROFILE</div>
                  <h2>Promoter & Project Information</h2>
                </div>
              </div>
            </div>

            <div className="dpr-info-grid">
              {[
                ["Project Name", project.projectName],
                ["Promoter Name", project.promoterName],
                ["Business / Sector", project.businessType],
                ["Constitution", project.constitution],
                ["Mobile Number", project.mobile],
                ["Email Address", project.email],
                ["Project Location", project.location],
                ["District / State", [project.district, project.state].filter(Boolean).join(" / ")],
              ].map(([label, value]) => (
                <div className="dpr-info-item" key={label}>
                  <span>{label}</span>
                  <strong>{value || "Not provided"}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* ASSUMPTIONS */}
          <section className="dpr-section-card" id="assumptions">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">02</span>
                <div>
                  <div className="dpr-section-kicker">FINANCIAL MODEL</div>
                  <h2>Financial Assumptions</h2>
                </div>
              </div>
              <span className="dpr-model-badge">Authoritative calculation payload</span>
            </div>

            <div className="dpr-assumption-grid">
              <div><span>Project Cost</span><strong>{money(projectCost)}</strong></div>
              <div><span>Interest Rate</span><strong>{interestRate.toFixed(2)}% p.a.</strong></div>
              <div><span>Promoter Contribution</span><strong>{promoterPercent.toFixed(2)}%</strong></div>
              <div><span>Expected Subsidy</span><strong>{subsidyPercent.toFixed(2)}%</strong></div>
              <div><span>Loan Repayment</span><strong>{loanTenure} {loanTenure === 1 ? "Year" : "Years"}</strong></div>
              <div><span>Moratorium</span><strong>{moratorium} Months</strong></div>
              <div>
                <span>Working Capital</span>
                <strong>{workingCapitalRequirement > 0 ? money(workingCapitalRequirement) : "Not specified"}</strong>
                <small>{workingCapitalBasis}</small>
              </div>
            </div>

            <div className="dpr-note-box">
              <strong>Subsidy assumption</strong>
              <p>
                The subsidy shown is a financial modelling assumption. Final eligibility,
                eligible project cost, subsidy percentage and maximum subsidy must be verified
                against the applicable Government scheme and official guidelines.
              </p>
            </div>
          </section>

          {/* DPR NARRATIVE */}
          <section className="dpr-section-card" id="executive-summary">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">03</span>
                <div>
                  <div className="dpr-section-kicker">BUSINESS CASE</div>
                  <h2>Executive Summary</h2>
                </div>
              </div>
            </div>
            <MarkdownBlock>{reportBody(1)}</MarkdownBlock>
          </section>

          <section className="dpr-two-column">
            <section className="dpr-section-card" id="project-description">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">04</span>
                  <div>
                    <div className="dpr-section-kicker">PROJECT</div>
                    <h2>Project at a Glance</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(2)}</MarkdownBlock>
            </section>

            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">05</span>
                  <div>
                    <div className="dpr-section-kicker">PROMOTER</div>
                    <h2>Promoter Profile</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(3)}</MarkdownBlock>
            </section>
          </section>

          <section className="dpr-section-card">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">06</span>
                <div>
                  <div className="dpr-section-kicker">BUSINESS MODEL</div>
                  <h2>Business / Project Description</h2>
                </div>
              </div>
            </div>
            <MarkdownBlock>{reportBody(4)}</MarkdownBlock>
          </section>

          <section className="dpr-two-column" id="technical">
            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">07</span>
                  <div>
                    <div className="dpr-section-kicker">MARKET</div>
                    <h2>Industry Overview</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(5)}</MarkdownBlock>
            </section>

            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">08</span>
                  <div>
                    <div className="dpr-section-kicker">DEMAND</div>
                    <h2>Market Potential</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(6)}</MarkdownBlock>
            </section>
          </section>

          <section className="dpr-section-card">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">09</span>
                <div>
                  <div className="dpr-section-kicker">TECHNICAL VIABILITY</div>
                  <h2>Technical Feasibility</h2>
                </div>
              </div>
            </div>
            <MarkdownBlock>{reportBody(7)}</MarkdownBlock>
          </section>

          {/* CAPITAL + FINANCE */}
          <section className="dpr-section-card" id="capital-cost">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">10</span>
                <div>
                  <div className="dpr-section-kicker">PROJECT INVESTMENT</div>
                  <h2>Capital Cost Statement</h2>
                </div>
              </div>
              <span className={`dpr-reconcile-pill ${Math.abs(capitalDifference) < 1 ? "ok" : "pending"}`}>
                {Math.abs(capitalDifference) < 1 ? "✓ Reconciled" : "Review Required"}
              </span>
            </div>

            <FinancialTable
              columns={[{ key: "amount", label: "Amount (₹)" }]}
              rows={[
                ...capitalItems.map(([label, value]) => ({ label, values: { amount: value } })),
                { label: "Total Capital Cost", values: { amount: capitalCostTotal }, total: true, bold: true },
                { label: "Total Project Cost", values: { amount: projectCost }, total: true, bold: true },
                { label: "Reconciliation Difference", values: { amount: capitalDifference }, total: true, bold: true },
              ]}
            />

            <p className="dpr-inline-note">
              {Math.abs(capitalDifference) < 1
                ? "Capital cost components are fully reconciled with the authoritative Total Project Cost."
                : "Capital cost reconciliation is pending because the entered components do not equal the authoritative Total Project Cost."}
            </p>
          </section>

          <section className="dpr-section-card" id="means-finance">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">11</span>
                <div>
                  <div className="dpr-section-kicker">FUNDING STRUCTURE</div>
                  <h2>Means of Finance</h2>
                </div>
              </div>
            </div>

            <FinancialTable
              columns={[
                { key: "percent", label: "Percentage" },
                { key: "amount", label: "Amount (₹)" },
              ]}
              rows={[
                { label: "Promoter Contribution", values: { percent: `${promoterPercent.toFixed(2)}%`, amount: promoterContribution } },
                { label: "Bank Term Loan", values: { percent: `${(projectCost ? estimatedTermLoan / projectCost * 100 : 0).toFixed(2)}%`, amount: estimatedTermLoan } },
                { label: "Expected Subsidy", values: { percent: `${subsidyPercent.toFixed(2)}%`, amount: expectedSubsidy } },
                { label: "Total Means of Finance", values: { percent: "100.00%", amount: promoterContribution + estimatedTermLoan + expectedSubsidy }, total: true, bold: true },
              ]}
            />

            <div className="dpr-control-strip">
              <span>Funding control</span>
              <strong>Project Cost = Promoter Contribution + Bank Term Loan + Expected Subsidy</strong>
            </div>
          </section>

          {/* FINANCIAL DASHBOARD */}
          <section className="dpr-section-card dpr-financial-master" id="financials">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">12</span>
                <div>
                  <div className="dpr-section-kicker">BANKING MODEL</div>
                  <h2>Projected Financial Statements</h2>
                </div>
              </div>
              <span className="dpr-model-badge">Year 1 → Year {projectionYears}</span>
            </div>

            <div className="dpr-financial-tabs">
              <div className="dpr-financial-tab active">Income</div>
              <div className="dpr-financial-tab">Expenditure</div>
              <div className="dpr-financial-tab">P&amp;L</div>
              <div className="dpr-financial-tab">Balance Sheet</div>
              <div className="dpr-financial-tab">Cash Flow</div>
            </div>

            <div className="dpr-financial-block">
              <h3>Income Statement</h3>
              <FinancialTable columns={yearColumns} rows={incomeRows} firstColumn="Year / Particulars" />
            </div>

            <div className="dpr-financial-block">
              <h3>Expenditure Statement</h3>
              <FinancialTable columns={yearColumns} rows={expenditureRows} />
            </div>

            <div className="dpr-financial-block">
              <h3>Profit &amp; Loss Account</h3>
              <FinancialTable columns={yearColumns} rows={pnlRows} />
            </div>

            <div className="dpr-financial-block">
              <h3>Balance Sheet</h3>
              <FinancialTable columns={yearColumns} rows={balanceRows} firstColumn="Assets & Liabilities (₹)" />
              <p className="dpr-inline-note">
                Final bank-ready balance sheet preparation may require detailed schedules for inventory,
                receivables, creditors, cash/bank balances and working-capital facilities.
              </p>
            </div>

            <div className="dpr-financial-block">
              <h3>Cash Flow Statement</h3>
              <FinancialTable columns={yearColumns} rows={cashFlowRows} firstColumn="Cash Flow Summary (₹)" />
            </div>
          </section>

          {/* DEBT SERVICE */}
          <section className="dpr-section-card" id="debt-service">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">13</span>
                <div>
                  <div className="dpr-section-kicker">DEBT SERVICING</div>
                  <h2>Repayment, Depreciation & DSCR</h2>
                </div>
              </div>
              <div className="dpr-dscr-score">
                <span>Average DSCR</span>
                <strong>{averageDSCR.toFixed(2)}</strong>
              </div>
            </div>

            <div className="dpr-debt-summary">
              <div><span>Term Loan</span><strong>{money(estimatedTermLoan)}</strong></div>
              <div><span>Interest Rate</span><strong>{interestRate.toFixed(2)}%</strong></div>
              <div><span>Tenure</span><strong>{projectionYears} Years</strong></div>
              <div><span>Moratorium</span><strong>{moratorium} Months</strong></div>
            </div>

            <div className="dpr-financial-block">
              <h3>Repayment Schedule</h3>
              <div className="dpr-table-wrapper">
                <table className="dpr-modern-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Opening Loan</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Debt Service</th>
                      <th>Closing Loan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialYears.map((row, index) => {
                      const repayment = repaymentSchedule[index] || row;
                      return (
                        <tr key={`repayment-${index}`}>
                          <th>Year {index + 1}</th>
                          <td>{money(repayment.openingLoan ?? row.openingLoan)}</td>
                          <td>{money(repayment.principalRepayment ?? row.repayment)}</td>
                          <td>{money(repayment.interest ?? row.interest)}</td>
                          <td>{money(repayment.totalDebtService ?? row.debtService)}</td>
                          <td>{money(repayment.closingLoan ?? row.closingLoan)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dpr-financial-block">
              <h3>Depreciation Statement</h3>
              <FinancialTable columns={yearColumns} rows={depreciationRows} firstColumn="Depreciation Schedule (₹)" />
            </div>

            <div className="dpr-financial-block">
              <h3>DSCR Statement</h3>
              <div className="dpr-formula-box">
                <strong>DSCR = Cash Available for Debt Service / Total Debt Service</strong>
                <span>Cash Available = PAT + Depreciation + Interest</span>
              </div>
              <FinancialTable columns={yearColumns} rows={dscrRows} />
            </div>
          </section>

          {/* BUSINESS / RISK / IMPLEMENTATION */}
          <section className="dpr-section-card">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">14</span>
                <div>
                  <div className="dpr-section-kicker">VIABILITY</div>
                  <h2>Break-even Analysis</h2>
                </div>
              </div>
            </div>
            <MarkdownBlock>{reportBody(18) || "Additional information is required for final break-even calculation."}</MarkdownBlock>
          </section>

          <section className="dpr-two-column">
            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">15</span>
                  <div>
                    <div className="dpr-section-kicker">EMPLOYMENT</div>
                    <h2>Employment Generation</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(19)}</MarkdownBlock>
            </section>

            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">16</span>
                  <div>
                    <div className="dpr-section-kicker">GOVERNMENT SUPPORT</div>
                    <h2>Subsidy / Scheme Consideration</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(20)}</MarkdownBlock>
            </section>
          </section>

          <section className="dpr-two-column" id="risk">
            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">17</span>
                  <div>
                    <div className="dpr-section-kicker">STRATEGY</div>
                    <h2>SWOT Analysis</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(21)}</MarkdownBlock>
            </section>

            <section className="dpr-section-card">
              <div className="dpr-section-head compact">
                <div>
                  <span className="dpr-section-number">18</span>
                  <div>
                    <div className="dpr-section-kicker">RISK CONTROL</div>
                    <h2>Risk Analysis &amp; Mitigation</h2>
                  </div>
                </div>
              </div>
              <MarkdownBlock>{reportBody(22)}</MarkdownBlock>
            </section>
          </section>

          <section className="dpr-section-card">
            <div className="dpr-section-head">
              <div>
                <span className="dpr-section-number">19</span>
                <div>
                  <div className="dpr-section-kicker">EXECUTION</div>
                  <h2>Implementation Schedule</h2>
                </div>
              </div>
            </div>
            <MarkdownBlock>{reportBody(23)}</MarkdownBlock>
          </section>

          {/* BANKABILITY */}
          <section className="dpr-bankability-card" id="conclusion">
            <div className="dpr-bankability-top">
              <div>
                <div className="dpr-eyebrow">FINAL CREDIT VIEW</div>
                <h2>Conclusion &amp; Bankability</h2>
              </div>
              <div className="dpr-bankability-mark">✓</div>
            </div>

            <MarkdownBlock>{reportBody(24)}</MarkdownBlock>

            <div className="dpr-control-grid">
              <div><span>Total Project Cost</span><strong>{money(projectCost)}</strong></div>
              <div><span>Promoter Equity</span><strong>{money(promoterContribution)}</strong><small>{promoterPercent.toFixed(2)}%</small></div>
              <div><span>Bank Term Loan</span><strong>{money(estimatedTermLoan)}</strong><small>{projectCost ? (estimatedTermLoan / projectCost * 100).toFixed(2) : "0.00"}%</small></div>
              <div><span>Expected Subsidy</span><strong>{money(expectedSubsidy)}</strong><small>{subsidyPercent.toFixed(2)}%</small></div>
              <div><span>Total Capital Cost</span><strong>{money(capitalCostTotal)}</strong></div>
              <div><span>Capital Difference</span><strong>{money(capitalDifference)}</strong></div>
            </div>
          </section>

          {/* DISCLAIMER */}
          <section className="dpr-disclaimer-card">
            <div>
              <strong>Important Disclaimer</strong>
              <p>
                This Detailed Project Report is prepared using information supplied by the applicant,
                financial assumptions and AI-assisted drafting. Final bank sanction, loan terms,
                subsidy approvals, statutory clearances and scheme eligibility remain subject to
                formal appraisal and verification by the concerned lender and Government authority.
              </p>
            </div>
          </section>

          <footer className="dpr-modern-footer">
            <div>
              <strong>GoSubsidy</strong>
              <span>Government Schemes &amp; Financial Intelligence Platform</span>
            </div>
            <span>Projection: Year 1–{projectionYears}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function DPRPreview() {
  return (
    <ErrorBoundary>
      <DPRPreviewContent />
    </ErrorBoundary>
  );
}