import { FiUser } from "react-icons/fi";

import {
  getComplaintPriorityLabel,
  getComplaintStatusLabel,
} from "../../../services/providerComplaintService";
import { formatComplaintTime } from "./providerRatingsFormatters";

function getActionLabel(status) {
  if (status === "resolved") return "عرض السجل";
  if (status === "under_review") return "الرد على الطلب";

  return "عرض التفاصيل";
}

function ProviderComplaintCard({ complaint, onOpenDetails, onOpenHistory, onOpenReply }) {
  function handleAction() {
    if (complaint.status === "resolved") {
      onOpenHistory(complaint);
      return;
    }

    if (complaint.status === "under_review") {
      onOpenReply(complaint);
      return;
    }

    onOpenDetails(complaint);
  }

  return (
    <article className="provider-complaint-card">
      <section className="provider-complaint-card__main">
        <div className="provider-complaint-card__meta">
          <span className="provider-complaint-card__ticket">
            {complaint.ticketNumber}
          </span>
          <span>{formatComplaintTime(complaint.createdAt)}</span>
          <span
            className={`provider-complaint-priority provider-complaint-priority--${complaint.priority}`}
          >
            {getComplaintPriorityLabel(complaint.priority)}
          </span>
        </div>

        <h2>{complaint.title}</h2>

        <div className="provider-complaint-card__customer">
          <span className="provider-complaint-card__customer-icon">
            <FiUser aria-hidden="true" />
          </span>
          <span>{complaint.customerName}</span>
          <i aria-hidden="true" />
          <span>
            رقم المشترك: <bdi>{complaint.subscriberNumber || "غير متوفر"}</bdi>
          </span>
        </div>
      </section>

      <aside className="provider-complaint-card__side">
        <div>
          <span className="provider-complaint-card__side-label">الحالة</span>
          <span
            className={`provider-complaint-status provider-complaint-status--${complaint.status}`}
          >
            <i aria-hidden="true" />
            {getComplaintStatusLabel(complaint.status)}
          </span>
        </div>

        <button
          type="button"
          className={
            complaint.status === "resolved"
              ? "provider-complaint-card__action provider-complaint-card__action--muted"
              : "provider-complaint-card__action"
          }
          onClick={handleAction}
        >
          {getActionLabel(complaint.status)}
        </button>
      </aside>
    </article>
  );
}

export default ProviderComplaintCard;
