import "./FinancialLayout.css";

function FinancialStatCard({
  title,
  value,
  growth,
  icon,
  color,
}) {
  return (
    <div className="financial-stat-card">
      <div className="financial-stat-top">
        <span className="growth-badge" style={{ color }}>
          {growth}
        </span>

        <div
          className="financial-icon"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </div>
      </div>

      <h4>{title}</h4>
      <h2>{value}</h2>
      <span>شيكل</span>

      <div className="financial-line" style={{ background: color }}></div>
    </div>
  );
}

export default FinancialStatCard;