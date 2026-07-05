import { useEffect, useRef, useState } from "react";
import "./CustomerGenerators.css";

import CompareGeneratorsModal from "./CompareGeneratorsModal";
import CompareResult from "./CompareResult";
import FilterSection from "./FilterSection";
import GeneratorsHeader from "./GeneratorHero";
import GeneratorsCards from "./GeneratorsCards";

function CustomerGenerators() {
  const [generatorName, setGeneratorName] = useState("");
  const [area, setArea] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const compareResultRef = useRef(null);

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

      <GeneratorsCards
        generatorName={generatorName}
        area={area}
        priceRange={priceRange}
        selectedStatus={selectedStatus}
      />

      <div ref={compareResultRef}>
        <CompareResult
          selectedIds={compareIds}
          onChangeSelection={() => setIsCompareOpen(true)}
        />
      </div>

      {isCompareOpen && (
        <CompareGeneratorsModal
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
