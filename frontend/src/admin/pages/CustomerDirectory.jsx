import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function CustomerDirectory() {
  const { session } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomerDirectory();
  }, [session?.access_token]);

  async function fetchCustomerDirectory() {
    setLoading(true);
    let rawApps = [];

    // 1. Fetch live applications & payments from backend
    try {
      const headers = { Accept: "application/json" };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`${API_BASE_URL}/api/payment/admin/all-applications`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.applications)) {
          rawApps = data.applications;
        }
      }
    } catch (err) {
      console.warn("[CustomerDirectory] Server fetch notice:", err);
    }

    // 2. Scan local storage records
    try {
      const storageKeys = [
        "gosubsidy_applications",
        "gosubsidy_payments",
        "gosubsidy_loan_enquiries",
      ];

      storageKeys.forEach((key) => {
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(list)) {
          list.forEach((item) => {
            const appId = item.application_id || item.orderId || item.razorpay_order_id || item.id;
            if (appId) {
              rawApps.push({
                application_id: appId,
                applicant_name: item.customerName || item.applicant_name || item.name || "Bhanu Prasad",
                applicant_email: item.email || item.applicant_email || item.payment_email || "bbprasad.mba@gmail.com",
                applicant_phone: item.phone || item.mobile || item.payment_contact || "",
                service_name: item.service_name || item.serviceTitle || item.productName || item.title || "Business Service",
                category: item.category || "General Service",
                amount: item.amount || item.totalAmount || 0,
                status: item.status || "In Progress",
                created_at: item.created_at || item.submittedOn || new Date().toISOString(),
              });
            }
          });
        }
      });
    } catch (e) {
      console.error("Local records parse error:", e);
    }

    // 3. Group applications by unique Customer (Email / Phone)
    const customerMap = new Map();

    rawApps.forEach((app) => {
      const email = String(app.applicant_email || app.payment_email || "").trim().toLowerCase();
      const name = app.applicant_name || "Valued Customer";
      const phone = app.applicant_phone || app.payment_contact || "";

      const customerKey = email || phone || `CUST_${app.application_id}`;

      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          customerId: `GS-CUST-${Math.abs(hashString(customerKey)).toString().slice(0, 5)}`,
          name,
          email: email || "No email on record",
          phone: phone || "",
          firstSeen: app.created_at || new Date().toISOString(),
          applications: [],
        });
      }

      const existingCust = customerMap.get(customerKey);
      if (!existingCust.phone && phone) existingCust.phone = phone;
      if (existingCust.name === "Valued Customer" && name !== "Valued Customer") {
        existingCust.name = name;
      }

      // Avoid duplicate applications inside customer record
      const appExists = existingCust.applications.some(
        (a) => a.id === app.application_id || a.id === app.id
      );

      if (!appExists) {
        existingCust.applications.push({
          id: app.application_id || app.id || "APP-001",
          service: app.service_name || app.title || "Service Application",
          category: app.category || "Consultation & Filing",
          amount: Number(app.amount) || 0,
          status: app.status || "In Progress",
          timestamp: app.created_at ? new Date(app.created_at) : new Date(),
        });
      }
    });

    // ==========================================================
    // SORT EACH CUSTOMER'S APPLICATIONS — NEWEST FIRST
    // ==========================================================
    const sortedCustomers = Array.from(customerMap.values()).map((cust) => {
      cust.applications.sort((a, b) => {
        const timeA = a.timestamp instanceof Date
          ? a.timestamp.getTime()
          : new Date(a.timestamp || 0).getTime();

        const timeB = b.timestamp instanceof Date
          ? b.timestamp.getTime()
          : new Date(b.timestamp || 0).getTime();

        return timeB - timeA;
      });

      // Keep the customer's latest registration/application timestamp.
      cust.latestTimestamp =
        cust.applications.length > 0
          ? cust.applications[0].timestamp
          : cust.firstSeen;

      return cust;
    });

    // ==========================================================
    // SORT CUSTOMERS — MOST RECENT REGISTRATION FIRST
    // ==========================================================
    sortedCustomers.sort((a, b) => {
      const timeA = new Date(a.latestTimestamp || a.firstSeen || 0).getTime();
      const timeB = new Date(b.latestTimestamp || b.firstSeen || 0).getTime();

      return timeB - timeA;
    });

    setCustomers(sortedCustomers);
    setLoading(false);
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  // Formatting helpers
  const formatDateTime = (dateObj) => {
    try {
      const d = new Date(dateObj);
      if (isNaN(d.getTime())) return "Recent";
      return `${d.toLocaleDateString("en-IN")} at ${d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } catch {
      return "Recent";
    }
  };

  // ==========================================================
  // DATE DROPDOWN OPTIONS
  // ==========================================================
  const dateOptions = Array.from(
    new Set(
      customers
        .map((cust) => {
          const timestamp = cust.latestTimestamp || cust.firstSeen;
          if (!timestamp) return null;

          const d = new Date(timestamp);
          if (Number.isNaN(d.getTime())) return null;

          return d.toISOString().slice(0, 10);
        })
        .filter(Boolean)
    )
  ).sort((a, b) => new Date(b) - new Date(a));

  const formatDateOption = (value) => {
    const d = new Date(`${value}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredCustomers = customers
    .filter((cust) => {
      const s = searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        cust.name.toLowerCase().includes(s) ||
        cust.email.toLowerCase().includes(s) ||
        cust.phone.includes(s) ||
        cust.customerId.toLowerCase().includes(s);

      const matchesStatus =
        statusFilter === "All" ||
        cust.applications.some(
          (app) =>
            app.status.toLowerCase() === statusFilter.toLowerCase()
        );

      const customerDate = cust.latestTimestamp
        ? new Date(cust.latestTimestamp).toISOString().slice(0, 10)
        : "";

      const matchesDate =
        dateFilter === "All" || customerDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const timeA = new Date(a.latestTimestamp || a.firstSeen || 0).getTime();
      const timeB = new Date(b.latestTimestamp || b.firstSeen || 0).getTime();

      return timeB - timeA;
    });

  return (
    <div className="gs-customer-dir-page">
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-uppercase fw-bold text-primary small">Customer Relationship Portal</span>
          <h2 className="fw-bolder mb-1">Registered Customers</h2>
          <p className="text-muted small mb-0">
            View customer contact records, applied services, and live fulfillment progress.
          </p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-white border text-dark px-3 py-2 fs-6 shadow-sm">
            <i className="bi bi-people-fill text-primary me-2" />
            {customers.length} Registered Customers
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by customer name, email, phone number, or Customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filter registrations by date"
          >
            <option value="All">All Dates</option>

            {dateOptions.map((dateValue) => (
              <option key={dateValue} value={dateValue}>
                {formatDateOption(dateValue)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer List Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm text-primary me-2" />
            Loading registered customers &amp; services...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person-x text-muted fs-1 mb-2 d-block" />
            <h5 className="fw-bold">No registered customers found</h5>
            <p className="text-muted small">New registrations and checkouts will show up here automatically.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr className="small text-muted fw-bold">
                  <th>CUSTOMER ID &amp; PROFILE</th>
                  <th>CONTACT DETAILS</th>
                  <th>TOTAL SERVICES</th>
                  <th>LATEST APPLICATION &amp; DATE</th>
                  <th>OVERALL STATUS</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => {
                  const rawPhone = (c.phone || "").replace(/[^0-9]/g, "");
                  const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                  const latestApp = c.applications[0] || null;
                  const hasPending = c.applications.some((a) => a.status === "In Progress" || a.status === "Pending");

                  return (
                    <tr key={c.customerId}>
                      <td>
                        <span className="badge bg-light text-primary border font-monospace px-2 py-1 mb-1">
                          {c.customerId}
                        </span>
                        <strong className="d-block text-dark fs-6">{c.name}</strong>
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span className="text-muted small">
                            <i className="bi bi-envelope me-1 text-primary" />
                            {c.email}
                          </span>
                          {rawPhone ? (
                            <span className="text-dark small fw-semibold">
                              <i className="bi bi-telephone-fill me-1 text-success" />
                              {rawPhone.length === 10 ? `+91 ${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}` : c.phone}
                            </span>
                          ) : (
                            <span className="text-muted small fst-italic">No phone number</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1 fs-6">
                          {c.applications.length} Opted
                        </span>
                      </td>

                      <td>
                        {latestApp ? (
                          <div>
                            <strong className="d-block text-dark small">{latestApp.service}</strong>
                            <small className="text-muted">
                              <i className="bi bi-clock-history me-1" />
                              {formatDateTime(latestApp.timestamp)}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted small">No applications filed</span>
                        )}
                      </td>

                      <td>
                        {hasPending ? (
                          <span className="badge bg-warning-subtle text-warning-emphasis">
                            ● In Progress ({c.applications.filter((a) => a.status === "In Progress").length})
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success">
                            ● All Completed
                          </span>
                        )}
                      </td>

                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          {rawPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${c.name}, regarding your GoSubsidy services:`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-success"
                              title="WhatsApp Customer"
                            >
                              <i className="bi bi-whatsapp" />
                            </a>
                          )}
                          <a
                            href={`mailto:${c.email}?subject=Regarding your GoSubsidy account (${c.customerId})`}
                            className="btn btn-sm btn-outline-primary"
                            title="Email Customer"
                          >
                            <i className="bi bi-envelope-fill" />
                          </a>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary fw-bold"
                            onClick={() => setSelectedCustomer(c)}
                          >
                            View Services ({c.applications.length})
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Applications Drill-Down Modal */}
      {selectedCustomer && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(15,23,42,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 pt-4 pb-3">
                <div>
                  <span className="badge bg-primary-subtle text-primary font-monospace mb-1">
                    {selectedCustomer.customerId}
                  </span>
                  <h5 className="modal-title fw-bold">{selectedCustomer.name}'s Opted Services</h5>
                  <p className="text-muted small mb-0">
                    Email: {selectedCustomer.email} | Phone: {selectedCustomer.phone || "N/A"}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCustomer(null)}
                />
              </div>

              <div className="modal-body px-4 py-3">
                <div className="table-responsive">
                  <table className="table align-middle table-bordered mb-0">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>APPLICATION ID</th>
                        <th>SERVICE NAME</th>
                        <th>PRICE / VALUE</th>
                        <th>STATUS</th>
                        <th>DATE &amp; TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.applications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <span className="font-monospace small text-primary fw-bold">
                              {app.id}
                            </span>
                          </td>
                          <td>
                            <strong>{app.service}</strong>
                            <small className="text-muted d-block">{app.category}</small>
                          </td>
                          <td className="fw-bold text-success">
                            {app.amount ? `₹${app.amount.toLocaleString("en-IN")}` : "Free / Lead"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                app.status === "Approved"
                                  ? "bg-success-subtle text-success"
                                  : app.status === "Closed"
                                  ? "bg-secondary-subtle text-secondary"
                                  : "bg-warning-subtle text-warning-emphasis"
                              }`}
                            >
                              ● {app.status}
                            </span>
                          </td>
                          <td className="small text-muted">
                            {formatDateTime(app.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer border-top-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-secondary fw-bold"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gs-customer-dir-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 85vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}