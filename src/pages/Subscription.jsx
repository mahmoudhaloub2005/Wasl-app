import CustomerNavbar from "../components/Customer/CustomerNavbar/CustomerNavbar";
import Footer from "../components/Footer/Footer";

import PowerSummary from "../components/PowerSummary/PowerSummary";
import SubscriptionInfo from "../components/SubscriptionInfo/SubscriptionInfo";
import SubscriptionJourney from "../components/SubscriptionJourney/SubscriptionJourney";
import BillsInfo from "../components/BillsInfo/BillsInfo";
import LatestNotifications from "../components/LatestNotifications/LatestNotifications";
import FAQ from "../components/FAQ/FAQ";

function Subscription() {
  return (
    <>
      <CustomerNavbar />

      <PowerSummary />

      <SubscriptionInfo />

      <SubscriptionJourney />

      <BillsInfo />

      <LatestNotifications />

      <FAQ />

      <Footer />
    </>
  );
}

export default Subscription;
