import CurrentSubscriberCard from "./CurrentSubscriberCard";
import ProviderSubscriptionsEmptyState from "./ProviderSubscriptionsEmptyState";

function CurrentSubscribersList({ currentSubscribers, onRequestDelete }) {
  return (
    <section
      className="current-subscribers-list"
      id="provider-subscriptions-panel-current"
      role="tabpanel"
    >
      {currentSubscribers.length ? (
        currentSubscribers.map((subscriber) => (
          <CurrentSubscriberCard
            key={subscriber.id}
            subscriber={subscriber}
            onDelete={onRequestDelete}
          />
        ))
      ) : (
        <ProviderSubscriptionsEmptyState message="لا يوجد مشتركون حاليًا" />
      )}
    </section>
  );
}

export default CurrentSubscribersList;
