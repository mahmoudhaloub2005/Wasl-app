import { FiArrowRight } from "react-icons/fi";

function FinanceHeader({
  actionLabel,
  backLabel,
  description,
  onAction,
  onBack,
  showBack = false,
  title,
}) {
  return (
    <header
      className="provider-finance__header"
      aria-labelledby="provider-finance-title"
    >
      <div className="provider-finance__heading">
        {showBack && (
          <button
            type="button"
            className={`provider-finance__back ${backLabel ? "provider-finance__back--labeled" : ""}`}
            aria-label={backLabel || "رجوع"}
            onClick={onBack}
          >
            <FiArrowRight aria-hidden="true" />
            {backLabel ? <span>{backLabel}</span> : null}
          </button>
        )}
        <div>
          <h1 id="provider-finance-title">{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          className="provider-finance__create"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}

export default FinanceHeader;


