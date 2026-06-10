import "./Footer.css";
import logo from "../../assets/icons/image.png"; // غير المسار حسب مشروعك

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
<p className="copyright">  .2024Wassl Digital Platform. All rights reserved © </p>

        <ul className="footer-links">
          <li>اتفاقية الخدمة</li>
          <li>سياسة الخصوصية</li>
          <li>بوابة المزودين</li>
          <li>الدعم الفني</li>
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