import Navbar from "../../components/layout/Navbar/Navbar";
import ProviderPending from "../../components/auth/provider/ProviderPending/ProviderPending";
import Footer from "../../components/layout/Footer/Footer";

function ProviderPendings() {
  return (
    <>
      <Navbar />
      <ProviderPending />
      <Footer />
    </>
  );
}

export default ProviderPendings;