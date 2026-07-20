import { memo } from "react";

export default memo(function CTAButton() {
  return (
    <a
      href="/chat.html"
      className="relative overflow-hidden inline-flex items-center border-none bg-none cursor-pointer rounded-full p-2 gap-3 group cta-animate no-underline"
      style={{
        opacity: 0,
        animation: "slideUpScale 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
        animationDelay: "1s",
      }}
    >
      <span
        className="absolute top-[5px] bottom-[5px] left-2 rounded-full bg-white z-0 cta-btn-bg"
      />
      <span className="relative z-10 text-[#2B1B10] font-medium text-[16px] md:text-[18px] px-8 md:px-10 py-3 md:py-4 whitespace-nowrap">
        Chat with AI Geologist
      </span>
      <span className="relative z-10 flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full bg-[#C29B6D] shrink-0 cta-btn-circle">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </a>
  );
});
