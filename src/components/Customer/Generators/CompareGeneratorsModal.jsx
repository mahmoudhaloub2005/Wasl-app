import { useState } from "react";
import { IoCloseOutline, IoInformationCircleOutline } from "react-icons/io5";

function CompareGeneratorsModal({
  generators = [],
  initialSelectedIds = [],
  onClose,
  onStartCompare,
}) {
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds.slice(0, 2));

  const selectedCount = selectedIds.length;
  const canStartCompare = selectedCount === 2;

  const toggleGenerator = (id) => {
    setSelectedIds((currentIds) => {
      if (currentIds.some((currentId) => String(currentId) === String(id))) {
        return currentIds.filter((currentId) => String(currentId) !== String(id));
      }

      if (currentIds.length >= 2) {
        return currentIds;
      }

      return [...currentIds, id];
    });
  };

  return (
    <div className="compare-generators-backdrop" role="presentation">
      <section
        className="compare-generators-modal"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-generators-title"
      >
        <header className="compare-generators-header">
          <div>
            <h2 id="compare-generators-title">اختر المولدات للمقارنة</h2>
            <p>قارن بين أفضل مزودي الطاقة في منطقتك لتجد الخيار الأنسب لك.</p>
          </div>

          <button
            className="compare-generators-close"
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <IoCloseOutline />
          </button>
        </header>

        <div className="compare-generators-list">
          {generators.length === 0 ? (
            <div className="compare-loading">لا توجد بيانات حالياً</div>
          ) : (
            generators.map((generator) => {
              const isSelected = selectedIds.some(
                (selectedId) => String(selectedId) === String(generator.id)
              );

              return (
                <button
                  className={`compare-generator-row ${
                    isSelected ? "selected" : ""
                  }`}
                  type="button"
                  key={generator.id}
                  onClick={() => toggleGenerator(generator.id)}
                >
                  <span
                    className={`compare-checkbox ${
                      isSelected ? "checked" : ""
                    }`}
                    aria-hidden="true"
                  />

                  <img src={generator.image} alt={generator.name} />

                  <span className="compare-generator-info">
                    <strong>{generator.name}</strong>
                    <em>{generator.location}</em>
                    <b>{generator.priceText}</b>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <footer className="compare-generators-footer">
          <div className="compare-selection-note">
            <IoInformationCircleOutline />
            <span>تم اختيار {selectedCount} من 2</span>
          </div>

          <div className="compare-footer-actions">
            <button type="button" className="compare-cancel" onClick={onClose}>
              إلغاء
            </button>

            <button
              type="button"
              className="compare-start"
              disabled={!canStartCompare}
              onClick={() => onStartCompare?.(selectedIds)}
            >
              بدء المقارنة
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default CompareGeneratorsModal;
