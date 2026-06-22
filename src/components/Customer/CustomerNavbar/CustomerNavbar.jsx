import { useState } from "react";
import "./CustomerNavbar.css";

import logo from "../../../assets/customer/icons/logo.svg";
import profileIcon from "../../../assets/customer/icons/profile.svg";
import settingsIcon from "../../../assets/customer/icons/settings.svg";
import notificationIcon from "../../../assets/customer/icons/notification.svg";

function CustomerNavbar() {
  const [activeLink, setActiveLink] = useState("home");

  const navLinks = [
    { id: "home", label: "الرئيسية" },
    { id: "generators", label: "المولدات" },
    { id: "subscriptions", label: "الاشتراكات" },
    { id: "bills", label: "الفواتير والمدفوعات" },
    { id: "reviews", label: "التقييمات والشكاوى" },
  ];

  return (
    <header className="customer-navbar">
      <div className="customer-navbar-brand">
        <img src={logo} alt="وصل" className="customer-navbar-logo" />
        <span className="customer-navbar-name">وصل</span>
      </div>

      <nav className="customer-navbar-links">
        {navLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => setActiveLink(link.id)}
            className={
              activeLink === link.id
                ? "customer-navbar-link active"
                : "customer-navbar-link"
            }
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="customer-navbar-actions">
       <button className="customer-navbar-icon-btn profile-btn" type="button">
  <img src={profileIcon} alt="الملف الشخصي" />
</button>

        <button className="customer-navbar-icon-btn" type="button">
          <img src={settingsIcon} alt="الإعدادات" />
        </button>

        <button className="customer-navbar-icon-btn notification-btn" type="button">
          <img src={notificationIcon} alt="الإشعارات" />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}

export default CustomerNavbar;