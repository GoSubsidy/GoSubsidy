import React, { useEffect, useState } from "react";
import PaymentModal from "./PaymentModal";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function PremiumGate({ product, children }) {
  const { user, session, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [entitlementRefresh, setEntitlementRefresh] = useState(0);

  useEffect(() => {
    let active = true;

    const checkEntitlement = async () => {
      if (!product) {
        if (active) {
          setChecking(false);
          setUnlocked(true);
        }
        return;
      }

      if (authLoading) return;

      if (!user || !session?.access_token) {
        if (active) {
          setChecking(false);
          setUnlocked(false);
        }
        return;
      }

      try {
        setChecking(true);
        const response = await fetch(
          `${API_BASE_URL}/api/payment/entitlement/${encodeURIComponent(product.code)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();
        if (active) {
          setUnlocked(Boolean(response.ok && data?.success && data?.entitled));
        }
      } catch (error) {
        console.error("[PremiumGate] Entitlement check failed:", error);
        if (active) setUnlocked(false);
      } finally {
        if (active) setChecking(false);
      }
    };

    checkEntitlement();
    return () => {
      active = false;
    };
  }, [product?.code, user?.id, session?.access_token, authLoading, entitlementRefresh]);

  const handlePaymentSuccess = () => {
    setOpen(false);
    setUnlocked(false);
    setChecking(true);
    setEntitlementRefresh((value) => value + 1);
  };

  if (!product || unlocked) return children;

  if (checking) {
    return (
      <div className="gs-premium-loading">
        <div className="spinner-border" />
        <p>Checking your GoSubsidy premium access...</p>
      </div>
    );
  }

  return (
    <>
      <div className="gs-premium-page">
        <div className="gs-premium-card">
          <div className="gs-premium-lock">
            <i className="bi bi-lock-fill" />
          </div>
          <span className="gs-premium-label">SECURE PREMIUM ACCESS</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="gs-premium-price">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
            <small> / {product.validityDays} days</small>
          </div>
          <button
            className="btn btn-primary btn-lg rounded-pill px-5 fw-bold"
            onClick={() => setOpen(true)}
            disabled={!user}
          >
            {user ? `Unlock ${product.shortName || product.name}` : "Login Required"}
          </button>
        </div>
      </div>

      {open && user && (
        <PaymentModal
          product={product}
          onClose={() => setOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <style>{`
        .gs-premium-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; }
        .gs-premium-page { min-height: calc(100vh - 90px); display: flex; align-items: center; justify-content: center; padding: 70px 20px; background: #f8fafc; }
        .gs-premium-card { width: min(600px, 100%); text-align: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 28px; padding: 44px 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.06); }
        .gs-premium-lock { width: 72px; height: 72px; margin: 0 auto 16px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; background: #0284c7; }
        .gs-premium-label { color: #0284c7; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; }
        .gs-premium-card h1 { color: #0f172a; font-weight: 900; margin: 10px 0; }
        .gs-premium-card p { color: #64748b; font-size: 14px; }
        .gs-premium-price { color: #0f172a; font-size: 38px; font-weight: 900; margin: 16px 0 22px; }
      `}</style>
    </>
  );
}