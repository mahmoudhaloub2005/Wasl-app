import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CustomerSubscription.css";

import { getGeneratorById } from "../../../data/generatorsStorage";
import {
  createSubscription,
  deleteSubscription,
  getMySubscriptions,
  getSubscriptionDetails,
  updateSubscription,
} from "../../../services/subscriptionService";
import { getApiErrorMessage } from "../../../utils/apiError";

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
  const [remoteSubscription, setRemoteSubscription] = useState(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  const currentPrice = amperePrices[ampereValue] || amperePrices[5];

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptions() {
      try {
        setIsLoadingSubscription(true);

        const subscriptions = await getMySubscriptions();
        const activeSubscription =
          subscriptions.find((item) => !item.isCancelled) || subscriptions[0];
        const subscriptionDetails = activeSubscription?.id
          ? await getSubscriptionDetails(activeSubscription.id)
          : activeSubscription;

        if (isMounted && subscriptionDetails) {
          setRemoteSubscription(subscriptionDetails);
          setAmpereValue(subscriptionDetails.ampereValue || 5);
          setPaymentPlan(subscriptionDetails.paymentPlan || "monthly");
          setSubscriptionStartDate(subscriptionDetails.startDate);
          setSubscriptionNumber(subscriptionDetails.subscriptionNumber);
          setIsCancelled(Boolean(subscriptionDetails.isCancelled));
        }
      } catch (error) {
        console.error("Failed to load subscriptions:", error);

        if (isMounted) {
          setSubscriptionMessage(
            "تعذر تحميل الاشتراكات من الخادم، يتم عرض البيانات المتاحة حاليا."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubscription(false);
        }
      }
    }

    loadSubscriptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const subscription = remoteSubscription || {
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

  const invoice = remoteSubscription?.invoice || {
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

  const handleConfirmEdit = async ({ ampere, paymentPlan: nextPaymentPlan }) => {
    try {
      if (remoteSubscription?.id) {
        const updatedSubscription = await updateSubscription(remoteSubscription.id, {
          ampere,
          payment_plan: nextPaymentPlan,
        });

        setRemoteSubscription(updatedSubscription);
      }

      setAmpereValue(ampere);
      setPaymentPlan(nextPaymentPlan);
      setIsEditOpen(false);
      setSubscriptionMessage(
        `تم تعديل الاشتراك إلى ${ampere} أمبير بنظام دفع ${
          nextPaymentPlan === "monthly" ? "شهري" : "كل أسبوعين"
        }.`
      );
    } catch (error) {
      console.error("Failed to update subscription:", error);
      setSubscriptionMessage(
        getApiErrorMessage(error, "تعذر تعديل الاشتراك على الخادم. حاول مرة أخرى.")
      );
    }
  };

  const handleConfirmCancel = async () => {
    try {
      if (remoteSubscription?.id) {
        await deleteSubscription(remoteSubscription.id);
      }

      setRemoteSubscription((currentSubscription) =>
        currentSubscription
          ? {
              ...currentSubscription,
              status: "اشتراك ملغى",
              isCancelled: true,
            }
          : currentSubscription
      );
      setIsCancelled(true);
      setIsCancelOpen(false);
      setIsEditOpen(false);
      setSubscriptionMessage("تم إلغاء الاشتراك بنجاح.");
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      setSubscriptionMessage(
        getApiErrorMessage(error, "تعذر إلغاء الاشتراك على الخادم. حاول مرة أخرى.")
      );
    }
  };

  const handleConfirmNewSubscription = async ({
    ampere,
    paymentPlan: nextPaymentPlan,
    monthlyCost,
  }) => {
    const todayLabel = formatTodayLabel();
    const todayNumeric = formatTodayNumeric();

    try {
      await createSubscription({
        generator_id: generator?.id || generatorId || null,
        ampere,
        payment_plan: nextPaymentPlan,
        monthly_cost: monthlyCost,
      });

      setAmpereValue(ampere);
      setPaymentPlan(nextPaymentPlan);
      setSubscriptionStartDate(todayLabel);
      setSubscriptionProgressDate(todayNumeric);
      setSubscriptionNumber(createSubscriptionNumber());
      setRemoteSubscription(null);
      setIsCancelled(false);
      setIsNewSubscriptionOpen(false);
      setSubscriptionMessage(
        `تم إرسال طلب الاشتراك بتاريخ ${todayLabel}. لا يوجد دفع الآن، والتكلفة الشهرية المتوقعة ${monthlyCost} شيكل بعد التفعيل.`
      );
    } catch (error) {
      console.error("Failed to create subscription:", error);
      setSubscriptionMessage(
        getApiErrorMessage(error, "تعذر إرسال طلب الاشتراك للخادم. حاول مرة أخرى.")
      );
    }
  };

  return (
    <main className="customer-subscription" dir="rtl">
      <div className="customer-subscription-container">
        {isLoadingSubscription && (
          <p className="subscription-action-message">
            جاري تحميل الاشتراكات...
          </p>
        )}

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
