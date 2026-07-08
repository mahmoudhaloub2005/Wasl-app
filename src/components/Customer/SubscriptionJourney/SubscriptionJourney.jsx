import "./SubscriptionJourney.css";

function SubscriptionJourney({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <section className="journey">
      <h2>رحلة الاشتراك</h2>

      <div className="journey-steps">
        {steps.map((step) => (
          <div className={`step ${step.type || ""}`} key={step.id || step.title}>
            {step.type === "done" ? "✓" : ""}
            <p>{step.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SubscriptionJourney;
