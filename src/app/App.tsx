import { useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from "react";
import {
  Github, Linkedin, Mail, Phone, ExternalLink,
  Download, Send, MapPin, Code2, Menu, X, Award, Trophy,
  Zap, Sparkles, ArrowUpRight, MessageCircle
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { motion } from "framer-motion";

// ─── Global Styles ────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes aurora {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); }
    33%  { transform: translate(40px,-40px) scale(1.12) rotate(120deg); }
    66%  { transform: translate(-25px,25px) scale(0.9) rotate(240deg); }
    100% { transform: translate(0,0) scale(1) rotate(360deg); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-18px); }
  }
  @keyframes draw-path {
    from { stroke-dashoffset: 600; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes fade-up {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes text-shimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glow-pulse {
    0%,100% { box-shadow:0 0 20px rgba(0,245,255,0.25); }
    50%      { box-shadow:0 0 50px rgba(0,245,255,0.55), 0 0 100px rgba(0,245,255,0.15); }
  }
  @keyframes count-in {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes marquee-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  @keyframes blink-cursor {
    0%,100% { opacity:1; }
    50%      { opacity:0; }
  }
  @keyframes slide-in-left {
    from { opacity:0; transform:translateX(-40px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slide-in-right {
    from { opacity:0; transform:translateX(40px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes rotate-slow {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(1); opacity:0.6; }
    100% { transform:scale(1.5); opacity:0; }
  }

  * { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: rgba(0,245,255,0.25); border-radius:2px; }

  .grad-text {
    background: linear-gradient(135deg,#00F5FF 0%,#8B5CF6 50%,#3B82F6 100%);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: text-shimmer 5s ease infinite;
  }
  .grad-text-warm {
    background: linear-gradient(135deg,#F59E0B,#EF4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .glass-strong {
    background: rgba(255,255,255,0.055);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(255,255,255,0.11);
  }

  .reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.85s cubic-bezier(.22,1,.36,1), transform 0.85s cubic-bezier(.22,1,.36,1);
  }
  .reveal.visible { opacity:1; transform:translateY(0); }

  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.08s linear, box-shadow 0.3s ease, border-color 0.3s ease;
  }

  .marquee-track-left  { animation: marquee-left  28s linear infinite; }
  .marquee-track-right { animation: marquee-right 32s linear infinite; }
  .marquee-track-left:hover,
  .marquee-track-right:hover { animation-play-state: paused; }

  .timeline-line-fill {
    background: linear-gradient(to bottom,#00F5FF,#8B5CF6,#3B82F6,#10B981);
  }

  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }

  .nav-desktop-links {
    display: flex;
    gap: 32px;
    align-items: center;
  }
  .nav-desktop-action {
    display: inline-flex !important;
    align-items: center;
  }
  .nav-mobile-toggle {
    display: none !important;
  }

  @media (max-width: 900px) {
    .nav-desktop-links {
      display: none !important;
    }
    .nav-desktop-action {
      display: none !important;
    }
    .nav-mobile-toggle {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
    .about-grid   { grid-template-columns: 1fr !important; gap: 36px !important; }
    .contact-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
    .hero-grid    { grid-template-columns: 1fr !important; gap: 40px !important; min-height: auto !important; }
  }
  @media (max-width: 768px) {
    .tl-line-wrapper {
      left: 20px !important;
      transform: none !important;
    }
    .tl-item-row {
      flex-direction: column !important;
      position: relative !important;
      padding-left: 44px !important;
    }
    .tl-dot-wrapper {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 40px !important;
    }
    .tl-card-left, .tl-card-right {
      margin-left: 0 !important;
      margin-right: 0 !important;
      width: 100% !important;
      flex: none !important;
      order: 1 !important;
    }
    .tl-spacer {
      display: none !important;
    }
  }
  @media (max-width: 900px), (hover: none) {
    .project-card-actions {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  }
  @media (max-width: 640px) {
    .cert-scroll { flex-direction: column !important; }
  }
`;

// ─── Loader ────────────────────────────────────────────────────────────────────

function Loader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; c: string };
    const particles: P[] = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.8 + 0.4, a: Math.random() * 0.5 + 0.1,
      c: Math.random() > 0.55 ? "#00F5FF" : "#8B5CF6",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.globalAlpha = p.a; ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2400);
    let prog = 0;
    const iv = setInterval(() => {
      prog = Math.min(prog + Math.random() * 3.5 + 0.8, 100);
      setProgress(Math.round(prog));
      if (prog >= 100) clearInterval(iv);
    }, 55);
    const t3 = setTimeout(() => setExiting(true), 4400);
    const t4 = setTimeout(onDone, 5000);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4); clearInterval(iv);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#050505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: exiting ? 0 : 1, transform: exiting ? "scale(1.06)" : "scale(1)", transition: "opacity 0.6s ease,transform 0.6s ease" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.022) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ position: "relative", width: 140, height: 90, margin: "0 auto" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(0,245,255,0.15)", animation: "glow-pulse 2.5s ease-in-out infinite" }} />
          <svg width="140" height="90" viewBox="0 0 140 90" fill="none">
            <defs>
              <linearGradient id="lgVK" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F5FF" /><stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <polyline points="8,8 36,82 64,8" stroke="url(#lgVK)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="240" strokeDashoffset="240" style={{ animation: "draw-path 1.4s 0.1s ease forwards" }} />
            <line x1="82" y1="8" x2="82" y2="82" stroke="url(#lgVK)" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" style={{ animation: "draw-path 0.9s 0.4s ease forwards" }} />
            <polyline points="82,46 130,8" stroke="url(#lgVK)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="80" strokeDashoffset="80" style={{ animation: "draw-path 0.7s 0.7s ease forwards" }} />
            <polyline points="82,46 130,82" stroke="url(#lgVK)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="80" strokeDashoffset="80" style={{ animation: "draw-path 0.7s 0.9s ease forwards" }} />
          </svg>
        </div>
        {phase >= 1 && <div style={{ marginTop: 28, color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: "5px", textTransform: "uppercase", fontFamily: "Outfit,sans-serif", animation: "fade-up 0.7s ease forwards" }}></div>}
        {phase >= 2 && (
          <div style={{ marginTop: 50, animation: "fade-up 0.5s ease forwards" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", fontFamily: "JetBrains Mono,monospace", marginBottom: 12 }}>Loading Portfolio...</div>
            <div style={{ width: "min(280px, 80vw)", height: 1, background: "rgba(255,255,255,0.08)", borderRadius: 1, overflow: "hidden", margin: "0 auto" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00F5FF,#8B5CF6)", transition: "width 0.08s ease", boxShadow: "0 0 12px rgba(0,245,255,0.6)" }} />
            </div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "JetBrains Mono,monospace" }}>{progress}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Contact"];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        padding: "0 clamp(16px, 4vw, 32px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(5,5,5,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.045)" : "none",
        transition: "all 0.35s ease",
      }}
    >
      {/* Left: Logo */}
      <a
        href="https://www.linkedin.com/in/vinay-kumar-5024aa263/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          border: "none",
          padding: 0,
          fontFamily: "Outfit,sans-serif",
          fontSize: 22,
          fontWeight: 800,
          background: "linear-gradient(135deg,#00F5FF,#8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          cursor: "pointer",
          display: "inline-block",
        }}
      >
        VK
      </a>

      {/* Center: Links */}
      <div className="nav-desktop-links">
        {NAV_LINKS.map((l) => (
          <NavLink key={l} onClick={() => go(l)}>
            {l}
          </NavLink>
        ))}
      </div>

      {/* Right: Actions (LeetCode, Hire Me & Mobile Toggle) */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        
        {/* LeetCode Button */}
        <a
          href="https://leetcode.com/u/vinay55ti/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-desktop-action"
          style={{
            textDecoration: "none",
            padding: "8px 18px",
            borderRadius: 100,
            background: "rgba(255,161,22,0.08)",
            border: "1px solid rgba(255,161,22,0.3)",
            color: "#FFA116",
            fontSize: 13,
            fontFamily: "Outfit,sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,161,22,0.18)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(255,161,22,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,161,22,0.08)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          LeetCode
        </a>

        {/* Hire Me Button */}
        <button
          onClick={() => go("Contact")}
          className="nav-desktop-action"
          style={{
            padding: "8px 22px",
            borderRadius: 100,
            background: "rgba(0,245,255,0.08)",
            border: "1px solid rgba(0,245,255,0.28)",
            color: "#00F5FF",
            fontSize: 13,
            fontFamily: "Outfit,sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,245,255,0.18)";
            e.currentTarget.style.boxShadow = "0 0 24px rgba(0,245,255,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,245,255,0.08)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Hire Me
        </button>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="nav-mobile-toggle"
          aria-label="Toggle navigation menu"
          style={{ background: "none", border: "none", color: "#fff", padding: 6, cursor: "pointer" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            background: "rgba(5,5,5,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "24px clamp(16px, 4vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            animation: "fade-up 0.3s ease",
          }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              onClick={() => go(l)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.75)",
                fontSize: 18,
                fontFamily: "Outfit,sans-serif",
                textAlign: "left",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              {l}
            </button>
          ))}
          {/* Mobile LeetCode Link */}
          <a
            href="https://leetcode.com/u/vinay55ti/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFA116",
              textDecoration: "none",
              fontSize: 18,
              fontFamily: "Outfit,sans-serif",
              padding: "4px 0",
            }}
          >
            LeetCode ↗
          </a>
          {/* Mobile Hire Me Button */}
          <button
            onClick={() => go("Contact")}
            style={{
              marginTop: 6,
              padding: "10px 20px",
              borderRadius: 100,
              background: "rgba(0,245,255,0.1)",
              border: "1px solid rgba(0,245,255,0.35)",
              color: "#00F5FF",
              fontSize: 15,
              fontFamily: "Outfit,sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "center",
              width: "100%",
            }}
          >
            Hire Me
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 0",
        color: hov ? "#00F5FF" : "rgba(255,255,255,0.55)",
        fontSize: 14,
        fontFamily: "Outfit,sans-serif",
        letterSpacing: "0.3px",
        transition: "color 0.2s",
        position: "relative",
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "1px",
          width: hov ? "100%" : "0%",
          background: "linear-gradient(90deg,#00F5FF,#8B5CF6)",
          transition: "width 0.25s ease",
        }}
      />
    </button>
  );
}
// ─── Magnetic Button ──────────────────────────────────────────────────────────

function MagBtn({ children, onClick, variant = "primary" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "ghost" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
  }, []);
  const onLeave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "clamp(10px, 2.5vw, 13px) clamp(18px, 4vw, 30px)", borderRadius: 100, fontSize: "clamp(12px, 2vw, 14px)", fontFamily: "Outfit,sans-serif", fontWeight: 500, letterSpacing: "0.4px", cursor: "pointer", transition: "box-shadow 0.3s ease,background 0.3s ease", border: "none", position: "relative", overflow: "hidden", whiteSpace: "nowrap" };
  const vars: Record<string, React.CSSProperties> = {
    primary: { background: "linear-gradient(135deg,#00F5FF,#3B82F6)", color: "#000", boxShadow: "0 0 28px rgba(0,245,255,0.3)" },
    outline: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" },
    ghost: { background: "rgba(255,255,255,0.055)", color: "rgba(255,255,255,0.72)" },
  };
  return (
    <button ref={ref} style={{ ...base, ...vars[variant] }} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={e => {
        if (variant === "primary") e.currentTarget.style.boxShadow = "0 0 50px rgba(0,245,255,0.55)";
        if (variant === "outline") { e.currentTarget.style.borderColor = "rgba(0,245,255,0.5)"; e.currentTarget.style.color = "#00F5FF"; }
      }}>
      {children}
    </button>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({ id, children, style = {} }: { id: string; children: ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <section ref={ref} id={id} className="reveal" style={{ padding: "clamp(60px, 8vw, 100px) 0", ...style }}>{children}</section>;
}

function SectionHeader({ num, eyebrow, title, accent }: { num: string; eyebrow: string; title: string; accent: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "clamp(36px, 6vw, 72px)" }}>
      <div style={{ color: "rgba(0,245,255,0.6)", fontSize: 11, letterSpacing: "6px", textTransform: "uppercase", fontFamily: "JetBrains Mono,monospace", marginBottom: 14 }}>{num} / {eyebrow}</div>
      <h2 style={{ fontSize: "clamp(30px,5vw,54px)", fontWeight: 800, color: "#fff", fontFamily: "Outfit,sans-serif", letterSpacing: "-1.5px", margin: 0 }}>
        {title}{" "}<span style={{ background: "linear-gradient(135deg,#00F5FF,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{accent}</span>
      </h2>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const ROLES = [
  "Frontend Developer",
  "React.js Developer",
  "MERN Stack Developer",
  "Java Developer",
  "DSA with Java",
  "ECE Undergraduate"
];

// 🟢 1. TERMINAL COMPONENT (WITH CYAN HOVER BORDER & GLOW)
function HeroTerminal() {
  const [lineIdx, setLineIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Hover state toggle

  const lines = [
    { prefix: "const", name: " developer", eq: " = {", color: "rgba(255,255,255,0.5)" },
    { prefix: "  name:", value: ' "Vinay Kumar"', color: "#00F5FF" },
    { prefix: "  role:", value: ' "MERN Developer"', color: "orange" },
    { prefix: "}", value: "", color: "rgba(255,255,255,0.5)" },
    { prefix: "", value: "", color: "white" },
    { prefix: "public class", value: " Developer {", color: "#F97316" },
    { prefix: "  public static void", value: " main(String[] args) {", color: "red" },
    { prefix: "    String", value: ' name = "Vinay Kumar";', color: "white" },
    { prefix: "    System.out.println(", value: '"Hello, I\'m " + name);', color: "#10B981" },
    { prefix: "  }", value: "", color: "rgba(255,255,255,0.5)" },
    { prefix: "}", value: "", color: "rgba(255,255,255,0.5)" },
  ];

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const t = setTimeout(() => setLineIdx(i => i + 1), 350);
    return () => clearTimeout(t);
  }, [lineIdx, lines.length]);

  return (
    // ... existing code ...
    <div
      className="glass-strong"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        // Ye line add/update karo:
        transform: isHovered ? "translateY(-10px) translateX(10px)" : "translateY(10px) translateX(0px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

        border: isHovered ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isHovered
          ? "0 0 40px rgba(0,245,255,0.18), 0 40px 80px rgba(0,0,0,0.5)"
          : "0 0 60px rgba(0,245,255,0.08), 0 40px 80px rgba(0,0,0,0.4)"
      }}
    >
      {/* Title bar */}
      <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA42" }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono,monospace" }}>developer.jsx</span>
      </div>
      {/* Code */}
      <div style={{ padding: "clamp(16px, 3vw, 24px) clamp(14px, 3vw, 28px)", fontFamily: "JetBrains Mono,monospace", fontSize: "clamp(11px, 2.5vw, 13px)", lineHeight: 2, minHeight: 300, overflowX: "auto" }}>
        {lines.slice(0, lineIdx).map((l, i) => (
          <div key={i} style={{ animation: "fade-up 0.3s ease", display: "flex", alignItems: "center", gap: 0, whiteSpace: "nowrap" }}>
            <span style={{ color: "rgba(255,255,255,0.35)", marginRight: 16, fontSize: 10, userSelect: "none", width: 14, display: "inline-block", textAlign: "right" }}>{i + 1}</span>
            <span>
              <span style={{ color: "rgba(139,92,246,0.9)" }}>{l.prefix}</span>
              {"name" in l && <span style={{ color: "rgba(255,255,255,0.6)" }}>{(l as { name: string }).name}</span>}
              {"eq" in l && <span style={{ color: "rgba(255,255,255,0.4)" }}>{(l as { eq: string }).eq}</span>}
              {"value" in l && (l as { value: string }).value && <span style={{ color: l.color }}>{(l as { value: string }).value}</span>}
            </span>
          </div>
        ))}
        {lineIdx < lines.length && (
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.35)", marginRight: 16, fontSize: 10, width: 14, display: "inline-block", textAlign: "right" }}>{lineIdx + 1}</span>
            <span style={{ width: 8, height: 16, background: "#00F5FF", animation: "blink-cursor 1s ease infinite", display: "inline-block", borderRadius: 1 }} />
          </div>
        )}
      </div>
      {/* Status bar */}
      <div style={{ padding: "8px 16px", background: "linear-gradient(90deg,rgba(0,245,255,0.1),rgba(139,92,246,0.1))", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 10, fontFamily: "JetBrains Mono,monospace" }}>
        <span style={{ color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} /> TypeScript</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>UTF-8</span>
        <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>Ln 7, Col 2</span>
      </div>
    </div>
  );
}

// 🟢 2. INDIVIDUAL HOVER BADGE COMPONENT (FOR DYNAMIC CYAN BORDER)
function HeroSkillBadge(props: { text: string; delayIndex: number }) {
  const { text, delayIndex } = props;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "6px clamp(10px, 2vw, 14px)",
        borderRadius: 100,
        background: "rgba(255,255,255,0.04)",
        fontSize: "clamp(10px, 2vw, 11px)",
        fontFamily: "JetBrains Mono,monospace",
        color: isHovered ? "#fff" : "rgba(255,255,255,0.45)",
        transition: "all 0.3s ease-in-out",

        border: isHovered ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isHovered ? "0 0 15px rgba(0, 245, 255, 0.3)" : "none",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "pointer",
        animation: `fade-up 0.5s ${0.8 + delayIndex * 0.1}s both`
      }}
    >
      {text}
    </div>
  );
}

// 🟢 3. MAIN HERO COMPONENT (NO DEFAULT EXPORT - FIXED HEIGHT & MARGINS)
function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const iv = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({ x: (e.clientX - innerWidth / 2) / innerWidth, y: (e.clientY - innerHeight / 2) / innerHeight });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize(); window.addEventListener("resize", resize);
    type Star = { x: number; y: number; r: number; a: number; da: number; phase: number };
    const stars: Star[] = Array.from({ length: 250 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.7 + 0.15,
      da: Math.random() * 0.018 + 0.005, phase: Math.random() * Math.PI * 2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.phase += s.da;
        const a = s.a * (0.4 + 0.6 * Math.sin(s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const quickStats = [
    { val: "1+", label: "Years Exp" },
    { val: "10+", label: "Projects" },
    { val: "100+", label: "Commits" },
    { val: "40", label: "Leetcode" },
  ];

  const badgesList = ["React.js", "JavaScript", "Node.js", "Express.js", "MongoDB", "Java", "REST APIs"];

  return (
    <section id="hero" style={{ minHeight: "100vh", height: "auto", width: "100%", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "transparent", boxSizing: "border-box", padding: "clamp(80px, 12vh, 120px) 0 clamp(40px, 6vh, 60px)" }}>

      {/* Canvas Fixed Background */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Aurora blobs */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,255,0.06) 0%,transparent 70%)", filter: "blur(56px)", animation: "aurora 22s ease-in-out infinite", transform: `translate(${mouse.x * 28}px,${mouse.y * 28}px)`, transition: "transform 0.25s ease", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)", filter: "blur(56px)", animation: "aurora 28s ease-in-out infinite reverse", transform: `translate(${-mouse.x * 18}px,${-mouse.y * 18}px)`, transition: "transform 0.25s ease", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.03) 0%,transparent 70%)", filter: "blur(80px)", transform: `translate(-50%,-50%) translate(${mouse.x * 10}px,${mouse.y * 10}px)`, transition: "transform 0.25s ease", pointerEvents: "none", zIndex: 1 }} />

      {/* Grid Fixed Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.015) 1px,transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      {/* Content wrapper - Full width balanced layout */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "min(92%, 1300px)", margin: "0 auto", padding: "0 clamp(16px, 3vw, 24px)", width: "100%", boxSizing: "border-box" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center", minHeight: "auto", boxSizing: "border-box" }}>

          {/* Left Side Info */}
          <div style={{ transform: `translate(${mouse.x * -10}px,${mouse.y * -10}px)`, transition: "transform 0.12s ease" }}>
            {/* Status pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 8px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 20, animation: "fade-up 0.8s 0.1s both" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.8)", display: "inline-block", animation: "glow-pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, color: "rgba(16,185,129,0.9)", fontFamily: "JetBrains Mono,monospace", letterSpacing: "1px" }}>Available for opportunities</span>
            </div>

            <div style={{ fontSize: 12, letterSpacing: "7px", textTransform: "uppercase", fontFamily: "JetBrains Mono,monospace", color: "rgba(0,245,255,0.65)", marginBottom: 12, animation: "fade-up 0.8s 0.2s both" }}>
              Portfolio 2026
            </div>

            <h1 style={{ fontSize: "clamp(36px,5vw,76px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-2px", fontFamily: "Outfit,sans-serif", margin: "0 0 12px", animation: "fade-up 0.8s 0.3s both" }}>
              Hello, I'm<br />
              <span className="grad-text">Vinay Kumar</span>
            </h1>

            <div style={{ height: 44, overflow: "hidden", animation: "fade-up 0.8s 0.5s both", marginBottom: 16 }}>
              <div key={roleIdx} style={{ fontSize: "clamp(16px,2vw,24px)", color: "rgba(255,255,255,0.52)", fontFamily: "Outfit,sans-serif", fontWeight: 300, letterSpacing: "0.5px", animation: "fade-up 0.45s ease forwards" }}>
                {ROLES[roleIdx]}
              </div>
            </div>

            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.36)", maxWidth: 440, lineHeight: 1.8, fontFamily: "Inter,sans-serif", animation: "fade-up 0.8s 0.7s both", marginBottom: 28 }}>
              Passionate MERN Stack Developer building modern, responsive, and scalable web applications. Currently mastering Data Structures & Algorithms in Java while creating impactful digital experiences.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fade-up 0.8s 0.9s both", marginBottom: 36 }}>
              <MagBtn onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                <Sparkles size={14} style={{ marginRight: 8 }} /> View Projects
              </MagBtn>
              <MagBtn variant="outline" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Hire Me <ArrowUpRight size={14} style={{ marginLeft: 6 }} />
              </MagBtn>
              <a
                href={`${window.location.origin}/Vinay_kumar.pdf`}
                download="Vinay_kumar.pdf"
                style={{ textDecoration: "none" }}
              >
                <MagBtn variant="ghost">
                  <Download size={14} style={{ marginRight: 8 }} /> Resume
                </MagBtn>
              </a>
            </div>

            {/* Quick stats */}
            <div
              style={{
                display: "flex",
                gap: 0,
                animation: "fade-up 0.8s 1.1s both",
                flexWrap: "wrap",
              }}
            >
              {quickStats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    paddingRight: 24,
                    marginRight: 24,
                    marginBottom: 16,
                    borderRight:
                      i !== quickStats.length - 1
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      fontFamily: "Outfit, sans-serif",
                      lineHeight: 1,
                      marginBottom: 6,
                      background: "linear-gradient(135deg,#00F5FF,#8B5CF6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.val}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.38)",
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Info */}
          <div style={{ transform: `translate(${mouse.x * 8}px,${mouse.y * 8}px)`, transition: "transform 0.12s ease", animation: "fade-up 0.8s 0.5s both" }}>
            <HeroTerminal />

            {/* Tech Badges with internal map hover layout */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16, justifyContent: "center" }}>
              {badgesList.map((badge, idx) => (
                <HeroSkillBadge key={badge} text={badge} delayIndex={idx} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.5, animation: "fade-up 1s 1.6s both" }}>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,transparent,rgba(0,245,255,0.6))", animation: "float 2.2s ease-in-out infinite" }} />
        <div style={{ fontSize: 9, letterSpacing: "4px", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono,monospace", textTransform: "uppercase" }}>Scroll</div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2024",
    title: "Started B.Tech",
    place: "ABES Engineering College • ECE",
    icon: "🎓",
  },
  {
    year: "2025",
    title: "Frontend Development",
    place: "HTML • CSS • JavaScript • React",
    icon: "💻",
  },
  {
    year: "2026",
    title: "Full Stack Journey",
    place: "Node.js • Express • MongoDB",
    icon: "🚀",
  },
  {
    year: "2026",
    title: "Java DSA",
    place: "Problem Solving & Interview Prep",
    icon: "☕",
  },
];

function AboutTimelineCard({ year, title, place, icon }: { year: string; title: string; place: string; icon: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 12,
        background: hov ? "rgba(0,245,255,0.035)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? "rgba(0,245,255,0.16)" : "rgba(255,255,255,0.055)"}`,
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hov ? "translateX(6px)" : "translateX(0)",
        boxShadow: hov ? "0 0 20px rgba(0,245,255,0.05)" : "none"
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 13, fontFamily: "Outfit,sans-serif" }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Inter,sans-serif", marginTop: 1 }}>{place}</div>
      </div>
      <div style={{ color: "#00F5FF", fontSize: 11, fontFamily: "JetBrains Mono,monospace", opacity: 0.7 }}>{year}</div>
    </div>
  );
}

function About() {
  return (
    <Section id="about">
      <div style={{ width: "100%", maxWidth: 1350, margin: "0 auto", padding: "0 clamp(16px, 4vw, 50px)" }}>

        <SectionHeader num="01" eyebrow="About" title="Get To " accent="Know Me" />

        {/* Layout Grid System Container */}
        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "stretch",
          marginTop: 48
        }}>

          {/* LEFT SIDE: Image Wrapper Block */}
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
            <div
              className="glass-strong"
              style={{
                width: "100%",
                minHeight: "clamp(300px, 45vh, 520px)",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                flex: 1,
                // Initial Border Style
                border: "1px solid rgba(255,255,255,0.15)",
                // Transition for the border color
                transition: "border-color 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
              }}
              // Hover events moved to parent to control border
              onMouseEnter={e => {
                // Change Border Color on Hover
                e.currentTarget.style.borderColor = "rgba(97, 218, 251, 0.8)"; // e.g., Light Blue accent
                // Find image and apply its hover effect
                const img = e.currentTarget.querySelector('img');
                if (img) {
                  img.style.opacity = "0.95";
                  img.style.transform = "scale(1.08)";
                }
              }}
              onMouseLeave={e => {
                // Reset Border Color on Hover Exit
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                // Find image and reset its effect
                const img = e.currentTarget.querySelector('img');
                if (img) {
                  img.style.opacity = "0.75";
                  img.style.transform = "scale(1)";
                }
              }}
            >
              <img
                src="./Vinay.png"
                alt="Vinay Kumar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.75,
                  // Only transition transform for the image, border handles color
                  transition: "opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                  transform: "scale(1)"
                }}
              />
              {/* Dark Gradient Overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 50%)", pointerEvents: "none" }} />
            </div>

            {/* Experience Floating Badge */}
            <div className="glass-strong" style={{ position: "absolute", bottom: "clamp(12px, 2vw, 20px)", right: "clamp(12px, 2vw, 20px)", borderRadius: 16, padding: "12px 18px", boxShadow: "0 0 32px rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)", background: "rgba(10,10,10,0.8)", zIndex: 5 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#00F5FF", fontFamily: "Outfit,sans-serif", lineHeight: 1 }}>1+</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "Inter,sans-serif", marginTop: 2 }}>Years Exp</div>
            </div>
          </div>

          {/* RIGHT SIDE: Text & Timeline Content (Fixed Nesting Closures Here) */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>

            <div>
              {/* PREMIUM EYEBROW SECTION */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "1px", background: "#00F5FF", opacity: 0.8 }}></div>
                <span style={{
                  color: "#00F5FF",
                  fontSize: "12px",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  opacity: 0.9
                }}>
                  01 . About Me
                </span>
              </div>

              {/* Bio Content Paragraph */}
              <p
                style={{
                  fontSize: 15.5,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.9,
                  fontFamily: "Inter, sans-serif",
                  margin: 0,
                  paddingBottom: 24,
                }}
              >
                👉 I'm{" "}
                <span style={{ color: "#ffffff", fontWeight: "600" }}>Vinay Kumar</span>, a passionate{" "}
                <span style={{ color: "#3B82F6", fontWeight: "600" }}>Full Stack Web Developer</span> and{" "}
                <span style={{ color: "#F59E0B", fontWeight: "600" }}>3rd Year ECE Student</span> focused on building modern,
                responsive, and user-friendly web applications.

                <br /><br />

                👉 I primarily work with{" "}
                <span style={{ color: "#10B981", fontWeight: "600" }}>HTML</span>,{" "}
                <span style={{ color: "#10B981", fontWeight: "600" }}>CSS</span>,{" "}
                <span style={{ color: "#10B981", fontWeight: "600" }}>JavaScript</span>, and{" "}
                <span style={{ color: "#10B981", fontWeight: "600" }}>React.js</span>, and I build real projects using the{" "}
                <span style={{ color: "#22C55E", fontWeight: "600" }}>MERN Stack</span> (MongoDB, Express, React, Node.js).

                <br /><br />

                👉 I also practice{" "}
                <span style={{ color: "#A855F7", fontWeight: "600" }}>Data Structures & Algorithms in Java</span> to improve problem-solving
                and write optimized code.

                <br /><br />

                👉 I enjoy building real-world projects, improving performance, and creating clean, scalable{" "}
                <span style={{ color: "#EC4899", fontWeight: "600" }}>UI/UX experiences</span>

                <br /><br />

                <span
                  style={{
                    color: "#FF4D4F",
                    fontWeight: "700",
                    fontStyle: "italic",
                    fontSize: "17px",
                  }}
                >
                  "Building digital experiences that are modern, scalable, and crafted with purpose."<br></br><br></br>
                </span>
                <span
                  style={{
                    color: "orange",
                    fontWeight: "700",
                    fontStyle: "italic",
                    fontSize: "17px",
                  }}
                >
                  “Code is not just instructions for machines — it’s a way to turn imagination into reality, one bug at a time.”
                </span>
              </p>
            </div>

            {/* Timeline Cards List Stack Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {TIMELINE.map((item, i) => <AboutTimelineCard key={i} {...item} />)}
            </div>

          </div> {/* Right side container ends cleanly inside layout framework */}

        </div>
      </div>
    </Section >
  );
}

// ─── Skills (Marquee) ─────────────────────────────────────────────────────────

// --- 1. Interface ---
interface SkillDef {
  name: string;
  cat: string;
  color: string;
  years: number;
  level: number;
  icon: string;
  abbr: string;
  bg: string;
}

// --- 2. Data ---
const ALL_SKILLS: SkillDef[] = [
  { name: "HTML5", cat: "Frontend", color: "#E34F26", years: 2, level: 95, icon: "https://cdn.simpleicons.org/html5/white", abbr: "H5", bg: "#E34F26" },
  { name: "CSS3", cat: "Frontend", color: "#1572B6", years: 2, level: 92, icon: "https://cdn.simpleicons.org/css/white", abbr: "C3", bg: "#1572B6" },
  { name: "JavaScript", cat: "Frontend", color: "#F7DF1E", years: 2, level: 88, icon: "https://cdn.simpleicons.org/javascript/black", abbr: "JS", bg: "#F7DF1E" },
  { name: "React.js", cat: "Frontend", color: "#61DAFB", years: 1, level: 82, icon: "https://cdn.simpleicons.org/react/black", abbr: "RE", bg: "#61DAFB" },
  { name: "Node.js", cat: "Backend", color: "#339933", years: 1, level: 78, icon: "https://cdn.simpleicons.org/nodedotjs/white", abbr: "NJ", bg: "#339933" },
  { name: "Express.js", cat: "Backend", color: "#000000", years: 1, level: 75, icon: "https://cdn.simpleicons.org/express/white", abbr: "EX", bg: "#000000" },
  { name: "MongoDB", cat: "Backend", color: "#47A248", years: 1, level: 72, icon: "https://cdn.simpleicons.org/mongodb/white", abbr: "DB", bg: "#47A248" },
  { name: "REST API", cat: "Backend", color: "#06B6D4", years: 1, level: 80, icon: "https://cdn.simpleicons.org/openapiinitiative/white", abbr: "RA", bg: "#06B6D4" },
  { name: "Java", cat: "Programming", color: "#F89820", years: 1, level: 78, icon: "https://cdn.simpleicons.org/openjdk/white", abbr: "JV", bg: "#F89820" },
  { name: "C++", cat: "Programming", color: "#00599C", years: 2, level: 80, icon: "https://cdn.simpleicons.org/cplusplus/white", abbr: "C+", bg: "#00599C" },
  { name: "DSA", cat: "Programming", color: "#8B5CF6", years: 1, level: 75, icon: "https://cdn.simpleicons.org/codeforces/white", abbr: "DS", bg: "#8B5CF6" },
  { name: "Arduino", cat: "Hardware", color: "#00979D", years: 1, level: 75, icon: "https://cdn.simpleicons.org/arduino/white", abbr: "AR", bg: "#00979D" },
  { name: "FPGA", cat: "Hardware", color: "#E51050", years: 1, level: 68, icon: "https://api.iconify.design/simple-icons:xilinx.svg?color=%23E51050", abbr: "FP", bg: "white" },
  { name: "Vivado", cat: "Hardware", color: "#FF6600", years: 1, level: 65, icon: "https://api.iconify.design/simple-icons:xilinx.svg?color=%23FF6600", abbr: "VV", bg: "white" },
  { name: "GitHub", cat: "Tools", color: "#181717", years: 2, level: 85, icon: "https://cdn.simpleicons.org/github/white", abbr: "GH", bg: "#181717" },
  { name: "VS Code", cat: "Tools", color: "#007ACC", years: 2, level: 95, icon: "https://api.iconify.design/vscode-icons:file-type-vscode.svg", abbr: "VS", bg: "#0D1117" },
  { name: "Figma", cat: "Tools", color: "#F24E1E", years: 1, level: 70, icon: "https://cdn.simpleicons.org/figma/white", abbr: "FG", bg: "#F24E1E" },
];

const ROW1 = ALL_SKILLS.slice(0, 9);
const ROW2 = ALL_SKILLS.slice(9);

// --- 3. Components ---

function SkillPill({ s }: { s: SkillDef }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px 10px 10px", borderRadius: 100,
        background: hov ? `${s.color}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${hov ? s.color + "40" : "rgba(255,255,255,0.07)"}`,
        cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", flexShrink: 0,
        boxShadow: hov ? `0 8px 24px ${s.color}20` : "none", transform: hov ? "scale(1.05)" : "scale(1)"
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: hov ? "#fff" : s.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease" }}>
        <img src={s.icon} alt={s.name} style={{ width: 20, height: 20, objectFit: "contain" }} />
      </div>
      <div>
        <div style={{ color: hov ? "#fff" : "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", transition: "color 0.3s" }}>{s.name}</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{s.level}%</div>
      </div>
    </div>
  );
}

function MarqueeRow({ skills, direction }: { skills: SkillDef[]; direction: "left" | "right" }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...skills, ...skills];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ overflow: "hidden", position: "relative", padding: "8px 0" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(30px, 8vw, 100px)", background: "linear-gradient(90deg,#050505,transparent)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(30px, 8vw, 100px)", background: "linear-gradient(-90deg,#050505,transparent)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ display: "flex", gap: 12, width: "max-content", animation: direction === "left" ? "scrollLeft 30s linear infinite" : "scrollRight 30s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {doubled.map((s, i) => <SkillPill key={`${s.name}-${i}`} s={s} />)}
      </div>
    </div>
  );
}

function CategoryFilter({ cat }: { cat: string }) {
  const [hov, setHov] = useState(false);
  const colors: Record<string, string> = { "Frontend": "#61DAFB", "Backend": "#339933", "Programming": "#8B5CF6", "Hardware": "#00979D", "Tools": "#007ACC" };
  const color = colors[cat] || "#ffffff";
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "8px 20px", borderRadius: 100, background: hov ? `${color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${hov ? color + "50" : "rgba(255,255,255,0.06)"}`, fontSize: 12, color: hov ? color : "rgba(255,255,255,0.38)", fontFamily: "Outfit, sans-serif", cursor: "pointer", transition: "all 0.3s ease", boxShadow: hov ? `0 0 15px ${color}30` : "none" }}>
      {cat}
    </div>
  );
}

// --- 4. Main Export ---
function Skills() {
  return (
    <Section id="skills">
      <SectionHeader num="02" eyebrow="Skills" title="What I" accent="Work With" />
      <div style={{ padding: "20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <MarqueeRow skills={ROW1} direction="left" />
          <MarqueeRow skills={ROW2} direction="right" />
        </div>
      </div>
      <div style={{ maxWidth: 1160, margin: "20px auto 0", padding: "0 clamp(16px, 4vw, 24px)", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {["Frontend", "Backend", "Programming", "Hardware", "Tools"].map(cat => <CategoryFilter key={cat} cat={cat} />)}
      </div>
    </Section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

interface ProjectItem {
  title: string;
  desc: string;
  tech: string[];
  img: string;
  color: string;
  video?: string;
  liveUrl?: string;   // Added
  githubUrl?: string; // Added
}

const PROJECTS: ProjectItem[] = [
  {
    title: "Swad Yatra",
    desc: "A responsive food discovery web application built with React that allows users to browse Indian cuisines, search recipes, and view detailed meal information through API integration.",
    tech: ["React", "CSS3", "REST API"],
    img: "./images/Swad_yatra.png",
    color: "#FF6B6B",
    liveUrl: "https://swad-yatra.vercel.app/",
    githubUrl: "https://github.com/Vinaygkp/Swad_Yatra",
  },
  {
    title: "Attendance Tracker",
    desc: "A responsive college attendance management platform featuring attendance tracking, subject management, interactive quizzes, and progress monitoring with a modern user interface.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    img: "./images/Attendance_tracker.png",
    color: "#00F5FF",
    liveUrl: "https://college-attendance-zeta.vercel.app/",
    githubUrl: "https://github.com/Vinaygkp/College_Attendance",
  },
  {
    title: "Full Stack Ecommerce",
    desc: "A MERN stack e-commerce application with JWT-based authentication, product management, shopping cart, and a fully responsive user interface.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
    color: "#8B5CF6",
    liveUrl: "https://your-ecommerce-link.com",
    githubUrl: "https://github.com/yourusername/ecommerce-app",
  },
  {
    title: "Portfolio Website",
    desc: "A premium, fully responsive developer portfolio featuring smooth animations, interactive UI, project showcase, skills, timeline, and contact section, built with React, TypeScript, and Tailwind CSS.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    img: "./images/Portfolio.png",
    color: "#3B82F6",
    liveUrl: "https://portfolio-4tb6.vercel.app/",
    githubUrl: "https://github.com/Vinaygkp/Portfolio",
  },
  {
    title: "Vaishno Devi Website",
    desc: "A premium and fully responsive tourism website showcasing the Shri Mata Vaishno Devi pilgrimage with destination details, travel information, image galleries, and an interactive user interface built using HTML, CSS, and JavaScript.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    img: "./images/Vaishno_devi.png",
    color: "#F59E0B",
    liveUrl: "https://shri-mata-vaishno-devi.vercel.app/",
    githubUrl: "https://github.com/Vinaygkp/Shri_Mata_Vaishno_Devi",
  },
  {
    title: "Electronic Voting Machine",
    desc: "A hardware-based electronic voting machine built as a college mini project using Arduino, breadboard, switches, jumper wires, and display module for secure vote casting and counting.",
    tech: ["Arduino", "Embedded Systems", "Electronics", "C/C++"],
    img: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&h=400&fit=crop&auto=format",
    video: "./images/video.mp4",
    color: "#10B981",
    liveUrl: "#",
    githubUrl: "#",
  },
];

function ProjectCard({ p }: { p: ProjectItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -5,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 5,
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        display: "flex",            // Flex container taaki content stretched rahe
        flexDirection: "column",    // Top to bottom stack
        height: "100%",             // Card pure grid row ki height lega
        borderRadius: 24,
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${hov ? p.color : "rgba(255,255,255,0.08)"}`,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov ? 1.03 : 1})`,
        boxShadow: hov ? `0 20px 40px ${p.color}20, 0 0 10px ${p.color}10` : "0 10px 30px rgba(0,0,0,0.3)",
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Image / Video Block - Fixed height to avoid distortion */}
      <div style={{ position: "relative", height: "clamp(190px, 24vw, 230px)", width: "100%", overflow: "hidden", flexShrink: 0 }}>
        {p.video ? (
          <video
            src={p.video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center", // Top ki jagah center se align karega
              filter: hov ? "brightness(1)" : "brightness(0.9)",
              transform: hov ? "scale(1.02)" : "scale(1)", // Slight scale taaki zoom-in excessive na lage
              transition: "all 0.5s ease"
            }}
          />
        ) : (
          <img
            src={p.img}
            alt={p.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: hov ? "brightness(1)" : "brightness(0.9)",
              transform: hov ? "scale(1.05)" : "scale(1)",
              transition: "all 0.5s ease"
            }}
          />
        )}

        {/* Soft Bottom Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)",
            pointerEvents: "none"
          }}
        />
      </div>

      {/* Icons */}
      <div className="project-card-actions" style={{
        position: "absolute", top: 16, right: 16, display: "flex", gap: 10,
        opacity: hov ? 1 : 0,
        transform: hov ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        zIndex: 10
      }}>
        {[
          { icon: <ExternalLink size={18} />, link: p.liveUrl || "#" },
          { icon: <Github size={18} />, link: p.githubUrl || "#" },
        ].map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"             // New tab me open hone ke liye
            rel="noopener noreferrer"   // Security best practice
            onClick={(e) => e.stopPropagation()} // Card click event se collide na ho
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${hov ? p.color : "rgba(255,255,255,0.1)"}`,
              color: hov ? p.color : "#fff",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* Content Block - flex: 1 se baki space barabar fill hoga */}
      <div style={{
        padding: "clamp(20px, 4vw, 28px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1
      }}>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Outfit,sans-serif", marginBottom: 12 }}>
            {p.title}
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>
            {p.desc}
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {p.tech.map((t) => (
            <span key={t} style={{ padding: "4px 12px", background: `${p.color}10`, border: `1px solid ${p.color}30`, borderRadius: 8, fontSize: 11, color: p.color, fontFamily: "JetBrains Mono,monospace", fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <Section id="projects">
      <SectionHeader num="03" eyebrow="Projects" title="Selected" accent="Work" />
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 clamp(16px, 4vw, 24px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: "clamp(20px, 3vw, 32px)",
        alignItems: "stretch" // Grid ke saare cards ki height barabar ho jayegi
      }}>
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </Section>
  );
}

// ─── Experience — Vertical Timeline ───────────────────────────────────────────

const EXP = [
  {
    role: "Frontend Developer",
    company: "Personal Project",
    period: "2025 – Present",
    desc: "Building premium web applications for clients using React, TypeScript, and modern frontend technologies with a focus on performance and award-worthy design.",
    color: "#00F5FF",
    tags: ["React.js", "TypeScript", "Tailwind"],
  },
  {
    role: "Full Stack Developer",
    company: "Personal Projects",
    period: "2026 – Present",
    desc: "Developed multiple full-stack applications like e-commerce platforms, management systems, and API-driven products from ideation to deployment.",
    color: "#8B5CF6",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
  },
  {
    role: "Hardware Engineer",
    company: "University Lab",
    period: "2025 – Present",
    desc: "Worked with FPGA, Arduino, and embedded systems for academic projects, competitions, and digital design research.",
    color: "#3B82F6",
    tags: ["FPGA", "Vivado", "Verilog", "Arduino"],
  },
  {
    role: "DSA Problem Solver",
    company: "Self Practice (LeetCode)",
    period: "2026 – Present",
    desc: "Consistently solving Data Structures & Algorithms problems to improve problem-solving skills, covering arrays, strings, recursion, binary search, and dynamic programming.",
    color: "#F59E0B",
    tags: ["DSA", "Java", "Problem Solving", "Algorithms"],
  },
];
function ExpCard({ e, i }: { e: typeof EXP[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const isLeft = i % 2 === 0;
  return (
    <div className="tl-item-row" style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
      {/* Left card (even) */}
      <div className={isLeft ? "tl-card-left" : "tl-card-right"} style={{ flex: 1, marginRight: isLeft ? 32 : 0, marginLeft: isLeft ? 0 : 32, order: isLeft ? 0 : 2, animation: `${isLeft ? "slide-in-left" : "slide-in-right"} 0.6s ${i * 0.15}s ease both`, opacity: 0 }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ padding: "clamp(18px, 4vw, 24px) clamp(16px, 4vw, 28px)", borderRadius: 18, background: hov ? `${e.color}06` : "rgba(255,255,255,0.02)", border: `1px solid ${hov ? e.color + "25" : "rgba(255,255,255,0.055)"}`, cursor: "pointer", transition: "all 0.35s ease", boxShadow: hov ? `0 16px 48px ${e.color}10` : "none", transform: hov ? "translateY(-4px)" : "translateY(0)" }}>
          {/* Period badge */}
          <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", background: `${e.color}10`, border: `1px solid ${e.color}25`, borderRadius: 100, color: e.color, fontSize: 10, fontFamily: "JetBrains Mono,monospace", marginBottom: 14, letterSpacing: "0.5px" }}>{e.period}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "Outfit,sans-serif", marginBottom: 4, letterSpacing: "-0.5px" }}>{e.role}</h3>
          <div style={{ color: e.color, fontSize: 13, fontFamily: "Outfit,sans-serif", marginBottom: 14, opacity: 0.8, fontWeight: 500 }}>@ {e.company}</div>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 13, lineHeight: 1.8, fontFamily: "Inter,sans-serif", marginBottom: 18 }}>{e.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {e.tags.map(t => <span key={t} style={{ padding: "2px 10px", background: `${e.color}0d`, border: `1px solid ${e.color}20`, borderRadius: 100, fontSize: 10, color: e.color, fontFamily: "JetBrains Mono,monospace" }}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* Center dot */}
      <div className="tl-dot-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0, order: 1, zIndex: 1 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: e.color, border: `3px solid #050505`, boxShadow: `0 0 0 2px ${e.color}40, 0 0 20px ${e.color}55`, flexShrink: 0, transition: "all 0.3s", marginTop: 28 }}>
          <div style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", background: e.color, animation: "pulse-ring 2s ease-out infinite" }} />
        </div>
      </div>

      {/* Spacer on opposite side */}
      <div className="tl-spacer" style={{ flex: 1, order: isLeft ? 2 : 0 }} />
    </div>
  );
}

function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Section id="experience">
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)" }}>
        <SectionHeader num="04" eyebrow="Experience" title="My" accent="Journey" />
        <div ref={sectionRef} style={{ position: "relative" }}>
          {/* Vertical timeline line */}
          <div className="tl-line-wrapper" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)", transform: "translateX(-50%)" }} />
          {visible && <div className="tl-line-wrapper" style={{ position: "absolute", left: "50%", top: 0, width: 1, background: "linear-gradient(to bottom,#00F5FF,#8B5CF6,#3B82F6,#10B981)", transform: "translateX(-50%)", height: "100%", animation: "fade-up 2s ease forwards", transformOrigin: "top" }} />}

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {EXP.map((e, i) => visible && <ExpCard key={i} e={e} i={i} />)}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────

function useCounter(target: number, dur: number, run: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let start: number;
    const fn = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
  }, [target, dur, run]);
  return val;
}

function StatCard({ label, value, suffix, icon, color, run }: { label: string; value: number; suffix: string; icon: ReactNode; color: string; run: boolean }) {
  const count = useCounter(value, 2000, run);
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ textAlign: "center", padding: "clamp(22px, 3vw, 32px) clamp(16px, 2vw, 24px)", borderRadius: 20, background: hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${hov ? color + "28" : "rgba(255,255,255,0.055)"}`, cursor: "pointer", transition: "all 0.3s ease", transform: hov ? "translateY(-8px)" : "translateY(0)", boxShadow: hov ? `0 20px 44px ${color}12` : "none" }}>
      <div style={{ width: 46, height: 46, background: `${color}14`, border: `1px solid ${color}22`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color }}>{icon}</div>
      <div style={{ fontSize: "clamp(36px, 6vw, 50px)", fontWeight: 900, fontFamily: "Outfit,sans-serif", lineHeight: 1, marginBottom: 8, background: `linear-gradient(135deg,${color},#ffffff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{count}{suffix}</div>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "Inter,sans-serif" }}>{label}</div>
    </div>
  );
}

function Achievements() {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setRun(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const stats = [
    { label: "Projects Completed", value: 10, suffix: "+", icon: <Code2 size={20} />, color: "#00F5FF" },
    { label: "GitHub Contributions", value: 100, suffix: "+", icon: <Github size={20} />, color: "#8B5CF6" },
    { label: "Certificates Earned", value: 5, suffix: "+", icon: <Award size={20} />, color: "#3B82F6" },
    { label: "Hackathons Joined", value: 3, suffix: "+", icon: <Trophy size={20} />, color: "#10B981" },
    { label: "Leetcode", value: 40, suffix: "+", icon: <Trophy size={20} />, color: "#FF0000" },
  ];
  return (
    <Section id="achievements">
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)" }}>
        <SectionHeader num="05" eyebrow="Achievements" title="Numbers That" accent="Matter" />
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%, 190px),1fr))", gap: "clamp(14px, 2vw, 22px)" }}>
          {stats.map((s, i) => <StatCard key={i} {...s} run={run} />)}
        </div>
      </div>
    </Section>
  );
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────

