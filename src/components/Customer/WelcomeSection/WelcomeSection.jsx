import "./WelcomeSection.css";

function WelcomeSection() {
  return (
    <section className="welcome-section">
      <div className="welcome-text">
        <h1>مرحباً، محمد 👋</h1>

        <p>
          أهلاً بك في منصة وصل لإدارة خدمات المولدات الكهربائية. نحن هنا لضمان
          راحتك واستمرارية طاقتك.
        </p>
      </div>

      <div className="welcome-shape"></div>
    </section>
  );
}

export default WelcomeSection;