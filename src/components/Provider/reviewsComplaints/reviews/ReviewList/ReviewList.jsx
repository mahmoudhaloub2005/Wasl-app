
import "./ReviewList.css";
import ReviewCard from "./ReviewCard";

function ReviewList() {

  const reviews = [

    {
      id: 1,
      name: "أحمد علي",
      time: "منذ ساعتين",
      rating: 5,
      review:
        "الخدمة كانت ممتازة جداً، المولد كان ملتزماً بالمواعيد والأسعار واضحة ولا توجد رسوم خفية، شكراً لكم.",
      reply: "",
    },

    {
      id: 2,
      name: "سارة محمود",
      time: "منذ يوم",
      rating: 4,
      review:
        "جودة الخدمة جيدة لكن كان هناك تأخير بسيط في وقت الاستجابة الأولي.",
      reply:
        "نشكر ملاحظتك، سنعمل على تحسين سرعة الاستجابة في المرات القادمة.",
    },

  ];

  return (

    <div className="review-list">

      {reviews.map((review) => (

        <ReviewCard
          key={review.id}
          review={review}
        />

      ))}

    </div>

  );

}

export default ReviewList;

