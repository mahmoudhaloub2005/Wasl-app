import {
  FiAlertTriangle,
  FiCheck,
  FiStar,
  FiTool,
  FiUsers,
} from "react-icons/fi";

const activityIcons = {
  alert: FiAlertTriangle,
  check: FiCheck,
  star: FiStar,
  tool: FiTool,
  users: FiUsers,
};

function ProviderActivityItem({ activity, onNavigate }) {
  const Icon = activityIcons[activity.iconKey] || FiCheck;

  return (
    <button
      type="button"
      className="provider-activity-item"
      onClick={() => onNavigate(activity.path)}
    >
      <span
        className={`provider-activity-item__icon provider-activity-item__icon--${activity.tone}`}
      >
        <Icon aria-hidden="true" />
      </span>

      <span className="provider-activity-item__content">
        <strong>{activity.title}</strong>
        <small>{activity.meta}</small>
      </span>
    </button>
  );
}

export default ProviderActivityItem;
