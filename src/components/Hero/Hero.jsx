import { FaCheckCircle } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";
import "./Hero.css";

function Hero() {
  return (
   <section className="hero">
  <div className="hero-content">
    <h1>وصل: حلقة الوصل الرقمية لخدمات الطاقة</h1>
    <p>
      منصة ذكية تمكنك من مراقبة استهلاكك للطاقة في الوقت الفعلي، التواصل مع مزودي
الخدمة المحليين، وإدارة فواتيرك بكل شفافية وسهولة.
    </p>

   <div className="hero-buttons">
  <button className="start-btn">
   
      ابدأ الآن ←
  </button>

  <button className="more-btn">
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

      <h2>12.4 Amp</h2>

      <div className="line-bg">
        <div className="line-fill"></div>
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