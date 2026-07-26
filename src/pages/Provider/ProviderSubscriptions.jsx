import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import CurrentSubscribersList from "../../components/Provider/subscriptions/CurrentSubscribersList";
import DeleteSubscriberModal from "../../components/Provider/subscriptions/DeleteSubscriberModal";
import ProviderSubscriptionsList from "../../components/Provider/subscriptions/ProviderSubscriptionsList";
import ProviderSubscriptionsTabs from "../../components/Provider/subscriptions/ProviderSubscriptionsTabs";
import Footer from "../../components/layout/Footer/Footer";
import useProviderSubscriptions from "../../hooks/useProviderSubscriptions";
import "./ProviderSubscriptions.css";

function getRouteTab(searchParams) {
  return searchParams.get("tab") === "current" ? "current" : "pending";
}

function ProviderSubscriptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getRouteTab(searchParams);
  const {
    acceptRequest,
    currentSubscribers,
    errorMessage,
    isLoading,
    pendingActionKey,
    pendingRequests,
    rejectRequest,
  } = useProviderSubscriptions();
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState("");

  const counts = {
    pending: pendingRequests.length,
    current: currentSubscribers.length,
  };

  useEffect(() => {
    if (!successMessage) return undefined;

    const timerId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2800);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [successMessage]);

  function handleTabChange(nextTab) {
    setSearchParams(nextTab === "current" ? { tab: "current" } : {}, {
      replace: true,
    });
  }

  async function handleAcceptRequest(requestId) {
    const result = await acceptRequest(requestId);
    setSuccessMessage(result?.message || "تم قبول طلب الاشتراك بنجاح.");
  }

  async function handleRejectRequest(requestId) {
    const result = await rejectRequest(requestId);
    setSuccessMessage(result?.message || "تم رفض طلب الاشتراك.");
  }

  function handleRequestDelete(subscriber) {
    setLocalErrorMessage("");
    setSubscriberToDelete(subscriber);
  }

  function handleCancelDelete() {
    setSubscriberToDelete(null);
  }

  function handleConfirmDelete() {
    setSubscriberToDelete(null);
    setLocalErrorMessage("حذف المشتركين الحاليين غير موثق في واجهة Wasel API الحالية.");
  }

  return (
    <div className="provider-subscriptions-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-subscriptions">
        <section
          className="provider-subscriptions__heading"
          aria-labelledby="provider-subscriptions-title"
        >
          <h1 id="provider-subscriptions-title">إدارة المشتركين</h1>

          <ProviderSubscriptionsTabs
            activeTab={activeTab}
            counts={counts}
            onChange={handleTabChange}
          />
        </section>

        {(localErrorMessage || successMessage) ? (
          <div
            className="provider-subscriptions-error"
            role={localErrorMessage ? "alert" : "status"}
          >
            {localErrorMessage || successMessage}
          </div>
        ) : null}

        {activeTab === "current" ? (
          <CurrentSubscribersList
            currentSubscribers={currentSubscribers}
            isLoading={isLoading}
            onRequestDelete={handleRequestDelete}
          />
        ) : (
          <ProviderSubscriptionsList
            activeTab={activeTab}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            pendingActionKey={pendingActionKey}
            subscribers={pendingRequests}
          />
        )}
      </main>

      <DeleteSubscriberModal
        subscriber={subscriberToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <Footer />
    </div>
  );
}

export default ProviderSubscriptions;
