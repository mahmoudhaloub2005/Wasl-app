import { FiX } from "react-icons/fi";

import {
  getComplaintPriorityLabel,
  getComplaintStatusLabel,
} from "../../../services/providerComplaintService";
import ComplaintHistoryTimeline from "./ComplaintHistoryTimeline";
import { formatFullDateTime } from "./providerRatingsFormatters";

function InfoItem({ label, value }) {
  return (
    <div className="complaint-modal-info-item">
      <dt>{label}</dt>
      <dd>{value || "غير متوفر"}</dd>
    </div>
  );
}

function ComplaintDetailsModal({ complaint, onClose, onOpenReply, onResolve }) {
  if (!complaint) return null;

  return (
    <div className="complaint-modal-backdrop" role="presentation">
      <section
        className="complaint-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-details-title"
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
          <h2 id="complaint-details-title">{complaint.title}</h2>
          <p>{complaint.description || "غير متوفر"}</p>
        </header>

        <dl className="complaint-modal-info-grid">
          <InfoItem label="المشترك" value={complaint.customerName} />
          <InfoItem label="رقم المشترك" value={complaint.subscriberNumber} />
          <InfoItem label="تاريخ الإنشاء" value={formatFullDateTime(complaint.createdAt)} />
          <InfoItem label="آخر تحديث" value={formatFullDateTime(complaint.updatedAt)} />
          <InfoItem label="الحالة" value={getComplaintStatusLabel(complaint.status)} />
          <InfoItem label="الأولوية" value={getComplaintPriorityLabel(complaint.priority)} />
          <InfoItem label="المولد" value={complaint.relatedGenerator} />
          <InfoItem
            label="الفاتورة أو الاشتراك"
            value={complaint.relatedInvoice || complaint.relatedSubscription}
          />
        </dl>

        {complaint.attachments?.length > 0 && (
          <section className="complaint-modal-section">
            <h3>المرفقات</h3>
            <ul className="complaint-attachments-list">
              {complaint.attachments.map((attachment, index) => (
                <li key={attachment.id || attachment.name || index}>
                  {attachment.name || attachment.fileName || `مرفق ${index + 1}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="complaint-modal-section">
          <h3>رد المزود</h3>
          {complaint.providerReply?.text ? (
            <p className="complaint-modal-reply">{complaint.providerReply.text}</p>
          ) : (
            <p className="complaint-modal-muted">غير متوفر</p>
          )}
        </section>

        <section className="complaint-modal-section">
          <h3>سجل الشكوى</h3>
          <ComplaintHistoryTimeline history={complaint.history} />
        </section>

        <footer className="complaint-modal__actions">
          {complaint.status !== "resolved" && (
            <>
              <button type="button" onClick={() => onOpenReply(complaint)}>
                الرد على الطلب
              </button>
              <button
                type="button"
                className="complaint-modal__resolve"
                onClick={() => onResolve(complaint)}
              >
                تحديد كمحلولة
              </button>
            </>
          )}
          <button type="button" className="complaint-modal__secondary" onClick={onClose}>
            إغلاق
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ComplaintDetailsModal;
