import { useCallback, useMemo, useState } from "react";

import { providerServicePendingMessage } from "../services/provider/providerFrontendStatus";

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

export function useCreateProviderInvoice({ isOpen } = {}) {
  const [state, setState] = useState(initialState);
  const [isSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

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

  const selectSubscriber = useCallback((subscriber) => {
    setState((current) => ({
      ...current,
      selectedSubscriber: subscriber,
      subscriberQuery: subscriber?.name || "",
      subscriberResults: [],
      subscription: subscriber?.subscription || null,
    }));
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

  const createInvoice = useCallback(async () => {
    if (!isOpen) return;

    if (Object.keys(validation).length) {
      setState((current) => ({ ...current, fieldErrors: validation }));
      return;
    }

    setState((current) => ({
      ...current,
      fieldErrors: {},
      submitError: providerServicePendingMessage,
    }));
  }, [isOpen, validation]);

  return {
    ...state,
    canCreateInvoice: false,
    canSearchSubscribers: false,
    createInvoice,
    isSubmitDisabled: true,
    isSubmitting,
    minSearchLength: MIN_SEARCH_LENGTH,
    resetForm,
    selectSubscriber,
    setCurrentReading,
    setDueDate,
    setSubscriberQuery,
    statusMessage: providerServicePendingMessage,
    subscriptionNumber: getSubscriptionNumber(state.selectedSubscriber, state.subscription),
    validation,
  };
}

export default useCreateProviderInvoice;