import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronDownOutline, IoCloudUploadOutline } from "react-icons/io5";
import "./CustomerComplaints.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import CustomerActionSuccessModal from "../Shared/CustomerActionSuccessModal";
import { createComplaint } from "../../../services/complaintService";
import { getGenerators } from "../../../services/generatorService";
import { getApiErrorMessage } from "../../../utils/apiError";

const fallbackComplaints = [
  {
    id: 1,
    title: "تأخر في تحديث الفاتورة الشهرية",
    details:
      "لقد قمت بسداد المبلغ ولكن لا يزال يظهر في لوحة التحكم أنني لم أسدد...",
    date: "12 أكتوبر 2023",
    status: "pending",
    statusText: "قيد المراجعة",
  },
  {
    id: 2,
    title: "انقطاع مفاجئ للخدمة لمدة 4 ساعات",
    details:
      "انقطعت الكهرباء عن الحي بالكامل ولم يتم الرد على الهواتف الأرضية...",
    date: "05 أكتوبر 2023",
    status: "resolved",
    statusText: "تم الحل",
  },
  {
    id: 3,
    title: "طلب زيادة قدرة الأمبير مجانا",
    details:
      "أرغب في زيادة الاشتراك من 5 أمبير إلى 10 أمبير بدون دفع رسوم إضافية...",
    date: "28 سبتمبر 2023",
    status: "rejected",
    statusText: "مرفوضة",
  },
];

function buildProviderOptions(generators = []) {
  const providersMap = new Map();

  generators.forEach((generator) => {
    const providerId = generator.provider?.id;

    if (!providerId) {
      return;
    }

    const key = String(providerId);

    if (!providersMap.has(key)) {
      const displayName =
        generator.name || generator.provider?.name || `مزود الخدمة ${providersMap.size + 1}`;

      providersMap.set(key, {
        id: key,
        name: displayName,
      });
    }
  });

  return Array.from(providersMap.values());
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
  const [complaints, setComplaints] = useState(fallbackComplaints);
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

    async function loadComplaintProviders() {
      try {
        setLoading(true);
        setPageMessage("");

        const generators = await getGenerators();

        if (isMounted) {
          const providers = buildProviderOptions(generators);
          setProviderOptions(providers);
          setTargetId((currentTargetId) =>
            currentTargetId || providers[0]?.id || ""
          );
        }
      } catch (error) {
        console.error("Failed to load provider options:", error);

        if (isMounted) {
          setPageMessage("تعذر تحميل قائمة المزودين من الخادم، حاول مرة أخرى.");
          setProviderOptions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadComplaintProviders();

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

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    setAttachmentFile(file || null);
    setAttachmentName(file ? file.name : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !details.trim()) {
      setErrorMessage("يرجى تعبئة عنوان الشكوى ووصف الشكوى بالتفصيل.");
      return;
    }

    if (!targetId) {
      setErrorMessage("يرجى اختيار المزود قبل إرسال الشكوى.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const complaint = await createComplaint({
        title,
        details,
        file: attachmentFile,
        targetId,
      });

      setComplaints((prevComplaints) => [complaint, ...prevComplaints]);
      setTitle("");
      setDetails("");
      setAttachmentName("");
      setAttachmentFile(null);
      setSelectedFilter("all");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      setErrorMessage(
        getApiErrorMessage(error, "تعذر إرسال الشكوى للخادم. حاول مرة أخرى.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="customer-complaints-page" dir="rtl">
      <div className="customer-complaints-container">
        <ReviewsComplaintsTabs />

        {loading && (
          <p className="subscription-action-message">جاري تحميل الشكاوى...</p>
        )}

        {pageMessage && (
          <p className="subscription-action-message">{pageMessage}</p>
        )}

        <div className="complaints-content-grid">
          <aside className="new-complaint-card">
            <h2>تقديم شكوى جديدة</h2>

            <form onSubmit={handleSubmit}>
              <div className="complaint-form-group">
                <label htmlFor="complaintProvider">اختر المزود</label>
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
                    <option value="">لا يوجد مزودون متاحون</option>
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
                {isSubmitting ? "جاري إرسال الشكوى..." : "إرسال الشكوى"}
              </button>
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
              {filteredComplaints.length > 0 ? (
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
                  </article>
                ))
              ) : (
                <article className="complaint-history-card pending">
                  <div className="complaint-history-top">
                    <span className="complaint-date">-</span>
                    <span className="complaint-status pending">لا يوجد</span>
                  </div>

                  <h3>لا توجد شكاوى مطابقة</h3>
                  <p>جرب تغيير الفلتر لعرض نتائج أخرى.</p>
                </article>
              )}
            </div>
          </section>
        </div>
      </div>

      {showSuccessModal && (
        <CustomerActionSuccessModal
          title="تم إرسال الشكوى بنجاح"
          description="تم استلام الشكوى بنجاح، وسيتم مراجعتها من قبل مزود الخدمة في أقرب وقت."
          onClose={() => setShowSuccessModal(false)}
          onSupport={() => navigate("/contact-us")}
        />
      )}
    </main>
  );
}

export default CustomerComplaints;
