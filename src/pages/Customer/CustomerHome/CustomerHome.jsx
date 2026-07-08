import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../../../components/Customer/CustomerNavbar/CustomerNavbar";
import WelcomeSection from "../../../components/Customer/WelcomeSection/WelcomeSection";
import CurrentSubscriptionCard from "../../../components/Customer/CurrentSubscriptionCard/CurrentSubscriptionCard";
import CustomerNotificationsPanel from "../../../components/Customer/CustomerNotificationsPanel/CustomerNotificationsPanel";
import CustomerMiniStats from "../../../components/Customer/CustomerMiniStats/CustomerMiniStats";
import OffersSection from "../../../components/Customer/OffersSection/OffersSection";
import Footer from "../../../components/layout/Footer/Footer";
import { getMyInvoices } from "../../../services/invoiceService";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../../../services/notificationService";
import { getMyPayments } from "../../../services/paymentService";
import {
  getCustomerSubscriptionForDisplay,
  getLocalCustomerSubscription,
} from "../../../services/subscriptionService";
import { getUserDisplayName } from "../../../utils/authStorage";

import "./CustomerHome.css";

function isCancelledSubscription(subscription) {
  const status = String(
    subscription?.status || subscription?.state || subscription?.statusLabel || ""
  ).toLowerCase();

  return Boolean(
    subscription?.isCancelled ||
      status === "cancelled" ||
      status === "canceled" ||
      status === "ملغي" ||
      status === "ملغى"
  );
}

function isDisplayableSubscription(subscription) {
  return Boolean(subscription) && !isCancelledSubscription(subscription);
}

function getBestSubscriptionForHome(serverSubscription) {
  if (isDisplayableSubscription(serverSubscription)) {
    return serverSubscription;
  }

  const localSubscription = getLocalCustomerSubscription();

  return isDisplayableSubscription(localSubscription) ? localSubscription : null;
}

function getSubscriptionGeneratorId(subscription) {
  return (
    subscription?.generatorId ||
    subscription?.generator_id ||
    subscription?.generator?.id ||
    subscription?.generator?.generator_id ||
    subscription?.generator?.generatorId ||
    null
  );
}

