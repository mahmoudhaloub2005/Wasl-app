
import ProviderNavbar from "../../components/provider/providerNavbar/ProviderNavbar";
import Footer from "../../components/Footer/Footer";

import FinancialStats from "../../components/provider/financial/FinancialStats";
import QuickAccess from "../../components/provider/financial/QuickAccess";
import FinancialTable from "../../components/provider/financial/FinancialTable";
import ConsumptionSummary from "../../components/provider/financial/ConsumptionSummary";

import "../../components/provider/financial/FinancialLayout.css";

function FinancialPage() {

  return (

    <>

      <ProviderNavbar />

      <div className="provider-page">

        <FinancialStats />

        <QuickAccess />

        <div className="financial-bottom">

          <FinancialTable />

          <ConsumptionSummary />

        </div>

      </div>

      <Footer />

    </>

  );

}

export default FinancialPage;
