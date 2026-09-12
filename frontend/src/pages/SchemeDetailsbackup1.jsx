import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaFilePdf,
  FaGlobe,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaClipboardCheck,
  FaInfoCircle,
} from "react-icons/fa";

import { fetchScheme } from "../api";

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadScheme() {
      if (!id) {
        setError("Scheme ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetchScheme(id);
        const data = response?.data && !Array.isArray(response.data)
          ? response.data
          : response;

        if (!data || typeof data !== "object") {
          throw new Error("Scheme not found.");
        }

        if (mounted) setScheme(data);
      } catch (err) {
        console.error("Load scheme details error:", err);
        if (mounted) {
          setScheme(null);
          setError(err?.message || "Unable to load scheme details.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadScheme();
    return () => { mounted = false; };
  }, [id]);

  const benefits = useMemo(() => normalizeArray(scheme?.benefits), [scheme]);
  const documents = useMemo(() => normalizeArray(scheme?.documents), [scheme]);
  const eligibilityEntries = useMemo(() => objectEntries(scheme?.eligibility), [scheme]);
  const applicationEntries = useMemo(() => objectEntries(scheme?.application), [scheme]);

  if (loading) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-5 text-center">
              <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
              <h5 className="fw-bold mb-1">Loading scheme details</h5>
              <p className="text-muted mb-0">Fetching the latest available scheme information...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !scheme) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="alert alert-danger rounded-4 shadow-sm">
            <div className="d-flex align-items-start gap-3">
              <FaInfoCircle className="mt-1 flex-shrink-0" />
              <div className="flex-grow-1">
                <h5 className="fw-bold mb-1">Unable to load scheme</h5>
                <p className="mb-3">{error || "The requested scheme could not be found."}</p>
                <div className="d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />Go Back
                  </button>
                  <Link to="/schemes" className="btn btn-outline-secondary">All Schemes</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const title = valueToText(scheme.scheme_name) || "Government Scheme";
  const description = valueToText(scheme.description) ||
    "Explore the eligibility, benefits, documents and application information for this Government scheme.";
  const image = scheme.banner_url || scheme.image_url || scheme.image || scheme.banner || scheme.logo_url || scheme.logo || "";
  const status = valueToText(scheme.status) || "Active";
  const guidelineUrl = scheme.guideline_pdf || scheme.guideline_file_url || "";

  return (
    <main className="bg-light min-vh-100" style={{ paddingBottom: "60px" }}>
      <div className="container pt-4">
        <button type="button" className="btn btn-link text-decoration-none text-secondary px-0 mb-3" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />Back to Schemes
        </button>
      </div>

      <section className="container">
        <div className="card border-0 shadow-lg overflow-hidden rounded-4" style={{ background: "linear-gradient(135deg, #062b63 0%, #0a4f9c 55%, #087f73 100%)" }}>
          {image ? (
            <div style={{
              height: "230px",
              backgroundImage: `linear-gradient(90deg, rgba(3,25,58,.92), rgba(3,54,105,.60)), url("${escapeCssUrl(image)}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }} />
          ) : null}

          <div className="card-body p-4 p-lg-5 text-white">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge rounded-pill bg-light text-primary px-3 py-2">Government Scheme</span>
              <span className={`badge rounded-pill px-3 py-2 ${isActiveStatus(status) ? "bg-success" : "bg-secondary"}`}>
                <span className="me-1">●</span>{status}
              </span>
            </div>

            <h1 className="fw-bold mb-3" style={{ maxWidth: "950px" }}>{title}</h1>
            <p className="lead mb-4" style={{ maxWidth: "900px", whiteSpace: "pre-wrap", opacity: 0.94 }}>{description}</p>

            <div className="d-flex flex-wrap gap-2">
              {scheme.official_apply_link ? (
                <a href={safeUrl(scheme.official_apply_link)} target="_blank" rel="noopener noreferrer" className="btn btn-warning fw-bold px-4">
                  Apply / Visit Official Portal <FaExternalLinkAlt className="ms-2" />
                </a>
              ) : null}
              {scheme.official_website ? (
                <a href={safeUrl(scheme.official_website)} target="_blank" rel="noopener noreferrer" className="btn btn-light text-primary fw-semibold px-4">
                  <FaGlobe className="me-2" />Official Website
                </a>
              ) : null}
              {guidelineUrl ? (
                <a href={safeUrl(guidelineUrl)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light fw-semibold px-4">
                  <FaFilePdf className="me-2" />Guidelines
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-4">
        <div className="row g-3">
          <InfoCard icon={<FaBuilding />} label="Ministry / Department" value={valueToText(scheme.ministry) || valueToText(scheme.department) || "Not specified"} />
          <InfoCard icon={<FaUsers />} label="Beneficiary" value={valueToText(scheme.beneficiary) || "Not specified"} />
          <InfoCard icon={<FaBriefcase />} label="Category / Sector" value={[scheme.category, scheme.sector].map(valueToText).filter(Boolean).join(" • ") || "Not specified"} />
          <InfoCard icon={<FaMapMarkerAlt />} label="State Applicability" value={valueToText(scheme.state_applicability) || "All India"} />
        </div>
      </section>

      <section className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <DetailSection icon={<FaCheckCircle />} title="Benefits / Financial Support" accent="success">
              {benefits.length > 0 ? <ValueList items={benefits} icon="bi-check-circle-fill" /> : <EmptyValue text="Benefit information is not available yet." />}
            </DetailSection>

            <DetailSection icon={<FaClipboardCheck />} title="Eligibility" accent="primary">
              {eligibilityEntries.length > 0 ? <ObjectList entries={eligibilityEntries} /> : <EmptyValue text="Eligibility information is not available yet." />}
            </DetailSection>

            <DetailSection icon={<FaFileAlt />} title="Documents Required" accent="warning">
              {documents.length > 0 ? <ValueList items={documents} icon="bi-file-earmark-text-fill" /> : <EmptyValue text="Required document information is not available yet." />}
            </DetailSection>

            <DetailSection icon={<FaExternalLinkAlt />} title="Application Process" accent="info">
              {applicationEntries.length > 0 ? <ObjectList entries={applicationEntries} /> : <EmptyValue text="Application process information is not available yet." />}
            </DetailSection>

            <DetailSection icon={<FaInfoCircle />} title="Scheme Overview" accent="secondary">
              <p className="mb-0 text-secondary" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{description}</p>
            </DetailSection>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-lg-top" style={{ top: "20px" }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Scheme Information</h5>
                <SidebarRow label="Scheme Name" value={title} />
                <SidebarRow label="Category" value={valueToText(scheme.category) || "General"} />
                <SidebarRow label="Ministry" value={valueToText(scheme.ministry) || "Not specified"} />
                <SidebarRow label="Department" value={valueToText(scheme.department) || "Not specified"} />
                <SidebarRow label="Beneficiary" value={valueToText(scheme.beneficiary) || "Not specified"} />
                <SidebarRow label="Sector" value={valueToText(scheme.sector) || "Not specified"} />
                <SidebarRow label="State / UT" value={valueToText(scheme.state_applicability) || "All India"} />
                <SidebarRow label="Status" value={status} last />

                <hr className="my-4" />
                <div className="d-grid gap-2">
                  {scheme.official_apply_link ? (
                    <a href={safeUrl(scheme.official_apply_link)} target="_blank" rel="noopener noreferrer" className="btn btn-primary fw-semibold">
                      Apply Now <FaExternalLinkAlt className="ms-2" />
                    </a>
                  ) : (
                    <button type="button" className="btn btn-primary fw-semibold" disabled title="Official application link is not available">
                      Apply Link Not Available
                    </button>
                  )}
                  {scheme.official_website ? (
                    <a href={safeUrl(scheme.official_website)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                      <FaGlobe className="me-2" />Visit Official Website
                    </a>
                  ) : null}
                  {guidelineUrl ? (
                    <a href={safeUrl(guidelineUrl)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
                      <FaFilePdf className="me-2" />View Guidelines
                    </a>
                  ) : null}
                </div>

                <div className="alert alert-light border rounded-3 mt-4 mb-0 small">
                  <FaInfoCircle className="text-primary me-2" />
                  Always verify the latest eligibility, benefits and application requirements on the official Government source before applying.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-5">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h5 className="fw-bold mb-1">Need help understanding this scheme?</h5>
              <p className="text-muted mb-0">Review eligibility, benefits and required documents before starting the application.</p>
            </div>
            <Link to="/schemes" className="btn btn-outline-primary px-4">Explore More Schemes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body p-3">
          <div className="d-flex gap-3 align-items-start">
            <div className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "42px", height: "42px" }}>{icon}</div>
            <div className="min-w-0">
              <small className="text-muted d-block mb-1">{label}</small>
              <div className="fw-semibold text-dark">{value}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ icon, title, accent = "primary", children }) {
  return (
    <section className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className={`rounded-3 bg-${accent}-subtle text-${accent} d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: "44px", height: "44px" }}>{icon}</div>
          <h2 className="h5 fw-bold mb-0">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function ValueList({ items, icon }) {
  return (
    <div className="d-grid gap-2">
      {items.map((item, index) => (
        <div key={`value-${index}`} className="d-flex align-items-start gap-3 border rounded-3 p-3 bg-light">
          <i className={`bi ${icon} text-success mt-1`} aria-hidden="true" />
          <div className="flex-grow-1"><ValueRenderer value={item} /></div>
        </div>
      ))}
    </div>
  );
}

function ObjectList({ entries }) {
  return (
    <div className="d-grid gap-3">
      {entries.map(([key, value]) => (
        <div key={key} className="border rounded-3 p-3">
          <div className="small text-uppercase fw-bold text-primary mb-2">{formatKey(key)}</div>
          <div className="text-secondary"><ValueRenderer value={value} /></div>
        </div>
      ))}
    </div>
  );
}

function SidebarRow({ label, value, last = false }) {
  return (
    <div className={`d-flex justify-content-between gap-3 py-3 ${last ? "" : "border-bottom"}`}>
      <span className="small text-muted">{label}</span>
      <span className="small fw-semibold text-end text-dark">{value}</span>
    </div>
  );
}

function EmptyValue({ text }) {
  return <div className="alert alert-light border mb-0 text-muted">{text}</div>;
}

function ValueRenderer({ value }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted">Not specified</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="d-grid gap-2">
        {value.map((item, index) => (
          <div key={index} className="d-flex gap-2">
            <span className="text-primary">•</span>
            <div><ValueRenderer value={item} /></div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="d-grid gap-2">
        {Object.entries(value).map(([key, item]) => (
          <div key={key}>
            <strong className="text-dark">{formatKey(key)}:</strong>{" "}
            <ValueRenderer value={item} />
          </div>
        ))}
      </div>
    );
  }

  return <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{String(value)}</span>;
}

function normalizeArray(value) {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) return value.filter((item) => item !== null && item !== undefined && item !== "");

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (parsed && typeof parsed === "object") return [parsed];
    } catch {
      // Plain-text discovery evidence is still useful.
    }

    return trimmed
      .split(/\s*(?:\|\||\||;|\n|•)\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
}

function objectEntries(value) {
  if (value === null || value === undefined || value === "") return [];

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        return Array.isArray(parsed)
          ? parsed.map((item, index) => [String(index + 1), item])
          : Object.entries(parsed).filter(([, item]) => item !== null && item !== undefined && item !== "");
      }
    } catch {
      // Plain text becomes a single meaningful field.
    }

    return [["Information", trimmed]];
  }

  if (typeof value !== "object") return [["Information", String(value)]];
  if (Array.isArray(value)) return value.map((item, index) => [String(index + 1), item]);
  return Object.entries(value).filter(([, item]) => item !== null && item !== undefined && item !== "");
}

function valueToText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(valueToText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${formatKey(key)}: ${valueToText(item)}`)
      .filter(Boolean)
      .join(" • ");
  }
  return "";
}

function formatKey(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isActiveStatus(value) {
  const status = String(value || "").toLowerCase();
  return status === "active" || status === "published" || status === "live" || status === "new";
}

function safeUrl(value) {
  if (!value) return "#";
  const raw = String(value).trim();
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "#";
  } catch {
    return "#";
  }
}

function escapeCssUrl(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "");
}
