import "./CustomerMiniStats.css";

const defaultStats = [
  {
    id: 1,
    title: "عدد الفواتير غير المدفوعة",
    value: "1 فاتورة",
    cardClass: "mini-stat-red",
    textClass: "red-text",
  },
  {
    id: 2,
    title: "آخر دفعة تم سدادها",
    value: "100 شيكل",
    cardClass: "mini-stat-green",
    textClass: "dark-text",
  },
  {
    id: 3,
    title: "الاشتراك الحالي (أمبير)",
    value: "10 أمبير",
    cardClass: "mini-stat-blue",
    textClass: "blue-text",
  },
];

function CustomerMiniStats({ stats = defaultStats }) {
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