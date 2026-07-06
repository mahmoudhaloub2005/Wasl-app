import { useMemo } from "react";
import GeneratorCard from "./GeneratorCard";

function GeneratorsCards({
  generators = [],
  generatorName = "",
  area = "",
  priceRange = "all",
  selectedStatus = "all",
  loading = false,
}) {
  const filteredGenerators = useMemo(() => {
    const nameQuery = generatorName.trim().toLowerCase();
    const areaQuery = area.trim().toLowerCase();

    return generators.filter((generator) => {
      const matchesName = String(generator.name || "")
        .toLowerCase()
        .includes(nameQuery);
      const matchesArea = String(generator.location || "")
        .toLowerCase()
        .includes(areaQuery);
      const matchesStatus =
        selectedStatus === "all" || generator.statusType === selectedStatus;

      let matchesPrice = true;

      if (priceRange === "low") {
        matchesPrice = generator.priceValue < 20000;
      }

      if (priceRange === "high") {
        matchesPrice = generator.priceValue >= 20000;
      }

      return matchesName && matchesArea && matchesStatus && matchesPrice;
    });
  }, [generators, generatorName, area, priceRange, selectedStatus]);

  if (loading) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>جاري تحميل المولدات...</h3>
          <p>نحضّر قائمة المولدات المتاحة من الخادم.</p>
        </div>
      </section>
    );
  }

  if (filteredGenerators.length === 0) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>لا توجد نتائج مطابقة</h3>
          <p>جرب تغيير اسم المولد أو المنطقة أو حالة التشغيل.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="generators-cards-list">
      {filteredGenerators.map((generator) => (
        <GeneratorCard
          key={generator.id}
          id={generator.id}
          image={generator.image}
          name={generator.name}
          area={generator.location}
          price={generator.priceText}
          load={generator.capacity}
          rating={Number(generator.rating) || 0}
          status={generator.status}
          statusType={generator.statusType}
        />
      ))}
    </section>
  );
}

export default GeneratorsCards;
