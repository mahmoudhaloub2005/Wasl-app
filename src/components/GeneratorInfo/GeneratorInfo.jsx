import "./GeneratorInfo.css";

function GeneratorInfo() {
    return (
        <section className="generator-card">

            <h3>مولد النور الرئيسي</h3>

            <div className="generator-status">
                الحالة: <span>نشط</span>
            </div>

            <div className="generator-details">

                <div>
                    <p>السعر المعتمد</p>
                    <span>25 شيكل / أمبير</span>
                </div>

                <div>
                    <p>المنطقة</p>
                    <span>الرمال</span>
                </div>

                <div>
                    <p>القدرة المشتركة</p>
                    <span>5 أمبير</span>
                </div>

                <div>
                    <p>الاستهلاك الحالي</p>
                    <span>3.2A</span>
                </div>

            </div>

            <div className="generator-actions">
                <button>عرض التفاصيل</button>
                <button className="secondary">تعديل الاشتراك</button>
            </div>

        </section>
    );
}

export default GeneratorInfo;