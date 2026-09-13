import React from "react";

export default function EmployeeCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Company Name */}

      <InputField
        label="Company Name"
        required
        icon="bi-buildings"
        placeholder="Enter Company Name"
        value={form.companyName}
        error={errors.companyName}
        onChange={(e) =>
          updateField("companyName", e.target.value)
        }
      />

      {/* Industry */}

      <SelectField
        label="Industry"
        required
        value={form.industry}
        error={errors.industry}
        onChange={(e) =>
          updateField("industry", e.target.value)
        }
        options={[
          "Manufacturing",
          "IT",
          "Construction",
          "Healthcare",
          "Retail",
          "Education",
          "Hospitality",
          "Transport",
          "Agriculture",
          "Other",
        ]}
      />

      {/* Number of Employees */}

      <InputField
        label="Number of Employees"
        required
        type="number"
        icon="bi-people"
        placeholder="Employees"
        value={form.employeeCount}
        error={errors.employeeCount}
        onChange={(e) =>
          updateField("employeeCount", e.target.value)
        }
      />

      {/* Cover Type */}

      <SelectField
        label="Insurance Type"
        required
        value={form.employeeCoverType}
        error={errors.employeeCoverType}
        onChange={(e) =>
          updateField(
            "employeeCoverType",
            e.target.value
          )
        }
        options={[
          "Group Health Insurance",
          "Group Term Life",
          "Group Personal Accident",
          "Workmen Compensation",
          "Employee Benefit Package",
        ]}
      />

      {/* Sum Insured */}

      <SelectField
        label="Sum Insured Per Employee"
        required
        value={form.employeeSumInsured}
        error={errors.employeeSumInsured}
        onChange={(e) =>
          updateField(
            "employeeSumInsured",
            e.target.value
          )
        }
        options={[
          "₹1 Lakh",
          "₹2 Lakhs",
          "₹3 Lakhs",
          "₹5 Lakhs",
          "₹10 Lakhs",
          "₹15 Lakhs",
          "₹20 Lakhs",
        ]}
      />

      {/* Payroll */}

      <InputField
        label="Annual Payroll (₹)"
        type="number"
        icon="bi-cash-stack"
        placeholder="Annual Payroll"
        value={form.annualPayroll}
        onChange={(e) =>
          updateField(
            "annualPayroll",
            e.target.value
          )
        }
      />

      {/* HR Contact */}

      <InputField
        label="HR / Contact Person"
        icon="bi-person-badge"
        placeholder="Contact Person"
        value={form.hrContact}
        onChange={(e) =>
          updateField(
            "hrContact",
            e.target.value
          )
        }
      />

      {/* Contact Number */}

      <InputField
        label="Contact Number"
        icon="bi-phone"
        placeholder="Contact Number"
        value={form.hrMobile}
        maxLength={10}
        onChange={(e) =>
          updateField(
            "hrMobile",
            e.target.value.replace(/\D/g, "")
          )
        }
      />

      {/* Email */}

      <InputField
        label="Official Email"
        icon="bi-envelope"
        type="email"
        placeholder="company@example.com"
        value={form.hrEmail}
        onChange={(e) =>
          updateField(
            "hrEmail",
            e.target.value
          )
        }
      />

      {/* Address */}

      <InputField
        col="col-12"
        label="Company Address"
        icon="bi-geo-alt"
        placeholder="Complete Address"
        value={form.companyAddress}
        onChange={(e) =>
          updateField(
            "companyAddress",
            e.target.value
          )
        }
      />

      {/* Notes */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Requirements
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Mention any specific employee insurance requirements..."
          value={form.employeeNotes || ""}
          onChange={(e) =>
            updateField(
              "employeeNotes",
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
  col = "col-md-6",
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

/* ======================================================
   SELECT FIELD
====================================================== */

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