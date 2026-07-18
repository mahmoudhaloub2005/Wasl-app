import { useState } from "react";

function getAvatarInitial(initials, name) {
  const fallbackText = String(initials || name || "?").trim();
  const [firstCharacter] = Array.from(fallbackText);

  return firstCharacter || "?";
}

function ProviderAvatar({ imageUrl, initials, name }) {
  const [brokenImageUrl, setBrokenImageUrl] = useState("");
  const avatarInitial = getAvatarInitial(initials, name);
  const hasValidImage = Boolean(imageUrl) && brokenImageUrl !== imageUrl;
  const avatarLabel = name
    ? `صورة الملف الشخصي لـ ${name}`
    : "صورة الملف الشخصي";

  return (
    <div className="provider-profile-avatar" aria-label={avatarLabel}>
      {hasValidImage ? (
        <img
          src={imageUrl}
          alt={avatarLabel}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setBrokenImageUrl(imageUrl)}
        />
      ) : (
        <span aria-hidden="true">{avatarInitial}</span>
      )}
    </div>
  );
}

export default ProviderAvatar;
