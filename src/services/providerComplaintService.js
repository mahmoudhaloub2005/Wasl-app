import api from "./api";

const STORAGE_KEY = "provider_complaints_management";
const LOCAL_ID_PREFIXES = ["demo-complaint", "local-complaint"];

const COMPLAINT_ENDPOINTS = [
  "/provider/complaints",
  "/complaints/provider",
  "/complaints",
];

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

function getSeedDate({ days = 0, hours = 0, minutes = 0, at }) {
  const date = new Date();

  if (at) {
    date.setHours(at.hours, at.minutes, 0, 0);
  } else {
    date.setTime(date.getTime() - days * 24 * 60 * 60 * 1000);
    date.setTime(date.getTime() - hours * 60 * 60 * 1000);
    date.setTime(date.getTime() - minutes * 60 * 1000);
  }

  if (days && at) {
    date.setDate(date.getDate() - days);
  }

  return date.toISOString();
}

function createHistory(action, createdAt, actor = "النظام") {
  return {
    id: `history-${createdAt}-${Math.random().toString(16).slice(2)}`,
    action,
    createdAt,
    actor,
  };
}

function createBaseComplaint(overrides) {
  const createdAt = overrides.createdAt || new Date().toISOString();

  return {
    id: overrides.id,
    ticketNumber: overrides.ticketNumber,
    customerName: overrides.customerName,
    subscriberNumber: overrides.subscriberNumber,
    title: overrides.title,
    description: overrides.description,
    priority: overrides.priority,
    status: overrides.status,
    createdAt,
    updatedAt: overrides.updatedAt || createdAt,
    providerReply: overrides.providerReply || null,
    relatedGenerator: overrides.relatedGenerator || "",
    relatedInvoice: overrides.relatedInvoice || "",
    relatedSubscription: overrides.relatedSubscription || "",
    attachments: overrides.attachments || [],
    history:
      overrides.history ||
      [createHistory("تم إنشاء الشكوى", createdAt, overrides.customerName)],
  };
}

function createGeneratedComplaint(index, status, priority) {
  const names = [
    "سارة محمود",
    "خالد حسن",
    "منى أبو عيد",
    "ليان ناصر",
    "محمود خليل",
    "ريم عثمان",
    "نور عادل",
    "أنس سالم",
  ];
  const titles = [
    "تذبذب في قوة التيار",
    "تأخر في متابعة طلب الصيانة",
    "استفسار عن الاشتراك الشهري",
    "مراجعة قراءة العداد",
    "توضيح رسوم الفاتورة",
  ];
  const createdAt = getSeedDate({ days: Math.floor(index / 3) + 2, hours: index % 6 });
  const customerName = names[index % names.length];
  const title = titles[index % titles.length];

  return createBaseComplaint({
    id: `demo-complaint-generated-${index}`,
    ticketNumber: `#TK-${8789 - index}`,
    customerName,
    subscriberNumber: String(120000 + index * 37),
    title,
    description: `طلب متابعة بخصوص ${title}. تم تسجيل الملاحظة من المشترك وسيتم التعامل معها حسب الأولوية.`,
    priority,
    status,
    createdAt,
    relatedGenerator: index % 2 ? "مولد الحي الشرقي" : "مولد السوق",
    relatedSubscription: `اشتراك ${index % 3 === 0 ? "32" : "16"} أمبير`,
  });
}

