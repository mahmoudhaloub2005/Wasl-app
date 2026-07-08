import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ProviderRegister.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBriefcase,
} from "react-icons/fi";

function useProviderRegister(navigate, initialData = {}) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    facilityName: initialData.facilityName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    password: initialData.password || "",
    terms: initialData.terms || false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.facilityName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setMessage("يرجى تعبئة جميع الحقول");
      return;
    }

    if (!formData.terms) {
      setMessage("يجب الموافقة على الشروط والأحكام وسياسة الخصوصية");
      return;
    }

    setMessage("");

    console.log("بيانات تسجيل مزود الخدمة:", formData);

    navigate("/provider-generator-info", {
      state: {
        providerData: formData,
      },
    });
  };

  return {
    formData,
    showPassword,
    message,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
}

function splitProviderFullName(fullName = "") {
  const nameParts = String(fullName).trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts.shift() || "";

  return {
    firstName,
    lastName: nameParts.join(" "),
  };
}

function joinProviderFullName(firstName, lastName) {
  return [firstName, lastName]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ");
}

const ProviderRegister = () => {
  const navigate = useNavigate();
  const initialData = useLocation().state?.providerData || {};

  const {
    formData,
    showPassword,
    message,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useProviderRegister(navigate, initialData);
  const nameParts = splitProviderFullName(formData.fullName);

  const handleNamePartChange = (partName, value) => {
    const nextNameParts = {
      ...nameParts,
      [partName]: value,
    };

    handleChange({
      target: {
        name: "fullName",
        value: joinProviderFullName(
          nextNameParts.firstName,
          nextNameParts.lastName
        ),
        type: "text",
      },
    });
  };

  return (
    <div className="provider-page">
      <div className="provider-register-steps">
        <div className="step active">
          <div className="circle">1</div>
          <span>المعلومات الشخصية</span>
        </div>

        <div className="line"></div>

        <div className="step">
          <div className="circle">2</div>
          <span>تفاصيل المولد</span>
        </div>

        <div className="line"></div>

        <div className="step">
          <div className="circle">3</div>
          <span>الوثائق</span>
        </div>
      </div>

      <form className="provider-card" onSubmit={handleSubmit}>
        <h2>تسجيل مزود الخدمة</h2>

        <p className="desc">
          أهلاً بك في فولت ستريم، ابدأ بتزويدنا ببياناتك الأساسية للانضمام إلى شبكتنا.
        </p>

        <div className="row">
          <div className="input-group">
            <label>البريد الإلكتروني</label>

            <div className="input">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
              />
              <FiMail />
            </div>
          </div>

          <div className="input-group">
            <label>اسم الشركة</label>

            <div className="input">
              <input
                type="text"
                name="facilityName"
                value={formData.facilityName}
                onChange={handleChange}
                placeholder="اسم الشركة"
              />
              <FiBriefcase />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>الاسم الأول</label>

            <div className="input">
              <input
                type="text"
                name="fullName"
                value={nameParts.firstName}
                onChange={(event) =>
                  handleNamePartChange("firstName", event.target.value)
                }
                placeholder="أدخل الاسم الأول"
              />
              <FiUser />
            </div>
          </div>

          <div className="input-group">
            <label>الاسم الأخير</label>

            <div className="input">
              <input
                type="text"
                name="fullName"
                value={nameParts.lastName}
                onChange={(event) =>
                  handleNamePartChange("lastName", event.target.value)
                }
                placeholder="أدخل الاسم الأخير"
              />
              <FiUser />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>رقم الهاتف</label>

            <div className="input">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="05XXXXXXXX"
              />
              <FiPhone />
            </div>
          </div>

          <div className="input-group">
            <label>كلمة المرور</label>

            <div className="input password">
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <FiLock />
            </div>
          </div>
        </div>

        <div className="check">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />

          <span>
            أوافق على
            <Link to="/terms"> الشروط والأحكام </Link>
            وسياسة الخصوصية.
          </span>
        </div>

        {message && <p className="register-error">{message}</p>}

        <button type="submit" className="next-btn1">
          الخطوة التالية : تفاصيل المولد
        </button>

        <p className="login-text">
          لديك حساب بالفعل؟
          <Link to="/login"> تسجيل الدخول</Link>
        </p>
      </form>
    </div>
  );
};

export default ProviderRegister;
