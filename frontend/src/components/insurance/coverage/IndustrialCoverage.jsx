import React from "react";

export default function IndustrialCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Industry Name */}

      <InputField
        label="Industry / Factory Name"
        required
        icon="bi-buildings"
        placeholder="Enter Industry Name"
        value={form.industryName}
        error={errors.industryName}
        onChange={(e) =>
          updateField(
            "industryName",
            e.target.value
          )
        }
      />

      {/* Industry Type */}

      <SelectField
        label="Industry Type"
        required
        value={form.industryType}
        error={errors.industryType}
        onChange={(e) =>
          updateField(
            "industryType",
            e.target.value
          )
        }
        options={[
          "Manufacturing",
          "Food Processing",
          "Cold Storage",
          "Textile",
          "Steel",
          "Chemical",
          "Engineering",
          "Automobile",
          "Pharmaceutical",
          "Packaging",
          "Plastic",
          "Paper",
          "Printing",
          "Electronics",
          "Other",
        ]}
      />

      {/* Factory Area */}

      <InputField
        label="Factory Area (Sq.ft)"
        type="number"
        icon="bi-rulers"
        placeholder="Factory Area"
        value={form.factoryArea}
        error={errors.factoryArea}
        onChange={(e) =>
          updateField(
            "factoryArea",
            e.target.value
          )
        }
      />

      {/* Annual Turnover */}

      <InputField
        label="Annual Turnover (₹)"
        type="number"
        required
        icon="bi-currency-rupee"
        placeholder="Annual Turnover"
        value={form.industrialTurnover}
        error={errors.industrialTurnover}
        onChange={(e) =>
          updateField(
            "industrialTurnover",
            e.target.value
          )
        }
      />

      {/* Employees */}

      <InputField
        label="Employees"
        type="number"
        icon="bi-people"
        placeholder="Number of Employees"
        value={form.industrialEmployees}
        onChange={(e) =>
          updateField(
            "industrialEmployees",
            e.target.value
          )
        }
      />

      {/* Building Value */}

      <InputField
        label="Building Value (₹)"
        type="number"
        icon="bi-building"
        placeholder="Building Value"
        value={form.industrialBuildingValue}
        onChange={(e) =>
          updateField(
            "industrialBuildingValue",
            e.target.value
          )
        }
      />

      {/* Machinery Value */}

      <InputField
        label="Plant & Machinery Value (₹)"
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
        value={form.industrialStockValue}
        onChange={(e) =>
          updateField(
            "industrialStockValue",
            e.target.value
          )
        }
      />

      {/* Required Cover */}

      <SelectField
        label="Insurance Required"
        required
        value={form.industrialCover}
        error={errors.industrialCover}
        onChange={(e) =>
          updateField(
            "industrialCover",
            e.target.value
          )
        }
        options={[
          "Fire Insurance",
          "Industrial All Risk",
          "Machinery Breakdown",
          "Boiler Insurance",
          "Electronic Equipment",
          "Business Interruption",
          "Marine Transit",
          "Burglary",
          "Liability",
          "Comprehensive Industrial Package",
        ]}
      />

      {/* Factory Address */}

      <InputField
        col="col-12"
        label="Factory Address"
        icon="bi-geo-alt"
        placeholder="Complete Factory Address"
        value={form.factoryAddress}
        onChange={(e) =>
          updateField(
            "factoryAddress",
            e.target.value
          )
        }
      />

      {/* Additional Information */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Information
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Any special industrial insurance requirements..."
          value={form.industrialNotes || ""}
          onChange={(e) =>
            updateField(
              "industrialNotes",
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

/* ========================================= */

function InputField({
  col = "col-md-6",
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
}) {
  return (
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

/* ========================================= */

function SelectField({
  label,
  value,
  onChange,
  options = [],
  required,
  error,
}) {
  return (
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

        {options.map((option) => (
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