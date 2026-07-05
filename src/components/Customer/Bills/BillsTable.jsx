import { FiFilter } from "react-icons/fi";
import { IoChevronBackOutline } from "react-icons/io5";

import BillStatusBadge from "./BillStatusBadge";

function BillsTable({ bills }) {
  return (
    <section className="bills-table-card">
      <div className="bills-table-title-row">
        <h2>جدول الفواتير</h2>

        <button type="button" className="filter-button">
          <FiFilter />
          تصفية
        </button>
      </div>

      <table className="bills-table">
        <thead>
          <tr>
            <th>رقم الفاتورة</th>
            <th>الشهر</th>
            <th>المبلغ</th>
            <th>الحالة</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.invoiceNumber}</td>
              <td>{bill.month}</td>
              <td>{bill.amount}</td>
              <td>
                <BillStatusBadge status={bill.status} text={bill.statusText} />
              </td>
              <td>
                <button type="button" className="invoice-arrow-button">
                  <IoChevronBackOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default BillsTable;