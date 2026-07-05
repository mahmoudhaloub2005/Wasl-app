import { useRef, useState } from "react";
import {
  FiLogOut,
  FiEdit2,
  FiUser,
  FiShield,
  FiLock,
  FiChevronLeft,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";

import "./CustomerProfilePage.css";

const initialProfile = {
  fullName: "محمود ",
  email: "m.@gmail.com",
  phone: "+972 59 1234 123",
  address: " دير البلح",
  area: "الوسطى دير البلح",
  memberSince: "يناير 2023",
};

function CustomerProfilePage() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [language, setLanguage] = useState("ar");

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [avatarImage, setAvatarImage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  }

  function handleSaveChanges() {
    setSavedProfile(profile);
    alert("تم حفظ التغييرات بنجاح");
  }

  function handleCancelChanges() {
    setProfile(savedProfile);
    setLanguage("ar");
    setSmsEnabled(false);
    setAppNotifications(true);
    setTwoFactorEnabled(true);
  }

  function handleLogout() {
    localStorage.removeItem("wasel_token");
    localStorage.removeItem("wasel_user");
    window.location.href = "/login";
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  function handleAvatarChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setAvatarImage(imageUrl);
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

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("عبّي بيانات كلمة المرور");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    alert("تم تغيير كلمة المرور بنجاح");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordModalOpen(false);
  }

  function handleUpgradeSubscription() {
    alert("سيتم نقلك لصفحة ترقية الاشتراك");
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
                <div className="avatar-placeholder">م</div>
              )}

              <button
                className="edit-avatar-button"
                type="button"
                onClick={handleAvatarClick}
              >
                <FiEdit2 />
              </button>

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

                <span className="area-badge">المنطقة: {profile.area}</span>
              </div>
            </div>
          </div>

          <button className="logout-button" type="button" onClick={handleLogout}>
            <FiLogOut />
            تسجيل الخروج
          </button>
        </section>

        <section className="profile-content-grid">
          <aside className="subscription-card">
            <div className="light-shape"></div>

            <div className="subscription-top">
              <FiCalendar />
              <span>الاشتراك الحالي</span>
            </div>

            <div className="subscription-center">
              <h2>مولد النور</h2>
              <p>سعة الاشتراك: 5 أمبير</p>
            </div>

            <div className="usage-info">
              <span>الاستهلاك الحالي</span>
              <span>4 / 5A</span>
            </div>

            <div className="usage-bar">
              <div></div>
            </div>

            <button
              className="upgrade-subscription-button"
              type="button"
              onClick={handleUpgradeSubscription}
            >
              ترقية الاشتراك
            </button>
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
                <option value="ar">العربية (العالم العربي)</option>
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
          </form>
        </div>
      )}
    </main>
  );
}

export default CustomerProfilePage;