const STACK = [
  { name: "HTML5", cat: "Frontend", color: "#E34F26", years: 2, level: 95, icon: "https://cdn.simpleicons.org/html5/white", abbr: "H5", bg: "#E34F26" },
  { name: "CSS3", cat: "Frontend", color: "#1572B6", years: 2, level: 92, icon: "https://cdn.simpleicons.org/css/white", abbr: "C3", bg: "#1572B6" },
  { name: "JavaScript", cat: "Frontend", color: "#F7DF1E", years: 2, level: 88, icon: "https://cdn.simpleicons.org/javascript/black", abbr: "JS", bg: "#F7DF1E" },
  { name: "React.js", cat: "Frontend", color: "#61DAFB", years: 1, level: 82, icon: "https://cdn.simpleicons.org/react/black", abbr: "RE", bg: "#61DAFB" },
  { name: "Node.js", cat: "Backend", color: "#339933", years: 1, level: 78, icon: "https://cdn.simpleicons.org/nodedotjs/white", abbr: "NJ", bg: "#339933" },
  { name: "Express.js", cat: "Backend", color: "#000000", years: 1, level: 75, icon: "https://cdn.simpleicons.org/express/white", abbr: "EX", bg: "#000000" },
  { name: "MongoDB", cat: "Backend", color: "#47A248", years: 1, level: 72, icon: "https://cdn.simpleicons.org/mongodb/white", abbr: "DB", bg: "#47A248" },
  { name: "REST API", cat: "Backend", color: "#06B6D4", years: 1, level: 80, icon: "https://cdn.simpleicons.org/openapiinitiative/white", abbr: "RA", bg: "#06B6D4" },
  { name: "Java", cat: "Programming", color: "#F89820", years: 1, level: 78, icon: "https://cdn.simpleicons.org/openjdk/white", abbr: "JV", bg: "#F89820" },
  { name: "C++", cat: "Programming", color: "#00599C", years: 2, level: 80, icon: "https://cdn.simpleicons.org/cplusplus/white", abbr: "C+", bg: "#00599C" },
  { name: "DSA", cat: "Programming", color: "#8B5CF6", years: 1, level: 75, icon: "https://cdn.simpleicons.org/codeforces/white", abbr: "DS", bg: "#8B5CF6" },
  { name: "Arduino", cat: "Hardware", color: "#00979D", years: 1, level: 75, icon: "https://cdn.simpleicons.org/arduino/white", abbr: "AR", bg: "#00979D" },
  { name: "FPGA", cat: "Hardware", color: "#E51050", years: 1, level: 68, icon: "https://api.iconify.design/simple-icons:xilinx.svg?color=%23E51050", abbr: "FP", bg: "white" },
  { name: "Vivado", cat: "Hardware", color: "#FF6600", years: 1, level: 65, icon: "https://api.iconify.design/simple-icons:xilinx.svg?color=%23FF6600", abbr: "VV", bg: "white" },
  { name: "GitHub", cat: "Tools", color: "#181717", years: 2, level: 85, icon: "https://cdn.simpleicons.org/github/white", abbr: "GH", bg: "#181717" },
  { name: "VS Code", cat: "Tools", color: "#007ACC", years: 2, level: 95, icon: "https://api.iconify.design/vscode-icons:file-type-vscode.svg", abbr: "VS", bg: "#0D1117" },
  { name: "Figma", cat: "Tools", color: "#F24E1E", years: 1, level: 70, icon: "https://cdn.simpleicons.org/figma/white", abbr: "FG", bg: "#F24E1E" },
];

