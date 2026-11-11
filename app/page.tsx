import { redirect } from "next/navigation";
import { CONFIG } from "@/lib/config";

export default function Home() {
  redirect(CONFIG.ROUTES.LOGIN);
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

type Mode = "login" | "register";

const YELLOW = "#FFE22E";
const CUT = 55;
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

function Background({ animate = true }: { animate?: boolean }) {
  const apparelIcons = [
    <path key="shirt" d="M20.38 3.46L16 2 12 4 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />,
    <path key="pants" d="M6 2h12v4l-1.5 16h-3.5L12 11l-1.5 11H7L5.5 6V2z" />,
    <path key="skirt" d="M8 3h8l2.5 16H5.5L8 3z" />,
    <path key="cap" d="M3 15a7 7 0 0 1 13.5-3M2 15h14a4 4 0 0 1 4 4v1H2v-5z" />,
    <path key="tag" d="M12 2H6a2 2 0 0 0-2 2v6l10 10 8-8L12 2zM7.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />,
    <path key="hanger" d="M12 2a2 2 0 0 0-2 2c0 .8.5 1.5 1.2 1.8L3.2 13.5A1.5 1.5 0 0 0 4.3 16h15.4a1.5 1.5 0 0 0 1.1-2.5L12.8 5.8C13.5 5.5 14 4.8 14 4a2 2 0 0 0-2-2z" />,
    <g key="bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></g>,
    <path key="coat" d="M4 4l4-2h8l4 2-1.5 5L17 8v12H7V8L5.5 9 4 4zm8 0a2 2 0 0 0-2 2v14h4V6a2 2 0 0 0-2-2z" />,
    <path key="dress" d="M9 2h6l1 4-2 3 3.5 11H6.5L10 9 8 6l1-4z" />,
    <path key="sando" d="M7 2h2v4a3 3 0 0 0 6 0V2h2l1 6H6l1-6zm-1 7h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z" />,
    <path key="blouse" d="M9 2a3 3 0 0 0 6 0l4 3-2 4-3-1v12H10V8L7 9 5 5l4-3z" />,
  ];

  const floatingItems = [
    { iconIdx: 0, x: "4%", delay: 0, duration: 7, scale: 0.9 },
    { iconIdx: 7, x: "10%", delay: 2.2, duration: 8.5, scale: 1 },
    { iconIdx: 8, x: "16%", delay: 0.8, duration: 6.8, scale: 0.95 },
    { iconIdx: 5, x: "22%", delay: 3.1, duration: 9, scale: 0.85 },
    { iconIdx: 9, x: "28%", delay: 1.4, duration: 7.2, scale: 1 },
    { iconIdx: 1, x: "34%", delay: 0.3, duration: 8, scale: 1.05 },
    { iconIdx: 10, x: "40%", delay: 2.7, duration: 6.5, scale: 0.9 },
    { iconIdx: 6, x: "46%", delay: 1.1, duration: 9.2, scale: 0.85 },
    { iconIdx: 2, x: "52%", delay: 0.1, duration: 7.6, scale: 0.95 },
    { iconIdx: 3, x: "58%", delay: 2.4, duration: 8.2, scale: 1 },
    { iconIdx: 7, x: "64%", delay: 1.6, duration: 7.1, scale: 1.05 },
    { iconIdx: 8, x: "70%", delay: 0.5, duration: 8.8, scale: 0.9 },
    { iconIdx: 4, x: "76%", delay: 2.9, duration: 6.9, scale: 0.85 },
    { iconIdx: 9, x: "82%", delay: 1.2, duration: 7.8, scale: 0.95 },
    { iconIdx: 10, x: "88%", delay: 0.2, duration: 8.4, scale: 1 },
    { iconIdx: 0, x: "94%", delay: 2.0, duration: 7.4, scale: 0.9 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0c0a07]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#FFE22E]/10 blur-[130px]" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#f59e0b]/10 blur-[110px]" />

      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-[#FFE22E]/25"
            initial={{ scale: 0.7, opacity: 0.5 }}
            animate={animate ? { scale: [0.7, 1.8], opacity: [0.5, 0] } : undefined}
            transition={{ duration: 6, repeat: Infinity, delay: ring * 2, ease: "easeOut" }}
            style={{ width: `${ring * 240}px`, height: `${ring * 240}px` }}
          />
        ))}
      </div>

      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-[#FFE22E]/30"
          style={{ left: item.x }}
          initial={{ y: "105vh", opacity: 0 }}
          animate={
            animate
              ? {
                  y: ["105vh", "-15vh"],
                  rotate: [0, 20, -20, 0],
                  opacity: [0, 0.65, 0.65, 0],
                }
              : undefined
          }
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          <svg
            width={32 * item.scale}
            height={32 * item.scale}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {apparelIcons[item.iconIdx]}
          </svg>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(12,10,7,0.85)_100%)]" />
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

    if (!username.trim() || !password || (mode === "register" && !confirm)) {
      setError("Please fill in all fields.");
      return;
    }

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
     <Background animate={true} />
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
            <div className="relative">
              <label htmlFor="username" className="sr-only">Username</label>
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pl-10 pr-12`}
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
              <div className="relative">
                <label htmlFor="confirm" className="sr-only">Confirm password</label>
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`${inputClass} pl-10 pr-12`}
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
