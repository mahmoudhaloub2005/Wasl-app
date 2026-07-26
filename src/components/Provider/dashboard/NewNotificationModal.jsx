import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

import "./NewNotificationModal.css";

const INITIAL_FORM = {
  title: "",
  message: "",
};

const INITIAL_ERRORS = {
  title: "",
  message: "",
};

function validateNotificationForm(values) {
  const errors = { ...INITIAL_ERRORS };

  if (!values.title.trim()) {
    errors.title = "يرجى إدخال عنوان الإشعار";
  }

  if (!values.message.trim()) {
    errors.message = "يرجى إدخال نص الإشعار";
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

function getSubmitErrorMessage(error) {
  return error?.displayMessage || error?.message || "تعذر إرسال الإشعار.";
}

function NewNotificationModal({ isOpen, onClose, onSubmit }) {
  const messageId = useId();
  const titleId = useId();
  const isSubmittingRef = useRef(false);
  const previousFocusRef = useRef(null);
  const titleInputRef = useRef(null);
  const [notificationForm, setNotificationForm] = useState(INITIAL_FORM);
  const [validationErrors, setValidationErrors] = useState(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  const resetModalState = useCallback(() => {
    setNotificationForm(INITIAL_FORM);
    setValidationErrors(INITIAL_ERRORS);
    setIsSubmitting(false);
    setSubmitErrorMessage("");
  }, []);

  const handleClose = useCallback(() => {
    if (isSubmittingRef.current) return;

    resetModalState();
    onClose();
  }, [onClose, resetModalState]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  function updateField(fieldName, value) {
    setNotificationForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));
    setValidationErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: "",
    }));
    setSubmitErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = validateNotificationForm(notificationForm);
    setValidationErrors(nextErrors);

    if (hasErrors(nextErrors)) return;

    setIsSubmitting(true);
    setSubmitErrorMessage("");

    try {
      await onSubmit({
        message: notificationForm.message.trim(),
        title: notificationForm.title.trim(),
      });
      resetModalState();
      onClose();
    } catch (error) {
      setSubmitErrorMessage(getSubmitErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="new-notification-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <section
        className="new-notification-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-notification-title"
        dir="rtl"
      >
        <button
          type="button"
          className="new-notification-modal__close"
          onClick={handleClose}
          aria-label="إغلاق نافذة الإشعار"
          disabled={isSubmitting}
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="new-notification-title">إشعار جديد</h2>

        <form className="new-notification-form" onSubmit={handleSubmit}>
          <label className="new-notification-form__field" htmlFor={titleId}>
            <span>عنوان الإشعار</span>
            <input
              id={titleId}
              ref={titleInputRef}
              type="text"
              value={notificationForm.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="صيانة"
              aria-invalid={Boolean(validationErrors.title)}
              aria-describedby={
                validationErrors.title ? `${titleId}-error` : undefined
              }
            />
            {validationErrors.title ? (
              <small id={`${titleId}-error`} role="alert">
                {validationErrors.title}
              </small>
            ) : null}
          </label>

          <label className="new-notification-form__field" htmlFor={messageId}>
            <span>نص الإشعار</span>
            <textarea
              id={messageId}
              value={notificationForm.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="سيتم إيقاف المولد للصيانة غداً"
              aria-invalid={Boolean(validationErrors.message)}
              aria-describedby={
                validationErrors.message ? `${messageId}-error` : undefined
              }
            />
            {validationErrors.message ? (
              <small id={`${messageId}-error`} role="alert">
                {validationErrors.message}
              </small>
            ) : null}
          </label>

          {submitErrorMessage ? (
            <small className="new-notification-form__error" role="alert">
              {submitErrorMessage}
            </small>
          ) : null}

          <button
            type="submit"
            className="new-notification-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال تنبيه"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default NewNotificationModal;
