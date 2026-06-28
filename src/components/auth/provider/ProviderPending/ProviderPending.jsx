import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProviderPending.css";
import { FiHelpCircle } from "react-icons/fi";
import { BsHourglassSplit } from "react-icons/bs";

function useProgressAnimation() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targetProgress = 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetProgress) {
          clearInterval(interval);
          return targetProgress;
        }

        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return progress;
}

function ProviderPending() {
  const navigate = useNavigate();
  const progress = useProgressAnimation();

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        navigate("/provider-success");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  const handleSupportClick = () => {
    navigate("/contact-us");
  };

  const handleLogoutClick = () => {
    navigate("/login");
  };

  return (
    <main className="provider-pending-page">
      <section className="pending-card">
        <div className="pending-icon">
          <BsHourglassSplit />
        </div>

        <h1>حسابك قيد المراجعة</h1>

        <p className="pending-desc">
          يقوم فريق الإدارة بمراجعة بياناتك ومستنداتك حاليًا.
          <br />
          سنقوم بإبلاغك فور تفعيل الحساب.
        </p>

        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="progress-info">
            <span>اكتمال الملف الشخصي</span>
            <span>{progress}%</span>
          </div>
        </div>

        <button
          type="button"
          className="support-btn"
          onClick={handleSupportClick}
        >
          <FiHelpCircle />
          تواصل مع الدعم الفني
        </button>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogoutClick}
        >
          تسجيل الخروج
        </button>
      </section>
    </main>
  );
}

export default ProviderPending;