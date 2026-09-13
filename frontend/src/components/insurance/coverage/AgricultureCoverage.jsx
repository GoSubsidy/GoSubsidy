import React from "react";

export default function AgricultureCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Agriculture Type */}

      <SelectField
        label="Agriculture Type"
        required
        value={form.agricultureType}
        error={errors.agricultureType}
        onChange={(e) =>
          updateField(
            "agricultureType",
            e.target.value
          )
        }
        options={[
          "Crop Farming",
          "Horticulture",
          "Plantation",
          "Vegetable Farming",
          "Fruit Farming",
          "Mixed Farming",
          "Organic Farming",
        ]}
      />

      {/* Land Area */}

      <InputField
        label="Land Area (Acres)"
        required
        type="number"
        icon="bi-map"
        placeholder="Enter land area"
        value={form.landArea}
        error={errors.landArea}
        onChange={(e) =>
          updateField(
            "landArea",
            e.target.value
          )
        }
      />

      {/* Crop Type */}

      <InputField
        label="Crop Type"
        icon="bi-flower1"
        placeholder="Rice, Cotton, Maize..."
        value={form.cropType}
        error={errors.cropType}
        onChange={(e) =>
          updateField(
            "cropType",
            e.target.value
          )
        }
      />

      {/* Crop Value */}

      <InputField
        label="Estimated Crop Value (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Estimated value"
        value={form.agricultureValue}
        error={errors.agricultureValue}
        onChange={(e) =>
          updateField(
            "agricultureValue",
            e.target.value
          )
        }
      />

      {/* Irrigation */}

      <SelectField
        label="Irrigation Facility"
        value={form.irrigation}
        onChange={(e) =>
          updateField(
            "irrigation",
            e.target.value
          )
        }
        options={[
          "Rain Fed",
          "Borewell",
          "Canal",
          "Drip Irrigation",
          "Sprinkler",
          "Other",
        ]}
      />

      {/* Season */}

      <SelectField
        label="Crop Season"
        value={form.cropSeason}
        onChange={(e) =>
          updateField(
            "cropSeason",
            e.target.value
          )
        }
        options={[
          "Kharif",
          "Rabi",
          "Zaid",
          "Annual",
        ]}
      />

      {/* Existing Insurance */}

      <SelectField
        label="Existing Crop Insurance"
        value={form.existingCropInsurance}
        onChange={(e) =>
          updateField(
            "existingCropInsurance",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* Village */}

      <InputField
        label="Village"
        icon="bi-geo"
        placeholder="Village Name"
        value={form.village}
        onChange={(e) =>
          updateField(
            "village",
            e.target.value
          )
        }
      />

      {/* Mandal */}

      <InputField
        label="Mandal / Taluka"
        icon="bi-building"
        placeholder="Enter Mandal"
        value={form.mandal}
        onChange={(e) =>
          updateField(
            "mandal",
            e.target.value
          )
        }
      />

      {/* District */}

      <InputField
        label="District"
        icon="bi-pin-map"
        placeholder="District"
        value={form.district}
        onChange={(e) =>
          updateField(
            "district",
            e.target.value
          )
        }
      />

    </div>
  );
}

/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
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
    <div className="col-md-6">

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

/* =====================================================
   SELECT FIELD
===================================================== */

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