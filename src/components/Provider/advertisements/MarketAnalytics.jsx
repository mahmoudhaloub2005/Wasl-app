import {
  FiCreditCard,
  FiMinus,
  FiRefreshCw,
  FiShare2,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const marketIconMap = {
  bolt: FiZap,
  network: FiShare2,
  wallet: FiCreditCard,
};

const growthIconMap = {
  down: FiTrendingDown,
  flat: FiMinus,
  loading: FiMinus,
  unavailable: FiMinus,
  up: FiTrendingUp,
};

function MarketAnalytics({ analytics, onRetry }) {
  const isLoading = analytics.status === "loading";
  const hasStateMessage = Boolean(analytics.stateMessage);
  const GrowthIcon = growthIconMap[analytics.growthDirection] || FiTrendingUp;

  return (
    <section
      className="market-analytics"
      aria-labelledby="market-analytics-title"
      aria-busy={isLoading}
    >
      <div className="market-analytics__header">
        <span
          className={
            "market-analytics__growth market-analytics__growth--" +
            (analytics.growthDirection || "unavailable")
          }
        >
          <GrowthIcon aria-hidden="true" />
          {analytics.growthLabel}
        </span>

        <h2 id="market-analytics-title">
          <FiTrendingUp aria-hidden="true" />
          {"\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0627\u0644\u0633\u0648\u0642 \u0641\u064a \u0645\u0646\u0637\u0642\u062a\u0643"}
        </h2>
      </div>

      {hasStateMessage && (
        <div
          className={"market-analytics__state market-analytics__state--" + analytics.status}
          role={analytics.status === "error" ? "alert" : "status"}
        >
          <p>{analytics.stateMessage}</p>
          {analytics.status === "error" && (
            <button type="button" onClick={onRetry}>
              <FiRefreshCw aria-hidden="true" />
              {"\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629"}
            </button>
          )}
        </div>
      )}

      <div className="market-analytics__grid">
        {analytics.cards.map((card) => {
          const Icon = marketIconMap[card.iconKey] || FiUsers;

          return (
            <article
              className={
                "market-analytics-card" +
                (isLoading ? " market-analytics-card--loading" : "") +
                (hasStateMessage ? " market-analytics-card--muted" : "")
              }
              key={card.id}
            >
              <span
                className={
                  "market-analytics-card__icon market-analytics-card__icon--" +
                  card.tone
                }
                aria-hidden="true"
              >
                <Icon />
              </span>
              <div>
                <p>{card.label}</p>
                <strong>
                  {isLoading ? (
                    <span className="market-analytics__skeleton" />
                  ) : (
                    card.value
                  )}
                </strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MarketAnalytics;
