import { useState } from "react";
import LogoIcon from "../assets/icons/Vector (1).svg";
import BriefIcon from "../assets/icons/icon.svg";

const navItems = ["Politik", "Business", "International", "Tech", "Succes"];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <button type="button" className="logo">
        <img src={LogoIcon} alt="Projekt Y" />
      </button>

      <nav className={menuOpen ? "nav nav-open" : "nav"}>
        {navItems.map((item) => (
          <button key={item} type="button" onClick={() => setMenuOpen(false)}>
            {item}
          </button>
        ))}
      </nav>

      <button type="button" className="brief-button">
       <img src={BriefIcon} alt="" className="brief-icon"/>
        <p className="brief-p">Dagens brief</p>
      </button>

      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Luk menu" : "Åbn menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </header>
  );
}
