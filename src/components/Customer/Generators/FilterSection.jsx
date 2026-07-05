import { FiMapPin, FiZap } from "react-icons/fi";
import "./FilterSection.css";

function FilterSection({
  generatorName,
  setGeneratorName,
  area,
  setArea,
  priceRange,
  setPriceRange,
  selectedStatus,
  setSelectedStatus,
}) {
  return (
    <section className="customer-filter-section">
      <div className="customer-filter-field">
        <label>اسم المولد</label>

        <div className="customer-filter-input">
          <FiZap className="customer-filter-icon" />

          <input
            type="text"
            placeholder="مثلاً: مولد النور..."
            value={generatorName}
            onChange={(event) => setGeneratorName(event.target.value)}
          />
        </div>
      </div>

      <div className="customer-filter-field">
        <label>المنطقة</label>

        <div className="customer-filter-input">
          <FiMapPin className="customer-filter-icon" />

          <input
            type="text"
            placeholder="اختر المنطقة..."
            value={area}
            onChange={(event) => setArea(event.target.value)}
          />
        </div>
      </div>

      <div className="customer-filter-field">
        <label>نطاق السعر</label>

        <select
          className="customer-price-select"
          value={priceRange}
          onChange={(event) => setPriceRange(event.target.value)}
        >
          <option value="all">جميع الأسعار</option>
          <option value="low">أقل من 20,000</option>
          <option value="high">أكثر من 20,000</option>
        </select>
      </div>

      <div className="customer-filter-field">
        <label>حالة التشغيل</label>

        <div className="customer-status-buttons">
          <button
            type="button"
            className={selectedStatus === "all" ? "active" : ""}
            onClick={() => setSelectedStatus("all")}
          >
            الكل
          </button>

          <button
            type="button"
            className={selectedStatus === "working" ? "active" : ""}
            onClick={() => setSelectedStatus("working")}
          >
            يعمل
          </button>

          <button
            type="button"
            className={selectedStatus === "maintenance" ? "active" : ""}
            onClick={() => setSelectedStatus("maintenance")}
          >
            صيانة
          </button>
        </div>
      </div>

      <button type="button" className="customer-apply-filter-button">
        تطبيق الفلتر
      </button>
    </section>
  );
}

export default FilterSection;