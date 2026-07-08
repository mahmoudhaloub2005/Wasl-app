
import React from 'react';
import './PricingSection.css';

const PricingSection = () => {
  return (
    <div className="pricing-card-blue">
      <h4>التسعير</h4>
      <div className="pricing-input-wrapper">
        <label>سعر الأمبير الافتراضي</label>
        <div className="currency-input">
          <input type="number" placeholder="0.00" />
          <span className="currency-label">د.ع</span>
        </div>
        <p className="pricing-hint">هذا السعر سيتم تطبيقه تلقائياً على المشتركين الجدد.</p>
      </div>
      
      <div className="status-toggle-bar">
        <span>الحالة التشغيلية</span>
        <span className="badge-active-green">نشط</span>
      </div>
    </div>
  );
};

export default PricingSection;
