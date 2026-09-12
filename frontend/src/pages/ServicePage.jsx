import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getServiceData } from "../data/serviceData";
import Footer from "../components/layout/Footer";
import "../styles/ServicePage.css";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Helper: Dynamically loads the Razorpay checkout script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const service = getServiceData(slug);

  // 1. Parse base price dynamically from the serviceData catalog
  const rawPriceString = service.price ? service.price.replace(/[^0-9]/g, "") : "1999";
  const basePriceNum = parseInt(rawPriceString, 10) || 1999;

  // 2. Generate 3 dynamic package tiers with unique service product codes mapped to backend
  const cleanSlug = String(slug || "service").replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();

  const dynamicPackages = [
    {
      id: "basic",
      code: slug || `SERVICE_${cleanSlug}_BASIC`,
      name: "Basic Plan",
      priceNumber: basePriceNum,
      price: `₹${basePriceNum.toLocaleString("en-IN")}`,
      desc: "Standard statutory drafting and official government portal application filing.",
      isPopular: false,
      features: [
        "Statutory Documentation & Drafting",
        "Government Portal Filing",
        "Digital Certificate Generation",
      ],
    },
    {
      id: "enterprise",
      code: `${slug}_standard` || `SERVICE_${cleanSlug}_STANDARD`,
      name: "Standard Package",
      priceNumber: Math.round(basePriceNum * 2.2),
      price: `₹${Math.round(basePriceNum * 2.2).toLocaleString("en-IN")}`,
      desc: "Comprehensive certification, tax integration, and dedicated CA specialist review.",
      isPopular: true,
      features: [
        "Everything in Basic Plan",
        "Dedicated Chartered Accountant (CA) Review",
        "MSME / Tax Registry Linkage",
        "Priority Fast-Track SLA Filing",
      ],
    },
    {
      id: "annual",
      code: `${slug}_annual` || `SERVICE_${cleanSlug}_ANNUAL`,
      name: "Complete Annual Suite",
      priceNumber: Math.round(basePriceNum * 4.5),
      price: `₹${Math.round(basePriceNum * 4.5).toLocaleString("en-IN")}`,
      desc: "End-to-end statutory certification + 1-year periodic return & compliance management.",
      isPopular: false,
      features: [
        "Everything in Standard Package",
        "1-Year Statutory Compliance & Filings",
        "Accounting & Periodic Reconciliation",
        "Unlimited Expert Notice Representation",
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState("packages-section");
  const [selectedPlan, setSelectedPlan] = useState(dynamicPackages[0]);
  const [activeFaq, setActiveFaq] = useState(0);

  // Sync selected plan when changing between different service routes
  useEffect(() => {
    setSelectedPlan(dynamicPackages[0]);
  }, [slug, service.price]);

  // Customer & Transaction Details with strict mobile validation
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: String(user?.phone || user?.user_metadata?.phone || "").replace(/[^0-9]/g, "").slice(-10),
    pan: "",
  });

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState("review"); // review | processing | success
  const [liveOrderId, setLiveOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.user_metadata?.full_name || user?.user_metadata?.name || prev.name,
        email: user?.email || prev.email,
        phone: String(user?.phone || user?.user_metadata?.phone || prev.phone).replace(/[^0-9]/g, "").slice(-10),
      }));
    }
  }, [user]);

  // Smooth scroll handler for tabs
  const handleTabClick = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Open Checkout Modal
  const handleInitiatePayment = (plan) => {
    if (plan) setSelectedPlan(plan);
    setPaymentStep("review");
    setErrorMessage("");
    setIsPaymentOpen(true);
  };

  const handleHeroFormSubmit = (e) => {
    e.preventDefault();
    setPaymentStep("review");
    setErrorMessage("");
    setIsPaymentOpen(true);
  };

  // Real-time Scroll-Spy
  useEffect(() => {
    const sections = ["packages-section", "docs-steps-section", "roadmap-section", "faqs-section"];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slug]);

  // Dynamic calculations for checkout
  const basePrice = selectedPlan.priceNumber;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  // Real Razorpay Execution & Server-side Verification Handler
  const handleLivePaymentProcess = async () => {
    if (!user || !session?.access_token) {
      alert("Please log in to your GoSubsidy account to continue with secure checkout.");
      navigate("/login");
      return;
    }

    // Validate email and 10-digit mobile number before checkout
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.phone.replace(/[^0-9]/g, "");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid Email ID.");
      return;
    }
    if (phoneDigits.length !== 10 || !["6", "7", "8", "9"].includes(phoneDigits[0])) {
      setErrorMessage("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Ensure Razorpay SDK is loaded
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        throw new Error("Unable to load Razorpay payment SDK. Please check your internet connection.");
      }

      // 2. Fetch Razorpay key configuration
      const configRes = await fetch(`${API_BASE_URL}/api/payment/config`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!configRes.ok) {
        throw new Error("Payment server configuration is not reachable on port 4000.");
      }

      const configData = await configRes.json();
      if (!configData?.success || !configData?.keyId) {
        throw new Error(configData?.message || "Razorpay key configuration is missing.");
      }

      // 3. Create real order on backend server passing exact slug
      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          productCode: slug,
          serviceSlug: slug,
          packageName: selectedPlan.name,
          productName: `${service.title} (${selectedPlan.name})`,
          amount: totalAmount,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: `+91 ${phoneDigits}`,
          validityDays: 365,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData?.success || !orderData?.orderId) {
        throw new Error(orderData?.message || "Failed to initiate Razorpay order on server.");
      }

      // 4. Configure Razorpay checkout options
      const options = {
        key: configData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "GoSubsidy Business & Financial Services",
        description: `${service.title} - ${selectedPlan.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: phoneDigits,
        },
        notes: {
          serviceSlug: slug,
          serviceTitle: service.title,
          package: selectedPlan.name,
          productCode: slug,
          applicant_name: formData.name,
          applicant_email: formData.email,
          applicant_phone: `+91 ${phoneDigits}`,
          pan: formData.pan || "",
        },
        theme: {
          color: "#059669",
        },

        // 5. Verification callback
        handler: async function (response) {
          setPaymentStep("processing");

          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productCode: slug,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData?.success || !verifyData?.verified) {
              throw new Error(verifyData?.message || "Payment signature verification failed.");
            }

            // Sync verified records locally for quick UI access
            const verifiedId = response.razorpay_order_id;
            setLiveOrderId(verifiedId);

            const orderPayload = {
              orderId: verifiedId,
              paymentId: response.razorpay_payment_id,
              serviceSlug: slug,
              serviceTitle: service.title,
              category: service.category,
              packageName: selectedPlan.name,
              totalAmount,
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: `+91 ${phoneDigits}`,
              status: "COMPLETED",
              verifiedAt: new Date().toISOString(),
            };

            const existingPayments = JSON.parse(localStorage.getItem("gosubsidy_payments") || "[]");
            const existingApplications = JSON.parse(localStorage.getItem("gosubsidy_applications") || "[]");

            existingPayments.unshift(orderPayload);
            existingApplications.unshift({
              id: verifiedId,
              serviceName: `${service.title} (${selectedPlan.name})`,
              stage: "Document Verification",
              status: "In Progress",
              submittedOn: new Date().toLocaleDateString("en-IN"),
              amountPaid: `₹${totalAmount.toLocaleString("en-IN")}`,
            });

            localStorage.setItem("gosubsidy_payments", JSON.stringify(existingPayments));
            localStorage.setItem("gosubsidy_applications", JSON.stringify(existingApplications));

            setIsProcessing(false);
            setPaymentStep("success");
          } catch (err) {
            console.error("[ServicePage] Verification Error:", err);
            setIsProcessing(false);
            setPaymentStep("review");
            setErrorMessage(err.message || "Payment verification failed. Please contact GoSubsidy support.");
          }
        },

        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentStep("review");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResp) {
        setIsProcessing(false);
        setPaymentStep("review");
        setErrorMessage(failResp?.error?.description || "Payment failed or was cancelled by the user.");
      });

      rzp.open();
    } catch (err) {
      console.error("[ServicePage] Checkout Error:", err);
      setIsProcessing(false);
      setPaymentStep("review");
      setErrorMessage(err.message || "Failed to launch Razorpay checkout.");
    }
  };

  return (
    <div className="gs-service-page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="gs-hero-block">
        <div className="gs-page-container gs-hero-flex-layout">
          
          <div className="gs-hero-content-col">
            <nav className="gs-hero-breadcrumb" aria-label="breadcrumb">
              <Link to="/">Home</Link>
              <i className="bi bi-chevron-right" />
              <span>{service.category}</span>
              <i className="bi bi-chevron-right" />
              <span className="current">{service.title}</span>
            </nav>

            <div className="gs-badge-row">
              <span className="gs-gov-verified-tag">
                <i className="bi bi-patch-check-fill text-success" /> Government &amp; MCA Verified
              </span>
            </div>

            <h1 className="gs-service-main-heading">
              <i className={`bi ${service.icon} gs-hero-heading-icon`} />
              {service.title}
            </h1>

            <p className="gs-service-main-desc">{service.overview}</p>

            <div className="gs-hero-chips-wrap">
              <div className="gs-pill-chip">
                <i className="bi bi-clock-history text-primary" />
                <span>Timeline: <strong>{service.timeline}</strong></span>
              </div>
              <div className="gs-pill-chip">
                <i className="bi bi-shield-check text-success" />
                <span>100% Online Paperless</span>
              </div>
              <div className="gs-pill-chip">
                <i className="bi bi-headset text-warning" />
                <span>Dedicated CA Specialist</span>
              </div>
            </div>

            <div className="gs-hero-benefits-grid">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="gs-hero-benefit-item">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lead Form Matching Selected Service Pricing */}
          <div className="gs-hero-form-col" ref={formRef}>
            <div className="gs-hero-lead-card">
              <div className="gs-lead-ribbon">
                <span>{selectedPlan.name}</span>
              </div>

              <div className="gs-lead-header-row">
                <div>
                  <small>Selected Package</small>
                  <div className="gs-lead-price-display">
                    <span className="gs-price-amount">{selectedPlan.price}</span>
                    <span className="gs-price-extra">+ 18% GST</span>
                  </div>
                </div>
                <div className="gs-lead-rating-badge">
                  <i className="bi bi-star-fill text-warning" />
                  <strong>4.9/5</strong>
                  <small>(2.4k+)</small>
                </div>
              </div>

              <form onSubmit={handleHeroFormSubmit} className="gs-lead-actual-form">
                <div className="gs-form-group-item">
                  <label>Full Name</label>
                  <div className="gs-input-box">
                    <i className="bi bi-person" />
                    <input
                      type="text"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="gs-form-group-item">
                  <label>Email Address</label>
                  <div className="gs-input-box">
                    <i className="bi bi-envelope" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="gs-form-group-item">
                  <label>Mobile Number (10 Digits)</label>
                  <div className="gs-input-box">
                    <span className="input-group-text bg-light border-0 fw-bold text-muted ps-0">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                        })
                      }
                    />
                  </div>
                </div>

                <button type="submit" className="gs-lead-submit-button">
                  <span>Pay {selectedPlan.price} &amp; Start Application</span>
                  <i className="bi bi-credit-card-2-front ms-2" />
                </button>

                <div className="gs-lead-trust-row">
                  <span><i className="bi bi-lock-fill me-1" /> 256-Bit SSL</span>
                  <span><i className="bi bi-shield-check me-1" /> Money Back Guarantee</span>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATISTICAL METRIC BANNER */}
      <section className="gs-metrics-strip">
        <div className="gs-page-container gs-metrics-grid">
          <div className="gs-metric-cell">
            <h3>40,000+</h3>
            <p>Registrations Completed</p>
          </div>
          <div className="gs-metric-cell">
            <h3>99.4%</h3>
            <p>On-Time SLA Approval</p>
          </div>
          <div className="gs-metric-cell">
            <h3>₹150 Cr+</h3>
            <p>Subsidy &amp; Grants Claimed</p>
          </div>
          <div className="gs-metric-cell">
            <h3>4.9 / 5</h3>
            <p>Customer Satisfaction</p>
          </div>
        </div>
      </section>

      {/* 3. STICKY SUBNAV TABS */}
      <nav className="gs-subnav-strip">
        <div className="gs-page-container gs-subnav-inner">
          <button 
            type="button" 
            className={`gs-subnav-btn ${activeTab === "packages-section" ? "active" : ""}`} 
            onClick={() => handleTabClick("packages-section")}
          >
            <i className="bi bi-info-circle" /> Overview &amp; Packages
          </button>
          <button 
            type="button" 
            className={`gs-subnav-btn ${activeTab === "docs-steps-section" ? "active" : ""}`} 
            onClick={() => handleTabClick("docs-steps-section")}
          >
            <i className="bi bi-file-earmark-check" /> Documents &amp; Steps
          </button>
          <button 
            type="button" 
            className={`gs-subnav-btn ${activeTab === "roadmap-section" ? "active" : ""}`} 
            onClick={() => handleTabClick("roadmap-section")}
          >
            <i className="bi bi-shield-check" /> Post-Filing Roadmap
          </button>
          <button 
            type="button" 
            className={`gs-subnav-btn ${activeTab === "faqs-section" ? "active" : ""}`} 
            onClick={() => handleTabClick("faqs-section")}
          >
            <i className="bi bi-question-circle" /> FAQs
          </button>
        </div>
      </nav>

      {/* 4. PACKAGES SECTION */}
      <section id="packages-section" className="gs-content-section-block gs-scroll-target">
        <div className="gs-page-container">
          <h2 className="gs-block-title">Choose Your Service Plan</h2>
          <p className="gs-block-subtitle">Select a package to start checkout &amp; documentation onboarding immediately.</p>

          <div className="gs-packages-cards-grid">
            {dynamicPackages.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`gs-plan-card ${plan.isPopular ? "popular" : ""} ${
                    isSelected ? "selected-plan" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.isPopular && (
                    <span className="gs-plan-recommended-badge">RECOMMENDED</span>
                  )}

                  <h4>{plan.name}</h4>
                  <p className="desc">{plan.desc}</p>
                  <div className="gs-plan-price">{plan.price}</div>

                  <ul className="gs-plan-features-list">
                    {plan.features.map((feat, idx) => (
                      <li key={idx}>
                        <i className="bi bi-check-lg text-success" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="gs-plan-cta-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInitiatePayment(plan);
                    }}
                  >
                    <span>Book {plan.name} ({plan.price})</span>
                    <i className="bi bi-arrow-right ms-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DOCUMENTS & PROCESS */}
      <section id="docs-steps-section" className="gs-content-section-block bg-white gs-scroll-target">
        <div className="gs-page-container">
          <h2 className="gs-block-title">Document Checklist &amp; Process Flow</h2>
          <p className="gs-block-subtitle">Statutory prerequisites and execution milestones.</p>

          <div className="gs-twocol-grid">
            <div className="gs-card-panel">
              <div className="gs-panel-head">
                <span className="gs-panel-badge-icon green">
                  <i className="bi bi-file-earmark-text-fill" />
                </span>
                <div>
                  <h3>Required Documents</h3>
                  <small>Self-attested scanned copies needed</small>
                </div>
              </div>
              <div className="gs-panel-docs-list">
                {service.documents.map((doc, idx) => (
                  <div key={idx} className="gs-doc-line-item">
                    <i className="bi bi-file-earmark-check gs-doc-check-icon" />
                    <div className="gs-doc-meta">
                      <strong>{doc}</strong>
                      <small>Valid statutory identity or address document</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gs-card-panel">
              <div className="gs-panel-head">
                <span className="gs-panel-badge-icon blue">
                  <i className="bi bi-diagram-3-fill" />
                </span>
                <div>
                  <h3>Execution Workflow</h3>
                  <small>Real-time tracked milestones</small>
                </div>
              </div>
              <div className="gs-panel-steps-list">
                {service.process.map((step, idx) => (
                  <div key={idx} className="gs-step-row-card">
                    <div className="gs-step-circle-badge">
                      <span>0{idx + 1}</span>
                    </div>
                    <div className="gs-step-content-box">
                      <strong>Stage 0{idx + 1}</strong>
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POST-FILING COMPLIANCE */}
      <section id="roadmap-section" className="gs-content-section-block gs-scroll-target">
        <div className="gs-page-container">
          <h2 className="gs-block-title">Post-Registration Statutory Roadmap</h2>
          <p className="gs-block-subtitle">Maintain clean audit logs and avoid statutory penalties.</p>

          <div className="gs-roadmap-grid">
            <div className="gs-roadmap-box">
              <h4><i className="bi bi-bank2 me-2 text-primary" /> Bank Account Opening</h4>
              <p>Open a dedicated zero-balance commercial current account with our banking partners.</p>
            </div>
            <div className="gs-roadmap-box">
              <h4><i className="bi bi-receipt-cutoff me-2 text-success" /> GST &amp; Tax Compliance</h4>
              <p>Timely monthly GSTR-1 and GSTR-3B filings to ensure smooth input tax credit (ITC) flows.</p>
            </div>
            <div className="gs-roadmap-box">
              <h4><i className="bi bi-percent me-2 text-warning" /> Subsidy &amp; Scheme Claims</h4>
              <p>Link your registration to PMMSY, PMEGP, or PMKSY subsidy schemes to claim capital grants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section id="faqs-section" className="gs-content-section-block bg-white gs-scroll-target">
        <div className="gs-page-container gs-faq-container-narrow">
          <h2 className="gs-block-title text-center">Frequently Asked Questions</h2>
          <p className="gs-block-subtitle text-center">Comprehensive clarity on {service.title} regulations.</p>

          <div className="gs-faq-accordion-list">
            {service.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className={`gs-faq-accordion-box ${isOpen ? "open" : ""}`}>
                  <button 
                    type="button" 
                    className="gs-faq-accordion-btn" 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                  >
                    <span>
                      <i className="bi bi-question-circle text-primary me-2" />
                      {faq.q}
                    </span>
                    <i className={`bi bi-chevron-${isOpen ? "up" : "down"}`} />
                  </button>
                  {isOpen && (
                    <div className="gs-faq-accordion-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CHECKOUT & REAL RAZORPAY MODAL */}
      {isPaymentOpen && (
        <div className="gs-modal-backdrop" onClick={() => !isProcessing && setIsPaymentOpen(false)}>
          <div className="gs-payment-modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="gs-modal-header">
              <div className="gs-modal-header-brand">
                <span className="gs-modal-brand-badge">
                  <i className="bi bi-shield-lock-fill text-success me-1" /> Secured Checkout
                </span>
                <h3>{service.title}</h3>
                <small>Package: <strong>{selectedPlan.name}</strong></small>
              </div>
              {!isProcessing && (
                <button 
                  type="button" 
                  className="gs-modal-close-btn" 
                  onClick={() => setIsPaymentOpen(false)}
                >
                  <i className="bi bi-x-lg" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="gs-modal-body">
              {paymentStep === "review" && (
                <div className="gs-payment-step-review">
                  
                  {/* Order Summary Box */}
                  <div className="gs-order-summary-card">
                    <div className="gs-summary-line">
                      <span>{selectedPlan.name} (Base Fee)</span>
                      <strong>₹{basePrice.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="gs-summary-line">
                      <span>Govt. GST &amp; Processing (18%)</span>
                      <strong>₹{gstAmount.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="gs-summary-divider" />
                    <div className="gs-summary-line total">
                      <span>Total Payable Amount</span>
                      <span className="gs-total-price">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="gs-checkout-form-grid">
                    <div className="gs-modal-field">
                      <label>Applicant Name</label>
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="gs-modal-field">
                      <label>Email (for Tax Invoice &amp; Certificate)</label>
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="gs-modal-field">
                      <label>Mobile Number (10 Digits)</label>
                      <input 
                        type="tel" 
                        maxLength={10}
                        placeholder="9876543210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                        required
                      />
                    </div>
                    <div className="gs-modal-field">
                      <label>Business PAN / GSTIN (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="For GST Input Credit" 
                        value={formData.pan}
                        onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger py-2 px-3 text-start small mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-2" />
                      {errorMessage}
                    </div>
                  )}

                  {/* Real Razorpay Action Button */}
                  <button 
                    type="button" 
                    className="gs-pay-now-action-btn"
                    onClick={handleLivePaymentProcess}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Connecting to Bank Gateway...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2" />
                        Pay ₹{totalAmount.toLocaleString("en-IN")} via Razorpay
                      </>
                    )}
                  </button>
                </div>
              )}

              {paymentStep === "processing" && (
                <div className="gs-payment-processing-screen">
                  <div className="gs-payment-spinner" />
                  <h4>Verifying Payment with RBI &amp; NPCI Node...</h4>
                  <p>Confirming payment signature with server. Please do not close this window.</p>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="gs-payment-success-screen">
                  <div className="gs-success-stamp-icon">
                    <i className="bi bi-check-circle-fill" />
                  </div>
                  <h3>Payment Successful!</h3>
                  <p className="gs-success-txnid">Order ID: <strong>{liveOrderId}</strong></p>
                  <p className="gs-success-desc">
                    Thank you! Your order for <strong>{service.title} ({selectedPlan.name})</strong> has been placed. 
                    Your dedicated compliance officer has been assigned.
                  </p>
                  <div className="gs-success-actions">
                    <button 
                      type="button"
                      className="gs-success-btn-primary"
                      onClick={() => {
                        setIsPaymentOpen(false);
                        navigate("/customer/applications");
                      }}
                    >
                      <i className="bi bi-grid-1x2 me-2" /> Go to Dashboard &amp; Upload Docs
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="gs-modal-footer">
              <span><i className="bi bi-shield-check text-success me-1" /> RBI &amp; NPCI Approved Gateway</span>
              <span><i className="bi bi-receipt me-1" /> Instant Tax Invoice Generated</span>
            </div>
          </div>
        </div>
      )}

      {/* 9. GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}