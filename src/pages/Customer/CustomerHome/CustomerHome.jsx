import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../../../components/Customer/CustomerNavbar/CustomerNavbar";
import WelcomeSection from "../../../components/Customer/WelcomeSection/WelcomeSection";
import CurrentSubscriptionCard from "../../../components/Customer/CurrentSubscriptionCard/CurrentSubscriptionCard";
import CustomerNotificationsPanel from "../../../components/Customer/CustomerNotificationsPanel/CustomerNotificationsPanel";
import CustomerMiniStats from "../../../components/Customer/CustomerMiniStats/CustomerMiniStats";
import OffersSection from "../../../components/Customer/OffersSection/OffersSection";
import Footer from "../../../components/layout/Footer/Footer";

import "./CustomerHome.css";

function CustomerHome() {
  const navigate = useNavigate();

  const currentGeneratorId = "nour";

  const handleEditSubscription = () => {
    navigate(`/customer/subscriptions/${currentGeneratorId}`);
  };

  const handleViewSubscriptionDetails = () => {
    navigate(`/customer/generator-details/${currentGeneratorId}`);
  };

  const handleShowAllNotifications = () => {
    console.log("فتح صفحة كافة التنبيهات");
  };

  const handleViewAllOffers = () => {
    console.log("فتح صفحة كافة العروض");
  };

  const handleViewOfferDetails = (offerId) => {
    console.log("عرض تفاصيل العرض:", offerId);
  };

  return (
    <div className="customer-home-page" dir="rtl">
      <CustomerNavbar />

      <main className="customer-home-container">
        <WelcomeSection userName="محمود" />

        <div className="customer-dashboard-layout">
          <aside className="customer-dashboard-left">
            <CustomerNotificationsPanel
              notifications={[]}
              onShowAllNotifications={handleShowAllNotifications}
            />

            <CustomerMiniStats />
          </aside>

          <section className="customer-dashboard-right">
            <CurrentSubscriptionCard
              onEditSubscription={handleEditSubscription}
              onViewDetails={handleViewSubscriptionDetails}
            />

            <OffersSection
              onViewAllOffers={handleViewAllOffers}
              onViewOfferDetails={handleViewOfferDetails}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerHome;