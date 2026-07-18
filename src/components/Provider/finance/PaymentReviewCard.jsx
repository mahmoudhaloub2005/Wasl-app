import { FiFileText, FiImage } from "react-icons/fi";

function buildInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => Array.from(part)[0]).join(" ") || "؟";
}

function formatAmount(amount, currency) {
  return `${new Intl.NumberFormat("en-US").format(Number(amount || 0))} ${currency || "شيكل"}`;
}

function formatRelativeTime(value) {
  if (!value) return "وقت الرفع غير متوفر";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));

  if (minutes < 60) return `تم الرفع منذ ${minutes || 1} دقيقة`;

  const hours = Math.round(minutes / 60);

  if (hours < 24) return `تم الرفع منذ ${hours} ساعات`;

  const days = Math.round(hours / 24);
  return `تم الرفع منذ ${days} أيام`;
}

function formatFileSize(size) {
  if (!size) return "";

  const numericSize = Number(size);

  if (!Number.isFinite(numericSize)) return String(size);
  if (numericSize < 1024) return `${numericSize} B`;
  if (numericSize < 1024 * 1024) return `${Math.round(numericSize / 1024)} KB`;

  return `${(numericSize / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageProof(proof) {
  const mimeType = String(proof?.mimeType || "").toLowerCase();
  const fileName = String(proof?.fileName || proof?.url || "").toLowerCase();

  return mimeType.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(fileName);
}

function getStatusLabel(status) {
  if (status === "approved") return "معتمدة";
  if (status === "rejected") return "مرفوضة";
  if (status === "completed") return "مكتملة";
  return "قيد المراجعة";
}

function PaymentProofSummary({ proof, onPreviewProof }) {
  if (!proof) {
    return (
      <div className="payment-review-card__proof payment-review-card__proof--empty">
        <FiFileText aria-hidden="true" />
        <span>لا يوجد إثبات دفع مرفق</span>
      </div>
    );
  }

  const canPreview = Boolean(proof.url);
  const isImage = isImageProof(proof);

  return (
    <div className="payment-review-card__proof">
      <button
        type="button"
        className="payment-review-card__proof-thumb"
        disabled={!canPreview}
        onClick={() => onPreviewProof(proof)}
        aria-label="معاينة إثبات الدفع"
      >
        {isImage && proof.url ? (
          <img src={proof.url} alt={proof.fileName || "إثبات الدفع"} />
        ) : (
          <FiFileText aria-hidden="true" />
        )}
      </button>

      <div>
        <strong>{proof.fileName || "إثبات الدفع"}</strong>
        <p>
          {proof.mimeType || (isImage ? "صورة" : "ملف")}
          {proof.size ? ` · ${formatFileSize(proof.size)}` : ""}
        </p>
      </div>

      {isImage ? <FiImage className="payment-review-card__proof-icon" aria-hidden="true" /> : null}
    </div>
  );
}

function PaymentReviewCard({
  isSubmitting,
  onApprove,
  onPreviewProof,
  onReject,
  payment,
  processingAction,
}) {
  const isPending = payment.status === "pending";

  return (
    <article className="payment-review-card">
      <div className="payment-review-card__topline">
        <span className="payment-review-card__amount">
          {formatAmount(payment.amount, payment.currency)}
        </span>

        <div className="payment-review-card__customer">
          <span className="payment-review-card__avatar" aria-hidden="true">
            {buildInitials(payment.customerName)}
          </span>
          <div>
            <h2>{payment.customerName || "اسم العميل غير متوفر"}</h2>
            <p>{formatRelativeTime(payment.uploadedAt)}</p>
          </div>
        </div>
      </div>

      <PaymentProofSummary proof={payment.proof} onPreviewProof={onPreviewProof} />

      {isPending ? (
        <div className="payment-review-card__actions">
          <button
            type="button"
            className="payment-review-card__approve"
            disabled={isSubmitting}
            onClick={() => onApprove(payment)}
          >
            {isSubmitting && processingAction === "approve" ? "جاري الاعتماد..." : "قبول"}
          </button>
          <button
            type="button"
            className="payment-review-card__reject"
            disabled={isSubmitting}
            onClick={() => onReject(payment)}
          >
            {isSubmitting && processingAction === "reject" ? "جاري الرفض..." : "رفض"}
          </button>
        </div>
      ) : (
        <p className={`payment-review-card__status payment-review-card__status--${payment.status}`}>
          {getStatusLabel(payment.status)}
        </p>
      )}
    </article>
  );
}

export default PaymentReviewCard;
