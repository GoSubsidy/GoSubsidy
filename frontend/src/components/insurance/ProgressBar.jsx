import React from "react";

/* =========================================================
   GOSUBSIDY INSURANCE
   QUOTE JOURNEY PROGRESS BAR
========================================================= */

const DEFAULT_STEPS = [
  {
    id: 1,
    title: "Insurance",
    subtitle: "Choose Product",
    icon: "bi-shield-check",
  },
  {
    id: 2,
    title: "Your Details",
    subtitle: "Basic Information",
    icon: "bi-person",
  },
  {
    id: 3,
    title: "Coverage",
    subtitle: "Protection Needs",
    icon: "bi-ui-checks",
  },
  {
    id: 4,
    title: "Review",
    subtitle: "Confirm & Compare",
    icon: "bi-check2-circle",
  },
];

export default function ProgressBar({
  currentStep = 1,
  steps = DEFAULT_STEPS,
  onStepClick,
}) {
  const safeCurrentStep = Math.min(
    Math.max(Number(currentStep) || 1, 1),
    steps.length
  );

  const handleStepClick = (stepNumber) => {
    // User can only return to a completed step.
    if (
      typeof onStepClick === "function" &&
      stepNumber < safeCurrentStep
    ) {
      onStepClick(stepNumber);
    }
  };

  return (
    <>
      <div
        className="gsi-progress-wrapper"
        aria-label="Insurance quote progress"
      >
        <div className="gsi-progress-top">
          <div>
            <span className="gsi-progress-eyebrow">
              QUOTE PROGRESS
            </span>

            <strong>
              Step {safeCurrentStep} of {steps.length}
            </strong>
          </div>

          <span className="gsi-progress-percentage">
            {Math.round(
              (safeCurrentStep / steps.length) * 100
            )}
            %
          </span>
        </div>

        <div className="gsi-progress-track">
          <span
            className="gsi-progress-track-fill"
            style={{
              width: `${
                steps.length <= 1
                  ? 100
                  : ((safeCurrentStep - 1) /
                      (steps.length - 1)) *
                    100
              }%`,
            }}
          />
        </div>

        <div className="gsi-progress-steps">
          {steps.map((step, index) => {
            const stepNumber = index + 1;

            const completed =
              stepNumber < safeCurrentStep;

            const active =
              stepNumber === safeCurrentStep;

            const clickable =
              completed &&
              typeof onStepClick === "function";

            return (
              <React.Fragment key={step.id ?? stepNumber}>
                <button
                  type="button"
                  className={[
                    "gsi-progress-step",
                    completed ? "completed" : "",
                    active ? "active" : "",
                    clickable ? "clickable" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    handleStepClick(stepNumber)
                  }
                  disabled={!clickable}
                  aria-current={
                    active ? "step" : undefined
                  }
                >
                  <span className="gsi-step-circle">
                    {completed ? (
                      <i className="bi bi-check-lg" />
                    ) : (
                      <i
                        className={`bi ${
                          step.icon ||
                          "bi-circle"
                        }`}
                      />
                    )}
                  </span>

                  <span className="gsi-step-copy">
                    <strong>{step.title}</strong>

                    <small>
                      {step.subtitle}
                    </small>
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <span
                    className={[
                      "gsi-step-connector",
                      completed
                        ? "completed"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        /* ================================================
           GOSUBSIDY INSURANCE PROGRESS
        ================================================= */

        .gsi-progress-wrapper {
          --gsi-blue: #087cf0;
          --gsi-blue-dark: #075be8;
          --gsi-green: #00b894;
          --gsi-navy: #032d58;
          --gsi-text: #18334f;
          --gsi-muted: #7b8da1;
          --gsi-border: #e2eaf2;

          width: 100%;
          padding: 22px 26px 25px;

          border: 1px solid var(--gsi-border);
          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.98),
              rgba(247,251,255,0.98)
            );

          box-shadow:
            0 14px 38px rgba(26, 62, 100, 0.06);
        }


        /* ================================================
           TOP INFORMATION
        ================================================= */

        .gsi-progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 13px;
        }

        .gsi-progress-top > div {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .gsi-progress-eyebrow {
          color: var(--gsi-blue);

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .gsi-progress-top strong {
          color: var(--gsi-text);

          font-size: 11px;
          font-weight: 800;
        }

        .gsi-progress-percentage {
          padding: 5px 9px;

          border-radius: 20px;

          color: #007e63;
          background: #e9faf6;

          font-size: 9px;
          font-weight: 900;
        }


        /* ================================================
           TRACK
        ================================================= */

        .gsi-progress-track {
          position: relative;

          width: 100%;
          height: 5px;

          margin-bottom: 22px;

          overflow: hidden;

          border-radius: 50px;

          background: #eaf0f6;
        }

        .gsi-progress-track-fill {
          position: absolute;

          top: 0;
          left: 0;

          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              var(--gsi-blue),
              var(--gsi-green)
            );

          transition:
            width 0.35s ease;
        }


        /* ================================================
           STEPS
        ================================================= */

        .gsi-progress-steps {
          display: flex;
          align-items: center;

          width: 100%;
        }

        .gsi-progress-step {
          min-width: 100px;

          padding: 0;

          display: flex;
          align-items: center;

          gap: 9px;

          text-align: left;

          border: 0;
          outline: none;

          background: transparent;

          cursor: default;
        }

        .gsi-progress-step.clickable {
          cursor: pointer;
        }

        .gsi-progress-step:disabled {
          opacity: 1;
        }


        /* ================================================
           STEP CIRCLE
        ================================================= */

        .gsi-step-circle {
          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #8495a7;
          background: #f0f4f8;

          border: 1px solid #dce5ed;

          font-size: 14px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .gsi-progress-step.active
        .gsi-step-circle {
          color: #ffffff;

          border-color: transparent;

          background:
            linear-gradient(
              135deg,
              var(--gsi-blue),
              var(--gsi-blue-dark)
            );

          box-shadow:
            0 0 0 5px rgba(8,124,240,0.09),
            0 8px 20px rgba(8,124,240,0.16);
        }

        .gsi-progress-step.completed
        .gsi-step-circle {
          color: #ffffff;

          border-color: transparent;

          background:
            linear-gradient(
              135deg,
              #00b894,
              #00a17d
            );
        }

        .gsi-progress-step.clickable:hover
        .gsi-step-circle {
          transform: translateY(-2px);
        }


        /* ================================================
           STEP TEXT
        ================================================= */

        .gsi-step-copy {
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 2px;
        }

        .gsi-step-copy strong {
          color: #728397;

          font-size: 10px;
          font-weight: 850;

          white-space: nowrap;
        }

        .gsi-step-copy small {
          color: #a1adba;

          font-size: 7px;
          font-weight: 600;

          white-space: nowrap;
        }

        .gsi-progress-step.active
        .gsi-step-copy strong {
          color: var(--gsi-blue);
        }

        .gsi-progress-step.completed
        .gsi-step-copy strong {
          color: #008c6d;
        }


        /* ================================================
           CONNECTOR
        ================================================= */

        .gsi-step-connector {
          height: 2px;

          flex: 1;

          min-width: 18px;

          margin: 0 12px;

          border-radius: 20px;

          background: #e2e9f0;

          transition:
            background 0.3s ease;
        }

        .gsi-step-connector.completed {
          background:
            linear-gradient(
              90deg,
              var(--gsi-green),
              var(--gsi-blue)
            );
        }


        /* ================================================
           TABLET
        ================================================= */

        @media (max-width: 991px) {

          .gsi-progress-wrapper {
            padding: 20px;
          }

          .gsi-step-copy small {
            display: none;
          }

          .gsi-progress-step {
            min-width: auto;
          }

          .gsi-step-connector {
            margin: 0 8px;
          }

        }


        /* ================================================
           MOBILE
        ================================================= */

        @media (max-width: 767px) {

          .gsi-progress-top > div {
            flex-direction: column;
            align-items: flex-start;

            gap: 3px;
          }

          .gsi-progress-steps {
            justify-content: space-between;
          }

          .gsi-progress-step {
            flex-direction: column;

            gap: 6px;

            text-align: center;
          }

          .gsi-step-copy strong {
            font-size: 8px;
          }

          .gsi-step-copy small {
            display: none;
          }

          .gsi-step-connector {
            align-self: flex-start;

            margin:
              19px 5px 0;
          }

        }


        /* ================================================
           SMALL MOBILE
        ================================================= */

        @media (max-width: 480px) {

          .gsi-progress-wrapper {
            padding:
              18px 13px 20px;

            border-radius: 16px;
          }

          .gsi-step-circle {
            width: 32px;
            height: 32px;

            flex-basis: 32px;

            font-size: 12px;
          }

          .gsi-step-copy strong {
            font-size: 7px;
          }

          .gsi-step-connector {
            margin-top: 16px;
          }

        }

        .gsi-progress-track-fill {
    transition: width 0.35s ease;
}
      `}</style>
    </>
  );
}