import React, { useEffect, useState } from "react";
import "./AppInstallBanner.css";

// GoSubsidy Production Release APK
const APK_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1IlOsj-M03nh9TqKETVYogmGGT8yg1M-f";

const DISMISS_KEY = "gosubsidy_app_install_dismissed";

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";

    // Do not show the install banner inside the GoSubsidy Android app.
    const isGoSubsidyApp =
      /GoSubsidyApp/i.test(ua) ||
      (/Android/i.test(ua) && /wv/i.test(ua));

    if (isGoSubsidyApp) {
      return;
    }

    // Do not show again during the current browser session
    // if the user has already closed the banner.
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") {
        return;
      }
    } catch (error) {
      // Ignore storage errors.
    }

    // Show banner after 1.2 seconds.
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    if (downloading) return;

    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch (error) {
      // Ignore storage errors.
    }

    setVisible(false);
  };

  const handleInstall = () => {
    if (downloading) return;

    setDownloading(true);

    // Start the Google Drive APK download.
    // The browser/Android handles the actual download.
    window.location.href = APK_DOWNLOAD_URL;
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="gs-app-install-wrapper"
      role="region"
      aria-label="GoSubsidy Android app installation"
    >
      <div className="gs-app-install-banner">

        {/* GoSubsidy App Icon */}
        <div className="gs-app-install-icon">
          <img
            src="/images/gosubsidy-handshake-512.png"
            alt="GoSubsidy"
            loading="lazy"
          />
        </div>

        {/* Banner Content */}
        <div className="gs-app-install-content">
          <div className="gs-app-install-title">
            {downloading
              ? "Downloading GoSubsidy App..."
              : "Get GoSubsidy on your phone"}
          </div>

          <div className="gs-app-install-text">
            {downloading
              ? "Your Android download is starting..."
              : "Schemes • Loans • Insurance • DPR • CIBIL • AI Advisor"}
          </div>
        </div>

        {/* Install / Download Button */}
        <button
          type="button"
          className={`gs-app-install-button ${
            downloading ? "is-downloading" : ""
          }`}
          onClick={handleInstall}
          disabled={downloading}
          aria-label={
            downloading
              ? "Downloading GoSubsidy Android app"
              : "Install GoSubsidy Android app"
          }
        >
          {downloading ? (
            <>
              <span
                className="gs-app-install-spinner"
                aria-hidden="true"
              />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <i
                className="bi bi-android2"
                aria-hidden="true"
              />
              <span>Install App</span>
            </>
          )}
        </button>

        {/* Close Button */}
        <button
          type="button"
          className="gs-app-install-close"
          onClick={handleDismiss}
          disabled={downloading}
          aria-label="Close GoSubsidy app installation banner"
        >
          <i
            className="bi bi-x-lg"
            aria-hidden="true"
          />
        </button>

      </div>
    </div>
  );
}