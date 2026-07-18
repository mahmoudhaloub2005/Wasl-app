import { FiBarChart2, FiFileText, FiShield } from "react-icons/fi";

const iconMap = {
  chart: FiBarChart2,
  receipt: FiFileText,
  shield: FiShield,
};

function FinanceQuickAccessCard({ item, onNavigate }) {
  const Icon = iconMap[item.iconKey] || FiFileText;

  function navigateToItem() {
    onNavigate(item.path);
  }

  return (
    <article
      aria-label={item.title}
      className="finance-quick-card"
      onClick={navigateToItem}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigateToItem();
        }
      }}
    >
      <span className="finance-quick-card__icon" aria-hidden="true">
        <Icon />
      </span>

      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <button
        type="button"
        className={`finance-quick-card__button finance-quick-card__button--${item.tone}`}
        onClick={(event) => {
          event.stopPropagation();
          navigateToItem();
        }}
      >
        {item.buttonLabel}
      </button>
    </article>
  );
}

export default FinanceQuickAccessCard;