import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_AI_API_URL ||
  "http://localhost:4000/api/ai/recommend";

/* =========================================================
   GO SUBSIDY AI ADVISOR — MODERN CUSTOMER-FIRST VERSION
   Bootstrap 5 + Bootstrap Icons
========================================================= */

const formatCurrency = (value) => {
  if (value === "" || value === null || value === undefined) return "";

  const number = Number(value);
  if (Number.isNaN(number)) return value;

  return number.toLocaleString("en-IN");
};

const BUSINESS_OPTIONS = [
  "MSME",
  "Agriculture",
  "Poultry",
  "Dairy",
  "Food Processing",
  "Solar",
  "Manufacturing",
  "Cold Storage",
  "Renewable Energy",
  "Textiles",
  "Healthcare",
  "Tourism",
];

const STATE_OPTIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

/* =========================================================
   SERVICE CATALOG
========================================================= */

const SERVICES = [
  {
    id: "subsidy",
    icon: "bi-stars",
    title: "Find Subsidy",
    subtitle: "Discover funding support",
    category: "Funding",
    accent: "#087b77",
    prompt:
      "Find the best Government subsidy schemes for my project. Rank the most relevant Central and State schemes and explain subsidy benefit, eligibility and application route.",
  },
  {
    id: "eligibility",
    icon: "bi-patch-check",
    title: "Check Eligibility",
    subtitle: "Know what you qualify for",
    category: "Funding",
    accent: "#087b77",
    prompt:
      "Check my eligibility for relevant Government subsidy schemes. Explain which schemes I may qualify for and identify important eligibility gaps.",
  },
  {
    id: "compare",
    icon: "bi-bar-chart-line",
    title: "Compare Schemes",
    subtitle: "See the best options",
    category: "Funding",
    accent: "#087b77",
    prompt:
      "Compare the most suitable Government schemes for my project. Compare subsidy amount, eligible project cost, promoter contribution, loan requirements, eligibility and major conditions.",
  },
  {
    id: "loan",
    icon: "bi-bank",
    title: "Business Loan",
    subtitle: "Explore finance options",
    category: "Finance",
    accent: "#1769e0",
    prompt:
      "Analyse suitable Government-supported business loan options for my project. Explain possible term loan, promoter contribution, credit guarantee and subsidy-linked financing options.",
  },
  {
    id: "dpr",
    icon: "bi-file-earmark-bar-graph",
    title: "Prepare DPR",
    subtitle: "Create a bank-ready report",
    category: "Business",
    accent: "#e59a00",
    route: "/dpr",
  },
  {
    id: "documents",
    icon: "bi-folder-check",
    title: "Documents",
    subtitle: "Get your checklist",
    category: "Business",
    accent: "#1769e0",
    prompt:
      "Prepare a practical document checklist for Government subsidy and bank loan applications. Group documents into promoter KYC, business, land/building, machinery, financial, bank and subsidy documents.",
  },
  {
    id: "registration",
    icon: "bi-building-check",
    title: "Registrations",
    subtitle: "Find required approvals",
    category: "Business",
    accent: "#1769e0",
    prompt:
      "Tell me the important registrations, licences and approvals normally required for my business/project. Separate mandatory approvals from conditional or activity-specific approvals.",
  },
  {
    id: "project-cost",
    icon: "bi-calculator",
    title: "Project Cost",
    subtitle: "Plan your investment",
    category: "Business",
    accent: "#1769e0",
    prompt:
      "Help me structure my project cost. Explain major capital cost, working capital, promoter contribution, bank finance and subsidy-linked funding components.",
  },
  {
    id: "cibil",
    icon: "bi-speedometer2",
    title: "CIBIL & Credit",
    subtitle: "Improve loan readiness",
    category: "Credit",
    accent: "#635bff",
    prompt:
      "Help me understand my credit profile and how to improve my chances of business loan approval. Give a practical credit-readiness checklist.",
  },
  {
    id: "emi",
    icon: "bi-percent",
    title: "EMI Calculator",
    subtitle: "Estimate monthly repayment",
    category: "Credit",
    accent: "#635bff",
    prompt:
      "Help me estimate a suitable business loan EMI. Ask for loan amount, interest rate and tenure if they are not available, and explain the repayment impact.",
  },
  {
    id: "loan-eligibility",
    icon: "bi-check2-circle",
    title: "Loan Eligibility",
    subtitle: "Check borrowing readiness",
    category: "Credit",
    accent: "#635bff",
    prompt:
      "Assess my likely business loan readiness using my project profile. Explain key factors banks consider, possible gaps and what documents or financial information I should prepare.",
  },
  {
    id: "insurance",
    icon: "bi-shield-check",
    title: "Insurance",
    subtitle: "Protect your business",
    category: "Protection",
    accent: "#e56b2f",
    prompt:
      "Explain the important insurance categories relevant to my business/project, what each protects, typical documentation and what I should verify before purchasing.",
  },
];

