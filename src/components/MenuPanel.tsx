import { memo } from "react";

interface MenuPanelProps {
  open: boolean;
  onClose: () => void;
}

export default memo(function MenuPanel({ open, onClose }: MenuPanelProps) {
  return (
    <div
      className={`fixed z-[9] left-2 right-2 md:left-auto md:right-[7px] md:w-[420px] rounded-[20px] flex flex-col justify-between transition-all duration-500 px-8 py-[90px] md:px-[60px] md:py-[60px] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        background: "rgba(28,17,10,0.95)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        top: open ? "0" : "-600px",
        opacity: open ? 1 : 0,
        transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      <nav className="flex flex-col gap-2">
        <a
          href="/"
          onClick={onClose}
          className="text-[36px] md:text-[42px] font-medium text-[#F3E5D8] no-underline leading-[130%] hover:opacity-70 transition-opacity duration-300"
        >
          Main
        </a>
        <a
          href="https://www.linkedin.com/in/ziad-emad-470604400/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="text-[36px] md:text-[42px] font-medium text-[#F3E5D8] no-underline leading-[130%] hover:opacity-70 transition-opacity duration-300"
        >
          Ziad
        </a>
        <a
          href="/chat.html"
          onClick={onClose}
          className="text-[36px] md:text-[42px] font-medium text-[#F3E5D8] no-underline leading-[130%] hover:opacity-70 transition-opacity duration-300"
        >
          AI
        </a>
      </nav>

      <div className="flex flex-col gap-5 mt-8">
        <a
          href="https://www.linkedin.com/in/ziad-emad-470604400/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[18px] md:text-[20px] text-[#8B7D72] no-underline hover:text-[#F3E5D8] transition-colors duration-300"
        >
          Ziad Emad Ahmed
        </a>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/accounts/login/?next=%2Foctgeologyclub%2F&source=omni_redirect"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#8B7D72] underline underline-offset-2 hover:text-[#F3E5D8] transition-colors duration-300"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/stem-october-geology-club"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#8B7D72] underline underline-offset-2 hover:text-[#F3E5D8] transition-colors duration-300"
          >
            Club LinkedIn
          </a>
          <a
            href="https://www.linkedin.com/in/ziad-emad-470604400/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#8B7D72] underline underline-offset-2 hover:text-[#F3E5D8] transition-colors duration-300"
          >
            Ziad
          </a>
        </div>
      </div>

      <div className="mt-8">
        <a
          href="/chat.html"
          onClick={onClose}
          className="menu-cta-btn relative overflow-hidden flex items-center border-none bg-none cursor-pointer rounded-full p-[6px] gap-2 no-underline"
        >
          <span
            className="menu-cta-bg absolute top-[5px] bottom-[5px] left-2 rounded-full bg-white z-0 transition-all duration-400"
            style={{
              width: open
                ? "calc(100% - 12px)"
                : "calc(100% - 8px - 8px - 38px - 8px)",
              transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
          <span className="menu-cta-text relative z-1 text-[#2B1B10] font-medium text-[14px] px-10 py-2 whitespace-nowrap">
            Chat with AI
          </span>
          <span className="menu-cta-circle relative z-1 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#C29B6D] shrink-0 transition-transform duration-300">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
});
