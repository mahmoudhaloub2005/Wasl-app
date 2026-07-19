import { FiSearch } from "react-icons/fi";

const NOTIFICATION_TABS = [
  { id: "all", label: "الكل" },
  { id: "unread", label: "غير المقروءة" },
  { id: "read", label: "مقروءة" },
];

const NOTIFICATION_TYPES = [
  { id: "all", label: "الكل" },
  { id: "invoice", label: "الفواتير" },
  { id: "payment", label: "المدفوعات" },
  { id: "subscriber", label: "المشتركين" },
  { id: "complaint", label: "الشكاوى" },
  { id: "generator", label: "المولدات" },
  { id: "system", label: "النظام" },
];

function NotificationsFilters({
  activeTab,
  onSearchChange,
  onTabChange,
  onTypeChange,
  searchTerm,
  typeFilter,
}) {
  return (
    <section className="provider-notifications-controls">
      <div
        className="provider-notifications-tabs"
        role="tablist"
        aria-label="حالة الإشعارات"
      >
        {NOTIFICATION_TABS.map((tab) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "is-active" : ""}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="provider-notifications-toolbar">
        <label className="provider-notifications-search">
          <span>
            <FiSearch aria-hidden="true" />
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="البحث في الإشعارات..."
            aria-label="البحث في الإشعارات"
          />
        </label>

        <select
          className="provider-notifications-type-filter"
          value={typeFilter}
          onChange={(event) => onTypeChange(event.target.value)}
          aria-label="تصفية نوع الإشعار"
        >
          {NOTIFICATION_TYPES.map((type) => (
            <option value={type.id} key={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default NotificationsFilters;
