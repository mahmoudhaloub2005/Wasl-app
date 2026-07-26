import { useCallback, useEffect, useMemo, useState } from "react";

import {
  approveProviderPaymentRequest,
  getProviderPaymentRequests,
  rejectProviderPaymentRequest,
} from "../services/providerPaymentsService";

const pendingStatuses = new Set(["pending", "review", "waiting", "under_review"]);
const completedStatuses = new Set(["approved", "accepted", "rejected", "completed", "paid", "declined"]);

function isPendingPayment(payment) {
  return pendingStatuses.has(String(payment.status || "").toLowerCase());
}

function isCompletedPayment(payment) {
  return completedStatuses.has(String(payment.status || "").toLowerCase());
}

function getErrorMessage(error, fallback = "تعذر تحميل دفعات المراجعة.") {
  return error?.displayMessage || error?.message || fallback;
}

export function useProviderPayments() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [successMessage, setSuccessMessage] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState("");
  const [processingAction, setProcessingAction] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [proofPreview, setProofPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const nextPayments = await getProviderPaymentRequests();
      setPayments(Array.isArray(nextPayments) ? nextPayments : []);
    } catch (loadError) {
      setPayments([]);
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshPayments();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshPayments]);

  const pendingPayments = useMemo(() => payments.filter(isPendingPayment), [payments]);
  const completedPayments = useMemo(() => payments.filter(isCompletedPayment), [payments]);
  const visiblePayments = activeTab === "pending" ? pendingPayments : completedPayments;

  const approvePayment = useCallback(
    async (payment) => {
      if (!payment?.id || processingPaymentId) return;
      if (!window.confirm("هل تريد اعتماد هذه الدفعة؟")) return;

      setProcessingPaymentId(payment.id);
      setProcessingAction("approve");
      setSuccessMessage("");
      setError("");

      try {
        await approveProviderPaymentRequest(payment.id);
        await refreshPayments();
        setSuccessMessage("تم اعتماد الدفعة بنجاح.");
      } catch (approveError) {
        setError(getErrorMessage(approveError, "تعذر اعتماد الدفعة."));
      } finally {
        setProcessingPaymentId("");
        setProcessingAction("");
      }
    },
    [processingPaymentId, refreshPayments]
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
    if (!selectedPayment?.id || processingPaymentId) return;

    setRejectError("");
    setProcessingPaymentId(selectedPayment.id);
    setProcessingAction("reject");
    setSuccessMessage("");
    setError("");

    try {
      await rejectProviderPaymentRequest(selectedPayment.id);
      await refreshPayments();
      setSelectedPayment(null);
      setRejectReason("");
      setSuccessMessage("تم رفض الدفعة.");
    } catch (rejectRequestError) {
      setRejectError(getErrorMessage(rejectRequestError, "تعذر رفض الدفعة."));
    } finally {
      setProcessingPaymentId("");
      setProcessingAction("");
    }
  }, [processingPaymentId, refreshPayments, selectedPayment]);

  const openProofPreview = useCallback((proof) => {
    if (proof?.url) setProofPreview(proof);
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
    error,
    fetchPayments: refreshPayments,
    loading,
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



