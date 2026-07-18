import { useId } from "react";

function ProviderProfileCard({
  children,
  className = "",
  Icon,
  iconTone = "blue",
  title,
}) {
  const headingId = useId();

  return (
    <section
      className={`provider-profile-card ${className}`}
      aria-labelledby={headingId}
    >
      <div className="provider-profile-card__header">
        <span
          className={`provider-profile-card__icon provider-profile-card__icon--${iconTone}`}
          aria-hidden="true"
        >
          <Icon />
        </span>
        <h2 id={headingId}>{title}</h2>
      </div>

      {children}
    </section>
  );
}

export default ProviderProfileCard;
