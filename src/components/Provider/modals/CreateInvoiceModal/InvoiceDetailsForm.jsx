
import React from 'react';
import './InvoiceDetailsForm.css';

const InvoiceDetailsForm = () => {
  return (
    <div className="invoice-section-card">
      <div className="section-card-header">
        <span className="section-icon">📄</span>
        <div>
          <h3>بيانات الفاتورة</h3>
        </div>
      </div>

      <div className="invoice-form-grid">
        {/* رقم الاشتراك */}
        <div className="invoice-form-group">
          <label>رقم الاشتراك</label>
          <input type="text" placeholder="---" disabled className="disabled-field" />
        </div>

        {/* تاريخ الاستحقاق */}
        <div className="invoice-form-group">
          <label>تاريخ الاستحقاق (due_date)</label>
          <input type="text" placeholder="mm/dd/yyyy" onFocus={(e) => e.target.type = 'date'} />
        </div>

        {/* القراءة السابقة */}
        <div className="invoice-form-group">
          <label>القراءة السابقة (previous_reading)</label>
          <div className="input-unit-wrapper">
            <input type="number" defaultValue="0" />
            <span className="input-unit">أمبير</span>
          </div>
        </div>

        {/* القراءة الحالية */}
        <div className="invoice-form-group">
          <label>القراءة الحالية (current_reading)</label>
          <div className="input-unit-wrapper">
            <input type="number" placeholder="أدخل القراءة الحالية" />
            <span className="input-unit">أمبير</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
