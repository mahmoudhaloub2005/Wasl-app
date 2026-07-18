import { useNavigate } from "react-router-dom";

import CreateInvoiceModal from "../../components/Provider/finance/CreateInvoiceModal";
import FinanceHeader from "../../components/Provider/finance/FinanceHeader";
import FinancialAdvancedFilterPanel from "../../components/Provider/finance/FinancialAdvancedFilterPanel";
import FinancialInvoicesToolbar from "../../components/Provider/finance/FinancialInvoicesToolbar";
import FinancialRecordsTable from "../../components/Provider/finance/FinancialRecordsTable";
import FinancialSummaryCards from "../../components/Provider/finance/FinancialSummaryCards";
import ProviderFinanceLayout from "../../components/Provider/finance/ProviderFinanceLayout";
import useProviderFinance from "../../hooks/useProviderFinance";
import "./ProviderFinance.css";

function ProviderInvoices() {
  const navigate = useNavigate();
  const finance = useProviderFinance({ invoicesOnly: true });

  function handleViewInvoice(invoice) {
    const path = finance.viewInvoice(invoice);

    if (path) {
      navigate(path);
    }
  }

  return (
    <ProviderFinanceLayout>
      <FinanceHeader
        actionLabel="إنشاء فاتورة جديدة"
        description="نظرة عامة شاملة على جميع العمليات المالية والمستحقات"
        onAction={finance.openCreateInvoiceModal}
        onBack={() => navigate("/provider/finance")}
        showBack
        title="إدارة الفواتير"
      />

      {finance.errorMessage && (
        <div className="provider-finance__error" role="alert">
          {finance.errorMessage}
        </div>
      )}

      <FinancialSummaryCards
        ariaLabel="إحصائيات الفواتير"
        cards={finance.invoiceSummaryCards}
        isLoading={finance.isLoading}
      />

      <FinancialInvoicesToolbar
        isAdvancedFilterOpen={finance.isAdvancedFilterOpen}
        onAdvancedFilterToggle={finance.toggleAdvancedFilter}
        onSearchChange={finance.setSearchQuery}
        onStatusChange={finance.setSelectedStatus}
        searchQuery={finance.searchQuery}
        selectedStatus={finance.selectedStatus}
      />

      <FinancialAdvancedFilterPanel isOpen={finance.isAdvancedFilterOpen} />

      <FinancialRecordsTable
        currentPage={finance.currentPage}
        emptyMessage="لا توجد فواتير حتى الآن"
        invoices={finance.paginatedInvoices}
        loading={finance.isLoading}
        onDownloadInvoice={finance.downloadInvoice}
        onPageChange={finance.setInvoicePage}
        onViewInvoice={handleViewInvoice}
        pageSize={finance.pageSize}
        title="إدارة الفواتير"
        totalCount={finance.totalInvoices}
        totalPages={finance.totalPages}
        variant="invoices"
      />

      <CreateInvoiceModal
        isOpen={finance.isCreateInvoiceModalOpen}
        onClose={finance.closeCreateInvoiceModal}
        onCreated={finance.refreshInvoices}
      />
    </ProviderFinanceLayout>
  );
}

export default ProviderInvoices;


