import React from 'react';
import ImageUploader from './ImageUploader';
import AdDetailsForm from './AdDetailsForm';
import './AddAdModal.css';

const AddAdModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'ad-modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="ad-modal-backdrop" onClick={handleBackdropClick}>
            <div className="ad-modal-wrapper">
                <button className="ad-modal-close" onClick={onClose}>&times;</button>

                <div className="ad-modal-header">
                    <h2>إضافة إعلان جديد</h2>
                </div>

                <div className="ad-modal-body">
                    <ImageUploader />
                    <AdDetailsForm />

                    <button className="btn-publish-ad">نشر الاعلان الآن</button>
                </div>
            </div>
        </div>
    );
};

export default AddAdModal;
