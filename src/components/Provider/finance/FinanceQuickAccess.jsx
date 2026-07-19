import FinanceQuickAccessCard from "./FinanceQuickAccessCard";

function FinanceQuickAccess({ invoices = [], items, onNavigate, providerName = "" }) {
  return (
    <section className="finance-quick" aria-labelledby="finance-quick-title">
      <h2 id="finance-quick-title">الوصول السريع</h2>

      <div className="finance-quick__grid">
        {items.map((item) => (
          <FinanceQuickAccessCard
            invoices={item.id === "reports" ? invoices : []}
            item={item}
            key={item.id}
            onNavigate={onNavigate}
            providerName={providerName}
          />
        ))}
      </div>
    </section>
  );
}

export default FinanceQuickAccess;