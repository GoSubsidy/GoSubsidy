import React from "react";

export default function HeroBanner({
  badge = "GoSubsidy Platform",

  title = "Welcome to GoSubsidy",

  highlight = "",

  subtitle = "",

  primaryButton,

  secondaryButton,

  stats = [],

  image = null,

  gradient =
    "linear-gradient(135deg,#0d6efd 0%,#0f766e 55%,#16a34a 100%)",
}) {
  return (
    <section
      className="position-relative overflow-hidden mb-5"
      style={{
        borderRadius: "32px",
        background: gradient,
        color: "#fff",
      }}
    >
      {/* Background */}

      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
          top: -150,
          right: -120,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(255,255,255,.05)",
          bottom: -100,
          left: -80,
        }}
      />

      <div className="container-fluid position-relative">

        <div className="row align-items-center">

          {/* LEFT */}

          <div className="col-lg-7">

            <div className="p-5">

              {/* Badge */}

              <div
                className="badge rounded-pill px-3 py-2 mb-4"
                style={{
                  background:
                    "rgba(255,255,255,.15)",

                  backdropFilter: "blur(12px)",

                  fontSize: "13px",
                }}
              >
                {badge}
              </div>

              {/* Title */}

              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "3rem",
                  lineHeight: 1.2,
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

              {/* Subtitle */}

              <p
                className="lead mb-4"
                style={{
                  maxWidth: 700,
                  color:
                    "rgba(255,255,255,.92)",
                }}
              >
                {subtitle}
              </p>

              {/* Buttons */}

              {(primaryButton ||
                secondaryButton) && (

                <div className="d-flex flex-wrap gap-3">

                  {primaryButton}

                  {secondaryButton}

                </div>

              )}

              {/* Stats */}

              {stats.length > 0 && (

                <div className="row mt-5">

                  {stats.map((item, index) => (

                    <div
                      key={index}
                      className="col-4"
                    >

                      <h2 className="fw-bold">

                        {item.value}

                      </h2>

                      <small>

                        {item.label}

                      </small>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* RIGHT */}

          <div className="col-lg-5 d-none d-lg-block">

            <div className="p-5">

              {image ? (

                <img
                  src={image}
                  alt="Hero"
                  className="img-fluid"
                  style={{
                    maxHeight: 380,
                    objectFit: "contain",
                  }}
                />

              ) : (

                <div
                  className="card border-0 shadow-lg"
                  style={{
                    borderRadius: "28px",

                    background:
                      "rgba(255,255,255,.15)",

                    backdropFilter: "blur(20px)",
                  }}
                >

                  <div className="card-body p-5 text-center">

                    <div
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: "28px",

                        background:
                          "linear-gradient(135deg,#FFD43B,#FFB703)",

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        margin: "auto",
                      }}
                    >

                      <i
                        className="bi bi-stars"
                        style={{
                          fontSize: 55,
                          color: "#0d6efd",
                        }}
                      ></i>

                    </div>

                    <h3 className="fw-bold mt-4">

                      Premium SaaS UI

                    </h3>

                    <p
                      style={{
                        color:
                          "rgba(255,255,255,.90)",
                      }}
                    >
                      Reusable Hero Banner
                      Component
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}