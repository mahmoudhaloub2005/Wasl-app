function ProviderPaymentsSkeleton() {
  return (
    <div className="provider-payments-skeleton" aria-label="جاري تحميل طلبات الدفع">
      {Array.from({ length: 2 }).map((_, index) => (
        <article className="provider-payments-skeleton__card" key={index}>
          <span />
          <strong />
          <p />
          <i />
          <div>
            <b />
            <b />
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProviderPaymentsSkeleton;
