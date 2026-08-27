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
  return String(value || "active")
    .toLowerCase()
    .includes("expired")
    ? "expired"
    : "active";
}

function getPayloadValue(payload, key) {
  return payload?.[key];
}

/*
 * نبني البيانات التي سيرسلها الـ Frontend للـ API.
 *
 * ملاحظة:
 * الصورة لا يتم إرسالها هنا كـ Base64 لأن الـ API الحالي
 * لا نريد أن نخمن طريقة رفع الملفات التي يستخدمها الـ Backend.
 *
 * الإعلان نفسه سيتم إنشاؤه بشكل طبيعي بالعنوان والوصف والسعر
 * إذا كان الـ Backend يقبل price.
 */
function buildPosterPayload(payload) {
  const result = {
    title: sanitizeText(getPayloadValue(payload, "title")),
    description: sanitizeText(getPayloadValue(payload, "description")),
  };

  const price = getPayloadValue(payload, "price");

  if (price !== undefined && price !== null && price !== "") {
    result.price = Number(price);
  }

  return result;
}

export function normalizeAdvertisement(advertisement = {}) {
  const createdAt = getFirstValue(
    advertisement,
    ["createdAt", "created_at"],
    new Date().toISOString()
  );

  const rawId = getFirstValue(advertisement, ["id", "_id", "uuid"]);

  const id =
    rawId !== undefined && rawId !== null && rawId !== ""
      ? String(rawId)
      : "";

  return {
    id,

    title: sanitizeText(
      getFirstValue(advertisement, ["title", "name"])
    ),

    price: toNumber(
      getFirstValue(advertisement, ["price"])
    ),

    description: sanitizeText(
      getFirstValue(advertisement, [
        "description",
        "body",
        "message",
      ])
    ),

    imageUrl: sanitizeText(
      getFirstValue(advertisement, [
        "imageUrl",
        "image_url",
        "image",
        "photo",
        "banner",
        "media_url",
      ])
    ),

    status: normalizeStatus(
      getFirstValue(advertisement, ["status", "state"])
    ),

    views: Math.max(
      0,
      Math.round(
        toNumber(
          getFirstValue(
            advertisement,
            ["views", "views_count"],
            0
          )
        )
      )
    ),

    createdAt,

    updatedAt: getFirstValue(
      advertisement,
      ["updatedAt", "updated_at"],
      createdAt
    ),

    providerId: sanitizeText(
      getFirstValue(advertisement, [
        "providerId",
        "provider_id",
        "provider.id",
      ])
    ),

    raw: advertisement,
  };
}

function sortAdvertisements(advertisements) {
  return [...advertisements].sort(
    (firstAdvertisement, secondAdvertisement) => {
      const firstDate = new Date(
        firstAdvertisement.updatedAt ||
          firstAdvertisement.createdAt ||
          0
      ).getTime();

      const secondDate = new Date(
        secondAdvertisement.updatedAt ||
          secondAdvertisement.createdAt ||
          0
      ).getTime();

      return secondDate - firstDate;
    }
  );
}

export async function getProviderAdvertisements() {
  try {
    const response = await api.get("/posters");

    return sortAdvertisements(
      unwrapList(response.data, [
        "posters",
        "advertisements",
      ])
        .map(normalizeAdvertisement)
        .filter((advertisement) => advertisement.id)
    );
  } catch (error) {
    throw createServiceError(
      error,
      "تعذر تحميل الإعلانات."
    );
  }
}

export async function createProviderAdvertisement(
  advertisementData
) {
  const payload = buildPosterPayload(advertisementData);

  try {
    console.log("Creating advertisement:", payload);

    const response = await api.post(
      "/posters",
      payload
    );

    console.log(
      "Advertisement created:",
      response.data
    );

    return normalizeAdvertisement({
      ...payload,
      ...unwrapItem(response.data, [
        "poster",
        "advertisement",
      ]),
    });
  } catch (error) {
    console.error(
      "Create advertisement error:",
      error.response?.data || error
    );

    throw createServiceError(
      error,
      "تعذر نشر الإعلان."
    );
  }
}

export async function updateProviderAdvertisement(
  advertisementId,
  advertisementData
) {
  const payload = buildPosterPayload(advertisementData);

  try {
    const response = await api.put(
      `/posters/${advertisementId}`,
      payload
    );

    return normalizeAdvertisement({
      id: advertisementId,
      ...payload,
      ...unwrapItem(response.data, [
        "poster",
        "advertisement",
      ]),
    });
  } catch (error) {
    throw createServiceError(
      error,
      "تعذر حفظ تعديلات الإعلان."
    );
  }
}

export async function toggleProviderAdvertisementStatus(
  advertisementId
) {
  /*
   * لا نوقف الواجهة برسالة "غير موثق".
   *
   * نحاول أولاً استخدام endpoint شائع لتغيير الحالة.
   */
  try {
    const response = await api.patch(
      `/posters/${advertisementId}/status`
    );

    return normalizeAdvertisement(
      unwrapItem(response.data, [
        "poster",
        "advertisement",
      ])
    );
  } catch (error) {
    throw createServiceError(
      error,
      "تعذر تغيير حالة الإعلان."
    );
  }
}

export async function deleteProviderAdvertisement(
  advertisementId
) {
  try {
    await api.delete(
      `/posters/${advertisementId}`
    );

    return advertisementId;
  } catch (error) {
    throw createServiceError(
      error,
      "تعذر حذف الإعلان."
    );
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