import api from "./api";
import {
  createServiceError,
  getFirstValue,
  sanitizeText,
  toNumber,
  unwrapList,
} from "./apiResponse";
import { getProviderInvoices } from "./providerInvoicesService";

function normalizeStatus(value) {
  const status = String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ");

  if (status.includes("approved") || status.includes("accepted") || status.includes("paid") || status.includes("completed")) {
    return "approved";
  }

  if (status.includes("rejected") || status.includes("declined") || status.includes("failed")) {
    return "rejected";
  }

  return "pending";
}

function getCustomerName(payment = {}, invoice = {}) {
  const customer = payment.customer || payment.subscriber || payment.client || payment.user || invoice.customer || {};

  return sanitizeText(
    getFirstValue(payment, ["customerName", "customer_name", "subscriberName", "subscriber_name", "clientName", "client_name"]) ||
      getFirstValue(invoice, ["customerName", "customer_name", "subscriberName", "subscriber_name"]) ||
      getFirstValue(customer, ["full_name", "fullName", "name"]),
    "عميل"
  );
}

function getProof(payment = {}) {
  const proof = payment.proof || payment.receipt || payment.receipt_image || payment.receiptImage || payment.attachment || {};
  const proofSource = typeof proof === "string" ? { url: proof } : proof;
  const url = sanitizeText(
    getFirstValue(payment, ["proofUrl", "proof_url", "receiptUrl", "receipt_url", "receiptImage", "receipt_image"]) ||
      proofSource.url ||
      proofSource.path
  );
  const fileName = sanitizeText(
    getFirstValue(payment, ["fileName", "file_name", "receiptName", "receipt_name"]) ||
      proofSource.fileName ||
      proofSource.file_name ||
      proofSource.name
  );
  const mimeType = sanitizeText(
    getFirstValue(payment, ["mimeType", "mime_type", "fileType", "file_type"]) ||
      proofSource.mimeType ||
      proofSource.mime_type ||
      proofSource.type
  );
  const size = getFirstValue(payment, ["fileSize", "file_size", "receiptSize", "receipt_size"]) || proofSource.fileSize || proofSource.file_size || proofSource.size;

  if (!url && !fileName && !mimeType) return null;

  return { fileName, mimeType, size, url };
}

export function normalizeProviderPaymentRequest(payment = {}, invoice = {}) {
  const id = String(
    getFirstValue(payment, ["id", "_id", "uuid", "paymentId", "payment_id", "requestId", "request_id"])
  );

  return {
    id,
    amount: toNumber(getFirstValue(payment, ["amount", "total", "paidAmount", "paid_amount"], invoice.amount)),
    currency: getFirstValue(payment, ["currency", "currencyText", "currency_text"], "شيكل"),
    customerName: getCustomerName(payment, invoice),
    proof: getProof(payment),
    raw: payment,
    invoice,
    status: normalizeStatus(getFirstValue(payment, ["status", "state", "paymentStatus", "payment_status"])),
    uploadedAt: getFirstValue(payment, ["uploadedAt", "uploaded_at", "createdAt", "created_at", "submittedAt", "submitted_at", "date"]),
  };
}

function extractPaymentsFromInvoice(invoice = {}) {
  const rawInvoice = invoice.raw || invoice;
  const candidates = [
    rawInvoice.payment,
    rawInvoice.latest_payment,
    rawInvoice.current_payment,
    rawInvoice.payment_request,
    rawInvoice.payments,
    rawInvoice.payment_requests,
  ];
  const payments = candidates.flatMap((candidate) => {
    if (!candidate) return [];
    if (Array.isArray(candidate)) return candidate;
    return [candidate];
  });

  return payments
    .map((payment) => normalizeProviderPaymentRequest(payment, invoice))
    .filter((payment) => payment.id);
}

export async function getProviderPaymentRequests() {
  const invoices = await getProviderInvoices();
  const directPayments = invoices.flatMap(extractPaymentsFromInvoice);

  if (directPayments.length) return directPayments;

  const response = await api.get("/provider/invoices");
  return unwrapList(response.data, ["payments", "payment_requests"])
    .map((payment) => normalizeProviderPaymentRequest(payment))
    .filter((payment) => payment.id);
}

async function reviewProviderPaymentRequest(paymentId, status) {
  try {
    const response = await api.put(`/payments/${paymentId}/review`, { status });
    return response.data;
  } catch (error) {
    throw createServiceError(error, status === "approved" ? "تعذر اعتماد الدفعة." : "تعذر رفض الدفعة.");
  }
}

export function approveProviderPaymentRequest(paymentId) {
  return reviewProviderPaymentRequest(paymentId, "approved");
}

export function rejectProviderPaymentRequest(paymentId) {
  return reviewProviderPaymentRequest(paymentId, "rejected");
}

export const providerPaymentsService = {
  approveProviderPaymentRequest,
  getProviderPaymentRequests,
  rejectProviderPaymentRequest,
};

export default providerPaymentsService;
