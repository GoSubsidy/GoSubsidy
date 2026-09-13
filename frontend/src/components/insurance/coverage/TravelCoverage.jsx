import React from "react";

export default function TravelCoverage({
  form,
  errors = {},
  updateField,
}) {
  return (
    <div className="row g-4">

      {/* Travel Type */}

      <SelectField
        label="Travel Type"
        required
        value={form.travelType}
        error={errors.travelType}
        onChange={(e) =>
          updateField("travelType", e.target.value)
        }
        options={[
          "Domestic",
          "International",
          "Student",
          "Business",
          "Family Vacation",
          "Senior Citizen",
        ]}
      />

      {/* Destination */}

      <InputField
        label="Destination Country"
        required
        icon="bi-globe2"
        placeholder="Country"
        value={form.destinationCountry}
        error={errors.destinationCountry}
        onChange={(e) =>
          updateField(
            "destinationCountry",
            e.target.value
          )
        }
      />

      {/* Departure */}

      <InputField
        label="Departure Date"
        required
        type="date"
        icon="bi-calendar-event"
        value={form.departureDate}
        error={errors.departureDate}
        onChange={(e) =>
          updateField(
            "departureDate",
            e.target.value
          )
        }
      />

      {/* Return */}

      <InputField
        label="Return Date"
        required
        type="date"
        icon="bi-calendar-check"
        value={form.returnDate}
        error={errors.returnDate}
        onChange={(e) =>
          updateField(
            "returnDate",
            e.target.value
          )
        }
      />

      {/* Traveller Age */}

      <InputField
        label="Traveller Age"
        required
        type="number"
        icon="bi-person"
        placeholder="Age"
        value={form.travellerAge}
        error={errors.travellerAge}
        onChange={(e) =>
          updateField(
            "travellerAge",
            e.target.value
          )
        }
      />

      {/* Number of Travellers */}

      <InputField
        label="No. of Travellers"
        required
        type="number"
        icon="bi-people"
        placeholder="Travellers"
        value={form.travellerCount}
        error={errors.travellerCount}
        onChange={(e) =>
          updateField(
            "travellerCount",
            e.target.value
          )
        }
      />

      {/* Passport */}

      <SelectField
        label="Passport Available"
        value={form.passportAvailable}
        onChange={(e) =>
          updateField(
            "passportAvailable",
            e.target.value
          )
        }
        options={[
          "Yes",
          "No",
        ]}
      />

      {/* Medical */}

      <SelectField
        label="Pre-existing Disease"
        value={form.travelMedical}
        onChange={(e) =>
          updateField(
            "travelMedical",
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

      {/* Trip Cost */}

      <InputField
        label="Trip Cost (₹)"
        type="number"
        icon="bi-currency-rupee"
        placeholder="Trip Cost"
        value={form.tripCost}
        onChange={(e) =>
          updateField(
            "tripCost",
            e.target.value
          )
        }
      />

      {/* Cover */}

      <SelectField
        label="Coverage Required"
        value={form.travelCover}
        onChange={(e) =>
          updateField(
            "travelCover",
            e.target.value
          )
        }
        options={[
          "$50,000",
          "$100,000",
          "$250,000",
          "$500,000",
          "$1 Million",
        ]}
      />

      {/* Purpose */}

      <SelectField
        label="Purpose of Travel"
        value={form.travelPurpose}
        onChange={(e) =>
          updateField(
            "travelPurpose",
            e.target.value
          )
        }
        options={[
          "Vacation",
          "Business",
          "Education",
          "Medical",
          "Employment",
          "Pilgrimage",
        ]}
      />

      {/* Notes */}

      <div className="col-12">

        <label className="form-label fw-semibold">
          Additional Information
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Mention any special travel requirements..."
          value={form.travelNotes || ""}
          onChange={(e) =>
            updateField(
              "travelNotes",
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

/* ====================================================== */

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
          value={value || ""}
          placeholder={placeholder}
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

/* ====================================================== */

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