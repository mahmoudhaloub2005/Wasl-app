import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CustomerSubscription.css";

import {
  createSubscription,
  deleteSubscription,
  getLocalCustomerSubscription,
  getCustomerSubscriptionForDisplay,
  saveLocalCustomerSubscription,
  updateSubscription,
} from "../../../services/subscriptionService";
import {
  getGeneratorDetails,
  getGenerators,
} from "../../../services/generatorService";
import { getApiErrorMessage } from "../../../utils/apiError";

import EditSubscriptionModal from "./EditSubscriptionModal";
import NewSubscriptionModal from "./NewSubscriptionModal";
import SubscriptionBanner from "./SubscriptionBanner";
import SubscriptionMainCard from "./SubscriptionMainCard";
import SubscriptionProgress from "./SubscriptionProgress";
import SubscriptionSideCards from "./SubscriptionSideCards";

function formatArabicDate(value = new Date()) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatArabicDateTime(value = new Date()) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function saveLocalSubscription(subscription) {
  saveLocalCustomerSubscription(subscription);
}

function getLocalSubscription() {
  const localSubscription = getLocalCustomerSubscription();

  return localSubscription && !isOldCancelledSubscription(localSubscription)
    ? localSubscription
    : null;
}

function isOldCancelledSubscription(subscription) {
  const status = String(subscription?.status || "").toLowerCase();
  const state = String(subscription?.state || "").toLowerCase();

  return Boolean(
    subscription?.isCancelled ||
      status === "cancelled" ||
      status === "canceled" ||
      status === "ملغي" ||
      status === "ملغى" ||
      state === "cancelled" ||
      state === "canceled" ||
      state === "ملغي" ||
      state === "ملغى"
  );
}

function getValueOrFallback(value, fallback) {
  return value === undefined || value === null || value === "" ? fallback : value;
}

function mergeSubscriptionForDisplay(primary = {}, fallback = {}) {
  const progressSteps = Array.isArray(primary.progressSteps)
    ? primary.progressSteps
    : [];

  return {
    ...fallback,
    ...primary,

    generatorId: getValueOrFallback(primary.generatorId, fallback.generatorId),
    generator_id: getValueOrFallback(primary.generator_id, fallback.generator_id),
    generatorName: getValueOrFallback(primary.generatorName, fallback.generatorName),
    generator_name: getValueOrFallback(primary.generator_name, fallback.generator_name),
    generatorType: getValueOrFallback(primary.generatorType, fallback.generatorType),
    generator_type: getValueOrFallback(primary.generator_type, fallback.generator_type),
    location: getValueOrFallback(primary.location, fallback.location),
    description: getValueOrFallback(primary.description, fallback.description),

    ampereValue: getValueOrFallback(primary.ampereValue, fallback.ampereValue),
    amperes: getValueOrFallback(primary.amperes, fallback.amperes),
    ampere: getValueOrFallback(primary.ampere, fallback.ampere),

    paymentPlan: getValueOrFallback(primary.paymentPlan, fallback.paymentPlan),
    payment_plan: getValueOrFallback(primary.payment_plan, fallback.payment_plan),
    paymentPlanText: getValueOrFallback(
      primary.paymentPlanText,
      fallback.paymentPlanText
    ),

    priceText: getValueOrFallback(primary.priceText, fallback.priceText),
    pricePerAmpere: getValueOrFallback(
      primary.pricePerAmpere,
      fallback.pricePerAmpere
    ),
    subscriptionNumber: getValueOrFallback(
      primary.subscriptionNumber,
      fallback.subscriptionNumber
    ),
    requestDate: getValueOrFallback(primary.requestDate, fallback.requestDate),
    startDate: getValueOrFallback(primary.startDate, fallback.startDate),

    invoice: primary.invoice || fallback.invoice || null,
    progressSteps:
      progressSteps.length > 0 ? progressSteps : fallback.progressSteps || [],
  };
}

function getBestSubscriptionForDisplay(serverSubscription) {
  const localSubscription = getLocalSubscription();

  if (!serverSubscription) {
    return localSubscription || null;
  }

  if (isOldCancelledSubscription(serverSubscription)) {
    return localSubscription || null;
  }

  if (!localSubscription) {
    return serverSubscription;
  }

  return mergeSubscriptionForDisplay(serverSubscription, localSubscription);
}

