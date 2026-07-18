const overviewItems = [
  {
    id: "totalGenerators",
    label: "عدد المولدات",
    valueKey: "totalGenerators",
  },
  {
    id: "maintenanceGenerators",
    label: "مولدات قيد الإصلاح",
    valueKey: "maintenanceGenerators",
    tone: "warning",
  },
  {
    id: "averageUsage",
    label: "متوسط الاستهلاك",
    valueKey: "averageUsage",
    suffix: "%",
  },
];

function formatValue(value, suffix = "") {
  return `${new Intl.NumberFormat("en-US").format(Number(value || 0))}${suffix}`;
}

function ProviderGeneratorsOverview({ overview }) {
  return (
    <aside className="provider-generators-overview">
      <h2>نظرة سريعة</h2>
      <p>إجمالي الأداء اليوم</p>

      <dl>
        {overviewItems.map((item) => (
          <div className="provider-generators-overview__item" key={item.id}>
            <dt>{item.label}</dt>
            <dd
              className={
                item.tone
                  ? `provider-generators-overview__value--${item.tone}`
                  : ""
              }
            >
              {formatValue(overview[item.valueKey], item.suffix)}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export default ProviderGeneratorsOverview;
