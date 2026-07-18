import { FiClipboard, FiCreditCard, FiUsers } from "react-icons/fi";

const statIcons = {
  clipboard: FiClipboard,
  users: FiUsers,
  wallet: FiCreditCard,
};

function ProviderStatCard({ stat, onNavigate }) {
  const Icon = statIcons[stat.iconKey] || FiClipboard;

  return (
    <button
      type="button"
      className="provider-stat-card"
      onClick={() => onNavigate(stat.path)}
    >
      {stat.badge ? (
        <span
          className={`provider-stat-card__badge provider-stat-card__badge--${stat.badgeTone}`}
        >
          {stat.badge}
        </span>
      ) : (
        <span className="provider-stat-card__badge-placeholder" />
      )}

      <span
        className={`provider-stat-card__icon provider-stat-card__icon--${stat.iconTone}`}
      >
        <Icon aria-hidden="true" />
      </span>

      <span className="provider-stat-card__title">{stat.title}</span>

      <strong className="provider-stat-card__value">
        {stat.value}
        <small>{stat.unit}</small>
      </strong>
    </button>
  );
}

export default ProviderStatCard;
