import { useCallback, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;
const knownStatuses = ["paid", "pending", "overdue", "draft"];

const initialFinanceState = {
  capacity: [],
  records: [],
  summary: null,
};

const statusLabels = {
  draft: "مسودة",
  overdue: "متأخرة",
  paid: "مدفوعة",
  pending: "قيد الانتظار",
};

function normalizeStatus(value) {
  return knownStatuses.includes(value) ? value : "draft";
}

function buildInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => Array.from(part)[0]).join(" ") || "؟";
}

function getInvoiceNumber(record) {
  return (
    record.invoiceNumber ||
    record.invoice_number ||
    record.number ||
    record.code ||
    ""
  );
}

function normalizeInvoiceRecord(record = {}, index = 0) {
  const customerName = record.customerName || record.customer_name || "";
  const status = normalizeStatus(record.status);
  const invoiceNumber = getInvoiceNumber(record);
  const id = String(
    record.id || record.invoiceId || record.invoice_id || invoiceNumber || `invoice-${index}`
  );

  return {
    ...record,
    amount: Number(record.amount || 0),
    customerName,
    dueDate: record.dueDate || record.due_date || record.date || "",
    dueDateLabel: record.dueDateLabel || record.due_date_label || "",
    id,
    initials: record.initials || buildInitials(customerName),
    invoiceNumber,
    path: record.path || `/provider/finance/invoices/${encodeURIComponent(id)}`,
    status,
    statusLabel: statusLabels[status],
  };
}

function buildStats(records) {
  return records.reduce(
    (stats, record) => {
      const status = normalizeStatus(record.status);

      return {
        ...stats,
        [status]: stats[status] + 1,
        total: stats.total + 1,
      };
    },
    { draft: 0, overdue: 0, paid: 0, pending: 0, total: 0 }
  );
}

function buildInvoiceSummaryCards(stats) {
  return [
    {
      id: "total-invoices",
      iconKey: "file",
      label: "إجمالي الفواتير",
      tone: "blue",
      value: stats.total,
      variant: "invoice",
    },
    {
      id: "pending-invoices",
      iconKey: "clipboard",
      label: "في انتظار الدفع",
      tone: "orange",
      value: stats.pending,
      variant: "invoice",
    },
    {
      id: "paid-invoices",
      iconKey: "check",
      label: "المدفوعة",
      tone: "green",
      value: stats.paid,
      variant: "invoice",
    },
    {
      id: "overdue-invoices",
      iconKey: "alert",
      label: "المتأخرة",
      tone: "red",
      value: stats.overdue,
      valueTone: "red",
      variant: "invoice",
    },
  ];
}

function invoiceMatchesSearch(invoice, query) {
  if (!query) return true;

  const searchableText = `${invoice.invoiceNumber} ${invoice.customerName}`.toLowerCase();

  return searchableText.includes(query.toLowerCase());
}

function buildDashboardSummary(summary, records) {
  return {
    ...summary,
    hasFinancialData: summary?.hasFinancialData || records.length > 0,
    yearlyRevenue: summary?.yearlyRevenue || summary?.weeklyRevenue || 0,
    yearlyRevenueChange: summary?.yearlyRevenueChange ?? summary?.weeklyRevenueChange,
  };
}

function buildQuickAccessItems(summary) {
  const pendingPaymentsCount = summary?.pendingPaymentsCount || 0;

  return [
    {
      id: "invoices",
      buttonLabel: "إدارة الفواتير",
      description: "إنشاء ومراجعة فواتير المشتركين والمستحقات",
      iconKey: "receipt",
      path: "/provider/finance/invoices",
      title: "الفواتير",
      tone: "blue",
    },
    {
      id: "payments",
      buttonLabel: pendingPaymentsCount
        ? `مراجعة ${pendingPaymentsCount} دفعات`
        : "عرض المدفوعات",
      description: "متابعة المدفوعات وسندات القبض وحالات التحقق",
      iconKey: "shield",
      path: "/provider/finance/payments",
      title: "المدفوعات",
      tone: "orange",
    },
    {
      id: "reports",
      buttonLabel: "تقرير الشهر جاهز",
      description: "استخراج التقارير بصيغة PDF وجداول",
      iconKey: "chart",
      path: "/provider/finance/reports",
      title: "التقارير المالية",
      tone: "blue",
    },
  ];
}

export function useProviderFinance() {
  const [financeState] = useState(initialFinanceState);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoices = useMemo(() => {
    return financeState.records.map(normalizeInvoiceRecord);
  }, [financeState.records]);

  const dashboardSummary = useMemo(
    () => buildDashboardSummary(financeState.summary, invoices),
    [financeState.summary, invoices]
  );

  const quickAccessItems = useMemo(
    () => buildQuickAccessItems(dashboardSummary),
    [dashboardSummary]
  );

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const matchesStatus =
          selectedStatus === "all" || invoice.status === selectedStatus;

        return matchesStatus && invoiceMatchesSearch(invoice, searchQuery.trim());
      }),
    [invoices, searchQuery, selectedStatus]
  );

  const stats = useMemo(() => buildStats(invoices), [invoices]);
  const invoiceSummaryCards = useMemo(() => buildInvoiceSummaryCards(stats), [stats]);
  const totalInvoices = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalInvoices / pageSize));
  const canPaginateLocally = filteredInvoices.length > pageSize;
  const paginatedInvoices = canPaginateLocally
    ? filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredInvoices;
  const dashboardRecords = invoices.slice(0, 4);

  const setInvoicePage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const openCreateInvoiceModal = useCallback(() => {
    setIsCreateInvoiceModalOpen(true);
  }, []);

  const closeCreateInvoiceModal = useCallback(() => {
    setIsCreateInvoiceModalOpen(false);
  }, []);

  const toggleAdvancedFilter = useCallback(() => {
    setIsAdvancedFilterOpen((isOpen) => !isOpen);
  }, []);

  const viewInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);

    return invoice.path;
  }, []);

  const clearSelectedInvoice = useCallback(() => {
    setSelectedInvoice(null);
  }, []);

  const downloadInvoice = useCallback(() => false, []);
  const refreshInvoices = useCallback(() => false, []);

  return {
    capacity: financeState.capacity,
    clearSelectedInvoice,
    closeCreateInvoiceModal,
    currentPage,
    dashboardRecords,
    dashboardSummary,
    downloadInvoice,
    errorMessage: "",
    filteredInvoices,
    invoiceSummaryCards,
    invoices,
    isAdvancedFilterOpen,
    isCreateInvoiceModalOpen,
    isLoading: false,
    isUsingDemoInvoices: false,
    openCreateInvoiceModal,
    pageSize,
    paginatedInvoices,
    quickAccessItems,
    refreshInvoices,
    searchQuery,
    selectedInvoice,
    selectedStatus,
    setInvoicePage,
    setSearchQuery,
    setSelectedStatus,
    summary: financeState.summary,
    toggleAdvancedFilter,
    totalInvoices,
    totalPages,
    viewInvoice,
  };
}

export default useProviderFinance;