import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

import {
  getMyNotifications,
  markNotificationAsRead,
  normalizeNotification,
} from "../services/notificationService";

let providerNotifications = [];
let providerNotificationsError = "";
let providerNotificationsLoading = false;
let providerNotificationsSnapshot = {
  errorMessage: providerNotificationsError,
  isLoading: providerNotificationsLoading,
  notifications: providerNotifications,
};
const listeners = new Set();

function updateSnapshot() {
  providerNotificationsSnapshot = {
    errorMessage: providerNotificationsError,
    isLoading: providerNotificationsLoading,
    notifications: providerNotifications,
  };
}

function emitNotificationsChange() {
  updateSnapshot();
  listeners.forEach((listener) => listener());
}

function subscribeToProviderNotifications(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getProviderNotificationsSnapshot() {
  return providerNotificationsSnapshot;
}

function setProviderNotificationsState(updater) {
  const nextState = updater(providerNotificationsSnapshot);
  providerNotifications = nextState.notifications ?? providerNotifications;
  providerNotificationsError = nextState.errorMessage ?? providerNotificationsError;
  providerNotificationsLoading = nextState.isLoading ?? providerNotificationsLoading;
  emitNotificationsChange();
}

function getErrorMessage(error, fallback = "تعذر تحميل الإشعارات من الخادم.") {
  return error?.displayMessage || error?.message || fallback;
}

export async function refreshProviderNotifications() {
  setProviderNotificationsState((currentState) => ({
    ...currentState,
    errorMessage: "",
    isLoading: true,
  }));

  try {
    const notifications = await getMyNotifications();
    setProviderNotificationsState((currentState) => ({
      ...currentState,
      errorMessage: "",
      isLoading: false,
      notifications,
    }));
    return notifications;
  } catch (error) {
    setProviderNotificationsState((currentState) => ({
      ...currentState,
      errorMessage: getErrorMessage(error),
      isLoading: false,
      notifications: [],
    }));
    throw error;
  }
}

export function addProviderNotification(notification) {
  setProviderNotificationsState((currentState) => ({
    ...currentState,
    notifications: [
      normalizeNotification(notification),
      ...currentState.notifications,
    ].filter((item) => item.id),
  }));
}

export async function markProviderNotificationAsRead(notificationId) {
  if (!notificationId) return false;

  try {
    await markNotificationAsRead(notificationId);
    setProviderNotificationsState((currentState) => ({
      ...currentState,
      notifications: currentState.notifications.map((notification) =>
        String(notification.id) === String(notificationId)
          ? { ...notification, isRead: true }
          : notification
      ),
    }));
    return true;
  } catch (error) {
    setProviderNotificationsState((currentState) => ({
      ...currentState,
      errorMessage: getErrorMessage(error, "تعذر تحديث حالة الإشعار."),
    }));
    return false;
  }
}

export async function markAllProviderNotificationsAsRead() {
  const unreadNotifications = providerNotifications.filter(
    (notification) => !notification.isRead && notification.id
  );

  if (!unreadNotifications.length) return true;

  const results = await Promise.all(
    unreadNotifications.map((notification) =>
      markProviderNotificationAsRead(notification.id)
    )
  );

  return results.every(Boolean);
}

export function deleteProviderNotification() {
  setProviderNotificationsState((currentState) => ({
    ...currentState,
    errorMessage: "حذف الإشعارات غير موثق في واجهة Wasel API الحالية.",
  }));
  return false;
}

export function useProviderNotifications() {
  const snapshot = useSyncExternalStore(
    subscribeToProviderNotifications,
    getProviderNotificationsSnapshot,
    getProviderNotificationsSnapshot
  );
  const { errorMessage, isLoading, notifications } = snapshot;

  useEffect(() => {
    if (providerNotifications.length || providerNotificationsLoading) return;

    refreshProviderNotifications().catch(() => {
      // The hook exposes the API error state to callers that render it.
    });
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const addNotification = useCallback((notification) => {
    addProviderNotification(notification);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    markProviderNotificationAsRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(() => {
    markAllProviderNotificationsAsRead();
  }, []);

  const deleteNotification = useCallback(() => {
    deleteProviderNotification();
  }, []);

  return {
    addNotification,
    deleteNotification,
    errorMessage,
    hasUnreadNotifications: unreadCount > 0,
    isLoading,
    markAllAsRead,
    markAsRead,
    notifications,
    refreshNotifications: refreshProviderNotifications,
    unreadCount,
  };
}

export default useProviderNotifications;
