import { getCurrentUser, logoutUser } from "./authService";
import {
  clearAuthStorage,
  getStoredUser,
  getUserAvatarUrl,
  getUserInitial,
} from "../utils/authStorage";

const UNAVAILABLE = "غير متوفر";
export const PROVIDER_PROFILE_ENDPOINT = "/user";

function getFirstNonEmptyValue(values, fallback = "") {
  const value = values.find((candidate) => {
    if (candidate === undefined || candidate === null) return false;
    if (typeof candidate === "object") return Object.keys(candidate).length > 0;
    return String(candidate).trim() !== "";
  });

  return value === undefined || value === null ? fallback : value;
}

function unwrapProviderProfile(data) {
  const user =
    data?.data?.provider ||
    data?.provider ||
    data?.data?.user ||
    data?.user ||
    data?.data?.profile ||
    data?.profile ||
    data?.data ||
    data ||
    {};
  const provider = user.provider || user.providerProfile || data?.provider || {};
  const company =
    user.company ||
    user.companyProfile ||
    user.providerCompany ||
    provider.company ||
    data?.company ||
    {};
  const settings =
    user.settings ||
    user.providerSettings ||
    provider.settings ||
    data?.settings ||
    {};

  return {
    user,
    provider,
    company,
    settings,
  };
}

function joinNameParts(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function sanitizeText(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return "";

  const text = String(value).trim();

  if (!text || ["undefined", "null", "NaN", "[object Object]"].includes(text)) {
    return "";
  }

  return text;
}

function normalizeNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const number = Number(String(value).replace(/[^\d.-]/g, ""));

  return Number.isFinite(number) ? number : null;
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
  const number = normalizeNumber(value);

  if (number === null) return "";

  const formattedNumber = new Intl.NumberFormat("ar", {
    maximumFractionDigits: 2,
  }).format(number);
  const cleanCurrency = sanitizeText(currency) || "شيكل";

  return `${formattedNumber} ${cleanCurrency}`;
}

export function normalizeProviderProfile(data, fallbackUser = getStoredUser()) {
  const { user, provider, company, settings } = unwrapProviderProfile(data);
  const source = {
    ...fallbackUser,
    ...user,
    provider,
    company,
    settings,
  };
  const firstName = sanitizeText(
    getFirstNonEmptyValue([
      source.first_name,
      source.firstName,
      provider.first_name,
      provider.firstName,
    ])
  );
  const lastName = sanitizeText(
    getFirstNonEmptyValue([
      source.last_name,
      source.lastName,
      provider.last_name,
      provider.lastName,
    ])
  );
  const fullName = sanitizeText(
    getFirstNonEmptyValue([
      source.full_name,
      source.fullName,
      source.name,
      source.provider_name,
      source.providerName,
      provider.full_name,
      provider.fullName,
      provider.name,
      joinNameParts(firstName, lastName),
    ])
  );
  const phone = sanitizeText(
    getFirstNonEmptyValue([
      source.phone,
      source.mobile,
      source.phone_number,
      source.phoneNumber,
      provider.phone,
      provider.mobile,
      provider.phone_number,
      provider.phoneNumber,
    ])
  );
  const email = sanitizeText(
    getFirstNonEmptyValue([source.email, provider.email])
  );
  const profileImage = getUserAvatarUrl({
    ...source,
    avatar_url: getFirstNonEmptyValue([
      source.avatar_url,
      source.avatarUrl,
      source.avatar,
      source.profile_image_url,
      source.profileImageUrl,
      source.profile_image,
      source.profileImage,
      provider.avatar_url,
      provider.avatarUrl,
      provider.avatar,
      provider.profile_image_url,
      provider.profileImageUrl,
      provider.profile_image,
      provider.profileImage,
    ]),
  });
  const companyName = sanitizeText(
    getFirstNonEmptyValue([
      company.name,
      company.company_name,
      company.companyName,
      source.company_name,
      source.companyName,
      source.facility_name,
      source.facilityName,
      provider.company_name,
      provider.companyName,
      provider.facility_name,
      provider.facilityName,
    ])
  );
  const commercialLicenseNumber = sanitizeText(
    getFirstNonEmptyValue([
      company.commercial_license_number,
      company.commercialLicenseNumber,
      company.license_number,
      company.licenseNumber,
      company.license,
      source.commercial_license_number,
      source.commercialLicenseNumber,
      source.license_number,
      source.licenseNumber,
      source.license,
      provider.commercial_license_number,
      provider.commercialLicenseNumber,
      provider.license_number,
      provider.licenseNumber,
      provider.license,
    ])
  );
  const rawPrice = getFirstNonEmptyValue([
    settings.electricity_price,
    settings.electricityPrice,
    settings.price_per_kilo,
    settings.pricePerKilo,
    settings.price_per_kwh,
    settings.pricePerKwh,
    source.electricity_price,
    source.electricityPrice,
    source.price_per_kilo,
    source.pricePerKilo,
    source.price_per_kwh,
    source.pricePerKwh,
    source.price_per_ampere,
    source.pricePerAmpere,
    provider.electricity_price,
    provider.electricityPrice,
    provider.price_per_kilo,
    provider.pricePerKilo,
    provider.price_per_kwh,
    provider.pricePerKwh,
    provider.price_per_ampere,
    provider.pricePerAmpere,
  ]);
  const currency = sanitizeText(
    getFirstNonEmptyValue([
      settings.currency,
      settings.price_currency,
      source.currency,
      source.price_currency,
      provider.currency,
      provider.price_currency,
    ])
  );
  const paymentMethod = translatePaymentMethod(
    getFirstNonEmptyValue([
      settings.payment_method,
      settings.paymentMethod,
      settings.payment_plan,
      settings.paymentPlan,
      source.payment_method,
      source.paymentMethod,
      source.payment_plan,
      source.paymentPlan,
      provider.payment_method,
      provider.paymentMethod,
      provider.payment_plan,
      provider.paymentPlan,
    ])
  );
  const id = sanitizeText(
    getFirstNonEmptyValue([
      source.id,
      source._id,
      source.uuid,
      source.user_id,
      source.userId,
      provider.id,
      provider._id,
      provider.uuid,
      email,
      phone,
    ])
  );

  return {
    id,
    fullName,
    phone,
    email,
    profileImage,
    initials: getUserInitial(source, fullName || companyName || UNAVAILABLE),
    companyName,
    commercialLicenseNumber,
    electricityPrice: formatProviderPrice(rawPrice, currency),
    currency: currency || "شيكل",
    paymentMethod,
  };
}

export async function getMyProviderProfile() {
  const responseData = await getCurrentUser();

  return normalizeProviderProfile(responseData);
}

export function clearProviderProfileCache() {
  [localStorage, sessionStorage].forEach((storage) => {
    Object.keys(storage)
      .filter((key) => key.startsWith("provider_profile_"))
      .forEach((key) => storage.removeItem(key));
  });
}

export async function logoutProviderProfile() {
  try {
    await logoutUser();
  } finally {
    clearProviderProfileCache();
    clearAuthStorage();
  }
}

export { UNAVAILABLE };
