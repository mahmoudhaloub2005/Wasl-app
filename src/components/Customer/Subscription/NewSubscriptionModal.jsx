import { useMemo, useState } from "react";
import {
  IoCalendarOutline,
  IoClose,
  IoHelpCircleOutline,
  IoBulbOutline,
  IoSpeedometerOutline,
  IoWalletOutline,
  IoCashOutline,
} from "react-icons/io5";
import { getApiErrorMessage } from "../../../utils/apiError";

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

const supportedAmpereValues = Object.keys(ampereOptions).map(Number);

function getNearestAmpere(value) {
  return supportedAmpereValues.reduce((nearestValue, optionValue) =>
    Math.abs(optionValue - value) < Math.abs(nearestValue - value)
      ? optionValue
      : nearestValue
  );
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fees = useMemo(() => {
    const base = ampereOptions[ampere]?.base || ampereOptions[5].base;
    const maintenance = 5;
    const deposit = 15;

    return {
      base,
      maintenance,
      deposit,
      total: base + maintenance + deposit,
    };
  }, [ampere]);

  const currentAmpere = ampereOptions[ampere] || ampereOptions[5];

  const handleConfirm = async () => {
    try {
      setErrorMessage("");
      setIsSubmitting(true);

      await onConfirm?.({
        generatorId: generator?.id || null,
        generatorName:
          generator?.name ||
          generator?.generatorName ||
          generator?.generator_name ||
          "",
        generatorType:
          generator?.generatorType ||
          generator?.generator_type ||
          generator?.type ||
          "",
        ampere,
        paymentPlan,
        monthlyCost: fees.base + fees.maintenance,
        dueNow: 0,
      });
    } catch (error) {
      console.error("Failed to create subscription:", error);
      setErrorMessage(
        getApiErrorMessage(error, "تعذر إرسال طلب الاشتراك. حاول مرة أخرى.")
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <span>إجمالي المبلغ المستحق الآن</span>
            <strong>{fees.total} شيكل</strong>
          </div>

          <button
            className="new-subscription-confirm"
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري إرسال الطلب..." : "إرسال طلب الاشتراك"}
          </button>

          {errorMessage && (
            <p className="new-subscription-note">{errorMessage}</p>
          )}
          </aside>

          <div className="new-subscription-content">
          <div className="new-subscription-content-header">
            <button
              className="new-subscription-close"
              type="button"
              aria-label="إغلاق"
              onClick={onClose}
            >
              <IoClose />
            </button>

            <h2 id="new-subscription-title">طلب اشتراك جديد</h2>
          </div>

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
              onChange={(event) => {
                setAmpere(getNearestAmpere(Number(event.target.value)));
                setErrorMessage("");
              }}
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
                onClick={() => {
                  setPaymentPlan(plan.id);
                  setErrorMessage("");
                }}
              >
                <strong>{plan.title}</strong>
                <span>{plan.description}</span>
              </button>
            ))}
          </div>

          <div className="new-subscription-section-title payment-method-title">
            <IoWalletOutline aria-hidden="true" />
            <h3>طريقة الدفع</h3>
          </div>

          <div className="new-payment-methods">
            <div className="new-payment-method selected">
              <span className="new-payment-radio" aria-hidden="true" />
              <span>المحفظة الإلكترونية (بنك فلسطين / بال باي)</span>
              <IoWalletOutline aria-hidden="true" />
            </div>

            <div className="new-payment-method">
              <span className="new-payment-radio" aria-hidden="true" />
              <span>دفع نقدي</span>
              <IoCashOutline aria-hidden="true" />
            </div>
          </div>
          </div>
      </section>
    </div>
  );
}

export default NewSubscriptionModal;
