import { NavLink } from "react-router-dom";
import "./ProviderNavbar.css";

import logo from "/src/assets/customer/icons/logo.svg";
import profile from "/src/assets/customer/icons/profile.svg";
import notification from "/src/assets/customer/icons/notification.svg";
import settings from "/src/assets/customer/icons/settings.svg";

function ProviderNavbar() {
  return (
    <header className="provider-navbar" dir="rtl">
      <div className="provider-navbar-container">

        <div className="provider-navbar-logo">
          <span>وصل</span>
          <img src={logo} alt="وصل" />
        </div>

        <nav className="provider-navbar-links">

          <NavLink
            to="/provider"
            end
            className={({ isActive }) =>
              isActive ? "provider-nav-link active" : "provider-nav-link"
            }
          >
            الرئيسية
          </NavLink>

          <NavLink
            to="/provider/subscribers"
            className={({ isActive }) =>
              isActive ? "provider-nav-link active" : "provider-nav-link"
            }
          >
            المشتركين
          </NavLink>

          <NavLink
            to="/provider/generators"
            className={({ isActive }) =>
              isActive ? "provider-nav-link active" : "provider-nav-link"
            }
          >
            المولدات
          </NavLink>

          <NavLink
            to="/provider/ads"
            className={({ isActive }) =>
              isActive ? "provider-nav-link active" : "provider-nav-link"
            }
          >
            الإعلانات
          </NavLink>

          <NavLink
            to="/provider/reports"
            className={({ isActive }) =>
              isActive ? "provider-nav-link active" : "provider-nav-link"
            }
          >
            التقارير المالية
          </NavLink>

          <NavLink
            to="/provider/reviews"
            className={({ isActive }) =>
              isActive ? "provider-nav-link active" : "provider-nav-link"
            }
          >
            التقييمات والشكاوى
          </NavLink>

        </nav>

        <div className="provider-navbar-actions">
          <img
            src={profile}
            alt="الملف الشخصي"
            className="profile-img"
          />

          <img
            src={settings}
            alt="الإعدادات"
            className="nav-action-icon"
          />

          <div className="notification-wrapper">
            <img
              src={notification}
              alt="الإشعارات"
              className="nav-action-icon"
            />
            <span className="notification-dot"></span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default ProviderNavbar;