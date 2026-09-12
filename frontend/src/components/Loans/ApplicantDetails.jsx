import React from "react";

export default function ApplicantDetails({
  loanType,
  data,
  onChange,
}) {
  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const isBusiness =
    loanType === "Business Loan" ||
    loanType === "Working Capital" ||
    loanType === "Subsidy Linked Loan" ||
    loanType === "Project Finance" ||
    loanType === "Machinery Loan" ||
    loanType === "Solar / Green Finance";

  const isPersonal =
    loanType === "Personal Loan";

  const isHome =
    loanType === "Home Loan";

  const isMortgage =
    loanType === "Mortgage / LAP";

  const isEducation =
    loanType === "Education Loan";

  const isVehicle =
    loanType === "Vehicle Loan";

  return (
    <div className="application-form-card">

      {/* HEADER */}

      <div className="application-section-title">
        <div className="section-number">
          02
        </div>

        <div>
          <span>APPLICANT PROFILE</span>

          <h2>
            Tell us about the applicant
          </h2>

          <p>
            Enter the basic information required to
            configure your {loanType || "loan"} application.
          </p>
        </div>
      </div>

      {/* ==========================================
          BASIC DETAILS
      ========================================== */}

      <div className="form-section">

        <h5>
          <i className="bi bi-person-vcard me-2"></i>
          Basic Information
        </h5>

        <div className="row g-3">

          <div className="col-md-6">
            <label>Full Name *</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter applicant full name"
              value={data.fullName || ""}
              onChange={(e) =>
                update("fullName", e.target.value)
              }
            />
          </div>

          <div className="col-md-3">
            <label>Date of Birth *</label>

            <input
              type="date"
              className="form-control"
              value={data.dob || ""}
              onChange={(e) =>
                update("dob", e.target.value)
              }
            />
          </div>

          <div className="col-md-3">
            <label>Gender</label>

            <select
              className="form-select"
              value={data.gender || ""}
              onChange={(e) =>
                update("gender", e.target.value)
              }
            >
              <option value="">
                Select
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Mobile Number *</label>

            <div className="input-group">
              <span className="input-group-text">
                +91
              </span>

              <input
                type="tel"
                className="form-control"
                maxLength="10"
                placeholder="10 digit mobile number"
                value={data.mobile || ""}
                onChange={(e) =>
                  update(
                    "mobile",
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </div>
          </div>

          <div className="col-md-6">
            <label>Email Address *</label>

            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={data.email || ""}
              onChange={(e) =>
                update("email", e.target.value)
              }
            />
          </div>

          <div className="col-md-4">
            <label>Marital Status</label>

            <select
              className="form-select"
              value={data.maritalStatus || ""}
              onChange={(e) =>
                update(
                  "maritalStatus",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option>Single</option>
              <option>Married</option>
              <option>Other</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Qualification</label>

            <select
              className="form-select"
              value={data.qualification || ""}
              onChange={(e) =>
                update(
                  "qualification",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option>10th</option>
              <option>12th</option>
              <option>Diploma</option>
              <option>Graduate</option>
              <option>Post Graduate</option>
              <option>Professional</option>
              <option>Other</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Residential Status</label>

            <select
              className="form-select"
              value={data.residentialStatus || ""}
              onChange={(e) =>
                update(
                  "residentialStatus",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option>Owned</option>
              <option>Rented</option>
              <option>Family Owned</option>
              <option>Company Provided</option>
            </select>
          </div>

        </div>
      </div>

      {/* ==========================================
          PERSONAL LOAN
      ========================================== */}

      {isPersonal && (
        <div className="dynamic-loan-section">

          <div className="dynamic-header">
            <i className="bi bi-person"></i>

            <div>
              <small>
                PERSONAL LOAN PROFILE
              </small>

              <h5>
                Employment Details
              </h5>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-4">
              <label>Employment Type *</label>

              <select
                className="form-select"
                value={data.employmentType || ""}
                onChange={(e) =>
                  update(
                    "employmentType",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Salaried</option>
                <option>Self Employed</option>
                <option>Professional</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Employer Name</label>

              <input
                className="form-control"
                placeholder="Employer / company"
                value={data.employerName || ""}
                onChange={(e) =>
                  update(
                    "employerName",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <label>
                Monthly Net Income
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Monthly income"
                  value={data.monthlyIncome || ""}
                  onChange={(e) =>
                    update(
                      "monthlyIncome",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <label>
                Total Work Experience
              </label>

              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={data.workExperience || ""}
                  onChange={(e) =>
                    update(
                      "workExperience",
                      e.target.value
                    )
                  }
                />

                <span className="input-group-text">
                  Years
                </span>
              </div>
            </div>

            <div className="col-md-4">
              <label>
                Current Employer Experience
              </label>

              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={
                    data.currentEmployerExperience ||
                    ""
                  }
                  onChange={(e) =>
                    update(
                      "currentEmployerExperience",
                      e.target.value
                    )
                  }
                />

                <span className="input-group-text">
                  Years
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          BUSINESS / SUBSIDY / WC / PROJECT
      ========================================== */}

      {isBusiness && (
        <div className="dynamic-loan-section">

          <div className="dynamic-header">

            <i className="bi bi-buildings"></i>

            <div>
              <small>
                BUSINESS PROFILE
              </small>

              <h5>
                Enterprise Information
              </h5>
            </div>

          </div>

          <div className="row g-3">

            <div className="col-md-6">
              <label>
                Business / Enterprise Name *
              </label>

              <input
                className="form-control"
                placeholder="Enter enterprise name"
                value={data.businessName || ""}
                onChange={(e) =>
                  update(
                    "businessName",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-3">
              <label>Constitution *</label>

              <select
                className="form-select"
                value={data.constitution || ""}
                onChange={(e) =>
                  update(
                    "constitution",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Proprietorship</option>
                <option>Partnership</option>
                <option>LLP</option>
                <option>Private Limited</option>
                <option>Public Limited</option>
                <option>Cooperative</option>
                <option>Trust / Society</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>
                Business Vintage
              </label>

              <div className="input-group">

                <input
                  type="number"
                  className="form-control"
                  value={data.businessVintage || ""}
                  onChange={(e) =>
                    update(
                      "businessVintage",
                      e.target.value
                    )
                  }
                />

                <span className="input-group-text">
                  Years
                </span>

              </div>
            </div>

            <div className="col-md-4">
              <label>
                Business Sector *
              </label>

              <select
                className="form-select"
                value={data.businessSector || ""}
                onChange={(e) =>
                  update(
                    "businessSector",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Sector
                </option>

                <option>Manufacturing</option>
                <option>Service</option>
                <option>Trading</option>
                <option>Agriculture</option>
                <option>Food Processing</option>
                <option>Dairy</option>
                <option>Poultry</option>
                <option>Renewable Energy</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Transport</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                Annual Turnover
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Annual turnover"
                  value={data.annualTurnover || ""}
                  onChange={(e) =>
                    update(
                      "annualTurnover",
                      e.target.value
                    )
                  }
                />

              </div>
            </div>

            <div className="col-md-4">
              <label>
                Annual Net Profit
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={data.annualProfit || ""}
                  onChange={(e) =>
                    update(
                      "annualProfit",
                      e.target.value
                    )
                  }
                />

              </div>
            </div>

            <div className="col-md-4">
              <label>
                Udyam Registered?
              </label>

              <select
                className="form-select"
                value={data.udyamRegistered || ""}
                onChange={(e) =>
                  update(
                    "udyamRegistered",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                GST Registered?
              </label>

              <select
                className="form-select"
                value={data.gstRegistered || ""}
                onChange={(e) =>
                  update(
                    "gstRegistered",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>Yes</option>
                <option>No</option>
                <option>Not Applicable</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                Number of Employees
              </label>

              <input
                type="number"
                className="form-control"
                value={data.employeeCount || ""}
                onChange={(e) =>
                  update(
                    "employeeCount",
                    e.target.value
                  )
                }
              />
            </div>

          </div>

        </div>
      )}

      {/* SUBSIDY EXTRA */}

      {loanType === "Subsidy Linked Loan" && (
        <div className="special-loan-box">

          <div className="special-title">
            <i className="bi bi-stars"></i>

            Subsidy Assessment Information
          </div>

          <div className="row g-3">

            <div className="col-md-4">
              <label>
                New / Existing Unit
              </label>

              <select
                className="form-select"
                value={data.unitType || ""}
                onChange={(e) =>
                  update(
                    "unitType",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option>New Unit</option>
                <option>Existing Unit</option>
                <option>Expansion</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                Total Project Cost
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={data.projectCost || ""}
                  onChange={(e) =>
                    update(
                      "projectCost",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <label>
                Promoter Contribution
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={
                    data.promoterContribution || ""
                  }
                  onChange={(e) =>
                    update(
                      "promoterContribution",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          HOME
      ========================================== */}

      {isHome && (
        <div className="dynamic-loan-section">

          <div className="dynamic-header">
            <i className="bi bi-house-door"></i>

            <div>
              <small>HOME LOAN PROFILE</small>
              <h5>Property Requirement</h5>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-4">
              <label>
                Employment Type
              </label>

              <select
                className="form-select"
                value={data.employmentType || ""}
                onChange={(e) =>
                  update(
                    "employmentType",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Salaried</option>
                <option>Self Employed</option>
                <option>Business</option>
                <option>Professional</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                Monthly Income
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={data.monthlyIncome || ""}
                  onChange={(e) =>
                    update(
                      "monthlyIncome",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <label>
                Property Type
              </label>

              <select
                className="form-select"
                value={data.propertyType || ""}
                onChange={(e) =>
                  update(
                    "propertyType",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Flat</option>
                <option>Independent House</option>
                <option>Plot + Construction</option>
                <option>Construction</option>
                <option>Plot</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>
                Property Value
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={data.propertyValue || ""}
                  onChange={(e) =>
                    update(
                      "propertyValue",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <label>
                Required Loan
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  className="form-control"
                  value={data.requiredLoan || ""}
                  onChange={(e) =>
                    update(
                      "requiredLoan",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          MORTGAGE
      ========================================== */}

      {isMortgage && (
        <div className="dynamic-loan-section">

          <div className="dynamic-header">
            <i className="bi bi-building-lock"></i>

            <div>
              <small>MORTGAGE PROFILE</small>
              <h5>Property Offered as Security</h5>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-4">
              <label>
                Property Ownership
              </label>

              <select
                className="form-select"
                value={data.propertyOwnership || ""}
                onChange={(e) =>
                  update(
                    "propertyOwnership",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Self</option>
                <option>Spouse</option>
                <option>Parents</option>
                <option>Joint</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                Property Type
              </label>

              <select
                className="form-select"
                value={data.propertyType || ""}
                onChange={(e) =>
                  update(
                    "propertyType",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>
                Estimated Property Value
              </label>

              <input
                type="number"
                className="form-control"
                value={data.propertyValue || ""}
                onChange={(e) =>
                  update(
                    "propertyValue",
                    e.target.value
                  )
                }
              />
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          EDUCATION
      ========================================== */}

      {isEducation && (
        <div className="dynamic-loan-section">

          <div className="dynamic-header">
            <i className="bi bi-mortarboard"></i>

            <div>
              <small>
                EDUCATION LOAN PROFILE
              </small>

              <h5>
                Student & Course Details
              </h5>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-6">
              <label>Course Name</label>

              <input
                className="form-control"
                value={data.courseName || ""}
                onChange={(e) =>
                  update(
                    "courseName",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-6">
              <label>
                Institution / University
              </label>

              <input
                className="form-control"
                value={data.institution || ""}
                onChange={(e) =>
                  update(
                    "institution",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <label>Study Country</label>

              <select
                className="form-select"
                value={data.studyCountry || ""}
                onChange={(e) =>
                  update(
                    "studyCountry",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>India</option>
                <option>Abroad</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Total Course Cost</label>

              <input
                type="number"
                className="form-control"
                value={data.courseCost || ""}
                onChange={(e) =>
                  update(
                    "courseCost",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <label>
                Required Education Loan
              </label>

              <input
                type="number"
                className="form-control"
                value={data.requiredLoan || ""}
                onChange={(e) =>
                  update(
                    "requiredLoan",
                    e.target.value
                  )
                }
              />
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          VEHICLE
      ========================================== */}

      {isVehicle && (
        <div className="dynamic-loan-section">

          <div className="dynamic-header">
            <i className="bi bi-car-front"></i>

            <div>
              <small>VEHICLE FINANCE</small>
              <h5>Vehicle Details</h5>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-4">
              <label>Vehicle Type</label>

              <select
                className="form-select"
                value={data.vehicleType || ""}
                onChange={(e) =>
                  update(
                    "vehicleType",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Car</option>
                <option>Commercial Vehicle</option>
                <option>Electric Vehicle</option>
                <option>Two Wheeler</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Vehicle Cost</label>

              <input
                type="number"
                className="form-control"
                value={data.vehicleCost || ""}
                onChange={(e) =>
                  update(
                    "vehicleCost",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <label>Loan Required</label>

              <input
                type="number"
                className="form-control"
                value={data.requiredLoan || ""}
                onChange={(e) =>
                  update(
                    "requiredLoan",
                    e.target.value
                  )
                }
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
}