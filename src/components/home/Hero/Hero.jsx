import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const [currentAmp, setCurrentAmp] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lastAction, setLastAction] = useState("");

  useEffect(() => {
    const targetAmp = 15;
    const targetProgress = 72;

    const interval = setInterval(() => {
      setCurrentAmp((prev) => {
        if (prev >= targetAmp) {
          return targetAmp;
        }

        return Number((prev + 0.2).toFixed(1));
      });

      setProgress((prev) => {
        if (prev >= targetProgress) {
          clearInterval(interval);
          return targetProgress;
        }

        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setLastAction("start");
    navigate("/choose-account");
  };

  const handleMore = () => {
    setLastAction("more");

    const statsSection = document.getElementById("stats-section");

    if (statsSection) {
      statsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 700,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="hero" data-action={lastAction}>
      <div className="hero-content">
        <h1>وصل: حلقة الوصل الرقمية لخدمات الطاقة</h1>

        <p>
          منصة ذكية تمكنك من مراقبة استهلاكك للطاقة في الوقت الفعلي، التواصل مع مزودي
          الخدمة المحليين، وإدارة فواتيرك بكل شفافية وسهولة.
        </p>

        <div className="hero-buttons">
          <button className="start-btn" type="button" onClick={handleStart}>
            ابدأ الآن ←
          </button>

          <button className="more-btn" type="button" onClick={handleMore}>
            اعرف المزيد
          </button>
        </div>
      </div>

      <div className="hero-image">
        <div className="dashboard">
          <div className="dashboard-header"></div>

          <div className="current-card">
            <div className="current-header">
              <IoFlash />
              <span>الاستهلاك الحالي</span>
            </div>

            <h2>{currentAmp} Amp</h2>

            <div className="line-bg">
              <div
                className="line-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="cards-row">
            <div className="small-box"></div>
            <div className="small-box"></div>
          </div>

          <div className="large-box"></div>

          <div className="invoice-card">
            <span>إشعار الفاتورة</span>
            <p>تم دفع فاتورة مايو</p>
          </div>

          <div className="generator-card">
            <div className="generator-icon">
              <FaCheckCircle />
            </div>

            <div>
              <h4>حالة المولد</h4>
              <p>يعمل بكفاءة عالية</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;