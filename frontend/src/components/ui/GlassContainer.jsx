import React from "react";

export default function GlassContainer({
  children,
  className = "",
  padding = "2rem",
  rounded = "32px",
  blur = 22,
  shadow = true,
  border = true,
  background = "rgba(255,255,255,0.82)",
  style = {},
}) {
  return (
    <div
      className={`glass-container ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",

        borderRadius: rounded,

        background,

        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,

        border: border
          ? "1px solid rgba(255,255,255,.45)"
          : "none",

        boxShadow: shadow
          ? "0 20px 60px rgba(15,23,42,.12)"
          : "none",

        transition: "all .35s ease",

        ...style,
      }}
    >
      {/* Top Glow */}

      <div
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(13,110,253,.12),transparent)",

          top: -120,
          left: -120,

          pointerEvents: "none",
        }}
      />

      {/* Bottom Glow */}

      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(25,135,84,.10),transparent)",

          bottom: -100,
          right: -100,

          pointerEvents: "none",
        }}
      />

      {/* Content */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding,
        }}
      >
        {children}
      </div>
    </div>
  );
}