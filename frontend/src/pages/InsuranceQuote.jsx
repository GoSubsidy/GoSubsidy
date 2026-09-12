import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import GlassCard from "../components/ui/GlassCard";
import StepCard from "../components/ui/StepCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import GradientButton from "../components/ui/GradientButton";
import ProgressBar from "../components/insurance/ProgressBar";
import InsuranceTypeStep from "../components/insurance/InsuranceTypeStep";
import CustomerStep from "../components/insurance/CustomerStep";
import CoverageStep from "../components/insurance/CoverageStep";
import ReviewStep from "../components/insurance/ReviewStep";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import InsuranceSummary from "../components/insurance/InsuranceSummary";
import SuccessModal from "../components/ui/SuccessModal";
/* ===========================================================
   INSURANCE PRODUCTS
=========================================================== */

export const INSURANCE_TYPES = [
  {
    value: "health",
    label: "Health Insurance",
    icon: "bi-heart-pulse",
    description: "Individual, Family & Senior Citizen Health Plans",
  },
  {
    value: "motor",
    label: "Motor Insurance",
    icon: "bi-car-front",
    description: "Car, Bike, Commercial Vehicle & EV Insurance",
  },
  {
    value: "life",
    label: "Life Insurance",
    icon: "bi-shield-check",
    description: "Term Life, Whole Life & Investment Plans",
  },
  {
    value: "business",
    label: "Business Insurance",
    icon: "bi-building",
    description: "MSME, Shops, Offices & Commercial Establishments",
  },
  {
    value: "property",
    label: "Property Insurance",
    icon: "bi-house-door",
    description: "Residential & Commercial Property Protection",
  },
  {
    value: "industrial",
    label: "Industrial Insurance",
    icon: "bi-gear-wide-connected",
    description: "Factories, Plants & Manufacturing Units",
  },
  {
    value: "poultry",
    label: "Poultry Insurance",
    icon: "bi-egg-fried",
    description: "Broiler, Layer & Hatchery Insurance",
  },
  {
    value: "livestock",
    label: "Livestock Insurance",
    icon: "bi-droplet-half",
    description: "Cow, Buffalo, Goat & Sheep Insurance",
  },
  {
    value: "agriculture",
    label: "Agriculture Insurance",
    icon: "bi-tree",
    description: "Crop, Farm & Agricultural Assets",
  },
  {
    value: "marine",
    label: "Marine Insurance",
    icon: "bi-truck",
    description: "Transit, Cargo & Marine Coverage",
  },
  {
    value: "travel",
    label: "Travel Insurance",
    icon: "bi-airplane",
    description: "Domestic & International Travel Protection",
  },
  {
    value: "employee",
    label: "Employee Insurance",
    icon: "bi-people",
    description: "Group Health & Employee Benefit Plans",
  },
];

/* ===========================================================
   FORM STEPS
=========================================================== */

export const STEPS = ["Insurance", "Customer", "Coverage", "Review"];

/* ===========================================================
   INITIAL FORM
=========================================================== */

