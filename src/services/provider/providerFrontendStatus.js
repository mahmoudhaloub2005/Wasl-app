export const providerServicePendingMessage =
  "سيتم تفعيل الحفظ النهائي بعد ربط الخدمة";

export function createProviderFrontendOnlyResult(overrides = {}) {
  return {
    frontendOnly: true,
    message: providerServicePendingMessage,
    ...overrides,
  };
}