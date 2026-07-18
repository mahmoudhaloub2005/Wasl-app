import { FiChevronDown, FiMapPin, FiZap } from "react-icons/fi";

function FieldError({ id, message }) {
  if (!message) return null;

  return (
    <p className="add-generator-field-error" id={id} role="alert">
      {message}
    </p>
  );
}

function GeneratorBasicInfoForm({
  errors,
  onBlur,
  onChange,
  statusOptions,
  touched,
  values,
}) {
  const generatorNameError = touched.generatorName && errors.generatorName;
  const capacityError = touched.capacityKva && errors.capacityKva;
  const statusError = touched.status && errors.status;
  const locationError = touched.locationName && errors.locationName;

  return (
    <section className="add-generator-card add-generator-basic">
      <header className="add-generator-card__header">
        <FiZap aria-hidden="true" />
        <h3>المعلومات الأساسية</h3>
      </header>

      <div className="add-generator-basic__grid">
        <label className="add-generator-field" htmlFor="generatorName">
          <span>اسم المولد</span>
          <input
            id="generatorName"
            name="generatorName"
            type="text"
            value={values.generatorName}
            maxLength={100}
            onBlur={onBlur}
            onChange={onChange}
            placeholder="مثال: مولد حي المنصور 01"
            aria-invalid={Boolean(generatorNameError)}
            aria-describedby={generatorNameError ? "generatorName-error" : undefined}
          />
          <FieldError id="generatorName-error" message={generatorNameError} />
        </label>

        <label className="add-generator-field" htmlFor="capacityKva">
          <span>القدرة الكلية (KVA)</span>
          <div className="add-generator-input-unit">
            <input
              id="capacityKva"
              name="capacityKva"
              type="text"
              inputMode="decimal"
              value={values.capacityKva}
              onBlur={onBlur}
              onChange={onChange}
              placeholder="0.00"
              aria-invalid={Boolean(capacityError)}
              aria-describedby={capacityError ? "capacityKva-error" : undefined}
            />
            <bdi>KVA</bdi>
          </div>
          <FieldError id="capacityKva-error" message={capacityError} />
        </label>

        <label className="add-generator-field add-generator-field--wide" htmlFor="status">
          <span>الحالة</span>
          <div className="add-generator-select">
            <select
              id="status"
              name="status"
              value={values.status}
              onBlur={onBlur}
              onChange={onChange}
              aria-invalid={Boolean(statusError)}
              aria-describedby={statusError ? "status-error" : undefined}
            >
              {statusOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown aria-hidden="true" />
          </div>
          <FieldError id="status-error" message={statusError} />
        </label>

        <label
          className="add-generator-field add-generator-field--wide"
          htmlFor="locationName"
        >
          <span>الموقع الجغرافي / الحي</span>
          <div className="add-generator-input-icon">
            <input
              id="locationName"
              name="locationName"
              type="text"
              value={values.locationName}
              onBlur={onBlur}
              onChange={onChange}
              placeholder="حدد اسم الحي أو المنطقة السكنية"
              aria-invalid={Boolean(locationError)}
              aria-describedby={locationError ? "locationName-error" : undefined}
            />
            <FiMapPin aria-hidden="true" />
          </div>
          <FieldError id="locationName-error" message={locationError} />
        </label>
      </div>
    </section>
  );
}

export default GeneratorBasicInfoForm;
