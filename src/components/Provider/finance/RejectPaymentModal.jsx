import { useEffect } from "react";
import { FiX } from "react-icons/fi";

function RejectPaymentModal({
  error,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
  onReasonChange,
  payment,
  reason,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="reject-payment-modal" onMouseDown={onClose} role="presentation">
      <section
        aria-labelledby="reject-payment-title"
        aria-modal="true"
        className="reject-payment-modal__dialog"
        dir="rtl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          type="button"
          className="reject-payment-modal__close"
          aria-label="إغلاق نافذة رفض طلب الدفع"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="reject-payment-title">رفض طلب الدفع</h2>
        <p>{payment?.customerName || "طلب الدفع المحدد"}</p>

        <label className="reject-payment-modal__field">
          <span>سبب الرفض</span>
          <textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            disabled={isSubmitting}
            required
            rows={5}
          />
        </label>

        {error && (
          <p className="reject-payment-modal__error" role="alert">
            {error}
          </p>
        )}

        <div className="reject-payment-modal__actions">
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            تراجع
          </button>
          <button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "جاري الرفض..." : "تأكيد الرفض"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default RejectPaymentModal;
