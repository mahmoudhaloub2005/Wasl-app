import { FiEdit3 } from "react-icons/fi";

const NOTES_LIMIT = 500;

function GeneratorNotesCard({ error, isTouched, onBlur, onChange, value }) {
  const fieldError = isTouched && error;

  return (
    <section className="add-generator-card add-generator-notes">
      <header className="add-generator-card__header">
        <FiEdit3 aria-hidden="true" />
        <h3>ملاحظات إضافية</h3>
      </header>

      <label className="add-generator-field" htmlFor="notes">
        <span className="add-generator-sr-only">ملاحظات إضافية</span>
        <textarea
          id="notes"
          name="notes"
          value={value}
          maxLength={NOTES_LIMIT}
          onBlur={onBlur}
          onChange={onChange}
          placeholder="اكتب أي تفاصيل أخرى حول ساعات التشغيل أو الصيانة الدورية..."
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "notes-error notes-counter" : "notes-counter"}
        />
      </label>

      <div className="add-generator-notes__footer">
        {fieldError ? (
          <p className="add-generator-field-error" id="notes-error" role="alert">
            {fieldError}
          </p>
        ) : (
          <span />
        )}
        <bdi id="notes-counter">
          {value.length} / {NOTES_LIMIT}
        </bdi>
      </div>
    </section>
  );
}

export default GeneratorNotesCard;
