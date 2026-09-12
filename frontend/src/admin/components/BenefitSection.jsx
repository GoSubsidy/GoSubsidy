import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const EMPTY_BENEFIT = {
  title: "",
  amount: "",
  type: "",
  description: "",
};

export default function BenefitSection({
  benefits = [],
  onChange,
}) {
  // Always guarantee an array
  const safeBenefits = Array.isArray(benefits)
    ? benefits
    : [];

  // ==========================================
  // UPDATE BENEFIT
  // ==========================================

  const updateBenefit = (index, field, value) => {
    const updated = safeBenefits.map(
      (benefit, i) =>
        i === index
          ? {
              ...benefit,
              [field]: value,
            }
          : benefit
    );

    if (typeof onChange === "function") {
      onChange(updated);
    }
  };

  // ==========================================
  // ADD BENEFIT
  // ==========================================

  const addBenefit = () => {
    const updated = [
      ...safeBenefits,
      { ...EMPTY_BENEFIT },
    ];

    if (typeof onChange === "function") {
      onChange(updated);
    }
  };

  // ==========================================
  // REMOVE BENEFIT
  // ==========================================

  const removeBenefit = (index) => {
    const updated = safeBenefits.filter(
      (_, i) => i !== index
    );

    if (typeof onChange === "function") {
      onChange(updated);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">

      {/* HEADER */}

      <div className="card-header bg-white border-0 pt-4 px-4">
        <div className="d-flex justify-content-between align-items-center gap-3">

          <div>
            <h5 className="fw-bold mb-1">
              Scheme Benefits
            </h5>

            <p className="text-muted small mb-0">
              Add financial and non-financial benefits
              provided under this scheme.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addBenefit}
          >
            <FaPlus className="me-2" />
            Add Benefit
          </button>

        </div>
      </div>

      {/* BODY */}

      <div className="card-body p-4">

        {safeBenefits.length === 0 ? (
          <div className="text-center border rounded-3 p-4 bg-light">

            <div className="text-muted mb-3">
              No benefits added yet.
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={addBenefit}
            >
              <FaPlus className="me-2" />
              Add First Benefit
            </button>

          </div>
        ) : (
          safeBenefits.map((benefit, index) => (
            <div
              key={index}
              className="border rounded-3 p-3 mb-3"
            >

              {/* BENEFIT HEADER */}

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h6 className="fw-bold mb-0">
                  Benefit {index + 1}
                </h6>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() =>
                    removeBenefit(index)
                  }
                  title="Remove benefit"
                >
                  <FaTrash />
                </button>

              </div>

              <div className="row g-3">

                {/* TITLE */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Benefit Title
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={benefit?.title || ""}
                    onChange={(e) =>
                      updateBenefit(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Example: Annual Financial Assistance"
                  />

                </div>

                {/* AMOUNT */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Benefit Amount
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      ₹
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      value={benefit?.amount || ""}
                      onChange={(e) =>
                        updateBenefit(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                      placeholder="Example: 6000 per year"
                    />

                  </div>

                </div>

                {/* BENEFIT TYPE */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Benefit Type
                  </label>

                  <select
                    className="form-select"
                    value={benefit?.type || ""}
                    onChange={(e) =>
                      updateBenefit(
                        index,
                        "type",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select benefit type
                    </option>

                    <option value="Financial Assistance">
                      Financial Assistance
                    </option>

                    <option value="Subsidy">
                      Subsidy
                    </option>

                    <option value="Loan">
                      Loan
                    </option>

                    <option value="Interest Subsidy">
                      Interest Subsidy
                    </option>

                    <option value="Grant">
                      Grant
                    </option>

                    <option value="Insurance">
                      Insurance
                    </option>

                    <option value="Training">
                      Training
                    </option>

                    <option value="Equipment">
                      Equipment
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="col-12">

                  <label className="form-label fw-semibold">
                    Benefit Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={
                      benefit?.description || ""
                    }
                    onChange={(e) =>
                      updateBenefit(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Explain the benefit provided under the scheme..."
                  />

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}