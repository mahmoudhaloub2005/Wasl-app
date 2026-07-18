import { useMemo, useState } from "react";

import { getProviderAdvertisementMarketAnalytics } from "../services/providerAdvertisementMarketService";
import providerAdvertisementsService from "../services/providerAdvertisementsService";

function buildOverview(advertisements) {
  const totalAdvertisements = advertisements.length;
  const activeAdvertisements = advertisements.filter(
    (advertisement) => advertisement.status === "active"
  ).length;
  const expiredAdvertisements = Math.max(
    0,
    totalAdvertisements - activeAdvertisements
  );
  const totalViews = advertisements.reduce(
    (sum, advertisement) => sum + Number(advertisement.views || 0),
    0
  );
  const formattedViews = new Intl.NumberFormat("en-US").format(totalViews);

  return {
    activeAdvertisements,
    expiredAdvertisements,
    reachSentence: totalAdvertisements
      ? `إعلاناتك وصلت إلى ${formattedViews} مشاهدة حتى الآن.`
      : "ابدأ بنشر إعلانك الأول لمتابعة مدى الوصول هنا.",
    totalAdvertisements,
    totalViews,
  };
}

function getErrorMessage(error) {
  return error?.message || "تعذر تنفيذ العملية. حاول مرة أخرى.";
}

export function useProviderAdvertisements(
  advertisementsService = providerAdvertisementsService
) {
  const [advertisements, setAdvertisements] = useState(() =>
    advertisementsService.getProviderAdvertisementsSnapshot()
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  function refreshAdvertisements() {
    setAdvertisements(advertisementsService.getProviderAdvertisementsSnapshot());
  }

  async function runAction(actionKey, action) {
    setErrorMessage("");
    setPendingActionKey(actionKey);

    try {
      const result = await action();
      refreshAdvertisements();
      return result;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setPendingActionKey("");
    }
  }

  const overview = useMemo(
    () => buildOverview(advertisements),
    [advertisements]
  );
  const marketAnalytics = useMemo(
    () => getProviderAdvertisementMarketAnalytics(advertisements),
    [advertisements]
  );

  return {
    advertisements,
    createAdvertisement: (advertisementData, options) =>
      runAction("create", () =>
        advertisementsService.createProviderAdvertisement(
          advertisementData,
          options
        )
      ),
    deleteAdvertisement: (advertisementId) =>
      runAction(`delete-${advertisementId}`, () =>
        advertisementsService.deleteProviderAdvertisement(advertisementId)
      ),
    errorMessage,
    marketAnalytics,
    overview,
    pendingActionKey,
    toggleAdvertisementStatus: (advertisementId) =>
      runAction(`status-${advertisementId}`, () =>
        advertisementsService.toggleProviderAdvertisementStatus(advertisementId)
      ),
    updateAdvertisement: (advertisementId, advertisementData) =>
      runAction(`edit-${advertisementId}`, () =>
        advertisementsService.updateProviderAdvertisement(
          advertisementId,
          advertisementData
        )
      ),
  };
}

export default useProviderAdvertisements;
