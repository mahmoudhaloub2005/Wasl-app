import { useEffect, useMemo, useState } from "react";
import { IoCloseOutline, IoInformationCircleOutline } from "react-icons/io5";
import defaultGeneratorImage from "../../../assets/customer/images/generator-nour.png";
import { getGenerators } from "../../../services/generatorService";

const fallbackGenerators = [
  {
    id: "rafidain-1",
    name: "Rafidain Co",
    location: "الكرادة، قرب ساحة كهرباء",
    price: "8ش / أمبير",
    image: defaultGeneratorImage,
  },
  {
    id: "rafidain-2",
    name: "Rafidain Co",
    location: "الكرادة، قرب ساحة كهرباء",
    price: "8ش / أمبير",
    image: defaultGeneratorImage,
  },
  {
    id: "rafidain-3",
    name: "Rafidain Co",
    location: "الكرادة، قرب ساحة كهرباء",
    price: "8ش / أمبير",
    image: defaultGeneratorImage,
  },
  {
    id: "rafidain-4",
    name: "Rafidain Co",
    location: "الكرادة، قرب ساحة كهرباء",
    price: "8ش / أمبير",
    image: defaultGeneratorImage,
  },
];

function CompareGeneratorsModal({
  initialSelectedIds = [],
  onClose,
  onStartCompare,
}) {
  const [generators, setGenerators] = useState(fallbackGenerators);
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds.slice(0, 2));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadGenerators() {
      setIsLoading(true);

      try {
        const data = await getGenerators();
        const list = Array.isArray(data)
          ? data
          : data.data || data.generators || data.results || [];

        if (isMounted && list.length > 0) {
          setGenerators(list.map(normalizeGenerator));
        }
      } catch (error) {
        console.error("Compare generators load error:", error);
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

  const selectedCount = selectedIds.length;
  const canStartCompare = selectedCount === 2;

  const visibleGenerators = useMemo(
    () => generators.slice(0, 6),
    [generators]
  );

  const toggleGenerator = (id) => {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id);
      }

      if (currentIds.length >= 2) {
        return currentIds;
      }

      return [...currentIds, id];
    });
  };

  return (
    <div className="compare-generators-backdrop" role="presentation">
      <section
        className="compare-generators-modal"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-generators-title"
      >
        <header className="compare-generators-header">
          <div>
            <h2 id="compare-generators-title">اختر المولدات للمقارنة</h2>
            <p>قارن بين أفضل مزودي الطاقة في منطقتك لتجد الخيار الأنسب لك.</p>
          </div>

          <button
            className="compare-generators-close"
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <IoCloseOutline />
          </button>
        </header>

        <div className="compare-generators-list">
          {isLoading && (
            <div className="compare-loading">جاري تحميل المولدات...</div>
          )}

          {!isLoading &&
            visibleGenerators.map((generator) => {
              const isSelected = selectedIds.includes(generator.id);

              return (
                <button
                  className={`compare-generator-row ${
                    isSelected ? "selected" : ""
                  }`}
                  type="button"
                  key={generator.id}
                  onClick={() => toggleGenerator(generator.id)}
                >
                  <span
                    className={`compare-checkbox ${
                      isSelected ? "checked" : ""
                    }`}
                    aria-hidden="true"
                  />

                  <img src={generator.image} alt={generator.name} />

                  <span className="compare-generator-info">
                    <strong>{generator.name}</strong>
                    <em>{generator.location}</em>
                    <b>{generator.price}</b>
                  </span>
                </button>
              );
            })}
        </div>

        <footer className="compare-generators-footer">
          <div className="compare-selection-note">
            <IoInformationCircleOutline />
            <span>تم اختيار {selectedCount} من 2</span>
          </div>

          <div className="compare-footer-actions">
            <button type="button" className="compare-cancel" onClick={onClose}>
              إلغاء
            </button>

            <button
              type="button"
              className="compare-start"
              disabled={!canStartCompare}
              onClick={() => onStartCompare?.(selectedIds)}
            >
              بدء المقارنة
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function normalizeGenerator(generator) {
  const provider = generator.provider || generator.user || {};
  const area = generator.area || generator.location || {};
  const rawPrice = generator.price_KW ?? generator.priceKW ?? generator.price ?? 8;

  return {
    id: generator.id,
    name:
      generator.name ||
      generator.type ||
      provider.company_name ||
      provider.name ||
      "Rafidain Co",
    location:
      area.name ||
      generator.area_name ||
      generator.location ||
      generator.address ||
      "الكرادة، قرب ساحة كهرباء",
    price: `${rawPrice}ش / أمبير`,
    image: generator.image_url || generator.image || defaultGeneratorImage,
  };
}

export default CompareGeneratorsModal;
