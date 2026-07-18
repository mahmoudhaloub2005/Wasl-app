function clampPercentage(value) {
  const percentage = Number(value);

  if (Number.isNaN(percentage)) return 0;

  return Math.min(100, Math.max(0, percentage));
}

function ProviderGeneratorUsageCard({ generator, onNavigate }) {
  const percentage = clampPercentage(generator.percentage);

  return (
    <button
      type="button"
      className="provider-generator-usage-card"
      onClick={() => onNavigate(generator.path)}
    >
      <div className="provider-generator-usage-card__header">
        <strong>{percentage}%</strong>
        <h3>{generator.name}</h3>
      </div>

      <span className="provider-generator-usage-card__track">
        <i style={{ width: `${percentage}%` }} />
      </span>

      <p>
        الاستهلاك الحالي: {generator.currentLoad}/{generator.capacity}{" "}
        {generator.unit}
      </p>
    </button>
  );
}

export default ProviderGeneratorUsageCard;
