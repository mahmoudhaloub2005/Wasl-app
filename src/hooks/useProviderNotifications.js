import { useCallback, useMemo, useSyncExternalStore } from "react";

const NOTIFICATION_TYPES = [
  "invoice",
  "payment",
  "subscriber",
  "complaint",
  "generator",
  "system",
];

let providerNotifications = [];
const listeners = new Set();

function emitNotificationsChange() {
  listeners.forEach((listener) => listener());
}

function subscribeToProviderNotifications(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getProviderNotificationsSnapshot() {
  return providerNotifications;
}

function createNotificationId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeNotificationType(type) {
  return NOTIFICATION_TYPES.includes(type) ? type : "system";
}

function normalizeNotification(notification) {
  const description =
    notification.description ?? notification.body ?? notification.message ?? "";

  return {
    id: notification.id || createNotificationId(),
    type: normalizeNotificationType(notification.type),
    title: notification.title || "إشعار جديد",
    description,
    body: notification.body ?? description,
    createdAt: notification.createdAt || new Date().toISOString(),
    isRead: Boolean(notification.isRead),
    route: notification.route || notification.path || "",
  };
}

function setProviderNotifications(updater) {
  providerNotifications = updater(providerNotifications);
  emitNotificationsChange();
}

export function addProviderNotification(notification) {
  setProviderNotifications((currentNotifications) => [
    normalizeNotification(notification),
    ...currentNotifications,
  ]);
}

export function markProviderNotificationAsRead(notificationId) {
  setProviderNotifications((currentNotifications) =>
    currentNotifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    )
  );
}

export function markAllProviderNotificationsAsRead() {
  setProviderNotifications((currentNotifications) =>
    currentNotifications.map((notification) => ({
      ...notification,
      isRead: true,
    }))
  );
}

export function deleteProviderNotification(notificationId) {
  setProviderNotifications((currentNotifications) =>
    currentNotifications.filter((notification) => notification.id !== notificationId)
  );
}

export function useProviderNotifications() {
  const notifications = useSyncExternalStore(
    subscribeToProviderNotifications,
    getProviderNotificationsSnapshot,
    getProviderNotificationsSnapshot
  );

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

  const deleteNotification = useCallback((notificationId) => {
    deleteProviderNotification(notificationId);
  }, []);

  return {
    addNotification,
    deleteNotification,
    hasUnreadNotifications: unreadCount > 0,
    markAllAsRead,
    markAsRead,
    notifications,
    unreadCount,
  };
}

export default useProviderNotifications;
