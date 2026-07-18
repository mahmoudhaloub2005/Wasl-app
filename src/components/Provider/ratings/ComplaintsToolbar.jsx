import { FiDownload, FiFilter, FiSearch } from "react-icons/fi";

function ComplaintsToolbar({
  hasActiveAdvancedFilters,
  onExport,
  onOpenAdvancedFilters,
  onSearchChange,
  searchTerm,
}) {
  return (
    <section className="complaints-toolbar" aria-label="البحث وإجراءات الشكاوى">
      <div className="complaints-toolbar__actions">
        <button
          type="button"
          className="complaints-toolbar__button complaints-toolbar__button--primary"
          onClick={onOpenAdvancedFilters}
        >
          <FiFilter aria-hidden="true" />
          تصفية متقدمة
          {hasActiveAdvancedFilters && <span aria-label="فلاتر مفعلة" />}
        </button>

        <button
          type="button"
          className="complaints-toolbar__button complaints-toolbar__button--secondary"
          onClick={onExport}
        >
          <FiDownload aria-hidden="true" />
          تصدير التقارير
        </button>
      </div>

      <label className="complaints-search">
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="البحث برقم التذكرة، اسم المشترك، أو الموضوع..."
        />
      </label>
    </section>
  );
}

export default ComplaintsToolbar;
