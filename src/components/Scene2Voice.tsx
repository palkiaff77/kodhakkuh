import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarfieldCanvas from "./StarfieldCanvas";

interface Scene2Props {
  onComplete: () => void;
}

const LOVE_PHRASES = ["i love you", "love you", "i love u", "love u", "i lov u", "i luv u", "i luv you", "luv you", "luv u"];

const Scene2Voice = ({ onComplete }: Scene2Props) => {
  const [listening, setListening] = useState(false);
  const [detected, setDetected] = useState(false);
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(Array(20).fill(0.1));
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // <-- audio ref

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        if (LOVE_PHRASES.some((p) => transcript.includes(p))) {
          handleDetected();
          return;
        }
      }
      // Update wave animation
      setWaveAmplitudes(Array(20).fill(0).map(() => Math.random() * 0.8 + 0.2));
    };

    recognition.onerror = () => {};
    recognition.onend = () => {
      if (!detected) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }, [detected]);

  const handleDetected = () => {
    setDetected(true);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (navigator.vibrate) navigator.vibrate(200);
    setTimeout(onComplete, 3000);
  };

  // Play audio when detected
  useEffect(() => {
    if (detected && audioRef.current) {
      audioRef.current.currentTime = 0; // start from beginning
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
    }
  }, [detected]);

  useEffect(() => {
    startListening();
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Animate wave when listening
  useEffect(() => {
    if (!listening || detected) return;
    const interval = setInterval(() => {
      setWaveAmplitudes(Array(20).fill(0).map(() => Math.random() * 0.4 + 0.1));
    }, 200);
    return () => clearInterval(interval);
  }, [listening, detected]);

  return (
    <div className="fixed inset-0 cosmic-gradient overflow-hidden">
      {/* Background starfield */}
      <StarfieldCanvas particleColor="hsla(330, 70%, 65%, 0.6)" />

      {/* Hidden audio */}
      <audio ref={audioRef} src="/media/audio/voice3.mp3" preload="auto" loop />

      <AnimatePresence>
        {detected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="fixed inset-0 z-5 bg-primary"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
        <AnimatePresence mode="wait">
          {!detected ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-8"
            >
              <motion.p className="text-xl font-serif text-foreground leading-relaxed max-w-sm text-glow">
                Say <span className="text-primary italic">'I love you'</span>… and I'll show you what my heart has been waiting to say.
              </motion.p>

              {/* Microphone */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-24 h-24 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
                <div className="relative w-16 h-16 rounded-full glass flex items-center justify-center text-3xl">
                  🎙️
                </div>
              </motion.div>

              {/* Sound Wave */}
              <div className="flex items-end gap-1 h-12">
                {waveAmplitudes.map((amp, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary/60 rounded-full"
                    animate={{ height: amp * 48 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>

              <motion.p className="text-xs text-muted-foreground">
                {listening ? "Listening…" : "Microphone not available"}
              </motion.p>

              {/* Skip button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
                onClick={onComplete}
                className="text-xs text-muted-foreground hover:text-foreground transition-all font-sans underline underline-offset-4"
              >
                Skip →
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="detected"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 3 }}
                className="text-6xl"
              >
                💞
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-serif text-foreground text-glow italic"
              >
                love you too di,Thangoo.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scene2Voice;
