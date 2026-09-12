import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="position-relative" style={{ maxWidth: "400px" }}>
      {/* Search Icon */}
      <FaSearch
        className="position-absolute text-secondary"
        style={{
          top: "50%",
          left: "15px",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      />

      {/* Input */}
      <input
        type="text"
        className="form-control rounded-pill ps-5 pe-5 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          className="btn btn-sm border-0 position-absolute"
          style={{
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "transparent",
            zIndex: 2,
          }}
          onClick={() => onChange("")}
        >
          <FaTimes className="text-muted" />
        </button>
      )}
    </div>
  );
}