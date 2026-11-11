"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

const YELLOW = "#FFE22E";
const CUT = 52;
const NOTCH = 45;
const TRAVEL_MS = 420;
const HOLD_MS = 400;
const RETURN_MS = 480;
const ZOOM_OUT = 0.97;
const CHAMFER = `polygon(${CUT}px 0, 100% 0, 100% calc(100% - ${CUT}px), calc(100% - ${CUT}px) 100%, 0 100%, 0 ${CUT}px)`;

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black/20 px-4 py-3 text-white " +
  "placeholder:text-zinc-400 outline-none transition-colors " +
  "focus:border-[#FFE22E]/80 focus-visible:ring-2 focus-visible:ring-[#FFE22E]/30";

const buttonClass =
  "group flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFE22E] px-4 py-3 " +
  "font-semibold text-black transition-colors hover:bg-[#fff06b] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const ribbons = [
  { from: "M-100 620 C 250 520, 480 760, 820 560 S 1250 380, 1560 470", to: "M-100 560 C 260 640, 500 600, 840 660 S 1240 460, 1560 400", width: 18, stroke: "url(#gold)", duration: 16 },
  { from: "M-100 440 C 300 380, 560 520, 900 420 S 1280 360, 1560 430", to: "M-100 480 C 320 440, 540 420, 920 480 S 1280 400, 1560 380", width: 10, stroke: "url(#gold)", duration: 18 },
  { from: "M-100 700 C 300 600, 520 820, 880 640 S 1260 480, 1560 560", to: "M-100 650 C 320 720, 540 700, 900 740 S 1250 560, 1560 500", width: 3, stroke: "url(#goldThin)", duration: 19 },
  { from: "M-100 300 C 200 180, 520 360, 860 220 S 1280 120, 1560 200", to: "M-100 360 C 220 260, 500 280, 880 300 S 1260 200, 1560 130", width: 28, stroke: "url(#bronze)", duration: 21 },
  { from: "M-100 120 C 260 60, 560 220, 900 100 S 1300 40, 1560 90", to: "M-100 170 C 280 140, 540 140, 920 160 S 1300 80, 1560 40", width: 4, stroke: "url(#goldThin)", duration: 24 },
  { from: "M-100 860 C 320 800, 640 940, 960 820 S 1300 700, 1560 780", to: "M-100 820 C 340 880, 620 860, 980 880 S 1300 760, 1560 700", width: 64, stroke: "url(#chrome)", duration: 26 },
];

