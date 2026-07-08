
import "./GeneratorOverviewCard.css";

function GeneratorOverviewCard() {
  return (
    <div className="overview-card">

      <h3>نظرة سريعة</h3>

      <div className="overview-item">
        <span>عدد المولدات</span>
        <strong>12</strong>
      </div>

      <div className="overview-item">
        <span>مولدات قيد الإصلاح</span>
        <strong>2</strong>
      </div>

      <div className="overview-item">
        <span>متوسط الاستهلاك</span>
        <strong>64%</strong>
      </div>

    </div>
  );
}

export default GeneratorOverviewCard;

