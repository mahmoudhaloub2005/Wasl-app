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



import CustomerHome from "./pages/Customer/CustomerHome/CustomerHome";
import Generators from "./pages/Customer/Generators/Generators";
import GeneratorDetails from "./pages/Customer/GeneratorDetails";
import CustomerSubscriptionPage from "./pages/Customer/CustomerSubscriptionPage";
import CustomerBillsPage from "./pages/Customer/CustomerBillsPage";
import CustomerReviewsPage from "./pages/Customer/CustomerReviewsPage";
import CustomerComplaintsPage from "./pages/Customer/CustomerComplaintsPage";
import Profile from "./pages/Customer/Profile";
function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Welcome />} />

      {/* Public */}
      <Route path="/contact-us" element={<ContactUs />} />

      {/* Customer Register */}
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

      {/* Any wrong link returns to home */}
      <Route path="*" element={<Navigate to="/" replace />} />


         <Route path="/" element={<Navigate to="/customer" replace />} />

      <Route path="/customer" element={<CustomerHome />} />

      <Route path="/customer/home" element={<CustomerHome />} />

      <Route path="/customer/generators" element={<Generators />} />

      <Route
        path="/customer/generator-details/:id"
        element={<GeneratorDetails />}
      />

      {/* الاشتراكات من النافبار */}
      <Route
        path="/customer/subscriptions"
        element={<CustomerSubscriptionPage />}
      />

      {/* الاشتراك من تفاصيل مولد معيّن */}
      <Route
        path="/customer/subscriptions/:generatorId"
        element={<CustomerSubscriptionPage />}
      />

      {/* احتياط لو الرابط بدون s */}
      <Route
        path="/customer/subscription"
        element={<Navigate to="/customer/subscriptions" replace />}
      />

      <Route
        path="/customer/subscription/:generatorId"
        element={<CustomerSubscriptionPage />}
      />

      {/* الفواتير والمدفوعات */}
      <Route path="/customer/bills" element={<CustomerBillsPage />} />
<Route path="/customer/reviews" element={<CustomerReviewsPage />} />
<Route path="/customer/complaints" element={<CustomerComplaintsPage />} />
<Route path="/customer/profile" element={<Profile />} />
      {/* لازم يكون آخر Route */}
      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
}

export default App;


// import { Routes, Route, Navigate } from "react-router-dom";


// function App() {
//   return (
//     <Routes>
   
//     </Routes>
//   );
// }

// export default App;