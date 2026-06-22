import "./Footer.css";
import logo from "../../assets/icons/image.png";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <p className="copyright">
          © 2026 Wassl Digital Platform. All rights reserved.
        </p>

        <ul className="footer-links">
          <li>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                isActive ? "active-footer-link" : ""
              }
            >
              اتفاقية الخدمة
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                isActive ? "active-footer-link" : ""
              }
            >
              سياسة الخصوصية
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/provider-modal"
              className={({ isActive }) =>
                isActive ? "active-footer-link" : ""
              }
            >
              بوابة المزودين
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                isActive ? "active-footer-link" : ""
              }
            >
              الدعم الفني
            </NavLink>
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