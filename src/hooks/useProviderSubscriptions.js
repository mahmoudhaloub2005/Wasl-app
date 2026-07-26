import { useCallback, useEffect, useState } from "react";

import {
  acceptProviderSubscriptionRequest,
  getProviderSubscriptionRequests,
  getProviderSubscriptions,
  rejectProviderSubscriptionRequest,
} from "../services/providerSubscriptionsService";

function getErrorMessage(error, fallback = "تعذر تنفيذ العملية. حاول مرة أخرى.") {
  return error?.displayMessage || error?.message || fallback;
}

export function useProviderSubscriptions() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentSubscribers, setCurrentSubscribers] = useState([]);
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refreshSubscriptions = useCallback(async () => {
    const [requests, subscribers] = await Promise.all([
      getProviderSubscriptionRequests(),
      getProviderSubscriptions(),
    ]);

    setPendingRequests(requests);
    setCurrentSubscribers(subscribers);

    return { requests, subscribers };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptions() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const { requests, subscribers } = await refreshSubscriptions();

        if (isMounted) {
          setPendingRequests(requests);
          setCurrentSubscribers(subscribers);
        }
      } catch (error) {
        if (isMounted) {
          setPendingRequests([]);
          setCurrentSubscribers([]);
          setErrorMessage(getErrorMessage(error, "تعذر تحميل المشتركين من الخادم."));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSubscriptions();

    return () => {
      isMounted = false;
    };
  }, [refreshSubscriptions]);

  async function runAction(actionKey, action, successMessage) {
    setPendingActionKey(actionKey);
    setErrorMessage("");

    try {
      await action();
      await refreshSubscriptions();
      return { message: successMessage };
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setPendingActionKey("");
    }
  }

  return {
    acceptRequest: (requestId) =>
      runAction(
        `accept-${requestId}`,
        () => acceptProviderSubscriptionRequest(requestId),
        "تم قبول طلب الاشتراك بنجاح."
      ),
    currentSubscribers,
    errorMessage,
    isLoading,
    pendingActionKey,
    pendingRequests,
    refreshSubscriptions,
    rejectRequest: (requestId) =>
      runAction(
        `reject-${requestId}`,
        () => rejectProviderSubscriptionRequest(requestId),
        "تم رفض طلب الاشتراك."
      ),
  };
}

export default useProviderSubscriptions;
