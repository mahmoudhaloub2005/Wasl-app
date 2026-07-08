import "./CurrentSubscriberCard.css";
import { FaTrashAlt } from "react-icons/fa";

function CurrentSubscriberCard({
  name,
  phone,
  amps,
  address
}) {

  return (

    <div className="current-card">

      {/* معلومات المشترك */}

      <div className="current-info">

        <div className="avatar">

          {name.charAt(0)}

        </div>

        <div>

          <h3>{name}</h3>

          <p>{phone}</p>

          <span>{amps} أمبير • {address}</span>

        </div>

      </div>

      {/* حذف */}

      <button className="delete-btn">

        <FaTrashAlt />

        حذف

      </button>

    </div>

  );

}

export default CurrentSubscriberCard;

