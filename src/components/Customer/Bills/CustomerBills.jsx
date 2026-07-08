import { useEffect, useMemo, useState } from "react";
import "./CustomerBills.css";

import BillsSummaryCards from "./BillsSummaryCards";
import BillsTable from "./BillsTable";
import SendPaymentProof from "./SendPaymentProof";
import PaymentsHistory from "./PaymentsHistory";
import {
  ensureInvoiceForSubscription,
  getMyInvoices,
} from "../../../services/invoiceService";
import { createPayment, getMyPayments } from "../../../services/paymentService";
import { getCurrentSubscription } from "../../../services/subscriptionService";
import { getApiErrorMessage } from "../../../utils/apiError";

function isMissingEndpoint(error) {
  return error?.response?.status === 404 || error?.response?.status === 405;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "";

  const text = String(value);
  return /شيكل|₪/.test(text) ? text : `${text} شيكل`;
}

function formatCurrentArabicMonth(date = new Date()) {
  return new Intl.DateTimeFormat("ar", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getSubscriptionAmount(subscription = {}) {
  const directAmount = toNumber(
    subscription.monthlyCost ||
      subscription.monthly_cost ||
      subscription.priceText ||
      subscription.invoice?.currentBill ||
      subscription.amount
  );

  if (directAmount > 0) return directAmount;

  const pricePerAmpere = toNumber(
    subscription.pricePerAmpereValue ||
      subscription.pricePerAmpere ||
      subscription.ampPrice
  );
  const amperes = toNumber(
    subscription.ampereValue || subscription.amperes || subscription.ampere
  );

  return pricePerAmpere > 0 && amperes > 0 ? pricePerAmpere * amperes : 0;
}

function getSubscriptionProviderName(subscription = {}) {
  return (
    subscription.providerName ||
    subscription.provider_name ||
    subscription.provider?.name ||
    subscription.generator?.provider?.name ||
    subscription.generatorName ||
    subscription.generator_name ||
    "المولد"
  );
}

function buildSubscriptionDraftInvoice(subscription) {
  if (!subscription?.id || !subscription?.isActive) return null;

  const now = new Date();
  const year = now.getFullYear();
  const monthNumber = String(now.getMonth() + 1).padStart(2, "0");
  const amountValue = getSubscriptionAmount(subscription);
  const subscriptionId = String(subscription.id);

  return {
    id: "",
    temporaryId: `TEMP-${year}-${monthNumber}-${subscriptionId}`,
    invoiceNumber: `TEMP-${year}-${monthNumber}-${subscriptionId}`,
    month: formatCurrentArabicMonth(now),
    amount: formatCurrency(amountValue),
    amountValue,
    status: "unpaid",
    statusText: "غير مدفوعة",
    paidAt: "",
    dueDate: "",
    issuedAt: now.toISOString(),
    paymentMethod: "دفعة",
    isTemporary: true,
    needsInvoiceCreation: true,
    subscriptionId,
    generatorName: subscription.generatorName || subscription.generator_name || "",
    providerName: getSubscriptionProviderName(subscription),
    packageText: subscription.ampere || subscription.package || "",
  };
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

      const [invoicesResult, paymentsResult, subscriptionResult] =
        await Promise.allSettled([
          getMyInvoices(),
          getMyPayments(),
          getCurrentSubscription(),
        ]);

      let nextBills = [];
      let nextPayments = [];
      let activeSubscription = null;
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

      if (subscriptionResult.status === "fulfilled") {
        activeSubscription = subscriptionResult.value?.isActive
          ? subscriptionResult.value
          : null;
      } else if (!isMissingEndpoint(subscriptionResult.reason)) {
        firstError = firstError || subscriptionResult.reason;
      }

      if (nextBills.length === 0 && activeSubscription) {
        const draftInvoice = buildSubscriptionDraftInvoice(activeSubscription);

        if (draftInvoice) {
          nextBills = [draftInvoice];
        }
      }

      setBills(nextBills);
      setPayments(nextPayments);

      if (firstError) {
        setErrorMessage(
          getApiErrorMessage(firstError, "تعذر تحميل الفواتير من الخادم.")
        );
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);

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
    loadBillsData();
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

  async function handleSubmitPaymentProof({ amount, file, invoice, invoiceId }) {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      let payableInvoiceId = invoiceId;

      if (!payableInvoiceId && invoice?.needsInvoiceCreation) {
        const realInvoice = await ensureInvoiceForSubscription({
          subscriptionId: invoice.subscriptionId,
          amount: invoice.amountValue || amount,
          month: invoice.month,
        });

        payableInvoiceId = realInvoice.id;
      }

      await createPayment({
        amount,
        file,
        invoiceId: payableInvoiceId,
      });

      await loadBillsData();

      setSelectedInvoice(null);
      setSuccessMessage("تم إرسال إثبات الدفع بنجاح");
    } catch (error) {
      console.error("Failed to submit payment:", error);

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
            key={`${paymentInvoice?.id || paymentInvoice?.temporaryId || "empty"}-${
              paymentInvoice?.amountValue || ""
            }`}
            defaultAmount={paymentInvoice?.amountValue || ""}
            invoice={paymentInvoice}
            invoiceId={paymentInvoice?.id || ""}
            invoiceNumber={paymentInvoice?.invoiceNumber || ""}
            canCreateInvoice={Boolean(paymentInvoice?.needsInvoiceCreation)}
            onSubmitPaymentProof={handleSubmitPaymentProof}
          />
        </div>
      </div>
    </main>
  );
}

export default CustomerBills;
