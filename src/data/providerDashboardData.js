export const providerNavigationLinks = [
  {
    id: "dashboard",
    label: "الرئيسية",
    to: "/provider/home",
    activePaths: ["/provider", "/provider/home", "/provider/dashboard"],
  },
  {
    id: "subscriptions",
    label: "المشتركين",
    to: "/provider/subscriptions",
    activePaths: ["/provider/subscriptions"],
  },
  {
    id: "generators",
    label: "المولدات",
    to: "/provider/generators",
    activePaths: ["/provider/generators"],
  },
  {
    id: "advertisements",
    label: "الإعلانات",
    to: "/provider/advertisements",
    activePaths: ["/provider/advertisements"],
  },
  {
    id: "financial",
    label: "المالية",
    to: "/provider/finance",
    activePaths: [
      "/provider/payments",
      "/provider/finance",
      "/provider/financial",
      "/provider/finance/invoices",
      "/provider/finance/payments",
      "/provider/finance/reports",
      "/provider/finance/capacity",
    ],
  },
  {
    id: "reviews",
    label: "التقييمات والشكاوى",
    to: "/provider/ratings-complaints",
    activePaths: [
      "/provider/ratings-complaints",
      "/provider/ratings",
      "/provider/reviews",
    ],
  },
];

export const providerDashboardCopy = {
  subtitle: "نظرة عامة على أداء شبكة الطاقة اليوم",
  loadingMessage: "جاري تحميل بيانات لوحة التحكم...",
  errorMessage: "تعذر تحميل بيانات لوحة التحكم. حاول مرة أخرى.",
};

export const providerStatCardsConfig = [
  {
    id: "new-requests",
    title: "طلبات اشتراك جديدة",
    unit: "طلب",
    badgeTone: "urgent",
    iconKey: "clipboard",
    iconTone: "green",
    path: "/provider/subscriptions",
    valueKey: "newSubscriptionRequests",
    badgeKey: "newSubscriptionRequestsLabel",
  },
  {
    id: "active-subscribers",
    title: "المشتركون النشطون",
    unit: "مشترك",
    badgeTone: "success",
    iconKey: "users",
    iconTone: "orange",
    path: "/provider/subscriptions?tab=current",
    valueKey: "activeSubscribers",
    badgeKey: "newSubscribersLabel",
  },
  {
    id: "monthly-income",
    title: "إجمالي الدخل هذا الشهر",
    unit: "شيكل",
    badgeTone: "success",
    iconKey: "wallet",
    iconTone: "blue",
    path: "/provider/finance",
    valueKey: "monthlyIncome",
    badgeKey: "monthlyIncomeChangeLabel",
  },
];

export const providerQuickActions = [
  {
    id: "send-notification",
    title: "إرسال إشعار",
    iconKey: "bell",
    tone: "orange",
    path: "",
  },
  {
    id: "payment-verifications",
    title: "طلبات التحقق من الدفع",
    iconKey: "receipt",
    tone: "blue",
    path: "/provider/finance/payments",
  },
  {
    id: "add-advertisement",
    title: "إضافة إعلان",
    iconKey: "bell",
    tone: "orange",
    path: "/provider/advertisements/add",
  },
];

export const providerWorkingHourPeriods = [
  {
    id: "weekly",
    label: "أسبوعي",
  },
  {
    id: "monthly",
    label: "شهري",
  },
];