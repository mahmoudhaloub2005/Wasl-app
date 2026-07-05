import { NavLink, useNavigate } from "react-router-dom";
import "./CustomerNavbar.css";

import logo from "/src/assets/customer/icons/logo.svg";
import profile from "/src/assets/customer/icons/profile.svg";
import notification from "/src/assets/customer/icons/notification.svg";
import settings from "/src/assets/customer/icons/settings.svg";

function CustomerNavbar() {
  const navigate = useNavigate();

  function goToProfile() {
    navigate("/customer/profile");
  }

  return (
    <header className="customer-navbar" dir="rtl">
      <div className="customer-navbar-container">
        <div className="customer-navbar-logo">
          <span>وصل</span>
          <img src={logo} alt="وصل" />
        </div>

        <nav className="customer-navbar-links">
          <NavLink
            to="/customer"
            end
            className={({ isActive }) =>
              isActive ? "customer-nav-link active" : "customer-nav-link"
            }
          >
            الرئيسية
          </NavLink>

          <NavLink
            to="/customer/generators"
            className={({ isActive }) =>
              isActive ? "customer-nav-link active" : "customer-nav-link"
            }
          >
            المولدات
          </NavLink>

          <NavLink
            to="/customer/subscriptions"
            className={({ isActive }) =>
              isActive ? "customer-nav-link active" : "customer-nav-link"
            }
          >
            الاشتراكات
          </NavLink>

          <NavLink
            to="/customer/bills"
            className={({ isActive }) =>
              isActive ? "customer-nav-link active" : "customer-nav-link"
            }
          >
            الفواتير والمدفوعات
          </NavLink>

          <NavLink
            to="/customer/reviews"
            className={({ isActive }) =>
              isActive ? "customer-nav-link active" : "customer-nav-link"
            }
          >
            التقييمات والشكاوى
          </NavLink>
        </nav>

        <div className="customer-navbar-actions">
          <button
            type="button"
            className="customer-profile-action"
            onClick={goToProfile}
            title="الملف الشخصي"
          >
            <img src={profile} alt="الملف الشخصي" />
          </button>

          <button
            type="button"
            className="customer-settings-action"
            onClick={goToProfile}
            title="الإعدادات"
          >
            <img src={settings} alt="الإعدادات" />
          </button>

          <button
            type="button"
            className="customer-notification-action"
            title="الإشعارات"
          >
            <img src={notification} alt="الإشعارات" />
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;