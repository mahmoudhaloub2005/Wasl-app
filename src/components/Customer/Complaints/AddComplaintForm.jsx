import { useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

function AddComplaintForm({
  editingComplaint,
  onAddComplaint,
  onUpdateComplaint,
  onCancelEdit,
}) {
  const [provider, setProvider] = useState("مولد النور");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const providers = [
    "مولد النور",
    "مولد الأمان",
    "سولار ستريم للحلول",
    "سيتي جريد للطاقة",
  ];

  useEffect(() => {
    if (editingComplaint) {
      setProvider(editingComplaint.provider);
      setTitle(editingComplaint.title);
      setDescription(editingComplaint.description);
      setErrorMessage("");
      return;
    }

    resetForm();
  }, [editingComplaint]);

  const resetForm = () => {
    setProvider("مولد النور");
    setTitle("");
    setDescription("");
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage("يرجى كتابة عنوان الشكوى.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("يرجى كتابة تفاصيل الشكوى.");
      return;
    }

    const complaintData = {
      provider,
      title,
      description,
    };

    if (editingComplaint) {
      onUpdateComplaint?.(complaintData);
    } else {
      onAddComplaint?.(complaintData);
    }

    resetForm();
  };

  const handleCancelEdit = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <aside className="add-complaint-card">
      <h2>{editingComplaint ? "تعديل الشكوى" : "أضف شكوى"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="complaint-form-group">
          <label htmlFor="complaintProvider">اختر المزود</label>

          <div className="complaint-select-wrapper">
            <select
              id="complaintProvider"
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
              className="complaint-provider-select"
            >
              {providers.map((providerName) => (
                <option value={providerName} key={providerName}>
                  {providerName}
                </option>
              ))}
            </select>

            <IoChevronDownOutline className="complaint-select-arrow" />
          </div>
        </div>

        <div className="complaint-form-group">
          <label htmlFor="complaintTitle">عنوان الشكوى</label>

          <input
            id="complaintTitle"
            className="complaint-title-input"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setErrorMessage("");
            }}
            placeholder="مثلاً: انقطاع متكرر في الخدمة"
          />
        </div>

        <div className="complaint-form-group">
          <label htmlFor="complaintDescription">تفاصيل الشكوى</label>

          <textarea
            id="complaintDescription"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setErrorMessage("");
            }}
            placeholder="اكتب تفاصيل المشكلة هنا..."
          />
        </div>

        {errorMessage && (
          <p className="complaint-form-error">{errorMessage}</p>
        )}

        <button type="submit" className="send-complaint-button">
          {editingComplaint ? "حفظ التعديل" : "إرسال الشكوى"}
        </button>

        {editingComplaint && (
          <button
            type="button"
            className="cancel-edit-complaint-button"
            onClick={handleCancelEdit}
          >
            إلغاء التعديل
          </button>
        )}
      </form>
    </aside>
  );
}

export default AddComplaintForm;