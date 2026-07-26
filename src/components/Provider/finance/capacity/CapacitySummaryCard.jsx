import {
  FiBatteryCharging,
  FiCheckCircle,
  FiCpu,
  FiZap,
} from "react-icons/fi";

import { formatNumber } from "./capacityUtils";

const iconMap = {
  active: FiCheckCircle,
  available: FiBatteryCharging,
  generators: FiCpu,
  load: FiZap,
};

function CapacitySummaryCard({ card, isLoading }) {
  const Icon = iconMap[card.iconKey] || FiCpu;

  if (isLoading) {
    return (
      <article className="capacity-summary-card capacity-summary-card--loading">
        <span />
        <p />
        <strong />
      </article>
    );
  }

  return (
    <article className="capacity-summary-card">
      <span
        className={`capacity-summary-card__icon capacity-summary-card__icon--${card.tone}`}
        aria-hidden="true"
      >
        <Icon />
      </span>
      <p>{card.label}</p>
      <strong>
        {formatNumber(card.value)}
        <span>{card.unit}</span>
      </strong>
    </article>
  );
}

export default CapacitySummaryCard;
