import { useEffect, useMemo, useState } from "react";
import "./CustomerBills.css";

import BillsSummaryCards from "./BillsSummaryCards";
import BillsTable from "./BillsTable";
import SendPaymentProof from "./SendPaymentProof";
import PaymentsHistory from "./PaymentsHistory";
import { getMyInvoices } from "../../../services/invoiceService";
import { createPayment, getMyPayments } from "../../../services/paymentService";
import {
  getCurrentSubscription,
  getCustomerSubscriptionForDisplay,
  getLocalCustomerSubscription,
} from "../../../services/subscriptionService";
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

function formatArabicDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPackageAmountFromAmpere(ampere) {
  const ampereValue = toNumber(ampere);
  const packageAmounts = {
    3: 45,
    5: 60,
    10: 115,
    15: 170,
  };

  return packageAmounts[ampereValue] || 0;
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

  if (pricePerAmpere > 0 && amperes > 0) {
    return pricePerAmpere * amperes;
  }

  return getPackageAmountFromAmpere(amperes);
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

function getSubscriptionStatusText(subscription = {}) {
  return String(
    subscription.status ||
      subscription.state ||
      subscription.statusLabel ||
      subscription.statusText ||
      subscription.rawStatus ||
      ""
  ).toLowerCase();
}

function isRejectedOrCancelledSubscription(subscription = {}) {
  const statusText = getSubscriptionStatusText(subscription);

  return (
    subscription.isCancelled ||
    subscription.isRejected ||
    statusText.includes("cancel") ||
    statusText.includes("reject") ||
    statusText.includes("ملغي") ||
    statusText.includes("ملغى") ||
    statusText.includes("مرفوض")
  );
}

function canBuildDraftInvoiceFromSubscription(subscription = {}) {
  if (!subscription || isRejectedOrCancelledSubscription(subscription)) {
    return false;
  }

  const amountValue = getSubscriptionAmount(subscription);
  const hasSubscriptionIdentity = Boolean(
    subscription.id ||
      subscription.subscriptionNumber ||
      subscription.generatorId ||
      subscription.generatorName ||
      subscription.generator_name
  );

  return Boolean(subscription.isActive || hasSubscriptionIdentity || amountValue > 0);
}

function getFirstDraftSubscription(...subscriptions) {
  return (
    subscriptions.find((subscription) =>
      canBuildDraftInvoiceFromSubscription(subscription)
    ) || null
  );
}

function buildSubscriptionDraftInvoice(subscription) {
  if (!canBuildDraftInvoiceFromSubscription(subscription)) return null;

  const now = new Date();
  const year = now.getFullYear();
  const monthNumber = String(now.getMonth() + 1).padStart(2, "0");
  const amountValue = getSubscriptionAmount(subscription);
  const subscriptionId = String(
    subscription.id ||
      subscription.subscriptionNumber ||
      subscription.generatorId ||
      "001"
  );

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
    demoOnly: true,
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

      const [
        invoicesResult,
        paymentsResult,
        currentSubscriptionResult,
        displaySubscriptionResult,
      ] =
        await Promise.allSettled([
          getMyInvoices(),
          getMyPayments(),
          getCurrentSubscription(),
          getCustomerSubscriptionForDisplay(),
        ]);

      let nextBills = [];
      let nextPayments = [];
      let draftSubscription = null;
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

      const localSubscription = getLocalCustomerSubscription();

      if (
        currentSubscriptionResult.status === "rejected" &&
        !isMissingEndpoint(currentSubscriptionResult.reason)
      ) {
        firstError = firstError || currentSubscriptionResult.reason;
      }

      if (
        displaySubscriptionResult.status === "rejected" &&
        !isMissingEndpoint(displaySubscriptionResult.reason)
      ) {
        firstError = firstError || displaySubscriptionResult.reason;
      }

      draftSubscription = getFirstDraftSubscription(
        currentSubscriptionResult.status === "fulfilled"
          ? currentSubscriptionResult.value
          : null,
        displaySubscriptionResult.status === "fulfilled"
          ? displaySubscriptionResult.value
          : null,
        localSubscription
      );

      if (nextBills.length === 0 && draftSubscription) {
        const draftInvoice = buildSubscriptionDraftInvoice(draftSubscription);

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

      if (invoice?.isTemporary) {
        const submittedAt = new Date();
        const temporaryInvoiceKey = invoice.temporaryId || invoice.invoiceNumber;

        setBills((currentBills) =>
          currentBills.map((bill) =>
            (bill.temporaryId || bill.invoiceNumber) === temporaryInvoiceKey
              ? {
                  ...bill,
                  status: "pending",
                  statusText: "قيد التحقق",
                  paidAt: formatArabicDateTime(submittedAt),
                  paymentMethod: "إثبات دفع",
                }
              : bill
          )
        );

        setPayments((currentPayments) => [
          {
            id: `demo-payment-${temporaryInvoiceKey}-${submittedAt.getTime()}`,
            title: `إثبات دفع للفاتورة ${invoice.invoiceNumber}`,
            date: formatArabicDateTime(submittedAt),
            amount: `+${amount}`,
          },
          ...currentPayments,
        ]);

        setSelectedInvoice(null);
        setSuccessMessage("تم إرسال إثبات الدفع بنجاح، وسيتم مراجعته قريباً.");
        return;
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
            allowTemporaryPayment={Boolean(paymentInvoice?.isTemporary)}
            onSubmitPaymentProof={handleSubmitPaymentProof}
          />
        </div>
      </div>
    </main>
  );
}

export default CustomerBills;
