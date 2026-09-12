import React from "react";

export default function FilterBar({
  category = "",
  ministry = "",
  status = "",
  categories = [],
  ministries = [],
  onCategoryChange,
  onMinistryChange,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">

        <div className="row g-3 align-items-end">

          {/* Category */}

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Category
            </label>

            <select
              className="form-select"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Ministry */}

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Ministry
            </label>

            <select
              className="form-select"
              value={ministry}
              onChange={(e) => onMinistryChange(e.target.value)}
            >
              <option value="">All Ministries</option>

              {ministries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Status
            </label>

            <select
              className="form-select"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Reset */}

          <div className="col-md-3">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={onReset}
            >
              Reset Filters
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}