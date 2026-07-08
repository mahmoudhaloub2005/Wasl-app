import React from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
    return (
        <div className="uploader-container">
            <label className="uploader-label">صورة الإعلان</label>
            <div className="dropzone-box">
                <span className="upload-icon">☁️</span>
                <p className="upload-text">اسحب الصورة هنا أو اضغط للرفع</p>
                <span className="upload-hint">تنسيقات JPG, PNG (حد أقصى 5MB)</span>
            </div>
        </div>
    );
};

export default ImageUploader;