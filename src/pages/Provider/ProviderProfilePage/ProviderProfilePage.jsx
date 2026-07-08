import React from 'react';
import ProviderNavbar from '../../../components/provider/ProviderNavbar';
import Footer from '../../../components/provider/Footer';
import ProviderDataCard from '../../../components/provider/profile/ProviderDataCard';
import CompanyDataCard from '../../../components/provider/profile/CompanyDataCard';
import GeneralDataCard from '../../../components/provider/profile/GeneralDataCard';
import ProfileActions from '../../../components/provider/profile/ProfileActions';
import './ProviderProfilePage.css';

const ProviderProfilePage = () => {
  return (
    <>
      <ProviderNavbar />
      <div className="provider-profile-page">
        
        <div className="logout-btn-container">
          <button className="btn-logout">
            <span>🚪</span> تسجيل الخروج
          </button>
        </div>

        <ProviderDataCard />
        <CompanyDataCard />
        <GeneralDataCard />
        <ProfileActions />

      </div>
      <Footer />
    </>
  );
};

export default ProviderProfilePage;
