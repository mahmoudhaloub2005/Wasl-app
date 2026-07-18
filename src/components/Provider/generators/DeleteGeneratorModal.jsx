import { useEffect, useRef } from "react";

import "./DeleteGeneratorModal.css";

function DeleteGeneratorModal({
  errorMessage = "",
  generator,
  isDeleting = false,
  isOpen,
  onCancel,
  onConfirm,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeleting, isOpen, onCancel]);

  useEffect(() => {
    if (!isOpen || isDeleting) return undefined;

    const focusTarget =
      modalRef.current?.querySelector(".delete-generator-modal__confirm") ||
      modalRef.current?.querySelector("button");

    focusTarget?.focus();

    return undefined;
  }, [isDeleting, isOpen]);

  if (!isOpen || !generator) return null;

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && !isDeleting) {
      onCancel();
    }
  }

  return (
    <div
      className="delete-generator-modal-backdrop"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <section
        aria-describedby="delete-generator-description"
        aria-labelledby="delete-generator-title"
        aria-modal="true"
        className="delete-generator-modal"
        dir="rtl"
        ref={modalRef}
        role="dialog"
      >
        <button
          aria-label="إغلاق نافذة حذف المولد"
          className="delete-generator-modal__close"
          disabled={isDeleting}
          onClick={onCancel}
          type="button"
        >
          ×
        </button>

        <h2 className="delete-generator-modal__title" id="delete-generator-title">
          حذف المولد
        </h2>

        <p
          className="delete-generator-modal__description"
          id="delete-generator-description"
        >
          هل أنت متأكد من رغبتك في حذف المولد؟ هذا الإجراء سيؤدي إلى إيقاف
          جميع الاشتراكات المرتبطة به ولا يمكن التراجع عنه.
        </p>

        {errorMessage ? (
          <p className="delete-generator-modal__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="delete-generator-modal__actions">
          <button
            className="delete-generator-modal__confirm"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
          </button>

          <button
            className="delete-generator-modal__cancel"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            تراجع
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteGeneratorModal;
