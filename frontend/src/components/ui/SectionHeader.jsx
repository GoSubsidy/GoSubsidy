import React from "react";

export default function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  icon = "bi-grid",
  action = null,
  align = "between",
  divider = true,
  className = "",
}) {
  return (
    <div className={`mb-4 ${className}`}>

      {/* Badge */}

      {badge && (
        <div className="mb-2">
          <span
            className="badge rounded-pill px-3 py-2"
            style={{
              background:
                "rgba(13,110,253,.10)",
              color: "#0d6efd",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Header */}

      <div
        className={`d-flex flex-column flex-lg-row ${
          align === "between"
            ? "justify-content-between"
            : "justify-content-start"
        } align-items-lg-center`}
      >

        <div>

          <div className="d-flex align-items-center">

            <div
              className="me-3"
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg,#0d6efd,#20c997)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow:
                  "0 10px 24px rgba(13,110,253,.20)",
              }}
            >
              <i
                className={`bi ${icon}`}
                style={{
                  fontSize: 22,
                }}
              ></i>
            </div>

            <div>

              <h2
                className="fw-bold mb-1"
                style={{
                  fontSize: "2rem",
                }}
              >
                {title}

                {highlight && (
                  <span
                    style={{
                      color: "#0d6efd",
                    }}
                  >
                    {" "}
                    {highlight}
                  </span>
                )}
              </h2>

              {subtitle && (
                <p
                  className="text-muted mb-0"
                  style={{
                    maxWidth: 700,
                    lineHeight: 1.6,
                  }}
                >
                  {subtitle}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Right Action */}

        {action && (
          <div className="mt-3 mt-lg-0">
            {action}
          </div>
        )}

      </div>

      {/* Divider */}

      {divider && (
        <div
          className="mt-4"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,#0d6efd,rgba(13,110,253,.08))",
          }}
        />
      )}

    </div>
  );
}