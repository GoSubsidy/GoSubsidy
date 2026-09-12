import React from "react";

export default function GradientButton({
  children,

  icon,

  type = "button",

  onClick,

  disabled = false,

  loading = false,

  fullWidth = false,

  size = "md",

  variant = "primary",

  className = "",

  style = {},
}) {
  const gradients = {
    primary:
      "linear-gradient(135deg,#0d6efd,#20c997)",

    success:
      "linear-gradient(135deg,#198754,#20c997)",

    warning:
      "linear-gradient(135deg,#f59e0b,#f97316)",

    danger:
      "linear-gradient(135deg,#dc3545,#ef4444)",

    purple:
      "linear-gradient(135deg,#6f42c1,#8b5cf6)",

    dark:
      "linear-gradient(135deg,#212529,#495057)",
  };

  const paddings = {
    sm: "8px 18px",
    md: "12px 28px",
    lg: "16px 34px",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={{
        border: "none",

        outline: "none",

        borderRadius: "14px",

        background:
          gradients[variant] ||
          gradients.primary,

        color: "#fff",

        fontWeight: 600,

        fontSize: "15px",

        padding:
          paddings[size] ||
          paddings.md,

        width: fullWidth ? "100%" : "auto",

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "10px",

        cursor:
          disabled || loading
            ? "not-allowed"
            : "pointer",

        opacity:
          disabled || loading
            ? 0.75
            : 1,

        transition: "all .30s ease",

        boxShadow:
          "0 12px 28px rgba(13,110,253,.25)",

        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;

        e.currentTarget.style.transform =
          "translateY(-3px)";

        e.currentTarget.style.boxShadow =
          "0 18px 36px rgba(13,110,253,.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 12px 28px rgba(13,110,253,.25)";
      }}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
          ></span>

          Loading...
        </>
      ) : (
        <>
          {icon && (
            <i
              className={`bi ${icon}`}
            ></i>
          )}

          {children}
        </>
      )}
    </button>
  );
}