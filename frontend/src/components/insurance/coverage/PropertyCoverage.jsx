import React from "react";

export default function PropertyCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Property Type */}

      <SelectField
        label="Property Type"
        required
        value={form.propertyType}
        error={errors.propertyType}
        onChange={(e) =>
          updateField("propertyType", e.target.value)
        }
        options={[
          "Residential House",
          "Apartment",
          "Commercial Building",
          "Office",
          "Warehouse",
          "Factory",
          "Shop",
          "Godown",
          "Cold Storage",
          "Hotel",
          "Hospital",
        ]}
      />

      {/* Ownership */}

      <SelectField
        label="Ownership"
        required
        value={form.ownership}
        error={errors.ownership}
        onChange={(e) =>
          updateField("ownership", e.target.value)
        }
        options={[
          "Owned",
          "Rented",
          "Leased",
        ]}
      />

      {/* Building Value */}

      <InputField
        label="Building Value (₹)"
        required
        type="number"
        icon="bi-building"
        placeholder="Building Value"
        value={form.buildingValue}
        error={errors.buildingValue}
        onChange={(e) =>
          updateField("buildingValue", e.target.value)
        }
      />

      {/* Contents Value */}

      <InputField
        label="Contents Value (₹)"
        type="number"
        icon="bi-box-seam"
        placeholder="Furniture / Equipment Value"
        value={form.contentsValue}
        error={errors.contentsValue}
        onChange={(e) =>
          updateField("contentsValue", e.target.value)
        }
      />

      {/* Stock Value */}

      <InputField
        label="Stock Value (₹)"
        type="number"
        icon="bi-boxes"
        placeholder="Stock Value"
        value={form.stockValue}
        error={errors.stockValue}
        onChange={(e) =>
          updateField("stockValue", e.target.value)
        }
      />

      {/* Construction Type */}

      <SelectField
        label="Construction Type"
        value={form.constructionType}
        onChange={(e) =>
          updateField(
            "constructionType",
            e.target.value
          )
        }
        options={[
          "RCC",
          "Brick",
          "Steel Structure",
          "Pre Engineered Building",
          "Wooden",
          "Mixed",
        ]}
      />

      {/* Building Age */}

      <InputField
        label="Building Age (Years)"
        type="number"
        icon="bi-calendar"
        placeholder="Age"
        value={form.buildingAge}
        onChange={(e) =>
          updateField("buildingAge", e.target.value)
        }
      />

      {/* Cover Required */}

      <SelectField
        label="Cover Required"
        required
        value={form.propertyCover}
        error={errors.propertyCover}
        onChange={(e) =>
          updateField(
            "propertyCover",
            e.target.value
          )
        }
        options={[
          "Fire Insurance",
          "Fire & Allied Perils",
          "Burglary",
          "Natural Calamities",
          "Comprehensive Property",
        ]}
      />

      {/* Existing Insurance */}

      <SelectField
        label="Existing Insurance"
        value={form.existingPropertyPolicy}
        onChange={(e) =>
          updateField(
            "existingPropertyPolicy",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* Property Address */}

      <InputField
        col="col-12"
        label="Property Address"
        icon="bi-geo-alt"
        placeholder="Complete Property Address"
        value={form.propertyAddress}
        onChange={(e) =>
          updateField(
            "propertyAddress",
            e.target.value
          )
        }
      />

      {/* Notes */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Information
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Mention any special property details..."
          value={form.propertyNotes || ""}
          onChange={(e) =>
            updateField(
              "propertyNotes",
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

/* ===================================================== */

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

/* ===================================================== */

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