const numberFormatter = new Intl.NumberFormat("en-US");

export const STATUS_META = {
  normal: {
    label: "طبيعي",
    tone: "normal",
  },
  medium: {
    label: "متوسط",
    tone: "medium",
  },
  high: {
    label: "مرتفع",
    tone: "high",
  },
  critical: {
    label: "حرج",
    tone: "critical",
  },
};

export const STATUS_FILTERS = [
  { label: "الكل", value: "all" },
  { label: STATUS_META.normal.label, value: "normal" },
  { label: STATUS_META.medium.label, value: "medium" },
  { label: STATUS_META.high.label, value: "high" },
  { label: STATUS_META.critical.label, value: "critical" },
];

export const CAPACITY_FILTERS = [
  { label: "جميع نسب الاستهلاك", value: "all" },
  { label: "أقل من 50%", value: "under-50" },
  { label: "من 50% إلى 80%", value: "50-to-80" },
  { label: "أكثر من 80%", value: "over-80" },
];

function getFirstValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));

  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampPercentage(value) {
  const numericValue = Number(value || 0);

  if (!Number.isFinite(numericValue)) return 0;

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function normalizeStatusKey(value, percentage) {
  const status = String(value || "").trim().toLowerCase();

  if (["normal", "طبيعي"].includes(status)) return "normal";
  if (["medium", "warning", "متوسط"].includes(status)) return "medium";
  if (["high", "مرتفع"].includes(status)) return "high";
  if (["critical", "danger", "حرج"].includes(status)) return "critical";

  if (percentage >= 95) return "critical";
  if (percentage >= 80) return "high";
  if (percentage >= 50) return "medium";

  return "normal";
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;

  const normalizedValue = String(value || "").trim().toLowerCase();

  if (["true", "1", "active", "enabled", "نشط", "فعّال"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "inactive", "disabled", "maintenance", "stopped", "متوقف", "صيانة"].includes(normalizedValue)) {
    return false;
  }

  return null;
}

function getGeneratorActivity(record) {
  const explicitActivity = normalizeBoolean(
    getFirstValue(record, ["isActive", "is_active", "active"])
  );

  if (explicitActivity !== null) return explicitActivity;

  const operationalStatus = getFirstValue(record, [
    "generatorStatus",
    "generator_status",
    "operationalStatus",
    "operational_status",
  ]);
  const normalizedStatus = normalizeBoolean(operationalStatus);

  return normalizedStatus === null ? true : normalizedStatus;
}

export function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

export function formatCapacity(value) {
  return `${formatNumber(value)} أمبير`;
}

export function getCapacityStatus(percentage) {
  const status = normalizeStatusKey("", clampPercentage(percentage));

  return {
    ...STATUS_META[status],
    id: status,
  };
}

export function normalizeCapacityRecord(record = {}, index = 0) {
  const maximumCapacity = toNumber(
    getFirstValue(record, [
      "maximumCapacity",
      "maximum_capacity",
      "maxCapacity",
      "max_capacity",
      "loadCapacity",
      "load_capacity",
      "capacityAmps",
      "capacity_amps",
      "ampereCapacity",
      "ampere_capacity",
      "capacity",
    ])
  );
  const currentLoad = toNumber(
    getFirstValue(record, [
      "currentLoad",
      "current_load",
      "consumed",
      "usedCapacity",
      "used_capacity",
      "currentAmpere",
      "current_ampere",
      "load",
      "usageValue",
      "usage_value",
    ])
  );
  const percentage = maximumCapacity > 0
    ? clampPercentage((currentLoad / maximumCapacity) * 100)
    : 0;
  const status = normalizeStatusKey(
    getFirstValue(record, ["capacityStatus", "capacity_status", "tone", "status"]),
    percentage
  );
  const availableValue = getFirstValue(record, ["availableCapacity", "available_capacity"], null);
  const availableCapacity = availableValue === null
    ? Math.max(0, maximumCapacity - currentLoad)
    : Math.max(0, toNumber(availableValue));
  const generatorId = String(
    getFirstValue(record, ["generatorId", "generator_id", "id", "_id", "uuid"], "")
  );

  return {
    activeSubscribers: toNumber(
      getFirstValue(record, [
        "activeSubscribers",
        "active_subscribers",
        "activeSubscriptions",
        "active_subscriptions",
        "subscriberCount",
        "subscriber_count",
        "subscribersCount",
        "subscribers_count",
      ])
    ),
    area: String(
      getFirstValue(record, ["area", "location", "region", "neighborhood", "address", "city"], "غير محددة")
    ).trim(),
    availableCapacity,
    currentLoad,
    generatorId,
    id: generatorId || String(getFirstValue(record, ["id", "_id", "uuid"], `capacity-${index}`)),
    isActive: getGeneratorActivity(record),
    maximumCapacity,
    name: String(
      getFirstValue(record, ["name", "generatorName", "generator_name", "title", "label", "code"], `مولد ${index + 1}`)
    ).trim(),
    percentage,
    status,
    statusLabel: STATUS_META[status].label,
  };
}

export function buildCapacitySummary(records) {
  const totalCurrentLoad = records.reduce(
    (total, record) => total + Number(record.currentLoad || 0),
    0
  );
  const availableCapacity = records.reduce(
    (total, record) => total + Number(record.availableCapacity || 0),
    0
  );

  return [
    {
      iconKey: "generators",
      id: "total-generators",
      label: "إجمالي المولدات",
      tone: "blue",
      unit: "مولد",
      value: records.length,
    },
    {
      iconKey: "active",
      id: "active-generators",
      label: "المولدات النشطة",
      tone: "green",
      unit: "مولد",
      value: records.filter((record) => record.isActive).length,
    },
    {
      iconKey: "load",
      id: "total-current-load",
      label: "إجمالي الحمل الحالي",
      tone: "orange",
      unit: "أمبير",
      value: totalCurrentLoad,
    },
    {
      iconKey: "available",
      id: "available-capacity",
      label: "السعة المتاحة",
      tone: "blue",
      unit: "أمبير",
      value: availableCapacity,
    },
  ];
}

function matchesCapacityRange(record, capacityFilter) {
  if (capacityFilter === "under-50") return record.percentage < 50;
  if (capacityFilter === "50-to-80") {
    return record.percentage >= 50 && record.percentage <= 80;
  }
  if (capacityFilter === "over-80") return record.percentage > 80;

  return true;
}

export function filterCapacityRecords(records, filters) {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  return records.filter((record) => {
    const searchableText = `${record.name} ${record.area}`.toLowerCase();
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesStatus = filters.statusFilter === "all" || record.status === filters.statusFilter;

    return matchesSearch && matchesStatus && matchesCapacityRange(record, filters.capacityFilter);
  });
}
