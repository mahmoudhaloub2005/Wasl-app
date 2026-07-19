import { useCallback, useMemo, useState } from "react";

import {
  createProviderFrontendOnlyResult,
  providerServicePendingMessage,
} from "../services/provider/providerFrontendStatus";

const emptyOverview = {
  totalGenerators: 0,
  maintenanceGenerators: 0,
  averageUsage: 0,
};

function sortGenerators(generators, sortMode) {
  const sortedGenerators = [...generators];

  if (sortMode === "usage") {
    return sortedGenerators.sort(
      (firstGenerator, secondGenerator) =>
        secondGenerator.usagePercentage - firstGenerator.usagePercentage
    );
  }

  return sortedGenerators.sort((firstGenerator, secondGenerator) => {
    const firstDate = new Date(
      firstGenerator.updatedAt || firstGenerator.createdAt || 0
    ).getTime();
    const secondDate = new Date(
      secondGenerator.updatedAt || secondGenerator.createdAt || 0
    ).getTime();

    return secondDate - firstDate;
  });
}

function selectFeaturedGenerators(generators) {
  const selectedIds = new Set();
  const maintenanceGenerators = generators.filter(
    (generator) => generator.status === "maintenance"
  );
  const highUsageGenerators = generators
    .filter((generator) => generator.status !== "maintenance")
    .sort(
      (firstGenerator, secondGenerator) =>
        secondGenerator.usagePercentage - firstGenerator.usagePercentage
    );

  return [...maintenanceGenerators, ...highUsageGenerators]
    .filter((generator) => {
      if (selectedIds.has(generator.id)) return false;
      selectedIds.add(generator.id);
      return true;
    })
    .slice(0, 2);
}

export function useProviderGenerators() {
  const [generators, setGenerators] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("recent");

  const visibleGenerators = useMemo(() => {
    const filteredGenerators =
      statusFilter === "all"
        ? generators
        : generators.filter((generator) => generator.status === statusFilter);

    return sortGenerators(filteredGenerators, sortMode);
  }, [generators, sortMode, statusFilter]);

  const featuredGenerators = useMemo(
    () => selectFeaturedGenerators(visibleGenerators),
    [visibleGenerators]
  );

  const remainingGenerators = useMemo(() => {
    const featuredIds = new Set(
      featuredGenerators.map((generator) => generator.id)
    );

    return visibleGenerators.filter((generator) => !featuredIds.has(generator.id));
  }, [featuredGenerators, visibleGenerators]);

  const runServicePendingAction = useCallback(async (actionKey) => {
    setPendingActionKey(actionKey);
    setErrorMessage(providerServicePendingMessage);
    setPendingActionKey("");

    return createProviderFrontendOnlyResult();
  }, []);

  const createGenerator = useCallback(
    async (generatorData) => {
      setErrorMessage("");
      return createProviderFrontendOnlyResult({ payload: generatorData });
    },
    []
  );

  const updateGenerator = useCallback(async (updatedGenerator) => {
    setErrorMessage(providerServicePendingMessage);

    setGenerators((currentGenerators) =>
      currentGenerators.map((generator) =>
        String(generator.id || "") === String(updatedGenerator?.id || "")
          ? { ...generator, ...updatedGenerator }
          : generator
      )
    );

    return createProviderFrontendOnlyResult({ payload: updatedGenerator });
  }, []);

  return {
    activateGenerator: (generatorId) =>
      runServicePendingAction(`activate-${generatorId}`),
    createGenerator,
    deleteGenerator: (generatorId) =>
      runServicePendingAction(`delete-${generatorId}`),
    errorMessage,
    featuredGenerators,
    generators,
    isLoading: false,
    overview: emptyOverview,
    pendingActionKey,
    placeGeneratorUnderMaintenance: (generatorId) =>
      runServicePendingAction(`maintenance-${generatorId}`),
    remainingGenerators,
    setSortMode,
    setStatusFilter,
    sortMode,
    statusFilter,
    updateGenerator,
    visibleGenerators,
  };
}

export default useProviderGenerators;