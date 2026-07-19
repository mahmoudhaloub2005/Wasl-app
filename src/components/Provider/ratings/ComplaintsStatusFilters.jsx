import { complaintStatusOptions } from "./providerComplaintsUi";

function ComplaintsStatusFilters({ activeFilter, counts, onChange }) {
  return (
    <div className="complaints-status-filters" aria-label="فلترة حالة الشكاوى">
      {complaintStatusOptions.map((option) => (
        <button
          type="button"
          className={activeFilter === option.value ? "is-active" : ""}
          key={option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.value !== "all" && <span>({counts[option.value] || 0})</span>}
        </button>
      ))}
    </div>
  );
}

export default ComplaintsStatusFilters;
