import { FiBell, FiChevronLeft, FiFileText } from "react-icons/fi";

const actionIcons = {
  bell: FiBell,
  receipt: FiFileText,
};

function ProviderQuickActionItem({ action, onNavigate }) {
  const Icon = actionIcons[action.iconKey] || FiBell;

  return (
    <button
      type="button"
      className="provider-quick-action"
      onClick={() => onNavigate(action.path, action)}
    >
      <FiChevronLeft className="provider-quick-action__arrow" aria-hidden="true" />
      <span className="provider-quick-action__title">{action.title}</span>
      <span
        className={`provider-quick-action__icon provider-quick-action__icon--${action.tone}`}
      >
        <Icon aria-hidden="true" />
      </span>
    </button>
  );
}

export default ProviderQuickActionItem;
