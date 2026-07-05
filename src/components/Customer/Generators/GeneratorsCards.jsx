import { useEffect, useMemo, useState } from "react";
import defaultGeneratorImage from "../../../assets/customer/images/generator-nour.png";
import { getGenerators } from "../../../services/generatorService";
import GeneratorCard from "./GeneratorCard";

function GeneratorsCards({
  generatorName = "",
  area = "",
  priceRange = "all",
  selectedStatus = "all",
}) {
  const [generators, setGenerators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGenerators() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getGenerators();
        const list = Array.isArray(data)
          ? data
          : data.data || data.generators || data.results || [];

        if (isMounted) {
          setGenerators(list.map(normalizeGenerator));
        }
      } catch (error) {
        console.error("Generators Error:", error);

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
              "تعذر تحميل المولدات حاليا، حاول مرة أخرى."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGenerators();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGenerators = useMemo(() => {
    const nameQuery = generatorName.trim().toLowerCase();
    const areaQuery = area.trim().toLowerCase();

    return generators.filter((generator) => {
      const matchesName = generator.name.toLowerCase().includes(nameQuery);
      const matchesArea = generator.location.toLowerCase().includes(areaQuery);
      const matchesStatus =
        selectedStatus === "all" || generator.statusType === selectedStatus;

      let matchesPrice = true;

      if (priceRange === "low") {
        matchesPrice = generator.price < 20000;
      }

      if (priceRange === "high") {
        matchesPrice = generator.price >= 20000;
      }

      return matchesName && matchesArea && matchesStatus && matchesPrice;
    });
  }, [generators, generatorName, area, priceRange, selectedStatus]);

  if (isLoading) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>جاري تحميل المولدات...</h3>
          <p>نجهز لك قائمة المولدات المتاحة.</p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>حدث خطأ</h3>
          <p>{errorMessage}</p>
        </div>
      </section>
    );
  }

  if (generators.length === 0) {
    return (
      <section className="generators-cards-list">
        <div className="empty-generators">
          <h3>لا توجد مولدات متاحة حاليا</h3>
          <p>ستظهر المولدات هنا بعد إضافتها من المزودين.</p>
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
          status={generator.statusLabel}
          statusType={generator.statusType}
        />
      ))}
    </section>
  );
}

function normalizeGenerator(generator) {
  const provider = generator.provider || generator.user || {};
  const area = generator.area || generator.location || {};
  const rawStatus = String(generator.status || "active").toLowerCase();
  const rawPrice = generator.price_KW ?? generator.priceKW ?? generator.price ?? 0;
  const price = Number(String(rawPrice).replace(/,/g, "")) || 0;
  const power = generator.powerKW ?? generator.power_kw ?? generator.capacity;
  const statusType = rawStatus === "maintenance" ? "maintenance" : "working";

  return {
    id: generator.id,
    image: generator.image_url || generator.image || defaultGeneratorImage,
    name:
      generator.name ||
      generator.type ||
      provider.company_name ||
      provider.name ||
      "مولد كهربائي",
    location:
      area.name ||
      generator.area_name ||
      generator.location ||
      generator.address ||
      "غير محدد",
    price,
    priceText: `${rawPrice || 0} شيكل / كيلو واط`,
    capacity: power ? `${power} KW` : "غير محدد",
    rating: generator.rating_avg || generator.rating || generator.rate || 0,
    status: rawStatus,
    statusType,
    statusLabel: statusType === "maintenance" ? "صيانة" : "يعمل",
  };
}

export default GeneratorsCards;
