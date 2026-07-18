import { FiTrash2, FiX } from "react-icons/fi";

function DeleteSubscriberModal({ subscriber, onCancel, onConfirm }) {
  if (!subscriber) return null;

  return (
    <div className="delete-subscriber-modal__backdrop" role="presentation">
      <section
        className="delete-subscriber-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-subscriber-title"
      >
        <button
          type="button"
          className="delete-subscriber-modal__close"
          onClick={onCancel}
          aria-label="إغلاق نافذة الحذف"
        >
          <FiX aria-hidden="true" />
        </button>

        <span className="delete-subscriber-modal__icon" aria-hidden="true">
          <FiTrash2 />
        </span>

        <h2 id="delete-subscriber-title">حذف المشترك</h2>
        <p>هل أنت متأكد من حذف هذا المشترك؟</p>

        <div className="delete-subscriber-modal__actions">
          <button type="button" onClick={onCancel}>
            إلغاء
          </button>
          <button
            type="button"
            className="delete-subscriber-modal__confirm"
            onClick={onConfirm}
          >
            تأكيد الحذف
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteSubscriberModal;
