import { useLocation } from "react-router-dom";

import CustomerNavbar from "../../components/Customer/CustomerNavbar/CustomerNavbar";
import CustomerSubscription from "../../components/Customer/Subscription/CustomerSubscription";
import Footer from "../../components/layout/Footer/Footer";

const defaultSubscription = {
  generatorName: "مولد النور",
  location: "دير البلح",
  statusText: "يعمل الآن",
  currentAmp: 8,
  maxAmp: 10,
  ampPrice: 55,
  currency: "شيكل",
};

function CustomerSubscriptionPage() {
  const location = useLocation();

  const subscription = location.state?.subscription || defaultSubscription;

  return (
    <>
      <CustomerNavbar />

      <CustomerSubscription subscription={subscription} />

      <Footer />
    </>
  );
}

export default CustomerSubscriptionPage;