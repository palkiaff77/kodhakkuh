import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loveLetters } from "@/data/loveLetters";

const LettersOrb = () => {
  const [letterIndex, setLetterIndex] = useState(() => Math.floor(Math.random() * loveLetters.length));
  const [animKey, setAnimKey] = useState(0);

  const nextLetter = () => {
    let next: number;
    do { next = Math.floor(Math.random() * loveLetters.length); } while (next === letterIndex && loveLetters.length > 1);
    setLetterIndex(next);
    setAnimKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-2xl font-serif text-foreground text-glow">💌 Letters From My Heart</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ opacity: 0, rotateX: -90, scaleY: 0.3 }}
          animate={{ opacity: 1, rotateX: 0, scaleY: 1 }}
          exit={{ opacity: 0, rotateX: 90, scaleY: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass rounded-2xl p-6 max-h-[50vh] overflow-y-auto"
          style={{ perspective: "1000px" }}
        >
          <p className="text-sm font-sans text-foreground/90 leading-relaxed whitespace-pre-line">
            {loveLetters[letterIndex]}
          </p>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={nextLetter}
        className="px-6 py-2.5 rounded-full glass text-sm font-sans text-foreground hover:box-glow transition-all"
      >
        Another letter 💕
      </motion.button>
    </div>
  );
};

export default LettersOrb;
