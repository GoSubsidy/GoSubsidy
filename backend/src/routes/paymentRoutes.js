import "dotenv/config";
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// ============================================================
// ENVIRONMENT & CREDENTIAL INITIALIZATION
// ============================================================

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const supabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  ""
)
  .replace(/\/rest\/v1\/?$/, "")
  .replace(/\/+$/, "");

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

// ============================================================
// COMPLETE GOSUBSIDY SERVICES & PRODUCTS CATALOGUE
// (Includes exact URL slug aliases for Verified Services)
// ============================================================

const allowedProducts = {
  // 1. CORE TOOLS, ADVISORY & CONSULTATION
  DPR_PRO: { amount: 999, validityDays: 30, name: "GoSubsidy Premium DPR" },
  DPR_PREMIUM: { amount: 999, validityDays: 30, name: "GoSubsidy Premium DPR" },
  DPR: { amount: 999, validityDays: 30, name: "GoSubsidy Premium DPR" },
  CIBIL_PRO_CONSULTATION: { amount: 2999, validityDays: 1, name: "GoSubsidy Pro Credit Analysis & Consultation" },
  CIBIL_PRO: { amount: 2999, validityDays: 1, name: "GoSubsidy Pro Credit Analysis & Consultation" },
  CIBIL_CONSULTATION: { amount: 2999, validityDays: 1, name: "GoSubsidy Pro Credit Analysis & Consultation" },
  CIBIL_FULL: { amount: 2999, validityDays: 1, name: "GoSubsidy Pro Credit Analysis & Consultation" },
  SUBSIDY_CALCULATOR_PRO: { amount: 49, validityDays: 30, name: "GoSubsidy Pro Subsidy Calculator" },
  SUBSIDY_CONSULTATION_AND_ALERTS_ANNUAL: { amount: 999, validityDays: 365, name: "Subsidy Expert Advisory & 1-Year Scheme Alerts" },
  SUBSIDY_ADVISORY_PASS: { amount: 999, validityDays: 365, name: "GoSubsidy 1-Year Advisory & Scheme Alerts" },
  "subsidy-expert-advisory": { amount: 999, validityDays: 365, name: "Subsidy Expert Advisory & 1-Year Scheme Alerts" },
  subsidy_expert_advisory: { amount: 999, validityDays: 365, name: "Subsidy Expert Advisory & 1-Year Scheme Alerts" },

  // 2. STARTUP INDIA, DPIIT & ENTITY ACCREDITATIONS
  "startup-india": { amount: 2999, validityDays: 365, name: "Startup India DPIIT Recognition & Tax Exemption" },
  startup_india: { amount: 2999, validityDays: 365, name: "Startup India DPIIT Recognition & Tax Exemption" },
  STARTUP_INDIA: { amount: 2999, validityDays: 365, name: "Startup India DPIIT Recognition & Tax Exemption" },
  startup_india_seed_dpiit_recognition: { amount: 2999, validityDays: 365, name: "Startup India DPIIT Recognition & Tax Exemption" },
  "startup-india-seed-fund": { amount: 4999, validityDays: 365, name: "Startup India Seed Fund Application Assistance" },

  // 3. SOLE PROPRIETORSHIP, PARTNERSHIP & FIRMS
  SERVICE_PROPRIETORSHIP_BASIC: { amount: 1499, validityDays: 365, name: "Sole Proprietorship Registration (Basic Plan)" },
  SERVICE_PROPRIETORSHIP_STANDARD: { amount: 2999, validityDays: 365, name: "Sole Proprietorship Registration (Standard Plan)" },
  SERVICE_PROPRIETORSHIP_PREMIUM: { amount: 4999, validityDays: 365, name: "Sole Proprietorship Registration (Premium Plan)" },
  proprietorship: { amount: 1499, validityDays: 365, name: "Sole Proprietorship Registration" },
  "sole-proprietorship": { amount: 1499, validityDays: 365, name: "Sole Proprietorship Registration" },
  sole_proprietorship: { amount: 1499, validityDays: 365, name: "Sole Proprietorship Registration" },
  partnership: { amount: 3499, validityDays: 365, name: "Partnership Firm Registration" },
  "partnership-firm": { amount: 3499, validityDays: 365, name: "Partnership Firm Registration" },
  partnership_firm: { amount: 3499, validityDays: 365, name: "Partnership Firm Registration" },
  partnership_deed_drafting: { amount: 1999, validityDays: 365, name: "Partnership Deed Drafting & Notarization" },
  partnership_firm_registration: { amount: 3499, validityDays: 365, name: "Partnership Firm Registration" },
  partnership_firm_complete: { amount: 4999, validityDays: 365, name: "Partnership Firm Registration (Complete Package)" },
  huf_deed_pan_creation: { amount: 1499, validityDays: 365, name: "HUF Formation & PAN Setup" },
  "huf-creation": { amount: 1499, validityDays: 365, name: "HUF Formation & PAN Setup" },
  shop_and_establishment_act: { amount: 1299, validityDays: 365, name: "Shop and Establishment Registration" },
  "shop-and-establishment": { amount: 1299, validityDays: 365, name: "Shop and Establishment Registration" },
  trade_license_municipal: { amount: 2499, validityDays: 365, name: "Municipal Trade License Registration" },
  "trade-license": { amount: 2499, validityDays: 365, name: "Municipal Trade License Registration" },
  professional_tax_registration: { amount: 1499, validityDays: 365, name: "Professional Tax (PT) Registration" },
  "professional-tax": { amount: 1499, validityDays: 365, name: "Professional Tax (PT) Registration" },

  // 4. COMPANY FORMATION & CORPORATE INCORPORATION
  "one-person-company": { amount: 5499, validityDays: 365, name: "One Person Company (OPC) Registration" },
  one_person_company: { amount: 5499, validityDays: 365, name: "One Person Company (OPC) Registration" },
  opc: { amount: 5499, validityDays: 365, name: "One Person Company (OPC) Registration" },
  "limited-liability-partnership": { amount: 4999, validityDays: 365, name: "Limited Liability Partnership (LLP)" },
  limited_liability_partnership: { amount: 4999, validityDays: 365, name: "Limited Liability Partnership (LLP)" },
  llp: { amount: 4999, validityDays: 365, name: "Limited Liability Partnership (LLP)" },
  "private-limited-company": { amount: 6999, validityDays: 365, name: "Private Limited Company Incorporation" },
  private_limited_company: { amount: 6999, validityDays: 365, name: "Private Limited Company Incorporation" },
  private_limited_startup: { amount: 8999, validityDays: 365, name: "Private Limited Company (Startup FastTrack)" },
  "section-8-company": { amount: 11999, validityDays: 365, name: "Section 8 Company Incorporation (NGO/Non-Profit)" },
  section_8_company_ngo: { amount: 11999, validityDays: 365, name: "Section 8 Company Incorporation (NGO/Non-Profit)" },
  "trust-registration": { amount: 4999, validityDays: 365, name: "Public Charitable Trust Registration" },
  trust_registration_deed: { amount: 4999, validityDays: 365, name: "Public Charitable Trust Registration" },
  "public-limited-company": { amount: 14999, validityDays: 365, name: "Public Limited Company Incorporation" },
  public_limited_company: { amount: 14999, validityDays: 365, name: "Public Limited Company Incorporation" },
  "producer-company": { amount: 17999, validityDays: 365, name: "Farmer Producer Company Incorporation" },
  producer_company_registration: { amount: 17999, validityDays: 365, name: "Farmer Producer Company Incorporation" },
  "indian-subsidiary": { amount: 24999, validityDays: 365, name: "Foreign / Indian Subsidiary Company Incorporation" },
  foreign_subsidiary_company: { amount: 24999, validityDays: 365, name: "Foreign Subsidiary Incorporation India" },
  society_registration_act: { amount: 5999, validityDays: 365, name: "Society Registration under Societies Act" },
  "society-registration": { amount: 5999, validityDays: 365, name: "Society Registration under Societies Act" },
  nidhi_company_registration: { amount: 19999, validityDays: 365, name: "Nidhi Company Incorporation" },
  "nidhi-company": { amount: 19999, validityDays: 365, name: "Nidhi Company Incorporation" },
  microfinance_company_setup: { amount: 29999, validityDays: 365, name: "Section 8 Microfinance Entity Setup" },
  branch_office_liaison_office: { amount: 34999, validityDays: 365, name: "Branch / Liaison Office Setup for Foreign Entity" },
  joint_venture_incorporation: { amount: 21999, validityDays: 365, name: "Joint Venture Incorporation & Agreement" },
  convert_proprietorship_to_pvt_ltd: { amount: 8999, validityDays: 365, name: "Conversion: Proprietorship to Pvt Ltd" },

  // 5. GST & INDIRECT TAX
  gst_registration_regular: { amount: 999, validityDays: 365, name: "New GST Registration (Regular/Composition)" },
  "gst-registration": { amount: 999, validityDays: 365, name: "New GST Registration (Regular/Composition)" },
  gst_registration_non_resident: { amount: 4999, validityDays: 365, name: "Non-Resident Taxable Person GST Registration" },
  gst_amendment_core_non_core: { amount: 799, validityDays: 365, name: "GST Certificate Amendment" },
  gst_cancellation_surrender: { amount: 999, validityDays: 365, name: "GST Registration Cancellation / Surrender" },
  gst_revocation_cancelled_gst: { amount: 1999, validityDays: 365, name: "Revocation of Cancelled GST Registration" },
  gst_monthly_filing_gstr1_3b: { amount: 999, validityDays: 365, name: "Monthly GST Return Filing (GSTR-1 & 3B)" },
  "gst-filing": { amount: 999, validityDays: 365, name: "Monthly GST Return Filing (GSTR-1 & 3B)" },
  gst_quarterly_qrmp_filing: { amount: 2499, validityDays: 365, name: "Quarterly QRMP Scheme GST Filing" },
  gst_annual_return_gstr9: { amount: 3499, validityDays: 365, name: "Annual GST Return Filing (GSTR-9)" },
  gst_reconciliation_gstr9c: { amount: 5999, validityDays: 365, name: "GST Audit Reconciliation Statement (GSTR-9C)" },
  gst_lut_filing_export: { amount: 799, validityDays: 365, name: "GST Letter of Undertaking (LUT) for Exports" },
  gst_notice_scrutiny_reply: { amount: 2499, validityDays: 365, name: "GST Notice & Scrutiny Reply (DRC-01/01A)" },
  gst_refund_application_export: { amount: 4999, validityDays: 365, name: "GST Refund Processing (Inverted Duty / Export)" },
  eway_bill_einvoice_setup: { amount: 1499, validityDays: 365, name: "E-Way Bill & E-Invoicing System Configuration" },
  gst_composition_scheme_opt_in: { amount: 799, validityDays: 365, name: "Opt-in / Opt-out Composition Scheme" },
  gst_input_tax_credit_audit: { amount: 3999, validityDays: 365, name: "Comprehensive GST ITC Audit & Reconciliation" },
  gst_appeal_filing_first_appellate: { amount: 7999, validityDays: 365, name: "GST Appeal Filing (Form GST APL-01)" },

  // 6. INCOME TAX & DIRECT TAX
  itr_1_salaried_individual: { amount: 799, validityDays: 365, name: "ITR-1 Salaried Individual Tax Filing" },
  "itr-filing": { amount: 799, validityDays: 365, name: "Income Tax Return Filing" },
  itr_2_capital_gains_nri: { amount: 1999, validityDays: 365, name: "ITR-2 Capital Gains & Foreign Income Filing" },
  itr_3_business_professional: { amount: 2999, validityDays: 365, name: "ITR-3 Business & Profession Detailed Filing" },
  itr_4_presumptive_taxation: { amount: 1499, validityDays: 365, name: "ITR-4 Presumptive Business/Professional Filing" },
  itr_5_partnership_llp_aop: { amount: 3999, validityDays: 365, name: "ITR-5 Partnership Firm & LLP Tax Filing" },
  itr_6_private_limited_corporate: { amount: 5999, validityDays: 365, name: "ITR-6 Corporate Company Income Tax Filing" },
  itr_7_trust_section_8_tax: { amount: 6999, validityDays: 365, name: "ITR-7 Trust & Section 8 NGO Annual Filing" },
  tax_audit_filing_form_3ca_3cb_3cd: { amount: 7999, validityDays: 365, name: "Tax Audit Report Filing (Form 3CA/3CD)" },
  tds_quarterly_return_24q_26q: { amount: 1499, validityDays: 365, name: "TDS Quarterly Return Filing (24Q/26Q)" },
  tds_tcs_correction_return: { amount: 1299, validityDays: 365, name: "TDS/TCS Correction & Justification Report" },
  income_tax_notice_reply_143_148: { amount: 3499, validityDays: 365, name: "Income Tax Notice Reply (Sec 143/148)" },
  form_15ca_15cb_foreign_remittance: { amount: 2999, validityDays: 365, name: "Form 15CA & 15CB CA Certification" },
  pan_tan_instant_registration: { amount: 499, validityDays: 365, name: "New Business PAN & TAN Allotment" },
  advance_tax_computation: { amount: 999, validityDays: 365, name: "Quarterly Advance Tax Assessment" },
  vivad_se_vishwas_settlement: { amount: 6999, validityDays: 365, name: "Direct Tax Vivad se Vishwas Settlement" },
  updated_tax_return_itr_u: { amount: 2499, validityDays: 365, name: "Updated Return Filing under Sec 139(8A) (ITR-U)" },

  // 7. MCA & CORPORATE SECRETARIAL
  mca_annual_filing_aoc4_mgt7: { amount: 4999, validityDays: 365, name: "MCA Annual Filing Package (AOC-4 & MGT-7)" },
  "mca-annual-filing": { amount: 4999, validityDays: 365, name: "MCA Annual Filing Package (AOC-4 & MGT-7)" },
  mca_llp_annual_filing_form8_form11: { amount: 3499, validityDays: 365, name: "LLP Annual Compliances (Form 8 & Form 11)" },
  dir_3_kyc_director_kyc_update: { amount: 499, validityDays: 365, name: "Director Annual e-KYC (DIR-3 KYC Web/e-Form)" },
  "dir-3-kyc": { amount: 499, validityDays: 365, name: "Director Annual e-KYC (DIR-3 KYC Web/e-Form)" },
  add_remove_director_dir11_dir12: { amount: 1999, validityDays: 365, name: "Appointment or Resignation of Director (DIR-12)" },
  change_registered_office_inc22: { amount: 2499, validityDays: 365, name: "Change of Registered Office Address (INC-22)" },
  increase_authorized_share_capital_sh7: { amount: 3499, validityDays: 365, name: "Increase in Authorized Share Capital (SH-7)" },
  transfer_allotment_of_shares_pas3: { amount: 2999, validityDays: 365, name: "Share Transfer & Return of Allotment (PAS-3)" },
  strike_off_company_dte98: { amount: 8999, validityDays: 365, name: "Closure of Company Fast Track Exit (STK-2)" },
  strike_off_llp_closure_form24: { amount: 6999, validityDays: 365, name: "Strike Off / Closure of LLP (Form 24)" },
  commencement_of_business_inc20a: { amount: 1299, validityDays: 365, name: "Declaration of Commencement of Business (INC-20A)" },
  charge_creation_satisfaction_chg1_chg4: { amount: 2499, validityDays: 365, name: "Bank Charge Creation & Satisfaction (CHG-1/4)" },
  statutory_registers_minute_book_prep: { amount: 2999, validityDays: 365, name: "Statutory Registers & Board Minutes Maintenance" },
  active_company_tagging_inc22a: { amount: 1499, validityDays: 365, name: "ACTIVE Company Tagging (Form INC-22A)" },
  conversion_pvt_ltd_to_public_ltd: { amount: 19999, validityDays: 365, name: "Conversion: Private Limited to Public Limited" },
  demat_of_shares_pas6_pvt_ltd: { amount: 4999, validityDays: 365, name: "Demat Mandatory Compliance for Pvt Ltd (PAS-6)" },

  // 8. TRADEMARK & INTELLECTUAL PROPERTY
  trademark_registration: { amount: 1999, validityDays: 365, name: "Trademark Registration (Individual/MSME)" },
  "trademark-registration": { amount: 1999, validityDays: 365, name: "Trademark Registration" },
  SERVICE_TRADEMARK_REGISTRATION_BASIC: { amount: 1999, validityDays: 365, name: "Trademark Registration (Basic Plan)" },
  SERVICE_TRADEMARK_REGISTRATION_STANDARD: { amount: 3999, validityDays: 365, name: "Trademark Registration (Standard Plan)" },
  SERVICE_TRADEMARK_REGISTRATION_ANNUAL: { amount: 8999, validityDays: 365, name: "Trademark Registration (Complete Annual Suite)" },
  trademark_search_and_filing_individual: { amount: 1999, validityDays: 365, name: "Trademark Registration (Individual/MSME)" },
  trademark_filing_company: { amount: 3999, validityDays: 365, name: "Trademark Filing (Corporate/Entity Package)" },
  trademark_objection_reply_form_miscr: { amount: 2999, validityDays: 365, name: "Trademark Examination Report Objection Reply" },
  trademark_hearing_advocate_appearance: { amount: 4999, validityDays: 365, name: "Trademark Hearing Virtual Representation" },
  trademark_opposition_counter_statement: { amount: 6999, validityDays: 365, name: "Trademark Opposition Filing / Counter Statement" },
  trademark_renewal_10_years: { amount: 3499, validityDays: 365, name: "Trademark Renewal for 10 Years" },
  copyright_registration_software_art: { amount: 3999, validityDays: 365, name: "Copyright Application Filing & Certificate" },
  "copyright-registration": { amount: 3999, validityDays: 365, name: "Copyright Application Filing & Certificate" },
  provisional_patent_drafting_filing: { amount: 11999, validityDays: 365, name: "Provisional Patent Application Drafting & Filing" },
  complete_patent_specification_filing: { amount: 24999, validityDays: 365, name: "Complete Patent Specification & Claims Drafting" },
  design_registration_industrial: { amount: 5999, validityDays: 365, name: "Industrial Design Registration" },
  international_trademark_madrid_protocol: { amount: 14999, validityDays: 365, name: "International Trademark via Madrid Protocol" },
  trademark_assignment_licensing: { amount: 4999, validityDays: 365, name: "Trademark Assignment & Licensing Agreement" },

  // 9. LICENCES & ACCREDITATIONS
  udyam_msme_registration: { amount: 799, validityDays: 365, name: "Udyam MSME Government Registration" },
  "udyam-registration": { amount: 799, validityDays: 365, name: "Udyam MSME Government Registration" },
  fssai_basic_registration: { amount: 1499, validityDays: 365, name: "FSSAI Basic Food Business Registration" },
  "fssai-registration": { amount: 1499, validityDays: 365, name: "FSSAI Basic Food Business Registration" },
  fssai_state_license: { amount: 3999, validityDays: 365, name: "FSSAI State Food License Registration" },
  fssai_central_license: { amount: 7999, validityDays: 365, name: "FSSAI Central Food License Registration" },
  import_export_code_dgft_iec: { amount: 1499, validityDays: 365, name: "Import Export Code (IEC) from DGFT" },
  "iec-registration": { amount: 1499, validityDays: 365, name: "Import Export Code (IEC) from DGFT" },
  apeda_registration_rcmc: { amount: 3499, validityDays: 365, name: "APEDA Registration for Agricultural Exports" },
  spice_board_registration_cres: { amount: 3999, validityDays: 365, name: "Spices Board CRES Registration" },
  tea_coffee_board_rcmc: { amount: 3999, validityDays: 365, name: "Tea & Coffee Board Exporter Registration" },
  epfo_pf_registration_establishment: { amount: 1999, validityDays: 365, name: "EPF Establishment Employer Registration" },
  esic_registration_establishment: { amount: 1999, validityDays: 365, name: "ESIC Establishment Employer Registration" },
  iso_9001_quality_certification: { amount: 3999, validityDays: 365, name: "ISO 9001:2015 Quality Management Certification" },
  iso_22000_food_safety_haccp: { amount: 6999, validityDays: 365, name: "ISO 22000 / HACCP Food Safety Certification" },
  gem_portal_seller_registration: { amount: 1999, validityDays: 365, name: "Government e-Marketplace (GeM) Seller Setup" },
  bar_code_gs1_india_allotment: { amount: 4999, validityDays: 365, name: "GS1 Official Barcode Allocation for Retail Products" },
  pollution_control_cte_cto_board: { amount: 9999, validityDays: 365, name: "Pollution Control Board Consent to Establish/Operate" },

  // 10. BANK LOANS, DPR & FINANCIAL ADVISORY
  detailed_project_report_basic: { amount: 999, validityDays: 365, name: "Detailed Project Report (Standard Bank Model)" },
  detailed_project_report_cma_data: { amount: 2999, validityDays: 365, name: "Complete Bank CMA Data & 7-Year Projections" },
  "cma-data": { amount: 2999, validityDays: 365, name: "Complete Bank CMA Data & 7-Year Projections" },
  dpr_steam_rice_mill_pmksy: { amount: 4999, validityDays: 365, name: "Steam Rice Mill Detailed Project Report (PMKSY)" },
  dpr_cold_chain_cold_storage: { amount: 6999, validityDays: 365, name: "Integrated Cold Chain DPR (Ministry of Food Processing)" },
  dpr_poultry_broiler_farming: { amount: 2999, validityDays: 365, name: "Commercial Poultry Farming DPR & Subsidy Plan" },
  dpr_solar_ev_charging_infrastructure: { amount: 4999, validityDays: 365, name: "Solar EV Infrastructure Detailed Project Report" },
  dpr_oil_mill_solvent_extraction: { amount: 5999, validityDays: 365, name: "Edible Oil Mill Project Report & Financial Model" },
  cgtmse_collateral_free_loan_dpr: { amount: 2999, validityDays: 365, name: "CGTMSE Collateral-Free Bank Loan DPR Package" },
  mudra_loan_project_report_tarun: { amount: 1499, validityDays: 365, name: "PMMY MUDRA Tarun Loan Project Report (₹10L)" },
  "mudra-loan": { amount: 1499, validityDays: 365, name: "PMMY MUDRA Loan Advisory" },
  pmegep_subsidy_dpr_model: { amount: 1999, validityDays: 365, name: "PMEGP 35% Margin Money Subsidy DPR Report" },
  "pmegp-loan": { amount: 1999, validityDays: 365, name: "PMEGP Margin Money Subsidy Loan Package" },
  stand_up_india_sc_st_women_loan_dpr: { amount: 3499, validityDays: 365, name: "Stand-Up India Greenfield Venture Project Report" },
  cibil_dispute_resolution_consultation: { amount: 2999, validityDays: 365, name: "CIBIL Dispute Settlement & Credit Rectification" },
  commercial_cibil_cmr_report_rectification: { amount: 4999, validityDays: 365, name: "Company CIBIL (CMR) Report Score Diagnostic" },
  bank_loan_syndication_due_diligence: { amount: 14999, validityDays: 365, name: "Corporate Debt Syndication Due Diligence" },
  subsidy_eligibility_expert_advisory: { amount: 1999, validityDays: 365, name: "State & Central Subsidy Eligibility Advisory Session" }
};

