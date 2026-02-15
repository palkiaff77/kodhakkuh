import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { memoryQuotes } from "@/data/quotes";
import StarfieldCanvas from "./StarfieldCanvas";

interface Scene3Props {
  onComplete: () => void;
}

const PHOTO_PATHS = Array.from({ length: 15 }, (_, i) => `/media/pictures/photo${i + 1}.jpg`);

const Scene3Cinema = ({ onComplete }: Scene3Props) => {
  const [seconds, setSeconds] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Audio refs
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const heartbeatRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Start background audio immediately
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.7; // soft volume
      bgAudioRef.current.play().catch((err) => console.log("BG audio play failed:", err));
    }

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s >= 30) {
          clearInterval(intervalRef.current);
          setFadeOut(true);
          setTimeout(onComplete, 2000);

          // Stop all audios at the end
          if (bgAudioRef.current) bgAudioRef.current.pause();
          if (heartbeatRef.current) heartbeatRef.current.pause();
          return 30;
        }

        // Switch to heartbeat at 25s
        if (s === 25 && heartbeatRef.current) {
          // Stop background audio
          if (bgAudioRef.current) bgAudioRef.current.pause();

          heartbeatRef.current.currentTime = 0;
          heartbeatRef.current.volume = 0.5; // start low
          heartbeatRef.current.play().catch((err) => console.log("Heartbeat play failed:", err));
        }

        // Gradually increase heartbeat volume (simulate rising intensity)
        if (s >= 25 && heartbeatRef.current) {
          heartbeatRef.current.volume = Math.min(1, 0.5 + 0.1 * (s - 25)); // 0.5 → 1 over 5s
        }

        return s + 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [onComplete]);

  // Cycle photos every 2 seconds
  useEffect(() => {
    const photoInterval = setInterval(() => {
      setCurrentPhoto((p) => (p + 1) % PHOTO_PATHS.length);
    }, 2000);
    return () => clearInterval(photoInterval);
  }, []);

  // Cycle quotes every 3 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((q) => (q + 1) % memoryQuotes.length);
    }, 3000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Intensity at 27s+
  useEffect(() => {
    if (seconds >= 27) setIntensity(2);
    if (seconds >= 29 && navigator.vibrate) navigator.vibrate(100);
  }, [seconds]);

  const visiblePhotos = [
    PHOTO_PATHS[currentPhoto % PHOTO_PATHS.length],
    PHOTO_PATHS[(currentPhoto + 1) % PHOTO_PATHS.length],
    PHOTO_PATHS[(currentPhoto + 2) % PHOTO_PATHS.length],
  ];

  return (
    <div className="fixed inset-0 cosmic-gradient overflow-hidden">
      {/* Starfield */}
      <StarfieldCanvas
        particleColor={seconds >= 27 ? "hsla(330, 70%, 65%, 0.9)" : "hsla(260, 50%, 70%, 0.6)"}
        speed={intensity}
        density={80 + seconds * 3}
      />

      {/* Background audio */}
      <audio ref={bgAudioRef} src="/media/audio/bg-music.mp3" preload="auto" loop />
      {/* Heartbeat audio */}
      <audio ref={heartbeatRef} src="/media/audio/heartbeat.mp3" preload="auto" loop />

      <AnimatePresence>
        {fadeOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-background z-50"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Subtle counter */}
        <motion.div className="absolute top-8 right-6 opacity-30">
          <span className="text-sm font-sans text-muted-foreground tabular-nums">{seconds}/30</span>
        </motion.div>

        {/* Photo panels */}
        <div className="relative w-full max-w-sm h-[60vh] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, i) => (
              <motion.div
                key={`${photo}-${currentPhoto}-${i}`}
                initial={{ opacity: 0, scale: 0.8, rotateY: 15, x: 50 * (i - 1) }}
                animate={{
                  opacity: i === 1 ? 1 : 0.5,
                  scale: i === 1 ? 1 : 0.85,
                  rotateY: (i - 1) * 8,
                  x: (i - 1) * 30,
                  z: i === 1 ? 10 : 0,
                }}
                exit={{ opacity: 0, scale: 0.7, x: -100 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  width: i === 1 ? "85%" : "70%",
                  height: i === 1 ? "80%" : "65%",
                  zIndex: i === 1 ? 10 : 5,
                }}
              >
                <div className="w-full h-full glass rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={photo}
                    alt={`Memory ${currentPhoto + i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Overlay quote */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-20 text-center text-lg font-serif italic text-foreground px-8 text-glow max-w-sm"
          >
            {memoryQuotes[currentQuote]}
          </motion.p>
        </AnimatePresence>

        {/* Heartbeat indicator at 29s */}
        {seconds >= 29 && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl animate-heartbeat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            💓
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Scene3Cinema;
