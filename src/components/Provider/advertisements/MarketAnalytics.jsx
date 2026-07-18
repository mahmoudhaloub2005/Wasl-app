import {
  FiCreditCard,
  FiShare2,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const marketIconMap = {
  bolt: FiZap,
  network: FiShare2,
  wallet: FiCreditCard,
};

function MarketAnalytics({ analytics }) {
  return (
    <section
      className="market-analytics"
      aria-labelledby="market-analytics-title"
    >
      <div className="market-analytics__header">
        <span className="market-analytics__growth">
          <FiTrendingUp aria-hidden="true" />
          {analytics.growthLabel}
        </span>

        <h2 id="market-analytics-title">
          <FiTrendingUp aria-hidden="true" />
          تحليلات السوق في منطقتك
        </h2>
      </div>

      <div className="market-analytics__grid">
        {analytics.cards.map((card) => {
          const Icon = marketIconMap[card.iconKey] || FiUsers;

          return (
            <article className="market-analytics-card" key={card.id}>
              <span
                className={`market-analytics-card__icon market-analytics-card__icon--${card.tone}`}
                aria-hidden="true"
              >
                <Icon />
              </span>
              <div>
                <p>{card.label}</p>
                <strong>{card.value}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MarketAnalytics;
