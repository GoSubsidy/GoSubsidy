import React from "react";

export default function SecondaryButton({
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

  variant = "outline",
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
          variant === "glass"
            ? "rgba(255,255,255,.15)"
            : "#ffffff",

        color:
          variant === "glass"
            ? "#ffffff"
            : "#0d6efd",

        border:
          variant === "glass"
            ? "1px solid rgba(255,255,255,.35)"
            : "2px solid #0d6efd",

        backdropFilter:
          variant === "glass"
            ? "blur(12px)"
            : "none",

        WebkitBackdropFilter:
          variant === "glass"
            ? "blur(12px)"
            : "none",

        borderRadius: rounded,

        padding: current.padding,

        fontWeight: 600,

        fontSize: current.fontSize,

        width: fullWidth
          ? "100%"
          : "auto",

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "10px",

        transition: "all .30s ease",

        cursor:
          disabled || loading
            ? "not-allowed"
            : "pointer",

        opacity:
          disabled || loading
            ? .70
            : 1,

        boxShadow:
          "0 8px 22px rgba(13,110,253,.08)",

        ...style,

      }}

      onMouseEnter={(e)=>{

        if(disabled || loading) return;

        if(variant==="glass"){

          e.currentTarget.style.background =
            "rgba(255,255,255,.22)";

        }else{

          e.currentTarget.style.background =
            "#0d6efd";

          e.currentTarget.style.color =
            "#ffffff";

        }

        e.currentTarget.style.transform =
          "translateY(-2px)";

      }}

      onMouseLeave={(e)=>{

        if(variant==="glass"){

          e.currentTarget.style.background =
            "rgba(255,255,255,.15)";

          e.currentTarget.style.color =
            "#ffffff";

        }else{

          e.currentTarget.style.background =
            "#ffffff";

          e.currentTarget.style.color =
            "#0d6efd";

        }

        e.currentTarget.style.transform =
          "translateY(0px)";

      }}

    >

      {loading ? (

        <>

          <span className="spinner-border spinner-border-sm"></span>

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