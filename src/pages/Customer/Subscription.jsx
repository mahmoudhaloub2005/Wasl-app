import CustomerNavbar from "../../components/Customer/CustomerNavbar/CustomerNavbar";
import Footer from "../../components/layout/Footer/Footer";

import PowerSummary from "../../customer/PowerSummary/PowerSummary";
import SubscriptionInfo from "../../customer/SubscriptionInfo/SubscriptionInfo";
import SubscriptionJourney from "../../customer/SubscriptionJourney/SubscriptionJourney";
import BillsInfo from "../../customer/BillsInfo/BillsInfo";
import LatestNotifications from "../../customer/LatestNotifications/LatestNotifications";
import FAQ from "../../components/home/FAQ/FAQ";

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
