import DashboardNavbar from "../components/layout/Navbar/providerNavbar";
import Footer from "../components/layout/Footer/Footer";

import AdsOverview from "../components/provider/Advertisements/AdsOverview";
import AdsTable from "../components/provider/Advertisements/AdsTable";
import AdForm from "../components/provider/Advertisements/AdForm";
import MarketStats from "../components/provider/Advertisements/MarketStats";

import "../components/provider/Advertisements/ProviderAdsPage.css";

function ProviderAdsPage() {

  return (

    <>

      <providerNavbar />

      <div className="provider-ads-page">

        <AdsOverview />

        <div className="ads-content">

          <AdsTable />

          <AdForm />

        </div>

        <MarketStats />

      </div>

      <Footer />

    </>

  );

}

export default ProviderAdsPage;

