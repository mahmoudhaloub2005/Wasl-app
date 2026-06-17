import { useState } from "react";
import "./ProviderDocuments.css";
import {
  FiCheck,
  FiFileText,
  FiUploadCloud,
  FiImage,
  FiAward,
  FiClipboard,
  FiArrowLeft,
} from "react-icons/fi";

function useProviderDocuments() {
  const [files, setFiles] = useState({
    idFile: null,
    ownershipFile: null,
    licenseFile: null,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleFileChange = (fileType, file) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: file,
    }));

    setMessage("");
    setMessageType("");
  };

  const canSubmit = files.idFile && files.ownershipFile;

  const handleSubmit = () => {
    if (!canSubmit) {
      setMessage("يرجى رفع صورة الهوية وإثبات الملكية قبل تقديم الطلب");
      setMessageType("error");
      return;
    }

    console.log("صورة الهوية:", files.idFile);
    console.log("إثبات الملكية:", files.ownershipFile);
    console.log("الرخصة:", files.licenseFile);

    setMessage("تم تقديم الطلب بنجاح، سيتم مراجعته خلال 24-48 ساعة");
    setMessageType("success");
  };

  return {
    files,
    message,
    messageType,
    canSubmit,
    handleFileChange,
    handleSubmit,
  };
}

function ProviderDocuments() {
  const {
    files,
    message,
    messageType,
    handleFileChange,
    handleSubmit,
  } = useProviderDocuments();

  return (
    <main className="provider-documents-page">
      {/* Steps */}
      <div className="provider-documents-steps">
        <div className="provider-documents-step active">
          <div className="provider-documents-circle">3</div>
          <span>تأكيد الحساب</span>
        </div>

        <div className="provider-documents-line"></div>

        <div className="provider-documents-step done">
          <div className="provider-documents-circle">
            <FiCheck />
          </div>
          <span>بيانات المولد</span>
        </div>

        <div className="provider-documents-line"></div>

        <div className="provider-documents-step done">
          <div className="provider-documents-circle">
            <FiCheck />
          </div>
          <span>المعلومات الشخصية</span>
        </div>
      </div>

      {/* Heading */}
      <div className="documents-heading">
        <h3>رفع المستندات الرسمية</h3>
        <p>
          يرجى رفع المستندات المطلوبة لإكمال عملية توثيق الحساب وتفعيل الخدمة
        </p>
      </div>

      {/* Upload Cards */}
      <section className="documents-wrapper">
        <div className="documents-row">
          {/* صورة الهوية */}
          <div className="document-card">
            <div className="document-card-header">
              <span className="required">إلزامي</span>

              <div className="document-title">
                <div className="document-icon blue">
                  <FiClipboard />
                </div>
                <h4>صورة الهوية</h4>
              </div>
            </div>

            <p>
              يرجى رفع نسخة واضحة من الهوية الوطنية أو جواز السفر الوجه الأمامي والخلفي.
            </p>

            <label className="upload-area">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) =>
                  handleFileChange("idFile", e.target.files[0])
                }
              />

              <FiUploadCloud className="upload-main-icon" />

              <span>
                اسحب الملف هنا أو <b>تصفح الجهاز</b>
              </span>

              <small>
                {files.idFile ? files.idFile.name : "JPG, PNG حتى 5MB"}
              </small>
            </label>
          </div>

          {/* إثبات الملكية */}
          <div className="document-card">
            <div className="document-card-header">
              <span className="required">إلزامي</span>

              <div className="document-title">
                <div className="document-icon orange">
                  <FiFileText />
                </div>
                <h4>إثبات الملكية</h4>
              </div>
            </div>

            <p>
              عقد الملكية أو إثبات رسمي لامتلاك المولدات والمنشأة المشغلة.
            </p>

            <label className="upload-area">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, application/pdf"
                onChange={(e) =>
                  handleFileChange("ownershipFile", e.target.files[0])
                }
              />

              <FiImage className="upload-main-icon" />

              <span>
                اسحب الملف هنا أو <b>تصفح الجهاز</b>
              </span>

              <small>
                {files.ownershipFile
                  ? files.ownershipFile.name
                  : "PDF, JPG, PNG حتى 10MB"}
              </small>
            </label>
          </div>
        </div>

        {/* الرخصة */}
        <div className="license-document-card">
          <div className="license-info">
            <div className="document-icon green">
              <FiClipboard />
            </div>

            <div>
              <h4>
                الرخصة <span>(اختياري)</span>
              </h4>

              <p>
                رخصة مزاولة النشاط الصادرة من الجهات المعنية إن وجدت،
                تسرع عملية التوثيق.
              </p>
            </div>
          </div>

          <label className="license-upload-area">
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, application/pdf"
              onChange={(e) =>
                handleFileChange("licenseFile", e.target.files[0])
              }
            />

            <FiAward className="upload-main-icon" />
            <span>رفع وثيقة الرخصة</span>

            <small>
              {files.licenseFile
                ? files.licenseFile.name
                : "نسخة صورة واضحة"}
            </small>
          </label>
        </div>
      </section>

      {/* Submit */}
      <section className="documents-submit-section">
        <p className="review-text">
          سيتم مراجعة طلبك من قبل فريق وصل خلال 24-48 ساعة عمل.
          تأكد من أن جميع الملفات واضحة وسارية المفعول لتجنب رفض الطلب.
        </p>

        {message && (
          <p
            className={
              messageType === "success" ? "success-message" : "error-message"
            }
          >
            {message}
          </p>
        )}

        <div className="documents-divider"></div>

        <div className="documents-actions">
          <button
            className="submit-document-btn"
            onClick={handleSubmit}
          >
            تقديم الطلب
          </button>

          <a href="#" className="back-document-link">
            <FiArrowLeft />
            الرجوع للسابق
          </a>
        </div>
      </section>
    </main>
  );
}

export default ProviderDocuments;