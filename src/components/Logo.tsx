import { memo } from "react";

export default memo(function Logo() {
  return (
    <div
      className="fixed top-[30px] left-0 z-10 flex justify-start items-center"
      style={{ width: "50%", mixBlendMode: "difference" }}
    >
      <div className="pl-5 md:pl-10">
        <a href="/" aria-label="Home">
          <img
            src="https://framerusercontent.com/images/VMcS7YYTM5PXfXvlHc9u3hSCMM.svg"
            alt=""
            width={32}
            height={32}
          />
        </a>
      </div>
    </div>
  );
});
