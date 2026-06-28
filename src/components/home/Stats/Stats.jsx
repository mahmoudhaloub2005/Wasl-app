import { useState } from "react";
import "./Stats.css";

function useStats() {
  const [stats] = useState([
    {
      number: "50k+",
      title: "مشترك نشط",
    },
    {
      number: "200+",
      title: "مزود طاقة معتمد",
    },
    {
      number: "99.9%",
      title: "وقت التشغيل",
    },
    {
      number: "24/7",
      title: "دعم فني متواصل",
    },
  ]);

  return stats;
}

function Stats() {
  const stats = useStats();

  return (
    <section className="stats-section">
      {stats.map((item, index) => (
        <div className="stat-card" key={index}>
          <h3>{item.number}</h3>
          <p>{item.title}</p>
        </div>
      ))}
    </section>
  );
}

export default Stats;