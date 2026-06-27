// import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import WelcomeInfo from "../components/WelcomeInfo/WelcomeInfo";
// import Statss from "../components/Statss/Statss";
// import GeneratorInfo from "../components/GeneratorInfo/GeneratorInfo";
// import BillsInfo from "../components/BillsInfo/BillsInfo";
import LatestNotifications from "../components/LatestNotifications/LatestNotifications";
import SuggestedGenerators from "../components/SuggestedGenerators/SuggestedGenerators";
import Footer from "../components/Footer/Footer";

function HomePage() {
  return (
    <>
      {/* <DashboardNavbar /> */}

      <WelcomeInfo />

      <div className="dashboard-top">
        {/* <Stats /> */}
        {/* <GeneratorInfo /> */}
      </div>

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