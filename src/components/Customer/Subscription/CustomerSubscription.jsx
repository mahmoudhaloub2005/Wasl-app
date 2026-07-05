import { useState } from "react";
import { useParams } from "react-router-dom";
import "./CustomerSubscription.css";

import { getGeneratorById } from "../../../data/generatorsStorage";

import EditSubscriptionModal from "./EditSubscriptionModal";
import NewSubscriptionModal from "./NewSubscriptionModal";
import SubscriptionBanner from "./SubscriptionBanner";
import SubscriptionMainCard from "./SubscriptionMainCard";
import SubscriptionProgress from "./SubscriptionProgress";
import SubscriptionSideCards from "./SubscriptionSideCards";

const amperePrices = {
  3: 50,
  5: 75,
  10: 140,
  15: 200,
};

const formatTodayLabel = () =>
  new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

const formatTodayNumeric = () =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

const createSubscriptionNumber = () =>
  `#WSL-${Date.now().toString().slice(-4)}`;

function CustomerSubscription() {
  const { generatorId } = useParams();
  const generator = generatorId ? getGeneratorById(generatorId) : null;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [ampereValue, setAmpereValue] = useState(5);
  const [paymentPlan, setPaymentPlan] = useState("monthly");
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(
    formatTodayLabel
  );
  const [subscriptionProgressDate, setSubscriptionProgressDate] = useState(
    formatTodayNumeric
  );
  const [subscriptionNumber, setSubscriptionNumber] = useState(
    createSubscriptionNumber
  );
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(
    Boolean(generatorId)
  );

  const currentPrice = amperePrices[ampereValue] || amperePrices[5];

  const subscription = {
    generatorId: generator?.id || generatorId || null,
    generatorName: generator?.name || "مولدات الحي المركزية",
    description: generator?.shortDescription || "مزود طاقة موثوق لمنطقتكم",
    status: isCancelled ? "اشتراك ملغى" : "اشتراك نشط",
    ampere: `${ampereValue} أمبير`,
    ampereValue,
    paymentPlan,
    paymentPlanText: paymentPlan === "monthly" ? "شهري" : "كل أسبوعين",
    startDate: subscriptionStartDate,
    subscriptionNumber,
    pricePerAmpere: `${currentPrice} شيكل`,
  };

  const invoice = {
    currentBill: String(currentPrice),
    usagePercent: Math.min(ampereValue * 10, 100),
    lastPayment: "100 شيكل",
    paidBills: "2 فاتورة",
  };

  const progressSteps = [
    {
      id: 1,
      title: "تم تقديم الطلب",
      date: subscriptionProgressDate,
      type: "done",
    },
    {
      id: 2,
      title: "تمت الموافقة",
      date: "20/05/2026",
      type: "done",
    },
    {
      id: 3,
      title: isCancelled ? "تم إلغاء الاشتراك" : "اشتراك نشط",
      date: isCancelled ? "تم التحديث الآن" : "مفعل حالياً",
      type: isCancelled ? "done" : "active",
    },
  ];

  const handleConfirmEdit = ({ ampere, paymentPlan: nextPaymentPlan }) => {
    setAmpereValue(ampere);
    setPaymentPlan(nextPaymentPlan);
    setIsEditOpen(false);
    setSubscriptionMessage(
      `تم تعديل الاشتراك إلى ${ampere} أمبير بنظام دفع ${
        nextPaymentPlan === "monthly" ? "شهري" : "كل أسبوعين"
      }.`
    );
  };

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setIsCancelOpen(false);
    setIsEditOpen(false);
    setSubscriptionMessage("تم إلغاء الاشتراك بنجاح.");
  };

  const handleConfirmNewSubscription = ({
    ampere,
    paymentPlan: nextPaymentPlan,
    monthlyCost,
  }) => {
    const todayLabel = formatTodayLabel();
    const todayNumeric = formatTodayNumeric();

    setAmpereValue(ampere);
    setPaymentPlan(nextPaymentPlan);
    setSubscriptionStartDate(todayLabel);
    setSubscriptionProgressDate(todayNumeric);
    setSubscriptionNumber(createSubscriptionNumber());
    setIsCancelled(false);
    setIsNewSubscriptionOpen(false);
    setSubscriptionMessage(
      `تم إرسال طلب الاشتراك بتاريخ ${todayLabel}. لا يوجد دفع الآن، والتكلفة الشهرية المتوقعة ${monthlyCost} شيكل بعد التفعيل.`
    );
  };

  return (
    <main className="customer-subscription" dir="rtl">
      <div className="customer-subscription-container">
        <section className="subscription-top-grid">
          <SubscriptionMainCard
            subscription={subscription}
            isCancelled={isCancelled}
            onEditSubscription={() => setIsEditOpen(true)}
            onCancelSubscription={() => setIsCancelOpen(true)}
          />
          <SubscriptionSideCards invoice={invoice} />
        </section>

        {subscriptionMessage && (
          <p className="subscription-action-message">{subscriptionMessage}</p>
        )}

        <SubscriptionProgress steps={progressSteps} />

        <SubscriptionBanner />
      </div>

      {isEditOpen && (
        <EditSubscriptionModal
          subscription={subscription}
          onClose={() => setIsEditOpen(false)}
          onConfirm={handleConfirmEdit}
        />
      )}

      {isNewSubscriptionOpen && (
        <NewSubscriptionModal
          generator={generator}
          onClose={() => setIsNewSubscriptionOpen(false)}
          onConfirm={handleConfirmNewSubscription}
        />
      )}

      {isCancelOpen && (
        <div className="cancel-subscription-backdrop" role="presentation">
          <section
            className="cancel-subscription-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-subscription-title"
          >
            <h2 id="cancel-subscription-title">إلغاء الاشتراك</h2>
            <p>
              هل أنت متأكد من إلغاء الاشتراك؟ بعد التأكيد سيتم تغيير حالة
              الاشتراك إلى ملغى.
            </p>

            <div className="cancel-dialog-actions">
              <button type="button" onClick={() => setIsCancelOpen(false)}>
                تراجع
              </button>
              <button
                className="danger"
                type="button"
                onClick={handleConfirmCancel}
              >
                تأكيد الإلغاء
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default CustomerSubscription;
