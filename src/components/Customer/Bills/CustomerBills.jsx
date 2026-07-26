import { useEffect, useMemo, useState } from "react";
import "./CustomerBills.css";

import BillsSummaryCards from "./BillsSummaryCards";
import BillsTable from "./BillsTable";
import SendPaymentProof from "./SendPaymentProof";
import PaymentsHistory from "./PaymentsHistory";
import { getMyInvoices } from "../../../services/invoiceService";
import { createPayment, getMyPayments } from "../../../services/paymentService";
import { getApiErrorMessage } from "../../../utils/apiError";

function isMissingEndpoint(error) {
  return error?.response?.status === 404 || error?.response?.status === 405;
}

function CustomerBills() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  async function loadBillsData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [invoicesResult, paymentsResult] = await Promise.allSettled([
        getMyInvoices(),
        getMyPayments(),
      ]);
      let nextBills = [];
      let nextPayments = [];
      let firstError = null;

      if (invoicesResult.status === "fulfilled") {
        nextBills = Array.isArray(invoicesResult.value)
          ? invoicesResult.value
          : [];
      } else if (!isMissingEndpoint(invoicesResult.reason)) {
        firstError = invoicesResult.reason;
      }

      if (paymentsResult.status === "fulfilled") {
        nextPayments = Array.isArray(paymentsResult.value)
          ? paymentsResult.value
          : [];
      } else if (!isMissingEndpoint(paymentsResult.reason)) {
        firstError = firstError || paymentsResult.reason;
      }

      setBills(nextBills);
      setPayments(nextPayments);

      if (firstError) {
        setErrorMessage(
          getApiErrorMessage(firstError, "تعذر تحميل الفواتير من الخادم.")
        );
      }
    } catch (error) {
      setBills([]);
      setPayments([]);
      setErrorMessage(
        getApiErrorMessage(error, "تعذر تحميل الفواتير من الخادم.")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadBillsData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const unpaidBills = useMemo(
    () => bills.filter((bill) => bill.status === "unpaid"),
    [bills]
  );

  const paidBills = useMemo(
    () => bills.filter((bill) => bill.status === "paid"),
    [bills]
  );

  const pendingPayments = useMemo(
    () => bills.filter((bill) => bill.status === "pending"),
    [bills]
  );

  const summaryCards = useMemo(() => {
    const dueAmount = unpaidBills.reduce(
      (total, bill) => total + Number(bill.amountValue || 0),
      0
    );

    const paidAmount = paidBills.reduce(
      (total, bill) => total + Number(bill.amountValue || 0),
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
        description: pendingPayments.length
          ? `${pendingPayments.length} دفعة قيد التحقق`
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
  }, [unpaidBills, paidBills, pendingPayments]);

  const defaultPaymentBill = unpaidBills[0] || null;
  const paymentInvoice =
    selectedInvoice?.status === "unpaid" ? selectedInvoice : defaultPaymentBill;

  function handleViewBill(bill) {
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedInvoice(bill);
  }

  async function handleSubmitPaymentProof({ amount, file, invoiceId }) {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!invoiceId) {
        const error = new Error("لا توجد فاتورة حقيقية لإرسال دفعة عليها.");
        error.displayMessage = error.message;
        throw error;
      }

      await createPayment({
        amount,
        file,
        invoiceId,
      });

      await loadBillsData();

      setSelectedInvoice(null);
      setSuccessMessage("تم إرسال إثبات الدفع بنجاح");
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "تعذر إرسال الدفعة. حاول مرة أخرى.")
      );

      throw error;
    }
  }

  return (
    <main className="customer-bills-page" dir="rtl">
      <div className="customer-bills-container">
        <BillsSummaryCards cards={summaryCards} />

        {loading && (
          <p className="subscription-action-message">
            جاري تحميل الفواتير...
          </p>
        )}

        {errorMessage && (
          <p className="subscription-action-message">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="subscription-action-message">{successMessage}</p>
        )}

        <div className="bills-main-grid">
          <div className="bills-right-column">
            <BillsTable
              bills={bills}
              loading={loading}
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
                  {(selectedInvoice.generatorName ||
                    selectedInvoice.providerName) && (
                    <div>
                      <span>المولد / المزود</span>
                      <strong>
                        {selectedInvoice.providerName ||
                          selectedInvoice.generatorName}
                      </strong>
                    </div>
                  )}

                  {selectedInvoice.packageText && (
                    <div>
                      <span>الباقة / الأمبير</span>
                      <strong>{selectedInvoice.packageText}</strong>
                    </div>
                  )}

                  <div>
                    <span>رقم الفاتورة</span>
                    <strong>{selectedInvoice.invoiceNumber || "-"}</strong>
                  </div>

                  <div>
                    <span>الشهر</span>
                    <strong>{selectedInvoice.month || "-"}</strong>
                  </div>

                  <div>
                    <span>المبلغ</span>
                    <strong>{selectedInvoice.amount || "-"}</strong>
                  </div>

                  <div>
                    <span>الحالة</span>
                    <strong>{selectedInvoice.statusText || "-"}</strong>
                  </div>

                  <div>
                    <span>طريقة الدفع</span>
                    <strong>{selectedInvoice.paymentMethod || "-"}</strong>
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
            key={`${paymentInvoice?.id || "empty"}-${paymentInvoice?.amountValue || ""}`}
            defaultAmount={paymentInvoice?.amountValue || ""}
            invoice={paymentInvoice}
            invoiceId={paymentInvoice?.id || ""}
            invoiceNumber={paymentInvoice?.invoiceNumber || ""}
            onSubmitPaymentProof={handleSubmitPaymentProof}
          />
        </div>
      </div>
    </main>
  );
}

export default CustomerBills;


