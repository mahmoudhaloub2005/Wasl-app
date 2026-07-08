import React from 'react';
import './DeleteGeneratorModal.css';

const DeleteGeneratorModal = ({ isOpen, onClose, onDeleteConfirm }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'delete-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="delete-modal-backdrop" onClick={handleBackdropClick}>
      <div className="delete-modal-wrapper">
        <button className="delete-modal-close" onClick={onClose}>&times;</button>
        
        <div className="delete-modal-header">
          <h2>حذف المولد</h2>
        </div>

        <div className="delete-modal-body">
          <p className="delete-warning-text">
            هل أنت متأكد من رغبتك في حذف المولد؟ هذا الإجراء سيؤدي إلى إيقاف جميع الاشتراكات المرتبطة به ولا يمكن التراجع عنه.
          </p>
          
          <div className="delete-modal-actions">
            <button className="btn-confirm-delete" onClick={onDeleteConfirm}>
              تأكيد الحذف
            </button>
            <button className="btn-cancel-delete" onClick={onClose}>
              تراجع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteGeneratorModal;
