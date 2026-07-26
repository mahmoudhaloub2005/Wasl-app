import api from "./api";
import { getApiMessage, getFirstValue, sanitizeText, unwrapItem, unwrapList } from "./apiResponse";

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("resolved") || value.includes("solved") || value.includes("حل")) {
    return "resolved";
  }

  if (value.includes("reject") || value.includes("رفض")) {
    return "rejected";
  }

  return "pending";
}

function getStatusText(status) {
  if (status === "resolved") return "تم الحل";
  if (status === "rejected") return "مرفوضة";
  return "قيد المراجعة";
}

function createDisplayError(message, cause) {
  const error = new Error(message);
  error.displayMessage = message;
  error.cause = cause;
  return error;
}

export function normalizeComplaint(complaint = {}) {
  const status = normalizeStatus(getFirstValue(complaint, ["status", "state"]));

  return {
    id: String(getFirstValue(complaint, ["id", "_id", "uuid"])),
    title: sanitizeText(getFirstValue(complaint, ["title", "subject"]), "شكوى"),
    details: sanitizeText(
      getFirstValue(complaint, ["details", "description", "message", "body"])
    ),
    date:
      formatDate(getFirstValue(complaint, ["date", "created_at", "createdAt"])) ||
      "غير محدد",
    status,
    statusText: sanitizeText(
      getFirstValue(complaint, ["status_text", "statusText"]),
      getStatusText(status)
    ),
    raw: complaint,
  };
}

export async function getComplaints(params = {}) {
  const response = await api.get("/complaints", { params });
  return unwrapList(response.data, ["complaints"]).map(normalizeComplaint);
}

export async function createComplaint({ title, details, description, file, targetId }) {
  const cleanTitle = sanitizeText(title);
  const cleanDescription = sanitizeText(details || description);

  if (!cleanTitle) {
    throw createDisplayError("عنوان الشكوى مطلوب");
  }

  if (!cleanDescription) {
    throw createDisplayError("وصف الشكوى مطلوب");
  }

  if (!targetId) {
    throw createDisplayError("يجب اختيار المزود قبل إرسال الشكوى");
  }

  if (file) {
    throw createDisplayError("إرفاق ملفات مع الشكوى غير موثق في واجهة Wasel API الحالية.");
  }

  try {
    const response = await api.post("/complaints", {
      title: cleanTitle,
      description: cleanDescription,
      target_type: "provider",
      target_id: targetId,
    });

    return normalizeComplaint(unwrapItem(response.data, ["complaint"]));
  } catch (error) {
    throw createDisplayError(
      getApiMessage(error, "تعذر إرسال الشكوى. حاول مرة أخرى."),
      error
    );
  }
}

export async function updateComplaint() {
  throw createDisplayError("تعديل الشكاوى غير موثق في واجهة Wasel API الحالية.");
}

export async function deleteComplaint() {
  throw createDisplayError("حذف الشكاوى غير موثق في واجهة Wasel API الحالية.");
}
