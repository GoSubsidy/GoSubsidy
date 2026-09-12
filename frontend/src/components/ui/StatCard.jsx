import React from "react";

export default function StatCard({
  title,
  value,

  subtitle = "",

  icon = "bi-graph-up",

  color = "#0d6efd",

  trend,

  trendType = "up",

  onClick,

  loading = false,

  className = "",
}) {

  return (

    <div
      className={`card border-0 h-100 ${className}`}
      onClick={onClick}
      style={{

        borderRadius: "24px",

        background:
          "rgba(255,255,255,.88)",

        backdropFilter: "blur(18px)",

        WebkitBackdropFilter:
          "blur(18px)",

        border:
          "1px solid rgba(255,255,255,.45)",

        boxShadow:
          "0 12px 35px rgba(15,23,42,.08)",

        cursor:
          onClick ? "pointer" : "default",

        transition: "all .30s ease",

      }}

      onMouseEnter={(e)=>{

        e.currentTarget.style.transform =
          "translateY(-6px)";

        e.currentTarget.style.boxShadow =
          "0 20px 45px rgba(13,110,253,.18)";

      }}

      onMouseLeave={(e)=>{

        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 12px 35px rgba(15,23,42,.08)";

      }}

    >

      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-start">

          {/* Left */}

          <div className="flex-grow-1">

            <div
              className="text-muted mb-2"
              style={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {title}
            </div>

            {loading ? (

              <div
                className="placeholder-glow"
              >

                <span
                  className="placeholder col-8"
                  style={{
                    height: 34,
                  }}
                ></span>

              </div>

            ) : (

              <h2
                className="fw-bold mb-2"
                style={{
                  fontSize: "2rem",
                }}
              >
                {value}
              </h2>

            )}

            {subtitle && (

              <div
                className="text-muted"
                style={{
                  fontSize: 13,
                }}
              >
                {subtitle}
              </div>

            )}

          </div>

          {/* Icon */}

          <div

            style={{

              width: 64,

              height: 64,

              borderRadius: 20,

              background: color,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              color: "#fff",

              fontSize: 28,

              boxShadow:
                "0 12px 28px rgba(13,110,253,.25)",

            }}

          >

            <i className={`bi ${icon}`}></i>

          </div>

        </div>

        {/* Trend */}

        {trend && (

          <div className="mt-4">

            <span

              className={`badge rounded-pill px-3 py-2 ${
                trendType === "up"
                  ? "bg-success"
                  : trendType === "down"
                  ? "bg-danger"
                  : "bg-primary"
              }`}

            >

              <i

                className={`bi ${
                  trendType === "up"
                    ? "bi-arrow-up"

                    : trendType === "down"

                    ? "bi-arrow-down"

                    : "bi-dash"
                } me-1`}

              ></i>

              {trend}

            </span>

          </div>

        )}

      </div>

    </div>

  );

}