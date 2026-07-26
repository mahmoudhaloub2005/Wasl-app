import api from "./api";
import {
  createServiceError,
  getFirstValue,
  sanitizeText,
  toNumber,
  unwrapItem,
} from "./apiResponse";
import {
  clearAuthStorage,
  getStoredUser,
  getUserAvatarUrl,
  getUserInitial,
  setStoredUser,
} from "../utils/authStorage";

const UNAVAILABLE = "غير متوفر";

function joinNameParts(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function unwrapProviderProfile(data) {
  const provider = unwrapItem(data, ["provider", "profile"]);
  const user = provider.user || data?.user || data?.data?.user || getStoredUser() || {};

  return {
    provider,
    user,
  };
}

function normalizeAreaIds(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "object") return item.id || item.area_id || item.areaId;
        return item;
      })
      .filter((item) => item !== undefined && item !== null && item !== "");
  }

  if (value === undefined || value === null || value === "") return [];

  return [value];
}

export function translatePaymentMethod(value) {
  const paymentMethod = String(value || "").trim().toLowerCase();

  if (!paymentMethod) return "";

  const labels = {
    monthly: "يتم الدفع شهرياً",
    month: "يتم الدفع شهرياً",
    weekly: "يتم الدفع أسبوعياً",
    week: "يتم الدفع أسبوعياً",
    daily: "يتم الدفع يومياً",
    day: "يتم الدفع يومياً",
    prepaid: "دفع مسبق",
    pre_paid: "دفع مسبق",
    advance: "دفع مسبق",
  };

  return labels[paymentMethod] || sanitizeText(value);
}

export function formatProviderPrice(value, currency = "شيكل") {
  const number = toNumber(value, null);

  if (number === null) return "";

  return `${new Intl.NumberFormat("ar", { maximumFractionDigits: 2 }).format(number)} ${sanitizeText(currency) || "شيكل"}`;
}

export function normalizeProviderProfile(data, fallbackUser = getStoredUser()) {
  const { provider, user } = unwrapProviderProfile(data);
  const firstName = sanitizeText(getFirstValue(user, ["first_name", "firstName"]) || getFirstValue(provider, ["first_name", "firstName"]));
  const lastName = sanitizeText(getFirstValue(user, ["last_name", "lastName"]) || getFirstValue(provider, ["last_name", "lastName"]));
  const fullName = sanitizeText(
    getFirstValue(user, ["full_name", "fullName", "name"]) ||
      getFirstValue(provider, ["full_name", "fullName", "name"]) ||
      joinNameParts(firstName, lastName)
  );
  const companyName = sanitizeText(
    getFirstValue(provider, ["company_name", "companyName", "facility_name", "facilityName"]) ||
      getFirstValue(user, ["company_name", "companyName", "facility_name", "facilityName"])
  );
  const termsValue = sanitizeText(
    getFirstValue(provider, ["terms_subscr", "termsSubscr", "payment_method", "paymentMethod"]) ||
      getFirstValue(user, ["terms_subscr", "termsSubscr", "payment_method", "paymentMethod"])
  );
  const rawPrice = getFirstValue(provider, ["price_KW", "price_kw", "price", "generator_price", "price_per_ampere"]);
  const currency = sanitizeText(getFirstValue(provider, ["currency", "price_currency"], "شيكل"));
  const source = {
    ...fallbackUser,
    ...user,
    ...provider,
  };

  return {
    id: sanitizeText(getFirstValue(provider, ["id", "_id", "uuid"]) || getFirstValue(user, ["id", "_id", "uuid"])),
    raw: provider,
    areaIds: normalizeAreaIds(provider.area_ids || provider.areas || provider.area),
    fullName: fullName || UNAVAILABLE,
    phone: sanitizeText(getFirstValue(user, ["phone", "mobile"]) || getFirstValue(provider, ["phone", "mobile"])),
    email: sanitizeText(getFirstValue(user, ["email"]) || getFirstValue(provider, ["email"])),
    profileImage: getUserAvatarUrl(source),
    initials: getUserInitial(source, fullName || companyName || UNAVAILABLE),
    companyName,
    commercialLicenseNumber: sanitizeText(getFirstValue(provider, ["commercial_license_number", "license_number", "license"])),
    electricityPrice: formatProviderPrice(rawPrice, currency),
    electricityPriceValue: sanitizeText(rawPrice),
    currency: currency || "شيكل",
    paymentMethod: translatePaymentMethod(termsValue),
    paymentMethodValue: termsValue,
    terms_subscr: termsValue,
  };
}

export async function getProviderProfile() {
  const response = await api.get("/provider/profile");
  const profile = normalizeProviderProfile(response.data);
  setStoredUser({ ...(getStoredUser() || {}), provider: profile.raw, company_name: profile.companyName });
  return profile;
}

function buildProviderProfilePayload(values = {}, currentProfile = {}) {
  return {
    company_name: sanitizeText(values.companyName || currentProfile.companyName),
    terms_subscr: sanitizeText(values.terms_subscr || values.paymentMethodValue || currentProfile.paymentMethodValue),
    area_ids: normalizeAreaIds(values.area_ids || values.areaIds || currentProfile.areaIds),
  };
}

export async function saveProviderProfile(values, options = {}) {
  if (options.imageFile) {
    const error = new Error("تغيير صورة الملف غير موثق في واجهة Wasel API الحالية.");
    error.displayMessage = error.message;
    throw error;
  }

  const currentProfile = await getProviderProfile().catch(() => normalizeProviderProfile(getStoredUser() || {}));
  const payload = buildProviderProfilePayload(values, currentProfile);

  try {
    const response = await api.put("/provider/profile", payload);
    return normalizeProviderProfile(response.data, getStoredUser());
  } catch (error) {
    throw createServiceError(error, "تعذر حفظ بيانات المزود.");
  }
}

export function clearProviderProfileCache() {}

export async function logoutProviderProfile() {
  clearAuthStorage();
}

export { UNAVAILABLE };