function createSeedComplaints() {
  const firstCreatedAt = getSeedDate({ hours: 2 });
  const secondCreatedAt = getSeedDate({ at: { hours: 10, minutes: 30 } });
  const thirdCreatedAt = getSeedDate({ days: 1 });

  const coreComplaints = [
    createBaseComplaint({
      id: "demo-complaint-8821",
      ticketNumber: "#TK-8821",
      customerName: "أحمد محمود الخالدي",
      subscriberNumber: "100455",
      title: "انقطاع مفاجئ في التيار الكهربائي",
      description:
        "حدث انقطاع مفاجئ في التيار الكهربائي لمدة طويلة، ولم تصل أي رسالة تنبيه قبل الانقطاع. أرجو المتابعة بشكل عاجل.",
      priority: "urgent",
      status: "pending",
      createdAt: firstCreatedAt,
      relatedGenerator: "مولد الحي الشرقي",
      relatedSubscription: "اشتراك 32 أمبير",
      history: [
        createHistory("تم إنشاء الشكوى", firstCreatedAt, "أحمد محمود الخالدي"),
      ],
    }),
    createBaseComplaint({
      id: "demo-complaint-8819",
      ticketNumber: "#TK-8819",
      customerName: "فاطمة علي",
      subscriberNumber: "100982",
      title: "استفسار عن قيمة الفاتورة الأخيرة",
      description:
        "أرغب في معرفة سبب ارتفاع قيمة الفاتورة الأخيرة مقارنة بالشهور السابقة، مع توضيح تفاصيل الاستهلاك.",
      priority: "medium",
      status: "under_review",
      createdAt: secondCreatedAt,
      updatedAt: getSeedDate({ hours: 1 }),
      relatedInvoice: "فاتورة شهر تموز",
      relatedSubscription: "اشتراك منزلي",
      providerReply: null,
      history: [
        createHistory("تم إنشاء الشكوى", secondCreatedAt, "فاطمة علي"),
        createHistory("تم تغيير الحالة إلى قيد المراجعة", getSeedDate({ hours: 1 }), "المزود"),
      ],
    }),
    createBaseComplaint({
      id: "demo-complaint-8790",
      ticketNumber: "#TK-8790",
      customerName: "ياسين إبراهيم",
      subscriberNumber: "220199",
      title: "تغيير مكان العداد",
      description:
        "تم طلب تغيير مكان العداد إلى موقع أكثر وضوحا للفنيين، وتمت معالجة الطلب وإغلاقه.",
      priority: "low",
      status: "resolved",
      createdAt: thirdCreatedAt,
      updatedAt: getSeedDate({ hours: 8 }),
      relatedGenerator: "مولد السوق",
      providerReply: {
        text: "تمت معالجة الطلب وتحديث موقع العداد في سجل الاشتراك.",
        createdAt: getSeedDate({ hours: 8 }),
      },
      history: [
        createHistory("تم إنشاء الشكوى", thirdCreatedAt, "ياسين إبراهيم"),
        createHistory("تم إرسال رد من المزود", getSeedDate({ hours: 9 }), "المزود"),
        createHistory("تم تحديد الشكوى كمحلولة", getSeedDate({ hours: 8 }), "المزود"),
      ],
    }),
  ];

  const generatedComplaints = [
    ...Array.from({ length: 41 }, (_, index) =>
      createGeneratedComplaint(index + 1, "pending", index % 3 === 0 ? "urgent" : "medium")
    ),
    ...Array.from({ length: 14 }, (_, index) =>
      createGeneratedComplaint(index + 80, "under_review", index % 2 ? "medium" : "low")
    ),
    ...Array.from({ length: 66 }, (_, index) =>
      createGeneratedComplaint(index + 140, "resolved", index % 2 ? "low" : "medium")
    ),
  ];

  return [...coreComplaints, ...generatedComplaints];
}

function hasBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function readStorage(fallback) {
  if (!hasBrowserStorage()) return cloneData(fallback);

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : cloneData(fallback);
  } catch {
    return cloneData(fallback);
  }
}

