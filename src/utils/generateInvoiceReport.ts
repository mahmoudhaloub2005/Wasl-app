import { jsPDF } from "jspdf";

export interface InvoiceReportRecord {
  [key: string]: unknown;
  amount?: number | string | null;
  amountLabel?: string | null;
  createdAt?: string | Date | null;
  created_at?: string | Date | null;
  customer?: { name?: string | null } | null;
  customerName?: string | null;
  customer_name?: string | null;
  dueDate?: string | Date | null;
  dueDateLabel?: string | null;
  due_date?: string | Date | null;
  id?: string | number | null;
  invoiceNumber?: string | null;
  invoice_number?: string | null;
  issuedAt?: string | Date | null;
  issued_at?: string | Date | null;
  number?: string | null;
  paidAmount?: number | string | null;
  paid_amount?: number | string | null;
  status?: string | null;
  statusLabel?: string | null;
  status_text?: string | null;
  subscriber?: { name?: string | null } | null;
  subscriberName?: string | null;
  subscriber_name?: string | null;
  total?: number | string | null;
  totalAmount?: number | string | null;
  total_amount?: number | string | null;
}

export interface GenerateInvoiceReportOptions {
  generatedAt?: Date;
  invoices: InvoiceReportRecord[];
  providerName?: string;
}

interface NormalizedInvoiceReportRecord {
  amount: number;
  customerName: string;
  dueDateLabel: string;
  invoiceNumber: string;
  issuedAtLabel: string;
  paidAmount: number;
  status: string;
  statusLabel: string;
}

interface ReportSummary {
  overdueAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalAmount: number;
  totalInvoices: number;
}

export const invoiceReportMessages = {
  empty: "لا توجد فواتير متاحة لإنشاء التقرير",
  error: "تعذر إنشاء التقرير، حاول مرة أخرى",
  loading: "جاري إنشاء التقرير...",
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CANVAS_SCALE = 2;
const PAGE_MARGIN = 34;
const PAGE_BOTTOM = PAGE_HEIGHT - 58;
const FONT_FAMILY = '"Noto Sans Arabic", "Tajawal", Arial, sans-serif';
const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  overdue: "متأخرة",
  paid: "مدفوعة",
  pending: "قيد الانتظار",
};

class InvoiceReportNoDataError extends Error {
  constructor() {
    super(invoiceReportMessages.empty);
    this.name = "InvoiceReportNoDataError";
  }
}

function getFirstValue(values: unknown[], fallback = "") {
  const foundValue = values.find((value) => String(value ?? "").trim());

  return String(foundValue ?? fallback).trim();
}

function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const numericValue = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function normalizeStatus(value: unknown) {
  const status = String(value || "draft").toLowerCase();

  return ["paid", "pending", "overdue", "draft"].includes(status)
    ? status
    : "draft";
}

function formatAmount(value: number) {
  return `${new Intl.NumberFormat("en-US").format(Number(value || 0))} شيكل`;
}

function formatDisplayDate(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value || ""));

  if (Number.isNaN(date.getTime())) return "غير محدد";

  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatFileDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeInvoice(invoice: InvoiceReportRecord): NormalizedInvoiceReportRecord | null {
  if (!invoice || typeof invoice !== "object") return null;

  const amount = toNumber(
    invoice.amount ?? invoice.total ?? invoice.totalAmount ?? invoice.total_amount
  );
  const paidAmount = Math.min(
    amount,
    Math.max(0, toNumber(invoice.paidAmount ?? invoice.paid_amount))
  );
  const status = normalizeStatus(invoice.status);
  const customerName = getFirstValue(
    [
      invoice.customerName,
      invoice.customer_name,
      invoice.subscriberName,
      invoice.subscriber_name,
      invoice.customer?.name,
      invoice.subscriber?.name,
    ],
    "غير محدد"
  );
  const invoiceNumber = getFirstValue(
    [invoice.invoiceNumber, invoice.invoice_number, invoice.number, invoice.id],
    "غير محدد"
  );
  const dueDate = invoice.dueDateLabel || invoice.dueDate || invoice.due_date;
  const issuedAt = invoice.issuedAt || invoice.issued_at || invoice.createdAt || invoice.created_at;

  return {
    amount,
    customerName,
    dueDateLabel: invoice.dueDateLabel || formatDisplayDate(dueDate),
    invoiceNumber,
    issuedAtLabel: formatDisplayDate(issuedAt),
    paidAmount: status === "paid" && paidAmount === 0 ? amount : paidAmount,
    status,
    statusLabel: String(
      invoice.statusLabel || invoice.status_text || STATUS_LABELS[status] || STATUS_LABELS.draft
    ),
  };
}

