import { useCallback, useState } from "react";
import { FiBriefcase, FiCreditCard, FiRefreshCw } from "react-icons/fi";

import Footer from "../../components/layout/Footer/Footer";
import ProviderAvatar from "../../components/Provider/profile/ProviderAvatar";
import ProviderLogoutButton from "../../components/Provider/profile/ProviderLogoutButton";
import ProviderLogoutConfirmModal from "../../components/Provider/profile/ProviderLogoutConfirmModal";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import ProviderProfileCard from "../../components/Provider/profile/ProviderProfileCard";
import ProviderProfileSkeleton from "../../components/Provider/profile/ProviderProfileSkeleton";
import ProviderReadOnlyField from "../../components/Provider/profile/ProviderReadOnlyField";
import useProviderProfile from "../../hooks/useProviderProfile";
import { logoutProviderProfile } from "../../services/providerProfileService";
import "./ProviderProfile.css";

function ProviderProfile() {
  const { errorMessage, isLoading, profile, retry } = useProviderProfile();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const openLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  async function confirmLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutProviderProfile();
    } finally {
      window.location.replace("/login");
    }
  }

  return (
    <div className="provider-profile-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-profile-main">
        <div className="provider-profile-main__layout">
          <aside className="provider-profile-main__aside">
            <ProviderLogoutButton
              disabled={isLoggingOut}
              onClick={openLogoutModal}
            />
          </aside>

          <section
            className="provider-profile-main__content"
            aria-label="معلومات حساب المزود"
          >
            {errorMessage && (
              <div className="provider-profile-error" role="alert">
                <span>{errorMessage}</span>
                <button type="button" onClick={retry} disabled={isLoading}>
                  <FiRefreshCw aria-hidden="true" />
                  إعادة المحاولة
                </button>
              </div>
            )}

            {isLoading ? (
              <ProviderProfileSkeleton />
            ) : (
              <>
                <ProviderProfileCard
                  title="بيانات المزود"
                  Icon={FiCreditCard}
                  iconTone="blue"
                  className="provider-profile-card--personal"
                >
                  <div className="provider-profile-card__personal-grid">
                    <div className="provider-profile-card__avatar-column">
                      <ProviderAvatar
                        imageUrl={profile.profileImage}
                        initials={profile.initials}
                        name={profile.fullName}
                      />
                      <span>صورة الملف الشخصي</span>
                    </div>

                    <div className="provider-profile-card__fields provider-profile-card__fields--personal">
                      <ProviderReadOnlyField
                        label="الاسم الكامل"
                        value={profile.fullName}
                      />
                      <ProviderReadOnlyField
                        label="رقم التواصل"
                        value={profile.phone}
                        valueDirection="ltr"
                      />
                      <ProviderReadOnlyField
                        label="البريد الإلكتروني"
                        value={profile.email}
                        valueDirection="ltr"
                        wide
                      />
                    </div>
                  </div>
                </ProviderProfileCard>

                <ProviderProfileCard
                  title="بيانات الشركة"
                  Icon={FiBriefcase}
                  iconTone="orange"
                >
                  <div className="provider-profile-card__fields provider-profile-card__fields--two">
                    <ProviderReadOnlyField
                      label="اسم الشركة"
                      value={profile.companyName}
                    />
                    <ProviderReadOnlyField
                      label="رقم الرخصة التجارية"
                      value={profile.commercialLicenseNumber}
                      valueDirection="ltr"
                    />
                  </div>
                </ProviderProfileCard>

                <ProviderProfileCard
                  title="بيانات عامة"
                  Icon={FiBriefcase}
                  iconTone="orange"
                >
                  <div className="provider-profile-card__fields provider-profile-card__fields--two">
                    <ProviderReadOnlyField
                      label="سعر الكيلو"
                      value={profile.electricityPrice}
                    />
                    <ProviderReadOnlyField
                      label="آلية الدفع"
                      value={profile.paymentMethod}
                    />
                  </div>
                </ProviderProfileCard>
              </>
            )}
          </section>
        </div>
      </main>

      <ProviderLogoutConfirmModal
        isOpen={isLogoutModalOpen}
        isSubmitting={isLoggingOut}
        onCancel={closeLogoutModal}
        onConfirm={confirmLogout}
      />

      <Footer />
    </div>
  );
}

export default ProviderProfile;
