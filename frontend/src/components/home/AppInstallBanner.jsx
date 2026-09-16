import React, { useEffect, useState } from "react";
import "./AppInstallBanner.css";

// GoSubsidy Production Release APK
const APK_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1X4M0FS0L7DTHbTsGBJ4jo1zPaR1j58pr";

const DISMISS_KEY = "gosubsidy_app_install_dismissed";

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";

    // Hide the install banner inside the GoSubsidy Android app.
    const isGoSubsidyApp =
      /GoSubsidyApp/i.test(ua) ||
      (/Android/i.test(ua) && /wv/i.test(ua));

    if (isGoSubsidyApp) {
      return;
    }

    // Don't show again during the current browser session
    // after the user closes it.
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") {
        return;
      }
    } catch (error) {
      // Ignore storage errors.
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch (error) {
      // Ignore storage errors.
    }

    setVisible(false);
  };

  const handleInstall = () => {
    // Open the production Release APK.
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
            src="/images/gosubsidy-logo.png"
            alt="GoSubsidy"
            loading="lazy"
          />
        </div>

        {/* Banner Content */}
        <div className="gs-app-install-content">
          <div className="gs-app-install-title">
            Get GoSubsidy on your phone
          </div>

          <div className="gs-app-install-text">
            Schemes • Loans • Insurance • DPR • CIBIL • AI Advisor
          </div>
        </div>

        {/* Install Button */}
        <button
          type="button"
          className="gs-app-install-button"
          onClick={handleInstall}
          aria-label="Install GoSubsidy Android app"
        >
          <i className="bi bi-android2" aria-hidden="true" />
          <span>Install App</span>
        </button>

        {/* Close Button */}
        <button
          type="button"
          className="gs-app-install-close"
          onClick={handleDismiss}
          aria-label="Close GoSubsidy app installation banner"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}