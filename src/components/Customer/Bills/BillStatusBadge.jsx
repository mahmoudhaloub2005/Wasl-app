function BillStatusBadge({ status, text }) {
  return (
    <span className={`status-badge ${status}`}>
      {text}
    </span>
  );
}

export default BillStatusBadge;