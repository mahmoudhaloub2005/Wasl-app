
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import Footer from "../components/Footer/Footer";

import GeneratorHero from "../components/GeneratorHero/GeneratorHero";
import ProviderInfo from "../components/ProviderInfo/ProviderInfo";
import ServiceDescription from "../components/ServiceDescription/ServiceDescription";
import SubscriptionTerms from "../components/SubscriptionTerms/SubscriptionTerms";
import ReviewsSection from "../components/ReviewsSection/ReviewsSection";

function GeneratorDetails() {
  return (
    <>
      <DashboardNavbar />

      <GeneratorHero />

      <ProviderInfo />

      <ServiceDescription />

      <SubscriptionTerms />

      <ReviewsSection />

      <Footer />
    </>
  );
}

export default GeneratorDetails;