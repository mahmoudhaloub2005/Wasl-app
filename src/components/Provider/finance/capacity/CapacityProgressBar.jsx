function CapacityProgressBar({ percentage, status, statusLabel }) {
  const safePercentage = Math.max(0, Math.min(100, Number(percentage || 0)));

  return (
    <div
      className="capacity-progress"
      aria-label={`نسبة الاستهلاك ${safePercentage}% - ${statusLabel}`}
    >
      <div className="capacity-progress__meta">
        <span>{safePercentage}%</span>
        <b>{statusLabel}</b>
      </div>
      <span className="capacity-progress__track" aria-hidden="true">
        <i
          className={`capacity-progress__fill capacity-progress__fill--${status}`}
          style={{ width: `${safePercentage}%` }}
        />
      </span>
    </div>
  );
}

export default CapacityProgressBar;
