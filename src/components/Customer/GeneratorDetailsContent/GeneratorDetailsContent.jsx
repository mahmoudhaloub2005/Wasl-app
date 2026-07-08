import "./GeneratorDetailsContent.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiActivity,
  FiFileText,
  FiMail,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { getGeneratorDetails } from "../../../services/generatorService";
import {
  deleteSubscription,
  getMySubscriptionForGenerator,
  updateSubscription,
} from "../../../services/subscriptionService";
import { getApiErrorMessage } from "../../../utils/apiError";

import EditSubscriptionModal from "../Subscription/EditSubscriptionModal";

import providerUser from "../../../assets/customer/fgp/icons/provider-user.svg";
import providerLocationIcon from "../../../assets/customer/fgp/icons/provider-location.svg";
import providerPhone from "../../../assets/customer/fgp/icons/provider-phone.svg";
import sectionDescription from "../../../assets/customer/fgp/icons/section-description.svg";
import termsIcon from "../../../assets/customer/fgp/icons/terms-icon.svg";
import checkCircle from "../../../assets/customer/fgp/icons/check-circle.svg";
import reviewsIcon from "../../../assets/customer/fgp/icons/reviews-icon.svg";
import reviewAvatar from "../../../assets/customer/fgp/images/review-avatar.png";

function GeneratorDetailsContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [generator, setGenerator] = useState(null);
  const [generatorSubscription, setGeneratorSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGenerator() {
      try {
        setLoading(true);

        const [data, subscription] = await Promise.all([
          getGeneratorDetails(id),
          getMySubscriptionForGenerator(id).catch((error) => {
            console.error("Failed to load generator subscription:", error);
            return null;
          }),
        ]);

        if (isMounted) {
          setGenerator(data?.id ? data : null);
          setGeneratorSubscription(subscription);
        }
      } catch (error) {
        console.error("Failed to load generator details:", error);

        if (isMounted) {
          setGenerator(null);
          setGeneratorSubscription(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGenerator();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const hasPendingRequest = Boolean(generatorSubscription?.isPending);
  const hasActiveSubscription = Boolean(generatorSubscription?.isActive);
  const hasSubscriptionForGenerator = hasPendingRequest || hasActiveSubscription;

  const subscriptionNotice = hasPendingRequest
    ? "لديك طلب اشتراك قيد المراجعة في هذا المولد"
    : hasActiveSubscription
      ? "أنت مشترك حالياً في هذا المولد"
      : "";

  const cancelButtonLabel = hasPendingRequest
    ? "إلغاء طلب الاشتراك"
    : "إلغاء الاشتراك";

  const subscriptionDetails = [
    {
      label: "عدد الأمبيرات",
      value:
        generatorSubscription?.ampere ||
        (generatorSubscription?.ampereValue
          ? `${generatorSubscription.ampereValue} أمبير`
          : ""),
    },
    {
      label: "خطة الدفع",
      value:
        generatorSubscription?.paymentPlanText ||
        getPaymentPlanText(generatorSubscription?.paymentPlan),
    },
    {
      label: "الحالة",
      value: getSubscriptionStatusText(generatorSubscription),
    },
    {
      label: hasPendingRequest ? "تاريخ الطلب" : "تاريخ البدء",
      value:
        generatorSubscription?.requestDate ||
        generatorSubscription?.startDate ||
        "",
    },
  ].filter((item) => item.value);

  const handleConfirmEdit = async ({ ampere, paymentPlan }) => {
    if (!generatorSubscription?.id) return;

    try {
      const updatedSubscription = await updateSubscription(
        generatorSubscription.id,
        {
          amperes: ampere,
          payment_plan: paymentPlan,
        }
      );

      if (updatedSubscription) {
        setGeneratorSubscription(updatedSubscription);
      } else {
        setGeneratorSubscription((current) => ({
          ...current,
          ampereValue: ampere,
          ampere: `${ampere} أمبير`,
          paymentPlan,
          paymentPlanText:
            paymentPlan === "monthly" ? "شهرياً" : "كل أسبوعين",
        }));
      }

      setIsEditOpen(false);
      setActionMessage("تم تعديل الاشتراك بنجاح.");
    } catch (error) {
      console.error("Failed to update subscription:", error);

      const fallbackMessage =
        error.response?.status === 405
          ? "تعديل الاشتراك غير مدعوم حالياً من الخادم."
          : "تعذر تعديل الاشتراك على الخادم. حاول مرة أخرى.";

      setActionMessage(getApiErrorMessage(error, fallbackMessage));

      throw error;
    }
  };

  const handleConfirmCancel = async () => {
    if (!generatorSubscription?.id || isCanceling) return;

    try {
      setIsCanceling(true);

      await deleteSubscription(generatorSubscription.id);

      setGeneratorSubscription(null);
      setIsCancelOpen(false);
      setIsEditOpen(false);

      setActionMessage(
        hasPendingRequest
          ? "تم إلغاء طلب الاشتراك بنجاح."
          : "تم إلغاء الاشتراك بنجاح."
      );
    } catch (error) {
      console.error("Failed to cancel subscription:", error);

      setActionMessage(
        getApiErrorMessage(
          error,
          "تعذر إلغاء الاشتراك على الخادم. حاول مرة أخرى."
        )
      );
    } finally {
      setIsCanceling(false);
    }
  };

  if (loading && !generator) {
    return (
      <main className="generator-details-content" dir="rtl">
        <div className="generator-details-container">
          <div className="details-empty-state">
            <h2>جاري تحميل بيانات المولد...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (!generator) {
    return (
      <main className="generator-details-content" dir="rtl">
        <div className="generator-details-container">
          <div className="details-empty-state">
            <h2>هذا المولد غير متاح حالياً</h2>
          </div>
        </div>
      </main>
    );
  }

  const terms = Array.isArray(generator.terms) ? generator.terms : [];
  const review = generator.review || {};
  const provider = generator.provider || {};
  const providerLocationText = getProviderLocationText(provider);
  const providerRows = [
    {
      label: "الاسم",
      value: provider.name,
      icon: <img src={providerUser} alt="" />,
    },
    {
      label: "الهاتف",
      value: provider.phone,
      icon: <img src={providerPhone} alt="" />,
    },
    {
      label: "المنطقة / العنوان",
      value: providerLocationText,
      icon: <img src={providerLocationIcon} alt="" />,
    },
    {
      label: "البريد الإلكتروني",
      value: provider.email,
      icon: <FiMail />,
    },
    {
      label: "الوصف",
      value: provider.description,
      icon: <FiFileText />,
      isWide: true,
    },
    {
      label: "عدد المشتركين",
      value: provider.subscribersCount,
      icon: <FiUsers />,
    },
    {
      label: "تقييم المزود",
      value: provider.rating,
      icon: <FiStar />,
    },
    {
      label: "الحالة",
      value: provider.status,
      icon: <FiActivity />,
    },
  ];
  const availableProviderRows = providerRows.filter((row) =>
    hasProviderValue(row.value)
  );

  return (
    <main className="generator-details-content" dir="rtl">
      <div className="generator-details-container">
        <aside className="generator-details-sidebar">
          <div className="generator-details-subscription-card">
            {generator.priceText && (
              <div className="subscription-price">
                <span>السعر لكل أمبير</span>
                <h2>{generator.priceText}</h2>
              </div>
            )}

            {generator.capacity && (
              <div className="subscription-capacity">
                <div className="capacity-text">
                  <span>القدرة المتاحة</span>
                  <strong>{generator.capacity}</strong>
                </div>

                <div className="capacity-progress">
                  <span></span>
                </div>
              </div>
            )}

            {hasSubscriptionForGenerator ? (
              <div className="generator-subscription-status-box">
                <p className="subscription-action-message">
                  {subscriptionNotice}
                </p>

                {subscriptionDetails.length > 0 && (
                  <div className="generator-subscription-details">
                    {subscriptionDetails.map((item) => (
                      <div key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {actionMessage && (
                  <p className="subscription-action-message">
                    {actionMessage}
                  </p>
                )}

                <button
                  className="subscribe-button"
                  type="button"
                  onClick={() => navigate("/customer/subscriptions")}
                >
                  عرض الاشتراك
                </button>

                <button
                  className="generator-edit-subscription-button"
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                >
                  تعديل الاشتراك
                </button>

                <button
                  className="generator-cancel-subscription-button"
                  type="button"
                  onClick={() => setIsCancelOpen(true)}
                >
                  {cancelButtonLabel}
                </button>
              </div>
            ) : (
              <button
                className="subscribe-button"
                type="button"
                onClick={() =>
                  navigate(`/customer/subscriptions/${generator.id}`, {
                    state: { openNewSubscription: true },
                  })
                }
              >
                اشترك الآن
              </button>
            )}
          </div>

          <div className="provider-card">
            <h3>معلومات المزود</h3>

            {provider.hasProviderInfo && availableProviderRows.length > 0 ? (
              <div className="provider-info-list">
                {availableProviderRows.map((row) => (
                  <div
                    className={`provider-row ${row.isWide ? "wide" : ""}`}
                    key={row.label}
                  >
                    <span className="provider-row-icon">{row.icon}</span>
                    <div className="provider-row-text">
                      <span>{row.label}</span>
                      <p>{String(row.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="provider-empty-message">
                لا توجد معلومات مزود لهذا المولد
              </p>
            )}
          </div>
        </aside>

        <section className="generator-details-main">
          <section className="generator-details-hero">
            {generator.image && (
              <img src={generator.image} alt={generator.name || "المولد"} />
            )}

            <div className="generator-details-hero-overlay"></div>

            <div className="generator-details-hero-content">
              <div className="generator-details-hero-location">
                {generator.status && (
                  <span className="online-badge">{generator.status}</span>
                )}
                {generator.generatorType && (
                  <span>{generator.generatorType}</span>
                )}
                {generator.location && <span>{generator.location}</span>}
              </div>

              <h1>
                {generator.name || generator.generatorType || "تفاصيل المولد"}
              </h1>

              {generator.shortDescription && (
                <p>{generator.shortDescription}</p>
              )}
            </div>
          </section>

          {generator.serviceDescription && (
            <section className="details-block">
              <div className="details-title">
                <img src={sectionDescription} alt="" />
                <h2>وصف الخدمة</h2>
              </div>

              <div className="description-card">
                <p>{generator.serviceDescription}</p>
              </div>
            </section>
          )}

          {terms.length > 0 && (
            <section className="details-block terms-block">
              <div className="details-title">
                <img src={termsIcon} alt="" />
                <h2>شروط الاشتراك</h2>
              </div>

              <div className="terms-card">
                {terms.map((term, index) => (
                  <div className="term-row" key={`${term}-${index}`}>
                    <img src={checkCircle} alt="" />
                    <p>{term}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(review.text || generator.rating) && (
            <section className="details-block reviews-block">
              <div className="reviews-header">
                <div className="details-title">
                  <img src={reviewsIcon} alt="" />
                  <h2>آراء المشتركين</h2>
                </div>

                {generator.rating && (
                  <div className="rating">
                    <strong>{generator.rating}</strong>
                  </div>
                )}
              </div>

              {review.text && (
                <div className="review-card">
                  <div className="review-person">
                    <img
                      src={reviewAvatar}
                      alt={review.userName || "مشترك"}
                    />

                    <div>
                      {review.userName && <h4>{review.userName}</h4>}
                      <p>{review.text}</p>
                    </div>
                  </div>

                  {review.date && (
                    <span className="review-date">{review.date}</span>
                  )}
                </div>
              )}
            </section>
          )}
        </section>
      </div>

      {isEditOpen && generatorSubscription && (
        <EditSubscriptionModal
          subscription={generatorSubscription}
          onClose={() => setIsEditOpen(false)}
          onConfirm={handleConfirmEdit}
        />
      )}

      {isCancelOpen && generatorSubscription && (
        <div className="generator-cancel-backdrop" role="presentation">
          <section
            className="generator-cancel-dialog"
            role="dialog"
            aria-modal="true"
          >
            <h2>{cancelButtonLabel}</h2>
            <p>هل أنت متأكد من تنفيذ هذه العملية؟</p>

            <div className="generator-cancel-actions">
              <button type="button" onClick={() => setIsCancelOpen(false)}>
                تراجع
              </button>

              <button
                className="danger"
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCanceling}
              >
                {isCanceling ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function getPaymentPlanText(paymentPlan) {
  const normalizedPlan = String(paymentPlan || "").toLowerCase();

  if (normalizedPlan === "monthly") return "شهرياً";
  if (normalizedPlan === "biweekly") return "كل أسبوعين";
  if (normalizedPlan === "weekly") return "أسبوعي";

  return "";
}

function getSubscriptionStatusText(subscription) {
  if (!subscription) return "";

  if (subscription.statusLabel) return subscription.statusLabel;
  if (subscription.isPending) return "قيد المراجعة";
  if (subscription.isActive) return "نشط";
  if (subscription.isRejected) return "مرفوض";
  if (subscription.isCancelled) return "ملغي";

  return "";
}

function hasProviderValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function getProviderLocationText(provider = {}) {
  const area = hasProviderValue(provider.area) ? String(provider.area) : "";
  const address = hasProviderValue(provider.address)
    ? String(provider.address)
    : "";

  if (area && address && area !== address) {
    return `${area} - ${address}`;
  }

  return area || address;
}

export default GeneratorDetailsContent;
