import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

import GeneratorBasicInfoForm from "./GeneratorBasicInfoForm";
import GeneratorLocationMap from "./GeneratorLocationMap";
import GeneratorNotesCard from "./GeneratorNotesCard";
import GeneratorPricingCard from "./GeneratorPricingCard";
import GeneratorQuickTip from "./GeneratorQuickTip";
import "./AddGeneratorModal.css";

const CURRENCY_LABEL = "شيكل";
const NOTES_LIMIT = 500;
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const statusOptions = [
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
  { value: "maintenance", label: "تحت الصيانة" },
];

const statusMetaByValue = {
  active: { value: "active", label: "نشط" },
  inactive: { value: "inactive", label: "غير نشط" },
  maintenance: { value: "maintenance", label: "تحت الصيانة" },
};

const initialFormValues = {
  generatorName: "",
  capacityKva: "",
  status: "active",
  locationName: "",
  latitude: null,
  longitude: null,
  defaultAmperePrice: "",
  notes: "",
};

function sanitizeDecimalInput(value) {
  const cleanValue = String(value || "").replace(/[^\d.]/g, "");
  const [integerPart, ...decimalParts] = cleanValue.split(".");
  const decimalValue = decimalParts.join("");

  return decimalParts.length ? `${integerPart}.${decimalValue}` : integerPart;
}

function isEmpty(value) {
  return String(value ?? "").trim() === "";
}

function validateGeneratorForm(values) {
  const errors = {};
  const generatorName = values.generatorName.trim();
  const capacity = Number(values.capacityKva);
  const price = Number(values.defaultAmperePrice);

  if (!generatorName) {
    errors.generatorName = "يرجى إدخال اسم المولد.";
  } else if (generatorName.length < 3) {
    errors.generatorName =
      "اسم المولد يجب أن يحتوي على 3 أحرف على الأقل.";
  }

  if (isEmpty(values.capacityKva)) {
    errors.capacityKva = "يرجى إدخال القدرة الكلية للمولد.";
  } else if (!Number.isFinite(capacity) || capacity <= 0) {
    errors.capacityKva = "يجب أن تكون القدرة الكلية أكبر من صفر.";
  }

  if (!values.status) {
    errors.status = "يرجى تحديد حالة المولد.";
  }

  if (!values.locationName.trim()) {
    errors.locationName = "يرجى تحديد الموقع الجغرافي أو اسم الحي.";
  }

  if (isEmpty(values.defaultAmperePrice)) {
    errors.defaultAmperePrice = "يرجى إدخال سعر الأمبير.";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.defaultAmperePrice = "سعر الأمبير غير صالح.";
  }

  if (values.notes.length > NOTES_LIMIT) {
    errors.notes = "يجب ألا تتجاوز الملاحظات 500 حرف.";
  }

  return errors;
}

function prepareGeneratorPayload(values) {
  return {
    generatorName: values.generatorName.trim(),
    capacityKva: Number(values.capacityKva),
    status: values.status,
    locationName: values.locationName.trim(),
    latitude: values.latitude,
    longitude: values.longitude,
    defaultAmperePrice: Number(values.defaultAmperePrice),
    notes: values.notes.trim(),
  };
}

