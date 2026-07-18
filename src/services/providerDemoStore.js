const providerRecordsByAccount = new Map();
const providerStoreListeners = new Set();

function createEmptyProviderRecords(accountKey) {
  return {
    accountKey,
    subscriptionRequests: [],
    subscriptions: [],
    payments: [],
    generators: [],
    activities: [],
    notifications: [],
    workingHours: [],
  };
}

export function getProviderDemoRecords(accountKey) {
  if (!providerRecordsByAccount.has(accountKey)) {
    providerRecordsByAccount.set(
      accountKey,
      createEmptyProviderRecords(accountKey)
    );
  }

  return providerRecordsByAccount.get(accountKey);
}

function emitProviderDemoStoreChange(accountKey) {
  providerStoreListeners.forEach((listener) => {
    listener(accountKey);
  });
}

export function updateProviderDemoRecords(accountKey, updater) {
  const currentRecords = getProviderDemoRecords(accountKey);
  const nextRecords = updater(currentRecords) || currentRecords;

  providerRecordsByAccount.set(accountKey, {
    ...currentRecords,
    ...nextRecords,
    accountKey,
  });

  emitProviderDemoStoreChange(accountKey);

  return providerRecordsByAccount.get(accountKey);
}

export function resetProviderDemoRecords(accountKey) {
  providerRecordsByAccount.set(accountKey, createEmptyProviderRecords(accountKey));
  emitProviderDemoStoreChange(accountKey);

  return providerRecordsByAccount.get(accountKey);
}

export function clearAllProviderDemoRecords() {
  providerRecordsByAccount.clear();
  emitProviderDemoStoreChange("");
}

export function subscribeProviderDemoStore(listener) {
  providerStoreListeners.add(listener);

  return () => {
    providerStoreListeners.delete(listener);
  };
}
