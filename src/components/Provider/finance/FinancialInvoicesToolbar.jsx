import { FiFilter, FiSearch } from "react-icons/fi";

const invoiceStatusFilters = [
  { id: "all", label: "الكل" },
  { id: "paid", label: "المدفوعة" },
  { id: "pending", label: "قيد الانتظار" },
  { id: "overdue", label: "المتأخرة" },
  { id: "draft", label: "مسودة" },
];

function FinancialInvoicesToolbar({
  isAdvancedFilterOpen,
  onAdvancedFilterToggle,
  onSearchChange,
  onStatusChange,
  searchQuery,
  selectedStatus,
}) {
  return (
    <section className="financial-invoices-toolbar" aria-label="أدوات الفواتير">
      <label className="financial-invoices-toolbar__search">
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="البحث برقم الفاتورة أو اسم العميل..."
        />
      </label>

      <div className="financial-invoices-toolbar__filters" role="tablist">
        {invoiceStatusFilters.map((filter) => (
          <button
            type="button"
            className={
              selectedStatus === filter.id
                ? "financial-invoices-toolbar__filter active"
                : "financial-invoices-toolbar__filter"
            }
            key={filter.id}
            onClick={() => onStatusChange(filter.id)}
            role="tab"
            aria-selected={selectedStatus === filter.id}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="financial-invoices-toolbar__advanced"
        aria-expanded={isAdvancedFilterOpen}
        onClick={onAdvancedFilterToggle}
      >
        <FiFilter aria-hidden="true" />
        تصفية متقدمة
      </button>
    </section>
  );
}

export default FinancialInvoicesToolbar;