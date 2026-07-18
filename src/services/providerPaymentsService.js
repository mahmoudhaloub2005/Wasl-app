function createMissingEndpointError(action) {
  const error = new Error(`Provider payment ${action} endpoint is not available in the current backend contract.`);
  error.code = "PROVIDER_PAYMENTS_ENDPOINT_MISSING";
  error.action = action;
  throw error;
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
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStatus(value) {
  const status = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  if (
    status.includes("approved") ||
    status.includes("accepted") ||
    status.includes("paid") ||
    status.includes("completed")
  ) {
    return "approved";
  }

  if (status.includes("rejected") || status.includes("declined") || status.includes("failed")) {
    return "rejected";
  }

  return "pending";
}

function getCustomerName(payment = {}) {
  return String(
    getFirstValue(
      payment,
      ["customerName", "customer_name", "subscriberName", "subscriber_name", "clientName", "client_name"],
      getFirstValue(payment.customer || payment.subscriber || payment.client || payment.user, ["full_name", "fullName", "name"], "")
    )
  ).trim();
}

function getProof(payment = {}) {
  const proof = payment.proof || payment.receipt || payment.receipt_image || payment.receiptImage || payment.attachment || {};
  const proofSource = typeof proof === "string" ? { url: proof } : proof;

  const url = getFirstValue(payment, ["proofUrl", "proof_url", "receiptUrl", "receipt_url", "receiptImage", "receipt_image"], proofSource.url || proofSource.path || "");
  const fileName = getFirstValue(payment, ["fileName", "file_name", "receiptName", "receipt_name"], proofSource.fileName || proofSource.file_name || proofSource.name || "");
  const mimeType = getFirstValue(payment, ["mimeType", "mime_type", "fileType", "file_type"], proofSource.mimeType || proofSource.mime_type || proofSource.type || "");
  const size = getFirstValue(payment, ["fileSize", "file_size", "receiptSize", "receipt_size"], proofSource.fileSize || proofSource.file_size || proofSource.size || "");

  if (!url && !fileName && !mimeType) return null;

  return {
    fileName,
    mimeType,
    size,
    url,
  };
}

export function normalizeProviderPaymentRequest(payment = {}) {
  const id = String(
    getFirstValue(payment, ["id", "_id", "uuid", "paymentId", "payment_id", "requestId", "request_id"])
  );

  return {
    id,
    amount: toNumber(getFirstValue(payment, ["amount", "total", "paidAmount", "paid_amount"])),
    currency: getFirstValue(payment, ["currency", "currencyText", "currency_text"], "شيكل"),
    customerName: getCustomerName(payment),
    proof: getProof(payment),
    raw: payment,
    status: normalizeStatus(getFirstValue(payment, ["status", "state", "paymentStatus", "payment_status"])),
    uploadedAt: getFirstValue(payment, ["uploadedAt", "uploaded_at", "createdAt", "created_at", "submittedAt", "submitted_at", "date"]),
  };
}

export async function getProviderPaymentRequests() {
  createMissingEndpointError("list");
}

export async function approveProviderPaymentRequest() {
  createMissingEndpointError("approve");
}

export async function rejectProviderPaymentRequest() {
  createMissingEndpointError("reject");
}

export const providerPaymentsService = {
  approveProviderPaymentRequest,
  getProviderPaymentRequests,
  rejectProviderPaymentRequest,
};

export default providerPaymentsService;
