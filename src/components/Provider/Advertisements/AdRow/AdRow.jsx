
import "./AdRow.css";

function AdRow({ ad }) {

  return (

    <div className="ad-row">

      <div className="ad-image">

        {/* ضع صورة الإعلان هنا */}

      </div>

      <div className="ad-info">

        <h3>{ad.title}</h3>

        <span>{ad.views} مشاهدة</span>

      </div>

      <span className="status">

        {ad.status}

      </span>

      <button>

        تعديل

      </button>

    </div>

  );

}

export default AdRow;

