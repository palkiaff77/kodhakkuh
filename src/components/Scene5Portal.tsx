import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarfieldCanvas from "./StarfieldCanvas";
import LettersOrb from "./portal/LettersOrb";
import VoiceOrb from "./portal/VoiceOrb";
import HugOrb from "./portal/HugOrb";
import ChatOrb from "./portal/ChatOrb";
import { useTimeTheme } from "@/hooks/useTimeTheme";

type OrbType = null | "letters" | "voice" | "hug" | "chat";

const orbs = [
  { id: "letters" as const, emoji: "💌", label: "Letters From My Heart" },
  { id: "voice" as const, emoji: "🎧", label: "Hear My Voice" },
  { id: "hug" as const, emoji: "🌌", label: "Feel My Hug" },
  { id: "chat" as const, emoji: "💬", label: "Talk To Me" },
];

const Scene5Portal = () => {
  const [activeOrb, setActiveOrb] = useState<OrbType>(null);
  const theme = useTimeTheme();

  const timeMessage = (() => {
    switch (theme.timeOfDay) {
      case "morning": return "Good morning, future Mrs. Nivetha ☀️";
      case "afternoon": return "Did you eat properly? 🌸";
      case "night": return "Sleep peacefully. I'm right here. 🌙";
    }
  })();

  return (
    <div className="fixed inset-0 cosmic-gradient overflow-hidden">
      <StarfieldCanvas particleColor={theme.particleColor} density={80} speed={0.5} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <AnimatePresence mode="wait">
          {!activeOrb ? (
            <motion.div
              key="portal-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-sans text-muted-foreground"
              >
                {timeMessage}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-serif text-foreground leading-relaxed max-w-sm text-glow"
              >
                Whenever you miss me, Kodhakuhh…{"\n"}this place will always bring me back to you.
              </motion.h2>

              {/* 4 Orbs */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                {orbs.map((orb, i) => (
                  <motion.button
                    key={orb.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveOrb(orb.id)}
                    className="flex flex-col items-center gap-2 p-5 rounded-2xl glass box-glow group cursor-pointer"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="text-4xl"
                    >
                      {orb.emoji}
                    </motion.span>
                    <span className="text-xs font-sans text-foreground/80 group-hover:text-foreground transition-colors">
                      {orb.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`orb-${activeOrb}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
                onClick={() => setActiveOrb(null)}
                className="mb-6 text-sm text-muted-foreground font-sans hover:text-foreground transition-colors"
              >
                ← Back to portal
              </motion.button>

              {activeOrb === "letters" && <LettersOrb />}
              {activeOrb === "voice" && <VoiceOrb />}
              {activeOrb === "hug" && <HugOrb />}
              {activeOrb === "chat" && <ChatOrb />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scene5Portal;
