import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function UserDocuments() {
  const { session } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadAllDocuments();
  }, [session?.access_token]);

  async function loadAllDocuments() {
    setLoading(true);
    let combinedDocs = [];

    // 1. Fetch from Database
    try {
      const headers = { Accept: "application/json" };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/documents/admin/all`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.documents) && data.documents.length > 0) {
          combinedDocs = data.documents;
        }
      }
    } catch (err) {
      console.warn("[UserDocuments] Server fetch notice:", err);
    }

    // 2. Scan LocalStorage
    try {
      const localFound = [];
      const cachedApps = JSON.parse(localStorage.getItem("gosubsidy_applications") || "[]");

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("docs_") || key === "gosubsidy_all_documents")) {
          const parsed = JSON.parse(localStorage.getItem(key) || "[]");
          const appId = key.replace("docs_", "");
          if (Array.isArray(parsed)) {
            parsed.forEach((d) => {
              const currentApp = cachedApps.find((a) => (a.application_id || a.orderId || a.id) === appId);
              localFound.push({
                ...d,
                application_id: d.application_id || appId || "order_TX86XzAusLBQvw",
                app_status: currentApp?.status || "In Progress",
              });
            });
          }
        }
      }

      localFound.forEach((ld) => {
        const exists = combinedDocs.some(
          (cd) => cd.file_name === ld.file_name && cd.application_id === ld.application_id
        );
        if (!exists) {
          combinedDocs.push(ld);
        }
      });
    } catch (e) {
      console.error("Local doc scan error:", e);
    }

    setDocuments(combinedDocs);
    setLoading(false);
  }

  // Update Status to Approved, Closed, or Pending
  const handleUpdateStatus = async (appId, newStatus) => {
    if (!appId) return;
    setUpdatingId(appId);

    try {
      // 1. Backend update
      if (session?.access_token) {
        await fetch(`${API_BASE_URL}/api/payment/applications/${encodeURIComponent(appId)}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            stage: newStatus === "Approved" ? "Sanction Letter Issued" : newStatus === "Closed" ? "Completed / Archived" : "Document Verification",
          }),
        });
      }

      // 2. Client-side local cache update
      const apps = JSON.parse(localStorage.getItem("gosubsidy_applications") || "[]");
      const updatedApps = apps.map((a) => {
        if ((a.application_id || a.orderId || a.id) === appId) {
          return {
            ...a,
            status: newStatus,
            stage: newStatus === "Approved" ? "Sanction Letter Issued" : newStatus === "Closed" ? "Completed / Archived" : "Document Verification",
          };
        }
        return a;
      });
      localStorage.setItem("gosubsidy_applications", JSON.stringify(updatedApps));

      // 3. Update local documents view state
      setDocuments((prev) =>
        prev.map((d) =>
          d.application_id === appId ? { ...d, app_status: newStatus } : d
        )
      );

      alert(`Application ${appId} marked as ${newStatus}!`);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (doc.file_name && doc.file_name.toLowerCase().includes(s)) ||
      (doc.application_id && doc.application_id.toLowerCase().includes(s)) ||
      (doc.document_type && doc.document_type.toLowerCase().includes(s));

    const matchesFilter =
      filterType === "All" || (doc.document_type && doc.document_type === filterType);

    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  };

  return (
    <div className="gs-admin-docs-container">
      <div className="gs-admin-header-row">
        <div>
          <span className="gs-admin-kicker">STORAGE &amp; VERIFICATION VAULT</span>
          <h2>User Uploaded Documents</h2>
          <p>Review customer KYC proofs, scheme DPR project files, and verify or close applications.</p>
        </div>
        <div className="gs-admin-header-stats">
          <span className="gs-stat-badge">
            <i className="bi bi-folder-fill text-primary me-2" />
            {documents.length} Total Files
          </span>
        </div>
      </div>

      <div className="gs-admin-filter-bar">
        <div className="gs-admin-search-box">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Search by file name, application ID (e.g. order_TX86...), or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="gs-admin-filter-dropdown">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="PAN & Identity Proof">PAN &amp; Identity Proof</option>
            <option value="Aadhaar / Voter ID">Aadhaar / Voter ID</option>
            <option value="Business Registration / Udyam">Business Registration / Udyam</option>
            <option value="Bank Statement (6 Months)">Bank Statement</option>
            <option value="Electricity Bill / Office Proof">Address Proof</option>
            <option value="Scheme / DPR Project Sheet">Scheme / DPR Project Sheet</option>
          </select>
        </div>
      </div>

      <div className="gs-admin-table-card">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary spinner-border-sm me-2" />
            Loading uploaded files from storage...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="gs-admin-empty-docs">
            <i className="bi bi-folder2-open text-muted fs-1" />
            <h4>No uploaded documents found</h4>
            <p>Documents uploaded by applicants via their dashboard will appear here.</p>
          </div>
        ) : (
          <table className="gs-admin-files-table">
            <thead>
              <tr>
                <th>FILE NAME</th>
                <th>APPLICATION ID</th>
                <th>DOCUMENT TYPE</th>
                <th>SIZE</th>
                <th>DATE</th>
                <th>APPLICATION STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => {
                const currentStatus = doc.app_status || "In Progress";
                const isUpdating = updatingId === doc.application_id;

                return (
                  <tr key={doc.id || idx}>
                    <td className="gs-file-name-cell">
                      <i className="bi bi-file-earmark-pdf-fill text-danger me-2 fs-5" />
                      <div>
                        <strong>{doc.file_name}</strong>
                        <small>{doc.mime_type || "document/pdf"}</small>
                      </div>
                    </td>
                    <td>
                      <span className="gs-app-id-pill">
                        {doc.application_id || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="gs-doc-category-tag">
                        {doc.document_type || "General Document"}
                      </span>
                    </td>
                    <td>{formatFileSize(doc.file_size)}</td>
                    <td>
                      {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString("en-IN")
                        : new Date().toLocaleDateString("en-IN")}
                    </td>

                    {/* Status Dropdown Selector */}
                    <td>
                      <select
                        className={`form-select form-select-sm fw-bold ${
                          currentStatus === "Approved"
                            ? "border-success text-success bg-success-subtle"
                            : currentStatus === "Closed"
                            ? "border-secondary text-secondary bg-light"
                            : "border-warning text-warning-emphasis bg-warning-subtle"
                        }`}
                        style={{ width: "135px" }}
                        value={currentStatus}
                        disabled={isUpdating}
                        onChange={(e) => handleUpdateStatus(doc.application_id, e.target.value)}
                      >
                        <option value="In Progress">● In Progress</option>
                        <option value="Approved">● Approved</option>
                        <option value="Closed">● Closed</option>
                      </select>
                    </td>

                    {/* View / Download Button */}
                    <td>
                      {doc.file_url ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary fw-bold"
                        >
                          <i className="bi bi-eye-fill me-1" /> View / Download
                        </a>
                      ) : (
                        <span className="badge bg-light text-secondary border">Local Proof</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .gs-admin-docs-container {
          padding: 24px;
          background: #f8fafc;
          min-height: 85vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .gs-admin-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .gs-admin-kicker {
          font-size: 11px;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .gs-admin-header-row h2 {
          margin: 4px 0 2px;
          font-size: 24px;
          font-weight: 850;
          color: #0f172a;
        }

        .gs-admin-header-row p {
          color: #64748b;
          font-size: 13.5px;
          margin: 0;
        }

        .gs-stat-badge {
          background: #ffffff;
          padding: 8px 16px;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .gs-admin-filter-bar {
          display: flex;
          gap: 14px;
          margin-bottom: 20px;
        }

        .gs-admin-search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0 14px;
          height: 42px;
        }

        .gs-admin-search-box i {
          color: #94a3b8;
        }

        .gs-admin-search-box input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 13px;
        }

        .gs-admin-filter-dropdown select {
          height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 13px;
          color: #334155;
          outline: none;
        }

        .gs-admin-table-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
        }

        .gs-admin-files-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .gs-admin-files-table th {
          background: #f8fafc;
          padding: 14px 18px;
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .gs-admin-files-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
          color: #1e293b;
          vertical-align: middle;
        }

        .gs-file-name-cell {
          display: flex;
          align-items: center;
        }

        .gs-file-name-cell strong {
          display: block;
          font-size: 13.5px;
          color: #0f172a;
        }

        .gs-file-name-cell small {
          color: #64748b;
          font-size: 11px;
        }

        .gs-app-id-pill {
          background: #eff6ff;
          color: #0284c7;
          border: 1px solid #bfdbfe;
          padding: 3px 8px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 11.5px;
          font-weight: 700;
        }

        .gs-doc-category-tag {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #475569;
        }

        .gs-admin-empty-docs {
          text-align: center;
          padding: 50px 20px;
        }

        .gs-admin-empty-docs h4 {
          margin: 10px 0 4px;
          color: #0f172a;
          font-weight: 850;
        }

        .gs-admin-empty-docs p {
          color: #64748b;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}