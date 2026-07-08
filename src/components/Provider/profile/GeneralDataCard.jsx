import React from 'react';

const GeneralDataCard = () => {
  return (
    <div className="profile-section-card">
      <div className="card-header">
        <div className="icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
          <span style={{ color: '#d97706' }}>⚙️</span>
        </div>
        <h3>بيانات عامة</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>سعر الكيلو</label>
          <input type="text" defaultValue="60 شيكل" />
        </div>

        <div className="form-group">
          <label>آلية الدفع</label>
          <input type="text" defaultValue="يتم الدفع شهرياً" />
        </div>
      </div>
    </div>
  );
};

export default GeneralDataCard;
