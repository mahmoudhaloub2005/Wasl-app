import React from 'react';
import BasicInfoSection from './BasicInfoSection';
import PricingSection from './PricingSection';
import MapSection from './MapSection';
import QuickTip from './QuickTip';
import './AddGeneratorModal.css';

const AddGeneratorModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content-wrapper">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>تسجيل مولد طاقة جديد</h2>
                    <p>أدخل تفاصيل المولد الفنية والموقع الجغرافي لبدء إدارة الاشتراكات.</p>
                </div>

                <div className="modal-body-layout">
                    <div className="modal-right-column">
                        <BasicInfoSection />
                        <button className="btn-save-generator">حفظ البيانات</button>
                    </div>

                    <div className="modal-left-column">
                        <PricingSection />
                        <MapSection />
                        <QuickTip />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddGeneratorModal;
