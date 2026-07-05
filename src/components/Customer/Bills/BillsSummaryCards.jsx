import {
  IoReceiptOutline,
  IoWalletOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

function BillsSummaryCards({ cards }) {
  const getIcon = (icon) => {
    if (icon === "receipt") return <IoReceiptOutline />;
    if (icon === "wallet") return <IoWalletOutline />;
    return <IoShieldCheckmarkOutline />;
  };

  return (
    <section className="bills-summary-grid">
      {cards.map((card) => (
        <article className={`bill-summary-card ${card.type}`} key={card.id}>
          <div className="summary-card-content">
            <span>{card.title}</span>
            <strong>{card.value}</strong>
            <p>{card.description}</p>
          </div>

          <div className="summary-card-icon">{getIcon(card.icon)}</div>
        </article>
      ))}
    </section>
  );
}

export default BillsSummaryCards;