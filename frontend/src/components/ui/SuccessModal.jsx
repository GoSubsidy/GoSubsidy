import React from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function SuccessModal({
  show = false,

  title = "Success!",

  message = "Your request has been completed successfully.",

  reference = "",

  icon = "bi-check-circle-fill",

  primaryText = "Continue",

  secondaryText = "Close",

  onPrimary,

  onSecondary,

  loading = false,
}) {

  if (!show) return null;

  return (

    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(0,0,0,.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 1055,
      }}
    >

      <div className="modal-dialog modal-dialog-centered modal-lg">

        <div
          className="modal-content border-0"
          style={{
            borderRadius: 30,
            overflow: "hidden",
            background:
              "rgba(255,255,255,.96)",
          }}
        >

          {/* Header */}

          <div
            className="text-center p-5"
            style={{
              background:
                "linear-gradient(135deg,#198754,#20c997)",
              color: "#fff",
            }}
          >

            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >

              <i
                className={`bi ${icon}`}
                style={{
                  fontSize: 60,
                }}
              ></i>

            </div>

            <h2 className="fw-bold mt-4">

              {title}

            </h2>

          </div>

          {/* Body */}

          <div className="modal-body p-5 text-center">

            <p
              className="text-muted"
              style={{
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              {message}
            </p>

            {reference && (

              <div
                className="alert alert-success mt-4"
                style={{
                  borderRadius: 16,
                }}
              >

                <div
                  className="fw-semibold text-muted mb-2"
                >
                  Reference Number
                </div>

                <h4 className="fw-bold text-success mb-0">

                  {reference}

                </h4>

              </div>

            )}

          </div>

          {/* Footer */}

          <div
            className="modal-footer justify-content-center border-0 pb-5"
          >

            <div
              className="d-flex flex-wrap gap-3"
            >

              <PrimaryButton
                loading={loading}
                icon="bi-arrow-right-circle"
                onClick={onPrimary}
              >

                {primaryText}

              </PrimaryButton>

              <SecondaryButton
                icon="bi-x-circle"
                onClick={onSecondary}
              >

                {secondaryText}

              </SecondaryButton>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}