const STATUS_LABELS = {
  pending: "قيد الانتظار",
  under_review: "قيد المراجعة",
  resolved: "تم الحل",
};

const PRIORITY_LABELS = {
  urgent: "أولوية قصوى",
  medium: "متوسطة",
  low: "منخفضة",
};

export const complaintStatusOptions = [
  { value: "all", label: "الكل" },
  { value: "pending", label: STATUS_LABELS.pending },
  { value: "under_review", label: STATUS_LABELS.under_review },
  { value: "resolved", label: STATUS_LABELS.resolved },
];

export const complaintPriorityOptions = [
  { value: "all", label: "الكل" },
  { value: "urgent", label: PRIORITY_LABELS.urgent },
  { value: "medium", label: PRIORITY_LABELS.medium },
  { value: "low", label: PRIORITY_LABELS.low },
];

function normalizeComplaintStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value === "resolved" || value === "closed") return "resolved";
  if (value === "under_review" || value === "in_progress") return "under_review";

  return "pending";
}

function normalizeComplaintPriority(priority) {
  const value = String(priority || "").toLowerCase();

  if (value === "urgent" || value === "high" || value === "critical") {
    return "urgent";
  }

  if (value === "low") return "low";

  return "medium";
}

export function getComplaintStatusLabel(status) {
  return STATUS_LABELS[normalizeComplaintStatus(status)] || STATUS_LABELS.pending;
}

export function getComplaintPriorityLabel(priority) {
  return PRIORITY_LABELS[normalizeComplaintPriority(priority)] || PRIORITY_LABELS.medium;
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function exportProviderComplaints(complaints = []) {
  const headers = [
    "Ticket number",
    "Complaint title",
    "Customer name",
    "Subscriber number",
    "Priority",
    "Status",
    "Creation date",
    "Last update date",
  ];
  const rows = complaints.map((complaint) => [
    complaint.ticketNumber,
    complaint.title,
    complaint.customerName,
    complaint.subscriberNumber,
    getComplaintPriorityLabel(complaint.priority),
    getComplaintStatusLabel(complaint.status),
    complaint.createdAt,
    complaint.updatedAt,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
}