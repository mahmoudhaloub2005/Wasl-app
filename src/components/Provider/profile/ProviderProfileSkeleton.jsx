function ProviderProfileSkeletonCard({ fields = 2, hasAvatar = false }) {
  return (
    <section
      className="provider-profile-card provider-profile-card--loading"
      aria-hidden="true"
    >
      <div className="provider-profile-card__header">
        <span className="provider-profile-skeleton provider-profile-skeleton--icon" />
        <span className="provider-profile-skeleton provider-profile-skeleton--title" />
      </div>

      <div
        className={`provider-profile-skeleton__body ${
          hasAvatar ? "provider-profile-skeleton__body--with-avatar" : ""
        }`}
      >
        {hasAvatar && (
          <span className="provider-profile-skeleton provider-profile-skeleton--avatar" />
        )}

        <div className="provider-profile-skeleton__fields">
          {Array.from({ length: fields }).map((_, index) => (
            <span
              className="provider-profile-skeleton provider-profile-skeleton--field"
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProviderProfileSkeleton() {
  return (
    <div className="provider-profile-skeleton-wrap" role="status">
      <span className="provider-profile-loading-text">
        جارٍ تحميل بيانات المزود...
      </span>
      <ProviderProfileSkeletonCard fields={3} hasAvatar />
      <ProviderProfileSkeletonCard fields={2} />
      <ProviderProfileSkeletonCard fields={2} />
    </div>
  );
}

export default ProviderProfileSkeleton;