function normalizeProductCode(value) {
  const code = String(value || "").trim();

  if (
    code === "CIBIL_PRO" ||
    code === "CIBIL_CONSULTATION" ||
    code === "CIBIL_FULL"
  ) {
    return "CIBIL_PRO_CONSULTATION";
  }

  if (
    code === "subsidy-advisory-pass" ||
    code === "subsidy_advisory_pass"
  ) {
    return "SUBSIDY_ADVISORY_PASS";
  }

  return code;
}

async function resolveServiceOrProduct(productCode, body = {}) {
  const normalized = normalizeProductCode(productCode);

  if (allowedProducts[normalized]) {
    return {
      code: normalized,
      amount: allowedProducts[normalized].amount,
      validityDays: allowedProducts[normalized].validityDays,
      name: allowedProducts[normalized].name,
      isCoreProduct: true,
    };
  }

  // Look for lowercase and slug representations
  const slugVariant = normalized.toLowerCase().replace(/_/g, "-");
  if (allowedProducts[slugVariant]) {
    return {
      code: slugVariant,
      amount: allowedProducts[slugVariant].amount,
      validityDays: allowedProducts[slugVariant].validityDays,
      name: allowedProducts[slugVariant].name,
      isCoreProduct: true,
    };
  }

  if (supabaseAdmin) {
    try {
      const { data: dbService } = await supabaseAdmin
        .from("services")
        .select("id, name, title, price, code, slug")
        .or(`code.eq.${normalized},slug.eq.${normalized},id.eq.${normalized}`)
        .maybeSingle();

      if (dbService) {
        return {
          code: normalized,
          amount: Number(dbService.price || body.amount || 1499),
          validityDays: 365,
          name: dbService.name || dbService.title || "GoSubsidy Business Service",
          isCoreProduct: false,
        };
      }
    } catch {
      // Fallback below
    }
  }

  const amount = Number(body.amount || body.price);
  if (amount && amount > 0) {
    return {
      code: normalized,
      amount: Math.round(amount),
      validityDays: Number(body.validityDays) || 365,
      name: String(body.productName || body.name || normalized.replace(/_/g, " ")),
      isCoreProduct: false,
    };
  }

  return null;
}

