import { useState } from "react";
import { FiSend } from "react-icons/fi";
import "./ContactUs.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    problemType: "مشاكل تقنية في التطبيق",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const faqs = [
    {
      question: "كيف يمكنني تفعيل اشتراك جديد؟",
      answer:
        "يمكنك اختيار المزود المناسب من قائمة المزودين والضغط على زر طلب اشتراك ليتم التواصل معك فوراً.",
    },
    {
      question: "هل يمكنني تغيير سعة الأمبير المشترك بها؟",
      answer:
        "نعم، يمكنك تعديل باقة الاشتراك من خلال إعدادات إدارة الطاقة في لوحة التحكم الخاصة بك.",
    },
    {
      question: "ماذا أفعل في حال انقطاع الخدمة المفاجئ؟",
      answer:
        "يرجى التحقق من لوحة التحكم لمشاهدة حالة المولد، أو استخدام المحادثة المباشرة للتواصل مع الدعم.",
    },
    {
      question: "كيف يتم احتساب الفواتير الشهرية؟",
      answer:
        "تعتمد الفواتير على سعة الاشتراك الشهري بالإضافة إلى أي استهلاك إضافي موثق إلكترونياً.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("تم إرسال رسالتك بنجاح، سيتم التواصل معك قريباً");

    setFormData({
      fullName: "",
      email: "",
      problemType: "مشاكل تقنية في التطبيق",
      message: "",
    });
  };

  return (
    <section className="contact-page">
      <div className="contact-header">
        <h1>كيف يمكننا مساعدتك اليوم؟</h1>

        <p>
          فريق الدعم الفني في منصة وصل متاح على مدار الساعة لضمان استمرارية
          طاقتك وتوفير حلول تقنية سريعة.
        </p>
      </div>

      <form className="contact-card" onSubmit={handleSubmit}>
        <h2>راسلنا مباشرة</h2>

        <div className="contact-row">
          <div className="contact-group">
            <label>الاسم الكامل</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="مثال : أحمد محمد"
            />
          </div>

          <div className="contact-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@wassl.energy"
            />
          </div>
        </div>

        <div className="contact-group full">
          <label>نوع المشكلة</label>
          <select
            name="problemType"
            value={formData.problemType}
            onChange={handleChange}
          >
            <option>مشاكل تقنية في التطبيق</option>
            <option>مشكلة في الاشتراك</option>
            <option>مشكلة في الفاتورة</option>
            <option>طلب دعم فني</option>
            <option>اقتراح أو ملاحظة</option>
          </select>
        </div>

        <div className="contact-group full">
          <label>تفاصيل الرسالة</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="كيف يمكننا مساعدتك؟"
          ></textarea>
        </div>

        {successMessage && (
          <p className="contact-success">{successMessage}</p>
        )}

        <button className="contact-btn1" type="submit">
          <FiSend />
          تواصل معنا
        </button>
      </form>

      <div className="faq-section">
        <h2>الأسئلة الأكثر شيوعاً</h2>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div className="faq-card" key={index}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
