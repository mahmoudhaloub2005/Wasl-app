import "./CustomerFooter.css";

import logo from "/src/assets/customer/icons/logo.svg";

function CustomerFooter() {
  return (
    <footer className="customer-footer" dir="rtl">
      <p>2026 Wassl Digital Platform. All rights reserved.</p>

      <div className="customer-footer-links">
        <button type="button">اتفاقية الخدمة</button>
        <button type="button">سياسة الخصوصية</button>
        <button type="button">بوابة الموردين</button>
        <button type="button">الدعم الفني</button>
      </div>

      <div className="customer-footer-logo">
        <span>وصل</span>
        <img src={logo} alt="وصل" />
      </div>
    </footer>
  );
}

export default CustomerFooter;