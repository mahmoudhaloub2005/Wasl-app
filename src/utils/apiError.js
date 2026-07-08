function translateApiMessage(message) {
  const text = String(message || "").trim();
  const lowerText = text.toLowerCase();

  if (!text) return "";
  if (lowerText.includes("target type") && lowerText.includes("required")) {
    return "نوع الجهة المستهدفة مطلوب. حاول مرة أخرى.";
  }
  if (lowerText.includes("target id") && lowerText.includes("required")) {
    return "يرجى اختيار المولد قبل الإرسال.";
  }
  if (lowerText.includes("generator") && lowerText.includes("required")) {
    return "يرجى اختيار المولد قبل الإرسال.";
  }
  if (lowerText.includes("rating") && lowerText.includes("required")) {
    return "يرجى اختيار التقييم قبل الإرسال.";
  }
  if (lowerText.includes("comment") && lowerText.includes("required")) {
    return "يرجى كتابة رأيك قبل إرسال التقييم.";
  }

  return text;
}

export function getApiErrorMessage(error, fallback = "حدث خطأ غير متوقع.") {
  if (error.displayMessage) {
    return error.displayMessage;
  }

  const errors = error.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors).flat().find(Boolean);

    if (firstError) return translateApiMessage(firstError);
  }

  return translateApiMessage(
    error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
  );
}
