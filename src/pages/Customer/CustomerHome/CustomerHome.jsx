import CustomerNavbar from "../../../components/Customer/CustomerNavbar/CustomerNavbar";
import WelcomeSection from "../../../components/Customer/WelcomeSection/WelcomeSection";

import "./CustomerHome.css";

function CustomerHome() {
  return (
    <main className="customer-home-page" dir="rtl">
      <div className="customer-home-container">
        <CustomerNavbar />

        <WelcomeSection />

      </div>
    </main>
  );
}

export default CustomerHome;