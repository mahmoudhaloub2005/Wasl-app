import { useState } from "react";
import { FiX } from "react-icons/fi";

import {
  complaintStatusOptions,
  getComplaintPriorityLabel,
  getComplaintStatusLabel,
} from "./providerComplaintsUi";
import { formatFullDateTime } from "./providerRatingsFormatters";

function ComplaintReplyModal({
  complaint,
  isSubmitting,
  onClose,
  onResolve,
  onSubmit,
}) {
  const [reply, setReply] = useState(complaint?.providerReply?.text || "");
  const [status, setStatus] = useState(
    complaint?.status === "resolved" ? "resolved" : "under_review"
  );
  const [errorMessage, setErrorMessage] = useState("");

  if (!complaint) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!reply.trim()) {
      setErrorMessage("يرجى كتابة الرد قبل الإرسال.");
      return;
    }

    setErrorMessage("");
    const succeeded = await onSubmit(complaint.id, {
      reply: reply.trim(),
      status,
    });

    if (succeeded) {
      onClose();
    }
  }

  return (
    <div className="complaint-modal-backdrop" role="presentation">
      <section
        className="complaint-modal complaint-modal--reply"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-reply-title"
      >
        <button
          type="button"
          className="complaint-modal__close"
          onClick={onClose}
          aria-label="إغلاق"
        >
          <FiX aria-hidden="true" />
        </button>

        <header className="complaint-modal__header">
          <span>{complaint.ticketNumber}</span>
          <h2 id="complaint-reply-title">الرد على الشكوى</h2>
          <p>{complaint.title}</p>
        </header>

        <div className="complaint-reply-summary">
          <div>
            <span>المشترك</span>
            <strong>{complaint.customerName}</strong>
          </div>
          <div>
            <span>رقم المشترك</span>
            <strong>{complaint.subscriberNumber || "غير متوفر"}</strong>
          </div>
          <div>
            <span>الحالة الحالية</span>
            <strong>{getComplaintStatusLabel(complaint.status)}</strong>
          </div>
          <div>
            <span>الأولوية</span>
            <strong>{getComplaintPriorityLabel(complaint.priority)}</strong>
          </div>
          <div>
            <span>تاريخ الإنشاء</span>
            <strong>{formatFullDateTime(complaint.createdAt)}</strong>
          </div>
        </div>

        <p className="complaint-reply-description">
          {complaint.description || "غير متوفر"}
        </p>

        <form className="complaint-reply-form" onSubmit={handleSubmit}>
          <label htmlFor="complaintReply">اكتب ردك على الشكوى</label>
          <textarea
            id="complaintReply"
            value={reply}
            onChange={(event) => {
              setReply(event.target.value);
              setErrorMessage("");
            }}
            placeholder="اكتب ردا واضحا للعميل..."
            disabled={isSubmitting}
          />

          <label htmlFor="complaintReplyStatus">تحديث الحالة</label>
          <select
            id="complaintReplyStatus"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={isSubmitting}
          >
            {complaintStatusOptions
              .filter((option) => option.value !== "all" && option.value !== "resolved")
              .map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
          </select>

          {errorMessage && <p className="complaint-reply-form__error">{errorMessage}</p>}

          <div className="complaint-modal__actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جار الإرسال..." : "إرسال الرد"}
            </button>
            {complaint.status !== "resolved" && (
              <button
                type="button"
                className="complaint-modal__resolve"
                onClick={() => onResolve(complaint)}
                disabled={isSubmitting}
              >
                تحديد كمحلولة
              </button>
            )}
            <button
              type="button"
              className="complaint-modal__secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ComplaintReplyModal;