export const INITIAL_FORM = {
  /* Common */
  insuranceType: "",

  name: "",
  mobile: "",
  email: "",

  city: "",
  state: "",
  pincode: "",

  remarks: "",

  /* Health */
  healthFor: "",
  age: "",
  familyMembers: "",
  healthCover: "",
  existingHealthPolicy: "",
  preExistingDisease: "",

  /* Motor */
  vehicleType: "",
  vehicleMake: "",
  vehicleModel: "",
  registrationNumber: "",
  manufacturingYear: "",
  fuelType: "",
  idv: "",
  policyType: "",
  existingMotorPolicy: "",
  ncb: "",
  registrationCity: "",
  motorNotes: "",

  /* Life */
  lifeInsuranceType: "",
  lifeAge: "",
  gender: "",
  occupation: "",
  annualIncome: "",
  sumAssured: "",
  policyTerm: "",
  smoker: "",
  medicalHistory: "",
  nomineeName: "",
  nomineeRelation: "",
  lifeNotes: "",

  /* Business */
  businessName: "",
  businessType: "",
  businessYears: "",
  annualTurnover: "",
  employees: "",
  businessCover: "",
  buildingValue: "",
  machineryValue: "",
  stockValue: "",
  businessAddress: "",
  businessNotes: "",

  /* Property */
  propertyType: "",
  ownership: "",
  contentsValue: "",
  constructionType: "",
  buildingAge: "",
  propertyCover: "",
  existingPropertyPolicy: "",
  propertyAddress: "",
  propertyNotes: "",

  /* Industrial */
  industryName: "",
  industryType: "",
  factoryArea: "",
  industrialTurnover: "",
  industrialEmployees: "",
  industrialBuildingValue: "",
  industrialStockValue: "",
  industrialCover: "",
  factoryAddress: "",
  industrialNotes: "",

  /* Poultry */
  farmName: "",
  poultryType: "",
  totalBirds: "",
  farmCapacity: "",
  shedType: "",
  poultryValue: "",
  shedValue: "",
  equipmentValue: "",
  vaccinationStatus: "",
  bioSecurity: "",
  existingPoultryPolicy: "",
  farmAddress: "",
  poultryNotes: "",

  /* Livestock */
  livestockType: "",
  animalCount: "",
  breed: "",
  averageAge: "",
  livestockValue: "",
  livestockPurpose: "",
  housingType: "",
  existingLivestockInsurance: "",
  livestockNotes: "",

  /* Agriculture */
  agricultureType: "",
  landArea: "",
  cropType: "",
  agricultureValue: "",
  irrigation: "",
  cropSeason: "",
  existingCropInsurance: "",
  village: "",
  mandal: "",
  district: "",

  /* Marine */
  transitType: "",
  shipmentType: "",
  cargoType: "",
  cargoValue: "",
  origin: "",
  destination: "",
  shipmentFrequency: "",
  packagingType: "",
  carrier: "",
  annualTransitValue: "",
  marineNotes: "",

  /* Travel */
  travelType: "",
  destinationCountry: "",
  departureDate: "",
  returnDate: "",
  travellerAge: "",
  travellerCount: "",
  passportAvailable: "",
  travelMedical: "",
  tripCost: "",
  travelCover: "",
  travelPurpose: "",
  travelNotes: "",

  /* Employee */
  companyName: "",
  industry: "",
  employeeCount: "",
  employeeCoverType: "",
  employeeSumInsured: "",
  annualPayroll: "",
  hrContact: "",
  hrMobile: "",
  hrEmail: "",
  companyAddress: "",
  employeeNotes: "",
};

/* ===========================================================
   VALIDATION HELPERS
=========================================================== */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validateEmail(email) {
  if (!email) return true;
  return EMAIL_REGEX.test(email);
}

export function validateMobile(mobile) {
  return MOBILE_REGEX.test(mobile);
}

export function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export function formatCurrency(value) {
  if (!value) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/* ===========================================================
   HELPER COMPONENT: EMPTY STATE
=========================================================== */

function EmptyState({ height = 200, icon = "bi-app", title, description }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center p-3"
      style={{ minHeight: height }}
    >
      <i className={`bi ${icon} text-muted mb-2`} style={{ fontSize: "2rem" }}></i>
      {title && <h6 className="fw-bold text-muted mb-1">{title}</h6>}
      {description && <small className="text-muted">{description}</small>}
    </div>
  );
}

/* ===========================================================
   MAIN COMPONENT
=========================================================== */

