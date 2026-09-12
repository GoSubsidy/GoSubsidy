import React from "react";

// ======================================================
// DEFAULT SEO DATA
// ======================================================

const DEFAULT_SEO = {
  title: "",
  description: "",
  keywords: "",
  slug: "",
};

// ======================================================
// SEO SECTION
// ======================================================

export default function SeoSection({
  seo = DEFAULT_SEO,
  onChange,
}) {
  // ====================================================
  // SAFE DATA
  // ====================================================

  const data = {
    ...DEFAULT_SEO,
    ...(seo || {}),
  };

  // ====================================================
  // HANDLE FIELD CHANGE
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (typeof onChange === "function") {
      onChange({
        ...data,
        [name]: value,
      });
    }
  };

  // ====================================================
  // AUTO CREATE SLUG FROM SEO TITLE
  // ====================================================

  const generateSlug = () => {
    const source =
      data.title?.trim() || "";

    const slug = source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (typeof onChange === "function") {
      onChange({
        ...data,
        slug,
      });
    }
  };

  // ====================================================
  // CHARACTER COUNTS
  // ====================================================

  const titleLength =
    data.title?.length || 0;

  const descriptionLength =
    data.description?.length || 0;

  return (
    <div className="card border-0 shadow-sm mb-4">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="card-header bg-white border-0 pt-4 px-4">

        <h5 className="fw-bold mb-1">
          SEO & Search Optimization
        </h5>

        <p className="text-muted small mb-0">
          Configure how this scheme appears in search
          engines and GoSubsidy search results.
        </p>

      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="card-body p-4">

        <div className="row g-4">

          {/* =============================================
              SEO TITLE
          ============================================== */}

          <div className="col-12">

            <div className="d-flex justify-content-between align-items-center mb-2">

              <label className="form-label fw-semibold mb-0">
                SEO Title
              </label>

              <small
                className={
                  titleLength > 60
                    ? "text-danger"
                    : "text-muted"
                }
              >
                {titleLength}/60
              </small>

            </div>

            <input
              type="text"
              name="title"
              className="form-control"
              value={data.title}
              onChange={handleChange}
              placeholder="Example: PM-KISAN Scheme - Eligibility, Benefits & Apply Online"
              maxLength={100}
            />

            <div className="form-text">
              Recommended length: 50–60 characters.
            </div>

          </div>

          {/* =============================================
              META DESCRIPTION
          ============================================== */}

          <div className="col-12">

            <div className="d-flex justify-content-between align-items-center mb-2">

              <label className="form-label fw-semibold mb-0">
                Meta Description
              </label>

              <small
                className={
                  descriptionLength > 160
                    ? "text-danger"
                    : "text-muted"
                }
              >
                {descriptionLength}/160
              </small>

            </div>

            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={data.description}
              onChange={handleChange}
              placeholder="Write a short search-engine description of the scheme..."
              maxLength={250}
            />

            <div className="form-text">
              Recommended length: 140–160 characters.
            </div>

          </div>

          {/* =============================================
              KEYWORDS
          ============================================== */}

          <div className="col-12">

            <label className="form-label fw-semibold">
              SEO Keywords
            </label>

            <input
              type="text"
              name="keywords"
              className="form-control"
              value={data.keywords}
              onChange={handleChange}
              placeholder="PM Kisan, farmer subsidy, agriculture scheme, government scheme"
            />

            <div className="form-text">
              Separate keywords with commas.
            </div>

          </div>

          {/* =============================================
              SLUG
          ============================================== */}

          <div className="col-12">

            <label className="form-label fw-semibold">
              URL Slug
            </label>

            <div className="input-group">

              <span className="input-group-text">
                /schemes/
              </span>

              <input
                type="text"
                name="slug"
                className="form-control"
                value={data.slug}
                onChange={handleChange}
                placeholder="pradhan-mantri-kisan-samman-nidhi"
              />

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={generateSlug}
              >
                Generate
              </button>

            </div>

            <div className="form-text">
              Use lowercase words separated by hyphens.
            </div>

          </div>

          {/* =============================================
              SEARCH PREVIEW
          ============================================== */}

          <div className="col-12">

            <hr />

            <h6 className="fw-bold mb-3">
              Search Preview
            </h6>

            <div
              className="border rounded-3 p-3"
              style={{
                backgroundColor: "#f8f9fa",
              }}
            >

              <div
                className="small mb-1"
                style={{
                  color: "#198754",
                }}
              >
                gosubsidy.in/schemes/
                {data.slug ||
                  "scheme-name"}
              </div>

              <div
                className="fw-semibold fs-5"
                style={{
                  color: "#0d6efd",
                }}
              >
                {data.title ||
                  "Government Scheme Title"}
              </div>

              <div className="text-muted mt-1">

                {data.description ||
                  "Scheme description will appear here in search results."}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}