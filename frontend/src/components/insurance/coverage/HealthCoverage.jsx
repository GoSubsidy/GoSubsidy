import React from "react";

export default function HealthCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Insurance For */}

      <SelectField
        label="Insurance For"
        required
        value={form.healthFor}
        error={errors.healthFor}
        onChange={(e) =>
          updateField("healthFor", e.target.value)
        }
        options={[
          "Self",
          "Self + Spouse",
          "Family",
          "Parents",
          "Senior Citizen",
        ]}
      />

      {/* Age */}

      <InputField
        label="Age"
        required
        type="number"
        icon="bi-person"
        placeholder="Enter age"
        value={form.age}
        error={errors.age}
        onChange={(e) =>
          updateField("age", e.target.value)
        }
      />

      {/* Family Members */}

      <InputField
        label="Family Members"
        type="number"
        icon="bi-people"
        placeholder="No. of members"
        value={form.familyMembers}
        error={errors.familyMembers}
        onChange={(e) =>
          updateField(
            "familyMembers",
            e.target.value
          )
        }
      />

      {/* Sum Insured */}

      <SelectField
        label="Sum Insured"
        required
        value={form.healthCover}
        error={errors.healthCover}
        onChange={(e) =>
          updateField(
            "healthCover",
            e.target.value
          )
        }
        options={[
          "₹3 Lakhs",
          "₹5 Lakhs",
          "₹10 Lakhs",
          "₹15 Lakhs",
          "₹20 Lakhs",
          "₹25 Lakhs",
          "₹50 Lakhs",
          "₹1 Crore",
        ]}
      />

      {/* Existing Policy */}

      <SelectField
        label="Existing Health Policy"
        value={form.existingHealthPolicy}
        onChange={(e) =>
          updateField(
            "existingHealthPolicy",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* Existing Disease */}

      <SelectField
        label="Existing Disease"
        value={form.preExistingDisease}
        onChange={(e) =>
          updateField(
            "preExistingDisease",
            e.target.value
          )
        }
        options={[
          "No",
          "Diabetes",
          "BP",
          "Heart Disease",
          "Asthma",
          "Other",
        ]}
      />

      {/* City */}

      <InputField
        label="City"
        icon="bi-geo-alt"
        placeholder="City"
        value={form.city}
        onChange={(e) =>
          updateField("city", e.target.value)
        }
      />

      {/* Pincode */}

      <InputField
        label="Pincode"
        icon="bi-pin-map"
        placeholder="Pincode"
        value={form.pincode}
        maxLength={6}
        onChange={(e) =>
          updateField(
            "pincode",
            e.target.value.replace(/\D/g, "")
          )
        }
      />

    </div>
  );
}

/* =====================================================
   INPUT
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
  maxLength,
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
          className={`form-control ${
            error ? "is-invalid" : ""
          }`}
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={onChange}
          maxLength={maxLength}
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
   SELECT
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

        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
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