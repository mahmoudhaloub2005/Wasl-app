import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Welcome from "./pages/public/Welcome";
import ContactUs from "./pages/public/ContactUs";
import Logininfo from "./pages/Logininfo";

// Modals pages
import PrivacyModal from "./pages/modals/PrivacyModal";
import ProviderModal from "./pages/modals/ProviderModal";
import TermsModal from "./pages/modals/TermsModal";

// Auth pages
import Login from "./pages/auth/Login";
import ChooseAccount from "./pages/auth/ChooseAccount";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OtpPage from "./pages/auth/OtpPage";
import NewPassword from "./pages/auth/NewPassword";
import ResetSuccess from "./pages/auth/ResetSuccess";

// Provider auth flow
import ProviderRegister from "./pages/auth/ProviderRegister";
import ProviderSignup from "./pages/auth/ProviderSignup";
import ProviderDocuments from "./pages/auth/ProviderDocuments";
import ProviderGeneratorInfo from "./pages/auth/ProviderGeneratorInfo";
import ProviderPending from "./pages/auth/ProviderPending";
import ProviderSuccess from "./pages/auth/ProviderSuccess";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Welcome />} />

      {/* Public */}
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/register" element={<Logininfo />} />      
      {/* Modals */}
      <Route path="/privacy" element={<PrivacyModal />} />
      <Route path="/provider-modal" element={<ProviderModal />} />
      <Route path="/terms" element={<TermsModal />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/choose-account" element={<ChooseAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* Provider Flow */}
      <Route path="/provider-register" element={<ProviderRegister />} />
      <Route path="/provider-signup" element={<ProviderSignup />} />
      <Route path="/provider-documents" element={<ProviderDocuments />} />
      <Route
        path="/provider-generator-info"
        element={<ProviderGeneratorInfo />}
      />
      <Route path="/provider-pending" element={<ProviderPending />} />
      <Route path="/provider-success" element={<ProviderSuccess />} />

      {/* Redirects */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/choose-account" replace />} />

      {/* أي رابط غلط يرجع للرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />



    </Routes>
    
    
  );
}

export default App;
