import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function buildPaginationItems(totalPages) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return [1, 2, 3, "ellipsis", totalPages];
}

function FinancialPagination({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
}) {
  const displayStart = totalCount ? (currentPage - 1) * pageSize + 1 : 0;
  const displayEnd = totalCount
    ? Math.min(currentPage * pageSize, totalCount)
    : 0;

  return (
    <footer className="financial-records-pagination">
      <p>
        عرض {displayStart}-{displayEnd} من أصل{" "}
        {new Intl.NumberFormat("en-US").format(totalCount)} فاتورة
      </p>

      <div
        className="financial-records-pagination__pages"
        aria-label="صفحات الفواتير"
      >
        <button
          type="button"
          aria-label="الصفحة السابقة"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FiChevronLeft aria-hidden="true" />
        </button>

        {buildPaginationItems(totalPages).map((item) =>
          item === "ellipsis" ? (
            <span
              className="financial-records-pagination__ellipsis"
              key="ellipsis"
            >
              ...
            </span>
          ) : (
            <button
              type="button"
              className={currentPage === item ? "active" : undefined}
              key={item}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="الصفحة التالية"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}

export default FinancialPagination;
