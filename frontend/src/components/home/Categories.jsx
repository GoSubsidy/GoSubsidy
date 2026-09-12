import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Agriculture",
    icon: "bi-tree-fill",
    color: "#16a34a",
    schemes: "450+ Schemes",
    path: "/schemes",
  },
  {
    title: "MSME",
    icon: "bi-building",
    color: "#2563eb",
    schemes: "700+ Schemes",
    path: "/schemes",
  },
  {
    title: "Food Processing",
    icon: "bi-basket2-fill",
    color: "#f59e0b",
    schemes: "280+ Schemes",
    path: "/schemes",
  },
  {
    title: "Poultry & Dairy",
    icon: "bi-egg-fried",
    color: "#dc2626",
    schemes: "320+ Schemes",
    path: "/schemes",
  },
  {
    title: "Women Entrepreneurs",
    icon: "bi-person-heart",
    color: "#ec4899",
    schemes: "210+ Schemes",
    path: "/schemes",
  },
  {
    title: "Solar & Green Energy",
    icon: "bi-sun-fill",
    color: "#eab308",
    schemes: "180+ Schemes",
    path: "/schemes",
  },
  {
    title: "Manufacturing",
    icon: "bi-gear-fill",
    color: "#7c3aed",
    schemes: "390+ Schemes",
    path: "/schemes",
  },
  {
    title: "Startups",
    icon: "bi-rocket-takeoff-fill",
    color: "#0ea5e9",
    schemes: "150+ Schemes",
    path: "/schemes",
  },
];

export default function Categories() {
  return (
    <section className="section bg-white">

      <div className="container">

        <div className="text-center mb-5">

          <span className="badge bg-success px-3 py-2 mb-3">
            Explore Categories
          </span>

          <h2 className="section-title">
            Find Subsidies by Business Category
          </h2>

          <p className="section-subtitle">
            Choose your business sector and instantly discover Central and
            State Government subsidy schemes, loans and incentives.
          </p>

        </div>

        <div className="row g-4">

          {categories.map((item, index) => (

            <div className="col-md-6 col-lg-3" key={index}>

              <Link
                to={item.path}
                className="text-decoration-none"
              >

                <div className="category-card h-100">

                  <div
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "24px",
                      background: item.color,
                      color: "#fff",
                      fontSize: "38px",
                      boxShadow: "0 15px 30px rgba(0,0,0,.15)",
                    }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>

                  <h5 className="fw-bold text-dark">
                    {item.title}
                  </h5>

                  <p className="text-muted mb-3">
                    {item.schemes}
                  </p>

                  <span className="btn btn-outline-primary rounded-pill">
                    Explore
                  </span>

                </div>

              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}