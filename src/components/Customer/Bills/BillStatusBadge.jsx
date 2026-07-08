function BillStatusBadge({ status, text }) {
  return (
    <span className={`bill-status-badge ${status}`}>
      {text}
    </span>
  );
}

export default BillStatusBadge;
