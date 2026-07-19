import { useState } from "react";

import { exportProviderComplaints } from "./providerComplaintsUi";
import AdvancedComplaintFilters from "./AdvancedComplaintFilters";
import ComplaintDetailsModal from "./ComplaintDetailsModal";
import ComplaintHistoryModal from "./ComplaintHistoryModal";
import ComplaintReplyModal from "./ComplaintReplyModal";
import ComplaintsStatusFilters from "./ComplaintsStatusFilters";
import ComplaintsToolbar from "./ComplaintsToolbar";
import ProviderComplaintCard from "./ProviderComplaintCard";

function ComplaintSkeleton() {
  return (
    <article className="provider-complaint-card provider-complaint-card--loading">
      <span />
      <span />
      <span />
      <span />
    </article>
  );
}

function ResolveConfirmationModal({ complaint, isSubmitting, onCancel, onConfirm }) {
  if (!complaint) return null;

  return (
    <div className="complaint-modal-backdrop" role="presentation">
      <section
        className="complaint-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolve-complaint-title"
      >
        <h2 id="resolve-complaint-title">تأكيد حل الشكوى</h2>
        <p>هل أنت متأكد من تحديد هذه الشكوى كمحلولة؟</p>
        <strong>{complaint.ticketNumber}</strong>

        <div className="complaint-modal__actions">
          <button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "جار التحديث..." : "تأكيد الحل"}
          </button>
          <button
            type="button"
            className="complaint-modal__secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            إلغاء
          </button>
        </div>
      </section>
    </div>
  );
}

function ComplaintsPagination({
  currentPage,
  onPageChange,
  totalPages,
  totalResults,
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="complaints-pagination" aria-label="ترقيم صفحات الشكاوى">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        السابق
      </button>
      <span>
        صفحة <bdi>{currentPage}</bdi> من <bdi>{totalPages}</bdi> ·{" "}
        <bdi>{totalResults}</bdi> نتيجة
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        التالي
      </button>
    </nav>
  );
}

function downloadCsv(csvContent) {
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `provider-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ProviderComplaintsList({
  activeFilter,
  canRetry = false,
  advancedFilters,
  complaints,
  complaintsForExport,
  counts,
  currentPage,
  errorMessage,
  hasActiveAdvancedFilters,
  isLoading,
  onAdvancedFiltersApply,
  onAdvancedFiltersReset,
  onExportSuccess,
  onFilterChange,
  onPageChange,
  onReply,
  onRetry,
  onSearchChange,
  onStatusChange,
  pendingActionKey,
  searchTerm,
  totalPages,
  totalResults,
}) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [detailsComplaint, setDetailsComplaint] = useState(null);
  const [replyComplaint, setReplyComplaint] = useState(null);
  const [historyComplaint, setHistoryComplaint] = useState(null);
  const [resolveTarget, setResolveTarget] = useState(null);

  function handleExport() {
    const csvContent = exportProviderComplaints(complaintsForExport);
    downloadCsv(csvContent);
    onExportSuccess?.("تم تصدير التقرير بنجاح");
  }

  async function handleResolveConfirm() {
    if (!resolveTarget) return;

    const succeeded = await onStatusChange(resolveTarget.id, "resolved");

    if (succeeded) {
      setResolveTarget(null);
    }
  }

  function handlePageChange(page) {
    onPageChange(page);
    document
      .querySelector(".provider-complaints-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const isResolveSubmitting =
    resolveTarget && pendingActionKey === `complaint-status-${resolveTarget.id}`;
  const isReplySubmitting =
    replyComplaint && pendingActionKey === `complaint-reply-${replyComplaint.id}`;

  return (
    <section className="provider-complaints-section">
      <ComplaintsToolbar
        hasActiveAdvancedFilters={hasActiveAdvancedFilters}
        searchTerm={searchTerm}
        onExport={handleExport}
        onOpenAdvancedFilters={() => setIsAdvancedFiltersOpen(true)}
        onSearchChange={onSearchChange}
      />

      <ComplaintsStatusFilters
        activeFilter={activeFilter}
        counts={counts}
        onChange={onFilterChange}
      />

      {errorMessage && (
        <section className="provider-ratings-empty provider-ratings-empty--error">
          <h2>{errorMessage}</h2>
          {canRetry && onRetry ? (
            <button type="button" onClick={onRetry}>
              إعادة المحاولة
            </button>
          ) : null}
        </section>
      )}

      {!errorMessage && isLoading ? (
        <div className="provider-complaints-list">
          {Array.from({ length: 3 }, (_, index) => (
            <ComplaintSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!errorMessage && !isLoading && complaints.length > 0 && (
        <>
          <div className="provider-complaints-list">
            {complaints.map((complaint) => (
              <ProviderComplaintCard
                complaint={complaint}
                key={complaint.id}
                onOpenDetails={setDetailsComplaint}
                onOpenHistory={setHistoryComplaint}
                onOpenReply={setReplyComplaint}
              />
            ))}
          </div>

          <ComplaintsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!errorMessage && !isLoading && complaints.length === 0 && (
        <section className="provider-ratings-empty">
          <h2>لا توجد بيانات حالياً</h2>
          <p>ستظهر البيانات هنا عند توفرها.</p>
        </section>
      )}

      <AdvancedComplaintFilters
        filters={advancedFilters}
        isOpen={isAdvancedFiltersOpen}
        key={isAdvancedFiltersOpen ? JSON.stringify(advancedFilters) : "closed"}
        onApply={onAdvancedFiltersApply}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        onReset={onAdvancedFiltersReset}
      />

      <ComplaintDetailsModal
        complaint={detailsComplaint}
        onClose={() => setDetailsComplaint(null)}
        onOpenReply={(complaint) => {
          setDetailsComplaint(null);
          setReplyComplaint(complaint);
        }}
        onResolve={(complaint) => {
          setDetailsComplaint(null);
          setResolveTarget(complaint);
        }}
      />

      <ComplaintReplyModal
        complaint={replyComplaint}
        isSubmitting={Boolean(isReplySubmitting)}
        key={replyComplaint?.id || "closed"}
        onClose={() => setReplyComplaint(null)}
        onResolve={(complaint) => {
          setReplyComplaint(null);
          setResolveTarget(complaint);
        }}
        onSubmit={onReply}
      />

      <ComplaintHistoryModal
        complaint={historyComplaint}
        onClose={() => setHistoryComplaint(null)}
      />

      <ResolveConfirmationModal
        complaint={resolveTarget}
        isSubmitting={Boolean(isResolveSubmitting)}
        onCancel={() => setResolveTarget(null)}
        onConfirm={handleResolveConfirm}
      />
    </section>
  );
}

export default ProviderComplaintsList;
