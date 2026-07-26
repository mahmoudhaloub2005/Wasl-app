import { useCallback, useEffect, useMemo, useState } from "react";

import {
  activateProviderGenerator,
  createProviderGenerator,
  deleteProviderGenerator,
  getProviderGenerators,
  getProviderGeneratorsOverview,
  placeProviderGeneratorUnderMaintenance,
  updateProviderGenerator,
} from "../services/providerGeneratorsService";

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
    const firstDate = new Date(firstGenerator.updatedAt || firstGenerator.createdAt || 0).getTime();
    const secondDate = new Date(secondGenerator.updatedAt || secondGenerator.createdAt || 0).getTime();

    return secondDate - firstDate;
  });
}

function selectFeaturedGenerators(generators) {
  const selectedIds = new Set();
  const maintenanceGenerators = generators.filter((generator) => generator.status === "maintenance");
  const highUsageGenerators = generators
    .filter((generator) => generator.status !== "maintenance")
    .sort((firstGenerator, secondGenerator) => secondGenerator.usagePercentage - firstGenerator.usagePercentage);

  return [...maintenanceGenerators, ...highUsageGenerators]
    .filter((generator) => {
      if (selectedIds.has(generator.id)) return false;
      selectedIds.add(generator.id);
      return true;
    })
    .slice(0, 2);
}

function getErrorMessage(error, fallback = "تعذر تنفيذ العملية. حاول مرة أخرى.") {
  return error?.displayMessage || error?.message || fallback;
}

export function useProviderGenerators() {
  const [generators, setGenerators] = useState([]);
  const [overview, setOverview] = useState(emptyOverview);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("recent");

  const refreshGenerators = useCallback(async () => {
    setErrorMessage("");
    const [nextGenerators, nextOverview] = await Promise.all([
      getProviderGenerators(),
      getProviderGeneratorsOverview(),
    ]);

    setGenerators(nextGenerators);
    setOverview(nextOverview);
    return nextGenerators;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadGenerators() {
      try {
        setIsLoading(true);
        const [nextGenerators, nextOverview] = await Promise.all([
          getProviderGenerators(),
          getProviderGeneratorsOverview(),
        ]);

        if (isMounted) {
          setGenerators(nextGenerators);
          setOverview(nextOverview);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setGenerators([]);
          setOverview(emptyOverview);
          setErrorMessage(getErrorMessage(error, "تعذر تحميل المولدات من الخادم."));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadGenerators();

    return () => {
      isMounted = false;
    };
  }, []);

  const runMutation = useCallback(async (actionKey, mutation, successMessage) => {
    setPendingActionKey(actionKey);
    setErrorMessage("");

    try {
      const result = await mutation();
      await refreshGenerators();
      return {
        message: successMessage,
        ...result,
      };
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setPendingActionKey("");
    }
  }, [refreshGenerators]);

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
    const featuredIds = new Set(featuredGenerators.map((generator) => generator.id));

    return visibleGenerators.filter((generator) => !featuredIds.has(generator.id));
  }, [featuredGenerators, visibleGenerators]);

  const createGenerator = useCallback(
    (generatorData) =>
      runMutation(
        "create",
        () => createProviderGenerator(generatorData),
        "تم حفظ المولد بنجاح."
      ),
    [runMutation]
  );

  const updateGenerator = useCallback(
    (updatedGenerator) =>
      runMutation(
        `edit-${updatedGenerator?.id}`,
        () => updateProviderGenerator(updatedGenerator.id, updatedGenerator),
        "تم حفظ تعديلات المولد بنجاح."
      ),
    [runMutation]
  );

  return {
    activateGenerator: (generatorId) =>
      runMutation(
        `activate-${generatorId}`,
        () => activateProviderGenerator(generatorId),
        "تم تفعيل المولد بنجاح."
      ),
    createGenerator,
    deleteGenerator: (generatorId) =>
      runMutation(
        `delete-${generatorId}`,
        () => deleteProviderGenerator(generatorId),
        "تم حذف المولد بنجاح."
      ),
    errorMessage,
    featuredGenerators,
    generators,
    isLoading,
    overview,
    pendingActionKey,
    placeGeneratorUnderMaintenance: (generatorId) =>
      runMutation(
        `maintenance-${generatorId}`,
        () => placeProviderGeneratorUnderMaintenance(generatorId),
        "تم تحديث حالة المولد بنجاح."
      ),
    refreshGenerators,
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


