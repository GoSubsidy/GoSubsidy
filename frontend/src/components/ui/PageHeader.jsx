import React from "react";

export default function PageHeader({
  badge,
  title,
  highlight,
  subtitle,
  icon = "bi-grid",
  breadcrumbs = [],
  action = null,
  background =
    "linear-gradient(135deg,#0d6efd 0%,#0f766e 55%,#16a34a 100%)",
}) {
  return (
    <div
      className="position-relative overflow-hidden mb-4"
      style={{
        background,
        borderRadius: "28px",
        color: "#fff",
      }}
    >
      {/* Decorative Background */}

      <div
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
          top: -130,
          right: -80,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255,255,255,.05)",
          bottom: -90,
          left: -60,
        }}
      />

      <div className="position-relative p-4 p-lg-5">

        {/* Breadcrumb */}

        {breadcrumbs.length > 0 && (

          <nav className="mb-3">

            <ol
              className="breadcrumb mb-0"
              style={{
                fontSize: 14,
              }}
            >

              {breadcrumbs.map((item, index) => (

                <li
                  key={index}
                  className={`breadcrumb-item ${
                    index ===
                    breadcrumbs.length - 1
                      ? "active"
                      : ""
                  }`}
                >

                  <span
                    style={{
                      color:
                        index ===
                        breadcrumbs.length - 1
                          ? "#FFD43B"
                          : "rgba(255,255,255,.90)",
                    }}
                  >
                    {item}
                  </span>

                </li>

              ))}

            </ol>

          </nav>

        )}

        <div className="row align-items-center">

          {/* LEFT */}

          <div className="col-lg-8">

            {badge && (

              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  background:
                    "rgba(255,255,255,.15)",
                  backdropFilter:
                    "blur(10px)",
                  fontSize: 13,
                }}
              >
                {badge}
              </span>

            )}

            <div className="d-flex align-items-center mb-3">

              <div
                className="me-3"
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 20,
                  background:
                    "rgba(255,255,255,.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter:
                    "blur(15px)",
                }}
              >
                <i
                  className={`bi ${icon}`}
                  style={{
                    fontSize: 32,
                  }}
                ></i>
              </div>

              <div>

                <h1
                  className="fw-bold mb-1"
                  style={{
                    fontSize: "2.4rem",
                  }}
                >
                  {title}

                  {highlight && (
                    <>
                      <br />

                      <span
                        style={{
                          color: "#FFD43B",
                        }}
                      >
                        {highlight}
                      </span>
                    </>
                  )}

                </h1>

              </div>

            </div>

            {subtitle && (

              <p
                className="mb-0"
                style={{
                  color:
                    "rgba(255,255,255,.90)",
                  fontSize: "1.05rem",
                  maxWidth: 700,
                  lineHeight: 1.7,
                }}
              >
                {subtitle}
              </p>

            )}

          </div>

          {/* RIGHT */}

          <div className="col-lg-4 mt-4 mt-lg-0 text-lg-end">

            {action}

          </div>

        </div>

      </div>
    </div>
  );
}