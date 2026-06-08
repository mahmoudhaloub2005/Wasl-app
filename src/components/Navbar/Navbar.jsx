import "./Navbar.css";
import logo from "../../assets/icons/image.png";
import { useState } from "react";

function Navbar() {
  const [active, setActive] = useState("المزودون");

  const links = ["المزودون", "الأسعار", "الشبكة", "المجتمع"];

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
        <h2>وصل</h2>
      </div>

      <ul className="links">
        {links.map((item) => (
          <li
             key={item}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setActive(item)}
             className={active === item ? "active" : ""}
          >
            {item}
          </li>
        ))}
      </ul>

      <button className="btn">ابدأ الآن</button>
    </nav>
  );
}

export default Navbar;