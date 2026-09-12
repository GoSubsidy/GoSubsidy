import React from "react";

export default function ScoreGauge({
  score = 742,
  maxScore = 900,
  size = 220,
  strokeWidth = 14,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = score / maxScore;
  const offset = circumference - progress * circumference;

  const getStatus = () => {
    if (score >= 800) return "Excellent";
    if (score >= 750) return "Very Good";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  const getColor = () => {
    if (score >= 800) return "#10b981";
    if (score >= 750) return "#3b82f6";
    if (score >= 700) return "#6366f1";
    if (score >= 650) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="score-gauge text-center">

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#glow)"
          style={{
            transition: "stroke-dashoffset 1.5s ease",
          }}
        />

        {/* Center Score */}
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontSize="42"
          fontWeight="700"
          fill="#ffffff"
        >
          {score}
        </text>

        <text
          x="50%"
          y="61%"
          textAnchor="middle"
          fontSize="15"
          fill="#d1d5db"
        >
          / {maxScore}
        </text>
      </svg>

      <div className="mt-3">

        <h5
          className="fw-bold mb-1"
          style={{ color: getColor() }}
        >
          {getStatus()}
        </h5>

        <small className="text-light opacity-75">
          CIBIL Credit Score
        </small>

      </div>
    </div>
  );
}