function Background({ animate }: { animate: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050403]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gold" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#3a2410" stopOpacity="0" />
            <stop offset="0.35" stopColor="#d9962b" />
            <stop offset="0.6" stopColor="#ffd36b" />
            <stop offset="1" stopColor="#7a4a14" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="goldThin" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffd36b" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffe9a8" />
            <stop offset="1" stopColor="#c8832a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bronze" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#2a1808" stopOpacity="0" />
            <stop offset="0.5" stopColor="#9a5a1c" />
            <stop offset="1" stopColor="#3b220c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chrome" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#1a1a1a" />
            <stop offset="0.5" stopColor="#5b5b5b" />
            <stop offset="1" stopColor="#101010" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <g filter="url(#soft)" opacity="0.55">
          <path d={ribbons[0].from} stroke="#d9962b" strokeWidth="38" fill="none" />
          <path d={ribbons[3].from} stroke="#8a4f17" strokeWidth="46" fill="none" />
        </g>
        {ribbons.map((r, i) => (
          <motion.path
            key={i}
            d={r.from}
            fill="none"
            stroke={r.stroke}
            strokeWidth={r.width}
            strokeLinecap="round"
            animate={animate ? { d: [r.from, r.to, r.from] } : undefined}
            transition={{ duration: r.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}

function GlassEdges() {
  const diag = Math.round(CUT * Math.SQRT2 * 10) / 10;
  const line = "absolute bg-gradient-to-r from-white/50 via-white/20 to-white/40";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className={`${line} top-0 right-0 h-px`} style={{ left: CUT }} />
      <div className={`${line} bottom-0 left-0 h-px`} style={{ right: CUT }} />
      <div className="absolute left-0 w-px bg-gradient-to-b from-white/40 to-white/15" style={{ top: CUT, bottom: 0 }} />
      <div className="absolute right-0 w-px bg-gradient-to-b from-white/15 to-white/40" style={{ top: 0, bottom: CUT }} />
      <div className="absolute left-0 h-px origin-left -rotate-45 bg-white/50" style={{ top: CUT, width: diag }} />
      <div className="absolute right-0 h-px origin-right -rotate-45 bg-white/40" style={{ bottom: CUT, width: diag }} />
    </div>
  );
}

const TRI_TL = "polygon(0 0, 100% 0, 0 100%)";
const TRI_BR = "polygon(100% 0, 100% 100%, 0 100%)";

function Notch({
  corner,
  gathered,
  size,
  animate,
}: {
  corner: "tl" | "br";
  gathered: boolean;
  size: { w: number; h: number };
  animate: boolean;
}) {
  const isTL = corner === "tl";
  const rest = isTL ? { x: 0, y: 0 } : { x: size.w - NOTCH, y: size.h - NOTCH };
  const middle = { x: size.w / 2 - NOTCH / 2, y: size.h / 2 - NOTCH / 2 };
  const target = animate && gathered ? middle : rest;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20"
      style={{ width: NOTCH, height: NOTCH }}
      initial={false}
      animate={target}
      transition={{
        duration: (gathered ? TRAVEL_MS : RETURN_MS) / 1000,
        ease: [0.65, 0, 0.35, 1],
      }}
    >
      <div
        className="absolute inset-0 bg-white/20 backdrop-blur-xl"
        style={{ clipPath: isTL ? TRI_TL : TRI_BR }}
      />
      <svg className="absolute inset-0" width={NOTCH} height={NOTCH} viewBox={`0 0 ${NOTCH} ${NOTCH}`} fill="none">
        <polygon
          points={
            isTL
              ? `0.5,0.5 ${NOTCH - 0.5},0.5 0.5,${NOTCH - 0.5}`
              : `${NOTCH - 0.5},0.5 ${NOTCH - 0.5},${NOTCH - 0.5} 0.5,${NOTCH - 0.5}`
          }
          stroke="white"
          strokeOpacity="0.85"
        />
      </svg>
    </motion.div>
  );
}

function Pulse({ gathered }: { gathered: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10"
      initial={false}
      animate={
        gathered
          ? { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1.15, 1.5] }
          : { opacity: 0 }
      }
      transition={{
        duration: gathered ? 0.8 : 0.15,
        delay: gathered ? TRAVEL_MS / 1000 - 0.1 : 0,
        times: gathered ? [0, 0.25, 0.7, 1] : undefined,
      }}
    >
      <div className="absolute -left-6 -top-6 h-12 w-12 rounded-full bg-[#FFE22E] blur-lg" />
      <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#fff6b0]" />
    </motion.div>
  );
}

export default function AuthCard() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>(pathname === "/register" ? "register" : "login");
  const [gathered, setGathered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(false);

  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 448, h: 420 });
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const read = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const switchMode = (next: Mode) => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    setPassword("");
    setConfirm("");
    setShowPassword(false);

    if (reduceMotion) {
      setMode(next);
      window.history.pushState(null, '', `/${next}`);
      busy.current = false;
      return;
    }

    setGathered(true);
    timers.current.push(setTimeout(() => {
      setMode(next);
      window.history.pushState(null, '', `/${next}`);
    }, TRAVEL_MS));
    timers.current.push(setTimeout(() => setGathered(false), TRAVEL_MS + HOLD_MS));
    timers.current.push(setTimeout(() => { busy.current = false; }, TRAVEL_MS + HOLD_MS + RETURN_MS));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      // REPLACE WITH YOUR ACTUAL RENDER URL
      const response = await fetch(`https://adet-hap.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        switchMode("login");
        setError("Registration successful! Please log in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4">
      <Background animate={!reduceMotion} />
      <motion.div
        className="relative w-full max-w-md"
        initial={false}
        animate={{ scale: !reduceMotion && gathered ? ZOOM_OUT : 1 }}
        transition={{
          duration: (gathered ? TRAVEL_MS : RETURN_MS) / 1000,
          ease: [0.65, 0, 0.35, 1],
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150"
          style={{
            clipPath: CHAMFER,
            backgroundColor: "rgba(255,255,255,0.05)",
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.28) 100%)",
          }}
        />
        <GlassEdges />

        <Notch corner="tl" gathered={gathered} size={size} animate={!reduceMotion} />
        <Notch corner="br" gathered={gathered} size={size} animate={!reduceMotion} />
        <Pulse gathered={!reduceMotion && gathered} />

        <motion.div
          ref={contentRef}
          className="relative p-8 sm:p-10"
          initial={false}
          animate={{
            opacity: gathered ? 0 : 1,
            filter: gathered ? "blur(8px)" : "blur(0px)",
          }}
          transition={{ duration: gathered ? 0.25 : 0.4, delay: gathered ? 0 : 0.1 }}
          style={{ pointerEvents: gathered ? "none" : "auto" }}
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {isLogin ? "Welcome " : "Create "}
              <span style={{ color: YELLOW }}>{isLogin ? "Back" : "Account"}</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-300">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Register a new account to get started"}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE22E]/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirm" className="sr-only">Confirm password</label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#FFE22E]"
                  />
                  Remember me
                </label>
                <a href="#" className="text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-300">{error}</p>
            )}

            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? "Please wait…" : isLogin ? "Login" : "Register"}
              {!loading && (
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:underline"
              style={{ color: YELLOW }}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}