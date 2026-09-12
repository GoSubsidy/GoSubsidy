import React, { useMemo, useState } from "react";

/**
 * GoSubsidy — Large DPR Template Catalog
 * Designed for 1,000+ templates without rendering all rows at once.
 * Expects dprCategories from ../data/dprCategories
 */
export default function DPRTemplateCatalogModal({
  show,
  onClose,
  categories = [],
  onSelectTemplate,
}) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const category = categories[activeCategory] || categories[0];

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!category?.projects) return [];
    if (!q) return category.projects;

    return category.projects.filter((project) => {
      const name = typeof project === "string" ? project : project?.name;
      const source = typeof project === "object" ? project?.source : "";
      return `${name || ""} ${source || ""}`.toLowerCase().includes(q);
    });
  }, [category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleProjects = filteredProjects.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const selectCategory = (index) => {
    setActiveCategory(index);
    setSearch("");
    setPage(1);
  };

  const selectTemplate = (project) => {
    const name = typeof project === "string" ? project : project.name;

    onSelectTemplate?.({
      projectName: name,
      businessType: category?.businessType || "MSME",
      categoryId: category?.id || "general",
      categoryTitle: category?.title || "General & Miscellaneous Projects",
      source: typeof project === "object" ? project.source : "",
    });

    onClose?.();
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      role="dialog"
      aria-modal="true"
      aria-label="DPR Template Catalog"
      style={{ backgroundColor: "rgba(0,0,0,.60)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-white text-dark px-4 py-3 border-bottom">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-grid-3x3-gap-fill text-primary" />
              <span>Detailed Project Report - Sector &amp; Template Catalog</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-light">
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6
                  className="text-uppercase text-muted fw-bold mb-0"
                  style={{ fontSize: "12px", letterSpacing: ".5px" }}
                >
                  Select Industry Sector
                </h6>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                  {categories.reduce(
                    (total, item) => total + (item.projects?.length || 0),
                    0
                  ).toLocaleString()} Templates
                </span>
              </div>

              <div className="row g-3">
                {categories.map((cat, idx) => (
                  <div className="col-lg-4 col-md-6" key={cat.id || idx}>
                    <button
                      type="button"
                      className={`card border-0 shadow-sm p-3 rounded-4 w-100 h-100 cursor-pointer transition-all d-flex flex-column align-items-center text-center position-relative ${
                        activeCategory === idx
                          ? "bg-primary text-white shadow"
                          : "bg-white text-dark"
                      }`}
                      onClick={() => selectCategory(idx)}
                      style={{ minHeight: "110px", justifyContent: "center" }}
                    >
                      <span
                        className={`badge position-absolute top-0 end-0 m-2 rounded-pill px-2 py-1 fw-bold ${
                          activeCategory === idx
                            ? "bg-light text-primary"
                            : "bg-primary-subtle text-primary"
                        }`}
                        style={{ fontSize: "10px" }}
                      >
                        {(cat.projects?.length || 0).toLocaleString()} Templates
                      </span>
                      <div className="fs-2 mb-2">{cat.icon}</div>
                      <span className="fw-bold" style={{ fontSize: "14px" }}>
                        {cat.title}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected category */}
            <div className="bg-white rounded-4 p-4 shadow-sm border">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pb-3 border-bottom">
                <div>
                  <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                    <span>{category?.icon}</span>
                    <span>{category?.title}</span>
                  </h5>
                  <small className="text-muted">
                    Showing {filteredProjects.length.toLocaleString()} matching templates
                  </small>
                </div>

                <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill">
                  {filteredProjects.length.toLocaleString()} Available Profiles
                </span>
              </div>

              {/* Search */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="search"
                  className="form-control"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search project name or source..."
                />
                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <p className="text-muted small mb-3">
                Select a project profile to instantly apply it to your DPR form.
              </p>

              {/* Only 30 records are rendered at a time */}
              <div className="row g-3">
                {visibleProjects.map((project, index) => {
                  const name = typeof project === "string" ? project : project.name;
                  const source = typeof project === "object" ? project.source : "";

                  return (
                    <div className="col-md-6" key={project.id || `${name}-${index}`}>
                      <button
                        type="button"
                        className="card border shadow-sm p-3 rounded-3 hover-shadow transition-all d-flex flex-row align-items-center justify-content-between cursor-pointer bg-white h-100 w-100 text-start"
                        onClick={() => selectTemplate(project)}
                      >
                        <div className="d-flex align-items-center gap-3 min-w-0">
                          <div
                            className="rounded-circle bg-primary-subtle text-primary p-2 d-flex align-items-center justify-content-center shrink-0"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="bi bi-file-earmark-text-fill fs-5" />
                          </div>
                          <div className="min-w-0">
                            <div
                              className="fw-bold mb-1 text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              {name}
                            </div>
                            {source && (
                              <small
                                className="text-muted d-block text-truncate"
                                style={{ fontSize: "10.5px", maxWidth: "280px" }}
                              >
                                {source}
                              </small>
                            )}
                          </div>
                        </div>
                        <span className="btn btn-sm btn-outline-primary rounded-pill px-3 shrink-0 ms-2">
                          Select <i className="bi bi-arrow-right ms-1" />
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {visibleProjects.length === 0 && (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-search fs-2 d-block mb-2" />
                  No templates found for <strong>{search}</strong>.
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Page {safePage} of {totalPages} · {pageSize} per page
                  </small>
                  <div className="btn-group" role="group" aria-label="Template pages">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      disabled={safePage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      disabled={safePage >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer bg-white border-top">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
