import { useState } from "react";
import { registerCustomer } from "./services/authService";

function RegisterCustomer() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const data = await registerCustomer(formData);

      if (data?.errors) {        setMessage(data.message || "صار خطأ أثناء التسجيل");
        return;
      }      setMessage("تم إنشاء الحساب بنجاح");
    } catch (error) {      const firstError = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : null;

      if (firstError || error.response?.data?.message) {
        setMessage(firstError || error.response.data.message);
        return;
      }
      setMessage("مشكلة اتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>تسجيل عميل جديد</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="الاسم الأول"
          value={formData.first_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="last_name"
          placeholder="اسم العائلة"
          value={formData.last_name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="الإيميل"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password_confirmation"
          placeholder="تأكيد كلمة المرور"
          value={formData.password_confirmation}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterCustomer;

