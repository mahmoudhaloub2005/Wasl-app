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
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
import CustomerOfferDetailsPage from "./pages/Customer/CustomerOfferDetailsPage";
import CustomerReviewsPage from "./pages/Customer/CustomerReviewsPage";
import CustomerComplaintsPage from "./pages/Customer/CustomerComplaintsPage";
import CustomerNotificationsPage from "./pages/Customer/CustomerNotificationsPage";
import Profile from "./pages/Customer/Profile";
import ProviderHome from "./pages/Provider/ProviderHome";
import ProviderSubscriptions from "./pages/Provider/ProviderSubscriptions";
import ProviderGenerators from "./pages/Provider/ProviderGenerators";
import ProviderAdvertisements from "./pages/Provider/ProviderAdvertisements";
import ProviderFinance from "./pages/Provider/ProviderFinance";
import ProviderInvoices from "./pages/Provider/ProviderInvoices";
import ProviderPayments from "./pages/Provider/ProviderPayments";
import ProviderRatings from "./pages/Provider/ProviderRatings";
import ProviderProfile from "./pages/Provider/ProviderProfile";
import ProviderNotifications from "./pages/Provider/ProviderNotifications";
import ProviderPreparedRoute from "./pages/Provider/ProviderPreparedRoute";

function ProviderProtectedPage({ children }) {
  return (
    <ProtectedRoute allowedRoles={["provider", "seller", "owner"]}>
      {children}
    </ProtectedRoute>
  );
}

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

      <Route
        path="/provider"
        element={
          <ProviderProtectedPage>
            <ProviderHome />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/home"
        element={
          <ProviderProtectedPage>
            <ProviderHome />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/dashboard"
        element={
          <ProviderProtectedPage>
            <ProviderHome />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/subscriptions"
        element={
          <ProviderProtectedPage>
            <ProviderSubscriptions />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/generators"
        element={
          <ProviderProtectedPage>
            <ProviderGenerators />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/generators/add"
        element={<Navigate to="/provider/generators?add=1" replace />}
      />

      <Route
        path="/provider/generators/:generatorId/edit"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط¸â€‍ط·آ¯" />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/generators/:generatorId"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·ع¾ط¸ظ¾ط·آ§ط·آµط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط¸â€‍ط·آ¯" />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/advertisements"
        element={
          <ProviderProtectedPage>
            <ProviderAdvertisements />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/advertisements/add"
        element={
          <Navigate to="/provider/advertisements?add=1" replace />
        }
      />

      <Route
        path="/provider/finance"
        element={
          <ProviderProtectedPage>
            <ProviderFinance />
          </ProviderProtectedPage>
        }
      />

      <Route path="/provider/financial" element={<Navigate to="/provider/finance" replace />} />

      <Route
        path="/provider/payments"
        element={
          <ProviderProtectedPage>
            <ProviderFinance />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/finance/invoices"
        element={
          <ProviderProtectedPage>
            <ProviderInvoices />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/finance/invoices/:recordId"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·ع¾ط¸ظ¾ط·آ§ط·آµط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط¸ظ¾ط·آ§ط·ع¾ط¸ث†ط·آ±ط·آ©" />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/finance/payments"
        element={
          <ProviderProtectedPage>
            <ProviderPayments />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/finance/payments/:recordId"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·ع¾ط¸ظ¾ط·آ§ط·آµط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط·آ¯ط¸ظ¾ط·آ¹" />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/finance/reports"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·آ§ط¸â€‍ط·ع¾ط¸â€ڑط·آ§ط·آ±ط¸ظ¹ط·آ± ط·آ§ط¸â€‍ط¸â€¦ط·آ§ط¸â€‍ط¸ظ¹ط·آ©" />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/finance/capacity"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·آ³ط·آ¹ط·آ© ط·آ§ط·آ³ط·ع¾ط¸â€،ط¸â€‍ط·آ§ط¸ئ’ ط·آ§ط¸â€‍ط¸â€¦ط·آ´ط·ع¾ط·آ±ط¸ئ’ط¸ظ¹ط¸â€ " />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/financial/payment-verifications"
        element={<Navigate to="/provider/finance/payments" replace />}
      />

      <Route
        path="/provider/ratings-complaints"
        element={
          <ProviderProtectedPage>
            <ProviderRatings />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/ratings"
        element={
          <ProviderProtectedPage>
            <ProviderRatings />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/reviews"
        element={
          <ProviderProtectedPage>
            <ProviderRatings />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/profile"
        element={
          <ProviderProtectedPage>
            <ProviderProfile />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/notifications"
        element={
          <ProviderProtectedPage>
            <ProviderNotifications />
          </ProviderProtectedPage>
        }
      />

      <Route
        path="/provider/activities/:activityId"
        element={
          <ProviderProtectedPage>
            <ProviderPreparedRoute title="ط·ع¾ط¸ظ¾ط·آ§ط·آµط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط¸â€ ط·آ´ط·آ§ط·آ·" />
          </ProviderProtectedPage>
        }
      />

      {/* Redirects */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/home"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/generators"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <Generators />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/generator-details/:id"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <GeneratorDetails />
          </ProtectedRoute>
        }
      />

      {/* ط·آ§ط¸â€‍ط·آ§ط·آ´ط·ع¾ط·آ±ط·آ§ط¸ئ’ط·آ§ط·ع¾ ط¸â€¦ط¸â€  ط·آ§ط¸â€‍ط¸â€ ط·آ§ط¸ظ¾ط·آ¨ط·آ§ط·آ± */}
      <Route
        path="/customer/subscriptions"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerSubscriptionPage />
          </ProtectedRoute>
        }
      />

      {/* ط·آ§ط¸â€‍ط·آ§ط·آ´ط·ع¾ط·آ±ط·آ§ط¸ئ’ ط¸â€¦ط¸â€  ط·ع¾ط¸ظ¾ط·آ§ط·آµط¸ظ¹ط¸â€‍ ط¸â€¦ط¸ث†ط¸â€‍ط·آ¯ ط¸â€¦ط·آ¹ط¸ظ¹ط¸â€کط¸â€  */}
      <Route
        path="/customer/subscriptions/:generatorId"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerSubscriptionPage />
          </ProtectedRoute>
        }
      />

      {/* ط·آ§ط·آ­ط·ع¾ط¸ظ¹ط·آ§ط·آ· ط¸â€‍ط¸ث† ط·آ§ط¸â€‍ط·آ±ط·آ§ط·آ¨ط·آ· ط·آ¨ط·آ¯ط¸ث†ط¸â€  s */}
      <Route
        path="/customer/subscription"
        element={<Navigate to="/customer/subscriptions" replace />}
      />

      <Route
        path="/customer/subscription/:generatorId"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerSubscriptionPage />
          </ProtectedRoute>
        }
      />

      {/* ط·آ§ط¸â€‍ط¸ظ¾ط¸ث†ط·آ§ط·ع¾ط¸ظ¹ط·آ± ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط·آ¯ط¸ظ¾ط¸ث†ط·آ¹ط·آ§ط·ع¾ */}
      <Route
        path="/customer/bills"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerBillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/offers/:offerId"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerOfferDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/reviews"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/complaints"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerComplaintsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/notifications"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <CustomerNotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "client", "user"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/customer/*" element={<Navigate to="/customer" replace />} />

      {/* ط¸â€‍ط·آ§ط·آ²ط¸â€¦ ط¸ظ¹ط¸ئ’ط¸ث†ط¸â€  ط·آ¢ط·آ®ط·آ± Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
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



