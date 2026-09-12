import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000";

export default function CustomerPayments() {
  const navigate = useNavigate();
  const { user, session, loading } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    if (!session?.access_token) return;

    setLoadingPayments(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payment/history`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Unable to load payment history."
        );
      }

      setPayments(
        Array.isArray(data.payments)
          ? data.payments
          : []
      );
    } catch (err) {
      console.error(
        "[CustomerPayments] Load error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your payment history."
      );
    } finally {
      setLoadingPayments(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!loading && user && session?.access_token) {
      loadPayments();
    }
  }, [
    loading,
    user,
    session?.access_token,
    navigate,
    loadPayments,
  ]);

  const totalPaid = useMemo(
    () =>
      payments.reduce(
        (sum, payment) =>
          sum +
          Number(payment.amount || 0),
        0
      ),
    [payments]
  );

  if (loading) {
    return (
      <PageLoading text="Loading your payments..." />
    );
  }

  if (!user) return null;

  return (
    <main className="customer-account-page">
      <div className="customer-account-shell">
        <button
          className="account-back"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        >
          <i className="bi bi-arrow-left" /> Back to
          Dashboard
        </button>

        <section className="account-hero-card payment-hero">
          <div>
            <span className="account-eyebrow">
              GOSUBSIDY SECURE PAYMENTS
            </span>

            <h1>My Payments</h1>

            <p>
              View your GoSubsidy premium purchases,
              payment status and Razorpay transaction
              details.
            </p>
          </div>

          <div className="account-hero-icon">
            <i className="bi bi-credit-card-2-front" />
          </div>
        </section>

        <section className="account-content-card">
          <div className="account-section-head">
            <div>
              <span>PAYMENT HISTORY</span>
              <h2>Your Transactions</h2>
            </div>

            <span className="secure-pill">
              <i className="bi bi-shield-check" />
              Razorpay secured
            </span>
          </div>

          {loadingPayments ? (
            <div className="empty-account-state">
              <div className="customer-account-spinner" />
              <h3>Loading payment history...</h3>
              <p>
                Fetching your verified GoSubsidy
                transactions.
              </p>
            </div>
          ) : error ? (
            <div className="empty-account-state">
              <div className="empty-account-icon payment-icon">
                <i className="bi bi-exclamation-triangle" />
              </div>

              <h3>Unable to load payments</h3>

              <p>{error}</p>

              <button
                type="button"
                className="account-primary-btn"
                onClick={loadPayments}
              >
                Try Again
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="empty-account-state">
              <div className="empty-account-icon payment-icon">
                <i className="bi bi-receipt" />
              </div>

              <h3>No payment history yet</h3>

              <p>
                Your verified Razorpay transactions
                will automatically appear here after
                a successful GoSubsidy payment.
              </p>

              <Link
                to="/dpr"
                className="account-primary-btn"
              >
                Explore Premium Services
              </Link>
            </div>
          ) : (
            <>
              <div className="payment-summary-grid">
                <div className="payment-summary-card">
                  <span>Total Transactions</span>
                  <strong>{payments.length}</strong>
                </div>

                <div className="payment-summary-card">
                  <span>Total Paid</span>
                  <strong>
                    ₹
                    {totalPaid.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="payment-summary-card">
                  <span>Account</span>
                  <strong>
                    {user.email || "Verified customer"}
                  </strong>
                </div>
              </div>

              <div className="payment-history-list">
                {payments.map((payment) => (
                  <article
                    className="payment-history-card"
                    key={
                      payment.id ||
                      payment.razorpay_payment_id
                    }
                  >
                    <div className="payment-history-main">
                      <div className="payment-product-icon">
                        <i className="bi bi-patch-check-fill" />
                      </div>

                      <div>
                        <div className="payment-product-name">
                          {payment.product_name ||
                            payment.product_code}
                        </div>

                        <div className="payment-product-code">
                          {payment.product_code}
                        </div>

                        <div className="payment-date">
                          <i className="bi bi-calendar3" />
                          {formatDate(
                            payment.captured_at ||
                              payment.created_at
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="payment-history-amount">
                      <strong>
                        ₹
                        {Number(
                          payment.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <span className="payment-status">
                        <i className="bi bi-check-circle-fill" />
                        {payment.status ===
                        "captured"
                          ? "Paid"
                          : payment.status}
                      </span>
                    </div>

                    <div className="payment-history-details">
                      <Detail
                        label="Payment ID"
                        value={
                          payment.razorpay_payment_id
                        }
                      />

                      <Detail
                        label="Order ID"
                        value={
                          payment.razorpay_order_id
                        }
                      />

                      <Detail
                        label="Method"
                        value={
                          formatPaymentMethod(
                            payment.payment_method
                          )
                        }
                      />

                      <Detail
                        label="Currency"
                        value={
                          payment.currency || "INR"
                        }
                      />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="account-notice">
          <i className="bi bi-info-circle" />

          <div>
            <strong>Payment security</strong>

            <p>
              Razorpay payment signatures are verified
              on the GoSubsidy backend before the
              transaction is saved. Customer payment
              history is linked to the authenticated
              GoSubsidy account.
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .payment-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin: 22px 0;
        }

        .payment-summary-card {
          padding: 18px;
          border: 1px solid #e1eaf4;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            #f8fbff,
            #ffffff
          );
        }

        .payment-summary-card span {
          display: block;
          color: #718096;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .payment-summary-card strong {
          display: block;
          color: #08264c;
          font-size: 20px;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .payment-history-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .payment-history-card {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) auto;
          gap: 18px;
          padding: 20px;
          border: 1px solid #e1eaf4;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(8,38,76,.05);
        }

        .payment-history-main {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          min-width: 0;
        }

        .payment-product-icon {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #fff;
          background: linear-gradient(
            135deg,
            #08264c,
            #1769ff
          );
          font-size: 20px;
        }

        .payment-product-name {
          color: #08264c;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.35;
        }

        .payment-product-code {
          margin-top: 4px;
          color: #1769ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .04em;
        }

        .payment-date {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          color: #718096;
          font-size: 11px;
        }

        .payment-history-amount {
          text-align: right;
        }

        .payment-history-amount strong {
          display: block;
          color: #08264c;
          font-size: 22px;
          font-weight: 900;
        }

        .payment-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 7px;
          padding: 5px 9px;
          border-radius: 999px;
          background: #edf9f4;
          color: #147653;
          font-size: 10px;
          font-weight: 800;
        }

        .payment-history-details {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid #edf1f5;
        }

        .payment-detail {
          min-width: 0;
        }

        .payment-detail span {
          display: block;
          color: #8a99aa;
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .payment-detail strong {
          display: block;
          color: #334155;
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 760px) {
          .payment-summary-grid {
            grid-template-columns: 1fr;
          }

          .payment-history-card {
            grid-template-columns: 1fr;
          }

          .payment-history-amount {
            text-align: left;
          }

          .payment-history-details {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="payment-detail">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function formatPaymentMethod(method) {
  if (!method) return "Razorpay";

  const normalized = String(method)
    .toLowerCase()
    .replace(/_/g, " ");

  if (normalized === "netbanking") {
    return "Net Banking";
  }

  if (normalized === "upi") {
    return "UPI";
  }

  if (normalized === "card") {
    return "Card";
  }

  return normalized
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(value) {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PageLoading({ text }) {
  return (
    <div className="customer-account-loading">
      <div className="customer-account-spinner" />
      <p>{text}</p>
    </div>
  );
}
