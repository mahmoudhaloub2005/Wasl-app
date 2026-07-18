import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

import "./EditGeneratorModal.css";

const initialFormData = {
  name: "",
  location: "",
  capacityKva: "",
  amperePrice: "",
  maintenanceStatus: "",
};

const formFieldNames = [
  "name",
  "location",
  "capacityKva",
  "amperePrice",
  "maintenanceStatus",
];

const maintenanceStatusOptions = [
  {
    value: "operational",
    label: "يعمل بكفاءة",
    status: "active",
    tone: "active",
  },
  {
    value: "needs_maintenance",
    label: "يحتاج إلى صيانة",
    status: "maintenance",
    tone: "maintenance",
  },
  {
    value: "under_maintenance",
    label: "قيد الصيانة",
    status: "maintenance",
    tone: "maintenance",
  },
  {
    value: "temporarily_stopped",
    label: "متوقف مؤقتًا",
    status: "inactive",
    tone: "inactive",
  },
];

const maintenanceStatusByValue = maintenanceStatusOptions.reduce(
  (optionsByValue, option) => ({
    ...optionsByValue,
    [option.value]: option,
  }),
  {}
);

function sanitizeNumberInput(value) {
  const cleanValue = String(value || "").replace(/[^\d.]/g, "");
  const [integerPart, ...decimalParts] = cleanValue.split(".");
  const decimalValue = decimalParts.join("");

  return decimalParts.length ? `${integerPart}.${decimalValue}` : integerPart;
}

function getGeneratorPrice(generator = {}) {
  return (
    generator.amperePrice ??
    generator.pricePerAmpere ??
    generator.defaultAmperePrice ??
    generator.default_ampere_price ??
    ""
  );
}

function getGeneratorLocation(generator = {}) {
  return (
    generator.location ||
    generator.locationName ||
    generator.location_name ||
    generator.area ||
    generator.region ||
    generator.address ||
    ""
  );
}

function normalizeMaintenanceStatus(generator = {}) {
  const rawMaintenanceStatus =
    generator.maintenanceStatus || generator.maintenance_status || "";
  const status = generator.status || generator.state || "";

  if (maintenanceStatusByValue[rawMaintenanceStatus]) {
    return rawMaintenanceStatus;
  }

  if (rawMaintenanceStatus === "active" || status === "active") {
    return "operational";
  }

  if (rawMaintenanceStatus === "inactive" || status === "inactive") {
    return "temporarily_stopped";
  }

  if (rawMaintenanceStatus === "maintenance" || status === "maintenance") {
    return "under_maintenance";
  }

  return "operational";
}

function buildFormData(generator) {
  if (!generator) return initialFormData;

  return {
    name: generator.name || "",
    location: getGeneratorLocation(generator),
    capacityKva:
      generator.capacityKva === undefined || generator.capacityKva === null
        ? ""
        : String(generator.capacityKva),
    amperePrice:
      getGeneratorPrice(generator) === undefined ||
      getGeneratorPrice(generator) === null
        ? ""
        : String(getGeneratorPrice(generator)),
    maintenanceStatus: normalizeMaintenanceStatus(generator),
  };
}

function validateField(fieldName, values) {
  if (fieldName === "name" && !values.name.trim()) {
    return "يرجى إدخال اسم المولد";
  }

  if (fieldName === "location" && !values.location.trim()) {
    return "يرجى إدخال موقع المولد";
  }

  if (fieldName === "capacityKva") {
    const capacity = Number(values.capacityKva);

    if (!values.capacityKva || !Number.isFinite(capacity) || capacity <= 0) {
      return "يرجى إدخال قدرة صحيحة للمولد";
    }
  }

  if (fieldName === "amperePrice") {
    const amperePrice = Number(values.amperePrice);

    if (
      values.amperePrice === "" ||
      !Number.isFinite(amperePrice) ||
      amperePrice < 0
    ) {
      return "يرجى إدخال سعر أمبير صحيح";
    }
  }

  if (
    fieldName === "maintenanceStatus" &&
    !maintenanceStatusByValue[values.maintenanceStatus]
  ) {
    return "يرجى اختيار حالة الصيانة";
  }

  return "";
}

function validateForm(values) {
  return formFieldNames.reduce((nextErrors, fieldName) => {
    const fieldError = validateField(fieldName, values);

    if (fieldError) {
      nextErrors[fieldName] = fieldError;
    }

    return nextErrors;
  }, {});
}

