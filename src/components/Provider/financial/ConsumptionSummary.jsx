import "./FinancialLayout.css";
import ConsumptionBar from "./ConsumptionBar";

function ConsumptionSummary() {

  return (

    <div className="consumption-summary">

      <h2>سعة استهلاك المشتركين</h2>

      <ConsumptionBar
        name="مولد القطاع الشمالي"
        percentage={85}
        value="1700 / 2000 A"
        color="#0D47A1"
      />

      <ConsumptionBar
        name="مولد حي المنصور"
        percentage={42}
        value="840 / 2000 A"
        color="#F4B400"
      />

      <ConsumptionBar
        name="مولد المنطقة الصناعية"
        percentage={95}
        value="1900 / 2000 A"
        color="#E53935"
      />

      <button className="show-details-btn">
        مشاهدة كافة البيانات
      </button>

    </div>

  );

}

export default ConsumptionSummary;
