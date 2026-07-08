import "./CustomerMiniStats.css";

function CustomerMiniStats({ stats = [] }) {
  return (
    <div className="customer-mini-stats" dir="rtl">
      {stats.map((stat) => (
        <div className={`mini-stat-card ${stat.cardClass}`} key={stat.id}>
          <div className="mini-stat-content">
            <p className="mini-stat-title">{stat.title}</p>
            <p className={`mini-stat-value ${stat.textClass}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CustomerMiniStats;
