import "./FinancialLayout.css";

function ConsumptionBar({
  name,
  percentage,
  value,
  color,
}) {
  return (
    <div className="consumption-item">

      <div className="consumption-header">
        <span>{name}</span>
        <span>{percentage}%</span>
      </div>

      <div className="consumption-progress">

        <div
          className="consumption-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>

      </div>

      <small>{value}</small>

    </div>
  );
}

export default ConsumptionBar;
