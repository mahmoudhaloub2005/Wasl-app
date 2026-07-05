import { useParams } from "react-router-dom";
import "./CustomerSubscription.css";

import { getGeneratorById } from "../../../data/generatorsStorage";

import SubscriptionMainCard from "./SubscriptionMainCard";
import SubscriptionSideCards from "./SubscriptionSideCards";
import SubscriptionProgress from "./SubscriptionProgress";
import SubscriptionBanner from "./SubscriptionBanner";

function CustomerSubscription() {
  const { generatorId } = useParams();

  const generator = generatorId ? getGeneratorById(generatorId) : null;

  const subscription = {
    generatorId: generator?.id || generatorId || null,
    generatorName: generator?.name || "مولد النور",
    description: generator?.shortDescription || "مزود طاقة موثوق لمنطقتكم",
    status: "Active • نشط",
    ampere: "5 أمبير",
    startDate: "1 يونيو 2026",
    subscriptionNumber: "#WSL-8829",
    pricePerAmpere: generator
      ? `${generator.price} ${generator.currency}`
      : "₪25",
  };

  const invoice = {
    currentBill: "125",
    usagePercent: 80,
    lastPayment: "100 ₪",
    paidBills: "2 فاتورة",
  };

  const progressSteps = [
    {
      id: 1,
      title: "تم تقديم الطلب",
      date: "15/05/2026",
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
      title: "اشتراك نشط",
      date: "مفعل حالياً",
      type: "active",
    },
  ];

  return (
    <main className="customer-subscription" dir="rtl">
      <div className="customer-subscription-container">
        <section className="subscription-top-grid">
          <SubscriptionMainCard subscription={subscription} />
          <SubscriptionSideCards invoice={invoice} />
        </section>

        <SubscriptionProgress steps={progressSteps} />

        <SubscriptionBanner />
      </div>
    </main>
  );
}

export default CustomerSubscription;