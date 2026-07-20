import { useState, useCallback } from "react";
import Splash from "./components/Splash";
import Logo from "./components/Logo";
import BurgerMenu from "./components/BurgerMenu";
import MenuPanel from "./components/MenuPanel";
import Hero from "./components/Hero";
import Chat from "./components/Chat";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  if (chatOpen) return <Chat onBack={closeChat} />;

  return (
    <>
      <Splash />
      <Logo />
      <BurgerMenu open={menuOpen} onToggle={toggleMenu} />
      <MenuPanel open={menuOpen} onClose={closeMenu} onChat={openChat} />
      <Hero onChat={openChat} />
    </>
  );
}
