import api from "./api";
import {
  createServiceError,
  getFirstValue,
  sanitizeText,
  toNumber,
  unwrapItem,
  unwrapList,
} from "./apiResponse";

export const PROVIDER_GENERATORS_ENDPOINT = "/provider/generators";
export const PROVIDER_GENERATORS_CREATE_ENDPOINT = "/generators";

const FIELD_MAP = {
  type: "generatorName",
  status: "status",
  gps: "locationName",
  powerKW: "capacityKva",
  price_KW: "defaultAmperePrice",
};

function normalizeId(value) {
  if (value === undefined || value === null || value === "") return "";
  return String(value);
}

function normalizeStatus(value) {
  const status = String(value || "active").trim().toLowerCase();

  if (["maintenance", "under_maintenance", "repair", "out_of_service"].includes(status)) {
    return "maintenance";
  }

  if (["inactive", "disabled", "stopped", "offline", "draft"].includes(status)) {
    return "inactive";
  }

  return "active";
}

function getStatusMeta(status) {
  if (status === "maintenance") {
    return { label: "قيد الصيانة", tone: "maintenance" };
  }

  if (status === "inactive") {
    return { label: "متوقف", tone: "inactive" };
  }

  return { label: "يعمل بكفاءة", tone: "active" };
}

function getGps(generator = {}) {
  const gps = sanitizeText(getFirstValue(generator, ["gps", "generator_gps", "location"]));
  if (gps) return gps;

  const latitude = getFirstValue(generator, ["latitude", "lat"]);
  const longitude = getFirstValue(generator, ["longitude", "lng", "lon"]);

  return latitude !== "" && longitude !== "" ? `${latitude},${longitude}` : "";
}

function getLocationName(generator = {}) {
  return sanitizeText(
    getFirstValue(generator, [
      "area",
      "area_name",
      "locationName",
      "location_name",
      "address",
      "city",
      "region",
      "gps",
      "generator_gps",
    ])
  );
}

function getGeneratorId(generator = {}) {
  return normalizeId(
    getFirstValue(generator, [
      "id",
      "_id",
      "uuid",
      "generator_id",
      "generatorId",
      "code",
    ])
  );
}

export function normalizeProviderGenerator(generator = {}) {
  const status = normalizeStatus(getFirstValue(generator, ["status", "state"]));
  const statusMeta = getStatusMeta(status);
  const type = sanitizeText(
    getFirstValue(generator, ["type", "generator_type", "generatorType", "name", "generator_name", "title"]),
    "مولد"
  );
  const powerKW = toNumber(
    getFirstValue(generator, ["powerKW", "power_kw", "generator_powerKW", "capacity", "capacityKva", "capacity_kva"])
  );
  const priceKW = toNumber(
    getFirstValue(generator, ["price_KW", "price_kw", "generator_price", "price", "pricePerAmpere", "price_per_ampere"])
  );
  const id = getGeneratorId(generator);
  const currentLoad = toNumber(getFirstValue(generator, ["currentLoad", "current_load", "load"]));
  const usagePercentage = powerKW ? Math.max(0, Math.min(100, Math.round((currentLoad / powerKW) * 100))) : 0;

  return {
    id,
    name: type,
    type,
    code: sanitizeText(getFirstValue(generator, ["code", "identifier", "serial_number", "serialNumber"])),
    status,
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    gps: getGps(generator),
    imageUrl: sanitizeText(getFirstValue(generator, ["imageUrl", "image_url", "image", "photo"])),
    location: getLocationName(generator),
    locationName: getLocationName(generator),
    capacityKva: powerKW,
    powerKW,
    currentLoad,
    loadCapacity: powerKW,
    capacity: powerKW,
    unit: "KW",
    usagePercentage,
    amperePrice: priceKW,
    pricePerAmpere: priceKW,
    price_KW: priceKW,
    maintenanceStatus: status === "maintenance" ? "under_maintenance" : status === "inactive" ? "temporarily_stopped" : "operational",
    lastMaintenanceAt: getFirstValue(generator, ["lastMaintenanceAt", "last_maintenance_at", "maintenance_at"]),
    maintenanceNote: sanitizeText(getFirstValue(generator, ["maintenanceNote", "maintenance_note", "notes", "description"])),
    createdAt: getFirstValue(generator, ["createdAt", "created_at"]),
    updatedAt: getFirstValue(generator, ["updatedAt", "updated_at"]),
    raw: generator,
  };
}

function sortByNewest(firstGenerator, secondGenerator) {
  const firstDate = new Date(firstGenerator.updatedAt || firstGenerator.createdAt || 0).getTime();
  const secondDate = new Date(secondGenerator.updatedAt || secondGenerator.createdAt || 0).getTime();

  return secondDate - firstDate;
}

function unwrapGeneratorResponse(data) {
  return unwrapItem(data, ["generator"]);
}

