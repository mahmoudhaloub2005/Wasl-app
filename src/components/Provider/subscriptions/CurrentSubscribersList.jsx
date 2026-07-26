import CurrentSubscriberCard from "./CurrentSubscriberCard";
import ProviderSubscriptionsEmptyState from "./ProviderSubscriptionsEmptyState";
import ProviderSubscriptionsSkeleton from "./ProviderSubscriptionsSkeleton";

function CurrentSubscribersList({ currentSubscribers, isLoading = false, onRequestDelete }) {
  return (
    <section
      className="current-subscribers-list"
      id="provider-subscriptions-panel-current"
      role="tabpanel"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <ProviderSubscriptionsSkeleton />
      ) : currentSubscribers.length ? (
        currentSubscribers.map((subscriber) => (
          <CurrentSubscriberCard
            key={subscriber.id}
            subscriber={subscriber}
            onDelete={onRequestDelete}
          />
        ))
      ) : (
        <ProviderSubscriptionsEmptyState message="لا يوجد مشتركون حالياً" />
      )}
    </section>
  );
}

export default CurrentSubscribersList;
