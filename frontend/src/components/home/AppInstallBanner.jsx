import React, { useEffect, useState } from "react";
import "./AppInstallBanner.css";

const APK_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1FifCe5WMiT-s9KymA5HOE-zizU1SoanV";

const DISMISS_KEY = "gosubsidy_app_install_dismissed";

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isGoSubsidyApp = /GoSubsidyApp/i.test(ua) || (/GoSubsidy/i.test(ua) && /wv|WebView/i.test(ua));
    if (isGoSubsidyApp) return;

    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  const handleInstall = () => {
    window.open(APK_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  };

  if (!visible) return null;

  return (
    <div className="gs-app-install-wrapper">
      <div className="gs-app-install-banner">
        <div className="gs-app-install-icon">
          <img src="/images/gosubsidy-logo.png" alt="GoSubsidy" />
        </div>
        <div className="gs-app-install-content">
          <div className="gs-app-install-title">Get GoSubsidy on your phone</div>
          <div className="gs-app-install-text">
            Schemes • Loans • Insurance • DPR • CIBIL • AI Advisor
          </div>
        </div>
        <button type="button" className="gs-app-install-button" onClick={handleInstall}>
          <i className="bi bi-download" />
          <span>Install App</span>
        </button>
        <button type="button" className="gs-app-install-close" onClick={handleDismiss} aria-label="Close">
          <i className="bi bi-x-lg" />
        </button>
      </div>
    </div>
  );
}
