import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CheckScoreModal from "./CheckScoreModal";
import OtpVerification from "./OtpVerification";
import LoadingScreen from "./LoadingScreen";
import CreditDashboard from "./CreditDashboard";

export default function CheckScore() {

  const navigate = useNavigate();

  const [step, setStep] = useState("idle");
  const [customer, setCustomer] = useState(null);

  // Continue from Check Score Modal
  const handleContinue = (data) => {
    setCustomer(data);
    setStep("otp");
  };

  // OTP Verified
  const handleOtpVerified = () => {
    setStep("loading");

    setTimeout(() => {
      setStep("dashboard");
    }, 3500);
  };

  // Close Button
 const handleClose = () => {
  setStep("closed");
};

  return (
    <>
      {/* Check Score Modal */}
      {step === "idle" && (
  <CheckScoreModal
    show={true}
    onClose={handleClose}
    onContinue={handleContinue}
  />
)}

      {/* OTP Screen */}
      {step === "otp" && (
        <OtpVerification
          mobile={customer.mobile}
          onVerified={handleOtpVerified}
        />
      )}

      {/* Loading Screen */}
      {step === "loading" && (
        <LoadingScreen />
      )}

      {/* Credit Dashboard */}
      {step === "dashboard" && (
        <CreditDashboard customer={customer} />
      )}
    </>
  );
}