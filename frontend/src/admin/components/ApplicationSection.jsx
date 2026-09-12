import React from "react";

export default function ApplicationSection({
  application = {},
  onChange,
}) {
  // ==========================================
  // SAFE DEFAULT VALUES
  // ==========================================

  const data = {
  website: "",
  applyLink: "",
  process: "",
  mode: "",
  startDate: "",
  endDate: "",
  contactEmail: "",
  contactPhone: "",
  helpline: "",
  ...application,
};

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (typeof onChange === "function") {
      onChange({
        ...data,
        [name]: value,
      });
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white border-0 pt-4 px-4">
        <h5 className="fw-bold mb-1">
          Application Details
        </h5>

        <p className="text-muted small mb-0">
          Enter official application links, process,
          dates and contact information.
        </p>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">

          {/* OFFICIAL WEBSITE */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Official Website
            </label>

            <input
              type="url"
              className="form-control"
              name="website"
              value={data.website}
              onChange={handleChange}
              placeholder="https://www.example.gov.in"
            />
          </div>

          {/* APPLY LINK */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Official Apply Link
            </label>

            <input
              type="url"
              className="form-control"
              name="applyLink"
              value={data.applyLink}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {/* APPLICATION MODE */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Application Mode
            </label>

            <select
              className="form-select"
              name="mode"
              value={data.mode}
              onChange={handleChange}
            >
              <option value="">
                Select application mode
              </option>

              <option value="Online">
                Online
              </option>

              <option value="Offline">
                Offline
              </option>

              <option value="Online & Offline">
                Online & Offline
              </option>
            </select>
          </div>

          {/* HELPLINE */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Helpline
            </label>

            <input
              type="text"
              className="form-control"
              name="helpline"
              value={data.helpline}
              onChange={handleChange}
              placeholder="Example: 1800-XXX-XXXX"
            />
          </div>

          {/* START DATE */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Application Start Date
            </label>

            <input
              type="date"
              className="form-control"
              name="startDate"
              value={data.startDate}
              onChange={handleChange}
            />
          </div>

          {/* END DATE */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Application End Date
            </label>

            <input
              type="date"
              className="form-control"
              name="endDate"
              value={data.endDate}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Contact Email
            </label>

            <input
              type="email"
              className="form-control"
              name="contactEmail"
              value={data.contactEmail}
              onChange={handleChange}
              placeholder="support@example.gov.in"
            />
          </div>

          {/* PHONE */}

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Contact Phone
            </label>

            <input
              type="text"
              className="form-control"
              name="contactPhone"
              value={data.contactPhone}
              onChange={handleChange}
              placeholder="Contact number"
            />
          </div>

          {/* APPLICATION PROCESS */}

          <div className="col-12">
            <label className="form-label fw-semibold">
              Application Process
            </label>

            <textarea
              className="form-control"
              name="process"
              rows="5"
              value={data.process}
              onChange={handleChange}
              placeholder="Example:

1. Visit the official website.
2. Register or login.
3. Complete the application form.
4. Upload required documents.
5. Submit the application."
            />
          </div>

        </div>
      </div>
    </div>
  );
}