import { memo } from "react";

const BOXES = Array.from({ length: 5 });

export default memo(function Splash() {
  return (
    <div
      className="splash fixed inset-0 w-screen h-screen z-[9999] pointer-events-none overflow-hidden"
      style={{ animation: "splashHide 0.3s ease forwards", animationDelay: "1.35s" }}
    >
      <div className="splash-row-top flex w-full h-1/2">
        {BOXES.map((_, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              width: "20%",
              background: "#75C5DE",
              animation: `splashTop 1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      <div className="splash-row-bottom flex w-full h-1/2">
        {BOXES.map((_, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              width: "20%",
              background: "#75C5DE",
              animation: `splashBottom 1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});
