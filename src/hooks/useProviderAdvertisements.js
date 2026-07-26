import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getMarketAnalyticsErrorState,
  getMarketAnalyticsLoadingState,
  getProviderAdvertisementMarketAnalytics,
} from "../services/providerAdvertisementMarketService";
import providerAdvertisementsService from "../services/providerAdvertisementsService";
import { AUTH_USER_UPDATED_EVENT } from "../utils/authStorage";

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
  const formattedViews = new Intl.NumberFormat("ar").format(totalViews);

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
  return (
    error?.displayMessage ||
    error?.message ||
    "تعذر تنفيذ العملية. حاول مرة أخرى."
  );
}

function isCanceledRequest(error) {
  return error?.code === "ERR_CANCELED" || error?.name === "CanceledError";
}

export function useProviderAdvertisements(
  advertisementsService = providerAdvertisementsService
) {
  const analyticsRequestIdRef = useRef(0);
  const [advertisements, setAdvertisements] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [marketAnalytics, setMarketAnalytics] = useState(() =>
    getMarketAnalyticsLoadingState()
  );
  const [marketAnalyticsRefreshKey, setMarketAnalyticsRefreshKey] = useState(0);

  const refreshMarketAnalytics = useCallback(() => {
    setMarketAnalytics(getMarketAnalyticsLoadingState());
    setMarketAnalyticsRefreshKey((key) => key + 1);
  }, []);

  const refreshAdvertisements = useCallback(async () => {
    const nextAdvertisements = await advertisementsService.getProviderAdvertisements();
    setAdvertisements(nextAdvertisements);
    return nextAdvertisements;
  }, [advertisementsService]);

  useEffect(() => {
    let isMounted = true;

    async function loadAdvertisements() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const nextAdvertisements =
          await advertisementsService.getProviderAdvertisements();

        if (isMounted) {
          setAdvertisements(nextAdvertisements);
        }
      } catch (error) {
        if (isMounted) {
          setAdvertisements([]);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdvertisements();

    return () => {
      isMounted = false;
    };
  }, [advertisementsService]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = analyticsRequestIdRef.current + 1;
    analyticsRequestIdRef.current = requestId;

    getProviderAdvertisementMarketAnalytics({ signal: controller.signal })
      .then((nextAnalytics) => {
        if (analyticsRequestIdRef.current === requestId) {
          setMarketAnalytics(nextAnalytics);
        }
      })
      .catch((error) => {
        if (isCanceledRequest(error) || analyticsRequestIdRef.current !== requestId) {
          return;
        }

        setMarketAnalytics(getMarketAnalyticsErrorState(error));
      });

    return () => {
      controller.abort();
    };
  }, [marketAnalyticsRefreshKey]);

  useEffect(() => {
    window.addEventListener(AUTH_USER_UPDATED_EVENT, refreshMarketAnalytics);
    window.addEventListener("storage", refreshMarketAnalytics);

    return () => {
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, refreshMarketAnalytics);
      window.removeEventListener("storage", refreshMarketAnalytics);
    };
  }, [refreshMarketAnalytics]);

  async function runAction(actionKey, action) {
    setErrorMessage("");
    setPendingActionKey(actionKey);

    try {
      const result = await action();
      await refreshAdvertisements();
      refreshMarketAnalytics();
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
    isLoading,
    marketAnalytics,
    overview,
    pendingActionKey,
    refreshAdvertisements,
    refreshMarketAnalytics,
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
