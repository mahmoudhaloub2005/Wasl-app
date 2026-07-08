import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import CustomerActionSuccessModal from "../Shared/CustomerActionSuccessModal";
import { getApiErrorMessage } from "../../../utils/apiError";

function SendPaymentProof({
  defaultAmount = "",
  invoice = null,
  invoiceId = "",
  invoiceNumber = "",
  canCreateInvoice = false,
  onSubmitPaymentProof,
}) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(String(defaultAmount));
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxFileSize = 5 * 1024 * 1024;
  const canSubmitPayment = Boolean(invoiceId || canCreateInvoice);

  const handleAmountChange = (event) => {
    if (!canSubmitPayment) {
      return;
    }

    const value = event.target.value.replace(/[^\d]/g, "");
    setAmount(value);
    setErrorMessage("");
  };

  const handleFileChange = (event) => {
    if (!canSubmitPayment) {
      event.target.value = "";
      return;
    }

    const file = event.target.files[0];
    setErrorMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setErrorMessage("يرجى رفع صورة بصيغة PNG أو JPG فقط.");
      return;
    }

    if (file.size > maxFileSize) {
      setSelectedFile(null);
      setErrorMessage("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (!amount.trim()) {
      setErrorMessage("يرجى إدخال مبلغ الدفعة.");
      return;
    }

    if (numericAmount <= 0) {
      setErrorMessage("مبلغ الدفعة يجب أن يكون أكبر من صفر.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("يرجى رفع صورة الإيصال قبل الإرسال.");
      return;
    }

    if (!canSubmitPayment) {
      setErrorMessage("لا توجد فاتورة مستحقة لإرسال دفعة عليها.");
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmitPaymentProof?.({
        amount: numericAmount,
        file: selectedFile,
        invoice,
        invoiceId,
      });

      setErrorMessage("");
      setAmount("");
      setSelectedFile(null);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to submit payment proof:", error);
      setErrorMessage(
        getApiErrorMessage(error, "تعذر إرسال إثبات الدفع للخادم. حاول مرة أخرى.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <aside className="send-proof-card">
        <h2>إرسال دفعة</h2>

        {invoiceNumber && (
          <p className="payment-invoice-note">الفاتورة: {invoiceNumber}</p>
        )}

        {!canSubmitPayment && (
          <p className="payment-proof-error">
            لا توجد فاتورة مستحقة حاليا لإرسال دفعة عليها.
          </p>
        )}

        <div className="payment-input-row">
          <label>مبلغ الدفعة</label>

          <div>
            <input
              className="payment-amount-input"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="اكتب المبلغ"
              disabled={!canSubmitPayment}
            />

            {errorMessage && (
              <p className="payment-proof-error payment-proof-error-inline">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <label
          className={
            canSubmitPayment ? "upload-proof-box" : "upload-proof-box disabled"
          }
        >
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            disabled={!canSubmitPayment}
          />

          <IoCloudUploadOutline />

          <strong className="uploaded-file-name">
            {selectedFile ? selectedFile.name : "اضغط لرفع صورة الإيصال"}
          </strong>

          <span>حتى 5 ميجابايت PNG, JPG</span>
        </label>

        <button
          type="button"
          className="send-proof-button"
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmitPayment}
        >
          {isSubmitting ? "جاري إرسال الإثبات..." : "إرسال الإثبات"}
        </button>
      </aside>

      {showSuccessModal && (
        <CustomerActionSuccessModal
          title="تم إرسال الإثبات بنجاح"
          description="تم استلام إثبات الدفع بنجاح، وسيتم مراجعته من قبل مزود الخدمة في أقرب وقت."
          onClose={() => setShowSuccessModal(false)}
          onSupport={() => navigate("/contact-us")}
        />
      )}
    </>
  );
}

export default SendPaymentProof;
