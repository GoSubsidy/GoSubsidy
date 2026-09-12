import React from "react";

import HealthCoverage from "./coverage/HealthCoverage";
import MotorCoverage from "./coverage/MotorCoverage";
import LifeCoverage from "./coverage/LifeCoverage";
import BusinessCoverage from "./coverage/BusinessCoverage";
import PropertyCoverage from "./coverage/PropertyCoverage";
import IndustrialCoverage from "./coverage/IndustrialCoverage";
import PoultryCoverage from "./coverage/PoultryCoverage";
import LivestockCoverage from "./coverage/LivestockCoverage";
import AgricultureCoverage from "./coverage/AgricultureCoverage";
import MarineCoverage from "./coverage/MarineCoverage";
import TravelCoverage from "./coverage/TravelCoverage";
import EmployeeCoverage from "./coverage/EmployeeCoverage";

export default function CoverageStep({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div>

      {/* Heading */}

      <div className="mb-4">

        <span
          className="text-primary fw-bold"
          style={{
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          STEP 3 OF 4
        </span>

        <h2 className="fw-bold mt-2">
          Insurance Details
        </h2>

        <p className="text-muted mb-0">
          Please provide the insurance-specific
          information required for quotation.
        </p>

      </div>

      {/* Dynamic Form */}

      {renderCoverage(
        form,
        errors,
        updateField
      )}

    </div>
  );
}

/* =====================================================
   RENDER COVERAGE
===================================================== */

function renderCoverage(
  form,
  errors,
  updateField
) {
  switch (form.insuranceType) {

    case "health":
      return (
        <HealthCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "motor":
      return (
        <MotorCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "life":
      return (
        <LifeCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "business":
      return (
        <BusinessCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "property":
      return (
        <PropertyCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "industrial":
      return (
        <IndustrialCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "poultry":
      return (
        <PoultryCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "livestock":
      return (
        <LivestockCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "agriculture":
      return (
        <AgricultureCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "marine":
      return (
        <MarineCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "travel":
      return (
        <TravelCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    case "employee":
      return (
        <EmployeeCoverage
          form={form}
          errors={errors}
          updateField={updateField}
        />
      );

    default:
      return (

        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <i
              className="bi bi-shield-exclamation text-primary"
              style={{
                fontSize: "70px",
              }}
            ></i>

            <h4 className="mt-4">

              Select an Insurance Type

            </h4>

            <p className="text-muted mb-0">

              Please go back to Step 1 and
              choose an insurance category.

            </p>

          </div>

        </div>

      );
  }
}