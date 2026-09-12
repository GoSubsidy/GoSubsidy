import React from "react";

export default function GlassCard({
  children,
  title,
  subtitle,
  icon,
  className = "",
  padding = "1.5rem",
  background = "rgba(255,255,255,0.82)",
  hover = true,
  style = {},
  headerAction = null,
}) {
  return (
    <div
      className={`card border-0 ${className}`}
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        background,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,.45)",
        boxShadow: hover
          ? "0 12px 40px rgba(15,23,42,.10)"
          : "0 8px 24px rgba(15,23,42,.06)",
        transition: "all .35s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!hover) return;

        e.currentTarget.style.transform =
          "translateY(-6px)";

        e.currentTarget.style.boxShadow =
          "0 25px 60px rgba(13,110,253,.18)";
      }}
      onMouseLeave={(e) => {
        if (!hover) return;

        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 12px 40px rgba(15,23,42,.10)";
      }}
    >
      {(title || subtitle || icon) && (
        <div
          className="d-flex align-items-center justify-content-between"
          style={{
            padding,
            paddingBottom: "1rem",
            borderBottom:
              "1px solid rgba(0,0,0,.06)",
          }}
        >
          <div className="d-flex align-items-center">

            {icon && (
              <div
                className="me-3"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg,#0d6efd,#20c997)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  boxShadow:
                    "0 8px 20px rgba(13,110,253,.25)",
                }}
              >
                <i className={`bi ${icon}`}></i>
              </div>
            )}

            <div>

              {title && (
                <h5 className="fw-bold mb-1">
                  {title}
                </h5>
              )}

              {subtitle && (
                <div
                  className="text-muted"
                  style={{
                    fontSize: 14,
                  }}
                >
                  {subtitle}
                </div>
              )}

            </div>

          </div>

          {headerAction}

        </div>
      )}

      <div
        style={{
          padding,
        }}
      >
        {children}
      </div>
    </div>
  );
}