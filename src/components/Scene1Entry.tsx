import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimeTheme } from "@/hooks/useTimeTheme";
import StarfieldCanvas from "./StarfieldCanvas";

interface Scene1Props {
  onComplete: () => void;
}

const CORRECT_DATE = { day: 7, month: 1, year: 2026 };

const Scene1Entry = ({ onComplete }: Scene1Props) => {
  const theme = useTimeTheme();
  const [phase, setPhase] = useState<"intro" | "heart" | "datelock">("intro");
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [showShootingStar, setShowShootingStar] = useState(false);
  const introTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    introTimer.current = setTimeout(() => setPhase("heart"), 3000);
    return () => clearTimeout(introTimer.current);
  }, []);

  useEffect(() => {
    if (theme.is1111) {
      setShowShootingStar(true);
      setTimeout(() => setShowShootingStar(false), 3000);
    }
  }, [theme.is1111]);

  const handleHeartClick = () => {
    setPhase("datelock");
  };

  const handleSubmit = () => {
    if (day === CORRECT_DATE.day && month === CORRECT_DATE.month && year === CORRECT_DATE.year) {
      setSuccess(true);
      // Vibrate
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
      setTimeout(onComplete, 2000);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => { setShake(false); setError(false); }, 1500);
    }
  };

  const WheelPicker = ({ value, onChange, items, label }: { value: number; onChange: (v: number) => void; items: number[]; label: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const idx = items.indexOf(value);
      if (idx >= 0) {
        el.scrollTop = idx * 48;
      }
    }, []);

    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / 48);
      if (items[idx] !== undefined && items[idx] !== value) {
        onChange(items[idx]);
      }
    };

    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground font-sans uppercase tracking-widest">{label}</span>
        <div className="relative h-[144px] w-[70px] overflow-hidden rounded-xl glass">
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y border-primary/30 z-10 pointer-events-none" />
          <div
            ref={ref}
            className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
            onScroll={handleScroll}
            style={{ scrollSnapType: "y mandatory", paddingTop: 48, paddingBottom: 48 }}
          >
            {items.map((item) => (
              <div
                key={item}
                className={`h-12 flex items-center justify-center snap-center text-xl font-serif transition-all duration-200 ${
                  item === value ? "text-foreground scale-110 text-glow" : "text-muted-foreground/40 scale-90"
                }`}
                style={{ scrollSnapAlign: "center" }}
              >
                {String(item).padStart(label === "YYYY" ? 4 : 2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  return (
    <div className="fixed inset-0 cosmic-gradient overflow-hidden">
      <StarfieldCanvas particleColor={theme.particleColor} />

      {/* Shooting star for 11:11 */}
      <AnimatePresence>
        {showShootingStar && (
          <motion.div
            initial={{ x: -100, y: 50, opacity: 0 }}
            animate={{ x: window.innerWidth + 100, y: 300, opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="fixed z-20 w-2 h-2 bg-cosmic-gold rounded-full"
            style={{ boxShadow: "0 0 20px 10px hsla(40, 80%, 55%, 0.6), -30px 0 40px 5px hsla(40, 80%, 55%, 0.3)" }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center" onClick={e => e.stopPropagation()}>
        {/* Intro / Greeting */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-4 h-4 rounded-full bg-primary"
                style={{ boxShadow: "0 0 40px 20px hsla(330, 60%, 65%, 0.4)" }}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-xl font-serif text-foreground whitespace-pre-line"
              >
                {theme.greeting}
              </motion.p>
              {theme.is1111 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-sm text-cosmic-gold italic font-sans"
                >
                  Make a wish. I already did. ✨
                </motion.p>
              )}
            </motion.div>
          )}

          {phase === "heart" && (
            <motion.div
              key="heart"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
              className="flex flex-col items-center gap-6 cursor-pointer"
              onClick={handleHeartClick}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-7xl select-none"
                style={{ filter: "drop-shadow(0 0 20px hsla(330, 60%, 65%, 0.6))" }}
              >
                💖
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-serif text-foreground text-glow"
              >
                Touch my heart
              </motion.p>
            </motion.div>
          )}

          {phase === "datelock" && (
            <motion.div
              key="datelock"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base font-sans text-muted-foreground max-w-xs leading-relaxed"
              >
                Before I show you something…{"\n"}tell me when our story began.
              </motion.p>

              <motion.div
                className={`flex items-center gap-3 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
              >
                <style>{`
                  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
                  .scrollbar-hide::-webkit-scrollbar { display: none; }
                  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <WheelPicker value={day} onChange={setDay} items={days} label="DD" />
                <span className="text-2xl text-muted-foreground font-thin mt-5">•</span>
                <WheelPicker value={month} onChange={setMonth} items={months} label="MM" />
                <span className="text-2xl text-muted-foreground font-thin mt-5">•</span>
                <WheelPicker value={year} onChange={setYear} items={years} label="YYYY" />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className={`mt-4 px-8 py-3 rounded-full font-serif text-lg transition-all duration-500 ${
                  success
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground box-glow"
                    : "glass text-foreground hover:box-glow"
                }`}
              >
                {success ? "✨ ayyyy correctuhh…" : "Unlock"}
              </motion.button>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-primary/80 italic font-sans"
                  >
                    Ithu Thappu mendalluhh 🙄…
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scene1Entry;
