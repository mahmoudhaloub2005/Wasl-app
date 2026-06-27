

import "./FilterSection.css";

function FilterSection() {
    return (
        <section className="filter-section">

            <div className="filter-box">

                <div className="filter-item">

                    <label>اسم المولد</label>

                    <input
                        type="text"
                        placeholder=" مولد النور "
                    />

                </div>

                <div className="filter-item">

                    <label>المنطقة</label>

                    <select>

                        <option>اختر المنطقة...</option>

                        <option>دير البلح</option>

                        <option>غزة</option>

                        <option>خانيونس</option>

                        <option>نصيرات</option>
                        <option>رفح</option>
                        <option>جباليا</option>

                        <option>بشمال غزة</option>



                    </select>

                </div>

                <div className="filter-item">

                    <label>نطاق السعر</label>

                    <select>

                        <option>جميع الأسعار</option>

                        <option>أقل من 15 شيكل</option>

                        <option>15 - 25 شيكل</option>

                        <option>أكثر من 25 شيكل</option>

                    </select>

                </div>

                <div className="filter-item">

                    <label>حالة التشغيل</label>

                    <div className="status-buttons">

                        <button className="active-status">
                            الكل
                        </button>

                        <button>
                            يعمل
                        </button>

                        <button>
                            صيانة
                        </button>

                    </div>

                </div>

                <button className="filter-btn">

                    تطبيق الفلاتر

                </button>

            </div>

        </section>
    );
}

export default FilterSection;
