import "./CustomerBills.css";

import BillsSummaryCards from "./BillsSummaryCards";
import BillsTable from "./BillsTable";
import SendPaymentProof from "./SendPaymentProof";
import PaymentsHistory from "./PaymentsHistory";

const summaryCards = [
  {
    id: 1,
    title: "الفواتير المستحقة",
    value: "200",
    description: "2 فاتورة لم تدفع",
    type: "danger",
    icon: "receipt",
  },
  {
    id: 2,
    title: "إجمالي المدفوعات",
    value: "800",
    description: "آخر 12 شهر",
    type: "blue",
    icon: "wallet",
  },
  {
    id: 3,
    title: "آخر دفعة",
    value: "100",
    description: "أمس، 14:30",
    type: "green",
    icon: "success",
  },
];

const bills = [
  {
    id: 1,
    invoiceNumber: "#INV-8821",
    month: "يونيو 2026",
    amount: "100",
    status: "unpaid",
    statusText: "غير مدفوعة",
  },
  {
    id: 2,
    invoiceNumber: "#INV-8819",
    month: "يونيو 2026",
    amount: "100",
    status: "pending",
    statusText: "قيد التحقق",
  },
  {
    id: 3,
    invoiceNumber: "#INV-8815",
    month: "يونيو 2026",
    amount: "100",
    status: "paid",
    statusText: "مدفوعة",
  },
];

const payments = [
  {
    id: 1,
    title: "تحويل بنكي - بنك فلسطين",
    date: "5 يونيو 2026 • 09:15 ص",
    amount: "+100",
  },
  {
    id: 2,
    title: "دفع نقدي - الوكيل",
    date: "20 مايو 2026 • 11:45 ص",
    amount: "+100",
  },
];

function CustomerBills() {
  return (
    <main className="customer-bills-page" dir="rtl">
      <div className="customer-bills-container">
        <BillsSummaryCards cards={summaryCards} />

        <div className="bills-main-grid">
          <div className="bills-right-column">
            <BillsTable bills={bills} />
            <PaymentsHistory payments={payments} />
          </div>

<SendPaymentProof amount="200" />        </div>
      </div>
    </main>
  );
}

export default CustomerBills;