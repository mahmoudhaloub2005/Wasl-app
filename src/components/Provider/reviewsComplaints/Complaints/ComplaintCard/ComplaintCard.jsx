import React from 'react';
import './ComplaintCard.css';

const ComplaintCard = ({ complaint }) => {
  const { id, time, priority, title, userName, userId, status } = complaint;

  // دالة لتحديد النصوص وتنسيقات الحالة والأزرار ديناميكياً بناءً على التصميم
  const renderStatusSection = () => {
    switch (status) {
      case 'pending':
        return (
          <>
            <div className="status-badge pending">● قيد الانتظار</div>
            <button className="action-btn view-details">عرض التفاصيل</button>
          </>
        );
      case 'review':
        return (
          <>
            <div className="status-badge review">● قيد المراجعة</div>
            <button className="action-btn reply-request">الرد على الطلب</button>
          </>
        );
      case 'solved':
        return (
          <>
            <div className="status-badge solved">● تم الحل</div>
            <button className="action-btn view-history">عرض السجل</button>
          </>
        );
      default:
        return null;
    }
  };

  // دالة لتحديد كلاس الأولوية
  const getPriorityClass = () => {
    if (priority === 'أولوية قصوى') return 'priority-high';
    if (priority === 'متوسطة') return 'priority-medium';
    return 'priority-low';
  };

  return (
    <div className="complaint-card">
      {/* القسم الأيمن: المحتوى والمعلومات */}
      <div className="complaint-main">
        <div className="complaint-meta">
          <span className="complaint-id">#{id}</span>
          <span className="complaint-time">{time}</span>
          <span className={complaint-priority ${getPriorityClass()}}>{priority}</span>
        </div>
        <h3 className="complaint-title">{title}</h3>
        <div className="complaint-user">
          <span className="user-icon">👤</span>
          <span className="user-name">{userName}</span>
          <span className="divider">|</span>
          <span className="user-id">رقم المشترك: {userId}</span>
        </div>
      </div>

      {/* القسم الأيسر: الحالة والأزرار التفاعلية */}
      <div className="complaint-sidebar">
        <div className="status-label">الحالة</div>
        {renderStatusSection()}
      </div>
    </div>
  );
};

export default ComplaintCard;