function enrichSubscriptionWithGenerator(subscription, generator) {
  if (!subscription || !generator) {
    return subscription;
  }

  const generatorName = getGeneratorNameFromAny(generator);
  const generatorType = getGeneratorTypeFromAny(generator);

  return {
    ...subscription,
    generatorId: getValueOrFallback(subscription.generatorId, generator.id),
    generator_id: getValueOrFallback(subscription.generator_id, generator.id),
    generatorName: getValueOrFallback(subscription.generatorName, generatorName),
    generator_name: getValueOrFallback(
      subscription.generator_name,
      generatorName
    ),
    generatorType: getValueOrFallback(subscription.generatorType, generatorType),
    generator_type: getValueOrFallback(
      subscription.generator_type,
      generatorType
    ),
    location: getValueOrFallback(subscription.location, generator.location),
    description: getValueOrFallback(
      subscription.description,
      generator.shortDescription
    ),
    priceText: getValueOrFallback(subscription.priceText, generator.priceText),
    pricePerAmpere: getValueOrFallback(
      subscription.pricePerAmpere,
      generator.priceText
    ),
  };
}

function unwrapCreatedSubscription(response) {
  return (
    response?.data?.subscription ||
    response?.subscription ||
    response?.data ||
    response ||
    {}
  );
}

function getGeneratorNameFromAny(source = {}) {
  return (
    source.generatorName ||
    source.generator_name ||
    source.name ||
    source.title ||
    source.generator?.name ||
    source.generator?.generatorName ||
    source.generator?.generator_name ||
    source.generator_info?.name ||
    source.generator_info?.generatorName ||
    source.generator_info?.generator_name ||
    ""
  );
}

function getGeneratorTypeFromAny(source = {}) {
  return (
    source.generatorType ||
    source.generator_type ||
    source.type ||
    source.generator?.type ||
    source.generator?.generatorType ||
    source.generator?.generator_type ||
    source.generator_info?.type ||
    source.generator_info?.generatorType ||
    source.generator_info?.generator_type ||
    getGeneratorNameFromAny(source)
  );
}

function getPaymentPlanText(paymentPlan) {
  if (paymentPlan === "monthly") return "شهري";
  if (paymentPlan === "biweekly") return "كل أسبوعين";
  if (paymentPlan === "prepaid") return "مسبق الدفع";
  if (paymentPlan === "weekly") return "أسبوعي";

  return paymentPlan || "";
}

function buildPendingSubscription({
  createdSubscription,
  requestedGeneratorId,
  ampere,
  paymentPlan,
  monthlyCost,
  locationState,
}) {
  const created = unwrapCreatedSubscription(createdSubscription);
  const now = new Date();

  const generatorFromState =
    locationState?.generator ||
    locationState?.selectedGenerator ||
    locationState?.generatorData ||
    {};

  const generatorName =
    getGeneratorNameFromAny(created) ||
    getGeneratorNameFromAny(generatorFromState) ||
    "المولد";

  const generatorType =
    getGeneratorTypeFromAny(created) ||
    getGeneratorTypeFromAny(generatorFromState) ||
    generatorName;

  return {
    ...created,

    id:
      created.id ||
      created._id ||
      created.uuid ||
      created.subscription_id ||
      created.subscriptionId ||
      `pending-${requestedGeneratorId}-${Date.now()}`,

    generatorId:
      created.generator_id ||
      created.generatorId ||
      created.generator?.id ||
      requestedGeneratorId,

    generatorName,
    generator_name: generatorName,

    generatorType,
    generator_type: generatorType,

    ampereValue: ampere,
    amperes: ampere,
    ampere: ampere ? `${ampere} أمبير` : "",

    paymentPlan,
    payment_plan: paymentPlan,
    paymentPlanText: getPaymentPlanText(paymentPlan),

    monthlyCost,
    priceText: monthlyCost ? `${monthlyCost} شيكل` : "",

    startDate: formatArabicDate(now),
    requestDate: formatArabicDateTime(now),

    status: "pending",
    state: "pending",
    statusLabel: "قيد المراجعة",
    statusText: "قيد المراجعة",

    isPending: true,
    isActive: false,
    isRejected: false,
    isCancelled: false,

    cancelledAt: "",
    cancelled_at: "",
    cancelledAtText: "",
    cancelled_at_text: "",
    cancelledGeneratorName: "",
    cancelled_generator_name: "",

    invoice: null,
    progressSteps: [],
  };
}

