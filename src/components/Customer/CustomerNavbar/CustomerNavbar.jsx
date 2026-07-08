import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./CustomerNavbar.css";

import logo from "/src/assets/customer/icons/logo.svg";
import notification from "/src/assets/customer/icons/notification.svg";
import settings from "/src/assets/customer/icons/settings.svg";
import {
  getScopedStorageKey,
  getStoredUser,
  getUserAvatarUrl,
  getUserInitial,
} from "../../../utils/authStorage";

const PROFILE_AVATAR_KEY = "wasel_profile_avatar";

function getSavedAvatarForUser(user = getStoredUser()) {
  const storageKey = getScopedStorageKey(PROFILE_AVATAR_KEY, user);

  if (!storageKey) return "";

  return localStorage.getItem(storageKey) || "";
}

function getProfileAvatarForUser(user = getStoredUser()) {
  return getSavedAvatarForUser(user) || getUserAvatarUrl(user);
}

function CustomerNavbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const profileLetter = getUserInitial(currentUser);
  const [profileAvatar, setProfileAvatar] = useState(() =>
    getProfileAvatarForUser()
  );

  useEffect(() => {
    function refreshCurrentAvatar() {
      const nextUser = getStoredUser();

      setCurrentUser(nextUser);
      setProfileAvatar(getProfileAvatarForUser(nextUser));
    }

    function handleAvatarChange(event) {
      const nextUser = getStoredUser();
      const currentStorageKey = getScopedStorageKey(PROFILE_AVATAR_KEY, nextUser);
      const detail = event.detail;

      if (
        detail &&
        typeof detail === "object" &&
        detail.storageKey &&
        currentStorageKey &&
        detail.storageKey !== currentStorageKey
      ) {
        return;
      }

      setCurrentUser(nextUser);

      if (detail && typeof detail === "object" && "avatarImage" in detail) {
        setProfileAvatar(detail.avatarImage || getProfileAvatarForUser(nextUser));
        return;
      }

      refreshCurrentAvatar();
    }

    function handleStorageChange(event) {
      if (
        event.key === "wasel_user" ||
        event.key?.startsWith(`${PROFILE_AVATAR_KEY}_`)
      ) {
        refreshCurrentAvatar();
      }
    }

    window.addEventListener("wasel-profile-avatar-change", handleAvatarChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "wasel-profile-avatar-change",
        handleAvatarChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function goToProfile() {
    navigate("/customer/profile");
  }

  function goToNotifications() {
    navigate("/customer/notifications");
  }

  return (
    <header className="customer-navbar" dir="rtl">
      <div className="customer-navbar-container navbar-fixed-layout">
        <div className="customer-navbar-logo navbar-logo-fixed">
          <span>وصل</span>
          <img src={logo} alt="وصل" />
        </div>

        <nav className="customer-navbar-links navbar-links-fixed">
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

        <div className="customer-navbar-actions navbar-actions-fixed">
          <button
            type="button"
            className="customer-profile-action"
            onClick={goToProfile}
            title="الملف الشخصي"
          >
            {profileAvatar ? (
              <img src={profileAvatar} alt="الملف الشخصي" />
            ) : (
              <span className="customer-profile-letter">{profileLetter}</span>
            )}
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
            onClick={goToNotifications}
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
