import "./FinancialLayout.css";
import FinancialRow from "./FinancialRow";

function FinancialTable() {

  return (

    <div className="financial-table">

      <h2>آخر الفواتير</h2>

      <table>

        <thead>

          <tr>

            <th>اسم العميل</th>

            <th>المبلغ</th>

            <th>تاريخ الاستحقاق</th>

            <th>الحالة</th>

          </tr>

        </thead>

        <tbody>

          <FinancialRow
            customer="أحمد محمد"
            amount="450"
            dueDate="24 مايو 2024"
            status="مدفوعة"
            statusClass="paid"
          />

          <FinancialRow
            customer="سارة خالد"
            amount="1200"
            dueDate="28 مايو 2024"
            status="قيد الانتظار"
            statusClass="pending"
          />

          <FinancialRow
            customer="مؤسسة المجد"
            amount="3750"
            dueDate="15 مايو 2024"
            status="متأخرة"
            statusClass="late"
          />

          <FinancialRow
            customer="فهد ناصر"
            amount="890"
            dueDate="1 يونيو 2024"
            status="مسودة"
            statusClass="draft"
          />

        </tbody>

      </table>

    </div>

  );

}

export default FinancialTable;

