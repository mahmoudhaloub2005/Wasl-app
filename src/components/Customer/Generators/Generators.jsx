import CustomerNavbar from "../Customer/CustomerNavbar/CustomerNavbar";import FilterSection from "../FilterSection/FilterSection";
import GeneratorCard from "../GeneratorCard/GeneratorCard";
import Footer from "../Footer/Footer";

import generator1 from "../../assets/images/generator1.jpg";
import generator2 from "../../assets/images/generator2.jpg";
import generator3 from "../../assets/images/generator3.jpg";

import "./Generators.css";

function Generators() {
  return (
    <>
      <CustomerNavbar /> 

      <section className="generators-page">

        <div className="page-header">

          <div>

            <h1>المولدات</h1>

            <p>
              استعرض المولدات المتوفرة في منطقتك وقارن الأسعار والخدمات.
            </p>

          </div>

          <button className="compare-btn">
            قارن
          </button>

        </div>

        <FilterSection />

        <div className="generators-grid">

          <GeneratorCard
            image={generator1}
            name="مولد الوافدين"
            location="دير البلح"
            price="₪18,500"
            capacity="450 أمبير"
            status="تحت الصيانة"
          />

          <GeneratorCard
            image={generator2}
            name="مولد الرشيد الذكي"
            location="دير البلح"
            price="₪18,500"
            capacity="450 أمبير"
            status="يعمل الآن"
          />

          <GeneratorCard
            image={generator3}
            name="مولد النور"
            location="دير البلح"
            price="₪25,000"
            capacity="450 أمبير"
            status="يعمل الآن"
          />

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Generators;

