import { FiInbox } from "react-icons/fi";

function ProviderSubscriptionsEmptyState({ message }) {
  return (
    <div className="provider-subscriptions-empty">
      <FiInbox aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default ProviderSubscriptionsEmptyState;
