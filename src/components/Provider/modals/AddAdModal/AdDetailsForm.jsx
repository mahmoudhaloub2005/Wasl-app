
import React from 'react';
import './AdDetailsForm.css';

const AdDetailsForm = () => {
    return (
        <div className="ad-form-container">
            <div className="ad-input-group">
                <label>اسم العرض</label>
                <input type="text" placeholder="مثلاً: عرض خاص لشهر يوليو" />
            </div>

            <div className="ad-input-group">
                <label>وصف الإعلان</label>
                <textarea placeholder="خصم 20% على رسوم الاشتراك"></textarea>
            </div>
        </div>
    );
};

export default AdDetailsForm;