function requireSupabaseAdmin(res) {
  if (!supabaseAdmin) {
    res.status(500).json({
      success: false,
      message:
        "Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend .env.",
    });
    return false;
  }
  return true;
}

async function getAuthenticatedUser(req) {
  const authorization = String(req.headers.authorization || "");
  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const accessToken = authorization.slice(7).trim();
  if (!accessToken || !supabaseAdmin) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }
  return user;
}

// ============================================================
// 1. GET /api/payment/config
// ============================================================

router.get("/config", async (req, res) => {
  try {
    if (!razorpayKeyId || !razorpayKeySecret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env.",
      });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        message: "Supabase server configuration is missing.",
      });
    }

    return res.json({
      success: true,
      keyId: razorpayKeyId,
    });
  } catch (error) {
    console.error("[Razorpay] Config error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Razorpay configuration.",
    });
  }
});

// ============================================================
// 2. POST /api/payment/create-order
// Enforces mandatory Email ID and 10-digit Mobile Number
// ============================================================

router.post("/create-order", async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured on the backend server.",
      });
    }

    if (!requireSupabaseAdmin(res)) return;

    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in to your GoSubsidy account before making a payment.",
      });
    }

    // MANDATORY EMAIL VALIDATION
    const customerEmail = String(
      req.body?.customerEmail ||
      req.body?.email ||
      user?.email ||
      ""
    ).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: "A valid Email ID is mandatory to proceed with this application.",
      });
    }

    // MANDATORY 10-DIGIT MOBILE NUMBER VALIDATION
    const rawContact = String(
      req.body?.customerPhone ||
      req.body?.mobile ||
      req.body?.phone ||
      user?.phone ||
      user?.user_metadata?.phone ||
      user?.user_metadata?.mobile ||
      ""
    );
    const cleanPhone = rawContact.replace(/[^0-9]/g, "").slice(-10);
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "A valid 10-digit Mobile Number starting with 6, 7, 8, or 9 is mandatory to proceed.",
      });
    }

    const item = await resolveServiceOrProduct(
      req.body?.productCode || req.body?.serviceSlug,
      req.body
    );

    if (!item || !item.amount || item.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid product or service specifications: ${req.body?.productCode || req.body?.serviceSlug || "missing"}`,
      });
    }

    const sanitizedCode = item.code.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 16);
    const receipt = `GS_${sanitizedCode}_${Date.now().toString().slice(-8)}`;

    const order = await razorpay.orders.create({
      amount: Math.round(item.amount * 100),
      currency: "INR",
      receipt,
      notes: {
        product_code: item.code,
        product_name: item.name,
        serviceSlug: req.body?.serviceSlug || item.code,
        package: req.body?.packageName || "Basic Plan",
        applicant_name: req.body?.customerName || user?.user_metadata?.full_name || "Applicant",
        applicant_email: customerEmail,
        applicant_phone: `+91 ${cleanPhone}`,
        user_id: user.id,
        user_email: customerEmail,
        platform: "GoSubsidy",
      },
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      productCode: item.code,
      productName: item.name,
      validityDays: item.validityDays,
    });
  } catch (error) {
    console.error("[Razorpay] CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.description ||
        error?.message ||
        "Unable to create Razorpay order.",
    });
  }
});

// ============================================================
// 3. POST /api/payment/verify
// ============================================================

router.post("/verify", async (req, res) => {
  try {
    if (!razorpay || !razorpayKeySecret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured on the server.",
      });
    }

    if (!requireSupabaseAdmin(res)) return;

    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your GoSubsidy session is not valid. Please log in again.",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productCode,
    } = req.body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !productCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Razorpay payment verification parameters.",
      });
    }

    // A. Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expected = Buffer.from(generatedSignature, "utf8");
    const received = Buffer.from(razorpay_signature, "utf8");

    const valid =
      expected.length === received.length &&
      crypto.timingSafeEqual(expected, received);

    if (!valid) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Payment signature verification failed.",
      });
    }

    // B. Fetch Razorpay Order & Payment Objects
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    const paymentStatus = String(razorpayPayment?.status || "").toLowerCase();
    if (!["captured", "authorized"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: `Payment status is ${razorpayPayment.status}.`,
      });
    }

    const item = await resolveServiceOrProduct(productCode, {
      amount: Number(order.amount) / 100,
      productName: order?.notes?.product_name,
    });

    const realPhone =
      order?.notes?.applicant_phone ||
      razorpayPayment.contact ||
      user?.phone ||
      user?.user_metadata?.phone ||
      user?.user_metadata?.mobile ||
      null;

    const realEmail =
      order?.notes?.applicant_email ||
      razorpayPayment.email ||
      user.email;

    // C. Define and save Payment Payload in gosubsidy_payments
    const paymentPayload = {
      user_id: user.id,
      product_code: item.code,
      product_name: item.name,
      amount: Number(razorpayPayment.amount) / 100,
      currency: razorpayPayment.currency || "INR",
      payment_status: razorpayPayment.status || "captured",
      razorpay_order_id,
      razorpay_payment_id,
      payment_method: razorpayPayment.method || null,
      payment_email: realEmail,
      payment_contact: realPhone,
      captured_at: razorpayPayment.captured_at
        ? new Date(Number(razorpayPayment.captured_at) * 1000).toISOString()
        : new Date().toISOString(),
      metadata: {
        order_notes: order.notes || {},
        razorpay_order_id,
        is_service: !item.isCoreProduct,
      },
    };

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("gosubsidy_payments")
      .upsert(paymentPayload, { onConflict: "razorpay_payment_id" })
      .select("*")
      .single();

    if (paymentError) {
      console.error("[Supabase] Payment save error:", paymentError);
    }

    // D. Save corresponding Application Record for Customer & Admin Enquiries
    const applicationPayload = {
      user_id: user.id,
      application_id: razorpay_order_id,
      service_name: item.name,
      service_slug: String(order?.notes?.serviceSlug || item.code.toLowerCase()),
      category: order?.notes?.category || "Business Service",
      package_name: order?.notes?.package || "Basic Plan",
      amount: Number(razorpayPayment.amount) / 100,
      status: "In Progress",
      stage: "Document Verification",
      payment_id: payment ? payment.id : null,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      applicant_name: order?.notes?.applicant_name || user?.user_metadata?.full_name || "Applicant",
      applicant_email: realEmail,
      applicant_phone: realPhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: appErr } = await supabaseAdmin
        .from("applications")
        .upsert(applicationPayload, { onConflict: "application_id" });

      if (appErr) {
        await supabaseAdmin
          .from("gosubsidy_applications")
          .upsert(applicationPayload, { onConflict: "application_id" });
      }
    } catch (e) {
      console.warn("[Applications Insert] Fallback handled:", e.message);
    }

    // E. Update Entitlement
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + item.validityDays);

    const entitlementPayload = {
      user_id: user.id,
      product_code: item.code,
      status: "active",
      starts_at: now.toISOString(),
      expires_at: expiryDate.toISOString(),
      payment_id: payment?.id || null,
      updated_at: now.toISOString(),
    };

    const { data: entitlement } = await supabaseAdmin
      .from("gosubsidy_entitlements")
      .upsert(entitlementPayload, { onConflict: "user_id,product_code" })
      .select("*")
      .single();

    return res.json({
      success: true,
      verified: true,
      productCode: item.code,
      productName: item.name,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      payment: {
        id: payment?.id || null,
        amount: payment?.amount || Number(razorpayPayment.amount) / 100,
        currency: payment?.currency || "INR",
        status: payment?.payment_status || "captured",
      },
      entitlement: entitlement || null,
    });
  } catch (error) {
    console.error("[Razorpay] VERIFICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to verify payment.",
    });
  }
});

// ============================================================
// 4. POST /api/payment/customer/enquiry
// Direct lead capture endpoint requiring mobile & email
// ============================================================

router.post("/customer/enquiry", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;

    const {
      name,
      email,
      phone,
      service,
      category,
      amount,
      businessName,
      application_id,
    } = req.body || {};

    const cleanEmail = String(email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "A valid Email ID is mandatory.",
      });
    }

    const rawDigits = String(phone || "").replace(/[^0-9]/g, "").slice(-10);
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!rawDigits || !phoneRegex.test(rawDigits)) {
      return res.status(400).json({
        success: false,
        message: "A valid 10-digit Indian Mobile Number starting with 6, 7, 8, or 9 is mandatory.",
      });
    }

    const formattedPhone = `+91 ${rawDigits}`;
    const appId = application_id || `ENQ_${Date.now()}`;

    const leadPayload = {
      application_id: appId,
      applicant_name: name || "Applicant",
      applicant_email: cleanEmail,
      applicant_phone: formattedPhone,
      service_name: service || "Government Scheme Advisory & Alerts",
      category: category || "Government Subsidies",
      amount: Number(amount) || 999,
      status: "In Progress",
      stage: "Document Verification",
      business_name: businessName || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await supabaseAdmin.from("applications").upsert(leadPayload, { onConflict: "application_id" });
    } catch {
      await supabaseAdmin.from("gosubsidy_applications").upsert(leadPayload, { onConflict: "application_id" });
    }

    return res.json({
      success: true,
      message: "Customer enquiry registered successfully.",
      enquiry: leadPayload,
    });
  } catch (err) {
    console.error("[Customer Enquiry Error]:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// 5. GET /api/payment/customer/applications
// Scoped to the logged-in customer's own applications
// ============================================================

router.get("/customer/applications", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your applications.",
      });
    }

    let { data: appData } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!appData || appData.length === 0) {
      const { data: altAppData } = await supabaseAdmin
        .from("gosubsidy_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (altAppData && altAppData.length > 0) {
        appData = altAppData;
      }
    }

    if (!appData || appData.length === 0) {
      const { data: payments } = await supabaseAdmin
        .from("gosubsidy_payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (payments && payments.length > 0) {
        appData = payments.map((p) => ({
          id: p.razorpay_order_id || p.id,
          application_id: p.razorpay_order_id,
          service_name: p.product_name,
          title: p.product_name,
          applicant_name: p.metadata?.order_notes?.applicant_name || "Applicant",
          applicant_email: p.payment_email,
          payment_email: p.payment_email,
          applicant_phone: p.payment_contact,
          payment_contact: p.payment_contact,
          stage: "Document Verification",
          status: "In Progress",
          amount: p.amount,
          amountPaid: `₹${Number(p.amount).toLocaleString("en-IN")}`,
          submittedOn: new Date(p.created_at || Date.now()).toLocaleDateString("en-IN"),
          created_at: p.created_at,
        }));
      }
    }

    return res.json({
      success: true,
      applications: appData || [],
    });
  } catch (error) {
    console.error("[Customer Applications Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer applications.",
    });
  }
});

// ============================================================
// 6. GET /api/payment/admin/all-applications
// Admin Vault: Fetches ALL customer applications & purchases
// ============================================================

router.get("/admin/all-applications", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;

    let { data: allApps, error: appErr } = await supabaseAdmin
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (appErr || !allApps || allApps.length === 0) {
      const { data: altApps } = await supabaseAdmin
        .from("gosubsidy_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (altApps && altApps.length > 0) {
        allApps = altApps;
      }
    }

    const { data: allPayments } = await supabaseAdmin
      .from("gosubsidy_payments")
      .select("*")
      .order("created_at", { ascending: false });

    const combined = [...(allApps || [])];

    if (Array.isArray(allPayments)) {
      allPayments.forEach((p) => {
        const orderId = p.razorpay_order_id || p.id;
        const exists = combined.some(
          (a) => a.application_id === orderId || a.id === orderId
        );
        if (!exists) {
          combined.push({
            id: orderId,
            application_id: orderId,
            service_name: p.product_name,
            applicant_name: p.metadata?.order_notes?.applicant_name || "Customer",
            applicant_email: p.payment_email,
            payment_email: p.payment_email,
            applicant_phone: p.payment_contact || p.metadata?.order_notes?.applicant_phone,
            payment_contact: p.payment_contact,
            amount: p.amount,
            status: "In Progress",
            created_at: p.created_at,
          });
        }
      });
    }

    return res.json({
      success: true,
      applications: combined,
    });
  } catch (err) {
    console.error("[Admin All Applications Error]:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// 7. POST /api/payment/admin/create-admin-user
// Provision exclusive Admin Accounts with User IDs & Supabase Auth
// ============================================================

router.post("/admin/create-admin-user", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;

    const { userId, name, email, password, role } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are mandatory.",
      });
    }

    // Provision administrative user in Supabase Auth
    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        admin_user_id: userId || `GS-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
        role: role || "Admin",
        is_admin: true,
      },
    });

    if (createErr) {
      return res.status(400).json({ success: false, message: createErr.message });
    }

    // Persist extended user profile
    await supabaseAdmin.from("profiles").upsert({
      id: newUser.user.id,
      email,
      full_name: name,
      user_id_code: userId,
      role: role || "Admin",
      is_admin: true,
      updated_at: new Date().toISOString(),
    });

    return res.json({
      success: true,
      message: `Admin user ${name} (${userId}) provisioned successfully.`,
      user: newUser.user,
    });
  } catch (err) {
    console.error("[Create Admin User Error]:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// 8. PATCH /api/payment/applications/:applicationId/status
// Admin status updater (e.g., In Progress -> Approved | Closed)
// ============================================================

router.patch("/applications/:applicationId/status", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;

    const { applicationId } = req.params;
    const { status, stage } = req.body || {};

    if (!applicationId || !status) {
      return res.status(400).json({
        success: false,
        message: "Both applicationId and status are required.",
      });
    }

    let defaultStage = stage;
    if (!defaultStage) {
      const s = status.toLowerCase();
      if (s.includes("closed") || s.includes("reject")) {
        defaultStage = "Completed / Archived";
      } else if (s.includes("approved") || s.includes("sanction")) {
        defaultStage = "Sanction Letter Issued";
      } else {
        defaultStage = "Document Verification";
      }
    }

    const updatePayload = {
      status,
      stage: defaultStage,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await supabaseAdmin
      .from("applications")
      .update(updatePayload)
      .eq("application_id", applicationId)
      .select("*");

    if (error || !data || data.length === 0) {
      const fallback = await supabaseAdmin
        .from("gosubsidy_applications")
        .update(updatePayload)
        .eq("application_id", applicationId)
        .select("*");

      if (fallback?.data?.length > 0) {
        data = fallback.data;
      }
    }

    return res.json({
      success: true,
      message: `Application ${applicationId} successfully marked as ${status}.`,
      updated: data || updatePayload,
    });
  } catch (err) {
    console.error("[Application Status Update Error]:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// 9. GET /api/payment/history
// ============================================================

router.get("/history", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view payment history.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("gosubsidy_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, payments: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 10. GET /api/payment/entitlement/:productCode
// ============================================================

router.get("/entitlement/:productCode", async (req, res) => {
  try {
    if (!requireSupabaseAdmin(res)) return;
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, entitled: false });
    }

    const productCode = normalizeProductCode(req.params.productCode);

    const { data, error } = await supabaseAdmin
      .from("gosubsidy_entitlements")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_code", productCode)
      .maybeSingle();

    if (error) throw error;

    const active =
      Boolean(data) &&
      data.status === "active" &&
      new Date(data.expires_at) > new Date();

    return res.json({ success: true, entitled: active, entitlement: active ? data : null });
  } catch (error) {
    return res.status(500).json({ success: false, entitled: false, message: error.message });
  }
});

export default router;