export default function InsuranceQuote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* State */
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [reference, setReference] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [stepAnimation, setStepAnimation] = useState(true);

  const stepContainerRef = useRef(null);

  /* Memoized Values */
  const selectedInsurance = useMemo(() => {
    return INSURANCE_TYPES.find((item) => item.value === form.insuranceType);
  }, [form.insuranceType]);

  const currentStepName = useMemo(() => {
    return STEPS[step];
  }, [step]);

  const isFirstStep = step === 0;
  const isLastStep = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  /* Handle Query Params for Auto-Selecting Type */
  useEffect(() => {
    const queryType = searchParams.get("type");
    if (queryType && INSURANCE_TYPES.some((t) => t.value === queryType)) {
      setForm((prev) => ({ ...prev, insuranceType: queryType }));
    }
  }, [searchParams]);

  /* Load Initial Data */
  useEffect(() => {
    //loadQuotes();
  }, []);

  /* Auto Scroll when Step Changes */
  useEffect(() => {
    if (!stepContainerRef.current) return;
    stepContainerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step]);

  /* Keyboard Navigation Listener */
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (isTyping) return;

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
      if (
    e.key === "Enter" &&
    e.ctrlKey &&
    isLastStep
) {
    e.preventDefault();
    handleSubmit();
}
      if (e.key === "Escape") clearErrors();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, form, isLastStep]);

  /* ===========================================================
     INSURANCE API HELPERS
     =========================================================== */

  const INSURANCE_API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:4000";

  function createLocalReference() {
    const timestamp =
      Date.now().toString().slice(-8);

    const random =
      Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `GI-${timestamp}-${random}`;
  }

  async function requestQuotesDirectly({
    reference,
    insuranceType,
    lead,
  }) {
    const response = await fetch(
      `${INSURANCE_API_BASE}/api/insurance/quotes`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference,
          insuranceType,
          lead,
        }),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      data = {
        success: response.ok,
        message:
          text || "Unexpected server response.",
      };
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Insurance API request failed (${response.status})`
      );
    }

    return data;
  }

  async function loadQuotes() {
    /*
     * Quotes are returned by the POST /quotes request.
     * We intentionally do not call the legacy GET /insurance
     * endpoint here because it is not the insurer quote pipeline.
     */
    return [];
  }

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setErrors({});
    setValidationErrors([]);
    setReference("");
    setApiError("");
    setSubmitSuccess(false);
    setStep(0);
  }

  function clearErrors() {
    setErrors({});
    setValidationErrors([]);
    setApiError("");
  }

  /* Step Navigation logic */
  function previousStep() {
    if (step <= 0) return;
    setStepAnimation(false);
    setTimeout(() => {
      setStep((previous) => previous - 1);
      setStepAnimation(true);
    }, 180);
  }

  function nextStep() {
    clearErrors();
    const validation = validateCurrentStep();
    if (!validation.valid) {
      setErrors(validation.errors);
      setValidationErrors(buildValidationSummary(validation.errors));
      return;
    }

    if (step >= STEPS.length - 1) return;

    setStepAnimation(false);
    setTimeout(() => {
      setStep((previous) => previous + 1);
      setStepAnimation(true);
    }, 180);
  }

  /* Step Validations */
  function validateCurrentStep() {
    switch (step) {
      case 0:
        return validateInsuranceStep();
      case 1:
        return validateCustomerStep();
      case 2:
        return validateCoverageStep();
      default:
        return { valid: true, errors: {} };
    }
  }

  function validateInsuranceStep() {
    const errors = {};
    if (isEmpty(form.insuranceType)) {
      errors.insuranceType = "Please select an insurance type.";
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateCustomerStep() {
    const errors = {};
    if (isEmpty(form.name)) errors.name = "Name is required.";
    if (!validateMobile(form.mobile)) errors.mobile = "Enter valid mobile number.";
    if (form.email && !validateEmail(form.email)) errors.email = "Invalid email.";
    if (isEmpty(form.city)) errors.city = "City is required.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateCoverageStep() {
    switch (form.insuranceType) {
      case "health":
        return validateHealth();
      case "motor":
        return validateMotor();
      case "life":
        return validateLife();
      case "business":
        return validateBusiness();
      case "property":
        return validateProperty();
      case "industrial":
        return validateIndustrial();
      case "poultry":
        return validatePoultry();
      case "livestock":
        return validateLivestock();
      case "agriculture":
        return validateAgriculture();
      case "marine":
        return validateMarine();
      case "travel":
        return validateTravel();
      case "employee":
        return validateEmployee();
      default:
        return { valid: true, errors: {} };
    }
  }

  function validateHealth() {
    const errors = {};
    if (isEmpty(form.healthFor)) errors.healthFor = "Select insurance for.";
    if (isEmpty(form.age)) errors.age = "Age is required.";
    if (isEmpty(form.healthCover)) errors.healthCover = "Select sum insured.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateMotor() {
    const errors = {};
    if (isEmpty(form.vehicleType)) errors.vehicleType = "Select vehicle type.";
    if (isEmpty(form.vehicleMake)) errors.vehicleMake = "Manufacturer is required.";
    if (isEmpty(form.vehicleModel)) errors.vehicleModel = "Vehicle model is required.";
    if (isEmpty(form.manufacturingYear)) errors.manufacturingYear = "Manufacturing year is required.";
    if (isEmpty(form.idv)) errors.idv = "Vehicle value is required.";
    if (isEmpty(form.policyType)) errors.policyType = "Select policy type.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateLife() {
    const errors = {};
    if (isEmpty(form.lifeInsuranceType)) errors.lifeInsuranceType = "Select insurance type.";
    if (isEmpty(form.lifeAge)) errors.lifeAge = "Age is required.";
    if (isEmpty(form.gender)) errors.gender = "Select gender.";
    if (isEmpty(form.occupation)) errors.occupation = "Occupation is required.";
    if (isEmpty(form.annualIncome)) errors.annualIncome = "Annual income is required.";
    if (isEmpty(form.sumAssured)) errors.sumAssured = "Select sum assured.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateBusiness() {
    const errors = {};
    if (isEmpty(form.businessName)) errors.businessName = "Business name is required.";
    if (isEmpty(form.businessType)) errors.businessType = "Select business type.";
    if (isEmpty(form.annualTurnover)) errors.annualTurnover = "Annual turnover is required.";
    if (isEmpty(form.businessCover)) errors.businessCover = "Select insurance cover.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateProperty() {
    const errors = {};
    if (isEmpty(form.propertyType)) errors.propertyType = "Select property type.";
    if (isEmpty(form.ownership)) errors.ownership = "Select ownership.";
    if (isEmpty(form.buildingValue)) errors.buildingValue = "Building value is required.";
    if (isEmpty(form.propertyCover)) errors.propertyCover = "Select insurance cover.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateIndustrial() {
    const errors = {};
    if (isEmpty(form.industryName)) errors.industryName = "Industry name is required.";
    if (isEmpty(form.industryType)) errors.industryType = "Select industry type.";
    if (isEmpty(form.industrialTurnover)) errors.industrialTurnover = "Annual turnover is required.";
    if (isEmpty(form.industrialCover)) errors.industrialCover = "Select insurance cover.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validatePoultry() {
    const errors = {};
    if (isEmpty(form.farmName)) errors.farmName = "Farm name is required.";
    if (isEmpty(form.poultryType)) errors.poultryType = "Select poultry type.";
    if (isEmpty(form.totalBirds)) errors.totalBirds = "Enter total birds.";
    if (isEmpty(form.poultryValue)) errors.poultryValue = "Enter poultry value.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateLivestock() {
    const errors = {};
    if (isEmpty(form.livestockType)) errors.livestockType = "Select livestock type.";
    if (isEmpty(form.animalCount)) errors.animalCount = "Enter number of animals.";
    if (isEmpty(form.livestockValue)) errors.livestockValue = "Enter livestock value.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateAgriculture() {
    const errors = {};
    if (isEmpty(form.agricultureType)) errors.agricultureType = "Select agriculture type.";
    if (isEmpty(form.landArea)) errors.landArea = "Land area is required.";
    if (isEmpty(form.cropType)) errors.cropType = "Crop type is required.";
    if (isEmpty(form.agricultureValue)) errors.agricultureValue = "Estimated crop value is required.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateMarine() {
    const errors = {};
    if (isEmpty(form.transitType)) errors.transitType = "Select transit type.";
    if (isEmpty(form.shipmentType)) errors.shipmentType = "Select shipment type.";
    if (isEmpty(form.cargoType)) errors.cargoType = "Cargo description is required.";
    if (isEmpty(form.cargoValue)) errors.cargoValue = "Cargo value is required.";
    if (isEmpty(form.origin)) errors.origin = "Origin is required.";
    if (isEmpty(form.destination)) errors.destination = "Destination is required.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateTravel() {
    const errors = {};
    if (isEmpty(form.travelType)) errors.travelType = "Select travel type.";
    if (isEmpty(form.destinationCountry)) errors.destinationCountry = "Destination country is required.";
    if (isEmpty(form.departureDate)) errors.departureDate = "Departure date is required.";
    if (isEmpty(form.returnDate)) errors.returnDate = "Return date is required.";
    if (isEmpty(form.travellerAge)) errors.travellerAge = "Traveller age is required.";
    if (isEmpty(form.travellerCount)) errors.travellerCount = "Number of travellers is required.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function validateEmployee() {
    const errors = {};
    if (isEmpty(form.companyName)) errors.companyName = "Company name is required.";
    if (isEmpty(form.industry)) errors.industry = "Industry is required.";
    if (isEmpty(form.employeeCount)) errors.employeeCount = "Employee count is required.";
    if (isEmpty(form.employeeCoverType)) errors.employeeCoverType = "Select insurance type.";
    if (isEmpty(form.employeeSumInsured)) errors.employeeSumInsured = "Select sum insured.";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function buildValidationSummary(errs) {
    return Object.values(errs).filter(Boolean);
  }

  /* Form Submission Handler */
  async function handleSubmit(e, options = {}) {
    if (e) e.preventDefault();

    const redirectToCompare =
      options?.redirectToCompare === true;

    clearErrors();

    const validation = validateCurrentStep();

    if (!validation.valid) {
      setErrors(validation.errors);
      setValidationErrors(
        buildValidationSummary(validation.errors)
      );
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      /*
       * CORRECT PIPELINE
       *
       * InsuranceQuote
       *      ↓
       * POST /api/insurance/quotes
       *      ↓
       * Quote providers
       *
       * DO NOT call /api/insurance/journey here.
       * Journey requires a reference + quoteId and belongs
       * to the "View Plan / Buy" stage.
       */

      const reference =
        createLocalReference();

      const lead = {
        ...form,
        reference,
        source: "GoSubsidy Insurance",
        status: "QUOTE_REQUESTED",
        demoMode: true,
        demoProviderId: "demo-alpha",
        demoProviderName: "Demo Insurer Alpha",
        demoProviderMode: "MOCK",
        submittedAt:
          new Date().toISOString(),
      };

      const response =
        await requestQuotesDirectly({
          reference,
          insuranceType:
            form.insuranceType,
          lead,
        });

      console.log(
        "[GoSubsidy Insurance] /quotes response:",
        response
      );

      const finalReference =
        response?.reference ||
        reference;

      setReference(finalReference);

      setQuotes(
        Array.isArray(response?.quotes)
          ? response.quotes
          : []
      );

      setValidationErrors([]);
      setErrors({});
      setApiError("");
      setSubmitSuccess(true);

      sessionStorage.setItem(
        "gosubsidyInsuranceLead",
        JSON.stringify({
          ...lead,
          reference: finalReference,
        })
      );

      sessionStorage.setItem(
        "gosubsidyInsuranceQuoteSession",
        JSON.stringify({
          ...response,
          reference: finalReference,
          insuranceType:
            form.insuranceType,
          lead,
        })
      );

      /*
       * COMPARE & BUY ONLINE
       * The quote API succeeds first; then the existing
       * comparison page is opened with the valid reference.
       */
      if (redirectToCompare) {
        navigate(
          `/insurance/compare?type=${encodeURIComponent(
            form.insuranceType
          )}&ref=${encodeURIComponent(
            finalReference
          )}&demo=true&provider=demo-alpha`
        );
        return;
      }

    } catch (error) {
      console.error(
        "[GoSubsidy Insurance] Quote submission failed:",
        error
      );

      setApiError(
        error?.message ||
          "Unable to submit your insurance quotation."
      );

      setValidationErrors([
        error?.message ||
          "Unable to submit your quotation. Please try again.",
      ]);

    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    nextStep();
  }

  function handlePrevious() {
    previousStep();
  }

  function openComparePage() {
    navigate(
      `/insurance/compare?type=${encodeURIComponent(
        form.insuranceType
      )}&ref=${encodeURIComponent(
        reference
      )}&demo=true&provider=demo-alpha`
    );
  }

  /* Render Active Step Components */
  function renderCurrentStep() {
    switch (step) {
      case 0:
        return (
          <InsuranceTypeStep
            insuranceTypes={INSURANCE_TYPES}
            selectedType={form.insuranceType}
            error={errors.insuranceType}
            onSelect={(value) => updateField("insuranceType", value)}
          />
        );
      case 1:
        return (
          <CustomerStep
            form={form}
            errors={errors}
            updateField={updateField}
          />
        );
      case 2:
        return (
          <CoverageStep
            form={form}
            errors={errors}
            updateField={updateField}
          />
        );
      case 3:
        return (
          <ReviewStep
            form={form}
            reference={reference}
            loading={loading}
            submitSuccess={submitSuccess}
            apiError={apiError}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            onCompare={openComparePage}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="container-fluid py-4">
      <LoadingOverlay
        show={loading}
        title="Generating Quotes"
        message="Comparing premiums from multiple insurance companies. Please wait..."
      />

      <div className="row g-4">
        {/* LEFT COLUMN */}
        <div className="col-xl-8 col-lg-8">
          <div className="p-2 p-lg-3">
            {/* Progress Bar */}
            <GlassCard className="mb-4">
              <ProgressBar
                currentStep={step}
                steps={STEPS}
                progress={progress}
              />
            </GlassCard>

            {/* Validation Errors Summary */}
            {validationErrors.length > 0 && (
              <GlassCard
                className="mb-4 border-danger"
                title="Please correct the following"
                icon="bi-exclamation-triangle-fill"
              >
                <div className="alert alert-danger mb-0">
                  <ul className="mb-0 ps-3">
                    {validationErrors.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            )}

            {/* Form Step Card */}
            <StepCard
              step={step + 1}
              totalSteps={STEPS.length}
              title={currentStepName}
              subtitle="Complete the information below to continue."
              active
              icon={
                step === 0
                  ? "bi-shield-check"
                  : step === 1
                  ? "bi-person"
                  : step === 2
                  ? "bi-list-check"
                  : "bi-check2-circle"
              }
              footer={
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 w-100">
                  {/* Previous */}
                  <SecondaryButton
                    icon="bi-arrow-left"
                    onClick={handlePrevious}
                    disabled={loading || isFirstStep}
                  >
                    Previous
                  </SecondaryButton>

                  {/* Continue / Submit */}
                  <div className="d-flex gap-3">
                    {!isLastStep && (
                      <PrimaryButton icon="bi-arrow-right" onClick={handleNext}>
                        Continue
                      </PrimaryButton>
                    )}

                    {isLastStep && (
                      <GradientButton
                        icon="bi-shield-check"
                        loading={loading}
                        
                        onClick={(e) =>
                          handleSubmit(e, {
                            redirectToCompare: true,
                          })
                        }
                      >
                        Compare & Buy Online
                      </GradientButton>
                    )}
                  </div>
                </div>
              }
            >
              <div className="animate__animated animate__fadeIn">
                <div
                  ref={stepContainerRef}
                  style={{
                    transition: "all .35s ease",
                    opacity: stepAnimation ? 1 : 0,
                    transform: stepAnimation
                      ? "translateY(0px)"
                      : "translateY(20px)",
                  }}
                >
                  {renderCurrentStep()}
                </div>
              </div>
            </StepCard>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-xl-4 col-lg-4">
          <div className="sticky-top p-2 p-lg-3" style={{ top: "20px" }}>
            {/* Selected Insurance Product */}
            <GlassCard
              className="mb-4"
              title="Selected Insurance"
              subtitle="Current Selection"
              icon="bi-shield-check"
            >
              {selectedInsurance ? (
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 18,
                        background:
                          "linear-gradient(135deg, #0d6efd, #20c997)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        fontSize: 28,
                      }}
                    >
                      <i className={`bi ${selectedInsurance.icon}`}></i>
                    </div>
                    <div className="ms-3">
                      <h5 className="fw-bold mb-1">
                        {selectedInsurance.label}
                      </h5>
                      <div className="text-muted small">
                        {selectedInsurance.description}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  height={150}
                  icon="bi-shield"
                  title="No Insurance Selected"
                  description="Choose an insurance product to continue."
                />
              )}
            </GlassCard>

            {/* Insurance Trust Indicators */}
            <GlassCard className="mb-4" title="Why Choose GoSubsidy?" icon="bi-award">
              <div className="d-flex mb-3">
                <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                <div>
                  <strong>30+ Insurance Partners</strong>
                  <div className="text-muted small">
                    Compare multiple insurers instantly.
                  </div>
                </div>
              </div>

              <div className="d-flex mb-3">
                <i className="bi bi-lightning-charge-fill text-warning me-3 fs-5"></i>
                <div>
                  <strong>Instant Quotes</strong>
                  <div className="text-muted small">
                    Real-time premium comparison.
                  </div>
                </div>
              </div>

              <div className="d-flex mb-3">
                <i className="bi bi-shield-lock-fill text-primary me-3 fs-5"></i>
                <div>
                  <strong>Secure Application</strong>
                  <div className="text-muted small">
                    Your information is encrypted.
                  </div>
                </div>
              </div>

              <div className="d-flex">
                <i className="bi bi-headset text-danger me-3 fs-5"></i>
                <div>
                  <strong>Expert Advisors</strong>
                  <div className="text-muted small">
                    24×7 support for all insurance products.
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Support Action */}
            <GlassCard
              title="Need Assistance?"
              subtitle="Our insurance experts are here to help."
              icon="bi-headset"
            >
              <PrimaryButton fullWidth icon="bi-telephone-fill">
                Talk to an Advisor
              </PrimaryButton>

              <SecondaryButton
                fullWidth
                className="mt-3"
                icon="bi-chat-dots-fill"
              >
                Live Chat
              </SecondaryButton>
            </GlassCard>
          </div>
        </div>
      </div>
<SuccessModal
    show={submitSuccess}
    title="Insurance Quote Submitted"
    message="Your insurance quotation request has been submitted successfully."

    reference={reference}

    primaryText="Compare Quotes"

    secondaryText="Create Another"

    onPrimary={openComparePage}

    onSecondary={resetForm}
/>
    </div>
  );
}