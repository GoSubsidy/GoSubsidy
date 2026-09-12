import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { dprCategories } from "../data/dprCategories";

export default function DprHeroPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);

  // dprCategories now stores projects as objects:
  // { id, name, source }. Keep this page compatible with both
  // the new object format and any older string entries.
  const getProjectName = (project) =>
    typeof project === "string" ? project : project?.name || "";

  const getProjectSource = (project) =>
    typeof project === "string" ? "" : project?.source || "";

  // Calculate total templates across all sectors dynamically
  const totalTemplatesCount = dprCategories.reduce(
    (acc, cat) => acc + cat.projects.length,
    0
  );

  const handleSelectProject = (projectTitle, categoryTitle) => {
    const selectedProjectName = getProjectName(projectTitle);
    navigate("/dpr", { 
      state: { 
        selectedProject: selectedProjectName,
        selectedCategory: categoryTitle 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-light pb-5">
      {/* Top Header Section with Total Templates Badge */}
      <div className="bg-white border-bottom py-4 px-4 mb-4 shadow-sm">
        <div className="max-w-7xl mx-auto container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h1 className="fw-bold text-dark fs-3 mb-0">Detailed Project Report Catalog</h1>
              <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill" style={{ fontSize: "12px" }}>
                Total: {totalTemplatesCount}+ Templates
              </span>
            </div>
            <p className="text-muted small mb-0">Select an industry sector below to explore bank-ready project report templates.</p>
          </div>
          <Link to="/dpr" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
            <i className="bi bi-file-earmark-text me-1" /> Open DPR Wizard
          </Link>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="container max-w-7xl">
        
        {/* FIRST PART: Insurance Dashboard Style Sector Grid */}
        <div className="bg-white rounded-4 p-4 shadow-sm border mb-4">
          <h4 className="fw-bold text-dark mb-3 uppercase" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
            Select Industry Sector
          </h4>
          <div className="row g-3">
            {dprCategories.map((cat, idx) => (
              <div className="col-lg-4 col-md-6" key={idx}>
                <div 
                  className={`card border-0 shadow-sm p-4 rounded-4 cursor-pointer transition-all d-flex flex-column align-items-center text-center position-relative ${
                    activeCategory === idx 
                      ? 'bg-primary text-white shadow' 
                      : 'bg-white text-dark hover-shadow border'
                  }`}
                  onClick={() => setActiveCategory(idx)}
                  style={{ minHeight: "130px", justifyContent: "center", cursor: "pointer" }}
                >
                  <span className={`badge position-absolute top-0 end-0 m-3 rounded-pill px-2.5 py-1 fw-bold ${
                    activeCategory === idx ? 'bg-light text-primary' : 'bg-primary-subtle text-primary'
                  }`} style={{ fontSize: "11px" }}>
                    {cat.projects.length} Templates
                  </span>
                  <div className={`fs-1 mb-2 ${activeCategory === idx ? 'text-white' : 'text-primary'}`}>
                    {cat.icon}
                  </div>
                  <h5 className="fw-bold mb-0" style={{ fontSize: "15px" }}>{cat.title}</h5>
                  <small className={`mt-1 ${activeCategory === idx ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: "12px" }}>
                    Click to view reports
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECOND PART: Detailed Project Report Templates under the selected category */}
        <div className="bg-white rounded-4 p-4 shadow-sm border">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-3 border-bottom">
            <div>
              <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2 fs-4">
                <span>{(dprCategories[activeCategory] || dprCategories[0]).icon}</span>
                <span>{(dprCategories[activeCategory] || dprCategories[0]).title} - Detailed Project Reports</span>
              </h3>
              <p className="text-muted small mb-0">
                Choose any template below to auto-load financial formulas, project costs, and subsidy details into your DPR.
              </p>
            </div>
            <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mt-2 mt-md-0">
              {(dprCategories[activeCategory] || dprCategories[0]).projects.length} Available Profiles
            </span>
          </div>

          <div className="row g-3">
            {(dprCategories[activeCategory] || dprCategories[0]).projects.map((proj, pIdx) => (
              <div
                className="col-lg-6"
                key={typeof proj === "object" ? proj?.id ?? pIdx : pIdx}
              >
                <div className="card border shadow-sm p-3 rounded-3 d-flex flex-row align-items-center justify-content-between bg-white h-100 hover-shadow">
                  <div className="d-flex align-items-center gap-3 pe-2">
                    <div className="rounded-circle bg-primary-subtle text-primary p-2 d-flex align-items-center justify-content-center shrink-0" style={{ width: "42px", height: "42px" }}>
                      <i className="bi bi-file-earmark-text-fill fs-5" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: "14.5px" }}>{getProjectName(proj)}</h6>
                      <small className="text-muted d-block" style={{ fontSize: "11.5px" }}>
                        Includes cost sheets, P&amp;L projections &amp; DSCR
                      </small>
                      {getProjectSource(proj) && (
                        <small
                          className="text-primary d-block mt-1"
                          style={{ fontSize: "10.5px" }}
                        >
                          Source: {getProjectSource(proj)}
                        </small>
                      )}
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 shrink-0 fw-semibold"
                    onClick={() => handleSelectProject(proj, (dprCategories[activeCategory] || dprCategories[0]).title)}
                  >
                    Select <i className="bi bi-arrow-right ms-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}