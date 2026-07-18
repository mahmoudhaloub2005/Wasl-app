function ProviderErrorState({ message, className = "" }) {
  return (
    <div
      className={`provider-dashboard-alert ${className}`.trim()}
      role="alert"
    >
      {message}
    </div>
  );
}

export default ProviderErrorState;
