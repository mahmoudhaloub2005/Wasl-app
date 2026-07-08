import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiEdit2,
  FiLock,
  FiLogOut,
  FiShield,
  FiUser,
} from "react-icons/fi";

import { getCurrentUser, logoutUser } from "../../../services/authService";
import { getCurrentSubscription } from "../../../services/subscriptionService";
import {
  clearAuthStorage,
  getScopedStorageKey,
  getStoredUser,
  getUserAvatarUrl,
  getUserInitial,
  getUserProfile,
} from "../../../utils/authStorage";
import "./CustomerProfilePage.css";

const PROFILE_AVATAR_KEY = "wasel_profile_avatar";

const initialProfile = {
  fullName: "محمود",
  email: "m.@gmail.com",
  phone: "+972 59 1234 123",
  address: "دير البلح",
  memberSince: "يناير 2023",
};

function getInitialProfile() {
  const userProfile = getUserProfile();

  return {
    ...initialProfile,
    ...userProfile,
    fullName: userProfile.fullName || initialProfile.fullName,
  };
}

function unwrapUser(data) {
  return (
    data?.user ||
    data?.customer ||
    data?.data?.user ||
    data?.data?.customer ||
    data?.data ||
    data ||
    {}
  );
}

function getSavedAvatarForUser(user = getStoredUser()) {
  const storageKey = getScopedStorageKey(PROFILE_AVATAR_KEY, user);

  if (!storageKey) return "";

  return localStorage.getItem(storageKey) || "";
}

function getProfileAvatarForUser(user = getStoredUser()) {
  return getSavedAvatarForUser(user) || getUserAvatarUrl(user);
}

function notifyProfileAvatarChange(user, avatarImage) {
  window.dispatchEvent(
    new CustomEvent("wasel-profile-avatar-change", {
      detail: {
        avatarImage,
        storageKey: getScopedStorageKey(PROFILE_AVATAR_KEY, user),
      },
    })
  );
}

