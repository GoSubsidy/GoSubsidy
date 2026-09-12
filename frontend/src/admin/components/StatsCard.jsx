import React from "react";

export default function StatsCard({
  title,
  value,
  icon,
  color = "primary",
}) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="stats-card">

        <div className={`stats-icon bg-${color}`}>
          {icon}
        </div>

        <div>
          <small>{title}</small>
          <h3>{value}</h3>
        </div>

      </div>
    </div>
  );
}