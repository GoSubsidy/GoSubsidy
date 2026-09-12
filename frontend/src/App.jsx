import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// ======================================================
// LANGUAGE CONTEXT PROVIDER
// ======================================================
import { LanguageProvider } from "./context/LanguageContext";

// ======================================================
// PUBLIC LAYOUT
// ======================================================
import Navbar from "./components/layout/Navbar";
import { trackVisit } from "./services/analytics";

// ======================================================
// PUBLIC PAGES
// ======================================================
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PaymentTerms from "./pages/PaymentTerms";
import Disclaimer from "./pages/Disclaimer";
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import StartupSchemes from "./pages/StartupSchemes";
import SchemeDetails from "./pages/SchemeDetails";
import Insurance from "./pages/Insurance";
import InsuranceQuote from "./pages/InsuranceQuote";
import InsuranceCompare from "./pages/InsuranceCompare";
import Cibil from "./pages/Cibil";
import AIAdvisor from "./pages/AIAdvisor";
import Loans from "./pages/Loans";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";

// ======================================================
// PREMIUM DPR & CALCULATORS
// ======================================================
import PremiumDPR from "./pages/PremiumDPR";
import DPRPreview from "./pages/DPRPreview";
import DprHeroPage from "./pages/DprHeroPage";
import SubsidyLoanEMICalculator from "./pages/SubsidyLoanEMICalculator";
import FixedDeposit from "./pages/FixedDeposit";
import GSTCalculator from "./pages/GSTCalculator";
import SIPCalculator from "./pages/SIPCalculator";
import DailySIPCalculator from "./pages/DailySIPCalculator";

// ======================================================
// LENDER / PROVIDER
// ======================================================
import LenderPortal from "./pages/LenderPortal";
import DemoProviderProposal from "./pages/DemoProviderProposal";
import ServicePage from "./pages/ServicePage";

// ======================================================
// CUSTOMER PORTAL
// ======================================================
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerApplications from "./pages/CustomerApplications";
import CustomerPayments from "./pages/CustomerPayments";
import CustomerNotifications from "./pages/CustomerNotifications";

// ======================================================
// ADMIN AUTH
// ======================================================
import ProtectedRoute from "./admin/components/ProtectedRoute";

// ======================================================
// ADMIN PAGES
// ======================================================
import AdminLogin from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminSchemes from "./admin/pages/Schemes";
import AddScheme from "./admin/pages/AddScheme";
import EditScheme from "./admin/pages/EditScheme";
import UploadSchemes from "./admin/pages/UploadSchemes";
import Categories from "./admin/pages/Categories";
import Ministries from "./admin/pages/Ministries";
import Users from "./admin/pages/Users";
import Settings from "./admin/pages/Settings";
import Analytics from "./admin/pages/Analytics";
import UserDocuments from "./admin/pages/UserDocuments";
import CustomerEnquiries from "./admin/pages/CustomerEnquiries";
import CustomerDirectory from "./admin/pages/CustomerDirectory";

