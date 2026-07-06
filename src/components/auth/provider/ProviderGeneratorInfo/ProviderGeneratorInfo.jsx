import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiInfo,
  FiArrowLeft,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import "./ProviderGeneratorInfo.css";

function ProviderGeneratorInfo() {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const providerData = locationState.providerData || null;
  const savedGeneratorData = locationState.generatorData || {};

  const [formData, setFormData] = useState({
    generatorType: savedGeneratorData.generatorType || "",
    capacity: savedGeneratorData.capacity || "",
    location: savedGeneratorData.location || "",
    price: savedGeneratorData.price || "",
    startTime: savedGeneratorData.startTime || "",
    endTime: savedGeneratorData.endTime || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
  };

  const handleBack = () => {
    navigate("/provider-register", {
      state: {
        providerData,
      },
    });
  };

  const handleSubmit = () => {
    if (
      !providerData ||
      !formData.generatorType ||
      !formData.capacity ||
      !formData.location ||
      !formData.price ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setMessage("يرجى تعبئة جميع بيانات المولد قبل المتابعة");
      return;
    }

    console.log("بيانات المولد:", formData);

    setMessage("");

    navigate("/provider-documents", {
      state: {
        providerData,
        generatorData: formData,
      },
    });
  };

  return (
    <section className="generator-page2">
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

              <select
                name="generatorType"
                value={formData.generatorType}
                onChange={handleChange}
              >
                <option value="">اختر النوع</option>
                <option value="ديزل">ديزل</option>
                <option value="بنزين">بنزين</option>
                <option value="غاز">غاز</option>
              </select>
            </div>
          </div>

          <div className="form-group2">
            <label>قدرة التوليد (KVA)</label>

            <div className="input-with-unit2">
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="مثال : 500"
              />

              <span>KVA</span>
            </div>
          </div>
        </div>

        <div className="form-row2">
          <div className="form-group2">
            <label>سعر الكيلو</label>

            <div className="input-with-unit2">
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="مثال : 5.5"
              />

              <span>₪</span>
            </div>
          </div>
        </div>

        <div className="form-row2">
          <div className="form-group2">
            <label>الموقع / الحي</label>

            <div className="input-icon2">
              <FiMapPin />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="اسم المنطقة أو الحي"
              />
            </div>
          </div>

          <div className="form-group2">
            <label>ساعات التشغيل</label>

            <div className="time-row2">
              <div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
                <small>من</small>
              </div>

              <div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
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
              يتم التحقق من قدرة المولد آليًا من خلال عدادات VoltStream الذكية
              عند التركيب.
            </p>
          </div>
        </div>

        {message && <p className="generator-message2">{message}</p>}

        <div className="buttons-row2">
          <button className="back-btn2" type="button" onClick={handleBack}>
            رجوع
          </button>

          <button className="next-btn2" type="button" onClick={handleSubmit}>
            متابعة للخطوة الأخيرة
            <FiArrowLeft />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProviderGeneratorInfo;
