import React from 'react';
import './NoticeForm.css';

const NoticeForm = () => {
  return (
    <div className="notice-form-container">
      <div className="notice-input-group">
        <label>عنوان الاشعار</label>
        <input type="text" placeholder="صيانة" />
      </div>

      <div className="notice-input-group">
        <label>جملة توضيحية</label>
        <textarea placeholder="سيتم إيقاف المولد للصيانة غداً"></textarea>
      </div>
    </div>
  );
};

export default NoticeForm;
