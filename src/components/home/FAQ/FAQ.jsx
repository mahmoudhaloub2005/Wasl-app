import { useState } from "react";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const questions = [
    {
      question: "كيف يمكنني تفعيل اشتراك جديد؟",
      answer:
        "يمكنك اختيار المزود المناسب من قائمة المزودين والضغط على زر طلب اشتراك ليتم التواصل معك مباشرة.",
    },
    {
      question:" هل يمكنني تغيير سعة الأمبير المشترك بها؟",
      answer:
        "نعم، يمكنك تعديل باقة الإشتراك من خلال إعدادات -إدارة الطاقة- في لوحة التحكم الخاصة بك",
    },
    {
      question: "ماذا أفعل في حال انقطاع الخدمة المفاجئ؟",
      answer:
       " يرجى التحقق من لوحة التحكم لمشاهدة حالة المولد، أو استخدام -المحادثة المباشرة- للتواصل مع الدعم.",
    },
    {
      question: "كيف يتم احتساب الفواتير الشهرية؟",
      answer:
       " تعتمد الفواتير على سعة الاشتراك الشهري بالإضافة إلى أي استهلاك إضافي موثق إلكترونياً.",
    },
  ];

  return (
    <section className="faq">
      <h2>الأسئلة الأكثر شيوعاً</h2>

      {questions.map((item, index) => (
        <div
          key={index}
          className="faq-card"
          onClick={() => setActiveIndex(index)}
        >
          <h3>{item.question}</h3>

          {activeIndex === index && <p>{item.answer}</p>}
        </div>
      ))}
    </section>
  );
}

export default FAQ;