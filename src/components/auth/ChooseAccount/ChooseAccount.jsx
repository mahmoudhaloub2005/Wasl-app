import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseAccount.css";

import homeIcon from "../../../assets/icons/image1.svg";
import generatorIcon from "../../../assets/icons/image2.svg";

function ChooseAccount() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelect = (accountType) => {
    setSelected(accountType);
    setErrorMessage("");
  };

  const handleNext = () => {
    if (!selected) {
      setErrorMessage("يرجى اختيار نوع الحساب أولاً");
      return;
    }

    if (selected === "user") {
      navigate("/register");
      return;
    }

    if (selected === "provider") {
      navigate("/provider-register");
    }
  };

  return (
    <section className="choose-page" dir="rtl">
      <div className="choose-box">
        <h1>كيف تود استخدام وصل؟</h1>

        <p className="subtitle">
          اختر نوع الحساب الذي يناسب احتياجاتك للبدء في تجربة خدماتنا الرقمية.
        </p>

        <div className="cards">
          <button
            type="button"
            className={`card ${selected === "user" ? "active" : ""}`}
            onClick={() => handleSelect("user")}
          >
            <div className="icon">
              <img className="imag" src={homeIcon} alt="مواطن" />
            </div>

            <h3>مواطن / مشترك</h3>

            <p>
              اشترك في خدمات المولدات، تابع استهلاكك اليومي، وقم بسداد فواتيرك
              بسهولة.
            </p>
          </button>

          <button
            type="button"
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
          </button>
        </div>

        {errorMessage && <p className="choose-error">{errorMessage}</p>}

        <button
          className={`next-btn ${selected ? "active" : ""}`}
          type="button"
          onClick={handleNext}
        >
          المتابعة للتسجيل
        </button>

        <p className="login-link">
          لديك حساب بالفعل؟{" "}
          <button type="button" onClick={() => navigate("/login")}>
            تسجيل الدخول
          </button>
        </p>
      </div>
    </section>
  );
}

export default ChooseAccount;
