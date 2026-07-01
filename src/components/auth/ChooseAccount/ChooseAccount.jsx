import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseAccount.css";

import homeIcon from "../../../assets/icons/image1.svg";
import generatorIcon from "../../../assets/icons/image2.svg";
function ChooseAccount() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (accountType) => {
    setSelected(accountType);
  };

  const handleNext = () => {
    if (!selected) {
      alert("يرجى اختيار نوع الحساب أولاً");
      return;
    }

    if (selected === "user") {
      navigate("/login-info");
      return;
    }

    if (selected === "provider") {
      navigate("/provider-register");
      return;
    }
  };

  return (
    <section className="choose-page">
      <div className="choose-box">
        <h1>كيف تود استخدام وصل؟</h1>

        <p className="subtitle">
          اختر نوع الحساب الذي يناسب احتياجاتك للبدء في تجربة خدماتنا الرقمية.
        </p>

        <div className="cards">
          <div
            className={`card ${selected === "user" ? "active" : ""}`}
            onClick={() => handleSelect("user")}
          >
            <div className="icon">
              <img className="imag" src={homeIcon} alt="مواطن" />
            </div>

            <h3>مواطن / مشترك</h3>

            <p>
              اشترك في خدمات المولدات، تابع استهلاكك اليومي، وقم بسداد فواتيرك بسهولة.
            </p>
          </div>

          <div
            className={`card ${selected === "provider" ? "active" : ""}`}
            onClick={() => handleSelect("provider")}
          >
            <div className="icon">
              <img className="imag" src={generatorIcon} alt="مزود" />
            </div>

            <h3>مزود خدمة مولدات</h3>

            <p>
              أدر المشتركين، تابع التحصيل المالي، وحالات الاشتراك بسهولة.
            </p>
          </div>
        </div>

        <button
          className={`next-btn ${selected ? "active" : ""}`}
          type="button"
          onClick={handleNext}
        >
          المتابعة للتسجيل
        </button>
      </div>
    </section>
  );
}

export default ChooseAccount;