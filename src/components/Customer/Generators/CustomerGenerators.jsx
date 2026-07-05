import { useState } from "react";
import "./CustomerGenerators.css";

import CompareGeneratorsModal from "./CompareGeneratorsModal";
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
