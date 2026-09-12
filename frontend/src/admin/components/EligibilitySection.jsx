import React from "react";

const DEFAULTS = {
  minAge: "",
  maxAge: "",
  gender: "",
  minIncome: "",
  maxIncome: "",
  occupation: "",
  category: "",
  residence: "",
  otherCriteria: "",
};

export default function EligibilitySection({
  eligibility = {},
  onChange,
}) {
  const data = { ...DEFAULTS, ...(eligibility || {}) };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (typeof onChange === "function") {
      onChange({ ...data, [name]: value });
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white border-0 pt-4 px-4">
        <h5 className="fw-bold mb-1">Eligibility Criteria</h5>
        <p className="text-muted small mb-0">
          Enter only verified eligibility conditions. Leave a field blank
          when it does not apply.
        </p>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">
          <Field label="Minimum Age" name="minAge" value={data.minAge} onChange={handleChange} placeholder="Example: 18" />
          <Field label="Maximum Age" name="maxAge" value={data.maxAge} onChange={handleChange} placeholder="Example: 60" />
          <Field label="Gender" name="gender" value={data.gender} onChange={handleChange} placeholder="Example: All / Women / Men" />
          <Field label="Minimum Income" name="minIncome" value={data.minIncome} onChange={handleChange} placeholder="Example: ₹1,00,000" />
          <Field label="Maximum Income" name="maxIncome" value={data.maxIncome} onChange={handleChange} placeholder="Example: ₹5,00,000" />
          <Field label="Occupation" name="occupation" value={data.occupation} onChange={handleChange} placeholder="Example: Farmer / Entrepreneur / Student" />
          <Field label="Category" name="category" value={data.category} onChange={handleChange} placeholder="Example: General / SC / ST / OBC" />
          <Field label="Residence / State" name="residence" value={data.residence} onChange={handleChange} placeholder="Example: Telangana" />

          <div className="col-12">
            <label className="form-label fw-semibold">Other Eligibility Criteria</label>
            <textarea
              className="form-control"
              name="otherCriteria"
              rows="5"
              value={data.otherCriteria}
              onChange={handleChange}
              placeholder="Enter verified eligibility conditions, enterprise requirements, exclusions, ownership conditions, project requirements, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div className="col-md-6">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type="text"
        className="form-control"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
