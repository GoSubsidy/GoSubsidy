import React from "react";

export default function PrimaryButton({
  children,

  type = "button",

  icon,

  onClick,

  disabled = false,

  loading = false,

  fullWidth = false,

  size = "md",

  className = "",

  style = {},

  rounded = "14px",
}) {
  const sizes = {
    sm: {
      padding: "8px 18px",
      fontSize: "14px",
    },

    md: {
      padding: "12px 28px",
      fontSize: "15px",
    },

    lg: {
      padding: "16px 34px",
      fontSize: "17px",
    },
  };

  const current =
    sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${className}`}
      style={{
        background:
          "linear-gradient(135deg,#0d6efd,#2563eb)",

        border: "none",

        color: "#fff",

        borderRadius: rounded,

        padding: current.padding,

        fontWeight: 600,

        fontSize: current.fontSize,

        width: fullWidth ? "100%" : "auto",

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "10px",

        boxShadow:
          "0 12px 30px rgba(13,110,253,.28)",

        transition: "all .30s ease",

        cursor:
          disabled || loading
            ? "not-allowed"
            : "pointer",

        opacity:
          disabled || loading
            ? .75
            : 1,

        ...style,
      }}
      onMouseEnter={(e) => {

        if (disabled || loading) return;

        e.currentTarget.style.transform =
          "translateY(-3px)";

        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(13,110,253,.38)";
      }}
      onMouseLeave={(e) => {

        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(13,110,253,.28)";
      }}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
          ></span>

          Loading...
        </>
      ) : (
        <>
          {icon && (
            <i className={`bi ${icon}`}></i>
          )}

          {children}
        </>
      )}
    </button>
  );
}