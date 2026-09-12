import React, { useEffect, useState } from "react";

export default function LoadingScreen() {

  const [step, setStep] = useState(0);

  const stages = [
    {
      icon: "bi-shield-check",
      title: "Verifying Identity",
      description: "Securely validating your PAN and mobile number."
    },
    {
      icon: "bi-file-earmark-text",
      title: "Fetching Credit Report",
      description: "Retrieving your latest credit information."
    },
    {
      icon: "bi-cpu",
      title: "AI Credit Analysis",
      description: "Analyzing repayment behaviour and credit profile."
    },
    {
      icon: "bi-speedometer2",
      title: "Calculating Credit Score",
      description: "Preparing your personalized credit score."
    },
    {
      icon: "bi-bank",
      title: "Checking Loan Eligibility",
      description: "Estimating approval probability."
    }
  ];

  useEffect(() => {

    if (step >= stages.length - 1) return;

    const timer = setTimeout(() => {

      setStep(step + 1);

    }, 1400);

    return () => clearTimeout(timer);

  }, [step]);

  const progress = ((step + 1) / stages.length) * 100;

  return (

    <section className="loading-screen">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-lg-7">

            <div className="loading-card">

              <div className="loading-logo">

                <i className="bi bi-credit-card-2-front-fill"></i>

              </div>

              <h2 className="fw-bold mt-4">

                Preparing Your Credit Report

              </h2>

              <p className="text-muted">

                Please wait while our AI securely processes your information.

              </p>

              <div className="progress loading-progress mt-4">

                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: `${progress}%` }}
                ></div>

              </div>

              <div className="loading-status mt-5">

                {stages.map((item, index) => (

                  <div
                    className={`status-item ${
                      index <= step ? "completed" : ""
                    }`}
                    key={index}
                  >

                    <div className="status-icon">

                      {index < step ? (

                        <i className="bi bi-check-circle-fill"></i>

                      ) : index === step ? (

                        <div className="spinner-border spinner-border-sm"></div>

                      ) : (

                        <i className={`bi ${item.icon}`}></i>

                      )}

                    </div>

                    <div>

                      <h6>{item.title}</h6>

                      <small>{item.description}</small>

                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-5 text-center">

                <small className="text-muted">

                  Powered by AI • Secure • Encrypted

                </small>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}