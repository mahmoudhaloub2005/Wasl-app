import React from 'react';
import './BasicInfoSection.css';

const BasicInfoSection = () => {
  return (
    <div className="basic-info-container">
      <div className="info-card-block">
        <div className="block-title">
          <span>⚡</span>
          <h3>المعلومات الأساسية</h3>
        </div>
        
        <div className="inputs-grid">
          <div className="input-group">
            <label>اسم المولد</label>
            <input type="text" placeholder="مثال: مولد حي المنصور 01" />
          </div>
          <div className="input-group">
            <label>القدرة الكلية (KVA)</label>
            <div className="input-with-unit">
              <input type="number" placeholder="0.00" />
              <span className="unit-label">KVA</span>
            </div>
          </div>
          <div className="input-group full-row">
            <label>الحالة</label>
            <select className="custom-select">
              <option value="active">نشط</option>
              <option value="maintenance">صيانة</option>
            </select>
          </div>
          <div className="input-group full-row">
            <label>الموقع الجغرافي / الحي</label>
            <div className="input-with-icon">
              <input type="text" placeholder="حدد اسم الحي أو المنطقة السكنية" />
              <span className="geo-icon">📍</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-card-block" style={{ marginTop: '20px' }}>
        <div className ="block-title">
          <span>📝</span>
          <h3>ملاحظات إضافية</h3>
        </div>
        <textarea className="custom-textarea" placeholder="اكتب أي تفاصيل أخرى حول ساعات التشغيل أو الصيانة الدورية..."></textarea>
      </div>
    </div>
  );
};

export default BasicInfoSection;
