import { Routes, Route, Navigate } from "react-router-dom";

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

import ProviderModal from "./components/ProviderModal/ProviderModal";
import PrivacyModal from "./components/PrivacyModal/PrivacyModal";

import CustomerHome from "./pages/Customer/CustomerHome/CustomerHome";

function App() {
  return (
    <Routes>
      {/* الصفحة الرئيسية */}
      <Route path="/" element={<Home />} />

      {/* اللوجين لحالها */}
      <Route path="/login" element={<Login />} />

      {/* صفحة تجربة: اللوجين وتحتها الكاستمر */}
      <Route
        path="/preview"
        element={
          <>
            <Login />
            <CustomerHome />
          </>
        }
      />

      {/* صفحة الكاستمر لحالها */}
      <Route path="/customer" element={<CustomerHome />} />

      {/* صفحات عامة */}
      <Route path="/choose-account" element={<ChooseAccount />} />
      <Route path="/login-info" element={<Logininf />} />

      {/* استرجاع كلمة المرور */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* صفحات المزود */}
      <Route path="/provider-register" element={<ProviderRegister />} />
      <Route path="/provider-generator-info" element={<ProviderGeneratorInfo />} />
      <Route path="/provider-documents" element={<ProviderDocuments />} />
      <Route path="/provider-pending" element={<ProviderPending />} />
      <Route path="/provider-success" element={<ProviderSuccess />} />
      <Route path="/provider-modal" element={<ProviderModal />} />

      {/* صفحات إضافية */}
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/terms" element={<TermsModal />} />
      <Route path="/privacy" element={<PrivacyModal />} />

      {/* أي رابط غلط يرجع للرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;