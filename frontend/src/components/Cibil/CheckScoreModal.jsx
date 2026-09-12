import React, { useState } from "react";

export default function CheckScoreModal({
  show,
  onClose,
  onContinue,
}) {

  const [formData, setFormData] = useState({
    mobile: "",
    pan: "",
  });

  const [errors, setErrors] = useState({});

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.toUpperCase(),
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {

    const newErrors = {};

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Enter a valid PAN number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate()) return;

    onContinue(formData);

  };

  return (

    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(6px)",
      }}
    >

      <div className="modal-dialog modal-dialog-centered modal-xl">

        <div
          className="modal-content border-0 shadow-lg overflow-hidden"
          style={{
            borderRadius: "24px",
          }}
        >

          <div className="row g-0">

            {/* Left */}

            <div className="col-lg-7 bg-white">

              <div className="p-5">

                <div className="d-flex justify-content-between align-items-start mb-4">

                  <div>

                    <span className="badge bg-primary px-3 py-2 rounded-pill">

                      AI Credit Intelligence

                    </span>

                    <h2 className="fw-bold mt-3 mb-2">

                      Check Your Credit Score

                    </h2>

                    <p className="text-muted">

                      Verify your identity to fetch your latest
                      Credit Report securely.

                    </p>

                  </div>

                  <button
                    className="btn-close"
                    onClick={onClose}
                  ></button>

                </div>

                <form onSubmit={handleSubmit}>

                  <div className="mb-4">

                    <label className="form-label fw-semibold">

                      Mobile Number

                    </label>

                    <input
                      type="tel"
                      className="form-control modern-input"
                      placeholder="9876543210"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />

                    {errors.mobile && (

                      <small className="text-danger">

                        {errors.mobile}

                      </small>

                    )}

                  </div>

                  <div className="mb-4">

                    <label className="form-label fw-semibold">

                      PAN Number

                    </label>

                    <input
                      type="text"
                      className="form-control modern-input text-uppercase"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                    />

                    {errors.pan && (

                      <small className="text-danger">

                        {errors.pan}

                      </small>

                    )}

                  </div>

                  <div className="alert alert-light border rounded-4">

                    <i className="bi bi-lock-fill text-primary me-2"></i>

                    Your information is encrypted using
                    bank-grade security.

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 check-btn"
                  >

                    Continue Securely

                    <i className="bi bi-arrow-right ms-2"></i>

                  </button>

                </form>

              </div>

            </div>

            {/* Right */}

            <div
              className="col-lg-5 text-white"
              style={{
                background:
                  "linear-gradient(135deg,#2563eb,#0f766e)",
              }}
            >

              <div className="p-5 h-100 d-flex flex-column">

                <h3 className="fw-bold">

                  Why Check Your Score?

                </h3>

                <p className="opacity-75">

                  Your credit profile determines your chances
                  of getting loans and government financial support.

                </p>

                <div className="mt-4">

                  <div className="d-flex mb-4">

                    <div className="me-3">

                      <i className="bi bi-shield-check fs-2"></i>

                    </div>

                    <div>

                      <h6 className="fw-bold">

                        Secure Verification

                      </h6>

                      <small>

                        OTP based authentication.

                      </small>

                    </div>

                  </div>

                  <div className="d-flex mb-4">

                    <div className="me-3">

                      <i className="bi bi-speedometer2 fs-2"></i>

                    </div>

                    <div>

                      <h6 className="fw-bold">

                        Live Credit Score

                      </h6>

                      <small>

                        Updated score & report.

                      </small>

                    </div>

                  </div>

                  <div className="d-flex mb-4">

                    <div className="me-3">

                      <i className="bi bi-stars fs-2"></i>

                    </div>

                    <div>

                      <h6 className="fw-bold">

                        AI Recommendations

                      </h6>

                      <small>

                        Personalized improvement tips.

                      </small>

                    </div>

                  </div>

                  <div className="d-flex">

                    <div className="me-3">

                      <i className="bi bi-bank fs-2"></i>

                    </div>

                    <div>

                      <h6 className="fw-bold">

                        Loan Readiness

                      </h6>

                      <small>

                        Approval probability and eligibility.

                      </small>

                    </div>

                  </div>

                </div>

                <div className="mt-auto pt-5">

                  <div className="row text-center">

                    <div className="col">

                      <h3 className="fw-bold">

                        10K+

                      </h3>

                      <small>

                        Reports

                      </small>

                    </div>

                    <div className="col">

                      <h3 className="fw-bold">

                        98%

                      </h3>

                      <small>

                        Success

                      </small>

                    </div>

                    <div className="col">

                      <h3 className="fw-bold">

                        24×7

                      </h3>

                      <small>

                        AI Support

                      </small>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}