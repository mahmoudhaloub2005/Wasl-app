import WelcomeSection from "../../components/Customer/WelcomeSection/WelcomeSection";
import BillsInfo from "../../components/customer/BillsInfo/BillsInfo";
import LatestNotifications from "../../components/Customer/LatestNotifications/LatestNotifications";
import SuggestedGenerators from "../../components/Customer/SuggestedGenerators/SuggestedGenerators";
import Footer from "../../components/layout/Footer/Footer";

function HomePage() {
  return (
    <>
      <WelcomeSection />

      <div className="dashboard-middle">
        <BillsInfo />
        <LatestNotifications />
      </div>

      <SuggestedGenerators />

      <Footer />
    </>
  );
}

export default HomePage;