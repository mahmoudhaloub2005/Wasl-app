import "./GeneratorList.css";
import GeneratorListItem from "./GeneratorListItem";

function GeneratorList() {

  const generators = [

    {
      id:1,
      name:"مولد حي الروضة",
      code:"G2",
      capacity:"150 KVA",
      price:"25 شيكل",
      status:"نشط"
    },

    {
      id:2,
      name:"مولد ساحة النجمة",
      code:"N1",
      capacity:"300 KVA",
      price:"50 شيكل",
      status:"نشط"
    },

  ];

  return (

    <div className="generator-list">

      <h2>بقية المولدات</h2>

      {
        generators.map(generator=>(
          <GeneratorListItem
            key={generator.id}
            generator={generator}
          />
        ))
      }

    </div>

  );

}

export default GeneratorList;

