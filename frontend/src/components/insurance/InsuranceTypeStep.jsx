import React from "react";

export default function InsuranceTypeStep({
  insuranceTypes = [],
  selectedType = "",
  error = "",
  onSelect,
}) {
  return (
    <div className="gsi-type-step">

      <div className="gsi-heading">
        <span>STEP 1 OF 4</span>

        <h2>Select Insurance Product</h2>

        <p>
          Choose the insurance category for which you
          would like to compare quotes.
        </p>
      </div>

      <div className="row g-3">

        {insuranceTypes.map((item) => {

          const selected =
            selectedType === item.value;

          return (

            <div
              key={item.value}
              className="col-xl-6 col-lg-6 col-md-6"
            >

              <button
                type="button"
                className={`gsi-type-card ${
                  selected ? "active" : ""
                }`}
                onClick={() =>
                  onSelect?.(item.value)
                }
              >

                <div className="gsi-icon">

                  <i
                    className={`bi ${item.icon}`}
                  ></i>

                </div>

                <div className="gsi-content">

                  <h5>{item.label}</h5>

                  <p>
                    {item.description}
                  </p>

                </div>

                <div className="gsi-check">

                  {selected ? (
                    <i className="bi bi-check-circle-fill"></i>
                  ) : (
                    <i className="bi bi-circle"></i>
                  )}

                </div>

              </button>

            </div>

          );

        })}

      </div>

      {error && (

        <div className="alert alert-danger mt-3 mb-0">

          <i className="bi bi-exclamation-circle me-2"></i>

          {error}

        </div>

      )}

      <style>{`

.gsi-heading{
margin-bottom:30px;
}

.gsi-heading span{
font-size:11px;
font-weight:800;
letter-spacing:1px;
color:#0d6efd;
}

.gsi-heading h2{
margin-top:8px;
font-size:30px;
font-weight:800;
color:#062b57;
}

.gsi-heading p{
margin-top:8px;
color:#6c757d;
}

.gsi-type-card{

width:100%;
height:100%;

display:flex;
align-items:center;

padding:18px;

border-radius:18px;

border:2px solid #e9eef5;

background:#fff;

transition:.25s;

cursor:pointer;

text-align:left;

}

.gsi-type-card:hover{

transform:translateY(-4px);

border-color:#0d6efd;

box-shadow:
0 12px 30px rgba(13,110,253,.12);

}

.gsi-type-card.active{

border-color:#0d6efd;

background:
linear-gradient(
135deg,
#eef6ff,
#ffffff
);

box-shadow:
0 0 0 4px rgba(13,110,253,.08);

}

.gsi-icon{

width:60px;
height:60px;

border-radius:15px;

display:flex;
align-items:center;
justify-content:center;

background:#eef6ff;

margin-right:16px;

}

.gsi-type-card.active .gsi-icon{

background:
linear-gradient(
135deg,
#0d6efd,
#00b894
);

color:#fff;

}

.gsi-icon i{

font-size:26px;

}

.gsi-content{

flex:1;

}

.gsi-content h5{

margin:0;

font-size:18px;

font-weight:700;

}

.gsi-content p{

margin:6px 0 0;

font-size:13px;

color:#6c757d;

}

.gsi-check{

font-size:24px;

color:#0d6efd;

}

@media(max-width:768px){

.gsi-type-card{

padding:15px;

}

.gsi-icon{

width:50px;
height:50px;

margin-right:12px;

}

.gsi-content h5{

font-size:16px;

}

}

      `}</style>

    </div>
  );
}