import React from "react";

export default function LoadingOverlay({
  show = false,
  title = "Loading...",
  message = "Please wait while we process your request.",
  fullscreen = false,
  transparent = false,
  progress = null,
}) {
  if (!show) return null;

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${
        fullscreen ? "position-fixed" : "position-absolute"
      }`}
      style={{
        inset: 0,
        zIndex: 9999,
        background: transparent
          ? "rgba(255,255,255,.45)"
          : "rgba(255,255,255,.82)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          width: 380,
          maxWidth: "92%",
          borderRadius: 28,
          background: "rgba(255,255,255,.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="card-body text-center p-5">

          {/* Spinner */}

          <div
            className="mx-auto mb-4"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#0d6efd,#20c997)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow:
                "0 20px 40px rgba(13,110,253,.25)",
            }}
          >
            <div
              className="spinner-border text-light"
              style={{
                width: "3rem",
                height: "3rem",
              }}
            ></div>
          </div>

          {/* Title */}

          <h4 className="fw-bold mb-3">
            {title}
          </h4>

          {/* Message */}

          <p
            className="text-muted mb-4"
            style={{
              lineHeight: 1.7,
            }}
          >
            {message}
          </p>

          {/* Progress */}

          {progress !== null && (
            <>
              <div
                className="progress"
                style={{
                  height: 10,
                  borderRadius: 20,
                }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg,#0d6efd,#20c997)",
                  }}
                ></div>
              </div>

              <div
                className="mt-2 text-muted"
                style={{
                  fontSize: 13,
                }}
              >
                {progress}%
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}