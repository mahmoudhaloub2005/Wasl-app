
import "./ReviewFilter.css";

function ReviewFilter() {

  return (

    <div className="review-filter">

      <span>ترتيب حسب</span>

      <button className="active">الأحدث</button>

      <button>الأعلى تقييماً</button>

      <button>الأقل تقييماً</button>

    </div>

  );

}

export default ReviewFilter;

