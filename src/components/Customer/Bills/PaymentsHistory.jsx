import { IoCardOutline } from "react-icons/io5";

function PaymentsHistory({ payments }) {
  return (
    <section className="payments-history-card">
      <h2>سجل المدفوعات</h2>

      <div className="payments-history-list">
        {payments.map((payment) => (
          <article className="payment-history-item" key={payment.id}>
            <div className="payment-history-info">
              <span className="payment-history-icon">
                <IoCardOutline />
              </span>

              <div>
                <h3>{payment.title}</h3>
                <p>{payment.date}</p>
              </div>
            </div>

            <strong>{payment.amount}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PaymentsHistory;
