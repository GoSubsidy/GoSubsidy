import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="row gy-5">

          {/* Company */}

          <div className="col-lg-4">

            <Link
              to="/"
              className="footer-logo text-decoration-none"
            >
              <i className="bi bi-bank2 me-2"></i>
              GoSubsidy
            </Link>

            <p className="footer-text mt-4">
              GoSubsidy is India's AI-powered platform helping
              entrepreneurs, farmers, startups and MSMEs discover
              government subsidies, grants and loan schemes quickly.
            </p>

            <div className="footer-social">

              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>

              <a href="#">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#">
                <i className="bi bi-youtube"></i>
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div className="col-md-4 col-lg-2">

            <h5>Quick Links</h5>

            <ul className="footer-links">

              <li><Link to="/">Home</Link></li>

              <li><Link to="/dashboard">Dashboard</Link></li>

              <li><Link to="/schemes">Schemes</Link></li>

              <li><Link to="/loans">Loans</Link></li>

              <li><Link to="/contact">Contact</Link></li>

            </ul>

          </div>

          {/* Popular Schemes */}

          <div className="col-md-4 col-lg-3">

            <h5>Popular Schemes</h5>

            <ul className="footer-links">

              <li><Link to="/schemes">PMEGP</Link></li>

              <li><Link to="/schemes">PMFME</Link></li>

              <li><Link to="/schemes">CGTMSE</Link></li>

              <li><Link to="/schemes">Mudra Loan</Link></li>

              <li><Link to="/schemes">Stand-Up India</Link></li>

            </ul>

          </div>

          {/* Contact */}

          <div className="col-md-4 col-lg-3">

            <h5>Contact Us</h5>

            <ul className="footer-contact">

              <li>
                <i className="bi bi-geo-alt-fill"></i>
                Hyderabad, Telangana
              </li>

              <li>
                <i className="bi bi-envelope-fill"></i>
                support@gosubsidy.in
              </li>

              <li>
                <i className="bi bi-telephone-fill"></i>
                +91 XXXXX XXXXX
              </li>

            </ul>

            <h6 className="mt-4 mb-3">
              Subscribe Newsletter
            </h6>

            <div className="input-group">

              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
              />

              <button className="btn btn-warning">

                <i className="bi bi-send-fill"></i>

              </button>

            </div>

          </div>

        </div>

        <hr className="footer-divider" />

        <div className="row align-items-center">

          <div className="col-md-6">

            <p className="copyright mb-0">

              © {new Date().getFullYear()} GoSubsidy.
              All Rights Reserved.

            </p>

          </div>

          <div className="col-md-6 text-md-end">

            <Link to="/privacy" className="footer-bottom-link">
              Privacy
            </Link>

            <Link to="/terms" className="footer-bottom-link">
              Terms
            </Link>

            <Link to="/about" className="footer-bottom-link">
              About
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}