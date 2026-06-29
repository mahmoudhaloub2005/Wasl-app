import Navbar from "../../components/layout/Navbar/Navbar";
import ProviderDocumentsForm from "../../components/auth/provider/ProviderDocuments/ProviderDocuments";
import Footer from "../../components/layout/Footer/Footer";

function ProviderDocumentsPage() {
  return (
    <>
      <Navbar />
      <ProviderDocumentsForm />
      <Footer />
    </>
  );
}

export default ProviderDocumentsPage;