import { useMemo, useState } from "react";
import "./CustomerComplaints.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import { IoChevronDownOutline, IoCloudUploadOutline } from "react-icons/io5";

function CustomerComplaints() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "تأخر في تحديث الفاتورة الشهرية",
      details: "لقد قمت بسداد المبلغ ولكن لا يزال يظهر في لوحة التحكم أنني لم أسدد...",
      date: "12 أكتوبر 2023",
      status: "pending",
      statusText: "قيد المراجعة",
    },
    {
      id: 2,
      title: "انقطاع مفاجئ للخدمة لمدة 4 ساعات",
      details: "انقطعت الكهرباء عن الحي بالكامل ولم يتم الرد على الهواتف الأرضية...",
      date: "05 أكتوبر 2023",
      status: "resolved",
      statusText: "تم الحل",
    },
    {
      id: 3,
      title: "طلب زيادة قدرة الأمبير مجاناً",
      details: "أرغب في زيادة الاشتراك من 5 أمبير إلى 10 أمبير بدون دفع رسوم إضافية...",
      date: "28 سبتمبر 2023",
      status: "rejected",
      statusText: "مرفوضة",
    },
  ]);

  const filterOptions = [
    { value: "all", label: "الكل" },
    { value: "pending", label: "قيد المراجعة" },
    { value: "resolved", label: "تم الحل" },
    { value: "rejected", label: "مرفوضة" },
  ];

  const selectedFilterLabel =
    filterOptions.find((option) => option.value === selectedFilter)?.label ||
    "الكل";

  const filteredComplaints = useMemo(() => {
    if (selectedFilter === "all") {
      return complaints;
    }

    return complaints.filter((complaint) => complaint.status === selectedFilter);
  }, [complaints, selectedFilter]);

  const getTodayDate = () => {
    return new Date().toLocaleDateString("ar", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setAttachmentName("");
      return;
    }

    setAttachmentName(file.name);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !details.trim()) {
      alert("يرجى تعبئة عنوان الشكوى ووصف الشكوى بالتفصيل.");
      return;
    }

    const newComplaint = {
      id: Date.now(),
      title,
      details,
      date: getTodayDate(),
      status: "pending",
      statusText: "قيد المراجعة",
    };

    setComplaints((prevComplaints) => [newComplaint, ...prevComplaints]);

    setTitle("");
    setDetails("");
    setAttachmentName("");
    setSelectedFilter("all");
  };

  return (
    <main className="customer-complaints-page" dir="rtl">
      <div className="customer-complaints-container">
        <ReviewsComplaintsTabs />

        <div className="complaints-content-grid">
          <aside className="new-complaint-card">
            <h2>تقديم شكوى جديدة</h2>

            <form onSubmit={handleSubmit}>
              <div className="complaint-form-group">
                <label htmlFor="complaintTitle">عنوان الشكوى</label>
                <input
                  id="complaintTitle"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="مثال: انقطاع التيار الكهربائي المتكرر"
                />
              </div>

              <div className="complaint-form-group">
                <label htmlFor="complaintDetails">وصف الشكوى بالتفصيل</label>
                <textarea
                  id="complaintDetails"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
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

              <button type="submit" className="send-complaint-button">
                إرسال الشكوى
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
                    <span className="complaint-date">—</span>
                    <span className="complaint-status pending">لا يوجد</span>
                  </div>

                  <h3>لا توجد شكاوى مطابقة</h3>
                  <p>جرّب تغيير الفلتر لعرض نتائج أخرى.</p>
                </article>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CustomerComplaints;