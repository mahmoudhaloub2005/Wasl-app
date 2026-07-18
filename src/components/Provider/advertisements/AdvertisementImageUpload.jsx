import { FiTrash2, FiUploadCloud } from "react-icons/fi";

function AdvertisementImageUpload({
  errorMessage = "",
  id,
  inputRef,
  isDragActive,
  isProcessing,
  onBlur,
  onDragLeave,
  onDragOver,
  onDrop,
  onInputChange,
  onOpenFilePicker,
  onRemove,
  previewUrl,
}) {
  const describedBy = errorMessage ? `${id}-error` : `${id}-hint`;

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenFilePicker();
    }
  }

  return (
    <div className="add-advertisement-field add-advertisement-field--upload">
      <label htmlFor={id}>صورة الإعلان</label>

      <div
        className={`add-advertisement-upload ${
          isDragActive ? "add-advertisement-upload--drag-active" : ""
        } ${previewUrl ? "add-advertisement-upload--has-preview" : ""} ${
          errorMessage ? "add-advertisement-upload--invalid" : ""
        }`}
        role="button"
        tabIndex={0}
        aria-label="اختيار صورة الإعلان"
        aria-describedby={describedBy}
        aria-invalid={Boolean(errorMessage)}
        onBlur={onBlur}
        onClick={onOpenFilePicker}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onKeyDown={handleKeyDown}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="معاينة صورة الإعلان" />
            <button
              type="button"
              className="add-advertisement-upload__remove"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              aria-label="إزالة صورة الإعلان"
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </>
        ) : (
          <div className="add-advertisement-upload__placeholder">
            <FiUploadCloud aria-hidden="true" />
            <strong>
              {isProcessing
                ? "جارٍ تجهيز المعاينة..."
                : "اسحب الصورة هنا أو اضغط للرفع"}
            </strong>
            <span id={`${id}-hint`}>تنسيقات PNG و JPG، الحد الأقصى 5MB</span>
          </div>
        )}
      </div>

      <input
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        hidden
        id={id}
        onChange={onInputChange}
        ref={inputRef}
        type="file"
      />

      {errorMessage && (
        <p className="add-advertisement-field__error" id={`${id}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default AdvertisementImageUpload;
