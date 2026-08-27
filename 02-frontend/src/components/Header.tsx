import { useState } from "react";

const navItems = ["Politik", "Business", "International", "Tech", "Succes"];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <button type="button" className="logo">y</button>

      <nav className={menuOpen ? "nav nav-open" : "nav"}>
        {navItems.map((item) => (
          <button key={item} type="button" onClick={() => setMenuOpen(false)}>
            {item}
          </button>
        ))}
      </nav>

      <button type="button" className="brief-button">Dagens brief</button>

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