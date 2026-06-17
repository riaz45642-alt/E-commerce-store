import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const STYLE_OPTIONS = ["Casual", "Formal", "Streetwear", "Minimalist", "Bohemian", "Classic"];
const COLOR_OPTIONS = [
  { name: "Ink", hex: "#1A1A1E" },
  { name: "Porcelain", hex: "#F3EFE6" },
  { name: "Gold", hex: "#C9A227" },
  { name: "Sage", hex: "#7C8B72" },
  { name: "Rust", hex: "#A8543B" },
  { name: "Slate", hex: "#5B6770" },
  { name: "Wine", hex: "#6E2C3E" },
  { name: "Sand", hex: "#C9B79C" },
];
const PERSONALITY_OPTIONS = ["Bold", "Subtle", "Adventurous", "Refined", "Playful", "Practical"];

const STEPS = ["account", "style", "colors", "personality", "profile"];

export default function AuthOnboarding({ onComplete = (data) => console.log("onboarding complete", data) }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("signup");
  const [answers, setAnswers] = useState({
    name: "",
    email: "",
    password: "",
    style: null,
    colors: [],
    personality: null,
    sizePref: "",
  });
  const [direction, setDirection] = useState(1);

  const update = (key, value) => setAnswers((a) => ({ ...a, [key]: value }));

  const toggleColor = (name) =>
    setAnswers((a) => ({
      ...a,
      colors: a.colors.includes(name) ? a.colors.filter((c) => c !== name) : [...a.colors, name],
    }));

  const canAdvance = () => {
    const key = STEPS[step];
    if (key === "account") return answers.email.trim() && answers.password.trim() && (mode === "login" || answers.name.trim());
    if (key === "style") return !!answers.style;
    if (key === "colors") return answers.colors.length > 0;
    if (key === "personality") return !!answers.personality;
    return true;
  };

  const go = (delta) => {
    setDirection(delta);
    setStep((s) => Math.min(Math.max(s + delta, 0), STEPS.length - 1));
  };

  const finish = () => onComplete(answers);

  return (
    <div
      className="relative h-screen w-full flex flex-col overflow-hidden"
      style={{ background: INK, fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        @keyframes slideInRight { 0% { opacity:0; transform: translateX(28px); } 100% { opacity:1; transform: translateX(0); } }
        @keyframes slideInLeft { 0% { opacity:0; transform: translateX(-28px); } 100% { opacity:1; transform: translateX(0); } }
        .step-right { animation: slideInRight 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        .step-left { animation: slideInLeft 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        .opt {
          border: 1px solid rgba(243,239,230,0.15);
          color: ${PORCELAIN};
          transition: all 0.25s ease;
        }
        .opt:hover { border-color: rgba(201,162,39,0.5); background: rgba(201,162,39,0.06); }
        .opt.selected { border-color: ${GOLD}; background: rgba(201,162,39,0.12); }
        input.field {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(243,239,230,0.25);
          color: ${PORCELAIN};
          padding: 10px 2px;
          font-size: 0.95rem;
          outline: none;
          width: 100%;
        }
        input.field:focus { border-bottom-color: ${GOLD}; }
        input.field::placeholder { color: rgba(243,239,230,0.35); }
        @media (prefers-reduced-motion: reduce) {
          .step-right, .step-left { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* progress */}
      <div className="w-full px-8 md:px-16 pt-7 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-[2px] flex-1 rounded-full transition-all duration-500"
            style={{ background: i <= step ? GOLD : "rgba(243,239,230,0.15)" }}
          />
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div key={step} className={`w-full max-w-md ${direction > 0 ? "step-right" : "step-left"}`}>
          {STEPS[step] === "account" && (
            <div>
              <div className="flex gap-6 mb-8 justify-center">
                {["signup", "login"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="text-sm uppercase tracking-widest pb-2"
                    style={{
                      color: mode === m ? PORCELAIN : "rgba(243,239,230,0.4)",
                      borderBottom: mode === m ? `1px solid ${GOLD}` : "1px solid transparent",
                    }}
                  >
                    {m === "signup" ? "Create account" : "Log in"}
                  </button>
                ))}
              </div>
              <h2 className="text-center mb-8" style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", color: PORCELAIN }}>
                {mode === "signup" ? "Let's get you set up" : "Welcome back"}
              </h2>
              <div className="flex flex-col gap-1">
                {mode === "signup" && (
                  <input className="field" placeholder="Full name" value={answers.name} onChange={(e) => update("name", e.target.value)} />
                )}
                <input className="field" type="email" placeholder="Email" value={answers.email} onChange={(e) => update("email", e.target.value)} />
                <input className="field" type="password" placeholder="Password" value={answers.password} onChange={(e) => update("password", e.target.value)} />
              </div>
            </div>
          )}

          {STEPS[step] === "style" && (
            <QuestionGrid title="What's your everyday style?" sub="Pick the one that feels most like you.">
              <div className="grid grid-cols-2 gap-3">
                {STYLE_OPTIONS.map((o) => (
                  <button key={o} onClick={() => update("style", o)} className={`opt rounded-xl py-4 text-sm ${answers.style === o ? "selected" : ""}`}>
                    {o}
                  </button>
                ))}
              </div>
            </QuestionGrid>
          )}

          {STEPS[step] === "colors" && (
            <QuestionGrid title="Which tones do you gravitate to?" sub="Choose as many as you like.">
              <div className="grid grid-cols-4 gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c.name} onClick={() => toggleColor(c.name)} className="flex flex-col items-center gap-2">
                    <span
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: c.hex, border: answers.colors.includes(c.name) ? `2px solid ${GOLD}` : "1px solid rgba(243,239,230,0.2)" }}
                    >
                      {answers.colors.includes(c.name) && <Check size={16} style={{ color: c.hex === "#F3EFE6" ? INK : PORCELAIN }} />}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(243,239,230,0.6)" }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </QuestionGrid>
          )}

          {STEPS[step] === "personality" && (
            <QuestionGrid title="Pick the vibe that feels most you" sub="There's no wrong answer.">
              <div className="grid grid-cols-2 gap-3">
                {PERSONALITY_OPTIONS.map((o) => (
                  <button key={o} onClick={() => update("personality", o)} className={`opt rounded-xl py-4 text-sm ${answers.personality === o ? "selected" : ""}`}>
                    {o}
                  </button>
                ))}
              </div>
            </QuestionGrid>
          )}

          {STEPS[step] === "profile" && (
            <QuestionGrid title="Almost there" sub="Optional — helps us fit you better.">
              <input
                className="field"
                placeholder="Usual size (e.g. M, UK 9, 32W)"
                value={answers.sizePref}
                onChange={(e) => update("sizePref", e.target.value)}
              />
            </QuestionGrid>
          )}
        </div>
      </div>

      <div className="w-full px-8 md:px-16 pb-9 flex items-center justify-between">
        <button
          onClick={() => go(-1)}
          className="flex items-center gap-2 text-sm"
          style={{ color: step === 0 ? "rgba(243,239,230,0.2)" : "rgba(243,239,230,0.6)" }}
          disabled={step === 0}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => go(1)}
            disabled={!canAdvance()}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm uppercase tracking-widest transition-all"
            style={{
              border: `1px solid ${canAdvance() ? "rgba(201,162,39,0.5)" : "rgba(243,239,230,0.1)"}`,
              color: canAdvance() ? PORCELAIN : "rgba(243,239,230,0.25)",
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={finish}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm uppercase tracking-widest"
            style={{ background: GOLD, color: INK }}
          >
            Enter Veyra <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionGrid({ title, sub, children }) {
  return (
    <div>
      <h2 className="text-center mb-1" style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", color: PORCELAIN }}>
        {title}
      </h2>
      <p className="text-center text-sm mb-7" style={{ color: "rgba(243,239,230,0.5)" }}>
        {sub}
      </p>
      {children}
    </div>
  );
}