import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarfieldCanvas from "./StarfieldCanvas";

interface Scene4Props {
  onComplete: () => void;
}

const PROPOSAL_VIDEO = "/media/videos/proposal.mp4";

const Scene4Video = ({ onComplete }: Scene4Props) => {
  const [phase, setPhase] = useState<"playing" | "ring" | "done">("playing");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Start muted for autoplay, then unmute
    vid.muted = true;
    vid.volume = 1;
    vid.play().catch(() => {});

    const unmuteTimeout = setTimeout(() => {
      vid.muted = false; // unmute to hear audio
    }, 100);

    // Force end after 30s
    const forceEndTimeout = setTimeout(() => {
      handleVideoEnd();
    }, 30000);

    return () => {
      clearTimeout(unmuteTimeout);
      clearTimeout(forceEndTimeout);
    };
  }, []);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    setProgress(vid.currentTime / 30);

    // Show ring animation in last 5 seconds
    if (30 - vid.currentTime <= 5 && phase === "playing") {
      setPhase("ring");
    }
  };

  const handleVideoEnd = () => {
    setPhase("done");
    if (videoRef.current) videoRef.current.pause();
    setTimeout(onComplete, 500); // navigate to next scene
  };

  const handleSkip = () => {
    if (videoRef.current) videoRef.current.pause();
    onComplete();
  };

  return (
    <div className="fixed inset-0 cosmic-gradient overflow-hidden">
      <StarfieldCanvas particleColor="hsla(40, 80%, 55%, 0.5)" density={60} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div key="video" className="relative w-full max-w-lg">
          <video
            ref={videoRef}
            src={PROPOSAL_VIDEO}
            className="w-full rounded-2xl shadow-2xl"
            onTimeUpdate={handleTimeUpdate}
            playsInline
            controls={false}
          />

          {/* Progress bar */}
          <div className="mt-4 w-full h-1 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Skip during video */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            onClick={handleSkip}
            className="absolute top-4 right-4 text-xs text-foreground/70 font-sans bg-background/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
          >
            Skip →
          </motion.button>

          {/* Ring animation overlay */}
          <AnimatePresence>
            {phase === "ring" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.1, 1.2], rotate: 360 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-20 h-20 rounded-full border-4 border-secondary animate-spin-slow"
                  style={{
                    boxShadow:
                      "0 0 40px 15px hsla(40, 80%, 55%, 0.4), inset 0 0 20px 5px hsla(40, 80%, 55%, 0.3)",
                  }}
                />
                <span className="absolute text-4xl">💍</span>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-serif text-foreground text-glow-gold"
            >
              Now… turn around.
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Scene4Video;
