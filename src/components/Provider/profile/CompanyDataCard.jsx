import React from 'react';

const CompanyDataCard = () => {
  return (
    <div className="profile-section-card">
      <div className="card-header">
        <div className="icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
          <span style={{ color: '#d97706' }}>🗃️</span>
        </div>
        <h3>بيانات الشركة</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>اسم الشركة</label>
          <input type="text" defaultValue="شركة المولدات الذهبية" />
        </div>

        <div className="form-group">
          <label>رقم الرخصة التجارية</label>
          <input type="text" defaultValue="LIC-99827-2024" />
        </div>
      </div>
    </div>
  );
};

export default CompanyDataCard;

