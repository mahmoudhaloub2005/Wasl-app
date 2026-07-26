import { FiActivity } from "react-icons/fi";

function CapacityEmptyState({ isFiltered = false }) {
  return (
    <section className="capacity-empty" aria-live="polite">
      <FiActivity aria-hidden="true" />
      <h2>{isFiltered ? "لا توجد نتائج مطابقة" : "لا توجد بيانات سعة متاحة حالياً"}</h2>
      <p>
        {isFiltered
          ? "جرّب تعديل البحث أو الفلاتر الحالية."
          : "ستظهر هنا بيانات استهلاك المشتركين بعد توفر المولدات والاشتراكات النشطة."}
      </p>
    </section>
  );
}

export default CapacityEmptyState;
