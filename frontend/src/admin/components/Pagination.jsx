import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-between align-items-center mt-4">

      {/* Left */}

      <button
        className="btn btn-outline-primary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </button>

      {/* Page Numbers */}

      <ul className="pagination mb-0">

        {pages.map((page) => (

          <li
            key={page}
            className={`page-item ${
              currentPage === page ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>

        ))}

      </ul>

      {/* Right */}

      <button
        className="btn btn-outline-primary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </button>

    </nav>
  );
}