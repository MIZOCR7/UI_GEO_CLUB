import { memo, useCallback } from "react";

interface BurgerMenuProps {
  open: boolean;
  onToggle: () => void;
}

export default memo(function BurgerMenu({ open, onToggle }: BurgerMenuProps) {
  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  return (
    <div
      className="fixed top-4 md:top-[27px] right-0 z-10 flex justify-end items-center"
      style={{ width: "50%" }}
    >
      <div className="pr-5 md:pr-10">
        <button
          onClick={handleClick}
          className={`burger-btn w-[59px] h-[59px] rounded-full border-none cursor-pointer flex flex-col gap-[4px] items-center justify-center transition-colors duration-300 ${
            open ? "bg-[#0B0B0B]" : "bg-[#F4F1E8]"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-6 h-[2px] transition-all duration-300 ${
              open ? "bg-[#F4F1E8] rotate-45 translate-y-[3px]" : "bg-[#111111]"
            }`}
          />
          <span
            className={`block w-6 h-[2px] transition-all duration-300 ${
              open ? "bg-[#F4F1E8] -rotate-45 translate-y-[-3px]" : "bg-[#111111]"
            }`}
          />
        </button>
      </div>
    </div>
  );
});
