import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiSettings, FiUser, FiX } from "react-icons/fi";

import { providerNavigationLinks } from "../../../data/providerDashboardData";
import useProviderNavbarData from "../../../hooks/useProviderNavbarData";
import logo from "../../../assets/customer/icons/logo.svg";
import "./ProviderNavbar.css";

function ProviderNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const { notifications, providerProfile, unreadNotificationsCount } =
    useProviderNavbarData();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
      setOpenDropdown("");
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.search]);

  function goTo(path) {
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenDropdown("");
  }

  function toggleDropdown(dropdownName) {
    setOpenDropdown((currentDropdown) =>
      currentDropdown === dropdownName ? "" : dropdownName
    );
  }

  function getNavLinkClassName(link, isActive) {
    const hasCustomActivePath = link.activePaths?.some((activePath) =>
      location.pathname === activePath || location.pathname.startsWith(`${activePath}/`)
    );

    return isActive || hasCustomActivePath ? "active" : "";
  }

  return (
    <header
      className={`provider-navbar ${
        isMobileMenuOpen ? "provider-navbar--menu-open" : ""
      }`}
      dir="rtl"
    >
      <div className="provider-navbar__inner">
        <button
          type="button"
          className="provider-navbar__brand"
          onClick={() => goTo("/provider/home")}
          aria-label="الصفحة الرئيسية"
        >
          <img src={logo} alt="وصل" />
          <span>وصل</span>
        </button>

        <button
          type="button"
          className="provider-navbar__mobile-toggle"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className="provider-navbar__links" aria-label="مزود الخدمة">
          {providerNavigationLinks.map((link) => (
            <NavLink
              to={link.to}
              end={link.id === "dashboard"}
              key={link.id}
              className={({ isActive }) => getNavLinkClassName(link, isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="provider-navbar__actions">
          <div className="provider-navbar__action-wrap">
            <button
              type="button"
              className="provider-navbar__avatar"
              aria-label="الملف الشخصي"
              aria-expanded={openDropdown === "profile"}
              onClick={() => toggleDropdown("profile")}
            >
              {providerProfile.avatarUrl ? (
                <img src={providerProfile.avatarUrl} alt="الملف الشخصي" />
              ) : (
                <span className="provider-navbar__avatar-letter">
                  {providerProfile.initial}
                </span>
              )}
            </button>

            {openDropdown === "profile" && (
              <div className="provider-navbar__dropdown provider-navbar__dropdown--profile">
                <strong>{providerProfile.displayName}</strong>
                <button type="button" onClick={() => goTo("/provider/profile")}>
                  <FiUser aria-hidden="true" />
                  الملف الشخصي
                </button>
                <button
                  type="button"
                  onClick={() => goTo("/provider/profile?tab=settings")}
                >
                  <FiSettings aria-hidden="true" />
                  إعدادات الحساب
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="provider-navbar__icon-button"
            aria-label="الإعدادات"
            onClick={() => goTo("/provider/profile?tab=settings")}
          >
            <FiSettings aria-hidden="true" />
          </button>

          <div className="provider-navbar__action-wrap">
            <button
              type="button"
              className="provider-navbar__icon-button provider-navbar__notification"
              aria-label="الإشعارات"
              aria-expanded={openDropdown === "notifications"}
              onClick={() => toggleDropdown("notifications")}
            >
              <FiBell aria-hidden="true" />
              {unreadNotificationsCount > 0 && <span />}
            </button>

            {openDropdown === "notifications" && (
              <div className="provider-navbar__dropdown provider-navbar__dropdown--notifications">
                <strong>الإشعارات</strong>
                {unreadNotificationsCount > 0 ? (
                  <p>لديك {unreadNotificationsCount} إشعارات تحتاج إلى متابعة.</p>
                ) : (
                  <p>لا توجد إشعارات جديدة حالياً.</p>
                )}
                {notifications.slice(0, 2).map((notification) => (
                  <div
                    className="provider-navbar__notification-preview"
                    key={notification.id}
                  >
                    <span>{notification.title}</span>
                    <small>{notification.body}</small>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => goTo("/provider/notifications")}
                >
                  عرض الإشعارات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ProviderNavbar;