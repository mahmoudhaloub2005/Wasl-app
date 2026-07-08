import api from "./api";

const TARGET_TYPES_TO_TRY = [
  "generator",
  "generators",
  "Generator",
  "provider",
];

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

  if (
    value.includes("resolved") ||
    value.includes("solved") ||
    value.includes("حل")
  ) {
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

function isTargetTypeInvalidError(error) {
  const message = error?.response?.data?.message || "";
  const errors = error?.response?.data?.errors || {};

  return (
    String(message).toLowerCase().includes("target type") ||
    String(message).toLowerCase().includes("selected target type") ||
    Array.isArray(errors?.target_type)
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "حدث خطأ غير متوقع"
  );
}

function buildComplaintPayload({ title, details, targetId, targetType }) {
  return {
    title,
    subject: title,
    description: details,
    details,
    message: details,

    target_type: targetType,
    target_id: targetId,

    generator_id: targetId,
  };
}

function buildComplaintFormData({ title, details, file, targetId, targetType }) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("subject", title);
  formData.append("description", details);
  formData.append("details", details);
  formData.append("message", details);

  formData.append("target_type", targetType);
  formData.append("target_id", targetId);
  formData.append("generator_id", targetId);

  if (file) {
    formData.append("attachment", file);
    formData.append("image", file);
    formData.append("file", file);
  }

  return formData;
}

function logFormData(formData) {
  console.log("Complaint FormData:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
}

async function postComplaintWithPayload({ title, details, targetId }) {
  let lastError = null;

  for (const targetType of TARGET_TYPES_TO_TRY) {
    try {
      const payload = buildComplaintPayload({
        title,
        details,
        targetId,
        targetType,
      });

      console.log("Trying complaint payload:", payload);

      const response = await api.post("/complaints", payload);
      return response;
    } catch (error) {
      lastError = error;

      if (!isTargetTypeInvalidError(error)) {
        throw error;
      }

      console.warn(
        `target_type "${targetType}" مرفوض من الخادم، سيتم تجربة قيمة أخرى...`
      );
    }
  }

  throw lastError;
}

async function postComplaintWithFormData({ title, details, file, targetId }) {
  let lastError = null;

  for (const targetType of TARGET_TYPES_TO_TRY) {
    try {
      const formData = buildComplaintFormData({
        title,
        details,
        file,
        targetId,
        targetType,
      });

      logFormData(formData);

      const response = await api.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      lastError = error;

      if (!isTargetTypeInvalidError(error)) {
        throw error;
      }

      console.warn(
        `target_type "${targetType}" مرفوض من الخادم، سيتم تجربة قيمة أخرى...`
      );
    }
  }

  throw lastError;
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
  if (!title || !String(title).trim()) {
    throw new Error("عنوان الشكوى مطلوب");
  }

  if (!details || !String(details).trim()) {
    throw new Error("وصف الشكوى مطلوب");
  }

  if (!targetId) {
    throw new Error("يجب اختيار المولد قبل إرسال الشكوى");
  }

  try {
    const cleanTitle = String(title).trim();
    const cleanDetails = String(details).trim();

    const response = file
      ? await postComplaintWithFormData({
          title: cleanTitle,
          details: cleanDetails,
          file,
          targetId,
        })
      : await postComplaintWithPayload({
          title: cleanTitle,
          details: cleanDetails,
          targetId,
        });

    return normalizeComplaint(unwrapItem(response.data));
  } catch (error) {
    console.error("Create complaint failed:", error?.response?.data || error);

    throw new Error(getErrorMessage(error));
  }
}

export async function updateComplaint(id, data) {
  const response = await api.put(`/complaints/${id}`, data);
  return normalizeComplaint(unwrapItem(response.data));
}

export async function deleteComplaint(id) {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
}