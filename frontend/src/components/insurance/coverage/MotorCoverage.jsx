import React from "react";

export default function MotorCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Vehicle Type */}

      <SelectField
        label="Vehicle Type"
        required
        value={form.vehicleType}
        error={errors.vehicleType}
        onChange={(e)=>
          updateField(
            "vehicleType",
            e.target.value
          )
        }
        options={[
          "Two Wheeler",
          "Private Car",
          "Commercial Vehicle",
          "Taxi",
          "Bus",
          "Truck",
          "Tractor",
          "EV Car",
          "EV Bike",
        ]}
      />

      {/* Manufacturer */}

      <InputField
        label="Manufacturer"
        required
        icon="bi-building"
        placeholder="Maruti, Tata, Hyundai..."
        value={form.vehicleMake}
        error={errors.vehicleMake}
        onChange={(e)=>
          updateField(
            "vehicleMake",
            e.target.value
          )
        }
      />

      {/* Model */}

      <InputField
        label="Vehicle Model"
        required
        icon="bi-car-front"
        placeholder="Model Name"
        value={form.vehicleModel}
        error={errors.vehicleModel}
        onChange={(e)=>
          updateField(
            "vehicleModel",
            e.target.value
          )
        }
      />

      {/* Registration Number */}

      <InputField
        label="Registration Number"
        icon="bi-upc-scan"
        placeholder="TS09AB1234"
        value={form.registrationNumber}
        error={errors.registrationNumber}
        onChange={(e)=>
          updateField(
            "registrationNumber",
            e.target.value.toUpperCase()
          )
        }
      />

      {/* Manufacturing Year */}

      <InputField
        label="Manufacturing Year"
        type="number"
        icon="bi-calendar"
        placeholder="2023"
        value={form.manufacturingYear}
        error={errors.manufacturingYear}
        onChange={(e)=>
          updateField(
            "manufacturingYear",
            e.target.value
          )
        }
      />

      {/* Fuel Type */}

      <SelectField
        label="Fuel Type"
        value={form.fuelType}
        onChange={(e)=>
          updateField(
            "fuelType",
            e.target.value
          )
        }
        options={[
          "Petrol",
          "Diesel",
          "CNG",
          "Electric",
          "Hybrid",
        ]}
      />

      {/* IDV */}

      <InputField
        label="Vehicle Value / IDV (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Vehicle Value"
        value={form.idv}
        error={errors.idv}
        onChange={(e)=>
          updateField(
            "idv",
            e.target.value
          )
        }
      />

      {/* Policy Type */}

      <SelectField
        label="Policy Type"
        required
        value={form.policyType}
        error={errors.policyType}
        onChange={(e)=>
          updateField(
            "policyType",
            e.target.value
          )
        }
        options={[
          "Comprehensive",
          "Third Party",
          "Own Damage",
        ]}
      />

      {/* Existing Policy */}

      <SelectField
        label="Existing Policy"
        value={form.existingMotorPolicy}
        onChange={(e)=>
          updateField(
            "existingMotorPolicy",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* NCB */}

      <SelectField
        label="No Claim Bonus"
        value={form.ncb}
        onChange={(e)=>
          updateField(
            "ncb",
            e.target.value
          )
        }
        options={[
          "0%",
          "20%",
          "25%",
          "35%",
          "45%",
          "50%",
        ]}
      />

      {/* City */}

      <InputField
        label="Registration City"
        icon="bi-geo-alt"
        placeholder="City"
        value={form.registrationCity}
        onChange={(e)=>
          updateField(
            "registrationCity",
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
          placeholder="Any additional vehicle information..."
          value={form.motorNotes || ""}
          onChange={(e)=>
            updateField(
              "motorNotes",
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
          error ? "is-invalid":""
        }`}
        value={value || ""}
        onChange={onChange}
      >

        <option value="">
         Select
        </option>

        {options.map(option=>(
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