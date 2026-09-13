import React from "react";

export default function LifeCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Life Insurance Type */}

      <SelectField
        label="Life Insurance Type"
        required
        value={form.lifeInsuranceType}
        error={errors.lifeInsuranceType}
        onChange={(e) =>
          updateField(
            "lifeInsuranceType",
            e.target.value
          )
        }
        options={[
          "Term Life Insurance",
          "Whole Life Insurance",
          "Endowment Plan",
          "Money Back Plan",
          "ULIP",
          "Child Plan",
          "Retirement Plan",
        ]}
      />

      {/* Age */}

      <InputField
        label="Age"
        required
        type="number"
        icon="bi-person"
        placeholder="Enter Age"
        value={form.lifeAge}
        error={errors.lifeAge}
        onChange={(e) =>
          updateField("lifeAge", e.target.value)
        }
      />

      {/* Gender */}

      <SelectField
        label="Gender"
        required
        value={form.gender}
        error={errors.gender}
        onChange={(e) =>
          updateField("gender", e.target.value)
        }
        options={[
          "Male",
          "Female",
          "Other",
        ]}
      />

      {/* Occupation */}

      <InputField
        label="Occupation"
        required
        icon="bi-briefcase"
        placeholder="Occupation"
        value={form.occupation}
        error={errors.occupation}
        onChange={(e) =>
          updateField(
            "occupation",
            e.target.value
          )
        }
      />

      {/* Annual Income */}

      <InputField
        label="Annual Income (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Annual Income"
        value={form.annualIncome}
        error={errors.annualIncome}
        onChange={(e) =>
          updateField(
            "annualIncome",
            e.target.value
          )
        }
      />

      {/* Sum Assured */}

      <SelectField
        label="Required Life Cover"
        required
        value={form.sumAssured}
        error={errors.sumAssured}
        onChange={(e) =>
          updateField(
            "sumAssured",
            e.target.value
          )
        }
        options={[
          "₹10 Lakhs",
          "₹25 Lakhs",
          "₹50 Lakhs",
          "₹75 Lakhs",
          "₹1 Crore",
          "₹2 Crores",
          "₹5 Crores",
        ]}
      />

      {/* Policy Term */}

      <SelectField
        label="Policy Term"
        value={form.policyTerm}
        onChange={(e) =>
          updateField(
            "policyTerm",
            e.target.value
          )
        }
        options={[
          "10 Years",
          "15 Years",
          "20 Years",
          "25 Years",
          "30 Years",
          "35 Years",
          "40 Years",
        ]}
      />

      {/* Smoking */}

      <SelectField
        label="Do You Smoke?"
        value={form.smoker}
        onChange={(e) =>
          updateField(
            "smoker",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* Existing Diseases */}

      <SelectField
        label="Existing Medical Condition"
        value={form.medicalHistory}
        onChange={(e) =>
          updateField(
            "medicalHistory",
            e.target.value
          )
        }
        options={[
          "No",
          "Diabetes",
          "Hypertension",
          "Heart Disease",
          "Asthma",
          "Cancer",
          "Other",
        ]}
      />

      {/* Nominee */}

      <InputField
        label="Nominee Name"
        icon="bi-person-heart"
        placeholder="Nominee Name"
        value={form.nomineeName}
        onChange={(e) =>
          updateField(
            "nomineeName",
            e.target.value
          )
        }
      />

      {/* Relationship */}

      <SelectField
        label="Relationship"
        value={form.nomineeRelation}
        onChange={(e) =>
          updateField(
            "nomineeRelation",
            e.target.value
          )
        }
        options={[
          "Spouse",
          "Father",
          "Mother",
          "Son",
          "Daughter",
          "Brother",
          "Sister",
          "Other",
        ]}
      />

      {/* Additional Notes */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Information
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Mention any additional details..."
          value={form.lifeNotes || ""}
          onChange={(e)=>
            updateField(
              "lifeNotes",
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

/* ===========================================================
   INPUT FIELD
=========================================================== */

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
            error ? "is-invalid":""
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

/* ===========================================================
   SELECT FIELD
=========================================================== */

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
          error ? "is-invalid":""
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