function buildEditedSubscription(subscription = {}, { ampere, paymentPlan }) {
  const now = new Date();

  return {
    ...subscription,

    ampereValue: ampere,
    amperes: ampere,
    ampere: ampere ? `${ampere} أمبير` : subscription.ampere,

    paymentPlan,
    payment_plan: paymentPlan,
    paymentPlanText: getPaymentPlanText(paymentPlan),

    editRequestedAt: now.toISOString(),
    editRequestedAtText: formatArabicDateTime(now),

    status: "pending",
    state: "pending",
    statusLabel: "قيد المراجعة",
    statusText: "قيد المراجعة",

    isPending: true,
    isActive: false,
    isRejected: false,
    isCancelled: false,

    cancelledAt: "",
    cancelled_at: "",
    cancelledAtText: "",
    cancelled_at_text: "",
    cancelledGeneratorName: "",
    cancelled_generator_name: "",
  };
}

function buildCancelledSubscription(subscription = {}) {
  const now = new Date();

  const generatorName =
    subscription.generatorName ||
    subscription.generator_name ||
    subscription.generator?.name ||
    subscription.generator?.generatorName ||
    subscription.generator?.generator_name ||
    "المولد";

  return {
    ...subscription,

    status: "cancelled",
    state: "cancelled",
    statusLabel: "ملغي",
    statusText: "ملغي",

    isPending: false,
    isActive: false,
    isRejected: false,
    isCancelled: true,

    cancelledAt: now.toISOString(),
    cancelled_at: now.toISOString(),
    cancelledAtText: formatArabicDateTime(now),
    cancelled_at_text: formatArabicDateTime(now),

    cancelledGeneratorName: generatorName,
    cancelled_generator_name: generatorName,
  };
}

