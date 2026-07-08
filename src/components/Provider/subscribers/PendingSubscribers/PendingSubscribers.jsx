import PendingSubscriberCard from "./PendingSubscriberCard";

function PendingSubscribers() {
  return (
    <div>

      <PendingSubscriberCard
        name="أحمد محمد"
        phone="0599123456"
        amps="5"
        address="غزة - النصر"
      />

      <PendingSubscriberCard
        name="سارة علي"
        phone="0599988776"
        amps="10"
        address="غزة - الرمال"
      />

      <PendingSubscriberCard
        name="محمد خالد"
        phone="0599112233"
        amps="7"
        address="غزة - الشيخ رضوان"
      />

    </div>
  );
}

export default PendingSubscribers;

