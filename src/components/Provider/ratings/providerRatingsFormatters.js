export function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

export function formatReviewDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const diffMs = date.getTime() - Date.now();
  const absDiffMs = Math.abs(diffMs);
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (absDiffMs < minuteMs) {
    return "الآن";
  }

  if (absDiffMs < hourMs) {
    const minutes = Math.max(1, Math.round(absDiffMs / minuteMs));
    return `منذ ${minutes} ${minutes === 1 ? "دقيقة" : "دقائق"}`;
  }

  if (absDiffMs < dayMs) {
    const hours = Math.max(1, Math.round(absDiffMs / hourMs));
    return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
  }

  if (absDiffMs < 2 * dayMs) {
    return "يوم أمس";
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatComplaintTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const hourMs = 60 * 60 * 1000;
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (diffMs >= 0 && diffMs < 6 * hourMs) {
    const hours = Math.max(1, Math.round(diffMs / hourMs));
    return `منذ ${hours === 1 ? "ساعة" : `${hours} ساعات`}`;
  }

  if (sameDay) {
    return `اليوم، ${new Intl.DateTimeFormat("ar", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return "أمس";
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatFullDateTime(value) {
  if (!value) return "غير متوفر";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getInitials(name = "") {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "ع";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join(".");
}

export function getRatingLabel(rating) {
  if (Number(rating) === 2) return "نجمتان";
  if (Number(rating) === 1) return "نجمة";

  return `${rating} نجوم`;
}