function CustomerSubscription() {
  const { generatorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(
    Boolean(generatorId && location.state?.openNewSubscription)
  );

  const [remoteSubscription, setRemoteSubscription] = useState(null);
  const [selectedGenerator, setSelectedGenerator] = useState(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  const loadCurrentSubscriptionDetails = useCallback(async () => {
    return getCustomerSubscriptionForDisplay();
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!generatorId) {
      setSelectedGenerator(null);

      return () => {
        isMounted = false;
      };
    }

    async function loadSelectedGenerator() {
      let generatorDetails = null;

      try {
        generatorDetails = await getGeneratorDetails(generatorId);
      } catch (error) {
        console.error("Failed to load selected generator:", error);
      }

      if (!generatorDetails) {
        try {
          const generators = await getGenerators();
          generatorDetails =
            generators.find((generator) => String(generator.id) === String(generatorId)) ||
            null;
        } catch (error) {
          console.error("Failed to load selected generator from list:", error);
        }
      }

      if (isMounted) {
        setSelectedGenerator(generatorDetails || null);
      }
    }

    loadSelectedGenerator();

    return () => {
      isMounted = false;
    };
  }, [generatorId]);

  useEffect(() => {
    if (!location.state?.message) return;

    setSubscriptionMessage(location.state.message);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state?.message, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscription() {
      try {
        setIsLoadingSubscription(true);
        setLoadError("");

        const subscriptionDetails = await loadCurrentSubscriptionDetails();

        if (isMounted) {
          setRemoteSubscription(getBestSubscriptionForDisplay(subscriptionDetails));
        }
      } catch (error) {
        console.error("Failed to load subscriptions:", error);

        if (isMounted) {
          const localSubscription = getLocalSubscription();

          if (localSubscription) {
            setRemoteSubscription(localSubscription);
            setLoadError("");
          } else {
            setRemoteSubscription(null);
            setLoadError("تعذر تحميل الاشتراكات من الخادم");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubscription(false);
        }
      }
    }

    loadSubscription();

    return () => {
      isMounted = false;
    };
  }, [location.key, loadCurrentSubscriptionDetails]);

  useEffect(() => {
    if (!generatorId || !location.state?.openNewSubscription) return;

    setIsNewSubscriptionOpen(true);

    const { openNewSubscription, ...nextState } = location.state;

    navigate(location.pathname, {
      replace: true,
      state: Object.keys(nextState).length > 0 ? nextState : null,
    });
  }, [generatorId, location.pathname, location.state, navigate]);

  const displaySubscription = enrichSubscriptionWithGenerator(
    remoteSubscription,
    selectedGenerator
  );

  const invoice = displaySubscription?.invoice || null;
  const progressSteps = displaySubscription?.progressSteps || [];
  const isCancelled = Boolean(displaySubscription?.isCancelled);
  const isPendingSubscription = Boolean(displaySubscription?.isPending);

  const cancelDialogTitle = isPendingSubscription
    ? "إلغاء طلب الاشتراك"
    : "إلغاء الاشتراك";

  const cancelDialogMessage = isPendingSubscription
    ? "هل أنت متأكد من إلغاء طلب الاشتراك؟ بعد التأكيد سيتم إلغاء الطلب."
    : "هل أنت متأكد من إلغاء الاشتراك؟ بعد التأكيد سيتم إلغاء الاشتراك.";

  const cancelConfirmLabel = isPendingSubscription
    ? "تأكيد إلغاء الطلب"
    : "تأكيد الإلغاء";

  const handleConfirmEdit = async ({ ampere, paymentPlan: nextPaymentPlan }) => {
    if (!remoteSubscription?.id) return;

    const editedSubscription = buildEditedSubscription(remoteSubscription, {
      ampere,
      paymentPlan: nextPaymentPlan,
    });

    try {
      await updateSubscription(remoteSubscription.id, {
        amperes: ampere,
        payment_plan: nextPaymentPlan,
      });

      setRemoteSubscription(editedSubscription);
      saveLocalSubscription(editedSubscription);

      setIsEditOpen(false);
      setSubscriptionMessage(
        "تم إرسال طلب تعديل الاشتراك بنجاح، بانتظار موافقة المزود."
      );
    } catch (error) {
      console.error("Failed to update subscription:", error);

      const isUnsupportedEdit =
        error.response?.status === 404 ||
        error.response?.status === 405 ||
        error.displayMessage ||
        error.message?.includes("غير متاح") ||
        error.message?.includes("غير مدعوم");

      if (isUnsupportedEdit) {
        setRemoteSubscription(editedSubscription);
        saveLocalSubscription(editedSubscription);

        setIsEditOpen(false);
        setSubscriptionMessage(
          "تم تسجيل طلب تعديل الاشتراك بنجاح، بانتظار موافقة المزود."
        );

        return;
      }

      setSubscriptionMessage(
        getApiErrorMessage(
          error,
          "تعذر تعديل الاشتراك على الخادم. حاول مرة أخرى."
        )
      );

      throw error;
    }
  };

  const handleConfirmCancel = async () => {
    if (!remoteSubscription?.id || isCanceling) return;

    try {
      setIsCanceling(true);

      const cancelledSubscription = buildCancelledSubscription(remoteSubscription);

      await deleteSubscription(remoteSubscription.id, {
        cancelled_at: cancelledSubscription.cancelled_at,
        cancelled_generator_name:
          cancelledSubscription.cancelled_generator_name,
      });

      setRemoteSubscription(cancelledSubscription);
      saveLocalSubscription(cancelledSubscription);

      setIsCancelOpen(false);
      setIsEditOpen(false);

      setSubscriptionMessage(
        isPendingSubscription
          ? `تم إلغاء طلب الاشتراك باسم المولد ${cancelledSubscription.cancelledGeneratorName} بتاريخ ${cancelledSubscription.cancelledAtText}.`
          : `تم إلغاء الاشتراك باسم المولد ${cancelledSubscription.cancelledGeneratorName} بتاريخ ${cancelledSubscription.cancelledAtText}.`
      );
    } catch (error) {
      console.error("Failed to cancel subscription:", error);

      setSubscriptionMessage(
        getApiErrorMessage(
          error,
          "تعذر إلغاء الاشتراك على الخادم. حاول مرة أخرى."
        )
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const handleConfirmNewSubscription = async ({
    generatorId: requestedGeneratorId,
    generatorName,
    generatorType,
    ampere,
    paymentPlan: nextPaymentPlan,
    monthlyCost,
  }) => {
    const requestGeneratorId = requestedGeneratorId || generatorId;

    if (!requestGeneratorId) {
      throw new Error("معرف المولد غير موجود.");
    }

    const createdSubscription = await createSubscription({
      generator_id: requestGeneratorId,
      amperes: ampere,
      payment_plan: nextPaymentPlan,
      monthly_cost: monthlyCost,
    });

    const pendingSubscription = buildPendingSubscription({
      createdSubscription: {
        ...unwrapCreatedSubscription(createdSubscription),
        generatorName,
        generator_name: generatorName,
        generatorType,
        generator_type: generatorType,
      },
      requestedGeneratorId: requestGeneratorId,
      ampere,
      paymentPlan: nextPaymentPlan,
      monthlyCost,
      locationState: location.state,
    });

    setRemoteSubscription(pendingSubscription);
    saveLocalSubscription(pendingSubscription);

    setIsNewSubscriptionOpen(false);
    setLoadError("");
    setIsLoadingSubscription(false);
    setSubscriptionMessage(
      "تم إرسال طلب الاشتراك بنجاح، بانتظار موافقة المزود."
    );

    navigate("/customer/subscriptions", {
      replace: true,
      state: {
        message: "تم إرسال طلب الاشتراك بنجاح، بانتظار موافقة المزود.",
      },
    });
  };

  return (
    <main className="customer-subscription" dir="rtl">
      <div className="customer-subscription-container">
        {isLoadingSubscription && (
          <p className="subscription-action-message">جاري تحميل الاشتراكات...</p>
        )}

        {!isLoadingSubscription && loadError && (
          <p className="subscription-action-message">{loadError}</p>
        )}

        {!isLoadingSubscription && !loadError && !remoteSubscription && (
          <p className="subscription-action-message">لا يوجد اشتراك حالياً</p>
        )}

        {subscriptionMessage && !loadError && (
          <p className="subscription-action-message">{subscriptionMessage}</p>
        )}

        {remoteSubscription && (
          <section className="subscription-top-grid">
            <SubscriptionMainCard
              subscription={displaySubscription}
              isCancelled={isCancelled}
              onEditSubscription={() => setIsEditOpen(true)}
              onCancelSubscription={() => setIsCancelOpen(true)}
            />

            <SubscriptionSideCards
              invoice={invoice}
              subscription={displaySubscription}
            />
          </section>
        )}

        {remoteSubscription && progressSteps.length > 0 && (
          <SubscriptionProgress steps={progressSteps} />
        )}

        <SubscriptionBanner />
      </div>

      {isEditOpen && remoteSubscription && (
        <EditSubscriptionModal
          subscription={displaySubscription}
          onClose={() => setIsEditOpen(false)}
          onConfirm={handleConfirmEdit}
        />
      )}

      {isNewSubscriptionOpen && (
        <NewSubscriptionModal
          generator={selectedGenerator || (generatorId ? { id: generatorId } : null)}
          onClose={() => setIsNewSubscriptionOpen(false)}
          onConfirm={handleConfirmNewSubscription}
        />
      )}

      {isCancelOpen && remoteSubscription && (
        <div className="cancel-subscription-backdrop" role="presentation">
          <section
            className="cancel-subscription-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-subscription-title"
          >
            <h2 id="cancel-subscription-title">{cancelDialogTitle}</h2>
            <p>{cancelDialogMessage}</p>

            <div className="cancel-dialog-actions">
              <button type="button" onClick={() => setIsCancelOpen(false)}>
                تراجع
              </button>

              <button
                className="danger"
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCanceling}
              >
                {isCanceling ? "جاري الإلغاء..." : cancelConfirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default CustomerSubscription;
