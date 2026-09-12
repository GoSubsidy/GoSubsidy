import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DPR.css";
import PaymentModal from "../components/premium/PaymentModal";
import { PREMIUM_PRODUCTS } from "../services/premiumProducts";
// ======================================================
// GoSubsidy - Detailed Project Report
// frontend/src/pages/DPR.jsx
// ======================================================

function EditableFinancialInput({
  value,
  year,
  fieldKey,
  onDraftChange,
}) {
  // IMPORTANT: keep the actual keystrokes LOCAL to this input.
  // The parent DPR must NOT re-render on every digit typed.
  // Parent state is committed only on blur / Enter.
  const [localValue, setLocalValue] = useState(
    value === undefined || value === null ? "" : String(value)
  );
  const isFocusedRef = React.useRef(false);

  // When another year changes and this cell is NOT being edited,
  // allow the calculated value to flow into this input.
  React.useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalValue(
        value === undefined || value === null ? "" : String(value)
      );
    }
  }, [value]);

  const commit = () => {
    const cleaned = String(localValue ?? "").replace(/[^0-9]/g, "");
    onDraftChange(year, fieldKey, cleaned);
  };

  return (
    <div className="input-group input-group-sm dpr-financial-input">
      <span className="input-group-text">₹</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck="false"
        className="form-control"
        value={localValue}
        onFocus={(e) => {
          isFocusedRef.current = true;
          e.currentTarget.select();
        }}
        onChange={(e) => {
          // NO parent setState here. This is the key fix for the
          // "only first digit is accepted" / "numbers jumping" problem.
          setLocalValue(e.target.value.replace(/[^0-9]/g, ""));
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        aria-label={`${fieldKey} Year ${year}`}
      />
    </div>
  );
}

export default function DPR() {
  const navigate = useNavigate();
  const [isGeneratingDPR, setIsGeneratingDPR] = useState(false);
const [dprProgress, setDprProgress] = useState(0);
const [dprStatus, setDprStatus] = useState("");

const [showDPRPayment, setShowDPRPayment] = useState(false);

  // ====================================================
  // PROJECT STATE
  // ====================================================

  const [project, setProject] = useState({
    // Promoter / Project
    projectName: "",
    promoterName: "",
    mobile: "",
    email: "",

    businessType: "Food Processing",
    constitution: "Proprietorship",

    state: "Telangana",
    district: "",
    location: "",

    // Finance
    projectCost: 5000000,

    promoterContributionPercent: 20,
    subsidyPercent: 15,

    interestRate: 10.5,
    loanTenure: 7,
    moratorium: 6,

    // Working Capital
    // User must explicitly choose Yes / No before submitting the DPR.
    requiresWorkingCapital: null,
    workingCapital: 500000,
    workingCapitalPurpose: "",
    workingCapitalCycleDays: 30,

    // Capital Cost
    land: 500000,
    building: 1000000,
    plantMachinery: 2500000,
    electrical: 250000,
    furniture: 150000,
    preliminary: 100000,
    contingency: 200000,
    workingCapitalMargin: 300000,
    otherFixedAssets: 0,

    // Revenue
    year1Sales: 6000000,
    salesGrowth: 10,

    // Operating expenses
    rawMaterialPercent: 40,
    salaryPercent: 10,
    powerPercent: 5,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,

    // Depreciation
    depreciationRate: 10,
  });

  const [activeSection, setActiveSection] =
    useState("glance");

  // ====================================================
  // USER EDITABLE FINANCIAL OVERRIDES — 1 TO 15 YEARS
  // ====================================================

  const [financialOverrides, setFinancialOverrides] = useState({});
  const [financialEditMode, setFinancialEditMode] = useState(false);
  const [financialDrafts, setFinancialDrafts] = useState({});
  // Only cells the user actually edits are saved as overrides.
  // This is critical so calculated years remain linked to the previous year through the selected tenure.
  const [financialDirty, setFinancialDirty] = useState({});

  const financialCellKey = (year, key) => `${year}-${key}`;

  // Financial rows that users are allowed to override.
  // Keep this ABOVE the calculation hook because the calculator uses it.
  const editableFinancialKeys = [
    "sales",
    "rawMaterial",
    "salaries",
    "power",
    "admin",
    "marketing",
    "otherExpenses",
  ];

  const startFinancialEditing = () => {
    // Do NOT copy every calculated value into draft state.
    // Untouched cells must continue to display the live calculated value so
    // Year 1 -> Year 2 -> ... -> selected tenure can cascade immediately.
    setFinancialDrafts({});
    setFinancialDirty({});
    setFinancialEditMode(true);
  };

  const handleFinancialDraftChange = (year, key, value) => {
    const cellKey = financialCellKey(year, key);
    const cleaned = String(value ?? "").replace(/[^0-9]/g, "");

    setFinancialDrafts((prev) => ({
      ...prev,
      [cellKey]: cleaned,
    }));

    // Mark ONLY this cell as intentionally edited.
    // Other years must stay calculated so the 10% cascade is preserved.
    setFinancialDirty((prev) => ({
      ...prev,
      [cellKey]: true,
    }));
  };

  const saveFinancialChanges = () => {
    // IMPORTANT: A manually edited year becomes the new starting point for
    // that financial line. Any old saved overrides in later years are
    // removed so they cannot block the 10% year-to-year cascade.
    const nextOverrides = { ...financialOverrides };

    const editedByKey = {};

    Object.keys(financialDirty).forEach((cellKey) => {
      if (!financialDirty[cellKey]) return;

      const [yearText, ...keyParts] = cellKey.split("-");
      const year = Number(yearText);
      const key = keyParts.join("-");

      if (!editedByKey[key]) editedByKey[key] = [];
      editedByKey[key].push(year);
    });

    Object.entries(editedByKey).forEach(([key, yearsEdited]) => {
      const sortedYears = [...yearsEdited].sort((a, b) => a - b);

      // Clear stale overrides after every edited year. This is what makes
      // Year 1 -> Year 2 -> ... -> selected tenure recalculate instead of retaining
      // numbers from an older calculation.
      sortedYears.forEach((editedYear, index) => {
        const nextEditedYear = sortedYears[index + 1] ?? (projectionYears + 1);

        for (let year = editedYear + 1; year < nextEditedYear; year += 1) {
          if (nextOverrides[year]) {
            const cleanedYear = { ...nextOverrides[year] };
            delete cleanedYear[key];

            if (Object.keys(cleanedYear).length === 0) {
              delete nextOverrides[year];
            } else {
              nextOverrides[year] = cleanedYear;
            }
          }
        }
      });

      // Store only the cells the user actually changed.
      sortedYears.forEach((year) => {
        const cellKey = financialCellKey(year, key);
        const draft = financialDrafts[cellKey] ?? "";

        nextOverrides[year] = {
          ...(nextOverrides[year] || {}),
          [key]:
            draft === ""
              ? 0
              : Math.max(0, Number(draft) || 0),
        };
      });
    });

    setFinancialOverrides(nextOverrides);
    setFinancialEditMode(false);
    setFinancialDrafts({});
    setFinancialDirty({});
  };

  const cancelFinancialEditing = () => {
    setFinancialEditMode(false);
    setFinancialDrafts({});
    setFinancialDirty({});
  };

  const handleFinancialOverride = (year, key, value) => {
    setFinancialOverrides((prev) => ({
      ...prev,
      [year]: {
        ...(prev[year] || {}),
        [key]: value === "" ? "" : Number(value),
      },
    }));
  };

  const resetFinancialOverrides = () => {
    setFinancialOverrides({});
    setFinancialDrafts({});
    setFinancialDirty({});
    setFinancialEditMode(false);
  };

  // ====================================================
  // INPUT HANDLER
  // ====================================================

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const nextValue =
      type === "number"
        ? value === ""
          ? ""
          : Number(value)
        : value;

    setProject((prev) => {
      // Keep Working Capital Requirement and the Capital Cost Statement
      // Working Capital Margin synchronized.
      if (name === "workingCapitalMargin") {
        return {
          ...prev,
          workingCapital: nextValue,
          workingCapitalMargin: nextValue,
        };
      }

      return {
        ...prev,
        [name]: nextValue,
      };
    });
  };

  const handleWorkingCapitalChoice = (requiresWorkingCapital) => {
    setProject((prev) => ({
      ...prev,
      requiresWorkingCapital,
      workingCapital: requiresWorkingCapital
        ? Number(prev.workingCapital) || 500000
        : 0,
      workingCapitalMargin: requiresWorkingCapital
        ? Number(prev.workingCapital) || 500000
        : 0,
      workingCapitalPurpose: requiresWorkingCapital
        ? prev.workingCapitalPurpose || ""
        : "",
      workingCapitalCycleDays: requiresWorkingCapital
        ? Number(prev.workingCapitalCycleDays) || 30
        : 0,
    }));
  };

  const handleWorkingCapitalAmountChange = (e) => {
    const value = e.target.value;
    const amount = value === "" ? "" : Number(value);

    setProject((prev) => ({
      ...prev,
      workingCapital: amount,
      workingCapitalMargin: amount,
    }));
  };

  // ====================================================
  // MONEY FORMAT
  // ====================================================

  const money = (value) => {
    const amount = Number(value) || 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ====================================================
  // BASIC FINANCE CALCULATIONS
  // ====================================================

  const projectCost =
    Number(project.projectCost) || 0;

  const promoterContribution =
    projectCost *
    ((Number(
      project.promoterContributionPercent
    ) || 0) /
      100);

  const expectedSubsidy =
    projectCost *
    ((Number(project.subsidyPercent) || 0) /
      100);

  const estimatedTermLoan = Math.max(
    0,
    projectCost -
      promoterContribution -
      expectedSubsidy
  );

  // ====================================================
  // CAPITAL COST
  // ====================================================

  const capitalCostItems = [
    {
      label: "Land / Site Development",
      name: "land",
    },
    {
      label: "Building / Civil Works",
      name: "building",
    },
    {
      label: "Plant & Machinery",
      name: "plantMachinery",
    },
    {
      label: "Electrical Installation",
      name: "electrical",
    },
    {
      label: "Furniture & Equipment",
      name: "furniture",
    },
    {
      label:
        "Preliminary & Pre-operative Expenses",
      name: "preliminary",
    },
    {
      label: "Contingency",
      name: "contingency",
    },
    {
      label: "Working Capital Margin",
      name: "workingCapitalMargin",
    },
    {
      label: "Other Fixed Assets / Miscellaneous Project Cost",
      name: "otherFixedAssets",
    },
  ];

  const totalCapitalCost =
    capitalCostItems.reduce(
      (total, item) =>
        total +
        (Number(project[item.name]) || 0),
      0
    );

  const capitalCostDifference =
    projectCost - totalCapitalCost;

  const isCapitalCostReconciled =
    Math.abs(capitalCostDifference) <= 1;

  // ====================================================
  // FLEXIBLE FINANCIAL PROJECTIONS — 1 TO 15 YEARS
  // ====================================================

  // Customer-selected DPR horizon: 1 to 15 years.
  // Seven years is only the default value, never a hard limit.
  const projectionYears = Math.min(
    15,
    Math.max(
      1,
      Math.floor(Number(project.loanTenure) || 1)
    )
  );

  const calculations = useMemo(() => {
    const years = [];

    let openingLoan = estimatedTermLoan;

    const tenure =
      Math.min(
        15,
        Math.max(
          1,
          Math.floor(Number(project.loanTenure) || 1)
        )
      );

    const moratoriumMonths = Math.min(
      tenure * 12,
      Math.max(
        0,
        Math.floor(Number(project.moratorium) || 0)
      )
    );

    const activeRepaymentMonths = Math.max(
      1,
      tenure * 12 - moratoriumMonths
    );

    const monthlyPrincipalRepayment =
      estimatedTermLoan / activeRepaymentMonths;

    let accumulatedProfit = 0;

    let accumulatedDepreciation = 0;

    // During editing, only cells actually touched by the user are used
    // as live overrides. Untouched cells continue to calculate normally.
    const activeOverrides = {};
    for (let year = 1; year <= projectionYears; year++) {
      activeOverrides[year] = {
        ...(financialOverrides[year] || {}),
      };

      editableFinancialKeys.forEach((key) => {
        const cellKey = financialCellKey(year, key);
        if (financialDirty[cellKey]) {
          const draft = financialDrafts[cellKey] ?? "";
          activeOverrides[year][key] =
            draft === "" ? 0 : Math.max(0, Number(draft) || 0);
        }
      });
    }

    for (let year = 1; year <= projectionYears; year++) {
      // ----------------------------------------------
      // SALES
      // ----------------------------------------------

      // YEAR-TO-YEAR REVENUE CASCADE
      // Year 1 is the starting value. Every following year grows from
      // the EFFECTIVE previous year's sales, including any manual override.
      // Example at 10% growth: 80L -> 88L -> 96.8L -> 106.48L ...
      const growthFactor =
        1 + ((Number(project.salesGrowth) || 0) / 100);

      const previousYearSales =
        year === 1
          ? Number(project.year1Sales) || 0
          : years[year - 2]?.sales ?? 0;

      const calculatedSales =
        year === 1
          ? previousYearSales
          : previousYearSales * growthFactor;

      const yearOverrides =
        activeOverrides[year] || {};

      const getOverride = (key, calculatedValue) => {
        const overrideValue = yearOverrides[key];

        return overrideValue === "" ||
          overrideValue === undefined ||
          overrideValue === null
          ? calculatedValue
          : Number(overrideValue) || 0;
      };

      const sales = getOverride(
        "sales",
        calculatedSales
      );

      // ----------------------------------------------
      // EXPENSES
      // ----------------------------------------------

      const rawMaterial = getOverride(
        "rawMaterial",
        year === 1
          ? sales * ((Number(project.rawMaterialPercent) || 0) / 100)
          : (years[year - 2]?.rawMaterial ??
              sales * ((Number(project.rawMaterialPercent) || 0) / 100)) * growthFactor
      );

      const salaries = getOverride(
        "salaries",
        year === 1
          ? sales * ((Number(project.salaryPercent) || 0) / 100)
          : (years[year - 2]?.salaries ??
              sales * ((Number(project.salaryPercent) || 0) / 100)) * growthFactor
      );

      const power = getOverride(
        "power",
        year === 1
          ? sales * ((Number(project.powerPercent) || 0) / 100)
          : (years[year - 2]?.power ??
              sales * ((Number(project.powerPercent) || 0) / 100)) * growthFactor
      );

      const admin = getOverride(
        "admin",
        year === 1
          ? sales * ((Number(project.adminPercent) || 0) / 100)
          : (years[year - 2]?.admin ??
              sales * ((Number(project.adminPercent) || 0) / 100)) * growthFactor
      );

      const marketing = getOverride(
        "marketing",
        year === 1
          ? sales * ((Number(project.marketingPercent) || 0) / 100)
          : (years[year - 2]?.marketing ??
              sales * ((Number(project.marketingPercent) || 0) / 100)) * growthFactor
      );

      const otherExpenses = getOverride(
        "otherExpenses",
        year === 1
          ? sales * ((Number(project.otherExpensePercent) || 0) / 100)
          : (years[year - 2]?.otherExpenses ??
              sales * ((Number(project.otherExpensePercent) || 0) / 100)) * growthFactor
      );

      const operatingExpenses =
        rawMaterial +
        salaries +
        power +
        admin +
        marketing +
        otherExpenses;

      // ----------------------------------------------
      // DEPRECIATION
      // ----------------------------------------------

      const depreciableAssets =
        (Number(project.building) || 0) +
        (Number(project.plantMachinery) ||
          0) +
        (Number(project.electrical) || 0) +
        (Number(project.furniture) || 0);

      const openingWDV = Math.max(
        0,
        depreciableAssets -
          accumulatedDepreciation
      );

      const depreciation =
        openingWDV *
        ((Number(project.depreciationRate) ||
          0) /
          100);

      accumulatedDepreciation +=
        depreciation;

      const closingWDV = Math.max(
        0,
        openingWDV - depreciation
      );

      // ----------------------------------------------
      // INTEREST
      // ----------------------------------------------

      const interest =
        openingLoan *
        ((Number(project.interestRate) ||
          0) /
          100);

      // ----------------------------------------------
      // PROFITABILITY
      // ----------------------------------------------

      const ebitda =
        sales - operatingExpenses;

      const profitBeforeTax =
        ebitda -
        depreciation -
        interest;

      const estimatedTax =
        profitBeforeTax > 0
          ? profitBeforeTax * 0.25
          : 0;

      const profitAfterTax =
        profitBeforeTax - estimatedTax;

      accumulatedProfit +=
        profitAfterTax;

      // ----------------------------------------------
      // LOAN REPAYMENT
      // ----------------------------------------------

      // Repayment starts after the selected moratorium.
      // Principal is spread over the active repayment months.
      const activeMonthsThisYear =
        year === 1
          ? Math.max(
              0,
              12 - moratoriumMonths
            )
          : 12;

      const repayment = Math.min(
        openingLoan,
        monthlyPrincipalRepayment *
          activeMonthsThisYear
      );

      const closingLoan = Math.max(
        0,
        openingLoan - repayment
      );

      // ----------------------------------------------
      // CASH ACCRUAL
      // ----------------------------------------------

      const cashAccrual =
        profitAfterTax + depreciation;

      const debtService =
        repayment + interest;

      const dscr =
        debtService > 0
          ? (profitAfterTax +
              depreciation +
              interest) /
            debtService
          : 0;

      // ----------------------------------------------
      // INDICATIVE BALANCE SHEET
      // ----------------------------------------------

      const netFixedAssets = closingWDV;

      const currentAssets =
        Math.max(
          0,
          sales * 0.15
        );

      const totalAssets =
        netFixedAssets + currentAssets;

      const currentLiabilities =
        Math.max(
          0,
          operatingExpenses * 0.08
        );

      const netWorth =
        promoterContribution +
        accumulatedProfit;

      // ----------------------------------------------
      // CASH FLOW
      // ----------------------------------------------

      const operatingCashFlow =
        cashAccrual;

      const financingCashFlow =
        -repayment;

      const netCashFlow =
        operatingCashFlow +
        financingCashFlow;

      years.push({
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

        profitBeforeTax,
        estimatedTax,
        profitAfterTax,

        cashAccrual,
        debtService,
        dscr,

        netFixedAssets,
        currentAssets,
        totalAssets,
        currentLiabilities,
        netWorth,

        operatingCashFlow,
        financingCashFlow,
        netCashFlow,
      });

      openingLoan = closingLoan;
    }

    const dscrYears = years.filter(
      (item) => item.debtService > 0
    );

    const averageDSCR =
      dscrYears.length > 0
        ? dscrYears.reduce(
            (total, item) =>
              total + item.dscr,
            0
          ) / dscrYears.length
        : 0;

    return {
      years,
      averageDSCR,
    };
  }, [
    project,
    estimatedTermLoan,
    promoterContribution,
    financialOverrides,
    financialDrafts,
    financialDirty,
    projectionYears,
  ]);

  // ====================================================
  // DPR ACTIONS
  // ====================================================

  const validateProject = () => {
    const projectName = String(project?.projectName || "").trim();
    const promoterName = String(project?.promoterName || "").trim();
    const mobile = String(project?.mobile || "").trim();
    const email = String(project?.email || "").trim();
    const cost = Number(project?.projectCost || 0);

    if (!projectName) return "Please enter Project Name.";
    if (!promoterName) return "Please enter Promoter Name.";
    if (!mobile) return "Please enter Mobile Number.";
    if (!email) return "Please enter Email Address.";
    if (cost <= 0) return "Total Project Cost must be greater than zero.";

    // ==================================================
    // WORKING CAPITAL DECISION — REQUIRED
    // ==================================================

    if (project.requiresWorkingCapital === null) {
      return (
        "Please select Working Capital Requirement: Yes or No.\n\n" +
        "This selection is required before saving, previewing or generating the DPR."
      );
    }

    if (project.requiresWorkingCapital === true) {
      if (Number(project.workingCapital || 0) <= 0) {
        return "Please enter the Working Capital Requirement amount.";
      }

      if (!String(project.workingCapitalPurpose || "").trim()) {
        return "Please select the primary purpose of the Working Capital requirement.";
      }

      if (Number(project.workingCapitalCycleDays || 0) <= 0) {
        return "Please enter the Working Capital Cycle in days.";
      }
    }

    const difference = cost - totalCapitalCost;

    if (Math.abs(difference) > 1) {
      if (difference > 0) {
        return (
          `Capital Cost Statement is incomplete.\n\n` +
          `Total Project Cost: ${money(cost)}\n` +
          `Capital Cost Entered: ${money(totalCapitalCost)}\n` +
          `Balance to Allocate: ${money(difference)}\n\n` +
          `Please allocate the complete project cost before generating the DPR.`
        );
      }

      return (
        `Capital Cost Statement exceeds Total Project Cost.\n\n` +
        `Total Project Cost: ${money(cost)}\n` +
        `Capital Cost Entered: ${money(totalCapitalCost)}\n` +
        `Excess Amount: ${money(Math.abs(difference))}\n\n` +
        `Please correct the Capital Cost Statement before generating the DPR.`
      );
    }

    return "";
  };

  const buildDPRPayload = () => ({
    project,
    capitalCost: {
      land: Number(project.land) || 0,
      building: Number(project.building) || 0,
      plantMachinery: Number(project.plantMachinery) || 0,
      electrical: Number(project.electrical) || 0,
      furniture: Number(project.furniture) || 0,
      preliminary: Number(project.preliminary) || 0,
      contingency: Number(project.contingency) || 0,
      workingCapitalMargin: Number(project.workingCapitalMargin) || 0,
      otherFixedAssets: Number(project.otherFixedAssets) || 0,
      totalCapitalCost,
      totalProjectCost: projectCost,
      reconciliationDifference: capitalCostDifference,
      reconciled: isCapitalCostReconciled,
    },
    summary: {
      projectCost,
      promoterContribution,
      expectedSubsidy,
      estimatedTermLoan,
      totalCapitalCost,
      capitalCostDifference,
      capitalCostReconciled: isCapitalCostReconciled,
      averageDSCR: calculations.averageDSCR,
      workingCapitalRequired: project.requiresWorkingCapital === true,
      workingCapitalRequirement:
        project.requiresWorkingCapital === true
          ? Number(project.workingCapital) || 0
          : 0,
      workingCapitalPurpose:
        project.requiresWorkingCapital === true
          ? String(project.workingCapitalPurpose || "")
          : "",
      workingCapitalCycleDays:
        project.requiresWorkingCapital === true
          ? Number(project.workingCapitalCycleDays) || 0
          : 0,
    },
    calculations,
    financialOverrides,
    savedAt: new Date().toISOString(),
  });

  const handleSaveProject = () => {
    try {
      const validationError = validateProject();

      if (validationError) {
        alert(validationError);
        return;
      }

      localStorage.setItem(
        "gosubsidy_dpr_project",
        JSON.stringify(buildDPRPayload())
      );

      alert("Project saved successfully.");
    } catch (error) {
      console.error("Save Project Error:", error);
      alert("Unable to save the project.");
    }
  };

  const handlePreviewDPR = () => {
    const validationError = validateProject();

    if (validationError) {
      alert(validationError);
      return;
    }

    localStorage.setItem(
      "gosubsidy_dpr_preview",
      JSON.stringify(buildDPRPayload())
    );

    const preview = window.open("", "_blank");

    if (!preview) {
      alert("Please allow pop-ups to preview the DPR.");
      return;
    }

    // ==================================================
    // PROFESSIONAL BANK-READY DPR HTML ENGINE
    // 24-page A4 structure inspired by the current DPR
    // preview, but redesigned for a modern lender-facing
    // document with consistent hierarchy, tables, cards,
    // page numbering, print controls and financial views.
    // ==================================================

    const esc = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const projectTitle = esc(project.projectName || "Proposed Enterprise");
    const promoterTitle = esc(project.promoterName || "Promoter");
    const businessTitle = esc(project.businessType || "Business Project");
    const locationTitle = esc(
      [project.location, project.district, project.state]
        .filter(Boolean)
        .join(" • ") || "Location to be confirmed"
    );

    const firstYear = calculations.years[0] || {};
    const finalYear = calculations.years[calculations.years.length - 1] || {};
    const minimumDSCR = calculations.years.length
      ? Math.min(...calculations.years.map((item) => Number(item.dscr || 0)))
      : 0;
    const year1EbitdaMargin = firstYear.sales
      ? (firstYear.ebitda / firstYear.sales) * 100
      : 0;
    const year1PatMargin = firstYear.sales
      ? (firstYear.profitAfterTax / firstYear.sales) * 100
      : 0;
    const totalDebtService = calculations.years.reduce(
      (sum, item) => sum + Number(item.debtService || 0),
      0
    );
    const totalOperatingCash = calculations.years.reduce(
      (sum, item) => sum + Number(item.operatingCashFlow || 0),
      0
    );

    const metric = (label, value, note = "") => `
      <div class="metric">
        <div class="metric-label">${esc(label)}</div>
        <div class="metric-value">${value}</div>
        ${note ? `<div class="metric-note">${note}</div>` : ""}
      </div>`;

    const table = (headers, body, options = {}) => `
      <div class="table-wrap ${options.compact ? "compact" : ""}">
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${body.join("")}</tbody>
        </table>
      </div>`;

    const moneyCell = (value) => `<span class="money">${money(value)}</span>`;

    const page = (number, section, title, content, options = {}) => `
      <section class="page ${options.dark ? "page-dark" : ""} ${options.cover ? "cover-page" : ""}">
        ${options.cover ? "" : `
        <div class="page-topline">
          <div class="brand-mini"><span class="brand-mark">G</span><span>GoSubsidy</span><span class="brand-divider">/</span><span>${esc(section)}</span></div>
          <span class="page-number">${String(number).padStart(2, "0")}</span>
        </div>
        <div class="section-title">
          <div class="eyebrow">${esc(section)}</div>
          <h1>${title}</h1>
        </div>`}
        <div class="page-content">${content}</div>
        <div class="page-footer">
          <span>GoSubsidy • Government Schemes &amp; Financial Intelligence Platform</span>
          <span>${esc(projectTitle)} • ${String(number).padStart(2, "0")} / 24</span>
        </div>
      </section>`;

    const capitalRows = capitalCostItems.map(
      (item) => `
        <tr>
          <td>${esc(item.label)}</td>
          <td>${moneyCell(project[item.name])}</td>
        </tr>`
    );

    const incomeRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.sales)}</td>
          <td>${moneyCell(y.ebitda)}</td>
          <td>${moneyCell(y.profitBeforeTax)}</td>
          <td>${moneyCell(y.profitAfterTax)}</td>
        </tr>`
    );

    const expenseRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.rawMaterial)}</td>
          <td>${moneyCell(y.salaries)}</td>
          <td>${moneyCell(y.power)}</td>
          <td>${moneyCell(y.admin + y.marketing + y.otherExpenses)}</td>
          <td>${moneyCell(y.operatingExpenses)}</td>
        </tr>`
    );

    const pnlRows = calculations.years.map(
      (y) => `
        <tr class="${y.year === 1 ? "highlight-row" : ""}">
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.sales)}</td>
          <td>${moneyCell(y.operatingExpenses)}</td>
          <td>${moneyCell(y.ebitda)}</td>
          <td>${moneyCell(y.depreciation)}</td>
          <td>${moneyCell(y.interest)}</td>
          <td>${moneyCell(y.profitBeforeTax)}</td>
          <td>${moneyCell(y.estimatedTax)}</td>
          <td>${moneyCell(y.profitAfterTax)}</td>
        </tr>`
    );

    const balanceRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.netFixedAssets)}</td>
          <td>${moneyCell(y.currentAssets)}</td>
          <td>${moneyCell(y.totalAssets)}</td>
          <td>${moneyCell(y.closingLoan)}</td>
          <td>${moneyCell(y.currentLiabilities)}</td>
          <td>${moneyCell(y.netWorth)}</td>
        </tr>`
    );

    const cashRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.profitAfterTax)}</td>
          <td>${moneyCell(y.depreciation)}</td>
          <td>${moneyCell(y.operatingCashFlow)}</td>
          <td>${moneyCell(y.repayment)}</td>
          <td>${moneyCell(y.netCashFlow)}</td>
        </tr>`
    );

    const loanRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.openingLoan)}</td>
          <td>${moneyCell(y.repayment)}</td>
          <td>${moneyCell(y.interest)}</td>
          <td>${moneyCell(y.debtService)}</td>
          <td>${moneyCell(y.closingLoan)}</td>
        </tr>`
    );

    const depreciationRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.openingWDV)}</td>
          <td>${moneyCell(y.depreciation)}</td>
          <td>${moneyCell(y.closingWDV)}</td>
        </tr>`
    );

    const dscrRows = calculations.years.map(
      (y) => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${moneyCell(y.profitAfterTax)}</td>
          <td>${moneyCell(y.depreciation)}</td>
          <td>${moneyCell(y.interest)}</td>
          <td>${moneyCell(y.profitAfterTax + y.depreciation + y.interest)}</td>
          <td>${moneyCell(y.debtService)}</td>
          <td><strong>${Number(y.dscr || 0).toFixed(2)}</strong></td>
        </tr>`
    );

    const swotCard = (label, title, items, cls) => `
      <div class="swot-card ${cls}">
        <div class="swot-label">${esc(label)}</div>
        <h3>${esc(title)}</h3>
        <ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </div>`;

    const businessModel = project.businessType
      ? `The proposed ${businessTitle} project is intended to establish a structured operating unit at ${locationTitle}. The project model should be supported by final vendor quotations, operating capacity, market tie-ups and statutory approvals during lender appraisal.`
      : "Project business model narrative to be completed from applicant inputs.";

    const projectRationale = `The project is presented for lender review with an integrated view of project cost, promoter contribution, bank finance, subsidy assumption, operating projections, repayment capacity and debt-service coverage. Final appraisal remains subject to verification of applicant documents, quotations, statutory approvals and applicable scheme guidelines.`;

    const html = `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${projectTitle} • Professional DPR</title>
<style>
  *{box-sizing:border-box}
  @page{size:A4;margin:0}
  :root{
    --navy:#092a47;--navy2:#061b30;--blue:#1467d8;--blue2:#0b4fa9;--gold:#d9a441;
    --ink:#172b3d;--muted:#607487;--line:#d9e3ec;--soft:#f5f8fb;--soft2:#edf4fa;
    --green:#0a8766;--red:#b8464d;--white:#fff;--shadow:0 8px 28px rgba(14,40,65,.08)
  }
  html{background:#dfe6ed}
  body{margin:0;background:#dfe6ed;color:var(--ink);font-family:Inter,Segoe UI,Arial,sans-serif;font-size:9.4px;line-height:1.42;-webkit-font-smoothing:antialiased}
  .toolbar{position:fixed;right:20px;top:18px;z-index:999;display:flex;gap:8px}
  .toolbar button{border:1px solid #ffffff22;border-radius:8px;padding:10px 15px;background:var(--navy);color:#fff;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2)}
  .toolbar button:hover{background:var(--blue)}
  .page{position:relative;width:210mm;height:297mm;min-height:297mm;margin:12px auto;background:#fff;padding:14mm 14mm 15mm;overflow:hidden;page-break-after:always;box-shadow:0 10px 38px rgba(18,45,70,.13);display:flex;flex-direction:column}
  .page-content{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-between;gap:8px}
  .page-content > .cards,.page-content > .two-col,.page-content > .three-col,.page-content > .four-col,.page-content > .metrics,.page-content > .summary-band,.page-content > .table-wrap,.page-content > .swot-grid{margin-top:0;margin-bottom:0}
  .page-content > .card,.page-content > .callout{margin-top:0;margin-bottom:0}
  .page-content > h2{margin-top:2px;margin-bottom:2px}
  .page-content > .process,.page-content > .timeline,.page-content > .rating{margin-top:0;margin-bottom:0}
  .page-content > .small-note{margin-top:0}
  .page-content .cards,.page-content .two-col,.page-content .three-col,.page-content .four-col{align-items:stretch}
  .page-content .card{height:100%}
  .page-content .two-col > .card,.page-content .cards > .card{min-height:58mm}
  .page-content .metrics{grid-auto-rows:1fr}
  .page-content .metric{min-height:52px}
  .page-content .process{min-height:32mm;align-items:stretch}
  .page-content .process div{display:flex;flex-direction:column;justify-content:center}
  .page-content .swot-grid{flex:1;min-height:190mm}
  .page-content .swot-card{min-height:0;height:100%}
  .page-content .signature-grid{margin-top:auto;padding-top:8px}
  .page:last-of-type{page-break-after:auto}
  .page-dark{background:linear-gradient(135deg,#061a2d 0%,#0a2d4e 58%,#0d416c 100%);color:#fff}
  .page-dark:before{content:"";position:absolute;right:-38mm;top:-28mm;width:105mm;height:105mm;border:1px solid rgba(255,255,255,.08);border-radius:50%}
  .page-dark:after{content:"";position:absolute;right:-20mm;bottom:18mm;width:85mm;height:85mm;border:1px solid rgba(217,164,65,.13);transform:rotate(28deg)}
  .page-topline{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d7e1e9;padding-bottom:6px;color:#526b80;font-size:6.8px;font-weight:850;letter-spacing:.8px;text-transform:uppercase}
  .brand-mini{display:flex;align-items:center;gap:6px}.brand-mark{display:inline-grid;place-items:center;width:17px;height:17px;border-radius:5px;background:var(--navy);color:#fff;font-size:9px;font-weight:900}.brand-divider{color:#b0bdc8;margin:0 2px}
  .page-number{border:1px solid #bdcbd7;border-radius:4px;padding:2px 6px;letter-spacing:.2px;color:var(--navy);font-size:7px}
  .section-title{margin:11px 0 11px;border-left:3px solid var(--gold);padding-left:9px}.eyebrow{font-size:6.3px;letter-spacing:1.7px;font-weight:900;color:var(--blue);text-transform:uppercase;margin-bottom:3px}h1{font-size:19px;line-height:1.08;margin:0;color:var(--navy);font-weight:900;letter-spacing:-.25px}.page-dark .eyebrow{color:#f2ca69}.page-dark h1{color:#fff}
  h2{font-size:11.2px;color:var(--navy);margin:11px 0 6px;font-weight:900}h3{font-size:10px;margin:0 0 5px;color:var(--navy);font-weight:850}p{margin:0 0 6px;color:var(--muted)}.page-dark p,.page-dark .muted{color:#d0dfeb}.muted{color:var(--muted)}.lead{font-size:10.8px;line-height:1.55}
  .cover-page{padding:0}.cover-inner{position:relative;z-index:2;height:100%;padding:21mm 18mm 14mm;display:flex;flex-direction:column;justify-content:space-between}.cover-brand{display:flex;align-items:center;gap:9px;color:#e9f2f8;font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase}.cover-logo{width:28px;height:28px;border:1px solid rgba(255,255,255,.32);border-radius:8px;display:grid;place-items:center;color:#fff;font-size:14px;font-weight:900}.cover-badge{display:inline-flex;margin-top:28mm;padding:6px 9px;border:1px solid rgba(217,164,65,.7);border-radius:3px;color:#f1c867;background:rgba(217,164,65,.08);font-size:6.6px;letter-spacing:1.7px;font-weight:900;text-transform:uppercase}.cover-title{font-size:31px;line-height:1.02;color:#fff;font-weight:950;max-width:165mm;margin:10px 0 7px;letter-spacing:-.7px}.cover-subtitle{font-size:14px;color:#d6e5ef;font-weight:700}.cover-location{font-size:8.8px;color:#a9c1d2;margin-top:7px}.cover-gold{height:3px;width:45mm;background:var(--gold);margin:17px 0}.cover-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:15mm}.cover-metric{border-top:1px solid rgba(255,255,255,.25);padding-top:8px}.cover-metric small{display:block;color:#8eacc1;font-size:6.1px;text-transform:uppercase;letter-spacing:1px}.cover-metric strong{display:block;color:#fff;font-size:11.2px;margin-top:3px}.cover-footer{border-top:1px solid rgba(255,255,255,.2);padding-top:8px;display:flex;justify-content:space-between;color:#a9bfce;font-size:6.6px}
  .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0}.metric{border:1px solid var(--line);border-radius:7px;padding:8px;background:#fff;min-height:49px}.metric-label{font-size:6.2px;text-transform:uppercase;letter-spacing:.9px;color:#718394;font-weight:850}.metric-value{font-size:12.2px;font-weight:950;color:var(--navy);margin-top:3px}.metric-note{font-size:6.2px;color:#8797a5;margin-top:1px}
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:7px 0}.card{border:1px solid var(--line);border-radius:7px;padding:9px;background:#fff;box-shadow:0 2px 8px rgba(16,45,70,.025)}.card.soft{background:var(--soft);border-color:#dce7ef}.card.accent{border-left:3px solid var(--blue);background:#f7fbff}.card.gold{border-left:3px solid var(--gold);background:#fffaf1}.card.green{border-left:3px solid var(--green);background:#f3fbf8}.card-title{font-size:6.3px;letter-spacing:1.1px;text-transform:uppercase;color:#6b7f90;font-weight:900;margin-bottom:5px}.kv{display:grid;grid-template-columns:1fr auto;gap:5px;border-bottom:1px solid #edf1f4;padding:4.5px 0}.kv:last-child{border-bottom:0}.kv span:first-child{color:var(--muted)}.kv strong{color:var(--navy);text-align:right;max-width:60mm}
  .callout{border-radius:7px;background:var(--soft2);padding:8px 10px;margin:8px 0;color:#496174}.callout strong{color:var(--navy)}.callout.warn{background:#fff7e2;border-left:3px solid var(--gold)}.callout.green{background:#eaf8f3;border-left:3px solid var(--green)}.callout.dark{background:#173f64;color:#dce9f4}
  .process{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:10px 0}.process div{border:1px solid var(--line);background:#f8fbfd;border-radius:5px;padding:6px 3px;text-align:center;font-size:6.1px;font-weight:800;color:#496174}.process b{display:block;color:var(--blue);font-size:6.8px;margin-bottom:2px}
  .table-wrap{border:1px solid var(--line);border-radius:7px;overflow:hidden;margin:8px 0;box-shadow:0 2px 10px rgba(17,46,70,.035)}table{width:100%;border-collapse:collapse;font-size:7.15px}th{background:#eaf2f8;color:#38566d;font-size:6px;letter-spacing:.45px;text-transform:uppercase;font-weight:900;padding:6px 5px;text-align:right;border-bottom:1px solid #d2dfe8}th:first-child{text-align:left}td{padding:5px;border-bottom:1px solid #edf1f4;text-align:right;vertical-align:middle}td:first-child{text-align:left;font-weight:700;color:#3e596d}tr:last-child td{border-bottom:0}.highlight-row td{background:#f2f7fb;font-weight:850}.money{white-space:nowrap}.table-wrap.compact table{font-size:6.7px}.table-wrap.compact td,.table-wrap.compact th{padding:4px 3px}
  .summary-band{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0}.summary-band .box{padding:7px;background:#f7fafc;border:1px solid var(--line);border-radius:6px}.summary-band small{display:block;color:#718394;font-size:5.8px;text-transform:uppercase;font-weight:850}.summary-band strong{display:block;color:var(--navy);font-size:10.3px;margin-top:2px}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:8px}.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.list{margin:4px 0 0;padding-left:15px;color:var(--muted)}.list li{margin:3.5px 0}
  .swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.swot-card{border:1px solid var(--line);border-radius:7px;padding:9px;min-height:84mm;background:#fff}.swot-label{font-size:6.2px;letter-spacing:1.6px;text-transform:uppercase;font-weight:900;margin-bottom:3px}.swot-card ul{padding-left:15px;margin:6px 0;color:var(--muted)}.swot-card li{margin:4px 0}.swot-strength{border-top:3px solid #1785c1}.swot-strength .swot-label{color:#1785c1}.swot-weak{border-top:3px solid #d28a24}.swot-weak .swot-label{color:#b97715}.swot-opportunity{border-top:3px solid #0b9b76}.swot-opportunity .swot-label{color:#087f63}.swot-threat{border-top:3px solid #c54c4c}.swot-threat .swot-label{color:#a33d3d}
  .timeline{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin-top:8px}.step{background:#f6f9fb;border:1px solid var(--line);border-radius:6px;padding:7px 4px;text-align:center}.step b{display:block;color:var(--blue);font-size:9px}.step span{display:block;color:#50687a;font-size:6.1px;font-weight:750;margin-top:3px}.rating{display:flex;align-items:center;gap:9px;margin:7px 0}.rating-track{height:7px;background:#e8eef3;border-radius:99px;overflow:hidden;flex:1}.rating-fill{height:100%;background:linear-gradient(90deg,var(--blue),#5d9ff0);border-radius:99px}.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:17px}.signature{border-top:1px solid #8799a8;padding-top:6px;color:var(--muted);font-size:7px}.small-note{font-size:6.5px;color:#80909e;margin-top:5px}.hero-line{height:3px;background:linear-gradient(90deg,var(--gold),var(--blue));border-radius:9px;margin:7px 0 10px}.pill{display:inline-block;padding:3px 6px;border-radius:99px;background:#eaf2fb;color:var(--navy);font-size:5.9px;font-weight:900;text-transform:uppercase;letter-spacing:.7px}.pill.green{background:#e8f7f2;color:#08765a}.pill.gold{background:#fff4cf;color:#8b6800}
  .page-footer{position:absolute;left:14mm;right:14mm;bottom:6.5mm;border-top:1px solid #dce5eb;padding-top:4.5px;display:flex;justify-content:space-between;color:#84929e;font-size:6px}.page-dark .page-footer{border-color:rgba(255,255,255,.15);color:#a8bdcd}
  .bar-chart{display:grid;gap:5px;margin:7px 0}.bar-row{display:grid;grid-template-columns:25mm 1fr 22mm;align-items:center;gap:6px;font-size:6.5px}.bar-track{height:8px;background:#edf2f6;border-radius:99px;overflow:hidden}.bar-fill{height:100%;background:linear-gradient(90deg,var(--blue),#65a6ed);border-radius:99px}.bar-value{text-align:right;font-weight:900;color:var(--navy)}
  @media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.toolbar{display:none!important}.page{margin:0;box-shadow:none}.page-dark{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<div class="toolbar">
  <button onclick="window.print()">Print / Save PDF</button>
  <button onclick="window.close()">Close</button>
</div>

${page(1,"Detailed Project Report","",`
  <div class="cover-inner">
    <div>
      <div class="cover-brand"><span class="cover-logo">G</span><span>GoSubsidy</span><span style="opacity:.55">/</span><span>Government Schemes &amp; Financial Intelligence Platform</span></div>
      <span class="cover-badge">Detailed Project Report • Lender Edition</span>
      <div class="cover-title">${projectTitle}</div>
      <div class="cover-subtitle">${businessTitle}</div>
      <div class="cover-location">${locationTitle}</div>
      <div class="cover-gold"></div>
      <p style="color:#c8d9e7;max-width:145mm" class="lead">A structured lender-facing project report covering project profile, business model, technical feasibility, capital cost, means of finance, financial projections, debt servicing, risks and implementation.</p>
      <div class="cover-metrics">
        <div class="cover-metric"><small>Total Project Cost</small><strong>${money(projectCost)}</strong></div>
        <div class="cover-metric"><small>Promoter Contribution</small><strong>${money(promoterContribution)}</strong></div>
        <div class="cover-metric"><small>Bank Term Loan</small><strong>${money(estimatedTermLoan)}</strong></div>
        <div class="cover-metric"><small>Expected Subsidy</small><strong>${money(expectedSubsidy)}</strong></div>
      </div>
    </div>
    <div class="cover-footer"><span>Prepared for lender / project appraisal</span><span>Generated by GoSubsidy • ${new Date().toLocaleDateString("en-IN")}</span></div>
  </div>
`,{dark:true,cover:true})}

${page(2,"Business Case","Executive Summary",`
  <div class="callout"><strong>Document Purpose:</strong> Prepared for lender review and project appraisal using the applicant inputs and the financial model maintained in GoSubsidy.</div>
  <div class="metrics">
    ${metric("Total Project Cost", money(projectCost), "100% of project cost")}
    ${metric("Promoter Contribution", money(promoterContribution), `${Number(project.promoterContributionPercent||0).toFixed(2)}% of project cost`)}
    ${metric("Bank Term Loan", money(estimatedTermLoan), `${Math.max(0,100-Number(project.promoterContributionPercent||0)-Number(project.subsidyPercent||0)).toFixed(2)}% modelled`)}
    ${metric("Expected Subsidy", money(expectedSubsidy), `${Number(project.subsidyPercent||0).toFixed(2)}% assumption`)}
    ${metric("Year 1 Revenue", money(firstYear.sales), "Projected")}
    ${metric("Year 1 EBITDA", money(firstYear.ebitda), "Projected")}
    ${metric("Year 1 PAT", money(firstYear.profitAfterTax), "Projected")}
    ${metric("Average DSCR", Number(calculations.averageDSCR||0).toFixed(2), "Debt service coverage")}
  </div>
  <div class="two-col">
    <div class="card accent"><div class="card-title">Project Rationale</div><p>${esc(projectRationale)}</p></div>
    <div class="card green"><div class="card-title">Credit Appraisal Highlights</div><ul class="list"><li>Capital cost reconciliation: <strong>${isCapitalCostReconciled ? "Fully Reconciled" : "Variance Present"}</strong>.</li><li>Promoter contribution is identified separately from bank finance and subsidy assumption.</li><li>Financial projections extend through the selected repayment horizon.</li><li>Debt servicing capacity is assessed through projected DSCR.</li></ul></div>
  </div>
  <div class="summary-band">
    <div class="box"><small>Minimum DSCR</small><strong>${minimumDSCR.toFixed(2)}</strong></div>
    <div class="box"><small>Year 1 EBITDA Margin</small><strong>${year1EbitdaMargin.toFixed(1)}%</strong></div>
    <div class="box"><small>Year 1 PAT Margin</small><strong>${year1PatMargin.toFixed(1)}%</strong></div>
    <div class="box"><small>Projection Horizon</small><strong>${projectionYears} Years</strong></div>
  </div>
`,{})}

${page(3,"Project Information","Project Profile",`
  <div class="cards">
    <div class="card"><div class="card-title">Project Particulars</div>
      <div class="kv"><span>Project Name</span><strong>${projectTitle}</strong></div>
      <div class="kv"><span>Business / Sector</span><strong>${businessTitle}</strong></div>
      <div class="kv"><span>Constitution</span><strong>${esc(project.constitution)}</strong></div>
      <div class="kv"><span>Project Location</span><strong>${esc(project.location || "Not specified")}</strong></div>
      <div class="kv"><span>District / State</span><strong>${esc([project.district,project.state].filter(Boolean).join(" / "))}</strong></div>
    </div>
    <div class="card soft"><div class="card-title">Funding &amp; Loan Identifiers</div>
      <div class="kv"><span>Total Project Cost</span><strong>${money(projectCost)}</strong></div>
      <div class="kv"><span>Promoter Contribution</span><strong>${money(promoterContribution)}</strong></div>
      <div class="kv"><span>Expected Subsidy</span><strong>${money(expectedSubsidy)}</strong></div>
      <div class="kv"><span>Bank Term Loan</span><strong>${money(estimatedTermLoan)}</strong></div>
      <div class="kv"><span>Interest Rate</span><strong>${Number(project.interestRate||0).toFixed(2)}% p.a.</strong></div>
      <div class="kv"><span>Loan Tenure / Moratorium</span><strong>${projectionYears} Years / ${Number(project.moratorium||0)} Months</strong></div>
    </div>
  </div>
  <div class="card accent"><div class="card-title">Project Information Narrative</div><p>The present report consolidates the project assumptions supplied in the DPR form and translates them into a structured appraisal format. Final site details, vendor quotations, statutory registrations and scheme eligibility should be attached wherever required by the lender.</p></div>
  <div class="callout warn"><strong>Working Capital:</strong> ${project.requiresWorkingCapital ? `Required — ${money(project.workingCapital)} for ${esc(project.workingCapitalPurpose || "specified operating needs")}, with a ${Number(project.workingCapitalCycleDays||0)}-day cycle.` : "Not Required. Working Capital Margin is modelled at ₹0."}</div>
`,{})}

${page(4,"Promoter","Promoter Profile",`
  <div class="cards">
    <div class="card accent"><div class="card-title">Applicant / Promoter</div><div style="font-size:18px;font-weight:900;color:var(--navy)">${promoterTitle}</div><p style="margin-top:5px">Constitution: <strong>${esc(project.constitution)}</strong></p><p>Contact: ${esc(project.mobile || "Not provided")} • ${esc(project.email || "Not provided")}</p></div>
    <div class="card soft"><div class="card-title">Appraisal Information Status</div><div class="kv"><span>Identity / KYC details</span><strong>Applicant data available</strong></div><div class="kv"><span>Constitution details</span><strong>Provided</strong></div><div class="kv"><span>Promoter experience</span><strong>To be supported</strong></div><div class="kv"><span>Promoter net worth</span><strong>To be supported</strong></div></div>
  </div>
  <div class="callout"><strong>Bank appraisal note:</strong> Promoter profile should be read together with KYC, constitution documents, experience credentials, net-worth statement and other documents requested by the lender.</div>
  <div class="signature-grid"><div class="signature">Promoter / Applicant<br><strong>${promoterTitle}</strong></div><div class="signature">Prepared / Reviewed by<br><strong>GoSubsidy DPR System</strong></div></div>
`,{})}

${page(5,"Business Model","Business / Project Description",`
  <div class="card accent"><div class="card-title">Business Concept</div><h2>${businessTitle}</h2><p>${esc(businessModel)}</p></div>
  <div class="two-col">
    <div class="card"><div class="card-title">Business Model &amp; Operational Concept</div><p>The business model should be aligned with procurement, processing / service delivery, quality control, packaging or dispatch requirements applicable to the selected business sector. Final operating assumptions should be validated against actual quotations and capacity.</p></div>
    <div class="card"><div class="card-title">Core Value Proposition</div><ul class="list"><li>Location and market access advantage.</li><li>Structured operating infrastructure and equipment.</li><li>Quality, consistency and customer-focused delivery.</li><li>Scalable local / regional sales channels.</li></ul></div>
  </div>
  <h2>Project Operating Logic</h2>
  <div class="process"><div><b>01</b>Procure / Receive</div><div><b>02</b>Prepare / Process</div><div><b>03</b>Core Activity</div><div><b>04</b>Quality Control</div><div><b>05</b>Pack / Deliver</div><div><b>06</b>Storage / Dispatch</div></div>
  <div class="small-note">The operating sequence is a professional appraisal framework and should be matched with final machinery quotations, site layout, staffing plan and statutory requirements before sanction.</div>
`,{})}

${page(6,"Industry","Industry Overview",`
  <div class="card accent"><div class="card-title">Sector</div><h2>${businessTitle}</h2><p>The project is positioned within its selected sector and local economic ecosystem. Sector demand, raw-material availability, customer purchasing behaviour and competitive conditions should be validated with current market evidence during appraisal.</p></div>
  <div class="two-col">
    <div class="card"><div class="card-title">Sector Context</div><ul class="list"><li>Connection with local / regional supply chains and end markets.</li><li>Potential for value addition through organized operations.</li><li>Scope for quality, productivity and process improvements through planned investment.</li></ul></div>
    <div class="card"><div class="card-title">Project Relevance</div><ul class="list"><li>Project location: ${locationTitle}.</li><li>Proposed activity is aligned with the selected business sector.</li><li>Regional connectivity and customer access are key operating considerations.</li></ul></div>
  </div>
  <div class="callout">Industry-specific licences, registrations, quality standards and statutory approvals should be identified and attached based on the final business activity.</div>
`,{})}

${page(7,"Demand","Market Potential",`
  <div class="two-col">
    <div class="card accent"><div class="card-title">Target Customer Segments</div><ul class="list"><li>Local and regional retail / trade networks.</li><li>Wholesale distributors, stockists and institutional buyers.</li><li>Restaurants, caterers, hotels or other business customers where relevant.</li><li>Direct-to-consumer and digital channels where commercially suitable.</li></ul></div>
    <div class="card green"><div class="card-title">Demand Drivers &amp; Competitive Edge</div><ul class="list"><li>Location and logistics accessibility.</li><li>Quality, hygiene and consistency.</li><li>Competitive pricing and efficient procurement.</li><li>Structured distributor / customer relationships.</li></ul></div>
  </div>
  <h2>Market Entry Strategy</h2>
  <div class="cards"><div class="card"><div class="card-title">Sales Channels</div><p>Develop a balanced mix of direct sales, distributors, wholesalers, institutional customers and local retail channels appropriate to the product or service.</p></div><div class="card"><div class="card-title">Growth Strategy</div><p>Build repeat customer relationships, maintain product / service quality, control costs and expand through localized distribution and customer referrals.</p></div></div>
  <div class="callout warn"><strong>Appraisal requirement:</strong> Sales projections should be supported by capacity, pricing, customer pipeline, quotations / orders or other market evidence wherever available.</div>
`,{})}

${page(8,"Technical Viability","Technical Feasibility",`
  <div class="metrics">
    ${metric("Plant & Machinery", money(project.plantMachinery))}
    ${metric("Electrical Installation", money(project.electrical))}
    ${metric("Project Location", esc(project.location || "Not specified"))}
    ${metric("Sector", businessTitle)}
  </div>
  <div class="two-col">
    <div class="card accent"><div class="card-title">Site &amp; Infrastructure</div><p>Location: ${locationTitle}. The planned infrastructure should provide adequate processing / operating space, storage, utilities, access, safety and administrative facilities consistent with the business model.</p><p>Civil allocation: ${money(project.building)}.</p></div>
    <div class="card"><div class="card-title">Machinery, Utilities &amp; Quality</div><p>Plant &amp; machinery allocation: ${money(project.plantMachinery)}.</p><p>Electrical installation: ${money(project.electrical)}.</p><p>Quality control should be integrated into the operating process before final packaging / delivery.</p></div>
  </div>
  <div class="process"><div><b>01</b>Receipt</div><div><b>02</b>Preparation</div><div><b>03</b>Processing</div><div><b>04</b>Quality Check</div><div><b>05</b>Packaging</div><div><b>06</b>Dispatch</div></div>
  <div class="callout">Final machinery specifications, capacity, power load, layout, vendor quotations and commissioning requirements should be reconciled before lender sanction.</div>
`,{})}

${page(9,"Project Investment","Capital Cost Statement",`
  ${table(["Particulars","Amount (₹)"], [...capitalRows, `<tr class="highlight-row"><td><strong>Total Capital Cost</strong></td><td><strong>${moneyCell(totalCapitalCost)}</strong></td></tr>`, `<tr><td>Reconciliation Difference</td><td>${moneyCell(Math.abs(capitalCostDifference))}</td></tr>`])}
  <div class="summary-band"><div class="box"><small>Authoritative Project Cost</small><strong>${money(projectCost)}</strong></div><div class="box"><small>Total Capital Cost</small><strong>${money(totalCapitalCost)}</strong></div><div class="box"><small>Difference</small><strong>${money(Math.abs(capitalCostDifference))}</strong></div><div class="box"><small>Status</small><strong>${isCapitalCostReconciled ? "Reconciled" : "Review"}</strong></div></div>
  <div class="callout ${isCapitalCostReconciled ? "green" : "warn"}"><strong>Capital cost control:</strong> ${isCapitalCostReconciled ? "Capital cost components are fully reconciled with the authoritative Total Project Cost." : "Capital cost requires reconciliation before final DPR submission."}</div>
  <div class="card accent"><div class="card-title">Working Capital Readiness</div><div class="kv"><span>Working Capital Margin</span><strong>${money(project.workingCapitalMargin || project.workingCapital || 0)}</strong></div><p class="small-note">Working capital requirement is presented separately from fixed-asset investment and should be aligned with the applicant-selected working-capital requirement, operating cycle and lender facility structure.</p></div>
`,{})}

${page(10,"Funding Structure","Means of Finance",`
  ${table(["Particulars","Percentage","Amount (₹)"], [
    `<tr><td>Promoter Contribution</td><td>${Number(project.promoterContributionPercent||0).toFixed(2)}%</td><td>${moneyCell(promoterContribution)}</td></tr>`,
    `<tr><td>Bank Term Loan</td><td>${Math.max(0,100-Number(project.promoterContributionPercent||0)-Number(project.subsidyPercent||0)).toFixed(2)}%</td><td>${moneyCell(estimatedTermLoan)}</td></tr>`,
    `<tr><td>Expected Subsidy</td><td>${Number(project.subsidyPercent||0).toFixed(2)}%</td><td>${moneyCell(expectedSubsidy)}</td></tr>`,
    `<tr class="highlight-row"><td>Total Means of Finance</td><td>100.00%</td><td>${moneyCell(projectCost)}</td></tr>`
  ])}
  <div class="callout">Project Cost = Promoter Contribution + Bank Term Loan + Expected Subsidy. The subsidy component is a financial modelling assumption until official scheme eligibility is verified.</div>
  <div class="two-col"><div class="card"><div class="card-title">Promoter Stake</div><div style="font-size:22px;font-weight:900;color:var(--navy)">${Number(project.promoterContributionPercent||0).toFixed(1)}%</div><p>Modelled promoter contribution to total project cost.</p></div><div class="card"><div class="card-title">Debt Funding</div><div style="font-size:22px;font-weight:900;color:var(--navy)">${money(estimatedTermLoan)}</div><p>Indicative term loan requirement after promoter and subsidy assumptions.</p></div></div>
`,{})}

${page(11,"Financial Model","Financial Assumptions",`
  <div class="metrics">
    ${metric("Project Cost", money(projectCost))}
    ${metric("Interest Rate", `${Number(project.interestRate||0).toFixed(2)}% p.a.`)}
    ${metric("Promoter Contribution", `${Number(project.promoterContributionPercent||0).toFixed(2)}%`)}
    ${metric("Expected Subsidy", `${Number(project.subsidyPercent||0).toFixed(2)}%`)}
    ${metric("Loan Repayment", `${projectionYears} Years`)}
    ${metric("Moratorium", `${Number(project.moratorium||0)} Months`)}
    ${metric("Projection Horizon", `${projectionYears} Years`)}
    ${metric("Average DSCR", Number(calculations.averageDSCR||0).toFixed(2))}
  </div>
  <div class="two-col"><div class="card"><div class="card-title">Revenue Assumption</div><div class="kv"><span>Year 1 Sales</span><strong>${money(project.year1Sales)}</strong></div><div class="kv"><span>Annual Sales Growth</span><strong>${Number(project.salesGrowth||0).toFixed(1)}%</strong></div></div><div class="card"><div class="card-title">Operating Cost Assumptions</div><div class="kv"><span>Raw Material</span><strong>${Number(project.rawMaterialPercent||0).toFixed(1)}%</strong></div><div class="kv"><span>Salaries / Wages</span><strong>${Number(project.salaryPercent||0).toFixed(1)}%</strong></div><div class="kv"><span>Power / Utilities</span><strong>${Number(project.powerPercent||0).toFixed(1)}%</strong></div><div class="kv"><span>Other Operating Costs</span><strong>${(Number(project.adminPercent||0)+Number(project.marketingPercent||0)+Number(project.otherExpensePercent||0)).toFixed(1)}%</strong></div></div></div>
  <div class="callout warn"><strong>Subsidy assumption:</strong> Final eligibility, eligible project cost, subsidy percentage and maximum subsidy must be verified against the applicable Government scheme and official guidelines.</div>
`,{})}

${page(12,"Financial Projections","Projected Income Statement",`
  ${table(["Year / Particulars",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>Revenue / Sales</td>${calculations.years.map(y=>`<td>${moneyCell(y.sales)}</td>`).join("")}</tr>`,
    `<tr><td>EBITDA</td>${calculations.years.map(y=>`<td>${moneyCell(y.ebitda)}</td>`).join("")}</tr>`,
    `<tr><td>Profit Before Tax</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitBeforeTax)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Profit After Tax</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitAfterTax)}</td>`).join("")}</tr>`
  ])}
  <div class="summary-band"><div class="box"><small>Year 1 Sales</small><strong>${money(firstYear.sales)}</strong></div><div class="box"><small>EBITDA Margin</small><strong>${year1EbitdaMargin.toFixed(1)}%</strong></div><div class="box"><small>Final Year Sales</small><strong>${money(finalYear.sales)}</strong></div><div class="box"><small>Final Year PAT</small><strong>${money(finalYear.profitAfterTax)}</strong></div></div>
  <h2>Revenue Trajectory</h2>
  <div class="bar-chart">${calculations.years.map(y=>{const maxSales=Math.max(...calculations.years.map(v=>Number(v.sales||0)),1);return `<div class="bar-row"><span>Year ${y.year}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2,Math.min(100,(Number(y.sales||0)/maxSales)*100))}%"></div></div><span class="bar-value">${money(y.sales)}</span></div>`}).join("")}</div>
  <div class="small-note">Revenue projections are modelled across the selected horizon and should be supported by capacity, pricing and market assumptions during lender appraisal.</div>
`,{})}

${page(13,"Operating Costs","Projected Expenditure Statement",`
  ${table(["Particulars",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>Raw Material</td>${calculations.years.map(y=>`<td>${moneyCell(y.rawMaterial)}</td>`).join("")}</tr>`,
    `<tr><td>Salaries &amp; Wages</td>${calculations.years.map(y=>`<td>${moneyCell(y.salaries)}</td>`).join("")}</tr>`,
    `<tr><td>Power &amp; Utilities</td>${calculations.years.map(y=>`<td>${moneyCell(y.power)}</td>`).join("")}</tr>`,
    `<tr><td>Administration</td>${calculations.years.map(y=>`<td>${moneyCell(y.admin)}</td>`).join("")}</tr>`,
    `<tr><td>Marketing</td>${calculations.years.map(y=>`<td>${moneyCell(y.marketing)}</td>`).join("")}</tr>`,
    `<tr><td>Other Operating Expenses</td>${calculations.years.map(y=>`<td>${moneyCell(y.otherExpenses)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Total Operating Expenses</td>${calculations.years.map(y=>`<td>${moneyCell(y.operatingExpenses)}</td>`).join("")}</tr>`
  ])}
  <div class="summary-band"><div class="box"><small>Year 1 Operating Cost</small><strong>${money(firstYear.operatingExpenses)}</strong></div><div class="box"><small>Cost / Sales</small><strong>${firstYear.sales ? ((firstYear.operatingExpenses/firstYear.sales)*100).toFixed(1) : "0.0"}%</strong></div><div class="box"><small>Raw Material / Sales</small><strong>${firstYear.sales ? ((firstYear.rawMaterial/firstYear.sales)*100).toFixed(1) : "0.0"}%</strong></div><div class="box"><small>Final Year Cost</small><strong>${money(finalYear.operatingExpenses)}</strong></div></div>
  <div class="small-note">Operating cost assumptions should be validated against vendor quotations, staffing plan, utility requirements and actual production economics.</div>
`,{})}

${page(14,"Profitability","Projected Profit & Loss Account",`
  ${table(["Particulars",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>Gross Sales Revenue</td>${calculations.years.map(y=>`<td>${moneyCell(y.sales)}</td>`).join("")}</tr>`,
    `<tr><td>Less: Operating Expenses</td>${calculations.years.map(y=>`<td>${moneyCell(y.operatingExpenses)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>EBITDA</td>${calculations.years.map(y=>`<td>${moneyCell(y.ebitda)}</td>`).join("")}</tr>`,
    `<tr><td>Less: Depreciation</td>${calculations.years.map(y=>`<td>${moneyCell(y.depreciation)}</td>`).join("")}</tr>`,
    `<tr><td>Less: Interest on Term Loan</td>${calculations.years.map(y=>`<td>${moneyCell(y.interest)}</td>`).join("")}</tr>`,
    `<tr><td>Profit Before Tax (PBT)</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitBeforeTax)}</td>`).join("")}</tr>`,
    `<tr><td>Less: Estimated Income Tax</td>${calculations.years.map(y=>`<td>${moneyCell(y.estimatedTax)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Profit After Tax (PAT)</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitAfterTax)}</td>`).join("")}</tr>`
  ])}
  <div class="summary-band"><div class="box"><small>Year 1 EBITDA</small><strong>${money(firstYear.ebitda)}</strong></div><div class="box"><small>Year 1 PAT</small><strong>${money(firstYear.profitAfterTax)}</strong></div><div class="box"><small>PAT Margin</small><strong>${year1PatMargin.toFixed(1)}%</strong></div><div class="box"><small>Final Year PAT</small><strong>${money(finalYear.profitAfterTax)}</strong></div></div>
`,{})}

${page(15,"Financial Position","Projected Balance Sheet",`
  ${table(["Assets & Liabilities",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>Net Fixed Assets</td>${calculations.years.map(y=>`<td>${moneyCell(y.netFixedAssets)}</td>`).join("")}</tr>`,
    `<tr><td>Current Assets</td>${calculations.years.map(y=>`<td>${moneyCell(y.currentAssets)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Total Assets</td>${calculations.years.map(y=>`<td>${moneyCell(y.totalAssets)}</td>`).join("")}</tr>`,
    `<tr><td>Outstanding Term Loan</td>${calculations.years.map(y=>`<td>${moneyCell(y.closingLoan)}</td>`).join("")}</tr>`,
    `<tr><td>Current Liabilities</td>${calculations.years.map(y=>`<td>${moneyCell(y.currentLiabilities)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Indicative Net Worth</td>${calculations.years.map(y=>`<td>${moneyCell(y.netWorth)}</td>`).join("")}</tr>`
  ])}
  <div class="summary-band"><div class="box"><small>Year 1 Assets</small><strong>${money(firstYear.totalAssets)}</strong></div><div class="box"><small>Year 1 Loan Closing</small><strong>${money(firstYear.closingLoan)}</strong></div><div class="box"><small>Final Year Loan</small><strong>${money(finalYear.closingLoan)}</strong></div><div class="box"><small>Final Net Worth</small><strong>${money(finalYear.netWorth)}</strong></div></div>
  <div class="callout">The balance-sheet schedule is indicative and should be reconciled with detailed working-capital, inventory, receivable, creditor and cash/bank schedules for final lender submission.</div>
`,{})}

${page(16,"Cash Flow","Projected Cash Flow Statement",`
  ${table(["Cash Flow Summary",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>Profit After Tax (PAT)</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitAfterTax)}</td>`).join("")}</tr>`,
    `<tr><td>Add: Depreciation</td>${calculations.years.map(y=>`<td>${moneyCell(y.depreciation)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Operating Cash Flow</td>${calculations.years.map(y=>`<td>${moneyCell(y.operatingCashFlow)}</td>`).join("")}</tr>`,
    `<tr><td>Less: Principal Repayment</td>${calculations.years.map(y=>`<td>${moneyCell(-y.repayment)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Net Cash Flow</td>${calculations.years.map(y=>`<td>${moneyCell(y.netCashFlow)}</td>`).join("")}</tr>`
  ])}
  <div class="summary-band"><div class="box"><small>Year 1 Operating Cash</small><strong>${money(firstYear.operatingCashFlow)}</strong></div><div class="box"><small>Year 1 Net Cash Flow</small><strong>${money(firstYear.netCashFlow)}</strong></div><div class="box"><small>Cumulative Operating Cash</small><strong>${money(totalOperatingCash)}</strong></div><div class="box"><small>Total Debt Service</small><strong>${money(totalDebtService)}</strong></div></div>
  <div class="callout green">Positive modelled cash generation provides the primary source for servicing scheduled principal and interest, subject to actual operating performance and lender-approved repayment terms.</div>
`,{})}

${page(17,"Debt Servicing","Loan Repayment Schedule",`
  <div class="metrics">${metric("Term Loan",money(estimatedTermLoan))}${metric("Interest Rate",`${Number(project.interestRate||0).toFixed(2)}%`)}${metric("Tenure",`${projectionYears} Years`)}${metric("Moratorium",`${Number(project.moratorium||0)} Months`)}</div>
  ${table(["Year","Opening Loan","Principal","Interest","Debt Service","Closing Loan"], loanRows)}
  <div class="summary-band"><div class="box"><small>Term Loan</small><strong>${money(estimatedTermLoan)}</strong></div><div class="box"><small>Total Debt Service</small><strong>${money(totalDebtService)}</strong></div><div class="box"><small>Closing Loan</small><strong>${money(finalYear.closingLoan)}</strong></div><div class="box"><small>Repayment Status</small><strong>${finalYear.closingLoan <= 1 ? "Fully Repaid" : "Outstanding"}</strong></div></div>
  <div class="small-note">Repayment is shown year-wise to support lender review of principal reduction, interest burden and outstanding exposure.</div>
`,{})}

${page(18,"Assets Schedule","Depreciation Statement",`
  ${table(["Depreciation Schedule",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>Opening Asset Base</td>${calculations.years.map(y=>`<td>${moneyCell(y.openingWDV)}</td>`).join("")}</tr>`,
    `<tr><td>Depreciation Charge</td>${calculations.years.map(y=>`<td>${moneyCell(y.depreciation)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Closing Asset Base</td>${calculations.years.map(y=>`<td>${moneyCell(y.closingWDV)}</td>`).join("")}</tr>`
  ])}
  <div class="summary-band"><div class="box"><small>Opening Asset Base</small><strong>${money(firstYear.openingWDV)}</strong></div><div class="box"><small>Year 1 Depreciation</small><strong>${money(firstYear.depreciation)}</strong></div><div class="box"><small>Final Asset Base</small><strong>${money(finalYear.closingWDV)}</strong></div><div class="box"><small>Depreciation Rate</small><strong>${Number(project.depreciationRate||0).toFixed(1)}%</strong></div></div>
  <div class="callout">Depreciation is reflected as a non-cash charge reducing the asset carrying value and influencing taxable profit and cash-available calculations.</div>
`,{})}

${page(19,"Debt Coverage","DSCR Statement",`
  <div class="metrics">${metric("Average DSCR",Number(calculations.averageDSCR||0).toFixed(2))}${metric("Minimum Yearly DSCR",minimumDSCR.toFixed(2))}${metric("Term Loan",money(estimatedTermLoan))}${metric("Interest Rate",`${Number(project.interestRate||0).toFixed(2)}%`)}</div>
  <div class="callout">DSCR = Cash Available for Debt Service / Total Debt Service. Cash Available = PAT + Depreciation + Interest.</div>
  ${table(["Particulars",...calculations.years.map((y)=>`Year ${y.year}`)], [
    `<tr><td>PAT (₹)</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitAfterTax)}</td>`).join("")}</tr>`,
    `<tr><td>Depreciation (₹)</td>${calculations.years.map(y=>`<td>${moneyCell(y.depreciation)}</td>`).join("")}</tr>`,
    `<tr><td>Interest (₹)</td>${calculations.years.map(y=>`<td>${moneyCell(y.interest)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Cash Available (₹)</td>${calculations.years.map(y=>`<td>${moneyCell(y.profitAfterTax+y.depreciation+y.interest)}</td>`).join("")}</tr>`,
    `<tr><td>Total Debt Service (₹)</td>${calculations.years.map(y=>`<td>${moneyCell(y.debtService)}</td>`).join("")}</tr>`,
    `<tr class="highlight-row"><td>Yearly DSCR</td>${calculations.years.map(y=>`<td><strong>${Number(y.dscr||0).toFixed(2)}</strong></td>`).join("")}</tr>`
  ])}
  <div class="callout green"><strong>Credit view:</strong> The model indicates an average DSCR of ${Number(calculations.averageDSCR||0).toFixed(2)} with a minimum yearly DSCR of ${minimumDSCR.toFixed(2)}. Final lender assessment will apply the bank's prescribed DSCR methodology.</div>
`,{})}

${page(20,"Viability","Break-even Analysis",`
  <div class="metrics">${metric("Year 1 Revenue",money(firstYear.sales),"Projected sales")}${metric("Year 1 Operating Cost",money(firstYear.operatingExpenses),"Projected operating cost")}${metric("Year 1 EBITDA",money(firstYear.ebitda),"Operating surplus")}${metric("Operating Margin",`${year1EbitdaMargin.toFixed(1)}%`)}</div>
  <div class="card accent"><div class="card-title">Indicative Year 1 Break-even Interpretation</div><p>The current model demonstrates positive operating surplus based on the supplied sales and operating-cost assumptions. A formal break-even volume / break-even sales computation requires classification of fixed and variable costs and is therefore not silently invented in this report.</p></div>
  <div class="rating"><strong style="font-size:8px;color:var(--navy)">Operating surplus</strong><div class="rating-track"><div class="rating-fill" style="width:${Math.max(0,Math.min(100,year1EbitdaMargin))}%"></div></div><strong>${year1EbitdaMargin.toFixed(1)}%</strong></div>
  <div class="two-col"><div class="card"><div class="card-title">Gross Operating Logic</div><p>Sales less raw material and other operating costs produces the modelled EBITDA available for depreciation, interest and tax.</p></div><div class="card"><div class="card-title">Appraisal Requirement</div><p>A lender may require detailed fixed-cost / variable-cost break-even computation, capacity utilization and sensitivity analysis during appraisal.</p></div></div>
`,{})}

${page(21,"Employment & Subsidy","Employment Generation & Government Support",`
  <div class="two-col">
    <div class="card accent"><div class="card-title">Employment Generation</div><ul class="list"><li>Administrative &amp; managerial supervision, accounts and sales coordination.</li><li>Skilled technical / operating personnel appropriate to the machinery and process.</li><li>Support staff for material handling, packaging, cleaning, delivery and security where applicable.</li></ul></div>
    <div class="card gold"><div class="card-title">Government Subsidy / Scheme Consideration</div><p>The DPR carries an expected subsidy of ${money(expectedSubsidy)} (${Number(project.subsidyPercent||0).toFixed(1)}%) as a financial modelling assumption.</p><p>Actual scheme selection, subsidy eligibility, maximum grant caps, eligible project cost and sanction criteria must be independently verified against official government guidelines.</p></div>
  </div>
  <div class="callout">Potential Central / State support should be mapped only after confirming the applicant category, activity, location, project cost, eligible components and official scheme conditions.</div>
  <div class="summary-band"><div class="box"><small>Expected Subsidy</small><strong>${money(expectedSubsidy)}</strong></div><div class="box"><small>Subsidy Assumption</small><strong>${Number(project.subsidyPercent||0).toFixed(1)}%</strong></div><div class="box"><small>Promoter Contribution</small><strong>${money(promoterContribution)}</strong></div><div class="box"><small>Bank Finance</small><strong>${money(estimatedTermLoan)}</strong></div></div>
`,{})}

${page(22,"Strategy","SWOT Analysis",`
  <div class="swot-grid">
    ${swotCard("Strengths","Strengths",["Project is structured with defined capital cost and funding sources.",`Projected average DSCR of ${Number(calculations.averageDSCR||0).toFixed(2)} indicates modelled debt-service capacity.`,"Focused promoter-led management and local market execution."],"swot-strength")}
    ${swotCard("Weaknesses","Weaknesses",["Market penetration may require structured sales and distribution efforts.","Operating assumptions depend on actual procurement, pricing and cost control.","Final appraisal documents and supporting evidence may still be required."],"swot-weak")}
    ${swotCard("Opportunities","Opportunities",["Potential to expand customer coverage and product / service range.","Scope for distributor, institutional and direct customer tie-ups.","Operational scale and process efficiency can improve margins over time."],"swot-opportunity")}
    ${swotCard("Threats","Threats",["Demand fluctuations and competitive pricing pressure.","Raw-material, utility or labour cost volatility.","Regulatory, quality or statutory compliance changes."],"swot-threat")}
  </div>
`,{})}

${page(23,"Risk & Execution","Risk Analysis & Implementation Schedule",`
  ${table(["Risk Category","Key Risk Factors","Proposed Mitigation Strategy"],[
    `<tr><td>Market Risk</td><td>Demand fluctuations or competitive price pressures</td><td>Develop diversified sales channels across relevant customer segments.</td></tr>`,
    `<tr><td>Operational Risk</td><td>Machine downtime, procurement or process interruptions</td><td>Preventive maintenance, vendor support and alternate procurement sources.</td></tr>`,
    `<tr><td>Financial Risk</td><td>Interest burden or cash-flow mismatches</td><td>Maintain adequate liquidity, cost discipline and close cash-flow monitoring.</td></tr>`,
    `<tr><td>Regulatory Risk</td><td>Changes in statutory / sector compliance</td><td>Maintain applicable registrations, licences, safety and quality protocols.</td></tr>`
  ])}
  <h2>Implementation Sequence</h2>
  <div class="timeline"><div class="step"><b>01</b><span>DPR submission &amp; bank processing</span></div><div class="step"><b>02</b><span>Loan sanction &amp; site preparation</span></div><div class="step"><b>03</b><span>Machinery procurement &amp; civil works</span></div><div class="step"><b>04</b><span>Electrical installation &amp; commissioning</span></div><div class="step"><b>05</b><span>Recruitment &amp; trial run</span></div><div class="step"><b>06</b><span>Commercial operations launch</span></div></div>
  <div class="callout">Final sequencing should be aligned with sanction conditions, vendor quotations, civil completion, machinery delivery and statutory requirements applicable to the unit.</div>
`,{})}

${page(24,"Final Credit View","Conclusion & Bankability",`
  <div class="card accent"><p class="lead" style="color:#445e72">The proposed ${businessTitle} project under <strong>${promoterTitle}</strong> is presented as a structured, financially modelled project for lender appraisal. The report integrates project cost, promoter equity, bank finance, subsidy assumption, operating projections and debt-service analysis.</p></div>
  <h2>Financial Parameters Re-cap</h2>
  <div class="metrics">${metric("Total Project Cost",money(projectCost))}${metric("Promoter Equity",`${money(promoterContribution)} (${Number(project.promoterContributionPercent||0).toFixed(1)}%)`)}${metric("Bank Term Loan",money(estimatedTermLoan))}${metric("Expected Subsidy",`${money(expectedSubsidy)} (${Number(project.subsidyPercent||0).toFixed(1)}%)`)}${metric("Capital Cost Variance",money(Math.abs(capitalCostDifference)))}${metric("Average DSCR",Number(calculations.averageDSCR||0).toFixed(2))}${metric("Final Year Loan",money(finalYear.closingLoan))}${metric("Final Year PAT",money(finalYear.profitAfterTax))}</div>
  <div class="callout green"><strong>Credit View:</strong> Financially modelled project with subject-to-appraisal bankability. The projected cash generation and DSCR should be considered together with promoter credentials, technical feasibility, market evidence, collateral / security, statutory compliance and lender policy.</div>
  <div class="callout warn"><strong>Important Disclaimer:</strong> This Detailed Project Report is prepared using information supplied by the applicant, financial assumptions and AI-assisted drafting. Final bank sanction, loan terms, subsidy approvals, statutory clearances and scheme eligibility remain subject to formal appraisal and verification by the concerned lender and Government authority.</div>
  <div class="signature-grid"><div class="signature">Promoter / Applicant<br><strong>${promoterTitle}</strong><br>Date: __________________</div><div class="signature">For DPR / Appraisal<br><strong>GoSubsidy</strong><br>Date: __________________</div></div>
`,{dark:true})}

</body>
</html>`;

    preview.document.open();
    preview.document.write(html);
    preview.document.close();
  };

  // ====================================================
  // PREMIUM DPR ACCESS
  // ====================================================

  // ====================================================
  // PREMIUM DPR PAYMENT-FIRST FLOW
  // ====================================================
  // IMPORTANT: Never generate the Premium DPR directly from
  // the Premium DPR button. The button must always open the
  // payment modal first. AI generation starts only from the
  // PaymentModal onSuccess callback after payment/demo payment.
  const handlePremiumDPR = () => {
    const validationError = validateProject();

    if (validationError) {
      alert(validationError);
      return;
    }

    console.log("💳 Premium DPR clicked — opening payment modal first.");
    setShowDPRPayment(true);
  };

  const handleGenerateAIDPR = async () => {
  const validationError = validateProject();

  if (validationError) {
    alert(validationError);
    return;
  }

  // SHOW LOADING IMMEDIATELY
setIsGeneratingDPR(true);
setDprProgress(10);
setDprStatus("Preparing project information...");

let progressTimer = null;

try {
  const payload = buildDPRPayload();

    console.log("📘 DPR Payload:", payload);

    localStorage.setItem(
      "gosubsidy_ai_dpr",
      JSON.stringify(payload)
    );

    // Allow React to render loading UI before request
    await new Promise((resolve) => setTimeout(resolve, 100));

    setDprProgress(20);
    setDprStatus("Sending project to GoSubsidy AI...");

    // Simulated UI progress while Gemini is processing
    progressTimer = setInterval(() => {
      setDprProgress((previous) => {
        let next = previous + 5;

        if (next >= 90) {
          next = 90;
        }

        if (next >= 70) {
          setDprStatus("Finalizing bank-ready DPR...");
        } else if (next >= 50) {
          setDprStatus("Preparing financial analysis...");
        } else if (next >= 30) {
          setDprStatus("AI is analyzing your project...");
        }

        return next;
      });
    }, 1000);

    console.log("🚀 Sending project to AI DPR Generator...");

    const response = await fetch(
      "http://localhost:4000/api/dpr/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          project: payload,
          projectionYears,
        }),
      }
    );

    const data = await response.json();

    console.log("📥 AI DPR Response:", data);

    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `DPR server returned ${response.status}`
      );
    }

    if (!data?.success) {
      throw new Error(
        data?.message ||
          "AI DPR generation failed."
      );
    }

    const report =
      typeof data.dpr === "string"
        ? data.dpr.trim()
        : "";

    if (!report) {
      throw new Error(
        "AI DPR report content is empty."
      );
    }

    setDprProgress(95);
    setDprStatus("Saving generated DPR...");

    const generatedDPR = {
      project: payload,

      // Explicit customer-selected financial horizon.
      projectionYears,

      // Authoritative GoSubsidy financial calculation engine.
      calculations,

      report,

      provider:
        data.provider || "Google Gemini",

      backendProject:
        data.project || {},

      generatedAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "gosubsidy_generated_dpr",
      JSON.stringify(generatedDPR)
    );

    localStorage.setItem(
      "gosubsidy_dpr_authoritative_financials",
      JSON.stringify({
        projectionYears,
        loanTenure: project.loanTenure,
        calculations,
        savedAt: new Date().toISOString(),
      })
    );

    localStorage.setItem(
      "gosubsidy_generated_dpr_text",
      report
    );

    localStorage.setItem(
      "gosubsidy_generated_dpr_meta",
      JSON.stringify(data.project || {})
    );

    // COMPLETE
    setDprProgress(100);
    setDprStatus("DPR generated successfully!");

    console.log("✅ AI DPR generated successfully");

    // Keep 100% visible for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    navigate("/dpr-preview", {
      state: {
        generatedDPR,
        project: payload,
        dpr: report,
        provider:
          data.provider || "Google Gemini",
        financialData:
          data.project || {},

        projectionYears,
        calculations,
      },
    });

  } catch (error) {
    console.error(
      "❌ AI DPR Generation Error:",
      error
    );

    if (progressTimer) {
      clearInterval(progressTimer);
    }

    setDprStatus("DPR generation failed.");

    alert(
      error?.message ||
        "Unable to generate AI DPR."
    );

  } finally {
    if (progressTimer) {
      clearInterval(progressTimer);
    }

    setIsGeneratingDPR(false);
  }
};
  // ====================================================
  // SIDEBAR
  // ====================================================

  const sections = [
    {
      id: "glance",
      icon: "bi-grid",
      label: "Project at a Glance",
    },

    {
      id: "capital",
      icon: "bi-building",
      label: "Capital Cost",
    },

    {
      id: "dscr",
      icon: "bi-speedometer2",
      label: "DSCR Statement",
    },

    {
      id: "income",
      icon: "bi-graph-up-arrow",
      label: "Income Statement",
    },

    {
      id: "expenditure",
      icon: "bi-receipt",
      label: "Expenditure Statement",
    },

    {
      id: "profit",
      icon: "bi-bar-chart",
      label: "Profit & Loss Account",
    },

    {
      id: "balance",
      icon: "bi-bank",
      label: "Balance Sheet",
    },

    {
      id: "cashflow",
      icon: "bi-cash-stack",
      label: "Cash Flow Statement",
    },

    {
      id: "repayment",
      icon: "bi-calendar-check",
      label: "Repayment Schedule",
    },

    {
      id: "depreciation",
      icon: "bi-arrow-down-circle",
      label: "Depreciation",
    },
  ];

  // ====================================================
  // FINANCIAL TABLE COMPONENT
  // ====================================================

  const FinancialTable = ({
    title,
    subtitle,
    rows,
    editable = false,
  }) => {
    const hasEditableRows =
      editable &&
      rows.some((row) =>
        editableFinancialKeys.includes(row.key)
      );

    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">

          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">

            <div>
              <h3 className="fw-bold mb-1">
                {title}
              </h3>

              {subtitle && (
                <p className="text-muted mb-0">
                  {subtitle}
                </p>
              )}

              {hasEditableRows && (
                <small className="text-primary fw-semibold">
                  <i className="bi bi-pencil-square me-1" />
                  Click Edit Statement, enter all required figures, then Save Changes to recalculate dependent statements.
                </small>
              )}
            </div>

            {hasEditableRows && (
              <div className="d-flex flex-wrap gap-2">

                {!financialEditMode ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={startFinancialEditing}
                    >
                      <i className="bi bi-pencil-square me-2" />
                      Edit Statement
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={resetFinancialOverrides}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2" />
                      Reset to Calculated Values
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={saveFinancialChanges}
                    >
                      <i className="bi bi-check-lg me-2" />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={cancelFinancialEditing}
                    >
                      <i className="bi bi-x-lg me-2" />
                      Cancel
                    </button>
                  </>
                )}

              </div>
            )}

          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">

                <tr>

                  <th
                    style={{
                      minWidth: "220px",
                    }}
                  >
                    Particulars
                  </th>

                  {calculations.years.map(
                    (item) => (
                      <th
                        key={item.year}
                        className="text-nowrap"
                      >
                        Year {item.year}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (row, index) => {
                    const rowIsEditable =
                      editable &&
                      editableFinancialKeys.includes(
                        row.key
                      );

                    return (
                      <tr key={index}>

                        <th>
                          {row.label}

                          {rowIsEditable && (
                            <span
                              className="badge bg-primary-subtle text-primary ms-2"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Editable
                            </span>
                          )}
                        </th>

                        {calculations.years.map(
                          (item) => (
                            <td
                              key={item.year}
                              className="text-nowrap"
                              style={{
                                minWidth: rowIsEditable
                                  ? "150px"
                                  : undefined,
                              }}
                            >
                              {rowIsEditable &&
                              financialEditMode ? (
                                <EditableFinancialInput
                                  key={`${item.year}-${row.key}`}
                                  value={
                                    financialDrafts[
                                      financialCellKey(
                                        item.year,
                                        row.key
                                      )
                                    ] ??
                                    String(
                                      Math.round(
                                        Number(item[row.key]) || 0
                                      )
                                    )
                                  }
                                  year={item.year}
                                  fieldKey={row.key}
                                  onDraftChange={
                                    handleFinancialDraftChange
                                  }
                                />
                              ) : row.format === "number" ? (
                                Number(
                                  item[row.key] || 0
                                ).toFixed(2)
                              ) : (
                                money(item[row.key])
                              )}
                            </td>
                          )
                        )}

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    );
  };

  // ====================================================
  // PROJECT AT A GLANCE
  // ====================================================

  const ProjectAtGlance = () => {
    return (
      <>
        <div className="mb-4">

          <h2 className="fw-bold mb-1">
            Project at a Glance
          </h2>

          <p className="text-muted">
            Enter promoter, project and financial
            details required for preparation of the
            Detailed Project Report.
          </p>

        </div>

        {/* PROMOTER */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <h5 className="fw-bold mb-4">

              <i className="bi bi-person-badge text-primary me-2" />

              Promoter & Project Information

            </h5>

            <div className="row g-4">

              {/* PROJECT NAME */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
  Project Name
</label>

<input
  type="text"
  className="form-control"
  name="projectName"
  value={project.projectName || ""}
  onChange={(e) =>
    setProject((prev) => ({
      ...prev,
      projectName: e.target.value,
    }))
  }
  placeholder="Enter project name"
/>

              </div>

              {/* PROMOTER */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Promoter Name
                </label>

                <input
  type="text"
  className="form-control"
  name="promoterName"
  value={project.promoterName || ""}
  onChange={(e) =>
    setProject((prev) => ({
      ...prev,
      promoterName: e.target.value,
    }))
  }
  placeholder="Enter promoter name"
/>

              </div>

              {/* MOBILE */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Mobile Number
                </label>

               <input
  type="tel"
  className="form-control"
  name="mobile"
  value={project.mobile || ""}
  onChange={(e) =>
    setProject((prev) => ({
      ...prev,
      mobile: e.target.value,
    }))
  }
  placeholder="Enter mobile number"
/>

              </div>

              {/* EMAIL */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={project.email}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="example@email.com"
                />

              </div>

              {/* DISTRICT */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  value={project.district}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="Enter district"
                />

              </div>

              {/* LOCATION */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Project Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={project.location}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="Enter project location"
                />

              </div>

              {/* BUSINESS */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Business / Sector
                </label>

                <select
                  name="businessType"
                  value={project.businessType}
                  onChange={handleChange}
                  className="form-select form-select-lg"
                >

                  <option>
                    Food Processing
                  </option>

                  <option>
                    Agriculture
                  </option>

                  <option>
                    Poultry
                  </option>

                  <option>
                    Dairy
                  </option>

                  <option>
                    MSME
                  </option>

                  <option>
                    Manufacturing
                  </option>

                  <option>
                    Solar
                  </option>

                  <option>
                    Cold Chain
                  </option>

                </select>

              </div>

              {/* CONSTITUTION */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Constitution
                </label>

                <select
                  name="constitution"
                  value={project.constitution}
                  onChange={handleChange}
                  className="form-select form-select-lg"
                >

                  <option>
                    Proprietorship
                  </option>

                  <option>
                    Partnership
                  </option>

                  <option>LLP</option>

                  <option>
                    Private Limited
                  </option>

                  <option>
                    Public Limited
                  </option>

                  <option>
                    Co-operative
                  </option>

                  <option>FPO</option>

                  <option>SHG</option>

                </select>

              </div>

              {/* STATE */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  State
                </label>

                <select
                  name="state"
                  value={project.state}
                  onChange={handleChange}
                  className="form-select form-select-lg"
                >

                  <option>
                    Telangana
                  </option>

                  <option>
                    Andhra Pradesh
                  </option>

                  <option>
                    Karnataka
                  </option>

                  <option>
                    Tamil Nadu
                  </option>

                  <option>
                    Kerala
                  </option>

                  <option>
                    Maharashtra
                  </option>

                  <option>
                    Gujarat
                  </option>

                  <option>
                    Madhya Pradesh
                  </option>

                  <option>
                    Uttar Pradesh
                  </option>

                  <option>
                    Rajasthan
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* WORKING CAPITAL REQUIREMENT */}

        <div className="dpr-working-capital-alert mb-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-start gap-3">

                <div className="dpr-working-capital-icon">
                  <i className="bi bi-cash-coin" />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <h5 className="fw-bold mb-0">
                      Working Capital Requirement
                    </h5>

                    <span className="badge rounded-pill text-bg-warning">
                      IMPORTANT
                    </span>

                    {project.requiresWorkingCapital === null && (
                      <span className="badge rounded-pill bg-danger">
                        ACTION REQUIRED
                      </span>
                    )}
                  </div>

                  <p className="text-muted mb-3">
                    Before submitting the project details, please tell us
                    whether this project requires working capital for
                    inventory, receivables, wages, utilities or other
                    day-to-day operating expenses.
                  </p>

                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <label
                      className={`dpr-working-capital-choice ${
                        project.requiresWorkingCapital === true
                          ? "selected yes"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="requiresWorkingCapital"
                        checked={project.requiresWorkingCapital === true}
                        onChange={() => handleWorkingCapitalChoice(true)}
                      />
                      <span>
                        <i className="bi bi-check-circle-fill me-2" />
                        Yes — I need Working Capital
                      </span>
                    </label>

                    <label
                      className={`dpr-working-capital-choice ${
                        project.requiresWorkingCapital === false
                          ? "selected no"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="requiresWorkingCapital"
                        checked={project.requiresWorkingCapital === false}
                        onChange={() => handleWorkingCapitalChoice(false)}
                      />
                      <span>
                        <i className="bi bi-x-circle-fill me-2" />
                        No — I don't need Working Capital
                      </span>
                    </label>
                  </div>

                  {project.requiresWorkingCapital === true && (
                    <div className="dpr-working-capital-details">
                      <div className="row g-3">

                        <div className="col-md-5">
                          <label className="form-label fw-semibold">
                            Working Capital Requirement
                          </label>

                          <div className="input-group input-group-lg">
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              min="1"
                              name="workingCapital"
                              value={project.workingCapital ?? ""}
                              onChange={handleWorkingCapitalAmountChange}
                              className="form-control"
                              placeholder="Enter required amount"
                            />
                          </div>

                          <small className="text-muted">
                            This amount is automatically carried into the
                            DPR and the Capital Cost Statement as
                            <strong> Working Capital Margin</strong>.
                          </small>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Primary Purpose
                          </label>

                          <select
                            name="workingCapitalPurpose"
                            value={project.workingCapitalPurpose || ""}
                            onChange={handleChange}
                            className="form-select form-select-lg"
                          >
                            <option value="">Select purpose</option>
                            <option value="Inventory / Raw Materials">
                              Inventory / Raw Materials
                            </option>
                            <option value="Receivables / Credit Sales">
                              Receivables / Credit Sales
                            </option>
                            <option value="Salaries & Wages">
                              Salaries & Wages
                            </option>
                            <option value="Utilities / Operating Expenses">
                              Utilities / Operating Expenses
                            </option>
                            <option value="Marketing & Other Expenses">
                              Marketing & Other Expenses
                            </option>
                            <option value="General Working Capital">
                              General Working Capital
                            </option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            Working Capital Cycle
                          </label>

                          <div className="input-group input-group-lg">
                            <input
                              type="number"
                              min="1"
                              name="workingCapitalCycleDays"
                              value={project.workingCapitalCycleDays ?? ""}
                              onChange={handleChange}
                              className="form-control"
                            />
                            <span className="input-group-text">Days</span>
                          </div>
                        </div>

                      </div>

                      <div className="dpr-working-capital-summary mt-3">
                        <div>
                          <small className="text-muted d-block">
                            DPR Working Capital
                          </small>
                          <strong>{money(project.workingCapital)}</strong>
                        </div>

                        <div className="text-md-end">
                          <small className="text-muted d-block">
                            Capital Cost Statement
                          </small>
                          <strong>
                            Working Capital Margin:{" "}
                            {money(project.workingCapitalMargin)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.requiresWorkingCapital === false && (
                    <div className="alert alert-success py-2 mb-0">
                      <i className="bi bi-check-circle me-2" />
                      Working Capital is marked as <strong>Not Required</strong>.
                      The Working Capital Margin is automatically set to ₹0.
                    </div>
                  )}

                  {project.requiresWorkingCapital === null && (
                    <div className="alert alert-warning py-2 mb-0">
                      <i className="bi bi-exclamation-triangle me-2" />
                      <strong>Choose Yes or No.</strong> The DPR cannot be
                      saved, previewed or generated until this decision is
                      completed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL ASSUMPTIONS */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h5 className="fw-bold mb-1">

                  <i className="bi bi-calculator text-primary me-2" />

                  Financial Assumptions

                </h5>

                <small className="text-muted">
                  These values automatically update
                  the DPR financial statements.
                </small>

              </div>

              <span className="badge bg-primary-subtle text-primary px-3 py-2">
                Editable
              </span>

            </div>

            <div className="row g-4">

              {/* PROJECT COST */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Total Project Cost
                </label>

                <div className="input-group input-group-lg">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="projectCost"
                    value={project.projectCost}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                  />

                </div>

                <small className="text-primary fw-semibold">
                  {money(projectCost)}
                </small>

              </div>

              {/* INTEREST */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Term Loan Interest Rate
                </label>

                <div className="input-group input-group-lg">

                  <input
                    type="number"
                    name="interestRate"
                    value={project.interestRate}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                    step="0.1"
                  />

                  <span className="input-group-text">
                    % p.a.
                  </span>

                </div>

              </div>

              {/* CONTRIBUTION */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Promoter Contribution
                </label>

                <div className="input-group input-group-lg">

                  <input
                    type="number"
                    name="promoterContributionPercent"
                    value={
                      project.promoterContributionPercent
                    }
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                    max="100"
                    step="0.1"
                  />

                  <span className="input-group-text">
                    %
                  </span>

                </div>

                <small className="text-muted">

                  Amount:{" "}

                  <strong>
                    {money(
                      promoterContribution
                    )}
                  </strong>

                </small>

              </div>

              {/* SUBSIDY */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Expected Subsidy
                </label>

                <div className="input-group input-group-lg">

                  <input
                    type="number"
                    name="subsidyPercent"
                    value={
                      project.subsidyPercent
                    }
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                    max="100"
                    step="0.1"
                  />

                  <span className="input-group-text">
                    %
                  </span>

                </div>

                <small className="text-muted">

                  Estimated Amount:{" "}

                  <strong className="text-success">
                    {money(
                      expectedSubsidy
                    )}
                  </strong>

                </small>

              </div>

              {/* TENURE */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Loan Repayment Period
                </label>

                <div className="input-group input-group-lg">

                  <select
                    name="loanTenure"
                    value={project.loanTenure}
                    onChange={handleChange}
                    className="form-select"
                    aria-label="Loan repayment period"
                  >
                    {Array.from(
                      { length: 15 },
                      (_, index) => index + 1
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year} {year === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>

                  <span className="input-group-text">
                    Repayment Tenure
                  </span>

                </div>

                <small className="text-primary fw-semibold">
                  Select any repayment period from 1 to 15 years.
                  The DPR projections and repayment schedule follow the
                  selected period.
                </small>

              </div>

              {/* MORATORIUM */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Moratorium Period
                </label>

                <div className="input-group input-group-lg">

                  <input
                    type="number"
                    name="moratorium"
                    value={project.moratorium}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                  />

                  <span className="input-group-text">
                    Months
                  </span>

                </div>

              </div>

            </div>

            <div className="alert alert-warning border-0 rounded-3 mt-4 mb-0">

              <i className="bi bi-info-circle me-2" />

              <strong>
                Subsidy assumption:
              </strong>{" "}

              The subsidy shown here is an estimated
              DPR assumption. Final eligibility,
              eligible project cost, subsidy rate and
              maximum subsidy must be verified against
              the applicable government scheme.

            </div>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="row g-3">

          {[
            {
              label: "Project Cost",
              value: projectCost,
              className: "text-primary",
            },

            {
              label:
                `Promoter Contribution (${project.promoterContributionPercent}%)`,
              value: promoterContribution,
              className: "text-dark",
            },

            {
              label: "Estimated Term Loan",
              value: estimatedTermLoan,
              className: "text-primary",
            },

            {
              label:
                `Expected Subsidy (${project.subsidyPercent}%)`,
              value: expectedSubsidy,
              className: "text-success",
            },
          ].map((item) => (

            <div
              className="col-md-6 col-xl-3"
              key={item.label}
            >

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <small className="text-muted">
                    {item.label}
                  </small>

                  <h4
                    className={`fw-bold mt-2 mb-0 ${item.className}`}
                  >
                    {money(item.value)}
                  </h4>

                </div>

              </div>

            </div>

          ))}

        </div>
      </>
    );
  };

  // ====================================================
  // CAPITAL COST
  // ====================================================

  const CapitalCost = () => (
    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-body p-4">

        <h3 className="fw-bold">
          Capital Cost Statement
        </h3>

        <p className="text-muted mb-4">
          Enter the proposed fixed asset and
          project establishment costs.
        </p>

        <div className="table-responsive">

          <table className="table align-middle">

            <thead className="table-light">

              <tr>

                <th>
                  Particulars
                </th>

                <th style={{ width: 280 }}>
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {capitalCostItems.map(
                (item) => (

                  <tr key={item.name}>

                    <td className="fw-semibold">
                      {item.label}
                    </td>

                    <td>

                      <div className="input-group">

                        <span className="input-group-text">
                          ₹
                        </span>

                        <input
                          type="number"
                          name={item.name}
                          value={
                            project[
                              item.name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          className="form-control"
                        />

                      </div>

                    </td>

                  </tr>

                )
              )}

              <tr className="table-primary">

                <th>
                  Total Capital Cost
                </th>

                <th>
                  {money(
                    totalCapitalCost
                  )}
                </th>

              </tr>

            </tbody>

          </table>

        </div>

        <div
          className={`alert ${
            isCapitalCostReconciled
              ? "alert-success"
              : "alert-warning"
          } mt-3 mb-0`}
        >
          <div className="d-flex justify-content-between mb-2">
            <span>Total Project Cost</span>
            <strong>{money(projectCost)}</strong>
          </div>

          <div className="d-flex justify-content-between mb-2">
            <span>Total Capital Cost Components</span>
            <strong>{money(totalCapitalCost)}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between mb-2">
            <strong>Reconciliation Difference</strong>
            <strong>{money(Math.abs(capitalCostDifference))}</strong>
          </div>

          {isCapitalCostReconciled ? (
            <div className="fw-semibold text-success">
              <i className="bi bi-check-circle-fill me-2" />
              Capital Cost Reconciled
            </div>
          ) : capitalCostDifference > 0 ? (
            <div className="fw-semibold">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              {money(capitalCostDifference)} is still unallocated. Please
              complete the project cost breakup.
            </div>
          ) : (
            <div className="fw-semibold text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              Capital cost exceeds Total Project Cost by{" "}
              {money(Math.abs(capitalCostDifference))}.
            </div>
          )}
        </div>

      </div>

    </div>
  );

  // ====================================================
  // RENDER SECTION
  // ====================================================

  const renderSection = () => {
    switch (activeSection) {
      case "glance":
        return ProjectAtGlance ();

      case "capital":
        return CapitalCost () ;

      case "dscr":
        return (
          <>
            <div className="row g-3 mb-4">

              <div className="col-md-4">

                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4">

                    <small className="text-muted">
                      Average DSCR
                    </small>

                    <h2 className="fw-bold text-primary mb-0">
                      {calculations.averageDSCR.toFixed(
                        2
                      )}
                    </h2>

                  </div>

                </div>

                <div className="mt-3 px-1">
                  <div
                    className="d-flex align-items-start gap-2 rounded-3 p-3"
                    style={{
                      background: "linear-gradient(135deg,#f8fbff,#eef6ff)",
                      border: "1px solid #dbeafe",
                    }}
                  >
                    <i
                      className="bi bi-shield-check text-success fs-5"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="fw-bold text-dark">
                        Premium DPR — ₹999
                      </div>
                      <small className="text-muted">
                        AI-powered DPR generation, financial analysis and
                        bank-ready report preparation. Preview DPR remains
                        available without payment.
                      </small>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <FinancialTable
              title="DSCR Statement"
              subtitle="Projected debt servicing capacity based on the current assumptions."
              rows={[
                {
                  label:
                    "Profit After Tax",
                  key:
                    "profitAfterTax",
                },

                {
                  label:
                    "Depreciation",
                  key:
                    "depreciation",
                },

                {
                  label:
                    "Interest on Term Loan",
                  key: "interest",
                },

                {
                  label:
                    "Principal Repayment",
                  key: "repayment",
                },

                {
                  label:
                    "Total Debt Service",
                  key: "debtService",
                },

                {
                  label: "DSCR",
                  key: "dscr",
                  format: "number",
                },
              ]}
            />
          </>
        );

      case "income":
        return (
          <FinancialTable
            title="Projected Income Statement"
            subtitle="Edit Sales / Operating Revenue for any year. Save Changes recalculates EBITDA, PBT, PAT, DSCR, Balance Sheet and Cash Flow."
            editable
            rows={[
              {
                label:
                  "Sales / Operating Revenue",
                key: "sales",
              },

              {
                label: "EBITDA",
                key: "ebitda",
              },

              {
                label:
                  "Profit Before Tax",
                key:
                  "profitBeforeTax",
              },

              {
                label:
                  "Profit After Tax",
                key:
                  "profitAfterTax",
              },
            ]}
          />
        );

      case "expenditure":
        return (
          <FinancialTable
            title="Projected Expenditure Statement"
            subtitle="Edit any operating expense for any year. Save Changes recalculates Total Operating Expenses and all dependent financial statements."
            editable
            rows={[
              {
                label:
                  "Raw Material / Direct Cost",
                key: "rawMaterial",
              },

              {
                label:
                  "Salaries & Wages",
                key: "salaries",
              },

              {
                label:
                  "Power & Utilities",
                key: "power",
              },

              {
                label:
                  "Administrative Expenses",
                key: "admin",
              },

              {
                label:
                  "Marketing Expenses",
                key: "marketing",
              },

              {
                label:
                  "Other Expenses",
                key:
                  "otherExpenses",
              },

              {
                label:
                  "Total Operating Expenses",
                key:
                  "operatingExpenses",
              },
            ]}
          />
        );

      case "profit":
        return (
          <FinancialTable
            title="Projected Profit & Loss Account"
            rows={[
              {
                label:
                  "Sales / Revenue",
                key: "sales",
              },

              {
                label:
                  "Operating Expenses",
                key:
                  "operatingExpenses",
              },

              {
                label: "EBITDA",
                key: "ebitda",
              },

              {
                label:
                  "Depreciation",
                key:
                  "depreciation",
              },

              {
                label:
                  "Interest",
                key: "interest",
              },

              {
                label:
                  "Profit Before Tax",
                key:
                  "profitBeforeTax",
              },

              {
                label:
                  "Estimated Tax",
                key:
                  "estimatedTax",
              },

              {
                label:
                  "Profit After Tax",
                key:
                  "profitAfterTax",
              },
            ]}
          />
        );

      case "balance":
        return (
          <>
            <FinancialTable
              title="Projected Balance Sheet"
              subtitle="Indicative projected balance sheet based on the current DPR assumptions."
              rows={[
                {
                  label:
                    "Net Fixed Assets",
                  key:
                    "netFixedAssets",
                },

                {
                  label:
                    "Current Assets",
                  key:
                    "currentAssets",
                },

                {
                  label:
                    "Total Assets",
                  key:
                    "totalAssets",
                },

                {
                  label:
                    "Outstanding Term Loan",
                  key:
                    "closingLoan",
                },

                {
                  label:
                    "Current Liabilities",
                  key:
                    "currentLiabilities",
                },

                {
                  label:
                    "Indicative Net Worth",
                  key: "netWorth",
                },
              ]}
            />

            <div className="alert alert-info mt-3">
              The balance sheet is currently an
              indicative DPR projection. A final
              bank-ready balance sheet should also
              incorporate detailed working capital,
              receivables, inventory, creditors,
              cash/bank balances, reserves and other
              liabilities.
            </div>
          </>
        );

      case "cashflow":
        return (
          <FinancialTable
            title="Projected Cash Flow Statement"
            rows={[
              {
                label:
                  "Profit After Tax",
                key:
                  "profitAfterTax",
              },

              {
                label:
                  "Depreciation",
                key:
                  "depreciation",
              },

              {
                label:
                  "Operating Cash Accrual",
                key:
                  "operatingCashFlow",
              },

              {
                label:
                  "Principal Repayment",
                key:
                  "repayment",
              },

              {
                label:
                  "Financing Cash Flow",
                key:
                  "financingCashFlow",
              },

              {
                label:
                  "Net Cash Flow",
                key:
                  "netCashFlow",
              },
            ]}
          />
        );

      case "repayment":
        return (
          <FinancialTable
            title="Term Loan Repayment Schedule"
            subtitle={`Estimated term loan: ${money(
              estimatedTermLoan
            )} | Interest: ${
              project.interestRate
            }% p.a. | Tenure: ${
              project.loanTenure
            } years`}
            rows={[
              {
                label:
                  "Opening Loan Balance",
                key:
                  "openingLoan",
              },

              {
                label:
                  "Interest",
                key: "interest",
              },

              {
                label:
                  "Principal Repayment",
                key:
                  "repayment",
              },

              {
                label:
                  "Total Debt Service",
                key:
                  "debtService",
              },

              {
                label:
                  "Closing Loan Balance",
                key:
                  "closingLoan",
              },
            ]}
          />
        );

      case "depreciation":
        return (
          <FinancialTable
            title="Depreciation Statement"
            subtitle={`Indicative depreciation calculated at ${project.depreciationRate}% on written-down value.`}
            rows={[
              {
                label:
                  "Opening Written Down Value",
                key:
                  "openingWDV",
              },

              {
                label:
                  "Depreciation",
                key:
                  "depreciation",
              },

              {
                label:
                  "Closing Written Down Value",
                key:
                  "closingWDV",
              },
            ]}
          />
        );

      default:
        return ProjectAtGlance ();
    }
  };

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="dpr-modern-page">
      <style>{`
        .dpr-modern-page{--blue:#0868ee;--dark:#062b4d;--orange:#ff7800;--green:#079b6f;--text:#092d4c;min-height:100vh;color:var(--text);background:radial-gradient(circle at 4% 3%,rgba(8,104,238,.10),transparent 25%),radial-gradient(circle at 96% 8%,rgba(0,176,135,.10),transparent 25%),linear-gradient(180deg,#f5f9fd,#eef6fb 45%,#f8fbfe);padding-bottom:70px;overflow-x:hidden}
        .dpr-shell{width:min(1440px,calc(100% - 34px));margin:auto}
        .dpr-hero{position:relative;overflow:hidden;padding:34px 0 32px;color:#fff;background:radial-gradient(circle at 82% 10%,rgba(72,225,194,.18),transparent 26%),linear-gradient(135deg,#062a4a,#0755a4 58%,#0879ee)}
        .dpr-hero:before,.dpr-hero:after{content:"";position:absolute;border:1px solid rgba(255,255,255,.10);border-radius:50%;pointer-events:none}.dpr-hero:before{width:420px;height:420px;right:-160px;top:-250px}.dpr-hero:after{width:280px;height:280px;left:-160px;bottom:-220px}
        .dpr-hero-inner{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:center}
        .dpr-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(255,255,255,.08);color:#aeeedc;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}.dpr-eyebrow-dot{width:8px;height:8px;border-radius:50%;background:#3ee2bd;box-shadow:0 0 0 4px rgba(62,226,189,.12)}
        .dpr-hero h1{margin:13px 0 7px;font-size:clamp(34px,4.2vw,58px);line-height:1;letter-spacing:-.045em;font-weight:900}.dpr-hero h1 span{background:linear-gradient(90deg,#ff9a21,#ffc04a);-webkit-background-clip:text;background-clip:text;color:transparent}
        .dpr-hero p{max-width:760px;margin:0;color:#c4dbed;font-size:14px;line-height:1.7}.dpr-hero-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}
        .dpr-hero-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 17px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);color:#fff;font-size:12px;font-weight:800;transition:.2s ease}.dpr-hero-btn:hover{color:#fff;background:rgba(255,255,255,.17);transform:translateY(-1px)}.dpr-hero-btn.primary{border-color:#ff9a21;background:linear-gradient(135deg,#ff9a21,#ff7200);box-shadow:0 12px 26px rgba(255,115,0,.20)}
        .dpr-kpis{margin-top:24px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.dpr-kpi{padding:15px 16px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.075);backdrop-filter:blur(8px)}.dpr-kpi small{display:block;color:#9fc0d8;font-size:10px;font-weight:700;margin-bottom:4px}.dpr-kpi strong{display:block;color:#fff;font-size:18px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .dpr-body{padding-top:26px}.dpr-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:22px;align-items:start}
        .dpr-sidebar{position:sticky;top:88px;border:1px solid #dbe8f2;border-radius:22px;background:rgba(255,255,255,.94);box-shadow:0 20px 55px rgba(21,67,104,.10);overflow:hidden}.dpr-sidebar-head{padding:20px 20px 13px;border-bottom:1px solid #edf2f6}.dpr-sidebar-head small{color:#8aa0b2;font-size:10px;font-weight:900;letter-spacing:.08em}.dpr-sidebar-head strong{display:block;margin-top:4px;font-size:16px}
        .dpr-nav{padding:11px}.dpr-nav button{width:100%;display:flex;align-items:center;gap:11px;margin:3px 0;padding:11px 12px;border:1px solid transparent;border-radius:12px;background:transparent;color:#5f7b92;text-align:left;font-size:11px;font-weight:800;transition:.18s ease}.dpr-nav button i{width:28px;height:28px;display:grid;place-items:center;border-radius:8px;background:#eef5fb;color:#55748d;font-size:13px;flex:0 0 28px}.dpr-nav button:hover{background:#f4f8fc;color:#123d60}.dpr-nav button.active{border-color:#b8d7fb;background:linear-gradient(135deg,#eef7ff,#f8fbff);color:#0668e9;box-shadow:0 8px 20px rgba(8,104,238,.08)}.dpr-nav button.active i{background:#0868ee;color:#fff;box-shadow:0 7px 15px rgba(8,104,238,.20)}
        .dpr-sidebar-tip{margin:12px;padding:14px;border:1px solid #d8efe8;border-radius:14px;background:#f2fbf8}.dpr-sidebar-tip strong{display:block;color:#08795e;font-size:11px;margin-bottom:4px}.dpr-sidebar-tip p{margin:0;color:#648477;font-size:10px;line-height:1.55}
        .dpr-content{min-width:0}.dpr-content .card.border-0.shadow-sm.rounded-4{border:1px solid #dce8f1!important;border-radius:22px!important;background:rgba(255,255,255,.96);box-shadow:0 18px 55px rgba(21,67,104,.075)!important}.dpr-content .card-body{padding:28px!important}.dpr-content h2,.dpr-content h3,.dpr-content h5{color:#092d4c;letter-spacing:-.025em}
        .dpr-content .form-control,.dpr-content .form-select{min-height:47px;border-color:#d7e5ef;border-radius:11px;background:#fbfdff;color:#123b5d;box-shadow:none}.dpr-content .form-control:focus,.dpr-content .form-select:focus{border-color:#6aaef8;box-shadow:0 0 0 4px rgba(8,104,238,.09);background:#fff}.dpr-content .input-group-text{border-color:#d7e5ef;background:#f1f7fb;color:#56748c;font-weight:800}
        .dpr-content .table-responsive{border:1px solid #e2ebf2;border-radius:15px;overflow:auto}.dpr-content .table{margin-bottom:0;min-width:760px;font-size:12px}.dpr-content .table>:not(caption)>*>*{padding:13px 12px;border-color:#edf2f6}.dpr-content .table thead th{color:#58748c;background:#f5f9fc;font-size:10px;text-transform:uppercase;letter-spacing:.035em;white-space:nowrap}.dpr-content .table tbody th{color:#264e6d;font-weight:800}
        .dpr-reconcile{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}.dpr-mini-card{padding:16px;border:1px solid #e0eaf2;border-radius:15px;background:#f9fcff}.dpr-mini-card small{display:block;color:#7892a7;font-size:10px;font-weight:700;margin-bottom:5px}.dpr-mini-card strong{display:block;color:#173e60;font-size:17px;font-weight:900}.dpr-mini-card.success{border-color:#c9ece2;background:#f2fbf8}.dpr-mini-card.success strong{color:#078160}
        .dpr-actionbar{position:sticky;bottom:14px;z-index:20;margin-top:22px;padding:13px;border:1px solid #d7e5ef;border-radius:18px;background:rgba(255,255,255,.93);backdrop-filter:blur(14px);box-shadow:0 18px 45px rgba(15,58,91,.15)}.dpr-actionbar-inner{display:flex;align-items:center;justify-content:space-between;gap:12px}.dpr-actionbar-copy strong{display:block;color:#173e60;font-size:12px}.dpr-actionbar-copy small{color:#8298aa;font-size:10px}.dpr-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}.dpr-action-btn{min-height:44px;border-radius:11px!important;padding:0 16px!important;font-size:11px!important;font-weight:900!important}.dpr-premium-btn{border:0!important;background:linear-gradient(135deg,#0875ef,#2457dc)!important;box-shadow:0 10px 22px rgba(8,104,238,.22)!important}.dpr-premium-price{margin-left:6px;padding:4px 7px;border-radius:999px;background:#ffbe35;color:#4f3000;font-size:9px;font-weight:900}
        .dpr-progress-overlay{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(3,24,42,.58);backdrop-filter:blur(9px)}.dpr-progress-card{width:min(520px,100%);padding:28px;border:1px solid rgba(255,255,255,.20);border-radius:24px;background:rgba(255,255,255,.97);box-shadow:0 30px 90px rgba(0,0,0,.25);text-align:center}.dpr-progress-icon{width:62px;height:62px;display:grid;place-items:center;margin:0 auto 15px;border-radius:18px;background:linear-gradient(135deg,#0868ee,#3b57e8);color:#fff;font-size:25px;box-shadow:0 14px 30px rgba(8,104,238,.22)}.dpr-progress-card h3{margin:0 0 6px;color:#092d4c;font-size:22px;font-weight:900}.dpr-progress-card p{margin:0 0 18px;color:#71899d;font-size:12px}.dpr-progress{height:10px;overflow:hidden;border-radius:999px;background:#e9f0f5}.dpr-progress>span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#0868ee,#12b98c);transition:width .3s ease}.dpr-progress-meta{display:flex;justify-content:space-between;margin-top:8px;color:#7b91a4;font-size:10px;font-weight:800}
        @keyframes dprWorkingCapitalBlink{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.76;transform:translateY(-1px)}}.dpr-working-capital-alert{animation:dprWorkingCapitalBlink 2.2s ease-in-out infinite}.dpr-working-capital-alert .card{border:2px solid #ffc107!important;background:linear-gradient(135deg,#fffdf3,#fff)}.dpr-working-capital-icon{width:50px;height:50px;min-width:50px;display:grid;place-items:center;border-radius:15px;background:#fff3cd;color:#9a6700;font-size:22px}.dpr-working-capital-choice{display:inline-flex;align-items:center;gap:10px;padding:12px 16px;border:1px solid #d7e5ef;border-radius:12px;background:#fff;cursor:pointer;font-weight:800;color:#31516b;transition:.18s ease}.dpr-working-capital-choice:hover{border-color:#0868ee;box-shadow:0 7px 18px rgba(8,104,238,.08)}.dpr-working-capital-choice input{width:18px;height:18px;accent-color:#0868ee}.dpr-working-capital-choice.selected.yes{border-color:#079b6f;background:#f1fbf7;color:#08795e}.dpr-working-capital-choice.selected.no{border-color:#8da1b1;background:#f7f9fb;color:#526d82}.dpr-working-capital-details{padding:17px;border:1px solid #dce8f1;border-radius:15px;background:#f8fbfe}.dpr-working-capital-summary{display:flex;justify-content:space-between;gap:18px;padding:13px 15px;border:1px solid #d9e9f5;border-radius:12px;background:#fff}.dpr-working-capital-summary strong{color:#0868ee;font-size:16px}
        .dpr-financial-input{min-width:145px}.dpr-financial-input .input-group-text{min-width:34px;justify-content:center}.dpr-financial-input input{font-weight:700!important;color:#07558b!important}.dpr-financial-input input::-webkit-outer-spin-button,.dpr-financial-input input::-webkit-inner-spin-button{margin:0}.dpr-financial-input input:focus{position:relative;z-index:2}
        @media(max-width:1100px){.dpr-layout{grid-template-columns:1fr}.dpr-sidebar{position:relative;top:auto}.dpr-nav{display:flex;gap:6px;overflow:auto}.dpr-nav button{min-width:180px;margin:0}.dpr-sidebar-tip{display:none}}
        @media(max-width:760px){.dpr-shell{width:calc(100% - 18px)}.dpr-hero{padding:25px 0}.dpr-hero-inner{grid-template-columns:1fr}.dpr-hero-actions{justify-content:flex-start}.dpr-kpis{grid-template-columns:repeat(2,1fr)}.dpr-layout{gap:14px}.dpr-content .card-body{padding:19px!important}.dpr-reconcile{grid-template-columns:1fr}.dpr-actionbar-inner{flex-direction:column;align-items:stretch}.dpr-actions{justify-content:stretch}.dpr-action-btn{flex:1}}
        @media(max-width:480px){.dpr-kpis{grid-template-columns:1fr}.dpr-hero h1{font-size:37px}.dpr-hero-actions{display:grid;grid-template-columns:1fr}.dpr-hero-btn{justify-content:center}.dpr-nav button{min-width:165px}.dpr-actions{display:grid;grid-template-columns:1fr}.dpr-action-btn{width:100%}}
      `}</style>

      <section className="dpr-hero">
        <div className="dpr-shell">
          <div className="dpr-hero-inner">
            <div>
              <div className="dpr-eyebrow"><span className="dpr-eyebrow-dot" />GoSubsidy Financial Intelligence</div>
              <h1>Detailed Project <span>Report</span></h1>
              <p>Build, validate, preview and generate a structured DPR from your project assumptions, capital cost, profitability, DSCR, repayment and cash-flow projections.</p>
            </div>
            <div className="dpr-hero-actions">
              <button type="button" className="dpr-hero-btn" onClick={() => navigate("/")}><i className="bi bi-house" /> Home</button>
              <button type="button" className="dpr-hero-btn primary" onClick={handlePremiumDPR} disabled={isGeneratingDPR || project.requiresWorkingCapital === null || (project.requiresWorkingCapital === true && Number(project.workingCapital || 0) <= 0)}><i className="bi bi-stars" /> Generate Premium DPR</button>
            </div>
          </div>

          <div className="dpr-kpis">
            <div className="dpr-kpi"><small>PROJECT COST</small><strong>{money(projectCost)}</strong></div>
            <div className="dpr-kpi"><small>ESTIMATED TERM LOAN</small><strong>{money(estimatedTermLoan)}</strong></div>
            <div className="dpr-kpi"><small>EXPECTED SUBSIDY</small><strong>{money(expectedSubsidy)}</strong></div>
            <div className="dpr-kpi"><small>AVERAGE DSCR</small><strong>{calculations.averageDSCR.toFixed(2)}</strong></div>
          </div>
        </div>
      </section>

      <main className="dpr-shell dpr-body">
        <div className="dpr-layout">
          <aside className="dpr-sidebar">
            <div className="dpr-sidebar-head"><small>DPR WORKSPACE</small><strong>Report Sections</strong></div>
            <nav className="dpr-nav" aria-label="DPR sections">
              {sections.map((section) => (
                <button key={section.id} type="button" className={activeSection === section.id ? "active" : ""} onClick={() => setActiveSection(section.id)}>
                  <i className={`bi ${section.icon}`} /><span>{section.label}</span>
                </button>
              ))}
            </nav>
            <div className="dpr-sidebar-tip">
              <strong><i className="bi bi-shield-check me-1" />Bank-ready workflow</strong>
              <p>Complete the project and capital-cost sections first. Reconcile the project cost before generating the Premium DPR.</p>
            </div>
          </aside>

          <section className="dpr-content">
            <div className="dpr-reconcile">
              <div className="dpr-mini-card">
                <small>PROJECT / PROMOTER</small>
                <strong>{project.projectName || "Project not named"}</strong>
                <span className="text-muted small">{project.promoterName || "Promoter details pending"}</span>
              </div>
              <div className={`dpr-mini-card ${isCapitalCostReconciled ? "success" : ""}`}>
                <small>CAPITAL COST STATUS</small>
                <strong>{isCapitalCostReconciled ? "Reconciled ✓" : "Action required"}</strong>
                <span className="text-muted small">Difference: {money(Math.abs(capitalCostDifference))}</span>
              </div>
              <div className={`dpr-mini-card ${
                project.requiresWorkingCapital !== null ? "success" : ""
              }`}>
                <small>WORKING CAPITAL</small>
                <strong>
                  {project.requiresWorkingCapital === null
                    ? "Selection pending"
                    : project.requiresWorkingCapital
                      ? money(project.workingCapital)
                      : "Not Required"}
                </strong>
                <span className="text-muted small">
                  {project.requiresWorkingCapital
                    ? (project.workingCapitalPurpose || "Purpose pending")
                    : project.requiresWorkingCapital === false
                      ? "Margin set to ₹0"
                      : "Choose Yes or No"}
                </span>
              </div>
            </div>

            {renderSection()}

            <div className="dpr-actionbar">
              <div className="dpr-actionbar-inner">
                <div className="dpr-actionbar-copy">
                  <strong>{isCapitalCostReconciled ? "✓ Project cost is reconciled" : "Complete capital cost reconciliation before Premium DPR"}</strong>
                  <small>
                    {project.requiresWorkingCapital === null
                      ? "Select Working Capital: Yes or No before submitting the project."
                      : "Save your work, preview the current report, or generate the Premium DPR after reconciliation."}
                  </small>
                </div>
                <div className="dpr-actions">
                  <button type="button" className="btn btn-outline-primary dpr-action-btn" onClick={handleSaveProject}><i className="bi bi-floppy me-2" /> Save Project</button>
                  <button type="button" className="btn btn-outline-dark dpr-action-btn" onClick={handlePreviewDPR}><i className="bi bi-eye me-2" /> Preview DPR</button>
                  <button type="button" className="btn btn-primary dpr-action-btn dpr-premium-btn" onClick={handlePremiumDPR} disabled={isGeneratingDPR || project.requiresWorkingCapital === null || (project.requiresWorkingCapital === true && Number(project.workingCapital || 0) <= 0)}>
                    {isGeneratingDPR ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Generating... {dprProgress}%</>
                    ) : (
                      <><i className="bi bi-stars me-2" /> Premium DPR <span className="dpr-premium-price">₹999</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {isGeneratingDPR && (
        <div className="dpr-progress-overlay">
          <div className="dpr-progress-card">
            <div className="dpr-progress-icon"><i className="bi bi-stars" /></div>
            <h3>Preparing Your Premium DPR</h3>
            <p>GoSubsidy AI is processing the project assumptions, financial projections and bank-ready report structure.</p>
            <div className="dpr-progress"><span style={{ width: `${dprProgress}%` }} /></div>
            <div className="dpr-progress-meta"><span>{dprStatus || "Preparing..."}</span><strong>{dprProgress}%</strong></div>
          </div>
        </div>
      )}

      {showDPRPayment && (
        <PaymentModal
          product={PREMIUM_PRODUCTS?.DPR_PRO || { code: "DPR_PRO", name: "Premium DPR", price: 999 }}
          onClose={() => setShowDPRPayment(false)}
          onSuccess={() => {
            console.log("✅ Premium DPR payment successful — starting AI generation.");
            setShowDPRPayment(false);
            handleGenerateAIDPR();
          }}
        />
      )}
    </div>
  );
}