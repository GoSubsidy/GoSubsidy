import React from "react";
import "./DownloadApp.css";

const APK_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1FifCe5WMiT-s9KymA5HOE-zizU1SoanV";

export default function DownloadApp() {
  const handleDownload = () => {
    window.open(APK_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="gs-download-page">
      <section className="gs-download-hero">
        <div className="gs-download-container">

          <div className="gs-download-icon">
            <img
              src="/images/gosubsidy-logo.png"
              alt="GoSubsidy"
            />
          </div>

          <div className="gs-download-badge">
            <i className="bi bi-android2" />
            Android App
          </div>

          <h1>
            Go<span>Subsidy</span>
          </h1>

          <h2>
            Government Schemes, Loans &amp; Business Services
            <br />
            <strong>All in One App</strong>
          </h2>

          <p className="gs-download-description">
            Discover government subsidies, business loans, insurance,
            CIBIL services, Detailed Project Reports and more from
            your mobile.
          </p>

          <button
            type="button"
            className="gs-download-button"
            onClick={handleDownload}
          >
            <i className="bi bi-download" />
            Download Android App
          </button>

          <div className="gs-download-meta">
            <span>
              <i className="bi bi-phone" />
              Android
            </span>

            <span>
              <i className="bi bi-shield-check" />
              Secure
            </span>

            <span>
              <i className="bi bi-lightning-charge" />
              Fast
            </span>
          </div>

          <div className="gs-download-card">

            <div className="gs-download-card-icon">
              <i className="bi bi-google-play" />
            </div>

            <div>
              <strong>Google Play Store</strong>
              <p>
                Official Play Store version coming soon.
              </p>
            </div>

            <span className="gs-coming-soon">
              Coming Soon
            </span>

          </div>

          <div className="gs-download-services">

            <div>
              <i className="bi bi-percent" />
              <span>Government Schemes</span>
            </div>

            <div>
              <i className="bi bi-cash-stack" />
              <span>Loans</span>
            </div>

            <div>
              <i className="bi bi-shield-check" />
              <span>Insurance</span>
            </div>

            <div>
              <i className="bi bi-file-earmark-text" />
              <span>DPR</span>
            </div>

            <div>
              <i className="bi bi-graph-up-arrow" />
              <span>CIBIL</span>
            </div>

            <div>
              <i className="bi bi-stars" />
              <span>AI Advisor</span>
            </div>

          </div>

          <p className="gs-download-note">
            <i className="bi bi-info-circle" />
            This is the GoSubsidy Android APK.
          </p>

        </div>
      </section>
    </main>
  );
}