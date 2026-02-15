import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Scene1Entry from "@/components/Scene1Entry";
import Scene2Voice from "@/components/Scene2Voice";
import Scene3Cinema from "@/components/Scene3Cinema";
import Scene4Video from "@/components/Scene4Video";
import Scene5Portal from "@/components/Scene5Portal";
import { useEasterEgg } from "@/hooks/useEasterEgg";

const Index = () => {
  // No state persistence — always starts at scene 1 on refresh
  const [scene, setScene] = useState(1);
  const { triggered, handleTap } = useEasterEgg();

  return (
    <div className="fixed inset-0 bg-background overflow-hidden" onClick={handleTap}>
      <AnimatePresence mode="wait">
        {scene === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Scene1Entry onComplete={() => setScene(2)} />
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Scene2Voice onComplete={() => setScene(3)} />
          </motion.div>
        )}
        {scene === 3 && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Scene3Cinema onComplete={() => setScene(4)} />
          </motion.div>
        )}
        {scene === 4 && (
          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Scene4Video onComplete={() => setScene(5)} />
          </motion.div>
        )}
        {scene === 5 && (
          <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Scene5Portal />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="text-center px-8"
            >
              <p className="text-3xl mb-4">✨</p>
              <p className="text-xl font-serif text-foreground text-glow italic leading-relaxed">
                Choosing you will always be my favorite decision di kannuhh.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
