const STATUS_PROGRESS = {
  active: 100,
  inactive: 34,
  maintenance: 64,
};

function GeneratorPricingCard({
  currencyLabel,
  error,
  isTouched,
  onBlur,
  onChange,
  statusMeta,
  value,
}) {
  const fieldError = isTouched && error;
  const progress = STATUS_PROGRESS[statusMeta.value] || 0;

  return (
    <aside className="add-generator-pricing">
      <h3>التسعير</h3>

      <label htmlFor="defaultAmperePrice">
        <span>سعر الأمبير الافتراضي</span>
        <div className="add-generator-pricing__input">
          <input
            id="defaultAmperePrice"
            name="defaultAmperePrice"
            type="text"
            inputMode="decimal"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            placeholder="0.00"
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? "defaultAmperePrice-error" : undefined}
          />
          <bdi>{currencyLabel}</bdi>
        </div>
      </label>

      {fieldError && (
        <p className="add-generator-field-error add-generator-field-error--light" id="defaultAmperePrice-error" role="alert">
          {fieldError}
        </p>
      )}

      <p className="add-generator-pricing__hint">
        هذا السعر سيتم تطبيقه تلقائياً على المشتركين الجدد.
      </p>

      <section className="add-generator-operational-status">
        <div>
          <span>الحالة التشغيلية</span>
          <strong className={`add-generator-status-badge add-generator-status-badge--${statusMeta.value}`}>
            {statusMeta.label}
          </strong>
        </div>
        <span className="add-generator-status-track">
          <i
            className={`add-generator-status-track__bar add-generator-status-track__bar--${statusMeta.value}`}
            style={{ width: `${progress}%` }}
          />
        </span>
      </section>
    </aside>
  );
}

export default GeneratorPricingCard;