function TechCard({ t, i }: { t: typeof STACK[0]; i: number }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 12, padding: "24px 16px", borderRadius: 16,
        background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? t.bg + "44" : "rgba(255,255,255,0.055)"}`,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        // FIX: Yahan scale hata diya hai, sirf translateY hai
        transform: hov ? "translateY(-8px)" : "translateY(0px)",
        boxShadow: hov ? `0 12px 24px rgba(0,0,0,0.3)` : "none",
        // FIX: Floating animation hata di hai taaki hover smooth rahe
        animation: "none"
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: t.bg, display: "flex", alignItems: "center",
        justifyContent: "center",
        // Icon ka size thoda kam kiya hai taaki wo container mein fit rahe
        transition: "transform 0.3s"
      }}>
        <img
          src={t.icon}
          alt={t.name}
          style={{ width: "26px", height: "26px" }}
        />
      </div>
      <div style={{
        fontSize: 12, fontWeight: 600, fontFamily: "sans-serif",
        color: hov ? "#fff" : "rgba(255,255,255,0.6)",
        transition: "color 0.3s", textAlign: "center"
      }}>
        {t.name}
      </div>
    </div>
  );
}

function TechStack() {
  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)" }}>
      <SectionHeader
        num="06"
        eyebrow="Tech Stack"
        title="Tools I"
        accent="Love"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 110px), 1fr))",
          gap: "clamp(10px, 2vw, 16px)",
          marginTop: 24,
        }}
      >
        {STACK.map((t, i) => (
          <TechCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Certificates ─────────────────────────────────────────────────────────────
interface CertItem {
  title: string;
  issuer: string;
  year: string;
  color: string;
  abbr: string;
  img: string;
  link?: string;
}

const CERTS: CertItem[] = [
  {
    title: "React Development (Learning)",
    issuer: "Meta / React Docs Practice",
    year: "2026",
    color: "#61DAFB",
    abbr: "R",
    img: "./certificates/react-cert.jpg", // Image path daalein
    link: "https://example.com/verify-react"
  },
  {
    title: "Full Stack Development (Learning Path)",
    issuer: "Coursera (In Progress / Practice)",
    year: "2026",
    color: "#8B5CF6",
    abbr: "FS",
    img: "./certificates/fullstack-cert.jpg",
    link: "https://example.com/verify-fullstack"
  },
  {
    title: "JavaScript Algorithms (DSA Practice)",
    issuer: "freeCodeCamp / LeetCode",
    year: "2026",
    color: "#F7DF1E",
    abbr: "DSA",
    img: "./certificates/dsa-cert.jpg",
    link: "https://example.com/verify-dsa"
  },
  {
    title: "Node.js Backend Development (Learning)",
    issuer: "Udemy / Personal Projects",
    year: "2026",
    color: "#339933",
    abbr: "N",
    img: "./certificates/nodejs-cert.jpg",
  },
  {
    title: "MongoDB Basics (Practice)",
    issuer: "MongoDB University Resources",
    year: "2026",
    color: "#47A248",
    abbr: "DB",
    img: "./certificates/mongodb-cert.jpg",
  },
  {
    title: "Python for Problem Solving",
    issuer: "Self Practice",
    year: "2026",
    color: "#3776AB",
    abbr: "P",
    img: "./certificates/python-cert.jpg",
  },
];

function Certificates() {
  const [active, setActive] = useState(0);
  const [selectedCert, setSelectedCert] = useState<CertItem | null>(null);

  return (
    <Section id="certificates">
      <div
        style={{
          width: "100%",
          minHeight: "auto",
          padding: "clamp(40px, 6vw, 80px) clamp(16px, 4vw, 24px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%" }}>
          <SectionHeader
            num="07"
            eyebrow="Certificates"
            title="Credentials &"
            accent="Recognition"
          />

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "clamp(16px, 2.5vw, 22px)",
              marginTop: 40,
              alignItems: "stretch",
            }}
          >
            {CERTS.map((c, i) => {
              const isActive = i === active;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setSelectedCert(c)} // Click par modal open hoga
                  style={{
                    padding: "clamp(18px, 3vw, 24px)",
                    borderRadius: 22,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: isActive
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? c.color + "60" : "rgba(255,255,255,0.08)"
                      }`,
                    transform: isActive
                      ? "translateY(-8px) scale(1.02)"
                      : "scale(1)",
                    boxShadow: isActive
                      ? `0 20px 50px ${c.color}25`
                      : "0 10px 30px rgba(0,0,0,0.25)",
                    transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Certificate Image Thumbnail Preview */}
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      borderRadius: 14,
                      overflow: "hidden",
                      marginBottom: 16,
                      position: "relative",
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${c.color}20`
                    }}
                  >
                    <img
                      src={c.img}
                      alt={c.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: isActive ? "brightness(1)" : "brightness(0.8)",
                        transition: "all 0.4s ease"
                      }}
                      onError={(e) => {
                        // Fallback image handling
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Floating Abbr Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: `${c.color}20`,
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${c.color}50`,
                        color: c.color,
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      {c.abbr}
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 8,
                        lineHeight: 1.4,
                      }}
                    >
                      {c.title}
                    </h3>

                    <div
                      style={{
                        fontSize: 13,
                        color: c.color,
                        opacity: 0.9,
                        marginBottom: 6,
                        fontWeight: 500
                      }}
                    >
                      {c.issuer}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: "1px solid rgba(255,255,255,0.06)"
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "monospace",
                      }}
                    >
                      {c.year}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: c.color,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      View Certificate →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY FOR FULL CERTIFICATE VIEW */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(12px, 3vw, 24px)",
            animation: "fadeIn 0.3s ease"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Stop overlay click closing
            style={{
              position: "relative",
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#121212",
              border: `1px solid ${selectedCert.color}40`,
              borderRadius: 24,
              padding: "clamp(16px, 3vw, 24px)",
              boxShadow: `0 30px 100px ${selectedCert.color}30`,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                width: 36,
                height: 36,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Image */}
            <div
              style={{
                width: "100%",
                maxHeight: "clamp(240px, 45vh, 450px)",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "#000"
              }}
            >
              <img
                src={selectedCert.img}
                alt={selectedCert.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>

            {/* Modal Details */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {selectedCert.title}
                </h3>
                <p style={{ fontSize: 14, color: selectedCert.color }}>
                  Issued by {selectedCert.issuer} ({selectedCert.year})
                </p>
              </div>

              {selectedCert.link && (
                <a
                  href={selectedCert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 12,
                    background: selectedCert.color,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none"
                  }}
                >
                  Verify Credential <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const text = `Name: ${form.name}%0AEmail: ${form.email}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/918601317580?text=${text}`, "_blank");
    setLoading(false); setDone(true);
    setTimeout(() => setDone(false), 4500);
    setForm({ name: "", email: "", message: "" });
  };

  const inputStyle = (key: string): React.CSSProperties => ({
    width: "100%", background: "rgba(255,255,255,0.025)",
    border: `1px solid ${focus === key ? "rgba(0,245,255,0.3)" : "rgba(255,255,255,0.055)"}`,
    borderRadius: 12, padding: "13px 15px", color: "#fff", fontSize: 14,
    fontFamily: "Inter,sans-serif", outline: "none", transition: "border-color 0.25s,box-shadow 0.25s",
    boxSizing: "border-box", boxShadow: focus === key ? "0 0 18px rgba(0,245,255,0.06)" : "none",
  });

  return (
    <Section id="contact">
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)" }}>
        <SectionHeader num="08" eyebrow="Contact" title="Let's Build" accent="Something Together" />
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "clamp(32px, 5vw, 56px)" }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "Outfit, sans-serif",
                marginBottom: 12,
                letterSpacing: "-0.5px"
              }}>
                Get in <span style={{
                  background: "linear-gradient(90deg, #00F5FF, #3B82F6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>touch</span>
              </h3>

              {/* Premium accent bar */}
              <div style={{
                width: 60,
                height: 3,
                background: "linear-gradient(90deg, #00F5FF, transparent)",
                borderRadius: 2
              }} />
            </div>
            {[
              { icon: <Mail size={17} />, label: "Email", value: "vinay55ti@gmail.com", color: "#00F5FF" },
              { icon: <Phone size={17} />, label: "Phone", value: "+91 8601317580", color: "#8B5CF6" },
              { icon: <MapPin size={17} />, label: "Location", value: "Ghaziabad, UP, India", color: "#3B82F6" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 12, marginBottom: 20, cursor: "pointer", border: "1px solid transparent", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.028)"; e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateX(8px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ color: c.color, opacity: 0.8 }}>{c.icon}</div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "JetBrains Mono,monospace", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>{c.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, fontFamily: "Inter,sans-serif" }}>{c.value}</div>
                </div>
              </div>
            ))}

            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#fff",
                  fontFamily: "Outfit, sans-serif",
                  marginBottom: 10,
                  letterSpacing: "-0.5px"
                }}>
                  Follow <span style={{
                    background: "linear-gradient(90deg, #00F5FF, #3B82F6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>Me</span>
                </h3>

                {/* Premium accent bar */}
                <div style={{
                  width: 60,
                  height: 3,
                  background: "linear-gradient(90deg, #00F5FF, transparent)",
                  borderRadius: 2
                }} />
              </div>

              <div className="flex gap-4 flex-wrap">
                {[
                  { icon: Github, href: "https://github.com/vinay55ti", color: "#ffffff" },
                  { icon: Linkedin, href: "https://linkedin.com/in/vinay55ti", color: "#0A66C2" },
                  { icon: Code2, href: "https://leetcode.com/u/vinay55ti/", color: "#FFA116" },
                  { icon: MessageCircle, href: "https://wa.me/918601317580", color: "#25D366" },
                ].map(({ icon: Icon, href, color }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.background = `${color}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <Icon size={18} style={{ color: "rgba(255,255,255,0.6)" }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={submit}>
            {/* Yahan maine onMouseEnter/Leave wrapper par add kiya hai */}
            <div
              className="glass-strong"
              style={{
                borderRadius: 24,
                padding: "clamp(22px, 4vw, 36px) clamp(16px, 4vw, 34px)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,245,255,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              {(["name", "email"] as const).map(key => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono,monospace", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 8 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input type={key === "email" ? "email" : "text"} placeholder={key === "name" ? "Your full name" : "your@email.com"} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} onFocus={() => setFocus(key)} onBlur={() => setFocus(null)}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,245,255,0.5)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = focus === key ? "rgba(0,245,255,0.3)" : "rgba(255,255,255,0.055)"}
                    required style={inputStyle(key)} />
                </div>
              ))}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono,monospace", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 8 }}>Message</label>
                <textarea placeholder="Tell me about your project..." value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={() => setFocus("message")} onBlur={() => setFocus(null)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,245,255,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = focus === "message" ? "rgba(0,245,255,0.3)" : "rgba(255,255,255,0.055)"}
                  required rows={5} style={{ ...inputStyle("message"), resize: "none" as const }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: 15, borderRadius: 13, background: done ? "linear-gradient(135deg,#10B981,#047857)" : "linear-gradient(135deg,#00F5FF,#3B82F6)", border: "none", color: "#000", fontSize: 15, fontWeight: 700, fontFamily: "Outfit,sans-serif", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.3s", boxShadow: "0 0 28px rgba(0,245,255,0.22)" }}>
                {done ? "✓ Message Sent!" : loading ? <><Zap size={15} /> Sending...</> : <><Send size={15} /> Send to WhatsApp</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "10px 5px 5px",
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Glow Background */}
      <div
        style={{
          position: "absolute",
          width: 100,
          height: 10,
          background: "rgba(0,245,255,0.08)",
          filter: "blur(80px)",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 90, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          height: 2,
          margin: "0 auto 28px",
          borderRadius: 20,
          background:
            "linear-gradient(90deg,transparent,#00F5FF,#8B5CF6,transparent)",
          boxShadow: "0 0 25px rgba(0,245,255,0.5)",
        }}
      />

      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          margin: 0,
          fontSize: 17,
          fontWeight: 500,
          fontFamily: "Outfit,sans-serif",
          letterSpacing: "0.5px",
          background:
            "linear-gradient(135deg,#00F5FF,#8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Designed & Developed by Vinay Kumar
      </motion.h3>


      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: 12,
          color: "rgba(255,255,255,0.35)",
          fontSize: 12,
          fontFamily: "JetBrains Mono,monospace",
          letterSpacing: "1px",
        }}
      >
        © 2026 · Built with React ⚛
      </motion.p>


      <motion.div
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        style={{
          marginTop: 10,
          fontSize: 11,
          color: "#00F5FF",
          fontFamily: "JetBrains Mono,monospace",
          letterSpacing: "2px",
        }}
      >
      </motion.div>
    </footer>
  );
}
// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <div style={{ background: "#050505", minHeight: "100vh", fontFamily: "Inter,sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      {!ready && <Loader onDone={done} />}
      {ready && (
        <>
          <Navigation />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <TechStack />
            <Certificates />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
