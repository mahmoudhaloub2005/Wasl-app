import { useCallback, useEffect, useMemo, useState } from "react";

import providerInvoicesService, {
  normalizeInvoiceSubscriber,
  normalizeInvoiceSubscription,
  providerInvoiceBackendContract,
} from "../services/providerInvoicesService";
import { getStoredToken } from "../utils/authStorage";

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 350;
const realProviderLoginMessage =
  "يجب تسجيل الدخول بحساب مزود خدمة حقيقي لإصدار فاتورة";
const missingBackendMessage =
  "لم يتم توفير Endpoint البحث عن المشتركين أو إصدار الفواتير من Backend بعد. يمكنك معاينة التصميم فقط.";

const initialState = {
  currentReading: "",
  dueDate: "",
  fieldErrors: {},
  previousReading: "",
  searchError: "",
  selectedSubscriber: null,
  submitError: "",
  subscriberQuery: "",
  subscriberResults: [],
  subscriberSearchLoading: false,
  subscription: null,
};

function getContract(service) {
  return service.providerInvoiceBackendContract || providerInvoiceBackendContract;
}

function getSafeBackendMessage(error, fallback) {
  const status = error?.response?.status;

  if (status === 400) return "بيانات الطلب غير صحيحة";
  if (status === 403) return "لا تملك صلاحية إصدار فاتورة";
  if (status === 404) return "المشترك أو الاشتراك غير موجود";
  if (status === 409) return "توجد فاتورة متعارضة أو مكررة";
  if (status === 422) return "يرجى مراجعة الحقول المطلوبة";
  if (status >= 500) return "حدث خطأ في الخادم";
  if (error?.code === "ERR_NETWORK") return "تعذر الاتصال بالخادم";
  if (error?.code === "ECONNABORTED") return "استغرق الخادم وقتًا طويلًا";
  if (error?.code === "PROVIDER_INVOICE_ENDPOINT_MISSING") return missingBackendMessage;

  return error?.response?.data?.message || error?.displayMessage || error?.message || fallback;
}

function getBackendFieldErrors(error) {
  const errors = error?.response?.data?.errors;

  if (!errors || typeof errors !== "object") return {};

  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.filter(Boolean).join(" ") : String(value || ""),
    ])
  );
}

