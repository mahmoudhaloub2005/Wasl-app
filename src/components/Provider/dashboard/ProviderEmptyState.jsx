function ProviderEmptyState({ message, className = "" }) {
  return (
    <div className={`provider-dashboard-empty ${className}`.trim()}>
      {message}
    </div>
  );
}

export default ProviderEmptyState;
