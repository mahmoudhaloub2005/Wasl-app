import { FiRefreshCcw } from "react-icons/fi";

function SubscriptionSideCards({ invoice = null, subscription = null }) {
  const hasCurrentBill = Boolean(invoice?.currentBill);

  const hasUsage =
    invoice?.usagePercent !== "" &&
    invoice?.usagePercent !== null &&
    invoice?.usagePercent !== undefined;

  const unpaidInvoices = getUnpaidInvoices(invoice, subscription);

  return (
    <aside className="subscription-side-cards">
      <section className="current-bill-card">
        <p>قيمة الفاتورة الحالية</p>

        {hasCurrentBill ? (
          <div className="bill-price">
            <strong>{invoice.currentBill}</strong>
          </div>
        ) : (
          <strong>لا توجد فواتير حالياً</strong>
        )}

        {hasUsage && (
          <>
            <div className="usage-info">
              <span>الاستهلاك الحالي</span>
              <span>{invoice.usagePercent}%</span>
            </div>

            <div className="usage-progress">
              <div style={{ width: `${invoice.usagePercent}%` }} />
            </div>
          </>
        )}
      </section>

      <section className="payment-summary-card">
        <div className="payment-summary-title">
          <FiRefreshCcw />
          <h3>ملخص الدفع</h3>
        </div>

        <div className="payment-summary-row">
          <span>آخر دفعة</span>
          <strong>{invoice?.lastPayment || "لا توجد دفعات حالياً"}</strong>
        </div>

        <div className="payment-summary-row">
          <span>الفواتير المسددة</span>
          <strong>{invoice?.paidBills || "لا توجد فواتير حالياً"}</strong>
        </div>
      </section>

      <section className="payment-summary-card unpaid-invoices-card">
        <div className="payment-summary-title">
          <FiRefreshCcw />
          <h3>الفواتير المستحقة غير المدفوعة</h3>
        </div>

        {unpaidInvoices.length > 0 ? (
          <div className="unpaid-invoices-list">
            {unpaidInvoices.map((bill, index) => (
              <div className="unpaid-invoice-row" key={bill.id || index}>
                <div>
                  <span>رقم الفاتورة</span>
                  <strong>
                    {bill.invoiceNumber ||
                      bill.invoice_number ||
                      bill.number ||
                      bill.id ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>الشهر</span>
                  <strong>{bill.month || bill.billing_month || "-"}</strong>
                </div>

                <div>
                  <span>المبلغ</span>
                  <strong>
                    {formatAmount(
                      bill.amount ||
                        bill.total ||
                        bill.total_amount ||
                        bill.value
                    )}
                  </strong>
                </div>

                <div>
                  <span>الحالة</span>
                  <strong>{getInvoiceStatusText(bill.status)}</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <strong>لا توجد فواتير مستحقة حالياً</strong>
        )}
      </section>
    </aside>
  );
}

function getUnpaidInvoices(invoice, subscription) {
  const possibleLists = [
    invoice?.unpaidInvoices,
    invoice?.unpaid_invoices,
    invoice?.unpaidBills,
    invoice?.unpaid_bills,
    invoice?.invoices,
    subscription?.unpaidInvoices,
    subscription?.unpaid_invoices,
    subscription?.unpaidBills,
    subscription?.unpaid_bills,
    subscription?.invoices,
  ];

  const list = possibleLists.find((item) => Array.isArray(item)) || [];

  return list.filter((bill) => {
    const status = String(bill?.status || "").toLowerCase();

    if (!status) return true;

    return [
      "unpaid",
      "pending",
      "due",
      "overdue",
      "not_paid",
      "غير مدفوعة",
      "مستحقة",
    ].includes(status);
  });
}

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }

  if (String(amount).includes("شيكل")) {
    return amount;
  }

  return `${amount} شيكل`;
}

function getInvoiceStatusText(status) {
  const normalizedStatus = String(status || "").toLowerCase();

  if (normalizedStatus === "paid") return "مدفوعة";
  if (normalizedStatus === "unpaid") return "غير مدفوعة";
  if (normalizedStatus === "pending") return "قيد المراجعة";
  if (normalizedStatus === "due") return "مستحقة";
  if (normalizedStatus === "overdue") return "متأخرة";

  return status || "غير مدفوعة";
}

export default SubscriptionSideCards;