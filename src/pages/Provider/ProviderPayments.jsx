import { useNavigate } from "react-router-dom";
import { FiCheckSquare, FiRefreshCw } from "react-icons/fi";

import FinanceHeader from "../../components/Provider/finance/FinanceHeader";
import PaymentProofPreviewModal from "../../components/Provider/finance/PaymentProofPreviewModal";
import PaymentReviewCard from "../../components/Provider/finance/PaymentReviewCard";
import PaymentReviewTabs from "../../components/Provider/finance/PaymentReviewTabs";
import ProviderFinanceLayout from "../../components/Provider/finance/ProviderFinanceLayout";
import ProviderPaymentsEmptyState from "../../components/Provider/finance/ProviderPaymentsEmptyState";
import ProviderPaymentsSkeleton from "../../components/Provider/finance/ProviderPaymentsSkeleton";
import RejectPaymentModal from "../../components/Provider/finance/RejectPaymentModal";
import useProviderPayments from "../../hooks/useProviderPayments";
import "./ProviderFinance.css";
import "./ProviderPayments.css";

function ProviderPayments() {
  const navigate = useNavigate();
  const payments = useProviderPayments();
  const emptyMessage =
    payments.activeTab === "pending"
      ? "لا توجد طلبات دفع قيد المراجعة"
      : "لا توجد مدفوعات مكتملة حتى الآن";

  return (
    <ProviderFinanceLayout>
      <FinanceHeader
        description={`لديك ${payments.pendingPayments.length} طلبات دفع معلقة بانتظار المراجعة والتدقيق.`}
        onBack={() => navigate("/provider/finance")}
        showBack
        title="مراجعة واعتماد المدفوعات"
      />

      <PaymentReviewTabs
        activeTab={payments.activeTab}
        completedCount={payments.completedPayments.length}
        onChange={payments.setActiveTab}
        pendingCount={payments.pendingPayments.length}
      />

      {payments.successMessage && (
        <div className="provider-payments-message provider-payments-message--success" role="status">
          {payments.successMessage}
        </div>
      )}

      {payments.error && !payments.loading && (
        <section className="provider-payments-error" role="alert">
          <p>{payments.error}</p>
          <button type="button" onClick={payments.refreshPayments}>
            <FiRefreshCw aria-hidden="true" />
            إعادة المحاولة
          </button>
        </section>
      )}

      {payments.loading ? (
        <ProviderPaymentsSkeleton />
      ) : !payments.error && payments.visiblePayments.length ? (
        <>
          <section className="provider-payments-list" aria-label="طلبات الدفع">
            {payments.visiblePayments.map((payment) => (
              <PaymentReviewCard
                isSubmitting={payments.processingPaymentId === payment.id}
                key={payment.id}
                onApprove={payments.approvePayment}
                onPreviewProof={payments.openProofPreview}
                onReject={payments.openRejectModal}
                payment={payment}
                processingAction={payments.processingAction}
              />
            ))}
          </section>

          {payments.activeTab === "pending" && (
            <section className="provider-payments-note" aria-labelledby="provider-payments-note-title">
              <span aria-hidden="true">
                <FiCheckSquare />
              </span>
              <h2 id="provider-payments-note-title">بانتظار المعالجة</h2>
              <p>
                يرجى التأكد من مطابقة أرقام الحوالات مع بيانات الفاتورة المرفقة لضمان دقة العمليات المحاسبية.
              </p>
            </section>
          )}
        </>
      ) : !payments.error ? (
        <ProviderPaymentsEmptyState message={emptyMessage} />
      ) : null}

      <RejectPaymentModal
        error={payments.rejectError}
        isOpen={Boolean(payments.selectedPayment)}
        isSubmitting={payments.processingAction === "reject"}
        onClose={payments.closeRejectModal}
        onConfirm={payments.rejectPayment}
        onReasonChange={payments.setRejectReason}
        payment={payments.selectedPayment}
        reason={payments.rejectReason}
      />

      <PaymentProofPreviewModal
        onClose={payments.closeProofPreview}
        proof={payments.proofPreview}
      />
    </ProviderFinanceLayout>
  );
}

export default ProviderPayments;
