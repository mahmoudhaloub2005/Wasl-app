import {
  IoAlertCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";

function ComplaintsList({ complaints, onEditComplaint, onDeleteComplaint }) {
  if (complaints.length === 0) {
    return (
      <div className="complaints-empty-state">
        <h3>لا توجد شكاوى حالياً</h3>
        <p>عند إضافة شكوى جديدة ستظهر هنا.</p>
      </div>
    );
  }

  return (
    <div className="complaints-list">
      {complaints.map((complaint) => (
        <article className="complaint-card" key={complaint.id}>
          <div className="complaint-card-header">
            <div className="complaint-provider-info">
              <span className="complaint-provider-icon">
                <IoAlertCircleOutline />
              </span>

              <div>
                <h3>{complaint.title}</h3>
                <p>
                  {complaint.provider} • {complaint.date}
                </p>
              </div>
            </div>

            <span className={`complaint-status-badge ${complaint.status}`}>
              {complaint.statusText}
            </span>
          </div>

          <p className="complaint-text">{complaint.description}</p>

          <div className="complaint-actions">
            <button
              type="button"
              className="complaint-action-button edit"
              onClick={() => onEditComplaint?.(complaint)}
            >
              <IoCreateOutline />
              تعديل
            </button>

            <button
              type="button"
              className="complaint-action-button delete"
              onClick={() => onDeleteComplaint?.(complaint.id)}
            >
              <IoTrashOutline />
              حذف
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ComplaintsList;