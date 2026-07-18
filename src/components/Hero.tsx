import { useEffect, useRef, useCallback } from "react";
import CTAButton from "./CTAButton";

const SPOTLIGHT_RADIUS = 260;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    const m = mouseRef.current;
    const s = smoothRef.current;
    s.x += (m.x - s.x) * 0.1;
    s.y += (m.y - s.y) * 0.1;

    const cvs = canvasRef.current;
    const img = imgRef.current;
    if (!cvs || !img) { rafRef.current = requestAnimationFrame(tick); return; }

    const ctx = cvs.getContext("2d");
    if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, SPOTLIGHT_RADIUS);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,1)");
    grad.addColorStop(0.6, "rgba(255,255,255,0.75)");
    grad.addColorStop(0.75, "rgba(255,255,255,0.4)");
    grad.addColorStop(0.88, "rgba(255,255,255,0.12)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    const dataUrl = cvs.toDataURL();
    (img.style as any).maskImage = `url(${dataUrl})`;
    (img.style as any).webkitMaskImage = `url(${dataUrl})`;
    (img.style as any).maskSize = "100% 100%";
    (img.style as any).webkitMaskSize = "100% 100%";

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onResize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return (
    <main className="relative w-full overflow-hidden min-h-screen md:min-h-[800px] md:h-screen bg-[#E4E4E4]">
      {/* Big text behind image */}
      <div
        className="creator-text-animate absolute bottom-[-30px] md:bottom-[-40px] left-0 right-0 z-[2] pointer-events-none text-center"
        style={{
          animation: "creatorSlideUp 1s cubic-bezier(0.16,1,0.3,1) forwards",
          animationDelay: "1.5s",
          transform: "translateY(330px)",
        }}
      >
        <h2
          className="font-medium text-[#F4F1E8] leading-[80%] tracking-[-0.04em] whitespace-nowrap select-none"
          style={{ fontSize: "clamp(180px, 28vw, 560px)" }}
        >
          Geology
        </h2>
      </div>

      {/* Base image */}
      <div
        className="hero-image-animate absolute top-[30vh] md:top-0 left-0 right-0 bottom-0 z-[5] bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560')",
          backgroundPosition: "60% center",
          animation: "heroImageIn 1.2s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
          animationDelay: "1s",
          opacity: 0,
        }}
      />

      {/* Hidden canvas for mask generation */}
      <canvas ref={canvasRef} className="hidden absolute inset-0 pointer-events-none" />

      {/* Reveal image (masked by canvas) */}
      <div
        ref={imgRef}
        className="absolute top-[30vh] md:top-0 left-0 right-0 bottom-0 z-[7] pointer-events-none bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536')",
          backgroundPosition: "60% center",
        }}
      />

      {/* Content */}
      <div className="relative z-[8] flex flex-col justify-start items-start w-full max-w-[1600px] mx-auto px-4 pt-[110px] pb-6 md:absolute md:inset-0 md:justify-between md:px-10 md:py-[160px] md:pb-[100px] pointer-events-none">
        <div className="flex flex-col items-start gap-[30px] w-full pointer-events-auto">
          <h1 className="text-[22px] md:text-[28px] font-medium leading-[120%] tracking-[-0.02em] text-[#111111] max-w-[447px]">
            <WordReveal text="Explore the wonders of Geology — rocks, minerals, fossils & earth science." />
          </h1>
          <CTAButton />
        </div>
      </div>
    </main>
  );
}

function WordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.3em]"
          style={{
            opacity: 0,
            animation: "wordReveal 0.4s ease forwards",
            animationDelay: `${1 + i * 0.05}s`,
          }}
        >
          {word}
        </span>
      ))}
    </>
  );
}
