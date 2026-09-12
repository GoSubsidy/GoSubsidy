import React from "react";

export default function CustomerStep({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="gsi-customer-step">

      <div className="gsi-section-header">
        <span>STEP 2 OF 4</span>

        <h2>Customer Details</h2>

        <p>
          Please provide your contact information.
          This helps GoSubsidy connect you with
          suitable insurance providers.
        </p>
      </div>

      <div className="row g-4">

        {/* Name */}

        <InputField
          col="col-md-6"
          label="Full Name"
          required
          icon="bi-person"
          placeholder="Enter your full name"
          value={form.name}
          error={errors.name}
          onChange={(e)=>
            updateField("name",e.target.value)
          }
        />

        {/* Mobile */}

        <InputField
          col="col-md-6"
          label="Mobile Number"
          required
          type="tel"
          icon="bi-phone"
          placeholder="10 digit mobile number"
          value={form.mobile}
          error={errors.mobile}
          maxLength={10}
          onChange={(e)=>
            updateField(
              "mobile",
              e.target.value.replace(/\D/g,"")
            )
          }
        />

        {/* Email */}

        <InputField
          col="col-md-6"
          label="Email Address"
          icon="bi-envelope"
          type="email"
          placeholder="name@example.com"
          value={form.email}
          error={errors.email}
          onChange={(e)=>
            updateField("email",e.target.value)
          }
        />

        {/* City */}

        <InputField
          col="col-md-6"
          label="City"
          required
          icon="bi-geo-alt"
          placeholder="Enter City"
          value={form.city}
          error={errors.city}
          onChange={(e)=>
            updateField("city",e.target.value)
          }
        />

        {/* State */}

        <InputField
          col="col-md-6"
          label="State"
          icon="bi-map"
          placeholder="Enter State"
          value={form.state}
          error={errors.state}
          onChange={(e)=>
            updateField("state",e.target.value)
          }
        />

      </div>

      <div className="alert alert-primary mt-4 mb-0">

        <div className="d-flex">

          <i className="bi bi-shield-lock-fill fs-4 me-3"></i>

          <div>

            <strong>
              Your information is secure
            </strong>

            <div className="small mt-1">

              GoSubsidy shares your information
              only with selected insurance
              partners for quotation purposes.

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  col="col-12",
  label,
  required,
  icon,
  type="text",
  placeholder,
  value,
  onChange,
  error,
  maxLength
}){

  return(

    <div className={col}>

      <label className="form-label fw-semibold">

        {label}

        {required && (
          <span className="text-danger ms-1">*</span>
        )}

      </label>

      <div className={`input-group ${error?"is-invalid":""}`}>

        <span className="input-group-text">

          <i className={`bi ${icon}`}></i>

        </span>

        <input
          className={`form-control ${
            error?"is-invalid":""
          }`}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
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