function writeStorage(complaints) {
  if (!hasBrowserStorage()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function isLocalId(id) {
  return LOCAL_ID_PREFIXES.some((prefix) => String(id || "").startsWith(prefix));
}

function unwrapList(data, keys = []) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  return [];
}

function unwrapItem(data, key) {
  return data?.data?.[key] || data?.[key] || data?.data || data;
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

function normalizeReply(reply = null) {
  if (!reply) return null;

  if (typeof reply === "string") {
    return {
      text: reply,
      createdAt: new Date().toISOString(),
    };
  }

  const text = getFirstValue(reply, [
    "text",
    "reply",
    "response",
    "message",
    "body",
    "comment",
  ]);

  if (!text) return null;

  return {
    text,
    createdAt:
      getFirstValue(reply, [
        "createdAt",
        "created_at",
        "repliedAt",
        "replied_at",
        "updatedAt",
        "updated_at",
      ]) || new Date().toISOString(),
  };
}

export function normalizeComplaintStatus(status) {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("resolved") ||
    value.includes("closed") ||
    value.includes("solved") ||
    value.includes("تم الحل") ||
    value.includes("مغلقة")
  ) {
    return "resolved";
  }

  if (
    value.includes("under_review") ||
    value.includes("in_progress") ||
    value.includes("review") ||
    value.includes("processing") ||
    value.includes("قيد المراجعة") ||
    value.includes("قيد المعالجة")
  ) {
    return "under_review";
  }

  return "pending";
}

export function normalizeComplaintPriority(priority) {
  const value = String(priority || "").toLowerCase();

  if (
    value.includes("urgent") ||
    value.includes("high") ||
    value.includes("critical") ||
    value.includes("قصوى") ||
    value.includes("عاجل")
  ) {
    return "urgent";
  }

  if (
    value.includes("low") ||
    value.includes("منخفض") ||
    value.includes("خفيف")
  ) {
    return "low";
  }

  return "medium";
}

export function getComplaintStatusLabel(status) {
  return STATUS_LABELS[normalizeComplaintStatus(status)] || STATUS_LABELS.pending;
}

export function getComplaintPriorityLabel(priority) {
  return PRIORITY_LABELS[normalizeComplaintPriority(priority)] || PRIORITY_LABELS.medium;
}

export function normalizeProviderComplaint(complaint = {}) {
  const customer = complaint.customer || complaint.user || complaint.client || {};
  const generator = complaint.generator || complaint.relatedGenerator || {};
  const invoice = complaint.invoice || complaint.relatedInvoice || {};
  const subscription = complaint.subscription || complaint.relatedSubscription || {};
  const createdAt =
    getFirstValue(complaint, ["createdAt", "created_at", "submittedAt", "submitted_at", "date"]) ||
    new Date().toISOString();
  const ticketNumber =
    getFirstValue(complaint, ["ticketNumber", "ticket_number", "ticket", "code"]) ||
    `#TK-${getFirstValue(complaint, ["id", "_id", "uuid"], Date.now())}`;

  return {
    id:
      getFirstValue(complaint, ["id", "_id", "uuid"]) ||
      `local-complaint-${Date.now()}`,
    ticketNumber: String(ticketNumber).startsWith("#")
      ? String(ticketNumber)
      : `#${ticketNumber}`,
    customerName:
      getFirstValue(complaint, ["customerName", "customer_name", "userName"]) ||
      getFirstValue(customer, ["name", "full_name", "fullName"], "عميل"),
    subscriberNumber:
      getFirstValue(complaint, ["subscriberNumber", "subscriber_number", "subscriptionNumber", "subscription_number"]) ||
      getFirstValue(subscription, ["number", "id", "subscription_number"], ""),
    title: getFirstValue(complaint, ["title", "subject"], "شكوى"),
    description: getFirstValue(
      complaint,
      ["description", "details", "message", "body"],
      ""
    ),
    priority: normalizeComplaintPriority(
      getFirstValue(complaint, ["priority", "importance"], "medium")
    ),
    status: normalizeComplaintStatus(getFirstValue(complaint, ["status", "state"])),
    createdAt,
    updatedAt:
      getFirstValue(complaint, ["updatedAt", "updated_at", "lastUpdate", "last_update"]) ||
      createdAt,
    providerReply: normalizeReply(
      complaint.providerReply ||
        complaint.provider_reply ||
        complaint.providerResponse ||
        complaint.provider_response ||
        complaint.response ||
        complaint.reply
    ),
    relatedGenerator:
      typeof generator === "string"
        ? generator
        : getFirstValue(generator, ["name", "generator_name"], "") ||
          getFirstValue(complaint, ["relatedGenerator", "related_generator", "generatorName", "generator_name"], ""),
    relatedInvoice:
      typeof invoice === "string"
        ? invoice
        : getFirstValue(invoice, ["number", "name", "title"], "") ||
          getFirstValue(complaint, ["relatedInvoice", "related_invoice", "invoiceNumber", "invoice_number"], ""),
    relatedSubscription:
      typeof subscription === "string"
        ? subscription
        : getFirstValue(subscription, ["number", "name", "title"], "") ||
          getFirstValue(complaint, ["relatedSubscription", "related_subscription", "subscriptionName", "subscription_name"], ""),
    attachments: Array.isArray(complaint.attachments) ? complaint.attachments : [],
    history: Array.isArray(complaint.history)
      ? complaint.history
      : [createHistory("تم إنشاء الشكوى", createdAt, "العميل")],
  };
}

function isMissingEndpointError(error) {
  return [404, 405, 501].includes(Number(error?.response?.status));
}

function getApiMessage(error, fallback) {
  const data = error?.response?.data;

  if (data?.message) return data.message;

  if (data?.errors && typeof data.errors === "object") {
    const firstValue = data.errors[Object.keys(data.errors)[0]];
    if (Array.isArray(firstValue)) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  return error?.displayMessage || error?.message || fallback;
}

function createDisplayError(error, fallback) {
  error.displayMessage = getApiMessage(error, fallback);
  return error;
}

async function requestFirstAvailable(endpoints, requestFactory) {
  let missingEndpointError = null;

  for (const endpoint of endpoints) {
    try {
      return await requestFactory(endpoint);
    } catch (error) {
      if (!isMissingEndpointError(error)) {
        throw error;
      }

      missingEndpointError = error;
    }
  }

  throw missingEndpointError || new Error("Endpoint unavailable");
}

function getLocalComplaints() {
  return readStorage(createSeedComplaints()).map(normalizeProviderComplaint);
}

function saveLocalComplaints(complaints) {
  writeStorage(complaints.map(normalizeProviderComplaint));
}

function updateLocalComplaint(complaintId, updater) {
  const complaints = getLocalComplaints();
  const nextComplaints = complaints.map((complaint) =>
    String(complaint.id) === String(complaintId)
      ? normalizeProviderComplaint(updater(complaint))
      : complaint
  );
  const updatedComplaint = nextComplaints.find(
    (complaint) => String(complaint.id) === String(complaintId)
  );

  saveLocalComplaints(nextComplaints);

  return updatedComplaint;
}

export async function getProviderComplaints(params = {}) {
  try {
    const response = await requestFirstAvailable(COMPLAINT_ENDPOINTS, (endpoint) =>
      api.get(endpoint, { params })
    );

    return unwrapList(response.data, ["complaints"]).map(normalizeProviderComplaint);
  } catch (error) {
    if (isMissingEndpointError(error)) {
      return getLocalComplaints();
    }

    throw createDisplayError(
      error,
      "تعذر تحميل الشكاوى، يرجى المحاولة مرة أخرى."
    );
  }
}

export async function getProviderComplaintById(complaintId) {
  if (isLocalId(complaintId)) {
    return getLocalComplaints().find(
      (complaint) => String(complaint.id) === String(complaintId)
    );
  }

  try {
    const response = await requestFirstAvailable(
      [`/provider/complaints/${complaintId}`, `/complaints/${complaintId}`],
      (endpoint) => api.get(endpoint)
    );

    return normalizeProviderComplaint(unwrapItem(response.data, "complaint"));
  } catch (error) {
    throw createDisplayError(
      error,
      "تعذر تحميل تفاصيل الشكوى، يرجى المحاولة مرة أخرى."
    );
  }
}

export async function replyToComplaint(complaintId, payload = {}) {
  const cleanReply = String(payload.reply || payload.response || "").trim();

  if (!cleanReply) {
    throw new Error("يرجى كتابة الرد قبل الإرسال.");
  }

  if (isLocalId(complaintId)) {
    const reply = {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };
    const nextStatus =
      payload.status && payload.status !== "all"
        ? normalizeComplaintStatus(payload.status)
        : "under_review";

    return updateLocalComplaint(complaintId, (complaint) => ({
      ...complaint,
      status: complaint.status === "resolved" ? "resolved" : nextStatus,
      updatedAt: reply.createdAt,
      providerReply: reply,
      history: [
        ...(complaint.history || []),
        createHistory("تم إرسال رد من المزود", reply.createdAt, "المزود"),
        ...(complaint.status === "pending"
          ? [createHistory("تم تغيير الحالة إلى قيد المراجعة", reply.createdAt, "المزود")]
          : []),
      ],
    }));
  }

  try {
    const response = await requestFirstAvailable(
      [
        `/provider/complaints/${complaintId}/reply`,
        `/complaints/${complaintId}/reply`,
      ],
      (endpoint) =>
        api.post(endpoint, {
          reply: cleanReply,
          response: cleanReply,
          status: payload.status,
        })
    );

    return normalizeProviderComplaint(unwrapItem(response.data, "complaint"));
  } catch (error) {
    throw createDisplayError(error, "فشل إرسال الرد، يرجى المحاولة مرة أخرى.");
  }
}

export async function updateComplaintStatus(complaintId, status) {
  const nextStatus = normalizeComplaintStatus(status);
  const statusLabel = getComplaintStatusLabel(nextStatus);

  if (isLocalId(complaintId)) {
    const now = new Date().toISOString();

    return updateLocalComplaint(complaintId, (complaint) => ({
      ...complaint,
      status: nextStatus,
      updatedAt: now,
      history: [
        ...(complaint.history || []),
        createHistory(`تم تغيير الحالة إلى ${statusLabel}`, now, "المزود"),
        ...(nextStatus === "resolved"
          ? [createHistory("تم تحديد الشكوى كمحلولة", now, "المزود")]
          : []),
      ],
    }));
  }

  try {
    const response = await requestFirstAvailable(
      [`/provider/complaints/${complaintId}`, `/complaints/${complaintId}`],
      (endpoint) => api.patch(endpoint, { status: nextStatus })
    );

    return normalizeProviderComplaint(unwrapItem(response.data, "complaint"));
  } catch (error) {
    throw createDisplayError(
      error,
      "فشل تحديث حالة الشكوى، يرجى المحاولة مرة أخرى."
    );
  }
}

export async function getComplaintHistory(complaintId) {
  if (isLocalId(complaintId)) {
    return (
      getLocalComplaints().find(
        (complaint) => String(complaint.id) === String(complaintId)
      )?.history || []
    );
  }

  try {
    const response = await requestFirstAvailable(
      [
        `/provider/complaints/${complaintId}/history`,
        `/complaints/${complaintId}/history`,
      ],
      (endpoint) => api.get(endpoint)
    );

    return unwrapList(response.data, ["history", "items"]);
  } catch (error) {
    throw createDisplayError(
      error,
      "تعذر تحميل سجل الشكوى، يرجى المحاولة مرة أخرى."
    );
  }
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

export const providerComplaintService = {
  getProviderComplaints,
  getProviderComplaintById,
  replyToComplaint,
  updateComplaintStatus,
  getComplaintHistory,
  exportProviderComplaints,
};

export default providerComplaintService;
