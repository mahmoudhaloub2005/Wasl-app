import "./Navbar.css";
import logo from "../../../assets/icons/image.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("المزودون");

  const links = [
    {
      label: "المزودون",
      sectionId: "providers-section",
    },
    {
      label: "الأسعار",
      sectionId: "pricing-section",
    },
    {
      label: "الشبكة",
      sectionId: "network-section",
    },
    {
      label: "المجتمع",
      sectionId: "community-section",
    },
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleActiveLink = (item) => {
    setActive(item.label);
    scrollToSection(item.sectionId);
  };

  const handleLogoClick = () => {
    navigate("/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleStartClick = () => {
    navigate("/choose-account");
  };

  return (
    <nav className="navbar">
      <button
        className="logo logo-clickable"
        type="button"
        onClick={handleLogoClick}
      >
        <img src={logo} alt="logo" />
        <h2>وصل</h2>
      </button>

      <ul className="links">
        {links.map((item) => (
          <li
            key={item.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleActiveLink(item)}
            className={active === item.label ? "active" : ""}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <button className="btn" type="button" onClick={handleStartClick}>
        ابدأ الآن
      </button>
    </nav>
  );
}

export default Navbar;