
import "./AdsOverview.css";

function AdsOverview() {
  return (
    <div className="ads-overview">

      <div>
        <h2>إدارة الإعلانات</h2>
        <p>أنشئ إعلانات جديدة وتابع أداء حملاتك بسهولة.</p>
      </div>

      <div className="overview-stats">

        <div>
          <h3>1,250</h3>
          <span>مشاهدة</span>
        </div>

        <div>
          <h3>6</h3>
          <span>إعلانات نشطة</span>
        </div>

      </div>

    </div>
  );
}

export default AdsOverview;

