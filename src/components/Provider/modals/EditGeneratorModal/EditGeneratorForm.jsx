
import React from 'react';
import './EditGeneratorForm.css';

const EditGeneratorForm = () => {
  return (
    <div className="edit-form-container">
      <div className="edit-input-group">
        <label>اسم المولد</label>
        <input type="text" defaultValue="مولد القطاع الشمالي (C-102)" />
      </div>

      <div className="edit-input-group">
        <label>الموقع</label>
        <input type="text" defaultValue="القطاع الشمالي - المنطقة أ" />
      </div>
        <div className="edit-form-row">
        <div className="edit-input-group">
          <label>القدرة (KVA)</label>
          <input type="number" defaultValue="250" />
        </div>
        
        <div className="edit-input-group">
          <label>سعر الأمبير</label>
          <input type="number" defaultValue="60" />
        </div>
      </div>

      <div className="edit-input-group">
        <label>حالة الصيانة</label>
        <div className="select-wrapper">
          <select defaultValue="efficient">
            <option value="efficient">يعمل بكفاءة</option>
            <option value="under_maintenance">قيد الإصلاح</option>
            <option value="stopped">متوقف</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditGeneratorForm;
