import { useCallback, useEffect, useMemo, useState } from "react";

import providerFinanceService from "../services/providerFinanceService";
import { subscribeProviderDemoStore } from "../services/providerDemoStore";
import { getStoredToken } from "../utils/authStorage";

const DEFAULT_PAGE_SIZE = 10;
const knownStatuses = ["paid", "pending", "overdue", "draft"];

const initialFinanceState = {
  capacity: [],
  records: [],
  summary: null,
};

const invoicesConnectionErrorMessage = "تعذر الاتصال بالخادم وتحميل الفواتير";
const invoicesLoginRequiredMessage =
  "يجب تسجيل الدخول بحساب مزود خدمة حقيقي لعرض الفواتير";

const statusLabels = {
  draft: "مسودة",
  overdue: "متأخرة",
  paid: "مدفوعة",
  pending: "قيد الانتظار",
};

function getErrorMessage(error) {
  return (
    error?.message ||
    "تعذر تحميل بيانات الإدارة المالية. تأكد من توفر الخادم أو حاول مرة أخرى."
  );
}

function getInvoicesErrorMessage(error) {
  const status = error?.response?.status || error?.status;

  if (status === 403) {
    return "لا تملك صلاحية الوصول إلى الفواتير";
  }

  if (status >= 500) {
    return "خطأ في الخادم أثناء تحميل الفواتير";
  }

  if (
    status === 404 ||
    status === 405 ||
    error?.code === "ERR_NETWORK" ||
    error?.code === "PROVIDER_INVOICES_ENDPOINT_MISSING"
  ) {
    return invoicesConnectionErrorMessage;
  }

  return error?.displayMessage || error?.message || invoicesConnectionErrorMessage;
}

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

function sumPaidRecordsForCurrentYear(records) {
  const currentYear = new Date().getFullYear();

  return records
    .filter((record) => record.status === "paid")
    .filter((record) => {
      const date = new Date(record.dueDate || "");

      return !Number.isNaN(date.getTime()) && date.getFullYear() === currentYear;
    })
    .reduce((total, record) => total + Number(record.amount || 0), 0);
}

function buildDashboardSummary(summary, records) {
  const yearlyRevenue = sumPaidRecordsForCurrentYear(records);

  return {
    ...summary,
    hasFinancialData: summary?.hasFinancialData || records.length > 0,
    yearlyRevenue: yearlyRevenue || summary?.yearlyRevenue || summary?.weeklyRevenue || 0,
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
      buttonLabel: "عرض التقارير",
      description: "الوصول إلى تقارير الأداء المالي والملخصات الدورية",
      iconKey: "chart",
      path: "/provider/finance/reports",
      title: "التقارير المالية",
      tone: "blue",
    },
  ];
}

function resolveProviderFinanceOptions(options) {
  if (options?.getProviderFinancialSummary) {
    return {
      financeService: options,
      invoicesOnly: false,
    };
  }

  return {
    financeService: options?.financeService || providerFinanceService,
    invoicesOnly: options?.invoicesOnly === true,
  };
}

export function useProviderFinance(options = {}) {
  const { financeService, invoicesOnly } = resolveProviderFinanceOptions(options);
  const [financeState, setFinanceState] = useState(initialFinanceState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    if (invoicesOnly) return undefined;

    return subscribeProviderDemoStore(() => {
      setStoreVersion((currentVersion) => currentVersion + 1);
    });
  }, [invoicesOnly]);

  useEffect(() => {
    let isMounted = true;

    async function loadFinanceData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (invoicesOnly) {
          if (!getStoredToken()) {
            if (isMounted) {
              setFinanceState(initialFinanceState);
              setErrorMessage(invoicesLoginRequiredMessage);
            }

            return;
          }

          const records = await financeService.getProviderInvoices();

          if (isMounted) {
            setFinanceState({
              capacity: [],
              records: Array.isArray(records) ? records : [],
              summary: null,
            });
          }

          return;
        }

        const [summary, records, capacity] = await Promise.all([
          financeService.getProviderFinancialSummary(),
          financeService.getProviderFinancialRecords(),
          financeService.getProviderGeneratorCapacity(),
        ]);

        if (isMounted) {
          setFinanceState({ capacity, records, summary });
        }
      } catch (error) {
        if (isMounted) {
          setFinanceState(initialFinanceState);
          setErrorMessage(
            invoicesOnly ? getInvoicesErrorMessage(error) : getErrorMessage(error)
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFinanceData();

    return () => {
      isMounted = false;
    };
  }, [financeService, invoicesOnly, storeVersion]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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

  const refreshInvoices = useCallback(() => {
    setStoreVersion((currentVersion) => currentVersion + 1);
  }, []);

  return {
    capacity: financeState.capacity,
    clearSelectedInvoice,
    closeCreateInvoiceModal,
    currentPage,
    dashboardRecords,
    dashboardSummary,
    downloadInvoice,
    errorMessage,
    filteredInvoices,
    invoiceSummaryCards,
    invoices,
    isAdvancedFilterOpen,
    isCreateInvoiceModalOpen,
    isLoading,
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


