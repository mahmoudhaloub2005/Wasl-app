import "./MarketStats.css";
import MarketStatCard from "./MarketStatCard";

function MarketStats() {

  const stats=[

    {
      title:"متوسط سعر الأمبير",
      value:"15 شيكل"
    },

    {
      title:"عدد المنافسين",
      value:"24"
    },

    {
      title:"الطلب الحالي",
      value:"مرتفع"
    }

  ];

  return (

    <div className="market-stats">

      {

        stats.map((item,index)=>

          <MarketStatCard

            key={index}

            title={item.title}

            value={item.value}

          />

        )

      }

    </div>

  );

}

export default MarketStats;

