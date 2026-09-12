import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function CustomerApplications() {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Tab Filtering State: "all" | "pending" | "approved" | "closed"
  const [activeTab, setActiveTab] = useState("all");

  // Document Modal States
  const [selectedAppForDocs, setSelectedAppForDocs] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docType, setDocType] = useState("PAN & Identity Proof");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    async function loadApplications() {
      if (!user) return;
      setFetching(true);

      try {
        let loaded = [];

        if (session?.access_token) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/payment/customer/applications`, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (res.ok) {
              const data = await res.json();
              if (data?.success && Array.isArray(data?.applications) && data.applications.length > 0) {
                loaded = data.applications;
              }
            }
          } catch (apiErr) {
            console.warn("[CustomerApplications] API load error:", apiErr);
          }
        }

        if (loaded.length === 0) {
          const localApps = JSON.parse(localStorage.getItem("gosubsidy_applications") || "[]");
          const localPayments = JSON.parse(localStorage.getItem("gosubsidy_payments") || "[]");

          if (localApps.length > 0) {
            loaded = localApps;
          } else if (localPayments.length > 0) {
            loaded = localPayments.map((p) => ({
              id: p.orderId || p.razorpay_order_id,
              application_id: p.orderId || p.razorpay_order_id,
              service_name: p.serviceTitle || p.productName || "Registered Government Service",
              category: p.category || "Business Service",
              package_name: p.packageName || "Basic Plan",
              stage: "Document Verification",
              status: "In Progress",
              submittedOn: new Date(p.createdAt || p.verifiedAt || Date.now()).toLocaleDateString("en-IN"),
              amountPaid: `₹${Number(p.totalAmount || p.amount || 0).toLocaleString("en-IN")}`,
            }));
          }
        }

        setApplications(loaded);
      } catch (err) {
        console.error("[CustomerApplications] Error:", err);
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      loadApplications();
    }
  }, [authLoading, user, session?.access_token, navigate]);

  // Document Vault modal logic
  const openDocumentVault = async (app) => {
    setSelectedAppForDocs(app);
    setLoadingDocs(true);
    const appId = app.application_id || app.orderId || app.id;

    try {
      if (session?.access_token) {
        const res = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(appId)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        if (res.ok && data?.documents) {
          setDocuments(data.documents);
          return;
        }
      }

      const localDocs = JSON.parse(localStorage.getItem(`docs_${appId}`) || "[]");
      setDocuments(localDocs);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAppForDocs) return;

    const appId = selectedAppForDocs.application_id || selectedAppForDocs.orderId || selectedAppForDocs.id;
    setUploading(true);

    try {
      if (session?.access_token) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("applicationId", appId);
        formData.append("documentType", docType);

        const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data?.document) {
          setDocuments((prev) => [data.document, ...prev]);
          setUploading(false);
          return;
        }
      }

      const mockDoc = {
        id: `doc_${Date.now()}`,
        file_name: file.name,
        document_type: docType,
        file_size: file.size,
        status: "Uploaded (Local)",
        created_at: new Date().toISOString(),
      };
      const updatedDocs = [mockDoc, ...documents];
      setDocuments(updatedDocs);
      localStorage.setItem(`docs_${appId}`, JSON.stringify(updatedDocs));
    } catch (err) {
      alert("Failed to upload document: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (authLoading || fetching) {
    return <PageLoading text="Loading your applications..." />;
  }

  if (!user) return null;

  // Categorize Status Counts
  const pendingApps = applications.filter((a) => {
    const s = (a.status || "").toLowerCase();
    return s.includes("progress") || s.includes("pending") || s.includes("review") || s.includes("verification");
  });

  const approvedApps = applications.filter((a) => {
    const s = (a.status || "").toLowerCase();
    return s.includes("approved") || s.includes("complete") || s.includes("issued") || s.includes("sanctioned");
  });

  const closedApps = applications.filter((a) => {
    const s = (a.status || "").toLowerCase();
    return s.includes("closed") || s.includes("rejected") || s.includes("cancelled");
  });

  // Filtered Applications for Current Tab
  const displayApplications =
    activeTab === "pending"
      ? pendingApps
      : activeTab === "approved"
      ? approvedApps
      : activeTab === "closed"
      ? closedApps
      : applications;

  return (
    <main className="customer-account-page">
      <div className="customer-account-shell">
        <button className="account-back" onClick={() => navigate("/customer/dashboard")}>
          <i className="bi bi-arrow-left" /> Back to Dashboard
        </button>

        <section className="account-hero-card">
          <div>
            <span className="account-eyebrow">GOSUBSIDY CUSTOMER PORTAL</span>
            <h1>My Applications</h1>
            <p>Track your GoSubsidy scheme, DPR, loan and service applications in one place.</p>
          </div>
          <div className="account-hero-icon"><i className="bi bi-clipboard-check" /></div>
        </section>

        {/* INTERACTIVE TAB CARDS */}
        <section className="account-tabs-grid">
          <div
            className={`account-tab-card ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <div className="account-tab-icon blue"><i className="bi bi-grid-fill" /></div>
            <div className="account-tab-content">
              <strong>All ({applications.length})</strong>
              <p>View complete submission history</p>
            </div>
          </div>

          <div
            className={`account-tab-card ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <div className="account-tab-icon amber"><i className="bi bi-hourglass-split" /></div>
            <div className="account-tab-content">
              <strong>Pending ({pendingApps.length})</strong>
              <p>Applications awaiting review</p>
            </div>
          </div>

          <div
            className={`account-tab-card ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            <div className="account-tab-icon green"><i className="bi bi-check-circle" /></div>
            <div className="account-tab-content">
              <strong>Approved ({approvedApps.length})</strong>
              <p>Approved applications &amp; next steps</p>
            </div>
          </div>

          <div
            className={`account-tab-card ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            <div className="account-tab-icon gray"><i className="bi bi-x-circle" /></div>
            <div className="account-tab-content">
              <strong>Closed ({closedApps.length})</strong>
              <p>Completed or closed applications</p>
            </div>
          </div>
        </section>

        {/* APPLICATION LIST CONTENT CARD */}
        <section className="account-content-card">
          <div className="account-section-head">
            <div>
              <span>APPLICATION CENTRE</span>
              <h2>
                {activeTab === "all" && `Your Applications (${applications.length})`}
                {activeTab === "pending" && `Pending Applications (${pendingApps.length})`}
                {activeTab === "approved" && `Approved Applications (${approvedApps.length})`}
                {activeTab === "closed" && `Closed Applications (${closedApps.length})`}
              </h2>
            </div>
            <Link to="/schemes" className="account-primary-btn">
              <i className="bi bi-plus-lg" /> Start Application
            </Link>
          </div>

          {displayApplications.length === 0 ? (
            <div className="empty-account-state">
              <div className="empty-account-icon"><i className="bi bi-folder2-open" /></div>
              <h3>
                {activeTab === "all" && "No applications yet"}
                {activeTab === "pending" && "No pending applications"}
                {activeTab === "approved" && "No approved applications yet"}
                {activeTab === "closed" && "No closed applications"}
              </h3>
              <p>
                {activeTab === "all"
                  ? "Applications you submit through GoSubsidy will appear here with their current status, service type and next action."
                  : `You currently have no applications under ${activeTab} status.`}
              </p>
              <div className="account-actions">
                {activeTab !== "all" ? (
                  <button type="button" className="account-primary-btn" onClick={() => setActiveTab("all")}>
                    View All Applications
                  </button>
                ) : (
                  <>
                    <Link to="/schemes" className="account-primary-btn">Explore Schemes</Link>
                    <Link to="/dpr" className="account-secondary-btn">Create DPR</Link>
                    <Link to="/loans" className="account-secondary-btn">Loan Assistance</Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="account-applications-list">
              {displayApplications.map((app, idx) => {
                const appId = app.application_id || app.orderId || app.id || `APP-${idx + 1}`;
                const title = app.service_name || app.title || "Government Service";
                const stage = app.stage || "Document Verification";
                const status = app.status || "In Progress";
                const date = app.submittedOn || (app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN") : "Recent");

                const statusLower = status.toLowerCase();
                const isApproved = statusLower.includes("approved") || statusLower.includes("complete");
                const isClosed = statusLower.includes("closed") || statusLower.includes("rejected");

                return (
                  <article key={appId} className="account-app-item-card">
                    <div className="account-app-main-info">
                      <div className="account-app-badge-row">
                        <span
                          className={`account-status-pill ${
                            isApproved ? "approved" : isClosed ? "closed" : "in-progress"
                          }`}
                        >
                          ● {status}
                        </span>
                        {app.package_name && <span className="account-pkg-pill">{app.package_name}</span>}
                      </div>
                      <h3>{title}</h3>
                      <div className="account-app-meta-details">
                        <span><strong>Application ID:</strong> {appId}</span>
                        <span>•</span>
                        <span><strong>Submitted:</strong> {date}</span>
                        {app.amountPaid && (
                          <>
                            <span>•</span>
                            <span><strong>Fee Paid:</strong> {app.amountPaid}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="account-app-actions-side">
                      <div className="account-app-stage-box">
                        <small>Current Stage</small>
                        <strong>{stage}</strong>
                      </div>
                      <button
                        type="button"
                        className="account-upload-action-btn"
                        onClick={() => openDocumentVault(app)}
                      >
                        <i className="bi bi-cloud-arrow-up-fill me-1" /> Upload Docs
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* DOCUMENT VAULT MODAL */}
      {selectedAppForDocs && (
        <div className="gs-doc-modal-overlay" onClick={() => setSelectedAppForDocs(null)}>
          <div className="gs-doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gs-doc-modal-header">
              <div>
                <span className="gs-doc-badge"><i className="bi bi-shield-lock-fill" /> Encrypted Vault</span>
                <h3>Document Upload &amp; Verification</h3>
                <small>Application: <strong>{selectedAppForDocs.service_name || selectedAppForDocs.title}</strong></small>
              </div>
              <button type="button" className="gs-doc-close-btn" onClick={() => setSelectedAppForDocs(null)}>×</button>
            </div>

            <div className="gs-doc-modal-body">
              <div className="gs-doc-upload-box">
                <div className="gs-doc-select-row">
                  <label>Select Document Type:</label>
                  <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                    <option value="PAN & Identity Proof">PAN &amp; Identity Proof</option>
                    <option value="Aadhaar / Voter ID">Aadhaar Card / Voter ID</option>
                    <option value="Business Registration / Udyam">Business Registration / Udyam</option>
                    <option value="Bank Statement (6 Months)">Bank Statement (Last 6 Months)</option>
                    <option value="Electricity Bill / Office Proof">Electricity Bill / Address Proof</option>
                    <option value="Scheme / DPR Project Sheet">Scheme Project Sheet / DPR</option>
                  </select>
                </div>

                <div className="gs-drop-area">
                  <i className="bi bi-cloud-arrow-up fs-2 text-primary" />
                  <p>Upload self-attested PDF, JPG or PNG (Max 10MB)</p>
                  <label className="gs-file-select-btn">
                    {uploading ? "Uploading..." : "Browse File"}
                    <input type="file" onChange={handleFileUpload} disabled={uploading} accept=".pdf,.png,.jpg,.jpeg" />
                  </label>
                </div>
              </div>

              <div className="gs-uploaded-list-section">
                <h5>Uploaded Documents ({documents.length})</h5>

                {loadingDocs ? (
                  <p className="text-muted small">Loading documents...</p>
                ) : documents.length === 0 ? (
                  <div className="gs-empty-docs">
                    <i className="bi bi-file-earmark-text text-muted fs-3" />
                    <p>No documents uploaded yet. Upload required proofs for faster verification.</p>
                  </div>
                ) : (
                  <div className="gs-docs-grid">
                    {documents.map((doc, dIdx) => (
                      <div key={doc.id || dIdx} className="gs-doc-item">
                        <div className="gs-doc-icon"><i className="bi bi-file-earmark-pdf-fill" /></div>
                        <div className="gs-doc-info">
                          <strong>{doc.file_name}</strong>
                          <small>{doc.document_type} • {new Date(doc.created_at).toLocaleDateString("en-IN")}</small>
                        </div>
                        {doc.file_url ? (
                          <a href={doc.file_url} target="_blank" rel="noreferrer" className="gs-doc-view-link">
                            View <i className="bi bi-box-arrow-up-right" />
                          </a>
                        ) : (
                          <span className="badge bg-success-subtle text-success">Saved</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="gs-doc-modal-footer">
              <button type="button" className="gs-doc-done-btn" onClick={() => setSelectedAppForDocs(null)}>
                Done &amp; Return to Applications
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Interactive Tab Cards */
        .account-tabs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .account-tab-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
        }

        .account-tab-card:hover {
          transform: translateY(-2px);
          border-color: #0284c7;
          box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08);
        }

        .account-tab-card.active {
          border-color: #0284c7;
          background: #f0f9ff;
          box-shadow: 0 0 0 2px #0284c7, 0 6px 18px rgba(2, 132, 199, 0.12);
        }

        .account-tab-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .account-tab-icon.blue { background: #e0f2fe; color: #0284c7; }
        .account-tab-icon.amber { background: #fef3c7; color: #d97706; }
        .account-tab-icon.green { background: #d1fae5; color: #059669; }
        .account-tab-icon.gray { background: #f1f5f9; color: #64748b; }

        .account-tab-content strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .account-tab-content p {
          margin: 2px 0 0;
          font-size: 11px;
          color: #64748b;
        }

        /* Applications List & Cards */
        .account-applications-list { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
        .account-app-item-card {
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;
          gap: 20px; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .account-app-item-card:hover { transform: translateY(-2px); border-color: #0284c7; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.08); }
        .account-app-main-info { display: flex; flex-direction: column; gap: 4px; }
        .account-app-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        
        .account-status-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; }
        .account-status-pill.in-progress { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .account-status-pill.approved { background: #eff6ff; color: #0284c7; border: 1px solid #bfdbfe; }
        .account-status-pill.closed { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }

        .account-pkg-pill { background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
        .account-app-main-info h3 { margin: 0; font-size: 17px; font-weight: 800; color: #0f172a; }
        .account-app-meta-details { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-top: 4px; }
        .account-app-actions-side { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
        .account-app-stage-box { text-align: right; }
        .account-app-stage-box small { display: block; font-size: 10px; font-weight: 750; color: #94a3b8; text-transform: uppercase; }
        .account-app-stage-box strong { display: block; font-size: 13px; color: #0284c7; font-weight: 800; }
        .account-upload-action-btn {
          display: inline-flex; align-items: center; padding: 10px 18px; border-radius: 10px;
          background: #059669; color: #ffffff; border: none; font-size: 13px; font-weight: 800; cursor: pointer;
        }
        .account-upload-action-btn:hover { background: #047857; }

        /* Document Vault Modal */
        .gs-doc-modal-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .gs-doc-modal-card {
          width: min(640px, 100%); background: #ffffff; border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25); overflow: hidden;
        }
        .gs-doc-modal-header {
          padding: 20px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .gs-doc-badge {
          display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px;
          font-weight: 800; color: #0284c7; text-transform: uppercase; margin-bottom: 4px;
        }
        .gs-doc-modal-header h3 { margin: 0; font-size: 18px; font-weight: 850; color: #0f172a; }
        .gs-doc-close-btn { border: none; background: transparent; font-size: 26px; color: #64748b; cursor: pointer; }
        .gs-doc-modal-body { padding: 22px 24px; max-height: 65vh; overflow-y: auto; }
        .gs-doc-upload-box { background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 18px; text-align: center; }
        .gs-doc-select-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .gs-doc-select-row label { font-size: 12px; font-weight: 750; color: #334155; }
        .gs-doc-select-row select { font-size: 12px; padding: 6px 10px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; }
        .gs-drop-area p { margin: 6px 0 12px; font-size: 12px; color: #64748b; }
        .gs-file-select-btn {
          display: inline-block; padding: 8px 18px; background: #0284c7; color: #ffffff;
          border-radius: 8px; font-size: 12.5px; font-weight: 750; cursor: pointer;
        }
        .gs-file-select-btn input { display: none; }
        .gs-uploaded-list-section { margin-top: 22px; }
        .gs-uploaded-list-section h5 { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
        .gs-empty-docs { text-align: center; padding: 20px; color: #94a3b8; font-size: 12.5px; }
        .gs-docs-grid { display: flex; flex-direction: column; gap: 8px; }
        .gs-doc-item {
          display: flex; align-items: center; gap: 12px; padding: 10px 14px;
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;
        }
        .gs-doc-icon { color: #dc2626; font-size: 20px; }
        .gs-doc-info { flex: 1; text-align: left; }
        .gs-doc-info strong { display: block; font-size: 12.5px; color: #0f172a; }
        .gs-doc-info small { font-size: 11px; color: #64748b; }
        .gs-doc-view-link { font-size: 11.5px; font-weight: 750; color: #0284c7; text-decoration: none; }
        .gs-doc-modal-footer { padding: 14px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: right; }
        .gs-doc-done-btn {
          padding: 9px 20px; background: #0284c7; color: #ffffff; border: none;
          border-radius: 8px; font-size: 13px; font-weight: 750; cursor: pointer;
        }

        @media (max-width: 992px) {
          .account-tabs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .account-tabs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function PageLoading({ text }) {
  return (
    <div className="customer-account-loading">
      <div className="customer-account-spinner" />
      <p>{text}</p>
    </div>
  );
}