function buildGpsFromGeneratorData(generatorData = {}) {
  const gps = sanitizeText(generatorData.gps);
  if (gps) return gps;

  const latitude = generatorData.latitude;
  const longitude = generatorData.longitude;

  if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
    return `${latitude},${longitude}`;
  }

  return sanitizeText(generatorData.locationName || generatorData.location);
}

export function buildProviderGeneratorPayload(generatorData = {}) {
  return {
    type: sanitizeText(generatorData.type || generatorData.generatorName || generatorData.name),
    status: normalizeStatus(generatorData.status),
    gps: buildGpsFromGeneratorData(generatorData),
    powerKW: toNumber(generatorData.powerKW ?? generatorData.capacityKva ?? generatorData.capacity),
    price_KW: toNumber(
      generatorData.price_KW ??
        generatorData.defaultAmperePrice ??
        generatorData.amperePrice ??
        generatorData.pricePerAmpere
    ),
  };
}

function assertGeneratorPayload(payload) {
  if (!payload.type) throw new Error("يرجى إدخال نوع المولد.");
  if (!payload.status) throw new Error("يرجى تحديد حالة المولد.");
  if (!payload.powerKW || payload.powerKW <= 0) throw new Error("قدرة المولد يجب أن تكون أكبر من صفر.");
  if (payload.price_KW < 0) throw new Error("سعر الكيلو واط غير صالح.");
}

export async function getProviderGenerators() {
  const response = await api.get(PROVIDER_GENERATORS_ENDPOINT);

  return unwrapList(response.data, ["generators"])
    .map(normalizeProviderGenerator)
    .filter((generator) => generator.id)
    .sort(sortByNewest);
}

export async function getProviderGeneratorsOverview() {
  const generators = await getProviderGenerators();
  const totalGenerators = generators.length;
  const maintenanceGenerators = generators.filter((generator) => generator.status === "maintenance").length;
  const averageUsage = totalGenerators
    ? Math.round(generators.reduce((total, generator) => total + generator.usagePercentage, 0) / totalGenerators)
    : 0;

  return {
    totalGenerators,
    maintenanceGenerators,
    averageUsage,
  };
}

export async function createProviderGenerator(generatorData) {
  const payload = buildProviderGeneratorPayload(generatorData);
  assertGeneratorPayload(payload);

  try {
    const response = await api.post(PROVIDER_GENERATORS_CREATE_ENDPOINT, payload);
    const generator = normalizeProviderGenerator({
      ...payload,
      ...unwrapGeneratorResponse(response.data),
    });

    return {
      endpoint: PROVIDER_GENERATORS_CREATE_ENDPOINT,
      generator,
      message: "تم حفظ المولد بنجاح.",
      payload,
      temporary: false,
    };
  } catch (error) {
    throw createServiceError(error, "تعذر تسجيل المولد، يرجى المحاولة مرة أخرى.", FIELD_MAP);
  }
}

export async function updateProviderGenerator(generatorId, generatorData) {
  const payload = buildProviderGeneratorPayload(generatorData);
  assertGeneratorPayload(payload);

  try {
    const response = await api.put(`/generators/${generatorId}`, payload);
    return normalizeProviderGenerator({
      ...generatorData,
      ...payload,
      ...unwrapGeneratorResponse(response.data),
      id: generatorId,
    });
  } catch (error) {
    throw createServiceError(error, "تعذر حفظ تعديلات المولد، يرجى المحاولة مرة أخرى.", FIELD_MAP);
  }
}

export async function deleteProviderGenerator(generatorId) {
  try {
    const response = await api.delete(`/generators/${generatorId}`);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "تعذر حذف المولد. حاول مرة أخرى.");
  }
}

export async function activateProviderGenerator(generatorId) {
  try {
    const response = await api.put(`/generators/${generatorId}`, { status: "active" });
    return normalizeProviderGenerator({ ...unwrapGeneratorResponse(response.data), id: generatorId, status: "active" });
  } catch (error) {
    throw createServiceError(error, "تعذر تفعيل المولد. حاول مرة أخرى.");
  }
}

export async function placeProviderGeneratorUnderMaintenance(generatorId) {
  try {
    const response = await api.put(`/generators/${generatorId}`, { status: "maintenance" });
    return normalizeProviderGenerator({ ...unwrapGeneratorResponse(response.data), id: generatorId, status: "maintenance" });
  } catch (error) {
    throw createServiceError(error, "تعذر وضع المولد تحت الصيانة. حاول مرة أخرى.");
  }
}

export const providerGeneratorsService = {
  activateProviderGenerator,
  createProviderGenerator,
  deleteProviderGenerator,
  getProviderGenerators,
  getProviderGeneratorsOverview,
  placeProviderGeneratorUnderMaintenance,
  updateProviderGenerator,
};

export default providerGeneratorsService;