function EditGeneratorModal({ generator, isOpen, onClose, onSave }) {
  const nameInputRef = useRef(null);
  const [formData, setFormData] = useState(() => buildFormData(generator));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = useCallback(() => {
    if (isSaving) return;

    onClose();
  }, [isSaving, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, isOpen]);

  if (!isOpen || !generator) return null;

  function updateFieldError(fieldName, nextFormData) {
    setErrors((currentErrors) => {
      if (!currentErrors[fieldName]) return currentErrors;

      const fieldError = validateField(fieldName, nextFormData);

      if (fieldError) {
        return {
          ...currentErrors,
          [fieldName]: fieldError,
        };
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  }

  function handleInputChange(event) {
    const { name } = event.target;
    let { value } = event.target;

    if (name === "capacityKva" || name === "amperePrice") {
      value = sanitizeNumberInput(value);
    }

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    setSaveError("");
    updateFieldError(name, nextFormData);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving) return;

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
    setSaveError("");

    if (Object.keys(nextErrors).length) return;

    const selectedStatus =
      maintenanceStatusByValue[formData.maintenanceStatus] ||
      maintenanceStatusByValue.operational;
    const updatedAt = new Date().toISOString();
    const updatedGenerator = {
      ...generator,
      name: formData.name.trim(),
      location: formData.location.trim(),
      locationName: formData.location.trim(),
      capacityKva: Number(formData.capacityKva),
      amperePrice: Number(formData.amperePrice),
      pricePerAmpere: Number(formData.amperePrice),
      defaultAmperePrice: Number(formData.amperePrice),
      maintenanceStatus: formData.maintenanceStatus,
      status: selectedStatus.status,
      statusLabel: selectedStatus.label,
      statusTone: selectedStatus.tone,
      updatedAt,
    };

    try {
      setIsSaving(true);
      await onSave(updatedGenerator);
      onClose();
    } catch (error) {
      setSaveError(
        error?.message || "تعذر حفظ تعديلات المولد، يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  return (
    <div
      className="edit-generator-modal-backdrop"
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className="edit-generator-modal"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-generator-modal-title"
      >
        <button
          type="button"
          className="edit-generator-modal__close"
          aria-label="إغلاق نافذة تعديل بيانات المولد"
          disabled={isSaving}
          onClick={handleClose}
        >
          <FiX aria-hidden="true" />
        </button>

        <h2
          className="edit-generator-modal__title"
          id="edit-generator-modal-title"
        >
          تعديل بيانات المولد
        </h2>

        <form className="edit-generator-modal__form" onSubmit={handleSubmit} noValidate>
          <label className="edit-generator-modal__field" htmlFor="edit-generator-name">
            <span>اسم المولد</span>
            <input
              id="edit-generator-name"
              name="name"
              ref={nameInputRef}
              type="text"
              value={formData.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "edit-generator-name-error" : undefined}
              onChange={handleInputChange}
            />
            {errors.name ? (
              <span
                className="edit-generator-modal__error"
                id="edit-generator-name-error"
                role="alert"
              >
                {errors.name}
              </span>
            ) : null}
          </label>

          <label className="edit-generator-modal__field" htmlFor="edit-generator-location">
            <span>الموقع</span>
            <input
              id="edit-generator-location"
              name="location"
              type="text"
              value={formData.location}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={
                errors.location ? "edit-generator-location-error" : undefined
              }
              onChange={handleInputChange}
            />
            {errors.location ? (
              <span
                className="edit-generator-modal__error"
                id="edit-generator-location-error"
                role="alert"
              >
                {errors.location}
              </span>
            ) : null}
          </label>

          <div className="edit-generator-modal__field-row">
            <label
              className="edit-generator-modal__field"
              htmlFor="edit-generator-capacity"
            >
              <span>القدرة (KVA)</span>
              <input
                id="edit-generator-capacity"
                name="capacityKva"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={formData.capacityKva}
                aria-invalid={Boolean(errors.capacityKva)}
                aria-describedby={
                  errors.capacityKva
                    ? "edit-generator-capacity-error"
                    : undefined
                }
                onChange={handleInputChange}
              />
              {errors.capacityKva ? (
                <span
                  className="edit-generator-modal__error"
                  id="edit-generator-capacity-error"
                  role="alert"
                >
                  {errors.capacityKva}
                </span>
              ) : null}
            </label>

            <label
              className="edit-generator-modal__field"
              htmlFor="edit-generator-ampere-price"
            >
              <span>سعر الأمبير</span>
              <input
                id="edit-generator-ampere-price"
                name="amperePrice"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={formData.amperePrice}
                aria-invalid={Boolean(errors.amperePrice)}
                aria-describedby={
                  errors.amperePrice
                    ? "edit-generator-ampere-price-error"
                    : undefined
                }
                onChange={handleInputChange}
              />
              {errors.amperePrice ? (
                <span
                  className="edit-generator-modal__error"
                  id="edit-generator-ampere-price-error"
                  role="alert"
                >
                  {errors.amperePrice}
                </span>
              ) : null}
            </label>
          </div>

          <label
            className="edit-generator-modal__field"
            htmlFor="edit-generator-maintenance-status"
          >
            <span>حالة الصيانة</span>
            <span className="edit-generator-modal__select">
              <select
                id="edit-generator-maintenance-status"
                name="maintenanceStatus"
                value={formData.maintenanceStatus}
                aria-invalid={Boolean(errors.maintenanceStatus)}
                aria-describedby={
                  errors.maintenanceStatus
                    ? "edit-generator-maintenance-status-error"
                    : undefined
                }
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  اختر حالة الصيانة
                </option>
                {maintenanceStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown aria-hidden="true" />
            </span>
            {errors.maintenanceStatus ? (
              <span
                className="edit-generator-modal__error"
                id="edit-generator-maintenance-status-error"
                role="alert"
              >
                {errors.maintenanceStatus}
              </span>
            ) : null}
          </label>

          {saveError ? (
            <p className="edit-generator-modal__save-error" role="alert">
              {saveError}
            </p>
          ) : null}

          <button
            type="submit"
            className="edit-generator-modal__save"
            disabled={isSaving}
          >
            {isSaving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default EditGeneratorModal;
