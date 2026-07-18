function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function GeneratorCapacityItem({ item }) {
  return (
    <div className="generator-capacity-item">
      <div className="generator-capacity-item__header">
        <strong>{item.name}</strong>
        <span>
          {item.percentage}% ({formatNumber(item.consumed)}/
          {formatNumber(item.capacity)} A)
        </span>
      </div>

      <span className="generator-capacity-item__track" aria-hidden="true">
        <i
          className={`generator-capacity-item__bar generator-capacity-item__bar--${item.tone}`}
          style={{ width: `${item.percentage}%` }}
        />
      </span>
    </div>
  );
}

export default GeneratorCapacityItem;
