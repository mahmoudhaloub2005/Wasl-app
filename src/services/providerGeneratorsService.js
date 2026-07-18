import api from "./api";
import { getCurrentProviderAccountKey } from "./providerAccount";
import {
  getProviderDemoRecords,
  updateProviderDemoRecords,
} from "./providerDemoStore";

const SERVICE_DELAY_MS = 260;
export const PROVIDER_GENERATORS_CREATE_ENDPOINT = "/generators";

const NETWORK_ERROR_MESSAGE =
  "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.";
const AUTH_ERROR_MESSAGE =
  "انتهت جلسة تسجيل الدخول، يرجى تسجيل الدخول مرة أخرى.";
const CREATE_GENERATOR_ERROR_MESSAGE =
  "تعذر تسجيل المولد، يرجى المحاولة مرة أخرى.";
const TEMPORARY_GENERATOR_MESSAGE =
  "واجهة إنشاء المولد غير متاحة حالياً في الخادم. تم حفظ المولد مؤقتاً في هذه الجلسة فقط إلى حين تفعيل الربط الخلفي.";

const BACKEND_FIELD_MAP = {
  name: "generatorName",
  generator_name: "generatorName",
  generatorName: "generatorName",
  title: "generatorName",
  capacity: "capacityKva",
  capacity_kva: "capacityKva",
  capacityKva: "capacityKva",
  kva: "capacityKva",
  generator_powerKW: "capacityKva",
  power_kva: "capacityKva",
  status: "status",
  state: "status",
  location: "locationName",
  location_name: "locationName",
  locationName: "locationName",
  area: "locationName",
  region: "locationName",
  address: "locationName",
  latitude: "locationName",
  longitude: "locationName",
  price: "defaultAmperePrice",
  price_per_ampere: "defaultAmperePrice",
  pricePerAmpere: "defaultAmperePrice",
  ampere_price: "defaultAmperePrice",
  amperePrice: "defaultAmperePrice",
  generator_price: "defaultAmperePrice",
  notes: "notes",
  note: "notes",
  description: "notes",
};

