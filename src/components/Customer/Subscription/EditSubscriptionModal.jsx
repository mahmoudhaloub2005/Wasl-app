import { useState } from "react";
import {
  IoCalendarOutline,
  IoCloseOutline,
  IoGridOutline,
  IoLayersOutline,
  IoReceiptOutline,
  IoSparklesOutline,
  IoThunderstormSharp,
} from "react-icons/io5";
import { getApiErrorMessage } from "../../../utils/apiError";

const ampereOptions = [
  {
    value: 3,
    description: "مناسب للإنارة، التلفاز، والمراوح فقط.",
  },
  {
    value: 5,
    description: "للإنارة، الثلاجة، وتبريد صحراوي واحد.",
  },
  {
    value: 10,
    description: "يشغل مكيف هواء 1.5 طن مع الأجهزة الأساسية.",
  },
  {
    value: 15,
    description: "مثالي للمنازل الكبيرة مع تشغيل مكيفين.",
  },
];

const paymentPlans = [
  {
    id: "monthly",
    title: "شهري",
    badge: "الأكثر شيوعًا",
    description: "يتم استلام الفاتورة في الأول من كل شهر.",
    icon: <IoCalendarOutline />,
  },
  {
    id: "biweekly",
    title: "كل أسبوعين",
    description: "تجزئة الدفعات إلى دفعتين خلال الشهر.",
    icon: <IoGridOutline />,
  },
];

function EditSubscriptionModal({ subscription, onClose, onConfirm }) {
  const currentAmpere = subscription.ampereValue || 5;

  const [selectedAmpere, setSelectedAmpere] = useState(currentAmpere);
  const [paymentPlan, setPaymentPlan] = useState(
    subscription.paymentPlan || "monthly"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    try {
      setErrorMessage("");
      setIsSubmitting(true);

      await onConfirm?.({
        ampere: selectedAmpere,
        paymentPlan,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "تعذر تعديل الاشتراك. حاول مرة أخرى.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-subscription-backdrop" role="presentation">
      <section
        className="edit-subscription-modal"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-subscription-title"
      >
        <header className="edit-subscription-header">
          <div>
            <h2 id="edit-subscription-title">تعديل الاشتراك</h2>
            <p>تحكم في سعة الطاقة وخطة الدفع المفضلة لديك</p>
          </div>

          <button
            className="edit-subscription-close"
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <IoCloseOutline />
          </button>
        </header>

        <div className="edit-subscription-body">
          <aside className="subscription-summary-panel">
            <div className="summary-box">
              <h3>ملخص الحساب</h3>

              <dl className="summary-main-values">
                <div>
                  <dt>السعة المختارة</dt>
                  <dd>{selectedAmpere} أمبير</dd>
                </div>

                <div>
                  <dt>نظام الدفع</dt>
                  <dd>
                    {paymentPlan === "monthly" ? "شهري" : "كل أسبوعين"}
                  </dd>
                </div>
              </dl>

              <button
                className="confirm-edit-subscription"
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التعديل..." : "تأكيد التعديل"}
              </button>

              {errorMessage && (
                <p className="edit-subscription-error">{errorMessage}</p>
              )}

              <button
                className="ignore-edit-subscription"
                type="button"
                onClick={onClose}
              >
                إلغاء وتجاهل
              </button>

              <p className="summary-note">
                بالضغط على تأكيد، فإنك توافق على شروط الخدمة وتعديل سعة الخط
                برمجيًا خلال 15 دقيقة.
              </p>
            </div>

            <div className="capacity-impact-card">
              <div className="impact-title">
                <IoSparklesOutline />
                <h3>تأثير السعة الجديدة</h3>
              </div>

              <div className="impact-meter">
                <span
                  style={{ width: `${Math.min(selectedAmpere * 6, 100)}%` }}
                />
              </div>

              <p>
                هذه السعة ({selectedAmpere} أمبير) ستسمح لك بتشغيل{" "}
                <strong>{getCapacityImpact(selectedAmpere)}</strong>
              </p>
            </div>
          </aside>

          <section className="edit-subscription-content">
            <div className="current-plan-card">
              <span className="current-plan-icon">
                <IoThunderstormSharp />
              </span>

              <div>
                <div className="current-plan-meta">
                  <span>{subscription.generatorName || "المولد"}</span>
                  {subscription.statusLabel && <b>{subscription.statusLabel}</b>}
                </div>

                <h3>الخطة الحالية: {currentAmpere} أمبير</h3>
              </div>

              {subscription.pricePerAmpere && (
                <div className="current-plan-cost">
                  <span>السعر للأمبير</span>
                  <strong>{subscription.pricePerAmpere}</strong>
                </div>
              )}
            </div>

            <div className="edit-section-title">
              <IoLayersOutline />
              <h3>اختر سعة الأمبير الجديدة</h3>
            </div>

            <div className="ampere-options-grid">
              {ampereOptions.map((option) => {
                const isSelected = selectedAmpere === option.value;
                const isCurrent = option.value === currentAmpere;

                return (
                  <button
                    key={option.value}
                    className={`ampere-option-card ${
                      isSelected ? "selected" : ""
                    }`}
                    type="button"
                    onClick={() => setSelectedAmpere(option.value)}
                  >
                    {isCurrent && <span className="current-badge">الحالي</span>}
                    <strong>{option.value}</strong>
                    <span>أمبير</span>
                    <div />
                    <p>{option.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="edit-section-title payment-title">
              <IoReceiptOutline />
              <h3>نظام الدفع</h3>
            </div>

            <div className="payment-plan-grid">
              {paymentPlans.map((plan) => (
                <button
                  key={plan.id}
                  className={`payment-plan-card ${
                    paymentPlan === plan.id ? "selected" : ""
                  }`}
                  type="button"
                  onClick={() => setPaymentPlan(plan.id)}
                >
                  <span className="payment-plan-icon">{plan.icon}</span>

                  <div>
                    <h4>{plan.title}</h4>
                    {plan.badge && <b>{plan.badge}</b>}
                    <p>{plan.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function getCapacityImpact(ampere) {
  if (ampere >= 15) return "تشغيل مكيفين وأجهزة المنزل الأساسية براحة.";
  if (ampere >= 10) return "مكيف هواء واحد مع أغلب أجهزة المنزل.";
  if (ampere >= 5) return "الثلاجة والإنارة وتبريد صحراوي واحد.";
  return "الإنارة والتلفاز والمراوح فقط.";
}

export default EditSubscriptionModal;
