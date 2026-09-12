import React, { useState } from "react";
import ScoreGauge from "./ScoreGauge";

export default function CreditDashboard() {
  const score = 742;

  const gaugeOffset = 440 - (score / 900) * 440;

  return (
    <div className="container-fluid py-4">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header glass-card text-white p-4 mb-4">

        <div className="row align-items-center">

          <div className="col-lg-8">

            <span className="badge bg-success mb-3">
              Credit Report
            </span>

            <h2 className="fw-bold">
              Good Afternoon 👋
            </h2>

            <p className="opacity-75 mb-0">
              Here's your latest AI powered credit report with
              personalized insights.
            </p>

          </div>

          <div className="col-lg-4 text-center">

             <ScoreGauge score={742} />

          </div>

        </div>

      </div>

      {/* ================= KPI ================= */}

      <div className="row g-4 mb-4">

        {[
          {
            title: "Approval Chance",
            value: "92%",
            icon: "bi-check-circle-fill",
            color: "success"
          },
          {
            title: "Credit Utilization",
            value: "28%",
            icon: "bi-pie-chart-fill",
            color: "warning"
          },
          {
            title: "Payment History",
            value: "100%",
            icon: "bi-wallet2",
            color: "primary"
          },
          {
            title: "Risk Level",
            value: "Low",
            icon: "bi-shield-check",
            color: "info"
          }

        ].map((item, i) => (

          <div className="col-lg-3 col-md-6" key={i}>

            <div className="glass-card dashboard-card h-100">

              <div className="d-flex justify-content-between">

                <div>

                  <small className="text-muted">
                    {item.title}
                  </small>

                  <h3 className="fw-bold mt-2">
                    {item.value}
                  </h3>

                </div>

                <div className={`icon-circle bg-${item.color}`}>

                  <i className={`bi ${item.icon}`}></i>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ================= BODY ================= */}

      <div className="row g-4">

        {/* LEFT */}

        <div className="col-lg-8">

          {/* HEALTH */}

          <div className="glass-card dashboard-card mb-4">

            <h5 className="fw-bold mb-4">
              Credit Health
            </h5>

            {[
              ["Payment History",95],
              ["Credit Mix",80],
              ["Age of Credit",72],
              ["Utilization",60]

            ].map((x,i)=>(

              <div className="mb-4" key={i}>

                <div className="d-flex justify-content-between">

                  <span>{x[0]}</span>

                  <strong>{x[1]}%</strong>

                </div>

                <div className="progress mt-2">

                  <div
                    className="progress-bar bg-primary"
                    style={{width:`${x[1]}%`}}
                  ></div>

                </div>

              </div>

            ))}

          </div>

          {/* LOAN */}

          <div className="glass-card dashboard-card mb-4">

            <h5 className="fw-bold mb-3">
              Loan Eligibility
            </h5>

            <div className="row text-center">

              <div className="col-md-4">

                <h2 className="text-success fw-bold">
                  ₹18L
                </h2>

                <small>Personal Loan</small>

              </div>

              <div className="col-md-4">

                <h2 className="text-primary fw-bold">
                  ₹42L
                </h2>

                <small>Home Loan</small>

              </div>

              <div className="col-md-4">

                <h2 className="text-warning fw-bold">
                  ₹9L
                </h2>

                <small>Vehicle Loan</small>

              </div>

            </div>

          </div>

          {/* ACCOUNTS */}

          <div className="glass-card dashboard-card">

            <h5 className="fw-bold mb-4">
              Credit Accounts
            </h5>

            <table className="table">

              <thead>

                <tr>

                  <th>Bank</th>

                  <th>Type</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>HDFC</td>

                  <td>Credit Card</td>

                  <td className="text-success">
                    Active
                  </td>

                </tr>

                <tr>

                  <td>SBI</td>

                  <td>Home Loan</td>

                  <td className="text-success">
                   Current
                  </td>

                </tr>

                <tr>

                  <td>ICICI</td>

                  <td>Personal Loan</td>

                  <td className="text-warning">
                   Closed
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* RIGHT */}

        <div className="col-lg-4">

          {/* AI */}

          <div className="glass-card dashboard-card mb-4">

            <h5 className="fw-bold">
              🤖 AI Credit Advisor
            </h5>

            <p className="text-muted mt-3">

              You're very close to Excellent Score.

              Reduce credit utilization below 20%
              and avoid multiple loan enquiries
              for the next 60 days.

            </p>

          </div>

          {/* ENQUIRIES */}

          <div className="glass-card dashboard-card mb-4">

            <h5 className="fw-bold mb-3">
              Recent Enquiries
            </h5>

            <ul className="list-group">

              <li className="list-group-item">
                HDFC Bank
              </li>

              <li className="list-group-item">
                Axis Bank
              </li>

              <li className="list-group-item">
                SBI Cards
              </li>

            </ul>

          </div>

          {/* ROADMAP */}

          <div className="glass-card dashboard-card mb-4">

            <h5 className="fw-bold">
              Improve Score
            </h5>

            <div className="timeline mt-4">

              <p>✔ Pay bills before due date</p>

              <p>✔ Reduce card utilization</p>

              <p>✔ Avoid multiple enquiries</p>

              <p>✔ Maintain old accounts</p>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="glass-card dashboard-card">

            <button className="btn btn-primary w-100 mb-3">

              <i className="bi bi-download me-2"></i>

              Download Report

            </button>

            <button className="btn btn-outline-primary w-100">

              <i className="bi bi-share me-2"></i>

              Share Report

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}