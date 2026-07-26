export const unsupportedProviderOperationMessage =
  "هذه العملية غير موثقة في واجهة Wasel API الحالية.";

export function createUnsupportedProviderOperationError() {
  const error = new Error(unsupportedProviderOperationMessage);
  error.displayMessage = unsupportedProviderOperationMessage;
  return error;
}
