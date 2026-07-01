import CustomerNavbar from "../../components/layout/Navbar/CustomerNavbar/CustomerNavbar";
import Footer from "../../components/layout/Footer/Footer";

import PowerSummary from "../../components/customer/PowerSummary/PowerSummary";
import SubscriptionInfo from "../../components/customer/SubscriptionInfo/SubscriptionInfo";
import SubscriptionJourney from "../../components/customer/SubscriptionJourney/SubscriptionJourney";
import BillsInfo from "../../components/customer/BillsInfo/BillsInfo";
import LatestNotifications from "../../components/customer/LatestNotifications/LatestNotifications";
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
