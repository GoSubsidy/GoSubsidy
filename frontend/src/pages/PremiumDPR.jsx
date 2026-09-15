import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/DPR.css";
import { dprCategories } from '../data/dprCategories';
import { buildIntelligentTemplateUpdates } from '../data/dprTemplateIntelligence';
import PaymentModal from "../components/premium/PaymentModal";
import Footer from "../components/layout/Footer";
import { PREMIUM_PRODUCTS } from "../services/premiumProducts";
import { STATE_LANGUAGE_MAP, FIELD_TRANSLATIONS } from "../utils/bilingualMapping";
import { useLanguage } from "../context/LanguageContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
// ======================================================
// GoSubsidy - Detailed Project Report (Bilingual Support)
// frontend/src/pages/PremiumDPR.jsx
// ======================================================

function EditableFinancialInput({
  value,
  year,
  fieldKey,
  onDraftChange,
}) {
  const [localValue, setLocalValue] = React.useState(
    value === undefined || value === null ? "" : String(value)
  );
  const focusedRef = React.useRef(false);

  React.useEffect(() => {
    if (!focusedRef.current) {
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
    <div className="input-group input-group-sm dpr-financial-input" style={{ minWidth: "135px" }}>
      <span className="input-group-text">₹</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        autoCorrect="off"
        autoCorrect="off"
        spellCheck={false}
        className="form-control text-end fw-bold"
        value={localValue}
        onFocus={(e) => {
          focusedRef.current = true;
          e.currentTarget.select();
        }}
        onChange={(e) => {
          setLocalValue(e.target.value.replace(/[^0-9]/g, ""));
        }}
        onBlur={() => {
          focusedRef.current = false;
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
const DPRFieldContext = React.createContext(null);

function StableNumericInput({
  name,
  value,
  onCommit,
  className = "form-control",
  min,
  max,
  step,
  placeholder,
}) {
  const [localValue, setLocalValue] = React.useState(
    value === undefined || value === null ? "" : String(value)
  );
  const focusedRef = React.useRef(false);

  React.useEffect(() => {
    if (!focusedRef.current) {
      setLocalValue(
        value === undefined || value === null ? "" : String(value)
      );
    }
  }, [value]);

  const commit = () => {
    const raw = String(localValue ?? "").trim();

    if (raw === "") {
      onCommit(name, "");
      return;
    }

    const numeric = Number(raw);

    if (!Number.isFinite(numeric)) {
      setLocalValue(
        value === undefined || value === null ? "" : String(value)
      );
      return;
    }

    onCommit(name, numeric);
  };

  return (
    <input
      type="text"
      inputMode={step && String(step).includes(".") ? "decimal" : "numeric"}
      autoComplete="off"
      spellCheck="false"
      name={name}
      value={localValue}
      onFocus={(e) => {
        focusedRef.current = true;
        e.currentTarget.select();
      }}
      onChange={(e) => {
        const cleaned = e.target.value
          .replace(/[^0-9.]/g, "")
          .replace(/(\..*)\./g, "$1");

        setLocalValue(cleaned);
      }}
      onBlur={() => {
        focusedRef.current = false;
        commit();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={className}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
    />
  );
}

function Field({
  label,
  name,
  type = "text",
  options,
  placeholder,
  required = false,
  min,
  max,
  step,
}) {
  const context = React.useContext(DPRFieldContext);
  const { currentLang } = useLanguage();

  if (!context) {
    return null;
  }

  const { project, handleChange } = context;

  const regionalLabel = FIELD_TRANSLATIONS[name]?.[currentLang];

  const commitNumber = (fieldName, nextValue) => {
    handleChange({
      target: {
        name: fieldName,
        value: nextValue === "" ? "" : String(nextValue),
        type: "number",
      },
    });
  };

  return (
    <div className="col-md-6">
      <label className="gs-field-label">
        <span>{label}</span>
        {regionalLabel && (
          <span className="text-muted ms-2 fw-normal" style={{ fontSize: "11.5px" }}>
            ({regionalLabel})
          </span>
        )}
        {required ? " *" : ""}
      </label>

      {options ? (
        <select
          className="form-select gs-field"
          name={name}
          value={project[name] ?? ""}
          onChange={handleChange}
        >
          {options.map((option, index) => {
            const optionValue =
              option && typeof option === "object"
                ? option.value ?? option.name ?? option.label ?? option.id ?? ""
                : option;

            const optionLabel =
              option && typeof option === "object"
                ? option.label ?? option.name ?? option.value ?? String(option.id ?? "")
                : option;

            return (
              <option key={`${String(optionValue)}-${index}`} value={String(optionValue ?? "")}>
                {String(optionLabel ?? "")}
              </option>
            );
          })}
        </select>
      ) : type === "number" ? (
        <StableNumericInput
          name={name}
          value={project[name] ?? ""}
          onCommit={commitNumber}
          className="form-control gs-field"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="form-control gs-field"
          type={type}
          name={name}
          value={project[name] ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
      )}
    </div>
  );
}

function WizardCard({ title, subtitle, children }) {
  return (
    <div className="gs-wizard-card">
      <div className="gs-card-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function DPR() {
  const navigate = useNavigate();
  const location = useLocation();

  const rawSelectedProject = location.state?.selectedProject;
  const initialProjectName =
    rawSelectedProject && typeof rawSelectedProject === "object"
      ? rawSelectedProject.name || ""
      : rawSelectedProject || "";

  const rawSelectedCategory = location.state?.selectedCategory;
  const initialCategory =
    rawSelectedCategory && typeof rawSelectedCategory === "object"
      ? rawSelectedCategory.title || ""
      : rawSelectedCategory || "";

  const resolvedBusinessType = initialCategory.includes("Food") ? "Food Processing" :
                            initialCategory.includes("Agri") ? "Agriculture" :
                            initialCategory.includes("Green") ? "Solar" : "Food Processing";

  const [isGeneratingDPR, setIsGeneratingDPR] = useState(false);
  const [dprProgress, setDprProgress] = useState(0);
  const [dprStatus, setDprStatus] = useState("");
  const [showDPRPayment, setShowDPRPayment] = useState(false);

  const [dprPaymentPurpose, setDprPaymentPurpose] = useState("generate");
  const [premiumFinancialUnlocked, setPremiumFinancialUnlocked] = useState(false);

  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [activeCatalogCategory, setActiveCatalogCategory] = useState(0);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogPage, setCatalogPage] = useState(1);
  const CATALOG_PAGE_SIZE = 24;

  const activeCatalog = dprCategories[activeCatalogCategory] || dprCategories[0];
  const normalizedCatalogSearch = String(catalogSearch || "").trim().toLowerCase();

  const filteredCatalogProjects = useMemo(() => {
    const projects = Array.isArray(activeCatalog?.projects) ? activeCatalog.projects : [];
    if (!normalizedCatalogSearch) return projects;

    return projects.filter((projectProfile) => {
      const projectName =
        projectProfile && typeof projectProfile === "object"
          ? projectProfile.name || ""
          : projectProfile || "";
      const source =
        projectProfile && typeof projectProfile === "object"
          ? projectProfile.source || ""
          : "";

      return `${projectName} ${source}`
        .toLowerCase()
        .includes(normalizedCatalogSearch);
    });
  }, [activeCatalog, normalizedCatalogSearch]);

  const catalogTotalPages = Math.max(
    1,
    Math.ceil(filteredCatalogProjects.length / CATALOG_PAGE_SIZE)
  );

  const pagedCatalogProjects = useMemo(() => {
    const safePage = Math.min(Math.max(1, catalogPage), catalogTotalPages);
    const start = (safePage - 1) * CATALOG_PAGE_SIZE;
    return filteredCatalogProjects.slice(start, start + CATALOG_PAGE_SIZE);
  }, [filteredCatalogProjects, catalogPage, catalogTotalPages]);

  const openCatalog = () => {
    setCatalogSearch("");
    setCatalogPage(1);
    setShowCatalogModal(true);
  };

  const changeCatalogCategory = (index) => {
    setActiveCatalogCategory(index);
    setCatalogSearch("");
    setCatalogPage(1);
  };

  const selectCatalogProject = (projectProfile) => {
    const safeProfile =
      projectProfile && typeof projectProfile === "object"
        ? projectProfile
        : { name: String(projectProfile || "") };

    const intelligentUpdates = buildIntelligentTemplateUpdates(
      project,
      safeProfile,
      activeCatalog || {}
    );

    setFinancialOverrides({});
    setFinancialDrafts({});
    setFinancialDirty({});
    setFinancialEditMode(false);

    setProject((prev) => ({
      ...prev,
      ...intelligentUpdates,
    }));

    setShowCatalogModal(false);
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [project, setProject] = useState({
    projectName: initialProjectName,
    promoterName: "",
    mobile: "",
    email: "",
    businessType: resolvedBusinessType,
    constitution: "Proprietorship",
    state: "Telangana",
    district: "",
    location: "",
    projectCost: 5000000,
    promoterContributionPercent: 20,
    subsidyPercent: 15,
    interestRate: 10.5,
    loanTenure: 7,
    moratorium: 6,
    requiresWorkingCapital: false,
    workingCapitalAmount: 500000,
    workingCapitalBankLoanPercent: 75,
    land: 500000,
    building: 1000000,
    plantMachinery: 2500000,
    electrical: 250050,
    furniture: 150000,
    preliminary: 100000,
    contingency: 200000,
    workingCapitalMargin: 300000,
    otherFixedAssets: 0,
    year1Sales: 6000000,
    salesGrowth: 10,
    rawMaterialPercent: 40,
    salaryPercent: 10,
    powerPercent: 5,
    adminPercent: 4,
    marketingPercent: 3,
    otherExpensePercent: 2,
    depreciationRate: 10,
    autoScaleSales: true,
  });

  // ------------------------------------------------------
  // RESTORE DPR + RESUME PAYMENT AFTER LOGIN (FIXED)
  // ------------------------------------------------------
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isResuming = params.get("resumePayment") === "1";

    // Always check for pending project state if coming back from login/payment intent
    try {
      const pendingRaw = sessionStorage.getItem("gosubsidy_pending_dpr_project");
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        if (pending?.project && typeof pending.project === "object") {
          setProject((current) => ({ ...current, ...pending.project }));
        }
        // Clean up session item so it doesn't re-apply stale data later
        sessionStorage.removeItem("gosubsidy_pending_dpr_project");
      }
    } catch (error) {
      console.warn("Unable to restore pending DPR project:", error);
    }

    if (!isResuming) return;

    let pendingPurpose = "generate";
    try {
      const pendingPayment = sessionStorage.getItem("gosubsidy_pending_payment");
      if (pendingPayment) {
        const parsed = JSON.parse(pendingPayment);
        if (parsed?.productCode === "DPR_PRO") {
          pendingPurpose = parsed?.purpose === "financial-edit" ? "financial-edit" : "generate";
        }
      }
      sessionStorage.removeItem("gosubsidy_pending_payment");
    } catch (error) {
      console.warn("Unable to read pending payment intent:", error);
    }

    setDprPaymentPurpose(pendingPurpose);
    setShowDPRPayment(true);

    const cleanUrl = `${location.pathname}${location.hash || ""}`;
    navigate(cleanUrl, { replace: true, state: location.state });
  }, [location.pathname, location.search, location.hash, location.state, navigate]);

  const getDPRProjectKey = (source = project) =>
    JSON.stringify({
      projectName: String(source?.projectName || "").trim(),
      promoterName: String(source?.promoterName || "").trim(),
      mobile: String(source?.mobile || "").trim(),
      businessType: String(source?.businessType || "").trim(),
    });

  const readPremiumFinancialEntitlement = useCallback(() => {
    try {
      const raw = localStorage.getItem("gosubsidy_dpr_premium_access");
      const access = raw ? JSON.parse(raw) : null;

      return Boolean(
        access?.paymentStatus === "paid" &&
        access?.product === "DPR_PRO" &&
        access?.projectKey &&
        access.projectKey === getDPRProjectKey(project)
      );
    } catch (error) {
      console.warn("Unable to read Premium DPR entitlement:", error);
      return false;
    }
  }, [project]);

  React.useEffect(() => {
    setPremiumFinancialUnlocked(readPremiumFinancialEntitlement());

    if (!readPremiumFinancialEntitlement()) {
      setFinancialEditMode(false);
      setFinancialDrafts({});
      setFinancialDirty({});
    }
  }, [readPremiumFinancialEntitlement]);

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

  const isSyncingRef = React.useRef(false);

  React.useEffect(() => {
    if (project.requiresWorkingCapital && Number(project.workingCapitalAmount) > 0) {
      const computedMargin = Number(project.workingCapitalAmount) * (1 - (Number(project.workingCapitalBankLoanPercent) || 75) / 100);
      setProject(prev => ({
        ...prev,
        workingCapitalMargin: Math.round(computedMargin)
      }));
    }
  }, [project.requiresWorkingCapital, project.workingCapitalAmount, project.workingCapitalBankLoanPercent]);

  React.useEffect(() => {
    if (isSyncingRef.current) return;
    const currentProjectCost = Number(project.projectCost) || 0;
    const computedCapitalTotal = capitalCostItems.reduce(
      (total, item) => total + (Number(project[item.name]) || 0),
      0
    );

    if (currentProjectCost > 0 && currentProjectCost !== computedCapitalTotal) {
      isSyncingRef.current = true;
      
      const wcMarginValue = project.requiresWorkingCapital 
        ? Math.max(0, (Number(project.workingCapitalAmount) || 0) * (1 - (Number(project.workingCapitalBankLoanPercent) || 75) / 100))
        : 300000;

      const remainingCostForAssets = Math.max(0, currentProjectCost - wcMarginValue);

      const ratios = {
        land: 0.10,
        building: 0.20,
        plantMachinery: 0.55,
        electrical: 0.05,
        furniture: 0.03,
        preliminary: 0.02,
        contingency: 0.05,
      };

      setProject(prev => {
        const updates = {
          land: Math.round(remainingCostForAssets * ratios.land),
          building: Math.round(remainingCostForAssets * ratios.building),
          plantMachinery: Math.round(remainingCostForAssets * ratios.plantMachinery),
          electrical: Math.round(remainingCostForAssets * ratios.electrical),
          furniture: Math.round(remainingCostForAssets * ratios.furniture),
          preliminary: Math.round(remainingCostForAssets * ratios.preliminary),
          contingency: Math.round(remainingCostForAssets * ratios.contingency),
          workingCapitalMargin: Math.round(wcMarginValue),
          otherFixedAssets: 0,
        };
        if (prev.autoScaleSales !== false) {
          updates.year1Sales = Math.round(currentProjectCost * 1.20);
        }
        return { ...prev, ...updates };
      });

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 50);
    }
  }, [project.projectCost, project.requiresWorkingCapital, project.workingCapitalAmount, project.workingCapitalBankLoanPercent]);

  React.useEffect(() => {
    if (isSyncingRef.current) return;
    const computedCapitalTotal = capitalCostItems.reduce(
      (total, item) => total + (Number(project[item.name]) || 0),
      0
    );
    
    if (computedCapitalTotal > 0 && computedCapitalTotal !== Number(project.projectCost)) {
      isSyncingRef.current = true;
      setProject(prev => {
        const updates = { projectCost: computedCapitalTotal };
        if (prev.autoScaleSales !== false) {
          updates.year1Sales = Math.round(computedCapitalTotal * 1.20);
        }
        return { ...prev, ...updates };
      });

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 50);
    }
  }, [
    project.land,
    project.building,
    project.plantMachinery,
    project.electrical,
    project.furniture,
    project.preliminary,
    project.contingency,
    project.workingCapitalMargin,
    project.otherFixedAssets
  ]);

  const [activeSection, setActiveSection] = useState("glance");
  const [wizardStep, setWizardStep] = useState(1);
  const [showDraftBanner, setShowDraftBanner] = useState(() => {
    try {
      return Boolean(localStorage.getItem("gosubsidy_dpr_project"));
    } catch {
      return false;
    }
  });

  const wizardSteps = [
    { id: 1, label: "Business Info", icon: "bi-building" },
    { id: 2, label: "Loan Details", icon: "bi-bank" },
    { id: 3, label: "Fixed Assets", icon: "bi-box-seam" },
    { id: 4, label: "Financials", icon: "bi-graph-up-arrow" },
    { id: 5, label: "Promoter", icon: "bi-person-badge" },
    { id: 6, label: "Preview", icon: "bi-eye" },
  ];

  const [financialOverrides, setFinancialOverrides] = useState({});
  const [financialEditMode, setFinancialEditMode] = useState(false);
  const [financialDrafts, setFinancialDrafts] = useState({});
  const [financialDirty, setFinancialDirty] = useState({});

  const financialCellKey = (year, key) => `${year}-${key}`;

  const savePendingDPRPayment = (purpose = "generate") => {
    try {
      sessionStorage.setItem(
        "gosubsidy_pending_dpr_project",
        JSON.stringify({ project, savedAt: Date.now() })
      );
      sessionStorage.setItem(
        "gosubsidy_pending_payment",
        JSON.stringify({
          productCode: "DPR_PRO",
          purpose,
          returnPath: location.pathname,
          createdAt: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Unable to preserve DPR payment intent:", error);
    }
  };

  const startFinancialEditing = () => {
    const hasPaidAccess = readPremiumFinancialEntitlement();

    if (!hasPaidAccess) {
      setPremiumFinancialUnlocked(false);
      setDprPaymentPurpose("financial-edit");
      savePendingDPRPayment("financial-edit");
      setShowDPRPayment(true);
      return;
    }

    setPremiumFinancialUnlocked(true);
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
    setFinancialDirty((prev) => ({
      ...prev,
      [cellKey]: true,
    }));
  };

  const saveFinancialChanges = () => {
    if (!readPremiumFinancialEntitlement()) {
      setPremiumFinancialUnlocked(false);
      setFinancialEditMode(false);
      setFinancialDrafts({});
      setFinancialDirty({});
      setDprPaymentPurpose("financial-edit");
      setShowDPRPayment(true);
      return;
    }

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

      sortedYears.forEach((year) => {
        const cellKey = financialCellKey(year, key);
        const draft = financialDrafts[cellKey] ?? "";

        nextOverrides[year] = {
          ...(nextOverrides[year] || {}),
          [key]: draft === "" ? 0 : Math.max(0, Number(draft) || 0),
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

  const editableFinancialKeys = [
    "sales",
    "rawMaterial",
    "salaries",
    "power",
    "admin",
    "marketing",
    "otherExpenses",
  ];

  const resetFinancialOverrides = () => {
    setFinancialOverrides({});
    setFinancialDrafts({});
    setFinancialDirty({});
    setFinancialEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : (type === "number" ? (value === "" ? "" : Number(value)) : value),
      };
      if (name === "projectCost" && updated.autoScaleSales !== false && Number(value) > 0) {
        updated.year1Sales = Math.round(Number(value) * 1.20);
      }
      return updated;
    });
  };

  const money = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const projectCost = Number(project.projectCost) || 0;
  const promoterContribution = projectCost * ((Number(project.promoterContributionPercent) || 0) / 100);
  const expectedSubsidy = projectCost * ((Number(project.subsidyPercent) || 0) / 100);
  const estimatedTermLoan = Math.max(0, projectCost - promoterContribution - expectedSubsidy);

  const totalCapitalCost = capitalCostItems.reduce(
    (total, item) => total + (Number(project[item.name]) || 0),
    0
  );
  const capitalCostDifference = projectCost - totalCapitalCost;
  const isCapitalCostReconciled = Math.abs(capitalCostDifference) <= 1;

  const projectionYears = Math.min(15, Math.max(1, Math.floor(Number(project.loanTenure) || 1)));

  const calculations = useMemo(() => {
    const years = [];
    let openingLoan = estimatedTermLoan;
    const tenure = Math.min(15, Math.max(1, Math.floor(Number(project.loanTenure) || 1)));
    const moratoriumMonths = Math.min(tenure * 12, Math.max(0, Math.floor(Number(project.moratorium) || 0)));
    const activeRepaymentMonths = Math.max(1, tenure * 12 - moratoriumMonths);
    const monthlyPrincipalRepayment = estimatedTermLoan / activeRepaymentMonths;
    let accumulatedProfit = 0;
    let accumulatedDepreciation = 0;
    let cumulativeReserve = 0;

    const includeWC = Boolean(project.requiresWorkingCapital);
    const wcAmount = includeWC ? Number(project.workingCapitalAmount) || 0 : 0;
    const wcBankPercent = Number(project.workingCapitalBankLoanPercent) || 75;
    const workingCapitalBankLoan = includeWC ? wcAmount * (wcBankPercent / 100) : 0;

    const activeOverrides = {};
    for (let year = 1; year <= projectionYears; year++) {
      activeOverrides[year] = { ...(financialOverrides[year] || {}) };
      editableFinancialKeys.forEach((key) => {
        const cellKey = financialCellKey(year, key);
        if (financialDirty[cellKey]) {
          const draft = financialDrafts[cellKey] ?? "";
          activeOverrides[year][key] = draft === "" ? 0 : Math.max(0, Number(draft) || 0);
        }
      });
    }

    const baseYear1Sales = projectCost * 1.20;
    let runningSalesBase = null;
    const resolvedSalesByYear = {};

    for (let year = 1; year <= projectionYears; year++) {
      const yearOverrides = activeOverrides[year] || {};
      const overrideSales = yearOverrides.sales;

      if (overrideSales !== undefined && overrideSales !== null && overrideSales !== "" && !isNaN(overrideSales)) {
        runningSalesBase = Number(overrideSales);
        resolvedSalesByYear[year] = runningSalesBase;
      } else {
        if (year === 1) {
          runningSalesBase = baseYear1Sales;
        } else {
          runningSalesBase = runningSalesBase * 1.10;
        }
        resolvedSalesByYear[year] = Math.round(runningSalesBase);
      }
    }

    let previousClosingCash = promoterContribution;

    for (let year = 1; year <= projectionYears; year++) {
      const sales = resolvedSalesByYear[year];
      const yearOverrides = activeOverrides[year] || {};

      const getOverride = (key, calculatedValue) => {
        const overrideValue = yearOverrides[key];
        return overrideValue === "" || overrideValue === undefined || overrideValue === null
          ? calculatedValue
          : Number(overrideValue) || 0;
      };

      const rawMaterial = getOverride("rawMaterial", sales * ((Number(project.rawMaterialPercent) || 40) / 100));
      const salaries = getOverride("salaries", sales * ((Number(project.salaryPercent) || 10) / 100));
      const power = getOverride("power", sales * ((Number(project.powerPercent) || 5) / 100));
      const admin = getOverride("admin", sales * ((Number(project.adminPercent) || 4) / 100));
      const marketing = getOverride("marketing", sales * ((Number(project.marketingPercent) || 3) / 100));
      const otherExpenses = getOverride("otherExpenses", sales * ((Number(project.otherExpensePercent) || 2) / 100));
      const operatingExpenses = rawMaterial + salaries + power + admin + marketing + otherExpenses;

      const depreciableAssets = (Number(project.building) || 0) + (Number(project.plantMachinery) || 0) + (Number(project.electrical) || 0) + (Number(project.furniture) || 0);
      const openingWDV = Math.max(0, depreciableAssets - accumulatedDepreciation);
      const depreciation = openingWDV * ((Number(project.depreciationRate) || 10) / 100);
      accumulatedDepreciation += depreciation;
      const closingWDV = Math.max(0, openingWDV - depreciation);

      const interest = openingLoan * ((Number(project.interestRate) || 10.5) / 100);
      const ebitda = sales - operatingExpenses;
      const profitBeforeTax = ebitda - depreciation - interest;
      const estimatedTax = profitBeforeTax > 0 ? profitBeforeTax * 0.25 : 0;
      const profitAfterTax = profitBeforeTax - estimatedTax;
      accumulatedProfit += profitAfterTax;
      cumulativeReserve += profitAfterTax;

      const activeMonthsThisYear = year === 1 ? Math.max(0, 12 - moratoriumMonths) : 12;
      const repayment = Math.min(openingLoan, monthlyPrincipalRepayment * activeMonthsThisYear);
      const closingLoan = Math.max(0, openingLoan - repayment);

      const netFixedAssets = closingWDV;
      const currentAssets = Math.max(0, sales * 0.15) + (includeWC ? wcAmount : 0);
      
      const capital = promoterContribution;
      const reserveAndSurplus = cumulativeReserve;
      const totalLiabilities = capital + closingLoan + (includeWC ? workingCapitalBankLoan : 0) + reserveAndSurplus;
      
      const openingCash = year === 1 ? promoterContribution : previousClosingCash;
      const cashAndBank = openingCash + profitAfterTax + depreciation - repayment;
      const closingCash = cashAndBank;
      previousClosingCash = closingCash;

      const totalAssets = netFixedAssets + cashAndBank + currentAssets;

      const cfCapital = year === 1 ? promoterContribution : 0;
      const cfBankLoan = year === 1 ? estimatedTermLoan : 0;
      const cfWorkingCapital = year === 1 ? workingCapitalBankLoan : 0;
      const totalInflows = cfCapital + cfBankLoan + cfWorkingCapital + profitBeforeTax + depreciation;

      const cfFixedAssets = year === 1 ? projectCost : 0;
      const withdrawals = 0;
      const totalOutflows = cfFixedAssets + withdrawals + estimatedTax + repayment;
      const netCashFlow = totalInflows - totalOutflows;
      const cashDifference = 0;

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
        cashAccrual: profitAfterTax + depreciation,
        debtService: repayment + interest,
        dscr: (repayment + interest) > 0 ? (profitAfterTax + depreciation + interest) / (repayment + interest) : 0,
        netFixedAssets,
        currentAssets,
        totalAssets,
        capital,
        workingCapitalBankLoan: includeWC ? workingCapitalBankLoan : 0,
        reserveAndSurplus,
        totalLiabilities,
        cashAndBank,
        promoterContributionCF: cfCapital,
        bankLoanCF: cfBankLoan,
        workingCapitalCF: cfWorkingCapital,
        totalInflows,
        fixedAssetsCF: cfFixedAssets,
        withdrawals,
        totalOutflows,
        netCashFlow,
        openingCash,
        closingCash,
        cashDifference,
      });

      openingLoan = closingLoan;
    }

    const dscrYears = years.filter((item) => item.debtService > 0);
    const averageDSCR = dscrYears.length > 0 ? dscrYears.reduce((total, item) => total + item.dscr, 0) / dscrYears.length : 0;

    return { years, averageDSCR };
  }, [project, estimatedTermLoan, promoterContribution, projectCost, financialOverrides, financialDrafts, financialDirty, projectionYears]);

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

    const difference = cost - totalCapitalCost;
    if (Math.abs(difference) > 1) {
      return difference > 0
        ? `Capital Cost Statement is incomplete. Balance to allocate: ${money(difference)}`
        : `Capital Cost Statement exceeds Total Project Cost by ${money(Math.abs(difference))}.`;
    }
    return "";
  };

  const buildDPRPayload = () => ({
    project,
    projectionYears,
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
      projectionYears,
    },
    calculations,
    financialOverrides,
    savedAt: new Date().toISOString(),
  });

  const handlePremiumDPR = () => {
    const validationError = validateProject();
    if (validationError) {
      alert(validationError);
      return;
    }
    setDprPaymentPurpose("generate");
    savePendingDPRPayment("generate");
    setShowDPRPayment(true);
  };

  const handleGenerateAIDPR = async () => {
    const validationError = validateProject();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsGeneratingDPR(true);
    setDprProgress(10);
    setDprStatus("Preparing project information...");
    let progressTimer = null;

    try {
      const payload = buildDPRPayload();
      localStorage.setItem("gosubsidy_ai_dpr", JSON.stringify(payload));
      await new Promise((resolve) => setTimeout(resolve, 100));

      setDprProgress(20);
      setDprStatus("Sending project to GoSubsidy AI...");

      progressTimer = setInterval(() => {
        setDprProgress((previous) => {
          let next = previous + 5;
          if (next >= 90) next = 90;
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

      const response = await fetch(`${API_BASE_URL}/api/dpr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: payload }),
      });

      const data = await response.json();
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || data?.error || "AI DPR generation failed.");
      }

      const report = typeof data.dpr === "string" ? data.dpr.trim() : "";
      if (!report) throw new Error("AI DPR report content is empty.");

      setDprProgress(95);
      setDprStatus("Saving generated DPR...");

      const generatedDPR = {
        project: payload,
        report,
        provider: data.provider || "Google Gemini",
        backendProject: data.project || {},
        generatedAt: new Date().toISOString(),
      };

      localStorage.setItem("gosubsidy_generated_dpr", JSON.stringify(generatedDPR));
      localStorage.setItem("gosubsidy_generated_dpr_text", report);

      setDprProgress(100);
      setDprStatus("DPR generated successfully!");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/dpr-preview?mode=premium", {
        state: {
          generatedDPR,
          project: payload,
          dpr: report,
          provider: data.provider || "Google Gemini",
          financialData: data.project || {},
        },
      });
    } catch (error) {
      if (progressTimer) clearInterval(progressTimer);
      setDprStatus("DPR generation failed.");
      alert(error?.message || "Unable to generate AI DPR.");
    } finally {
      if (progressTimer) clearInterval(progressTimer);
      setIsGeneratingDPR(false);
    }
  };

  const sections = [
    { id: "glance", icon: "bi-grid", label: "Project at a Glance" },
    { id: "capital", icon: "bi-building", label: "Capital Cost" },
    { id: "dscr", icon: "bi-speedometer2", label: "DSCR Statement" },
    { id: "income", icon: "bi-graph-up-arrow", label: "Income Statement" },
    { id: "expenditure", icon: "bi-receipt", label: "Expenditure Statement" },
    { id: "profit", icon: "bi-bar-chart", label: "Profit & Loss Account" },
    { id: "balance", icon: "bi-bank", label: "Balance Sheet" },
    { id: "cashflow", icon: "bi-cash-stack", label: "Cash Flow Statement" },
    { id: "repayment", icon: "bi-calendar-check", label: "Repayment Schedule" },
    { id: "depreciation", icon: "bi-arrow-down-circle", label: "Depreciation" },
  ];

  const FinancialTable = ({ title, subtitle, rows, editable = false }) => {
    const hasEditableRows = editable && rows.some((row) => editableFinancialKeys.includes(row.key));

    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h3 className="fw-bold mb-1">{title}</h3>
              {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
              {hasEditableRows && (
                <small className={`${premiumFinancialUnlocked ? "text-success" : "text-warning"} fw-semibold d-block mt-1`}>
                  <i className={`bi ${premiumFinancialUnlocked ? "bi-unlock-fill" : "bi-lock-fill"} me-1`} />
                  {premiumFinancialUnlocked
                    ? "Premium financial editing unlocked."
                    : "Financial editing is locked. Pay Premium DPR Charges to unlock editing."}
                </small>
              )}
            </div>
            {hasEditableRows && (
              <div className="d-flex flex-wrap gap-2">
                {!financialEditMode ? (
                  <>
                    <button
                      type="button"
                      className={`btn btn-sm ${premiumFinancialUnlocked ? "btn-primary" : "btn-warning"}`}
                      onClick={startFinancialEditing}
                    >
                      <i className={`bi ${premiumFinancialUnlocked ? "bi-pencil-square" : "bi-lock-fill"} me-2`} />
                      {premiumFinancialUnlocked ? "Edit Statement" : "Unlock Financial Editing"}
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetFinancialOverrides}>
                      <i className="bi bi-arrow-counterclockwise me-2" /> Reset
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-success btn-sm" onClick={saveFinancialChanges}>
                      <i className="bi bi-check-lg me-2" /> Save Changes
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelFinancialEditing}>
                      <i className="bi bi-x-lg me-2" /> Cancel
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
                  <th style={{ minWidth: "220px" }}>Particulars</th>
                  {calculations.years.map((item) => (
                    <th key={item.year} className="text-nowrap">Year {item.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const rowIsEditable = editable && editableFinancialKeys.includes(row.key);
                  const isHeaderRow = row.key === null || row.header;

                  return (
                    <tr key={index} className={isHeaderRow ? "table-light fw-bold" : ""}>
                      <th>{row.label}</th>
                      {calculations.years.map((item) => (
                        <td key={item.year} className="text-nowrap" style={{ minWidth: rowIsEditable ? "150px" : undefined }}>
                          {isHeaderRow ? (
                            ""
                          ) : rowIsEditable && financialEditMode ? (
                            <EditableFinancialInput
                              key={`${item.year}-${row.key}`}
                              value={
                                financialDrafts[financialCellKey(item.year, row.key)] ??
                                String(Math.round(Number(item[row.key]) || 0))
                              }
                              year={item.year}
                              fieldKey={row.key}
                              onDraftChange={handleFinancialDraftChange}
                            />
                          ) : row.format === "number" ? (
                            Number(item[row.key] || 0).toFixed(2)
                          ) : (
                            money(item[row.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    const includeWC = Boolean(project.requiresWorkingCapital);
    const balanceSheetRows = [
      { label: "I) LIABILITIES :-", key: null },
      { label: "   Capital", key: "capital" },
      { label: "   Long Term Loan", key: "closingLoan" },
      ...(includeWC ? [{ label: "   Working Capital Bank Loan", key: "workingCapitalBankLoan" }] : []),
      { label: "   Reserve & Surplus", key: "reserveAndSurplus" },
      { label: "Total Rs.", key: "totalLiabilities" },

      { label: "II) ASSETS :-", key: null },
      { label: "   Fixed Assets less Dep.", key: "netFixedAssets" },
      { label: "   Cash & Bank Balance", key: "cashAndBank" },
      { label: "   Current Assets", key: "currentAssets" },
      { label: "Total Rs.", key: "totalAssets" },
    ];

    switch (activeSection) {
      case "glance": return null;
      case "capital": return null;
      case "dscr":
        return (
          <FinancialTable
            title="DSCR Statement"
            subtitle="Projected debt servicing capacity."
            rows={[
              { label: "Profit After Tax", key: "profitAfterTax" },
              { label: "Depreciation", key: "depreciation" },
              { label: "Interest on Term Loan", key: "interest" },
              { label: "Principal Repayment", key: "repayment" },
              { label: "Total Debt Service", key: "debtService" },
              { label: "DSCR", key: "dscr", format: "number" },
            ]}
          />
        );
      case "income":
        return (
          <FinancialTable
            title="Projected Income Statement"
            subtitle="Year 1 Sales is automatically 20% higher than Project Cost; Year 2 onwards grows by 10% compounding annually."
            editable
            rows={[
              { label: "Sales / Operating Revenue", key: "sales" },
              { label: "EBITDA", key: "ebitda" },
              { label: "Profit Before Tax", key: "profitBeforeTax" },
              { label: "Profit After Tax", key: "profitAfterTax" },
            ]}
          />
        );
      case "expenditure":
        return (
          <FinancialTable
            title="Projected Expenditure Statement"
            editable
            rows={[
              { label: "Raw Material", key: "rawMaterial" },
              { label: "Salaries & Wages", key: "salaries" },
              { label: "Power & Utilities", key: "power" },
              { label: "Administrative Expenses", key: "admin" },
              { label: "Marketing Expenses", key: "marketing" },
              { label: "Other Expenses", key: "otherExpenses" },
              { label: "Total Operating Expenses", key: "operatingExpenses" },
            ]}
          />
        );
      case "profit":
        return (
          <FinancialTable
            title="Profit and Loss Account Statement"
            subtitle="Detailed bank-ready P&L account breakdown."
            rows={[
              { label: "Sales / Revenue", key: "sales" },
              { label: "Operating Expenses", key: "operatingExpenses" },
              { label: "EBITDA", key: "ebitda" },
              { label: "Depreciation", key: "depreciation" },
              { label: "Interest", key: "interest" },
              { label: "Profit Before Tax (PBT)", key: "profitBeforeTax" },
              { label: "Estimated Tax", key: "estimatedTax" },
              { label: "Profit After Tax (PAT)", key: "profitAfterTax" },
              { label: "Reserve & Surplus", key: "reserveAndSurplus" },
            ]}
          />
        );
      case "balance":
        return (
          <FinancialTable
            title="Balance Sheet"
            subtitle="Projected balance sheet statement."
            rows={balanceSheetRows}
          />
        );
      case "cashflow":
        return (
          <FinancialTable
            title="Cash Flow Statement"
            subtitle="Projected cash flow statement matching standard advisory formats."
            rows={[
              { label: "Capital", key: "promoterContributionCF" },
              { label: "Bank Loan", key: "bankLoanCF" },
              { label: "Working Capital Loan", key: "workingCapitalCF" },
              { label: "Profit Before Tax", key: "profitBeforeTax" },
              { label: "Depreciation", key: "depreciation" },
              { label: "Total Rs.", key: "totalInflows" },
              { label: "Fixed Assets", key: "fixedAssetsCF" },
              { label: "Withdrawals", key: "withdrawals" },
              { label: "Tax Payment", key: "estimatedTax" },
              { label: "Repayment of Term Loan", key: "repayment" },
              { label: "Total Rs.", key: "totalOutflows" },
              { label: "Net Inflow / (Outflow)", key: "netCashFlow" },
              { label: "Opening Cash & Bank", key: "openingCash" },
              { label: "Closing Cash & Bank", key: "closingCash" },
              { label: "Difference In cash", key: "cashDifference" },
            ]}
          />
        );
      case "repayment":
        return (
          <FinancialTable
            title="Term Loan Repayment Schedule"
            rows={[
              { label: "Opening Loan Balance", key: "openingLoan" },
              { label: "Interest", key: "interest" },
              { label: "Principal Repayment", key: "repayment" },
              { label: "Total Debt Service", key: "debtService" },
              { label: "Closing Loan Balance", key: "closingLoan" },
            ]}
          />
        );
      case "depreciation":
        return (
          <FinancialTable
            title="Depreciation Statement"
            rows={[
              { label: "Opening WDV", key: "openingWDV" },
              { label: "Depreciation", key: "depreciation" },
              { label: "Closing WDV", key: "closingWDV" },
            ]}
          />
        );
      default:
        return null;
    }
  };

  const saveDraftOnly = () => {
    try {
      localStorage.setItem("gosubsidy_dpr_project", JSON.stringify(buildDPRPayload()));
      setShowDraftBanner(true);
      alert("Draft saved successfully.");
    } catch (error) {
      console.error("Save Draft Error:", error);
    }
  };

  const goToWizardStep = (step) => {
    const nextStep = Math.min(6, Math.max(1, step));
    setWizardStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextWizardStep = () => goToWizardStep(wizardStep + 1);
  const previousWizardStep = () => goToWizardStep(wizardStep - 1);

  const BusinessInfoStep = () => (
    <WizardCard title="Business Details" subtitle="Enter basic project information or choose a template from the sector catalog.">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
          onClick={openCatalog}
        >
          <i className="bi bi-grid-3x3-gap-fill text-primary" />
          <span>Browse Sector Project Catalog (1,000+ Templates)</span>
        </button>
      </div>

      <div className="row g-3">
        <Field label="Business / Project Name" name="projectName" required placeholder="Enter business name" />
        <Field label="Promoter Name" name="promoterName" required placeholder="Enter promoter name" />
        <Field label="Mobile Number" name="mobile" required type="tel" placeholder="Enter mobile number" />
        <Field label="Email Address" name="email" required type="email" placeholder="example@email.com" />
        <Field label="Nature of Business" name="businessType" options={["Food Processing", "Agriculture", "Poultry", "Dairy", "MSME", "Manufacturing", "Solar", "Cold Chain"]} />
        <Field label="Type of Entity" name="constitution" options={["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited"]} />
        <Field label="State" name="state" options={["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Gujarat"]} />
        <Field label="District" name="district" placeholder="Enter district" />
        <Field label="Project Location" name="location" placeholder="Enter location" />
      </div>
    </WizardCard>
  );

  const LoanDetailsStep = () => {
    const currentProjectCost = Number(project.projectCost) || 0;
    const computedPromoterShare = currentProjectCost * ((Number(project.promoterContributionPercent) || 0) / 100);
    const computedSubsidyShare = currentProjectCost * ((Number(project.subsidyPercent) || 0) / 100);
    const computedTermLoan = Math.max(0, currentProjectCost - computedPromoterShare - computedSubsidyShare);

    return (
      <WizardCard title="Loan Details & Revenue Settings" subtitle="Set project financing assumptions and revenue scaling mode.">
        <div className="row g-3">
          <Field label="Total Project Cost" name="projectCost" type="number" min="0" required />
          <Field label="Promoter Contribution" name="promoterContributionPercent" type="number" min="0" max="100" step="0.1" />
          <Field label="Expected Subsidy" name="subsidyPercent" type="number" min="0" max="100" step="0.1" />
          
          <div className="col-md-6">
            <label className="gs-field-label">
              <span>Estimated Term Loan (Auto-Calculated)</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input
                type="text"
                className="form-control bg-light fw-bold text-success gs-field"
                value={Math.round(computedTermLoan)}
                disabled
                readOnly
              />
            </div>
            <small className="text-muted" style={{ fontSize: "11.5px" }}>
              (Project Cost {money(currentProjectCost)} - Promoter {money(computedPromoterShare)} - Subsidy {money(computedSubsidyShare)})
            </small>
          </div>

          <Field label="Interest Rate" name="interestRate" type="number" min="0" step="0.1" />
          <Field label="Loan Tenure (Years)" name="loanTenure" type="number" min="1" max="15" />
          <Field label="Moratorium (Months)" name="moratorium" type="number" min="0" />

          <div className="col-12 mt-4 pt-3 border-top">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="requiresWorkingCapitalToggle"
                name="requiresWorkingCapital"
                checked={Boolean(project.requiresWorkingCapital)}
                onChange={handleChange}
                style={{ width: "45px", height: "22px", cursor: "pointer" }}
              />
              <label className="form-check-label fw-bold ms-2 pt-1" htmlFor="requiresWorkingCapitalToggle" style={{ cursor: "pointer" }}>
                Include Working Capital Requirement (Optional Bank Cash Credit / OD Facility)
              </label>
            </div>
          </div>

          {project.requiresWorkingCapital && (
            <>
              <Field label="Working Capital Requirement Amount" name="workingCapitalAmount" type="number" min="0" placeholder="Enter working capital limit" />
              <Field label="Working Capital Bank Finance (%)" name="workingCapitalBankLoanPercent" type="number" min="0" max="100" placeholder="75" />
            </>
          )}
        </div>
      </WizardCard>
    );
  };

  const FixedAssetsStep = () => (
    <WizardCard title="Fixed Assets & Project Cost" subtitle="Enter detailed asset costs. Total project cost and Year 1 sales update automatically (Year 1 sales = Project Cost + 20%).">
      <div className="gs-assets-table">
        {capitalCostItems.map((item) => (
          <div className="gs-asset-row" key={item.name}>
            <div><strong>{item.label}</strong></div>
            <div className="input-group gs-money-input">
              <span className="input-group-text">₹</span>
              <StableNumericInput
                name={item.name}
                value={project[item.name] ?? ""}
                onCommit={(fieldName, nextValue) => {
                  handleChange({
                    target: { name: fieldName, value: nextValue === "" ? "" : String(nextValue), type: "number" },
                  });
                }}
                className="form-control"
                min="0"
                step="1"
              />
            </div>
          </div>
        ))}
      </div>
      <div className={`gs-reconcile-box ${isCapitalCostReconciled ? "ok" : "warning"} mt-3`}>
        <div><span>Project Cost</span><strong>{money(projectCost)}</strong></div>
        <div><span>Capital Cost Entered</span><strong>{money(totalCapitalCost)}</strong></div>
        <div><span>Difference</span><strong>{money(Math.abs(capitalCostDifference))}</strong></div>
      </div>
    </WizardCard>
  );

  const FinancialsStep = () => (
    <WizardCard
      title={
        <span className="d-flex align-items-center gap-2 flex-wrap">
          <span>Financial Projections</span>
          <span className={`badge rounded-pill ${premiumFinancialUnlocked ? "bg-success" : "bg-warning text-dark"}`}>
            <i className={`bi ${premiumFinancialUnlocked ? "bi-unlock-fill" : "bi-lock-fill"} me-1`} />
            {premiumFinancialUnlocked ? "Premium Editing Unlocked" : "Premium Editing Locked"}
          </span>
        </span>
      }
      subtitle="Review and edit statements. Year 1 is automatically 20% over Project Cost, and Year 2 onwards compounds at 10% annually."
    >
      <div className="gs-subtabs">
        {[
          ["income", "Income"],
          ["expenditure", "Expenses"],
          ["profit", "P&L"],
          ["balance", "Balance Sheet"],
          ["cashflow", "Cash Flow"],
          ["repayment", "Repayment"],
          ["depreciation", "Depreciation"],
          ["dscr", "DSCR"],
        ].map(([id, label]) => (
          <button type="button" key={id} className={activeSection === id ? "active" : ""} onClick={() => setActiveSection(id)}>{label}</button>
        ))}
      </div>
      <div className="gs-financial-panel mt-3">
        {renderSection()}
      </div>
    </WizardCard>
  );

  const PromoterStep = () => (
    <WizardCard title="Promoter Details" subtitle="Review promoter information.">
      <div className="row g-3">
        <Field label="Promoter Name" name="promoterName" required />
        <Field label="Mobile Number" name="mobile" required type="tel" />
        <Field label="Email Address" name="email" required type="email" />
        <Field label="State" name="state" options={["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra"]} />
      </div>
    </WizardCard>
  );

  const PreviewStep = () => (
    <WizardCard title="DPR Preview Summary" subtitle="Review your project configuration before generating the Premium DPR.">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Project Name</small>
            <strong className="fs-5">{project.projectName || "Not provided"}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Promoter Name</small>
            <strong className="fs-5">{project.promoterName || "Not provided"}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Business Sector</small>
            <strong className="fs-5">{project.businessType || "General"}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Total Project Cost</small>
            <strong className="fs-5 text-primary">{money(projectCost)}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Estimated Term Loan</small>
            <strong className="fs-5 text-success">{money(estimatedTermLoan)}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Average DSCR</small>
            <strong className="fs-5">{calculations.averageDSCR.toFixed(2)}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Entity Type</small>
            <strong className="fs-6">{project.constitution || "Proprietorship"}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Location & State</small>
            <strong className="fs-6">{[project.location, project.state].filter(Boolean).join(", ") || "Telangana"}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded-3 bg-light">
            <small className="text-muted d-block uppercase fw-bold">Capital Reconciliation</small>
            <strong className={`fs-6 ${isCapitalCostReconciled ? "text-success" : "text-danger"}`}>
              {isCapitalCostReconciled ? "Reconciled ✓" : "Pending Variance"}
            </strong>
          </div>
        </div>
      </div>
    </WizardCard>
  );

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 1: return BusinessInfoStep();
      case 2: return LoanDetailsStep();
      case 3: return FixedAssetsStep();
      case 4: return FinancialsStep();
      case 5: return PromoterStep();
      case 6: return PreviewStep();
      default: return BusinessInfoStep();
    }
  };

  return (
    <div className="gosubsidy-dpr-wizard">
      <header className="gs-hero">
        <div className="gs-shell">
          <div className="gs-topline">
            <div className="gs-brand"><span>Go</span>Subsidy</div>
            <div className="gs-top-actions">
              <button 
                type="button" 
                className="gs-top-btn" 
                onClick={() => navigate("/dpr-catalog")}
              >
                <i className="bi bi-grid-3x3-gap me-1" /> Sector Catalog
              </button>
              <button type="button" className="gs-top-btn" onClick={() => navigate("/")}><i className="bi bi-house me-1" /> Home</button>
              <button
                type="button"
                className="gs-top-btn primary"
                onClick={handlePremiumDPR}
                disabled={isGeneratingDPR}
              >
                {isGeneratingDPR ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    {dprStatus ? `${dprStatus} (${dprProgress}%)` : `Generating... (${dprProgress}%)`}
                  </>
                ) : (
                  <>
                    <i className="bi bi-stars me-1" /> Generate Premium DPR
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="gs-title">
            <h1>Detailed Project Report</h1>
            <p>Create your DPR step-by-step with project, loan, asset and financial information.</p>
          </div>
          <div className="gs-stepper">
            {wizardSteps.map((step) => (
              <button key={step.id} type="button" className={`gs-step ${wizardStep === step.id ? "active" : ""} ${wizardStep > step.id ? "done" : ""}`} onClick={() => goToWizardStep(step.id)}>
                <span className="gs-step-dot"><i className={`bi ${wizardStep > step.id ? "bi-check-lg" : step.icon}`} /></span>
                <span>{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="gs-shell gs-main">
        {showDraftBanner && (
          <div className="gs-draft">
            <div><strong>Draft Loaded:</strong> You have a DPR draft saved in this browser.</div>
            <div className="gs-draft-actions">
              <button type="button" onClick={() => setShowDraftBanner(false)}>Continue</button>
              <button type="button" className="fresh" onClick={() => { localStorage.removeItem("gosubsidy_dpr_project"); setShowDraftBanner(false); window.location.reload(); }}>Start Fresh</button>
            </div>
          </div>
        )}

        <DPRFieldContext.Provider value={{ project, handleChange }}>
          {renderWizardStep()}
        </DPRFieldContext.Provider>

        <div className="gs-footerbar">
          <div className="gs-footer-left">
            <button type="button" className="gs-nav-btn" onClick={previousWizardStep} disabled={wizardStep === 1}>← Back</button>
            <button type="button" className="gs-save-btn" onClick={saveDraftOnly}><i className="bi bi-floppy me-1" /> Save Draft</button>
          </div>
          <button
            type="button"
            className="gs-nav-btn next"
            onClick={wizardStep === 6 ? handlePremiumDPR : nextWizardStep}
            disabled={isGeneratingDPR}
          >
            {wizardStep === 6 ? (
              isGeneratingDPR ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  {dprStatus ? `${dprStatus} (${dprProgress}%)` : `Generating... (${dprProgress}%)`}
                </>
              ) : (
                <><i className="bi bi-stars me-1" /> Generate Premium DPR</>
              )
            ) : (
              <>Next <i className="bi bi-arrow-right ms-1" /></>
            )}
          </button>
        </div>
      </main>

      <Footer />

      {showCatalogModal && (
        <div
          className="modal show d-block"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dprCatalogTitle"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

              <div className="modal-header bg-white px-4 py-3 border-bottom">
                <div>
                  <h5 id="dprCatalogTitle" className="modal-title fw-bold d-flex align-items-center gap-2 mb-1">
                    <i className="bi bi-grid-3x3-gap-fill text-primary" />
                    Detailed Project Report — Project Catalog
                  </h5>
                  <small className="text-muted">
                    Choose from {dprCategories.reduce(
                      (total, category) => total + (Array.isArray(category.projects) ? category.projects.length : 0),
                      0
                    ).toLocaleString("en-IN")} project profiles
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close catalog"
                  onClick={() => setShowCatalogModal(false)}
                />
              </div>

              <div className="modal-body p-4 bg-light">
                <div className="row g-3 mb-4">
                  <div className="col-lg-8">
                    <label className="form-label fw-bold small mb-2">
                      Search Project / Business Profile
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-search text-primary" />
                      </span>
                      <input
                        type="search"
                        className="form-control"
                        value={catalogSearch}
                        onChange={(e) => {
                          setCatalogSearch(e.target.value);
                          setCatalogPage(1);
                        }}
                        placeholder="e.g. Rice Mill, Dairy Farm, Solar, Bakery..."
                        autoFocus
                      />
                      {catalogSearch && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setCatalogSearch("");
                            setCatalogPage(1);
                          }}
                          aria-label="Clear search"
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-4 d-flex align-items-end">
                    <div className="w-100 bg-white border rounded-3 px-3 py-2">
                      <small className="text-muted d-block">Matching profiles</small>
                      <strong className="text-primary">
                        {filteredCatalogProjects.length.toLocaleString("en-IN")}
                      </strong>
                      <span className="text-muted ms-1">in this sector</span>
                    </div>
                  </div>
                </div>

                <div className="alert alert-primary border-0 rounded-4 shadow-sm mb-4 py-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "42px", height: "42px" }}>
                      <i className="bi bi-magic fs-5" />
                    </div>
                    <div>
                      <strong className="d-block mb-1">Intelligent DPR Templates</strong>
                      <span className="small">Choose a project profile and GoSubsidy will prepare a starting project cost, asset mix, working-capital assumption, sales estimate, operating-cost ratios and depreciation rate for that type of business. You can edit the values before generation.</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6
                    className="text-uppercase text-muted fw-bold mb-3"
                    style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                  >
                    Select Industry Sector
                  </h6>

                  <div className="row g-3">
                    {dprCategories.map((cat, idx) => {
                      const count = Array.isArray(cat.projects) ? cat.projects.length : 0;
                      const active = activeCatalogCategory === idx;

                      return (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={`${cat.title}-${idx}`}>
                          <button
                            type="button"
                            className={`card w-100 border-0 shadow-sm p-3 rounded-4 d-flex flex-column align-items-center text-center position-relative ${
                              active
                                ? "bg-primary text-white shadow"
                                : "bg-white text-dark"
                            }`}
                            onClick={() => changeCatalogCategory(idx)}
                            style={{
                              minHeight: "105px",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              className={`badge position-absolute top-0 end-0 m-2 rounded-pill px-2 py-1 fw-bold ${
                                active
                                  ? "bg-light text-primary"
                                  : "bg-primary-subtle text-primary"
                              }`}
                              style={{ fontSize: "10px" }}
                            >
                              {count.toLocaleString("en-IN")}
                            </span>

                            <div className={`fs-2 mb-2 ${active ? "text-white" : "text-primary"}`}>
                              {cat.icon}
                            </div>

                            <span className="fw-bold" style={{ fontSize: "14px" }}>
                              {cat.title}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-4 p-4 shadow-sm border">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom">
                    <div>
                      <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        <span>{activeCatalog?.icon}</span>
                        <span>{activeCatalog?.title || "Project Profiles"}</span>
                      </h5>
                      <small className="text-muted">
                        {filteredCatalogProjects.length
                          ? `Showing ${Math.min(
                              (catalogPage - 1) * CATALOG_PAGE_SIZE + 1,
                              filteredCatalogProjects.length
                            )}–${Math.min(
                              catalogPage * CATALOG_PAGE_SIZE,
                              filteredCatalogProjects.length
                            )} of ${filteredCatalogProjects.length.toLocaleString("en-IN")}`
                          : "No matching project profiles"}
                      </small>
                    </div>

                    <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill">
                      {activeCatalog?.projects?.length?.toLocaleString("en-IN") || 0} Available
                    </span>
                  </div>

                  {pagedCatalogProjects.length > 0 ? (
                    <div className="row g-3">
                      {pagedCatalogProjects.map((proj, pIdx) => (
                        <div
                          key={`${activeCatalogCategory}-${catalogPage}-${pIdx}-${proj?.id ?? proj?.name ?? proj}`}
                          className="col-xl-4 col-md-6"
                        >
                          <button
                            type="button"
                            className="card w-100 h-100 border shadow-sm p-3 rounded-3 d-flex flex-row align-items-center justify-content-between text-start bg-white"
                            onClick={() => selectCatalogProject(proj)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="d-flex align-items-center gap-3">
                              <span
                                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: "42px", height: "42px" }}
                              >
                                <i className="bi bi-file-earmark-text-fill fs-5" />
                              </span>

                              <span className="min-w-0">
                                <strong
                                  className="d-block text-dark"
                                  style={{
                                    fontSize: "13.5px",
                                    lineHeight: 1.25,
                                  }}
                                >
                                  {proj?.name ?? proj}
                                </strong>
                                <small className="text-muted d-block">
                                  Intelligent profile • Apply to DPR
                                </small>
                              </span>
                            </span>

                            <i className="bi bi-arrow-right-circle text-primary fs-5 ms-2 flex-shrink-0" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3" />
                      <h6 className="fw-bold">No project profile found</h6>
                      <p className="text-muted mb-3">
                        Try another project name or clear the search.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-4"
                        onClick={() => {
                          setCatalogSearch("");
                          setCatalogPage(1);
                        }}
                      >
                        Clear Search
                      </button>
                    </div>
                  )}

                  {catalogTotalPages > 1 && (
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-4 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        disabled={catalogPage === 1}
                        onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                      >
                        <i className="bi bi-chevron-left me-1" />
                        Previous
                      </button>

                      {Array.from(
                        { length: Math.min(7, catalogTotalPages) },
                        (_, i) => {
                          let pageNumber;

                          if (catalogTotalPages <= 7) {
                            pageNumber = i + 1;
                          } else if (catalogPage <= 4) {
                            pageNumber = i + 1;
                          } else if (catalogPage >= catalogTotalPages - 3) {
                            pageNumber = catalogTotalPages - 6 + i;
                          } else {
                            pageNumber = catalogPage - 3 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              type="button"
                              className={`btn btn-sm rounded-pill px-3 ${
                                catalogPage === pageNumber
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => setCatalogPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                      )}

                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        disabled={catalogPage === catalogTotalPages}
                        onClick={() =>
                          setCatalogPage((p) => Math.min(catalogTotalPages, p + 1))
                        }
                      >
                        Next
                        <i className="bi bi-chevron-right ms-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-white px-4 py-3">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setShowCatalogModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDPRPayment && (
        <PaymentModal
          product={PREMIUM_PRODUCTS?.DPR_PRO || { code: "DPR_PRO", name: "Premium DPR", price: 999 }}
          paymentPurpose={dprPaymentPurpose}
          onClose={() => {
            setShowDPRPayment(false);
            setDprPaymentPurpose("generate");
          }}
          onSuccess={() => {
            const paidAt = new Date().toISOString();
            const projectKey = getDPRProjectKey(project);

            localStorage.setItem(
              "gosubsidy_dpr_premium_access",
              JSON.stringify({
                paymentStatus: "paid",
                product: "DPR_PRO",
                projectKey,
                paymentReference: null,
                paidAt,
              })
            );

            localStorage.removeItem("gosubsidy_dpr_financials_unlocked");

            setPremiumFinancialUnlocked(true);
            setShowDPRPayment(false);

            if (dprPaymentPurpose === "financial-edit") {
              setDprPaymentPurpose("generate");
              setFinancialDrafts({});
              setFinancialDirty({});
              setFinancialEditMode(true);
              return;
            }

            setDprPaymentPurpose("generate");
            handleGenerateAIDPR();
          }}
        />
      )}
    </div>
  );
}