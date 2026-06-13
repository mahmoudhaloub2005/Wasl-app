import { useState } from "react";
import "./ChooseAccount.css";

import homeIcon from "../../assets/icons/image1.svg";
import generatorIcon from "../../assets/icons/image2.svg";

function ChooseAccount() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="choose-page">
      <div className="choose-box">

        <h1>كيف تود استخدام وصل؟</h1>

        <p className="subtitle">
          اختر نوع الحساب الذي يناسب احتياجاتك للبدء في تجربة خدماتنا الرقمية.
        </p>

        <div className="cards">

          {/* مواطن */}
          <div
            className={`card ${selected === "user" ? "active" : ""}`}
            onClick={() => setSelected("user")}
          >
            <div className="icon">
              <img src={homeIcon} alt="مواطن" />
            </div>
            <h3>مواطن / مشترك</h3>
            <p>
              اشترك في خدمات المولدات، تابع استهلاكك اليومي، وقم بسداد فواتيرك بسهولة.
            </p>
          </div>

          {/* مزود */}
          <div
            className={`card ${selected === "provider" ? "active" : ""}`}
            onClick={() => setSelected("provider")}
          >
            <div className="icon">
              <img src={generatorIcon} alt="مزود" />
            </div>
            <h3>مزود خدمة مولدات</h3>
            <p>
              أدر المشتركين، تابع التحصيل المالي، وحالات الاشتراك بسهولة.
            </p>
          </div>

        </div>

        {/* زر المتابعة */}
        <button className={`next-btn ${selected ? "active" : ""}`}>
          المتابعة للتسجيل
        </button>

      </div>
    </section>
  );
}

export default ChooseAccount;