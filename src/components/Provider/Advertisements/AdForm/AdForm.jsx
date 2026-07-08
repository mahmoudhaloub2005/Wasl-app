import "./AdForm.css";

function AdForm() {
  return (
    <div className="ad-form">

      <h2>إنشاء إعلان جديد</h2>

      <div className="upload-box">
        <p>اضغط لإضافة صورة</p>
      </div>

      <label>عنوان الإعلان</label>
      <input
        type="text"
        placeholder=" اشتراك 5 أمبير"
      />

      <label>السعر</label>
      <input
        type="number"
        placeholder="15"
      />

      <label>وصف الإعلان</label>

      <textarea
        rows="5"
        placeholder=" وصف الإعلان..."
      ></textarea>

      <button>
        نشر الإعلان
      </button>

    </div>
  );
}

export default AdForm;