function delay(duration = SERVICE_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeId(value) {
  if (value === undefined || value === null || value === "") return "";
  return String(value);
}

function getFirstNonEmptyValue(values) {
  return values.find((value) => String(value || "").trim()) || "";
}

function getGeneratorId(generator = {}) {
  const directId = normalizeId(
    generator.id ||
      generator._id ||
      generator.uuid ||
      generator.generatorId ||
      generator.generator_id ||
      generator.code ||
      generator.identifier
  );

  if (directId) return directId;

  return normalizeId(
    [
      generator.name,
      generator.generatorName,
      generator.generator_name,
      generator.createdAt,
      generator.created_at,
    ]
      .filter(Boolean)
      .join("-")
  );
}

function matchesGeneratorId(generator, generatorId) {
  const targetId = normalizeId(generatorId);

  if (!targetId) return false;

  return [
    getGeneratorId(generator),
    generator?.id,
    generator?._id,
    generator?.uuid,
    generator?.generatorId,
    generator?.generator_id,
    generator?.code,
    generator?.identifier,
  ].some((value) => normalizeId(value) === targetId);
}

function normalizeStatus(value) {
  const status = String(value || "active")
    .trim()
    .toLowerCase();

  if (
    [
      "maintenance",
      "under_maintenance",
      "repair",
      "repairing",
      "fixing",
      "out_of_service",
      "service",
    ].includes(status)
  ) {
    return "maintenance";
  }

  if (["inactive", "disabled", "stopped", "offline", "draft"].includes(status)) {
    return "inactive";
  }

  return "active";
}

function getStatusMeta(status) {
  if (status === "maintenance") {
    return {
      label: "قيد الإصلاح",
      tone: "maintenance",
    };
  }

  if (status === "inactive") {
    return {
      label: "متوقف",
      tone: "inactive",
    };
  }

  return {
    label: "يعمل بكفاءة",
    tone: "active",
  };
}

function getGeneratorName(generator = {}) {
  return String(
    getFirstNonEmptyValue([
      generator.name,
      generator.generatorName,
      generator.generator_name,
      generator.title,
      generator.label,
      generator.code,
    ]) || "مولد بدون اسم"
  ).trim();
}

function normalizeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function getLoadCapacity(generator = {}) {
  return normalizeNumber(
    getFirstNonEmptyValue([
      generator.loadCapacity,
      generator.load_capacity,
      generator.capacityAmps,
      generator.capacity_amps,
      generator.ampereCapacity,
      generator.ampere_capacity,
      generator.maxLoad,
      generator.max_load,
      generator.capacity,
    ])
  );
}

function getCurrentLoad(generator = {}) {
  return normalizeNumber(
    getFirstNonEmptyValue([
      generator.currentLoad,
      generator.current_load,
      generator.currentAmpere,
      generator.current_ampere,
      generator.load,
      generator.usageValue,
      generator.usage_value,
    ])
  );
}

function getUsagePercentage(generator = {}) {
  const explicitPercentage = getFirstNonEmptyValue([
    generator.usagePercentage,
    generator.usage_percentage,
    generator.percentage,
  ]);

  if (explicitPercentage !== "") {
    return Math.max(0, Math.min(100, Math.round(normalizeNumber(explicitPercentage))));
  }

  const loadCapacity = getLoadCapacity(generator);

  if (!loadCapacity) return 0;

  return Math.max(0, Math.min(100, Math.round((getCurrentLoad(generator) / loadCapacity) * 100)));
}

function getCapacityKva(generator = {}) {
  return normalizeNumber(
    getFirstNonEmptyValue([
      generator.capacityKva,
      generator.capacity_kva,
      generator.kva,
      generator.powerKva,
      generator.power_kva,
    ])
  );
}

function getPricePerAmpere(generator = {}) {
  return normalizeNumber(
    getFirstNonEmptyValue([
      generator.pricePerAmpere,
      generator.price_per_ampere,
      generator.amperePrice,
      generator.ampere_price,
      generator.price,
    ])
  );
}

function getImageUrl(generator = {}) {
  return (
    generator.imageUrl ||
    generator.image_url ||
    generator.image ||
    generator.photo ||
    generator.picture ||
    ""
  );
}

function getMaintenanceNote(generator = {}) {
  return String(
    getFirstNonEmptyValue([
      generator.maintenanceNote,
      generator.maintenance_note,
      generator.notes,
      generator.note,
    ])
  ).trim();
}

function getLocationName(generator = {}) {
  return String(
    getFirstNonEmptyValue([
      generator.location,
      generator.locationName,
      generator.location_name,
      generator.area,
      generator.region,
      generator.address,
    ])
  ).trim();
}

function getMaintenanceStatus(generator = {}, status = "active") {
  const rawMaintenanceStatus = String(
    getFirstNonEmptyValue([
      generator.maintenanceStatus,
      generator.maintenance_status,
    ])
  ).trim();

  if (rawMaintenanceStatus) return rawMaintenanceStatus;

  if (status === "maintenance") return "under_maintenance";
  if (status === "inactive") return "temporarily_stopped";
  return "operational";
}

function normalizeGeneratorRecord(generator = {}) {
  const status = normalizeStatus(generator.status || generator.state);
  const statusMeta = getStatusMeta(status);
  const id = getGeneratorId(generator);
  const loadCapacity = getLoadCapacity(generator);
  const currentLoad = getCurrentLoad(generator);
  const locationName = getLocationName(generator);
  const pricePerAmpere = getPricePerAmpere(generator);

  return {
    id,
    name: getGeneratorName(generator),
    code:
      generator.code ||
      generator.identifier ||
      generator.serialNumber ||
      generator.serial_number ||
      "",
    status,
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    imageUrl: getImageUrl(generator),
    location: locationName,
    locationName,
    capacityKva: getCapacityKva(generator),
    currentLoad,
    loadCapacity,
    capacity: loadCapacity,
    unit: generator.unit || "أمبير",
    usagePercentage: getUsagePercentage(generator),
    amperePrice: pricePerAmpere,
    pricePerAmpere,
    maintenanceStatus: getMaintenanceStatus(generator, status),
    lastMaintenanceAt:
      generator.lastMaintenanceAt ||
      generator.last_maintenance_at ||
      generator.maintenanceAt ||
      generator.maintenance_at ||
      "",
    maintenanceNote: getMaintenanceNote(generator),
    createdAt: generator.createdAt || generator.created_at || "",
    updatedAt: generator.updatedAt || generator.updated_at || "",
  };
}

function sortByNewest(firstGenerator, secondGenerator) {
  const firstDate = new Date(
    firstGenerator.updatedAt || firstGenerator.createdAt || 0
  ).getTime();
  const secondDate = new Date(
    secondGenerator.updatedAt || secondGenerator.createdAt || 0
  ).getTime();

  return secondDate - firstDate;
}

function getRecords() {
  return getProviderDemoRecords(getCurrentProviderAccountKey());
}

function getGeneratorRecords() {
  return (getRecords().generators || []).filter(
    (generator) => generator.status !== "deleted"
  );
}

function getGeneratorOrThrow(records, generatorId) {
  const generator = (records.generators || []).find((item) =>
    matchesGeneratorId(item, generatorId)
  );

  if (!generator) {
    throw new Error("تعذر العثور على المولد.");
  }

  return generator;
}

function buildGeneratorActivity(action, generator, createdAt) {
  const normalizedGenerator = normalizeGeneratorRecord(generator);
  const titles = {
    created: "تمت إضافة مولد جديد",
    updated: "تم تعديل بيانات مولد",
    deleted: "تم حذف مولد",
    activated: "تم تفعيل مولد",
    maintenance: "تم وضع مولد تحت الصيانة",
  };
  const tones = {
    created: "blue",
    updated: "blue",
    deleted: "red",
    activated: "orange",
    maintenance: "red",
  };

  return {
    id: `generator-${action}-${normalizedGenerator.id || Date.now()}-${createdAt}`,
    type: `generator-${action}`,
    title: titles[action] || "تم تحديث بيانات مولد",
    meta: `المولد: ${normalizedGenerator.name}`,
    iconKey: action === "activated" ? "check" : "tool",
    tone: tones[action] || "blue",
    path: `/provider/generators/${normalizedGenerator.id}`,
    createdAt,
  };
}

function unwrapGeneratorResponse(data) {
  return (
    data?.data?.generator ||
    data?.generator ||
    data?.data?.data?.generator ||
    data?.data?.data ||
    data?.data ||
    data
  );
}

function normalizeBackendFieldErrors(errorData) {
  const rawErrors =
    errorData?.errors ||
    errorData?.data?.errors ||
    errorData?.validation ||
    errorData?.data?.validation ||
    {};

  if (!rawErrors || typeof rawErrors !== "object" || Array.isArray(rawErrors)) {
    return {};
  }

  return Object.entries(rawErrors).reduce((fieldErrors, [field, messages]) => {
    const formField = BACKEND_FIELD_MAP[field] || field;
    const message = Array.isArray(messages) ? messages[0] : messages;

    if (message) {
      fieldErrors[formField] = String(message);
    }

    return fieldErrors;
  }, {});
}

function createServiceError(error, fallbackMessage = CREATE_GENERATOR_ERROR_MESSAGE) {
  const status = error?.response?.status;
  const errorData = error?.response?.data || {};
  const backendMessage =
    errorData?.message ||
    errorData?.error ||
    errorData?.data?.message ||
    errorData?.data?.error;
  const message =
    status === 401 || status === 403
      ? AUTH_ERROR_MESSAGE
      : !error?.response
        ? NETWORK_ERROR_MESSAGE
        : backendMessage || fallbackMessage;
  const serviceError = new Error(message);

  serviceError.status = status;
  serviceError.fieldErrors = normalizeBackendFieldErrors(errorData);

  return serviceError;
}

function isUnavailableCreateEndpoint(error) {
  return [404, 405, 501].includes(error?.response?.status);
}

function toOptionalNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function buildProviderGeneratorPayload(generatorData = {}) {
  const generatorName = String(generatorData.generatorName || "").trim();
  const locationName = String(generatorData.locationName || "").trim();
  const notes = String(generatorData.notes || "").trim();
  const capacityKva = Number(generatorData.capacityKva);
  const defaultAmperePrice = Number(generatorData.defaultAmperePrice);
  const latitude = toOptionalNumber(generatorData.latitude);
  const longitude = toOptionalNumber(generatorData.longitude);

  return {
    generator_name: generatorName,
    name: generatorName,
    capacity: capacityKva,
    capacity_kva: capacityKva,
    generator_powerKW: capacityKva,
    status: normalizeStatus(generatorData.status),
    location: locationName,
    location_name: locationName,
    area: locationName || null,
    latitude,
    longitude,
    price_per_ampere: defaultAmperePrice,
    ampere_price: defaultAmperePrice,
    generator_price: defaultAmperePrice,
    notes: notes || null,
    description: notes || null,
  };
}

function cacheCreatedProviderGenerator(generatorData, action = "created") {
  const accountKey = getCurrentProviderAccountKey();
  const createdAt =
    generatorData.createdAt || generatorData.created_at || new Date().toISOString();
  const cachedGenerator = {
    ...generatorData,
    id:
      generatorData.id ||
      generatorData._id ||
      generatorData.uuid ||
      generatorData.generator_id ||
      generatorData.generatorId ||
      `generator-${Date.now()}`,
    status: normalizeStatus(generatorData.status || "active"),
    createdAt,
    updatedAt: generatorData.updatedAt || generatorData.updated_at || createdAt,
  };

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    generators: [cachedGenerator, ...(currentRecords.generators || [])],
    activities: [
      buildGeneratorActivity(action, cachedGenerator, createdAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return cloneData(normalizeGeneratorRecord(cachedGenerator));
}

export async function getProviderGenerators() {
  await delay();

  return cloneData(
    getGeneratorRecords()
      .map((generator) => normalizeGeneratorRecord(generator))
      .sort(sortByNewest)
  );
}

export async function getProviderGeneratorsOverview() {
  await delay(220);

  const generators = getGeneratorRecords().map((generator) =>
    normalizeGeneratorRecord(generator)
  );
  const totalGenerators = generators.length;
  const maintenanceGenerators = generators.filter(
    (generator) => generator.status === "maintenance"
  ).length;
  const averageUsage = totalGenerators
    ? Math.round(
        generators.reduce(
          (total, generator) => total + generator.usagePercentage,
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

export async function createProviderGenerator(generatorData, options = {}) {
  const payload = buildProviderGeneratorPayload(generatorData);

  try {
    const response = await api.post(PROVIDER_GENERATORS_CREATE_ENDPOINT, payload);
    const responseGenerator = unwrapGeneratorResponse(response.data);
    const responseGeneratorId = getGeneratorId(responseGenerator);

    if (!responseGeneratorId) {
      const invalidResponseError = new Error(
        "لم يرجع الخادم معرفاً صالحاً للمولد الجديد."
      );

      invalidResponseError.response = {
        status: 502,
        data: {
          message:
            "تمت استجابة الخادم دون معرف صالح للمولد الجديد. يرجى تحديث واجهة الربط الخلفية.",
        },
      };

      throw invalidResponseError;
    }

    const normalizedGenerator = cacheCreatedProviderGenerator({
      ...payload,
      ...responseGenerator,
    });

    return {
      endpoint: PROVIDER_GENERATORS_CREATE_ENDPOINT,
      generator: normalizedGenerator,
      payload,
      temporary: false,
    };
  } catch (error) {
    if (options.allowTemporary && isUnavailableCreateEndpoint(error)) {
      const temporaryGenerator = cacheCreatedProviderGenerator(
        {
          ...payload,
          id: `temporary-generator-${Date.now()}`,
          isTemporary: true,
        },
        "created"
      );

      return {
        endpoint: PROVIDER_GENERATORS_CREATE_ENDPOINT,
        generator: temporaryGenerator,
        message: TEMPORARY_GENERATOR_MESSAGE,
        payload,
        temporary: true,
      };
    }

    throw createServiceError(error);
  }
}

export async function updateProviderGenerator(generatorId, generatorData) {
  await delay(220);

  const accountKey = getCurrentProviderAccountKey();
  const records = getProviderDemoRecords(accountKey);
  const existingGenerator = getGeneratorOrThrow(records, generatorId);
  const updatedAt = new Date().toISOString();
  const nextGenerator = {
    ...existingGenerator,
    ...generatorData,
    id: existingGenerator.id || generatorId,
    status: normalizeStatus(generatorData?.status || existingGenerator.status),
    updatedAt,
  };

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    generators: (currentRecords.generators || []).map((generator) =>
      matchesGeneratorId(generator, generatorId) ? nextGenerator : generator
    ),
    activities: [
      buildGeneratorActivity("updated", nextGenerator, updatedAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return cloneData(normalizeGeneratorRecord(nextGenerator));
}

export async function deleteProviderGenerator(generatorId) {
  await delay(220);

  const accountKey = getCurrentProviderAccountKey();
  const records = getProviderDemoRecords(accountKey);
  const deletedGenerator = getGeneratorOrThrow(records, generatorId);
  const deletedAt = new Date().toISOString();

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    generators: (currentRecords.generators || []).filter(
      (generator) => !matchesGeneratorId(generator, generatorId)
    ),
    activities: [
      buildGeneratorActivity("deleted", deletedGenerator, deletedAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return { id: normalizeId(generatorId), status: "deleted" };
}

export async function activateProviderGenerator(generatorId) {
  await delay(220);

  const accountKey = getCurrentProviderAccountKey();
  const records = getProviderDemoRecords(accountKey);
  const existingGenerator = getGeneratorOrThrow(records, generatorId);
  const activatedAt = new Date().toISOString();
  const nextGenerator = {
    ...existingGenerator,
    status: "active",
    maintenanceNote: "",
    maintenance_note: "",
    updatedAt: activatedAt,
  };

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    generators: (currentRecords.generators || []).map((generator) =>
      matchesGeneratorId(generator, generatorId) ? nextGenerator : generator
    ),
    activities: [
      buildGeneratorActivity("activated", nextGenerator, activatedAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return cloneData(normalizeGeneratorRecord(nextGenerator));
}

export async function placeProviderGeneratorUnderMaintenance(
  generatorId,
  maintenanceNote = ""
) {
  await delay(220);

  const accountKey = getCurrentProviderAccountKey();
  const records = getProviderDemoRecords(accountKey);
  const existingGenerator = getGeneratorOrThrow(records, generatorId);
  const maintenanceAt = new Date().toISOString();
  const nextGenerator = {
    ...existingGenerator,
    status: "maintenance",
    maintenanceNote,
    lastMaintenanceAt: maintenanceAt,
    updatedAt: maintenanceAt,
  };

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    generators: (currentRecords.generators || []).map((generator) =>
      matchesGeneratorId(generator, generatorId) ? nextGenerator : generator
    ),
    activities: [
      buildGeneratorActivity("maintenance", nextGenerator, maintenanceAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return cloneData(normalizeGeneratorRecord(nextGenerator));
}

export const providerGeneratorsService = {
  getProviderGenerators,
  getProviderGeneratorsOverview,
  createProviderGenerator,
  updateProviderGenerator,
  deleteProviderGenerator,
  activateProviderGenerator,
  placeProviderGeneratorUnderMaintenance,
};

export default providerGeneratorsService;
