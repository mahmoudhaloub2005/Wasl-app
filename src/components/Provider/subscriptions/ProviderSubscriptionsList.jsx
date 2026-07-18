import ProviderSubscriptionCard from "./ProviderSubscriptionCard";
import ProviderSubscriptionsEmptyState from "./ProviderSubscriptionsEmptyState";
import ProviderSubscriptionsSkeleton from "./ProviderSubscriptionsSkeleton";

function getEmptyMessage(activeTab) {
  return activeTab === "pending"
    ? "لا توجد طلبات اشتراك جديدة حاليًا"
    : "لا يوجد مشتركون حاليًا";
}

function ProviderSubscriptionsList({
  activeTab,
  errorMessage,
  isLoading,
  onAccept,
  onReject,
  pendingActionKey,
  subscribers,
}) {
  return (
    <section
      className="provider-subscriptions__cards"
      id={`provider-subscriptions-panel-${activeTab}`}
      role="tabpanel"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <ProviderSubscriptionsSkeleton />
      ) : errorMessage ? (
        <div className="provider-subscriptions-error" role="alert">
          {errorMessage}
        </div>
      ) : subscribers.length ? (
        subscribers.map((subscriber) => (
          <ProviderSubscriptionCard
            key={subscriber.id}
            mode={activeTab}
            onAccept={onAccept}
            onReject={onReject}
            pendingActionKey={pendingActionKey}
            subscriber={subscriber}
          />
        ))
      ) : (
        <ProviderSubscriptionsEmptyState message={getEmptyMessage(activeTab)} />
      )}
    </section>
  );
}

export default ProviderSubscriptionsList;