function normalizeInvoices(invoices: InvoiceReportRecord[]) {
  return invoices.map(normalizeInvoice).filter(Boolean) as NormalizedInvoiceReportRecord[];
}

export function hasInvoiceReportData(invoices: InvoiceReportRecord[] = []) {
  return normalizeInvoices(invoices).length > 0;
}

function buildSummary(records: NormalizedInvoiceReportRecord[]): ReportSummary {
  return records.reduce(
    (summary, record) => {
      const remainingAmount = Math.max(0, record.amount - record.paidAmount);

      return {
        overdueAmount:
          summary.overdueAmount + (record.status === "overdue" ? remainingAmount || record.amount : 0),
        paidAmount: summary.paidAmount + (record.status === "paid" ? record.amount : record.paidAmount),
        pendingAmount:
          summary.pendingAmount +
          (["pending", "draft"].includes(record.status) ? remainingAmount || record.amount : 0),
        totalAmount: summary.totalAmount + record.amount,
        totalInvoices: summary.totalInvoices + 1,
      };
    },
    {
      overdueAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      totalAmount: 0,
      totalInvoices: 0,
    }
  );
}

function createReportCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_WIDTH * CANVAS_SCALE);
  canvas.height = Math.round(PAGE_HEIGHT * CANVAS_SCALE);

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not available.");
  }

  context.scale(CANVAS_SCALE, CANVAS_SCALE);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.direction = "rtl";
  context.textBaseline = "top";

  return { canvas, context };
}

function setFont(context: CanvasRenderingContext2D, size: number, weight = 700) {
  context.font = `${weight} ${size}px ${FONT_FAMILY}`;
}

function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: { align?: CanvasTextAlign; color?: string; size?: number; weight?: number } = {}
) {
  setFont(context, options.size || 12, options.weight || 700);
  context.fillStyle = options.color || "#111d34";
  context.textAlign = options.align || "right";
  context.fillText(text, x, y);
}

function splitLongWord(context: CanvasRenderingContext2D, word: string, maxWidth: number) {
  const chunks: string[] = [];
  let currentChunk = "";

  Array.from(word).forEach((character) => {
    const nextChunk = `${currentChunk}${character}`;

    if (currentChunk && context.measureText(nextChunk).width > maxWidth) {
      chunks.push(currentChunk);
      currentChunk = character;
      return;
    }

    currentChunk = nextChunk;
  });

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}

function getWrappedLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 2
) {
  const words = String(text || "غير محدد").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const wordParts = context.measureText(word).width > maxWidth
      ? splitLongWord(context, word, maxWidth)
      : [word];

    wordParts.forEach((wordPart) => {
      const candidate = currentLine ? `${currentLine} ${wordPart}` : wordPart;

      if (currentLine && context.measureText(candidate).width > maxWidth) {
        lines.push(currentLine);
        currentLine = wordPart;
        return;
      }

      currentLine = candidate;
    });
  });

  if (currentLine) lines.push(currentLine);

  if (lines.length <= maxLines) return lines;

  const visibleLines = lines.slice(0, maxLines);
  let lastLine = visibleLines[maxLines - 1] || "";

  while (lastLine.length > 1 && context.measureText(`${lastLine}...`).width > maxWidth) {
    lastLine = Array.from(lastLine).slice(0, -1).join("");
  }

  visibleLines[maxLines - 1] = `${lastLine}...`;

  return visibleLines;
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: { color?: string; lineHeight?: number; maxLines?: number; size?: number; weight?: number } = {}
) {
  setFont(context, options.size || 11, options.weight || 700);
  context.fillStyle = options.color || "#111d34";
  context.textAlign = "right";

  const lineHeight = options.lineHeight || 14;
  const lines = getWrappedLines(context, text, maxWidth, options.maxLines || 2);

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
  strokeStyle?: string
) {
  drawRoundedRect(context, x, y, width, height, radius);
  context.fillStyle = fillStyle;
  context.fill();

  if (strokeStyle) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = 1;
    context.stroke();
  }
}

function drawSummaryCard(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  left: number,
  top: number,
  width: number
) {
  fillRoundedRect(context, left, top, width, 52, 8, "#f7f9ff", "#dfe7f7");
  drawText(context, label, left + width - 12, top + 10, {
    color: "#5f6675",
    size: 10,
    weight: 700,
  });
  drawText(context, value, left + width - 12, top + 29, {
    color: "#00359b",
    size: 12,
    weight: 900,
  });
}

