import React from "react";

export default function ReviewStep({
  form = {},
  selectedInsurance = {},
  onEdit,
}) {
  const renderRow = (label, value) => (
    <tr>
      <th
        style={{
          width: "35%",
          color: "#6c757d",
          fontWeight: 600,
        }}
      >
        {label}
      </th>

      <td>{value || "-"}</td>
    </tr>
  );

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="fw-bold mb-1">
            Review Your Application
          </h3>

          <p className="text-muted mb-0">
            Please verify all information before submitting.
          </p>

        </div>

        {onEdit && (
          <button
            className="btn btn-outline-primary"
            onClick={onEdit}
          >
            <i className="bi bi-pencil-square me-2"></i>

            Edit
          </button>
        )}

      </div>

      {/* Insurance */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-primary text-white">

          <h5 className="mb-0">
            Insurance Details
          </h5>

        </div>

        <div className="card-body">

          <table className="table table-borderless">

            <tbody>

              {renderRow(
                "Insurance Type",
                selectedInsurance?.label ||
                  form.insuranceType
              )}

              {renderRow(
                "Coverage",
                form.coverage
              )}

              {renderRow(
                "Sum Insured",
                form.sumInsured
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Applicant */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-success text-white">

          <h5 className="mb-0">

            Applicant Details

          </h5>

        </div>

        <div className="card-body">

          <table className="table table-borderless">

            <tbody>

              {renderRow(
                "Full Name",
                form.fullName
              )}

              {renderRow(
                "Mobile",
                form.mobile
              )}

              {renderRow(
                "Email",
                form.email
              )}

              {renderRow(
                "Date of Birth",
                form.dob
              )}

              {renderRow(
                "Gender",
                form.gender
              )}

              {renderRow(
                "Occupation",
                form.occupation
              )}

              {renderRow(
                "Annual Income",
                form.annualIncome
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Address */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-warning">

          <h5 className="mb-0">

            Address

          </h5>

        </div>

        <div className="card-body">

          <table className="table table-borderless">

            <tbody>

              {renderRow(
                "Address",
                form.address
              )}

              {renderRow(
                "City",
                form.city
              )}

              {renderRow(
                "State",
                form.state
              )}

              {renderRow(
                "PIN Code",
                form.pincode
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Declaration */}

      <div className="alert alert-success">

        <h6 className="fw-bold">

          Declaration

        </h6>

        <p className="mb-0">

          I hereby declare that the information
          provided above is true and correct to
          the best of my knowledge. I authorize
          GoSubsidy and its insurance partners
          to process my application for insurance
          quotations.

        </p>

      </div>

    </div>
  );
}