import CustomerNavbar from "../../components/Customer/CustomerNavbar/CustomerNavbar";
import CustomerBills from "../../components/Customer/Bills/CustomerBills";
import Footer from "../../components/layout/Footer/Footer";

function CustomerBillsPage() {
  return (
    <>
      <CustomerNavbar />
      <CustomerBills />
      <Footer />
    </>
  );
}

export default CustomerBillsPage;