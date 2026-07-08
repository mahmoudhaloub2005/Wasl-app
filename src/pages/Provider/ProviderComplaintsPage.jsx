import React from 'react';
import ProviderNavbar from '../../components/provider/ProviderNavbar'; // افتراضي حسب مشروعك
import Footer from '../../components/provider/Footer'; // افتراضي حسب مشروعك
import ComplaintToolbar from '../../components/provider/reviewsComplaints/complaints/ComplaintToolbar';
import ComplaintFilter from '../../components/provider/reviewsComplaints/complaints/ComplaintFilter';
import ComplaintList from '../../components/provider/reviewsComplaints/complaints/ComplaintList';
import './ReviewsComplaintsPage.css';

const ProviderComplaintsPage = () => {
  return (
    <>
      <ProviderNavbar />
      <div className="reviews-complaints-page">
        <ComplaintToolbar />
        <ComplaintFilter />
        <ComplaintList />
      </div>
      <Footer />
    </>
  );
};

export default ProviderComplaintsPage;
