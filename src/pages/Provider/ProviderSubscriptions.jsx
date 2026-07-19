import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import CurrentSubscribersList from "../../components/Provider/subscriptions/CurrentSubscribersList";
import DeleteSubscriberModal from "../../components/Provider/subscriptions/DeleteSubscriberModal";
import ProviderSubscriptionsList from "../../components/Provider/subscriptions/ProviderSubscriptionsList";
import ProviderSubscriptionsTabs from "../../components/Provider/subscriptions/ProviderSubscriptionsTabs";
import Footer from "../../components/layout/Footer/Footer";
import { providerServicePendingMessage } from "../../services/provider/providerFrontendStatus";
import "./ProviderSubscriptions.css";

const PENDING_REQUESTS_STORAGE_KEY = "wasel_provider_pending_requests";
const CURRENT_SUBSCRIBERS_STORAGE_KEY = "wasel_provider_current_subscribers";

function getRouteTab(searchParams) {
  return searchParams.get("tab") === "current" ? "current" : "pending";
}

function clearStoredSubscriptionLists() {
  try {
    window.localStorage.removeItem(PENDING_REQUESTS_STORAGE_KEY);
    window.localStorage.removeItem(CURRENT_SUBSCRIBERS_STORAGE_KEY);
  } catch {
    // Ignore storage access errors so the page can still render normally.
  }
}

function ProviderSubscriptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getRouteTab(searchParams);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentSubscribers, setCurrentSubscribers] = useState([]);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const isLoading = false;
  const errorMessage = "";
  const pendingActionKey = "";

  const counts = {
    pending: pendingRequests.length,
    current: currentSubscribers.length,
  };

  useEffect(() => {
    clearStoredSubscriptionLists();
  }, []);

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

  function acceptRequest(requestId) {
    setPendingRequests((currentRequests) =>
      currentRequests.filter((request) => request.id !== requestId)
    );
  }

  function rejectRequest(requestId) {
    setPendingRequests((currentRequests) =>
      currentRequests.filter((request) => request.id !== requestId)
    );
  }

  function handleRequestDelete(subscriber) {
    setSubscriberToDelete(subscriber);
  }

  function handleCancelDelete() {
    setSubscriberToDelete(null);
  }

  function handleConfirmDelete() {
    if (!subscriberToDelete) return;

    setCurrentSubscribers((currentSubscribers) =>
      currentSubscribers.filter(
        (subscriber) => subscriber.id !== subscriberToDelete.id
      )
    );
    setSubscriberToDelete(null);
    setSuccessMessage(providerServicePendingMessage);
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

        {activeTab === "current" ? (
          <CurrentSubscribersList
            currentSubscribers={currentSubscribers}
            onRequestDelete={handleRequestDelete}
          />
        ) : (
          <ProviderSubscriptionsList
            activeTab={activeTab}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onAccept={acceptRequest}
            onReject={rejectRequest}
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

      {successMessage ? (
        <div
          className="current-subscribers-toast"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

export default ProviderSubscriptions;
