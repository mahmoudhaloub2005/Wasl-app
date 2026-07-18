import ProviderGeneratorFeaturedCard from "./ProviderGeneratorFeaturedCard";
import ProviderGeneratorsEmptyState from "./ProviderGeneratorsEmptyState";

function ProviderGeneratorsFeaturedList({
  generators,
  isLoading,
  onActivate,
  onDelete,
  onEdit,
  onMaintenance,
  pendingActionKey,
}) {
  if (isLoading) {
    return (
      <section className="provider-generators-featured">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            className="provider-generator-featured provider-generator-featured--loading"
            key={index}
          >
            <span />
            <div />
            <strong />
            <p />
            <p />
          </article>
        ))}
      </section>
    );
  }

  return (
    <section
      className="provider-generators-featured"
      aria-label="المولدات البارزة"
    >
      {generators.length ? (
        generators.map((generator) => (
          <ProviderGeneratorFeaturedCard
            generator={generator}
            key={generator.id}
            onActivate={onActivate}
            onDelete={onDelete}
            onEdit={onEdit}
            onMaintenance={onMaintenance}
            pendingActionKey={pendingActionKey}
          />
        ))
      ) : (
        <ProviderGeneratorsEmptyState message="لا توجد مولدات مسجلة حالياً" />
      )}
    </section>
  );
}

export default ProviderGeneratorsFeaturedList;
