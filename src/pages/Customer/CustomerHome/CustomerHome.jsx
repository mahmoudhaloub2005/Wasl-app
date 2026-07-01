import CustomerNavbar from "../../../components/Customer/CustomerNavbar/CustomerNavbar";
import WelcomeSection from "../../../components/Customer/WelcomeSection/WelcomeSection";
import "./CustomerHome.css";

function CustomerHome() {
  return (
    <main className="customer-home-page" dir="rtl">
      <CustomerNavbar />

      <div className="customer-home-container">
        <WelcomeSection />
      </div>
    </main>
  );
}

export default CustomerHome;