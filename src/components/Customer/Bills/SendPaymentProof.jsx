import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

function SendPaymentProof({
  defaultAmount = "",
  maxAmount = 200,
  onSubmitPaymentProof,
}) {
  const [amount, setAmount] = useState(String(defaultAmount));
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const maxFileSize = 5 * 1024 * 1024;

  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/[^\d]/g, "");
    setAmount(value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setErrorMessage("");
    setSuccessMessage("");

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

  const handleSubmit = () => {
    const numericAmount = Number(amount);

    if (!amount.trim()) {
      setErrorMessage("يرجى إدخال مبلغ الدفعة.");
      return;
    }

    if (numericAmount <= 0) {
      setErrorMessage("مبلغ الدفعة يجب أن يكون أكبر من صفر.");
      return;
    }

    if (numericAmount > Number(maxAmount)) {
      setErrorMessage(`لا يمكن دفع مبلغ أكبر من ${maxAmount}.`);
      return;
    }

    if (!selectedFile) {
      setErrorMessage("يرجى رفع صورة الإيصال قبل الإرسال.");
      return;
    }

    onSubmitPaymentProof?.({
      amount: numericAmount,
      file: selectedFile,
    });

    setSuccessMessage("تم إرسال إثبات الدفع بنجاح، وهو الآن قيد التحقق.");
    setErrorMessage("");
    setAmount("");
    setSelectedFile(null);
  };

  return (
    <aside className="send-proof-card">
      <h2>إرسال دفعة</h2>

      <div className="payment-input-row">
        <label>مبلغ الدفعة</label>

      <input
  className="payment-amount-input"
  type="text"
  inputMode="numeric"
  value={amount}
  onChange={handleAmountChange}
  placeholder="اكتب المبلغ"
/>
      </div>

      <label className="upload-proof-box">
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
        />

        <IoCloudUploadOutline />

        <strong className="uploaded-file-name">
          {selectedFile ? selectedFile.name : "اضغط لرفع صورة الإيصال"}
        </strong>

        <span>حتى 5 ميجابايت PNG, JPG</span>
      </label>

      {errorMessage && <p className="payment-proof-error">{errorMessage}</p>}

      {successMessage && (
        <p className="payment-proof-success">{successMessage}</p>
      )}

      <button
        type="button"
        className="send-proof-button"
        onClick={handleSubmit}
      >
        إرسال الإثبات
      </button>
    </aside>
  );
}

export default SendPaymentProof;