// ======================================================
// APP CONTENT WITH LOCATION AWARENESS
// ======================================================
function AppContent() {
  const location = useLocation();

  // ====================================================
  // GLOBAL PORTAL PAGE-VISIT ANALYTICS
  // ====================================================
  // Tracks every public route automatically. Individual pages such as
  // Home and GoSubsidy Intelligence may also call trackVisit; analytics.js
  // prevents duplicate visits for the same route during one browser session.
  useEffect(() => {
    const path = `${location.pathname}${location.search || ""}`;

    // Never record admin/customer internal pages as public portal visits.
    const isInternalRoute =
      location.pathname === "/admin" ||
      location.pathname.startsWith("/admin/") ||
      location.pathname.startsWith("/customer/");

    if (isInternalRoute) {
      return;
    }

    const titleMap = {
      "/": "GoSubsidy Home",
      "/schemes": "Government Schemes",
      "/startup-schemes": "Startup Schemes",
      "/loans": "Loans",
      "/insurance": "Insurance",
      "/insurance/quote": "Insurance Quote",
      "/insurance/compare": "Insurance Compare",
      "/cibil": "CIBIL Credit",
      "/ai-advisor": "AI Advisor",
      "/dpr": "Detailed Project Report",
      "/dpr-catalog": "DPR Project Catalog",
      "/dpr-preview": "DPR Preview",
      "/subsidy-loan-emi-calculator": "Subsidy Loan EMI Calculator",
      "/lenders": "Lender Portal",
      "/about": "About GoSubsidy",
      "/contact": "Contact GoSubsidy",
      "/register": "Register",
      "/login": "Login",
    };

    const pageTitle =
      titleMap[location.pathname] ||
      (location.pathname.startsWith("/calculators/")
        ? "Loan / Financial Calculator"
        : location.pathname.startsWith("/services/")
        ? "GoSubsidy Service"
        : document.title || "GoSubsidy Portal");

    trackVisit(pageTitle, path).catch((error) => {
      // Analytics must never interrupt navigation or page rendering.
      console.warn("[GoSubsidy Analytics] Global visit tracking failed:", error);
    });
  }, [location.pathname, location.search]);

  // ====================================================
  // ADMIN ROUTE
  // ====================================================

  const isAdminRoute =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  // ====================================================
  // PREMIUM DPR PREVIEW
  // ====================================================

  const isDPRPreview =
    location.pathname === "/dpr-preview";

  // ====================================================
  // HIDE PUBLIC NAVBAR
  // ====================================================

  const hideNavbar =
    isAdminRoute ||
    isDPRPreview;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      {/* ==================================================
          PUBLIC NAVBAR
      ================================================== */}

      {!hideNavbar && <Navbar />}

      {/* ==================================================
          APPLICATION ROUTES
      ================================================== */}

      <Routes>

        {/* ==================================================
            PUBLIC WEBSITE
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/schemes"
          element={<Schemes />}
        />

        <Route
          path="/startup-schemes"
          element={<StartupSchemes />}
        />

        <Route
          path="/schemes/:id"
          element={<SchemeDetails />}
        />

        {/* ==================================================
            DYNAMIC CALCULATORS ROUTE (HANDLES ALL 17 CALCULATORS)
        ================================================== */}


        {/* ==================================================
            LOAN EMI CALCULATORS
            All use the existing SubsidyLoanEMICalculator engine.
        ================================================== */}
        <Route
          path="/calculators/subsidy-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/personal-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/home-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/business-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/gold-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/two-wheeler-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/loan-against-property"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/term-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/tractor-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/mudra-loan"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/:calcId"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/subsidy-loan-emi-calculator"
          element={<SubsidyLoanEMICalculator />}
        />

        <Route
          path="/calculators/fixed-deposit"
          element={<FixedDeposit />}
        />

        <Route
          path="/calculators/gst"
          element={<GSTCalculator />}
        />

        <Route
          path="/calculators/sip"
          element={<SIPCalculator />}
        />

        <Route
          path="/calculators/daily-sip"
          element={<DailySIPCalculator />}
        />

{/* ==================================================
            PREMIUM DPR GENERATOR & CATALOG
        ================================================== */}

        <Route
          path="/dpr-catalog"
          element={<DprHeroPage />}
        />

        <Route
          path="/dpr"
          element={<PremiumDPR />}
        />

        {/* ==================================================
            PREMIUM DPR PREVIEW
        ================================================== */}

        <Route
          path="/dpr-preview"
          element={<DPRPreview />}
        />

        {/* ==================================================
            CREDIT
        ================================================== */}

        <Route
          path="/cibil"
          element={<Cibil />}
        />

        <Route
          path="/ai-advisor"
          element={<AIAdvisor />}
        />

        {/* ==================================================
            LOANS
        ================================================== */}

        <Route
          path="/loans"
          element={<Loans />}
        />

        {/* ==================================================
            INSURANCE
        ================================================== */}

        <Route
          path="/insurance"
          element={<Insurance />}
        />

        <Route
          path="/insurance/quote"
          element={<InsuranceQuote />}
        />

        <Route
          path="/insurance/compare"
          element={<InsuranceCompare />}
        />

        {/* ==================================================
            LENDER
        ================================================== */}

        <Route
          path="/lenders"
          element={<LenderPortal />}
        />

        {/* ==================================================
            DEMO PROVIDER
        ================================================== */}

        <Route
          path="/insurance/demo-proposal"
          element={<DemoProviderProposal />}
        />

        {/* ==================================================
            SERVICES
        ================================================== */}

        <Route
          path="/services/:slug"
          element={<ServicePage />}
        />

        {/* ==================================================
            COMPANY
        ================================================== */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/payment-terms"
          element={<PaymentTerms />}
        />

        <Route
          path="/disclaimer"
          element={<Disclaimer />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ==================================================
            AUTH
        ================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================================
            CUSTOMER PORTAL
        ================================================== */}

        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/profile"
          element={<CustomerProfile />}
        />

        <Route
          path="/customer/applications"
          element={<CustomerApplications />}
        />

        <Route
          path="/customer/payments"
          element={<CustomerPayments />}
        />

        <Route
          path="/customer/notifications"
          element={<CustomerNotifications />}
        />

        {/* ==================================================
            ADMIN PORTAL
        ================================================== */}

        {/* ADMIN LOGIN */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ANALYTICS */}

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* ADMIN SCHEMES */}

        <Route
          path="/admin/schemes"
          element={
            <ProtectedRoute>
              <AdminSchemes />
            </ProtectedRoute>
          }
        />

        {/* ADD SCHEME */}

        <Route
          path="/admin/add-scheme"
          element={
            <ProtectedRoute>
              <AddScheme />
            </ProtectedRoute>
          }
        />

        {/* EDIT SCHEME */}

        <Route
          path="/admin/edit-scheme/:id"
          element={
            <ProtectedRoute>
              <EditScheme />
            </ProtectedRoute>
          }
        />

        {/* UPLOAD SCHEMES */}

        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute>
              <UploadSchemes />
            </ProtectedRoute>
          }
        />

        {/* CATEGORIES */}

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        {/* MINISTRIES */}

        <Route
          path="/admin/ministries"
          element={
            <ProtectedRoute>
              <Ministries />
            </ProtectedRoute>
          }
        />

        {/* USERS */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* SETTINGS */}

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DOCUMENTS */}

        <Route
          path="/admin/documents"
          element={
            <ProtectedRoute>
              <UserDocuments />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ENQUIRIES */}

        <Route
          path="/admin/enquiries"
          element={
            <ProtectedRoute>
              <CustomerEnquiries />
            </ProtectedRoute>
          }
        />

        {/* ADMIN CUSTOMERS */}

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <CustomerDirectory />
            </ProtectedRoute>
          }
        />

        {/* ADMIN HOME */}

        <Route
          path="/admin/home"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </>
  );
}

// ======================================================
// EXPORT APP WRAPPED IN LANGUAGE PROVIDER
// ======================================================
export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}