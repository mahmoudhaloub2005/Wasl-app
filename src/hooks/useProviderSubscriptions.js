import { useCallback, useState } from "react";

import { providerServicePendingMessage } from "../services/provider/providerFrontendStatus";

const emptySubscriptionsState = {
  pendingRequests: [],
  currentSubscribers: [],
};

export function useProviderSubscriptions() {
  const [subscriptionsData] = useState(emptySubscriptionsState);
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const runServicePendingAction = useCallback(async (actionKey) => {
    setPendingActionKey(actionKey);
    setErrorMessage(providerServicePendingMessage);
    setPendingActionKey("");
  }, []);

  return {
    acceptRequest: (requestId) => runServicePendingAction(`accept-${requestId}`),
    currentSubscribers: subscriptionsData.currentSubscribers,
    errorMessage,
    isLoading: false,
    pendingActionKey,
    pendingRequests: subscriptionsData.pendingRequests,
    rejectRequest: (requestId) => runServicePendingAction(`reject-${requestId}`),
  };
}

export default useProviderSubscriptions;