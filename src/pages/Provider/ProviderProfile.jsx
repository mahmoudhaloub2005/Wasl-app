import { useCallback, useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCreditCard,
  FiEdit3,
  FiSave,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import Footer from "../../components/layout/Footer/Footer";
import ProviderAvatar from "../../components/Provider/profile/ProviderAvatar";
import ProviderLogoutButton from "../../components/Provider/profile/ProviderLogoutButton";
import ProviderLogoutConfirmModal from "../../components/Provider/profile/ProviderLogoutConfirmModal";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import ProviderProfileCard from "../../components/Provider/profile/ProviderProfileCard";
import ProviderReadOnlyField from "../../components/Provider/profile/ProviderReadOnlyField";
import useProviderProfile from "../../hooks/useProviderProfile";
import { clearAuthStorage } from "../../utils/authStorage";
import "./ProviderProfile.css";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s-]{7,20}$/;

function toProfileForm(profile) {
  return {
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    companyName: profile?.companyName || "",
    commercialLicenseNumber: profile?.commercialLicenseNumber || "",
  };
}

function cleanPhoneDigits(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function validateProfileForm(values) {
  const errors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const companyName = values.companyName.trim();
  if (!fullName) {
    errors.fullName = "يرجى إدخال الاسم الكامل";
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (phone) {
    const digits = cleanPhoneDigits(phone);

    if (!PHONE_PATTERN.test(phone) || digits.length < 7 || digits.length > 15) {
      errors.phone = "يرجى إدخال رقم تواصل صحيح";
    }
  }

  if (!companyName) {
    errors.companyName = "يرجى إدخال اسم الشركة";
  }

  return errors;
}

function ProviderEditableField({
  disabled,
  error,
  inputMode,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
  valueDirection = "rtl",
  wide = false,
}) {
  return (
    <label
      className={`provider-profile-field ${
        wide ? "provider-profile-field--wide" : ""
      }`}
    >
      <span className="provider-profile-field__label">{label}</span>
      <input
        className={`provider-profile-field__value provider-profile-field__input ${
          error ? "provider-profile-field__input--invalid" : ""
        }`}
        dir={valueDirection}
        disabled={disabled}
        inputMode={inputMode}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error && <span className="provider-profile-field__error">{error}</span>}
    </label>
  );
}

function ProviderProfile() {
  const {
    clearUpdateError,
    isLoading,
    isUpdating,
    profile,
    saveProfile,
    updateErrorMessage,
  } = useProviderProfile();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => toProfileForm(null));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");


  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const clearSelectedImage = useCallback(() => {
    setSelectedImageFile(null);
    setImagePreviewUrl((previewUrl) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      return "";
    });
  }, []);

  const openLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  const startEdit = useCallback(() => {
    if (!profile) return;

    setFormData(toProfileForm(profile));
    setFieldErrors({});
    setFormErrorMessage("");
    setSuccessMessage("");
    clearUpdateError();
    clearSelectedImage();
    setIsEditing(true);
  }, [clearSelectedImage, clearUpdateError, profile]);

  const cancelEdit = useCallback(() => {
    setFormData(toProfileForm(profile));
    setFieldErrors({});
    setFormErrorMessage("");
    clearUpdateError();
    clearSelectedImage();
    setIsEditing(false);
  }, [clearSelectedImage, clearUpdateError, profile]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
    setFormErrorMessage("");
    clearUpdateError();
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      profileImage: "",
    }));
    setFormErrorMessage("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        profileImage: "يرجى اختيار ملف صورة فقط",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        profileImage: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت",
      }));
      event.target.value = "";
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    clearSelectedImage();
    setSelectedImageFile(file);
    setImagePreviewUrl(nextPreviewUrl);
  }

  async function handleSave(event) {
    event.preventDefault();

    if (isUpdating) return;

    const validationErrors = validateProfileForm(formData);

    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setFormErrorMessage("يرجى تصحيح الحقول المحددة قبل الحفظ");
      return;
    }

    setFieldErrors({});
    setFormErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedProfile = await saveProfile(formData, {
        imageFile: selectedImageFile,
      });

      setFormData(toProfileForm(updatedProfile));
      clearSelectedImage();
      setIsEditing(false);
      setSuccessMessage("تم تحديث البيانات بنجاح");
    } catch (error) {
      setFormErrorMessage(error.message || "فشل تحديث البيانات، يرجى المحاولة مرة أخرى.");
    }
  }

  async function confirmLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      clearAuthStorage();
    } finally {
      window.location.replace("/login");
    }
  }

  const profileImageUrl = imagePreviewUrl || profile?.profileImage || "";
  const avatarName = isEditing ? formData.fullName : profile?.fullName;
  const actionMessage = formErrorMessage || updateErrorMessage;

  return (
    <div className="provider-profile-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-profile-main">
        <div className="provider-profile-main__layout">
          <aside className="provider-profile-main__aside">
            <ProviderLogoutButton
              disabled={isLoggingOut || isUpdating}
              onClick={openLogoutModal}
            />
          </aside>

          <section
            className="provider-profile-main__content"
            aria-label="معلومات حساب المزود"
          >
            <div className="provider-profile-toolbar">
              <div>
                <h1>الملف الشخصي</h1>
                <p>إدارة معلومات المزود وبيانات الشركة المرتبطة بالحساب.</p>
              </div>

              {profile && !isLoading && (
                isEditing ? (
                  <div className="provider-profile-toolbar__actions">
                    <button
                      type="button"
                      className="provider-profile-action provider-profile-action--secondary"
                      onClick={cancelEdit}
                      disabled={isUpdating}
                    >
                      <FiX aria-hidden="true" />
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="provider-profile-action provider-profile-action--primary"
                      form="provider-profile-form"
                      disabled={isUpdating}
                    >
                      <FiSave aria-hidden="true" />
                      {isUpdating ? "جاري الحفظ..." : "حفظ التعديلات"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="provider-profile-action provider-profile-action--primary"
                    onClick={startEdit}
                  >
                    <FiEdit3 aria-hidden="true" />
                    تعديل البيانات
                  </button>
                )
              )}
            </div>

            {successMessage && (
              <div className="provider-profile-success" role="status">
                {successMessage}
              </div>
            )}

            {actionMessage && (
              <div className="provider-profile-error" role="alert">
                <span>{actionMessage}</span>
              </div>
            )}


            {profile ? (
              <form id="provider-profile-form" onSubmit={handleSave} noValidate>
                <ProviderProfileCard
                  title="المعلومات الشخصية"
                  Icon={FiCreditCard}
                  iconTone="blue"
                  className="provider-profile-card--personal"
                >
                  <div className="provider-profile-card__personal-grid">
                    <div className="provider-profile-card__avatar-column">
                      <ProviderAvatar
                        imageUrl={profileImageUrl}
                        initials={profile.initials}
                        name={avatarName}
                      />
                      <span>صورة الملف الشخصي</span>

                      {isEditing && (
                        <label className="provider-profile-avatar-edit">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUpdating}
                          />
                          <FiUploadCloud aria-hidden="true" />
                          تغيير الصورة
                        </label>
                      )}

                      {fieldErrors.profileImage && (
                        <span className="provider-profile-field__error provider-profile-field__error--center">
                          {fieldErrors.profileImage}
                        </span>
                      )}
                    </div>

                    <div className="provider-profile-card__fields provider-profile-card__fields--personal">
                      {isEditing ? (
                        <>
                          <ProviderEditableField
                            label="الاسم الكامل"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="أدخل الاسم الكامل"
                            error={fieldErrors.fullName}
                            disabled={isUpdating}
                          />
                          <ProviderEditableField
                            label="رقم التواصل"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="05XXXXXXXX"
                            error={fieldErrors.phone}
                            valueDirection="ltr"
                            inputMode="tel"
                            disabled={isUpdating}
                          />
                          <ProviderEditableField
                            label="البريد الإلكتروني"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@domain.com"
                            error={fieldErrors.email}
                            valueDirection="ltr"
                            inputMode="email"
                            wide
                            disabled={isUpdating}
                          />
                        </>
                      ) : (
                        <>
                          <ProviderReadOnlyField
                            label="الاسم الكامل"
                            value={profile.fullName}
                          />
                          <ProviderReadOnlyField
                            label="رقم التواصل"
                            value={profile.phone}
                            valueDirection="ltr"
                          />
                          <ProviderReadOnlyField
                            label="البريد الإلكتروني"
                            value={profile.email}
                            valueDirection="ltr"
                            wide
                          />
                        </>
                      )}
                    </div>
                  </div>
                </ProviderProfileCard>

                <ProviderProfileCard
                  title="بيانات الشركة"
                  Icon={FiBriefcase}
                  iconTone="orange"
                >
                  <div className="provider-profile-card__fields provider-profile-card__fields--two">
                    {isEditing ? (
                      <>
                        <ProviderEditableField
                          label="اسم الشركة"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="أدخل اسم الشركة"
                          error={fieldErrors.companyName}
                          disabled={isUpdating}
                        />
                        <ProviderEditableField
                          label="رقم الرخصة التجارية"
                          name="commercialLicenseNumber"
                          value={formData.commercialLicenseNumber}
                          onChange={handleInputChange}
                          placeholder="أدخل رقم الرخصة إن وجد"
                          valueDirection="ltr"
                          disabled={isUpdating}
                        />
                      </>
                    ) : (
                      <>
                        <ProviderReadOnlyField
                          label="اسم الشركة"
                          value={profile.companyName}
                        />
                        <ProviderReadOnlyField
                          label="رقم الرخصة التجارية"
                          value={profile.commercialLicenseNumber}
                          valueDirection="ltr"
                        />
                      </>
                    )}
                  </div>
                </ProviderProfileCard>

                <ProviderProfileCard
                  title="بيانات عامة"
                  Icon={FiBriefcase}
                  iconTone="orange"
                >
                  <div className="provider-profile-card__fields provider-profile-card__fields--two">
                    <>
                        <ProviderReadOnlyField
                          label="سعر الكيلو"
                          value={profile.electricityPrice}
                        />
                        <ProviderReadOnlyField
                          label="آلية الدفع"
                          value={profile.paymentMethod}
                        />
                      </>
                  </div>
                </ProviderProfileCard>
              </form>
            ) : null}
          </section>
        </div>
      </main>

      <ProviderLogoutConfirmModal
        isOpen={isLogoutModalOpen}
        isSubmitting={isLoggingOut}
        onCancel={closeLogoutModal}
        onConfirm={confirmLogout}
      />

      <Footer />
    </div>
  );
}

export default ProviderProfile;
