import { useCallback, useEffect, useState } from "react";

import providerSubscriptionsService from "../services/providerSubscriptionsService";
import { subscribeProviderDemoStore } from "../services/providerDemoStore";

const emptySubscriptionsState = {
  pendingRequests: [],
  currentSubscribers: [],
};

function getErrorMessage(error) {
  return error?.message || "تعذر تحميل بيانات المشتركين. حاول مرة أخرى.";
}

export function useProviderSubscriptions(
  subscriptionsService = providerSubscriptionsService
) {
  const [subscriptionsData, setSubscriptionsData] = useState(
    emptySubscriptionsState
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  const fetchSubscriptionsData = useCallback(async () => {
    const [pendingRequests, currentSubscribers] = await Promise.all([
      subscriptionsService.getProviderSubscriptionRequests(),
      subscriptionsService.getProviderSubscriptions(),
    ]);

    return {
      pendingRequests,
      currentSubscribers,
    };
  }, [subscriptionsService]);

  const refreshSubscriptionsData = useCallback(async () => {
    try {
      const nextSubscriptionsData = await fetchSubscriptionsData();

      setSubscriptionsData(nextSubscriptionsData);
      setErrorMessage("");
    } catch (error) {
      setSubscriptionsData(emptySubscriptionsState);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubscriptionsData]);

  useEffect(() => {
    let isMounted = true;

    fetchSubscriptionsData()
      .then((nextSubscriptionsData) => {
        if (isMounted) {
          setSubscriptionsData(nextSubscriptionsData);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (isMounted) {
          setSubscriptionsData(emptySubscriptionsState);
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchSubscriptionsData]);

  useEffect(() => {
    return subscribeProviderDemoStore(() => {
      refreshSubscriptionsData();
    });
  }, [refreshSubscriptionsData]);

  const acceptRequest = useCallback(
    async (requestId) => {
      try {
        setPendingActionKey(`accept-${requestId}`);
        setErrorMessage("");
        await subscriptionsService.acceptProviderSubscriptionRequest(requestId);
        await refreshSubscriptionsData();
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setPendingActionKey("");
      }
    },
    [refreshSubscriptionsData, subscriptionsService]
  );

  const rejectRequest = useCallback(
    async (requestId) => {
      try {
        setPendingActionKey(`reject-${requestId}`);
        setErrorMessage("");
        await subscriptionsService.rejectProviderSubscriptionRequest(requestId);
        await refreshSubscriptionsData();
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setPendingActionKey("");
      }
    },
    [refreshSubscriptionsData, subscriptionsService]
  );

  return {
    acceptRequest,
    currentSubscribers: subscriptionsData.currentSubscribers,
    errorMessage,
    isLoading,
    pendingActionKey,
    pendingRequests: subscriptionsData.pendingRequests,
    rejectRequest,
  };
}

export default useProviderSubscriptions;