const CATEGORIES = [
  {
    id: "all",
    label: "All Services",
    icon: "bi-grid-1x2",
  },
  {
    id: "Funding",
    label: "Funding",
    icon: "bi-cash-coin",
  },
  {
    id: "Business",
    label: "Business",
    icon: "bi-building",
  },
  {
    id: "Finance",
    label: "Finance",
    icon: "bi-bank",
  },
  {
    id: "Credit",
    label: "Credit",
    icon: "bi-graph-up-arrow",
  },
  {
    id: "Protection",
    label: "Protection",
    icon: "bi-shield-check",
  },
];

/* =========================================================
   MAIN
========================================================= */

export default function AIAdvisor() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingData = location.state || {};

  const autoRequestSent = useRef(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const [business, setBusiness] = useState(
    incomingData.business || incomingData.category || ""
  );
  const [state, setState] = useState(incomingData.state || "");
  const [projectCost, setProjectCost] = useState(
    incomingData.projectCost || ""
  );

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState("all");
  const [showProject, setShowProject] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [recentService, setRecentService] = useState(null);

  const projectReady = useMemo(
    () =>
      Boolean(
        business &&
          state &&
          projectCost &&
          Number(projectCost) > 0
      ),
    [business, state, projectCost]
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return SERVICES;

    return SERVICES.filter(
      (service) => service.category === activeCategory
    );
  }, [activeCategory]);

  const visibleServices = showAllServices
    ? filteredServices
    : filteredServices.slice(0, 8);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* =======================================================
     AI
  ======================================================= */

  const callAI = async ({
    userQuestion,
    selectedBusiness = business,
    selectedState = state,
    selectedProjectCost = projectCost,
    showUserMessage = true,
  }) => {
    const cleanQuestion = userQuestion?.trim();

    if (!cleanQuestion || loading) return;

    // IMPORTANT:
    // Customers can ask questions even before creating a project profile.
    // Project details are optional context, not a gate for using GoSubsidy AI.
    if (showUserMessage) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: cleanQuestion,
        },
      ]);
    }

    setChatOpen(true);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: {
            category: selectedBusiness || null,
            sector: selectedBusiness || null,
            business: selectedBusiness || null,
            businessType: selectedBusiness || null,
            state: selectedState || null,
            projectCost:
              selectedProjectCost &&
              Number(selectedProjectCost) > 0
                ? Number(selectedProjectCost)
                : null,
            investment:
              selectedProjectCost &&
              Number(selectedProjectCost) > 0
                ? Number(selectedProjectCost)
                : null,

            // Tell the backend this is a general customer-facing
            // GoSubsidy assistant and not only a subsidy calculator.
            assistant: "GoSubsidy AI Advisor",
            mode: "general_customer_assistant",
            capabilities: [
              "government subsidies",
              "central and state government schemes",
              "scheme eligibility",
              "subsidy amount and benefits",
              "business loans and project finance",
              "loan eligibility and documentation",
              "DPR preparation",
              "project cost planning",
              "CIBIL and credit guidance",
              "EMI guidance",
              "business registrations and approvals",
              "insurance and business protection",
              "application process and next steps",
              "documents and checklists",
              "general business finance guidance",
            ],
            question: cleanQuestion,
          },

          // The direct customer question.
          question: cleanQuestion,

          // Send recent conversation so follow-up questions such as
          // "what about women entrepreneurs?" retain context.
          conversation: messages
            .slice(-12)
            .map((message) => ({
              role: message.role,
              content: message.text,
            })),

          // Helps the backend understand that project information
          // may be incomplete and should be requested only when needed.
          projectProfile: {
            business: selectedBusiness || null,
            state: selectedState || null,
            projectCost:
              selectedProjectCost &&
              Number(selectedProjectCost) > 0
                ? Number(selectedProjectCost)
                : null,
            complete: Boolean(
              selectedBusiness &&
                selectedState &&
                selectedProjectCost &&
                Number(selectedProjectCost) > 0
            ),
          },

          language: "English",
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from backend."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `AI service returned HTTP ${response.status}`
        );
      }

      const aiAnswer =
        data?.advice ||
        data?.answer ||
        data?.response ||
        data?.message ||
        "";

      if (!aiAnswer) {
        throw new Error(
          "AI returned an empty answer."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: String(aiAnswer),
        },
      ]);
    } catch (error) {
      console.error(
        "GoSubsidy AI Advisor Error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "I couldn't complete that answer right now.\n\n" +
            `${error.message}\n\n` +
            "Please try again. If your question needs project-specific information, I'll ask you for the missing details.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL STATE
  ======================================================= */

  useEffect(() => {
    const selectedBusiness =
      incomingData.business ||
      incomingData.category ||
      "";

    const selectedState = incomingData.state || "";
    const selectedProjectCost =
      incomingData.projectCost || "";

    if (
      selectedBusiness &&
      selectedState &&
      selectedProjectCost &&
      !autoRequestSent.current
    ) {
      autoRequestSent.current = true;

      const autoQuestion =
        incomingData.autoQuestion ||
        `Analyse my ${selectedBusiness} project in ${selectedState} with a project cost of ₹${formatCurrency(
          selectedProjectCost
        )}. Identify the most relevant Central Government and State Government subsidy schemes, incentives, grants and loan support. Explain eligibility, estimated benefits, important conditions, documents and next steps.`;

      setMessages([
        {
          role: "assistant",
          text:
            `Great — I have your project details.\n\n` +
            `${selectedBusiness} • ${selectedState} • ₹${formatCurrency(
              selectedProjectCost
            )}\n\n` +
            `I'm checking subsidy, scheme and financing opportunities for you now.`,
        },
      ]);

      callAI({
        userQuestion: autoQuestion,
        selectedBusiness,
        selectedState,
        selectedProjectCost,
        showUserMessage: false,
      });
    } else if (!autoRequestSent.current) {
      autoRequestSent.current = true;

      setMessages([
        {
          role: "assistant",
          text:
            "Hi! I'm your GoSubsidy AI assistant 👋\n\n" +
            "Tell me what you're trying to achieve — subsidy, loan, DPR, documents, CIBIL or business support — and I'll guide you step by step.",
        },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     PROJECT
  ======================================================= */

  const saveProject = () => {
    if (!business) {
      alert("Please select your Business / Sector.");
      return;
    }

    if (!state) {
      alert("Please select your Project State.");
      return;
    }

    if (
      !projectCost ||
      Number(projectCost) <= 0
    ) {
      alert("Please enter a valid Project Cost.");
      return;
    }

    setShowProject(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          `Your project is ready 🎯\n\n` +
          `${business} • ${state} • ₹${formatCurrency(
            projectCost
          )}\n\n` +
          `You can now use any GoSubsidy service with this project profile.`,
      },
    ]);
  };

  /* =======================================================
     SERVICE
  ======================================================= */

  const handleService = (service) => {
    setRecentService(service.id);

    if (service.route) {
      navigate(service.route, {
        state: {
          business,
          state,
          projectCost,
        },
      });
      return;
    }

    if (service.id === "emi") {
      const emiQuestion =
        "I want to calculate my business loan EMI. Please guide me on the loan amount, interest rate and tenure I should enter and explain the repayment impact.";

      callAI({
        userQuestion: emiQuestion,
        selectedBusiness: business,
        selectedState: state,
        selectedProjectCost: projectCost,
        showUserMessage: true,
      });
      return;
    }

    callAI({
      userQuestion:
        `${service.prompt} ` +
        `${
          business && state && projectCost
            ? `My project is ${business} in ${state} with a project cost of ₹${formatCurrency(
                projectCost
              )}.`
            : "Use my available project details and tell me what information you need next."
        }`,
      selectedBusiness: business,
      selectedState: state,
      selectedProjectCost: projectCost,
      showUserMessage: true,
    });
  };

  /* =======================================================
     CHAT
  ======================================================= */

  const sendMessage = async () => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setQuestion("");

    await callAI({
      userQuestion: cleanQuestion,
      selectedBusiness: business,
      selectedState: state,
      selectedProjectCost: projectCost,
      showUserMessage: true,
    });
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text:
          "Fresh start ✨\n\nYour project details are still saved. What would you like to do next?",
      },
    ]);
  };

  const askQuickQuestion = (text) => {
    setQuestion(text);
    setChatOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
  };

  /* =======================================================
     STYLES
  ======================================================= */

  const card = {
    background: "#ffffff",
    border: "1px solid #e8edf4",
    borderRadius: "22px",
    boxShadow:
      "0 12px 36px rgba(18,42,72,.055)",
  };

  const iconBox = (accent) => ({
    width: "48px",
    height: "48px",
    borderRadius: "15px",
    background: `${accent}12`,
    color: accent,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      style={{
        minHeight: "calc(100vh - 75px)",
        background:
          "linear-gradient(180deg,#f5f9ff 0%,#f8fafc 45%,#f5f7fb 100%)",
        paddingBottom: "70px",
      }}
    >
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        style={{
          background:
            "linear-gradient(135deg,#061b3a 0%,#073b75 52%,#07857c 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            right: "-160px",
            top: "-280px",
            background:
              "rgba(63,247,207,.12)",
            filter: "blur(18px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            left: "-160px",
            bottom: "-190px",
            background:
              "rgba(45,124,255,.13)",
            filter: "blur(18px)",
          }}
        />

        <div className="container position-relative py-4 py-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "22px",
                    background:
                      "linear-gradient(145deg,rgba(255,255,255,.20),rgba(255,255,255,.05))",
                    border:
                      "1px solid rgba(255,255,255,.25)",
                    boxShadow:
                      "0 15px 45px rgba(0,0,0,.20)",
                  }}
                >
                  <i
                    className="bi bi-robot"
                    style={{
                      fontSize: "36px",
                      color: "#72f4d2",
                    }}
                  />
                </div>

                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <h1
                      className="text-white fw-bold mb-0"
                      style={{
                        fontSize:
                          "clamp(25px,3vw,38px)",
                        letterSpacing: "-.7px",
                      }}
                    >
                      GoSubsidy AI
                    </h1>

                    <span
                      className="badge rounded-pill"
                      style={{
                        color: "#6cf1d0",
                        background:
                          "rgba(42,242,191,.13)",
                        border:
                          "1px solid rgba(108,241,208,.25)",
                        padding: "7px 11px",
                      }}
                    >
                      ● ONLINE
                    </span>
                  </div>

                  <p
                    className="mb-0 mt-2"
                    style={{
                      color:
                        "rgba(255,255,255,.78)",
                      fontSize: "15px",
                      maxWidth: "720px",
                    }}
                  >
                    Your simple starting point for
                    subsidies, loans, DPR, documents,
                    credit and business support.
                  </p>
                </div>
              </div>

              {/* HERO TRUST PILLS */}
              <div className="d-flex flex-wrap gap-2 mt-4">
                {[
                  ["bi-lightning-charge", "Quick guidance"],
                  ["bi-stars", "AI assisted"],
                  ["bi-geo-alt", "Central + State"],
                  ["bi-shield-check", "Step-by-step"],
                ].map(([icon, text]) => (
                  <span
                    key={text}
                    className="rounded-pill px-3 py-2"
                    style={{
                      color:
                        "rgba(255,255,255,.84)",
                      background:
                        "rgba(255,255,255,.08)",
                      border:
                        "1px solid rgba(255,255,255,.12)",
                      fontSize: "11px",
                    }}
                  >
                    <i className={`bi ${icon} me-1`} />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="p-3 p-lg-4 rounded-4"
                style={{
                  background:
                    "rgba(255,255,255,.08)",
                  border:
                    "1px solid rgba(255,255,255,.14)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    color:
                      "rgba(255,255,255,.58)",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: ".8px",
                  }}
                >
                  YOUR PROJECT
                </div>

                <div className="text-white fw-bold mt-1">
                  {business ||
                    "Let's set up your project"}
                </div>

                <div
                  className="small mt-1"
                  style={{
                    color: "#70e8ca",
                  }}
                >
                  {projectReady
                    ? `${state} • ₹${formatCurrency(
                        projectCost
                      )}`
                    : "One profile unlocks personalised help"}
                </div>

                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-3 mt-3"
                  onClick={() =>
                    setShowProject(true)
                  }
                  style={{
                    background: "#ffffff",
                    color: "#073b75",
                    fontWeight: 700,
                    border: 0,
                  }}
                >
                  <i className="bi bi-sliders me-1" />
                  {projectReady
                    ? "Update project"
                    : "Set up project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-4 mt-lg-5">
        {/* =================================================
            SMART AI SEARCH
        ================================================= */}

        <div
          style={{
            ...card,
            padding: "8px",
            marginBottom: "22px",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                ...iconBox("#1769e0"),
                width: "46px",
                height: "46px",
              }}
            >
              <i className="bi bi-stars fs-5" />
            </div>

            <input
              type="text"
              aria-label="Ask GoSubsidy AI"
              className="form-control border-0 shadow-none"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="What do you need help with today?"
              style={{
                height: "50px",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              className="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
              onClick={sendMessage}
              disabled={
                loading || !question.trim()
              }
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "15px",
              }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <i className="bi bi-arrow-up" />
              )}
            </button>
          </div>

          <div
            className="px-3 pb-2 pt-1"
            style={{
              color: "#8995a7",
              fontSize: "10px",
            }}
          >
            <i className="bi bi-magic text-primary me-1" />
            Ask anything about subsidies, schemes, loans, DPR,
            CIBIL, documents, registrations, insurance or
            starting/growing your business.
          </div>
        </div>

        {/* =================================================
            PROJECT SETUP
        ================================================= */}

        {showProject && (
          <div
            style={{
              ...card,
              padding: "22px",
              marginBottom: "22px",
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div
                  className="text-primary fw-bold"
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".8px",
                  }}
                >
                  QUICK PROJECT SETUP
                </div>

                <h4 className="fw-bold mb-1 mt-1">
                  Let's personalise GoSubsidy for you
                </h4>

                <div
                  className="text-muted"
                  style={{ fontSize: "12px" }}
                >
                  Add these details once. We'll use them
                  across your services.
                </div>
              </div>

              <button
                type="button"
                className="btn btn-light rounded-circle"
                onClick={() =>
                  setShowProject(false)
                }
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">
                  What is your business?
                </label>

                <select
                  className="form-select"
                  value={business}
                  onChange={(e) =>
                    setBusiness(e.target.value)
                  }
                  style={{
                    minHeight: "50px",
                    borderRadius: "13px",
                  }}
                >
                  <option value="">
                    Select business / sector
                  </option>

                  {BUSINESS_OPTIONS.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">
                  Where is the project?
                </label>

                <select
                  className="form-select"
                  value={state}
                  onChange={(e) =>
                    setState(e.target.value)
                  }
                  style={{
                    minHeight: "50px",
                    borderRadius: "13px",
                  }}
                >
                  <option value="">
                    Select State
                  </option>

                  {STATE_OPTIONS.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">
                  Estimated project cost
                </label>

                <div className="input-group">
                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    value={projectCost}
                    min="0"
                    placeholder="Example: 2500000"
                    onChange={(e) =>
                      setProjectCost(
                        e.target.value
                      )
                    }
                    style={{ minHeight: "50px" }}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
              <div
                className="rounded-pill px-3 py-2"
                style={{
                  background: projectReady
                    ? "#eafff6"
                    : "#fff8e6",
                  color: projectReady
                    ? "#087b5d"
                    : "#9a6500",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                <i
                  className={`bi ${
                    projectReady
                      ? "bi-check-circle-fill"
                      : "bi-info-circle-fill"
                  } me-1`}
                />

                {projectReady
                  ? "You're all set"
                  : "3 simple details needed"}
              </div>

              <button
                type="button"
                className="btn btn-primary px-4 fw-bold"
                onClick={saveProject}
                disabled={!projectReady}
                style={{
                  borderRadius: "13px",
                }}
              >
                <i className="bi bi-check2-circle me-2" />
                Save & continue
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            WELCOME / NEXT STEP
        ================================================= */}

        <div
          className="mb-4"
          style={{
            ...card,
            padding: "22px",
            background:
              "linear-gradient(135deg,#ffffff 0%,#f5fbff 100%)",
          }}
        >
          <div className="row align-items-center g-3">
            <div className="col-lg">
              <div
                className="d-flex align-items-center gap-2 mb-2"
              >
                <span
                  className="badge rounded-pill"
                  style={{
                    background: "#eaf2ff",
                    color: "#1769e0",
                    fontSize: "10px",
                  }}
                >
                  SIMPLE • FAST • PERSONAL
                </span>
              </div>

              <h3
                className="fw-bold mb-1"
                style={{
                  letterSpacing: "-.5px",
                }}
              >
                What would you like to do today?
              </h3>

              <p
                className="text-muted mb-0"
                style={{ fontSize: "13px" }}
              >
                Choose a service below — no complicated
                menus. GoSubsidy AI will guide you to the
                next step.
              </p>
            </div>

            <div className="col-lg-auto">
              <button
                type="button"
                className="btn btn-primary fw-bold px-4"
                onClick={() => {
                  setChatOpen(true);
                  setTimeout(
                    () =>
                      inputRef.current?.focus(),
                    100
                  );
                }}
                style={{
                  borderRadius: "13px",
                }}
              >
                <i className="bi bi-chat-dots me-2" />
                Ask AI
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            ASK ANYTHING BANNER
        ================================================= */}

        <div
          className="mb-4"
          style={{
            ...card,
            padding: "18px 20px",
            background:
              "linear-gradient(135deg,#eef7ff 0%,#effcf9 100%)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                ...iconBox("#1769e0"),
                width: "44px",
                height: "44px",
                borderRadius: "14px",
              }}
            >
              <i className="bi bi-chat-square-text fs-5" />
            </div>

            <div className="flex-grow-1">
              <div className="fw-bold">
                You can ask GoSubsidy AI anything
              </div>
              <div
                className="text-muted"
                style={{ fontSize: "11px" }}
              >
                You don't need to choose a service first.
                Ask your question in your own words and AI
                will decide what information or next step is needed.
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary rounded-pill px-3 fw-semibold"
              onClick={() => {
                setChatOpen(true);
                setTimeout(
                  () => inputRef.current?.focus(),
                  100
                );
              }}
            >
              Ask now
            </button>
          </div>
        </div>

        {/* =================================================
            CATEGORY FILTERS
        ================================================= */}

        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <div
              className="text-primary fw-bold"
              style={{
                fontSize: "10px",
                letterSpacing: ".8px",
              }}
            >
              SERVICE CENTER
            </div>

            <h4 className="fw-bold mb-0 mt-1">
              All your business support in one place
            </h4>
          </div>

          <span
            className="d-none d-md-inline-flex align-items-center rounded-pill px-3 py-2"
            style={{
              background: "#ffffff",
              border: "1px solid #e4eaf2",
              color: "#657286",
              fontSize: "11px",
            }}
          >
            {SERVICES.length} services
          </span>
        </div>

        <div
          className="d-flex gap-2 overflow-auto pb-2 mb-3"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((category) => {
            const active =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className="btn flex-shrink-0 rounded-pill px-3"
                onClick={() => {
                  setActiveCategory(
                    category.id
                  );
                  setShowAllServices(false);
                }}
                style={{
                  border: active
                    ? "1px solid #1769e0"
                    : "1px solid #e1e7ef",
                  background: active
                    ? "#1769e0"
                    : "#ffffff",
                  color: active
                    ? "#ffffff"
                    : "#56647a",
                  fontSize: "11px",
                  fontWeight: 700,
                  paddingTop: "9px",
                  paddingBottom: "9px",
                }}
              >
                <i
                  className={`bi ${category.icon} me-1`}
                />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            SERVICE GRID
        ================================================= */}

        <div className="row g-3">
          {visibleServices.map((service) => {
            const selected =
              recentService === service.id;

            return (
              <div
                key={service.id}
                className="col-6 col-md-4 col-xl-3"
              >
                <button
                  type="button"
                  className="w-100 h-100 text-start"
                  onClick={() =>
                    handleService(service)
                  }
                  disabled={loading}
                  style={{
                    minHeight: "164px",
                    padding: "18px",
                    background: "#ffffff",
                    border: selected
                      ? `1px solid ${service.accent}70`
                      : "1px solid #e4eaf2",
                    borderRadius: "20px",
                    boxShadow:
                      selected
                        ? `0 12px 30px ${service.accent}18`
                        : "0 8px 25px rgba(18,42,72,.045)",
                    cursor: loading
                      ? "not-allowed"
                      : "pointer",
                    transition:
                      "transform .18s ease, box-shadow .18s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform =
                        "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        `0 16px 34px ${service.accent}18`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      selected
                        ? `0 12px 30px ${service.accent}18`
                        : "0 8px 25px rgba(18,42,72,.045)";
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div
                      style={iconBox(
                        service.accent
                      )}
                    >
                      <i
                        className={`bi ${service.icon} fs-5`}
                      />
                    </div>

                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#9ba6b6",
                        background: "#f7f9fc",
                      }}
                    >
                      <i className="bi bi-arrow-up-right" />
                    </span>
                  </div>

                  <div className="fw-bold mt-3">
                    {service.title}
                  </div>

                  <div
                    className="text-muted mt-1"
                    style={{
                      fontSize: "11px",
                      lineHeight: 1.45,
                    }}
                  >
                    {service.subtitle}
                  </div>

                  <div
                    className="mt-3"
                    style={{
                      fontSize: "10px",
                      color: service.accent,
                      fontWeight: 700,
                    }}
                  >
                    {service.route
                      ? "Open service"
                      : "Get guidance"}{" "}
                    <i className="bi bi-arrow-right ms-1" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {filteredServices.length > 8 && (
          <div className="text-center mt-3 mb-4">
            <button
              type="button"
              className="btn btn-light rounded-pill px-4 fw-semibold"
              onClick={() =>
                setShowAllServices(
                  (prev) => !prev
                )
              }
            >
              {showAllServices
                ? "Show fewer services"
                : `View all ${filteredServices.length} services`}
              <i
                className={`bi ${
                  showAllServices
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                } ms-2`}
              />
            </button>
          </div>
        )}

        {/* =================================================
            PROJECT SNAPSHOT
        ================================================= */}

        <div
          className="mb-4"
          style={{
            ...card,
            padding: "20px",
          }}
        >
          <div className="row align-items-center g-3">
            <div className="col-lg">
              <div
                className="d-flex align-items-center gap-2"
              >
                <div
                  style={{
                    ...iconBox(
                      projectReady
                        ? "#087b77"
                        : "#9a6500"
                    ),
                    width: "42px",
                    height: "42px",
                    borderRadius: "13px",
                  }}
                >
                  <i
                    className={`bi ${
                      projectReady
                        ? "bi-check2-circle"
                        : "bi-person-workspace"
                    }`}
                  />
                </div>

                <div>
                  <div
                    className="fw-bold"
                    style={{ fontSize: "14px" }}
                  >
                    {projectReady
                      ? `${business} project`
                      : "Set up your project profile"}
                  </div>

                  <div
                    className="text-muted"
                    style={{ fontSize: "11px" }}
                  >
                    {projectReady
                      ? `${state} • ₹${formatCurrency(
                          projectCost
                        )}`
                      : "Optional — you can ask AI questions without setting up a project"}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-auto">
              <button
                type="button"
                className="btn btn-outline-primary fw-semibold"
                onClick={() =>
                  setShowProject(true)
                }
                style={{
                  borderRadius: "12px",
                }}
              >
                <i className="bi bi-pencil-square me-2" />
                {projectReady
                  ? "Edit project"
                  : "Set up now"}
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            AI CONVERSATION
        ================================================= */}

        <div
          style={{
            ...card,
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            className="w-100 border-0 text-start"
            onClick={() =>
              setChatOpen((prev) => !prev)
            }
            style={{
              padding: "18px 20px",
              background:
                "linear-gradient(135deg,#ffffff,#f8fbff)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "15px",
                    background:
                      "linear-gradient(145deg,#1769e0,#087b77)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-robot fs-5" />
                </div>

                <div>
                  <div className="fw-bold">
                    Talk to GoSubsidy AI
                  </div>

                  <div
                    className="text-muted"
                    style={{ fontSize: "11px" }}
                  >
                    Ask follow-up questions and get
                    personalised guidance.
                  </div>
                </div>
              </div>

              <span
                className="rounded-pill px-3 py-2"
                style={{
                  background: "#edf4ff",
                  color: "#1769e0",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {chatOpen
                  ? "Hide chat"
                  : "Open chat"}
                <i
                  className={`bi ${
                    chatOpen
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  } ms-2`}
                />
              </span>
            </div>
          </button>

          {chatOpen && (
            <>
              <div
                className="d-flex align-items-center justify-content-between px-4 py-3"
                style={{
                  borderTop:
                    "1px solid #edf0f4",
                  borderBottom:
                    "1px solid #edf0f4",
                  background: "#fbfcfe",
                }}
              >
                <div
                  className="small text-muted"
                >
                  <span className="text-success me-1">
                    ●
                  </span>
                  AI assistant ready
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-pill"
                  onClick={clearChat}
                >
                  <i className="bi bi-arrow-counterclockwise me-1" />
                  New chat
                </button>
              </div>

              <div
                style={{
                  height: "430px",
                  overflowY: "auto",
                  background:
                    "linear-gradient(180deg,#fbfdff,#f6f9fc)",
                  padding: "22px",
                }}
              >
                {messages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`d-flex mb-4 ${
                        message.role === "user"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      {message.role !==
                        "user" && (
                        <div
                          className="me-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "11px",
                            background:
                              "linear-gradient(145deg,#1769e0,#087b77)",
                            color: "#ffffff",
                            marginTop: "3px",
                          }}
                        >
                          <i className="bi bi-robot" />
                        </div>
                      )}

                      <div
                        style={{
                          maxWidth: "82%",
                        }}
                      >
                        <div
                          style={{
                            padding:
                              "14px 17px",
                            borderRadius:
                              message.role ===
                              "user"
                                ? "18px 18px 5px 18px"
                                : "5px 18px 18px 18px",
                            background:
                              message.role ===
                              "user"
                                ? "linear-gradient(135deg,#1769e0,#3948e9)"
                                : "#ffffff",
                            color:
                              message.role ===
                              "user"
                                ? "#ffffff"
                                : "#182235",
                            border:
                              message.role ===
                              "user"
                                ? "none"
                                : "1px solid #e7ecf2",
                            boxShadow:
                              message.role ===
                              "user"
                                ? "0 8px 20px rgba(23,105,224,.18)"
                                : "0 5px 15px rgba(25,45,75,.05)",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.65,
                            fontSize: "14px",
                          }}
                        >
                          {message.text}
                        </div>

                        <small
                          className={`d-block mt-1 ${
                            message.role ===
                            "user"
                              ? "text-end"
                              : ""
                          }`}
                          style={{
                            color: "#98a2b3",
                            fontSize: "10px",
                          }}
                        >
                          {message.role ===
                          "user"
                            ? "You"
                            : "GoSubsidy AI"}
                        </small>
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="d-flex align-items-start mb-4">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "11px",
                        background:
                          "linear-gradient(145deg,#1769e0,#087b77)",
                        color: "#ffffff",
                      }}
                    >
                      <i className="bi bi-robot" />
                    </div>

                    <div
                      className="px-3 py-3"
                      style={{
                        background: "#ffffff",
                        border:
                          "1px solid #e7ecf2",
                        borderRadius:
                          "5px 18px 18px 18px",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"
                        />

                        <div>
                          <strong
                            style={{
                              fontSize: "13px",
                            }}
                          >
                            I'm checking this for you...
                          </strong>

                          <div
                            className="text-muted"
                            style={{
                              fontSize: "11px",
                            }}
                          >
                            Reviewing your project
                            information
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div
                className="bg-white p-3"
                style={{
                  borderTop:
                    "1px solid #edf0f4",
                }}
              >
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {[
                    [
                      "💬",
                      "What can GoSubsidy help me with?",
                    ],
                    [
                      "💰",
                      "How much subsidy can I get?",
                    ],
                    [
                      "📄",
                      "What documents are required?",
                    ],
                    [
                      "✨",
                      "Which scheme is best for me?",
                    ],
                  ].map(([icon, text]) => (
                    <button
                      key={text}
                      type="button"
                      className="btn btn-sm btn-light rounded-pill px-3"
                      onClick={() =>
                        askQuickQuestion(text)
                      }
                    >
                      {icon} {text}
                    </button>
                  ))}
                </div>

                <div
                  className="d-flex align-items-end gap-2 p-2"
                  style={{
                    border:
                      "1px solid #dfe5ed",
                    borderRadius: "17px",
                    background: "#fafbfd",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    className="form-control border-0 bg-transparent shadow-none"
                    rows="1"
                    placeholder="Ask any question — subsidy, loan, DPR, CIBIL, documents, business, insurance..."
                    value={question}
                    disabled={loading}
                    onChange={(e) =>
                      setQuestion(
                        e.target.value
                      )
                    }
                    onKeyDown={handleKeyDown}
                    style={{
                      resize: "none",
                      minHeight: "44px",
                      maxHeight: "110px",
                    }}
                  />

                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
                    onClick={sendMessage}
                    disabled={
                      loading ||
                      !question.trim()
                    }
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "14px",
                    }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="bi bi-send-fill" />
                    )}
                  </button>
                </div>

                <div
                  className="text-center mt-2"
                  style={{
                    color: "#98a2b3",
                    fontSize: "9px",
                  }}
                >
                  AI guidance should be verified against
                  official scheme guidelines before application.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}