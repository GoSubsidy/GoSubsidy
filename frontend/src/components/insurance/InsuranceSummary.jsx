import React from "react";

const INSURANCE_LABELS = {
  health: "Health Insurance",
  motor: "Motor Insurance",
  life: "Life Insurance",
  business: "Business Insurance",
  property: "Fire & Property",
  industrial: "Industrial Insurance",
  poultry: "Poultry Insurance",
  livestock: "Livestock Insurance",
  agriculture: "Agriculture Insurance",
  marine: "Marine & Transit",
  travel: "Travel Insurance",
  employee: "Employee Insurance",
};

export default function InsuranceSummary({
  form = {},
  reference = "",
}) {
  const insuranceName =
    INSURANCE_LABELS[form.insuranceType] ||
    "Not Selected";

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: "20px",
      }}
    >
      <div className="card-body p-4">

        {/* Header */}

        <div className="d-flex align-items-center mb-4">

          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: 55,
              height: 55,
              borderRadius: "16px",
              background:
                "linear-gradient(135deg,#087CF0,#00B894)",
              color: "#fff",
            }}
          >
            <i className="bi bi-file-earmark-check fs-4"></i>
          </div>

          <div>

            <div
              className="text-uppercase fw-bold text-primary"
              style={{
                fontSize: "11px",
                letterSpacing: "1px",
              }}
            >
              Quote Summary
            </div>

            <h5 className="fw-bold mb-0">
              Insurance Request
            </h5>

          </div>

        </div>

        {/* Insurance */}

        <SummaryRow
          icon="bi-shield-check"
          label="Insurance Type"
          value={insuranceName}
        />

        <SummaryRow
          icon="bi-person"
          label="Customer"
          value={form.name || "-"}
        />

        <SummaryRow
          icon="bi-phone"
          label="Mobile"
          value={form.mobile || "-"}
        />

        <SummaryRow
          icon="bi-envelope"
          label="Email"
          value={form.email || "-"}
        />

        <SummaryRow
          icon="bi-geo-alt"
          label="Location"
          value={
            form.city
              ? `${form.city}${
                  form.state
                    ? ", " + form.state
                    : ""
                }`
              : "-"
          }
        />

        <SummaryRow
          icon="bi-card-checklist"
          label="Reference"
          value={
            reference ||
            "Generated after submission"
          }
        />

        <hr />

        <div className="mb-3">

          <h6 className="fw-bold">

            What Happens Next?

          </h6>

        </div>

        <TimelineItem
          number="1"
          title="Request Submitted"
          text="Your insurance request is securely submitted."
        />

        <TimelineItem
          number="2"
          title="Partner Matching"
          text="GoSubsidy finds suitable insurance partners."
        />

        <TimelineItem
          number="3"
          title="Live Quotes"
          text="Premiums and plans are generated."
        />

        <TimelineItem
          number="4"
          title="Choose Plan"
          text="Compare plans and continue to proposal."
        />

      </div>
    </div>
  );
}

/* ========================================= */

function SummaryRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="d-flex mb-3">

      <div
        className="me-3 d-flex align-items-center justify-content-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          background: "#EEF6FF",
          color: "#087CF0",
        }}
      >
        <i className={`bi ${icon}`}></i>
      </div>

      <div className="flex-grow-1">

        <small className="text-muted d-block">

          {label}

        </small>

        <strong
          style={{
            fontSize: "14px",
          }}
        >
          {value}
        </strong>

      </div>

    </div>
  );
}

/* ========================================= */

function TimelineItem({
  number,
  title,
  text,
}) {
  return (
    <div className="d-flex mb-4">

      <div
        className="me-3 d-flex align-items-center justify-content-center"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,#087CF0,#00B894)",
          color: "#fff",
          fontWeight: "700",
          flexShrink: 0,
        }}
      >
        {number}
      </div>

      <div>

        <div className="fw-semibold">

          {title}

        </div>

        <small className="text-muted">

          {text}

        </small>

      </div>

    </div>
  );
}