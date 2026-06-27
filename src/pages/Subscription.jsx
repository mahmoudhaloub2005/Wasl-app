
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import Footer from "../components/Footer/Footer";

import PowerSummary from "../components/PowerSummary/PowerSummary";
import SubscriptionInfo from "../components/SubscriptionInfo/SubscriptionInfo";
import SubscriptionJourney from "../components/SubscriptionJourney/SubscriptionJourney";

function Subscription() {
  return (
    <>
      <DashboardNavbar />

      <PowerSummary />

      <SubscriptionInfo />

      <SubscriptionJourney />

      <Footer />
    </>
  );
}

export default Subscription;