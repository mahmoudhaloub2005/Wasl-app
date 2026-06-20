import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseAccount from "./pages/ChooseAccount";
import Logininf from "./pages/Logininfo";

import ForgotPassword from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
import NewPassword from "./pages/NewPassword";
import ResetSuccess from "./pages/ResetSuccess";

import ProviderRegister from "./pages/ProviderRegister";
import ProviderGeneratorInfo from "./pages/ProviderGeneratorInfo";
import ProviderDocuments from "./pages/ProviderDocuments";
import ProviderPending from "./pages/ProviderPending";
import ProviderSuccess from "./pages/ProviderSuccess";

import ContactUs from "./pages/ContactUs";
import TermsModal from "./pages/TermsModal";

import PrivacyModal from "./pages/PrivacyModal";
import ServiceModal from "./pages/ServiceModal";
import ProviderPage from "./pages/ProviderPage";
import SupportPage from "./pages/Support";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/choose-account" element={<ChooseAccount />} />
      <Route path="/login-info" element={<Logininf />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      <Route path="/provider-register" element={<ProviderRegister />} />
      <Route path="/provider-generator-info" element={<ProviderGeneratorInfo />} />
      <Route path="/provider-documents" element={<ProviderDocuments />} />
      <Route path="/provider-pending" element={<ProviderPending />} />
      <Route path="/provider-success" element={<ProviderSuccess />} />

      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/terms" element={<TermsModal />} />

      <Route path="/privacy" element={<PrivacyModal />} />
      <Route path="/service" element={<ServiceModal />} />
      <Route path="/provider" element={<ProviderPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Routes>
  );
}

export default App;