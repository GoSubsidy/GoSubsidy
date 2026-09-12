import React from "react";

export default function StepCard({
  step = 1,
  totalSteps = 4,

  title,
  subtitle,

  icon = "bi-check2-circle",

  children,

  completed = false,
  active = false,

  footer = null,

  className = "",
}) {
  const gradient = completed
    ? "linear-gradient(135deg,#198754,#20c997)"
    : active
    ? "linear-gradient(135deg,#0d6efd,#2563eb)"
    : "linear-gradient(135deg,#adb5bd,#ced4da)";

  return (
    <div
      className={`card border-0 shadow-lg ${className}`}
      style={{
        borderRadius: 28,
        overflow: "hidden",
        background: "rgba(255,255,255,.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.45)",
      }}
    >
      {/* Header */}

      <div
        className="d-flex align-items-center justify-content-between"
        style={{
          padding: "24px 30px",
          borderBottom: "1px solid rgba(0,0,0,.06)",
        }}
      >
        <div className="d-flex align-items-center">

          {/* Step Icon */}

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: gradient,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: 28,
              boxShadow:
                "0 12px 28px rgba(13,110,253,.25)",
            }}
          >
            {completed ? (
              <i className="bi bi-check-lg"></i>
            ) : (
              <i className={`bi ${icon}`}></i>
            )}
          </div>

          {/* Title */}

          <div className="ms-3">

            <div
              className="text-uppercase fw-semibold text-muted"
              style={{
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              Step {step} of {totalSteps}
            </div>

            <h3 className="fw-bold mb-1">
              {title}
            </h3>

            {subtitle && (
              <div className="text-muted">
                {subtitle}
              </div>
            )}

          </div>

        </div>

        {/* Status */}

        <span
          className={`badge rounded-pill px-3 py-2 ${
            completed
              ? "bg-success"
              : active
              ? "bg-primary"
              : "bg-secondary"
          }`}
        >
          {completed
            ? "Completed"
            : active
            ? "In Progress"
            : "Pending"}
        </span>
      </div>

      {/* Progress */}

      <div
        className="progress"
        style={{
          height: 6,
          borderRadius: 0,
        }}
      >
        <div
          className="progress-bar"
          style={{
            width: `${(step / totalSteps) * 100}%`,
            background: gradient,
          }}
        ></div>
      </div>

      {/* Body */}

      <div
        className="card-body"
        style={{
          padding: "30px",
        }}
      >
        {children}
      </div>

      {/* Footer */}

      {footer && (
        <div
          className="card-footer bg-white"
          style={{
            borderTop:
              "1px solid rgba(0,0,0,.06)",
            padding: "20px 30px",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}