import { IoCloseCircleOutline, IoCreateOutline } from "react-icons/io5";

function formatArabicDateTime(value) {
  if (!value) return "";

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

function getStatusValue(subscription = {}) {
  return String(
    subscription.status ||
      subscription.state ||
      subscription.subscription_status ||
      ""
  ).toLowerCase();
}

function getGeneratorName(subscription = {}) {
  return (
    subscription.generatorName ||
    subscription.generator_name ||
    subscription.generator?.name ||
    subscription.generator?.generatorName ||
    subscription.generator?.generator_name ||
    ""
  );
}

function getGeneratorType(subscription = {}) {
  return (
    subscription.generatorType ||
    subscription.generator_type ||
    subscription.generator?.type ||
    subscription.generator?.generatorType ||
    subscription.generator?.generator_type ||
    getGeneratorName(subscription)
  );
}

function getCancelledGeneratorName(subscription = {}) {
  return (
    subscription.cancelledGeneratorName ||
    subscription.cancelled_generator_name ||
    subscription.canceledGeneratorName ||
    subscription.canceled_generator_name ||
    ""
  );
}

function getCancelledDate(subscription = {}) {
  return (
    subscription.cancelledAt ||
    subscription.cancelled_at ||
    subscription.canceledAt ||
    subscription.canceled_at ||
    ""
  );
}

function SubscriptionMainCard({
  subscription,
  isCancelled,
  onEditSubscription,
  onCancelSubscription,
}) {
  if (!subscription) {
    return (
      <section className="subscription-main-card">
        <p className="subscription-action-message">لا يوجد اشتراك حالياً</p>
      </section>
    );
  }

  const statusValue = getStatusValue(subscription);

  const isPending =
    Boolean(subscription.isPending) ||
    statusValue === "pending" ||
    statusValue === "waiting" ||
    statusValue === "under_review";

  const isRejected =
    Boolean(subscription.isRejected) ||
    statusValue === "rejected" ||
    statusValue === "رفض" ||
    statusValue === "مرفوض";

  const isSubscriptionCancelled =
    !isPending &&
    !isRejected &&
    Boolean(
      subscription.isCancelled ||
        isCancelled ||
        statusValue === "cancelled" ||
        statusValue === "canceled" ||
        statusValue === "ملغي" ||
        statusValue === "ملغى"
    );

  const generatorName = getGeneratorName(subscription);
  const generatorType = getGeneratorType(subscription);

  const cancelledGeneratorName = getCancelledGeneratorName(subscription);
  const cancelledDate = getCancelledDate(subscription);

  const hasRealCancellationData =
    isSubscriptionCancelled &&
    Boolean(cancelledGeneratorName || cancelledDate);

  const title = isPending
    ? "طلب اشتراك قيد المراجعة"
    : isRejected
      ? "طلب اشتراك مرفوض"
      : isSubscriptionCancelled
        ? "اشتراك ملغي"
        : "اشتراكك النشط";

  const statusText =
    subscription.statusLabel ||
    subscription.statusText ||
    (isPending
      ? "قيد المراجعة"
      : isRejected
        ? "مرفوض"
        : isSubscriptionCancelled
          ? "ملغي"
          : "نشط");

  const statusClass = isPending
    ? "pending"
    : isRejected || isSubscriptionCancelled
      ? "cancelled"
      : "";

  const ampereText =
    subscription.ampere ||
    (subscription.ampereValue ? `${subscription.ampereValue} أمبير` : "");

  const subtitle = generatorName || subscription.description || "بيانات الاشتراك";

  const detailItems = [
    {
      label: "اسم المولد",
      value: generatorName,
    },
    {
      label: "نوع المولد",
      value: generatorType,
    },
    {
      label: "المنطقة / الموقع",
      value: subscription.location,
    },
    {
      label: "كمية الاشتراك",
      value: ampereText,
    },
    {
      label: "خطة الدفع",
      value: subscription.paymentPlanText,
    },
    {
      label: "السعر / قيمة الفاتورة",
      value: subscription.priceText || subscription.invoice?.currentBill,
    },
    {
      label: isPending ? "تاريخ الطلب" : "تاريخ البدء",
      value: isPending
        ? subscription.requestDate || subscription.startDate
        : subscription.startDate || subscription.requestDate,
    },
    {
      label: isPending ? "رقم الطلب" : "رقم الاشتراك",
      value: subscription.subscriptionNumber,
    },
    {
      label: "الحالة",
      value: statusText,
    },
  ].filter((item) => item.value);

  const canEditSubscription = !isRejected && !isSubscriptionCancelled;
  const canCancelSubscription = !isRejected && !isSubscriptionCancelled;

  const cancelLabel = isPending ? "إلغاء طلب الاشتراك" : "إلغاء الاشتراك";

  return (
    <section className="subscription-main-card">
      {(subscription.priceText || subscription.pricePerAmpere) && (
        <div className="subscription-price-box">
          <span>{subscription.priceText ? "السعر" : "السعر للأمبير"}</span>
          <strong>{subscription.priceText || subscription.pricePerAmpere}</strong>
        </div>
      )}

      <div className="subscription-main-header">
        <span className={`customer-subscription-status ${statusClass}`}>
          {statusText}
        </span>

        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      {detailItems.length > 0 && (
        <>
          <div className="subscription-divider" />

          <div className="subscription-details-row">
            {detailItems.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      {hasRealCancellationData && (
        <div className="subscription-cancel-details">
          <h3>بيانات إلغاء الاشتراك</h3>

          <div className="subscription-cancel-row">
            <span>تم إلغاء الاشتراك باسم المولد</span>
            <strong>{cancelledGeneratorName || "غير متوفر"}</strong>
          </div>

          <div className="subscription-cancel-row">
            <span>تاريخ ووقت الإلغاء</span>
            <strong>
              {cancelledDate ? formatArabicDateTime(cancelledDate) : "غير متوفر"}
            </strong>
          </div>
        </div>
      )}

      {(canEditSubscription || canCancelSubscription) && (
        <div className="subscription-actions">
          {canEditSubscription && (
            <button
              className="edit-subscription-button"
              type="button"
              onClick={onEditSubscription}
            >
              <IoCreateOutline />
              تعديل الاشتراك
            </button>
          )}

          {canCancelSubscription && (
            <button
              className="cancel-subscription-button"
              type="button"
              onClick={onCancelSubscription}
            >
              <IoCloseCircleOutline />
              {cancelLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default SubscriptionMainCard;
