import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logoIcon from "../../assets/icons/image.png";
import notificationIcon from "../../assets/icons/notification.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import profileIcon from "../../assets/icons/profile.svg";

import "./WaslTopNavbar.css";

export default function WaslTopNavbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationsClick = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAllNotificationsClick = () => {
    setIsNotificationsOpen(false);
    navigate("/notifications");
  };

  return (
    <header className="wasl-top-navbar-shell">
      <div className="wasl-top-navbar-inner">
        <div className="wasl-top-navbar-logo-area">
          <img
            className="wasl-top-navbar-logo-image"
            src={logoIcon}
            alt="شعار وصل"
          />

          <span className="wasl-top-navbar-logo-text">وصل</span>
        </div>

        <nav className="wasl-top-navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "wasl-top-navbar-link wasl-top-navbar-link-active"
                : "wasl-top-navbar-link"
            }
          >
            الرئيسية
          </NavLink>

          <NavLink
            to="/generators"
            className={({ isActive }) =>
              isActive
                ? "wasl-top-navbar-link wasl-top-navbar-link-active"
                : "wasl-top-navbar-link"
            }
          >
            المولدات
          </NavLink>

          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              isActive
                ? "wasl-top-navbar-link wasl-top-navbar-link-active"
                : "wasl-top-navbar-link"
            }
          >
            الاشتراكات
          </NavLink>

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive
                ? "wasl-top-navbar-link wasl-top-navbar-link-active"
                : "wasl-top-navbar-link"
            }
          >
            الفواتير والمدفوعات
          </NavLink>

          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              isActive
                ? "wasl-top-navbar-link wasl-top-navbar-link-active"
                : "wasl-top-navbar-link"
            }
          >
            التقييمات والشكاوى
          </NavLink>
        </nav>

        <div className="wasl-navbar-actions">
          <button
            className="wasl-navbar-action-btn wasl-navbar-profile-btn"
            type="button"
            onClick={handleProfileClick}
            aria-label="الملف الشخصي"
          >
            <img
              className="wasl-navbar-action-icon wasl-navbar-profile-icon"
              src={profileIcon}
              alt=""
            />
          </button>

          <button
            className="wasl-navbar-action-btn wasl-navbar-settings-btn"
            type="button"
            onClick={handleSettingsClick}
            aria-label="الإعدادات"
          >
            <img
              className="wasl-navbar-action-icon"
              src={settingsIcon}
              alt=""
            />
          </button>

          <div className="wasl-navbar-notification-wrapper">
            <button
              className="wasl-navbar-action-btn wasl-navbar-notification-btn"
              type="button"
              onClick={handleNotificationsClick}
              aria-label="الإشعارات"
            >
              <img
                className="wasl-navbar-action-icon wasl-navbar-notification-icon"
                src={notificationIcon}
                alt=""
              />

              <span className="wasl-navbar-notification-badge"></span>
            </button>

            {isNotificationsOpen && (
              <div className="wasl-navbar-notification-panel">
                <h4 className="wasl-navbar-notification-title">الإشعارات</h4>

                <div className="wasl-navbar-notification-item">
                  تم إصدار فاتورة جديدة لهذا الشهر
                </div>

                <div className="wasl-navbar-notification-item">
                  تم تحديث حالة الاشتراك
                </div>

                <div className="wasl-navbar-notification-item">
                  يوجد تنبيه جديد بخصوص المولد
                </div>

                <button
                  className="wasl-navbar-notification-view-all"
                  type="button"
                  onClick={handleAllNotificationsClick}
                >
                  عرض كل الإشعارات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}