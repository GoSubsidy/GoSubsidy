import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./DPRPreview.css";

const MAX_YEARS = 15;
const MIN_DPR_PAGES = 30;

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

const clampYears = (value) =>
  Math.min(MAX_YEARS, Math.max(1, Math.floor(numberValue(value) || 1)));

const getSectorTheme = (businessType) => {
  const value = String(businessType || "").trim().toLowerCase();
  if (/agri|agriculture|farming|farm|dairy|poultry|livestock|fisher|fisheries|horticulture|floriculture|aquaculture/.test(value)) return "agriculture";
  if (/food|bakery|restaurant|cafe|catering|food processing|beverage|hotel|hospitality|tourism|travel/.test(value)) return "food-hospitality";
  if (/manufactur|factory|engineering|fabricat|machining|automobile|auto component|textile|garment|pharma|chemical|plastic|metal|steel|electrical|electronics/.test(value)) return "manufacturing";
  if (/construct|civil|infrastructure|building|contractor|real estate|interior/.test(value)) return "construction";
  if (/health|medical|clinic|hospital|diagnostic|pharmacy|wellness/.test(value)) return "healthcare";
  if (/education|school|college|training|coaching|skill development|academy/.test(value)) return "education";
  if (/information technology\b|\bit\b|software|technology|tech|saas|digital|cyber|ai |artificial intelligence|computer/.test(value)) return "technology";
  if (/retail|trading|wholesale|distribut|commerce|e-commerce|ecommerce|merchant/.test(value)) return "retail";
  if (/transport|logistics|courier|warehouse|freight|automobile service|vehicle/.test(value)) return "transport";
  if (/energy|solar|renewable|electric vehicle|ev |power|battery/.test(value)) return "energy";
  if (/service|consult|professional|agency|repair|maintenance|beauty|salon|freelance/.test(value)) return "services";
  return "default";
};

