import React from "react";

export default function MarineCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Transit Type */}

      <SelectField
        label="Transit Type"
        required
        value={form.transitType}
        error={errors.transitType}
        onChange={(e)=>
          updateField("transitType", e.target.value)
        }
        options={[
          "Road",
          "Rail",
          "Air",
          "Sea",
          "Multi Modal",
        ]}
      />

      {/* Shipment Type */}

      <SelectField
        label="Shipment Type"
        required
        value={form.shipmentType}
        error={errors.shipmentType}
        onChange={(e)=>
          updateField("shipmentType", e.target.value)
        }
        options={[
          "Domestic",
          "Import",
          "Export",
        ]}
      />

      {/* Cargo Type */}

      <InputField
        label="Cargo Description"
        required
        icon="bi-box-seam"
        placeholder="Describe Cargo"
        value={form.cargoType}
        error={errors.cargoType}
        onChange={(e)=>
          updateField("cargoType", e.target.value)
        }
      />

      {/* Cargo Value */}

      <InputField
        label="Cargo Value (₹)"
        required
        type="number"
        icon="bi-currency-rupee"
        placeholder="Cargo Value"
        value={form.cargoValue}
        error={errors.cargoValue}
        onChange={(e)=>
          updateField("cargoValue", e.target.value)
        }
      />

      {/* Origin */}

      <InputField
        label="Origin"
        required
        icon="bi-geo-alt"
        placeholder="Origin Location"
        value={form.origin}
        error={errors.origin}
        onChange={(e)=>
          updateField("origin", e.target.value)
        }
      />

      {/* Destination */}

      <InputField
        label="Destination"
        required
        icon="bi-geo-fill"
        placeholder="Destination"
        value={form.destination}
        error={errors.destination}
        onChange={(e)=>
          updateField("destination", e.target.value)
        }
      />

      {/* Frequency */}

      <SelectField
        label="Shipment Frequency"
        value={form.shipmentFrequency}
        onChange={(e)=>
          updateField(
            "shipmentFrequency",
            e.target.value
          )
        }
        options={[
          "One Time",
          "Monthly",
          "Weekly",
          "Daily",
        ]}
      />

      {/* Packaging */}

      <SelectField
        label="Packing Type"
        value={form.packagingType}
        onChange={(e)=>
          updateField(
            "packagingType",
            e.target.value
          )
        }
        options={[
          "Wooden Box",
          "Carton",
          "Container",
          "Loose",
          "Pallet",
          "Other",
        ]}
      />

      {/* Conveyance */}

      <InputField
        label="Carrier / Transporter"
        icon="bi-truck"
        placeholder="Transport Company"
        value={form.carrier}
        onChange={(e)=>
          updateField("carrier", e.target.value)
        }
      />

      {/* Annual Turnover */}

      <InputField
        label="Annual Transit Value (₹)"
        type="number"
        icon="bi-graph-up-arrow"
        placeholder="Annual Shipment Value"
        value={form.annualTransitValue}
        onChange={(e)=>
          updateField(
            "annualTransitValue",
            e.target.value
          )
        }
      />

      {/* Additional Notes */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Information
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Special cargo handling requirements..."
          value={form.marineNotes || ""}
          onChange={(e)=>
            updateField(
              "marineNotes",
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
          error ? "is-invalid" : ""
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