import { useNavigate } from "react-router-dom";

import FinanceHeader from "../../components/Provider/finance/FinanceHeader";
import FinanceQuickAccess from "../../components/Provider/finance/FinanceQuickAccess";
import FinancialRecordsTable from "../../components/Provider/finance/FinancialRecordsTable";
import FinancialSummaryCards from "../../components/Provider/finance/FinancialSummaryCards";
import ProviderFinanceLayout from "../../components/Provider/finance/ProviderFinanceLayout";
import SubscriberCapacityCard from "../../components/Provider/finance/SubscriberCapacityCard";
import useProviderFinance from "../../hooks/useProviderFinance";
import { getProviderDisplayName } from "../../utils/providerUserProfile";
import "./ProviderFinance.css";

function ProviderFinance() {
  const navigate = useNavigate();
  const finance = useProviderFinance();
  const providerName = getProviderDisplayName();

  function goTo(path) {
    navigate(path);
  }

  function handleViewRecord(invoice) {
    const path = finance.viewInvoice(invoice);

    if (path) {
      navigate(path);
    }
  }

  return (
    <ProviderFinanceLayout>
      <FinanceHeader
        title="الإدارة المالية"
        description="مرحباً بك في مركز التحكم المالي لمولدك"
      />

      {finance.errorMessage && (
        <div className="provider-finance__error" role="alert">
          {finance.errorMessage}
        </div>
      )}


      <FinancialSummaryCards
        isLoading={finance.isLoading}
        showEmptyMessage={!finance.dashboardSummary?.hasFinancialData}
        summary={finance.dashboardSummary}
      />

      <FinanceQuickAccess
        invoices={finance.invoices}
        items={finance.quickAccessItems}
        onNavigate={goTo}
        providerName={providerName}
      />

      <section className="provider-finance__details">
        <FinancialRecordsTable
          currentPage={1}
          emptyMessage="لا توجد معاملات مالية لعرضها حالياً."
          invoices={finance.dashboardRecords}
          loading={finance.isLoading}
          onDownloadInvoice={finance.downloadInvoice}
          onPageChange={() => {}}
          onViewInvoice={handleViewRecord}
          pageSize={4}
          showPagination={false}
          title="سجل المعاملات"
          totalCount={finance.dashboardRecords.length}
          totalPages={1}
          variant="dashboard"
        />

        <SubscriberCapacityCard
          capacity={finance.capacity}
          isLoading={finance.isCapacityLoading}
          onNavigate={goTo}
        />
      </section>
    </ProviderFinanceLayout>
  );
}

export default ProviderFinance;

