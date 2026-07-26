import api from "./api";
import {
  createServiceError,
  getFirstValue,
  sanitizeText,
  toNumber,
  unwrapItem,
  unwrapList,
} from "./apiResponse";

function normalizeStatus(value) {
  return String(value || "active").toLowerCase().includes("expired") ? "expired" : "active";
}

function getPayloadValue(payload, key) {
  return payload?.[key];
}

function buildPosterPayload(payload) {
  return {
    title: sanitizeText(getPayloadValue(payload, "title")),
    description: sanitizeText(getPayloadValue(payload, "description")),
  };
}

export function normalizeAdvertisement(advertisement = {}) {
  const createdAt = getFirstValue(advertisement, ["createdAt", "created_at"], new Date().toISOString());
  const id = String(getFirstValue(advertisement, ["id", "_id", "uuid"]));

  return {
    id,
    title: sanitizeText(getFirstValue(advertisement, ["title", "name"])),
    price: toNumber(getFirstValue(advertisement, ["price"])),
    description: sanitizeText(getFirstValue(advertisement, ["description", "body", "message"])),
    imageUrl: sanitizeText(getFirstValue(advertisement, ["imageUrl", "image_url", "image", "photo", "banner", "media_url"])),
    status: normalizeStatus(getFirstValue(advertisement, ["status", "state"])),
    views: Math.max(0, Math.round(toNumber(getFirstValue(advertisement, ["views", "views_count"], 0)))),
    createdAt,
    updatedAt: getFirstValue(advertisement, ["updatedAt", "updated_at"], createdAt),
    providerId: sanitizeText(getFirstValue(advertisement, ["providerId", "provider_id", "provider.id"])),
    raw: advertisement,
  };
}

function sortAdvertisements(advertisements) {
  return [...advertisements].sort((firstAdvertisement, secondAdvertisement) => {
    const firstDate = new Date(firstAdvertisement.updatedAt || firstAdvertisement.createdAt || 0).getTime();
    const secondDate = new Date(secondAdvertisement.updatedAt || secondAdvertisement.createdAt || 0).getTime();
    return secondDate - firstDate;
  });
}

export async function getProviderAdvertisements() {
  const response = await api.get("/posters");
  return sortAdvertisements(
    unwrapList(response.data, ["posters", "advertisements"])
      .map(normalizeAdvertisement)
      .filter((advertisement) => advertisement.id)
  );
}

export async function createProviderAdvertisement(advertisementData) {
  const payload = buildPosterPayload(advertisementData);

  try {
    const response = await api.post("/posters", payload);
    return normalizeAdvertisement({
      ...payload,
      ...unwrapItem(response.data, ["poster", "advertisement"]),
    });
  } catch (error) {
    throw createServiceError(error, "تعذر نشر الإعلان.");
  }
}

export async function updateProviderAdvertisement(advertisementId, advertisementData) {
  const payload = buildPosterPayload(advertisementData);

  try {
    const response = await api.put(`/posters/${advertisementId}`, payload);
    return normalizeAdvertisement({
      id: advertisementId,
      ...payload,
      ...unwrapItem(response.data, ["poster", "advertisement"]),
    });
  } catch (error) {
    throw createServiceError(error, "تعذر حفظ تعديلات الإعلان.");
  }
}

export async function toggleProviderAdvertisementStatus(advertisementId) {
  const error = new Error("تغيير حالة الإعلان غير موثق في واجهة Wasel API الحالية.");
  error.displayMessage = error.message;
  error.advertisementId = advertisementId;
  throw error;
}

export async function deleteProviderAdvertisement(advertisementId) {
  try {
    await api.delete(`/posters/${advertisementId}`);
    return advertisementId;
  } catch (error) {
    throw createServiceError(error, "تعذر حذف الإعلان.");
  }
}

export async function getProviderAdvertisementsSnapshot() {
  return getProviderAdvertisements();
}

export const providerAdvertisementsService = {
  createProviderAdvertisement,
  deleteProviderAdvertisement,
  getProviderAdvertisements,
  getProviderAdvertisementsSnapshot,
  toggleProviderAdvertisementStatus,
  updateProviderAdvertisement,
};

export default providerAdvertisementsService;
