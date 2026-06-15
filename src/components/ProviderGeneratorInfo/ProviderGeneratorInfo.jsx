import { FiMapPin, FiInfo, FiArrowLeft, FiChevronDown, FiCheck } from "react-icons/fi";
import "./ProviderGeneratorInfo.css";

function ProviderGeneratorInfo() {
  return (
    <section className="generator-page2">

      {/* خطوات التسجيل */}
      <div className="steps-wrapper2">
        <div className="step-item2">
          <div className="step-circle2 done">
            <FiCheck />
          </div>
          <p>المعلومات الشخصية</p>
        </div>

        <div className="step-line2"></div>

        <div className="step-item2 active">
          <div className="step-circle2 active">2</div>
          <p>بيانات المولد</p>
        </div>

        <div className="step-line2"></div>

        <div className="step-item2">
          <div className="step-circle2">3</div>
          <p>تأكيد الحساب</p>
        </div>
      </div>

      <div className="generator-card2">

        {/* عنوان داخل الكارد */}
        <div className="card-title2">
          <h3>تسجيل بيانات المولد الكهربائي</h3>
          <p>
            يرجى تقديم المواصفات الفنية لمولدك لضمان دقة النظام في توزيع الطاقة.
          </p>
        </div>

        <div className="form-row2">
          <div className="form-group2">
            <label>نوع المولد</label>
            <div className="select-box2">
              <FiChevronDown />
              <select>
                <option>اختر النوع</option>
                <option>ديزل</option>
                <option>بنزين</option>
                <option>غاز</option>
              </select>
            </div>
          </div>

          <div className="form-group2">
            <label>قدرة التوليد (KVA)</label>
            <div className="input-with-unit2">
              <input type="text" placeholder="مثال : 500" />
              <span>KVA</span>
            </div>
          </div>
        </div>

        <div className="form-row2">
          <div className="form-group2">
            <label>الموقع / الحي</label>
            <div className="input-icon2">
              <FiMapPin />
              <input type="text" placeholder="اسم المنطقة أو الحي" />
            </div>
          </div>

          <div className="form-group2">
            <label>ساعات التشغيل</label>

            <div className="time-row2">
              <div>
                <input type="time" />
                <small>من</small>
              </div>

              <div>
                <input type="time" />
                <small>إلى</small>
              </div>
            </div>
          </div>
        </div>

        <div className="info-box2">
          <div className="info-icon2">
            <FiInfo />
          </div>

          <div>
            <h4>تأكد من مطابقة المواصفات</h4>
            <p>
              يتم التحقق من قدرة المولد آليًا من خلال عدادات VoltStream الذكية عند التركيب.
            </p>
          </div>
        </div>

        <div className="buttons-row2">
          <button className="back-btn2">رجوع</button>

          <button className="next-btn2">
            متابعة للخطوة الأخيرة
            <FiArrowLeft />
          </button>
        </div>

      </div>
    </section>
  );
}

export default ProviderGeneratorInfo;