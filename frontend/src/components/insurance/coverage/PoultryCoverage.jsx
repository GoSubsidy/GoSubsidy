import React from "react";

export default function PoultryCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Farm Name */}

      <InputField
        label="Farm Name"
        required
        icon="bi-house"
        placeholder="Enter Farm Name"
        value={form.farmName}
        error={errors.farmName}
        onChange={(e)=>
          updateField("farmName",e.target.value)
        }
      />

      {/* Poultry Type */}

      <SelectField
        label="Poultry Type"
        required
        value={form.poultryType}
        error={errors.poultryType}
        onChange={(e)=>
          updateField("poultryType",e.target.value)
        }
        options={[
          "Broiler",
          "Layer",
          "Breeder",
          "Country Chicken",
          "Duck",
          "Turkey",
          "Quail",
        ]}
      />

      {/* Birds */}

      <InputField
        label="Total Birds"
        required
        type="number"
        icon="bi-123"
        placeholder="Number of Birds"
        value={form.totalBirds}
        error={errors.totalBirds}
        onChange={(e)=>
          updateField("totalBirds",e.target.value)
        }
      />

      {/* Capacity */}

      <InputField
        label="Farm Capacity"
        type="number"
        icon="bi-building"
        placeholder="Maximum Capacity"
        value={form.farmCapacity}
        onChange={(e)=>
          updateField("farmCapacity",e.target.value)
        }
      />

      {/* Shed */}

      <SelectField
        label="Shed Type"
        value={form.shedType}
        onChange={(e)=>
          updateField("shedType",e.target.value)
        }
        options={[
          "Open",
          "Semi Closed",
          "Environment Controlled",
          "Tunnel Ventilated",
        ]}
      />

      {/* Insurance Value */}

      <InputField
        label="Bird Value (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Total Bird Value"
        value={form.poultryValue}
        error={errors.poultryValue}
        onChange={(e)=>
          updateField("poultryValue",e.target.value)
        }
      />

      {/* Building Value */}

      <InputField
        label="Shed Value (₹)"
        type="number"
        icon="bi-house-door"
        placeholder="Building Value"
        value={form.shedValue}
        onChange={(e)=>
          updateField("shedValue",e.target.value)
        }
      />

      {/* Equipment */}

      <InputField
        label="Equipment Value (₹)"
        type="number"
        icon="bi-gear"
        placeholder="Equipment Value"
        value={form.equipmentValue}
        onChange={(e)=>
          updateField("equipmentValue",e.target.value)
        }
      />

      {/* Vaccination */}

      <SelectField
        label="Vaccination Status"
        value={form.vaccinationStatus}
        onChange={(e)=>
          updateField(
            "vaccinationStatus",
            e.target.value
          )
        }
        options={[
          "Fully Vaccinated",
          "Partially Vaccinated",
          "Not Vaccinated",
        ]}
      />

      {/* Bio Security */}

      <SelectField
        label="Bio Security"
        value={form.bioSecurity}
        onChange={(e)=>
          updateField(
            "bioSecurity",
            e.target.value
          )
        }
        options={[
          "High",
          "Medium",
          "Basic",
        ]}
      />

      {/* Existing Policy */}

      <SelectField
        label="Existing Insurance"
        value={form.existingPoultryPolicy}
        onChange={(e)=>
          updateField(
            "existingPoultryPolicy",
            e.target.value
          )
        }
        options={[
          "No",
          "Yes",
        ]}
      />

      {/* Address */}

      <InputField
        col="col-12"
        label="Farm Address"
        icon="bi-geo-alt"
        placeholder="Farm Address"
        value={form.farmAddress}
        onChange={(e)=>
          updateField("farmAddress",e.target.value)
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
          placeholder="Mention farm details, disease history, subsidy information, etc."
          value={form.poultryNotes || ""}
          onChange={(e)=>
            updateField(
              "poultryNotes",
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

        {required &&
          <span className="text-danger ms-1">*</span>}

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

        {required &&
          <span className="text-danger ms-1">*</span>}

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