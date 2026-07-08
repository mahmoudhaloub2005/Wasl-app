import React from 'react';
import SearchSubscriber from './SearchSubscriber';
import InvoiceDetailsForm from './InvoiceDetailsForm';
import './CreateInvoiceModal.css';

const CreateInvoiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'invoice-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="invoice-modal-backdrop" onClick={handleBackdropClick}>
      <div className="invoice-modal-wrapper">
        {/* زر الإغلاق X */}
        <button className="invoice-modal-close" onClick={onClose}>&times;</button>
        
        {/* رأس النافذة */}
        <div className="invoice-modal-header">
          <h2>إصدار فاتورة جديدة</h2>
        </div>

        {/* جسم النافذة المكون من الكروت العمودية */}
        <div className="invoice-modal-body">
          <SearchSubscriber />
          <InvoiceDetailsForm />
          
          {/* زر الحفظ السفلي المحاذي لليمين */}
          <div className="invoice-action-container">
            <button className="btn-submit-invoice">إصدار فاتورة</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
