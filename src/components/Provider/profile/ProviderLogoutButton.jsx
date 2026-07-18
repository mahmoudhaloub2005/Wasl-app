import { FiLogOut } from "react-icons/fi";

function ProviderLogoutButton({ disabled = false, onClick }) {
  return (
    <button
      type="button"
      className="provider-profile-logout"
      onClick={onClick}
      disabled={disabled}
    >
      <FiLogOut aria-hidden="true" />
      <span>تسجيل الخروج</span>
    </button>
  );
}

export default ProviderLogoutButton;
