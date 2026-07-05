import { useState } from "react";
import "./CustomerGenerators.css";

import GeneratorsHeader from "./GeneratorHero";
import FilterSection from "./FilterSection";
import GeneratorsCards from "./GeneratorsCards";

function CustomerGenerators() {
  const [generatorName, setGeneratorName] = useState("");
  const [area, setArea] = useState(
    "");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <main className="customer-generators-page" dir="rtl">
      <GeneratorsHeader />

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

      <GeneratorsCards />
    </main>
  );
}

export default CustomerGenerators;