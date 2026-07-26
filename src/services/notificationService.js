import api from "./api";
import { getApiMessage, getFirstValue, sanitizeText, unwrapList } from "./apiResponse";

import newNotifications from "../assets/customer/icons/new-notifications.svg";
import paidBill from "../assets/customer/icons/paid-bill.svg";
import unpaidBill from "../assets/customer/icons/unpaid-bill.svg";

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  const text = String(value || "").trim().toLowerCase();
  return ["1", "true", "read", "yes", "seen"].includes(text);
}

function normalizeNotificationType(type) {
  const value = String(type || "system").toLowerCase().replace(/[_-]+/g, "_");

  if (value.includes("payment") || value.includes("paid")) return "payment";
  if (value.includes("bill") || value.includes("invoice")) return "invoice";
  if (value.includes("subscriber") || value.includes("subscription")) return "subscriber";
  if (value.includes("complaint")) return "complaint";
  if (value.includes("generator")) return "generator";

  return "system";
}

function getNotificationVisual(type) {
  const value = normalizeNotificationType(type);

  if (value === "payment") {
    return {
      icon: paidBill,
      iconAlt: "دفعة",
      colorClass: "notification-gray",
    };
  }

  if (value === "invoice") {
    return {
      icon: unpaidBill,
      iconAlt: "فاتورة",
      colorClass: "notification-orange",
    };
  }

  return {
    icon: newNotifications,
    iconAlt: "تنبيه جديد",
    colorClass: "notification-blue",
  };
}

function unwrapNotificationItem(data) {
  return data?.data?.notification || data?.notification || data?.data || data || {};
}

export function normalizeNotification(notification = {}) {
  const type = getFirstValue(notification, ["type", "category"], "system");
  const visual = getNotificationVisual(type);
  const createdAt = getFirstValue(notification, [
    "created_at",
    "createdAt",
    "time",
    "date",
    "sent_at",
    "sentAt",
  ]);
  const description = sanitizeText(
    getFirstValue(notification, ["description", "message", "body", "text"])
  );

  return {
    id: String(getFirstValue(notification, ["id", "_id", "uuid"])),
    type: normalizeNotificationType(type),
    title: sanitizeText(
      getFirstValue(notification, ["title", "subject"]),
      "تنبيه جديد"
    ),
    description,
    body: sanitizeText(getFirstValue(notification, ["body", "message", "text"]), description),
    message: description,
    time: formatDate(createdAt) || "الآن",
    createdAt: createdAt || new Date().toISOString(),
    isRead: normalizeBoolean(
      getFirstValue(notification, ["is_read", "isRead", "read", "read_at", "readAt"], false)
    ),
    route: sanitizeText(getFirstValue(notification, ["route", "path", "url"])),
    raw: notification,
    ...visual,
  };
}

export async function getMyNotifications(params = {}) {
  const response = await api.get("/notifications/my", { params });
  return unwrapList(response.data, ["notifications"])
    .map(normalizeNotification)
    .filter((notification) => notification.id);
}

export async function markNotificationAsRead(id) {
  const response = await api.post(`/notifications/${id}/read`);
  return response.data;
}

export async function sendProviderNotification({ message, title, userId, user_id } = {}) {
  const cleanMessage = sanitizeText(message);
  const cleanTitle = sanitizeText(title);
  const recipientId = user_id || userId;

  if (!recipientId) {
    const error = new Error(
      "إرسال الإشعار يتطلب رقم مستخدم مستلم حسب واجهة Wasel API الحالية."
    );
    error.displayMessage = error.message;
    throw error;
  }

  if (!cleanTitle) {
    const error = new Error("يرجى إدخال عنوان الإشعار.");
    error.displayMessage = error.message;
    throw error;
  }

  if (!cleanMessage) {
    const error = new Error("يرجى إدخال نص الإشعار.");
    error.displayMessage = error.message;
    throw error;
  }

  const payload = {
    user_id: recipientId,
    title: cleanTitle,
    message: cleanMessage,
  };

  try {
    const response = await api.post("/notifications/send", payload);

    return unwrapNotificationItem(response.data);
  } catch (error) {
    error.displayMessage = getApiMessage(error, "تعذر إرسال الإشعار للمشتركين.");
    throw error;
  }
}
