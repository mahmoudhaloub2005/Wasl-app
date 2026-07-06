import { NavLink, useLocation } from "react-router-dom";
import "./Footer.css";
import logo from "../../../assets/icons/image.png";

function Footer() {
  const location = useLocation();
  const returnPath = `${location.pathname}${location.search}`;
  const modalState = { from: returnPath };

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
              state={modalState}
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
              state={modalState}
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
              state={modalState}
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
