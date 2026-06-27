import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseAccount from "./pages/ChooseAccount";
import Logininf from "./pages/Logininfo";

import ForgotPassword from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
import NewPassword from "./pages/NewPassword";
import ResetSuccess from "./pages/ResetSuccess";

import ProviderSignup from "./pages/ProviderSignup";
import ProviderRegister from "./pages/ProviderRegister";
import ProviderGeneratorInfo from "./pages/ProviderGeneratorInfo";
import ProviderDocuments from "./pages/ProviderDocuments";
import ProviderPending from "./pages/ProviderPending";
import ProviderSuccess from "./pages/ProviderSuccess";

import ContactUs from "./pages/ContactUs";
import TermsModal from "./pages/TermsModal";

import ProviderModal from "./components/ProviderModal/ProviderModal";
import PrivacyModal from "./components/PrivacyModal/PrivacyModal";

function App() {
  return (
    <Routes>
      {/* WELCOME / الصفحة الرئيسية */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* LOGIN SCREEN */}
      <Route path="/login" element={<Login />} />

      {/* REMEMBER PASSWORD */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* OTP VERIFICATION */}
      <Route path="/otp" element={<OtpPage />} />

      {/* NEW PASSWORD */}
      <Route path="/new-password" element={<NewPassword />} />

      {/* PASSWORD CHANGED */}
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* SIGN UP - CHOOSE ACCOUNT */}
      <Route path="/choose-account" element={<ChooseAccount />} />

      {/* SIGNUP AS CUSTOMER */}
      <Route path="/login-info" element={<Logininf />} />

      {/* SIGNUP AS PROVIDER */}
      <Route path="/provider-signup" element={<ProviderSignup />} />

      {/* PROVIDER REGISTER */}
      <Route path="/provider-register" element={<ProviderRegister />} />

      {/* PROVIDER GENERATOR INFO */}
      <Route
        path="/provider-generator-info"
        element={<ProviderGeneratorInfo />}
      />

      {/* PROVIDER DOCUMENTS */}
      <Route path="/provider-documents" element={<ProviderDocuments />} />

      {/* ACCOUNT PENDING */}
      <Route path="/provider-pending" element={<ProviderPending />} />

      {/* ACCOUNT CREATED */}
      <Route path="/provider-success" element={<ProviderSuccess />} />

      {/* CONTACT US */}
      <Route path="/contact-us" element={<ContactUs />} />

      {/* OVERLAYS */}
      <Route path="/terms" element={<TermsModal />} />
      <Route path="/privacy" element={<PrivacyModal />} />
      <Route path="/provider-modal" element={<ProviderModal />} />

      {/* أي رابط غلط يرجع للرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;