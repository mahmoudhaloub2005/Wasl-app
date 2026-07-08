import "./RatingDistribution.css";

function RatingDistribution() {

  const ratings = [

    { stars: 5, percent: 80 },

    { stars: 4, percent: 12 },

    { stars: 3, percent: 5 },

    { stars: 2, percent: 2 },

    { stars: 1, percent: 1 },

  ];

  return (

    <div className="rating-distribution">

      <h2>تفاصيل التقييمات</h2>

      {ratings.map((item) => (

        <div className="rating-row" key={item.stars} >

          <span>{item.percent}%</span>

          <div className="rating-bar">

            <div className="rating-fill" style={{ width: ${item.percent}% }} ></div>

          </div>

          <span>{item.stars} نجوم</span>

        </div>

      ))}

    </div>

  );

}

export default RatingDistribution;
