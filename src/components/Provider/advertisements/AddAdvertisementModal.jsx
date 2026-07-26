import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

import AdvertisementImageUpload from "./AdvertisementImageUpload";
import "./AddAdvertisementModal.css";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_TITLE_LENGTH = 100;
const SUPPORTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg"]);
const IS_POSTER_IMAGE_UPLOAD_SUPPORTED = false;
const INITIAL_VALUES = {
  description: "",
  image: null,
  title: "",
};

function validateImageFile(file) {
  if (!file) return "";

  const extension = file.name.split(".").pop()?.toLowerCase();
  const hasSupportedExtension = ["png", "jpg", "jpeg"].includes(extension);

  if (!SUPPORTED_IMAGE_TYPES.has(file.type) && !hasSupportedExtension) {
    return "صيغة الصورة غير مدعومة. استخدم PNG أو JPG.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "يجب ألا يتجاوز حجم الصورة 5MB.";
  }

  return "";
}

function validateForm(values) {
  const title = values.title.trim();
  const description = values.description.trim();
  const errors = {
    description: "",
    image: "",
    title: "",
  };

  if (!title) {
    errors.title = "يرجى إدخال اسم العرض.";
  } else if (title.length < 3) {
    errors.title = "يجب أن يحتوي اسم العرض على 3 أحرف على الأقل.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = "يجب ألا يتجاوز اسم العرض 100 حرف.";
  }

  if (!description) {
    errors.description = "يرجى إدخال وصف الإعلان.";
  } else if (description.length < 5) {
    errors.description = "يجب أن يحتوي وصف الإعلان على 5 أحرف على الأقل.";
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = "يجب ألا يتجاوز وصف الإعلان 500 حرف.";
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

function mapSubmitFieldErrors(error) {
  const submitErrors = error?.response?.data?.errors;
  const fieldErrors = {};

  if (!submitErrors || typeof submitErrors !== "object") return fieldErrors;

  Object.entries(submitErrors).forEach(([fieldName, messages]) => {
    const [message] = Array.isArray(messages) ? messages : [messages];
    const lowerFieldName = fieldName.toLowerCase();

    if (!message) return;

    if (lowerFieldName.includes("title") || lowerFieldName.includes("name")) {
      fieldErrors.title = String(message);
    } else if (lowerFieldName.includes("description")) {
      fieldErrors.description = String(message);
    } else if (
      lowerFieldName.includes("image") ||
      lowerFieldName.includes("photo") ||
      lowerFieldName.includes("file")
    ) {
      fieldErrors.image = String(message);
    }
  });

  return fieldErrors;
}

function getSubmitErrorMessage(error) {
  if (error?.response?.status === 401) {
    return "انتهت جلسة تسجيل الدخول، يرجى تسجيل الدخول مرة أخرى.";
  }

  if (!error?.response) {
    return "تعذر نشر الإعلان. تحقق من الاتصال وحاول مرة أخرى.";
  }

  return error?.response?.data?.message || "سيتم تفعيل الحفظ النهائي بعد ربط الخدمة";
}

function createAdvertisementPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
  };
}

function getFocusableElements(container) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",")
    )
  ).filter((element) => element.offsetParent !== null);
}