function formatMemberSince(value) {
  if (!value) return initialProfile.memberSince;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function CustomerProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(getInitialProfile);
  const [savedProfile, setSavedProfile] = useState(getInitialProfile);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [avatarImage, setAvatarImage] = useState(() => getProfileAvatarForUser());
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const areaLabel = profile.address.trim() || "غير محدد";

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentProfile() {
      try {
        const data = await getCurrentUser();
        const user = unwrapUser(data);
        const userProfile = getUserProfile(user);
        const nextProfile = {
          ...initialProfile,
          ...userProfile,
          fullName: userProfile.fullName || initialProfile.fullName,
          memberSince: formatMemberSince(
            user?.created_at || user?.createdAt || user?.member_since
          ),
        };

        if (isMounted) {
          setCurrentUser(user);
          setProfile(nextProfile);
          setSavedProfile(nextProfile);
          setAvatarImage(getProfileAvatarForUser(user));
        }
      } catch (error) {
        console.error("Failed to load current profile:", error);

        if (isMounted) {
          setProfileMessage("تعذر تحديث بيانات الحساب من الخادم حالياً.");
        }
      }
    }

    loadCurrentProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscription() {
      try {
        setIsSubscriptionLoading(true);
        const subscription = await getCurrentSubscription();

        if (isMounted) {
          setCurrentSubscription(subscription);
        }
      } catch (error) {
        console.error("Failed to load profile subscription:", error);

        if (isMounted) {
          setCurrentSubscription(null);
        }
      } finally {
        if (isMounted) {
          setIsSubscriptionLoading(false);
        }
      }
    }

    loadSubscription();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  }

  function handleSaveChanges() {
    setSavedProfile(profile);
    setProfileMessage("تم حفظ التغييرات على الواجهة.");
  }

  function handleCancelChanges() {
    setProfile(savedProfile);
    setLanguage("ar");
    setSmsEnabled(false);
    setAppNotifications(true);
    setTwoFactorEnabled(true);
    setProfileMessage("تم إلغاء التغييرات.");
  }

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthStorage();
      window.location.href = "/login";
    }
  }

  function handleAvatarClick() {
    setIsAvatarMenuOpen((prev) => !prev);
  }

  function handleBrowseAvatar() {
    setIsAvatarMenuOpen(false);
    fileInputRef.current?.click();
  }

  function handleRemoveAvatar() {
    const storageKey = getScopedStorageKey(PROFILE_AVATAR_KEY, currentUser);
    const fallbackAvatar = getUserAvatarUrl(currentUser);

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }

    setAvatarImage(fallbackAvatar);
    setIsAvatarMenuOpen(false);
    notifyProfileAvatarChange(currentUser, fallbackAvatar);
  }

  function handleAvatarChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageDataUrl = reader.result;
      const storageKey = getScopedStorageKey(PROFILE_AVATAR_KEY, currentUser);

      if (storageKey) {
        localStorage.setItem(storageKey, imageDataUrl);
      }

      setAvatarImage(imageDataUrl);
      notifyProfileAvatarChange(currentUser, imageDataUrl);
    };

    reader.readAsDataURL(file);
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmitPassword(event) {
    event.preventDefault();
    setPasswordMessage("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordMessage("يرجى تعبئة بيانات كلمة المرور.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("كلمة المرور الجديدة غير متطابقة.");
      return;
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMessage(
      "تغيير كلمة المرور من داخل الملف الشخصي غير متاح حالياً. استخدم صفحة استعادة كلمة المرور."
    );
  }

  function handleUpgradeSubscription() {
    if (currentSubscription?.generatorId) {
      navigate(`/customer/subscriptions/${currentSubscription.generatorId}`);
      return;
    }

    navigate("/customer/subscriptions");
  }

  return (
    <main className="customer-profile-page" dir="rtl">
      <section className="profile-main-container">
        <section className="profile-user-card">
          <div className="profile-user-info">
            <div className="profile-avatar-box">
              {avatarImage ? (
                <img src={avatarImage} alt="الصورة الشخصية" />
              ) : (
                <span className="avatar-placeholder">
                  {getUserInitial(currentUser, profile.fullName)}
                </span>
              )}

              <button
                className="edit-avatar-button"
                type="button"
                aria-label="تغيير الصورة الشخصية"
                onClick={handleAvatarClick}
              >
                <FiEdit2 />
              </button>

              {isAvatarMenuOpen && (
                <div className="avatar-actions-menu">
                  <button type="button" onClick={handleBrowseAvatar}>
                    تصفح صورة
                  </button>
                  <button type="button" onClick={handleRemoveAvatar}>
                    إزالة الصورة
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>

            <div className="profile-user-details">
              <h1>{profile.fullName}</h1>
              <p>عضو منذ {profile.memberSince}</p>

              <div className="profile-badges">
                <span className="active-account-badge">
                  <i></i>
                  حساب مفعل
                </span>

                <span className="area-badge">المنطقة: {areaLabel}</span>
              </div>
            </div>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <FiLogOut />
            {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </section>

        <section className="profile-content-grid">
          <aside className="subscription-card">
            <div className="light-shape"></div>

            <div className="subscription-top">
              <FiCalendar />
              <span>الاشتراك الحالي</span>
            </div>

            {isSubscriptionLoading && (
              <div className="subscription-center">
                <h2>جاري تحميل الاشتراك...</h2>
              </div>
            )}

            {!isSubscriptionLoading && !currentSubscription && (
              <div className="subscription-center">
                <h2>لا يوجد اشتراك نشط حالياً</h2>
              </div>
            )}

            {!isSubscriptionLoading && currentSubscription && (
              <>
                <div className="subscription-center">
                  <h2>{currentSubscription.generatorName || "اشتراكك الحالي"}</h2>
                  {currentSubscription.ampere && (
                    <p>سعة الاشتراك: {currentSubscription.ampere}</p>
                  )}
                </div>

                {currentSubscription.currentAmp !== null &&
                  currentSubscription.currentAmp !== undefined &&
                  currentSubscription.maxAmp !== null &&
                  currentSubscription.maxAmp !== undefined && (
                    <>
                      <div className="usage-info">
                        <span>الاستهلاك الحالي</span>
                        <span>
                          {currentSubscription.currentAmp} /{" "}
                          {currentSubscription.maxAmp}A
                        </span>
                      </div>

                      <div className="usage-bar">
                        <div
                          style={{
                            width: `${Math.min(
                              (currentSubscription.currentAmp /
                                currentSubscription.maxAmp) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </>
                  )}

                <button
                  className="upgrade-subscription-button"
                  type="button"
                  onClick={handleUpgradeSubscription}
                >
                  ترقية الاشتراك
                </button>
              </>
            )}
          </aside>

          <section className="profile-card personal-info-card">
            <div className="profile-card-title">
              <FiUser />
              <h2>المعلومات الشخصية</h2>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field">
                <span>الاسم الكامل</span>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                />
              </label>

              <label className="profile-field">
                <span>البريد الإلكتروني</span>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </label>

              <label className="profile-field">
                <span>رقم الهاتف</span>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </label>

              <label className="profile-field">
                <span>العنوان</span>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                />
              </label>
            </div>
          </section>

          <section className="profile-card preferences-card">
            <h2>التفضيلات</h2>

            <label className="language-field">
              <span>لغة الواجهة</span>

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </label>

            <h3>تنبيهات الإشعارات</h3>

            <label className="checkbox-setting">
              <span>رسائل SMS</span>
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={() => setSmsEnabled(!smsEnabled)}
              />
              <i>
                <FiCheck />
              </i>
            </label>

            <label className="checkbox-setting">
              <span>إشعارات التطبيق</span>
              <input
                type="checkbox"
                checked={appNotifications}
                onChange={() => setAppNotifications(!appNotifications)}
              />
              <i>
                <FiCheck />
              </i>
            </label>
          </section>

          <section className="profile-card security-card">
            <div className="profile-card-title">
              <FiShield />
              <h2>أمان الحساب</h2>
            </div>

            <button
              className="security-row"
              type="button"
              onClick={() => setPasswordModalOpen(true)}
            >
              <FiLock className="security-main-icon" />

              <div>
                <strong>تغيير كلمة المرور</strong>
                <span>آخر تغيير قبل 3 أشهر</span>
              </div>

              <FiChevronLeft className="security-arrow" />
            </button>

            <div className="security-row">
              <FiShield className="security-main-icon" />

              <div>
                <strong>المصادقة الثنائية (2FA)</strong>
                <span>تأمين حسابك عبر رمز SMS</span>
              </div>

              <button
                className={`switch-button ${twoFactorEnabled ? "active" : ""}`}
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                <span></span>
              </button>
            </div>
          </section>
        </section>

        <div className="profile-line"></div>

        {profileMessage && (
          <p className="profile-status-message">{profileMessage}</p>
        )}

        <div className="profile-buttons">
          <button
            className="save-changes-button"
            type="button"
            onClick={handleSaveChanges}
          >
            حفظ التغييرات
          </button>

          <button
            className="cancel-changes-button"
            type="button"
            onClick={handleCancelChanges}
          >
            إلغاء التغييرات
          </button>
        </div>
      </section>

      {passwordModalOpen && (
        <div className="password-modal-overlay">
          <form className="password-modal" onSubmit={handleSubmitPassword}>
            <h2>تغيير كلمة المرور</h2>

            <label>
              كلمة المرور الحالية
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <label>
              كلمة المرور الجديدة
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <label>
              تأكيد كلمة المرور
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <div className="password-modal-buttons">
              <button type="submit">حفظ</button>

              <button type="button" onClick={() => setPasswordModalOpen(false)}>
                إلغاء
              </button>
            </div>

            {passwordMessage && (
              <p className="password-modal-message">{passwordMessage}</p>
            )}
          </form>
        </div>
      )}
    </main>
  );
}

export default CustomerProfilePage;
