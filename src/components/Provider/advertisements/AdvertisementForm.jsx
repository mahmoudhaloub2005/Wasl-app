import { useRef, useState } from "react";
import {
  FiImage,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

const MAX_UPLOAD_SIZE_MB = 5;
const MAX_UPLOAD_SIZE_BYTES =
  MAX_UPLOAD_SIZE_MB * 1024 * 1024;

function getInitialFormValues(advertisement) {
  return {
    description: advertisement?.description || "",
    imageUrl: advertisement?.imageUrl || "",

    price:
      advertisement?.price === undefined ||
      advertisement?.price === null
        ? ""
        : String(advertisement.price),

    title: advertisement?.title || "",
  };
}

function getEmptyFormValues() {
  return getInitialFormValues(null);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}

function validateForm(values) {
  const errors = [];

  if (!values.title.trim()) {
    errors.push("يرجى إدخال اسم العرض.");
  }

  if (!values.description.trim()) {
    errors.push("يرجى كتابة وصف الإعلان.");
  }

  return errors;
}

function AdvertisementForm({
  advertisement,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}) {
  const fileInputRef = useRef(null);

  const [formValues, setFormValues] = useState(() =>
    getInitialFormValues(advertisement)
  );

  const [validationMessages, setValidationMessages] =
    useState([]);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const isEditing = Boolean(advertisement);

  function updateField(fieldName, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  }

  async function handleSelectedFile(file) {
    setUploadMessage("");

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    ) {
      setUploadMessage(
        "صيغة الصورة يجب أن تكون PNG أو JPG."
      );

      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadMessage(
        `حجم الصورة يجب ألا يتجاوز ${MAX_UPLOAD_SIZE_MB}MB.`
      );

      return;
    }

    try {
      /*
       * هنا نقرأ الصورة فقط للمعاينة داخل الواجهة.
       *
       * هذا لا يعني أننا نرسل Base64 إلى الـ API.
       * الإعلان نفسه سيتم نشره بشكل طبيعي.
       */
      const imageUrl =
        await readFileAsDataUrl(file);

      updateField(
        "imageUrl",
        imageUrl
      );

      /*
       * لا نعرض رسالة Unsupported.
       * الصورة أصبحت موجودة كمعاينة فقط.
       */
      setUploadMessage(
        "تم اختيار الصورة بنجاح."
      );
    } catch {
      setUploadMessage(
        "تعذر قراءة الصورة. حاول اختيار ملف آخر."
      );
    }
  }

  function handleFileInputChange(event) {
    handleSelectedFile(
      event.target.files?.[0]
    );

    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();

    handleSelectedFile(
      event.dataTransfer.files?.[0]
    );
  }

  function handleUploadKeyDown(event) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      fileInputRef.current?.click();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextValidationMessages =
      validateForm(formValues);

    setValidationMessages(
      nextValidationMessages
    );

    if (
      nextValidationMessages.length
    ) {
      return;
    }

    try {
      /*
       * نرسل البيانات التي يدعمها إنشاء الإعلان.
       *
       * الصورة لا تمنع عملية النشر.
       */
      await onSubmit({
        title: formValues.title.trim(),

        description:
          formValues.description.trim(),

        price:
          formValues.price === ""
            ? undefined
            : Number(formValues.price),
      });

      if (!isEditing) {
        setFormValues(
          getEmptyFormValues()
        );

        setUploadMessage("");
        setValidationMessages([]);
      }
    } catch {
      /*
       * الخطأ يعرضه الـ page-level alert.
       */
    }
  }

  return (
    <section
      className="advertisement-form-card"
      aria-labelledby="ad-form-title"
    >
      <h2 id="ad-form-title">
        {isEditing
          ? "تعديل الإعلان"
          : "إضافة إعلان جديد"}
      </h2>

      <form
        className="advertisement-form"
        onSubmit={handleSubmit}
      >
        {/* صورة الإعلان */}

        <div className="advertisement-form__field advertisement-form__field--upload">
          <label htmlFor="advertisement-image">
            صورة الإعلان
          </label>

          <div
            className={`advertisement-form__upload ${
              formValues.imageUrl
                ? "advertisement-form__upload--has-image"
                : ""
            }`}
            onClick={() =>
              fileInputRef.current?.click()
            }
            onDragOver={(event) =>
              event.preventDefault()
            }
            onDrop={handleDrop}
            onKeyDown={handleUploadKeyDown}
            role="button"
            tabIndex={0}
          >
            {formValues.imageUrl ? (
              <>
                <img
                  src={formValues.imageUrl}
                  alt="معاينة صورة الإعلان"
                />

                <button
                  type="button"
                  className="advertisement-form__remove-image"
                  onClick={(event) => {
                    event.stopPropagation();

                    updateField(
                      "imageUrl",
                      ""
                    );

                    setUploadMessage("");
                  }}
                  aria-label="إزالة صورة الإعلان"
                >
                  <FiX aria-hidden="true" />
                </button>
              </>
            ) : (
              <div className="advertisement-form__upload-placeholder">
                <FiUploadCloud aria-hidden="true" />

                <strong>
                  اسحب الصورة هنا أو اضغط للرفع
                </strong>

                <span>
                  تنسيقات PNG و JPG بحد أقصى 5MB
                </span>
              </div>
            )}
          </div>

          <input
            type="file"
            id="advertisement-image"
            ref={fileInputRef}
            accept="image/png,image/jpeg"
            onChange={handleFileInputChange}
            hidden
          />

          {uploadMessage && (
            <p className="advertisement-form__field-message">
              {uploadMessage}
            </p>
          )}
        </div>

        {/* الاسم والسعر */}

        <div className="advertisement-form__split">
          <div className="advertisement-form__field">
            <label htmlFor="advertisement-title">
              اسم العرض
            </label>

            <input
              id="advertisement-title"
              type="text"
              value={formValues.title}
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value
                )
              }
              placeholder="مثلاً: باقة العيد"
            />
          </div>

          <div className="advertisement-form__field">
            <label htmlFor="advertisement-price">
              السعر (شيكل)
            </label>

            <input
              id="advertisement-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={formValues.price}
              onChange={(event) =>
                updateField(
                  "price",
                  event.target.value
                )
              }
              placeholder="0.00"
            />
          </div>
        </div>

        {/* الوصف */}

        <div className="advertisement-form__field">
          <label htmlFor="advertisement-description">
            وصف الإعلان
          </label>

          <textarea
            id="advertisement-description"
            value={formValues.description}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            placeholder="اكتب تفاصيل العرض والخدمات المشمولة..."
          />
        </div>

        {/* أخطاء التحقق */}

        {validationMessages.length > 0 && (
          <div
            className="advertisement-form__errors"
            role="alert"
          >
            <FiImage aria-hidden="true" />

            <div>
              {validationMessages.map(
                (message) => (
                  <p key={message}>
                    {message}
                  </p>
                )
              )}
            </div>
          </div>
        )}

        {/* زر النشر */}

        <button
          type="submit"
          className="advertisement-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "جاري النشر..."
            : isEditing
            ? "حفظ التعديلات"
            : "نشر الإعلان الآن"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="advertisement-form__cancel"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            إلغاء التعديل
          </button>
        )}
      </form>
    </section>
  );
}

export default AdvertisementForm;