function GeneratorsHeader({ onOpenCompare }) {
  return (
    <section className="customer-generators-header">
      <div className="customer-generators-title">
        <h1>المولدات</h1>

        <p>
          استعرض المولدات المتوفرة في منطقتك وقارن الأسعار والخدمات لاتخاذ أفضل
          قرار.
        </p>
      </div>

      <button type="button" className="compare-button" onClick={onOpenCompare}>
        قارن
      </button>
    </section>
  );
}

export default GeneratorsHeader;
