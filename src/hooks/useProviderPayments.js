import { useCallback, useMemo, useState } from "react";

import { providerServicePendingMessage } from "../services/provider/providerFrontendStatus";

const pendingStatuses = new Set(["pending", "review", "waiting", "under_review"]);
const completedStatuses = new Set(["approved", "accepted", "rejected", "completed", "paid", "declined"]);

function isPendingPayment(payment) {
  return pendingStatuses.has(String(payment.status || "").toLowerCase());
}

function isCompletedPayment(payment) {
  return completedStatuses.has(String(payment.status || "").toLowerCase());
}

export function useProviderPayments() {
  const [payments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [successMessage, setSuccessMessage] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState("");
  const [processingAction, setProcessingAction] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [proofPreview, setProofPreview] = useState(null);

  const pendingPayments = useMemo(
    () => payments.filter(isPendingPayment),
    [payments]
  );
  const completedPayments = useMemo(
    () => payments.filter(isCompletedPayment),
    [payments]
  );
  const visiblePayments = activeTab === "pending" ? pendingPayments : completedPayments;

  const refreshPayments = useCallback(() => false, []);

  const approvePayment = useCallback(
    async (payment) => {
      if (!payment?.id || processingPaymentId) return;

      setProcessingPaymentId(payment.id);
      setProcessingAction("approve");
      setSuccessMessage(providerServicePendingMessage);
      setProcessingPaymentId("");
      setProcessingAction("");
    },
    [processingPaymentId]
  );

  const openRejectModal = useCallback((payment) => {
    setSelectedPayment(payment);
    setRejectReason("");
    setRejectError("");
  }, []);

  const closeRejectModal = useCallback(() => {
    if (processingAction === "reject") return;

    setSelectedPayment(null);
    setRejectReason("");
    setRejectError("");
  }, [processingAction]);

  const rejectPayment = useCallback(async () => {
    const reason = rejectReason.trim();

    if (!selectedPayment?.id || processingPaymentId) return;

    if (!reason) {
      setRejectError("سبب الرفض مطلوب");
      return;
    }

    setRejectError("");
    setProcessingPaymentId(selectedPayment.id);
    setProcessingAction("reject");
    setSuccessMessage(providerServicePendingMessage);
    setSelectedPayment(null);
    setRejectReason("");
    setProcessingPaymentId("");
    setProcessingAction("");
  }, [processingPaymentId, rejectReason, selectedPayment]);

  const openProofPreview = useCallback((proof) => {
    if (proof?.url) {
      setProofPreview(proof);
    }
  }, []);

  const closeProofPreview = useCallback(() => {
    setProofPreview(null);
  }, []);

  return {
    activeTab,
    approvePayment,
    closeProofPreview,
    closeRejectModal,
    completedPayments,
    error: "",
    fetchPayments: refreshPayments,
    loading: false,
    openProofPreview,
    openRejectModal,
    pendingPayments,
    processingAction,
    processingPaymentId,
    proofPreview,
    refreshPayments,
    rejectError,
    rejectPayment,
    rejectReason,
    selectedPayment,
    setActiveTab,
    setRejectReason,
    successMessage,
    visiblePayments,
  };
}

export default useProviderPayments;