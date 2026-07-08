
import "./MarketStatCard.css";

function MarketStatCard({ title, value }) {

  return (

    <div className="market-card">

      <h3>{value}</h3>

      <p>{title}</p>

    </div>

  );

}

export default MarketStatCard;

