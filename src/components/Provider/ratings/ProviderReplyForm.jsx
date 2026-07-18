import { useState } from "react";

function ProviderReplyForm({
  cancelLabel = "إلغاء",
  initialValue = "",
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel = "إرسال الرد",
}) {
  const [reply, setReply] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!reply.trim()) {
      setErrorMessage("يرجى كتابة الرد قبل الإرسال.");
      return;
    }

    setErrorMessage("");
    await onSubmit(reply.trim());
  }

  return (
    <form className="provider-reply-form" onSubmit={handleSubmit}>
      <textarea
        value={reply}
        onChange={(event) => {
          setReply(event.target.value);
          setErrorMessage("");
        }}
        placeholder="اكتب ردك على العميل..."
        disabled={isSubmitting}
      />

      {errorMessage && <p className="provider-reply-form__error">{errorMessage}</p>}

      <div className="provider-reply-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جار الإرسال..." : submitLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}

export default ProviderReplyForm;
