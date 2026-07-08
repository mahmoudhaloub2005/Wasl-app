import React from 'react';
import NoticeForm from './NoticeForm';
import './AddNoticeModal.css';

const AddNoticeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'notice-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="notice-modal-backdrop" onClick={handleBackdropClick}>
      <div className="notice-modal-wrapper">
        <button className="notice-modal-close" onClick={onClose}>&times;</button>
        
        <div className="notice-modal-header">
          <h2>اشعار جديد</h2>
        </div>

        <div className="notice-modal-body">
          <NoticeForm />
          
          <button className="btn-send-notice">ارسال تنبيه</button>
        </div>
      </div>
    </div>
  );
};

export default AddNoticeModal;
