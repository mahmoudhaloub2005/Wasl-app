import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronDownOutline, IoCloudUploadOutline } from "react-icons/io5";
import "./CustomerComplaints.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import CustomerActionSuccessModal from "../Shared/CustomerActionSuccessModal";
import {
  createComplaint,
  getComplaints,
} from "../../../services/complaintService";
import { getGenerators } from "../../../services/generatorService";
import { getApiErrorMessage } from "../../../utils/apiError";

const LOCAL_COMPLAINTS_KEY = "customer_local_complaints";
const LOCAL_DELETED_COMPLAINTS_KEY = "customer_deleted_complaints";

function getLocalComplaints() {
  try {
    const value = localStorage.getItem(LOCAL_COMPLAINTS_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Failed to read local complaints:", error);
    return [];
  }
}

function saveLocalComplaints(complaints) {
  try {
    localStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(complaints));
  } catch (error) {
    console.error("Failed to save local complaints:", error);
  }
}

function getDeletedComplaintIds() {
  try {
    const value = localStorage.getItem(LOCAL_DELETED_COMPLAINTS_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Failed to read deleted complaints:", error);
    return [];
  }
}

function saveDeletedComplaintIds(ids) {
  try {
    localStorage.setItem(LOCAL_DELETED_COMPLAINTS_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Failed to save deleted complaints:", error);
  }
}

function mergeComplaints(serverComplaints = [], localComplaints = []) {
  const deletedIds = getDeletedComplaintIds().map(String);
  const map = new Map();

  [...serverComplaints, ...localComplaints].forEach((complaint) => {
    if (!complaint?.id) return;

    if (deletedIds.includes(String(complaint.id))) return;

    map.set(String(complaint.id), complaint);
  });

  return Array.from(map.values());
}

function getTodayDate() {
  return new Date().toLocaleDateString("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildGeneratorOptions(generators = []) {
  return generators
    .filter((generator) => generator.id)
    .map((generator, index) => ({
      id: String(generator.id),
      name:
        generator.name ||
        generator.generatorType ||
        generator.provider?.name ||
        `مولد ${index + 1}`,
    }));
}

function getProviderName(providerOptions, targetId) {
  return (
    providerOptions.find((provider) => String(provider.id) === String(targetId))
      ?.name || "المولد"
  );
}

function normalizeLocalComplaint(data = {}) {
  return {
    id: data.id || `local-complaint-${Date.now()}`,
    targetId: data.targetId || "",
    provider: data.provider || "المولد",
    title: data.title || "",
    details: data.details || "",
    attachmentName: data.attachmentName || "",
    date: data.date || getTodayDate(),
    status: data.status || "pending",
    statusText: data.statusText || "قيد المراجعة",
  };
}

function CustomerComplaints() {
  const navigate = useNavigate();

  const [targetId, setTargetId] = useState("");
  const [providerOptions, setProviderOptions] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filterOptions = [
    { value: "all", label: "الكل" },
    { value: "pending", label: "قيد المراجعة" },
    { value: "resolved", label: "تم الحل" },
    { value: "rejected", label: "مرفوضة" },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadComplaintsPageData() {
      try {
        setLoading(true);
        setPageMessage("");

        const localComplaints = getLocalComplaints();

        const [generatorsResult, complaintsResult] = await Promise.allSettled([
          getGenerators(),
          getComplaints(),
        ]);

        if (isMounted) {
          const nextMessages = [];

          if (generatorsResult.status === "fulfilled") {
            const providers = buildGeneratorOptions(generatorsResult.value);
            setProviderOptions(providers);
            setTargetId((currentTargetId) =>
              currentTargetId || providers[0]?.id || ""
            );
          } else {
            console.error(
              "Failed to load provider options:",
              generatorsResult.reason
            );

            setProviderOptions([]);
            setTargetId("");

            if (
              generatorsResult.reason?.response?.status !== 404 &&
              generatorsResult.reason?.response?.status !== 405
            ) {
              nextMessages.push("تعذر تحميل قائمة المولدات من الخادم.");
            }
          }

          if (complaintsResult.status === "fulfilled") {
            const serverComplaints = Array.isArray(complaintsResult.value)
              ? complaintsResult.value
              : [];

            setComplaints(mergeComplaints(serverComplaints, localComplaints));
          } else {
            console.error("Failed to load complaints:", complaintsResult.reason);

            setComplaints(localComplaints);

            if (
              complaintsResult.reason?.response?.status !== 404 &&
              complaintsResult.reason?.response?.status !== 405
            ) {
              nextMessages.push("تعذر تحميل الشكاوى من الخادم.");
            }
          }

          setPageMessage(nextMessages.join(" "));
        }
      } catch (error) {
        console.error("Failed to load complaints page:", error);

        if (isMounted) {
          setPageMessage("تعذر تحميل البيانات من الخادم.");
          setProviderOptions([]);
          setComplaints(getLocalComplaints());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadComplaintsPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedFilterLabel =
    filterOptions.find((option) => option.value === selectedFilter)?.label ||
    "الكل";

  const filteredComplaints = useMemo(() => {
    if (selectedFilter === "all") {
      return complaints;
    }

    return complaints.filter((complaint) => complaint.status === selectedFilter);
  }, [complaints, selectedFilter]);

  const resetForm = () => {
    setTitle("");
    setDetails("");
    setAttachmentName("");
    setAttachmentFile(null);
    setEditingComplaint(null);
    setErrorMessage("");
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    setAttachmentFile(file || null);
    setAttachmentName(file ? file.name : "");
  };

  const handleStartEditComplaint = (complaint) => {
    setEditingComplaint(complaint);
    setTargetId(complaint.targetId || targetId);
    setTitle(complaint.title || "");
    setDetails(complaint.details || "");
    setAttachmentName(complaint.attachmentName || "");
    setAttachmentFile(null);
    setErrorMessage("");
    setPageMessage("");
  };

  const handleCancelEditComplaint = () => {
    resetForm();
  };

  const handleDeleteComplaint = (complaintId) => {
    if (!complaintId) {
      setPageMessage("لا يمكن حذف الشكوى لأن رقم الشكوى غير موجود.");
      return;
    }

    const confirmed = window.confirm("هل أنت متأكد من حذف هذه الشكوى؟");

    if (!confirmed) return;

    const deletedIds = getDeletedComplaintIds();
    const nextDeletedIds = Array.from(
      new Set([...deletedIds.map(String), String(complaintId)])
    );

    saveDeletedComplaintIds(nextDeletedIds);

    setComplaints((prevComplaints) => {
      const nextComplaints = prevComplaints.filter(
        (complaint) => String(complaint.id) !== String(complaintId)
      );

      saveLocalComplaints(nextComplaints);
      return nextComplaints;
    });

    if (String(editingComplaint?.id) === String(complaintId)) {
      resetForm();
    }

    setPageMessage("تم حذف الشكوى بنجاح.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !details.trim()) {
      setErrorMessage("يرجى تعبئة عنوان الشكوى ووصف الشكوى بالتفصيل.");
      return;
    }

    if (!targetId) {
      setErrorMessage("يرجى اختيار المولد قبل إرسال الشكوى.");
      return;
    }

    if (editingComplaint) {
      const updatedComplaint = normalizeLocalComplaint({
        ...editingComplaint,
        targetId,
        provider: getProviderName(providerOptions, targetId),
        title: title.trim(),
        details: details.trim(),
        attachmentName,
        status: editingComplaint.status || "pending",
        statusText: editingComplaint.statusText || "قيد المراجعة",
      });

      setComplaints((prevComplaints) => {
        const nextComplaints = prevComplaints.map((complaint) =>
          String(complaint.id) === String(editingComplaint.id)
            ? updatedComplaint
            : complaint
        );

        saveLocalComplaints(nextComplaints);
        return nextComplaints;
      });

      resetForm();
      setSelectedFilter("all");
      setPageMessage("تم تعديل الشكوى بنجاح.");
      return;
    }

    const localComplaint = normalizeLocalComplaint({
      targetId,
      provider: getProviderName(providerOptions, targetId),
      title: title.trim(),
      details: details.trim(),
      attachmentName,
      status: "pending",
      statusText: "قيد المراجعة",
    });

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setPageMessage("");

      const createdComplaint = await createComplaint({
        title,
        details,
        file: attachmentFile,
        targetId,
      });

      const finalComplaint = normalizeLocalComplaint({
        ...localComplaint,
        ...createdComplaint,
        targetId: createdComplaint.targetId || targetId,
        provider:
          createdComplaint.provider || getProviderName(providerOptions, targetId),
        title: createdComplaint.title || localComplaint.title,
        details: createdComplaint.details || localComplaint.details,
        attachmentName,
        status: createdComplaint.status || "pending",
        statusText: createdComplaint.statusText || "قيد المراجعة",
      });

      setComplaints((prevComplaints) => {
        const nextComplaints = [finalComplaint, ...prevComplaints];
        saveLocalComplaints(nextComplaints);
        return nextComplaints;
      });

      resetForm();
      setSelectedFilter("all");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to submit complaint:", error);

      setComplaints((prevComplaints) => {
        const nextComplaints = [localComplaint, ...prevComplaints];
        saveLocalComplaints(nextComplaints);
        return nextComplaints;
      });

      resetForm();
      setSelectedFilter("all");

      setPageMessage(
        getApiErrorMessage(
          error,
          "تم حفظ الشكوى محلياً، لكن تعذر إرسالها للخادم حالياً."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="customer-complaints-page" dir="rtl">
      <div className="customer-complaints-container">
        <ReviewsComplaintsTabs />

        {pageMessage && (
          <p className="subscription-action-message">{pageMessage}</p>
        )}

        <div className="complaints-content-grid">
          <aside className="new-complaint-card">
            <h2>{editingComplaint ? "تعديل الشكوى" : "تقديم شكوى جديدة"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="complaint-form-group">
                <label htmlFor="complaintProvider">اختر المولد</label>
                <select
                  id="complaintProvider"
                  value={targetId}
                  onChange={(event) => {
                    setTargetId(event.target.value);
                    setErrorMessage("");
                  }}
                  disabled={!providerOptions.length}
                >
                  {!providerOptions.length && (
                    <option value="">لا توجد مولدات متاحة</option>
                  )}

                  {providerOptions.map((provider) => (
                    <option value={provider.id} key={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="complaint-form-group">
                <label htmlFor="complaintTitle">عنوان الشكوى</label>
                <input
                  id="complaintTitle"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="مثال: انقطاع التيار الكهربائي المتكرر"
                />
              </div>

              <div className="complaint-form-group">
                <label htmlFor="complaintDetails">وصف الشكوى بالتفصيل</label>
                <textarea
                  id="complaintDetails"
                  value={details}
                  onChange={(event) => {
                    setDetails(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="اشرح المشكلة التي واجهتها..."
                />
              </div>

              <div className="complaint-form-group">
                <label>إرفاق صورة (اختياري)</label>

                <label className="complaint-upload-box">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleAttachmentChange}
                  />

                  <IoCloudUploadOutline />
                  <span>
                    {attachmentName || "انقر هنا أو اسحب الملف لرفعه"}
                  </span>
                </label>
              </div>

              {errorMessage && (
                <p className="complaint-form-error">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="send-complaint-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "جاري إرسال الشكوى..."
                  : editingComplaint
                    ? "حفظ التعديل"
                    : "إرسال الشكوى"}
              </button>

              {editingComplaint && (
                <button
                  type="button"
                  className="cancel-complaint-edit-button"
                  onClick={handleCancelEditComplaint}
                >
                  إلغاء التعديل
                </button>
              )}
            </form>
          </aside>

          <section className="previous-complaints-section">
            <div className="complaints-section-header">
              <h1>قائمة الشكاوى السابقة</h1>

              <div className="complaints-filter-wrapper">
                <button
                  type="button"
                  className="complaints-filter"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                >
                  <span>فلترة:</span>
                  <strong>{selectedFilterLabel}</strong>
                  <IoChevronDownOutline
                    className={
                      isFilterOpen ? "filter-arrow open" : "filter-arrow"
                    }
                  />
                </button>

                {isFilterOpen && (
                  <div className="complaints-filter-menu">
                    {filterOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={
                          selectedFilter === option.value
                            ? "filter-menu-item active"
                            : "filter-menu-item"
                        }
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="complaints-cards-list">
              {loading ? (
                <article className="complaint-history-card pending">
                  <div className="complaint-history-top">
                    <span className="complaint-date">-</span>
                    <span className="complaint-status pending">تحميل</span>
                  </div>

                  <h3>جاري تحميل الشكاوى...</h3>
                  <p>نحضّر بياناتك من الخادم.</p>
                </article>
              ) : filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <article
                    className={`complaint-history-card ${complaint.status}`}
                    key={complaint.id}
                  >
                    <div className="complaint-history-top">
                      <span className="complaint-date">{complaint.date}</span>
                      <span className={`complaint-status ${complaint.status}`}>
                        {complaint.statusText}
                      </span>
                    </div>

                    <h3>{complaint.title}</h3>
                    <p>{complaint.details}</p>

                    {complaint.provider && (
                      <p className="complaint-provider-name">
                        المولد: {complaint.provider}
                      </p>
                    )}

                    {complaint.attachmentName && (
                      <p className="complaint-attachment-name">
                        المرفق: {complaint.attachmentName}
                      </p>
                    )}

                    <div className="complaint-card-actions">
                      <button
                        type="button"
                        onClick={() => handleStartEditComplaint(complaint)}
                      >
                        تعديل
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDeleteComplaint(complaint.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <article className="complaint-history-card pending">
                  <div className="complaint-history-top">
                    <span className="complaint-date">-</span>
                    <span className="complaint-status pending">لا يوجد</span>
                  </div>

                  <h3>لا توجد بيانات حالياً</h3>
                  <p>
                    {selectedFilter === "all"
                      ? "عند إرسال شكوى جديدة ستظهر هنا."
                      : "جرب تغيير الفلتر لعرض نتائج أخرى."}
                  </p>
                </article>
              )}
            </div>
          </section>
        </div>
      </div>

      {showSuccessModal && (
        <CustomerActionSuccessModal
          title="تم إرسال الشكوى بنجاح"
          description="تم استلام الشكوى بنجاح، وسيتم مراجعتها في أقرب وقت."
          onClose={() => setShowSuccessModal(false)}
          onSupport={() => navigate("/contact-us")}
        />
      )}
    </main>
  );
}

export default CustomerComplaints;