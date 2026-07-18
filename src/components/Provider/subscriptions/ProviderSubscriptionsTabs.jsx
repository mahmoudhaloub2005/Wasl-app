import { FiUserPlus, FiUsers } from "react-icons/fi";

const subscriptionTabs = [
  {
    id: "pending",
    label: "طلب جديد",
    Icon: FiUserPlus,
  },
  {
    id: "current",
    label: "المشتركون الحاليون",
    Icon: FiUsers,
  },
];

function ProviderSubscriptionsTabs({ activeTab, counts, onChange }) {
  return (
    <div className="provider-subscriptions-tabs" role="tablist">
      {subscriptionTabs.map(({ id, label, Icon }) => (
        <button
          type="button"
          role="tab"
          aria-label={`${label}: ${counts[id] || 0}`}
          aria-selected={activeTab === id}
          aria-controls={`provider-subscriptions-panel-${id}`}
          className={`provider-subscriptions-tabs__button ${
            activeTab === id ? "provider-subscriptions-tabs__button--active" : ""
          }`.trim()}
          key={id}
          onClick={() => onChange(id)}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ProviderSubscriptionsTabs;
