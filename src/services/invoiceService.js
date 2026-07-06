import api from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.invoices)) return data.invoices;
  if (Array.isArray(data?.data?.invoices)) return data.data.invoices;
  if (Array.isArray(data?.items)) return data.items;
  if (data?.invoice) return [data.invoice];
  if (data?.data?.invoice) return [data.data.invoice];
  if (data?.data && typeof data.data === "object") return [data.data];

  return [];
}

function unwrapItem(data) {
  return data?.data?.invoice || data?.invoice || data?.data || data;
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

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("unpaid") ||
    value.includes("not_paid") ||
    value.includes("غير مدفوع")
  ) {
    return "unpaid";
  }

  if (value.includes("paid") || value.includes("مدفوع")) return "paid";
  if (value.includes("pending") || value.includes("review") || value.includes("تحقق")) {
    return "pending";
  }

  return "unpaid";
}

function getStatusText(status) {
  if (status === "paid") return "مدفوعة";
  if (status === "pending") return "قيد التحقق";
  return "غير مدفوعة";
}

export function normalizeInvoice(invoice = {}) {
  const status = normalizeStatus(
    getFirstValue(invoice, ["status", "state", "payment_status", "paymentStatus"])
  );
  const amount = getFirstValue(invoice, ["amount", "total", "total_amount", "totalAmount"], 0);

  return {
    id: getFirstValue(invoice, [
      "id",
      "_id",
      "uuid",
      "invoice_id",
      "invoiceId",
      "invoice_number",
      "invoiceNumber",
      "number",
      "code",
    ]),
    invoiceNumber:
      getFirstValue(invoice, ["invoice_number", "invoiceNumber", "number", "code"]) ||
      `#INV-${String(getFirstValue(invoice, ["id", "_id"], "0000")).slice(-4)}`,
    month:
      formatDate(getFirstValue(invoice, ["month", "period", "date", "created_at"])) ||
      "غير محدد",
    amount: String(amount),
    amountValue: toNumber(amount),
    status,
    statusText: getFirstValue(invoice, ["status_text", "statusText"], getStatusText(status)),
    paidAt: getFirstValue(invoice, ["paid_at", "paidAt", "payment_date", "paymentDate"]),
    dueDate: getFirstValue(invoice, ["due_date", "dueDate", "deadline"]),
    issuedAt: getFirstValue(invoice, ["issued_at", "issuedAt", "created_at"]),
    paymentMethod: getFirstValue(invoice, ["payment_method", "paymentMethod"], "دفعة"),
  };
}

export async function getMyInvoices(params = {}) {
  const response = await api.get("/invoices/my", { params });
  return unwrapList(response.data).map(normalizeInvoice);
}

export async function getInvoiceDetails(id) {
  const response = await api.get(`/invoices/${id}`);
  return normalizeInvoice(unwrapItem(response.data));
}
