import React from "react";

// ======================================================
// LOAN PRODUCTS
// ======================================================

const loanTypes = [
  {
    id: "personal",
    title: "Personal Loan",
    icon: "bi-person",
    description:
      "Finance for personal requirements, emergencies and planned expenses.",
    badge: "Individual",
  },

  {
    id: "business",
    title: "Business Loan",
    icon: "bi-briefcase",
    description:
      "Business expansion, machinery, equipment and enterprise requirements.",
    badge: "MSME",
  },

  {
    id: "working-capital",
    title: "Working Capital",
    icon: "bi-cash-stack",
    description:
      "Cash Credit, OD and short-term finance for daily business operations.",
    badge: "Business",
  },

  {
    id: "subsidy",
    title: "Subsidy Linked Loan",
    icon: "bi-bank",
    description:
      "Project finance combined with eligible Government subsidy schemes.",
    badge: "Government",
    featured: true,
  },

  {
    id: "education",
    title: "Education Loan",
    icon: "bi-mortarboard",
    description:
      "Finance for higher education, tuition and eligible education expenses.",
    badge: "Student",
  },

  {
    id: "home",
    title: "Home Loan",
    icon: "bi-house-door",
    description:
      "Finance for purchase, construction or eligible residential property.",
    badge: "Housing",
  },

  {
    id: "mortgage",
    title: "Mortgage / LAP",
    icon: "bi-building-lock",
    description:
      "Loan against eligible residential or commercial property.",
    badge: "Secured",
  },

  {
    id: "vehicle",
    title: "Vehicle Loan",
    icon: "bi-car-front",
    description:
      "Finance for eligible personal and commercial vehicle purchases.",
    badge: "Vehicle",
  },

  {
    id: "project-finance",
    title: "Project Finance",
    icon: "bi-buildings",
    description:
      "Term finance for industrial, manufacturing and infrastructure projects.",
    badge: "Enterprise",
  },

  {
    id: "machinery",
    title: "Machinery Loan",
    icon: "bi-gear",
    description:
      "Finance for machinery, equipment and production-line investment.",
    badge: "MSME",
  },

  {
    id: "solar",
    title: "Solar / Green Finance",
    icon: "bi-sun",
    description:
      "Finance for solar, renewable-energy and energy-efficiency projects.",
    badge: "Green",
  },

  {
    id: "other",
    title: "Other Finance",
    icon: "bi-grid",
    description:
      "Not sure which loan fits? Select this and let GoSubsidy guide you.",
    badge: "AI Assist",
  },
];

// ======================================================
// COMPONENT
// ======================================================

export default function LoanTypeSelector({
  selectedLoan,
  onSelect,
}) {
  return (
    <>
      <div className="loan-type-grid">

        {loanTypes.map((loan) => {

          const isSelected =
            selectedLoan === loan.title;

          return (
            <button
              key={loan.id}
              type="button"
              className={`loan-type-card ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => onSelect(loan.title)}
            >

              {/* FEATURED */}

              {loan.featured && (
                <span className="loan-featured-badge">
                  POPULAR
                </span>
              )}

              {/* CHECK */}

              <div
                className={`loan-selection-check ${
                  isSelected ? "show" : ""
                }`}
              >
                <i className="bi bi-check-lg"></i>
              </div>

              {/* ICON */}

              <div className="loan-type-icon">
                <i className={`bi ${loan.icon}`}></i>
              </div>

              {/* CATEGORY */}

              <span className="loan-category-badge">
                {loan.badge}
              </span>

              {/* TITLE */}

              <h4>
                {loan.title}
              </h4>

              {/* DESCRIPTION */}

              <p>
                {loan.description}
              </p>

              {/* ACTION */}

              <div className="loan-card-action">
                <span>
                  {isSelected
                    ? "Continue to KYC"
                    : "Continue to KYC"}
                </span>

                <i
                  className={
                    isSelected
                      ? "bi bi-check-circle-fill"
                      : "bi bi-arrow-right"
                  }
                ></i>
              </div>

            </button>
          );
        })}

      </div>

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        .loan-type-grid{
          display:grid;
          grid-template-columns:
            repeat(3,minmax(0,1fr));
          gap:14px;
        }

        .loan-type-card{
          position:relative;
          min-height:195px;
          padding:19px;
          text-align:left;

          background:#ffffff;

          border:1px solid #e4eaf1;
          border-radius:17px;

          cursor:pointer;

          transition:
            transform .22s ease,
            border-color .22s ease,
            box-shadow .22s ease,
            background .22s ease;

          overflow:hidden;
        }

        .loan-type-card:hover{
          transform:translateY(-3px);

          border-color:#9bc7ff;

          box-shadow:
            0 12px 28px
            rgba(25,75,135,.10);
        }

        .loan-type-card.selected{
          border:2px solid #0874f5;

          background:
            linear-gradient(
              145deg,
              #f5f9ff,
              #f0fffa
            );

          box-shadow:
            0 10px 28px
            rgba(8,116,245,.13);
        }

        /* ICON */

        .loan-type-icon{
          width:46px;
          height:46px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:13px;

          background:#edf4ff;

          color:#0871ed;

          font-size:20px;

          margin-bottom:13px;

          transition:.2s;
        }

        .loan-type-card:hover
        .loan-type-icon{
          background:#0871ed;
          color:#fff;
        }

        .loan-type-card.selected
        .loan-type-icon{
          background:
            linear-gradient(
              135deg,
              #0875f5,
              #0ba889
            );

          color:white;
        }

        /* CATEGORY */

        .loan-category-badge{
          display:inline-block;

          color:#74849a;

          background:#f3f5f8;

          border-radius:20px;

          padding:3px 8px;

          font-size:8px;
          font-weight:800;
          letter-spacing:.4px;

          margin-bottom:7px;
        }

        /* TITLE */

        .loan-type-card h4{
          color:#172033;

          font-size:14px;
          font-weight:800;

          margin:0 0 6px;
        }

        /* DESCRIPTION */

        .loan-type-card p{
          color:#748297;

          font-size:10px;
          line-height:1.5;

          margin:0 0 14px;
        }

        /* CARD ACTION */

        .loan-card-action{
          position:absolute;

          left:19px;
          right:19px;
          bottom:15px;

          display:flex;
          justify-content:space-between;
          align-items:center;

          color:#0871ed;

          font-size:9px;
          font-weight:800;
        }

        /* SELECTION CHECK */

        .loan-selection-check{
          position:absolute;

          right:13px;
          top:13px;

          width:24px;
          height:24px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:50%;

          background:#dfe6ee;

          color:white;

          opacity:0;

          transform:scale(.7);

          transition:.2s;
        }

        .loan-selection-check.show{
          opacity:1;
          transform:scale(1);

          background:#10b981;
        }

        /* POPULAR */

        .loan-featured-badge{
          position:absolute;

          top:0;
          right:0;

          padding:5px 10px;

          border-radius:
            0 16px 0 10px;

          background:#ffb800;

          color:#202735;

          font-size:7px;
          font-weight:900;
          letter-spacing:.5px;
        }

        /* RESPONSIVE */

        @media(max-width:991px){

          .loan-type-grid{
            grid-template-columns:
              repeat(2,minmax(0,1fr));
          }

        }

        @media(max-width:576px){

          .loan-type-grid{
            grid-template-columns:1fr;
          }

          .loan-type-card{
            min-height:180px;
          }

        }

      `}</style>
    </>
  );
}