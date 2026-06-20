// import { useState } from "react";
// import "./ProviderInfo.css";
// import images from "../../assets/images/images.png";
// import icons from "../../assets/icons/icons.svg";
// import icons1 from "../../assets/icons/icons1.svg";

// function useProviderInfo() {
//   const [formData, setFormData] = useState({
//     companyName: "",
//     userName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     terms: false,
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });

//     setMessage("");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       !formData.companyName ||
//       !formData.userName ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.password ||
//       !formData.confirmPassword
//     ) {
//       setMessage("يرجى تعبئة جميع الحقول");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setMessage("كلمة المرور غير متطابقة");
//       return;
//     }

//     if (!formData.terms) {
//       setMessage("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية");
//       return;
//     }

//     setMessage("");

//     console.log("بيانات المزود:", formData);

//     // هون بعدين بتحط كود إرسال البيانات للـ API
//   };

//   return {
//     formData,
//     message,
//     handleChange,
//     handleSubmit,
//   };
// }

// const ProviderInfo = () => {
//   const { formData, message, handleChange, handleSubmit } = useProviderInfo();

//   return (
//     <div className="provider-signup1">
//       {/* الفورم */}
//       <form className="signup-card1" onSubmit={handleSubmit}>
//         <h2>إكمال معلومات المزود</h2>

//         <p>الرجاء إدخال البيانات المطلوبة لإنشاء حساب شركتك</p>

//         <div className="input-row1">
//           <div className="input-box1">
//             <label>اسم الشركة</label>
//             <input
//               type="text"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleChange}
//               placeholder="أدخل اسم الشركة"
//             />
//           </div>
//         </div>

//         <div className="input-row1">
//           <div className="input-box1">
//             <label>اسم المستخدم</label>
//             <input
//               type="text"
//               name="userName"
//               value={formData.userName}
//               onChange={handleChange}
//               placeholder="اسم المستخدم"
//             />
//           </div>

//           <div className="input-box1">
//             <label>البريد الإلكتروني</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="example@company.com"
//             />
//           </div>
//         </div>

//         <div className="input-row1">
//           <div className="input-box1 full1">
//             <label>رقم الهاتف</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="+964 7XX XXX XXXX"
//             />
//           </div>
//         </div>

//         <div className="input-row1">
//           <div className="input-box1">
//             <label>تأكيد كلمة المرور</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="********"
//             />
//           </div>

//           <div className="input-box1">
//             <label>كلمة المرور</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="********"
//             />
//           </div>
//         </div>

//         <div className="checkbox1">
//           <input
//             type="checkbox"
//             name="terms"
//             checked={formData.terms}
//             onChange={handleChange}
//           />

//           <span>أوافق على شروط الاستخدام وسياسة الخصوصية</span>
//         </div>

//         {message && <p className="provider-error1">{message}</p>}

//         <button type="submit" className="signup-btn1">
//           إنشاء حسابي
//         </button>

//         <p className="login-text1">
//           لديك حساب بالفعل؟ <a href="#">تسجيل الدخول</a>
//         </p>
//       </form>

//       {/* القسم الأزرق */}
//       <div className="login-info1">
//         <div className="icon-box1">
//           <img src={images} alt="logo1" />
//         </div>

//         <h2>وصل - مستقبل الطاقة المحلية</h2>

//         <p>
//           منصة وصل توفر لك تحكماً كاملاً في استهلاك الطاقة والربط مع المزودين
//           وإدارة الفواتير بسهولة.
//         </p>

//         <div className="feature-card">
//           <div className="feature-wrapper">
//             <div className="feature-icon">
//               <img src={icons} alt="الايقون" />
//             </div>

//             <h4>تقارير الطاقة</h4>
//             <span>راقب استهلاك المشتركين بدقة</span>
//           </div>
//         </div>

//         <div className="feature-card">
//           <div className="feature-wrapper">
//             <div className="feature-icon">
//               <img src={icons1} alt="الايقون" />
//             </div>

//             <h4>تحصيل آلي</h4>
//             <span>إدارة المدفوعات والفواتير</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProviderInfo;