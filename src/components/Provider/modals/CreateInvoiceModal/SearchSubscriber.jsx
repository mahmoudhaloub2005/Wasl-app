import React from 'react';
import './SearchSubscriber.css';
const SearchSubscriber = () => {
  return (
    <div className="invoice-section-card">
      <div className="section-card-header">
        <span className="section-icon">👥</span>
        <div>
          <h3>البحث عن مشترك</h3>
          <p>اسم المشترك أو رقم الهوية</p>
        </div>
      </div>
      
      <div className="invoice-search-field">
        <input type="text" placeholder="ابحث بالاسم، رقم المشترك، أو رقم الهاتف..." />
        <span className="field-search-icon">🔍</span>
      </div>
    </div>
  );
};

export default SearchSubscriber;