import {
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiCreditCard,
  FiFileText,
} from "react-icons/fi";

const iconMap = {
  alert: FiAlertCircle,
  calendar: FiCalendar,
  chart: FiBarChart2,
  check: FiCheckCircle,
  clipboard: FiClipboard,
  file: FiFileText,
  money: FiCreditCard,
};

function formatAmount(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatChange(value) {
  if (value === null || value === undefined) return "0.0%";

  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? "+" : "";

  return `${sign}${numericValue.toFixed(1)}%`;
}

function FinancialSummaryCard({ card, isLoading }) {
  const Icon = iconMap[card.iconKey] || FiCreditCard;
  const isInvoiceCard = card.variant === "invoice";

  if (isLoading) {
    return (
      <article className="financial-summary-card financial-summary-card--loading">
        <span />
        <strong />
        <p />
        <i />
      </article>
    );
  }

  return (
    <article
      className={
        isInvoiceCard
          ? "financial-summary-card financial-summary-card--invoice"
          : "financial-summary-card"
      }
    >
      {!isInvoiceCard && (
        <span
          className={`financial-summary-card__badge financial-summary-card__badge--${card.tone}`}
        >
          {formatChange(card.change)}
        </span>
      )}

      <span
        className={`financial-summary-card__icon financial-summary-card__icon--${card.tone}`}
        aria-hidden="true"
      >
        <Icon />
      </span>

      <div className="financial-summary-card__content">
        <p>{card.label}</p>
        <strong className={card.valueTone ? `financial-summary-card__value--${card.valueTone}` : undefined}>
          {card.valueText || formatAmount(card.value)}
          {card.unit ? <span>{card.unit}</span> : null}
        </strong>
      </div>

      {card.footer ? (
        <p
          className={`financial-summary-card__footer financial-summary-card__footer--${card.footerTone || card.tone}`}
        >
          {card.footer}
        </p>
      ) : (
        !isInvoiceCard && (
          <span className="financial-summary-card__track" aria-hidden="true">
            <i
              className={`financial-summary-card__fill financial-summary-card__fill--${card.tone}`}
              style={{ width: `${card.progress}%` }}
            />
          </span>
        )
      )}
    </article>
  );
}

export default FinancialSummaryCard;