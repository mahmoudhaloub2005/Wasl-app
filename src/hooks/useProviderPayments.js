import { useCallback, useEffect, useMemo, useState } from "react";

import providerPaymentsService from "../services/providerPaymentsService";
import { getStoredToken } from "../utils/authStorage";

const pendingStatuses = new Set(["pending", "review", "waiting", "under_review"]);
const completedStatuses = new Set(["approved", "accepted", "rejected", "completed", "paid", "declined"]);

function isPendingPayment(payment) {
  return pendingStatuses.has(String(payment.status || "").toLowerCase());
}

function isCompletedPayment(payment) {
  return completedStatuses.has(String(payment.status || "").toLowerCase());
}

function getPaymentErrorMessage(error) {
  const status = error?.response?.status || error?.status;

  if (status === 403) {
    return "لا تملك صلاحية مراجعة طلبات الدفع";
  }

  if (status >= 500) {
    return "حدث خطأ في الخادم أثناء تحميل طلبات الدفع";
  }

  if (
    status === 404 ||
    status === 405 ||
    error?.code === "ERR_NETWORK" ||
    error?.code === "PROVIDER_PAYMENTS_ENDPOINT_MISSING"
  ) {
    return "تعذر تحميل طلبات الدفع، يرجى المحاولة لاحقًا";
  }

  return error?.displayMessage || error?.message || "تعذر تحميل طلبات الدفع، يرجى المحاولة لاحقًا";
}

function getActionErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.displayMessage || error?.message || fallback;
}

export function useProviderPayments(paymentsService = providerPaymentsService) {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      if (!getStoredToken()) {
        setPayments([]);
        setError("يجب تسجيل الدخول بحساب مزود خدمة لعرض طلبات الدفع");
        return;
      }

      const result = await paymentsService.getProviderPaymentRequests({
        status: activeTab,
      });

      setPayments(Array.isArray(result) ? result : []);
    } catch (fetchError) {
      setPayments([]);
      setError(getPaymentErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [activeTab, paymentsService]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const refreshPayments = useCallback(() => {
    fetchPayments();
  }, [fetchPayments]);

  const approvePayment = useCallback(
    async (payment) => {
      if (!payment?.id || processingPaymentId) return;

      try {
        setError("");
        setSuccessMessage("");
        setProcessingPaymentId(payment.id);
        setProcessingAction("approve");

        await paymentsService.approveProviderPaymentRequest(payment.id);
        setSuccessMessage("تم اعتماد طلب الدفع بنجاح");
        await fetchPayments();
      } catch (approveError) {
        setError(getActionErrorMessage(approveError, "تعذر اعتماد طلب الدفع"));
      } finally {
        setProcessingPaymentId("");
        setProcessingAction("");
      }
    },
    [fetchPayments, paymentsService, processingPaymentId]
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

    try {
      setError("");
      setSuccessMessage("");
      setRejectError("");
      setProcessingPaymentId(selectedPayment.id);
      setProcessingAction("reject");

      await paymentsService.rejectProviderPaymentRequest(selectedPayment.id, {
        reason,
      });
      setSuccessMessage("تم رفض طلب الدفع بنجاح");
      setSelectedPayment(null);
      setRejectReason("");
      await fetchPayments();
    } catch (rejectRequestError) {
      setRejectError(getActionErrorMessage(rejectRequestError, "تعذر رفض طلب الدفع"));
    } finally {
      setProcessingPaymentId("");
      setProcessingAction("");
    }
  }, [fetchPayments, paymentsService, processingPaymentId, rejectReason, selectedPayment]);

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
    error,
    fetchPayments,
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
