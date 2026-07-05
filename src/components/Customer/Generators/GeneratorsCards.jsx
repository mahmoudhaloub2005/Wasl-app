import { useEffect, useMemo, useState } from "react";
import defaultGeneratorImage from "../../../assets/customer/images/generator-nour.png";
import smartGeneratorImage from "../../../assets/customer/images/generator-smart.png";
import workersGeneratorImage from "../../../assets/customer/images/generator-workers.png";
import { getGenerators } from "../../../services/generatorService";
import GeneratorCard from "./GeneratorCard";

const designFallbackGenerators = [
  {
    id: "design-nour",
    image: defaultGeneratorImage,
    name: "مولد النور",
    location: "دير البلح",
    price: 25000,
    priceText: "د.ع 25,000",
    capacity: "450A",
    rating: 5,
    statusType: "working",
    statusLabel: "يعمل الآن",
  },
  {
    id: "design-smart",
    image: smartGeneratorImage,
    name: "مولد الرشيد الذكي",
    location: "دير البلح",
    price: 18500,
    priceText: "د.ع 18,500",
    capacity: "450A",
    rating: 3,
    statusType: "working",
    statusLabel: "يعمل الآن",
  },
  {
    id: "design-wafideen",
    image: workersGeneratorImage,
    name: "مولد الوافدين",
    location: "دير البلح",
    price: 18500,
    priceText: "د.ع 18,500",
    capacity: "450A",
    rating: 1,
    statusType: "maintenance",
    statusLabel: "تحت الصيانة",
  },
];

function GeneratorsCards({
  generatorName = "",
  area = "",
  priceRange = "all",
  selectedStatus = "all",
}) {
  const [generators, setGenerators] = useState(designFallbackGenerators);
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
          const normalizedGenerators = list.map(normalizeGenerator);
          setGenerators(fillDesignGrid(normalizedGenerators));
        }
      } catch (error) {
        console.error("Generators Error:", error);

        if (isMounted) {
          setGenerators(designFallbackGenerators);
          setErrorMessage("");
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

function fillDesignGrid(apiGenerators) {
  if (apiGenerators.length >= 3) {
    return apiGenerators;
  }

  const existingIds = new Set(apiGenerators.map((generator) => generator.id));
  const missingGenerators = designFallbackGenerators.filter(
    (generator) => !existingIds.has(generator.id)
  );

  return [...apiGenerators, ...missingGenerators].slice(0, 3);
}

function normalizeGenerator(generator) {
  const provider = generator.provider || generator.user || {};
  const area = generator.area || generator.location || {};
  const rawStatus = String(generator.status || "active").toLowerCase();
  const rawPrice = generator.price_KW ?? generator.priceKW ?? generator.price;
  const numericPrice = Number(String(rawPrice || "").replace(/,/g, "")) || 0;
  const displayPrice = numericPrice > 0 ? numericPrice : 25000;
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
      "دير البلح",
    price: displayPrice,
    priceText: `د.ع ${formatNumber(displayPrice)}`,
    capacity: power ? `${power} KW` : "450A",
    rating: generator.rating_avg || generator.rating || generator.rate || 0,
    statusType,
    statusLabel: statusType === "maintenance" ? "تحت الصيانة" : "يعمل الآن",
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default GeneratorsCards;
