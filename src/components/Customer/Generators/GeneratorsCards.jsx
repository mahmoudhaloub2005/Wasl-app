import { useMemo, useState } from "react";
import GeneratorCard from "./GeneratorCard";

function GeneratorsCards({ generators = [], loading = false }) {
  const [showAll, setShowAll] = useState(false);

  const sortedGenerators = useMemo(() => {
    return [...generators].sort((a, b) => {
      if (a.isPinnedAhliElectricity) return -1;
      if (b.isPinnedAhliElectricity) return 1;

      return Number(b.id || 0) - Number(a.id || 0);
    });
  }, [generators]);

  const visibleGenerators = showAll
    ? sortedGenerators
    : sortedGenerators.slice(0, 3);

  if (loading) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>جاري تحميل المولدات...</h3>
          <p>نحضّر البيانات من الخادم.</p>
        </div>
      </section>
    );
  }

  if (!sortedGenerators.length) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>لا توجد مولدات حالياً</h3>
          <p>عند إضافة مزودين جدد ستظهر المولدات هنا.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="generators-cards-list">
        {visibleGenerators.map((generator) => (
          <GeneratorCard
            key={generator.id}
            id={generator.id}
            image={generator.image}
            name={generator.name}
            generatorName={generator.generatorName}
            generatorType={generator.generatorType}
            area={generator.location || generator.area}
            price={generator.priceText}
            load={generator.capacity}
            rating={generator.rating}
            status={generator.status}
            statusType={generator.statusType}
          />
        ))}
      </section>

      {sortedGenerators.length > 3 && (
        <div className="generators-show-more-wrap">
          <button
            type="button"
            className="generators-show-more-button"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "عرض أقل" : "عرض الكل"}
          </button>
        </div>
      )}
    </>
  );
}

export default GeneratorsCards;