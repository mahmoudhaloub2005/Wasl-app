import FinancialSummaryCard from "./FinancialSummaryCard";

function buildCards(summary) {
  const values = [
    Number(summary?.monthlyRevenue || 0),
    Number(summary?.yearlyRevenue || summary?.weeklyRevenue || 0),
    Number(summary?.netProfit || 0),
  ];
  const maxValue = Math.max(...values, 1);

  return [
    {
      id: "monthly-revenue",
      change: summary?.monthlyRevenueChange,
      iconKey: "calendar",
      label: "الإيراد الشهري",
      progress: Math.max(0, Math.min(100, (values[0] / maxValue) * 100)),
      tone: "blue",
      unit: "شيكل",
      value: values[0],
    },
    {
      id: "yearly-revenue",
      change: summary?.yearlyRevenueChange ?? summary?.weeklyRevenueChange,
      iconKey: "chart",
      label: "الإيراد السنوي",
      progress: Math.max(0, Math.min(100, (values[1] / maxValue) * 100)),
      tone: "orange",
      unit: "شيكل",
      value: values[1],
    },
    {
      id: "net-profit",
      change: summary?.netProfitChange,
      iconKey: "money",
      label: "صافي الأرباح",
      progress: Math.max(0, Math.min(100, (values[2] / maxValue) * 100)),
      tone: "green",
      unit: "شيكل",
      value: values[2],
    },
  ];
}

function FinancialSummaryCards({
  ariaLabel = "ملخص الإدارة المالية",
  cards,
  emptyMessage = "لا توجد بيانات مالية بعد.",
  isLoading,
  showEmptyMessage = false,
  summary,
}) {
  const summaryCards = cards || buildCards(summary);
  const className = cards
    ? "financial-summary financial-summary--invoices"
    : "financial-summary financial-summary--dashboard";

  return (
    <section className={className} aria-label={ariaLabel}>
      <div className="financial-summary__grid">
        {summaryCards.map((card) => (
          <FinancialSummaryCard card={card} isLoading={isLoading} key={card.id} />
        ))}
      </div>

      {!isLoading && showEmptyMessage && (
        <p className="financial-summary__empty">{emptyMessage}</p>
      )}
    </section>
  );
}

export default FinancialSummaryCards;