function isValidDate(value) {
  if (!value) return false;

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function validateCurrentReading(currentReading, previousReading) {
  if (currentReading === "") return "القراءة الحالية مطلوبة";

  const currentValue = Number(currentReading);

  if (!Number.isFinite(currentValue)) return "القراءة الحالية يجب أن تكون رقمًا";
  if (currentValue < 0) return "القراءة الحالية لا يمكن أن تكون سالبة";

  if (previousReading !== "" && previousReading !== null && previousReading !== undefined) {
    const previousValue = Number(previousReading);

    if (Number.isFinite(previousValue) && currentValue < previousValue) {
      return "القراءة الحالية يجب ألا تقل عن القراءة السابقة";
    }
  }

  return "";
}

function getSubscriptionNumber(selectedSubscriber, subscription) {
  return (
    subscription?.subscriptionNumber ||
    selectedSubscriber?.subscriptionNumber ||
    selectedSubscriber?.subscriptionId ||
    ""
  );
}

export function useCreateProviderInvoice({
  isOpen,
  invoicesService = providerInvoicesService,
  onClose,
  onCreated,
} = {}) {
  const [state, setState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contract = getContract(invoicesService);
  const hasToken = Boolean(getStoredToken());
  const canSearchSubscribers =
    hasToken && contract.hasSubscriberSearchEndpoint !== false;
  const canCreateInvoice =
    hasToken && contract.hasCreateInvoiceEndpoint !== false;

  const resetForm = useCallback(() => {
    setState(initialState);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const query = state.subscriberQuery.trim();

    if (!canSearchSubscribers || query.length < MIN_SEARCH_LENGTH) {
      setState((current) => ({
        ...current,
        searchError: "",
        subscriberResults: [],
        subscriberSearchLoading: false,
      }));
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setState((current) => ({
          ...current,
          searchError: "",
          subscriberSearchLoading: true,
        }));

        const results = await invoicesService.searchProviderInvoiceSubscribers(query);

        setState((current) => ({
          ...current,
          subscriberResults: Array.isArray(results)
            ? results.map(normalizeInvoiceSubscriber)
            : [],
          subscriberSearchLoading: false,
        }));
      } catch (error) {
        setState((current) => ({
          ...current,
          searchError: getSafeBackendMessage(
            error,
            "تعذر البحث عن المشتركين"
          ),
          subscriberResults: [],
          subscriberSearchLoading: false,
        }));
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [canSearchSubscribers, invoicesService, isOpen, state.subscriberQuery]);

  const setSubscriberQuery = useCallback((value) => {
    setState((current) => ({
      ...current,
      searchError: "",
      selectedSubscriber: null,
      subscriberQuery: value,
      subscriberResults: [],
      subscription: null,
      previousReading: "",
    }));
  }, []);

  const selectSubscriber = useCallback(
    async (subscriber) => {
      const normalizedSubscriber = normalizeInvoiceSubscriber(subscriber);
      const localSubscription = normalizeInvoiceSubscription(
        normalizedSubscriber.subscription || {}
      );
      const hasLocalSubscription = Boolean(
        localSubscription.id || localSubscription.subscriptionNumber
      );

      setState((current) => ({
        ...current,
        previousReading: localSubscription.previousReading,
        searchError: "",
        selectedSubscriber: normalizedSubscriber,
        subscriberQuery: normalizedSubscriber.name,
        subscriberResults: [],
        subscription: hasLocalSubscription ? localSubscription : null,
      }));

      if (!contract.hasSubscriptionDetailsEndpoint || hasLocalSubscription) return;

      try {
        const details = await invoicesService.getProviderInvoiceSubscriptionDetails(
          normalizedSubscriber.subscriptionId || normalizedSubscriber.id
        );
        const normalizedSubscription = normalizeInvoiceSubscription(details);

        setState((current) => ({
          ...current,
          previousReading: normalizedSubscription.previousReading,
          subscription: normalizedSubscription,
        }));
      } catch (error) {
        setState((current) => ({
          ...current,
          submitError: getSafeBackendMessage(
            error,
            "تعذر تحميل بيانات الاشتراك"
          ),
        }));
      }
    },
    [contract.hasSubscriptionDetailsEndpoint, invoicesService]
  );

  const setDueDate = useCallback((value) => {
    setState((current) => ({
      ...current,
      dueDate: value,
      fieldErrors: { ...current.fieldErrors, due_date: "" },
    }));
  }, []);

  const setCurrentReading = useCallback((value) => {
    setState((current) => ({
      ...current,
      currentReading: value,
      fieldErrors: { ...current.fieldErrors, current_reading: "" },
    }));
  }, []);

  const validation = useMemo(() => {
    const errors = {};
    const subscriptionNumber = getSubscriptionNumber(
      state.selectedSubscriber,
      state.subscription
    );
    const currentReadingError = validateCurrentReading(
      state.currentReading,
      state.previousReading
    );

    if (!state.selectedSubscriber) errors.subscriber = "يرجى اختيار مشترك";
    if (!subscriptionNumber) errors.subscription = "رقم الاشتراك غير متوفر";
    if (!state.dueDate || !isValidDate(state.dueDate)) {
      errors.due_date = "تاريخ الاستحقاق مطلوب";
    }
    if (currentReadingError) errors.current_reading = currentReadingError;

    return errors;
  }, [state.currentReading, state.dueDate, state.previousReading, state.selectedSubscriber, state.subscription]);

  const isSubmitDisabled =
    isSubmitting ||
    !canCreateInvoice ||
    Object.keys(validation).length > 0;

  const createInvoice = useCallback(async () => {
    if (isSubmitting) return;

    if (!canCreateInvoice) {
      setState((current) => ({
        ...current,
        submitError: !hasToken ? realProviderLoginMessage : missingBackendMessage,
      }));
      return;
    }

    if (Object.keys(validation).length) {
      setState((current) => ({ ...current, fieldErrors: validation }));
      return;
    }

    const payload = {
      current_reading: Number(state.currentReading),
      due_date: state.dueDate,
      previous_reading:
        state.previousReading === "" ? undefined : Number(state.previousReading),
      subscriber_id: state.selectedSubscriber.id,
      subscription_id: state.subscription?.id || state.selectedSubscriber.subscriptionId,
    };

    try {
      setIsSubmitting(true);
      setState((current) => ({
        ...current,
        fieldErrors: {},
        submitError: "",
      }));

      const response = await invoicesService.createProviderInvoice(payload);

      await onCreated?.(response);
      resetForm();
      onClose?.();
    } catch (error) {
      setState((current) => ({
        ...current,
        fieldErrors: {
          ...current.fieldErrors,
          ...getBackendFieldErrors(error),
        },
        submitError: getSafeBackendMessage(error, "تعذر إصدار الفاتورة"),
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [canCreateInvoice, hasToken, invoicesService, isSubmitting, onClose, onCreated, resetForm, state.currentReading, state.dueDate, state.previousReading, state.selectedSubscriber, state.subscription, validation]);

  const statusMessage = !hasToken
    ? realProviderLoginMessage
    : !canSearchSubscribers || !canCreateInvoice
      ? missingBackendMessage
      : "";

  return {
    ...state,
    canCreateInvoice,
    canSearchSubscribers,
    createInvoice,
    isSubmitDisabled,
    isSubmitting,
    minSearchLength: MIN_SEARCH_LENGTH,
    resetForm,
    selectSubscriber,
    setCurrentReading,
    setDueDate,
    setSubscriberQuery,
    statusMessage,
    subscriptionNumber: getSubscriptionNumber(state.selectedSubscriber, state.subscription),
    validation,
  };
}

export default useCreateProviderInvoice;
