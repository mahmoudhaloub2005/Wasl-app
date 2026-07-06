import { useEffect, useRef, useState } from "react";
import "./CustomerGenerators.css";

import CompareGeneratorsModal from "./CompareGeneratorsModal";
import CompareResult from "./CompareResult";
import FilterSection from "./FilterSection";
import GeneratorsHeader from "./GeneratorHero";
import GeneratorsCards from "./GeneratorsCards";
import { designGenerators } from "../../../data/generatorsStorage";
import {
  getGenerators,
  searchGenerators,
} from "../../../services/generatorService";

function CustomerGenerators() {
  const [generatorName, setGeneratorName] = useState("");
  const [area, setArea] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [generators, setGenerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const compareResultRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const searchQuery = generatorName.trim();

    async function loadGenerators() {
      try {
        setLoading(true);
        setError("");

        const data = searchQuery
          ? await searchGenerators(searchQuery)
          : await getGenerators();

        if (isMounted) {
          setGenerators(data);
        }
      } catch (err) {
        console.error("Failed to load generators:", err);

        if (isMounted) {
          setError("تعذر تحميل المولدات من الخادم، يتم عرض البيانات المتاحة حاليا.");
          setGenerators(designGenerators);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(loadGenerators, searchQuery ? 350 : 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [generatorName]);

  useEffect(() => {
    if (compareIds.length === 2) {
      window.setTimeout(() => {
        compareResultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  }, [compareIds]);

  return (
    <main className="customer-generators-page" dir="rtl">
      <GeneratorsHeader onOpenCompare={() => setIsCompareOpen(true)} />

      <FilterSection
        generatorName={generatorName}
        setGeneratorName={setGeneratorName}
        area={area}
        setArea={setArea}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {error && <p className="generators-load-warning">{error}</p>}

      <GeneratorsCards
        generators={generators}
        generatorName=""
        area={area}
        priceRange={priceRange}
        selectedStatus={selectedStatus}
        loading={loading}
      />

      <div ref={compareResultRef}>
        <CompareResult
          generators={generators}
          selectedIds={compareIds}
          onChangeSelection={() => setIsCompareOpen(true)}
        />
      </div>

      {isCompareOpen && (
        <CompareGeneratorsModal
          generators={generators}
          initialSelectedIds={compareIds}
          onClose={() => setIsCompareOpen(false)}
          onStartCompare={(selectedIds) => {
            setCompareIds(selectedIds);
            setIsCompareOpen(false);
          }}
        />
      )}
    </main>
  );
}

export default CustomerGenerators;
