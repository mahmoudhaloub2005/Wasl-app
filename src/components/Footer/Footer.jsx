import { useState } from "react";
import "./Footer.css";
import logo from "../../assets/icons/image.png";

function Footer() {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    console.log("تم الضغط على:", linkName);
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        <p className="copyright">
          © 2026 Wassl Digital Platform. All rights reserved.
        </p>

        <ul className="footer-links">
          <li
            className={activeLink === "اتفاقية الخدمة" ? "active-footer-link" : ""}
            onClick={() => handleLinkClick("اتفاقية الخدمة")}
          >
            اتفاقية الخدمة
          </li>

          <li
            className={activeLink === "سياسة الخصوصية" ? "active-footer-link" : ""}
            onClick={() => handleLinkClick("سياسة الخصوصية")}
          >
            سياسة الخصوصية
          </li>

          <li
            className={activeLink === "بوابة المزودين" ? "active-footer-link" : ""}
            onClick={() => handleLinkClick("بوابة المزودين")}
          >
            بوابة المزودين
          </li>

          <li
            className={activeLink === "الدعم الفني" ? "active-footer-link" : ""}
            onClick={() => handleLinkClick("الدعم الفني")}
          >
            الدعم الفني
          </li>
        </ul>

        <div className="footer-logo">
          <img src={logo} alt="وصل" />
          <span>وصل</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;