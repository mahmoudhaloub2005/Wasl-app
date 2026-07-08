import React from 'react';
import './ComplaintToolbar.css';

const ComplaintToolbar = () => {
  return (
    <div className="complaint-toolbar">
      <div className="toolbar-header">
        <h2>إدارة التقييمات ومراجعة الشكاوى</h2>
        <p>تابع آراء العملاء وحسّن جودة خدماتك بناءً على ملاحظاتهم.</p>
      </div>
      <div className="toolbar-actions">
        <div className="search-container">
          <input type="text" placeholder="البحث برقم التذكرة، اسم المشترك، أو الموضوع..." />
          <span className="search-icon">🔍</span>
        </div>
        <button className="btn-advanced-filter">تصفية متقدمة</button>
        <button className="btn-export">تصدير التقارير</button>
      </div>
    </div>
  );
};

export default ComplaintToolbar;
