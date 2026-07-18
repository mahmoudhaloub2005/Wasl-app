import { useCallback, useEffect, useMemo, useState } from "react";

import providerGeneratorsService from "../services/providerGeneratorsService";
import { subscribeProviderDemoStore } from "../services/providerDemoStore";

const emptyOverview = {
  totalGenerators: 0,
  maintenanceGenerators: 0,
  averageUsage: 0,
};

const emptyGeneratorState = {
  generators: [],
  overview: emptyOverview,
};

function getErrorMessage(error) {
  return error?.message || "ط·ع¾ط·آ¹ط·آ°ط·آ± ط·ع¾ط·آ­ط¸â€¦ط¸ظ¹ط¸â€‍ ط·آ¨ط¸ظ¹ط·آ§ط¸â€ ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط¸â€‍ط·آ¯ط·آ§ط·ع¾. ط·آ­ط·آ§ط¸ث†ط¸â€‍ ط¸â€¦ط·آ±ط·آ© ط·آ£ط·آ®ط·آ±ط¸â€°.";
}

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

function calculateOverview(generators) {
  const totalGenerators = generators.length;
  const maintenanceGenerators = generators.filter(
    (generator) => generator.status === "maintenance"
  ).length;
  const averageUsage = totalGenerators
    ? Math.round(
        generators.reduce(
          (total, generator) => total + Number(generator.usagePercentage || 0),
          0
        ) / totalGenerators
      )
    : 0;

  return {
    totalGenerators,
    maintenanceGenerators,
    averageUsage,
  };
}

function upsertGenerator(generators, nextGenerator) {
  const nextGeneratorId = String(nextGenerator.id || "");
  const existingIndex = generators.findIndex(
    (generator) => String(generator.id || "") === nextGeneratorId
  );

  if (existingIndex === -1) {
    return [nextGenerator, ...generators];
  }

  return generators.map((generator, index) =>
    index === existingIndex ? nextGenerator : generator
  );
}

export function useProviderGenerators(
  generatorsService = providerGeneratorsService
) {
  const [generatorState, setGeneratorState] = useState(emptyGeneratorState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("recent");

  const fetchGeneratorData = useCallback(async () => {
    const [generators, overview] = await Promise.all([
      generatorsService.getProviderGenerators(),
      generatorsService.getProviderGeneratorsOverview(),
    ]);

    return {
      generators,
      overview,
    };
  }, [generatorsService]);

  const refreshGeneratorData = useCallback(async () => {
    try {
      const nextGeneratorState = await fetchGeneratorData();

      setGeneratorState(nextGeneratorState);
      setErrorMessage("");
    } catch (error) {
      setGeneratorState(emptyGeneratorState);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [fetchGeneratorData]);

  useEffect(() => {
    let isMounted = true;

    fetchGeneratorData()
      .then((nextGeneratorState) => {
        if (isMounted) {
          setGeneratorState(nextGeneratorState);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (isMounted) {
          setGeneratorState(emptyGeneratorState);
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
  }, [fetchGeneratorData]);

  useEffect(() => {
    return subscribeProviderDemoStore(() => {
      refreshGeneratorData();
    });
  }, [refreshGeneratorData]);

  const visibleGenerators = useMemo(() => {
    const filteredGenerators =
      statusFilter === "all"
        ? generatorState.generators
        : generatorState.generators.filter(
            (generator) => generator.status === statusFilter
          );

    return sortGenerators(filteredGenerators, sortMode);
  }, [generatorState.generators, sortMode, statusFilter]);

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

  const deleteGenerator = useCallback(
    async (generatorId) => {
      try {
        setPendingActionKey(`delete-${generatorId}`);
        setErrorMessage("");
        await generatorsService.deleteProviderGenerator(generatorId);
        await refreshGeneratorData();
      } catch (error) {
        const message = getErrorMessage(error);
        const deleteError = new Error(message);

        deleteError.cause = error;
        setErrorMessage(message);
        throw deleteError;
      } finally {
        setPendingActionKey("");
      }
    },
    [generatorsService, refreshGeneratorData]
  );

  const activateGenerator = useCallback(
    async (generatorId) => {
      try {
        setPendingActionKey(`activate-${generatorId}`);
        setErrorMessage("");
        await generatorsService.activateProviderGenerator(generatorId);
        await refreshGeneratorData();
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setPendingActionKey("");
      }
    },
    [generatorsService, refreshGeneratorData]
  );

  const placeGeneratorUnderMaintenance = useCallback(
    async (generatorId) => {
      try {
        setPendingActionKey(`maintenance-${generatorId}`);
        setErrorMessage("");
        await generatorsService.placeProviderGeneratorUnderMaintenance(
          generatorId
        );
        await refreshGeneratorData();
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setPendingActionKey("");
      }
    },
    [generatorsService, refreshGeneratorData]
  );

  const createGenerator = useCallback(
    async (generatorData) => {
      try {
        setPendingActionKey("create-generator");
        setErrorMessage("");

        const result = await generatorsService.createProviderGenerator(
          generatorData,
          { allowTemporary: true }
        );

        setGeneratorState((currentState) => {
          const nextGenerators = upsertGenerator(
            currentState.generators,
            result.generator
          );

          return {
            generators: nextGenerators,
            overview: calculateOverview(nextGenerators),
          };
        });

        return result;
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        throw error;
      } finally {
        setPendingActionKey("");
      }
    },
    [generatorsService]
  );

  const updateGenerator = useCallback(async (updatedGenerator) => {
    const updatedGeneratorId = String(updatedGenerator?.id || "");

    if (!updatedGeneratorId) {
      throw new Error("ط·ع¾ط·آ¹ط·آ°ط·آ± ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ¯ ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط¸â€‍ط·آ¯ ط·آ§ط¸â€‍ط¸â€¦ط·آ±ط·آ§ط·آ¯ ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ط¸â€،.");
    }

    setErrorMessage("");

    setGeneratorState((currentState) => {
      const nextGenerators = currentState.generators.map((generator) =>
        String(generator.id || "") === updatedGeneratorId
          ? { ...generator, ...updatedGenerator }
          : generator
      );

      return {
        generators: nextGenerators,
        overview: calculateOverview(nextGenerators),
      };
    });

    return updatedGenerator;
  }, []);

  return {
    activateGenerator,
    createGenerator,
    deleteGenerator,
    errorMessage,
    featuredGenerators,
    generators: generatorState.generators,
    isLoading,
    overview: generatorState.overview,
    pendingActionKey,
    placeGeneratorUnderMaintenance,
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
