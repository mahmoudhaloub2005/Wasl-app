import api from "./api";

import newNotifications from "../assets/customer/icons/new-notifications.svg";
import paidBill from "../assets/customer/icons/paid-bill.svg";
import unpaidBill from "../assets/customer/icons/unpaid-bill.svg";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.data?.notifications)) return data.data.notifications;
  if (Array.isArray(data?.items)) return data.items;
  if (data?.notification) return [data.notification];
  if (data?.data?.notification) return [data.data.notification];
  if (data?.data && typeof data.data === "object") return [data.data];

  return [];
}

function getFirstValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

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

function getNotificationVisual(type) {
  const value = String(type || "").toLowerCase();

  if (value.includes("payment") || value.includes("paid")) {
    return {
      icon: paidBill,
      iconAlt: "دفعة",
      colorClass: "notification-gray",
    };
  }

  if (value.includes("bill") || value.includes("invoice")) {
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

export function normalizeNotification(notification = {}) {
  const type = getFirstValue(notification, ["type", "category"]);
  const visual = getNotificationVisual(type);

  return {
    id: getFirstValue(notification, ["id", "_id", "uuid"]),
    title: getFirstValue(notification, ["title", "subject"], "تنبيه جديد"),
    description: getFirstValue(
      notification,
      ["description", "message", "body", "text"],
      ""
    ),
    time:
      formatDate(
        getFirstValue(notification, ["time", "date", "created_at", "createdAt"])
      ) || "الآن",
    isRead: Boolean(getFirstValue(notification, ["is_read", "isRead", "read"], false)),
    ...visual,
  };
}

export async function getMyNotifications(params = {}) {
  const response = await api.get("/notifications/my", { params });
  return unwrapList(response.data).map(normalizeNotification);
}

export async function markNotificationAsRead(id) {
  const response = await api.post(`/notifications/${id}/read`);
  return response.data;
}
