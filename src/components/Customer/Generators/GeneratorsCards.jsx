import { useEffect, useMemo, useState } from "react";
import GeneratorCard from "./GeneratorCard";
import { getGenerators } from "../../../data/generatorsStorage";

function GeneratorsCards({
  generatorName = "",
  area = "",
  priceRange = "all",
  selectedStatus = "all",
}) {
  const [generators, setGenerators] = useState([]);

  useEffect(() => {
    setGenerators(getGenerators());
  }, []);

  const filteredGenerators = useMemo(() => {
    return generators.filter((generator) => {
      const generatorPrice = Number(generator.price) || 0;

      const matchesName = generator.name
        ?.toLowerCase()
        .includes(generatorName.trim().toLowerCase());

      const matchesArea = generator.location
        ?.toLowerCase()
        .includes(area.trim().toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || generator.status === selectedStatus;

      let matchesPrice = true;

      if (priceRange === "low") {
        matchesPrice = generatorPrice <= 50;
      }

      if (priceRange === "medium") {
        matchesPrice = generatorPrice > 50 && generatorPrice <= 100;
      }

      if (priceRange === "high") {
        matchesPrice = generatorPrice > 100;
      }

      return matchesName && matchesArea && matchesStatus && matchesPrice;
    });
  }, [generators, generatorName, area, priceRange, selectedStatus]);

  if (generators.length === 0) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>لا توجد مولدات متاحة حالياً</h3>
          <p>ستظهر المولدات هنا بعد أن يقوم المزود بإضافة مولد جديد.</p>
        </div>
      </section>
    );
  }

  if (filteredGenerators.length === 0) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>لا توجد نتائج مطابقة</h3>
          <p>جرّب تغيير اسم المولد أو المنطقة أو حالة التشغيل.</p>
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
          price={`${generator.price} ${generator.currency}`}
          load={generator.capacity}
          rating={Number(generator.rating) || 0}
          status={generator.status}
          statusType={
            generator.status === "تحت الصيانة" ? "maintenance" : "working"
          }
        />
      ))}
    </section>
  );
}

export default GeneratorsCards;