import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

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

export default function PaymentModal({ product, onClose, onSuccess }) {
  const [step, setStep] = useState("offer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Auth states
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  // Customer Mobile
  const [customerPhone, setCustomerPhone] = useState("");

  // PROMO CODE & OFFER REDEMPTION STATES
  const [promoInput, setPromoInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [promoError, setPromoError] = useState("");

  const { user, session, signIn, signUp, signInWithGoogle } = useAuth();

  // Use the backend's existing canonical annual advisory product code.
  // Keep compatibility with the older frontend code SUBSIDY_ADVISORY_PASS.
  const rawProductCode = product?.code || "DPR_PRO";
  const productCode =
    rawProductCode === "SUBSIDY_ADVISORY_PASS"
      ? "SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL"
      : rawProductCode;
  const validityDays = Number(
    product?.validityDays ||
      (productCode === "SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL" ? 365 : 30)
  );
  const displayPrice = Number(product?.price || 999);

  // Auto-detect claimed promo offer from localStorage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("activePromo");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.code) {
          setAppliedOffer(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load active promo:", e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const rawPhone = String(
        user?.phone ||
        user?.user_metadata?.phone ||
        user?.user_metadata?.mobile ||
        ""
      ).replace(/[^0-9]/g, "").slice(-10);
      setCustomerPhone(rawPhone);
    }
  }, [user]);

  // Pricing calculations
  const discountPercent = appliedOffer?.discountPercent || (appliedOffer?.code === "GOSUBSIDY20" ? 20 : 0);
  const discountAmount = appliedOffer ? Math.round((displayPrice * discountPercent) / 100) : 0;
  const finalPayablePrice = Math.max(1, displayPrice - discountAmount);

  const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

  const getAuthHeaders = () => {
    const token = session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleApplyPromo = (codeToApply) => {
    setPromoError("");
    const target = (codeToApply || promoInput).trim().toUpperCase();
    if (target === "GOSUBSIDY20") {
      const offer = {
        code: "GOSUBSIDY20",
        discountPercent: 20,
        title: "20% Instant Discount",
      };
      setAppliedOffer(offer);
      localStorage.setItem("activePromo", JSON.stringify(offer));
      setPromoInput("");
    } else {
      setPromoError("Invalid code. Use GOSUBSIDY20 for 20% off.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedOffer(null);
    setPromoError("");
    localStorage.removeItem("activePromo");
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      if (authMode === "login") {
        const { error } = await signIn(authEmail.trim().toLowerCase(), authPassword);
        if (error) throw error;
      } else {
        const { error } = await signUp(authEmail.trim().toLowerCase(), authPassword, { full_name: authName });
        if (error) throw error;
      }
      setShowAuthForm(false);
      setMessage("Successfully logged in! You can now proceed to payment.");
    } catch (err) {
      setMessage(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const openCheckout = async () => {
    if (loading) return;

    if (!user?.id || !session?.access_token) {
      setShowAuthForm(true);
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, "").slice(-10);
    if (cleanPhone.length !== 10 || !["6", "7", "8", "9"].includes(cleanPhone[0])) {
      setMessage("A valid 10-digit Mobile Number starting with 6, 7, 8, or 9 is mandatory to proceed.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Load Razorpay directly. The create-order endpoint returns the live keyId,
      // so a separate /config request is not required and cannot block checkout.
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again."
        );
      }

      // Sends the discounted price and coupon code to the backend order endpoint
      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productCode,
          amount: Math.max(1, Math.round(finalPayablePrice)),
          originalAmount: Math.max(1, Math.round(displayPrice)),
          discountAmount: discountAmount,
          promoCode: appliedOffer?.code || null,
          productName: product?.name || "GoSubsidy Service",
          customerPhone: `+91 ${cleanPhone}`,
          validityDays,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData?.success || !orderData?.orderId) {
        throw new Error(orderData?.message || "Unable to create Razorpay order.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "GoSubsidy Business & Financial Services",
        description: product?.name || "GoSubsidy Service",
        order_id: orderData.orderId,
        prefill: {
          name: product?.customerName || user?.user_metadata?.full_name || "",
          email: product?.customerEmail || user?.email || "",
          contact: cleanPhone,
        },
        notes: {
          productCode,
          applicant_phone: `+91 ${cleanPhone}`,
          applied_promo: appliedOffer?.code || "NONE",
          platform: "GoSubsidy",
        },
        theme: {
          color: "#0284c7",
        },
        handler: async function (response) {
          try {
            setLoading(true);
            setMessage("Verifying your payment securely with RBI/NPCI Node...");

            const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productCode,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData?.success || !verifyData?.verified) {
              throw new Error(verifyData?.message || "Payment verification failed.");
            }

            setMessage("Payment successful!");
            setLoading(false);

            onSuccess?.({
              productCode,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              verified: true,
              payment: verifyData.payment || null,
              entitlement: verifyData.entitlement || null,
            });

            setTimeout(() => {
              onClose?.();
            }, 900);
          } catch (error) {
            console.error("[GoSubsidy] Verification error:", error);
            setMessage(error?.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,
          ondismiss: function () {
            setLoading(false);
            setMessage("");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setLoading(false);
        setMessage(response?.error?.description || "Payment was cancelled or failed.");
      });

      setLoading(false);
      razorpayInstance.open();
    } catch (error) {
      console.error("[GoSubsidy] Checkout error:", error);
      setMessage(error?.message || "Unable to open secure payment.");
      setLoading(false);
    }
  };

  return (
    <div className="gs-pay-overlay" onClick={() => !loading && onClose?.()}>
      <div className="gs-pay-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gs-pay-close" onClick={onClose} disabled={loading}>×</button>

        {step === "offer" && (
          <>
            <div className="gs-pay-icon">
              <i className={product?.icon || "bi bi-shield-lock-fill"} />
            </div>
            <span className="gs-pay-badge">GOSUBSIDY SECURED CHECKOUT</span>
            <h2>
              {product?.name ||
                (productCode === "SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL"
                  ? "GoSubsidy 1-Year Advisory & Scheme Alerts"
                  : "GoSubsidy Service")}
            </h2>
            <p>
              {product?.description ||
                (productCode === "SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL"
                  ? "1-year access to GoSubsidy expert advisory, government scheme alerts and policy updates."
                  : "Access professional business and compliance workflows.")}
            </p>
            
            <div className="gs-pay-price">
              {appliedOffer ? (
                <>
                  <span className="gs-old-price">₹{formatPrice(displayPrice)}</span>
                  <span>₹{formatPrice(finalPayablePrice)}</span>
                </>
              ) : (
                `₹${formatPrice(displayPrice)}`
              )}
            </div>

            {appliedOffer && (
              <div className="gs-offer-pill-tag">
                <i className="bi bi-tag-fill" /> {appliedOffer.code} applied (20% OFF)
              </div>
            )}

            <button type="button" className="gs-pay-button" onClick={() => setStep("checkout")} disabled={loading}>
              Continue to Payment <i className="bi bi-arrow-right ms-2" />
            </button>
          </>
        )}

        {step === "checkout" && !showAuthForm && (
          <>
            <div className="gs-pay-icon">
              <i className="bi bi-patch-check-fill" />
            </div>
            <span className="gs-pay-badge">REVIEW SUMMARY</span>
            <h2>Order Details</h2>

            {/* COUPON REDEMPTION BOX */}
            {appliedOffer ? (
              <div className="gs-applied-promo-box">
                <div>
                  <strong>
                    <i className="bi bi-check-circle-fill text-success me-1" />
                    {appliedOffer.code}
                  </strong>
                  <span>20% savings applied!</span>
                </div>
                <button type="button" onClick={handleRemovePromo} className="gs-remove-promo-link">
                  Remove
                </button>
              </div>
            ) : (
              <div className="gs-coupon-entry-row">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. GOSUBSIDY20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                />
                <button type="button" onClick={() => handleApplyPromo()} disabled={!promoInput.trim()}>
                  Apply
                </button>
              </div>
            )}
            {promoError && <p className="gs-promo-error-msg">{promoError}</p>}

            {/* ORDER SUMMARY BREAKDOWN */}
            <div className="gs-checkout-summary">
              <div><span>Service</span><strong>{product?.name}</strong></div>
              <div><span>Service Code</span><strong>{productCode}</strong></div>
              <div><span>Standard Fee</span><strong>₹{formatPrice(displayPrice)}</strong></div>
              {discountAmount > 0 && (
                <div className="gs-discount-summary-row">
                  <span>Promo Discount ({appliedOffer?.code})</span>
                  <strong className="text-success">- ₹{formatPrice(discountAmount)}</strong>
                </div>
              )}
              <div className="gs-checkout-total">
                <span>Total Payable</span>
                <strong>₹{formatPrice(finalPayablePrice)}</strong>
              </div>
            </div>

            {/* Mobile Number Input */}
            <div className="mb-3 text-start">
              <label className="form-label small fw-bold text-dark mb-1">
                Mobile Number (10 Digits) <span className="text-danger">*</span>
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light fw-bold text-muted">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  className="form-control"
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  required
                />
              </div>
            </div>

            <button type="button" className="gs-pay-button" onClick={openCheckout} disabled={loading}>
              {loading ? "Connecting Gateway..." : `Pay ₹${formatPrice(finalPayablePrice)} via Razorpay`}
            </button>
            <button type="button" className="gs-back-button" onClick={() => setStep("offer")} disabled={loading}>
              Back
            </button>

            {!user && (
              <div 
                className="alert alert-info py-2 px-3 text-center small mb-0 mt-3"
                style={{ fontSize: "12px", background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" }}
              >
                <i className="bi bi-info-circle-fill text-success me-1" />
                <span>
                  Please{" "}
                  <button 
                    type="button" 
                    className="btn btn-link p-0 fw-bold text-success text-decoration-underline align-baseline"
                    onClick={() => setShowAuthForm(true)}
                  >
                    log in to your GoSubsidy account
                  </button>{" "}
                  before making a payment.
                </span>
              </div>
            )}

            {message && <div className="gs-payment-message">{message}</div>}
          </>
        )}

        {/* INLINE AUTHENTICATION POPUP VIEW */}
        {showAuthForm && (
          <div className="gs-inline-auth-box">
            <h4 className="fw-bold mb-1" style={{ fontSize: "17px", color: "#0f172a" }}>
              {authMode === "login" ? "Sign In to GoSubsidy" : "Create Account"}
            </h4>
            <p className="text-muted small mb-3">Authentication required to complete your purchase.</p>

            {message && <div className="alert alert-danger py-1 small mb-2">{message}</div>}

            <button
              type="button"
              className="btn btn-outline-secondary w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
              style={{ fontSize: "13px", borderRadius: "10px" }}
              onClick={async () => {
                try {
                  await signInWithGoogle();
                } catch (err) {
                  setMessage(err.message || "Google sign-in failed.");
                }
              }}
            >
              <svg width="15" height="15" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            <div className="position-relative my-2 text-center">
              <hr className="text-muted" />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted" style={{ fontSize: "10px" }}>OR</span>
            </div>

            <form onSubmit={handleAuthAction} className="text-start">
              {authMode === "register" && (
                <div className="mb-2">
                  <label className="form-label small fw-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Bhanu Prasad"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="name@business.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold mb-1">Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="gs-pay-button py-2 mb-2" disabled={loading}>
                {loading ? "Processing..." : authMode === "login" ? "Sign In & Continue" : "Register & Continue"}
              </button>
            </form>

            <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: "12px" }}>
              <button
                type="button"
                className="btn btn-link p-0 text-muted"
                onClick={() => setShowAuthForm(false)}
              >
                &larr; Back to Order Summary
              </button>
              <button
                type="button"
                className="btn btn-link p-0 text-success fw-bold"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              >
                {authMode === "login" ? "Create Account" : "Existing User? Login"}
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .gs-pay-overlay {
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(8px);
        }
        .gs-pay-modal {
          position: relative; width: min(480px, 100%);
          background: #ffffff; border-radius: 24px;
          padding: 34px; text-align: center;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
        }
        .gs-pay-close {
          position: absolute; right: 18px; top: 14px;
          width: 36px; height: 36px; border: 0;
          border-radius: 50%; background: #f1f5f9;
          font-size: 22px; cursor: pointer;
        }
        .gs-pay-icon {
          width: 68px; height: 68px; margin: 0 auto 14px;
          border-radius: 20px; background: #e0f2fe; color: #0284c7;
          display: flex; align-items: center; justify-content: center; font-size: 32px;
        }
        .gs-pay-badge {
          display: inline-block; padding: 4px 12px; border-radius: 999px;
          background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 800;
        }
        .gs-pay-modal h2 { margin: 12px 0 6px; font-size: 20px; color: #0f172a; font-weight: 800; }
        .gs-pay-modal p { font-size: 13px; color: #64748b; line-height: 1.5; }
        .gs-pay-price { font-size: 36px; font-weight: 900; color: #0f172a; margin: 14px 0 16px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .gs-old-price { font-size: 22px; text-decoration: line-through; color: #94a3b8; font-weight: 600; }
        .gs-offer-pill-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;
          font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px;
          margin-bottom: 18px;
        }
        .gs-pay-button {
          width: 100%; border: 0; border-radius: 12px;
          padding: 12px; color: #ffffff; background: #0284c7;
          font-weight: 800; font-size: 13.5px; cursor: pointer;
        }
        .gs-pay-button:hover { background: #0369a1; }
        .gs-checkout-summary {
          margin: 14px 0; padding: 14px; background: #f8fafc;
          border: 1px solid #e2e8f0; border-radius: 14px; text-align: left;
        }
        .gs-checkout-summary > div { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12.5px; }
        .gs-discount-summary-row span, .gs-discount-summary-row strong { color: #059669 !important; font-weight: 700; }
        .gs-checkout-total { border-top: 1px solid #cbd5e1; margin-top: 6px; padding-top: 10px !important; font-weight: 800; }
        .gs-checkout-total strong { color: #0284c7; font-size: 18px; }
        
        /* Promo Input & Applied State */
        .gs-applied-promo-box {
          display: flex; justify-content: space-between; align-items: center;
          background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 10px;
          padding: 8px 12px; margin-bottom: 12px; text-align: left;
        }
        .gs-applied-promo-box strong { display: block; font-size: 12px; color: #065f46; }
        .gs-applied-promo-box span { font-size: 10.5px; color: #047857; }
        .gs-remove-promo-link {
          background: transparent; border: none; color: #dc2626; font-size: 11px;
          font-weight: 700; cursor: pointer; text-decoration: underline;
        }
        .gs-coupon-entry-row {
          display: flex; gap: 6px; margin-bottom: 8px;
        }
        .gs-coupon-entry-row input {
          flex: 1; border: 1px solid #cbd5e1; border-radius: 8px;
          padding: 6px 10px; font-size: 12px; font-weight: 700; text-transform: uppercase;
        }
        .gs-coupon-entry-row button {
          background: #0284c7; color: #fff; border: 0; border-radius: 8px;
          padding: 0 14px; font-size: 11px; font-weight: 800; cursor: pointer;
        }
        .gs-coupon-entry-row button:disabled { background: #94a3b8; }
        .gs-promo-error-msg { color: #dc2626; font-size: 11px; text-align: left; margin: -4px 0 8px; font-weight: 600; }

        .gs-back-button { border: 0; background: transparent; color: #64748b; margin-top: 8px; cursor: pointer; font-size: 12px; }
        .gs-payment-message { margin-top: 12px; padding: 8px; background: #eff6ff; color: #1d4ed8; border-radius: 8px; font-size: 12px; }
        .gs-inline-auth-box { padding-top: 4px; }
      `}</style>
    </div>
  );
}