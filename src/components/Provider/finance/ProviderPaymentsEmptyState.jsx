import { FiCheckSquare } from "react-icons/fi";

function ProviderPaymentsEmptyState({ message }) {
  return (
    <section className="provider-payments-empty" aria-live="polite">
      <span aria-hidden="true">
        <FiCheckSquare />
      </span>
      <h2>{message}</h2>
    </section>
  );
}

export default ProviderPaymentsEmptyState;
