import { FiSearch } from "react-icons/fi";

import { CAPACITY_FILTERS, STATUS_FILTERS } from "./capacityUtils";

function CapacityFilters({
  capacityFilter,
  onCapacityFilterChange,
  onSearchChange,
  onStatusFilterChange,
  searchQuery,
  statusFilter,
}) {
  return (
    <section className="capacity-filters" aria-label="فلاتر سعة الاستهلاك">
      <label className="capacity-filters__search" htmlFor="capacity-search">
        <FiSearch aria-hidden="true" />
        <span className="capacity-visually-hidden">البحث</span>
        <input
          id="capacity-search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="البحث باسم المولد أو المنطقة..."
          type="search"
          value={searchQuery}
        />
      </label>

      <label className="capacity-filters__select" htmlFor="capacity-status-filter">
        <span className="capacity-visually-hidden">تصفية الحالة</span>
        <select
          id="capacity-status-filter"
          onChange={(event) => onStatusFilterChange(event.target.value)}
          value={statusFilter}
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="capacity-filters__select" htmlFor="capacity-percentage-filter">
        <span className="capacity-visually-hidden">تصفية نسبة الاستهلاك</span>
        <select
          id="capacity-percentage-filter"
          onChange={(event) => onCapacityFilterChange(event.target.value)}
          value={capacityFilter}
        >
          {CAPACITY_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

export default CapacityFilters;
