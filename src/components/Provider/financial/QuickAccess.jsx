
import "./FinancialLayout.css";

import {
  FaFileInvoice,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

import QuickAccessCard from "./QuickAccessCard";

function QuickAccess() {

  return (

    <section className="quick-access">

      <QuickAccessCard
        title="الفواتير"
        description="إدارة وإنشاء وإرسال الفواتير للعملاء"
        buttonText="إدارة الفواتير"
        buttonColor="#EAF1FF"
        icon={<FaFileInvoice />}
      />

      <QuickAccessCard
        title="المدفوعات"
        description="مراجعة مستندات القبض وتتبع الدفع"
        buttonText="تأكيد 2 دفعات"
        buttonColor="#FFE8B5"
        icon={<FaShieldAlt />}
      />

      <QuickAccessCard
        title="التقارير المالية"
        description="استخراج التقارير بصيغة PDF وجداول"
        buttonText="تقرير الشهر الحالي"
        buttonColor="#ffffff"
        icon={<FaChartLine />}
      />

    </section>

  );

}

export default QuickAccess;
