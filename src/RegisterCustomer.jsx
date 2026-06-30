import { useState } from "react";
import { API_URL } from "./api";

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
      const response = await fetch(`${API_URL}/register/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error from backend:", data);
        setMessage(data.message || "صار خطأ أثناء التسجيل");
        return;
      }

      console.log("Success:", data);
      setMessage("تم إنشاء الحساب بنجاح");
    } catch (error) {
      console.error("Network error:", error);
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