function ProviderChartTabs({ periods, activePeriod, onChange }) {
  return (
    <div className="provider-chart-tabs" role="tablist" aria-label="نطاق الرسم">
      {periods.map((period) => (
        <button
          type="button"
          role="tab"
          aria-selected={activePeriod === period.id}
          className={activePeriod === period.id ? "active" : ""}
          key={period.id}
          onClick={() => onChange(period.id)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

export default ProviderChartTabs;
