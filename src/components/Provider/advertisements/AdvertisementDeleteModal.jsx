import { FiTrash2, FiX } from "react-icons/fi";

function AdvertisementDeleteModal({
  advertisement,
  isDeleting,
  onCancel,
  onConfirm,
}) {
  if (!advertisement) return null;

  return (
    <div className="advertisement-modal-backdrop" role="presentation">
      <section
        className="advertisement-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="advertisement-delete-title"
      >
        <button
          type="button"
          className="advertisement-modal-close"
          onClick={onCancel}
          aria-label="إغلاق نافذة الحذف"
          disabled={isDeleting}
        >
          <FiX aria-hidden="true" />
        </button>

        <span className="advertisement-confirm-modal__icon" aria-hidden="true">
          <FiTrash2 />
        </span>
        <h2 id="advertisement-delete-title">حذف الإعلان</h2>
        <p>
          هل تريد حذف الإعلان "<bdi dir="auto">{advertisement.title}</bdi>"؟
          لا يمكن التراجع عن هذه العملية.
        </p>

        <div className="advertisement-confirm-modal__actions">
          <button type="button" onClick={onCancel} disabled={isDeleting}>
            إلغاء
          </button>
          <button
            type="button"
            className="advertisement-confirm-modal__delete"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "جاري الحذف..." : "حذف الإعلان"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdvertisementDeleteModal;
