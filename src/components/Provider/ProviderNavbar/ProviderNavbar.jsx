import { NavLink, useNavigate } from "react-router-dom";
import "./ProviderNavbar.css";

import logo from "../../../assets/customer/icons/logo.svg";
import avatar from "../../../assets/images/User.jpg";
import notification from "../../../assets/customer/icons/notification.svg";
import settings from "../../../assets/customer/icons/settings.svg";

function ProviderNavbar() {
  const navigate = useNavigate();

  return (
    <header className="provider-navbar" dir="rtl">
      <div className="provider-navbar__inner">
        <button
          type="button"
          className="provider-navbar__brand"
          onClick={() => navigate("/provider")}
          aria-label="الصفحة الرئيسية"
        >
          <img src={logo} alt="وصل" />
          <span>وصل</span>
        </button>

        <nav className="provider-navbar__links" aria-label="مزود الخدمة">
          <NavLink to="/provider" end>
            الرئيسية
          </NavLink>
          <NavLink to="/provider/subscriptions">المشتركين</NavLink>
          <NavLink to="/provider/generators">المولدات</NavLink>
          <NavLink to="/provider/ads">الإعلانات</NavLink>
          <NavLink to="/provider/financial">التقارير المالية</NavLink>
          <NavLink to="/provider/reviews">التقييمات والشكاوي</NavLink>
        </nav>

        <div className="provider-navbar__actions">
          <button
            type="button"
            className="provider-navbar__avatar"
            aria-label="الملف الشخصي"
          >
            <img src={avatar} alt="الملف الشخصي" />
          </button>
          <button type="button" aria-label="الإعدادات">
            <img src={settings} alt="الإعدادات" />
          </button>
          <button
            type="button"
            className="provider-navbar__notification"
            aria-label="الإشعارات"
          >
            <img src={notification} alt="الإشعارات" />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default ProviderNavbar;
