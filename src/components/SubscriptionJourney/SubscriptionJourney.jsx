import "./SubscriptionJourney.css";

function SubscriptionJourney() {
  return (
    <section className="journey">

      <h2>رحلة الاشتراك</h2>

      <div className="journey-steps">

        <div className="step active">
          ✓
          <p>تم تقديم الطلب</p>
        </div>

        <div className="step active">
          ✓
          <p>تمت الموافقة</p>
        </div>

        <div className="step active">
          ✓
          <p>اشتراك نشط</p>
        </div>

      </div>

    </section>
  );
}

export default SubscriptionJourney;