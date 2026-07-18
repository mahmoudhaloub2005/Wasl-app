import { FiZap } from "react-icons/fi";

function ProviderGeneratorsEmptyState({ message }) {
  return (
    <div className="provider-generators-empty">
      <FiZap aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default ProviderGeneratorsEmptyState;
