import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import HomePage from "./pages/public/HomePage";
import ContactUs from "./pages/public/ContactUs";

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
import ProviderInfo from "./pages/auth/ProviderInfo";
import ProviderPending from "./pages/auth/ProviderPending";
import ProviderSuccess from "./pages/auth/ProviderSuccess";

// Customer pages
import Generator from "./pages/Customer/Generator";
import GeneratorDetails from "./pages/Customer/GeneratorDetails";
import Subscription from "./pages/Customer/Subscription";

// Temporary page
import Logininfo from "./pages/Logininfo";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/contact-us" element={<ContactUs />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/choose-account" element={<ChooseAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* Provider signup flow */}
      <Route path="/provider-register" element={<ProviderRegister />} />
      <Route path="/provider-signup" element={<ProviderSignup />} />
      <Route path="/provider-documents" element={<ProviderDocuments />} />
      <Route path="/provider-generator-info" element={<ProviderGeneratorInfo />} />
      <Route path="/provider-info" element={<ProviderInfo />} />
      <Route path="/provider-pending" element={<ProviderPending />} />
      <Route path="/provider-success" element={<ProviderSuccess />} />

      {/* Customer */}
      <Route path="/generators" element={<Generator />} />
      <Route path="/generator-details" element={<GeneratorDetails />} />
      <Route path="/subscription" element={<Subscription />} />

      {/* مؤقتًا لأن Logininfo لسه داخل pages */}
      <Route path="/login-info" element={<Logininfo />} />

      {/* أي رابط غلط يرجع للهوم */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;