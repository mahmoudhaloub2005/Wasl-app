import React from 'react';
import EditGeneratorForm from './EditGeneratorForm';
import './EditGeneratorModal.css';

const EditGeneratorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'edit-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="edit-modal-backdrop" onClick={handleBackdropClick}>
      <div className="edit-modal-wrapper">
        <button className="edit-modal-close" onClick={onClose}>&times;</button>
        
        <div className="edit-modal-header">
          <h2>تعديل بيانات المولد</h2>
        </div>

        <div className="edit-modal-body">
          <EditGeneratorForm />
          
          <button className="btn-save-edit">حفظ التعديلات</button>
        </div>
      </div>
    </div>
  );
};

export default EditGeneratorModal;
