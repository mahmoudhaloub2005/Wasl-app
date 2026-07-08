
import "./CurrentSubscribers.css";
import CurrentSubscriberCard from "./CurrentSubscriberCard";

function CurrentSubscribers() {

  const subscribers = [

    {

      name:"محمد أحمد",

      phone:"0599123456",

      amps:5,

      address:"غزة"

    },

    {

      name:"سارة خالد",

      phone:"0599888777",

      amps:10,

      address:"خانيونس"

    },

    {

      name:"علي محمود",

      phone:"0599777666",

      amps:7,

      address:"رفح"

    },

    {

      name:"أحمد عمر",

      phone:"0599555444",

      amps:8,

      address:"دير البلح"

    }

  ];

  return (

    <div className="current-subscribers">

      <h2>

        المشتركون الحاليون

      </h2>

      {

        subscribers.map((subscriber,index)=>

          <CurrentSubscriberCard

            key={index}

            name={subscriber.name}

            phone={subscriber.phone}

            amps={subscriber.amps}

            address={subscriber.address}

          />

        )

      }

    </div>

  );

}

export default CurrentSubscribers;