function drawFirstPageHeader(
  context: CanvasRenderingContext2D,
  options: Required<Pick<GenerateInvoiceReportOptions, "generatedAt">> &
    Pick<GenerateInvoiceReportOptions, "providerName">,
  summary: ReportSummary
) {
  drawText(context, "تقرير الفواتير المالية", PAGE_WIDTH - PAGE_MARGIN, 38, {
    color: "#00359b",
    size: 22,
    weight: 900,
  });
  drawText(
    context,
    `تاريخ إنشاء التقرير: ${formatDisplayDate(options.generatedAt)}`,
    PAGE_WIDTH - PAGE_MARGIN,
    76,
    { color: "#4f5665", size: 12, weight: 700 }
  );

  if (options.providerName) {
    drawText(context, `مزود الخدمة: ${options.providerName}`, PAGE_WIDTH - PAGE_MARGIN, 96, {
      color: "#4f5665",
      size: 12,
      weight: 700,
    });
  }

  const innerWidth = PAGE_WIDTH - PAGE_MARGIN * 2;
  const gap = 10;
  const topCardWidth = (innerWidth - gap * 2) / 3;
  const bottomCardWidth = (innerWidth - gap) / 2;
  const rightEdge = PAGE_WIDTH - PAGE_MARGIN;

  drawSummaryCard(context, "عدد الفواتير", String(summary.totalInvoices), rightEdge - topCardWidth, 128, topCardWidth);
  drawSummaryCard(context, "إجمالي الفواتير", formatAmount(summary.totalAmount), rightEdge - topCardWidth * 2 - gap, 128, topCardWidth);
  drawSummaryCard(context, "إجمالي المدفوع", formatAmount(summary.paidAmount), PAGE_MARGIN, 128, topCardWidth);
  drawSummaryCard(context, "قيد الانتظار", formatAmount(summary.pendingAmount), rightEdge - bottomCardWidth, 190, bottomCardWidth);
  drawSummaryCard(context, "المتأخر", formatAmount(summary.overdueAmount), PAGE_MARGIN, 190, bottomCardWidth);

  return 268;
}

function drawContinuationHeader(context: CanvasRenderingContext2D, generatedAt: Date) {
  drawText(context, "تقرير الفواتير المالية", PAGE_WIDTH - PAGE_MARGIN, 34, {
    color: "#00359b",
    size: 16,
    weight: 900,
  });
  drawText(context, formatDisplayDate(generatedAt), PAGE_MARGIN, 36, {
    align: "left",
    color: "#6b7280",
    size: 10,
    weight: 700,
  });

  return 84;
}

const TABLE_COLUMNS = [
  { key: "invoiceNumber", label: "رقم الفاتورة", width: 78 },
  { key: "customerName", label: "اسم العميل", width: 128 },
  { key: "amount", label: "المبلغ", width: 76 },
  { key: "issuedAtLabel", label: "تاريخ الإصدار", width: 84 },
  { key: "dueDateLabel", label: "تاريخ الاستحقاق", width: 88 },
  { key: "statusLabel", label: "الحالة", width: 70 },
] as const;

function drawTableHeader(context: CanvasRenderingContext2D, top: number) {
  const tableWidth = TABLE_COLUMNS.reduce((total, column) => total + column.width, 0);
  const tableLeft = PAGE_WIDTH - PAGE_MARGIN - tableWidth;

  fillRoundedRect(context, tableLeft, top, tableWidth, 34, 7, "#eaf1ff", "#dfe7f7");

  let rightEdge = PAGE_WIDTH - PAGE_MARGIN;
  TABLE_COLUMNS.forEach((column) => {
    const left = rightEdge - column.width;
    drawWrappedText(context, column.label, rightEdge - 8, top + 10, column.width - 16, {
      color: "#00359b",
      lineHeight: 12,
      maxLines: 1,
      size: 10,
      weight: 900,
    });
    context.strokeStyle = "#d4def2";
    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(left, top + 34);
    context.stroke();
    rightEdge = left;
  });

  return top + 34;
}

function getRecordCellValue(record: NormalizedInvoiceReportRecord, key: string) {
  if (key === "amount") return formatAmount(record.amount);

  return String(record[key as keyof NormalizedInvoiceReportRecord] || "غير محدد");
}

