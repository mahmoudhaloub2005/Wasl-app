
import "./AdsTable.css";
import AdRow from "./AdRow";

function AdsTable() {

  const ads = [

    {
      id:1,
      title:"اشتراك 5 أمبير",
      views:540,
      status:"نشط"
    },

    {
      id:2,
      title:"خصم الصيف",
      views:320,
      status:"نشط"
    },

    {
      id:3,
      title:"عرض خاص",
      views:180,
      status:"منتهي"
    }

  ];

  return (

    <div className="ads-table">

      <h2>

        الإعلانات الحالية

      </h2>

      {

        ads.map(ad=>

          <AdRow

            key={ad.id}

            ad={ad}

          />

        )

      }

    </div>

  );

}

export default AdsTable;
