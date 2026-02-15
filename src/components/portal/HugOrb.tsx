import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HugOrb = () => {
  const [phase, setPhase] = useState<"start" | "counting" | "done">("start");
  const [count, setCount] = useState(5);

  const startHug = () => {
    setPhase("counting");
    setCount(5);
    if (navigator.vibrate) navigator.vibrate([100, 200, 100, 200, 100]);
  };

  useEffect(() => {
    if (phase !== "counting") return;
    if (count <= 0) {
      setPhase("done");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, count]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-2xl font-serif text-foreground text-glow">🌌 Feel My Hug</h3>

      <AnimatePresence mode="wait">
        {phase === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-sm font-sans text-foreground/80">Ready to feel something special?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startHug}
              className="px-8 py-3 rounded-full glass text-lg font-serif text-foreground box-glow-gold"
            >
              Hold me 🤗
            </motion.button>
          </motion.div>
        )}

        {phase === "counting" && (
          <motion.div
            key="counting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Golden warm glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-radial from-secondary/20 via-transparent to-transparent rounded-full"
              style={{ background: "radial-gradient(circle, hsla(40, 80%, 55%, 0.15) 0%, transparent 70%)" }}
            />
            
            <p className="text-lg font-serif text-foreground text-glow-gold">
              Close your eyes for {count} seconds, Yazhini.
            </p>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-5xl"
            >
              {count}
            </motion.div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              className="text-5xl"
            >
              💛
            </motion.span>
            <p className="text-xl font-serif text-foreground text-glow-gold italic">
              That was me holding you.
            </p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              onClick={() => setPhase("start")}
              className="text-xs text-muted-foreground font-sans underline underline-offset-4"
            >
              Again?
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HugOrb;
