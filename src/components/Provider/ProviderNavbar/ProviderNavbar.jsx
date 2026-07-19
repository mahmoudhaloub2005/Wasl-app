import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiSettings, FiX } from "react-icons/fi";

import { providerNavigationLinks } from "../../../data/providerDashboardData";
import NotificationsDropdown from "../notifications/NotificationsDropdown";
import useProviderNavbarData from "../../../hooks/useProviderNavbarData";
import logo from "../../../assets/customer/icons/logo.svg";
import "./ProviderNavbar.css";

function ProviderNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, providerProfile, unreadNotificationsCount } =
    useProviderNavbarData();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsNotificationsOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.search]);

  function goTo(path) {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  }

  function toggleNotificationsDropdown() {
    setIsNotificationsOpen((isOpen) => !isOpen);
  }

  function normalizePath(path) {
    return path.replace(/\/+$/, "") || "/";
  }

  function isNavPathActive(activePath) {
    const currentPath = normalizePath(location.pathname);
    const normalizedActivePath = normalizePath(activePath);

    return (
      currentPath === normalizedActivePath ||
      (normalizedActivePath !== "/provider" &&
        currentPath.startsWith(`${normalizedActivePath}/`))
    );
  }

  const activeNavigationId =
    providerNavigationLinks.find((link) =>
      (link.activePaths ?? [link.to]).some(isNavPathActive)
    )?.id ?? "";

  function getNavLinkClassName(link) {
    return link.id === activeNavigationId ? "active" : "";
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
              className={() => getNavLinkClassName(link)}
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
              onClick={() => goTo("/provider/profile")}
            >
              {providerProfile.avatarUrl ? (
                <img src={providerProfile.avatarUrl} alt="الملف الشخصي" />
              ) : (
                <span className="provider-navbar__avatar-letter">
                  {providerProfile.initial}
                </span>
              )}
            </button>
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
              aria-expanded={isNotificationsOpen}
              onClick={toggleNotificationsDropdown}
            >
              <FiBell aria-hidden="true" />
              {unreadNotificationsCount > 0 && <span />}
            </button>

            {isNotificationsOpen && (
              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadNotificationsCount}
                onViewAll={() => goTo("/provider/notifications")}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ProviderNavbar;
