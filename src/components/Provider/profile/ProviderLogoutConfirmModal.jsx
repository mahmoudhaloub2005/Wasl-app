import { useEffect } from "react";

function ProviderLogoutConfirmModal({
  isOpen,
  isSubmitting = false,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape" && !isSubmitting) {
        onCancel();
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, isSubmitting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="provider-profile-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <div
        className="provider-profile-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-logout-title"
        aria-describedby="provider-logout-description"
      >
        <h2 id="provider-logout-title">تسجيل الخروج</h2>
        <p id="provider-logout-description">
          هل أنت متأكد من تسجيل الخروج؟
        </p>

        <div className="provider-profile-modal__actions">
          <button
            type="button"
            className="provider-profile-modal__confirm"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
          <button
            type="button"
            className="provider-profile-modal__cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProviderLogoutConfirmModal;
