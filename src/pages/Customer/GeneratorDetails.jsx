import DashboardNavbar from "../components/layout/Navbar/CustomerNavbar/CustomerNavbar";
import Footer from "../components/Footer/Footer";

import GeneratorHero from "../components/GeneratorHero/GeneratorHero";
import ProviderInfo from "../components/ProviderInfo/ProviderInfo";
import ServiceDescription from "../components/ServiceDescription/ServiceDescription";
import SubscriptionTerms from "../components/SubscriptionTerms/SubscriptionTerms";
import ReviewsSection from "../components/ReviewsSection/ReviewsSection";

function GeneratorDetails() {
  return (
    <>
      <CustomerNavbar />

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