function drawTableRow(
  context: CanvasRenderingContext2D,
  record: NormalizedInvoiceReportRecord,
  top: number,
  index: number
) {
  const rowHeight = 44;
  const tableWidth = TABLE_COLUMNS.reduce((total, column) => total + column.width, 0);
  const tableLeft = PAGE_WIDTH - PAGE_MARGIN - tableWidth;

  context.fillStyle = index % 2 === 0 ? "#ffffff" : "#fbfcff";
  context.fillRect(tableLeft, top, tableWidth, rowHeight);
  context.strokeStyle = "#edf0f5";
  context.beginPath();
  context.moveTo(tableLeft, top + rowHeight);
  context.lineTo(tableLeft + tableWidth, top + rowHeight);
  context.stroke();

  let rightEdge = PAGE_WIDTH - PAGE_MARGIN;
  TABLE_COLUMNS.forEach((column) => {
    const left = rightEdge - column.width;
    drawWrappedText(
      context,
      getRecordCellValue(record, column.key),
      rightEdge - 8,
      top + 10,
      column.width - 16,
      {
        color: column.key === "statusLabel" ? "#00359b" : "#111d34",
        lineHeight: 12,
        maxLines: column.key === "customerName" ? 2 : 1,
        size: 9,
        weight: column.key === "invoiceNumber" || column.key === "amount" ? 900 : 700,
      }
    );
    context.strokeStyle = "#f0f3f8";
    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(left, top + rowHeight);
    context.stroke();
    rightEdge = left;
  });

  return top + rowHeight;
}

function addPageNumber(
  context: CanvasRenderingContext2D,
  pageIndex: number,
  totalPages: number
) {
  if (totalPages <= 1) return;

  drawText(context, `صفحة ${pageIndex + 1} من ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 32, {
    align: "center",
    color: "#6b7280",
    size: 10,
    weight: 700,
  });
}

function renderReportPages(
  records: NormalizedInvoiceReportRecord[],
  summary: ReportSummary,
  options: Required<Pick<GenerateInvoiceReportOptions, "generatedAt">> &
    Pick<GenerateInvoiceReportOptions, "providerName">
) {
  const pages: Array<{ canvas: HTMLCanvasElement; context: CanvasRenderingContext2D }> = [];
  let currentPage = createReportCanvas();
  let y = drawFirstPageHeader(currentPage.context, options, summary);
  y = drawTableHeader(currentPage.context, y);
  pages.push(currentPage);

  records.forEach((record, index) => {
    if (y + 44 > PAGE_BOTTOM) {
      currentPage = createReportCanvas();
      y = drawContinuationHeader(currentPage.context, options.generatedAt);
      y = drawTableHeader(currentPage.context, y);
      pages.push(currentPage);
    }

    y = drawTableRow(currentPage.context, record, y, index);
  });

  pages.forEach((page, index) => addPageNumber(page.context, index, pages.length));

  return pages.map((page) => page.canvas);
}

export function getInvoiceReportFileName(date = new Date()) {
  return `invoice-report-${formatFileDate(date)}.pdf`;
}

export async function generateInvoiceReportPdf(options: GenerateInvoiceReportOptions) {
  const generatedAt = options.generatedAt || new Date();
  const records = normalizeInvoices(options.invoices || []);

  if (!records.length) {
    throw new InvoiceReportNoDataError();
  }

  const fontReady = document.fonts?.ready;
  if (fontReady) {
    await fontReady.catch(() => undefined);
  }

  const summary = buildSummary(records);
  const canvases = renderReportPages(records, summary, {
    generatedAt,
    providerName: String(options.providerName || "").trim(),
  });
  const pdf = new jsPDF({
    compress: true,
    format: "a4",
    orientation: "portrait",
    unit: "pt",
  });

  canvases.forEach((canvas, index) => {
    if (index > 0) pdf.addPage("a4", "portrait");

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.92),
      "JPEG",
      0,
      0,
      PAGE_WIDTH,
      PAGE_HEIGHT,
      `invoice-report-page-${index}`,
      "FAST"
    );
  });

  return {
    blob: pdf.output("blob"),
    fileName: getInvoiceReportFileName(generatedAt),
    invoiceCount: records.length,
  };
}

export async function downloadInvoiceReportPdf(options: GenerateInvoiceReportOptions) {
  const report = await generateInvoiceReportPdf(options);
  const url = URL.createObjectURL(report.blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = report.fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return report;
}