import { getCurrentProviderAccountKey } from "./providerAccount";

const STORAGE_PREFIX = "wasel_provider_advertisements";
const DEFAULT_ADVERTISEMENT_STATUS = "active";

function getStorageKey(accountKey = getCurrentProviderAccountKey()) {
  return `${STORAGE_PREFIX}_${encodeURIComponent(accountKey)}`;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function normalizeStatus(value) {
  return value === "expired" ? "expired" : "active";
}

function sanitizeText(value) {
  if (value === undefined || value === null || typeof value === "object") {
    return "";
  }

  const text = String(value).trim();

  if (!text || ["undefined", "null", "[object Object]"].includes(text)) {
    return "";
  }

  return text;
}

function getFirstNonEmptyValue(values, fallback = "") {
  const value = values.find((candidate) => sanitizeText(candidate));

  return value === undefined || value === null ? fallback : value;
}

function isFormDataPayload(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function normalizeAdvertisementPayload(payload, options = {}) {
  if (!isFormDataPayload(payload)) {
    return payload;
  }

  const imageFile = payload.get("image");
  const imageUrl =
    sanitizeText(options.imageUrl) ||
    sanitizeText(options.imagePreviewUrl) ||
    (await readFileAsDataUrl(imageFile));

  return {
    title: payload.get("title"),
    description: payload.get("description"),
    imageUrl,
  };
}

export function normalizeAdvertisement(advertisement = {}) {
  const createdAt = advertisement.createdAt || new Date().toISOString();
  const imageUrl = sanitizeText(
    getFirstNonEmptyValue([
      advertisement.imageUrl,
      advertisement.image_url,
      advertisement.image,
      advertisement.photo,
      advertisement.banner,
      advertisement.media?.url,
    ])
  );

  return {
    id:
      String(advertisement.id || "").trim() ||
      `advertisement-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: sanitizeText(
      getFirstNonEmptyValue([
        advertisement.title,
        advertisement.name,
        advertisement.offerName,
        advertisement.offer_name,
      ])
    ),
    price: normalizeNumber(advertisement.price),
    description: sanitizeText(advertisement.description),
    imageUrl,
    status: normalizeStatus(advertisement.status),
    views: Math.max(0, Math.round(normalizeNumber(advertisement.views))),
    createdAt,
    updatedAt: advertisement.updatedAt || createdAt,
    providerId: sanitizeText(
      getFirstNonEmptyValue([
        advertisement.providerId,
        advertisement.provider_id,
        advertisement.provider?.id,
      ])
    ),
  };
}

function sortAdvertisements(advertisements) {
  return [...advertisements].sort((firstAdvertisement, secondAdvertisement) => {
    const firstDate = new Date(
      firstAdvertisement.updatedAt || firstAdvertisement.createdAt || 0
    ).getTime();
    const secondDate = new Date(
      secondAdvertisement.updatedAt || secondAdvertisement.createdAt || 0
    ).getTime();

    return secondDate - firstDate;
  });
}

function readAdvertisements(accountKey = getCurrentProviderAccountKey()) {
  if (typeof window === "undefined") return [];

  const storedValue = window.localStorage.getItem(getStorageKey(accountKey));

  if (!storedValue) return [];

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) return [];

    return sortAdvertisements(parsedValue.map(normalizeAdvertisement));
  } catch {
    return [];
  }
}

function writeAdvertisements(
  advertisements,
  accountKey = getCurrentProviderAccountKey()
) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      getStorageKey(accountKey),
      JSON.stringify(sortAdvertisements(advertisements))
    );
  } catch (error) {
    throw new Error(
      "تعذر حفظ الإعلان محلياً. جرّب صورة بحجم أصغر أو احذف بعض الإعلانات القديمة.",
      { cause: error }
    );
  }
}

export function getProviderAdvertisements() {
  return cloneData(readAdvertisements());
}

export async function createProviderAdvertisement(
  advertisementData,
  options = {}
) {
  const accountKey = getCurrentProviderAccountKey();
  const normalizedAdvertisementData = await normalizeAdvertisementPayload(
    advertisementData,
    options
  );
  const advertisements = readAdvertisements(accountKey);
  const createdAt = new Date().toISOString();
  const nextAdvertisement = normalizeAdvertisement({
    ...normalizedAdvertisementData,
    id: `advertisement-${createdAt}-${Math.random().toString(16).slice(2)}`,
    status: DEFAULT_ADVERTISEMENT_STATUS,
    views: 0,
    createdAt,
    updatedAt: createdAt,
    providerId: accountKey,
  });

  const nextAdvertisements = sortAdvertisements([
    nextAdvertisement,
    ...advertisements,
  ]);

  writeAdvertisements(nextAdvertisements, accountKey);

  return cloneData(nextAdvertisement);
}

export async function updateProviderAdvertisement(
  advertisementId,
  advertisementData
) {
  const accountKey = getCurrentProviderAccountKey();
  const advertisements = readAdvertisements(accountKey);
  const targetId = String(advertisementId);
  const existingAdvertisement = advertisements.find(
    (advertisement) => advertisement.id === targetId
  );

  if (!existingAdvertisement) {
    throw new Error("تعذر العثور على الإعلان المطلوب.");
  }

  const updatedAdvertisement = normalizeAdvertisement({
    ...existingAdvertisement,
    ...advertisementData,
    id: existingAdvertisement.id,
    views: existingAdvertisement.views,
    status: advertisementData.status || existingAdvertisement.status,
    createdAt: existingAdvertisement.createdAt,
    updatedAt: new Date().toISOString(),
  });

  const nextAdvertisements = sortAdvertisements(
    advertisements.map((advertisement) =>
      advertisement.id === targetId ? updatedAdvertisement : advertisement
    )
  );

  writeAdvertisements(nextAdvertisements, accountKey);

  return cloneData(updatedAdvertisement);
}

export async function toggleProviderAdvertisementStatus(advertisementId) {
  const accountKey = getCurrentProviderAccountKey();
  const advertisements = readAdvertisements(accountKey);
  const targetId = String(advertisementId);
  const existingAdvertisement = advertisements.find(
    (advertisement) => advertisement.id === targetId
  );

  if (!existingAdvertisement) {
    throw new Error("تعذر العثور على الإعلان المطلوب.");
  }

  const updatedAdvertisement = normalizeAdvertisement({
    ...existingAdvertisement,
    status: existingAdvertisement.status === "active" ? "expired" : "active",
    updatedAt: new Date().toISOString(),
  });

  const nextAdvertisements = sortAdvertisements(
    advertisements.map((advertisement) =>
      advertisement.id === targetId ? updatedAdvertisement : advertisement
    )
  );

  writeAdvertisements(nextAdvertisements, accountKey);

  return cloneData(updatedAdvertisement);
}

export async function deleteProviderAdvertisement(advertisementId) {
  const accountKey = getCurrentProviderAccountKey();
  const targetId = String(advertisementId);
  const nextAdvertisements = readAdvertisements(accountKey).filter(
    (advertisement) => advertisement.id !== targetId
  );

  writeAdvertisements(nextAdvertisements, accountKey);

  return targetId;
}

export function getProviderAdvertisementsSnapshot() {
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
