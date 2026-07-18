import { FiTrendingUp } from "react-icons/fi";

function AdvertisementOverview({ overview }) {
  return (
    <section
      className="advertisement-overview"
      aria-labelledby="advertisement-overview-title"
    >
      <div className="advertisement-overview__text">
        <h2 id="advertisement-overview-title">نظرة عامة على نشاطك</h2>
        <p>{overview.reachSentence}</p>
      </div>

      <span className="advertisement-overview__icon" aria-hidden="true">
        <FiTrendingUp />
      </span>
    </section>
  );
}

export default AdvertisementOverview;
