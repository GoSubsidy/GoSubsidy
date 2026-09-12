import React from "react";

export default function InsuranceSidebar({
  insuranceType = "",
}) {
  return (
    <div className="position-sticky" style={{ top: "95px" }}>

      {/* Help Card */}

      <div
        className="card border-0 shadow-lg mb-4 overflow-hidden"
        style={{
          borderRadius: "22px",
          background:
            "linear-gradient(135deg,#032D58,#075E78)",
          color: "#fff",
        }}
      >
        <div className="card-body p-4">

          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "#FFC107",
              color: "#032D58",
            }}
          >
            <i className="bi bi-headset fs-3"></i>
          </div>

          <div
            className="text-uppercase fw-bold mb-2"
            style={{
              letterSpacing: "1px",
              fontSize: "11px",
              color: "#4CE5CA",
            }}
          >
            Need Help?
          </div>

          <h4 className="fw-bold mb-3">
            Insurance Assistance
          </h4>

          <p
            className="mb-0"
            style={{
              color: "#D7E6F2",
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            Compare policies from trusted insurance
            partners. Our experts help you choose
            the right protection based on your
            requirements.
          </p>

        </div>
      </div>

      {/* Selected Insurance */}

      {insuranceType && (

        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: 18 }}
        >

          <div className="card-body">

            <div className="fw-bold mb-3">

              Selected Insurance

            </div>

            <div
              className="rounded-3 p-3"
              style={{
                background: "#EEF6FF",
              }}
            >

              <i className="bi bi-shield-check me-2 text-primary"></i>

              <strong className="text-capitalize">

                {insuranceType}

              </strong>

            </div>

          </div>

        </div>

      )}

      {/* Why GoSubsidy */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: 18 }}
      >

        <div className="card-body">

          <h5 className="fw-bold mb-4">

            Why GoSubsidy?

          </h5>

          <Benefit
            icon="bi-grid"
            title="12 Insurance Categories"
            text="Personal, Business & Industrial"
          />

          <Benefit
            icon="bi-person-check"
            title="Expert Advisors"
            text="Professional Insurance Guidance"
          />

          <Benefit
            icon="bi-shield-lock"
            title="100% Secure"
            text="Privacy Protected Information"
          />

          <Benefit
            icon="bi-file-earmark-check"
            title="Documentation"
            text="Proposal & Policy Support"
          />

          <Benefit
            icon="bi-cash-stack"
            title="Best Quotes"
            text="Multiple Insurance Partners"
          />

          <Benefit
            icon="bi-headset"
            title="Claims Support"
            text="Assistance During Claims"
          />

        </div>

      </div>

      {/* Support */}

      <div
        className="card border-success shadow-sm"
        style={{
          borderRadius: 18,
          background: "#ECFFF8",
        }}
      >

        <div className="card-body">

          <div className="d-flex">

            <div className="me-3">

              <i
                className="bi bi-shield-lock-fill fs-3"
                style={{
                  color: "#00B894",
                }}
              ></i>

            </div>

            <div>

              <h6 className="fw-bold">

                Secure Information

              </h6>

              <small className="text-muted">

                Your information is encrypted and
                shared only with selected insurers
                for quotation purposes.

              </small>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   BENEFIT CARD
===================================================== */

function Benefit({
  icon,
  title,
  text,
}) {
  return (
    <div
      className="d-flex align-items-start mb-3"
    >

      <div
        className="me-3 d-flex align-items-center justify-content-center"
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: "#EEF6FF",
          color: "#0D6EFD",
        }}
      >

        <i className={`bi ${icon}`}></i>

      </div>

      <div>

        <div
          className="fw-semibold"
          style={{
            fontSize: "14px",
          }}
        >

          {title}

        </div>

        <small
          className="text-muted"
          style={{
            lineHeight: 1.5,
          }}
        >

          {text}

        </small>

      </div>

    </div>
  );
}