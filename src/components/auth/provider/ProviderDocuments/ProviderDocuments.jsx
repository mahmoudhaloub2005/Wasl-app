import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerProvider } from "../../../../services/authService";
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

function splitFullName(fullName = "") {
  const nameParts = fullName.trim().split(/\s+/);
  return {
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || nameParts[0] || "",
  };
}

function buildProviderRegistrationForm(providerData, generatorData, files) {
  const formData = new FormData();
  const { firstName, lastName } = splitFullName(providerData.fullName);

  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("email", providerData.email);
  formData.append("password", providerData.password);
  formData.append("password_confirmation", providerData.password);
  formData.append("phone", providerData.phone);
  formData.append("company_name", providerData.facilityName);
  formData.append("generator_type", generatorData.generatorType);
  formData.append("generator_powerKW", generatorData.capacity);
  formData.append("generator_gps", generatorData.location);
  formData.append("generator_price", generatorData.price);

  if (files.ownershipFile) formData.append("proofs[]", files.ownershipFile);
  if (files.idFile) formData.append("proofs[]", files.idFile);
  if (files.licenseFile) formData.append("proofs[]", files.licenseFile);

  return formData;
}

function getApiErrorMessage(error, fallback) {
  const firstError = error.response?.data?.errors
    ? Object.values(error.response.data.errors)[0]?.[0]
    : null;

  return firstError || error.response?.data?.message || error.message || fallback;
}

function useProviderDocuments(navigate, providerData, generatorData) {
  const [files, setFiles] = useState({
    idFile: null,
    ownershipFile: null,
    licenseFile: null,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (fileType, file) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: file,
    }));

    setMessage("");
    setMessageType("");
  };

  const canSubmit = files.idFile && files.ownershipFile;

  const handleSubmit = async () => {
    if (submitting) return;

    if (!providerData || !generatorData) {
      setMessage("بيانات التسجيل غير مكتملة، يرجى الرجوع وإكمال الخطوات السابقة");
      setMessageType("error");
      return;
    }

    if (!canSubmit) {
      setMessage("يرجى رفع صورة الهوية وإثبات الملكية قبل تقديم الطلب");
      setMessageType("error");
      return;
    }

    console.log("صورة الهوية:", files.idFile);
    console.log("إثبات الملكية:", files.ownershipFile);
    console.log("الرخصة:", files.licenseFile);

    setMessage("");
    setMessageType("");
    setSubmitting(true);

    try {
      const requestData = buildProviderRegistrationForm(
        providerData,
        generatorData,
        files
      );

      await registerProvider(requestData);

      navigate("/provider-pending", {
        state: {
          files,
          providerData,
          generatorData,
        },
      });
    } catch (error) {
      console.error("Provider register error:", error);
      setMessage(
        getApiErrorMessage(error, "تعذر إرسال طلب تسجيل المزود، حاول مرة أخرى")
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/provider-generator-info", {
      state: {
        providerData,
        generatorData,
      },
    });
  };

  return {
    files,
    message,
    messageType,
    submitting,
    handleFileChange,
    handleSubmit,
    handleBack,
  };
}

function ProviderDocuments() {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const providerData = locationState.providerData || null;
  const generatorData = locationState.generatorData || null;

  const {
    files,
    message,
    messageType,
    submitting,
    handleFileChange,
    handleSubmit,
    handleBack,
  } = useProviderDocuments(navigate, providerData, generatorData);

  return (
    <main className="provider-documents-page">
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

      <div className="documents-heading">
        <h3>رفع المستندات الرسمية</h3>
        <p>
          يرجى رفع المستندات المطلوبة لإكمال عملية توثيق الحساب وتفعيل الخدمة
        </p>
      </div>

      <section className="documents-wrapper">
        <div className="documents-row">
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

        {submitting && (
          <p className="success-message">جاري تقديم الطلب...</p>
        )}

        <div className="documents-divider"></div>

        <div className="documents-actions">
          <button
            type="button"
            className="submit-document-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            تقديم الطلب
          </button>

          <button
            type="button"
            className="back-document-link"
            onClick={handleBack}
          >
            <FiArrowLeft />
            الرجوع للسابق
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProviderDocuments;
