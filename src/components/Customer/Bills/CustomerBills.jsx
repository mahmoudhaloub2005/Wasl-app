import { useEffect, useMemo, useState } from "react";
import "./CustomerBills.css";

import BillsSummaryCards from "./BillsSummaryCards";
import BillsTable from "./BillsTable";
import SendPaymentProof from "./SendPaymentProof";
import PaymentsHistory from "./PaymentsHistory";
import {
  getInvoiceDetails,
  getMyInvoices,
} from "../../../services/invoiceService";
import { createPayment, getMyPayments } from "../../../services/paymentService";
import { getApiErrorMessage } from "../../../utils/apiError";

const fallbackBills = [
  {
    id: 1,
    invoiceNumber: "#INV-8821",
    month: "يونيو 2026",
    amount: "100",
    amountValue: 100,
    status: "unpaid",
    statusText: "غير مدفوعة",
    paymentMethod: "فاتورة مستحقة",
  },
  {
    id: 2,
    invoiceNumber: "#INV-8819",
    month: "يونيو 2026",
    amount: "100",
    amountValue: 100,
    status: "pending",
    statusText: "قيد التحقق",
    paymentMethod: "دفعة قيد التحقق",
  },
  {
    id: 3,
    invoiceNumber: "#INV-8815",
    month: "يونيو 2026",
    amount: "100",
    amountValue: 100,
    status: "paid",
    statusText: "مدفوعة",
    paymentMethod: "دفع نقدي - الوكيل",
  },
];

const fallbackPayments = [
  {
    id: 1,
    title: "تحويل بنكي - بنك فلسطين",
    date: "26 يونيو 2026، 09:15 ص",
    amount: "+100",
  },
  {
    id: 2,
    title: "دفع نقدي - الوكيل",
    date: "20 يونيو 2026، 11:45 ص",
    amount: "+100",
  },
];

function CustomerBills() {
  const [bills, setBills] = useState(fallbackBills);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState("");
  const [payments, setPayments] = useState(fallbackPayments);

  useEffect(() => {
    let isMounted = true;

    async function loadInvoices() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [invoices, myPayments] = await Promise.all([
          getMyInvoices(),
          getMyPayments(),
        ]);

        if (isMounted) {
          setBills(invoices);
          setPayments(myPayments.length ? myPayments : []);
        }
      } catch (error) {
        console.error("Failed to load invoices:", error);

        if (isMounted) {
          setErrorMessage(
            "تعذر تحميل الفواتير من الخادم، يتم عرض البيانات المتاحة حاليا."
          );
          setBills(fallbackBills);
          setPayments(fallbackPayments);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInvoices();

    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = useMemo(() => {
    const unpaidBills = bills.filter((bill) => bill.status === "unpaid");
    const paidBills = bills.filter((bill) => bill.status === "paid");
    const pendingBills = bills.filter((bill) => bill.status === "pending");
    const dueAmount = unpaidBills.reduce(
      (total, bill) => total + bill.amountValue,
      0
    );
    const paidAmount = paidBills.reduce(
      (total, bill) => total + bill.amountValue,
      0
    );
    const lastPaidBill = paidBills[0];

    return [
      {
        id: 1,
        title: "الفواتير المستحقة",
        value: String(dueAmount),
        description: `${unpaidBills.length} فاتورة لم تدفع`,
        type: "danger",
        icon: "receipt",
      },
      {
        id: 2,
        title: "إجمالي المدفوعات",
        value: String(paidAmount),
        description: pendingBills.length
          ? `${pendingBills.length} دفعة قيد التحقق`
          : "آخر 12 شهر",
        type: "blue",
        icon: "wallet",
      },
      {
        id: 3,
        title: "آخر دفعة",
        value: lastPaidBill ? lastPaidBill.amount : "0",
        description: lastPaidBill?.month || "لا توجد دفعات",
        type: "green",
        icon: "success",
      },
    ];
  }, [bills]);

  const defaultPaymentBill = bills.find((bill) => bill.status === "unpaid");
  const defaultPaymentAmount = defaultPaymentBill?.amount || "";
  const defaultPaymentInvoiceId = defaultPaymentBill?.id || "";

  async function handleViewBill(bill) {
    if (!bill.id) {
      setSelectedInvoice(bill);
      return;
    }

    try {
      setLoadingInvoiceId(bill.id);
      setErrorMessage("");

      const invoice = await getInvoiceDetails(bill.id);
      setSelectedInvoice(invoice);
    } catch (error) {
      console.error("Failed to load invoice details:", error);
      setErrorMessage(
        getApiErrorMessage(error, "تعذر تحميل تفاصيل الفاتورة من الخادم.")
      );
    } finally {
      setLoadingInvoiceId("");
    }
  }

  async function handleSubmitPaymentProof({ amount, file, invoiceId }) {
    await createPayment({
      amount,
      file,
      invoiceId,
    });

    const [invoices, myPayments] = await Promise.all([
      getMyInvoices(),
      getMyPayments(),
    ]);

    setBills(invoices);
    setPayments(myPayments);
  }

  return (
    <main className="customer-bills-page" dir="rtl">
      <div className="customer-bills-container">
        <BillsSummaryCards cards={summaryCards} />

        {loading && (
          <p className="subscription-action-message">جاري تحميل الفواتير...</p>
        )}

        {errorMessage && (
          <p className="subscription-action-message">{errorMessage}</p>
        )}

        <div className="bills-main-grid">
          <div className="bills-right-column">
            <BillsTable
              bills={bills}
              loadingInvoiceId={loadingInvoiceId}
              onViewBill={handleViewBill}
            />

            {selectedInvoice && (
              <section className="invoice-details-card">
                <div className="invoice-details-title">
                  <h2>تفاصيل الفاتورة</h2>
                  <button type="button" onClick={() => setSelectedInvoice(null)}>
                    إغلاق
                  </button>
                </div>

                <div className="invoice-details-grid">
                  <div>
                    <span>رقم الفاتورة</span>
                    <strong>{selectedInvoice.invoiceNumber}</strong>
                  </div>
                  <div>
                    <span>الشهر</span>
                    <strong>{selectedInvoice.month}</strong>
                  </div>
                  <div>
                    <span>المبلغ</span>
                    <strong>{selectedInvoice.amount}</strong>
                  </div>
                  <div>
                    <span>الحالة</span>
                    <strong>{selectedInvoice.statusText}</strong>
                  </div>
                  <div>
                    <span>طريقة الدفع</span>
                    <strong>{selectedInvoice.paymentMethod}</strong>
                  </div>
                  <div>
                    <span>تاريخ الدفع</span>
                    <strong>{selectedInvoice.paidAt || "غير محدد"}</strong>
                  </div>
                </div>
              </section>
            )}

            <PaymentsHistory payments={payments} />
          </div>

          <SendPaymentProof
            defaultAmount={defaultPaymentAmount}
            invoiceId={defaultPaymentInvoiceId}
            invoiceNumber={defaultPaymentBill?.invoiceNumber || ""}
            onSubmitPaymentProof={handleSubmitPaymentProof}
          />
        </div>
      </div>
    </main>
  );
}

export default CustomerBills;
