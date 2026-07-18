import ProviderStatCard from "./ProviderStatCard";

const loadingCards = ["stat-loading-1", "stat-loading-2", "stat-loading-3"];

function ProviderStatsGrid({ stats, isLoading, onNavigate }) {
  if (isLoading) {
    return (
      <section className="provider-dashboard-stats" aria-label="ملخص الأداء">
        {loadingCards.map((cardId) => (
          <article
            className="provider-stat-card provider-stat-card--loading"
            key={cardId}
          >
            <span />
            <span />
            <strong />
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="provider-dashboard-stats" aria-label="ملخص الأداء">
      {stats.map((stat) => (
        <ProviderStatCard key={stat.id} stat={stat} onNavigate={onNavigate} />
      ))}
    </section>
  );
}

export default ProviderStatsGrid;