function AddAdvertisementModal({
  isOpen,
  isSubmitting = false,
  onClose,
  onCreated,
  onSubmit,
}) {
  const descriptionId = useId();
  const imageId = useId();
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState(INITIAL_VALUES);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const isDirty = useMemo(
    () =>
      Boolean(
        formValues.image ||
          formValues.title.trim() ||
          formValues.description.trim()
      ),
    [formValues]
  );
  const descriptionLength = formValues.description.length;

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  if (!isOpen) return null;

  function resetForm() {
    setFieldErrors({});
    setFormValues(INITIAL_VALUES);
    setIsDragActive(false);
    setPreviewUrl("");
    setShowCloseConfirmation(false);
    setSubmitErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function requestClose() {
    if (isSubmitting) return;

    if (isDirty) {
      setShowCloseConfirmation(true);
      return;
    }

    onClose();
  }

  function discardAndClose() {
    resetForm();
    onClose();
  }

  function updateField(fieldName, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: "",
    }));
    setSubmitErrorMessage("");
  }

  async function selectImage(file) {
    setSubmitErrorMessage("");
    setIsDragActive(false);

    const imageError = validateImageFile(file);
    const unsupportedImageError = IS_POSTER_IMAGE_UPLOAD_SUPPORTED
      ? ""
      : "رفع صورة الإعلان غير مدعوم في واجهة Wasel API الحالية.";

    if (imageError || unsupportedImageError) {
      updateField("image", null);
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        image: imageError || unsupportedImageError,
      }));
      setPreviewUrl("");
      return;
    }

    setIsImageProcessing(true);

    try {
      const nextPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(nextPreviewUrl);
      updateField("image", file);
    } finally {
      setIsImageProcessing(false);
    }
  }

  function handleImageInputChange(event) {
    selectImage(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    selectImage(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragActive(true);
  }

  function handleUploadBlur() {
    setIsDragActive(false);
  }

  function removeImage() {
    updateField("image", null);
    setPreviewUrl("");
  }

  function handleDialogKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();

      if (showCloseConfirmation) {
        setShowCloseConfirmation(false);
        return;
      }

      requestClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements(dialogRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const nextFieldErrors = validateForm(formValues);
    setFieldErrors(nextFieldErrors);

    if (hasErrors(nextFieldErrors)) return;

    setSubmitErrorMessage("");

    try {
      const payload = createAdvertisementPayload(formValues);
      const createdAdvertisement = await onSubmit(payload);

      resetForm();
      onCreated?.(createdAdvertisement);
      onClose();
    } catch (error) {
      const submitFieldErrors = mapSubmitFieldErrors(error);

      if (Object.keys(submitFieldErrors).length) {
        setFieldErrors((currentErrors) => ({
          ...currentErrors,
          ...submitFieldErrors,
        }));
      }

      setSubmitErrorMessage(getSubmitErrorMessage(error));
    }
  }

  return (
    <div
      className="add-advertisement-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        className="add-advertisement-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-advertisement-title"
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
      >
        <button
          type="button"
          className="add-advertisement-modal__close"
          onClick={requestClose}
          aria-label="إغلاق نافذة إضافة الإعلان"
          disabled={isSubmitting}
          ref={closeButtonRef}
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="add-advertisement-title">إضافة إعلان جديد</h2>

        <form className="add-advertisement-form" onSubmit={handleSubmit}>
          <AdvertisementImageUpload
            errorMessage={fieldErrors.image}
            id={imageId}
            inputRef={fileInputRef}
            isDragActive={isDragActive}
            isProcessing={isImageProcessing}
            onBlur={handleUploadBlur}
            onDragLeave={() => setIsDragActive(false)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onInputChange={handleImageInputChange}
            onOpenFilePicker={() => fileInputRef.current?.click()}
            onRemove={removeImage}
            previewUrl={previewUrl}
          />

          <div className="add-advertisement-field">
            <label htmlFor={titleId}>اسم العرض</label>
            <input
              id={titleId}
              type="text"
              value={formValues.title}
              maxLength={MAX_TITLE_LENGTH + 1}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="مثلاً: عرض خاص لشهر يوليو"
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={
                fieldErrors.title ? `${titleId}-error` : undefined
              }
            />
            {fieldErrors.title && (
              <p className="add-advertisement-field__error" id={`${titleId}-error`}>
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div className="add-advertisement-field">
            <div className="add-advertisement-field__label-row">
              <label htmlFor={descriptionId}>وصف الإعلان</label>
              <span>{descriptionLength} / {MAX_DESCRIPTION_LENGTH}</span>
            </div>
            <textarea
              id={descriptionId}
              value={formValues.description}
              maxLength={MAX_DESCRIPTION_LENGTH + 1}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="خصم 20% على رسوم الاشتراك"
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={
                fieldErrors.description ? `${descriptionId}-error` : undefined
              }
            />
            {fieldErrors.description && (
              <p
                className="add-advertisement-field__error"
                id={`${descriptionId}-error`}
              >
                {fieldErrors.description}
              </p>
            )}
          </div>

          {submitErrorMessage && (
            <div className="add-advertisement-form__submit-error" role="alert">
              {submitErrorMessage}
            </div>
          )}

          <button
            type="submit"
            className="add-advertisement-form__submit"
            disabled={isSubmitting || isImageProcessing}
          >
            {isSubmitting ? "جارٍ نشر الإعلان..." : "نشر الإعلان الآن"}
          </button>
        </form>

        {showCloseConfirmation && (
          <div
            className="add-advertisement-confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-advertisement-confirm-title"
          >
            <div className="add-advertisement-confirm__dialog">
              <h3 id="add-advertisement-confirm-title">
                لديك بيانات غير محفوظة، هل تريد إغلاق النافذة؟
              </h3>
              <div className="add-advertisement-confirm__actions">
                <button
                  type="button"
                  onClick={() => setShowCloseConfirmation(false)}
                >
                  متابعة التعديل
                </button>
                <button type="button" onClick={discardAndClose}>
                  إغلاق بدون حفظ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAdvertisementModal;

