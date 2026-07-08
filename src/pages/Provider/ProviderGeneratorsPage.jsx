import DashboardNavbar from "../components/layout/Navbar/providerNavbar";
import Footer from "../components/layout/Footer/Footer";

import GeneratorTopActions from "../components/provider/providerGenerators/GeneratorTopActions";
import GeneratorOverviewCard from "../components/provider/providerGenerators/GeneratorOverviewCard";
import GeneratorSettingsCard from "../components/provider/providerGenerators/GeneratorSettingsCard";
import GeneratorStatusCard from "../components/provider/providerGenerators/GeneratorStatusCard";
import MaintenanceGeneratorCard from "../components/provider/providerGenerators/MaintenanceGeneratorCard";
import GeneratorList from "../components/provider/providerGenerators/GeneratorList";

import "../components/provider/providerGenerators/ProviderGeneratorsPage.css";

function ProviderGeneratorsPage(){

return(

<>

<providerNavbar/>

<div className="provider-generators-page">

<GeneratorTopActions/>

<div className="provider-generators-content">

<div className="provider-left">

<GeneratorOverviewCard/>

<GeneratorSettingsCard/>

</div>

<div className="provider-right">

<GeneratorStatusCard/>

<MaintenanceGeneratorCard/>

</div>

</div>

<GeneratorList/>

</div>

<Footer/>

</>

);

}

export default ProviderGeneratorsPage;
