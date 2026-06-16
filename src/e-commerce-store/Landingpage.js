import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const STORE_NAME = "VEYRA";

export default function LandingPage({ onGetStarted = () => console.log("→ navigate to onboarding") }) {
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setTilt({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "#0B0B0E" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500&family=Inter:wght@400;500&display=swap');

        @keyframes letterRise {
          0% { opacity: 0; transform: translateY(48px) rotateX(50deg); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift1 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(36px,-26px); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-30px,28px); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(22px,32px); } }

        .letter {
          display: inline-block;
          opacity: 0;
          transform-origin: bottom;
          animation: letterRise 0.9s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .reveal { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards; }
        .orb1 { animation: drift1 14s ease-in-out infinite; }
        .orb2 { animation: drift2 18s ease-in-out infinite; }
        .orb3 { animation: drift3 16s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .letter, .reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
          .orb1, .orb2, .orb3 { animation: none !important; }
        }
      `}</style>

      <div
        className="orb1 absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          top: "-10%",
          left: "8%",
          background: "radial-gradient(circle, rgba(201,162,39,0.10), transparent 70%)",
          filter: "blur(40px)",
          transform: `translate(${tilt.x * 12}px, ${tilt.y * 12}px)`,
        }}
      />
      <div
        className="orb2 absolute w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          bottom: "-8%",
          right: "10%",
          background: "radial-gradient(circle, rgba(124,139,114,0.12), transparent 70%)",
          filter: "blur(40px)",
          transform: `translate(${tilt.x * -10}px, ${tilt.y * -10}px)`,
        }}
      />
      <div
        className="orb3 absolute w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{
          top: "30%",
          right: "22%",
          background: "radial-gradient(circle, rgba(243,239,230,0.05), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <nav className="relative z-10 w-full px-8 md:px-14 pt-8">
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "#F3EFE6", fontFamily: "Inter, sans-serif", opacity: 0.7 }}
        >
          Veyra
        </span>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {mounted && (
          <span
            className="reveal text-xs md:text-sm tracking-[0.35em] uppercase mb-6"
            style={{ color: "#C9A227", fontFamily: "Inter, sans-serif", animationDelay: "0.1s" }}
          >
            An intelligent shopping experience
          </span>
        )}

        <h1
          className="leading-none mb-7 select-none"
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 400,
            fontSize: "clamp(3.5rem, 12vw, 8.5rem)",
            color: "#F3EFE6",
            perspective: "600px",
          }}
        >
          {mounted &&
            STORE_NAME.split("").map((char, i) => (
              <span
                key={i}
                className="letter"
                style={{ animationDelay: `${0.25 + i * 0.07}s` }}
              >
                {char}
              </span>
            ))}
        </h1>

        {mounted && (
          <p
            className="reveal max-w-md text-sm md:text-base mb-12"
            style={{
              color: "#F3EFE6",
              opacity: 0.6,
              fontFamily: "Inter, sans-serif",
              animationDelay: "0.9s",
              lineHeight: 1.7,
            }}
          >
            Guided, personal, distraction-free. Veyra learns your taste and shows you only what fits.
          </p>
        )}

        {mounted && (
          <button
            onClick={onGetStarted}
            className="reveal group inline-flex items-center gap-3 rounded-full px-8 py-3.5 transition-all duration-300"
            style={{
              border: "1px solid rgba(201,162,39,0.45)",
              color: "#F3EFE6",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              animationDelay: "1.1s",
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,162,39,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Get started
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "#C9A227" }}
            />
          </button>
        )}
      </main>
    </div>
  );
}