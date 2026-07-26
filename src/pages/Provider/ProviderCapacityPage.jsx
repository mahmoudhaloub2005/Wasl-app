import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CapacityEmptyState from "../../components/Provider/finance/capacity/CapacityEmptyState";
import CapacityFilters from "../../components/Provider/finance/capacity/CapacityFilters";
import CapacitySummaryCard from "../../components/Provider/finance/capacity/CapacitySummaryCard";
import GeneratorCapacityDetailsModal from "../../components/Provider/finance/capacity/GeneratorCapacityDetailsModal";
import GeneratorCapacityRow from "../../components/Provider/finance/capacity/GeneratorCapacityRow";
import {
  buildCapacitySummary,
  filterCapacityRecords,
  normalizeCapacityRecord,
} from "../../components/Provider/finance/capacity/capacityUtils";
import FinanceHeader from "../../components/Provider/finance/FinanceHeader";
import ProviderFinanceLayout from "../../components/Provider/finance/ProviderFinanceLayout";
import useProviderFinance from "../../hooks/useProviderFinance";
import "./ProviderFinance.css";

function ProviderCapacityPage() {
  const navigate = useNavigate();
  const finance = useProviderFinance();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const records = useMemo(
    () => finance.capacity.map(normalizeCapacityRecord),
    [finance.capacity]
  );
  const summaryCards = useMemo(() => buildCapacitySummary(records), [records]);
  const filteredRecords = useMemo(
    () =>
      filterCapacityRecords(records, {
        capacityFilter,
        searchQuery,
        statusFilter,
      }),
    [capacityFilter, records, searchQuery, statusFilter]
  );
  const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== "all" || capacityFilter !== "all";

  const closeDetailsModal = useCallback(() => {
    setSelectedRecord(null);
  }, []);

  return (
    <ProviderFinanceLayout>
      <FinanceHeader
        backLabel="العودة إلى الإدارة المالية"
        description="متابعة الأحمال والطاقة المتاحة لكل مولد"
        onBack={() => navigate("/provider/finance")}
        showBack
        title="سعة استهلاك المشتركين"
      />

      <section className="capacity-summary" aria-label="ملخص سعة استهلاك المشتركين">
        <div className="capacity-summary__grid">
          {summaryCards.map((card) => (
            <CapacitySummaryCard
              card={card}
              isLoading={finance.isCapacityLoading}
              key={card.id}
            />
          ))}
        </div>
      </section>

      <CapacityFilters
        capacityFilter={capacityFilter}
        onCapacityFilterChange={setCapacityFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />

      {finance.isCapacityLoading ? (
        <section className="capacity-list capacity-list--loading" aria-label="جاري تحميل بيانات السعة">
          {Array.from({ length: 4 }).map((_, index) => (
            <article className="generator-capacity-row generator-capacity-row--loading" key={index}>
              {Array.from({ length: 9 }).map((__, cellIndex) => (
                <span key={cellIndex} />
              ))}
            </article>
          ))}
        </section>
      ) : filteredRecords.length ? (
        <section className="capacity-list" aria-label="بيانات سعة المولدات">
          {filteredRecords.map((record) => (
            <GeneratorCapacityRow
              key={record.id}
              onDetails={setSelectedRecord}
              record={record}
            />
          ))}
        </section>
      ) : (
        <CapacityEmptyState isFiltered={hasActiveFilters && records.length > 0} />
      )}

      <GeneratorCapacityDetailsModal
        onClose={closeDetailsModal}
        record={selectedRecord}
      />
    </ProviderFinanceLayout>
  );
}

export default ProviderCapacityPage;
