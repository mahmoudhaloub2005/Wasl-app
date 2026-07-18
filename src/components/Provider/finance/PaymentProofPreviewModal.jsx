import { useEffect } from "react";
import { FiExternalLink, FiFileText, FiX } from "react-icons/fi";

function isSafeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

function isImageProof(proof) {
  const mimeType = String(proof?.mimeType || "").toLowerCase();
  const fileName = String(proof?.fileName || proof?.url || "").toLowerCase();

  return mimeType.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(fileName);
}

function PaymentProofPreviewModal({ onClose, proof }) {
  const isOpen = Boolean(proof);
  const safeUrl = proof?.url && isSafeUrl(proof.url) ? proof.url : "";
  const isImage = isImageProof(proof);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="payment-proof-preview" onMouseDown={onClose} role="presentation">
      <section
        aria-labelledby="payment-proof-preview-title"
        aria-modal="true"
        className="payment-proof-preview__dialog"
        dir="rtl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          type="button"
          className="payment-proof-preview__close"
          aria-label="إغلاق المعاينة"
          onClick={onClose}
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="payment-proof-preview-title">معاينة إثبات الدفع</h2>

        {!safeUrl ? (
          <div className="payment-proof-preview__empty">
            <FiFileText aria-hidden="true" />
            <p>لا يمكن معاينة هذا الرابط</p>
          </div>
        ) : isImage ? (
          <img src={safeUrl} alt={proof.fileName || "إثبات الدفع"} />
        ) : (
          <div className="payment-proof-preview__file">
            <FiFileText aria-hidden="true" />
            <strong>{proof.fileName || "إثبات الدفع"}</strong>
            <a href={safeUrl} target="_blank" rel="noreferrer noopener">
              <FiExternalLink aria-hidden="true" />
              فتح الملف
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

export default PaymentProofPreviewModal;
