const statusToneMap = {
  draft: "draft",
  overdue: "overdue",
  paid: "paid",
  pending: "pending",
};

function FinancialStatusBadge({ status, label }) {
  const tone = statusToneMap[status] || statusToneMap.draft;

  return (
    <span className={`financial-status-badge financial-status-badge--${tone}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}

export default FinancialStatusBadge;
