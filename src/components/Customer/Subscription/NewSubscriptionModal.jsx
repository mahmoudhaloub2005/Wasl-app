import { useMemo, useState } from "react";
import {
  IoCalendarOutline,
  IoClose,
  IoHelpCircleOutline,
  IoBulbOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";

const ampereOptions = {
  3: {
    base: 45,
    text: "مناسب للإنارة، التلفاز والمراوح فقط",
    hint: "خيار اقتصادي للاستخدام الخفيف داخل المنزل.",
  },
  5: {
    base: 60,
    text: "كاف لتشغيل مكيف هواء واحد مع إضاءة أساسية",
    hint: "مثالي للشقق المتوسطة (تغطية 40% من الحمل المنزلي)",
  },
  10: {
    base: 115,
    text: "مناسب لتشغيل أكثر من جهاز منزلي",
    hint: "يعطي مرونة أعلى للعائلات متوسطة الاستهلاك.",
  },
  15: {
    base: 170,
    text: "مناسب للمنازل الكبيرة والاستخدام المكثف",
    hint: "اختيار قوي لتشغيل عدة أجهزة في نفس الوقت.",
  },
};

const paymentPlans = [
  {
    id: "monthly",
    title: "شهرياً",
    description: "سداد الفاتورة في نهاية كل شهر ميلادي",
  },
  {
    id: "biweekly",
    title: "كل أسبوعين",
    description: "تقسيم المبلغ على دفعتين خلال الشهر",
  },
];

function NewSubscriptionModal({ generator, onClose, onConfirm }) {
  const [ampere, setAmpere] = useState(5);
  const [paymentPlan, setPaymentPlan] = useState("monthly");

  const fees = useMemo(() => {
    const base = ampereOptions[ampere].base;
    const maintenance = 5;
    const deposit = 15;

    return {
      base,
      maintenance,
      deposit,
      total: base + maintenance + deposit,
    };
  }, [ampere]);

  const currentAmpere = ampereOptions[ampere];

  const handleConfirm = () => {
    onConfirm?.({
      generatorId: generator?.id || null,
      ampere,
      paymentPlan,
      monthlyCost: fees.base + fees.maintenance,
      dueNow: 0,
    });
  };

  return (
    <div className="new-subscription-backdrop" role="presentation">
      <section
        className="new-subscription-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-subscription-title"
        dir="rtl"
      >
        <aside className="new-subscription-summary">
          <h3>ملخص الاشتراك</h3>

          <dl className="new-summary-list">
            <div>
              <dt>الاشتراك الأساسي ({ampere} أمبير)</dt>
              <dd>{fees.base} شيكل</dd>
            </div>
            <div>
              <dt>أجور الصيانة والمتابعة</dt>
              <dd>{fees.maintenance} شيكل</dd>
            </div>
            <div>
              <dt>
                تأمين مسترد
                <IoHelpCircleOutline aria-hidden="true" />
              </dt>
              <dd>{fees.deposit} شيكل</dd>
            </div>
          </dl>

          <div className="new-summary-total">
            <span>المبلغ المطلوب الآن</span>
            <strong>0 شيكل</strong>
            <small>سيتم إصدار الفاتورة بعد تفعيل الاشتراك</small>
          </div>

          <button
            className="new-subscription-confirm"
            type="button"
            onClick={handleConfirm}
          >
            إرسال طلب الاشتراك
          </button>
        </aside>

        <div className="new-subscription-content">
          <button
            className="new-subscription-close"
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
          >
            <IoClose />
          </button>

          <h2 id="new-subscription-title">طلب اشتراك جديد</h2>

          <div className="new-subscription-section-title">
            <IoSpeedometerOutline aria-hidden="true" />
            <h3>حجم الاشتراك</h3>
          </div>

          <div className="ampere-request-card">
            <div className="ampere-request-head">
              <span>عدد الأمبيرات المطلوبة</span>
              <strong>{ampere} أمبير</strong>
            </div>

            <input
              className="ampere-slider"
              type="range"
              min="3"
              max="15"
              step="1"
              value={ampere}
              onChange={(event) => setAmpere(Number(event.target.value))}
              aria-label="عدد الأمبيرات المطلوبة"
            />

            <div className="ampere-tip-card">
              <div>
                <strong>{currentAmpere.text}</strong>
                <p>{currentAmpere.hint}</p>
              </div>
              <span aria-hidden="true">
                <IoBulbOutline />
              </span>
            </div>
          </div>

          <div className="new-subscription-section-title payment-options-title">
            <IoCalendarOutline aria-hidden="true" />
            <h3>خيارات الدفع</h3>
          </div>

          <div className="new-payment-plans">
            {paymentPlans.map((plan) => (
              <button
                className={`new-payment-plan ${
                  paymentPlan === plan.id ? "selected" : ""
                }`}
                key={plan.id}
                type="button"
                onClick={() => setPaymentPlan(plan.id)}
              >
                <strong>{plan.title}</strong>
                <span>{plan.description}</span>
              </button>
            ))}
          </div>

          <p className="new-subscription-note">
            لن يتم طلب أي دفعة الآن. بعد موافقة المزود وتفعيل الاشتراك ستظهر
            الفاتورة في صفحة الفواتير والمدفوعات.
          </p>
        </div>
      </section>
    </div>
  );
}

export default NewSubscriptionModal;
