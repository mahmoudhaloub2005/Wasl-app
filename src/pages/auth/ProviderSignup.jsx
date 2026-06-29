import Navbar from "../../components/layout/Navbar/Navbar";
import ProviderSignupForm from "../../components/auth/provider/ProviderSignup/ProviderSignup";
import Footer from "../../components/layout/Footer/Footer";

function ProviderSignupPage() {
  return (
    <>
      <Navbar />
      <ProviderSignupForm />
      <Footer />
    </>
  );
}

export default ProviderSignupPage;