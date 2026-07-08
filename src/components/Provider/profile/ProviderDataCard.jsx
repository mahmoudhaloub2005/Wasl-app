import React from 'react';
// هنا يمكنك استيراد صورتك لاحقاً واستبدال المتغير user به، مثال:
// import userImg from '../../assets/user.jpg';
const ProviderDataCard = () => {
  // يمكنك تغيير هذا المسار أو وضع المتغير المستورد مكانه
  const user = "https://via.placeholder.com/150"; 

  return (
    <div className="profile-section-card">
      <div className="card-header">
        <div className="icon-wrapper" style={{ backgroundColor: '#e0f2fe' }}>
          <span style={{ color: '#0369a1' }}>💼</span>
        </div>
        <h3>بيانات المزود</h3>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* حقول المدخلات */}
        <div className="form-grid" style={{ flex: 1 }}>
          <div className="form-group">
            <label>الاسم الكامل</label>
            <input type="text" defaultValue="أحمد محمد" />
          </div>
          
          <div className="form-group">
            <label>رقم التواصل</label>
            <input type="text" defaultValue="+970 59 123 4567" style={{ direction: 'ltr', textAlign: 'right' }} />
          </div>

          <div className="form-group full-width">
            <label>البريد الإلكتروني</label>
            <input type="email" defaultValue="ahmed.m@wassl.ps" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
          <img 
            src={user} 
            alt="صورة الملف الشخصي" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
          />
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>صورة الملف الشخصي</span>
        </div>
      </div>
    </div>
  );
};

export default ProviderDataCard;
