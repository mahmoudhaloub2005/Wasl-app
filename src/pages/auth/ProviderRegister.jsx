import Navbar from "../../components/layout/Navbar/Navbar";
import ProviderRegisterForm from "../../components/auth/provider/ProviderRegister/ProviderRegister";
import Footer from "../../components/layout/Footer/Footer";

function ProviderRegisterPage() {
  return (
    <>
      <Navbar />
      <ProviderRegisterForm />
      <Footer />
    </>
  );
}

export default ProviderRegisterPage;
