import { useState } from "react";
import "./CustomerNavbar.css";

const navLinks = [
  { id: "home", label: "الرئيسية" },
  { id: "meters", label: "العدادات" },
  { id: "subscriptions", label: "الاشتراكات" },
  { id: "bills", label: "الفواتير والمدفوعات" },
  { id: "support", label: "الشكاوى" },
];

function CustomerNavbar() {
  const [activeLink, setActiveLink] = useState("home");

  return (
    <header className="customer-navbar" dir="rtl">
      <div className="customer-navbar-brand">
        <span className="customer-navbar-logo">💡</span>
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
    </header>
  );
}

export default CustomerNavbar;
