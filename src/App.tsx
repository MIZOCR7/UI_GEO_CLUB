import { useState, useCallback } from "react";
import Splash from "./components/Splash";
import Logo from "./components/Logo";
import BurgerMenu from "./components/BurgerMenu";
import MenuPanel from "./components/MenuPanel";
import Hero from "./components/Hero";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <Splash />
      <Logo />
      <BurgerMenu open={menuOpen} onToggle={toggleMenu} />
      <MenuPanel open={menuOpen} onClose={closeMenu} />
      <Hero />
    </>
  );
}
