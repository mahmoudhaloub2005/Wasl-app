import FinanceQuickAccessCard from "./FinanceQuickAccessCard";

function FinanceQuickAccess({ items, onNavigate }) {
  return (
    <section className="finance-quick" aria-labelledby="finance-quick-title">
      <h2 id="finance-quick-title">الوصول السريع</h2>

      <div className="finance-quick__grid">
        {items.map((item) => (
          <FinanceQuickAccessCard
            item={item}
            key={item.id}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}

export default FinanceQuickAccess;