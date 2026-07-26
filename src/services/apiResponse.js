export function unwrapList(data, keys = []) {
  const candidates = [
    data,
    data?.data,
    data?.items,
    data?.data?.items,
    data?.records,
    data?.data?.records,
    data?.results,
    data?.data?.results,
    data?.data?.data,
    ...keys.flatMap((key) => [data?.[key], data?.data?.[key]]),
  ];

  return candidates.find(Array.isArray) || [];
}

export function unwrapItem(data, keys = []) {
  for (const key of keys) {
    if (data?.data?.[key]) return data.data[key];
    if (data?.[key]) return data[key];
  }

  return data?.data?.data || data?.data || data || {};
}

export function getFirstValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

export function getNestedValue(source, paths, fallback = "") {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce((current, key) => current?.[key], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

export function toNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;

  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toOptionalNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function sanitizeText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "object") return fallback;

  const text = String(value).trim();

  if (!text || ["undefined", "null", "NaN", "[object Object]"].includes(text)) {
    return fallback;
  }

  return text;
}

export function getApiMessage(error, fallback = "حدث خطأ غير متوقع.") {
  if (error?.displayMessage) return error.displayMessage;

  const data = error?.response?.data;

  if (data?.message) return String(data.message);
  if (data?.error) return String(data.error);

  const errors = data?.errors || data?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstValue = Object.values(errors).flat().find(Boolean);
    if (firstValue) return String(firstValue);
  }

  return error?.message || fallback;
}

export function getFieldErrors(error, fieldMap = {}) {
  const errors = error?.response?.data?.errors || error?.response?.data?.data?.errors;

  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};

  return Object.entries(errors).reduce((fieldErrors, [field, messages]) => {
    const formField = fieldMap[field] || field;
    const [message] = Array.isArray(messages) ? messages : [messages];

    if (message) fieldErrors[formField] = String(message);

    return fieldErrors;
  }, {});
}

export function createServiceError(error, fallback, fieldMap = {}) {
  const serviceError = new Error(getApiMessage(error, fallback));

  serviceError.status = error?.response?.status;
  serviceError.fieldErrors = getFieldErrors(error, fieldMap);
  serviceError.response = error?.response;
  serviceError.cause = error;

  return serviceError;
}
