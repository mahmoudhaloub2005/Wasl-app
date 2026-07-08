
import "./FinancialLayout.css";

function QuickAccessCard({
  title,
  description,
  buttonText,
  icon,
  buttonColor,
}) {
  return (
    <div className="quick-card">

      <div className="quick-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>

    </div>
  );
}

export default QuickAccessCard;

