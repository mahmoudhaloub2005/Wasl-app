import api from "./api";

function unwrapList(data) {
  const listCandidates = [
    data,
    data?.data,
    data?.invoices,
    data?.data?.invoices,
    data?.bills,
    data?.data?.bills,
    data?.items,
    data?.data?.items,
    data?.results,
    data?.data?.results,
    data?.data?.data,
  ];

  const list = listCandidates.find(Array.isArray);

  if (list) return list;
  if (data?.invoice) return [data.invoice];
  if (data?.data?.invoice) return [data.data.invoice];
  if (data?.data && isInvoiceLike(data.data)) return [data.data];
  if (isInvoiceLike(data)) return [data];

  return [];
}

function unwrapItem(data) {
  return data?.data?.invoice || data?.invoice || data?.data || data;
}

function isMissingEndpoint(error) {
  return error?.response?.status === 404 || error?.response?.status === 405;
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

function isInvoiceLike(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return [
    "id",
    "_id",
    "uuid",
    "invoice_id",
    "invoiceId",
    "invoice_number",
    "invoiceNumber",
    "number",
    "code",
    "amount",
    "total",
    "total_amount",
    "totalAmount",
    "status",
    "state",
    "payment_status",
    "paymentStatus",
  ].some((key) => value[key] !== undefined && value[key] !== null);
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
  const value = String(status || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();

  if (
    value.includes("unpaid") ||
    value.includes("not paid") ||
    value.includes("notpaid") ||
    value.includes("due") ||
    value.includes("غير مدفوع") ||
    value.includes("غير مسدد") ||
    value.includes("مستحق")
  ) {
    return "unpaid";
  }

  if (
    value.includes("pending") ||
    value.includes("review") ||
    value.includes("waiting") ||
    value.includes("قيد") ||
    value.includes("تحقق") ||
    value.includes("انتظار")
  ) {
    return "pending";
  }

  if (
    value.includes("paid") ||
    value.includes("settled") ||
    value.includes("completed") ||
    value.includes("مدفوع") ||
    value.includes("مسدد")
  ) {
    return "paid";
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

function getInvoiceFromResponse(data) {
  const list = unwrapList(data);
  const invoice = list[0] || unwrapItem(data);

  return isInvoiceLike(invoice) ? normalizeInvoice(invoice) : null;
}

function createInvoiceUnavailableError(lastError) {
  const error = new Error(
    "لا يمكن إرسال إثبات الدفع قبل إنشاء فاتورة حقيقية من الخادم لهذا الاشتراك."
  );

  error.displayMessage =
    "لا توجد فاتورة حقيقية مرتبطة بهذا الاشتراك حالياً. يلزم إضافة endpoint في الباك لإنشاء فاتورة مستحقة من الاشتراك قبل إرسال الدفع.";
  error.cause = lastError;

  return error;
}

export async function ensureInvoiceForSubscription({
  subscriptionId,
  amount,
  month,
} = {}) {
  if (!subscriptionId) {
    throw createInvoiceUnavailableError();
  }

  const payload = {
    subscription_id: subscriptionId,
    amount,
    month,
  };

  const attempts = [
    {
      url: "/invoices/ensure",
      body: payload,
    },
    {
      url: `/subscriptions/${subscriptionId}/invoices`,
      body: { amount, month },
    },
    {
      url: "/invoices",
      body: payload,
    },
  ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      const response = await api.post(attempt.url, attempt.body);
      const invoice = getInvoiceFromResponse(response.data);

      if (invoice?.id) {
        return invoice;
      }
    } catch (error) {
      lastError = error;

      if (!isMissingEndpoint(error)) {
        throw error;
      }
    }
  }

  throw createInvoiceUnavailableError(lastError);
}

export async function getMyInvoices(params = {}) {
  const response = await api.get("/invoices/my", { params });
  return unwrapList(response.data).filter(isInvoiceLike).map(normalizeInvoice);
}

export async function getInvoiceDetails(id) {
  const response = await api.get(`/invoices/${id}`);
  return normalizeInvoice(unwrapItem(response.data));
}