function AddGeneratorModal({ isOpen, onClose, onCreated, onSubmit }) {
  const modalRef = useRef(null);
  const [values, setValues] = useState(initialFormValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setValues(initialFormValues);
    setTouched({});
    setErrors({});
    setApiError("");
    setIsSubmitting(false);
    setIsCloseConfirmOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const isDirty = useMemo(
    () =>
      Object.entries(initialFormValues).some(
        ([key, initialValue]) => values[key] !== initialValue
      ),
    [values]
  );

  const selectedStatusMeta =
    statusMetaByValue[values.status] || statusMetaByValue.active;

  const closeImmediately = useCallback(() => {
    setIsCloseConfirmOpen(false);
    onClose();
  }, [onClose]);

  const requestClose = useCallback(() => {
    if (isSubmitting) return;

    if (isDirty) {
      setIsCloseConfirmOpen(true);
      return;
    }

    closeImmediately();
  }, [closeImmediately, isDirty, isSubmitting]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = window.setTimeout(() => {
      const focusTarget = isCloseConfirmOpen
        ? modalRef.current?.querySelector(".add-generator-confirm button")
        : modalRef.current?.querySelector("#generatorName");

      focusTarget?.focus();
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (isCloseConfirmOpen) {
          setIsCloseConfirmOpen(false);
          return;
        }

        requestClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || []
      ).filter((element) => element.offsetParent !== null);

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCloseConfirmOpen, isOpen, requestClose]);

  if (!isOpen) return null;

  function markFieldTouched(fieldName) {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [fieldName]: true,
    }));
  }

  function clearFieldError(fieldName) {
    setErrors((currentErrors) => {
      if (!currentErrors[fieldName]) return currentErrors;

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  }

  function handleFieldChange(event) {
    const { name } = event.target;
    let { value } = event.target;

    if (name === "capacityKva" || name === "defaultAmperePrice") {
      value = sanitizeDecimalInput(value);
    }

    if (name === "notes") {
      value = value.slice(0, NOTES_LIMIT);
    }

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    clearFieldError(name);
    setApiError("");
  }

  function handleFieldBlur(event) {
    markFieldTouched(event.target.name);
  }

  function handleLocationChange(nextLocation) {
    setValues((currentValues) => ({
      ...currentValues,
      locationName: nextLocation.locationName ?? currentValues.locationName,
      latitude: nextLocation.latitude ?? currentValues.latitude,
      longitude: nextLocation.longitude ?? currentValues.longitude,
    }));
    clearFieldError("locationName");
    setApiError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextTouched = Object.keys(initialFormValues).reduce(
      (fields, field) => ({
        ...fields,
        [field]: true,
      }),
      {}
    );
    const nextErrors = validateGeneratorForm(values);

    setTouched(nextTouched);
    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length) {
      const firstErrorField = Object.keys(nextErrors)[0];
      modalRef.current
        ?.querySelector(`[name="${firstErrorField}"]`)
        ?.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await onSubmit(prepareGeneratorPayload(values));

      onCreated?.(result);


      closeImmediately();
    } catch (error) {
      if (error?.fieldErrors) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          ...error.fieldErrors,
        }));
      }

      setApiError(error?.message || "تعذر تسجيل المولد، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      requestClose();
    }
  }

  return (
    <div
      className="add-generator-modal-backdrop"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="add-generator-modal"
        dir="rtl"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-generator-title"
      >
        <button
          type="button"
          className="add-generator-modal__close"
          onClick={requestClose}
          aria-label="إغلاق نافذة تسجيل المولد"
          disabled={isSubmitting}
        >
          <FiX aria-hidden="true" />
        </button>

        <header className="add-generator-modal__header">
          <h2 id="add-generator-title">تسجيل مولد طاقة جديد</h2>
          <p>
            أدخل تفاصيل المولد التقنية والموقع الجغرافي لبدء إدارة الاشتراكات.
          </p>
        </header>

        <form className="add-generator-modal__form" onSubmit={handleSubmit} noValidate>
          <GeneratorBasicInfoForm
            errors={errors}
            statusOptions={statusOptions}
            touched={touched}
            values={values}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
          />

          <GeneratorPricingCard
            currencyLabel={CURRENCY_LABEL}
            error={errors.defaultAmperePrice}
            isTouched={touched.defaultAmperePrice}
            statusMeta={selectedStatusMeta}
            value={values.defaultAmperePrice}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
          />

          <GeneratorLocationMap
            latitude={values.latitude}
            locationName={values.locationName}
            longitude={values.longitude}
            onLocationChange={handleLocationChange}
          />

          <GeneratorNotesCard
            error={errors.notes}
            isTouched={touched.notes}
            value={values.notes}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
          />

          <GeneratorQuickTip />

          {apiError && (
            <p className="add-generator-modal__api-error" role="alert">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            className="add-generator-modal__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جارٍ حفظ البيانات..." : "حفظ البيانات"}
          </button>
        </form>

        {isCloseConfirmOpen && (
          <div className="add-generator-confirm-backdrop" role="presentation">
            <section
              className="add-generator-confirm"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="add-generator-confirm-title"
            >
              <h3 id="add-generator-confirm-title">
                لديك بيانات غير محفوظة، هل تريد إغلاق النافذة؟
              </h3>
              <div className="add-generator-confirm__actions">
                <button
                  type="button"
                  onClick={() => setIsCloseConfirmOpen(false)}
                >
                  متابعة التعديل
                </button>
                <button
                  type="button"
                  className="add-generator-confirm__danger"
                  onClick={closeImmediately}
                >
                  إغلاق بدون حفظ
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

export default AddGeneratorModal;

