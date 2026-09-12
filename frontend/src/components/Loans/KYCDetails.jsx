import React, { useMemo } from "react";

export default function KYCDetails({ loanType, data = {}, onChange }) {
  const update = (name, value) => {
    onChange({
      ...data,
      [name]: value,
    });
  };

  const isBusiness = [
    "Business Loan",
    "Working Capital",
    "Subsidy Linked Loan",
    "Project Finance",
    "Machinery Loan",
    "Solar / Green Finance",
  ].includes(loanType);

  const isEducation = loanType === "Education Loan";
  const isHome = loanType === "Home Loan";
  const isMortgage = loanType === "Mortgage / LAP";
  const isVehicle = loanType === "Vehicle Loan";
  const isPersonal = loanType === "Personal Loan";
  const isSubsidy = loanType === "Subsidy Linked Loan";

  const title = useMemo(() => {
    if (isBusiness) return "Business & Promoter KYC";
    if (isEducation) return "Student & Co-applicant KYC";
    if (isHome) return "Home Loan KYC";
    if (isMortgage) return "Property Owner KYC";
    if (isVehicle) return "Applicant KYC";
    if (isPersonal) return "Personal Loan KYC";
    return "Applicant KYC Verification";
  }, [isBusiness, isEducation, isHome, isMortgage, isVehicle, isPersonal]);

  const handleFile = (name, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onChange({
      ...data,
      [name]: file,
      [`${name}Name`]: file.name,
    });
  };

  return (
    <div className="gosubsidy-kyc">
      <div className="kyc-header">
        <div className="kyc-number">02</div>
        <div>
          <span className="kyc-eyebrow">SECURE IDENTITY VERIFICATION</span>
          <h2>{title}</h2>
          <p>
            Your selected requirement is <strong>{loanType || "Loan"}</strong>.
            Complete the essential KYC information so GoSubsidy can prepare your
            profile for eligibility analysis and lender matching.
          </p>
        </div>
        <div className="kyc-secure-pill">
          <i className="bi bi-shield-lock-fill"></i>
          Secure KYC
        </div>
      </div>

      <div className="kyc-section">
        <div className="kyc-section-title">
          <i className="bi bi-person-vcard"></i>
          <div>
            <h4>Applicant Information</h4>
            <small>Basic information required for the application.</small>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-6">
            <label>Full Name *</label>
            <input
              value={data.fullName || ""}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Enter applicant full name"
            />
          </div>

          <div className="col-lg-6">
            <label>Email Address *</label>
            <input
              type="email"
              value={data.email || ""}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="col-lg-6">
            <label>Mobile Number *</label>
            <div className="kyc-mobile">
              <span>+91</span>
              <input
                type="tel"
                maxLength="10"
                value={data.mobile || ""}
                onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
                placeholder="10 digit mobile number"
              />
            </div>
          </div>

          <div className="col-lg-3">
            <label>Date of Birth *</label>
            <input
              type="date"
              value={data.dateOfBirth || ""}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </div>

          <div className="col-lg-3">
            <label>Gender</label>
            <select value={data.gender || ""} onChange={(e) => update("gender", e.target.value)}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="kyc-section">
        <div className="kyc-section-title">
          <i className="bi bi-shield-check"></i>
          <div>
            <h4>Identity & Address</h4>
            <small>PAN and address information for preliminary verification.</small>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-6">
            <label>PAN Number *</label>
            <input
              value={data.pan || ""}
              maxLength="10"
              onChange={(e) => update("pan", e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
            />
          </div>

          <div className="col-lg-6">
            <label>Aadhaar / KYC Reference</label>
            <input
              value={data.aadhaar || ""}
              onChange={(e) => update("aadhaar", e.target.value)}
              placeholder="Enter Aadhaar / KYC reference"
            />
          </div>

          <div className="col-12">
            <label>Residential Address *</label>
            <textarea
              rows="2"
              value={data.address || ""}
              onChange={(e) => update("address", e.target.value)}
              placeholder="House / Flat, Street, Area"
            />
          </div>

          <div className="col-lg-4">
            <label>State *</label>
            <select value={data.state || ""} onChange={(e) => update("state", e.target.value)}>
              <option value="">Select State</option>
              <option>Telangana</option>
              <option>Andhra Pradesh</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
              <option>Delhi</option>
              <option>Gujarat</option>
              <option>Rajasthan</option>
              <option>Other</option>
            </select>
          </div>

          <div className="col-lg-4">
            <label>District / City *</label>
            <input
              value={data.district || ""}
              onChange={(e) => update("district", e.target.value)}
              placeholder="Enter district or city"
            />
          </div>

          <div className="col-lg-4">
            <label>PIN Code *</label>
            <input
              inputMode="numeric"
              maxLength="6"
              value={data.pinCode || ""}
              onChange={(e) => update("pinCode", e.target.value.replace(/\D/g, ""))}
              placeholder="500001"
            />
          </div>
        </div>
      </div>

      {isBusiness && (
        <div className="kyc-dynamic-card business">
          <div className="dynamic-icon"><i className="bi bi-building"></i></div>
          <div className="dynamic-content">
            <span>BUSINESS PROFILE</span>
            <h4>Business / Enterprise Details</h4>
            <div className="row g-3 mt-1">
              <div className="col-lg-6">
                <label>Business / Enterprise Name *</label>
                <input value={data.businessName || ""} onChange={(e) => update("businessName", e.target.value)} placeholder="Registered business name" />
              </div>
              <div className="col-lg-6">
                <label>Constitution *</label>
                <select value={data.constitution || ""} onChange={(e) => update("constitution", e.target.value)}>
                  <option value="">Select constitution</option>
                  <option>Proprietorship</option>
                  <option>Partnership</option>
                  <option>LLP</option>
                  <option>Private Limited</option>
                  <option>Public Limited</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-lg-6">
                <label>GSTIN</label>
                <input value={data.gstin || ""} onChange={(e) => update("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div className="col-lg-6">
                <label>Udyam / MSME Number</label>
                <input value={data.udyam || ""} onChange={(e) => update("udyam", e.target.value.toUpperCase())} placeholder="Udyam registration number" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isEducation && (
        <div className="kyc-dynamic-card education">
          <div className="dynamic-icon"><i className="bi bi-mortarboard"></i></div>
          <div className="dynamic-content">
            <span>EDUCATION LOAN PROFILE</span>
            <h4>Student & Course Details</h4>
            <div className="row g-3 mt-1">
              <div className="col-lg-6"><label>Institute / University *</label><input value={data.institute || ""} onChange={(e) => update("institute", e.target.value)} placeholder="Institute name" /></div>
              <div className="col-lg-6"><label>Course *</label><input value={data.course || ""} onChange={(e) => update("course", e.target.value)} placeholder="Course / programme" /></div>
              <div className="col-lg-6"><label>Admission Status</label><select value={data.admissionStatus || ""} onChange={(e) => update("admissionStatus", e.target.value)}><option value="">Select</option><option>Admission Confirmed</option><option>Application Submitted</option><option>Planning Admission</option></select></div>
              <div className="col-lg-6"><label>Co-applicant Name</label><input value={data.coApplicantName || ""} onChange={(e) => update("coApplicantName", e.target.value)} placeholder="Parent / guardian" /></div>
            </div>
          </div>
        </div>
      )}

      {(isHome || isMortgage) && (
        <div className="kyc-dynamic-card property">
          <div className="dynamic-icon"><i className="bi bi-house-door"></i></div>
          <div className="dynamic-content">
            <span>{isMortgage ? "MORTGAGE / LAP PROFILE" : "HOME LOAN PROFILE"}</span>
            <h4>Property Details</h4>
            <div className="row g-3 mt-1">
              <div className="col-lg-6"><label>Property Type</label><select value={data.propertyType || ""} onChange={(e) => update("propertyType", e.target.value)}><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Plot</option><option>Industrial</option></select></div>
              <div className="col-lg-6"><label>Property Location</label><input value={data.propertyLocation || ""} onChange={(e) => update("propertyLocation", e.target.value)} placeholder="City / locality" /></div>
              <div className="col-lg-6"><label>Estimated Property Value</label><input type="number" value={data.propertyValue || ""} onChange={(e) => update("propertyValue", e.target.value)} placeholder="₹ Property value" /></div>
              <div className="col-lg-6"><label>Ownership Status</label><select value={data.ownershipStatus || ""} onChange={(e) => update("ownershipStatus", e.target.value)}><option value="">Select</option><option>Owned</option><option>Jointly Owned</option><option>Under Purchase</option><option>Other</option></select></div>
            </div>
          </div>
        </div>
      )}

      {isVehicle && (
        <div className="kyc-dynamic-card vehicle">
          <div className="dynamic-icon"><i className="bi bi-car-front"></i></div>
          <div className="dynamic-content">
            <span>VEHICLE LOAN PROFILE</span>
            <h4>Vehicle Requirement</h4>
            <div className="row g-3 mt-1">
              <div className="col-lg-6"><label>Vehicle Type</label><select value={data.vehicleType || ""} onChange={(e) => update("vehicleType", e.target.value)}><option value="">Select</option><option>Car</option><option>Commercial Vehicle</option><option>Two Wheeler</option><option>Other</option></select></div>
              <div className="col-lg-6"><label>New / Used</label><select value={data.vehicleCondition || ""} onChange={(e) => update("vehicleCondition", e.target.value)}><option value="">Select</option><option>New</option><option>Used</option></select></div>
              <div className="col-lg-6"><label>Estimated Vehicle Cost</label><input type="number" value={data.vehicleCost || ""} onChange={(e) => update("vehicleCost", e.target.value)} placeholder="₹ Vehicle cost" /></div>
              <div className="col-lg-6"><label>Dealer Name</label><input value={data.dealerName || ""} onChange={(e) => update("dealerName", e.target.value)} placeholder="Dealer / showroom" /></div>
            </div>
          </div>
        </div>
      )}

      {isSubsidy && (
        <div className="kyc-dynamic-card subsidy">
          <div className="dynamic-icon"><i className="bi bi-bank"></i></div>
          <div className="dynamic-content">
            <span>SUBSIDY LINKED FINANCE</span>
            <h4>Government Scheme Information</h4>
            <div className="row g-3 mt-1">
              <div className="col-lg-6"><label>Scheme / Programme</label><input value={data.schemeName || ""} onChange={(e) => update("schemeName", e.target.value)} placeholder="If already identified" /></div>
              <div className="col-lg-6"><label>Beneficiary Category</label><select value={data.beneficiaryCategory || ""} onChange={(e) => update("beneficiaryCategory", e.target.value)}><option value="">Select</option><option>General</option><option>Women</option><option>SC / ST</option><option>OBC</option><option>Minority</option><option>Other</option></select></div>
              <div className="col-12"><small className="kyc-note"><i className="bi bi-info-circle"></i> Scheme eligibility, subsidy amount and approval are subject to the applicable Government scheme and lender rules.</small></div>
            </div>
          </div>
        </div>
      )}

      <div className="kyc-documents">
        <div className="kyc-section-title">
          <i className="bi bi-cloud-arrow-up"></i>
          <div>
            <h4>Optional Document Capture</h4>
            <small>You can upload supporting documents now or at the document stage.</small>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-lg-4">
            <label>PAN Document</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFile("panDocument", e)} />
          </div>
          <div className="col-lg-4">
            <label>Address Proof</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFile("addressDocument", e)} />
          </div>
          <div className="col-lg-4">
            <label>Other Supporting Document</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFile("otherDocument", e)} />
          </div>
        </div>
      </div>

      <div className="kyc-consent">
        <i className="bi bi-shield-check"></i>
        <div>
          <strong>Secure & Preliminary Assessment</strong>
          <p>
            Information entered here is used to prepare a preliminary loan profile.
            Final KYC, underwriting, approval and sanction are performed by the
            applicable lender or authorised partner.
          </p>
        </div>
      </div>

      <style>{`
        .gosubsidy-kyc{color:#172033}
        .kyc-header{display:flex;align-items:flex-start;gap:18px;padding-bottom:26px;border-bottom:1px solid #e7edf5;margin-bottom:28px}
        .kyc-number{width:54px;height:54px;border-radius:16px;background:linear-gradient(135deg,#e9f3ff,#dff9f2);display:grid;place-items:center;font-weight:900;color:#0b74e8;flex:0 0 auto}
        .kyc-eyebrow{font-size:11px;font-weight:850;letter-spacing:1.1px;color:#0b74e8}
        .kyc-header h2{font-size:30px;font-weight:850;margin:4px 0 7px}
        .kyc-header p{margin:0;color:#64748b;line-height:1.65;max-width:760px}
        .kyc-secure-pill{margin-left:auto;white-space:nowrap;background:#e9fbf5;color:#008f6b;border:1px solid #bcefe0;padding:9px 13px;border-radius:100px;font-size:12px;font-weight:800}
        .kyc-section{padding:24px;border:1px solid #e3eaf3;border-radius:18px;background:#fff;margin-bottom:18px;box-shadow:0 8px 24px rgba(15,43,77,.045)}
        .kyc-section-title{display:flex;gap:12px;align-items:center;margin-bottom:20px}
        .kyc-section-title>i{width:42px;height:42px;border-radius:12px;background:#edf5ff;color:#0877eb;display:grid;place-items:center;font-size:20px}
        .kyc-section-title h4{font-size:18px;font-weight:850;margin:0}
        .kyc-section-title small{color:#718096}
        .gosubsidy-kyc label{display:block;font-size:13px;font-weight:750;margin-bottom:7px;color:#26364b}
        .gosubsidy-kyc input,.gosubsidy-kyc select,.gosubsidy-kyc textarea{width:100%;border:1px solid #d7e0ea;border-radius:11px;padding:12px 13px;background:#fff;color:#172033;outline:none;transition:.2s;font-size:14px}
        .gosubsidy-kyc input:focus,.gosubsidy-kyc select:focus,.gosubsidy-kyc textarea:focus{border-color:#0877eb;box-shadow:0 0 0 3px rgba(8,119,235,.08)}
        .kyc-mobile{display:flex;border:1px solid #d7e0ea;border-radius:11px;overflow:hidden}
        .kyc-mobile span{padding:12px 13px;background:#f6f8fb;border-right:1px solid #d7e0ea;font-weight:750;color:#526277}
        .kyc-mobile input{border:0;border-radius:0}
        .kyc-dynamic-card{display:flex;gap:16px;padding:22px;border-radius:18px;margin:18px 0;border:1px solid #cfe3ff;background:#f8fbff}
        .kyc-dynamic-card.business{border-color:#bfe8dc;background:#f5fffb}.kyc-dynamic-card.education{border-color:#ddd1ff;background:#fbf9ff}.kyc-dynamic-card.property{border-color:#d2e2f8;background:#f8fbff}.kyc-dynamic-card.vehicle{border-color:#ffe0b0;background:#fffaf2}.kyc-dynamic-card.subsidy{border-color:#b9efe0;background:#f3fffb}
        .dynamic-icon{width:46px;height:46px;border-radius:13px;background:#0877eb;color:#fff;display:grid;place-items:center;flex:0 0 auto}.business .dynamic-icon{background:#00a77d}.education .dynamic-icon{background:#7357d8}.vehicle .dynamic-icon{background:#f59e0b}.subsidy .dynamic-icon{background:#00a77d}
        .dynamic-content{flex:1}.dynamic-content>span{font-size:10px;font-weight:850;letter-spacing:1px;color:#0877eb}.dynamic-content h4{margin:3px 0 4px;font-size:19px;font-weight:850}
        .kyc-documents{padding:24px;border-radius:18px;background:#f7f9fc;border:1px solid #e4eaf2;margin-bottom:18px}
        .kyc-documents input[type=file]{background:#fff;padding:10px}
        .kyc-note{color:#62748a;line-height:1.5}.kyc-note i{color:#0877eb;margin-right:5px}
        .kyc-consent{display:flex;gap:12px;align-items:flex-start;padding:16px 18px;border-radius:14px;background:#effaf7;border:1px solid #c7eee4;color:#16665a}.kyc-consent>i{font-size:20px;color:#00a77d}.kyc-consent strong{font-size:14px}.kyc-consent p{margin:4px 0 0;font-size:12px;line-height:1.55;color:#4e716c}
        @media(max-width:767px){.kyc-header{flex-wrap:wrap}.kyc-secure-pill{margin-left:0}.kyc-header h2{font-size:24px}.kyc-section,.kyc-documents{padding:18px}.kyc-dynamic-card{padding:17px}}
      `}</style>
    </div>
  );
}