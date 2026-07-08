import React from 'react';
import ComplaintCard from './ComplaintCard';
import './ComplaintList.css';

const ComplaintList = () => {
  // بيانات تجريبية مطابقة تماماً للصورة المرفقة IMG_20260702_213436_300.jpg
  const complaintsData = [
    {
      id: 'TK-8821',
      time: 'منذ ساعتين',
      priority: 'أولوية قصوى',
      title: 'انقطاع مفاجئ في التيار الكهربائي',
      userName: 'أحمد محمود الخالدي',
      userId: '100455',
      status: 'pending', // قيد الانتظار
    },
    {
      id: 'TK-8819',
      time: 'اليوم، 10:30 صباحاً',
      priority: 'متوسطة',
      title: 'استفسار عن قيمة الفاتورة الأخيرة',
      userName: 'فاطمة علي',
      userId: '100982',
      status: 'review', // قيد المراجعة
    },
    {
      id: 'TK-8790',
      time: 'أمس',
      priority: 'منخفضة',
      title: 'تغيير مكان العداد',
      userName: 'ياسين إبراهيم',
      userId: '220199',
      status: 'solved', // تم الحل
    }
  ];

  return (
    <div className="complaint-list">
      {complaintsData.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </div>
  );
};

export default ComplaintList;
