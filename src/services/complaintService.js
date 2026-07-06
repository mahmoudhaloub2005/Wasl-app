import api from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.complaints)) return data.complaints;
  if (Array.isArray(data?.data?.complaints)) return data.data.complaints;
  if (Array.isArray(data?.items)) return data.items;
  if (data?.complaint) return [data.complaint];
  if (data?.data?.complaint) return [data.data.complaint];
  if (data?.data && typeof data.data === "object") return [data.data];

  return [];
}

function unwrapItem(data) {
  return data?.data?.complaint || data?.complaint || data?.data || data;
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

export function normalizeComplaint(complaint = {}) {
  const status = normalizeStatus(getFirstValue(complaint, ["status", "state"]));

  return {
    id: getFirstValue(complaint, ["id", "_id", "uuid"]),
    title: getFirstValue(complaint, ["title", "subject"], "شكوى"),
    details: getFirstValue(
      complaint,
      ["details", "description", "message", "body"],
      ""
    ),
    date:
      formatDate(getFirstValue(complaint, ["date", "created_at", "createdAt"])) ||
      "غير محدد",
    status,
    statusText: getFirstValue(
      complaint,
      ["status_text", "statusText"],
      getStatusText(status)
    ),
  };
}

export async function getComplaints(params = {}) {
  const response = await api.get("/complaints", { params });
  return unwrapList(response.data).map(normalizeComplaint);
}

export async function createComplaint({ title, details, file, targetId }) {
  const payload = {
    title,
    subject: title,
    description: details,
    details,
    message: details,
    target_type: "provider",
    target_id: targetId,
  };

  if (!file) {
    const response = await api.post("/complaints", payload);
    return normalizeComplaint(unwrapItem(response.data));
  }

  const formData = new FormData();

  formData.append("title", title);
  formData.append("subject", title);
  formData.append("description", details);
  formData.append("details", details);
  formData.append("message", details);
  formData.append("target_type", "provider");
  formData.append("target_id", targetId);

  if (file) {
    formData.append("attachment", file);
    formData.append("image", file);
    formData.append("file", file);
  }

  const response = await api.post("/complaints", formData);
  return normalizeComplaint(unwrapItem(response.data));
}

export async function updateComplaint(id, data) {
  const response = await api.put(`/complaints/${id}`, data);
  return normalizeComplaint(unwrapItem(response.data));
}

export async function deleteComplaint(id) {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
}
