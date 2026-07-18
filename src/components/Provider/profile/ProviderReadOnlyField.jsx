import { UNAVAILABLE } from "../../../services/providerProfileService";

function getDisplayValue(value) {
  if (value === undefined || value === null) return UNAVAILABLE;
  if (typeof value === "object") return UNAVAILABLE;

  const displayValue = String(value).trim();

  if (
    !displayValue ||
    ["undefined", "null", "NaN", "[object Object]"].includes(displayValue)
  ) {
    return UNAVAILABLE;
  }

  return displayValue;
}

function ProviderReadOnlyField({
  label,
  value,
  valueDirection = "rtl",
  wide = false,
}) {
  const displayValue = getDisplayValue(value);

  return (
    <div
      className={`provider-profile-field ${
        wide ? "provider-profile-field--wide" : ""
      }`}
    >
      <span className="provider-profile-field__label">{label}</span>
      <div
        className="provider-profile-field__value"
        role="textbox"
        aria-label={`${label}: ${displayValue}`}
        aria-readonly="true"
        dir={valueDirection}
        tabIndex={0}
      >
        <bdi>{displayValue}</bdi>
      </div>
    </div>
  );
}

export default ProviderReadOnlyField;
