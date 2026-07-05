import "./WelcomeSection.css";

function WelcomeSection({ userName = "محمود" }) {
  return (
    <section className="welcome-section">
      <div className="welcome-empty-card"></div>

      <div className="welcome-content">
        <h1>مرحباً، {userName} 👋</h1>
        <p>
          أهلاً بك في منصة وصل لإدارة خدمات المولدات الكهربائية. نحن هنا لضمان
          راحتك واستمرارية طاقتك.
        </p>
      </div>
    </section>
  );
}

export default WelcomeSection;