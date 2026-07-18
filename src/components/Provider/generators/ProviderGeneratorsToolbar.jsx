import { FiFilter, FiList } from "react-icons/fi";

function getNextStatusFilter(currentFilter) {
  if (currentFilter === "all") return "active";
  if (currentFilter === "active") return "maintenance";
  return "all";
}

function ProviderGeneratorsToolbar({
  setSortMode,
  setStatusFilter,
  sortMode,
  statusFilter,
}) {
  return (
    <div className="provider-generators-toolbar" aria-label="أدوات عرض المولدات">
      <button
        type="button"
        aria-pressed={sortMode === "usage"}
        title="ترتيب حسب الاستهلاك"
        onClick={() =>
          setSortMode((currentMode) =>
            currentMode === "recent" ? "usage" : "recent"
          )
        }
      >
        <FiList aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-pressed={statusFilter !== "all"}
        title="تصفية حسب الحالة"
        onClick={() =>
          setStatusFilter((currentFilter) =>
            getNextStatusFilter(currentFilter)
          )
        }
      >
        <FiFilter aria-hidden="true" />
      </button>
    </div>
  );
}

export default ProviderGeneratorsToolbar;
