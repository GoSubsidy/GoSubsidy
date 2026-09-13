import React from "react";

export default function BusinessCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Business Name */}

      <InputField
        label="Business Name"
        required
        icon="bi-buildings"
        placeholder="Enter Business Name"
        value={form.businessName}
        error={errors.businessName}
        onChange={(e) =>
          updateField(
            "businessName",
            e.target.value
          )
        }
      />

      {/* Business Type */}

      <SelectField
        label="Business Type"
        required
        value={form.businessType}
        error={errors.businessType}
        onChange={(e) =>
          updateField(
            "businessType",
            e.target.value
          )
        }
        options={[
          "Manufacturing",
          "Trading",
          "Retail",
          "Wholesale",
          "Restaurant",
          "Hotel",
          "Hospital",
          "IT Company",
          "Construction",
          "Transport",
          "Warehouse",
          "Cold Storage",
          "Poultry Farm",
          "Dairy Farm",
          "Agriculture",
          "Other",
        ]}
      />

      {/* Business Vintage */}

      <InputField
        label="Years in Business"
        type="number"
        icon="bi-calendar"
        placeholder="Years"
        value={form.businessYears}
        error={errors.businessYears}
        onChange={(e) =>
          updateField(
            "businessYears",
            e.target.value
          )
        }
      />

      {/* Annual Turnover */}

      <InputField
        label="Annual Turnover (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Annual Turnover"
        value={form.annualTurnover}
        error={errors.annualTurnover}
        onChange={(e) =>
          updateField(
            "annualTurnover",
            e.target.value
          )
        }
      />

      {/* Employees */}

      <InputField
        label="Number of Employees"
        type="number"
        icon="bi-people"
        placeholder="Employees"
        value={form.employees}
        error={errors.employees}
        onChange={(e) =>
          updateField(
            "employees",
            e.target.value
          )
        }
      />

      {/* Required Cover */}

      <SelectField
        label="Required Insurance"
        required
        value={form.businessCover}
        error={errors.businessCover}
        onChange={(e) =>
          updateField(
            "businessCover",
            e.target.value
          )
        }
        options={[
          "Fire Insurance",
          "Property Insurance",
          "Burglary Insurance",
          "Stock Insurance",
          "Machinery Breakdown",
          "Money Insurance",
          "Public Liability",
          "Product Liability",
          "Marine Insurance",
          "Employee Insurance",
          "Cyber Insurance",
          "Comprehensive Business Package",
        ]}
      />

      {/* Building Value */}

      <InputField
        label="Building Value (₹)"
        type="number"
        icon="bi-building"
        placeholder="Building Value"
        value={form.buildingValue}
        onChange={(e) =>
          updateField(
            "buildingValue",
            e.target.value
          )
        }
      />

      {/* Machinery Value */}

      <InputField
        label="Machinery Value (₹)"
        type="number"
        icon="bi-gear"
        placeholder="Machinery Value"
        value={form.machineryValue}
        onChange={(e) =>
          updateField(
            "machineryValue",
            e.target.value
          )
        }
      />

      {/* Stock Value */}

      <InputField
        label="Stock Value (₹)"
        type="number"
        icon="bi-box-seam"
        placeholder="Stock Value"
        value={form.stockValue}
        onChange={(e) =>
          updateField(
            "stockValue",
            e.target.value
          )
        }
      />

      {/* Business Address */}

      <InputField
        col="col-12"
        label="Business Address"
        icon="bi-geo-alt"
        placeholder="Complete Business Address"
        value={form.businessAddress}
        onChange={(e) =>
          updateField(
            "businessAddress",
            e.target.value
          )
        }
      />

      {/* Additional Requirements */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Requirements
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Describe any specific insurance requirements..."
          value={form.businessNotes || ""}
          onChange={(e)=>
            updateField(
              "businessNotes",
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

/* ======================================================
   INPUT FIELD
====================================================== */

function InputField({
  col="col-md-6",
  label,
  icon,
  type="text",
  placeholder,
  value,
  onChange,
  required,
  error,
}){

  return(

    <div className={col}>

      <label className="form-label fw-semibold">

        {label}

        {required && (
          <span className="text-danger ms-1">*</span>
        )}

      </label>

      <div className="input-group">

        <span className="input-group-text">

          <i className={`bi ${icon}`}></i>

        </span>

        <input
          type={type}
          className={`form-control ${
            error ? "is-invalid" : ""
          }`}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
        />

      </div>

      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}

    </div>

  );

}

/* ======================================================
   SELECT FIELD
====================================================== */

function SelectField({
  label,
  value,
  onChange,
  options=[],
  required,
  error,
}){

  return(

    <div className="col-md-6">

      <label className="form-label fw-semibold">

        {label}

        {required && (
          <span className="text-danger ms-1">*</span>
        )}

      </label>

      <select
        className={`form-select ${
          error ? "is-invalid" : ""
        }`}
        value={value || ""}
        onChange={onChange}
      >

        <option value="">
          Select
        </option>

        {options.map((option)=>(
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}

    </div>

  );

}