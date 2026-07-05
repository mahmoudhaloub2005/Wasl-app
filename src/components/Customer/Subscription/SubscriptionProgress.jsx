import { IoCheckmark, IoFlash } from "react-icons/io5";

function SubscriptionProgress({ steps }) {
  return (
    <section className="subscription-progress-card">
      <h2>مسار الاشتراك</h2>

      <div className="subscription-progress-steps">
        {steps.map((step, index) => (
          <div className="subscription-progress-item" key={step.id}>
            <div
              className={`progress-circle ${
                step.type === "active" ? "active" : "done"
              }`}
            >
              {step.type === "active" ? <IoFlash /> : <IoCheckmark />}
            </div>

            <h3>{step.title}</h3>
            <p>{step.date}</p>

            {index !== steps.length - 1 && <span className="progress-line" />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SubscriptionProgress;