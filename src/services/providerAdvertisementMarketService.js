const temporaryMarketSnapshot = {
  averageAmperePrice: 155,
  providersInArea: 12,
  demandStatus: "مرتفع جداً",
  monthlyGrowthPercentage: 12,
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

export function getProviderAdvertisementMarketAnalytics(advertisements = []) {
  const activeAdvertisements = advertisements.filter(
    (advertisement) => advertisement.status === "active"
  );
  const totalViews = advertisements.reduce(
    (sum, advertisement) => sum + Number(advertisement.views || 0),
    0
  );
  const demandStatus =
    activeAdvertisements.length >= 3 || totalViews >= 1000
      ? temporaryMarketSnapshot.demandStatus
      : activeAdvertisements.length > 0
        ? "مرتفع"
        : "مستقر";

  return {
    growthLabel: `نمو بنسبة ${temporaryMarketSnapshot.monthlyGrowthPercentage}% هذا الشهر`,
    cards: [
      {
        id: "average-price",
        label: "متوسط سعر الأمبير",
        value: `${formatNumber(temporaryMarketSnapshot.averageAmperePrice)} شيكل`,
        iconKey: "wallet",
        tone: "blue",
      },
      {
        id: "providers-count",
        label: "عدد المزودين في المنطقة",
        value: `${formatNumber(temporaryMarketSnapshot.providersInArea)} مزود`,
        iconKey: "network",
        tone: "orange",
      },
      {
        id: "demand-status",
        label: "حالة الطلب",
        value: demandStatus,
        iconKey: "bolt",
        tone: "green",
      },
    ],
  };
}

export default getProviderAdvertisementMarketAnalytics;
