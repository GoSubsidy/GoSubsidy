import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PromoModal.css";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a 2-second delay if not closed in current session
    const hasSeenModal = sessionStorage.getItem("gs_promo_seen");

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    sessionStorage.setItem("gs_promo_seen", "true");
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="gs-promo-overlay" onClick={closeModal}>
      <div
        className="gs-promo-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          className="gs-promo-close-btn"
          onClick={closeModal}
          aria-label="Close offer modal"
        >
          <i className="bi bi-x-lg" />
        </button>

        {/* Modal Content */}
        <div className="gs-promo-content">
          <div className="gs-promo-header">
            <img
              src="/images/gosubsidy-logo.png"
              alt="GoSubsidy"
            />

            <span className="gs-promo-brand-text">
              <span style={{ color: "#00A66A" }}>Go</span>
              <span style={{ color: "#FF6800" }}>Subsidy</span>
            </span>
          </div>

          <div className="gs-promo-badge">
            <span>Special Offer</span>
          </div>

          <h2 className="gs-promo-title">
            Unlock Flat <span>20% OFF</span>
          </h2>

          <p className="gs-promo-subtitle">
            On all Government Schemes, DPR Reports &amp; Business
            Registrations.
          </p>

          <div className="gs-promo-coupon-box">
            <span className="gs-coupon-label">
              USE PROMO CODE
            </span>

            <strong className="gs-coupon-code">
              GOSUBSIDY20
            </strong>
          </div>

          <Link
            to="/services/proprietorship"
            className="gs-promo-cta-btn"
            onClick={closeModal}
          >
            Claim Offer Now{" "}
            <i className="bi bi-arrow-right ms-2" />
          </Link>

          <small className="gs-promo-terms">
            *Valid for today only. Applicable at final checkout.
          </small>
        </div>
      </div>
    </div>
  );
}