function CustomerHome() {
  const navigate = useNavigate();
  const userName = getUserDisplayName();

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        setNotificationsLoading(true);
        setNotificationsError("");

        const data = await getMyNotifications();

        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);

        if (isMounted) {
          setNotifications([]);
          setNotificationsError(
            error.response?.status === 404 || error.response?.status === 405
              ? ""
              : "تعذر تحميل التنبيهات من الخادم."
          );
        }
      } finally {
        if (isMounted) {
          setNotificationsLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsDashboardLoading(true);

        const [subscription, myInvoices, myPayments] = await Promise.all([
          getCustomerSubscriptionForDisplay(),
          getMyInvoices(),
          getMyPayments(),
        ]);

        if (isMounted) {
          setCurrentSubscription(getBestSubscriptionForHome(subscription));
          setInvoices(myInvoices);
          setPayments(myPayments);
        }
      } catch (error) {
        console.error("Failed to load customer dashboard data:", error);

        if (isMounted) {
          const localSubscription = getLocalCustomerSubscription();

          setCurrentSubscription(
            isDisplayableSubscription(localSubscription) ? localSubscription : null
          );
          setInvoices([]);
          setPayments([]);
        }
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const miniStats = useMemo(() => {
    const unpaidBills = invoices.filter((invoice) => invoice.status === "unpaid");
    const lastPayment = payments[0];

    const subscriptionValue = currentSubscription?.isPending
      ? "لديك طلب اشتراك قيد المراجعة"
      : currentSubscription?.isActive
        ? currentSubscription?.ampere || "اشتراك نشط"
        : currentSubscription?.statusLabel ||
          currentSubscription?.statusText ||
          currentSubscription?.status ||
          "لا يوجد اشتراك حالياً";

    return [
      {
        id: 1,
        title: "عدد الفواتير غير المدفوعة",
        value: isDashboardLoading
          ? "جاري التحميل..."
          : invoices.length
            ? `${unpaidBills.length} فاتورة`
            : "لا توجد فواتير حالياً",
        cardClass: "mini-stat-red",
        textClass: "red-text",
      },
      {
        id: 2,
        title: "آخر دفعة تم سدادها",
        value: isDashboardLoading
          ? "جاري التحميل..."
          : lastPayment?.amount || "لا توجد دفعات حالياً",
        cardClass: "mini-stat-green",
        textClass: "dark-text",
      },
      {
        id: 3,
        title: "حالة الاشتراك",
        value: isDashboardLoading ? "جاري التحميل..." : subscriptionValue,
        cardClass: "mini-stat-blue",
        textClass: "blue-text",
      },
    ];
  }, [currentSubscription, invoices, isDashboardLoading, payments]);

  const handleEditSubscription = () => {
    const generatorId = getSubscriptionGeneratorId(currentSubscription);

    if (generatorId) {
      navigate(`/customer/subscriptions/${generatorId}`);
      return;
    }

    navigate("/customer/subscriptions");
  };

  const handleViewSubscriptionDetails = () => {
    if (!currentSubscription) {
      navigate("/customer/generators");
      return;
    }

    const status = String(
      currentSubscription.status ||
        currentSubscription.state ||
        currentSubscription.statusLabel ||
        ""
    ).toLowerCase();

    const isPending =
      currentSubscription.isPending ||
      status === "pending" ||
      status === "قيد المراجعة";

    const isCancelled =
      currentSubscription.isCancelled ||
      status === "ملغي" ||
      status === "ملغي" ||
      status === "ملغي" ||
      status === "ملغى";

    if (isPending || isCancelled) {
      navigate("/customer/subscriptions");
      return;
    }

    const generatorId = getSubscriptionGeneratorId(currentSubscription);

    if (!generatorId) {
      navigate("/customer/subscriptions");
      return;
    }

    navigate(`/customer/generator-details/${generatorId}`, {
      state: {
        generator: currentSubscription.generator || {
          id: generatorId,
          name: currentSubscription.generatorName,
          generatorName: currentSubscription.generatorName,
          type: currentSubscription.generatorType,
          generatorType: currentSubscription.generatorType,
        },
      },
    });
  };

  const handleShowAllNotifications = () => {
    navigate("/customer/notifications");
  };

  const handleMarkNotificationAsRead = async (notification) => {
    if (!notification?.id || notification.isRead) return;

    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    );

    try {
      await markNotificationAsRead(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id ? { ...item, isRead: false } : item
        )
      );
    }
  };

  const handleViewAllOffers = () => {
    navigate("/customer/offers/2");
  };

  const handleViewOfferDetails = (offerId) => {
    navigate(`/customer/offers/${offerId}`);
  };

  return (
    <div className="customer-home-page" dir="rtl">
      <CustomerNavbar />

      <main className="customer-home-container">
        <WelcomeSection userName={userName} />

        <div className="customer-dashboard-layout">
          <aside className="customer-dashboard-left">
            <CustomerNotificationsPanel
              notifications={notifications}
              loading={notificationsLoading}
              errorMessage={notificationsError}
              onMarkAsRead={handleMarkNotificationAsRead}
              onShowAllNotifications={handleShowAllNotifications}
            />

            <CustomerMiniStats stats={miniStats} />
          </aside>

          <section className="customer-dashboard-right">
            <CurrentSubscriptionCard
              subscription={currentSubscription}
              loading={isDashboardLoading}
              onEditSubscription={handleEditSubscription}
              onViewDetails={handleViewSubscriptionDetails}
            />

            <OffersSection
              onViewAllOffers={handleViewAllOffers}
              onViewOfferDetails={handleViewOfferDetails}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerHome;
