import CustomerNavbar from "../../components/Customer/CustomerNavbar/CustomerNavbar";
import CustomerProfilePage from "../../components/Customer/Profile/CustomerProfilePage";
import Footer from "../../components/layout/Footer/Footer";

function Profile() {
  return (
    <>
      <CustomerNavbar />
      <CustomerProfilePage />
      <Footer />
    </>
  );
}

export default Profile;