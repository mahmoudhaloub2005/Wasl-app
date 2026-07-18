import { useNavigate } from "react-router-dom";

import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import Footer from "../../components/layout/Footer/Footer";
import "./ProviderPreparedRoute.css";

function ProviderPreparedRoute({ title }) {
  const navigate = useNavigate();

  return (
    <div className="provider-prepared-route" dir="rtl">
      <ProviderNavbar />

      <main className="provider-prepared-route__content">
        <section className="provider-prepared-route__panel">
          <span>واجهة مزود الخدمة</span>
          <h1>{title}</h1>
          <p>تم تجهيز المسار فقط، وسيتم بناء هذه الواجهة عند إرسال تصميمها.</p>
          <button type="button" onClick={() => navigate("/provider/home")}>
            العودة للرئيسية
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProviderPreparedRoute;
