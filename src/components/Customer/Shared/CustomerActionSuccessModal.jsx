import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import "./CustomerActionSuccessModal.css";

function CustomerActionSuccessModal({
  title,
  description,
  supportText = "هل تواجه مشكلة؟",
  supportLinkText = "اتصل بالدعم",
  onClose,
  onSupport,
}) {
  return (
    <div className="customer-success-backdrop" role="presentation">
      <section
        className="customer-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-success-title"
        dir="rtl"
      >
        <button
          className="customer-success-close"
          type="button"
          aria-label="إغلاق"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <div className="customer-success-icon">
          <span>
            <IoCheckmarkSharp />
          </span>
        </div>

        <h2 id="customer-success-title">{title}</h2>
        <p>{description}</p>

        <div className="customer-success-divider" />

        <button
          className="customer-success-support"
          type="button"
          onClick={onSupport}
        >
          {supportText}
          <strong>{supportLinkText}</strong>
        </button>
      </section>
    </div>
  );
}

export default CustomerActionSuccessModal;
