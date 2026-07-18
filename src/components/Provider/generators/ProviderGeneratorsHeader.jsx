function ProviderGeneratorsHeader({ onAddGenerator }) {
  return (
    <section
      className="provider-generators-header"
      aria-labelledby="provider-generators-title"
    >
      <div className="provider-generators-header__text">
        <h1 id="provider-generators-title">إدارة المولدات والأسعار</h1>
        <p>متابعة حالة المولدات الحالية وتعديل معايير الخدمة</p>
      </div>

      <button
        type="button"
        className="provider-generators-header__add"
        onClick={onAddGenerator}
      >
        إضافة مولد جديد
      </button>
    </section>
  );
}

export default ProviderGeneratorsHeader;