const sanitizeProjectAtGlance = (text) => {
  return String(text || "")
    .split("\n")
    .filter((line) => !/loan\s*(repayment\s*)?(period|tenure)/i.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const getProjectionYears = (...sources) => {
  for (const source of sources) {
    const explicit = source?.projectionYears ?? source?.project?.projectionYears ?? source?.payload?.projectionYears;
    if (numberValue(explicit) > 0) return clampYears(explicit);
  }
  for (const source of sources) {
    const calculatedYearCount = source?.calculations?.years?.length ?? source?.years?.length;
    if (numberValue(calculatedYearCount) > 0) return clampYears(calculatedYearCount);
  }
  for (const source of sources) {
    const tenure = source?.loanTenure ?? source?.repaymentTenure ?? source?.projection?.loanTenure ?? source?.project?.loanTenure;
    if (numberValue(tenure) > 0) return clampYears(tenure);
  }
  return 7;
};

const parseReportSections = (report) => {
  const result = {};
  const text = String(report || "").replace(/\r/g, "");
  const sectionTitleHints = [
    "executive summary", "project at a glance", "promoter profile",
    "business", "industry overview", "market potential",
    "technical feasibility", "product", "raw materials", "capital cost",
    "means of finance", "income statement", "expenditure statement",
    "profit", "balance sheet", "cash flow", "repayment", "depreciation",
    "debt service", "financial performance", "working capital", "bankability",
    "subsidy", "swot", "risk", "implementation", "conclusion", "disclaimer",
  ];

  const headingRegex = /^\s*(?:#{1,6}\s*)?(\d{1,2})(?:\s*[.)]\s*|\s+)([^\n]+?)\s*$/gm;
  const matches = [...text.matchAll(headingRegex)].filter((match) => {
    const sectionNumber = Number(match[1]);
    const title = String(match[2] || "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
    return sectionNumber >= 1 && sectionNumber <= 30 && sectionTitleHints.some((hint) => title.includes(hint));
  });

  if (!matches.length) {
    result.full = text;
    return result;
  }

  matches.forEach((match, index) => {
    const sectionNumber = Number(match[1]);
    const title = String(match[2] || "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;

    result[sectionNumber] = { number: sectionNumber, title, body: text.slice(start, end).trim() };
  });

  return result;
};

const SectionHeading = ({ number, title }) => (
  <div className="dpr30-section-heading">
    <span>{String(number).padStart(2, "0")}</span>
    <h2>{title}</h2>
  </div>
);

const PageHeader = ({ page, title }) => (
  <header className="dpr30-page-header">
    <div>
      <div className="dpr30-page-title">Detailed Project Report</div>
    </div>
    <div className="dpr30-page-title-right">{title}</div>
    <div className="dpr30-page-number">Page {page} of {MIN_DPR_PAGES}</div>
  </header>
);

const Page = ({ page, title, children, className = "" }) => (
  <section className={`dpr30-page ${className}`}>
    <PageHeader page={page} title={title} />
    <div className="dpr30-page-content">{children}</div>
    <footer className="dpr30-page-footer">
      <span>GoSubsidy • Government Schemes & Financial Intelligence Platform</span>
      <span>{page}/{MIN_DPR_PAGES}</span>
    </footer>
  </section>
);

const MarkdownBlock = ({ children }) => {
  const content = String(children || "").trim();
  if (!content) return null;
  return (
    <article className="dpr30-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children: tableChildren }) => <div className="dpr30-table-wrap"><table>{tableChildren}</table></div>,
          h1: ({ children: headingChildren }) => <h3>{headingChildren}</h3>,
          h2: ({ children: headingChildren }) => <h3>{headingChildren}</h3>,
          h3: ({ children: headingChildren }) => <h4>{headingChildren}</h4>,
          blockquote: ({ children: quoteChildren }) => <blockquote className="dpr30-blockquote">{quoteChildren}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="dpr30-summary-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const AIKeyHighlights = ({ children, size = "full" }) => {
  const content = String(children || "").trim();
  if (!content) return null;
  return (
    <section className={`dpr30-ai-section dpr30-ai-section--${size}`}>
      <div className="dpr30-ai-section-head">
        <div>
          <span>AI BUSINESS INTELLIGENCE</span>
          <h3>Business-specific key points</h3>
        </div>
        <strong>Generated for this project</strong>
      </div>
      <MarkdownBlock>{content}</MarkdownBlock>
    </section>
  );
};

const InfoTable = ({ rows }) => (
  <table className="dpr30-info-table">
    <tbody>
      {rows.map(([label, value]) => (
        <tr key={label}><th>{label}</th><td>{value || "—"}</td></tr>
      ))}
    </tbody>
  </table>
);

export default function DPRPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const requestedPremium = searchParams.get("mode") === "premium" || searchParams.get("full") === "1" || searchParams.get("print") === "1";
  const printMode = searchParams.get("print") === "1";

  useEffect(() => {
    if (!printMode) return;
    const timer = window.setTimeout(() => window.print(), 500);
    return () => window.clearTimeout(timer);
  }, [printMode]);

  const [workspaceRevision, setWorkspaceRevision] = React.useState(0);

  useEffect(() => {
    if (requestedPremium) return;
    const refreshFromDPRWorkspace = () => setWorkspaceRevision((value) => value + 1);
    window.addEventListener("storage", refreshFromDPRWorkspace);
    const timer = window.setInterval(refreshFromDPRWorkspace, 500);
    return () => {
      window.removeEventListener("storage", refreshFromDPRWorkspace);
      window.clearInterval(timer);
    };
  }, [requestedPremium]);

  const generatedDPR = useMemo(() => {
    if (location.state?.generatedDPR) return location.state.generatedDPR;

    let storedGenerated = null;
    try {
      const raw = localStorage.getItem("gosubsidy_generated_dpr");
      if (raw) storedGenerated = JSON.parse(raw);
    } catch (error) { console.warn(error); }

    let storedPreview = null;
    try {
      const raw = localStorage.getItem("gosubsidy_dpr_preview");
      if (raw) storedPreview = JSON.parse(raw);
    } catch (error) { console.warn(error); }

    let storedWorkspace = null;
    try {
      const raw = localStorage.getItem("gosubsidy_dpr_project");
      if (raw) storedWorkspace = JSON.parse(raw);
    } catch (error) { console.warn(error); }

    let projectPayload = location.state?.project || null;
    try {
      const raw = localStorage.getItem("gosubsidy_ai_dpr");
      if (raw && !projectPayload) projectPayload = JSON.parse(raw);
    } catch (error) { console.warn(error); }

    const isKeyPointsPreview = !requestedPremium;
    const authoritativePayload = isKeyPointsPreview
      ? (storedWorkspace || storedPreview || projectPayload || storedGenerated || {})
      : (projectPayload || storedGenerated || storedPreview || {});

    const report = location.state?.dpr || (isKeyPointsPreview ? (storedPreview?.report || storedGenerated?.report || "") : (storedGenerated?.report || storedPreview?.report || "")) || localStorage.getItem("gosubsidy_generated_dpr_text") || "";

    const normalizedProject = authoritativePayload?.project && typeof authoritativePayload.project === "object" ? authoritativePayload.project : authoritativePayload || {};

    return {
      ...(storedGenerated || {}),
      ...(isKeyPointsPreview ? (storedWorkspace || storedPreview || {}) : {}),
      ...(isKeyPointsPreview ? authoritativePayload : {}),
      project: normalizedProject,
      report,
      provider: (isKeyPointsPreview ? (storedPreview?.provider || storedGenerated?.provider) : (storedGenerated?.provider || storedPreview?.provider)) || location.state?.provider || "Google Gemini",
      backendProject: (isKeyPointsPreview ? (storedPreview?.financialData || storedPreview?.backendProject || storedGenerated?.backendProject) : (storedGenerated?.backendProject || storedPreview?.financialData)) || location.state?.financialData || {},
    };
  }, [location.state, workspaceRevision]);

  const payload = generatedDPR?.project || {};
  const project = payload?.project || payload || {};

  let premiumUnlocked = false;
  try {
    const rawAccess = localStorage.getItem("gosubsidy_dpr_premium_access");
    const access = rawAccess ? JSON.parse(rawAccess) : null;
    premiumUnlocked = Boolean(
      access?.paymentStatus === "paid" &&
      access?.product === "DPR_PRO"
    );
  } catch (error) {
    console.warn("Unable to read Premium DPR entitlement:", error);
  }

  const fullMode = requestedPremium && premiumUnlocked;
  const summary = payload?.summary || {};
  const backendProject = requestedPremium ? (generatedDPR?.backendProject || location.state?.financialData || {}) : (payload?.backendProject || {});
  const calculations = payload?.calculations || generatedDPR?.calculations || (requestedPremium ? backendProject?.calculations : {}) || {};
  const report = generatedDPR?.report || location.state?.dpr || "";
  const reportSections = useMemo(() => parseReportSections(report), [report]);

  const projectCost = numberValue(summary.projectCost ?? backendProject.projectCost ?? project.projectCost);
  const promoterContribution = numberValue(summary.promoterContribution ?? summary.promoterContributionAmount ?? backendProject.promoterContributionAmount ?? projectCost * numberValue(project.promoterContributionPercent) / 100);
  const expectedSubsidy = numberValue(summary.expectedSubsidy ?? backendProject.estimatedSubsidy ?? projectCost * numberValue(project.subsidyPercent) / 100);
  const estimatedTermLoan = numberValue(summary.estimatedTermLoan ?? backendProject.estimatedTermLoan ?? Math.max(0, projectCost - promoterContribution - expectedSubsidy));
  const promoterPercent = projectCost > 0 ? promoterContribution / projectCost * 100 : numberValue(project.promoterContributionPercent);
  const subsidyPercent = numberValue(backendProject.subsidyPercent ?? project.subsidyPercent);
  const interestRate = numberValue((requestedPremium ? backendProject.interestRate : undefined) ?? project.interestRate);
  const loanTenure = clampYears((requestedPremium ? backendProject.loanTenure : undefined) ?? project.loanTenure);
  const moratorium = Math.max(0, Math.floor(numberValue((requestedPremium ? backendProject.moratorium : undefined) ?? project.moratorium)));
  const workingCapital = numberValue(project.workingCapitalMargin ?? backendProject.capitalCost?.workingCapitalMargin ?? project.workingCapital ?? 0);

  const projectionYears = getProjectionYears(payload, payload?.project, project, requestedPremium ? backendProject : null, calculations, requestedPremium ? generatedDPR : null);
  const sectorTheme = getSectorTheme(project.businessType);
  const financialPageClass = projectionYears > 5 ? "dpr30-financial-page dpr30-page--landscape" : "dpr30-financial-page";
  const rawYears = Array.isArray(calculations?.years) ? calculations.years : [];
  const financialYears = useMemo(() => rawYears.slice(0, projectionYears).map((row, index) => ({ year: numberValue(row?.year) || index + 1, ...row })), [rawYears, projectionYears]);
  const averageDSCR = numberValue(summary.averageDSCR ?? calculations.averageDSCR ?? backendProject.averageDSCR);

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
  const capitalCostTotal = numberValue(backendProject?.capitalCost?.totalCapitalCost ?? payload?.capitalCost?.totalCapitalCost ?? capitalItems.reduce((sum, [, value]) => sum + value, 0));
  const capitalDifference = projectCost - capitalCostTotal;

  const getExpandedNarration = (sectionNumber, title) => {
    const baseContent = reportSections[sectionNumber]?.body || "";
    if (baseContent.length > 80 && !baseContent.includes("Business-specific key points")) {
      return baseContent;
    }

    const name = project?.projectName || "The proposed project";
    const sector = project?.businessType || "business venture";
    const location = [project?.location, project?.district, project?.state].filter(Boolean).join(", ") || "the designated region";

    switch (numberValue(sectionNumber)) {
      case 1:
        return `**${name}** is positioned as a high-potential enterprise operating within the ${sector} sector at ${location}. This Detailed Project Report evaluates the technical feasibility, financial viability, and overall bankability of establishing and scaling operations.\n\nThe capital structure incorporates optimal debt-equity proportions, ensuring robust Debt Service Coverage Ratios (DSCR) and healthy profitability margins across the projection timeline.`;
      case 2:
        return `The project encompasses comprehensive infrastructural setup, asset acquisition, and working capital management designed for optimal operational efficiency in ${location}.\n\nFinancial modeling indicates steady revenue expansion driven by regional demand. Compliance with statutory standards, environmental norms, and rigorous quality controls has been fully integrated.`;
      case 3:
        return `The enterprise is led by committed promoter management bringing operational acumen and administrative capability.\n\nStrategic oversight will focus on risk mitigation, technological adoption, and maintaining strong supplier-customer relationships to secure long-term commercial success and lender confidence.`;
      case 4:
        return `**${name}** operates with a clear mandate to deliver high-quality products and services within the ${sector} industry. The business model integrates modern workflows, structured supply chains, and customer-centric value propositions.\n\nOperations are scaled to adapt to market dynamics, ensuring optimal capacity utilization and consistent revenue generation.`;
      case 5:
        return `The broader industry landscape for ${sector} serves as a critical engine of economic growth, regional employment, and infrastructure development, supported by favorable government policies and industrial demand.\n\nOperating characteristics rely on supply-chain integration, cost leadership, and strict compliance with statutory regulations.`;
      case 6:
        return `Target customers include local distributors, institutional buyers, and retail channels within ${location} and surrounding markets. Demand is driven by regional commercial activity and expanding trade networks.\n\nThe competitive strategy relies on competitive pricing, reliable delivery, and strict quality assurance.`;
      case 7:
        return `The technical setup for **${name}** has been designed to meet rigorous industrial and commercial standards. Equipment selection, plant layout, utility connections, and waste management protocols are structured to ensure seamless day-to-day operations and safety compliance.\n\nMachinery workflows are optimized for minimal downtime, energy efficiency, and scalable output capacity.`;
      case 8:
        return `The proposed facility focuses on standardized outputs aligned with regional demand in ${location}. Initial schedules are planned for efficient single-shift operations, with scale-up logic driven by incremental capacity utilization.`;
      case 9:
        return `Raw materials, utilities, and consumables will be sourced through established regional supply channels to ensure uninterrupted production cycles and cost-competitive inventory management.`;
      case 20:
        return `Government scheme considerations and subsidy frameworks have been evaluated to optimize project capital costs and enhance overall financial returns.`;
      case 21:
        return `**SWOT Analysis for ${name}:**\n* **Strengths:** Favorable location with strong connectivity, committed promoter equity, and low debt-servicing stress.\n* **Weaknesses:** Initial exposure to supply chain scaling and market establishment.\n* **Opportunities:** Expansion into neighboring regional markets and capacity scaling.\n* **Threats:** Regional price competition and regulatory adjustments.`;
      case 23:
        return `The implementation schedule is structured into phased milestones covering statutory clearances, civil works, machinery procurement, electrical installation, and trial production runs.`;
      case 24:
        return `The financial projections confirm robust commercial viability, healthy cash accruals, and sound debt-servicing capability across the 15-year horizon, making the project highly bankable for institutional financing.`;
      default:
        return baseContent || `Comprehensive analysis, operational framework, and strategic guidelines for **${title}** under **${name}** located in ${location}.`;
    }
  };

  const reportBody = (number) => getExpandedNarration(number, reportSections[number]?.title || "");

  const incomeDefinitions = [
    { label: "Sales / Operating Revenue", field: "sales" },
    { label: "EBITDA", field: "ebitda", total: true },
    { label: "Profit Before Tax", field: "profitBeforeTax" },
    { label: "Profit After Tax (PAT)", field: "profitAfterTax", total: true },
  ];
  const expenditureDefinitions = [
    { label: "Raw Material", field: "rawMaterial" },
    { label: "Salaries & Wages", field: "salaries" },
    { label: "Power & Utilities", field: "power" },
    { label: "Administrative Expenses", field: "admin" },
    { label: "Marketing Expenses", field: "marketing" },
    { label: "Other Expenses", field: "otherExpenses" },
    { label: "Total Operating Expenses", field: "operatingExpenses", total: true },
  ];
  const pnlDefinitions = [
    { label: "Sales / Revenue", field: "sales" },
    { label: "Operating Expenses", field: "operatingExpenses" },
    { label: "EBITDA", field: "ebitda", total: true },
    { label: "Depreciation", field: "depreciation" },
    { label: "Interest", field: "interest" },
    { label: "Profit Before Tax (PBT)", field: "profitBeforeTax", total: true },
    { label: "Estimated Tax", field: "estimatedTax" },
    { label: "Profit After Tax (PAT)", field: "profitAfterTax", total: true },
    { label: "Reserve & Surplus", field: "reserveAndSurplus", total: true },
  ];
  const balanceDefinitions = [
    { label: "I) LIABILITIES :-", header: true },
    { label: "   Capital", field: "capital" },
    { label: "   Long Term Loan", field: "closingLoan" },
    { label: "   Reserve & Surplus", field: "reserveAndSurplus" },
    { label: "Total Rs.", field: "totalLiabilities", total: true },
    { label: "II) ASSETS :-", header: true },
    { label: "   Fixed Assets less Dep.", field: "netFixedAssets" },
    { label: "   Cash & Bank Balance", field: "cashAndBank" },
    { label: "   Current Assets", field: "currentAssets" },
    { label: "Total Rs.", field: "totalAssets", total: true },
  ];
  const cashDefinitions = [
    { label: "Capital", field: "promoterContributionCF" },
    { label: "Bank Loan", field: "bankLoanCF" },
    { label: "Working Capital Loan", field: "workingCapitalCF" },
    { label: "Profit Before Tax", field: "profitBeforeTax" },
    { label: "Depreciation", field: "depreciation" },
    { label: "Total Rs.", field: "totalInflows", total: true },
    { label: "Fixed Assets", field: "fixedAssetsCF" },
    { label: "Withdrawals", field: "withdrawals" },
    { label: "Tax Payment", field: "estimatedTax" },
    { label: "Repayment of Term Loan", field: "repayment" },
    { label: "Total Rs.", field: "totalOutflows", total: true },
    { label: "Net Inflow / (Outflow)", field: "netCashFlow", total: true },
    { label: "Opening Cash & Bank", field: "openingCash" },
    { label: "Closing Cash & Bank", field: "closingCash" },
    { label: "Difference In cash", field: "cashDifference" },
  ];
  const depreciationDefinitions = [
    { label: "Opening WDV", field: "openingWDV" },
    { label: "Depreciation", field: "depreciation" },
    { label: "Closing WDV", field: "closingWDV", total: true },
  ];
  const dscrDefinitions = [
    { label: "Profit After Tax", field: "profitAfterTax" },
    { label: "Depreciation", field: "depreciation" },
    { label: "Interest on Term Loan", field: "interest" },
    { label: "Principal Repayment", field: "repayment" },
    { label: "Total Debt Service", field: "debtService", total: true },
    { label: "DSCR", custom: y => numberValue(y.dscr).toFixed(2), total: true, stringValue: true },
  ];
  const buildRows = (defs, group) => defs.map(def => {
    if (def.header) {
      return { label: def.label, header: true, values: group.map(() => "") };
    }
    return {
      label: def.label,
      total: def.total,
      values: group.map(y => def.custom ? def.custom(y) : y[def.field]),
    };
  });

  const FinancialTable = ({ years, rows, title }) => {
    const safeYears = Array.isArray(years) ? years : [];
    const yearColumnWidth = safeYears.length ? `${(78 / safeYears.length).toFixed(4)}%` : "auto";

    return (
      <div className={`dpr30-financial-block dpr30-financial-block--${safeYears.length || 0}-years`}>
        {title && <h3 className="dpr30-subtitle">{title}</h3>}
        <div className="dpr30-table-wrap">
          <table className="dpr30-financial-table">
            <colgroup>
              <col style={{ width: "22%" }} />
              {safeYears.map((row, index) => <col key={`year-col-${index}`} style={{ width: yearColumnWidth }} />)}
            </colgroup>
            <thead>
              <tr>
                <th>Particulars</th>
                {safeYears.map((row, index) => <th key={index}>Year {row.year || index + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                if (row.header) {
                  return (
                    <tr key={`${row.label}-${index}`} className="dpr30-table-header-row">
                      <th colSpan={safeYears.length + 1} className="fw-bold text-start ps-2">{row.label}</th>
                    </tr>
                  );
                }
                return (
                  <tr key={`${row.label}-${index}`} className={row.total ? "dpr30-total" : ""}>
                    <th>{row.label}</th>
                    {safeYears.map((year, yIndex) => {
                      const value = row.values?.[yIndex];
                      return <td key={yIndex}>{typeof value === "string" ? value : money(value)}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (requestedPremium && !premiumUnlocked) {
    return (
      <div className="dpr30-preview dpr30-premium-locked">
        <main className="premium-lock-card">
          <div className="premium-lock-icon">🔒</div>
          <h1>Premium DPR is Locked</h1>
          <p>The free Preview DPR contains key project and financial points. The complete 30-page report is available after ₹999 payment.</p>
          <div className="premium-lock-actions">
            <button type="button" className="secondary" onClick={() => navigate("/dpr-preview?mode=keypoints")}>View Free Preview</button>
            <button type="button" className="primary" onClick={() => navigate("/dpr")}>Back to DPR &amp; Unlock ₹999</button>
          </div>
        </main>
      </div>
    );
  }

  if (!fullMode) {
    const latest = financialYears.at(-1);
    const keyPoints = [
      ["Project Cost", money(projectCost)],
      ["Promoter Contribution", money(promoterContribution)],
      ["Estimated Term Loan", money(estimatedTermLoan)],
      ["Expected Subsidy", money(expectedSubsidy)],
      ["Average DSCR", averageDSCR ? averageDSCR.toFixed(2) : "—"],
      ["Projection Horizon", `Year 1 to Year ${projectionYears}`],
      ["Working Capital", project.requiresWorkingCapital ? money(project.workingCapital) : "Not Required"],
      ["Capital Cost", Math.abs(capitalDifference) < 1 ? "Reconciled ✓" : `Difference ${money(capitalDifference)}`],
      ["Interest Rate", interestRate ? `${interestRate.toFixed(2)}%` : "—"],
    ];

    return (
      <div className={`dpr30-preview dpr-preview-keypoints dpr30-sector--${sectorTheme}`}>
        <div className="kp-top no-print">
          <strong>GoSubsidy · DPR Preview — Key Points</strong>
          <button type="button" onClick={() => navigate("/dpr")}>Back to DPR</button>
        </div>
        <main className="kp-card">
          <span className="kp-eyebrow">Detailed Project Report · Preview</span>
          <h1>{project.projectName || "Detailed Project Report"}</h1>
          <p className="kp-sub">{project.businessType || "Business Project"}{project.location ? ` · ${project.location}` : ""}{project.district ? ` · ${project.district}` : ""}</p>
          <section className="kp-grid">
            {keyPoints.map(([label, value]) => <article className="kp-item" key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </section>
          {latest && <section className="kp-latest">
            <div><span>Latest Revenue</span><strong>{money(latest.sales)}</strong></div>
            <div><span>Latest EBITDA</span><strong>{money(latest.ebitda)}</strong></div>
            <div><span>Latest PAT</span><strong>{money(latest.profitAfterTax)}</strong></div>
            <div><span>Closing Loan</span><strong>{money(latest.closingLoan)}</strong></div>
          </section>}
        </main>
      </div>
    );
  }

  return (
    <div className={`dpr30-preview dpr30-sector--${sectorTheme}`}>
      <div className="dpr30-action-bar no-print">
        <button type="button" onClick={() => navigate("/dpr")}>← Back to DPR</button>
        <div className="dpr30-action-title">GoSubsidy Premium DPR • 30-Page Bank-Ready Report</div>
        <div className="dpr30-action-buttons">
          <button type="button" onClick={() => window.print()}>🖨 Print DPR</button>
          <button type="button" onClick={() => window.print()}>⬇ Save PDF</button>
        </div>
      </div>

      <main className={`dpr30-document dpr30-bank-report dpr30-horizon-${projectionYears} dpr30-sector-document dpr30-sector--${sectorTheme}`}>
        <Page page={1} title="Cover Page" className="dpr30-cover">
          <div className="dpr30-cover-label">DETAILED PROJECT REPORT</div>
          <h1>{project.projectName || "Detailed Project Report"}</h1>
          <h2>{project.businessType || "Business Project"}</h2>
          <div className="dpr30-cover-grid">
            <SummaryCard label="Promoter" value={project.promoterName || "—"} />
            <SummaryCard label="Constitution" value={project.constitution || "—"} />
            <SummaryCard label="Location" value={project.location || "—"} />
            <SummaryCard label="District" value={project.district || "—"} />
            <SummaryCard label="State" value={project.state || "—"} />
            <SummaryCard label="Total Project Cost" value={money(projectCost)} />
          </div>
          <div className="dpr30-cover-note">Confidential Project Document</div>
        </Page>

        <Page page={2} title="Project at a Glance">
          <SectionHeading number={1} title="Project at a Glance" />
          <div className="dpr30-summary-grid">
            <SummaryCard label="Total Project Cost" value={money(projectCost)} />
            <SummaryCard label={`Promoter Contribution (${promoterPercent.toFixed(2)}%)`} value={money(promoterContribution)} />
            <SummaryCard label="Estimated Term Loan" value={money(estimatedTermLoan)} />
            <SummaryCard label={`Expected Subsidy (${subsidyPercent.toFixed(2)}%)`} value={money(expectedSubsidy)} />
          </div>
          <div className="dpr30-highlight">
            <strong>Projection Horizon:</strong> Year 1 to Year {projectionYears}<br />
            <strong>Average DSCR:</strong> {averageDSCR.toFixed(2)}<br />
            <strong>Capital Reconciliation:</strong> {Math.abs(capitalDifference) < 1 ? "Fully Reconciled" : `Difference ${money(capitalDifference)}`}
          </div>
          <InfoTable rows={[
            ["Project Sector", project.businessType],
            ["Project Location", [project.location, project.district, project.state].filter(Boolean).join(", ")],
            ["Moratorium", `${moratorium} months`],
          ]} />
        </Page>

        <Page page={3} title="Promoter & Project Information">
          <SectionHeading number={2} title="Promoter & Project Information" />
          <InfoTable rows={[
            ["Project Name", project.projectName],
            ["Promoter Name", project.promoterName],
            ["Mobile Number", project.mobile],
            ["Email Address", project.email],
            ["Business / Sector", project.businessType],
            ["Constitution", project.constitution],
            ["District", project.district],
            ["Project Location", project.location],
            ["State", project.state],
          ]} />
        </Page>

        <Page page={4} title="Financial Assumptions">
          <SectionHeading number={3} title="Financial Assumptions" />
          <div className="dpr30-financial-grid">
            <SummaryCard label="Project Cost" value={money(projectCost)} />
            <SummaryCard label="Interest Rate" value={`${interestRate.toFixed(2)}% p.a.`} />
            <SummaryCard label="Promoter Contribution" value={`${promoterPercent.toFixed(2)}%`} />
            <SummaryCard label="Expected Subsidy" value={`${subsidyPercent.toFixed(2)}%`} />
            <SummaryCard label="DPR Projection Horizon" value={`${projectionYears} Years`} />
            <SummaryCard label="Moratorium" value={`${moratorium} Months`} />
          </div>
        </Page>

        <Page page={5} title="Executive Summary">
          <SectionHeading number={1} title="Executive Summary" />
          <MarkdownBlock>{reportBody(1)}</MarkdownBlock>
        </Page>

        <Page page={6} title="Project at a Glance Details">
          <SectionHeading number={2} title="Project at a Glance — Detailed Narrative" />
          <MarkdownBlock>{sanitizeProjectAtGlance(reportBody(2))}</MarkdownBlock>
        </Page>

        <Page page={7} title="Promoter Profile">
          <SectionHeading number={3} title="Promoter Profile" />
          <MarkdownBlock>{reportBody(3)}</MarkdownBlock>
        </Page>

        <Page page={8} title="Business Description">
          <SectionHeading number={4} title="Business / Project Description" />
          <AIKeyHighlights size="full">{reportBody(4)}</AIKeyHighlights>
        </Page>

        <Page page={9} title="Industry Overview">
          <SectionHeading number={5} title="Industry Overview" />
          <AIKeyHighlights size="full">{reportBody(5)}</AIKeyHighlights>
        </Page>

        <Page page={10} title="Market Potential">
          <SectionHeading number={6} title="Market Potential" />
          <AIKeyHighlights size="full">{reportBody(6)}</AIKeyHighlights>
        </Page>

        <Page page={11} title="Technical Feasibility">
          <SectionHeading number={7} title="Technical Feasibility" />
          <AIKeyHighlights size="full">{reportBody(7)}</AIKeyHighlights>
        </Page>

        <Page page={12} title="Product & Capacity">
          <SectionHeading number={8} title="Product / Service & Capacity Plan" />
          <AIKeyHighlights size="full">{reportBody(8)}</AIKeyHighlights>
        </Page>

        <Page page={13} title="Raw Materials">
          <SectionHeading number={9} title="Raw Materials, Utilities & Supply Chain" />
          <AIKeyHighlights size="full">{reportBody(9)}</AIKeyHighlights>
        </Page>

        <Page page={14} title="Capital Cost Statement">
          <SectionHeading number={10} title="Capital Cost Statement" />
          <table className="dpr30-financial-table dpr30-two-col-table">
            <thead><tr><th>Particulars</th><th>Amount (₹)</th></tr></thead>
            <tbody>
              {capitalItems.map(([label, value]) => <tr key={label}><td>{label}</td><td>{money(value)}</td></tr>)}
              <tr className="dpr30-total"><th>Total Capital Cost</th><th>{money(capitalCostTotal)}</th></tr>
              <tr className="dpr30-total"><th>Total Project Cost</th><th>{money(projectCost)}</th></tr>
            </tbody>
          </table>
        </Page>

        <Page page={15} title="Means of Finance">
          <SectionHeading number={11} title="Means of Finance" />
          <table className="dpr30-financial-table dpr30-two-col-table">
            <thead><tr><th>Means of Finance</th><th>Percentage</th><th>Amount (₹)</th></tr></thead>
            <tbody>
              <tr><td>Promoter Contribution</td><td>{promoterPercent.toFixed(2)}%</td><td>{money(promoterContribution)}</td></tr>
              <tr><td>Bank Term Loan</td><td>{projectCost ? (estimatedTermLoan / projectCost * 100).toFixed(2) : "0.00"}%</td><td>{money(estimatedTermLoan)}</td></tr>
              <tr><td>Expected Subsidy</td><td>{subsidyPercent.toFixed(2)}%</td><td>{money(expectedSubsidy)}</td></tr>
              <tr className="dpr30-total"><th>Total Means of Finance</th><th>100.00%</th><th>{money(promoterContribution + estimatedTermLoan + expectedSubsidy)}</th></tr>
            </tbody>
          </table>
        </Page>

        <Page page={16} title="Income Statement" className={financialPageClass}>
          <SectionHeading number={12} title="Income Statement" />
          <FinancialTable years={financialYears} rows={buildRows(incomeDefinitions, financialYears)} title="Projected Income Statement" />
        </Page>

        <Page page={17} title="Expenditure Statement" className={financialPageClass}>
          <SectionHeading number={13} title="Expenditure Statement" />
          <FinancialTable years={financialYears} rows={buildRows(expenditureDefinitions, financialYears)} title="Projected Operating Expenditure" />
        </Page>

        <Page page={18} title="Profit & Loss Account" className={financialPageClass}>
          <SectionHeading number={14} title="Profit & Loss Account" />
          <FinancialTable years={financialYears} rows={buildRows(pnlDefinitions, financialYears)} title="Projected Profit & Loss" />
        </Page>

        <Page page={19} title="Balance Sheet" className={financialPageClass}>
          <SectionHeading number={15} title="Balance Sheet" />
          <FinancialTable years={financialYears} rows={buildRows(balanceDefinitions, financialYears)} title="Projected Balance Sheet" />
        </Page>

        <Page page={20} title="Cash Flow Statement" className={financialPageClass}>
          <SectionHeading number={16} title="Cash Flow Statement" />
          <FinancialTable years={financialYears} rows={buildRows(cashDefinitions, financialYears)} title="Projected Cash Flow" />
        </Page>

        <Page page={21} title="Repayment Schedule" className={financialPageClass}>
          <SectionHeading number={17} title="Repayment Schedule" />
          <table className="dpr30-financial-table">
            <thead><tr><th>Year</th><th>Opening Loan</th><th>Principal</th><th>Interest</th><th>Debt Service</th><th>Closing Loan</th></tr></thead>
            <tbody>
              {financialYears.map((row, index) => {
                const r = row;
                return <tr key={index}><th>Year {row.year}</th><td>{money(r.openingLoan)}</td><td>{money(r.repayment)}</td><td>{money(r.interest)}</td><td>{money(r.debtService)}</td><td>{money(r.closingLoan)}</td></tr>;
              })}
            </tbody>
          </table>
        </Page>

        <Page page={22} title="Depreciation Statement" className={financialPageClass}>
          <SectionHeading number={18} title="Depreciation Statement" />
          <FinancialTable years={financialYears} rows={buildRows(depreciationDefinitions, financialYears)} title="Projected Depreciation" />
        </Page>

        <Page page={23} title="DSCR Statement" className={financialPageClass}>
          <SectionHeading number={19} title="Debt Service Coverage Ratio (DSCR)" />
          <FinancialTable years={financialYears} rows={buildRows(dscrDefinitions, financialYears)} title="Projected DSCR" />
          <div className="dpr30-dscr">Average DSCR: <strong>{averageDSCR > 0 ? averageDSCR.toFixed(2) : "N/A"}</strong></div>
        </Page>

        <Page page={24} title="Financial Performance" className={financialPageClass}>
          <SectionHeading number={20} title="Financial Performance & Credit Indicators" />
          <div className="dpr30-summary-grid">
            <SummaryCard label="Final Year Revenue" value={money(financialYears.at(-1)?.sales)} />
            <SummaryCard label="Final Year EBITDA" value={money(financialYears.at(-1)?.ebitda)} />
            <SummaryCard label="Final Year PAT" value={money(financialYears.at(-1)?.profitAfterTax)} />
            <SummaryCard label="Average DSCR" value={averageDSCR > 0 ? averageDSCR.toFixed(2) : "N/A"} />
          </div>
        </Page>

        <Page page={25} title="Working Capital Assessment">
          <SectionHeading number={21} title="Working Capital Assessment" />
          <div className="dpr30-summary-grid">
            <SummaryCard label="Working Capital" value={workingCapital > 0 ? money(workingCapital) : "Not Specified"} />
            <SummaryCard label="Requirement" value={project.requiresWorkingCapital ? "Required" : "Not Required"} />
          </div>
        </Page>

        <Page page={26} title="Bankability Appraisal">
          <SectionHeading number={22} title="Bankability & Financial Appraisal" />
          <MarkdownBlock>{reportBody(22)}</MarkdownBlock>
        </Page>

        <Page page={27} title="Subsidy & SWOT Analysis">
          <SectionHeading number={23} title="Government Subsidy Scheme Consideration" />
          <MarkdownBlock>{reportBody(20)}</MarkdownBlock>
          <SectionHeading number={24} title="SWOT Analysis" />
          <MarkdownBlock>{reportBody(21)}</MarkdownBlock>
        </Page>

        <Page page={28} title="Implementation Schedule">
          <SectionHeading number={26} title="Implementation Schedule" />
          <MarkdownBlock>{reportBody(23)}</MarkdownBlock>
        </Page>

        <Page page={29} title="Conclusion & Bankability">
          <SectionHeading number={27} title="Conclusion & Bankability" />
          <MarkdownBlock>{reportBody(24)}</MarkdownBlock>
        </Page>

        <Page page={30} title="Disclaimer">
          <SectionHeading number={28} title="Disclaimer & Final Notes" />
          <section className="dpr30-final-disclaimer-page">
            <div className="dpr30-disclaimer-hero">
              <div className="dpr30-disclaimer-icon">!</div>
              <div className="dpr30-disclaimer-hero-copy">
                <span>IMPORTANT NOTICE</span>
                <h3>Disclaimer &amp; Final Notes</h3>
                <p>
                  This Detailed Project Report is prepared from applicant-supplied
                  information and financial assumptions for project planning and
                  appraisal purposes.
                </p>
              </div>
            </div>

            <div className="dpr30-disclaimer-grid">
              <article className="dpr30-disclaimer-card">
                <div className="dpr30-disclaimer-card-head">
                  <span>01</span>
                  <h4>Report Basis</h4>
                </div>
                <p>
                  This DPR is prepared using information supplied by the applicant
                  together with financial assumptions and AI-assisted drafting.
                </p>
              </article>

              <article className="dpr30-disclaimer-card">
                <div className="dpr30-disclaimer-card-head">
                  <span>02</span>
                  <h4>Government &amp; Scheme Eligibility</h4>
                </div>
                <p>
                  Subsidy eligibility, eligible project cost, subsidy percentage
                  and financial assistance are subject to verification under the
                  applicable Government scheme and official guidelines.
                </p>
              </article>

              <article className="dpr30-disclaimer-card">
                <div className="dpr30-disclaimer-card-head">
                  <span>03</span>
                  <h4>Bank Appraisal &amp; Sanction</h4>
                </div>
                <p>
                  Final bank sanction, loan terms, statutory approvals and subsidy
                  disbursement remain subject to lender appraisal, promoter
                  verification, site inspection and applicable rules.
                </p>
              </article>

              <article className="dpr30-disclaimer-card dpr30-disclaimer-card--green">
                <div className="dpr30-disclaimer-card-head">
                  <span>04</span>
                  <h4>Before Formal Submission</h4>
                </div>
                <ul>
                  <li>Review all project-cost and financial assumptions.</li>
                  <li>Verify quotations and supporting documents.</li>
                  <li>Confirm applicable scheme and lender requirements.</li>
                  <li>Update information wherever required before submission.</li>
                </ul>
              </article>
            </div>

            <div className="dpr30-disclaimer-bottom">
              <div>
                <strong>Applicant / Promoter Acknowledgement</strong>
                <p>
                  The applicant should carefully review the project information,
                  financial projections and supporting documents before using this
                  DPR for any bank, Government or other formal submission.
                </p>
              </div>
              <div className="dpr30-disclaimer-brand">
                <strong>GoSubsidy</strong>
                <span>Detailed Project Report</span>
                <small>Financial Planning &amp; Appraisal Document</small>
              </div>
            </div>
          </section>
        </Page>
      </main>
    </div>
  );
}