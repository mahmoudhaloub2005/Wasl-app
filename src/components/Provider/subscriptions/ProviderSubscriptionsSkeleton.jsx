function ProviderSubscriptionsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          className="provider-subscription-card provider-subscription-card--loading"
          key={index}
        >
          <span />
          <strong />
          <p />
          <p />
          <div />
        </article>
      ))}
    </>
  );
}

export default ProviderSubscriptionsSkeleton;
