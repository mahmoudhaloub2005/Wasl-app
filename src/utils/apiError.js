export function getApiErrorMessage(error, fallback = "حدث خطأ غير متوقع.") {
  const errors = error.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors).flat().find(Boolean);

    if (firstError) return firstError;
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
}
