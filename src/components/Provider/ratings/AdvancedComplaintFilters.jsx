import { useState } from "react";
import { FiX } from "react-icons/fi";

import {
  complaintPriorityOptions,
  complaintStatusOptions,
} from "../../../services/providerComplaintService";

function AdvancedComplaintFilters({
  filters,
  isOpen,
  onApply,
  onClose,
  onReset,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  if (!isOpen) return null;

  function updateField(field, value) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function handleApply(event) {
    event.preventDefault();
    onApply(draftFilters);
    onClose();
  }

  function handleReset() {
    const resetFilters = {
      status: "all",
      priority: "all",
      dateFrom: "",
      dateTo: "",
      customerName: "",
      subscriberNumber: "",
      ticketNumber: "",
    };

    setDraftFilters(resetFilters);
    onReset();
  }

  return (
    <div className="complaint-modal-backdrop" role="presentation">
      <section
        className="complaint-modal complaint-modal--filters"
        role="dialog"
        aria-modal="true"
        aria-labelledby="advanced-filters-title"
      >
        <button
          type="button"
          className="complaint-modal__close"
          onClick={onClose}
          aria-label="إغلاق"
        >
          <FiX aria-hidden="true" />
        </button>

        <header className="complaint-modal__header">
          <span>فلترة</span>
          <h2 id="advanced-filters-title">تصفية متقدمة</h2>
          <p>حدد حقول البحث المطلوبة لتضييق قائمة الشكاوى.</p>
        </header>

        <form className="advanced-complaint-filters" onSubmit={handleApply}>
          <label>
            الحالة
            <select
              value={draftFilters.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {complaintStatusOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            الأولوية
            <select
              value={draftFilters.priority}
              onChange={(event) => updateField("priority", event.target.value)}
            >
              {complaintPriorityOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            من تاريخ
            <input
              type="date"
              value={draftFilters.dateFrom}
              onChange={(event) => updateField("dateFrom", event.target.value)}
            />
          </label>

          <label>
            إلى تاريخ
            <input
              type="date"
              value={draftFilters.dateTo}
              onChange={(event) => updateField("dateTo", event.target.value)}
            />
          </label>

          <label>
            اسم المشترك
            <input
              type="text"
              value={draftFilters.customerName}
              onChange={(event) => updateField("customerName", event.target.value)}
              placeholder="مثال: أحمد"
            />
          </label>

          <label>
            رقم المشترك
            <input
              type="text"
              value={draftFilters.subscriberNumber}
              onChange={(event) =>
                updateField("subscriberNumber", event.target.value)
              }
              placeholder="100455"
            />
          </label>

          <label>
            رقم التذكرة
            <input
              type="text"
              value={draftFilters.ticketNumber}
              onChange={(event) => updateField("ticketNumber", event.target.value)}
              placeholder="#TK-8821"
            />
          </label>

          <div className="complaint-modal__actions advanced-complaint-filters__actions">
            <button type="submit">تطبيق الفلاتر</button>
            <button type="button" className="complaint-modal__secondary" onClick={handleReset}>
              إعادة تعيين
            </button>
            <button type="button" className="complaint-modal__secondary" onClick={onClose}>
              إلغاء
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdvancedComplaintFilters;
