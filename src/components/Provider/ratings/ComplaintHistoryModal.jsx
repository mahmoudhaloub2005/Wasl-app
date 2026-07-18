import { FiX } from "react-icons/fi";

import ComplaintHistoryTimeline from "./ComplaintHistoryTimeline";

function ComplaintHistoryModal({ complaint, onClose }) {
  if (!complaint) return null;

  return (
    <div className="complaint-modal-backdrop" role="presentation">
      <section
        className="complaint-modal complaint-modal--history"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-history-title"
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
          <h2 id="complaint-history-title">سجل الشكوى</h2>
          <p>{complaint.title}</p>
        </header>

        <ComplaintHistoryTimeline history={complaint.history} />

        <footer className="complaint-modal__actions">
          <button type="button" className="complaint-modal__secondary" onClick={onClose}>
            إغلاق
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ComplaintHistoryModal;
