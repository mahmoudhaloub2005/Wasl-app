import ProviderGeneratorUsageCard from "./ProviderGeneratorUsageCard";
import ProviderEmptyState from "./ProviderEmptyState";

function ProviderGeneratorUsageGrid({ generators, isLoading, onNavigate }) {
  if (isLoading) {
    return (
      <section className="provider-generator-usage-grid" aria-label="استهلاك المولدات">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            className="provider-generator-usage-card provider-generator-usage-card--loading"
            key={index}
          >
            <span />
            <span />
            <p />
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="provider-generator-usage-grid" aria-label="استهلاك المولدات">
      {generators.length ? (
        generators.map((generator) => (
        <ProviderGeneratorUsageCard
          generator={generator}
          key={generator.id}
          onNavigate={onNavigate}
        />
        ))
      ) : (
        <ProviderEmptyState
          className="provider-dashboard-empty--wide"
          message="لا توجد مولدات أو بيانات استهلاك مسجلة حالياً"
        />
      )}
    </section>
  );
}

export default ProviderGeneratorUsageGrid;
