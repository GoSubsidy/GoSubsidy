import React from "react";

export default function LivestockCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Livestock Type */}

      <SelectField
        label="Livestock Type"
        required
        value={form.livestockType}
        error={errors.livestockType}
        onChange={(e) =>
          updateField("livestockType", e.target.value)
        }
        options={[
          "Cow",
          "Buffalo",
          "Goat",
          "Sheep",
          "Pig",
          "Horse",
          "Camel",
          "Mixed Livestock",
        ]}
      />

      {/* Number of Animals */}

      <InputField
        label="Number of Animals"
        required
        type="number"
        icon="bi-123"
        placeholder="Enter Number"
        value={form.animalCount}
        error={errors.animalCount}
        onChange={(e) =>
          updateField("animalCount", e.target.value)
        }
      />

      {/* Breed */}

      <InputField
        label="Breed"
        icon="bi-tag"
        placeholder="Breed Name"
        value={form.breed}
        error={errors.breed}
        onChange={(e) =>
          updateField("breed", e.target.value)
        }
      />

      {/* Average Age */}

      <InputField
        label="Average Age (Years)"
        type="number"
        icon="bi-calendar"
        placeholder="Average Age"
        value={form.averageAge}
        error={errors.averageAge}
        onChange={(e) =>
          updateField("averageAge", e.target.value)
        }
      />

      {/* Total Value */}

      <InputField
        label="Total Livestock Value (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Estimated Value"
        value={form.livestockValue}
        error={errors.livestockValue}
        onChange={(e) =>
          updateField("livestockValue", e.target.value)
        }
      />

      {/* Purpose */}

      <SelectField
        label="Purpose"
        value={form.livestockPurpose}
        onChange={(e) =>
          updateField("livestockPurpose", e.target.value)
        }
        options={[
          "Milk Production",
          "Meat Production",
          "Breeding",
          "Agriculture",
          "Commercial",
          "Mixed",
        ]}
      />

      {/* Housing */}

      <SelectField
        label="Housing Type"
        value={form.housingType}
        onChange={(e) =>
          updateField("housingType", e.target.value)
        }
        options={[
          "Open Shed",
          "Closed Shed",
          "Semi Closed",
          "Modern Farm",
        ]}
      />

      {/* Vaccination */}

      <SelectField
        label="Vaccination Status"
        value={form.vaccinationStatus}
        onChange={(e) =>
          updateField("vaccinationStatus", e.target.value)
        }
        options={[
          "Fully Vaccinated",
          "Partially Vaccinated",
          "Not Vaccinated",
        ]}
      />

      {/* Existing Insurance */}

      <SelectField
        label="Existing Insurance"
        value={form.existingLivestockInsurance}
        onChange={(e) =>
          updateField(
            "existingLivestockInsurance",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* Farm Address */}

      <InputField
        col="col-12"
        label="Farm Address"
        icon="bi-geo-alt"
        placeholder="Farm Address"
        value={form.farmAddress}
        onChange={(e) =>
          updateField("farmAddress", e.target.value)
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
          placeholder="Mention any additional livestock details..."
          value={form.livestockNotes || ""}
          onChange={(e) =>
            updateField(
              "livestockNotes",
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

/* =======================================================
   INPUT FIELD
======================================================= */

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

/* =======================================================
   SELECT FIELD
======================================================= */

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