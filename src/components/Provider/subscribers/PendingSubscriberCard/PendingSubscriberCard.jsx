import "./PendingSubscriberCard.css";
import { FaCheck, FaTimes } from "react-icons/fa";

function PendingSubscriberCard({ name, phone, amps, address }) {
  return (
    <div className="pending-card">


      <div className="avatar">
        {name?.charAt(0)}
      </div>

      <div className="info">
        <h3>{name}</h3>
        <p>{phone}</p>
        <span>{amps} أمبير - {address}</span>
      </div>

      <div className="actions">

        <button className="accept">
          <FaCheck />
        </button>

        <button className="reject">
          <FaTimes />
        </button>

      </div>

    </div>
  );
}

export default PendingSubscriberCard;

