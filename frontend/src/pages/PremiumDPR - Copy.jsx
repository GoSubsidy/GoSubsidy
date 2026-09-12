import React, { useEffect, useMemo, useState } from "react";
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

  const defaultProject = {
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
  };

  const [project, setProject] = useState(() => {
    try {
      const raw = localStorage.getItem("gosubsidy_dpr_project");
      const saved = raw ? JSON.parse(raw) : null;

      if (saved?.project && typeof saved.project === "object") {
        return {
          ...defaultProject,
          ...saved.project,
        };
      }
    } catch (error) {
      console.warn("Unable to restore saved DPR project:", error);
    }

    return defaultProject;
  });

  const [activeSection, setActiveSection] =
    useState("glance");

  // ====================================================
  // USER EDITABLE FINANCIAL OVERRIDES — 1 TO 15 YEARS
  // ====================================================

  const [financialOverrides, setFinancialOverrides] = useState(() => {
    try {
      const raw = localStorage.getItem("gosubsidy_dpr_project");
      const saved = raw ? JSON.parse(raw) : null;

      return saved?.financialOverrides &&
        typeof saved.financialOverrides === "object"
        ? saved.financialOverrides
        : {};
    } catch (error) {
      console.warn("Unable to restore DPR financial overrides:", error);
      return {};
    }
  });
  const [financialEditMode, setFinancialEditMode] = useState(false);
  const [financialDrafts, setFinancialDrafts] = useState({});
  // Only cells the user actually edits are saved as overrides.
  // This is critical so calculated years remain linked to the previous year through the selected tenure.
  const [financialDirty, setFinancialDirty] = useState({});

  // Tracks the last applied capital-cost total so saved financial overrides are
  // preserved on initial load but cleared whenever the user changes capital cost.
  const previousCapitalCostRef = React.useRef(null);

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
  // CAPITAL COST — AUTHORITATIVE PROJECT COST SOURCE
  // ====================================================
  // Fixed Assets & Project Cost is the single source of truth for the
  // financial model. Any capital-cost change immediately recalculates the
  // financing structure and all dependent projections.

  const capitalCostItems = [
    { label: "Land / Site Development", name: "land" },
    { label: "Building / Civil Works", name: "building" },
    { label: "Plant & Machinery", name: "plantMachinery" },
    { label: "Electrical Installation", name: "electrical" },
    { label: "Furniture & Equipment", name: "furniture" },
    { label: "Preliminary & Pre-operative Expenses", name: "preliminary" },
    { label: "Contingency", name: "contingency" },
    { label: "Working Capital Margin", name: "workingCapitalMargin" },
    { label: "Other Fixed Assets / Miscellaneous Project Cost", name: "otherFixedAssets" },
  ];

  const totalCapitalCost = capitalCostItems.reduce(
    (total, item) => total + (Number(project[item.name]) || 0),
    0
  );

  // TOTAL PROJECT COST IS ALWAYS THE LIVE CAPITAL-COST TOTAL.
  // There is intentionally NO fallback to the old stored projectCost value.
  // Even if every capital component is reduced to 0, Total Project Cost becomes
  // 0 and every dependent financial calculation follows that value immediately.
  const projectCost = totalCapitalCost;

  // ====================================================
  // BASIC FINANCE CALCULATIONS — FROM LIVE CAPITAL COST
  // ====================================================

  const promoterContribution =
    projectCost *
    ((Number(project.promoterContributionPercent) || 0) / 100);

  const expectedSubsidy =
    projectCost *
    ((Number(project.subsidyPercent) || 0) / 100);

  const estimatedTermLoan = Math.max(
    0,
    projectCost - promoterContribution - expectedSubsidy
  );

  const capitalCostDifference = projectCost - totalCapitalCost;
  const isCapitalCostReconciled = Math.abs(capitalCostDifference) <= 1;

  // ====================================================
  // CAPITAL CHANGE PROPAGATION
  // ====================================================
  // Do not allow financial statement overrides calculated against an older
  // capital structure to survive a Fixed Assets change. The calculation
  // engine below then rebuilds loan, depreciation, interest, P&L, DSCR,
  // balance sheet and cash flow from the new live capital-cost total.
  useEffect(() => {
    const previousCapitalCost = previousCapitalCostRef.current;

    // Keep the persisted project object synchronized with the live breakup.
    // The calculation engine itself uses `projectCost` derived directly from
    // totalCapitalCost, so downstream statements update immediately.
    if (Math.abs((Number(project.projectCost) || 0) - totalCapitalCost) > 0.001) {
      setProject((prev) => ({
        ...prev,
        projectCost: totalCapitalCost,
      }));
    }

    // Preserve saved overrides on initial load. Clear them only after the user
    // actually changes Fixed Assets / Capital Cost, so stale financial figures
    // cannot survive a capital-structure change.
    if (
      previousCapitalCost !== null &&
      Math.abs(previousCapitalCost - totalCapitalCost) > 0.001
    ) {
      setFinancialOverrides((prev) =>
        Object.keys(prev || {}).length ? {} : prev
      );
      setFinancialDrafts({});
      setFinancialDirty({});
    }

    previousCapitalCostRef.current = totalCapitalCost;
  }, [totalCapitalCost, project.projectCost]);

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

    // ==================================================
    // AUTHORITATIVE LOAN CALCULATOR VALUES
    // ==================================================
    // These values are produced by the GoSubsidy calculation engine and
    // passed to PremiumDPRPreview. The preview renderer only displays them.
    const calculatorInterestRate =
      (Number(project.interestRate) || 0) / 100 / 12;

    const calculatorLoanMonths = Math.max(
      1,
      (Number(project.loanTenure) || 0) * 12
    );

    const monthlyEMI =
      calculatorInterestRate > 0
        ? estimatedTermLoan *
          calculatorInterestRate *
          Math.pow(
            1 + calculatorInterestRate,
            calculatorLoanMonths
          ) /
          (
            Math.pow(
              1 + calculatorInterestRate,
              calculatorLoanMonths
            ) - 1
          )
        : estimatedTermLoan / calculatorLoanMonths;

    const totalInterest = Math.max(
      0,
      monthlyEMI * calculatorLoanMonths -
        estimatedTermLoan
    );

    return {
      years,
      averageDSCR,
      monthlyEMI,
      totalInterest,
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
    // Always validate the authoritative live capital-cost total.
    const cost = Number(projectCost) || 0;

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

  const buildDPRPayload = () => {
    // Never allow stale project.projectCost from localStorage to reach
    // Preview/AI. The Fixed Assets & Capital Cost breakup is authoritative.
    const authoritativeProject = {
      ...project,
      projectCost,
    };

    return {
    project: authoritativeProject,
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
      };
  };
  // ====================================================
  // AUTO-SAVE DPR WORKSPACE STATE
  // ====================================================
  // Persist the latest form values and financial overrides so returning to
  // /dpr after Preview DPR does not reset the user's work.
  // This stores the current authoritative calculation payload; it does not
  // recreate or replace any financial calculation logic.
  useEffect(() => {
    try {
      localStorage.setItem(
        "gosubsidy_dpr_project",
        JSON.stringify(buildDPRPayload())
      );
    } catch (error) {
      console.warn("Unable to auto-save DPR workspace:", error);
    }
  }, [project, financialOverrides, projectionYears, calculations]);

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

  // ====================================================
  // PREVIEW DPR — SINGLE AUTHORITATIVE RENDERER
  // ====================================================
  // IMPORTANT:
  // The Premium DPR workspace is responsible for data, calculations
  // and AI generation only. The final report is rendered exclusively
  // by /dpr-preview (PremiumDPRPreview.jsx / DPRPreview.jsx).
  // Do NOT use window.open(), document.write(), or a second HTML DPR
  // engine here. This prevents Preview DPR and Premium DPR from
  // producing different documents.
  const handlePreviewDPR = () => {
    const validationError = validateProject();

    if (validationError) {
      alert(validationError);
      return;
    }

    const payload = buildDPRPayload();

    // Store the exact authoritative payload used by the preview.
    localStorage.setItem(
      "gosubsidy_dpr_preview",
      JSON.stringify(payload)
    );

    // Open key-point Preview DPR in a NEW TAB.
    // The current /dpr workspace remains mounted, and the saved payload
    // also guarantees recovery after refresh/navigation.
    window.open(
      "/dpr-preview?mode=keypoints",
      "_blank",
      "noopener,noreferrer"
    );
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

    // AI generation is the PREMIUM DPR flow. Open the full bank-ready
    // renderer explicitly in premium mode. Plain /dpr-preview is reserved
    // for the lightweight key-points preview.
    navigate("/dpr-preview?mode=premium", {
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
                    value={projectCost}
                    readOnly
                    className="form-control bg-light"
                    min="0"
                    aria-label="Total Project Cost calculated from Fixed Assets and Capital Cost"
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
          Enter the proposed fixed asset and project establishment costs.
          <strong className="text-primary d-block mt-1">
            These amounts automatically drive Total Project Cost and all dependent financial statements.
          </strong>
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
            <span>Total Project Cost (from Capital Cost)</span>
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