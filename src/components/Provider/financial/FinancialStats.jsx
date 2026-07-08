import "./FinancialLayout.css";
import {
  FaMoneyBillWave,
  FaChartBar,
  FaWallet,
} from "react-icons/fa";

import FinancialStatCard from "./FinancialStatCard";

function FinancialStats() {
  return (
    <section className="financial-stats">
      <FinancialStatCard
        title="الإيراد الشهري"
        value="4520"
        growth="+12.5%"
        color="#0D47A1"
        icon={<FaMoneyBillWave />}
      />

      <FinancialStatCard
        title="الإيراد السنوي"
        value="5428"
        growth="+8.2%"
        color="#E8B100"
        icon={<FaChartBar />}
      />

      <FinancialStatCard
        title="صافي الأرباح"
        value="1284"
        growth="+15%"
        color="#2BAE66"
        icon={<FaWallet />}
      />
    </section>
  );
}

export default FinancialStats;