import React from "react";

export default function EmptyState({
  title = "No Data Found",
  description = "Nothing to display right now.",
  icon = "bi-inbox",
  buttonText,
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  illustration,
  height = 380,
}) {
  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: "28px",
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5"
        style={{
          minHeight: height,
        }}
      >
        {/* Illustration */}

        {illustration ? (
          <img
            src={illustration}
            alt="Empty"
            className="img-fluid mb-4"
            style={{
              maxHeight: 180,
            }}
          />
        ) : (
          <div
            className="mb-4"
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#0d6efd,#20c997)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "48px",
            }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
        )}

        {/* Title */}

        <h3 className="fw-bold mb-3">
          {title}
        </h3>

        {/* Description */}

        <p
          className="text-muted mb-4"
          style={{
            maxWidth: 500,
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>

        {/* Buttons */}

        {(buttonText || secondaryButtonText) && (
          <div className="d-flex flex-wrap gap-3">

            {buttonText && (
              <button
                className="btn btn-primary px-4"
                onClick={onButtonClick}
              >
                {buttonText}
              </button>
            )}

            {secondaryButtonText && (
              <button
                className="btn btn-outline-primary px-4"
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonText}
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}