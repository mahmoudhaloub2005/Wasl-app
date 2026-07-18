import { FiDownload, FiEye, FiFileText } from "react-icons/fi";

import FinancialPagination from "./FinancialPagination";
import FinancialStatusBadge from "./FinancialStatusBadge";

const statusLabels = {
  draft: "مسودة",
  overdue: "متأخرة",
  paid: "مدفوعة",
  pending: "قيد الانتظار",
};

function formatAmount(value) {
  return `${new Intl.NumberFormat("en-US").format(Number(value || 0))} شيكل`;
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "غير محدد";

  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(invoice) {
  return statusLabels[invoice.status] || invoice.statusLabel || statusLabels.draft;
}

function FinancialRecordsSkeleton() {
  return (
    <div className="financial-records-table financial-records-table--loading">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="financial-records-row" key={index}>
          <span />
          <strong />
          <p />
          <i />
          <em />
          <small />
        </div>
      ))}
    </div>
  );
}

function FinancialRecordsTable({
  currentPage,
  emptyMessage = "لا توجد فواتير مطابقة لخيارات البحث الحالية.",
  invoices = [],
  loading,
  onDownloadInvoice,
  onPageChange,
  onViewInvoice,
  pageSize,
  showPagination = true,
  title = "إدارة الفواتير",
  totalCount,
  totalPages,
  variant = "invoices",
}) {
  return (
    <section
      className="financial-records"
      aria-labelledby="financial-records-title"
    >
      <h2 className="financial-records__title" id="financial-records-title">
        {title}
      </h2>

      {loading ? (
        <FinancialRecordsSkeleton />
      ) : invoices.length ? (
        <div className={`financial-records-card financial-records-card--${variant}`}>
          <div className="financial-records-table" role="table">
            <div className="financial-records-table__head" role="row">
              <span role="columnheader">رقم الفاتورة</span>
              <span role="columnheader">اسم العميل</span>
              <span role="columnheader">المبلغ</span>
              <span role="columnheader">تاريخ الاستحقاق</span>
              <span role="columnheader">الحالة</span>
              <span role="columnheader">الإجراءات</span>
            </div>

            {invoices.map((invoice) => (
              <div className="financial-records-row" key={invoice.id} role="row">
                <button
                  type="button"
                  className="financial-records-row__invoice"
                  onClick={() => onViewInvoice(invoice)}
                  role="cell"
                >
                  {invoice.invoiceNumber}
                </button>
                <span className="financial-records-row__customer" role="cell">
                  <b>{invoice.initials}</b>
                  <strong>{invoice.customerName}</strong>
                </span>
                <span className="financial-records-row__amount" role="cell">
                  {invoice.amountLabel || formatAmount(invoice.amount)}
                </span>
                <span className="financial-records-row__date" role="cell">
                  {invoice.dueDateLabel || formatDate(invoice.dueDate)}
                </span>
                <span className="financial-records-row__status" role="cell">
                  <FinancialStatusBadge
                    label={getStatusLabel(invoice)}
                    status={invoice.status}
                  />
                </span>
                <span className="financial-records-row__actions" role="cell">
                  <button
                    type="button"
                    aria-label={`عرض الفاتورة ${invoice.invoiceNumber}`}
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <FiEye aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="تنزيل الفاتورة غير متاح حالياً"
                    disabled
                    onClick={() => onDownloadInvoice(invoice)}
                  >
                    <FiDownload aria-hidden="true" />
                  </button>
                </span>
              </div>
            ))}
          </div>

          {showPagination ? (
            <FinancialPagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
            />
          ) : null}
        </div>
      ) : (
        <div className="financial-records-empty">
          <FiFileText aria-hidden="true" />
          <p>{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}

export default FinancialRecordsTable;