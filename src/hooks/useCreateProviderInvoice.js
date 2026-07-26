import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createProviderInvoice,
  getProviderInvoiceSubscriptionDetails,
  searchProviderInvoiceSubscribers,
} from "../services/providerInvoicesService";

const MIN_SEARCH_LENGTH = 2;

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

function isValidDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function validateCurrentReading(currentReading, previousReading) {
  if (currentReading === "") return "القراءة الحالية مطلوبة";

  const currentValue = Number(currentReading);

  if (!Number.isFinite(currentValue)) return "القراءة الحالية يجب أن تكون رقماً";
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
  return subscription?.subscriptionNumber || selectedSubscriber?.subscriptionNumber || selectedSubscriber?.subscriptionId || "";
}

function getSubscriptionId(selectedSubscriber, subscription) {
  return subscription?.id || selectedSubscriber?.subscriptionId || selectedSubscriber?.id || "";
}

function getErrorMessage(error, fallback = "تعذر تنفيذ العملية. حاول مرة أخرى.") {
  return error?.displayMessage || error?.message || fallback;
}

export function useCreateProviderInvoice({ isOpen, onClose, onCreated } = {}) {
  const [state, setState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    let isMounted = true;

    async function loadInitialSubscribers() {
      try {
        setState((current) => ({ ...current, subscriberSearchLoading: true, searchError: "" }));
        const results = await searchProviderInvoiceSubscribers("");

        if (isMounted) {
          setState((current) => ({
            ...current,
            subscriberResults: results,
            subscriberSearchLoading: false,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState((current) => ({
            ...current,
            searchError: getErrorMessage(error, "تعذر تحميل المشتركين."),
            subscriberSearchLoading: false,
          }));
        }
      }
    }

    loadInitialSubscribers();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const setSubscriberQuery = useCallback((value) => {
    setState((current) => ({
      ...current,
      searchError: "",
      selectedSubscriber: null,
      subscriberQuery: value,
      subscription: null,
      previousReading: "",
    }));
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const query = state.subscriberQuery.trim();

    if (query.length > 0 && query.length < MIN_SEARCH_LENGTH) {
      setState((current) => ({ ...current, subscriberResults: [] }));
      return undefined;
    }

    let isMounted = true;
    const timer = window.setTimeout(async () => {
      try {
        setState((current) => ({ ...current, subscriberSearchLoading: true, searchError: "" }));
        const results = await searchProviderInvoiceSubscribers(query);

        if (isMounted) {
          setState((current) => ({ ...current, subscriberResults: results, subscriberSearchLoading: false }));
        }
      } catch (error) {
        if (isMounted) {
          setState((current) => ({
            ...current,
            searchError: getErrorMessage(error, "تعذر البحث في المشتركين."),
            subscriberResults: [],
            subscriberSearchLoading: false,
          }));
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [isOpen, state.subscriberQuery]);

  const selectSubscriber = useCallback(async (subscriber) => {
    const basicSubscription = subscriber?.subscription || null;

    setState((current) => ({
      ...current,
      selectedSubscriber: subscriber,
      subscriberQuery: subscriber?.name || "",
      subscriberResults: [],
      subscription: basicSubscription,
      previousReading: basicSubscription?.previousReading || basicSubscription?.previous_reading || "",
      fieldErrors: { ...current.fieldErrors, subscriber: "", subscription: "" },
    }));

    try {
      const details = await getProviderInvoiceSubscriptionDetails(subscriber.subscriptionId || subscriber.id);
      setState((current) => ({
        ...current,
        subscription: details,
        previousReading: details.previousReading ?? "",
      }));
    } catch {
      // The subscriber row is still usable if the backend response already contains subscription data.
    }
  }, []);

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
    const subscriptionId = getSubscriptionId(state.selectedSubscriber, state.subscription);
    const currentReadingError = validateCurrentReading(state.currentReading, state.previousReading);

    if (!state.selectedSubscriber) errors.subscriber = "يرجى اختيار مشترك";
    if (!subscriptionId) errors.subscription = "رقم الاشتراك غير متوفر";
    if (!state.dueDate || !isValidDate(state.dueDate)) errors.due_date = "تاريخ الاستحقاق مطلوب";
    if (currentReadingError) errors.current_reading = currentReadingError;

    return errors;
  }, [state.currentReading, state.dueDate, state.previousReading, state.selectedSubscriber, state.subscription]);

  const createInvoice = useCallback(async () => {
    if (!isOpen || isSubmitting) return;

    if (Object.keys(validation).length) {
      setState((current) => ({ ...current, fieldErrors: validation }));
      return;
    }

    setIsSubmitting(true);
    setState((current) => ({ ...current, fieldErrors: {}, submitError: "" }));

    try {
      const invoice = await createProviderInvoice({
        subscription_id: getSubscriptionId(state.selectedSubscriber, state.subscription),
        previous_reading: state.previousReading || 0,
        current_reading: state.currentReading,
        due_date: state.dueDate,
      });

      await onCreated?.(invoice);
      resetForm();
      onClose?.();
      return invoice;
    } catch (error) {
      setState((current) => ({
        ...current,
        fieldErrors: error?.fieldErrors || current.fieldErrors,
        submitError: getErrorMessage(error, "تعذر إصدار الفاتورة."),
      }));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isOpen, isSubmitting, onClose, onCreated, resetForm, state.currentReading, state.dueDate, state.previousReading, state.selectedSubscriber, state.subscription, validation]);

  return {
    ...state,
    canCreateInvoice: true,
    canSearchSubscribers: true,
    createInvoice,
    isSubmitDisabled: isSubmitting || Object.keys(validation).length > 0,
    isSubmitting,
    minSearchLength: MIN_SEARCH_LENGTH,
    resetForm,
    selectSubscriber,
    setCurrentReading,
    setDueDate,
    setSubscriberQuery,
    statusMessage: "",
    subscriptionNumber: getSubscriptionNumber(state.selectedSubscriber, state.subscription),
    validation,
  };
}

export default useCreateProviderInvoice;
