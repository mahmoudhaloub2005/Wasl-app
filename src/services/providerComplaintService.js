function createUnsupportedError(message) {
  const error = new Error(message);
  error.displayMessage = message;
  return error;
}

export const complaintStatusOptions = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "under_review", label: "قيد المراجعة" },
  { value: "resolved", label: "تم الحل" },
];

export const complaintPriorityOptions = [
  { value: "all", label: "الكل" },
  { value: "urgent", label: "أولوية قصوى" },
  { value: "medium", label: "متوسطة" },
  { value: "low", label: "منخفضة" },
];

export function normalizeComplaintStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("resolved") || value.includes("closed")) return "resolved";
  if (value.includes("review") || value.includes("progress")) return "under_review";
  return "pending";
}

export function normalizeComplaintPriority(priority) {
  const value = String(priority || "").toLowerCase();
  if (value.includes("urgent") || value.includes("high")) return "urgent";
  if (value.includes("low")) return "low";
  return "medium";
}

export function getComplaintStatusLabel(status) {
  return complaintStatusOptions.find((option) => option.value === normalizeComplaintStatus(status))?.label || "قيد الانتظار";
}

export function getComplaintPriorityLabel(priority) {
  return complaintPriorityOptions.find((option) => option.value === normalizeComplaintPriority(priority))?.label || "متوسطة";
}

export function normalizeProviderComplaint(complaint = {}) {
  return {
    ...complaint,
    status: normalizeComplaintStatus(complaint.status),
    priority: normalizeComplaintPriority(complaint.priority),
  };
}

export async function getProviderComplaints() {
  throw createUnsupportedError("قائمة شكاوى المزود غير موثقة في واجهة Wasel API الحالية.");
}

export async function getProviderComplaintById() {
  throw createUnsupportedError("تفاصيل شكاوى المزود غير موثقة في واجهة Wasel API الحالية.");
}

export async function replyToComplaint() {
  throw createUnsupportedError("الرد على شكاوى المزود غير موثق في واجهة Wasel API الحالية.");
}

export async function updateComplaintStatus() {
  throw createUnsupportedError("تحديث حالة شكاوى المزود غير موثق في واجهة Wasel API الحالية.");
}

export async function getComplaintHistory() {
  throw createUnsupportedError("سجل شكاوى المزود غير موثق في واجهة Wasel API الحالية.");
}

export function exportProviderComplaints(complaints = []) {
  const headers = ["Ticket number", "Complaint title", "Customer name", "Status"];
  const rows = complaints.map((complaint) => [
    complaint.ticketNumber || complaint.id || "",
    complaint.title || "",
    complaint.customerName || "",
    getComplaintStatusLabel(complaint.status),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export const providerComplaintService = {
  getProviderComplaints,
  getProviderComplaintById,
  replyToComplaint,
  updateComplaintStatus,
  getComplaintHistory,
  exportProviderComplaints,
};

export default providerComplaintService;
