function PaymentReviewTabs({ activeTab, completedCount, onChange, pendingCount }) {
  const tabs = [
    {
      count: pendingCount,
      id: "pending",
      label: "قيد المراجعة",
      suffix: "Pending",
    },
    {
      count: completedCount,
      id: "completed",
      label: "المكتملة",
      suffix: "Completed",
    },
  ];

  return (
    <div className="provider-payments-tabs" role="tablist" aria-label="حالات طلبات الدفع">
      {tabs.map((tab) => (
        <button
          type="button"
          className={
            activeTab === tab.id
              ? "provider-payments-tabs__button active"
              : "provider-payments-tabs__button"
          }
          key={tab.id}
          onClick={() => onChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          <span>{tab.label}</span>
          <b>({tab.suffix})</b>
          <small>{tab.count}</small>
        </button>
      ))}
    </div>
  );
}

export default PaymentReviewTabs;
