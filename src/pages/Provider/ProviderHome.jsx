import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AddAdvertisementModal from "../../components/Provider/advertisements/AddAdvertisementModal";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import NewNotificationModal from "../../components/Provider/dashboard/NewNotificationModal";
import ProviderWelcomeSection from "../../components/Provider/dashboard/ProviderWelcomeSection";
import ProviderStatsGrid from "../../components/Provider/dashboard/ProviderStatsGrid";
import ProviderWorkingHoursChart from "../../components/Provider/dashboard/ProviderWorkingHoursChart";
import ProviderQuickActions from "../../components/Provider/dashboard/ProviderQuickActions";
import ProviderLatestActivities from "../../components/Provider/dashboard/ProviderLatestActivities";
import ProviderGeneratorUsageGrid from "../../components/Provider/dashboard/ProviderGeneratorUsageGrid";
import ProviderErrorState from "../../components/Provider/dashboard/ProviderErrorState";
import Footer from "../../components/layout/Footer/Footer";
import useProviderAdvertisements from "../../hooks/useProviderAdvertisements";
import useProviderDashboard from "../../hooks/useProviderDashboard";
import { sendProviderNotification } from "../../services/notificationService";
import "./ProviderHome.css";

const ADD_GENERATOR_ROUTE = "/provider/generators?add=1";
const ADD_ADVERTISEMENT_ROUTE = "/provider/advertisements/add";

function getErrorMessage(error, fallback = "تعذر تنفيذ العملية. حاول مرة أخرى.") {
  return error?.displayMessage || error?.message || fallback;
}

function ProviderHome() {
  const navigate = useNavigate();
  const [isAdvertisementModalOpen, setIsAdvertisementModalOpen] =
    useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState(false);
  const [advertisementNotice, setAdvertisementNotice] = useState("");
  const [notificationToast, setNotificationToast] = useState("");
  const {
    createAdvertisement,
    pendingActionKey: advertisementPendingActionKey,
  } = useProviderAdvertisements();
  const {
    activeChartPeriod,
    activities,
    chartPeriods,
    dashboardCopy,
    errorMessage,
    generatorsUsage,
    isDashboardLoading,
    isWorkingHoursLoading,
    providerProfile,
    quickActions,
    setActiveChartPeriod,
    setShowAllActivities,
    showAllActivities,
    stats,
    workingHours,
    workingHoursErrorMessage,
  } = useProviderDashboard();

  useEffect(() => {
    if (!notificationToast) return undefined;

    const timerId = window.setTimeout(() => {
      setNotificationToast("");
    }, 2800);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [notificationToast]);

  function goTo(path, action) {
    if (action?.id === "add-advertisement" || path === ADD_ADVERTISEMENT_ROUTE) {
      setAdvertisementNotice("");
      setIsAdvertisementModalOpen(true);
      return;
    }

    if (action?.id === "send-notification") {
      setIsNotificationModalOpen(true);
      return;
    }

    navigate(path);
  }

  async function handleCreateAdvertisement(formData) {
    const createdAdvertisement = await createAdvertisement(formData);

    setAdvertisementNotice("تم نشر الإعلان بنجاح.");
    return createdAdvertisement;
  }

  async function handleSubmitNotification(notificationForm) {
    const title = String(notificationForm.title || "").trim();
    const message = String(notificationForm.message || "").trim();

    try {
      const result = await sendProviderNotification({
        title,
        message,
      });

      setNotificationToast("تم إرسال الإشعار للمشتركين بنجاح.");
      return result;
    } catch (error) {
      setNotificationToast(getErrorMessage(error, "تعذر إرسال الإشعار."));
      throw error;
    }
  }

  return (
    <div className="provider-dashboard-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-dashboard">
        <ProviderWelcomeSection
          providerName={providerProfile.firstName}
          subtitle={dashboardCopy.subtitle}
          onAddGenerator={() => goTo(ADD_GENERATOR_ROUTE)}
        />

        {errorMessage && <ProviderErrorState message={errorMessage} />}

        {advertisementNotice && (
          <div className="provider-dashboard-advertisement-notice" role="status">
            {advertisementNotice}
          </div>
        )}

        <ProviderStatsGrid
          stats={stats}
          isLoading={isDashboardLoading}
          onNavigate={goTo}
        />

        <section className="provider-dashboard__content">
          <aside className="provider-dashboard__sidebar">
            <ProviderQuickActions
              actions={quickActions}
              onNavigate={goTo}
            />

            <ProviderLatestActivities
              activities={activities}
              isLoading={isDashboardLoading}
              showAll={showAllActivities}
              onToggleShowAll={() =>
                setShowAllActivities((currentValue) => !currentValue)
              }
              onNavigate={goTo}
            />
          </aside>

          <section className="provider-dashboard__main">
            <ProviderWorkingHoursChart
              periods={chartPeriods}
              activePeriod={activeChartPeriod}
              data={workingHours}
              errorMessage={workingHoursErrorMessage}
              isLoading={isWorkingHoursLoading}
              onPeriodChange={setActiveChartPeriod}
            />

            <ProviderGeneratorUsageGrid
              generators={generatorsUsage}
              isLoading={isDashboardLoading}
              onNavigate={goTo}
            />
          </section>
        </section>
      </main>

      <Footer />

      <AddAdvertisementModal
        isOpen={isAdvertisementModalOpen}
        isSubmitting={advertisementPendingActionKey === "create"}
        onClose={() => setIsAdvertisementModalOpen(false)}
        onCreated={() => setAdvertisementNotice("تم نشر الإعلان بنجاح.")}
        onSubmit={handleCreateAdvertisement}
      />

      <NewNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSubmit={handleSubmitNotification}
      />

      {notificationToast ? (
        <div
          className="provider-dashboard-notification-toast"
          role="status"
          aria-live="polite"
        >
          {notificationToast}
        </div>
      ) : null}
    </div>
  );
}

export default ProviderHome;
