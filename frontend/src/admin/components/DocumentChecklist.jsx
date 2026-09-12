import React, { useState } from "react";

export default function DocumentChecklist({
  documents = [],
  onChange,
}) {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [draft, setDraft] = useState("");

  const addDocument = () => {
    const value = draft.trim();
    if (!value) return;

    onChange?.([...safeDocuments, value]);
    setDraft("");
  };

  const removeDocument = (index) => {
    onChange?.(safeDocuments.filter((_, i) => i !== index));
  };

  const updateDocument = (index, value) => {
    const next = [...safeDocuments];
    next[index] = value;
    onChange?.(next);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addDocument();
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white border-0 pt-4 px-4">
        <h5 className="fw-bold mb-1">Required Documents</h5>
        <p className="text-muted small mb-0">
          Add the documents applicants must submit. Use one document per row.
        </p>
      </div>

      <div className="card-body p-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: Aadhaar Card"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={addDocument}
          >
            Add Document
          </button>
        </div>

        {safeDocuments.length === 0 ? (
          <div className="alert alert-light border mb-0">
            No documents added yet.
          </div>
        ) : (
          <div className="d-grid gap-2">
            {safeDocuments.map((item, index) => {
              const value =
                typeof item === "string"
                  ? item
                  : item?.name || item?.title || item?.description || "";

              return (
                <div className="input-group" key={index}>
                  <span className="input-group-text">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={value}
                    onChange={(e) =>
                      updateDocument(index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeDocument(index)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
