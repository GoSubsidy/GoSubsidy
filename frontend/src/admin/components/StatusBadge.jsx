import React from "react";

export default function StatusBadge({ status }) {
  const getBadgeClass = () => {
    switch ((status || "").toLowerCase()) {
      case "active":
      case "published":
        return "bg-success";

      case "draft":
        return "bg-warning text-dark";

      case "inactive":
        return "bg-secondary";

      case "pending":
        return "bg-info text-dark";

      case "rejected":
        return "bg-danger";

      case "expired":
        return "bg-dark";

      default:
        return "bg-light text-dark border";
    }
  };

  return (
    <span
      className={`badge rounded-pill px-3 py-2 fw-semibold ${getBadgeClass()}`}
    >
      {status || "Unknown"}
    </span>
  );
}