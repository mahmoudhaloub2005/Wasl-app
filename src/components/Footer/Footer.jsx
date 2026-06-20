import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/icons/image.png";

function Footer() {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName, path) => {
    setActiveLink(linkName);
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright">
          © 2026 Wassl Digital Platform. All rights reserved.
        </p>

        <ul className="footer-links">
          <li
            className={
              activeLink === "اتفاقية الخدمة" ? "active-footer-link" : ""
            }
            onClick={() => handleLinkClick("اتفاقية الخدمة", "/terms")}
          >
            اتفاقية الخدمة
          </li>

          <li
            className={
              activeLink === "سياسة الخصوصية" ? "active-footer-link" : ""
            }
            onClick={() => handleLinkClick("سياسة الخصوصية", "/terms")}
          >
            سياسة الخصوصية
          </li>

          <li
            className={
              activeLink === "بوابة المزودين" ? "active-footer-link" : ""
            }
            onClick={() =>
              handleLinkClick("بوابة المزودين", "/provider-register")
            }
          >
            بوابة المزودين
          </li>

          <li
            className={
              activeLink === "الدعم الفني" ? "active-footer-link" : ""
            }
            onClick={() => handleLinkClick("الدعم الفني", "/contact-us")}
          >
            الدعم الفني
          </li>
        </ul>

        <div className="footer-logo" onClick={handleLogoClick}>
          <img src={logo} alt="وصل" />
          <span>وصل</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;