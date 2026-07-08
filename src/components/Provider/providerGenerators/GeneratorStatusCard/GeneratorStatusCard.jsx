import "./GeneratorStatusCard.css";

function GeneratorStatusCard() {

  return (

    <div className="generator-status-card">

      <div className="generator-image">

        <img
          src="/images/generator1.jpg"
          alt="generator"
        />

        <span className="status active">
          يعمل بكفاءة
        </span>

      </div>

      <div className="generator-info">

        <div className="generator-header">

          <h2>مولد القطاع الشمالي (C-102)</h2>

          <label className="switch">

            <input type="checkbox" defaultChecked />

            <span className="slider"></span>

          </label>

        </div>

        <p>القدرة : 250 KVA</p>

        <p>الاستهلاك : %78</p>

        <div className="progress">

          <div className="progress-fill"></div>

        </div>

        <span>195 / 250 Amps</span>

      </div>

    </div>

  );

}

export default GeneratorStatusCard;

