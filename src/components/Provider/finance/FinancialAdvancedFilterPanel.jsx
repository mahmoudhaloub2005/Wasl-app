function FinancialAdvancedFilterPanel({ isOpen }) {
  if (!isOpen) return null;

  return (
    <section className="financial-advanced-filter-panel" role="status">
      <strong>تصفية متقدمة</strong>
      <p>
        لوحة التصفية المتقدمة محفوظة كحالة React مستقلة، بانتظار Frame الخاص
        بتفاصيلها من Figma.
      </p>
    </section>
  );
}

export default FinancialAdvancedFilterPanel;
