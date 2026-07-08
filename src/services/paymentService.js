import api from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.payments)) return data.payments;
  if (Array.isArray(data?.data?.payments)) return data.data.payments;
  if (Array.isArray(data?.items)) return data.items;
  if (data?.payment) return [data.payment];
  if (data?.data?.payment) return [data.data.payment];
  if (data?.data && typeof data.data === "object") return [data.data];

  return [];
}

function getFirstValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function normalizePayment(payment = {}) {
  const amount = getFirstValue(payment, ["amount", "total", "paid_amount", "paidAmount"], 0);

  return {
    id: getFirstValue(payment, ["id", "_id", "uuid", "payment_number", "paymentNumber"]),
    title: getFirstValue(
      payment,
      ["title", "payment_method", "paymentMethod", "method"],
      "دفعة"
    ),
    date:
      formatDate(
        getFirstValue(payment, ["date", "paid_at", "paidAt", "created_at"])
      ) || "غير محدد",
    amount: `+${amount}`,
  };
}

export async function getMyPayments(params = {}) {
  const response = await api.get("/payments/my", { params });
  return unwrapList(response.data).map(normalizePayment);
}

export async function createPayment({ amount, file, invoiceId }) {
  if (!invoiceId) {
    const error = new Error("invoice_id is required before creating payment");
    error.displayMessage =
      "لا يمكن إرسال الدفع قبل ربطه بفاتورة حقيقية من الخادم.";
    throw error;
  }

  const formData = new FormData();

  formData.append("amount", amount);
  formData.append("invoice_id", invoiceId);

  if (file) {
    formData.append("receipt_image", file);
  }

  const response = await api.post("/payments", formData);
  return response.data;
}
