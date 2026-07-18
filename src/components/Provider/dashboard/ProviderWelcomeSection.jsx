function ProviderWelcomeSection({ providerName, subtitle, onAddGenerator }) {
  return (
    <section className="provider-dashboard-welcome">
      <button
        type="button"
        className="provider-dashboard-welcome__action"
        onClick={onAddGenerator}
      >
        إضافة مولد جديد
      </button>

      <div className="provider-dashboard-welcome__text">
        <h1 className="provider-dashboard-welcome__title">
          <span>مرحباً بك،</span>
          <bdi dir="auto">{providerName}</bdi>
        </h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

export default ProviderWelcomeSection;
