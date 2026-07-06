function CompareResult({ generators = [], selectedIds, onChangeSelection }) {
  const selectedGenerators = selectedIds
    .map((id) =>
      generators.find((generator) => String(generator.id) === String(id))
    )
    .filter(Boolean);

  if (selectedGenerators.length !== 2) {
    return null;
  }

  return (
    <section className="compare-result-section">
      <div className="compare-result-header">
        <div>
          <h2>نتيجة المقارنة</h2>
          <p>راجع الفروقات بين المولدات المختارة قبل اتخاذ القرار.</p>
        </div>

        <button type="button" onClick={onChangeSelection}>
          تغيير الاختيار
        </button>
      </div>

      <div className="compare-result-grid">
        {selectedGenerators.map((generator) => (
          <article className="compare-result-card" key={generator.id}>
            <img src={generator.image} alt={generator.name} />

            <h3>{generator.name}</h3>
            <p>{generator.location}</p>

            <dl>
              <div>
                <dt>السعر</dt>
                <dd>{generator.priceText}</dd>
              </div>

              <div>
                <dt>القدرة</dt>
                <dd>{generator.capacity}</dd>
              </div>

              <div>
                <dt>الحالة</dt>
                <dd>{generator.status}</dd>
              </div>

              <div>
                <dt>التقييم</dt>
                <dd>{generator.rating}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CompareResult;
