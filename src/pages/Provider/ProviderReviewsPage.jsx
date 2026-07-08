
import "./ReviewsComplaintsPage.css";

import ProviderNavbar from "../../components/provider/providerNavbar/ProviderNavbar";
import Footer from "../../components/Footer/Footer";

import ReviewSummary from "../../components/provider/reviewsComplaints/reviews/ReviewSummary";
import RatingDistribution from "../../components/provider/reviewsComplaints/reviews/RatingDistribution";
import ReviewFilter from "../../components/provider/reviewsComplaints/reviews/ReviewFilter";
import ReviewList from "../../components/provider/reviewsComplaints/reviews/ReviewList";

function ProviderReviewsPage() {

  return (

    <>

      <ProviderNavbar />

      <div className="reviews-complaints-page">

        <ReviewSummary />

        <RatingDistribution />

        <ReviewFilter />

        <ReviewList />

      </div>

      <Footer />

    </>

  );

}

export default ProviderReviewsPage;