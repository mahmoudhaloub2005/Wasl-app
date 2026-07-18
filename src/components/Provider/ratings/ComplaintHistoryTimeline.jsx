import { formatFullDateTime } from "./providerRatingsFormatters";

function ComplaintHistoryTimeline({ history = [] }) {
  if (!history.length) {
    return <p className="complaint-history-empty">لا يوجد سجل متاح لهذه الشكوى.</p>;
  }

  return (
    <ol className="complaint-history-timeline">
      {history.map((item, index) => (
        <li key={item.id || `${item.action}-${index}`}>
          <span className="complaint-history-timeline__dot" />
          <div>
            <strong>{item.action || "تحديث على الشكوى"}</strong>
            <small>
              {formatFullDateTime(item.createdAt)} · {item.actor || "النظام"}
            </small>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default ComplaintHistoryTimeline;
