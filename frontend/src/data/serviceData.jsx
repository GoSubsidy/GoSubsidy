/* =============================================================================
   GoSubsidy Complete 117 Services Directory Dataset
   All 9 Major Categories & 117 Individual Service Slugs
   ============================================================================= */

export const SERVICES_CATALOG = {
  // ===========================================================================
  // 1. STARTUP (10 Services)
  // ===========================================================================
  "proprietorship": {
    title: "Sole Proprietorship Registration",
    category: "Startups",
    icon: "bi-person-badge",
    price: "₹1,499",
    timeline: "3 - 5 Working Days",
    overview: "A Sole Proprietorship is the simplest, single-owner business structure in India, recognized through GST, Udyam, and Shop Act registrations under personal PAN.",
    benefits: ["Complete individual operational control", "100% direct profit retention", "Minimal regulatory compliances", "Quick current account opening"],
    documents: ["Identity & Address Proof", "PAN Card", "Electricity Bill of Office", "Rent Agreement & NOC"],
    process: ["Name verification & consultation", "MSME Udyam certificate filing", "GST registration application", "Current account kit handover"],
    faqs: [{ q: "Does a Proprietorship require a separate PAN?", a: "No, a proprietorship operates under the proprietor's individual PAN." }]
  },
  "partnership": {
    title: "Partnership Firm Registration",
    category: "Startups",
    icon: "bi-people",
    price: "₹2,999",
    timeline: "5 - 7 Working Days",
    overview: "Formed under the Indian Partnership Act, 1932, allowing two or more individuals to pool capital and share profits with a structured deed.",
    benefits: ["Combined partner expertise & capital", "Easy formation with drafted deed", "Lower statutory compliance", "Flexible internal governance"],
    documents: ["PAN & Identity Proof of all Partners", "Partnership Deed on Stamp Paper", "Office Address Proof", "NOC from Property Owner"],
    process: ["Deed drafting & review", "Stamp duty & notarization", "Firm PAN & TAN issuance", "ROF registration filing"],
    faqs: [{ q: "Is ROF registration compulsory?", a: "Registration with the Registrar of Firms is optional but recommended to enforce legal rights." }]
  },
  "one-person-company": {
    title: "One Person Company (OPC) Registration",
    category: "Startups",
    icon: "bi-person-workspace",
    price: "₹5,999",
    timeline: "7 - 10 Working Days",
    overview: "Enables a single entrepreneur to operate a corporate entity with limited liability under the Ministry of Corporate Affairs (MCA).",
    benefits: ["Limited liability for sole founder", "Distinct corporate legal entity", "High bank & institutional trust", "Easy conversion to Pvt Ltd"],
    documents: ["PAN & Identity Proof of Director & Nominee", "Bank Statement (latest 2 months)", "Office Electricity Bill", "Nominee Consent (INC-3)"],
    process: ["DSC for Director", "RUN Name reservation", "SPICe+ Part B incorporation", "Certificate of Incorporation (COI)"],
    faqs: [{ q: "Is a nominee mandatory?", a: "Yes, an OPC requires one designated nominee under MCA guidelines." }]
  },
  "limited-liability-partnership": {
    title: "Limited Liability Partnership (LLP) Registration",
    category: "Startups",
    icon: "bi-diagram-3",
    price: "₹4,999",
    timeline: "8 - 12 Working Days",
    overview: "Combines the flexibility of a traditional partnership with limited liability protection and no mandatory audit for small capital.",
    benefits: ["Protection from co-partner liabilities", "No minimum capital requirement", "Lower compliance than Pvt Ltd", "No dividend distribution tax"],
    documents: ["PAN & Identity Proof of Designated Partners", "Office Electricity Bill & NOC", "Digital Signature Certificates", "LLP Agreement"],
    process: ["Partner DSC preparation", "RUN-LLP name approval", "FiLLiP form submission", "Form 3 agreement filing"],
    faqs: [{ q: "When is an audit mandatory for an LLP?", a: "Audit is mandatory only if annual turnover exceeds ₹40 Lakhs or contribution exceeds ₹25 Lakhs." }]
  },
  "private-limited-company": {
    title: "Private Limited Company Registration",
    category: "Startups",
    icon: "bi-buildings",
    price: "₹2,899",
    timeline: "7 - 10 Working Days",
    overview: "The gold standard corporate legal structure for scalable startups and businesses seeking venture capital and limited liability.",
    benefits: ["Attracts venture capital & angel funding", "Complete limited liability", "Perpetual succession", "Easy equity distribution"],
    documents: ["PAN & Passport/Voter ID of Directors", "Bank Statement of Directors", "Electricity Bill + NOC of Office", "DSC for Directors"],
    process: ["DSC issuance", "SPICe+ Part A name approval", "MOA, AOA & SPICe+ Part B filing", "COI, PAN, TAN & EPFO issuance"],
    faqs: [{ q: "How many directors are needed?", a: "A minimum of 2 directors and 2 shareholders are required." }]
  },
  "section-8-company": {
    title: "Section 8 Company (NGO) Registration",
    category: "Startups",
    icon: "bi-heart",
    price: "₹9,999",
    timeline: "12 - 15 Working Days",
    overview: "A non-profit corporate entity registered under the Companies Act for promoting charity, art, science, education, or social welfare.",
    benefits: ["High credibility for foreign & CSR grants", "Stamp duty exemption", "Eligible for 12A & 80G tax exemptions", "No minimum capital"],
    documents: ["PAN & Identity Proof of Promoters", "3-Year Projected Budget & Program", "Asset/Liability Statement", "Office Utility Bill"],
    process: ["DSC & Name reservation", "Section 8 License (INC-12) filing", "MOA/AOA charity clause drafting", "MCA Incorporation grant"],
    faqs: [{ q: "Can profits be distributed?", a: "No, all profits must be reinvested into the non-profit objectives." }]
  },
  "trust-registration": {
    title: "Trust Registration",
    category: "Startups",
    icon: "bi-shield-check",
    price: "₹7,999",
    timeline: "10 - 15 Working Days",
    overview: "Legal establishment of a charitable or private trust via registered Trust Deed before the local Sub-Registrar.",
    benefits: ["Structured charity fund management", "Tax exemption eligibility", "Asset protection for beneficiaries", "Long-term institutional vehicle"],
    documents: ["ID & Address Proof of Settlor & Trustees", "Drafted Trust Deed on Stamp Paper", "Office Proof & NOC", "Passport Photos"],
    process: ["Trust Deed drafting", "Stamp duty payment", "Sub-Registrar appointment & execution", "PAN & 12A application"],
    faqs: [{ q: "How many trustees are required?", a: "A minimum of two trustees are required." }]
  },
  "public-limited-company": {
    title: "Public Limited Company Registration",
    category: "Startups",
    icon: "bi-building",
    price: "₹14,999",
    timeline: "15 - 20 Working Days",
    overview: "Corporate entity for large-scale enterprises with the legal capability to offer shares to the public and list on stock exchanges.",
    benefits: ["Public equity capital raising", "Uncapped number of shareholders", "Higher corporate borrowing limits", "High brand credibility"],
    documents: ["KYC of 3 Directors & 7 Shareholders", "Registered Office Proof", "DSC for all Directors", "Public MOA & AOA"],
    process: ["DSC & Name approval", "Drafting public MOA/AOA", "SPICe+ incorporation with MCA", "Commencement of Business filing"],
    faqs: [{ q: "What is the minimum member requirement?", a: "Minimum 7 shareholders and 3 directors." }]
  },
  "producer-company": {
    title: "Producer Company Registration",
    category: "Startups",
    icon: "bi-box-seam",
    price: "₹11,999",
    timeline: "12 - 18 Working Days",
    overview: "A hybrid corporate entity tailored exclusively for primary agricultural producers, farmers, and dairy cooperatives.",
    benefits: ["NABARD & government equity grants", "Direct market reach bypassing middlemen", "Limited liability for farmers", "Corporate structure for agri-business"],
    documents: ["Farmer proof (Khatoni/7-12) of 10+ members", "PAN & Identity Proof of all members", "Office Electricity Bill", "DSC for 5 Directors"],
    process: ["Farmer verification & DSC", "Name reservation with MCA", "SPICe+ filing with agrarian clauses", "NABARD & PMKSY scheme linkage"],
    faqs: [{ q: "How many farmers are required?", a: "Minimum 10 primary producer individuals or 2 producer institutions." }]
  },
  "indian-subsidiary": {
    title: "Indian Subsidiary Setup",
    category: "Startups",
    icon: "bi-globe-asia-australia",
    price: "₹19,999",
    timeline: "15 - 25 Working Days",
    overview: "Incorporation of an Indian entity where the majority shareholding is owned by a foreign corporate parent or foreign national.",
    benefits: ["100% FDI permitted in most sectors", "Direct access to Indian domestic market", "Independent corporate legal status", "Access to PLI & government subsidies"],
    documents: ["Apostilled Foreign Board Resolution", "Parent Certificate of Incorporation", "Passport & Address of Foreign Directors", "KYC of 1 Resident Indian Director"],
    process: ["Resident Director DSC", "MCA Name approval", "SPICe+ filing with apostilled docs", "RBI FIRMS reporting within 30 days"],
    faqs: [{ q: "Is a resident director mandatory?", a: "Yes, at least one director must have resided in India for 182+ days." }]
  },

  // ===========================================================================
  // 2. REGISTRATIONS (28 Services)
  // ===========================================================================
  "startup-india": {
    title: "Startup India DPIIT Recognition",
    category: "Registration",
    icon: "bi-rocket-takeoff",
    price: "₹2,999",
    timeline: "3 - 7 Working Days",
    overview: "Official DPIIT recognition unlocking 3-year income tax exemption (80-IAC), fast-tracked patent rebates, and government seed funding.",
    benefits: ["Section 80-IAC Tax Holiday eligibility", "80% rebate on patent filings", "Access to Startup India Seed Fund", "Exemption from angel tax"],
    documents: ["Incorporation Certificate", "Pitch Deck / Business Plan", "Website / Mobile App URL", "Director KYC Details"],
    process: ["Eligibility analysis", "DPIIT portal application", "Innovation pitch write-up", "Recognition Certificate download"],
    faqs: [{ q: "Who is eligible for DPIIT?", a: "Private Limited Companies and LLPs incorporated within the last 10 years with turnover under ₹100 Cr." }]
  },
  "trade-license": {
    title: "Trade License / Gumasta",
    category: "Registration",
    icon: "bi-shop",
    price: "₹1,999",
    timeline: "4 - 7 Working Days",
    overview: "Municipal corporation authorization permitting commercial trading, manufacturing, or service activities within municipal boundaries.",
    benefits: ["Full local municipal compliance", "Protects against civic fines and closure", "Mandatory for commercial bank loans", "Builds customer trust"],
    documents: ["PAN & Identity Proof of Proprietor/Directors", "Premises Rent Agreement & NOC", "Electricity Bill", "Property Tax Receipt"],
    process: ["Municipal jurisdiction verification", "Application drafting", "Local body filing & inspection support", "License issuance"],
    faqs: [{ q: "What is the validity of a Trade License?", a: "Typically 1 financial year, renewable annually." }]
  },
  "fssai-registration": {
    title: "Basic FSSAI Registration",
    category: "Registration",
    icon: "bi-patch-check",
    price: "₹1,499",
    timeline: "3 - 5 Working Days",
    overview: "14-digit food safety registration for small food business operators, cloud kitchens, and traders with turnover below ₹12 Lakhs.",
    benefits: ["Mandatory 14-digit FoSCoS number", "Onboarding on Zomato, Swiggy, Blinkit", "Consumer food trust", "Valid across India"],
    documents: ["Applicant Identity Proof & PAN", "Passport Size Photo", "Business Premise Address Proof", "Food Category Declaration"],
    process: ["FoSCoS profile creation", "Form A filing", "Fee payment & inspection", "Digital License download"],
    faqs: [{ q: "What is the turnover limit for basic FSSAI?", a: "Annual turnover up to ₹12 Lakhs." }]
  },
  "fssai-license": {
    title: "FSSAI State / Central License",
    category: "Registration",
    icon: "bi-award",
    price: "₹3,999",
    timeline: "7 - 15 Working Days",
    overview: "Mandatory food safety license for food manufacturers, large restaurants, importers, and distributors exceeding ₹12 Lakhs turnover.",
    benefits: ["Enables large-scale food manufacturing", "Export/Import food clearance", "Compliance with food safety standards", "Long-term 1 to 5 year validity"],
    documents: ["Layout Plan of Manufacturing Unit", "List of Food Categories & Machinery", "Water Testing Report", "Director/Partner KYC"],
    process: ["Form B compilation on FoSCoS", "Safety documentation audit", "Food Safety Officer inspection", "License Certificate issuance"],
    faqs: [{ q: "When is a Central FSSAI license needed?", a: "Turnover above ₹20 Crores or operating in multiple states." }]
  },
  "halal-license-certification": {
    title: "Halal Certification",
    category: "Registration",
    icon: "bi-patch-check",
    price: "₹7,999",
    timeline: "10 - 15 Working Days",
    overview: "Certification assuring food, cosmetics, and pharmaceuticals comply with Shariah hygiene and processing standards for domestic and export markets.",
    benefits: ["Unlocks GCC & Middle East export markets", "Global Islamic market access", "Enhanced hygienic certification", "Competitive edge in exports"],
    documents: ["FSSAI License / IEC Code", "Product Composition & Raw Material List", "Process Flowchart", "Company Registration Proof"],
    process: ["Application & ingredient audit", "On-site facility inspection", "Board review", "Halal Certificate issuance"],
    faqs: [{ q: "What is the validity of Halal Certificate?", a: "Typically 1 to 3 years with annual surveillance." }]
  },
  "icegate-registration": {
    title: "ICEGATE Registration",
    category: "Registration",
    icon: "bi-globe2",
    price: "₹2,499",
    timeline: "2 - 4 Working Days",
    overview: "Customs EDI gateway registration enabling exporters and importers to file Bill of Entry and Shipping Bills electronically.",
    benefits: ["Online Customs duty payments", "Direct filing of Shipping Bills", "Track shipment customs clearance", "Fast-track export incentives"],
    documents: ["IEC Certificate", "Class 3 DSC with Encryption", "PAN & Identity Proof of Authorized Signatory", "Bank Account Details (AD Code)"],
    process: ["DSC integration on ICEGATE", "User profile registration", "AD Code bank mapping", "Customs approval confirmation"],
    faqs: [{ q: "Is DSC mandatory for ICEGATE?", a: "Yes, a Class 3 DSC with signing and encryption is mandatory." }]
  },
  "import-export-code": {
    title: "Import Export Code (IEC)",
    category: "Registration",
    icon: "bi-box-arrow-up-right",
    price: "₹1,999",
    timeline: "1 - 2 Working Days",
    overview: "10-digit unique code issued by the Directorate General of Foreign Trade (DGFT) mandatory for international import and export of goods and services.",
    benefits: ["Lifetime validity with zero renewal fee", "Mandatory for customs clearance", "Avail export subsidies & RoDTEP", "Direct foreign currency receipt"],
    documents: ["PAN of Entity / Proprietor", "Cancelled Cheque / Bank Certificate", "Address Proof of Premises", "Identity Proof of Signatory"],
    process: ["DGFT portal application (ANF 2A)", "Online authentication", "Statutory fee payment", "Instant e-IEC issuance"],
    faqs: [{ q: "Does IEC require annual renewal?", a: "IEC requires annual online profile updating between April and June." }]
  },
  "legal-entity-identifier-code": {
    title: "Legal Entity Identifier (LEI) Code",
    category: "Registration",
    icon: "bi-upc-scan",
    price: "₹2,999",
    timeline: "2 - 3 Working Days",
    overview: "20-character global identifier mandated by the RBI for corporate borrowers and entities with large financial transactions.",
    benefits: ["RBI compliance for transactions ₹50 Cr+", "Global financial identity", "Smooth cross-border banking", "Standardized corporate verification"],
    documents: ["Certificate of Incorporation", "Audited Financial Statements", "Board Resolution & Power of Attorney", "PAN & GSTIN"],
    process: ["LEIL portal submission", "Audited balance sheet review", "Payment & verification", "20-digit LEI allocation"],
    faqs: [{ q: "What is the validity of LEI?", a: "LEI is valid for 1 year and must be renewed annually." }]
  },
  "iso-registration": {
    title: "ISO 9001:2015 Certification",
    category: "Registration",
    icon: "bi-patch-check",
    price: "₹3,499",
    timeline: "3 - 5 Working Days",
    overview: "Internationally recognized quality management certification verifying operational excellence, efficiency, and customer satisfaction.",
    benefits: ["Mandatory eligibility for government tenders", "Boosts international buyer credibility", "Operational efficiency standards", "Valid for 3 years"],
    documents: ["Company Registration Proof", "Sale/Purchase Invoices", "Scope of Business Activity", "PAN & Identity Proof"],
    process: ["Quality Manual preparation", "Process workflow documentation", "Certification Body audit", "ISO Certificate issuance"],
    faqs: [{ q: "Which ISO standard is best for general business?", a: "ISO 9001:2015 for Quality Management Systems." }]
  },
  "pf-registration": {
    title: "EPFO (PF) Registration",
    category: "Registration",
    icon: "bi-person-check",
    price: "₹1,999",
    timeline: "2 - 4 Working Days",
    overview: "Employee Provident Fund registration mandatory for establishments employing 20 or more persons.",
    benefits: ["Retirement security for employees", "Statutory labour law compliance", "Avoid EPFO penalties", "Government pension contribution (EPS)"],
    documents: ["Company PAN & Incorporation Proof", "Cancelled Cheque", "Specimen Signature Card", "List of Employees with Identification"],
    process: ["Unified Shram Suvidha portal filing", "Digital Signature verification", "Establishment Code generation", "Portal handover"],
    faqs: [{ q: "Is voluntary PF registration possible with less than 20 employees?", a: "Yes, voluntary registration is allowed." }]
  },
  "esi-registration": {
    title: "ESIC Registration",
    category: "Registration",
    icon: "bi-heart-pulse",
    price: "₹1,999",
    timeline: "2 - 4 Working Days",
    overview: "Employee State Insurance registration providing medical and sickness insurance coverage for employees earning up to ₹21,000/month.",
    benefits: ["Comprehensive medical care for workers", "Maternity & disability benefits", "Legal protection against worker injury claims", "Full statutory compliance"],
    documents: ["Company Registration Certificate", "Address Proof of Premises", "Employee List with Wages & Joining Date", "Bank Cancelled Cheque"],
    process: ["ESIC portal registration", "Employer code creation", "Employee onboarding & IP generation", "Registration certificate issuance"],
    faqs: [{ q: "What is the employee threshold for ESIC?", a: "Mandatory for units with 10 or more employees earning up to ₹21,000/month." }]
  },
  "professional-tax-registration": {
    title: "Professional Tax Registration (PTRC/PTEC)",
    category: "Registration",
    icon: "bi-receipt",
    price: "₹1,999",
    timeline: "3 - 5 Working Days",
    overview: "State-level registration required for business owners (PTEC) and employers deducting tax from employee salaries (PTRC).",
    benefits: ["State tax compliance", "Legal salary processing", "Tax deduction on business income", "Avoid state revenue penalties"],
    documents: ["PAN & Identity Proof of Promoters", "Premises Address Proof", "Employee Details with Salary Slips", "Bank Account Proof"],
    process: ["State Commercial Tax portal filing", "Document submission", "PTRC/PTEC certificate generation", "Challan portal setup"],
    faqs: [{ q: "What is the difference between PTRC and PTEC?", a: "PTEC is for the business entity/owner; PTRC is for deducting tax from employees." }]
  },
  "rcmc-registration": {
    title: "RCMC Registration (Export Council)",
    category: "Registration",
    icon: "bi-card-checklist",
    price: "₹4,999",
    timeline: "7 - 10 Working Days",
    overview: "Registration-cum-Membership Certificate from Export Promotion Councils (like APEDA, FIEO, EEPC) mandatory for export incentives.",
    benefits: ["Claim duty drawback & RoDTEP benefits", "Participate in global trade fairs with subsidies", "Export authorization clearance", "Access to buyer directories"],
    documents: ["IEC Certificate", "PAN & Company Registration Proof", "Past 3-Year Export/Turnover Certificate", "Board Resolution"],
    process: ["Relevant Council selection (APEDA/FIEO)", "Application filing on DGFT e-RCMC portal", "Council review & membership fee", "RCMC issuance"],
    faqs: [{ q: "How long is an RCMC valid?", a: "Valid for 5 years from the date of issue." }]
  },
  "tn-rera-registration-for-agents": {
    title: "RERA Agent Registration",
    category: "Registration",
    icon: "bi-houses",
    price: "₹3,999",
    timeline: "7 - 12 Working Days",
    overview: "Mandatory statutory registration with the Real Estate Regulatory Authority for brokers and real estate agents.",
    benefits: ["Legally advertise & sell real estate", "Avoid hefty RERA penalties", "Build homebuyer credibility", "5-year valid agent license"],
    documents: ["PAN & Identity Proof of Agent / Directors", "Business Address Proof", "Past 3-Year ITR Acknowledgements", "Photographs"],
    process: ["State RERA portal form submission", "Document compilation", "Statutory fee payment", "RERA Agent Certificate grant"],
    faqs: [{ q: "Is RERA registration mandatory for individual brokers?", a: "Yes, facilitating RERA project sales without registration carries severe penalties." }]
  },
  "12a-80g-registration": {
    title: "12A & 80G Registration (Combined)",
    category: "Registration",
    icon: "bi-file-earmark-check",
    price: "₹9,999",
    timeline: "15 - 25 Working Days",
    overview: "Income Tax exemption registration allowing NGOs/Trusts 100% tax-free income (12A) and offering 50% tax deductions to donors (80G).",
    benefits: ["Complete income tax exemption for NGO", "50% tax deduction incentive for donors", "Mandatory for CSR grant eligibility", "5-year provisional order"],
    documents: ["Trust Deed / Section 8 MOA", "PAN & Identity Proof of Trustees", "3-Year Activity Report & Balance Sheets", "Darpan Registration ID"],
    process: ["Form 10A compilation on Income Tax portal", "Activity audit & bylaws verification", "CIT (Exemptions) review", "12A & 80G order grant"],
    faqs: [{ q: "Can a newly formed trust apply for 12A & 80G?", a: "Yes, new trusts can apply for provisional 3-year registration immediately." }]
  },
  "12a-registration": {
    title: "12A Registration (NGO Tax Exemption)",
    category: "Registration",
    icon: "bi-file-earmark-text",
    price: "₹5,999",
    timeline: "15 - 20 Working Days",
    overview: "Statutory income tax exemption granting zero-tax status on all charitable surplus generated by an NGO, Trust, or Section 8 Company.",
    benefits: ["Zero tax on trust revenue & surplus", "Perpetual tax shield for non-profit assets", "Eligibility for government project funding", "Institutional credibility"],
    documents: ["Trust Deed / Incorporation Certificate", "Trustee KYC Documents", "Premises Proof & NOC", "Past Activity Report"],
    process: ["Income Tax Form 10A filing", "Sub-commissioner review", "Order issuance under Section 12AB", "Certificate handover"],
    faqs: [{ q: "Does 12A need renewal?", a: "Yes, provisional registration is converted to regular 5-year registration." }]
  },
  "80g-registration": {
    title: "80G Registration (Donor Tax Rebate)",
    category: "Registration",
    icon: "bi-hand-thumbs-up",
    price: "₹5,999",
    timeline: "15 - 20 Working Days",
    overview: "Income tax authorization granting 50% tax deduction certificates to individual and corporate donors contributing to your charitable institution.",
    benefits: ["Attracts large individual & corporate donors", "CSR funding qualification", "Official 80G receipt generation", "Enhanced financial transparency"],
    documents: ["12A Registration Order", "Trust Deed & MOA", "Audit Reports (if applicable)", "List of Donors & Activities"],
    process: ["Form 10A submission", "Verification by Income Tax Department", "Issuance of 80G certificate", "Portal setup for Form 10BD filing"],
    faqs: [{ q: "Can 80G be applied without 12A?", a: "12A and 80G are typically applied together, as 12A is a prerequisite." }]
  },
  "barcode-registration": {
    title: "GS1 Barcode Registration",
    category: "Registration",
    icon: "bi-upc-scan",
    price: "₹4,999",
    timeline: "2 - 4 Working Days",
    overview: "Official GS1 global barcodes (EAN-13 / UPC) mandatory for retail distribution, supermarkets, Amazon, and international product listings.",
    benefits: ["Mandatory for retail supermarket shelves", "Required for Amazon/Flipkart listings", "Global unique product identification", "Inventory management tracking"],
    documents: ["Company PAN & Registration Certificate", "Balance Sheet / Turnover Certificate", "GST Certificate", "Cancelled Cheque"],
    process: ["GS1 India registration", "Product allocation & GTIN number issuance", "High-res barcode EPS/PNG generation", "Data handover"],
    faqs: [{ q: "How many barcodes are allocated in a pack?", a: "Standard allotments are 100, 1,000, 10,000, or 100,000 barcodes." }]
  },
  "bis-registration": {
    title: "BIS Certification (ISI / CRS)",
    category: "Registration",
    icon: "bi-patch-check",
    price: "₹14,999",
    timeline: "20 - 35 Working Days",
    overview: "Bureau of Indian Standards certification ensuring electronic goods, steel, toys, and industrial equipment meet Indian safety benchmarks.",
    benefits: ["Mandatory ISI mark compliance", "Customs clearance for electronics & steel", "Protection against counterfeit products", "Assurance of consumer safety"],
    documents: ["Factory Layout & Machinery List", "In-house Testing Equipment Details", "ISO 9001 Certificate", "Director/Signatory KYC"],
    process: ["Product testing at BIS lab", "Factory inspection audit", "Application compilation on Manakonline", "BIS License grant"],
    faqs: [{ q: "Is lab testing mandatory for BIS?", a: "Yes, sample products must pass testing in a BIS-approved laboratory." }]
  },
  "certificate-of-incumbency": {
    title: "Certificate of Incumbency",
    category: "Registration",
    icon: "bi-file-earmark-person",
    price: "₹2,499",
    timeline: "2 - 3 Working Days",
    overview: "Official legal document certifying the current officers, directors, shareholders, and corporate status of a company for international banks.",
    benefits: ["Overseas bank account opening", "Cross-border contract execution", "Foreign investor due diligence", "Legal proof of signing authority"],
    documents: ["Certificate of Incorporation", "Latest MCA MGT-7 & Form DIR-12", "Board Resolution", "Current Register of Members"],
    process: ["MCA record extraction", "Company Secretary certification & notarization", "Apostille verification (if needed)", "Digital & physical dispatch"],
    faqs: [{ q: "Who issues a Certificate of Incumbency in India?", a: "Drafted and certified by a practicing Company Secretary (CS) or CA." }]
  },
  "darpan-registration": {
    title: "NITI Aayog NGO Darpan Registration",
    category: "Registration",
    icon: "bi-person-vcard",
    price: "₹1,999",
    timeline: "2 - 3 Working Days",
    overview: "Unique identification portal run by NITI Aayog mandatory for all NGOs seeking central/state government grants and CSR funding.",
    benefits: ["Mandatory for Central Government grants", "Unique NGO Darpan ID", "Eligibility for CSR funding portals", "National portal listing"],
    documents: ["Trust Deed / Section 8 Certificate", "PAN of NGO", "PAN & Identity Proof of 3 Office Bearers", "Past Activity Summary"],
    process: ["Portal registration on NGO Darpan", "Trustee KYC mapping", "Activity write-up", "Darpan ID allocation"],
    faqs: [{ q: "Is Darpan registration free on government portal?", a: "Yes, the government portal has no fee; professional fee is for drafting and KYC mapping." }]
  },
  "digital-signature": {
    title: "Digital Signature Certificate (Class 3 DSC)",
    category: "Registration",
    icon: "bi-pen",
    price: "₹1,499",
    timeline: "1 - 2 Hours",
    overview: "Encrypted Class 3 USB token certificate with Signing & Encryption for MCA, Income Tax, GST, Trademark, and e-Tendering portals.",
    benefits: ["2-Year validity with secure USB token", "Signing + Encryption enabled", "Video e-KYC instant approval", "Works on all Government portals"],
    documents: ["Identity & Address Proof", "PAN Card", "Passport Photo", "Active Mobile & Email for OTP/Video KYC"],
    process: ["Paperless e-KYC application", "Quick 30-second video verification", "DSC issuance", "Physical USB token dispatch"],
    faqs: [{ q: "How long does video verification take?", a: "Under 1 minute on any smartphone." }]
  },
  "shop-act-registration": {
    title: "Shop & Establishment Registration",
    category: "Registration",
    icon: "bi-shop-window",
    price: "₹1,499",
    timeline: "2 - 5 Working Days",
    overview: "State labour department license regulating work hours, employee rights, and statutory opening permissions for retail and commercial offices.",
    benefits: ["Basic statutory proof for current accounts", "Permits legal retail operation", "Protects against municipal labour fines", "Easy online renewal"],
    documents: ["Proprietor / Director PAN & Identity Proof", "Premises Rent Agreement & Utility Bill", "Shop Photo with Name Board", "Employee Details"],
    process: ["State Labour portal application", "Document upload & fee payment", "Inspector review", "Registration certificate download"],
    faqs: [{ q: "Is Shop Act required for home-based offices?", a: "Yes, commercial current accounts typically require a Shop Act certificate." }]
  },
  "udyam-registration": {
    title: "Udyam / MSME Registration",
    category: "Registration",
    icon: "bi-building-check",
    price: "₹999",
    timeline: "1 - 2 Working Days",
    overview: "Official central government MSME registration unlocking collateral-free bank loans, 1% interest subventions, and priority subsidies.",
    benefits: ["Priority Sector Bank Lending", "15% to 35% Capital Subsidies (PMEGP)", "50% rebate on Trademark & Patent fees", "Protection against delayed payments"],
    documents: ["Business Verification Details", "PAN Card of Entity / Owner", "Bank Account Details (Account & IFSC)", "Business Activity Details"],
    process: ["Udyam portal data validation", "ITR & GST portal sync", "Application filing", "Udyam Certificate generation"],
    faqs: [{ q: "Is an inspection required for Udyam?", a: "No, Udyam is 100% paperless and auto-verified online." }]
  },
  "fire-license": {
    title: "Fire NOC / Fire Safety Certificate",
    category: "Registration",
    icon: "bi-fire",
    price: "₹6,999",
    timeline: "15 - 25 Working Days",
    overview: "State Fire Department clearance ensuring commercial buildings, factories, hotels, and schools comply with fire safety protocols.",
    benefits: ["Mandatory for commercial trade licenses", "Required for building completion & occupancy", "Ensures workplace safety compliance", "Protects against legal seal-off"],
    documents: ["Building Architectural Layout Plans", "Fire Fighting Equipment Installation Proof", "Building Stability Certificate", "Property Tax Receipt"],
    process: ["Fire safety drawing audit", "Application submission to Chief Fire Officer (CFO)", "On-site physical inspection", "Fire NOC grant"],
    faqs: [{ q: "How often does a Fire NOC need renewal?", a: "Renewable annually or triennially depending on state rules." }]
  },
  "legal-name-change": {
    title: "Legal Name Change (Gazette Notification)",
    category: "Registration",
    icon: "bi-pencil-square",
    price: "₹2,999",
    timeline: "15 - 30 Working Days",
    overview: "Complete legal procedure to officially change an individual's name through newspaper advertisements and Central/State Gazette Publication.",
    benefits: ["Official Central Gazette publication", "Update passport, PAN, bank accounts & degrees", "Legally recognized across India", "Full documentation support"],
    documents: ["Current ID Proof", "Affidavit on Stamp Paper", "Two Passport Size Photos", "Newspaper Advertisement Copies"],
    process: ["Affidavit drafting & notarization", "Newspaper publication in 2 dailies", "Central Gazette Department filing", "Gazette notification download"],
    faqs: [{ q: "Is Gazette publication mandatory for name change?", a: "Yes, Gazette publication is required to update passports and government records." }]
  },
  "water-testing": {
    title: "Commercial Water Testing Report (NABL)",
    category: "Registration",
    icon: "bi-droplet",
    price: "₹3,499",
    timeline: "5 - 7 Working Days",
    overview: "NABL-accredited laboratory chemical and microbiological water analysis report mandatory for FSSAI licenses, food units, and industries.",
    benefits: ["NABL accredited lab test report", "Mandatory for FSSAI State/Central licenses", "Tests 30+ physical, chemical & microbial parameters", "Valid for all statutory audits"],
    documents: ["Water Source Details (Borewell/Municipal)", "Sample Collection Address", "FSSAI Application Reference", "Business Proof"],
    process: ["Sterile sample collection guidance", "Laboratory chemical analysis (IS 10500)", "Microbial culture testing", "Signed NABL Report dispatch"],
    faqs: [{ q: "Which standard is tested for drinking/food water?", a: "IS 10500:2012 Drinking Water Specification." }]
  },
  "food-testing": {
    title: "Food Product Nutritional Testing (NABL)",
    category: "Registration",
    icon: "bi-cup-hot",
    price: "₹4,999",
    timeline: "7 - 10 Working Days",
    overview: "NABL-accredited nutritional profile, shelf-life testing, and heavy metal screening required for retail packaged food labeling.",
    benefits: ["FSSAI compliant Nutritional Facts panel", "Shelf-life and stability validation", "Heavy metal and preservative testing", "Mandatory for commercial packaging"],
    documents: ["Product Sample (Packaged)", "Ingredient List & Recipe formulation", "FSSAI License Copy", "Testing Parameter Scope"],
    process: ["Sample dispatch to NABL lab", "Nutritional & microbial screening", "Report generation", "FSSAI label format drafting"],
    faqs: [{ q: "What parameters are tested?", a: "Energy, Protein, Carbohydrates, Fats, Sugar, Sodium, and Preservatives." }]
  },

  // ===========================================================================
  // 3. TRADEMARK & IP (17 Services)
  // ===========================================================================
  "trademark-registration": {
    title: "Trademark Registration",
    category: "Trademark",
    icon: "bi-shield-check",
    price: "₹1,899",
    timeline: "1 - 2 Working Days",
    overview: "Protect your brand name, logo, or slogan from infringement with nationwide legal protection and immediate right to use the ™ symbol.",
    benefits: ["Exclusive brand ownership across India", "Immediate right to use ™ symbol", "Valid for 10 years and renewable", "Protects against copycats"],
    documents: ["Applicant Identity Proof & PAN", "High-Resolution Logo Image", "Udyam Certificate (for 50% govt fee rebate)", "Form TM-48 (Power of Attorney)"],
    process: ["Comprehensive TM public search", "Class classification (1-45)", "IP India portal online filing", "TM Application Number issuance"],
    faqs: [{ q: "What is the government fee for Trademark?", a: "₹4,500 for Individuals/MSMEs, ₹9,000 for large enterprises." }]
  },
  "trademark-objection": {
    title: "Trademark Objection Reply",
    category: "Trademark",
    icon: "bi-exclamation-triangle",
    price: "₹2,999",
    timeline: "3 - 5 Working Days",
    overview: "Professional legal reply drafting by trademark attorneys responding to Examination Reports issued under Section 9 or 11.",
    benefits: ["Drafted by experienced IP attorneys", "Cites relevant case laws & precedents", "Prevents application abandonment", "High clearance success rate"],
    documents: ["Examination Report Copy", "Proof of Prior Brand Usage (Invoices/Bills)", "Power of Attorney", "Brand Turnover Details"],
    process: ["Examination Report grounds review", "Legal response formulation with evidence", "Filing on IP India portal", "Tracking examination status"],
    faqs: [{ q: "What is the deadline to reply to an objection?", a: "Within 30 days from the date of the Examination Report." }]
  },
  "trademark-certificate": {
    title: "Trademark Certificate Issuance",
    category: "Trademark",
    icon: "bi-patch-check",
    price: "₹1,499",
    timeline: "2 - 3 Working Days",
    overview: "Statutory assistance to expedite and secure your official Gold-Sealed Registration Certificate authorizing the use of the ® symbol.",
    benefits: ["Official Registration Certificate (Form O-3)", "Right to use the ® symbol", "10-Year registered status", "Asset creation for franchising"],
    documents: ["TM Application Number", "Journal Publication Proof", "Power of Attorney"],
    process: ["Journal opposition period verification", "Registrar compliance check", "Certificate generation & delivery"],
    faqs: [{ q: "When is the certificate issued?", a: "After 4 months of advertisement in the Trademark Journal with zero opposition." }]
  },
  "trademark-opposition": {
    title: "Trademark Opposition Filing / Counter",
    category: "Trademark",
    icon: "bi-shield-exclamation",
    price: "₹6,999",
    timeline: "5 - 10 Working Days",
    overview: "Filing or defending Notice of Opposition (Form TM-O) before the Trademark Registry to prevent conflicting marks from getting registered.",
    benefits: ["Stop competitors from copying your mark", "Defend your brand against malicious claims", "Handled by senior IP litigation advocates", "Official Registry representation"],
    documents: ["TM Journal Details", "Evidence of Prior Use & Goodwill", "Notice of Opposition (TM-O)", "Affidavit of Evidence"],
    process: ["Opposition drafting (Notice/Counter-Statement)", "Evidence on affidavit compilation", "Registry filing", "Pleadings management"],
    faqs: [{ q: "What is the time limit to oppose a trademark?", a: "Within 120 days of its advertisement in the TM Journal." }]
  },
  "trademark-hearing": {
    title: "Trademark Hearing Representation",
    category: "Trademark",
    icon: "bi-mic",
    price: "₹4,999",
    timeline: "On Scheduled Date",
    overview: "Appearance and oral representation by senior trademark attorneys before the Trademark Hearing Officer via Virtual Hearing.",
    benefits: ["Professional argument by IP advocate", "Preparation of written submissions", "High rate of acceptance to Journal", "Virtual hearing support"],
    documents: ["Hearing Notice Copy", "Written Submissions & Case Citations", "Power of Attorney (TM-48)", "Usage Invoices"],
    process: ["Hearing file preparation", "Pre-hearing client briefing", "Live representation before Hearing Officer", "Follow-up order tracking"],
    faqs: [{ q: "Are trademark hearings conducted online?", a: "Yes, hearings are conducted virtually via video conferencing." }]
  },
  "trademark-rectification": {
    title: "Trademark Rectification",
    category: "Trademark",
    icon: "bi-pencil-square",
    price: "₹7,999",
    timeline: "15 - 30 Working Days",
    overview: "Legal proceeding to remove, cancel, or modify an erroneously registered or unused trademark from the Trademark Register.",
    benefits: ["Cancel unused conflicting marks (5+ years)", "Correct errors in registered marks", "Clear brand path for expansion", "High Court / IP Division filing"],
    documents: ["Form TM-26 / TM-P Application", "Grounds of Non-use or Fraud", "Proof of Aggrieved Person Status", "Supporting Invoices"],
    process: ["Drafting Rectification petition", "Registry / High Court filing", "Service of notice to registered proprietor", "Tribunal hearings"],
    faqs: [{ q: "Can a mark be cancelled for non-use?", a: "Yes, if it has not been used continuously for 5 years." }]
  },
  "tm-infringement-notice": {
    title: "Trademark Cease & Desist Notice",
    category: "Trademark",
    icon: "bi-file-earmark-break",
    price: "₹3,499",
    timeline: "2 - 3 Working Days",
    overview: "Formal legal Cease and Desist notice drafted and served by IP advocates demanding immediate stoppage of brand theft and trademark infringement.",
    benefits: ["Immediate legal warning to copycats", "Pre-litigation settlement opportunity", "Establishes formal damages claim", "Signed by practicing IP lawyer"],
    documents: ["Registered TM Certificate", "Evidence of Infringer's Products/Website", "Comparison Chart", "Sales Loss Details"],
    process: ["Infringement analysis", "Legal notice formulation", "Speed Post & Email service to infringer", "Settlement negotiation support"],
    faqs: [{ q: "What happens after sending a Cease & Desist notice?", a: "Infringers often comply within 15 days to avoid commercial court litigation." }]
  },
  "trademark-renewal": {
    title: "Trademark Renewal (10 Years)",
    category: "Trademark",
    icon: "bi-arrow-repeat",
    price: "₹2,499",
    timeline: "2 - 3 Working Days",
    overview: "Renew your registered trademark for another 10-year period via Form TM-R before or within 6 months of expiration.",
    benefits: ["Extends brand monopoly for 10 years", "Preserves uninterrupted legal protection", "Avoids trademark cancellation & restoration fines", "Updated Registry status"],
    documents: ["TM Registration Certificate", "Applicant PAN & Address", "Power of Attorney (TM-48)"],
    process: ["Due date audit", "Form TM-R compilation", "Payment of ₹9,000 government renewal fee", "Renewal Certificate download"],
    faqs: [{ q: "When can a trademark be renewed?", a: "Within 6 months before the expiry date." }]
  },
  "trademark-transfer": {
    title: "Trademark Assignment / Transfer",
    category: "Trademark",
    icon: "bi-arrow-left-right",
    price: "₹4,999",
    timeline: "7 - 15 Working Days",
    overview: "Legal transfer of ownership rights of a trademark from one entity/person to another with or without the goodwill of the business.",
    benefits: ["Monetize or sell brand assets", "Seamless transfer during mergers & acquisitions", "Update owner details in Registry", "Drafted Deed of Assignment"],
    documents: ["Drafted Trademark Assignment Deed", "NOC from Assignor", "KYC of Assignee", "TM Registration Certificates"],
    process: ["Deed drafting with goodwill clauses", "Stamp duty payment & notarization", "Form TM-P filing with Registrar", "Registry ownership transfer"],
    faqs: [{ q: "Can a pending trademark be transferred?", a: "Yes, pending applications can be assigned." }]
  },
  "expedited-tm-registration": {
    title: "Expedited Trademark Examination",
    category: "Trademark",
    icon: "bi-lightning-charge",
    price: "₹4,999",
    timeline: "3 - 7 Working Days (Exam)",
    overview: "Fast-track processing under Rule 34 ensuring examination of your trademark application within days instead of standard months.",
    benefits: ["Examination Report in under 7 days", "Fast-track Journal publication", "Ideal for Amazon Brand Registry deadlines", "Accelerated registration"],
    documents: ["Form TM-M Application", "Grounds for expedited request", "DSC & Power of Attorney"],
    process: ["Filing Form TM-M on IP India", "Expedited fee payment", "Immediate examination assignment", "Priority processing"],
    faqs: [{ q: "What is the govt fee for expedited TM?", a: "₹20,000 for MSMEs/Individuals, ₹40,000 for others." }]
  },
  "logo-designing": {
    title: "Logo Designing (Brand Identity)",
    category: "Trademark",
    icon: "bi-palette",
    price: "₹2,499",
    timeline: "3 - 5 Working Days",
    overview: "Custom, copyright-free corporate logo design crafted by graphic designers specifically optimized for trademark registration.",
    benefits: ["100% Unique & Trademarkable designs", "3 Initial design concepts", "Vector EPS, SVG, PNG & AI files", "Full commercial copyright handover"],
    documents: ["Business Description & Scope", "Color Preferences & Tagline", "Target Audience Details"],
    process: ["Creative briefing", "Concept design presentation", "Revisions & refinements", "Final vector asset delivery"],
    faqs: [{ q: "Do I get full copyright ownership?", a: "Yes, complete commercial copyright is transferred to you." }]
  },
  "design-registration": {
    title: "Industrial Design Registration",
    category: "Trademark",
    icon: "bi-vector-pen",
    price: "₹4,999",
    timeline: "10 - 15 Working Days",
    overview: "Protects the unique visual design, shape, pattern, or ornament of a manufactured article under the Designs Act, 2000.",
    benefits: ["10-Year monopoly on product aesthetics (extendable to 15)", "Stops competitors from copying product shape", "Commercial asset creation", "Protection for consumer goods & packaging"],
    documents: ["7-Angle High-Res Photos/Drawings", "Statement of Novelty", "Product Sample/Specification", "Applicant KYC"],
    process: ["Design novelty search", "Representation sheet compilation", "Application filing at Patent Office Kolkata", "Design Certificate grant"],
    faqs: [{ q: "Does design protect internal mechanics?", a: "No, it protects only the external visual appearance." }]
  },
  "design-objection": {
    title: "Design Objection Response",
    category: "Trademark",
    icon: "bi-exclamation-circle",
    price: "₹3,999",
    timeline: "5 - 7 Working Days",
    overview: "Legal response drafting addressing objections raised in the Design Examination Report by the Patent Office Controller.",
    benefits: ["Drafted by registered Patent/Design Agents", "Address novelty & prior publication claims", "Prevents application abandonment", "Controller hearing support"],
    documents: ["Design Examination Report", "Prior Art Comparative Analysis", "Amended Representation Sheets"],
    process: ["Grounds review", "Technical written submission", "Filing response with Controller", "Compliance clearance"],
    faqs: [{ q: "What is the response timeline?", a: "Within 6 months from the date of the examination report." }]
  },
  "copyright-registration": {
    title: "Copyright Registration",
    category: "Trademark",
    icon: "bi-c-circle",
    price: "₹3,999",
    timeline: "15 - 30 Working Days",
    overview: "Legal protection for software source code, literary works, books, musical compositions, cinematograph films, and artistic websites.",
    benefits: ["Lifetime + 60 Years legal protection", "Exclusive rights to copy, sell & license", "Protection against digital piracy & code theft", "Court evidence of ownership"],
    documents: ["2 Copies of Work (Source Code/Manuscript)", "NOC from Author / Developer", "Applicant Identity Proof & PAN", "Power of Attorney"],
    process: ["Copyright Office portal filing (Form XIV)", "Diary Number issuance", "30-Day mandatory waiting period", "Certificate of Registration (ROC)"],
    faqs: [{ q: "Can software source code be copyrighted?", a: "Yes, source code is protected under literary works." }]
  },
  "copyright-objection": {
    title: "Copyright Objection / Discrepancy Reply",
    category: "Trademark",
    icon: "bi-exclamation-circle",
    price: "₹2,999",
    timeline: "3 - 5 Working Days",
    overview: "Professional drafting to resolve discrepancy letters and formal objection notices issued by the Copyright Office examiner.",
    benefits: ["Cites Copyright Act provisions", "Rectifies procedural discrepancies", "Speeds up ROC certificate grant", "Advocate representation"],
    documents: ["Discrepancy Letter Copy", "Amended Work Sheets / NOCs", "Power of Attorney"],
    process: ["Discrepancy ground audit", "Legal response formulation", "Official portal submission", "Clearance follow-up"],
    faqs: [{ q: "How much time is given to reply?", a: "Usually 30 days from the discrepancy notice." }]
  },
  "patent-registration": {
    title: "Patent Search & Provisional Filing",
    category: "Trademark",
    icon: "bi-lightbulb",
    price: "₹9,999",
    timeline: "10 - 20 Working Days",
    overview: "Patentability search, provisional specification drafting, and filing at the Indian Patent Office to secure a priority filing date.",
    benefits: ["Secures 12-Month priority date", "20-Year legal monopoly upon grant", "Monetize via technology licensing", "Investor attraction for R&D"],
    documents: ["Detailed Invention Disclosure Sheet", "Flowcharts, Block Diagrams & Drawings", "Applicant & Inventor KYC", "Form 1 & Form 2"],
    process: ["Global Patentability search (Novelty check)", "Provisional specification drafting", "Form 1, 2, 3, 5 filing on IP India", "Patent Application Number allocation"],
    faqs: [{ q: "How long is a patent valid?", a: "20 years from the date of filing." }]
  },
  "trademark-protection": {
    title: "Trademark Watch & Monitoring Service",
    category: "Trademark",
    icon: "bi-shield-lock",
    price: "₹4,999",
    timeline: "Annual Subscription",
    overview: "Continuous automated scanning of every weekly Trademark Journal to identify and alert you of copycat trademarks before they get registered.",
    benefits: ["Weekly scanning of all 45 classes", "Early alert of infringing applications", "Timely opposition within 120-day window", "Comprehensive brand security"],
    documents: ["List of your Registered / Pending Marks", "Competitor Watch List (Optional)"],
    process: ["AI Journal search setup", "Weekly matching report generation", "Infringement risk alerts", "Opposition recommendation"],
    faqs: [{ q: "How often is the TM Journal published?", a: "Every Monday by the Trademark Registry." }]
  },

  // ===========================================================================
  // 4. GST & INDIRECT TAXES (10 Services)
  // ===========================================================================
  "gst-registration": {
    title: "GST Registration",
    category: "GST",
    icon: "bi-receipt",
    price: "₹1,499",
    timeline: "3 - 7 Working Days",
    overview: "Obtain your 15-digit Goods and Services Tax Identification Number (GSTIN) to legally collect tax, claim Input Tax Credit (ITC), and trade interstate.",
    benefits: ["Collect GST & claim Input Tax Credit", "Mandatory for selling on Amazon/Flipkart", "Interstate business trade authorization", "Boosts enterprise credibility"],
    documents: ["PAN & Identity Proof of Promoters", "Business Address Proof (Electricity Bill)", "Rent Agreement & NOC", "Bank Cancelled Cheque"],
    process: ["TRN generation on GST Portal", "Form GST REG-01 compilation", "Identity verification & e-KYC", "GSTIN Certificate issuance"],
    faqs: [{ q: "What is the turnover threshold for GST?", a: "₹40 Lakhs for goods (₹20 Lakhs for special states) and ₹20 Lakhs for services." }]
  },
  "gst-return-filing-by-accountant": {
    title: "Monthly GST Return Filing",
    category: "GST",
    icon: "bi-file-earmark-spreadsheet",
    price: "₹1,499",
    timeline: "Monthly Retainer",
    overview: "Dedicated chartered accountant service for accurate monthly compilation and filing of GSTR-1, GSTR-3B, and Input Tax Credit reconciliation.",
    benefits: ["Zero penalty compliance guarantee", "Maximum Input Tax Credit (ITC) optimization", "GSTR-2B automated reconciliation", "Dedicated CA/Accountant assigned"],
    documents: ["Monthly Sales & Purchase Invoices", "Bank Statements", "GST Portal Credentials"],
    process: ["Sales/Purchase data import into LEDGERS", "GSTR-1 outward return filing", "GSTR-3B tax calculation & offset", "Challan generation & acknowledgement"],
    faqs: [{ q: "What are the due dates for GST returns?", a: "GSTR-1 by 11th and GSTR-3B by 20th of every month." }]
  },
  "gst-lut-form": {
    title: "GST LUT Filing (Zero-Rated Exports)",
    category: "GST",
    icon: "bi-file-earmark-text",
    price: "₹999",
    timeline: "1 - 2 Working Days",
    overview: "Letter of Undertaking (LUT) submission on the GST portal enabling exporters to export goods and services without paying IGST upfront.",
    benefits: ["Zero working capital blockage in IGST refunds", "Export goods/services without tax payment", "Valid for entire financial year", "Fast online approval"],
    documents: ["GSTIN Details", "IEC Code", "KYC of 2 Independent Witnesses", "Authorized Signatory DSC/EVC"],
    process: ["Form GST RFD-11 compilation", "Witness verification mapping", "Portal filing with EVC", "ARN & LUT approval generation"],
    faqs: [{ q: "How long is a GST LUT valid?", a: "Valid for one complete Financial Year (1st April to 31st March)." }]
  },
  "gst-notice": {
    title: "GST Notice Reply & Representation",
    category: "GST",
    icon: "bi-exclamation-triangle",
    price: "₹2,499",
    timeline: "2 - 5 Working Days",
    overview: "Expert consultation and formal legal reply drafting for show-cause notices (SCN), ASMT-10, DRC-01, and ITC mismatch notices.",
    benefits: ["Drafted by GST practitioners & CAs", "ITC mismatch & GSTR-2B vs 3B defense", "Avoid heavy penalties and bank attachments", "Departmental hearing representation"],
    documents: ["GST Notice Copy", "Relevant Invoices & E-Way Bills", "Past Return Acknowledgements", "Reconciliation Sheets"],
    process: ["Notice grounds & tax demand analysis", "Factual reconciliation drafting", "Filing reply in Form DRC-06 / ASMT-11", "Officer follow-up"],
    faqs: [{ q: "What is an ASMT-10 notice?", a: "A notice pointing out discrepancies in return filings compared to portal data." }]
  },
  "gst-annual-return-filing-gstr-9": {
    title: "GST Annual Return Filing (GSTR-9 / 9C)",
    category: "GST",
    icon: "bi-calendar-check",
    price: "₹3,999",
    timeline: "5 - 7 Working Days",
    overview: "Comprehensive annual consolidation of all monthly returns, outward supplies, inward taxes, and ITC reconciliation for the financial year.",
    benefits: ["Full financial year tax reconciliation", "Correct previous return errors", "Avoid ₹200/day late filing penalties", "Auditor reconciliation (GSTR-9C)"],
    documents: ["Audited Financial Statements", "12 Months GSTR-1 & GSTR-3B copies", "Purchase Registers & GSTR-2A/2B data"],
    process: ["Data compilation & ITC audit", "Form GSTR-9 compilation", "Tax liability adjustment via DRC-03", "Final submission on GST portal"],
    faqs: [{ q: "Who is required to file GSTR-9?", a: "Mandatory for registered taxpayers with annual turnover exceeding ₹2 Crores." }]
  },
  "gst-registration-for-foreigners": {
    title: "GST Registration for Foreign Non-Residents",
    category: "GST",
    icon: "bi-globe2",
    price: "₹7,999",
    timeline: "7 - 12 Working Days",
    overview: "Non-Resident Taxable Person (NRTP) or OIDAR GST registration for foreign businesses supplying digital/physical goods into India.",
    benefits: ["Legally sell software/goods in India", "OIDAR tax compliance", "Designate Indian Authorized Representative", "Direct tax collection enablement"],
    documents: ["Foreign Company Incorporation Certificate", "Apostilled Tax ID of Parent Entity", "Indian Authorized Representative Identity Proof & PAN", "Bank Account Details"],
    process: ["Indian authorized signatory appointment", "Form GST REG-09 submission", "Advance tax deposit processing", "NRTP/OIDAR GSTIN issuance"],
    faqs: [{ q: "What is an OIDAR service?", a: "Online Information Database Access and Retrieval (e.g. cloud SaaS, digital media, streaming)." }]
  },
  "gst-amendment": {
    title: "GST Core / Non-Core Amendment",
    category: "GST",
    icon: "bi-pencil-square",
    price: "₹1,499",
    timeline: "2 - 4 Working Days",
    overview: "Modify business trade name, address, additional place of business, partners/directors, or bank details on your active GSTIN.",
    benefits: ["Update additional warehouse/branch locations", "Change registered office address", "Add/Remove partners and directors", "Keep GST portal records compliant"],
    documents: ["Proof of New Address / Electricity Bill", "Partner/Director Change Resolutions", "New Bank Account Cheque"],
    process: ["Form GST REG-14 preparation", "Supporting document upload", "EVC/DSC authentication", "Amended REG-06 Certificate download"],
    faqs: [{ q: "What is a Core Amendment in GST?", a: "Changes to business legal name, principal place of business, or addition of directors." }]
  },
  "gst-revocation": {
    title: "GST Revocation / Cancellation Cancellation",
    category: "GST",
    icon: "bi-arrow-counterclockwise",
    price: "₹2,999",
    timeline: "5 - 10 Working Days",
    overview: "Application to restore and unblock a GSTIN cancelled suo-motu by the tax officer due to non-filing of returns.",
    benefits: ["Restore cancelled GSTIN number", "Reclaim blocked Input Tax Credit (ITC)", "Resume active commercial billing", "Clear pending tax defaults"],
    documents: ["Suo-Motu Cancellation Order Copy", "Pending Return Data", "Tax Payment Challans", "Revocation Justification Letter"],
    process: ["Pending return backlog filing", "Form GST REG-21 submission", "Officer representation", "Revocation Order (REG-22) issuance"],
    faqs: [{ q: "What is the time limit for GST revocation?", a: "Within 90 days from the cancellation order date (extendable to 180 days with Commissioner approval)." }]
  },
  "gstr-10": {
    title: "GSTR-10 (GST Final Return on Surrender)",
    category: "GST",
    icon: "bi-file-earmark-check",
    price: "₹1,999",
    timeline: "2 - 3 Working Days",
    overview: "Mandatory final return to be filed within 3 months of GST cancellation to report closing stock inputs and settle final liabilities.",
    benefits: ["Complete statutory closure of GSTIN", "Avoid ₹10,000 notice penalties", "Close tax liability permanently", "Clean financial exit"],
    documents: ["GST Cancellation Order", "Closing Stock Balance Sheet", "Chartered Accountant Inventory Valuation Certificate"],
    process: ["Input tax closing balance calculation", "Form GSTR-10 compilation", "Tax payment via DRC-03 if applicable", "Final submission on portal"],
    faqs: [{ q: "When must GSTR-10 be filed?", a: "Within 3 months of cancellation date or cancellation order date, whichever is later." }]
  },
  "virtual-office-gstin": {
    title: "Virtual Office Address for GSTIN",
    category: "GST",
    icon: "bi-building",
    price: "₹11,999",
    timeline: "3 - 5 Working Days",
    overview: "Premium commercial business address with complete Rent Agreement, Electricity Bill, and NOC for new state GST registration without physical rent.",
    benefits: ["Expand into new states with multi-state GST", "100% Compliant for Amazon/Flipkart APOB/FBA", "No physical commercial office overheads", "Includes mail handling & signage support"],
    documents: ["Company Incorporation & PAN", "Director/Signatory KYC", "Primary State GST Certificate"],
    process: ["State location selection (e.g. Telangana/AP/Delhi)", "Commercial agreement & NOC execution", "GST application filing with address proof", "Officer verification & GSTIN grant"],
    faqs: [{ q: "Is virtual office legal for GST registration?", a: "Yes, fully legal with proper commercial lease agreements and property owner NOCs." }]
  },

  // ===========================================================================
  // 5. INCOME TAX (10 Services)
  // ===========================================================================
  "income-tax-e-filing": {
    title: "Individual / Salaried ITR Filing",
    category: "Income Tax",
    icon: "bi-file-earmark-text",
    price: "₹999",
    timeline: "1 - 2 Working Days",
    overview: "Expert CA preparation and filing of ITR-1 (Sahaj) or ITR-2 for salaried employees, capital gains earners, and individuals with rental income.",
    benefits: ["Maximize tax deductions under 80C, 80D, HRA", "Claim fast TDS refunds into bank account", "Mandatory for home loans & visa processing", "Prepared by certified CA"],
    documents: ["Form 16 / Form 16A", "Annual Information Statement (AIS) / Form 26AS", "Bank Statements", "Capital Gain Statements"],
    process: ["Form 26AS/AIS reconciliation", "Income & deduction computation", "ITR filing with e-Verification", "ITR-V Acknowledgement handover"],
    faqs: [{ q: "What is the basic exemption limit under new regime?", a: "Income up to ₹3 Lakhs is exempt; rebate under Section 87A makes income up to ₹7 Lakhs tax-free." }]
  },
  "business-itr-filing": {
    title: "Business / Presumptive ITR Filing",
    category: "Income Tax",
    icon: "bi-briefcase",
    price: "₹2,999",
    timeline: "2 - 4 Working Days",
    overview: "Filing ITR-3 or ITR-4 under presumptive taxation schemes (Section 44AD / 44ADA) for proprietorships, freelancers, and small businesses.",
    benefits: ["Declare 8%/6% presumptive profits without maintenance of books", "Tax savings under 44ADA for professionals (50% profits)", "Advance tax computation assistance", "Bank loan eligibility enhancement"],
    documents: ["Bank Account Statements", "Gross Turnover Summary / Invoices", "Form 26AS & AIS", "PAN & Identity Proof"],
    process: ["Turnover & profit computation", "Form ITR-3/ITR-4 preparation", "Tax payment challan creation", "Portal filing & e-verification"],
    faqs: [{ q: "Who can use Section 44ADA?", a: "Specified professionals (doctors, lawyers, engineers, IT consultants) with gross receipts up to ₹75 Lakhs." }]
  },
  "partnership-firm-llp-itr": {
    title: "Partnership Firm / LLP ITR (ITR-5)",
    category: "Income Tax",
    icon: "bi-diagram-3",
    price: "₹4,999",
    timeline: "3 - 5 Working Days",
    overview: "Annual statutory income tax filing (Form ITR-5) for partnership firms, LLPs, and Association of Persons taxed at flat 30% rate.",
    benefits: ["Partner remuneration & interest deduction planning", "Depreciation schedules calculation", "Flat tax calculation & MAT compliance", "CA certified computation"],
    documents: ["Audited/Unaudited Balance Sheet & P&L", "Partnership Deed / LLP Agreement", "Partner Capital Accounts", "Form 26AS"],
    process: ["Financial statement review", "Partner interest & salary adjustments", "Form ITR-5 compilation & DSC signing", "Acknowledgement generation"],
    faqs: [{ q: "Is tax audit mandatory for partnership firms?", a: "Mandatory if business turnover exceeds ₹1 Crore (₹10 Crores if 95%+ transactions are digital)." }]
  },
  "company-itr-filing": {
    title: "Company Income Tax Filing (ITR-6)",
    category: "Income Tax",
    icon: "bi-building",
    price: "₹6,999",
    timeline: "5 - 7 Working Days",
    overview: "Mandatory annual corporate tax return filing (Form ITR-6) with detailed balance sheet disclosures, MAT calculations, and tax audit reporting.",
    benefits: ["Mandatory statutory compliance under IT Act", "Carry forward business losses up to 8 years", "Minimum Alternate Tax (MAT) credit calculation", "DSC authorized filing"],
    documents: ["Audited Financial Statements (Balance Sheet & P&L)", "Form 3CD Tax Audit Report (if applicable)", "Form 26AS / AIS", "Director DSC"],
    process: ["Corporate profit computation", "Form ITR-6 XML compilation", "Signing with Director Class 3 DSC", "Filing & e-Acknowledgement"],
    faqs: [{ q: "What is the corporate tax rate in India?", a: "22% under Section 115BAA for domestic companies (plus surcharge & cess)." }]
  },
  "trust-ngo-tax-filing": {
    title: "Trust / NGO Tax Filing (ITR-7)",
    category: "Income Tax",
    icon: "bi-heart",
    price: "₹5,999",
    timeline: "5 - 7 Working Days",
    overview: "Specialized annual tax return filing for charitable trusts, Section 8 companies, and non-profits registered under Section 12A/10(23C).",
    benefits: ["Claim 100% tax exemption on trust income", "Report Form 10B/10BB audit disclosures", "Accumulation of income under Section 11(2)", "Maintain valid 12A status"],
    documents: ["Audited Accounts & Audit Report (Form 10B/10BB)", "12A & 80G Registration Orders", "Donation Registers & Form 10BD", "Trustee KYC"],
    process: ["Income application calculation (85% rule)", "Form ITR-7 compilation", "Filing with Digital Signature", "Acknowledgement delivery"],
    faqs: [{ q: "What is the 85% rule for charitable trusts?", a: "Trusts must apply at least 85% of their income toward charitable objects to claim full tax exemption." }]
  },
  "15ca-15cb-filing": {
    title: "Form 15CA & 15CB Filing (Foreign Remittance)",
    category: "Income Tax",
    icon: "bi-file-earmark-check",
    price: "₹3,999",
    timeline: "1 - 2 Working Days",
    overview: "Statutory Chartered Accountant certification (Form 15CB) and taxpayer declaration (Form 15CA) required by banks before remitting money abroad.",
    benefits: ["Mandatory for sending money outside India", "Double Taxation Avoidance Agreement (DTAA) benefits", "Fast-track bank clearance for wire transfer", "CA verified tax computation"],
    documents: ["Invoice from Foreign Vendor", "Agreement / Scope of Work", "Foreign Party Tax Residency Certificate (TRC) & Form 10F", "Remitter Bank Details"],
    process: ["DTAA & withholding tax applicability review", "Form 15CB CA certification", "Form 15CA Part C filing on IT portal", "Bank clearance handover"],
    faqs: [{ q: "When is Form 15CB mandatory?", a: "Mandatory if the remittance exceeds ₹5 Lakhs and is taxable in India." }]
  },
  "tan-registration": {
    title: "TAN Registration (Tax Deduction Account)",
    category: "Income Tax",
    icon: "bi-person-vcard",
    price: "₹999",
    timeline: "1 - 2 Working Days",
    overview: "10-digit alphanumeric code issued by the Income Tax Department mandatory for any business deducting or collecting tax at source (TDS/TCS).",
    benefits: ["Mandatory for deducting TDS from salaries/contractors", "Avoid ₹10,000 penalty for non-quoting TAN", "Deposit quarterly TDS challans", "Generate Form 16/16A"],
    documents: ["Entity PAN Card", "Authorized Signatory Identity Proof & PAN", "Business Office Address Proof"],
    process: ["Form 49B compilation", "NSDL portal submission", "Verification & payment", "TAN allotment letter download"],
    faqs: [{ q: "Can a PAN be used instead of TAN for deducting TDS?", a: "No, a dedicated TAN is legally mandatory for all TDS deductions and returns." }]
  },
  "tds-return-filing": {
    title: "Quarterly TDS Return Filing (Form 24Q / 26Q)",
    category: "Income Tax",
    icon: "bi-receipt",
    price: "₹1,999",
    timeline: "Quarterly Retainer",
    overview: "Quarterly compilation and filing of TDS returns on salaries (Form 24Q) and contractor/rent payments (Form 26Q) with Form 16 generation.",
    benefits: ["Zero penalty compliance", "Direct generation of Form 16 & Form 16A", "Avoid ₹200/day late fee under Section 234E", "Accurate challan matching on TRACES"],
    documents: ["Quarterly TDS Payment Challans (ITNS 281)", "Deductee PAN list with payment amounts", "Salary Sheets & Contract Invoices"],
    process: ["FVU file compilation on RPU", "NSDL validation check", "TIN-FC portal upload", "Form 16/16A download from TRACES"],
    faqs: [{ q: "What is the quarterly TDS return deadline?", a: "31st of the month following each quarter (July 31, Oct 31, Jan 31, May 31)." }]
  },
  "income-tax-notice": {
    title: "Income Tax Notice Reply (Section 143/148/139)",
    category: "Income Tax",
    icon: "bi-exclamation-triangle",
    price: "₹2,999",
    timeline: "2 - 5 Working Days",
    overview: "Expert CA response drafting for defective return notices (139(9)), intimation mismatches (143(1)), scrutiny notices (143(2)), or reassessments (148).",
    benefits: ["Handled by Senior Chartered Accountants", "E-Proceedings faceless portal reply", "Avoid heavy tax demands & bank freezes", "Complete reconciliation defense"],
    documents: ["Income Tax Notice Copy", "Original ITR Computation & Acknowledgement", "Bank Statements & Source Proofs", "AIS / 26AS Discrepancy Sheet"],
    process: ["Tax notice assessment", "Detailed written explanation drafting", "Filing response on e-Filing portal", "Faceless assessment follow-up"],
    faqs: [{ q: "What is a Section 143(1) intimation?", a: "A computer-generated notice showing calculations of refund or tax demand differences." }]
  },
  "revised-itr-return-itr-u": {
    title: "Updated ITR (ITR-U) / Revised Return",
    category: "Income Tax",
    icon: "bi-arrow-repeat",
    price: "₹2,499",
    timeline: "2 - 3 Working Days",
    overview: "File updated returns (ITR-U) for up to 2 past financial years to declare omitted income, rectify tax errors, and avoid prosecution.",
    benefits: ["Declare omitted income up to 24 months later", "Avoid tax evasion notices and penalty proceedings", "Correct previous filing mistakes", "Update bank loan records"],
    documents: ["Original ITR Acknowledgement (if filed)", "Bank Statements of the relevant FY", "Form 26AS & AIS of past year", "Additional Income Proofs"],
    process: ["Additional tax & interest computation (25%/50% rule)", "ITR-U XML compilation", "Challan payment (ITNS 280)", "Filing on Income Tax portal"],
    faqs: [{ q: "How many years back can ITR-U be filed?", a: "Up to 24 months from the end of the relevant assessment year." }]
  },

  // ===========================================================================
  // 6. MCA & CORPORATE COMPLIANCE (22 Services)
  // ===========================================================================
  "company-compliance": {
    title: "Annual ROC Compliance for Pvt Ltd",
    category: "MCA",
    icon: "bi-building-check",
    price: "₹7,899",
    timeline: "10 - 15 Working Days",
    overview: "End-to-end statutory ROC compliance including filing Form AOC-4 (Financial Statements) and Form MGT-7/7A (Annual Returns) with the MCA.",
    benefits: ["Mandatory compliance under Companies Act, 2013", "Avoid ₹100/day penalties", "Protect directors from disqualification", "Maintain active company status on MCA"],
    documents: ["Audited Financial Statements (Balance Sheet & P&L)", "Auditor's Report & Board's Report", "List of Shareholders & Directors", "Director DSCs"],
    process: ["Board resolution & report preparation", "Form AOC-4 filing (Financials)", "Form MGT-7 filing (Annual Return)", "DIR-3 KYC verification"],
    faqs: [{ q: "What are the due dates for AOC-4 and MGT-7?", a: "AOC-4 within 30 days and MGT-7 within 60 days of the Annual General Meeting (AGM)." }]
  },
  "llp-compliance": {
    title: "Annual LLP Compliance (Form 11 & Form 8)",
    category: "MCA",
    icon: "bi-diagram-3",
    price: "₹4,999",
    timeline: "5 - 7 Working Days",
    overview: "Statutory annual compliance for LLPs covering Form 11 (Annual Return) by May 30th and Form 8 (Statement of Accounts & Solvency) by October 30th.",
    benefits: ["Avoid massive ₹100/day per form penalties", "Protect designated partners from debarment", "Keep LLP active on MCA registry", "Full documentation drafting"],
    documents: ["Statement of Accounts & Solvency", "Contribution & Partner Details", "DSC of Designated Partner", "LLP Agreement"],
    process: ["Form 11 preparation & filing by May 30", "Form 8 compilation & filing by Oct 30", "Payment of MCA government fees", "Challan generation"],
    faqs: [{ q: "What is the penalty for late filing of LLP Form 11?", a: "₹100 per day with no maximum cap until filed." }]
  },
  "opc-compliance": {
    title: "One Person Company Annual Compliance",
    category: "MCA",
    icon: "bi-person-workspace",
    price: "₹5,999",
    timeline: "5 - 7 Working Days",
    overview: "Statutory annual filings for OPCs including Form AOC-4 (within 180 days of FY close), MGT-7A, and Director DIR-3 KYC.",
    benefits: ["Exempt from holding formal AGM", "Simplified single-director Board resolutions", "Avoid statutory late fines", "Active corporate credit profile"],
    documents: ["Audited Balance Sheet & P&L", "Bank Statements", "Director DSC", "DIR-3 KYC details"],
    process: ["Financial statement compilation", "Form AOC-4 (OPC) filing within 180 days", "Form MGT-7A annual return submission", "Director KYC renewal"],
    faqs: [{ q: "Does an OPC need an Annual General Meeting?", a: "No, OPCs are legally exempt from holding an AGM." }]
  },
  "name-change-company": {
    title: "Company Name Change",
    category: "MCA",
    icon: "bi-pencil-square",
    price: "₹4,999",
    timeline: "10 - 15 Working Days",
    overview: "Complete procedure to rebrand and officially change a company's name via RUN approval, EGM shareholder resolution, and Form MGT-14/INC-24.",
    benefits: ["Official Certificate of Incorporation on name change", "Updated MOA & AOA with new identity", "Rebranding protection across India", "Full MCA drafting"],
    documents: ["Proposed Name List", "Board & EGM Special Resolutions", "Altered MOA & AOA", "Director DSCs"],
    process: ["RUN name reservation on MCA portal", "Extraordinary General Meeting (EGM) notice", "Form MGT-14 filing", "Form INC-24 approval and new COI"],
    faqs: [{ q: "Is Central Government approval needed for name change?", a: "Yes, granted via Form INC-24 by the Registrar of Companies (ROC)." }]
  },
  "registered-office-change": {
    title: "Registered Office Address Change",
    category: "MCA",
    icon: "bi-geo-alt",
    price: "₹3,999",
    timeline: "5 - 15 Working Days",
    overview: "Shift your company's registered office within the same city (INC-22), to another ROC jurisdiction, or across states with Regional Director approval.",
    benefits: ["Update official MCA registry address", "Ensure legal delivery of statutory notices", "Interstate / intra-state shifting support", "Full newspaper notice management"],
    documents: ["New Premises Rent Agreement & NOC", "Electricity Bill (latest 2 months)", "Board & Special Resolutions", "Director DSC"],
    process: ["Board / EGM Resolution drafting", "Form INC-22 filing (within same ROC)", "RD / Form INC-23 petition (if state change)", "New Master Data update"],
    faqs: [{ q: "What form is filed for office change within the same city?", a: "Form INC-22 within 30 days of the change." }]
  },
  "din-ekyc-filing": {
    title: "DIR-3 KYC Filing (Director KYC)",
    category: "MCA",
    icon: "bi-person-check",
    price: "₹499",
    timeline: "1 Working Day",
    overview: "Annual mandatory KYC verification for every individual holding a Director Identification Number (DIN) due by September 30th every year.",
    benefits: ["Keeps DIN active for MCA signatures", "Avoids massive ₹5,000 deactivation penalty", "Fast OTP/Web-based submission", "Immediate approval"],
    documents: ["Director PAN & Identity Proof", "Active Mobile & Email for OTPs", "Passport (for foreign directors)", "Class 3 DSC (for first-time eKYC)"],
    process: ["Web-DIR-3 KYC / eForm verification", "OTP dual-authentication", "MCA portal upload", "Zero fee confirmation receipt"],
    faqs: [{ q: "What happens if DIR-3 KYC is not filed by Sept 30?", a: "The DIN is deactivated as 'Deactivated due to non-filing of DIR-3 KYC' with a ₹5,000 reactivation fee." }]
  },
  "din-reactivation": {
    title: "DIN Reactivation (Deactivated DIN)",
    category: "MCA",
    icon: "bi-arrow-clockwise",
    price: "₹1,499",
    timeline: "1 - 2 Working Days",
    overview: "Reactivate a deactivated Director Identification Number by clearing pending DIR-3 KYC with government fee processing.",
    benefits: ["Restore director signing authority on MCA", "Re-enable company incorporation & filing rights", "Quick turnaround", "Penalty settlement guidance"],
    documents: ["Director PAN & Identity Proof (Self-Attested)", "Passport Photo", "Valid Class 3 DSC", "₹5,000 Govt Penalty Challan"],
    process: ["Form DIR-3 KYC eForm compilation", "DSC digital signing", "Payment of ₹5,000 MCA penalty fee", "Instant DIN reactivation on MCA"],
    faqs: [{ q: "What is the government fee for DIN reactivation?", a: "₹5,000 per DIN." }]
  },
  "director-change": {
    title: "Appointment of Director (Form DIR-12)",
    category: "MCA",
    icon: "bi-person-gear",
    price: "₹2,499",
    timeline: "3 - 5 Working Days",
    overview: "Appoint an Executive, Additional, or Independent Director to the board of directors with formal consent (DIR-2) and MCA Form DIR-12 filing.",
    benefits: ["Onboard new leadership or co-founders", "Corporate governance compliance", "Fast-track MCA Master Data update", "Includes resolution drafting"],
    documents: ["Proposed Director PAN, Identity Proof & DIN", "Consent to act as Director (Form DIR-2)", "Board / EGM Resolution", "Director DSC"],
    process: ["DIN allotment (if not existing)", "Board meeting drafting & DIR-2 collection", "Form DIR-12 filing on MCA V3 portal", "ROC approval update"],
    faqs: [{ q: "Within how many days must DIR-12 be filed?", a: "Within 30 days from the appointment date." }]
  },
  "remove-director": {
    title: "Resignation / Removal of Director",
    category: "MCA",
    icon: "bi-person-dash",
    price: "₹2,499",
    timeline: "3 - 5 Working Days",
    overview: "File the resignation (DIR-11/DIR-12) or statutory removal of a director under Section 168/169 of the Companies Act, 2013.",
    benefits: ["Relieve outgoing director from company liabilities", "Update MCA Master Data board composition", "Drafting of resignation acknowledgement", "Legal compliance guarantee"],
    documents: ["Resignation Letter from Director", "Board Resolution accepting resignation", "Form DIR-11 filed by Director", "Director DSC"],
    process: ["Board Resolution & Form DIR-12 preparation", "Filing on MCA portal within 30 days", "MCA record update", "Handover of acknowledgement"],
    faqs: [{ q: "Can a company operate with only one director?", a: "A private limited company must maintain at least 2 directors at all times." }]
  },
  "adt-1-filing": {
    title: "Appointment of Statutory Auditor (Form ADT-1)",
    category: "MCA",
    icon: "bi-file-earmark-check",
    price: "₹1,999",
    timeline: "2 - 3 Working Days",
    overview: "Mandatory statutory filing with the MCA to notify the appointment of the company's statutory auditor for a 5-year tenure or initial 1-year tenure.",
    benefits: ["Statutory compliance under Section 139", "Avoid ₹300/day late filing penalties", "Official CA appointment record", "Valid for 5 financial years"],
    documents: ["Auditor Consent Letter & Eligibility Certificate", "Board / AGM Resolution copy", "Intimation Letter sent to Auditor", "Director DSC"],
    process: ["Form ADT-1 drafting on MCA V3", "Auditor certificate attachment", "Filing within 15 days of AGM/Board meeting", "ROC approval confirmation"],
    faqs: [{ q: "When must Form ADT-1 be filed?", a: "Within 15 days of the AGM or Board meeting appointing the auditor." }]
  },
  "dpt-3-filing": {
    title: "Return of Deposits & Loans (Form DPT-3)",
    category: "MCA",
    icon: "bi-file-earmark-text",
    price: "₹2,499",
    timeline: "2 - 4 Working Days",
    overview: "Mandatory annual filing due by June 30th reporting all outstanding loans, advances, or deposits received by the company from directors/banks.",
    benefits: ["Comply with Section 73 rules", "Avoid penalties up to ₹1 Crore on company/directors", "Detailed loan & advance reporting", "Clean audit record"],
    documents: ["Audited Financial Statements / Loan Ledger", "Statutory Auditor Certificate on Net Worth", "Director Loan Confirmation", "Director DSC"],
    process: ["Loan categorization (Deposits vs Exempted receipts)", "Auditor certificate compilation", "Form DPT-3 filing on MCA by June 30", "Challan generation"],
    faqs: [{ q: "Is DPT-3 mandatory for zero-loan companies?", a: "Only companies with outstanding loans/receipts not considered deposits must file." }]
  },
  "llp-form-11-filing": {
    title: "LLP Form 11 (Annual Return)",
    category: "MCA",
    icon: "bi-file-earmark-spreadsheet",
    price: "₹1,999",
    timeline: "1 - 2 Working Days",
    overview: "Filing of annual return summarizing partners, management, and contribution details of an LLP, mandatory by May 30th every year.",
    benefits: ["Avoid crushing ₹100/day penalty", "Maintain active status for the LLP", "Fast MCA V3 processing", "Designated partner compliance"],
    documents: ["LLP Contribution Summary", "Partner Details & Change History", "Designated Partner DSC"],
    process: ["Data pre-fill on MCA V3 portal", "Contribution reconciliation", "Filing with DSC by May 30", "Challan download"],
    faqs: [{ q: "What is the deadline for Form 11?", a: "May 30th of each financial year." }]
  },
  "dormant-status-filing": {
    title: "Dormant Status Filing (Form MSC-1)",
    category: "MCA",
    icon: "bi-pause-circle",
    price: "₹7,999",
    timeline: "10 - 15 Working Days",
    overview: "Obtain official 'Dormant Company' status from MCA under Section 455 for inactive companies holding intellectual property or real estate.",
    benefits: ["Drastically reduced annual compliance costs", "Preserves company name & corporate identity", "No mandatory annual audit filing", "Easy reactivation via Form MSC-4"],
    documents: ["Audited Balance Sheet (No significant transactions)", "Special Resolution from Shareholders", "Auditor Certificate", "Director DSC"],
    process: ["Special Resolution passing at EGM", "Form MGT-14 filing", "Form MSC-1 application to ROC", "Dormant Certificate grant"],
    faqs: [{ q: "How long can a company stay dormant?", a: "Maximum up to 5 consecutive financial years." }]
  },
  "moa-amendment": {
    title: "MOA Amendment (Object Clause Change)",
    category: "MCA",
    icon: "bi-file-earmark-medical",
    price: "₹4,999",
    timeline: "7 - 12 Working Days",
    overview: "Alter the Main Business Objects clause of your company's Memorandum of Association to enter new industries, technologies, or business verticals.",
    benefits: ["Legally pivot or expand into new business sectors", "Raise funding for new product lines", "ROC approved altered MOA", "Full resolution drafting"],
    documents: ["New Proposed Business Objects", "Board & EGM Special Resolutions", "Current MOA & AOA", "Director DSC"],
    process: ["Drafting amended Object Clause", "EGM Special Resolution passing", "Form MGT-14 filing on MCA portal", "ROC approval & certified MOA"],
    faqs: [{ q: "What percentage of votes is needed for MOA change?", a: "A Special Resolution passed by at least 75% majority of shareholders." }]
  },
  "aoa-amendment": {
    title: "AOA Amendment (Articles of Association)",
    category: "MCA",
    icon: "bi-file-earmark-medical",
    price: "₹4,999",
    timeline: "7 - 12 Working Days",
    overview: "Modify internal governance rules, director powers, share transfer restrictions, or incorporate investor rights (SHA) into your Articles of Association.",
    benefits: ["Embed investor rights & board seats", "Alter share transfer & pre-emptive clauses", "Statutory compliance for funding rounds", "Certified amended AOA"],
    documents: ["New Drafted AOA Clauses / Shareholders Agreement", "EGM Special Resolution", "Director DSC"],
    process: ["Drafting amended Articles", "Shareholder EGM approval", "Form MGT-14 filing with ROC", "Approval notification"],
    faqs: [{ q: "Is AOA amendment mandatory after receiving venture funding?", a: "Yes, to give statutory backing to the terms of the Shareholders Agreement (SHA)." }]
  },
  "authorized-capital-increase": {
    title: "Increase Authorized Share Capital",
    category: "MCA",
    icon: "bi-graph-up-arrow",
    price: "₹3,999",
    timeline: "5 - 7 Working Days",
    overview: "Increase the authorized share capital limit of your company via Form SH-7 to issue new shares to founders, investors, or ESOP pools.",
    benefits: ["Issue new shares to angel investors/VCs", "Create ESOP pools for employees", "Higher net-worth valuation", "Updated MCA Master Data"],
    documents: ["Board & EGM Resolutions", "Altered Capital Clause in MOA (Clause V)", "Director DSC"],
    process: ["EGM Special Resolution", "Stamp duty calculation on MCA portal", "Form SH-7 & MGT-14 filing", "ROC approval confirmation"],
    faqs: [{ q: "Is stamp duty payable on increasing capital?", a: "Yes, state-specific stamp duty is paid on the incremental authorized capital." }]
  },
  "share-transfer": {
    title: "Share Transfer & Demat (Form SH-4)",
    category: "MCA",
    icon: "bi-arrow-left-right",
    price: "₹2,999",
    timeline: "3 - 5 Working Days",
    overview: "Execute legal transfer of equity shares from one shareholder to another via Securities Transfer Form SH-4 with stamp duty franking.",
    benefits: ["Transfer equity to new investors or co-founders", "Legally executed Form SH-4 & board minutes", "New Share Certificates generation", "Updated Register of Members (MGT-1)"],
    documents: ["Original Share Certificates", "Form SH-4 Securities Transfer Deed", "Board Resolution approving transfer", "PAN of Transferor & Transferee"],
    process: ["Share Transfer Deed execution with stamp duty (0.015%)", "Board meeting approval", "Share Certificate endorsement", "Register of Members update"],
    faqs: [{ q: "What is the stamp duty rate on share transfer?", a: "0.015% of the total consideration amount." }]
  },
  "demat-of-shares": {
    title: "Demat of Shares for Private Companies",
    category: "MCA",
    icon: "bi-pie-chart",
    price: "₹9,999",
    timeline: "15 - 25 Working Days",
    overview: "Mandatory dematerialization of all existing physical shares through NSDL/CDSL depositories pursuant to MCA Rule 9B mandates.",
    benefits: ["Mandatory compliance for all private companies", "Facilitates seamless share transfers & funding", "ISIN code generation for company shares", "Direct depository connectivity"],
    documents: ["Company Incorporation & MOA/AOA", "Audited Balance Sheet", "RTA Tripartite Agreement", "Director/Promoter Demat Details"],
    process: ["RTA appointment & agreement execution", "ISIN application on NSDL/CDSL", "Conversion of physical certificates to Demat", "Form PAS-6 half-yearly reporting"],
    faqs: [{ q: "Is demat of shares mandatory for private limited companies?", a: "Yes, mandated by MCA for all private limited companies (except small companies)." }]
  },
  "winding-up-llp": {
    title: "Winding Up of LLP (Form 24)",
    category: "MCA",
    icon: "bi-x-circle",
    price: "₹7,999",
    timeline: "20 - 40 Working Days",
    overview: "Strike off and legally close a defunct or inactive LLP via Form 24 with complete asset/liability settlements.",
    benefits: ["Permanently stop ₹100/day ongoing compliance fines", "Clean legal closure with MCA", "Release partners from future liabilities", "Bank account formal closure"],
    documents: ["Consent of All Partners", "Affidavit and Indemnity Bond", "Statement of Accounts (Nil assets & liabilities)", "Latest ITR Copy"],
    process: ["Closing all bank accounts", "Nil Statement of Accounts preparation by CA", "Form 24 filing on MCA portal", "ROC strike-off notice publication"],
    faqs: [{ q: "Can an LLP with active bank accounts be closed?", a: "All bank accounts must be closed before filing Form 24." }]
  },
  "winding-up-company": {
    title: "Company Strike Off / Fast Track Exit (STK-2)",
    category: "MCA",
    icon: "bi-x-circle",
    price: "₹9,999",
    timeline: "30 - 60 Working Days",
    overview: "Fast-track closure of an inactive private limited company under Section 248 via Form STK-2 with Registrar of Companies.",
    benefits: ["Complete legal dissolution of entity", "Eliminates director disqualification risk", "Ends recurring CA & compliance overheads", "Official Gazette dissolution"],
    documents: ["Indemnity Bond (Form STK-3) & Affidavits (STK-4)", "Statement of Accounts (Not older than 30 days)", "Special Resolution / Consent of 75% members", "NOC from Creditors (if any)"],
    process: ["Bank account closure & tax clearance", "Statement of Accounts certified by CA", "Form STK-2 filing with ₹10,000 MCA fee", "ROC gazette notification & strike off"],
    faqs: [{ q: "What is the condition for STK-2 filing?", a: "The company must not have commenced business within 1 year or been inactive for 2 consecutive years." }]
  },
  "commencement-inc-20a": {
    title: "Commencement of Business (Form INC-20A)",
    category: "MCA",
    icon: "bi-play-circle",
    price: "₹1,499",
    timeline: "1 - 2 Working Days",
    overview: "Mandatory declaration to be filed within 180 days of incorporation confirming that shareholders have deposited their subscribed capital.",
    benefits: ["Mandatory to legally start business operations", "Avoid ₹50,000 company penalty & ₹1,000/day director fine", "Unblocks MCA filing rights", "Bank account verification"],
    documents: ["Bank Statement showing share capital deposit from subscribers", "Certificate of Incorporation", "Director DSC"],
    process: ["Bank credit verification", "Form INC-20A compilation", "Director Class 3 DSC signing", "ROC approval acknowledgement"],
    faqs: [{ q: "What is the deadline for INC-20A?", a: "Within 180 days from the date of company incorporation." }]
  },
  "ccfs-scheme": {
    title: "Company Fresh Start / Condonation Scheme",
    category: "MCA",
    icon: "bi-file-earmark-check",
    price: "₹6,999",
    timeline: "5 - 10 Working Days",
    overview: "Condonation of delay petitions and settlement schemes enabling defaulting companies to clear backlogged returns with reduced penalties.",
    benefits: ["Immunity from legal prosecution", "Clear years of backlogged returns", "Restore good standing on MCA portal", "Avoid compounding fines in NCLT"],
    documents: ["Pending MCA Return Forms", "Board Resolutions", "Financial Statements of pending years", "Director DSCs"],
    process: ["Backlog compliance audit", "Form filing under condonation rules", "Immunity certificate petition", "Master data regularization"],
    faqs: [{ q: "Does the scheme waive all penalties?", a: "It provides immunity from prosecution and waives additional compounding penalties." }]
  },

  // ===========================================================================
  // 7. COMPLIANCE & ACCOUNTING (13 Services)
  // ===========================================================================
  "fdi-filing": {
    title: "FDI Reporting (RBI FIRMS Portal / FC-GPR)",
    category: "Compliance",
    icon: "bi-globe2",
    price: "₹9,999",
    timeline: "7 - 15 Working Days",
    overview: "Mandatory reporting of foreign direct investment equity allocation on the RBI FIRMS portal (Form FC-GPR) within 30 days of share allotment.",
    benefits: ["100% Foreign Exchange Management Act (FEMA) compliance", "Avoid severe compounding penalties from RBI", "Official Foreign Inward Remittance Certificate (FIRC) validation", "Clean FDI records for overseas investors"],
    documents: ["FIRC & KYC from Remitting Bank", "Chartered Accountant Valuation Certificate", "Board Resolution & PAS-3 Form", "CS Certificate of Compliance"],
    process: ["Entity Master creation on FIRMS", "FC-GPR form compilation", "AD Bank scrutiny & forwarding to RBI", "RBI Approval Registration Number"],
    faqs: [{ q: "What is the timeline for FC-GPR filing?", a: "Within 30 days from the date of share allotment to foreign investors." }]
  },
  "odi-filing": {
    title: "Overseas Direct Investment (ODI) Filing",
    category: "Compliance",
    icon: "bi-airplane",
    price: "₹14,999",
    timeline: "15 - 25 Working Days",
    overview: "Statutory RBI approvals and Form FC-TRS / APR filings for Indian companies and resident individuals investing in foreign subsidiaries.",
    benefits: ["Legally invest in USA, UK, UAE, or Singapore subsidiaries", "FEMA compliant capital transfer", "Obtain Unique Identification Number (UIN) from RBI", "Seamless dividend repatriation"],
    documents: ["Board Resolution of Indian Entity", "Statutory Auditor Net Worth Certificate", "Foreign Subsidiary Profile & Valuation", "Bank AD Category-1 Application"],
    process: ["Net worth limit verification (400% rule)", "Application submission via AD Bank", "RBI UIN allocation", "Share certificate & APR reporting"],
    faqs: [{ q: "What is the financial limit for automatic ODI?", a: "Up to 400% of the net worth of the Indian entity as per the last audited balance sheet." }]
  },
  "fla-return-filing": {
    title: "Foreign Liabilities & Assets (FLA) Return",
    category: "Compliance",
    icon: "bi-file-earmark-spreadsheet",
    price: "₹2,999",
    timeline: "2 - 3 Working Days",
    overview: "Mandatory annual return to be filed by July 15th on the RBI FLAIR portal by Indian companies that have received FDI or made ODI.",
    benefits: ["Mandatory annual RBI compliance", "Avoid FEMA violation penalties", "Web-based automated reconciliation", "CA certified data entry"],
    documents: ["Audited/Unaudited Balance Sheet & P&L", "FDI & ODI Transaction Records", "FLAIR Portal Login Credentials"],
    process: ["Financial data compilation", "FLAIR portal entry & reconciliation", "Validation check", "RBI acknowledgement download"],
    faqs: [{ q: "What is the deadline for FLA return?", a: "July 15th of every year for the previous financial year." }]
  },
  "fssai-renewal": {
    title: "FSSAI License Renewal",
    category: "Compliance",
    icon: "bi-arrow-repeat",
    price: "₹1,499",
    timeline: "2 - 5 Working Days",
    overview: "Renew your 14-digit FSSAI Food Registration or State/Central License on the FoSCoS portal before expiration to avoid late fines.",
    benefits: ["Continuous Zomato / Swiggy listing", "Avoid ₹100/day late penalty", "Extend license up to 5 years", "Uninterrupted food operations"],
    documents: ["Current FSSAI License Copy", "Updated Address Proof (if changed)", "Applicant KYC"],
    process: ["FoSCoS renewal application filing", "Payment of government fee", "Officer approval", "Renewed FSSAI Certificate download"],
    faqs: [{ q: "When should FSSAI renewal be filed?", a: "At least 30 days before the expiry date of the current license." }]
  },
  "fssai-return-filing": {
    title: "FSSAI Annual Return (Form D-1)",
    category: "Compliance",
    icon: "bi-file-earmark-check",
    price: "₹1,999",
    timeline: "2 - 3 Working Days",
    overview: "Mandatory annual return (Form D-1) due by May 31st for food manufacturers, importers, and processors reporting annual production volumes.",
    benefits: ["Avoid ₹100/day penalty under Section 31", "Maintain valid food license status", "Report manufacturing volumes accurately", "Full compliance guarantee"],
    documents: ["Annual Production & Sales Quantities", "Purchased Raw Material Details", "FSSAI License Copy"],
    process: ["Data compilation on FoSCoS portal", "Form D-1 filing", "Submission acknowledgement download"],
    faqs: [{ q: "Who is required to file Form D-1?", a: "Food manufacturers, relabellers, packers, and importers." }]
  },
  "business-plan": {
    title: "Bankable Business Plan & Feasibility Report",
    category: "Compliance",
    icon: "bi-file-earmark-bar-graph",
    price: "₹7,999",
    timeline: "5 - 7 Working Days",
    overview: "Comprehensive pitch deck and business plan with financial projections, market feasibility analysis, and ROI metrics for investors & bank loans.",
    benefits: ["Bank loan & credit appraisal ready", "Investor pitch deck presentation", "5-Year Profit & Loss, Balance Sheet & Cash Flows", "Break-Even & DSCR analysis"],
    documents: ["Project Concept & Cost Breakdown", "Promoter Profiles & Experience", "Market Size & Target Pricing", "Land / Machinery Quotes"],
    process: ["Financial model structuring", "Market study & revenue projections", "Drafting executive summary", "Final PDF & Excel model handover"],
    faqs: [{ q: "Does this include Debt Service Coverage Ratio (DSCR)?", a: "Yes, complete banking financial ratios including DSCR and Break-Even are included." }]
  },
  "hr-payroll": {
    title: "HR & Payroll Management Software",
    category: "Compliance",
    icon: "bi-people",
    price: "₹5,899",
    timeline: "Annual Subscription",
    overview: "Cloud HR & payroll solution for attendance, leave management, automated payslip generation, and statutory PF/ESI/PT deductions.",
    benefits: ["Automated 1-click payslip generation", "Employee self-service mobile app", "Statutory PF, ESI & TDS auto-computation", "Attendance & leave integration"],
    documents: ["Company Registration Proof", "Employee Salary Structure Details", "Bank Account Details for Payout"],
    process: ["Company profile configuration", "Employee master data import", "Salary structure setup", "Monthly payroll generation"],
    faqs: [{ q: "How many employees are supported?", a: "Plans start for up to 20 employees and scale seamlessly." }]
  },
  "pf-return-filing": {
    title: "Monthly PF Return Filing (ECR)",
    category: "Compliance",
    icon: "bi-person-check",
    price: "₹1,499",
    timeline: "Monthly Retainer",
    overview: "Monthly compilation of Electronic Challan-cum-Return (ECR) and payment challan generation on the EPFO Unified Portal by the 15th.",
    benefits: ["Timely ECR filing avoiding penal damages", "Accurate UAN wage calculation", "Direct challan generation for bank payment", "Dedicated compliance manager"],
    documents: ["Monthly Employee Attendance & Wage Sheet", "List of New Joinees / Exits", "EPFO Portal Credentials"],
    process: ["Wage data reconciliation", "ECR text file generation", "EPFO portal upload", "Challan TRRN generation"],
    faqs: [{ q: "What is the monthly PF return deadline?", a: "15th of every month." }]
  },
  "esi-return-filing": {
    title: "Monthly ESIC Return Filing",
    category: "Compliance",
    icon: "bi-heart-pulse",
    price: "₹1,499",
    timeline: "Monthly Retainer",
    overview: "Monthly employee contribution filing on the ESIC portal and half-yearly return submission ensuring continuous medical benefits for staff.",
    benefits: ["Zero-default labour compliance", "Continuous health coverage for workers", "Avoid revenue recovery notices", "Monthly challan generation"],
    documents: ["Monthly Wage Sheet (Gross Salary <= ₹21,000)", "New Employee IP Registration Details", "ESIC Portal Credentials"],
    process: ["Contribution data entry on ESIC portal", "Challan generation by 15th", "Payment verification", "Form 5 half-yearly return filing"],
    faqs: [{ q: "What is the employee and employer ESIC contribution rate?", a: "0.75% by Employee and 3.25% by Employer." }]
  },
  "professional-tax-return-filing": {
    title: "Professional Tax Return Filing",
    category: "Compliance",
    icon: "bi-receipt",
    price: "₹999",
    timeline: "Monthly / Annual",
    overview: "Periodic filing of professional tax returns (PTRC) with state commercial tax departments based on employee salary deductions.",
    benefits: ["State tax compliance guarantee", "Avoid interest & penalty under State PT Act", "Accurate slab-wise deduction", "Challan receipt generation"],
    documents: ["Monthly Salary Sheet with PT deductions", "State PT Portal Credentials", "Past Challans"],
    process: ["Slab-wise deduction verification", "State portal return upload", "Challan creation", "Acknowledgement handover"],
    faqs: [{ q: "Is Professional Tax applicable in all states?", a: "Applicable in states like Telangana, Maharashtra, Karnataka, Tamil Nadu, Gujarat, and West Bengal." }]
  },
  "partnership-compliance": {
    title: "Partnership Firm Annual Compliance",
    category: "Compliance",
    icon: "bi-people",
    price: "₹3,999",
    timeline: "Annual Retainer",
    overview: "Comprehensive annual maintenance for partnership firms covering financial statement compilation, ITR-5 tax filing, and partner capital reconciliation.",
    benefits: ["Year-round accounting & bookkeeping", "Annual Income Tax Return (ITR-5) filing", "Partner profit distribution statement", "Tax deduction maximization"],
    documents: ["Bank Statements of the Firm", "Sales & Purchase Bills", "Partnership Deed", "Partner Capital Records"],
    process: ["Bookkeeping & Ledger finalization", "Balance Sheet & P&L compilation", "ITR-5 tax filing", "Tax clearance certificate"],
    faqs: [{ q: "Do partnership firms need to file returns if there is no business?", a: "Yes, nil tax returns must be filed to maintain clean compliance." }]
  },
  "proprietorship-compliance": {
    title: "Proprietorship Annual Compliance Suite",
    category: "Compliance",
    icon: "bi-person-badge",
    price: "₹3,499",
    timeline: "Annual Retainer",
    overview: "Complete peace of mind package for sole proprietors including 12 months GST filing, annual business ITR, and bookkeeping software.",
    benefits: ["12 Months GSTR-1 & GSTR-3B filings", "Annual Business Income Tax Return (ITR-3/4)", "LEDGERS software license included", "Dedicated tax consultant"],
    documents: ["Bank Statements", "Monthly Sales & Purchase Invoices", "GST & Income Tax Credentials"],
    process: ["Monthly GST filing cycle", "Year-end financial finalization", "ITR filing with tax deductions", "Annual compliance report"],
    faqs: [{ q: "Does this include accounting software?", a: "Yes, full access to LEDGERS cloud accounting software is included." }]
  },
  "bookkeeping": {
    title: "Virtual Bookkeeping & Accounting Services",
    category: "Compliance",
    icon: "bi-journal-text",
    price: "₹2,999",
    timeline: "Monthly Retainer",
    overview: "Dedicated cloud accounting and bookkeeping by professional accountants using Zoho Books, Tally, QuickBooks, or LEDGERS.",
    benefits: ["Real-time Profit & Loss and Balance Sheet", "Bank statement reconciliation", "Accounts receivable & payable tracking", "Audit-ready financial statements"],
    documents: ["Monthly Bank Statements", "Vendor Invoices & Customer Receipts", "Expense Bills & Payment Vouchers"],
    process: ["Transaction classification & ledger posting", "Monthly bank reconciliation", "MIS reports generation", "Monthly review with CA"],
    faqs: [{ q: "Which accounting software do you support?", a: "Tally Prime, Zoho Books, QuickBooks, and LEDGERS." }]
  },

  // ===========================================================================
  // 8. CONSULTATION (2 Services)
  // ===========================================================================
  "ca-consultation": {
    title: "Chartered Accountant (CA) Consultation",
    category: "Consultation",
    icon: "bi-person-vcard",
    price: "₹1,499",
    timeline: "Instant / 30 Min Slot",
    overview: "One-on-one virtual consultation with a senior practicing Chartered Accountant for direct tax, GST structuring, business restructuring, or subsidy planning.",
    benefits: ["30-Minute dedicated video consultation", "Actionable tax planning & structuring advice", "Written advisory summary report", "Guidance on government subsidy linkages"],
    documents: ["Brief Summary of Query", "Financial Statements or Notices (if applicable)"],
    process: ["Slot selection & booking", "Document sharing", "Live video conference with Senior CA", "Written summary handover"],
    faqs: [{ q: "Can I discuss complex cross-border tax issues?", a: "Yes, our team includes international tax specialists." }]
  },
  "legal-consultation": {
    title: "Corporate Legal Consultation",
    category: "Consultation",
    icon: "bi-briefcase",
    price: "₹1,499",
    timeline: "Instant / 30 Min Slot",
    overview: "Confidential legal advice from experienced corporate advocates on contracts, co-founder disputes, IP infringement, employment law, or NCLT matters.",
    benefits: ["30-Minute video call with corporate lawyer", "Contract & agreement risk review", "Actionable legal strategy roadmap", "100% Attorney-client privilege"],
    documents: ["Disputed Agreement or Legal Notice", "Case Background Details"],
    process: ["Consultation slot booking", "Case material review", "Video call with Advocate", "Legal roadmap delivery"],
    faqs: [{ q: "Is the consultation confidential?", a: "Yes, strictly governed by attorney-client privilege." }]
  },

  // ===========================================================================
  // 9. GLOBAL EXPANSION (5 Services)
  // ===========================================================================
  "uae-company-registration": {
    title: "UAE (Dubai) Company Registration",
    category: "Global",
    icon: "bi-globe2",
    price: "₹49,999",
    timeline: "7 - 12 Working Days",
    overview: "Incorporate your Free Zone or Mainland company in Dubai with 0% corporate tax benefits, 100% foreign ownership, and investor residency visas.",
    benefits: ["0% Personal income tax & 0% corporate tax for qualifying income", "100% Foreign company ownership", "Dubai Investor Visa & Emirates ID for family", "Multi-currency corporate bank account in UAE"],
    documents: ["Passport Copy of Shareholders", "Passport Size Photos with White Background", "3 Proposed Company Names", "Brief Business Activity Profile"],
    process: ["Free Zone selection (IFZA, Meydan, DMCC)", "Name & initial approval from DED", "Memorandum of Association signing", "Trade License & Establishment Card issuance"],
    faqs: [{ q: "Do I need to visit Dubai for incorporation?", a: "Initial incorporation is 100% online; visit is required only for Emirates ID biometric stamping." }]
  },
  "usa-company-registration": {
    title: "USA Company Formation (Delaware / Wyoming LLC / C-Corp)",
    category: "Global",
    icon: "bi-flag",
    price: "₹24,999",
    timeline: "5 - 10 Working Days",
    overview: "Form an American LLC or C-Corporation in Delaware or Wyoming with Federal Employer Identification Number (EIN) and US bank account access.",
    benefits: ["Global credibility with US Stripe & PayPal access", "Raise US Venture Capital (Delaware C-Corp)", "No US visit required", "Zero state income tax in Wyoming/Delaware"],
    documents: ["Passport of All Members", "Proposed US Company Name", "Registered Agent Authorization"],
    process: ["Articles of Organization filing with State", "Registered Agent assignment", "Federal EIN allotment from IRS", "US Corporate Bank Account (Mercury/Wise) setup"],
    faqs: [{ q: "Can non-US residents open a US bank account?", a: "Yes, we assist in opening US corporate bank accounts online." }]
  },
  "singapore-business-setup": {
    title: "Singapore Company Incorporation (Pte Ltd)",
    category: "Global",
    icon: "bi-buildings",
    price: "₹39,999",
    timeline: "5 - 8 Working Days",
    overview: "Incorporate a Private Limited (Pte Ltd) company in Singapore with low corporate tax rates, government startup grants, and Asian market reach.",
    benefits: ["Flat 17% corporate tax with 75% startup tax exemptions", "Global trade & fintech hub of Asia", "100% Foreign ownership allowed", "World-class intellectual property protection"],
    documents: ["Passport & Proof of Address of Shareholders", "Nominee Director KYC (Statutory Requirement)", "Company Constitution (MOA/AOA)"],
    process: ["ACRA portal name reservation", "Nominee director & company secretary appointment", "Incorporation registration with ACRA", "Singapore bank account setup"],
    faqs: [{ q: "Is a resident director mandatory in Singapore?", a: "Yes, Singapore law requires at least one locally resident director (we provide Nominee Director services)." }]
  },
  "uk-company-registration": {
    title: "UK Company Formation (Private Limited / Ltd)",
    category: "Global",
    icon: "bi-building",
    price: "₹14,999",
    timeline: "2 - 4 Working Days",
    overview: "Register a UK Private Limited (Ltd) company with Companies House London, including registered office address and UK banking support.",
    benefits: ["Fastest European incorporation (under 48 hours)", "Low incorporation costs", "UK Stripe & global payment gateways", "Access to UK & European markets"],
    documents: ["Passport of Directors / Shareholders", "Proof of Address (Utility Bill/Bank Statement)", "Proposed UK Company Name"],
    process: ["Companies House London electronic filing", "Articles & Memorandum submission", "Certificate of Incorporation issuance", "UK bank account (Wise/Tide) integration"],
    faqs: [{ q: "Is UK residency required to be a director?", a: "No, foreign nationals can own 100% of a UK Ltd company." }]
  },
  "usa-trademark-registration": {
    title: "USA Trademark Registration (USPTO)",
    category: "Global",
    icon: "bi-shield-check",
    price: "₹14,999",
    timeline: "3 - 5 Working Days",
    overview: "Protect your brand name, logo, or Amazon brand in the United States with filing before the United States Patent and Trademark Office (USPTO).",
    benefits: ["Federal trademark protection across all 50 US States", "Mandatory for Amazon Brand Registry USA", "Stop unauthorized US counterfeits", "Filed through licensed US Attorneys"],
    documents: ["Brand Logo / Word Mark Details", "Specimen of Use (Product Photo/Website Screenshot)", "Applicant ID Proof", "US Attorney Authorization"],
    process: ["USPTO TESS database conflict search", "Class drafting under US guidelines", "Filing via licensed US patent attorney", "USPTO Serial Number issuance"],
    faqs: [{ q: "What is the USPTO government filing fee?", a: "$250 to $350 per class, paid directly to the USPTO." }]
  }
};

// =============================================================================
// DYNAMIC RESOLVER HELPER (Guarantees every requested slug returns full data)
// =============================================================================
export function getServiceData(slug) {
  if (SERVICES_CATALOG[slug]) {
    return SERVICES_CATALOG[slug];
  }

  // Formatting slug to title as a fallback
  const formattedTitle = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Business Service";

  return {
    title: formattedTitle,
    category: "Business & Legal Services",
    icon: "bi-shield-check",
    price: "₹1,999",
    timeline: "3 - 7 Working Days",
    overview: `Comprehensive statutory documentation, verified online processing, and full government filing assistance for ${formattedTitle} with GoSubsidy compliance experts.`,
    benefits: [
      "100% Online digital documentation & verification",
      "Fast processing with dedicated CA / CS assistance",
      "End-to-end liaison with statutory authorities",
      "Real-time status tracking in Customer Workspace"
    ],
    documents: [
      "PAN Card & Identity Proof of Applicant / Directors",
      "Registered Business Address Proof & Electricity Bill",
      "Entity Registration Certificate (if applicable)",
      "Bank Account Cancelled Cheque"
    ],
    process: [
      "Consultation & document checklist verification",
      "Application drafting and statutory form compilation",
      "Official filing with relevant government portal",
      "Certificate issuance and post-compliance handover"
    ],
    faqs: [
      {
        q: `What is the turnaround time for ${formattedTitle}?`,
        a: "Standard processing is completed within 3 to 7 working days, subject to government verification."
      },
      {
        q: `Can I track my ${formattedTitle} application status online?`,
        a: "Yes, you can track live milestones directly inside your GoSubsidy Customer Dashboard."
      }
    ]
  };
}